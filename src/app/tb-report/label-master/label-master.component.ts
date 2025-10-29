import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TbReportService } from '../tb-report.service';
import { ToastrService } from 'ngx-toastr';
import { param } from 'jquery';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';


export interface business_list{
  name:string
}



@Component({
  selector: 'app-label-master',
  templateUrl: './label-master.component.html',
  styleUrls: ['./label-master.component.scss']
})
export class LabelMasterComponent implements OnInit {
  reportGroupsearch:any;
  report_label_array: any;
  isSummaryPagination: boolean;
  presentpage: number;
  has_previous: boolean;
  has_next: boolean;
  explevel_id: string;
  array_hide: boolean;
  currentpage: number;
  isLoading: boolean;
  businessList: any;
  has_previousbss: boolean;
  has_nextbss: boolean;
  currentpagebss: number;
  constructor(private frombuilder:FormBuilder,private SpinnerService: NgxSpinnerService,private toastr: ToastrService,private tb_serv:TbReportService) { 
    this.reportGroupsearch=[{"type":"input","label":"Name","formvalue":"name"},{"type":"dropdown",inputobj:this.status_value,formvalue:"status"},{"type":"dropdown",inputobj:this.report_type,formvalue:"ref_type"}]
  }
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  status_value:any={
   label: "Status",
   data:[{"id":"0","name":"In-Active"},{"id":"1","name":"Active"}],
    params: "",
    searchkey: "",
    displaykey: "name",    
    Outputkey:"id",
    fronentdata:true,
  }
  report_type:any={
    label: "Report Types",
    data:[{"id":"1","name":"Vertical"},{"id":"2","name":"ROA"}],
     params: "",
     searchkey: "",
     displaykey: "name",    
     Outputkey:"id",
     fronentdata:true,
  }
  label_mas:FormGroup;
  ngOnInit(): void {
    this.label_mas=this.frombuilder.group({
      label_arr:new FormArray([this.label_mast_row_add()])
    })
 this.label_master_summary("")
  }

  label_mast_row_add(){
    let exp=new FormGroup({     
      sort_order:new FormControl(''),
      code:new FormControl(''),
      name:new FormControl(''),
      template:new FormControl(''),
      isEditable: new FormControl(false),
    }) 
    return exp;
  }


  saveexpgrp_mapping(expmapping,ind){
    console.log(expmapping)
    if( expmapping.value.code =="" || expmapping.value.code==null || expmapping.value.code==undefined ){
      this.toastr.warning("Please Enter the Code" )
      return false;
    }
    if(expmapping.value.name =="" || expmapping.value.name==null || expmapping.value.name==undefined){
      this.toastr.warning("Please Enter the Label Name" )
      return false;
    }
    if( expmapping.value.template =="" || expmapping.value.template==null || expmapping.value.template==undefined ){
      this.toastr.warning("Please Enter the Template" )
      return false;
    }
   
   
    if(expmapping.value.sort_order =="" || expmapping.value.sort_order==null || expmapping.value.sort_order==undefined){
      this.toastr.warning("Please Enter the Sort Order" )
      return false;
    }
    let Params
    if(expmapping.value.ppr_label_id=='' || expmapping.value.ppr_label_id==undefined || expmapping.value.ppr_label_id==null){
      Params = {
          "name":expmapping.value.name,
          "code":expmapping.value.code,
          "sort_order":expmapping.value.sort_order,
          "template":expmapping.value.template,
          "status":1,
          "flag":"I",
          "ref_type":6,
          "report_type":2,
      
    }
    }
    else{
      Params={
        "name":expmapping.value.name,
        "code":expmapping.value.code,
        "sort_order":expmapping.value.sort_order,
        "template":expmapping.value.template,
        "status":1,
        "flag":"I",
        "ref_type":6,
        "report_type":2,
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
       
    this.tb_serv.label_create_edit(Params)
      .subscribe((results: any) => {     

      if (results.reportlevel == "") {
        if(typeof expmapping.value.ppr_label_id=='number'){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
          // this.ppr_label.reset()
          this.SpinnerService.show()
          this.label_master_summary('')
          this.SpinnerService.hide()
        }else{
          this.toastr.success("",'Successfully Created',{timeOut:1500});
          // this.ppr_label.reset()
          this.SpinnerService.show()
          this.label_master_summary('')
          this.SpinnerService.hide()
          
        }
        this.SpinnerService.hide();    
     
      }
      this.SpinnerService.hide();
    }, error => {
      // this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  // ppr_label_clear(){
  //   this.ppr_label.reset()
  //   this.label_master_summary('')
  // }

  label_mast_create(){
    const form = <FormArray> this.label_mas.get('label_arr')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    form.insert(0, this.label_mast_row_add());
  
  
   }

  cancelexpgrp_mapping(expcancel,ind){
    if(expcancel.value.ppr_label_id  != ""){
      console.log('true')
      var arrayControl = this.label_mas.get('label_arr') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);    
      
  
    }  if(expcancel.value.ppr_label_id   == "" || expcancel.value.ppr_label_id  == undefined  || expcancel.value.ppr_label_id  ==null)
      {
      const control = <FormArray>this.label_mas.controls['label_arr'];
      control.removeAt(ind)   
      console.log('false')
  
    }
  
  }
  Editexpgrp_mapping(expedit,ind){
    for(let expeditval of this.label_mas.controls['label_arr'].value){
      console.log("edit",expeditval.isEditable)
      if(expeditval.isEditable==false){
        console.log(expeditval.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    var arrayControl = this.label_mas.get('label_arr') as FormArray;
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
      this.tb_serv.label_master_delete(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        // if(results.status=='success'){
        //   if(sourcestatus==1){
        //     this.toastr.success("",results.massage,{timeOut:1500})
        //     // this.ppr_label_clear()
           
        //   }else{
        //     this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
        //     // this.ppr_label_clear()
          
          // }
        // }
      }, error => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }
  
  label_master_summary(event,page=1){

    let name =event.name?event.name:""
    let status = event.status?event.status:""
    let report_types=event.ref_type?event.ref_type:""
     this.explevel_id=''
     let PARMS={
      "status":status,
      "name":name,
      "report_type":report_types
      
  }   
     this.SpinnerService.show()
     this.tb_serv.label_master_summary(PARMS,page).subscribe(result=>{
     this.SpinnerService.hide()  
       let data=result['data']       
       console.log("data=>",data)      
       this.report_label_array=data
       if(this.report_label_array.length!=0){
        this.array_hide=false
        let dataPagination = result['pagination'];
        console.log("dataPagination=>",dataPagination)
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
         this.label_mas = this.frombuilder.group({
          label_arr : this.frombuilder.array(
             this.report_label_array.map(val =>
               this.frombuilder.group({            
                 ppr_label_id:new FormControl(val.id),               
                 code:new FormControl(val.code),
                 sort_order:new FormControl(val.sort_order),
                 name:new FormControl(val.name),
                 template:new FormControl(val.template),
                 status:new FormControl(val.status),
                 isEditable: new FormControl(true),
               })
             )
           ) 
         });
         console.log("expence_level=>",this.label_mas)
        
       }
       else{
         this.toastr.warning("","No Data Found" ,{timeOut:1200})
         this.array_hide=true
        //  this.expencegrpmapping=[]
        //  this.expence_level.reset()
        //  this.expence_level.get('explevel').reset();
       }
     })
    }
 

  previousClick(){
    if (this.has_previous === true) {         
      this.currentpage = this.presentpage + 1
      this.label_master_summary(this.explevel_id,this.presentpage - 1)
    }
  }

  nextClick(){
    if (this.has_next === true) {         
      this.currentpage = this.presentpage + 1
      this.label_master_summary(this.explevel_id,this.presentpage + 1)
    }
  }


  Business_dropdown() {
    let report_type=2;
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.report_label_array.get('business').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.tb_serv.getbusiness_dropdown( value, 1,report_type)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
       
      })
  }
  


  autocompletebusinessnameScroll() {
    let report_type=2;
    this.has_nextbss = true
    this.has_previousbss = true
    this.currentpagebss = 1
    setTimeout(() => {
      if (
        this.business_nameautocomplete &&
        this.autocompleteTrigger &&
        this.business_nameautocomplete.panel
      ) {
        fromEvent(this.business_nameautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_nameautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_nameautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_nameautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_nameautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbss === true) {
                this.tb_serv.getbusiness_dropdown( this.businessInput.nativeElement.value, this.currentpagebss + 1,report_type,)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
                      this.has_nextbss = datapagination.has_next;
                      this.has_previousbss = datapagination.has_previous;
                      this.currentpagebss = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  business_id = 0;
  private getbusiness(prokeyvalue) {
    let report_type=2;
    this.tb_serv.getbusiness_dropdown( prokeyvalue, 1,report_type)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
  
      })
  }
  
  public displayfnbusiness(business_name?: business_list): string | undefined {
    return business_name ? business_name.name : undefined;
  
  }

}
