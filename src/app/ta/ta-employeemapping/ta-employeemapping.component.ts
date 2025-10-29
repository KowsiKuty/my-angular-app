import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup, FormBuilder} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
export interface designation{
  id:string;
  name:string;
  code:string;
}
export interface designation_list{
  id:string;
  name:string;
  code:string;
}
export interface designation_list1{
  id:string;
  name:string;
  code:string;
}
@Component({
  selector: 'app-ta-employeemapping',
  templateUrl: './ta-employeemapping.component.html',
  styleUrls: ['./ta-employeemapping.component.scss']
})
export class TaEmployeemappingComponent implements OnInit {
  @ViewChild('designationauto') matdesnAutocomplete: MatAutocomplete;
  @ViewChild('designationauto1') matdesnAutocomplete1: MatAutocomplete;
  @ViewChild('designationauto2') matdesnAutocomplete2: MatAutocomplete;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
 
    getemployeemappingList:any;
    gradeeligiblemodel:any;
    gradeeligibleform:FormGroup;
    isLoading = false;
    @Output() onCancel = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>(); 
    @ViewChild('closebutton') closebutton; 
    @ViewChild('closebuttons') closebuttons; 
    has_next=true;
    has_previous=true;
    currentpage=1;
    pagesize = 10;
    employeemapping_id:any;
    employeemapping_editform: FormGroup;
    SearchValues: any;
    holidaySearchForm: FormGroup;
    searchtable_data: any;
    employeemappingSearchForm : FormGroup;
    employeemapcreate : FormGroup;
    has_desnext:boolean=true;
    has_desprevious:boolean=false;
    has_despresentpage:number=1;
    designationList:Array<any>=[];
    searchdesignationList:Array<any>=[];
    editdesignationList:Array<any>=[];
    constructor(private taService:TaService,private router:Router,private SpinerService: NgxSpinnerService,
      private notification:NotificationService, private formBuilder : FormBuilder) { }
  
    ngOnInit(): void {
      this.employeemapcreate = this.formBuilder.group({
        grade:'',
        designation:'',
        orderno:''
      })
      
      this.employeemappingSearchForm = this.formBuilder.group({
        
        grade:'',
        designation:'',
        orderno:''
        
  
      })
      this.employeemapping_editform = this.formBuilder.group({
        
        grade:'',
        designation:'',
        orderno:''
        
  
      })
      this.getemployeemappingsummary(this.currentpage);
      this.employeemapcreate.get('designation').valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any)=>this.taService.getDesignationSearch(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
    ).subscribe(data=>{
        this.designationList=data['data'];
    });
  }
  get_search_designation(){
    let d:any='';
  if(this.employeemappingSearchForm.get('designation').value == null || this.employeemappingSearchForm.get('designation').value=='' || this.employeemappingSearchForm.get('designation').value==undefined){
    d='';
  }
  else{
    d=this.employeemappingSearchForm.get('designation').value;
  }
  this.taService.getDesignationSearch(d,1).subscribe(data=>{
    console.log(data['data'])
      this.searchdesignationList=data['data'];
  });
    this.employeemappingSearchForm.get('designation').valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any)=>this.taService.getDesignationSearch(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
    ).subscribe(data=>{
        this.searchdesignationList=data['data'];
    });
    }
  
    editgrade(data){
    
      
      this.employeemapping_editform.patchValue({grade: data.grade})
       
        this.employeemapping_editform.get('designation').patchValue({'name':data.designation});
        this.employeemapping_editform.patchValue({orderno: data.orderno})

     
    }
    get_designation(){
      let d:any='';
    if(this.employeemapcreate.get('designation').value == null || this.employeemapcreate.get('designation').value=='' || this.employeemapcreate.get('designation').value==undefined){
      d='';
    }
    else{
      d=this.employeemapcreate.get('designation').value;
    }
    this.taService.getDesignationSearch(d,1).subscribe(data=>{
      console.log(data['data'])
        this.designationList=data['data'];
    });
  }

    //   this.employeemapcreate.get('designation').valueChanges.pipe(
    //       tap(()=>{
    //         this.isLoading=true;
    //       }),
    //       switchMap((value:any)=>this.taService.getDesignationSearch(value,1).pipe(
    //         finalize(()=>{
    //           this.isLoading=false;
    //         })
    //       ))
    //   ).subscribe(data=>{
    //       this.designationList=data['data'];
    //   });
    // }
    // get_search_designation(){
    //   let d:any='';
    // if(this.employeemappingSearchForm.get('designation').value == null || this.employeemappingSearchForm.get('designation').value=='' || this.employeemappingSearchForm.get('designation').value==undefined){
    //   d='';
    // }
    // else{
    //   d=this.employeemappingSearchForm.get('designation').value;
    // }
    // this.taService.getDesignationSearch(d,1).subscribe(data=>{
    //   console.log(data['data'])
    //     this.searchdesignationList=data['data'];
    // });
    //   this.employeemappingSearchForm.get('designation').valueChanges.pipe(
    //       tap(()=>{
    //         this.isLoading=true;
    //       }),
    //       switchMap((value:any)=>this.taService.getDesignationSearch(value,1).pipe(
    //         finalize(()=>{
    //           this.isLoading=false;
    //         })
    //       ))
    //   ).subscribe(data=>{
    //       this.searchdesignationList=data['data'];
    //   });
    // }
    edit_search_designation(){
      let d:any='';
    if(this.employeemapping_editform.get('designation').value == null || this.employeemapping_editform.get('designation').value=='' || this.employeemapping_editform.get('designation').value==undefined){
      d='';
    }
    else{
      d=this.employeemapping_editform.get('designation').value;
    }
    this.taService.getDesignationSearch(d,1).subscribe(data=>{
      console.log(data['data'])
        this.editdesignationList=data['data'];
    });
      this.employeemapping_editform.get('designation').valueChanges.pipe(
          tap(()=>{
            this.isLoading=true;
          }),
          switchMap((value:any)=>this.taService.getDesignationSearch(value,1).pipe(
            finalize(()=>{
              this.isLoading=false;
            })
          ))
      ).subscribe(data=>{
          this.editdesignationList=data['data'];
      });
    }
  
    updateForm(){
      if(this.employeemapping_editform.get('grade').value ==undefined || this.employeemapping_editform.get('grade').value =="" || this.employeemapping_editform.get('grade').value ==''||this.employeemapping_editform.value.grade==undefined || this.employeemapping_editform.value.grade =="" || this.employeemapping_editform.value.grade ==''){
        this.notification.showError('Please Enter The Grade');
        return false;
      }
      
      if(this.employeemapping_editform.get('designation').value ==undefined || this.employeemapping_editform.get('designation').value =="" || this.employeemapping_editform.get('designation').value ==''||this.employeemapping_editform.value.designation ==undefined || this.employeemapping_editform.value.designation =="" || this.employeemapping_editform.value.designation =='' || this.employeemapping_editform.get('designation').value.name ==undefined || this.employeemapping_editform.get('designation').value.name =="" || this.employeemapping_editform.get('designation').value.name ==''||this.employeemapping_editform.value.designation.name ==undefined || this.employeemapping_editform.value.designation.name =="" || this.employeemapping_editform.value.designation.name ==''){
        this.notification.showError('Please Select The Designation');
        return false;
      }
      if(this.employeemapping_editform.get('orderno').value ==undefined || this.employeemapping_editform.get('orderno').value =="" || this.employeemapping_editform.get('orderno').value ==''){
        this.notification.showError('Please Enter The Orderno');
        return false;
      }
      
  
  
      let data:any={
        "id":this.employeemapping_id,
        "grade":this.employeemapping_editform.get('grade').value,
        "designation": this.employeemapping_editform.get('designation').value.name, 
        "orderno":this.employeemapping_editform.get('orderno').value,
        
      }
  
  

     
      this.taService.createemployeemapping(data).subscribe(res => {
        console.log("ERRORS")
        console.log(res)
        if (res.status === "success") {
          this.notification.showSuccess('Holiday Diem Updated Successfully')
          this.getemployeemappingsummary(this.currentpage)
          this.closebuttons.nativeElement.click();
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })
    
    
      }
    
    totalcount:any;
    getemployeemappingsummary(page){
      this.SpinerService.show()
      console.log(page)
      let grade=this.employeemappingSearchForm.get('grade').value?this.employeemappingSearchForm.get('grade').value:''
      let designation=this.employeemappingSearchForm.get('designation').value?this.employeemappingSearchForm.get('designation').value.name:''
      this.taService.getemployeemappingsummary(page,grade,designation)
      .subscribe((results: any[]) => {
      let datas = results['data'];
      this.getemployeemappingList = datas;
      this.totalcount=results['count'];
      let datapagination = results['pagination']
      if (this.getemployeemappingList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
      this.SpinerService.hide()
       })
    }
    resetform(){
      let myfrom = this.employeemappingSearchForm;
      myfrom.patchValue({
        grade:'',
        designation:'',
        orderno:''
      })
      this.getemployeemappingsummary(this.currentpage);
      
    }
    previousClick(){
      if(this.has_previous == true){
        this.getemployeemappingsummary(this.currentpage-1)
      }
    }
  
    nextClick(){
      if(this.has_next == true){
        this.getemployeemappingsummary(this.currentpage+1)
      }
    }
    
  
  
    deletegrade(id){
      this.taService.deletegradeeligible(id)
      .subscribe(result =>  {
       this.notification.showSuccess("Deleted Successfully")
       this.getemployeemappingsummary(this.currentpage);
       return true
  
      })
    
    }
    createsms(){

    }
    public designationinterface(data?:designation):string | undefined{
      return data?data.name:undefined;
    }
    public sdesignationinterface(data?:designation_list):string | undefined{
      return data?data.name:undefined;
    }
    public editdesignationinterface(data?:designation_list1):string | undefined{
      return data?data.name:undefined;
    }
    // editdesignationList
    submitForm(){
      if(this.employeemapcreate.get('grade').value ==undefined || this.employeemapcreate.get('grade').value =="" || this.employeemapcreate.get('grade').value ==''||this.employeemapcreate.value.grade==undefined || this.employeemapcreate.value.grade =="" || this.employeemapcreate.value.grade ==''){
        this.notification.showError('Please Enter The Grade');
        return false;
      }
      
      if(this.employeemapcreate.get('designation').value ==undefined || this.employeemapcreate.get('designation').value =="" || this.employeemapcreate.get('designation').value ==''||this.employeemapcreate.value.designation ==undefined || this.employeemapcreate.value.designation =="" || this.employeemapcreate.value.designation =='' || this.employeemapcreate.get('designation').value.name ==undefined || this.employeemapcreate.get('designation').value.name =="" || this.employeemapcreate.get('designation').value.name ==''||this.employeemapcreate.value.designation.name ==undefined || this.employeemapcreate.value.designation.name =="" || this.employeemapcreate.value.designation.name ==''){
        this.notification.showError('Please Select The Designation');
        return false;
      }
      if(this.employeemapcreate.get('orderno').value ==undefined || this.employeemapcreate.get('orderno').value =="" || this.employeemapcreate.get('orderno').value ==''){
        this.notification.showError('Please Enter The Orderno');
        return false;
      }
      
  
  
      let data:any={
        "grade":this.employeemapcreate.get('grade').value,
        "designation": this.employeemapcreate.get('designation').value.name, 
        "orderno":this.employeemapcreate.get('orderno').value,
        "status":1
        
      }
  
  
      this.taService.createemployeemapping(data)
      .subscribe(res=>{
        if (res.code === "UNEXPECTED_ERROR" || res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" || res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else{
        this.notification.showSuccess("Successfully  Created")
        this.closebutton.nativeElement.click();
        this.getemployeemappingsummary(this.currentpage);
        this.onSubmit.emit();
        return true
        }
      })
    }
    OnCancelclick(){
      this.onCancel.emit()
      this.router.navigateByUrl('ta/ta_master');
    }
   
  
    
   
    autocompletedesignation(){
      console.log('second');
      setTimeout(()=>{
        if(this.matdesnAutocomplete1 && this.autocompleteTrigger && this.matdesnAutocomplete1.panel){
          fromEvent(this.matdesnAutocomplete1.panel.nativeElement,'scroll').pipe(
            map(x=>this.matdesnAutocomplete1.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          ).subscribe(
            x=>{
              const scrollTop=this.matdesnAutocomplete1.panel.nativeElement.scrollTop;
              const scrollHeight=this.matdesnAutocomplete1.panel.nativeElement.scrollHeight;
              const elementHeight=this.matdesnAutocomplete1.panel.nativeElement.clientHeight;
              const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
              if(atBottom){
               if(this.has_desnext){
                 
                this.taService.getDesignationSearch(this.employeemapcreate.get('designation').value,this.has_despresentpage+1).subscribe((data:any)=>{
                   let dear:any=data['data'];
                   console.log('second');
                   let pagination=data['pagination']
                   this.designationList=this.designationList.concat(dear);
                   if(this.designationList.length>0){
                     this.has_desnext=pagination.has_next;
                     this.has_desprevious=pagination.has_previous;
                     this.has_despresentpage=pagination.index;
                   }
                 })
               }
              }
            }
          )
        }
      })
    }
    autocompletesearchdesignation(){
      console.log('second');
      setTimeout(()=>{
        if(this.matdesnAutocomplete && this.autocompleteTrigger && this.matdesnAutocomplete.panel){
          fromEvent(this.matdesnAutocomplete.panel.nativeElement,'scroll').pipe(
            map(x=>this.matdesnAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          ).subscribe(
            x=>{
              const scrollTop=this.matdesnAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight=this.matdesnAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight=this.matdesnAutocomplete.panel.nativeElement.clientHeight;
              const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
              if(atBottom){
               if(this.has_desnext){
                 
                this.taService.getDesignationSearch(this.employeemappingSearchForm.get('designation').value,this.has_despresentpage+1).subscribe(data=>{
                   this.has_despresentpage ++;
                   let dear=data['data'];
                   console.log('second');
                   let pagination=data['pagination']
                   this.searchdesignationList=this.searchdesignationList.concat(dear);
                   if(this.searchdesignationList.length>0){
                     this.has_desnext=pagination.has_next;
                     this.has_desprevious=pagination.has_previous;
                     this.has_despresentpage=pagination.index;
                   }
                 })
               }
              }
            }
          )
        }
      })
    }
    autocomplete_edit_designation(){
      console.log('second');
      setTimeout(()=>{
        if(this.matdesnAutocomplete2 && this.autocompleteTrigger && this.matdesnAutocomplete2.panel){
          fromEvent(this.matdesnAutocomplete2.panel.nativeElement,'scroll').pipe(
            map(x=>this.matdesnAutocomplete2.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          ).subscribe(
            x=>{
              const scrollTop=this.matdesnAutocomplete2.panel.nativeElement.scrollTop;
              const scrollHeight=this.matdesnAutocomplete2.panel.nativeElement.scrollHeight;
              const elementHeight=this.matdesnAutocomplete2.panel.nativeElement.clientHeight;
              const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
              if(atBottom){
               if(this.has_desnext){
                 
                this.taService.getDesignationSearch(this.employeemappingSearchForm.get('designation').value,this.has_despresentpage+1).subscribe((data:any)=>{
                   let dear:any=data['data'];
                   console.log('second');
                   let pagination=data['pagination']
                   this.editdesignationList=this.editdesignationList.concat(dear);
                   if(this.editdesignationList.length>0){
                     this.has_desnext=pagination.has_next;
                     this.has_desprevious=pagination.has_previous;
                     this.has_despresentpage=pagination.index;
                   }
                 })
               }
              }
            }
          )
        }
      })
    }
  
  }
   
  
  
  
