import { Component, OnInit, ViewChild } from '@angular/core';
import { TbReportService } from '../tb-report.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface mapping_list{
  name:string;
  id:number;
}


@Component({
  selector: 'app-mapping-master',
  templateUrl: './mapping-master.component.html',
  styleUrls: ['./mapping-master.component.scss']
})
export class MappingMasterComponent implements OnInit {
  mapping_mas_search:any;
  report_label_array: { code: string; flag: string; id: number; name: string; sort_order: number; status: number; template: string; type: string; }[];
  isSummaryPagination: boolean;
  presentpage: number;
  has_previous: boolean;
  has_next: boolean;
  explevel_id:any
  mapping_grp:FormGroup;
  mapping_report_array:any;
  array_hide:boolean;
  currentpage: number;
  isLoading: boolean;
  businessList: any;
  has_nextbss: boolean;
  has_previousbss: boolean;
  currentpagebss: number;
  constructor(private frombuilder:FormBuilder,private SpinnerService: NgxSpinnerService,private toastr: ToastrService,private tb_serv:TbReportService) { 
    this.mapping_mas_search=[{"type":"input","label":"Name","formvalue":"name"},{"type":"dropdown",inputobj:this.status_value,formvalue:"status"},]
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
  

  ngOnInit(): void {
    this.mapping_grp=this.frombuilder.group({
      mapping_arr:new FormArray([this.mapping_mast_row_add()])
    })
 this.mapping_master_summary("")
  }
  

  mapping_mast_row_add(){
    let exp=new FormGroup({     
      sort_order:new FormControl(''),
      code:new FormControl(''),
      label:new FormControl(''),
      business:new FormControl(''),
      template:new FormControl(''),
      status:new FormControl(''),
      isEditable: new FormControl(false),
    }) 
    return exp;
  }


  saveexpgrp_mapping(expmapping,ind){
    console.log(expmapping)
    if(expmapping.value.code =="" || expmapping.value.code==null || expmapping.value.code==undefined){
      this.toastr.warning("Please Enter the Code" )
      return false;
    }

    if(expmapping.value.business =="" || expmapping.value.business==null || expmapping.value.business==undefined){
      this.toastr.warning("Please Enter the Name" )
      return false;
    }
   
    if(expmapping.value.template =="" || expmapping.value.template==null || expmapping.value.template==undefined){
      this.toastr.warning("Please Enter the Template" )
      return false;
    }

    if( expmapping.value.sort_order =="" || expmapping.value.sort_order==null || expmapping.value.sort_order==undefined ){
      this.toastr.warning("Please Enter the Sort Order" )
      return false;
    }
    
    let Params
    if(expmapping.value.ppr_label_id=='' || expmapping.value.ppr_label_id==undefined || expmapping.value.ppr_label_id==null){
      Params =  {
        "name":expmapping.value.business,
        "code":expmapping.value.code,
        "sort_order":expmapping.value.sort_order,
        "template":expmapping.value.template,
        "status":1,
        "flag":2,
        "type":1,       
    }
    }
    else{
      Params= {
        "name":expmapping.value.business,
        "code":expmapping.value.code,
        "sort_order":expmapping.value.sort_order,
        "template":expmapping.value.template,
        "status":1,
        "flag":2,
        "type":1,  
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
       
    this.tb_serv.mapping_create_edit(Params)
      .subscribe((results: any) => {     

      if (results.reportlevel == "") {
        if(typeof expmapping.value.ppr_label_id=='number'){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
          // this.ppr_label.reset()
          this.SpinnerService.show()
          this.mapping_master_summary('')
          this.SpinnerService.hide()
        }else{
          this.toastr.success("",'Successfully Created',{timeOut:1500});
          // this.ppr_label.reset()
          this.SpinnerService.show()
          this.mapping_master_summary('')
          this.SpinnerService.hide()
          
        }
        this.SpinnerService.hide();
        // this.expence_level.reset()
     
      }
      this.SpinnerService.hide()
    }, error => {
      // this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  // ppr_label_clear(){
  //   this.ppr_label.reset()
  //   this.mapping_master_summary('')
  // }

  mapping_mast_create(){
    const form = <FormArray> this.mapping_grp.get('mapping_arr')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    form.insert(0, this.mapping_mast_row_add());
  
  
   }

  cancelexpgrp_mapping(expcancel,ind){
    if(expcancel.value.ppr_label_id  != ""){
      console.log('true')
      var arrayControl = this.mapping_grp.get('mapping_arr') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);    
      
  
    }  if(expcancel.value.ppr_label_id   == "" || expcancel.value.ppr_label_id  == undefined  || expcancel.value.ppr_label_id  ==null)
      {
      const control = <FormArray>this.mapping_grp.controls['mapping_arr'];
      control.removeAt(ind)   
      console.log('false')
  
    }
  
  }
  Editexpgrp_mapping(expedit,ind){
    for(let expeditval of this.mapping_grp.controls['mapping_arr'].value){
      console.log("edit",expeditval.isEditable)
      if(expeditval.isEditable==false){
        console.log(expeditval.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    var arrayControl = this.mapping_grp.get('mapping_arr') as FormArray;
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
      this.tb_serv.mapping_master_delete(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        if(results.message=="SUCCESSFULLY UPDATED"){ 
          if(sourcestatus==1){
            this.toastr.success("","Expence Group Active  Succesfully",{timeOut:1500})
           
            this.mapping_master_summary("")
          }else{
            this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
          
            this.mapping_master_summary("")
          }
        }
      }, error => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }
  
  mapping_master_summary(event,page=1){

    let name =event.name?event.name:""
    let status = event.status?event.status:""
    let ref_type=event.ref_type?event.ref_type:""
     this.explevel_id=''
     let PARMS={
      "status":status,
      "name":name,
      "code":"",
     "report_type":ref_type
  }

     this.SpinnerService.show()
     this.tb_serv.Mapping_master_summary(PARMS,page).subscribe(result=>{
     this.SpinnerService.hide()  
       let data=result['data']       
       console.log("data=>",data)
       let dataPagination = result['pagination'];
       console.log("dataPagination=>",dataPagination)       
       this.mapping_report_array=data
       if(this.mapping_report_array.length!=0){
        this.array_hide=false
        this.has_next = dataPagination.has_next;
       this.has_previous = dataPagination.has_previous;
       this.presentpage = dataPagination.index;
       this.isSummaryPagination = true;
         this.mapping_grp = this.frombuilder.group({
          mapping_arr : this.frombuilder.array(
             this.mapping_report_array.map(val =>
               this.frombuilder.group({            
                 ppr_label_id:new FormControl(val.id),               
                 code:new FormControl(val.code),
                 label:new FormControl(val.label),
                 sort_order:new FormControl(val.sort_order),
                 business:new FormControl(val.business),
                 template:new FormControl(val.template),
                 status:new FormControl(val.status),
                 isEditable: new FormControl(true),
               })
             )
           ) 
         });
         console.log("expence_level=>",this.mapping_grp)
        
       }
       else{
         this.toastr.warning("","No Data Found" ,{timeOut:1200})
         this.array_hide=true
        //  this.mapping_report_array=[]/
        //  this.expencegrpmapping=[]
        //  this.expence_level.reset()
        //  this.expence_level.get('explevel').reset();
       }
     })
    }
 

  previousClick(){
    if (this.has_previous === true) {         
      this.currentpage = this.presentpage + 1
      this.mapping_master_summary(this.explevel_id,this.presentpage - 1)
    }
  }

  nextClick(){
    if (this.has_next === true) {         
      this.currentpage = this.presentpage + 1
      this.mapping_master_summary(this.explevel_id,this.presentpage + 1)
    }
  }


  Business_dropdown() {
    let report_type=2;
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.mapping_report_array.get('business').valueChanges
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
  
  public displayfnbusiness(business_name?: mapping_list): string | undefined {
    return business_name ? business_name.name : undefined;
  
  }

}
