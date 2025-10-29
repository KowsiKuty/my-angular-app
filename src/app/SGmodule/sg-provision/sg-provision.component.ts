import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from 'src/app/service/notification.service';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';



import * as moment from 'moment';

import { DatePipe, formatDate } from '@angular/common';


import {default as _rollupMoment, Moment} from 'moment';

import { MatDatepicker } from '@angular/material/datepicker';

export interface vendorname{
  id:string;
  name:string;
  code:string;
}
export interface branchlistss{
  id:number,
  name:string,
  code:string
}

export interface primeslistss{
  id:number,
  name:string,
  code:string
}

export interface statezonelist{
  id:number,
  name:string,
}
export interface vendorlistss {
  id:number,
  name:string,
  code:string
}
const moment1 = _rollupMoment || moment;

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

@Component({
  selector: 'app-sg-provision',
  templateUrl: './sg-provision.component.html',
  styleUrls: ['./sg-provision.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SgProvisionComponent implements OnInit {
  isLoading: boolean;

  constructor(private fb: FormBuilder,private toastr: ToastrService,private datepipe:DatePipe,private route:ActivatedRoute,
    private router:Router,private  sgservice:SGService,private shareservice:SGShareService,private SpinnerService: NgxSpinnerService,
    private shareService: SharedService,private notification:NotificationService) { }

    // branch dropdown
   @ViewChild('branchContactInput') branchContactInput:any;
   @ViewChild('branchContactInputguard') branchContactInputguard:any;
   @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;
   @ViewChild('branchtypeguard') matAutocompletebrachguard: MatAutocomplete;
 
   // Premise dropdown
   @ViewChild('PremiseContactInput') PremiseContactInput:any;
   @ViewChild('primestype') matAutocompletepremise: MatAutocomplete;

    // State dropdown
  @ViewChild('StateContactInput') StateContactInput:any;
  @ViewChild('producttype1') matAutocompletestate: MatAutocomplete;
 
  @ViewChild('vendorid') matvendoridAutocomplete: MatAutocomplete;
  @ViewChild('VendorContactInput') VendorContactInput: any;

  @ViewChild('checkersupplier') matsupAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  status_arr:any=[{id:1,value:"Pending"},{id:2,value:"Paid"}]

  sgprivisionform:FormGroup
  sgguardcountform:FormGroup
  agencyrepoform:FormGroup
  payment:boolean=true
  guardcount:boolean=false
  agencyreport:boolean=false
  vendorList:Array<any>=[];
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppresentpage:number=1;
  
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
    this.sgprivisionform.patchValue({
      monthdate:this.monthdate.value
    })
  
  }

  vendorlist: any
  branchSearchId:any;
  forbranch_Readonly = true

  ngOnInit() {
    this.sgprivisionform=this.fb.group({
      branch_id:[''],
      premise_id:[''],
      monthdate:[''],
      // state_id:[''],
      vendor_id:[''],
      status_type:['']
    })
    this.sgguardcountform=this.fb.group({
      guard_branch_id:[''],
      guard_premise_id:[''],
      guard_state_id:[''],
      guard_vendor_id:[''],
      
    })
    this.agencyrepoform=this.fb.group({
      agency_id:[''],
      vendor:''
    })
    this.sgservice.getvendorFilter(1,'').subscribe(data=>{
      this.vendorList=data['data'];
    });
    this.agencyrepoform.get('vendor').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.sgservice.getvendorFilter(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.vendorList=data['data'];
    });

  //branch default patch
  let prokeyvalue: String = "";
  this.getbranch()
{
    this.sgservice.getBranch(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        let total_length = this.branchlist.length
        console.log("lll",total_length)
        // for(let i=0;i<this.branchlist.length;i++){
          if(this.branchlist.length == 1){
            this.branchSearchId = this.branchlist[0].id
            this.sgprivisionform.patchValue({
              branch_id:this.branchlist[0]
            })
            this.forbranch_Readonly = true
            } else {
              this.forbranch_Readonly = false
            }
        // }
        
        
        this.getprisionsummary(this.branchSearchId,this.send_value,this.privipresentpage)
      })
  }



  }

  has_privinext:boolean=false;
  has_priviprevious:boolean=false;
  guardhas_privinext:boolean=false;
  agencyhas_privinext:boolean=false;
  guardhas_priviprevious:boolean=false;
  agencyhas_priviprevious:boolean=false;
  gencyhas_priviprevious:boolean=false;
  privipresentpage:number=1;
  agencypresentpageguard:number=1;
  privipresentpageguard:number=1;
  pagesizeprivi:number=10
  pagesizepriviguard:number=10
  pagesizeagency:number=10
  privision_list:any
  isProvisionPage: boolean = true
  isProvisionguardPage: boolean = true

  getprisionsummary(branchSearchId,val,pagenumber)
  {
    this.SpinnerService.show()
    this.sgservice.provision_summary(branchSearchId,val,pagenumber).subscribe((result)=>{
      this.SpinnerService.hide()
      let data=result['data'];
      this.privision_list=data
      let datapagination = result["pagination"];
      if (this.privision_list.length === 0) {
        this.isProvisionPage = false
      }
      if (this.privision_list.length > 0) {
        this.has_privinext = datapagination.has_next;
        this.has_priviprevious = datapagination.has_previous;
        this.privipresentpage= datapagination.index;
        this.isProvisionPage = true
      }
      this.send_value=""
    })
  }


  send_value:String=""
  hasNextSearch_Page:any=""
  onserach(){
    let form_value = this.sgprivisionform.value;

    if(form_value.branch_id != "")
    {
      if(this.branchSearchId){
        this.branchSearchId= this.sgprivisionform.value.branch_id.id
      }else {
        this.send_value=this.send_value+"&branch_id="+form_value.branch_id.id
      }
      
    }
    if(form_value.premise_id != "")
    {
      this.send_value=this.send_value+"&premise_id="+form_value.premise_id.id
    }
    if(form_value.monthdate != "")
    {
      let month=this.datepipe.transform(form_value.monthdate,"M");
      let year=this.datepipe.transform(form_value.monthdate,"yyyy")
      this.send_value=this.send_value+"&month="+month+"&year="+year
    }
    // if(form_value.state_id != "")
    // {
    //   this.send_value=this.send_value+"&state="+form_value.state_id.id
    // }
    if(form_value.vendor_id != "")
    {
      this.send_value=this.send_value+"&vendor_id="+form_value.vendor_id.id
    }
    if(form_value.status_type != "")
    {
      this.send_value=this.send_value+"&status="+form_value.status_type
    }
    this.hasNextSearch_Page = this.send_value
    this.privipresentpage=1
    this.getprisionsummary(this.branchSearchId, this.send_value,this.privipresentpage)
  }

  formreset()
  {
    this.send_value=""
    this.hasNextSearch_Page=""
    this.sgprivisionform=this.fb.group({
      branch_id:[''],
      premise_id:[''],
      monthdate:[''],
      // state_id:[''],
      vendor_id:[''],
      status_type:['']
    })
     //branch default patch
  let prokeyvalue: String = "";
  this.getbranch()
{
    this.sgservice.getBranch(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        // let total_length = this.branchlist.length
        // console.log("lll",total_length)
        // for(let i=0;i<this.branchlist.length;i++){
          if(this.branchlist.length == 1){
            this.branchSearchId = this.branchlist[0].id
            this.sgprivisionform.patchValue({
              branch_id:this.branchlist[0]
            })
            this.forbranch_Readonly = true;
            } else {
              this.forbranch_Readonly =  false;
            }
        // }
        // this.branchSearchId = this.branchlist[0].id
        // this.sgprivisionform.patchValue({
        //   branch_id:this.branchlist[0]
        // })
        this.privipresentpage=1
        this.getprisionsummary(this.branchSearchId,this.send_value,this.privipresentpage);
      })
  }
  // this.getprimes();
  // this.getcatven();
    
  }

  nextClickprivi()
  {
    if (this.has_privinext  === true) {
      this.getprisionsummary(this.branchSearchId,this.hasNextSearch_Page,this.privipresentpage + 1)
  
    }
  }

  previousClickprivi()
  {
    if (this.has_priviprevious === true) {
      this.getprisionsummary(this.branchSearchId,this.hasNextSearch_Page,this.privipresentpage - 1 )
  
    }
      }

      mothfind(month,year){
        return new Date(year,month-1)
        // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
      }




  sgReport(){
        // this.vendorSearchForm.value.to_date=this.datepipe.transform(this.vendorSearchForm.value.to_date, 'yyyy-MM-dd')
        // this.vendorSearchForm.value.from_date=this.datepipe.transform(this.vendorSearchForm.value.from_date, 'yyyy-MM-dd')
    let form_value = this.sgprivisionform.value;

    if(form_value.branch_id != "")
    {
      if(this.branchSearchId){
        this.branchSearchId= this.sgprivisionform.value.branch_id.id
      }else {
        this.send_value=this.send_value+"&branch_id="+form_value.branch_id.id
      }
      
    }
    if(form_value.premise_id != "")
    {
      this.send_value=this.send_value+"&premise_id="+form_value.premise_id.id
    }
    if(form_value.monthdate != "")
    {
      let month=this.datepipe.transform(form_value.monthdate,"M");
      let year=this.datepipe.transform(form_value.monthdate,"yyyy")
      this.send_value=this.send_value+"&month="+month+"&year="+year
    }
    
    if(form_value.vendor_id != "")
    {
      this.send_value=this.send_value+"&vendor_id="+form_value.vendor_id.id
    }
    if(form_value.status_type != "")
    {
      this.send_value=this.send_value+"&status="+form_value.status_type
    }
    this.hasNextSearch_Page = this.send_value
    let str = this.hasNextSearch_Page;
    var result = str.slice(1);
    console.log("response",result)
    // console.log(str.slice(1,0));
    // console.log("abcd",str.slice(1,0))
        this.sgservice.sg_report(result,this.branchSearchId)
        .subscribe(res => {
          if(res.type == 'application/json'){
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
            // this.SpinnerService.hide();
            this.send_value = ""
            return false;
          }
          let binaryData = [];
            binaryData.push(res)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'SGreport'+ date +".xlsx";
            link.click();
            this.send_value = ""
          // this.SpinnerService.hide();
      
        })
      
      }





  // branch

  
  branchlist:any
  isLoadingbranch=false


  brachname(){
    // let prokeyvalue: String = "";
    //   this.getbranch(prokeyvalue);
    //   this.sgprivisionform.get('branch_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoadingbranch = true;
    //       }),
    //       switchMap(value => this.sgservice.getBranch(value)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoadingbranch = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.branchlist= datas;
      

    //     })
    let a = this.branchContactInput.nativeElement.value
   this.sgservice.getBranch(a)
  //  .subscribe(x =>{
  //    console.log("dd value data", x)
  //  })
    .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })

  }
  getbranch()
  {
    this.sgservice.getBranch("")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaybranch(producttype?: branchlistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  }
  
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

  // primes
  
  
  primeslist:any
  isLoadingprimes=false

  primiesname(){
    // let prokeyvalue: String = "";
    //   this.getprimes(prokeyvalue);
    //   this.sgprivisionform.get('premise_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoadingprimes = true;
    //       }),
    //       switchMap(value => this.sgservice.getprimeslist(value)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoadingprimes = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.primeslist= datas;
         


    //     })
   let a = this.PremiseContactInput.nativeElement.value
   this.sgservice.getprimeslist(a)
  //  .subscribe(x =>{
  //    console.log("dd value data", x)
  //  })
    .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;
      })

  }
  getprimes()
  {
    this.sgservice.getprimeslist("")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;

      })
  }

  public displayprimes(producttype?: primeslistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
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
                 this.sgservice.getpremisedropdown(this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
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


  //  state

  
  dropdownstate:any
  statename(){
    
   
    this.sgservice.getStatezonesearch(this.StateContactInput.nativeElement.value,1).subscribe((results: any[]) => {
          let datas = results["data"];
          
          // for (let i = 0; i < datas.length; i++) {
          //   const Date = datas[i].effectivefrom
          //   let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          //   datas[i].name = datas[i].name + " (" + fromdate + ")"
          // }
          this.dropdownstate = datas;
          console.log(this.dropdownstate,'this.dropdownstate')

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
          datas[i].name = datas[i].name + " (" + fromdate + ")"
        }
        this.dropdownstate = datas;

      })
  }

  public displaydis1(producttype?: statezonelist): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype?.name ? producttype?.name : undefined;
    
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
             map(() => this.matAutocompletestate.panel.nativeElement.scrollTop),
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
                    //  for (let i = 0; i < datas.length; i++) {
                    //   const Date = datas[i].effectivefrom
                    //   let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                    //   datas[i].name = datas[i].name + " (" + fromdate + ")"
                    // }
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
 rejectRemarks: any
   getDataForReject(data){
        console.log(data.remarks)
        this.rejectRemarks = data.remarks

   }  
   
   
   vendorname(){
  //  let prokeyvalue: String = "";
  //  this.getcatven(prokeyvalue);
  //  this.sgprivisionform.get('vendor_id').valueChanges
  //  .pipe(
  //    debounceTime(100),
  //    distinctUntilChanged(),
  //    tap(() => {
  //      this.isLoading = true;
  //      console.log('inside tap')

  //    }),
  //    switchMap(value => this.sgservice.getvendordropdown(value, 1)
  //      .pipe(
  //        finalize(() => {
  //          this.isLoading = false
  //        }),
  //      )
  //    )
  //  )
  //  .subscribe((results: any[]) => {
  //    let datas = results["data"];
  //    this.vendorlist = datas;

  //  })
  let a = this.VendorContactInput.nativeElement.value
  this.sgservice.getvendordropdown(a, 1)
 //  .subscribe(x =>{
 //    console.log("dd value data", x)
 //  })
   .subscribe((results: any[]) => {
       let datas = results["data"];
       this.vendorlist = datas;

     })
  }

  getcatven()
   {
    //  let prokeyvalue = ""
     this.sgservice.getvendordropdown("",1)
       .subscribe((results: any[]) => {
         let datas = results["data"];
         this.vendorlist = datas;
 
       })
   }


   public displaydis(vendor?: vendorlistss): string | undefined {
        
    return vendor ? "("+vendor.code +") "+vendor.name : undefined;
    
  }


  currentpageven:any=1
  has_nextven:boolean=true
  has_previousven:boolean=true
  autocompleteVendornameScroll() {
    
    setTimeout(() => {
      if (
        this.matvendoridAutocomplete &&
        this.autocompleteTrigger &&
        this.matvendoridAutocomplete.panel
      ) {
        fromEvent(this.matvendoridAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matvendoridAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matvendoridAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matvendoridAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matvendoridAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextven === true) {
                this.sgservice.getvendordropdown(this.VendorContactInput.nativeElement.value, this.currentpageven + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.vendorlist = this.vendorlist.concat(datas);
                    if (this.vendorlist.length >= 0) {
                      this.has_nextven = datapagination.has_next;
                      this.has_previousven = datapagination.has_previous;
                      this.currentpageven = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  activeTab: string = 'Payment Report';
  switchtab(tab){
console.log(tab)
this.activeTab = tab;
if(tab==='Payment Report'){
  this.payment=true
  this.guardcount=false
  this.branchlist=[]
  this.primeslist=[]
  this.dropdownstate=[]
  this.vendorlist=[]
  this.currentpagebra=1
  this.currentpagepre=1
  this.currentpageven=1
  this.currentpageste=1
  this.formreset()
}
if(tab==='Guard Count'){
  this.payment=false
  this.guardcount=true
  this.branchlist=[]
  this.primeslist=[]
  this.dropdownstate=[]
  this.vendorlist=[]
  this.currentpagebra=1
  this.currentpagepre=1
  this.currentpageven=1
  this.currentpageste=1
  this.sgguardcountform.reset()
  this.sgguardsearch(1)
}
if(tab==='Agency report'){
  this.payment=false
  this.guardcount=false
  this.agencyreport=true
  this.sgagencyreportsummary()
  this.branchlist=[]
  this.primeslist=[]
  this.dropdownstate=[]
  this.vendorlist=[]
  this.currentpagebra=1
  this.currentpagepre=1
  this.currentpageven=1
  this.currentpageste=1
  
}

  }

getguardbranch(){
  
      this.sgservice.getguardcountBranch(this.branchContactInputguard.nativeElement.value)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
         
        })
    }
    autocompletebranchnameScrollguard() {
    
      setTimeout(() => {
        if (
          this.matAutocompletebrachguard &&
          this.autocompleteTrigger &&
          this.matAutocompletebrachguard.panel
        ) {
          fromEvent(this.matAutocompletebrachguard.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebrachguard.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(()=> {
              const scrollTop = this.matAutocompletebrachguard.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebrachguard.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebrachguard.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbra === true) {
                  this.sgservice.getguardBranchLoadMore(this.branchContactInputguard.nativeElement.value, this.currentpagebra+ 1)
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
    sgguardcountreset(){
      this.sgguardcountform.reset()
      this.sgguardsearch(1)
    }
     pagenumber: any;
    sgguardsearch(page){
            console.log('searchform',this.sgguardcountform.value)
        let params ={
          premise_id:this.sgguardcountform.get('guard_premise_id').value?.id,
          branch_id:this.sgguardcountform.get('guard_branch_id').value?.id,
          state_id:this.sgguardcountform.get('guard_state_id').value?.id,
          vendor_id:this.sgguardcountform.get('guard_vendor_id').value?.id

        }
      
        // let premise_id = this.sgguardcountform.get('guard_premise_id').value.id
        // premise_id ? params += '&premise_id=' + premise_id : ''
        // let branch_id = this.sgguardcountform.get('guard_branch_id').value.id
        // branch_id ? params += '&branch_id=' + branch_id : ''
        // let state_id = this.sgguardcountform.get('guard_state_id').value?.id
        // state_id ? params += '&state_id=' + state_id : ''
        //  let vendor_id = this.sgguardcountform.get('guard_vendor_id').value?.id
        //  vendor_id ? params += '&vendor_id=' + vendor_id : ''
   
      
      this.guardsummary(page,params)
    }
guardsummarylist=[]
agencysummarylist=[]
agencysummarylistdata=[]
guardsummary(pagenumber,data)
  {
   this.SpinnerService.show()
    this.sgservice.sgguardcountsummary(pagenumber,data).subscribe((result)=>{
      this.SpinnerService.hide()
      let data=result['data'];
      this.guardsummarylist=data
      let datapagination = result["pagination"];
      if (this.guardsummarylist.length === 0) {
        this.isProvisionguardPage = false
      }
      if (this.guardsummarylist.length > 0) {
        this.guardhas_privinext = datapagination.has_next;
        this.guardhas_priviprevious = datapagination.has_previous;
        this.privipresentpageguard= datapagination.index;
        this.isProvisionguardPage = true
      }
    })
  }
  nextClickpriviguard()
  {
    if (this.guardhas_privinext  === true) {
      this.sgguardsearch(this.privipresentpageguard + 1)
  
    }
  }


  previousClickpriviguard()
  {
    if (this.guardhas_priviprevious === true) {
      this.sgguardsearch(this.privipresentpageguard - 1 )
  
    }
      }
     sgguardcountreport(){
      let params ={
        premise_id:this.sgguardcountform.get('guard_premise_id').value?.id,
        branch_id:this.sgguardcountform.get('guard_branch_id').value?.id,
        state_id:this.sgguardcountform.get('guard_state_id').value?.id,
        vendor_id:this.sgguardcountform.get('guard_vendor_id').value?.id

      }
      this.sgservice.sg_guardcount_report(params)
      .subscribe(res => {
        let binaryData = [];
        binaryData.push(res)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'SG Guard Count '+ date +".xlsx";
        link.click();
      })
     }
     sgagencyreport(){
      let params ={
        premise_id:this.sgguardcountform.get('guard_premise_id').value?.id,
        branch_id:this.sgguardcountform.get('guard_branch_id').value?.id,
        state_id:this.sgguardcountform.get('guard_state_id').value?.id,
        vendor_id:this.sgguardcountform.get('guard_vendor_id').value?.id

      }
      this.sgservice.sg_agency_report(params)
      .subscribe(res => {
        let binaryData = [];
        binaryData.push(res)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'SG Agency Report '+ date +".xlsx";
        link.click();
      })
     }
     
  sgagencyreportsummary(){
  let params ={
    premise_id:this.sgguardcountform.get('guard_premise_id').value?.id,
    branch_id:this.sgguardcountform.get('guard_branch_id').value?.id,
    state_id:this.sgguardcountform.get('guard_state_id').value?.id,
    vendor_id:this.sgguardcountform.get('guard_vendor_id').value?.id,
    agencypresentpage:this.agencypresentpageguard

  }
  let agencypresentpage=this.agencypresentpageguard
  this.sgservice.sgagencyreportsummary(params,agencypresentpage)
  .subscribe(res => {
    this.SpinnerService.hide()
    let data=res['data'];
    console.log(data)
    this.agencysummarylistdata=data
    let datapagination = res["pagination"];
    if (this.agencysummarylistdata.length === 0) {
      this.isProvisionguardPage = false
    }
    if (this.agencysummarylistdata.length > 0) {
      this.agencyhas_privinext = datapagination.has_next;
      this.agencyhas_priviprevious = datapagination.has_previous;
      this.agencypresentpageguard= datapagination.index;
      this.isProvisionguardPage = true
    }

  })
  }
  public vendorinterface(data?:vendorname):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  autocompletesupname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matsupAutocomplete && this.autocompleteTrigger && this.matsupAutocomplete.panel){
        fromEvent(this.matsupAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matsupAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matsupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matsupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matsupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_supnext){
               
              this.sgservice.getvendorFilter(this.has_suppresentpage+1,this.agencyrepoform.get('vendor').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.vendorList=this.vendorList.concat(dear);
                 if(this.vendorList.length>0){
                   this.has_supnext=pagination.has_next;
                   this.has_supprevious=pagination.has_previous;
                   this.has_suppresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  searchdataapi(){
    this.SpinnerService.show()
    let params ={
      premise_id:this.sgguardcountform.get('guard_premise_id').value?.id,
      branch_id:this.sgguardcountform.get('guard_branch_id').value?.id,
      state_id:this.sgguardcountform.get('guard_state_id').value?.id,
      vendor_id:this.agencyrepoform.value.vendor?this.agencyrepoform.value.vendor.id:''
  
    }
    let agencypresentpage=this.agencypresentpageguard
    this.sgservice.sgagencyreportsummary(params,agencypresentpage).subscribe((data) => {
      if(data['code']!=undefined && data['code']!=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.agencysummarylistdata = data['data'];
      
      this.SpinnerService.hide()
      let pagination=data['pagination'];
      this.agencyhas_priviprevious=pagination.has_previous;
      this.agencyhas_privinext=pagination.has_next;
      this.agencypresentpageguard=pagination.index;
      this.SpinnerService.hide();
      console.log(data);
    }
    },
    (error)=>{
      this.SpinnerService.hide();
      this.toastr.warning(error.status+error.statusText)
    })
  }
  resetdata(){
    this.agencyrepoform.reset('');
    this.sgagencyreportsummary();
  }
  agencypreviousClick() {
    if (this.agencyhas_priviprevious === true) {
      this.agencypresentpageguard -=1;
      this.sgagencyreportsummary();
    }
  }
  agencynextClick() {
    if (this.agencyhas_privinext === true) {
      this.agencypresentpageguard +=1;
      this.sgagencyreportsummary();
    }
  }
}
