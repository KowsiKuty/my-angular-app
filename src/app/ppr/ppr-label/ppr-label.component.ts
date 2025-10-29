import { Component, OnInit } from '@angular/core';
import { PprService } from '../ppr.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ErrorhandlingService } from '../errorhandling.service';

@Component({
  selector: 'app-ppr-label',
  templateUrl: './ppr-label.component.html',
  styleUrls: ['./ppr-label.component.scss']
})
export class PprLabelComponent implements OnInit {
  explevel_id: string;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  report_label_array: any;
  array_hide: boolean;
  expsummary:any;
  Active_status_list=[
    {id:"1",name:"Active"},
    {id:"0",name:"In-Active"},
  ]
  currentpage: any;
  constructor(private errorHandler: ErrorhandlingService,private frombuilder:FormBuilder,private labelservice:PprService,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  ppr_label:FormGroup;
  label_grp:FormGroup;
  ngOnInit(): void {
    this.ppr_label=this.frombuilder.group({
      sort_order:[''],
      active_status:['']
    })
    this.label_grp=this.frombuilder.group({
      sort_arr:new FormArray([this.ppr_label_rowadd()])
    })
    this.ppr_report_label_summary('')
  }
  ppr_label_rowadd(){
    let exp=new FormGroup({     
      sort_order:new FormControl(''),
      label_name:new FormControl(''),
      reportlevel:new FormControl(''),
      isEditable: new FormControl(false),
    }) 
    return exp;
  }

  saveexpgrp_mapping(expmapping,ind){
    console.log(expmapping)
    if( expmapping.value.sort_order =="" || expmapping.value.sort_order==null || expmapping.value.sort_order==undefined ){
      this.toastr.warning("Please Enter the Sort Order" )
      return false;
    }
    if(expmapping.value.label_name =="" || expmapping.value.label_name==null || expmapping.value.label_name==undefined){
      this.toastr.warning("Please Enter the Label Name" )
      return false;
    }
   
    if(expmapping.value.reportlevel =="" || expmapping.value.reportlevel==null || expmapping.value.reportlevel==undefined){
      this.toastr.warning("Please Enter the Level" )
      return false;
    }
    let Params
    if(expmapping.value.ppr_label_id==''){
      Params = {
        "arrange": expmapping.value.sort_order,
        "name": expmapping.value.label_name,
        "reportlevel":expmapping.value.reportlevel,
    }
    }
    else{
      Params={
        "arrange":expmapping.value.sort_order,
        "name":expmapping.value.label_name, 
        "reportlevel":expmapping.value.reportlevel,
        "id":expmapping.value.ppr_label_id
      }
     }
     var glsubgrpconfirm=window.confirm("Do You Want To Save And Continue?")
     console.log(glsubgrpconfirm)
     if(!glsubgrpconfirm){
       console.log("True")
       return false;
     }else{
     this.SpinnerService.show();
       
    this.labelservice.ppr_label_update(Params)
      .subscribe((results: any) => {     

      // if (results.reportlevel == "") {
        if(typeof expmapping.value.ppr_label_id=='number'){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
          this.ppr_label.reset()
          this.SpinnerService.show()
          this.ppr_report_label_summary('')
          this.SpinnerService.hide()
        }else{
          this.toastr.success("",'Successfully Created',{timeOut:1500});
          this.ppr_label.reset()
          this.SpinnerService.show()
          this.ppr_report_label_summary('')
          this.SpinnerService.hide()
          
        }
        this.SpinnerService.hide();
        // this.expence_level.reset()
     
      // }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  ppr_label_clear(){
    this.ppr_label.reset()
    this.ppr_report_label_summary('')
  }

  ppr_labels_rowadd(){
    const form = <FormArray> this.label_grp.get('sort_arr')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    form.insert(0, this.ppr_label_rowadd());
  
  
   }

  cancelexpgrp_mapping(expcancel,ind){
    if(expcancel.value.ppr_label_id  != ""){
      console.log('true')
      var arrayControl = this.label_grp.get('sort_arr') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);    
      
  
    }  if(expcancel.value.ppr_label_id   == "" || expcancel.value.ppr_label_id  == undefined  || expcancel.value.ppr_label_id  ==null)
      {
      const control = <FormArray>this.label_grp.controls['sort_arr'];
      control.removeAt(ind)   
      console.log('false')
  
    }
  
  }
  Editexpgrp_mapping(expedit,ind){
    for(let expeditval of this.label_grp.controls['sort_arr'].value){
      console.log("edit",expeditval.isEditable)
      if(expeditval.isEditable==false){
        console.log(expeditval.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    var arrayControl = this.label_grp.get('sort_arr') as FormArray;
    let item = arrayControl.at(ind);
   item.get('isEditable')
    .patchValue(false);
     
  }
  deletelabel(expcancel,i){
    var sourceconfirm=window.confirm("Are You Sure Change The Status?")
    console.log(sourceconfirm)
    if(!sourceconfirm){
      return false;
    }else{
      // let delsource=expcancel.value.newsource[i]
      let id=expcancel.value.ppr_label_id
      let status=expcancel.value.status
      let sourcestatus
      if(status==0){
        sourcestatus=1
      }else{
        sourcestatus=0
      }
      
      let val=''
      this.SpinnerService.show()
      this.labelservice.ppr_label_delete(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        if(results.status=='success'){
          if(sourcestatus==1){
            this.toastr.success("","Expence Group Active  Succesfully",{timeOut:1500})
            this.ppr_label_clear()
           
          }else{
            this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
            this.ppr_label_clear()
          
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }

   ppr_report_label_summary(explevelid,page=1){

   let name =this.ppr_label.value.sort_order?this.ppr_label.value.sort_order:""
   let status = this.ppr_label.value.active_status?.id??""
    this.explevel_id=''    
    this.SpinnerService.show()
    this.labelservice.ppr_report_label_summary(name,status,page).subscribe(result=>{
    this.SpinnerService.hide()
      let data=result['data']
      this.expsummary=data
      console.log("data=>",data)
      let dataPagination = result['pagination'];
      console.log("dataPagination=>",dataPagination)
      this.has_next = dataPagination.has_next;
      this.has_previous = dataPagination.has_previous;
      this.presentpage = dataPagination.index;
      this.isSummaryPagination = true;
      this.report_label_array=data
      if(this.report_label_array.length!=0){
        this.array_hide=false;
        this.label_grp = this.frombuilder.group({
          sort_arr: this.frombuilder.array(
            this.report_label_array.map(val =>
              this.frombuilder.group({            
                ppr_label_id:new FormControl(val.id),               
                label_name:new FormControl(val.name),
                sort_order:new FormControl(val.arrange),
                reportlevel:new FormControl(val.reportlevel),
                status:new FormControl(val.status),
                isEditable: new FormControl(true),
              })
            )
          ) 
        });
        console.log("expence_level=>",this.label_grp)
       
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
    if (this.has_previous === true) {         
      this.currentpage = this.presentpage + 1
      this.ppr_report_label_summary(this.explevel_id,this.presentpage - 1)
    }
  }
  nextClick(){
    if (this.has_next === true) {         
      this.currentpage = this.presentpage + 1
      this.ppr_report_label_summary(this.explevel_id,this.presentpage + 1)
    }
  }
   
}
