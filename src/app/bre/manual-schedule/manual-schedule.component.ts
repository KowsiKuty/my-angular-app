import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators,FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../service/shared.service';
import { BreShareServiceService } from '../bre-share-service.service';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { BreApiServiceService } from '../bre-api-service.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import {PageEvent} from '@angular/material/paginator'
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlingService } from '../error-handling-service.service';
export interface exptypelistss {
  id: string;
  expense_name: string;
}
export interface commoditylistss {
  id: string;
  text: string;
}
export interface branch{
  id:string;
  name:string;
  code:string;
}
export interface SupplierName {
  id: number;
  name: string;
}
@Component({
  selector: 'app-manual-schedule',
  templateUrl: './manual-schedule.component.html',
  styleUrls: ['./manual-schedule.component.scss']
})
export class ManualScheduleComponent implements OnInit {

   AP_Sub_Menu_List: any;
   sub_module_url: any;
   expencecreate:boolean;
   expencecreatesummary:any;
   expencecreatePath:any;
   expencecreatePathForm:boolean;
   branchExpenseApprovePath:boolean;
   bretoEcfPath:boolean;
   claimMakerSummaryPath:boolean;
   ManualSchedulePath:boolean;
   schedulerForm:boolean;
   claimMakerPath:boolean;
   branchexpencecreate:any;
   branchexpencePathForm:boolean
   branchexpenceApproveSummaryForm:boolean;
   bretoEcfSummaryForm:boolean;
   bretoEcfViewForm : boolean;
   claimMakerForm : boolean;
   
   branchexpencePath:any;
   brExpCreatePath  = false
   brExpApproveForm = false
   brExpViewForm = false
   brExpApproveSearchFrm : FormGroup;
   bretoEcfSearchFrm : FormGroup;
 
   isLoading:boolean=false;
   expenseTypeList : any
   supplierNameData: any;
   suplist: any
   branchList: Array<any>=[];
   has_branchnext:boolean=true;
   has_branchprevious:boolean=false;
   has_branchpresentpage:number=1;
   has_next = true;
   has_previous = true;
   currentpage: number = 1;
   @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
   @ViewChild('exptype') matexpAutocomplete: MatAutocomplete;
   @ViewChild('exptypeInput') exptypeInput: any;
   @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
   @ViewChild('suppInput') suppInput: any;
   @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
   @ViewChild('branchidInput') branchidInput: any;
 
 
   brexpSearchFrm:FormGroup;
   constructor(private fb: FormBuilder, private sharedService: SharedService, private shareservice : BreShareServiceService, private toastr:ToastrService,
     private SpinnerService: NgxSpinnerService, private breapiservice:BreApiServiceService,public datepipe: DatePipe,
     private errorHandler : ErrorHandlingService, private notification : NotificationService) { }
 
   ngOnInit(): void {
     let datas = this.sharedService.menuUrlData;
 
    
     datas.forEach((element) => {
       console.log(element)
       let subModule = element.submodule;
       if (element.name === "Branch Recurring Expense") {
         this.AP_Sub_Menu_List = subModule;
         console.log("AP_Sub_Menu_List", this.AP_Sub_Menu_List)
       }
     });
 
     this.brExpApproveSearchFrm = this.fb.group({
       expense_type_id:[''],
       branch_id: [''],
       supplier_id:[''],
       from_date:[''],
       to_date:[''],
     })
 
     this.bretoEcfSearchFrm = this.fb.group({
       branch:[''],
       supplier_id:[''],
       status:[''],
     })
     this.brexpSearchFrm = this.fb.group({
       expense_type_id:[''],
       branch_id: [''],
       supplier_id:[''],
       from_date:[''],
       to_date:[''],
     })
       this.brexpSearchFrm.get('supplier_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
         }),
         switchMap(value => this.breapiservice.getsuppliernamescroll(this.suplist, value, 1)
           .pipe(
             finalize(() => {
               this.isLoading = false
             }),
           )
         )
       )
       .subscribe((results: any[]) => {
         let datas = results["data"];
         this.supplierNameData = datas;
       })
   
       this.brexpSearchFrm.get('branch_id').valueChanges.pipe(
         tap(()=>{
           this.isLoading=true;
         }),
         switchMap((value:any)=>this.breapiservice.getAMBranchdropdown(1,value).pipe(
           finalize(()=>{
             this.isLoading=false;
           })
         ))
       ).subscribe(data=>{
         this.branchList=data['data'];
       });
   
       this.brexpSearchFrm.get('expense_type_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
           // console.log('inside tap')
   
         }),
   
         switchMap(value => this.breapiservice.getexptypedropdown(this.exptypeInput.nativeElement.value== '' ? {}:{'expense_name':this.exptypeInput.nativeElement.value},1)
           .pipe(
             finalize(() => {
               this.isLoading = false
             }),
           )
         )
       )
       .subscribe((results: any[]) => {
         let datas = results["data"];
         this.expenseTypeList = datas;
        
       })
     this.breapiservice.getexptypedropdown({},1).subscribe((results) => {
       this.expenseTypeList=results['data'].filter(x=>x.status ==1)
       console.log("expenseTypeList",this.expenseTypeList)
     })
     this.getsuppliername(this.suplist, "");
     this.breapiservice.getAMBranchdropdown(1,'').subscribe(data=>{
       this.branchList=data['data'];
     });
     this.brExpApproveSearchFrm.get('supplier_id').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
       }),
       switchMap(value => this.breapiservice.getsuppliernamescroll(this.suplist, value, 1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.supplierNameData = datas;
     })
 
     this.brExpApproveSearchFrm.get('branch_id').valueChanges.pipe(
       tap(()=>{
         this.isLoading=true;
       }),
       switchMap((value:any)=>this.breapiservice.getAMBranchdropdown(1,value).pipe(
         finalize(()=>{
           this.isLoading=false;
         })
       ))
     ).subscribe(data=>{
       this.branchList=data['data'];
     });
 
     this.brExpApproveSearchFrm.get('expense_type_id').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
         // console.log('inside tap')
 
       }),
 
       switchMap(value => this.breapiservice.getexptypedropdown(this.exptypeInput.nativeElement.value== '' ? {}:{'expense_name':this.exptypeInput.nativeElement.value},1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.expenseTypeList = datas;
      
     })
 
     this.bretoEcfSearchFrm.get('supplier_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
         }),
         switchMap(value => this.breapiservice.getsuppliernamescroll(this.suplist, value, 1)
           .pipe(
             finalize(() => {
               this.isLoading = false
             }),
           )
         )
       )
       .subscribe((results: any[]) => {
         let datas = results["data"];
         this.supplierNameData = datas;
       })
   
     this.bretoEcfSearchFrm.get('branch').valueChanges.pipe(
         tap(()=>{
           this.isLoading=true;
         }),
         switchMap((value:any)=>this.breapiservice.getAMBranchdropdown(1,value).pipe(
           finalize(()=>{
             this.isLoading=false;
           })
         ))
       ).subscribe(data=>{
         this.branchList=data['data'];
       });
 
     this.getBranchExpense(1)
     this.getstatus()
     this.employee_permission()
   }
     
   statuslist: any
   getstatus(){
     this.breapiservice.getstatus().subscribe(result=>{
       this.statuslist = result['data']
     })
   }
   getsuppliername(id, suppliername) {
     this.breapiservice.getsuppliername(id, suppliername)
       .subscribe((results) => {
         let datas = results["data"];
         this.supplierNameData = datas;
 
       })
 
   }
   supplierScroll() {
     setTimeout(() => {
       if (
         this.matsupAutocomplete &&
         this.matsupAutocomplete &&
         this.matsupAutocomplete.panel
       ) {
         fromEvent(this.matsupAutocomplete.panel.nativeElement, 'scroll')
           .pipe(
             map(x => this.matsupAutocomplete.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = this.matsupAutocomplete.panel.nativeElement.scrollTop;
             const scrollHeight = this.matsupAutocomplete.panel.nativeElement.scrollHeight;
             const elementHeight = this.matsupAutocomplete.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_next === true) {
                 this.breapiservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, this.currentpage + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     if (this.supplierNameData.length >= 0) {
                       this.supplierNameData = this.supplierNameData.concat(datas);
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
 
   claimAppr= false
   APSubModule(data) {
     this.pageIndex = 0
 
     this.sub_module_url = data.url;
     console.log(this.sub_module_url )
     this.expencecreatesummary = "/expense_create"
     this.branchexpencecreate = "/branch_expense_create"
     
     this.expencecreatePathForm = false;
     this.branchexpencePathForm = false;
     this.brExpApproveForm =false
     this.brExpCreatePath =false
     this.branchexpenceApproveSummaryForm = false
     this.brExpViewForm =false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     
     this.expencecreatePath = this.expencecreatesummary === this.sub_module_url ? true : false;
     this.branchexpencePath = this.branchexpencecreate === this.sub_module_url ? true : false;
     this.branchExpenseApprovePath = "/expenseapprove" === this.sub_module_url ? true : false;
     this.bretoEcfPath = "/bretoecf" === this.sub_module_url ? true : false;
     this.claimMakerSummaryPath = "/bretoecfmaker" === this.sub_module_url ? true : false;
     this.ManualSchedulePath = "/expenseschedulesummary" === this.sub_module_url ? true : false;
     if (this.expencecreatePath) {
       this.schedulerForm = false;
       this.expencecreatePathForm = true
       this.branchexpencePathForm = false
       this.brExpApproveForm =false
       this.brExpCreatePath =false
       this.branchexpenceApproveSummaryForm = false
       this.brExpViewForm =false
       this.bretoEcfSummaryForm = false 
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
     }
     else if (this.ManualSchedulePath) {
       this.expencecreatePathForm = false;
       this.schedulerForm = true;
       this.branchexpencePathForm = false
       this.brExpApproveForm =false
       this.brExpCreatePath =false
       this.branchexpenceApproveSummaryForm = false
       this.brExpViewForm =false
       this.bretoEcfSummaryForm = false 
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
     }
     else if(this.branchexpencePath)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = true
       this.brExpApproveForm =false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = false
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
 
       this.getBranchExpense(1)
     }
     else if(this.branchExpenseApprovePath)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.branchexpenceApproveSummaryForm = true
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm =false
       this.bretoEcfSummaryForm = false
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
       
       this.shareservice.approveComeFrom.next("Approve")
       this.getbrExpApprove(1)
     }
 
     else if(this.bretoEcfPath)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpApproveForm =false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = true
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
       this.claimAppr= true
       this.getbretoEcf(1)
     } else if(this.claimMakerSummaryPath)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpApproveForm =false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = true
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
       this.claimAppr= false
       
       this.getbretoEcf(1)
     }
   }
 
 
   public displayFnexptype(exptype?: exptypelistss): string | undefined {
     return exptype ? exptype.expense_name : undefined;
   }
   
   currentpageexp:any=1
   has_previousexp:any;
   has_nextexp:any= true
   exptypeScroll() {
     setTimeout(() => {
       if (
         this.matexpAutocomplete &&
         this.matexpAutocomplete &&
         this.matexpAutocomplete.panel
       ) {
         fromEvent(this.matexpAutocomplete.panel.nativeElement, 'scroll')
           .pipe(
             map(x => this.matexpAutocomplete.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = this.matexpAutocomplete.panel.nativeElement.scrollTop;
             const scrollHeight = this.matexpAutocomplete.panel.nativeElement.scrollHeight;
             const elementHeight = this.matexpAutocomplete.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextexp === true) {
                 this.breapiservice.getexptypedropdown(this.exptypeInput.nativeElement.value == '' ? {} : {expense_name : this.exptypeInput.nativeElement.value}, this.currentpageexp + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     if (this.expenseTypeList.length >= 0) {
                       this.expenseTypeList = this.expenseTypeList.concat(datas);
                       this.has_nextexp = datapagination.has_next;
                       this.has_previousexp = datapagination.has_previous;
                       this.currentpageexp = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
   }
 
   public displayFn(Suppliertype?: SupplierName): string | undefined {
     return Suppliertype ? Suppliertype.name : undefined;
   }
   public displaytest(SupplierName?: SupplierName): string | undefined {
     return SupplierName ? SupplierName.name : undefined;
   }
 
   public branchintreface(data?:branch):string | undefined{
     return data?data.code +' - '+data.name:undefined;
   }
 
   autocompletebranchname(){
     console.log('second');
     setTimeout(()=>{
       if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
         fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
           map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         ).subscribe(
           x=>{
             const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
             const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
             const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
             const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
             if(atBottom){
              if(this.has_branchnext){
                
               this.breapiservice.getAMBranchdropdown( this.has_branchpresentpage+1,this.brExpApproveSearchFrm.get('branch_id').value).subscribe((data:any)=>{
                  let dear:any=data['data'];
                  console.log('second');
                  let pagination=data['pagination']
                  this.branchList=this.branchList.concat(dear);
                  if(this.branchList.length>0){
                    this.has_branchnext=pagination.has_next;
                    this.has_branchprevious=pagination.has_previous;
                    this.has_branchpresentpage=pagination.index;
                  }
                })
              }
             }
           }
         )
       }
     })
   }
   kyenbdata(event:any){
     let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
     console.log(d.test(event.key))
     if(d.test(event.key)==true){
       return false;
     }
     return true;
   }
   branchexpAppList: any
   has_nextbrexpApp = true;
   has_previousbrexpApp = true;
   isbrexpApppage: boolean = true;
   presentpagebrexpApp: number = 1;
   getbrExpApprove(page)
   {
     this.pageIndex = 0
     let data: any ={}
     
     if(this.brExpApproveSearchFrm?.value.expense_type_id.id != undefined && this.brExpApproveSearchFrm?.value.expense_type_id.id != null && this.brExpApproveSearchFrm?.value.expense_type_id.id != "")
       data.expense_type_id =this.brExpApproveSearchFrm?.value.expense_type_id.id
     if(this.brExpApproveSearchFrm?.value.supplier_id.id != undefined && this.brExpApproveSearchFrm?.value.supplier_id.id != null && this.brExpApproveSearchFrm?.value.supplier_id.id != "")
       data.supplier_id =this.brExpApproveSearchFrm?.value.supplier_id.id
     if(this.brExpApproveSearchFrm?.value.branch_id.id != undefined && this.brExpApproveSearchFrm?.value.branch_id.id != null && this.brExpApproveSearchFrm?.value.branch_id.id != "")
       data.branch_id =this.brExpApproveSearchFrm?.value.branch_id.id
     if(this.brExpApproveSearchFrm?.value.from_date != undefined && this.brExpApproveSearchFrm?.value.from_date != null && this.brExpApproveSearchFrm?.value.from_date != "")
       data.from_date =this.datepipe.transform(this.brExpApproveSearchFrm?.value.from_date ,'yyyy-MM-dd')  
     if(this.brExpApproveSearchFrm?.value.to_date != undefined && this.brExpApproveSearchFrm?.value.to_date != null && this.brExpApproveSearchFrm?.value.to_date != "")
       data.to_date =this.datepipe.transform(this.brExpApproveSearchFrm?.value.to_date ,'yyyy-MM-dd')
 
     this.breapiservice.getBrExpenseApprovalSummary(data,page).subscribe((results: any[]) => {
       let datas = results["data"];
       console.log("Branch Expense",datas)
       this.branchexpAppList=datas
       if (this.branchexpAppList?.length > 0) {
       this.length_brexpApp = results['count'];
       this.has_nextbrexpApp = results['pagination']?.has_next;
         this.has_previousbrexpApp = results['pagination']?.has_previous;
         this.presentpagebrexpApp = results['pagination']?.index;
         this.isbrexpApppage = true
       }
       else
       {
       this.length_brexpApp = 0;
       this.isbrexpApppage = false
       }
     })
   }
 
   length_brexpApp = 0;
   pageIndex = 0;
   pageSizeOptions = [5, 10, 25];
   pageSize_brexpApp=10;
   showFirstLastButtons:boolean=true;
   handleApprovePageEvent(event: PageEvent) {
       this.length_brexpApp = event.length;
       this.pageSize_brexpApp = event.pageSize;
       this.pageIndex = event.pageIndex;
       this.presentpagebrexpApp=event.pageIndex+1;
       this.getbrExpApprove(this.presentpagebrexpApp)
       
     }
 
   nextClickbrexpApp() {
     if (this.has_nextbrexpApp === true) {
      this.presentpagebrexpApp=this.presentpagebrexpApp + 1;
      this.getbrExpApprove(this.presentpagebrexpApp);
     }
   }
   
   previousClickbrexpApp() {
     if (this.has_previousbrexpApp === true) {
       this.presentpagebrexpApp=this.presentpagebrexpApp - 1;
       this.getbrExpApprove(this.presentpagebrexpApp);
     }
   }
   
   resetsearchApp()
   {
     this.brExpApproveSearchFrm.controls['from_date'].reset(""),
     this.brExpApproveSearchFrm.controls['to_date'].reset(""),
     this.brExpApproveSearchFrm.controls['supplier_id'].reset(""),
     this.brExpApproveSearchFrm.controls['branch_id'].reset(""),
     this.brExpApproveSearchFrm.controls['expense_type_id'].reset(""),
     this.pageIndex = 0
     this.getbrExpApprove(1);
   }
 
   viewApproveBacks()
   {
     this.expencecreatePathForm = false
     this.branchexpencePathForm = false
     this.brExpCreatePath =false
     this.brExpApproveForm =false
     this.branchexpenceApproveSummaryForm = true
     this.brExpViewForm =false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
     
     this.getbrExpApprove(1);
   }
 
   viewBacks()
   {
     this.expencecreatePathForm = false
     this.schedulerForm = false;
     this.branchexpencePathForm = true
     this.brExpCreatePath =false
     this.brExpApproveForm =false
     this.brExpViewForm =false
     this.branchexpenceApproveSummaryForm = false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
     
     this.getBranchExpense(1);
   }
 
   showview(exp)
   {
     this.expencecreatePathForm = false
     this.schedulerForm = false;
     this.branchexpencePathForm = false
     this.brExpCreatePath =false
     this.brExpViewForm =true
     this.brExpApproveForm = false
     this.branchexpenceApproveSummaryForm = false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
     
     this.shareservice.brexpid.next(exp?.id)
     this.shareservice.approveComeFrom.next("Create")
 
   }
   showApproveView(exp)
   {
     this.expencecreatePathForm = false
     this.schedulerForm = false;
     this.branchexpencePathForm = false
     this.brExpCreatePath =false
     this.brExpViewForm =false
     this.brExpApproveForm = true
     this.branchexpenceApproveSummaryForm = false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
     
     this.shareservice.brexpid.next(exp?.id)
     this.shareservice.approveComeFrom.next("Approve")
 
   }
 
 
 
   branchexpList: any
   has_nextbrexp = true;
   has_previousbrexp = true;
   isbrexppage: boolean = true;
   presentpagebrexp: number = 1;
   getBranchExpense(page)
   {
     this.pageIndex = 0
     let data: any ={}
     
     if(this.brexpSearchFrm?.value.expense_type_id.id != undefined && this.brexpSearchFrm?.value.expense_type_id.id != null && this.brexpSearchFrm?.value.expense_type_id.id != "")
       data.expense_type_id =this.brexpSearchFrm?.value.expense_type_id.id
     if(this.brexpSearchFrm?.value.supplier_id.id != undefined && this.brexpSearchFrm?.value.supplier_id.id != null && this.brexpSearchFrm?.value.supplier_id.id != "")
       data.supplier_id =this.brexpSearchFrm?.value.supplier_id.id
     if(this.brexpSearchFrm?.value.branch_id.id != undefined && this.brexpSearchFrm?.value.branch_id.id != null && this.brexpSearchFrm?.value.branch_id.id != "")
       data.branch_id =this.brexpSearchFrm?.value.branch_id.id
     if(this.brexpSearchFrm?.value.from_date != undefined && this.brexpSearchFrm?.value.from_date != null && this.brexpSearchFrm?.value.from_date != "")
       data.from_date =this.datepipe.transform(this.brexpSearchFrm?.value.from_date ,'yyyy-MM-dd')  
     if(this.brexpSearchFrm?.value.to_date != undefined && this.brexpSearchFrm?.value.to_date != null && this.brexpSearchFrm?.value.to_date != "")
       data.to_date =this.datepipe.transform(this.brexpSearchFrm?.value.to_date ,'yyyy-MM-dd')
 
     this.SpinnerService.show()
     this.breapiservice.scheduler_summary(data,page).subscribe((results: any[]) => {
       let datas = results["data"];
       console.log("Branch Expense",datas)
       this.branchexpList=results["data"];
       this.SpinnerService.hide()
       if (this.branchexpList?.length > 0) {
         this.length_brexp=results['count'];
         this.has_nextbrexp = results['pagination']?.has_next;
         this.has_previousbrexp = results['pagination']?.has_previous;
         this.presentpagebrexp = results['pagination']?.index;
         this.isbrexppage = true

         this.branchexpList.forEach(item => {
          item.isSelected = this.selectedItems.has(item.id);
        });
  
        // Check if all items on the page are selected
        this.masterSelected = this.branchexpList.every(item => this.selectedItems.has(item.id));
       }
       else
       {
         this.length_brexp=0;
         this.isbrexppage = false
       }
     })
   }
   length_brexp = 0;
   
   pageSize_brexp=10;
   handlebrexpSearchPageEvent(event: PageEvent) {
       this.length_brexp = event.length;
       this.pageSize_brexp = event.pageSize;
       this.pageIndex = event.pageIndex;
       this.presentpagebrexp=event.pageIndex+1;
       this.getBranchExpense(this.presentpagebrexp)
       
     }
   
   resetsearch()
   {
     this.brexpSearchFrm.controls['expense_type_id'].reset(""),
     this.brexpSearchFrm.controls['supplier_id'].reset(""),
     this.brexpSearchFrm.controls['branch_id'].reset(""),
     this.brexpSearchFrm.controls['from_date'].reset(""),
     this.brexpSearchFrm.controls['to_date'].reset(""),
     this.pageIndex = 0
     this.getBranchExpense(1);
   }
 
   
   chngStatBrexp(data) { 
     var answer = window.confirm("Do you delete the Branch Expense?");
     if (!answer) {
       return false;
     }
     console.log("act",data)
     this.SpinnerService.show();
     this.breapiservice.brexpActInact(data.id).subscribe((results: any[]) => {
      console.log("actinactexp",results)
      if(results['status'] == "success")
      {
        this.SpinnerService.hide();
          this.getBranchExpense(this.presentpagebrexp)
          this.toastr.success('Successfully Updated')
      }
      else
      {
        this.SpinnerService.hide();
        this.getBranchExpense(this.presentpagebrexp)
        this.toastr.success('Successfully Updated')
      }
    })
    }
 
    addBranchExp()
    {
     this.expencecreatePathForm = false
     this.schedulerForm = false;
     this.branchexpencePathForm = false
     this.brExpCreatePath =true
     this.brExpApproveForm =false
     this.brExpViewForm =false
     this.branchexpenceApproveSummaryForm = false
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
   }
 
    brexpCreateBacks()
    {
     this.expencecreatePathForm = false
     this.schedulerForm = false;
     this.branchexpencePathForm = true
     this.brExpCreatePath =false
     this.brExpApproveForm =false
     this.brExpViewForm =false
     this.branchexpenceApproveSummaryForm = false
     this.getBranchExpense(1);
     this.bretoEcfSummaryForm = false
     this.bretoEcfViewForm = false
     this.claimMakerForm = false
 
    }
 
 
    bretoEcfList: any
    has_nextbretoEcf = true;
    has_previousbretoEcf = true;
    isbretoEcfpage: boolean = true;
    presentpagebretoEcf: number = 1;
    getbretoEcf(page)
    {
     this.pageIndex = 0
     let data: any ={}
      
      if(this.bretoEcfSearchFrm?.value.supplier_id != undefined && this.bretoEcfSearchFrm?.value.supplier_id != null && this.bretoEcfSearchFrm?.value.supplier_id != "")
        data.supplier_id =this.bretoEcfSearchFrm?.value.supplier_id?.id
      if(this.bretoEcfSearchFrm?.value.branch != undefined && this.bretoEcfSearchFrm?.value.branch != null && this.bretoEcfSearchFrm?.value.branch != "")
        data.branch =this.bretoEcfSearchFrm?.value.branch?.id
      if(this.claimAppr== false &&this.bretoEcfSearchFrm?.value.status != undefined && this.bretoEcfSearchFrm?.value.status != null && this.bretoEcfSearchFrm?.value.status != "")
         data.status =this.bretoEcfSearchFrm?.value.status
      if(this.claimAppr== true)
       data.type= "approver"
      this.breapiservice.getBretoEcfSummary(data,page,'').subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("Bre to ECF",datas)
        this.bretoEcfList=datas
        if (this.bretoEcfList?.length > 0) {
        this.length_bretoEcf = results['count'];
        this.has_nextbretoEcf = results['pagination']?.has_next;
          this.has_previousbretoEcf = results['pagination']?.has_previous;
          this.presentpagebretoEcf = results['pagination']?.index;
          this.isbretoEcfpage = true
        }
        else
        {
        this.length_bretoEcf = 0;
        this.isbretoEcfpage = false
        }
      })
    }
  
    length_bretoEcf = 0;
    pageSize_breetoEcf=10;
    handleBretoEcfPageEvent(event: PageEvent) {
        this.length_bretoEcf = event.length;
        this.pageSize_breetoEcf = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.presentpagebretoEcf=event.pageIndex+1;
        this.getbretoEcf(this.presentpagebretoEcf)
        
      } 
   
      resetbretoEcf()
      {
        this.bretoEcfSearchFrm.controls['supplier_id'].reset(""),
        this.bretoEcfSearchFrm.controls['branch'].reset(""),
        this.bretoEcfSearchFrm.controls['status'].reset(""),
     this.pageIndex = 0
     this.getbretoEcf(1);
      }
    
      
     showBretoEcfView(data)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm = false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = false
       this.bretoEcfViewForm = true
       this.claimMakerForm = false
       this.shareservice.bretoecfid.next(data?.id)
     }
 
     showExpenseMakerView(data)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm = false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = false
       this.bretoEcfViewForm = false
       this.claimMakerForm = true
       this.shareservice.bretoecfid.next(data?.id)
       this.shareservice.bretoecfViewOrEdit.next("view")
     }
 
     bretoEcfBacks()
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm = false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = true
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
       this.claimAppr = true
       this.resetbretoEcf()
     }
 
     showExpenseMakerEdit(data)
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm = false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = false
       this.bretoEcfViewForm = false
       this.claimMakerForm = true
       this.shareservice.bretoecfid.next(data?.id)
       this.shareservice.bretoecfViewOrEdit.next("edit")
       
     }
     expMakerBacks()
     {
       this.expencecreatePathForm = false
       this.schedulerForm = false;
       this.branchexpencePathForm = false
       this.brExpCreatePath =false
       this.brExpViewForm =false
       this.brExpApproveForm = false
       this.branchexpenceApproveSummaryForm = false
       this.bretoEcfSummaryForm = true
       this.bretoEcfViewForm = false
       this.claimMakerForm = false
       this.claimAppr = false
       this.resetbretoEcf()
     }
 
 
  claimCancel(id) {
   if(window.confirm("Are sure to Cancel the Claim"))
   {
   let data = {'id': id, 'remark':'cancelled'}
  
   this.breapiservice.claim_cancel(data)
     .subscribe((results: any[]) => {
       if(results['status'] == 'success')
       {
         this.getbretoEcf(this.presentpagebretoEcf)
         this.notification.showSuccess('Cancelled Successfully.')
       }
       else
       {
         this.notification.showError(results['message'])
       }
     })
   }
   else
   {
     return false
   }
 }
 
 
 
 coverNotedownload(id, ecftypeid) {
   this.SpinnerService.show()
   if (ecftypeid != 4) {
     this.breapiservice.brecoverNotedownload(id)
       .subscribe((results) => {
 
         let binaryData = [];
         binaryData.push(results)
         let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
         let link = document.createElement('a');
         link.href = downloadUrl;
         link.download = "BREClaimForm.pdf";
         link.click();
         this.SpinnerService.hide()
       },
         error => {
           this.errorHandler.handleError(error);
           this.SpinnerService.hide();
         }
 
       )
   } else {
 
     this.breapiservice.coverNoteadvdownload(id)
       .subscribe((results) => {
 
         let binaryData = [];
         binaryData.push(results)
         let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
         let link = document.createElement('a');
         link.href = downloadUrl;
         link.download = "BREClaimForm.pdf";
         link.click();
         this.SpinnerService.hide()
       },
         error => {
           this.errorHandler.handleError(error);
           this.SpinnerService.hide();
         }
 
       )
   }
 }
   
 manual_scheduler = false
 employee_permission()
   {
      this.breapiservice.employee_permission().subscribe((results: any[]) => {
       let datas = results;
       let flag = datas.filter(x => x== "BRE Schedule Maker")
       if (flag.length > 0) {
         this.manual_scheduler = true
       }
       else
       {
         this.manual_scheduler = false
       }
     })
   }
   headerids:any=[]
   bank_id:any
   manual_sch_run()
   {
    
    if(this.checkedList.length<0){
      this.notification.showError("Please Select atleast one row!")
      this.SpinnerService.hide()
      return false
    }
     this.SpinnerService.show();
      let data = {
        "id_list" : this.checkedList
      }
      this.breapiservice.manual_schedule(data).subscribe((results: any[]) => {
       this.SpinnerService.hide();
       if(results['status'] == 'success')
       {
         this.toastr.success(results['message'])
         this.getBranchExpense(1)
         this.checkedList = [];
         this.masterSelected = false;
       }
       else
       {
         this.toastr.error(results['description'])
        //  this.checkedList = [];
        //  this.masterSelected = true;
        //  this.checkUncheckAll();
        //  this.getBranchExpense(1)
       }
     },
     error => {
       this.errorHandler.handleError(error);
       this.SpinnerService.hide();
     }
 )
   }
 
  //  masterSelected: boolean = false;
  //  checklists: any;
   checkedList: any[] = [];
  //  checkUncheckAll() {
  //    for (var i = 0; i < this.branchexpList.length; i++) {
  //      this.branchexpList[i].isSelected = this.masterSelected;
  //      console.log('select all', this.branchexpList[i].isSelected)
  //    }
  //    this.getCheckedItemList();  
  //  }
  //  isAllSelected() {
  //    this.masterSelected = this.branchexpList.every(function (item: any) {
  //      return item.isSelected == true;
  //    })
  //    this.getCheckedItemList();
  //  }
  //  getCheckedItemList() {
  //    this.checkedList = [];
  //    for (var i = 0; i < this.branchexpList.length; i++) {
  //      if (this.branchexpList[i].isSelected)
  //        this.checkedList.push(this.branchexpList[i]);
  //    }
  //    this.checkedList = JSON.stringify(this.checkedList);
  //  }
  masterSelected: boolean = false;
selectedItems: Set<number> = new Set(); // To store selected items globally

// Function to check/uncheck all items
checkUncheckAll() {
  this.masterSelected = !this.masterSelected;

  this.branchexpList.forEach((item: any) => {
    if (this.masterSelected) {
      this.selectedItems.add(item.id);
    } else {
      this.selectedItems.delete(item.id);
    }
    item.isSelected = this.masterSelected;
  });

  this.getCheckedItemList();
}

// Function to handle single selection
toggleSelection(expt: any) {
  if (this.selectedItems.has(expt.id)) {
    this.selectedItems.delete(expt.id);
  } else {
    this.selectedItems.add(expt.id);
  }

  // Check if all items on the page are selected
  this.masterSelected = this.branchexpList.every(item => this.selectedItems.has(item.id));

  this.getCheckedItemList();
}

// Function to update checked items
getCheckedItemList() {
  this.checkedList = Array.from(this.selectedItems);
  console.log("Checked Items:", this.checkedList);
}
   
 }