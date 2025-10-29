import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
export interface expensegrpList {
  id: number
  name: string
}
@Component({
  selector: 'app-expence-grp-level-mapping',
  templateUrl: './expence-grp-level-mapping.component.html',
  styleUrls: ['./expence-grp-level-mapping.component.scss']
})
export class ExpenceGrpLevelMappingComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('expinput') expinput: any;
  @ViewChild('explevelauto') explevelauto:MatAutocomplete;
  @ViewChild('exp_levelinput') exp_levelinput:any
  @ViewChild('explevel_auto') explevel_auto:MatAutocomplete;
  @ViewChild('explevelinput') explevelinput: any;
  @ViewChild('exp_levelauto') exp_levelauto:MatAutocomplete;
  expencegrp:FormGroup
  isLoading: boolean;
  expenseList: any;
  currentpage: number;
  has_next: boolean;
  has_previous: boolean;
  expence_level:FormGroup
  expense_levelList: any;
  AlevelList: any;
  expense_grpList: any;
  expencegrpmapping: any;
  presentpage: any;
  isSummaryPagination: boolean;
  explevel_id: string;
  identificationSize=10
  array_hide: boolean;
  Status_list: any[];
  has_next_sum: boolean;
  has_previous_sum: boolean;
  presentpage_sum: number;
  constructor(private errorHandler: ErrorhandlingService,private frombuilder:FormBuilder,private expservice:PprService,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.expencegrp=this.frombuilder.group({
      exp_level:[''],
      Status:['']
    })
    this.expence_level=this.frombuilder.group({
      explevel:new FormArray([this.exp_levelrowadd()])
    })
    let id=''
    this.expgrplistmapping_summary(id)
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
  expgrplistappnewrow(){
    const form = <FormArray> this.expence_level.get('explevel')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    form.insert(0, this.exp_levelrowadd());
  
  
   }


   expgrplistmapping_summary(explevelid,page=1){
    this.explevel_id=''
    console.log("exp=>",explevelid)
    if((this.expencegrp.value.exp_level=='')||(this.expencegrp.value.exp_level==undefined)||(this.expencegrp.value.exp_level==null)){
     this.explevel_id=''
  
    }else{
      if(typeof(this.expencegrp.value.exp_level)=='object'){
        this.explevel_id=this.expencegrp.value.exp_level.reportlevel  
      }else{
        this.explevel_id=explevelid  
      }
     
    }
    let status=this.expencegrp.value.Status?.id??""
    // this.explevel_id=this.expencegrp
    console.log("explevel_id",this.explevel_id)
    this.SpinnerService.show()
    this.expservice.expgrpmappingsummary(this.explevel_id,status,page).subscribe(expsummary=>{
    this.SpinnerService.hide()

      let data=expsummary['data']
      // let data=[]
      console.log("data=>",data)
      let dataPagination = expsummary['pagination'];
      console.log("dataPagination=>",dataPagination)
      this.has_next_sum = dataPagination.has_next;
      this.has_previous_sum = dataPagination.has_previous;
      this.presentpage_sum = dataPagination.index;
      this.isSummaryPagination = true;
      this.expencegrpmapping=data
      if(this.expencegrpmapping.length!=0){
        this.array_hide=false;
        this.expence_level = this.frombuilder.group({
          explevel: this.frombuilder.array(
            this.expencegrpmapping.map(val =>
              this.frombuilder.group({
                exp_status:new FormControl(val.status),
                exp_id:new FormControl(val.id),
                exp_code:new FormControl(val.code),
                exp_name:new FormControl(val.name),
                exp_Level:new FormControl(val.level),
                isEditable: new FormControl(true),
              })
            )
          ) 
        });
        console.log("expence_level=>",this.expence_level)
       
      }
      else{
        this.toastr.warning("","No Data Found" ,{timeOut:1200})
        this.array_hide=true
        // this.expencegrpmapping=[]
        // this.expence_level.reset()
        // this.expence_level.get('explevel').reset();
      }
    })
   }
   previousClick(){
    if (this.has_previous_sum === true) {
         
      this.currentpage = this.presentpage_sum - 1
      this.expgrplistmapping_summary(this.explevel_id,this.presentpage_sum - 1)
    }
  }
  nextClick(){
    if (this.has_next_sum === true) {
         
      this.currentpage = this.presentpage_sum + 1
      this.expgrplistmapping_summary(this.explevel_id,this.presentpage_sum + 1)
    }
  }
  private getallocationlevel(prokeyvalue) {
    this.expservice.getallocationleveldropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.AlevelList = datas
      })
  }

  Allocationlevel_dropdown() {
    let prokeyvalue: String = "";
    this.getallocationlevel(prokeyvalue);
    this.expencegrp.get('exp_level').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.expservice.getallocationleveldropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              if(typeof value != 'object'){
                // this.expencegrp.controls['exp_level'].patchValue('')
              }
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log('datas drop=>',datas)
        this.AlevelList = datas;      
      })
  }
  private getallocation_level(prokeyvalue) {
    this.expservice.getallocationleveldropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.expense_levelList = datas
      })
  }

  Allocationleveldropdown(ind) {
    let prokeyvalue: String = "";
    this.getallocation_level(prokeyvalue);
    var arrayControl = this.expence_level.get('explevel') as FormArray;
    let item = arrayControl.at(ind);
    item.get('exp_Level').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.expservice.getallocationleveldropdown(value, 1)
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
        this.expense_levelList = datas;      
      })
  }
  explevelmapping_dropdown(ind) {
    let prokeyvalue: String = "";
    this.getexpense_levelgrp(prokeyvalue);
    var arrayControl = this.expence_level.get('explevel') as FormArray;
    let item = arrayControl.at(ind);
    item.get('exp_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.expservice.getexpensegrpdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.expense_grpList = datas

      })
  }


  private getexpense_levelgrp(prokeyvalue) {
    this.expservice.getexpensegrpdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.expense_grpList = datas

      })
  }
  allocationlevelscroll(){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    setTimeout(() => {
      if (
        this.explevelauto &&
        this.autocompleteTrigger &&
        this.explevelauto.panel
      ) {
        fromEvent(this.explevelauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.explevelauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.explevelauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.explevelauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.explevelauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.expservice.getallocationleveldropdown(this.expinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.AlevelList = this.AlevelList.concat(datas);
                    if (this.AlevelList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompletexpenselevel(){
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    setTimeout(() => {
      if (
        this.explevel_auto &&
        this.autocompleteTrigger &&
        this.explevel_auto.panel
      ) {
        fromEvent(this.explevel_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.explevel_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.explevel_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.explevel_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.explevel_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.expservice.getallocationleveldropdown(this.exp_levelinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.expense_levelList = this.expense_levelList.concat(datas);
                    if (this.expense_levelList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompletexpenselevelScroll() {
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    setTimeout(() => {
      if (
        this.exp_levelauto &&
        this.autocompleteTrigger &&
        this.exp_levelauto.panel
      ) {
        fromEvent(this.exp_levelauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.exp_levelauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.exp_levelauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.exp_levelauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.exp_levelauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.expservice.getexpensegrpdropdown(this.explevelinput.nativeElement.value, this.currentpage+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.expense_grpList = this.expense_grpList.concat(datas);
                    if (this.expense_grpList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayfnexpense(expense_name?: expensegrpList): string | undefined {
    return expense_name ? expense_name.name : undefined;

  }

  saveexpgrp_mapping(expmapping,ind){
    console.log(expmapping)
    if(typeof expmapping.value.exp_Level!='object'){
      this.toastr.warning('', 'Please Fill The Level', { timeOut: 1500 });
      return false;
    }
    if(typeof expmapping.value.exp_name!='object'){
      this.toastr.warning('', 'Please Select Expence Group Name', { timeOut: 1500 });
      return false;
    }  
    let expmapping_parm
    if(expmapping.value.exp_id==''){
      expmapping_parm={
        "name":expmapping.value.exp_name.id,
        "level":expmapping.value.exp_Level.reportlevel, 
      }
    }
    else{
      expmapping_parm={
        "name":expmapping.value.exp_name.id,
        "level":expmapping.value.exp_Level.reportlevel, 
        "id":expmapping.value.exp_id
      }
     }
     var glsubgrpconfirm=window.confirm("Do You Want To Save And Continue?")
     console.log(glsubgrpconfirm)
     if(!glsubgrpconfirm){
       console.log("True")
       return false;
     }else{
     this.SpinnerService.show();
        let val=''
    this.expservice.expgrp_mapping(expmapping_parm)
      .subscribe((results: any[]) => {
  
     this.SpinnerService.hide();
      if (results['set_code'] == 'success') {
        if(typeof expmapping.value.exp_id=='number'){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
        }else{
          this.toastr.success("",'Successfully Created',{timeOut:1500});
        }
        
        // this.expence_level.reset()
        this.expgrplistmapping_clear()
        this.expgrplistmapping_summary(val) 
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  expgrplistmapping_clear(){
    let val=''
    this.expencegrp.controls['exp_level'].reset('')
    this.expencegrp.controls['Status'].reset('')
    this.expgrplistmapping_summary(val) 
  }
  cancelexpgrp_mapping(expcancel,ind){
    if(expcancel.value.exp_id  != ""){
      console.log('true')
      var arrayControl = this.expence_level.get('explevel') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);
      this.expgrplistmapping_summary(this.explevel_id) 
      
  
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
      this.SpinnerService.show()
      this.expservice.expgrpdelete(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        if(results.status=='success'){
          if(sourcestatus==1){
            this.toastr.success("","Expence Group Active  Succesfully",{timeOut:1500})
            this.expgrplistmapping_clear()
            this.expgrplistmapping_summary(val) 
          }else{
            this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
            this.expgrplistmapping_clear()
            this.expgrplistmapping_summary(val) 
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }

   status_function(){
    this.Status_list=[{id:1,name:"Active"},
    {id:0,name:"In-Active"}]
   }
}
