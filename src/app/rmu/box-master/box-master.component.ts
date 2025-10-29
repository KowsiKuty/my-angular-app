import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';

@Component({
  selector: 'app-box-master',
  templateUrl: './box-master.component.html',
  styleUrls: ['./box-master.component.scss']
})
export class BoxMasterComponent implements OnInit {

  boxsearch:FormGroup
  isLoading: boolean;
  expenseList: any;
  currentpage: number;
  has_next: boolean;
  has_previous: boolean;
  box_form:FormGroup
  expense_levelList: any;
  AlevelList: any;
  expense_grpList: any;
  boxsearchmapping: any;
  presentpage: any;
  isSummaryPagination: boolean;
  box_form_arr_id: string;
  identificationSize=10
  array_hide: boolean;
  Status_list: any[];
  has_next_sum: boolean;
  has_previous_sum: boolean;
  presentpage_sum: number;
  constructor(private errorHandler: ErrorHandlingServiceService,private frombuilder:FormBuilder,private rmu_service:RmuApiServiceService,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.boxsearch=this.frombuilder.group({
      box:[]
    })
   this.box_form=this.frombuilder.group({
       box_form_arr:new FormArray([this.exp_levelrowadd()])
     })
     let id=''
     this.box_summary(id)
   }
   exp_levelrowadd(){
     let exp=new FormGroup({
       box_status:new FormControl(2),
       box_id:new FormControl(''),
       box_code:new FormControl(''),
       box_name:new FormControl(''),
       isEditable: new FormControl(false),
     }) 
     return exp;
   }
   nex_box_create(){
     const form = <FormArray> this.box_form.get('box_form_arr')
  
     for(let valsource of form.value){
       console.log("edit",valsource.isEditable)
       if(valsource.isEditable==false){
         console.log(valsource.isEditable)
         this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
         return false;
       }
     }
    
     form.insert(0, this.exp_levelrowadd())   
   
   
    }
 
 
    box_summary(box_form_arrid,page=1){
     this.box_form_arr_id=this.boxsearch.value.box ?this.boxsearch.value.box :''
     console.log("exp=>",box_form_arrid)
    //  if((this.boxsearch.value.exp_level=='')||(this.boxsearch.value.exp_level==undefined)||(this.boxsearch.value.exp_level==null)){
    //   this.box_form_arr_id=''
   
    //  }else{
    //    if(typeof(this.boxsearch.value.exp_level)=='object'){
    //      this.box_form_arr_id=this.boxsearch.value.box  
    //    }else{
    //      this.box_form_arr_id=box_form_arrid  
    //    }
      
    //  }
    //  let status=this.boxsearch.value.Status?.id??""
     // this.box_form_arr_id=this.boxsearch
     console.log("box_form_arr_id",this.box_form_arr_id)
     this.SpinnerService.show()
     this.rmu_service.box_master_summary(this.box_form_arr_id,page).subscribe(expsummary=>{
     this.SpinnerService.hide()
 
       let data=expsummary['data']
       // let data=[]
       console.log("data=>",data)       
       this.boxsearchmapping=data
       if(this.boxsearchmapping.length!=0){
        let dataPagination = expsummary['pagination'];
       console.log("dataPagination=>",dataPagination)
       this.has_next_sum = dataPagination.has_next;
       this.has_previous_sum = dataPagination.has_previous;
       this.presentpage_sum = dataPagination.index;
         this.array_hide=false;
         this.box_form = this.frombuilder.group({
           box_form_arr: this.frombuilder.array(
             this.boxsearchmapping.map(val =>
               this.frombuilder.group({
                 box_status:new FormControl(val.status),
                 box_id:new FormControl(val.id),
                 box_code:new FormControl(val.code),
                 box_name:new FormControl(val.name),
                 isEditable: new FormControl(true),
               })
             )
           ) 
          }) 
         console.log("box_form=>",this.box_form)
        
       }
       else{
         this.toastr.warning("","No Data Found" ,{timeOut:1200})
         this.array_hide=true
         this.boxsearchmapping=[]
         // this.box_form.reset()
         console.log("box_form.controls.box_form_arr['controls'].length",this.box_form.controls.box_form_arr['controls'].length=0)
         this.box_form.get('box_form_arr').reset();
       }
     }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      }) 
    }
    previousClick(){
     if (this.has_previous_sum === true) {
          
       this.currentpage = this.presentpage_sum - 1
       this.box_summary(this.box_form_arr_id,this.presentpage_sum - 1)
     }
   }
   nextClick(){
     if (this.has_next_sum === true) {
          
       this.currentpage = this.presentpage_sum + 1
       this.box_summary(this.box_form_arr_id,this.presentpage_sum + 1)
     }
   }

     save_box_mapping(expmapping,ind){
       console.log(expmapping)
      //  if( expmapping.value.exp_Level!='object'){
      //    this.toastr.warning('', 'Please Fill The Level', { timeOut: 1500 });
      //    return false;
      //  }
       if( expmapping.value.box_name==='' || expmapping.value.box_name===null || expmapping.value.box_name===undefined){
         this.toastr.warning('', 'Please Select Box Name', { timeOut: 1500 });
         return false;
       }  
       let expmapping_parm
       if(expmapping.value.box_id==''){
         expmapping_parm={
           "name":expmapping.value.box_name
         }
       }
       else{
         expmapping_parm={
           "name":expmapping.value.box_name,
           "id":expmapping.value.box_id
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
       this.rmu_service.box_create_update(expmapping_parm)
         .subscribe((results: any) => {
     
        this.SpinnerService.hide();
         if (results.status == 'success') {
           if(typeof expmapping.value.box_id=='number'){
             this.toastr.success("",'Successfully Updated',{timeOut:1500});
           }else{
             this.toastr.success("",'Successfully Created',{timeOut:1500});
           }
           
           // this.box_form.reset()
           this.box_reset()
           this.box_summary(val) 
         }
       }, error => {
         this.errorHandler.handleError(error);
         this.SpinnerService.hide();
       })
     }
     }
     box_reset(){
       let val=''
       this.boxsearch.controls['box'].reset('')
      //  this.boxsearch.controls['Status'].reset('')
       this.box_summary(val) 
     }
     cancel_box_mapping(expcancel,ind){
       if(expcancel.value.box_id  != ""){
         console.log('true')
         var arrayControl = this.box_form.get('box_form_arr') as FormArray;
         let item = arrayControl.at(ind);
        item.get('isEditable')
         .patchValue(true);
         this.box_summary(this.box_form_arr_id) 
         
     
       }  if(expcancel.value.box_id   == "" || expcancel.value.box_id  == undefined  || expcancel.value.box_id  ==null)
         {
         const control = <FormArray>this.box_form.controls['box_form_arr'];
         control.removeAt(ind)   
         console.log('false')
     
       }
     
     }
     edit_box_mapping(expedit,ind){
       for(let expeditval of this.box_form.controls['box_form_arr'].value){
         console.log("edit",expeditval.isEditable)
         if(expeditval.isEditable==false){
           console.log(expeditval.isEditable)
           this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
           return false;
         }
       }
       var arrayControl = this.box_form.get('box_form_arr') as FormArray;
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
         let id=expcancel.value.box_id
         let status=expcancel.value.box_status
         let sourcestatus
         if(status==0){
           sourcestatus=1
         }else{
           sourcestatus=0
         }
         
         let val=''
         this.SpinnerService.show()
         this.rmu_service.box_master_delete(id,sourcestatus).subscribe((results) => {
           this.SpinnerService.hide()
           if(results.status=='success'){
             if(sourcestatus==1){
               this.toastr.success("","Expence Group Active  Succesfully",{timeOut:1500})
               this.box_reset()
               this.box_summary(val) 
             }else{
               this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
               this.box_reset()
               this.box_summary(val) 
             }
           }
         }, error => {
           this.errorHandler.handleError(error);
           this.SpinnerService.hide();
         })
       }
       
      }
}
