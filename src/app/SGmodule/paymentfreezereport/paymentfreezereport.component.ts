// import { classification } from './../../atma/vendor-summary/vendor-summary.component';
import { Component, OnInit, EventEmitter, ViewChild,Output } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';



import * as moment from 'moment';

import { DatePipe } from '@angular/common';


import {default as _rollupMoment, Moment} from 'moment';

import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, count, map, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { SGShareService } from '../share.service';
import { SGService } from '../SG.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from '../error-handling.service';

const moment1 = _rollupMoment || moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface branchlistss{
  id:number,
  name:string
  code:string
}

export interface primeslistss{
  id:number,
  name:string
  code:string
}
export interface productlistss{
  id:number,
  name:string,
  code:string
}


@Component({
  selector: 'app-paymentfreezereport',
  templateUrl: './paymentfreezereport.component.html',
  styleUrls: ['./paymentfreezereport.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PaymentfreezereportComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  isShowBackButton = false;
  isShowForm = true;
  isShowEditForm = false;
  premisesArray = [];
  Array = [];
  vendor_list:any
  isLoading = false

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('primestype') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premises;

    // Vendor dropdown
    @ViewChild('VendorContactInput') VendorContactInput:any;
    @ViewChild('producttype') matAutocompletevendor: MatAutocomplete;
  
  
    @ViewChild('VendorContactInput') clear_agency;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    datepicker.close();
    this.paymentfreeze.patchValue({
      monthdate:this.monthdate.value
    })
    
  }
  constructor(private fb: FormBuilder,private toastr: ToastrService,private datepipe:DatePipe,private router:Router,private SpinnerService: NgxSpinnerService,
    private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService, private errorHandler: ErrorHandlingService,) { }

  paymentfreeze:FormGroup
  ngOnInit(): void {
  
    this.paymentfreeze=this.fb.group({
      branch_id:[''],
      premise_id:[''],
      monthdate:[''],
      vendor_id:['']
    })
    let fromInvoice1 = this.shareservice.key1.value
    let data = this.shareservice.searchdata.value
    console.log("search",data)
    let agency = this.shareservice.agencyname.value
    if( fromInvoice1 == "System Bill"){
      this.ViewSummary=[]
      this.isShowBackButton = true;
      this.isShowForm = false;
      this.isShowEditForm = true;
      let monthYear = data.month + "-" + data.year
      let branch_Details ={
        "id":data.branch.id,
        "name":data.branch.name,
        "code":data.branch.code
      }
      let premise_Details ={
        "id":data.premise.id,
        "name":data.premise.name,
        "code":data.premise.code
      }
      let prokeyvalue: String = "";
      this.Array.push(agency.vendor_id)
      this.sgservice.getAgency(this.Array,prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.vendor_list = datas[0];

        let agency_Details ={
          "id":agency.vendor_id,
          "name":agency.securityagencename,
          "code":this.vendor_list.code
        }
        this.paymentfreeze.patchValue({
          "branch_id": branch_Details,
          "premise_id": premise_Details,
          "monthdate": monthYear,
          "vendor_id": agency_Details
        })
      })
     
      let list = { 
        "branch_id": data.branch.id,
        "premise_id": data.premise.id,
        "month": data.month,
        "year": data.year,
        "vendor_id": agency.vendor_id
       }
     
      this.sgservice.postMonthlydraft(list).subscribe((result)=>{
        let data=result
        console.log("name",data)
        this.daat=[]
        this.daat.push(data)
        if(this.daat[0]?.armed_miniwages_total !=null && this.daat[0]?.unarmed_miniwages_total != null){
          this.Totalbillamount=this.daat[0]?.armed_miniwages_total?.grand_total + this.daat[0]?.unarmed_miniwages_total?.grand_total
        }
        if(this.daat[0]?.armed_miniwages_total ==null && this.daat[0]?.unarmed_miniwages_total != null){
          this.Totalbillamount= 0 + this.daat[0]?.unarmed_miniwages_total?.grand_total
        }
        if(this.daat[0]?.armed_miniwages_total !=null && this.daat[0]?.unarmed_miniwages_total == null){
          this.Totalbillamount=this.daat[0]?.armed_miniwages_total?.grand_total + 0
        }
        if(this.daat[0]?.armed_miniwages_total ==null && this.daat[0]?.unarmed_miniwages_total == null){
          this.Totalbillamount= ''
        }

        if(this.daat[0]?.armed_miniwages_total != null){
          let armedallowancelist = this.daat[0]?.armed_miniwages_total.extra_allowance
          for (let j = 0; j < armedallowancelist.length; j++) {
            let amt_json = {
              "amount": armedallowancelist[j].charges
            }
            if(this.ViewSummary.length == 0){
              let first_item = {
                "name": armedallowancelist[j].name,
                "armedchargestotal": [
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
                this.ViewSummary[this.ViewSummary_index]["armedchargestotal"].push(amt_json)
              }else{
                let final_value ={
                  "name":armedallowancelist[j].name,
                  "armedchargestotal":[
                    amt_json
                  ]
                }
                this.ViewSummary.push(final_value)
              }
            }
          }
        }
      // }
      console.log("armed_miniwagestotal",this.ViewSummary)
  
  
  
      // for (let i = 0; i < this.securitylist.length; i++) {
        if(this.daat[0]?.unarmed_miniwages_total != null){
        let armedallowancelist = this.daat[0]?.unarmed_miniwages_total.extra_allowance
          for (let j = 0; j < armedallowancelist.length; j++) {
            let amt_json = {
              "amount": armedallowancelist[j].charges
            }
            if(this.ViewSummary.length == 0){
              let first_item = {
                "name": armedallowancelist[j].name,
                "unarmedchargestotal": [
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
                if(this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"] == undefined){
                this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"]=[amt_json]
                }else{
                  this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"].push(amt_json)
                }
              }else{
                let final_value ={
                  "name":armedallowancelist[j].name,
                  "unarmedchargestotal":[
                    amt_json
                  ]
                }
                this.ViewSummary.push(final_value)
              }
            }
          }
        }
      // }
      console.log("unarmed_miniwagestotal",this.ViewSummary)
  
        
      })
    } else {
      this.isShowBackButton = false;
      this.isShowForm = true;
      this.isShowEditForm = false;
    }
  }

  backToInvoiceView(){
    // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
    this.onCancel.emit();
  }

  systemgeneratedbill:any

  Armedcount:any=0
  Securitycount:any=0

  // async getsystembillgen(datas)
  // {

  //   if(this.paymentfreeze.value.branch_id==="")
  //   {
  //     this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
  //     return false
  //   }
  //   if(this.paymentfreeze.value.premise_id==="")
  //   {
  //     this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
  //     return false
  //   }
  //   if(this.paymentfreeze.value.monthdate==="")
  //   {
      
  //     this.toastr.warning('', 'Please Select the Year and Month', { timeOut: 1500 });
  //     return false
  //   }
    
  //   console.log("data",datas)
  //   let year=new Date(datas.monthdate).getFullYear();
  //   let month=new Date(datas.monthdate).getMonth()+1;

  //   let data1 = this.paymentfreeze.controls

  //   let obj =new systemlist()

  //   obj.branch_id=data1['branch_id'].value.id
  //   obj.premise_id=data1['premise_id'].value.id
  //   obj.month=month
  //   obj.year=year

  //   console.log("Obj",obj)
  //   await this.sgservice.getSystembillgen(obj).then((result)=>
  //   {
  //     let datas1=result['data']
      
  //     this.data=datas1
  //     if(this.data?.total_amount==undefined || this.data?.wages==undefined )
  //     {
  //       this.toastr.info("No data found")
  //       this.data={
  //         "total_amount": {
            
  //       },
  //       "wages": [
  //           {
                
  //               "data": {
                    
  //               },
                
  //           },
  //           {
                
  //               "data": {
                   
  //               },
               
  //           }
  //       ]
  //       }
  //     }
  //     console.log("datas",datas1)

  //   })
    
  //   let arr=this.data?.wages;

  //   for(let i=0;i<arr.length;i++)
  //   {
  //     if(arr[i]?.type==1)
  //     {
  //       this.Armedcount=arr[i]?.count
  //     }
  //     else if(arr[i]?.type==2)
  //     {
  //       this.Securitycount=arr[i].count
  //     }

  //   }

 
    
  

  // }

  typearmed=false
  typesecurity=false
  netamount=false

  data:any={
    "total_amount": {
      
  },
  "wages": [
      {
          
          "data": {
              
          },
          
      },
      {
          
          "data": {
             
          },
         
      }
  ]
  }




  formreset(){
  this.paymentfreeze=this.fb.group({
    branch_id:[''],
    premise_id:[''],
    monthdate:[''],
    vendor_id:['']
  })
 }
  
  
  daat=[]
  Totalbillamount:any
  ViewSummary=[];
  ViewSummary_index:any;

  montlyDraft(data)
  {
    this.ViewSummary = []
    this.SpinnerService.show()

    if(this.paymentfreeze.value.branch_id==="")
    {
      this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false
    }
    if(this.paymentfreeze.value.premise_id==="")
    {
      this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false
    }
    if(this.paymentfreeze.value.vendor_id==="")
    {
      
      this.toastr.warning('', 'Please Select the Agency', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false
    }
    if(this.paymentfreeze.value.monthdate==="")
    {
      
      this.toastr.warning('', 'Please Select the Year and Month', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false
    }
    
    console.log("data",data)
    let year=new Date(data.monthdate).getFullYear();
    let month=new Date(data.monthdate).getMonth()+1;

    let data1 = this.paymentfreeze.controls

    let obj =new systemlist()

    obj.branch_id=data1['branch_id'].value.id
    obj.premise_id=data1['premise_id'].value.id
    obj.vendor_id=data1['vendor_id'].value.id
    obj.month=month
    obj.year=year

    console.log("Obj",obj)
    this.sgservice.postMonthlydraft(obj).subscribe((result)=>{
      if(result.length == 0){
        this.daat=[];
        this.SpinnerService.hide();
      }
      if(result.incidents_data){
      let data=result
      console.log("name",data)
      this.daat=[]
      this.daat.push(data)
      if(this.daat[0]?.armed_miniwages_total !=null && this.daat[0]?.unarmed_miniwages_total != null){
        this.Totalbillamount=this.daat[0]?.armed_miniwages_total?.grand_total + this.daat[0]?.unarmed_miniwages_total?.grand_total
      }
      if(this.daat[0]?.armed_miniwages_total ==null && this.daat[0]?.unarmed_miniwages_total != null){
        this.Totalbillamount= 0 + this.daat[0]?.unarmed_miniwages_total?.grand_total
      }
      if(this.daat[0]?.armed_miniwages_total !=null && this.daat[0]?.unarmed_miniwages_total == null){
        this.Totalbillamount=this.daat[0]?.armed_miniwages_total?.grand_total + 0
      }
      if(this.daat[0]?.armed_miniwages_total ==null && this.daat[0]?.unarmed_miniwages_total == null){
        this.Totalbillamount= ''
      }

      if(this.daat[0]?.armed_miniwages_total != null){
        let armedallowancelist = this.daat[0]?.armed_miniwages_total.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if(this.ViewSummary.length == 0){
            let first_item = {
              "name": armedallowancelist[j].name,
              "armedchargestotal": [
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
              this.ViewSummary[this.ViewSummary_index]["armedchargestotal"].push(amt_json)
            }else{
              let final_value ={
                "name":armedallowancelist[j].name,
                "armedchargestotal":[
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }
    // }
    console.log("armed_miniwagestotal",this.ViewSummary)



    // for (let i = 0; i < this.securitylist.length; i++) {
      if(this.daat[0]?.unarmed_miniwages_total != null){
      let armedallowancelist = this.daat[0]?.unarmed_miniwages_total.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if(this.ViewSummary.length == 0){
            let first_item = {
              "name": armedallowancelist[j].name,
              "unarmedchargestotal": [
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
              if(this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"] == undefined){
              this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"]=[amt_json]
              }else{
                this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"].push(amt_json)
              }
            }else{
              let final_value ={
                "name":armedallowancelist[j].name,
                "unarmedchargestotal":[
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }
    // }
    console.log("unarmed_miniwagestotal",this.ViewSummary)
      this.SpinnerService.hide();
    }

      
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
    
    
  }

  // Attdance screen dropdowns

  // branch value

  branchlist:any
  isLoadingbranch=false

  brachname(){
    let prokeyvalue: String = "";
      this.getbranch(prokeyvalue);
      this.paymentfreeze.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoadingbranch = true;
          }),
          switchMap(value => this.sgservice.getBranch(value)
            .pipe(
              finalize(() => {
                this.isLoadingbranch = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist= datas;
          console.log("product", datas)

        })

  }
  private getbranch(prokeyvalue)
  {
    this.sgservice.getBranch(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaybranch(producttype?: branchlistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype ? "("+producttype.code +") "+producttype.name : undefined;
    
  }


  premise_list: any;
  agencyArray = [];
  branchFocusOut(data) {
    this.premisesArray=[];
    this.premise_list = data.premise;
    for (let i = 0; i < this.premise_list.length; i++) {
        let premise_id = this.premise_list[i].id
        this.premisesArray.push(premise_id)
    }
    console.log("premisesArray",this.premisesArray )

    this.getprimes(this.premisesArray, '')
  }

  premiseFocusOut(data){
    this.agencyArray=[];
    let premiseId = data.id;
     //agency array
    for(let i = 0; i < this.premise_list.length; i++){
      if(premiseId == this.premise_list[i].id){
        this.agencyArray = this.premise_list[i].vendor
      }

    }
    console.log("agencyArray",this.agencyArray )
    this.get_agency(this.agencyArray, '')

  }

  clearPremisesAndAgency() {
    this.clear_premises.nativeElement.value = '';
    this.clear_agency.nativeElement.value = '';

  }



  // primes

  
  primeslist:any
  isLoadingprimes=false


  primiesname(){
    let prokeyvalue: String = "";
      this.getprimes(this.premisesArray,prokeyvalue);
      this.paymentfreeze.get('premise_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoadingprimes = true;
          }),
          switchMap(value => this.sgservice.getpremises(this.premisesArray,value,1)
            .pipe(
              finalize(() => {
                this.isLoadingprimes = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.primeslist= datas;
          console.log("product", datas)

        })

  }
  private getprimes(premisesArray,prokeyvalue)
  {
    this.sgservice.getpremises(premisesArray,prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;

      })
  }

  public displayprimes(producttype?: primeslistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype ? "("+producttype.code +") "+producttype.name : undefined;
    
  }


  
// vendor
empvendorlist:any
vendorname(){
  
  let prokeyvalue: String = "";
    this.get_agency(this.agencyArray,prokeyvalue);
    this.paymentfreeze.get('vendor_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getAgency(this.agencyArray,value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })

}
private get_agency(agencyArray,prokeyvalue)
{
  this.sgservice.getAgency(agencyArray,prokeyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.empvendorlist = datas;

    })
}

public displayvendor(producttype?: productlistss): string | undefined {
  // return producttype ? producttype.name : undefined;
  return producttype ? "("+producttype.code +") "+producttype.name : undefined;
  
}


   // Branch  dropdown

   currentpagebra:any=1
   has_nextbra:boolean=true
   has_previousbra:boolean=true
   autocompletebranchnameScroll() {
     
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
                 this.sgservice.getBranchLoadMore(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     this.branchlist = this.branchlist.concat(datas);
                     if (this.branchlist.length >= 0) {
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
 
   // Premies dropdown
   currentpagepre:any=1
   has_nextpre:boolean=true
   has_previouspre:boolean=true
   autocompletePremisenameScroll() {
     
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
                 this.sgservice.getpremises(this.premisesArray,this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     this.primeslist = this.primeslist.concat(datas);
                     if (this.primeslist.length >= 0) {
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
 

}

class systemlist{
  premise_id:number
  branch_id:number
  vendor_id:number
  month:number
  year:number
}
