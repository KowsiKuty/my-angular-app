import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PprService } from '../ppr.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorhandlingService } from '../errorhandling.service';
import { ToastrService } from 'ngx-toastr';
import { I } from '@angular/cdk/keycodes';
export interface expense {
  id: number
  name: string
  head:string
}
@Component({
  selector: 'app-expense-gl-mapping',
  templateUrl: './expense-gl-mapping.component.html',
  styleUrls: ['./expense-gl-mapping.component.scss']
})
export class ExpenseGlMappingComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('expgrp_input') expgrp_input: any;
  @ViewChild('exp_grpauto') exp_grpauto:MatAutocomplete;
  @ViewChild('expgrp_summary_input') expgrp_summary_input: any;
  @ViewChild('exp_grp_summary_auto') exp_grp_summary_auto:MatAutocomplete;
  @ViewChild('exphead_input') exphead_input: any;
  @ViewChild('exp_headauto') exp_headauto:MatAutocomplete;
  @ViewChild('exphead_input1') exphead_input1: any;
  @ViewChild('exp_headauto1') exp_headauto1:MatAutocomplete;
  @ViewChild('exphead_summary_input') exphead_summary_input: any;
  @ViewChild('exp_head_summary_auto') exp_head_summary_auto:MatAutocomplete;
  @ViewChild('expcat_input') expcat_input: any;
  @ViewChild('exp_catauto') exp_catauto:MatAutocomplete;
  @ViewChild('expcat_input1') expcat_input1: any;
  @ViewChild('exp_catauto1') exp_catauto1:MatAutocomplete;
  @ViewChild('expcat_summary_input') expcat_summary_input: any;
  @ViewChild('exp_cat_summary_auto') exp_cat_summary_auto:MatAutocomplete;
  @ViewChild('subcat_input') subcat_input: any;
  @ViewChild('sub_catauto') sub_catauto:MatAutocomplete;
  @ViewChild('subcat_summary_input') subcat_summary_input: any;
  @ViewChild('sub_cat_summary_auto') sub_cat_summary_auto:MatAutocomplete;
  expence_mapping:FormGroup
  isLoading: boolean;
  expense_grpList: any;
  currentpage: number;
  has_next: boolean;
  has_previous: boolean;
  expense_headList: any;
  expense_head: any;
  cat_List: any;
  catList: any;
  subcat_list: any;
  expense_grp_summary: any;
  expense_head_summary: any;
  cat_summary_list: any;
  subcat_summary_List: any;
  expense_summary: any;
  hasprevious: any;
  hasnext: any;
  presentpage: any;
  isSummaryPagination: boolean;
  summary_parm: { expgrp: any; exp: any; cat: any; subcat: any;glno:any };
  constructor(private frombuilder:FormBuilder,private exp_service:PprService,private spinnerservice:NgxSpinnerService,private errorHandler:ErrorhandlingService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.expence_mapping=this.frombuilder.group({
      gl_no_summary:[''],
      expgrp_summary:[''],
      exp_summary:[''],
      cat_summary:[''],
      subcat_summary:[''],
      expgrp:[''],
      exphead:[''],
      exp_head:[''],
      cat:[''],
      cat_list:[''],
      sub_cat:['']
    })
    let summery=''
    this.expance_summary_search(summery)
  }
  public displayfnexpgrp(expense_name?: expense): string | undefined {
    return expense_name ? expense_name.name : undefined;
  }
  public displayfnexpgrpsummary(expense_name?: expense): string | undefined {
    return expense_name ? expense_name.name : undefined;
  }
  expgrp_dropdown(val,exp) {
    let prokeyvalue: String = "";
    this.getexpense_grp(val,prokeyvalue);
    this.expence_mapping.get(exp).valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exp_service.getexpensegrpdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='summary'){
          this.expense_grp_summary = datas;
        }if(val=='expgrp'){
          this.expense_grpList = datas;      
        }
      })
  }

  private getexpense_grp(val,prokeyvalue) {
    this.exp_service.getexpensegrpdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='summary'){
          this.expense_grp_summary = datas;
        }if(val=='expgrp'){
          this.expense_grpList = datas;      
        }
      })
  }
  expensegrpScroll(val,inputtype){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    let expauto
    let expinput
    if(inputtype=='expgrp_summary_input'){
      expauto=this.exp_grp_summary_auto
      expinput=this.expgrp_summary_input
    }
    if(inputtype=='expgrp_input'){
      expauto=this.exp_grpauto
      expinput=this.expgrp_input
    }
    setTimeout(() => {
      if (
        expauto &&
        this.autocompleteTrigger &&
        expauto.panel
      ) {
        fromEvent(expauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => expauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = expauto.panel.nativeElement.scrollTop;
            const scrollHeight = expauto.panel.nativeElement.scrollHeight;
            const elementHeight = expauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.exp_service.getexpensegrpdropdown(expinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if(val=='summary'){
                      this.expense_grp_summary = this.expense_grp_summary.concat(datas);
                      if (this.expense_grp_summary.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                    }if(val=='expgrp'){
                      this.expense_grpList = this.expense_grpList.concat(datas);
                      if (this.expense_grpList.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                    
                  })
              }
            }
          });
      }
    });
  }


  public displayfnexphead(expense_head?: expense): string | undefined {
    return expense_head ? expense_head.head : undefined;
  }
  public displayfnexp_head(expense_head?: expense): string | undefined {
    return expense_head ? expense_head.head : undefined;
  }
  public displayfnexphead_summary(expense_head?: expense): string | undefined {
    return expense_head ? expense_head.head : undefined;
  }
  
  exphead_dropdown(val,exp) {
    let prokeyvalue: String = "";
    this.getexpense_head(val,prokeyvalue);
    let exphead:any
    this.expence_mapping.get(exp).valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exp_service.getexpenseheaddropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='expgrp'){
          this.expense_headList = datas;      
        }if(val == 'summary'){
          this.expense_head_summary=datas
        }if(val=='exphead'){
          this.expense_head=datas
        }
      })
  }

  private getexpense_head(val,prokeyvalue) {
    this.exp_service.getexpenseheaddropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='expgrp'){
          this.expense_headList = datas;      
        }if(val == 'summary'){
          this.expense_head_summary=datas
        }if(val=='exphead'){
          this.expense_head=datas
        }

      })
  }
  expenseheadScroll(val,head_input){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    let head_input_val
    let head_auto_value
    if(head_input=='exphead_input'){
      head_input_val=this.exphead_input
      head_auto_value=this.exp_headauto
    }if(head_input=='exphead_input1'){
      head_input_val=this.exphead_input1
      head_auto_value=this.exp_headauto1
    }if(head_input=='exphead_summary_input'){
      head_input_val=this.exphead_summary_input
      head_auto_value=this.exp_head_summary_auto
    }
    setTimeout(() => {
      if (
        head_auto_value &&
        this.autocompleteTrigger &&
        head_auto_value.panel
      ) {
        fromEvent(head_auto_value.panel.nativeElement, 'scroll')
          .pipe(
            map(() => head_auto_value.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = head_auto_value.panel.nativeElement.scrollTop;
            const scrollHeight = head_auto_value.panel.nativeElement.scrollHeight;
            const elementHeight = head_auto_value.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.exp_service.getexpenseheaddropdown(head_input_val.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if(val=='exphead'){
                      this.expense_head = this.expense_head.concat(datas);
                      if (this.expense_head.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }    
                    }if(val=='summary'){
                      this.expense_head_summary = this.expense_head_summary.concat(datas);
                      if (this.expense_head_summary.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }  
                    }if(val=='expgrp'){
                      this.expense_headList = this.expense_headList.concat(datas);
                    if (this.expense_headList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }    
                    }
                     
                    
                  })
              }
            }
          });
      }
    });
  }

  public displayfncat(cat?: expense): string | undefined {
    return cat ? cat.name : undefined;
  }
  public displayfn_cat(cat?: expense): string | undefined {
    return cat ? cat.name : undefined;
  }
  public displayfncat_summary(cat?: expense): string | undefined {
    return cat ? cat.name : undefined;
  }
  expcat_dropdown(val,cat) {
    let prokeyvalue: String = "";
    this.getcat(val,prokeyvalue);
    this.expence_mapping.get(cat).valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exp_service.getcat(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='expcat'){
          this.catList = datas;      
        }if(val=='exphead'){
          this.cat_List=datas
        }if(val=='summary'){
          this.cat_summary_list=datas
        }
      })
  }

  private getcat(val,prokeyvalue) {
    this.exp_service.getcat(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='expcat'){
          this.catList = datas;      
        }if(val=='exphead'){
          this.cat_List=datas
        }if(val=='summary'){
          this.cat_summary_list=datas
        }

      })
  }
  catScroll(val,inputcat){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    let inputcat_val
    let cat_auto_value
    if(inputcat=='expcat_input'){
      inputcat_val=this.expcat_input
      cat_auto_value=this.exp_catauto
    }if(inputcat=='expcat_input1'){
      inputcat_val=this.expcat_input1
      cat_auto_value=this.exp_catauto1
    }if(inputcat=='expcat_summary_input'){
      cat_auto_value=this.exp_cat_summary_auto
      inputcat_val=this.expcat_summary_input
    }
    setTimeout(() => {
      if (
        cat_auto_value &&
        this.autocompleteTrigger &&
        cat_auto_value.panel
      ) {
        fromEvent(cat_auto_value.panel.nativeElement, 'scroll')
          .pipe(
            map(() => cat_auto_value.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = cat_auto_value.panel.nativeElement.scrollTop;
            const scrollHeight = cat_auto_value.panel.nativeElement.scrollHeight;
            const elementHeight = cat_auto_value.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.exp_service.getcat(inputcat_val.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if(val=='expcat'){
                      this.catList = this.catList.concat(datas);
                      if (this.catList.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }     
                    }
                    if(val=='exphead'){
                      this.cat_List = this.cat_List.concat(datas);
                      if (this.cat_List.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }if(val=='summary'){
                      this.cat_summary_list = this.cat_summary_list.concat(datas);
                      if (this.cat_summary_list.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayfnsub_cat(subcat?: expense): string | undefined {
    return subcat ? subcat.name : undefined;
  }
  public displayfnsub_cat_summary(subcat?: expense): string | undefined {
    return subcat ? subcat.name : undefined;
  }
  subcat_dropdown(val,subcat) {
    let prokeyvalue: String = "";
    this.getsubcat(val,prokeyvalue);
    this.expence_mapping.get(subcat).valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exp_service.getsubcat(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='summary'){
          this.subcat_summary_List=datas
        }if(val=='subcat'){
          this.subcat_list=datas
        }
      })
  }

  private getsubcat(val,prokeyvalue) {
    this.exp_service.getsubcat(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(val=='summary'){
          this.subcat_summary_List=datas
        }if(val=='subcat'){
          this.subcat_list=datas
        }

      })
  }
  subcatScroll(val,subcat_input_type){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    let subcatinput
    let subcatauto
    if(subcat_input_type=='subcat_summary_input'){
      subcatauto=this.sub_cat_summary_auto
      subcatinput=this.subcat_summary_input
    }if(subcat_input_type=='subcat_input'){
      subcatauto=this.sub_catauto
      subcatinput=this.subcat_input
    }
    setTimeout(() => {
      if (
        subcatauto &&
        this.autocompleteTrigger &&
        subcatauto.panel
      ) {
        fromEvent(subcatauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => subcatauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = subcatauto.panel.nativeElement.scrollTop;
            const scrollHeight = subcatauto.panel.nativeElement.scrollHeight;
            const elementHeight = subcatauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.exp_service.getsubcat(subcatinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if(val=='subcat'){
                      this.subcat_list = this.subcat_list.concat(datas);
                      if (this.subcat_list.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }if(val=='summary'){
                      this.subcat_summary_List = this.subcat_summary_List.concat(datas);
                      if (this.subcat_summary_List.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                  })
              }
            }
          });
      }
    });
  }
  expense_mapping(diff,exp){
    if(diff==1){
      let expgrp
      let exphead
      console.log('exp=>',exp)
      if(typeof exp.expgrp != 'object'){
        this.toastr.warning('','Please Select The Expense Group',{timeOut:1500})
        return false;
        expgrp=''
      }else{
        expgrp=exp.expgrp.id
      }
      if(typeof exp.exphead != 'object'){
        this.toastr.warning('','Please Select The Expense',{timeOut:1500})
        return false;
        exphead=''
      }else{     
        exphead=exp.exphead.id
      }
      this.spinnerservice.show()
      this.exp_service.expensemapping(diff,expgrp,exphead).subscribe(e=>{
       this.spinnerservice.hide() 
        console.log("result=>",e)
        if(e['status']=='success'){
          this.toastr.success('','Successfully Mapped',{timeOut:1500})
          this.expence_mapping.controls['expgrp'].reset('')
          this.expence_mapping.controls['exphead'].reset('')
        }if(e['code']=="UNEXPECTED_ERROR"){
          this.toastr.success('',e['description'],{timeOut:1500})
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      })
    }if(diff==2){
      let exphead
      let cat
      if(typeof exp.exp_head != 'object'){
        this.toastr.warning('','Please Select The Expense',{timeOut:1500})
        return false;
        exphead=''
      }else{
        exphead=exp.exp_head.id
      }
      if(typeof exp.cat_list != 'object'){
        this.toastr.warning('','Please Select The Category',{timeOut:1500})
        return false;
        cat=''
      }else{     
        cat=exp.cat_list.id
      }
      this.spinnerservice.show()
      this.exp_service.expensemapping(diff,exphead,cat).subscribe(e=>{
        this.spinnerservice.hide()
        console.log("result=>",e)
        if(e['status']=='success'){
          this.toastr.success('','Successfully Mapped',{timeOut:1500})
          this.expence_mapping.controls['exp_head'].reset('')
          this.expence_mapping.controls['cat_list'].reset('')
        }
        if(e['code']=="UNEXPECTED_ERROR"){
          this.toastr.success('',e['description'],{timeOut:1500})
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      })
    }if(diff==3){
      let cat
      let subcat
      if(typeof exp.cat != 'object'){
        this.toastr.warning('','Please Select The Category',{timeOut:1500})
        return false;
        cat=''
      }else{
        cat=exp.cat.id
      }
      if(typeof exp.sub_cat != 'object'){
        this.toastr.warning('','Please Select The Category',{timeOut:1500})
        return false;
        subcat=''
      }else{     
        subcat=exp.sub_cat.id
      }
      this.spinnerservice.show()
      this.exp_service.expensemapping(diff,cat,subcat).subscribe(e=>{
        this.spinnerservice.hide()
        console.log("result=>",e)
        if(e['status']=='success'){
          this.toastr.success('','Successfully Mapped',{timeOut:1500})
          this.expence_mapping.controls['cat'].reset('')
          this.expence_mapping.controls['sub_cat'].reset('')
        }
        if(e['code']=="UNEXPECTED_ERROR"){
          this.toastr.success('',e['description'],{timeOut:1500})
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      })
    }
    
  }
  expance_summary_search(search,pageNumber=1){
    let expgrp
    let exp
    let cat
    let sub_cat
    let glno
    if(typeof search.gl_no_summary != 'number'){
      glno=''
    }else{
      glno=search.gl_no_summary
    }
    if(typeof search.expgrp_summary != 'object'){
      expgrp=''
    }else{
      expgrp=search.expgrp_summary.id
    }
    if(typeof search.exp_summary != 'object'){
      exp=''
    }else{
      exp=search.exp_summary.id
    }
    if(typeof search.cat_summary != 'object'){
      cat=''
    }else{
      cat=search.cat_summary.id
    }
    if(typeof search.subcat_summary != 'object'){
      sub_cat=''
    }else{
      sub_cat=search.subcat_summary.id
    }
    this.summary_parm={
      'expgrp':expgrp,
      'exp':exp,
      'cat':cat,
      'subcat':sub_cat,
      'glno':glno
    }
    this.exp_service.expanse_summary_search(this.summary_parm,pageNumber).subscribe(results=>{
      let data=results['data']
      if(data.length != 0){
        let dataPagination = results['pagination'];
        this.expense_summary=data
        this.hasnext = dataPagination.has_next;
        this.hasprevious = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      }
    })
  }
  nextClick() {
    if (this.hasnext === true) {
         
        this.currentpage = this.presentpage + 1
        this.expance_summary_search(this.summary_parm,this.presentpage + 1)
      }
   
    }
  
  previousClick() {
    if (this.hasprevious === true) {
      
      this.currentpage = this.presentpage - 1
      this.expance_summary_search(this.summary_parm,this.presentpage - 1)
    }
  }
  expense_reset(diff){
    
    if(diff==1){
      this.expence_mapping.controls['expgrp'].reset('')
      this.expence_mapping.controls['exphead'].reset('')
    }
    if(diff==2){
      this.expence_mapping.controls['exp_head'].reset('')
      this.expence_mapping.controls['cat_list'].reset('')
    }
    if(diff==3){
      this.expence_mapping.controls['cat'].reset('')
      this.expence_mapping.controls['sub_cat'].reset('')
    }
    if(diff==4){
      this.expence_mapping.controls['expgrp_summary'].reset('')
      this.expence_mapping.controls['exp_summary'].reset('')
      this.expence_mapping.controls['cat_summary'].reset('')
      this.expence_mapping.controls['subcat_summary'].reset('')
      this.expence_mapping.controls['gl_no_summary'].reset('')
    }
    if(diff==5){
      this.expence_mapping.controls['expgrp'].reset('')
      this.expence_mapping.controls['exphead'].reset('')
      this.expence_mapping.controls['exp_head'].reset('')
      this.expence_mapping.controls['cat_list'].reset('')
      this.expence_mapping.controls['cat'].reset('')
      this.expence_mapping.controls['sub_cat'].reset('')
    }
  }
}
