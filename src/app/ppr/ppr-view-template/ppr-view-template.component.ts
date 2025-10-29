import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';

export interface ppr_view {
  id: number
  name: string
}

@Component({
  selector: 'app-ppr-view-template',
  templateUrl: './ppr-view-template.component.html',
  styleUrls: ['./ppr-view-template.component.scss']
})
export class PprViewTemplateComponent implements OnInit {
  @ViewChild('businessInput') businessInput:any
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  // bsccAutoComplete 
  @ViewChild('bsccAutoComplete') bsccAutoComplete: MatAutocomplete;
  @ViewChild('bsccInput') bsccInput: any;
  // bs
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bsAutoComplete') bsAutoComplete:MatAutocomplete;
  // cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('ccAutoComplete') ccAutoComplete:MatAutocomplete;
  
  // cc
  @ViewChild('pprnameInput') pprnameInput: any;
  @ViewChild('nameAutoComplete') nameAutoComplete:MatAutocomplete;

  // bsccAutoComplete 
  @ViewChild('bsccentryAutoComplete') bsccentryAutoComplete: MatAutocomplete;
  @ViewChild('bsccentryInput') bsccentryInput: any;
  // bs
  @ViewChild('bsentryInput') bsentryInput: any;
  @ViewChild('bsentryAutoComplete') bsentryAutoComplete:MatAutocomplete;
  // cc
  @ViewChild('ccentryInput') ccentryInput: any;
  @ViewChild('ccentryAutoComplete') ccentryAutoComplete:MatAutocomplete;

  ppr_view:FormGroup;
  pprentry:FormGroup;
  Bscode: any;
  isLoading: boolean;
  has_nextval: boolean;
  has_previousval: boolean;
  currentpagenum: number;
  cccode: any;
  Bscccode: any;
  summaryview: any;
  has_next: boolean;
  currentpage: any;
  presentpage: number;
  has_previous: any;
  identificationSize:number=10
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public businesschip: ppr_view[] = [];
  businessname=[]
  Bscc: any;
  Bs_entry: any;
  cc_entry: any;
  viewtem: boolean;
  view_edit: Number;
  pprname: any;
  viewid: any;
  constructor(private dataService:PprService,private formBuilder:FormBuilder,private message:ToastrService,private SpinnerService: NgxSpinnerService,private errorHandler:ErrorhandlingService) { }

  ngOnInit(): void {
    this.ppr_view=this.formBuilder.group({
      bscc:[''],
      bs:[''],
      cc:[''],
      ppr_name:['']
    })
    this.pprentry=this.formBuilder.group({
      bsccentry:[''],
      ccentry:[''],
      bsentry:[''],
      viewname:['']
    })
    this.searchpprview()
  }
  create(val){
    this.view_edit=val
  }
  public displaybsccppr(bsccocde_level?: ppr_view): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  private getasset_Bscode(keyvalue) {
    this.dataService.getbusinessdropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscccode = datas;
        
        console.log("main=>",this.Bscode)
      })
  }

  bsccDropdown() {
    let keyvalue: String = "";
    this.getasset_Bscode(keyvalue);
    this.ppr_view.get('bscc').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(1,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscccode = datas;
        console.log("value")
        
      })
  }
  bsccscroll(){
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.bsccAutoComplete &&
        this.autocompleteTrigger &&
        this.bsccAutoComplete.panel
      ) {
        fromEvent(this.bsccAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bsccAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bsccAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bsccAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bsccAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getbusinessdropdown(1,this.bsccInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.Bscccode = this.Bscccode.concat(datas);
                    if (this.Bscccode.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  displaybsfrom(BSName:ppr_view): string | undefined{
    return BSName ? BSName.name : undefined;
  }
  private get_Bs(keyvalue) {
    this.dataService.get_bs_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscode = datas;
      })
  }
  bsDropdown(){
    let keyvalue: String = "";
    this.get_Bs(keyvalue);
    this.ppr_view.get('bs').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_bs_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscode = datas;
      })
  }
  bsscroll(){
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
     console.log("scroll")
     setTimeout(() => {
       if (
         this.bsAutoComplete &&
         this.autocompleteTrigger &&
         this.bsAutoComplete.panel
       ) {
         fromEvent(this.bsAutoComplete.panel.nativeElement, 'scroll')
           .pipe(
             map(x => this.bsAutoComplete.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = this.bsAutoComplete.panel.nativeElement.scrollTop;
             const scrollHeight = this.bsAutoComplete.panel.nativeElement.scrollHeight;
             const elementHeight = this.bsAutoComplete.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextval === true) {
                 console.log("true")
                 this.dataService.get_bs_dropdown(1,this.bsInput.nativeElement.value, this.currentpagenum+1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     console.log("loop",this.currentpagenum)
                     this.Bscode = this.Bscode.concat(datas);
                     if (this.Bscode.length >= 0) {
                       this.has_nextval = datapagination.has_next;
                       this.has_previousval = datapagination.has_previous;
                       this.currentpagenum = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
 }
 ccDropdown(){
  let keyvalue: String = "";
  this.get_cc(keyvalue);
  this.ppr_view.get('cc').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_cc_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.cccode = datas;
      console.log("value")
      
    })
}
private get_cc(keyvalue) {
  this.dataService.get_cc_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.cccode = datas;
      
      console.log("main=>",this.cccode)
    })
}
displaycc(ccname:ppr_view):string |undefined{
  return ccname?ccname.name :undefined
}
ccscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.ccAutoComplete &&
       this.autocompleteTrigger &&
       this.ccAutoComplete.panel
     ) {
       fromEvent(this.ccAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.ccAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.ccAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.ccAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.ccAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_cc_dropdown(1,this.ccInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.cccode = this.cccode.concat(datas);
                   if (this.cccode.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}

namedropdown(){
  let keyvalue: String = "";
  this.get_name(keyvalue);
  this.ppr_view.get('ppr_name').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_name_dropdown(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.pprname = datas;
      console.log("value")
      
    })
}
private get_name(keyvalue) {
  this.dataService.get_name_dropdown(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.pprname = datas;
      
      console.log("main=>",this.pprname)
    })
}
displayname(pprname:ppr_view):string |undefined{
  return pprname?pprname.name :undefined
}
namescroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.nameAutoComplete &&
       this.autocompleteTrigger &&
       this.nameAutoComplete.panel
     ) {
       fromEvent(this.nameAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.nameAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.nameAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.nameAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.nameAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_name_dropdown(this.pprnameInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.pprname = this.pprname.concat(datas);
                   if (this.pprname.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}
searchpprview(pagenumber=1,page=10){
  if(this.ppr_view.value.ppr_name==''|| this.ppr_view.value.ppr_name==undefined || this.ppr_view.value.ppr_name==null){
    this.ppr_view.value.name=''
  }else{
    console.log("this.ppr_view.value.ppr_name",this.ppr_view.value.ppr_name)
    this.ppr_view.value.name=this.ppr_view.value.ppr_name.name
  }
  if(this.ppr_view.value.bs==''|| this.ppr_view.value.bs==undefined || this.ppr_view.value.bs==null){
    this.ppr_view.value.bs_id=''
  }else{
    this.ppr_view.value.bs_id=this.ppr_view.value.bs.id
  }
  if(this.ppr_view.value.cc==''|| this.ppr_view.value.cc==undefined || this.ppr_view.value.cc==null){
    this.ppr_view.value.cc_id=''
  }else{
    this.ppr_view.value.cc_id=this.ppr_view.value.cc.id
  }
  if(this.ppr_view.value.bscc==''|| this.ppr_view.value.bscc==undefined || this.ppr_view.value.bscc==null){
    this.ppr_view.value.bscc_id=''
  }else{
    this.ppr_view.value.bscc_id=this.ppr_view.value.bscc.id
  }
  let pprsummary={
    "bs_id":this.ppr_view.value.bs_id,
    "cc_id":this.ppr_view.value.cc_id,
    "core_bscc":this.ppr_view.value.bscc_id,
    "query":this.ppr_view.value.name
  }
  this.SpinnerService.show()
  this.dataService.summaryview(pprsummary,pagenumber,page).subscribe((results)=>{
    this.SpinnerService.hide()
    console.log("results",results)
    let data=results['data']
    let dataPagination = results['pagination'];

    // let data=results
    this.summaryview=data
    if(this.summaryview.length!=0){
      this.has_next = dataPagination.has_next;
      this.has_previous = dataPagination.has_previous;
      this.presentpage = dataPagination.index;
      
    }
  },error=>{
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
nextClick() {
  if (this.has_next === true) {
       
      this.currentpage = this.presentpage + 1
      this.searchpprview(this.presentpage + 1, 10)
    }
 
  }

previousClick() {
  if (this.has_previous === true) {
    
    this.currentpage = this.presentpage - 1
    this.searchpprview(this.presentpage - 1, 10)
  }
}
searchpprviewclear(){
  this.ppr_view.controls['bs'].reset('')
  this.ppr_view.controls['cc'].reset('')
  this.ppr_view.controls['bscc'].reset('')
  this.ppr_view.controls['ppr_name'].reset('')
  
}



// Entry PPR View Template

public bsccentrydisplay(bsccocde_level?: ppr_view): string | undefined {
  return bsccocde_level ? bsccocde_level.name : undefined;
}
private getassetentry_Bscode(keyvalue) {
  this.dataService.getbusinessdropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bscc = datas;
      
      console.log("main=>",this.Bscode)
    })
}

bsccentryDropdown() {
  let keyvalue: String = "";
  this.getassetentry_Bscode(keyvalue);
  this.pprentry.get('bsccentry').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.getbusinessdropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bscc = datas;
      console.log("value")
      
    })
}
bsccrntryscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
  setTimeout(() => {
    if (
      this.bsccentryAutoComplete &&
      this.autocompleteTrigger &&
      this.bsccentryAutoComplete.panel
    ) {
      fromEvent(this.bsccentryAutoComplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.bsccentryAutoComplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.bsccentryAutoComplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.bsccentryAutoComplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.bsccentryAutoComplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextval === true) {
              console.log("true")
              this.dataService.getbusinessdropdown(1,this.bsccentryInput.nativeElement.value, this.currentpagenum+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  console.log("loop",this.currentpagenum)
                  this.Bscc = this.Bscc.concat(datas);
                  if (this.Bscc.length >= 0) {
                    this.has_nextval = datapagination.has_next;
                    this.has_previousval = datapagination.has_previous;
                    this.currentpagenum = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

public removedbusiness(business:ppr_view):void{
  const index = this.businesschip.indexOf(business);
    if (index >= 0) {
      this.businesschip.splice(index, 1);
      this.businessname.splice(index, 1);

      this.businessInput.nativeElement.value = '';
    }
}

public businessSelected(event: MatAutocompleteSelectedEvent): void {

  this.selectbusinessByName(event.option.value.name);
  this.businessInput.nativeElement.value = '';

}
selectbusinessByName(business){
  let foundbusiness1 = this.businesschip.filter(b => b.name == business);
    if (foundbusiness1.length) {
      return;
    }
    let foundbusiness = this.Bscc.filter(b => b.name == business);
    if (foundbusiness.length) {
      this.businesschip.push(foundbusiness[0]);
      this.businessname.push(foundbusiness[0].name)
    }
}
displaybsentry(BSName:ppr_view): string | undefined{
  return BSName ? BSName.name : undefined;
}
private get_Bsentry(keyvalue) {
  this.dataService.get_bs_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bs_entry = datas;
    })
}
bsentryDropdown(){
  let keyvalue: String = "";
  this.get_Bsentry(keyvalue);
  this.pprentry.get('bsentry').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_bs_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bs_entry = datas;
    })
}
bsentryscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.bsentryAutoComplete &&
       this.autocompleteTrigger &&
       this.bsentryAutoComplete.panel
     ) {
       fromEvent(this.bsentryAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.bsentryAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.bsentryAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.bsentryAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.bsentryAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_bs_dropdown(1,this.bsentryInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.Bs_entry = this.Bs_entry.concat(datas);
                   if (this.Bs_entry.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}

ccentryDropdown(){
  let keyvalue: String = "";
  this.get_ccentry(keyvalue);
  this.pprentry.get('ccentry').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_cc_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.cc_entry = datas;
      console.log("value")
      
    })
}
private get_ccentry(keyvalue) {
  this.dataService.get_cc_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.cc_entry = datas;
      
      console.log("main=>",this.cc_entry)
    })
}
displayccentry(ccname:ppr_view):string |undefined{
  return ccname?ccname.name :undefined
}
ccentryscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.ccentryAutoComplete &&
       this.autocompleteTrigger &&
       this.ccentryAutoComplete.panel
     ) {
       fromEvent(this.ccentryAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.ccentryAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.ccentryAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.ccentryAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.ccentryAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_cc_dropdown(1,this.ccentryInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.cc_entry = this.cc_entry.concat(datas);
                   if (this.cc_entry.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}
@ViewChild('closepop') closepop:any
pprtem_entry(pprviewdata){
  if(pprviewdata.viewname=="" || pprviewdata.viewname==undefined || pprviewdata.viewname==null){
    this.message.warning("Please Enter The Name")
    return false;
    pprviewdata.view_name=''
  }else{
    console.log("pprviewdata.viewname=>",pprviewdata.viewname)
    pprviewdata.view_name=pprviewdata.viewname
  }
  if(pprviewdata.bsccentry=="" || pprviewdata.bsccentry==undefined || pprviewdata.bsccentry==null){
    pprviewdata.bscc_entry=''
  }else{
    pprviewdata.bscc_entry=pprviewdata.bsccentry.id
  }
  if(pprviewdata.bsentry=="" || pprviewdata.bsentry==undefined || pprviewdata.bsentry==null){
    pprviewdata.bs_entry=''
  }else{
    pprviewdata.bs_entry=pprviewdata.bsentry.id
  }
  if(pprviewdata.ccentry=="" || pprviewdata.ccentry==undefined || pprviewdata.ccentry==null){
    pprviewdata.cc_entry=''
  }else{
    pprviewdata.cc_entry=pprviewdata.ccentry.id
  }
  let entrydata
  console.log("view_edit=>",this.view_edit)
  if(this.view_edit==2){
  console.log("if=>",this.view_edit)

    entrydata={
      "corebs_id": pprviewdata.bscc_entry,
      "bs_id": pprviewdata.bs_entry,
      "cc_id": pprviewdata.cc_entry,
      "name":pprviewdata.view_name,
      "id":this.viewid
    }
  }else{
  console.log("else=>",this.view_edit)
    
    entrydata={
      "corebs_id": pprviewdata.bscc_entry,
      "bs_id": pprviewdata.bs_entry,
      "cc_id": pprviewdata.cc_entry,
      "name":pprviewdata.view_name
    }
  }
  console.log("entrydata=>",entrydata)
 
  this.SpinnerService.show()
  this.dataService.pprtem_entry(entrydata).subscribe((result)=>{
    this.SpinnerService.hide()
    console.log("result=>",result)
    if(result){
      
      if(result?.code){
        this.message.warning(result.code,'',{timeOut:1500})
      }if(result?.set_code){
        this.closepop.nativeElement.click();
        this.pprentry.get('bsccentry').reset('')
        this.pprentry.get('bsentry').reset('')
        this.pprentry.get('ccentry').reset('')
        this.pprentry.get('viewname').reset('')
        this.message.success(result.set_code,'',{timeOut:1500})
        this.searchpprview()
      }
      
    }
  }, error => {
    this.closepop.nativeElement.click();
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })

}
closepop_ppr(){
  this.pprentry.get('bsccentry').reset('')
  this.pprentry.get('bsentry').reset('')
  this.pprentry.get('ccentry').reset('')
  this.pprentry.get('viewname').reset('')
}
view_tem(id,summary,identy){
  this.viewtem=false
  this.view_edit=identy
  this.viewid=id
  this.SpinnerService.show()
  this.dataService.viewtemplate(id).subscribe((result)=>{
    this.SpinnerService.hide()
    let data=result
    this.pprentry.patchValue({
      bsccentry:data['corebs'],
      bsentry:data['bs_data'],
      ccentry:data['cc_data'],
      viewname:data['name']
    })
  }, error => {
    this.closepop.nativeElement.click();
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
status(summary){
  let summaryid=summary.id
  let summarystatus=summary.status
  this.SpinnerService.show()
  let status
  if(summarystatus==1){
    status=0
  }else{
    status=1
  }
  this.dataService.temviewdelete(summaryid,status).subscribe((result)=>{
    this.SpinnerService.hide()
    if(result){
      if(result.set_message){
        this.message.warning('',result.set_message,{timeOut:1500})
      }
      if(result.message){
        this.searchpprview()
        this.message.success('',result.message,{timeOut:1500})
      }
    }
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
}
