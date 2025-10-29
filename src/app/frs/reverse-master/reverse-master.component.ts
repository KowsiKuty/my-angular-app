import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { FrsServiceService } from '../frs-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface frs_serv {
  id: number
  name: string
  code:string
  full_name:string
}

@Component({
  selector: 'app-reverse-master',
  templateUrl: './reverse-master.component.html',
  styleUrls: ['./reverse-master.component.scss']
})
export class ReverseMasterComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('branchContactInputs') branchContactInputs: any;
  @ViewChild('branchs') matAutocompletebrachs: MatAutocomplete;
  @ViewChild('branchContact_Input') branchContact_Input: any;
  @ViewChild('matAutocomplete_brach') matAutocomplete_brach: MatAutocomplete;
  @ViewChild('employeeContact_Input') employeeContact_Input: any;
  @ViewChild('matAutocomplete_employee') matAutocomplete_employee: MatAutocomplete;
  @ViewChild('empsumInput') empsumInput: any;
  @ViewChild('emp_mat') emp_mat: MatAutocomplete;
  @ViewChild('empsumInputs') empsumInputs: any;
  @ViewChild('emp_mats') emp_mats: MatAutocomplete;
  reverse_search:FormGroup
  isLoading: boolean;
  expenseList: any;
  currentpage: number;
  has_next: boolean;
  has_previous: boolean;
  reverse_grp:FormGroup
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
  branch_List: any;
  has_next_bra: any;
  has_previous_bra: any;
  currentpage_bra: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  branchList: any;
  gl_mapping:boolean=false;
  reverse_mas:boolean=true;
  flag_list:any[]=[{"id": 2,"name": "Branch Entry"},{"id": 1,"name": "Reverse Branch"}]
  emp_List: any;
  has_next_emp: any;
  has_previous_emp: any;
  currentpage_emp: any;
  empList: any;
  has_nextempsum: boolean;
  has_previousempsum: boolean;
  currentpageempsum: number;
  file: any;
  adding_btn: boolean=false;
  rev_upload_id: any;
  upload_add: boolean;
  File_upload: FormGroup;
  isFileButtonDisabled: boolean = true;
  create_id: any;
  history_data: any;
  datass_found: boolean;
  has_previouss: boolean;
  presentpages: any;
  datass_founds: boolean;
  has_nexts: any;
  reve_pass: any;
  rev_cre: boolean = false;
  reverse_create: FormGroup;
  branchLists: any;
  rev_summery: any;
  edits: boolean;
  expmapping_parm: { branch_code: any; branch_name: any; flag: any; employee_id: any; remarks: any; };
  edit_id: any;
  expmapping_parmss: any;
  empLists: any;
  emp_bra: boolean;
  upload_file: boolean;
  file_upload_datas: any;
  isRemarkDisabled: boolean;
  dow_id: any;
  upload_files: boolean;
  upload_filess: boolean;
  has_previousss: any;
  presentpagess: any;
  has_nextss: boolean;
  datass_foundss: boolean;
  btn_view: boolean=true;
  approve_remark: FormGroup;
  approve_data: any;
  expmapping_parms: any;
  approve_reject: FormGroup;
  reject_data: any;
  maker_approver: boolean;
  Approver_flow: boolean;
  maker_flow: boolean;
  approvepermission: boolean;
  constructor(private errorHandler: ErrorhandlingService,private frombuilder:FormBuilder,private frs_serv:FrsServiceService,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.reverse_search=this.frombuilder.group({
      branch:[''],
      Status:[''],
      employee_search:[''],
      flag_search:['']
    }) 
    this.reverse_create=this.frombuilder.group({
      branchs:[''],
      documentfile:[''],
      flag_searchs:[''],
      remark:[''],
      documentfiles:[''],
      employee_searchs:['']
    })
    this.File_upload=this.frombuilder.group({
      documentfile:[''],
     
    })  
    this.approve_remark=this.frombuilder.group({
      remarkss:[''],
     
    }) 
    this.approve_reject=this.frombuilder.group({
      remarksss:[''],
     
    }) 

    this.reverse_grp=this.frombuilder.group({
      reverse_grp_arry:new FormArray([this.exp_levelrowadd()])
    })
    let id=''
    this.reversa_summary(id)
  }
  exp_levelrowadd(){
    let exp=new FormGroup({
      exp_status:new FormControl(2),
      exp_id:new FormControl(''),
      exp_code:new FormControl(''),
      exp_name:new FormControl(''),
      branch:new FormControl(''),
      isEditable: new FormControl(false),
      flag: new FormControl(''),
      employee: new FormControl(''),
      remarks: new FormControl('')

    }) 
    return exp;
  }
  // reverse_create(){
  //   this.isFileButtonDisabled= true
  //   this.upload_add= true
  //   const form = <FormArray> this.reverse_grp.get('reverse_grp_arry')
  //   for(let valsource of form.value){
  //     console.log("edit",valsource.isEditable)
  //     if(valsource.isEditable==false){
  //       console.log(valsource.isEditable)
  //       this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
  //       return false;
  //     }
  //   }
  //   form.insert(0, this.exp_levelrowadd());
  
  
  //  }

   reverse_creates(){
    this.btn_view= true
    this.edits=false
    this.upload_filess=true
    this.isRemarkDisabled=false
    this.upload_file=true
    this.rev_cre= true
    this.emp_bra=false
    this.upload_files=false
    this.uploadedFiles=[]
    this.reverse_create.reset()
    // this.reverse_create.get('documentfile').reset()
   }


   reversa_summary(explevelid,page=1){
    this.explevel_id=''
    this.reve_pass=explevelid
    console.log("exp=>",explevelid)
    if((this.reverse_search.value.branch=='')||(this.reverse_search.value.branch==undefined)||(this.reverse_search.value.branch==null)){
     this.explevel_id=''
  
    }else{
      if(typeof(this.reverse_search.value.branch)=='object'){
        this.explevel_id=this.reverse_search.value.branch?.code  
      }else{
        this.explevel_id=explevelid  
      }
     
    }
    let status=this.reverse_search.value.Status?.id??""
    let employee_id = this.reverse_search.value.employee_search?.id??""
    let flag = this.reverse_search.value.flag_search?.id??""
    console.log("explevel_id",this.explevel_id)
    this.SpinnerService.show()
    this.frs_serv.reverse_summary_search(this.explevel_id,status,employee_id,flag,page).subscribe(expsummary=>{
    this.SpinnerService.hide()
// let zdhgfh=
      let data=expsummary['data']
      this.rev_summery=data
      let permission=expsummary['permission']
      if (permission.includes("Maker") && permission.includes("Approver")) {
        this.maker_approver = true
  console.log("Both Maker and Approver are present");
}else if (permission.includes("Approver")) {
  console.log("Approver is present");
  this.Approver_flow = true
}else if (permission.includes("Maker")) {
  console.log("Maker is present");
  this.maker_flow=true
}else{
this.maker_flow=false
this.Approver_flow = false
this.maker_approver = false
}

let sessionData = localStorage.getItem('sessionData');
let employee_id
if (sessionData) {
  let employee_code = JSON.parse(sessionData); // Parse the JSON string into an object
  console.log("employee", employee_code.employee_id);
   employee_id = employee_code.employee_id;
  console.log("employee", employee_code.employee_id,employee_id);
} else {
  console.log("No session data found");
}

      if(permission == "Maker"){
        this.adding_btn = true
      }else if(permission == "Approver"){
        this.adding_btn = false
      }
      // let data=[]
      console.log("data=>",data)
      
      this.expencegrpmapping=data
      if(this.expencegrpmapping.length!=0){
        let dataPagination = expsummary['pagination'];
      console.log("dataPagination=>",dataPagination)
      this.has_next_sum = dataPagination.has_next;
      this.has_previous_sum = dataPagination.has_previous;
      this.presentpage_sum = dataPagination.index;
      this.isSummaryPagination = true;
        this.array_hide=false;
this.expencegrpmapping.forEach(item => {
  item.approvepermission = item.createdby == employee_id;
});

        // this.reverse_grp = this.frombuilder.group({
        //   reverse_grp_arry: this.frombuilder.array(
        //     this.expencegrpmapping.map(val =>
        //       this.frombuilder.group({
        //         exp_status:new FormControl(val.status),
        //         exp_id:new FormControl(val.id),
        //         exp_code:new FormControl(val.code),
        //         exp_name:new FormControl(val.name),
        //         branch:new FormControl(val.branch),
        //         flag:new FormControl(val.flag),
        //         employee:new FormControl(val.employee),
        //         isEditable: new FormControl(true),
        //       })
        //     )
        //   ) 
        // });
        console.log("reverse_grp=>",this.reverse_grp)
       
      }
      else{
        this.toastr.warning("","No Data Found" ,{timeOut:1200})
        this.array_hide=true
        let dataPagination = expsummary['pagination'];
      console.log("dataPagination=>",dataPagination)
      this.has_next_sum = false;
      this.has_previous_sum = false;
      this.presentpage_sum = 1;
        // this.expencegrpmapping=[]
        // this.reverse_grp.reset()
        // this.reverse_grp.get('reverse_grp_arry').reset();
      }
    })
   }
   approve_rec(data){
    console.log(data)
    this.approve_data=data
    this.approve_remark.reset()
   }
   reject_rec(data){
    console.log(data)
    this.reject_data=data
    this.approve_reject.reset()

   }
   previousClick(){
    if (this.has_previous_sum === true) {
         
      this.currentpage = this.presentpage_sum - 1
      this.reversa_summary(this.explevel_id,this.presentpage_sum - 1)
    }
  }
  previousClicks() {
    if (this.has_previouss === true) {
      this.History_fetch("",this.presentpagess - 1);
    }
  }
  nextClicks() { 
    if (this.has_nexts === true) {
      this.History_fetch("",this.presentpagess + 1)
    }
  }
  nextClick(){
    if (this.has_next_sum === true) {
         
      this.currentpage = this.presentpage_sum + 1
      this.reversa_summary(this.explevel_id,this.presentpage_sum + 1)
    }
  }

  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.reverse_search.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  private getbranchid(prokeyvalue) {
    this.frs_serv.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  autocompletebranchnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.frs_serv.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
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

  branch_name(ind) {
    let prokeyvalue: String = "";
    this.getbranch_id(prokeyvalue);
    var arrayControl = this.reverse_grp.get('reverse_grp_arry') as FormArray;
    let item = arrayControl.at(ind);
    item.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_List = datas;

      })
  }

  private getbranch_id(prokeyvalue) {
    this.frs_serv.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_List = datas;

      })
  }

  autocompletebranch_nameScroll() {
    this.has_next_bra = true
    this.has_previous_bra = true
    this.currentpage_bra = 1
    setTimeout(() => {
      if (
        this.matAutocomplete_brach &&
        this.autocompleteTrigger &&
        this.matAutocomplete_brach.panel
      ) {
        fromEvent(this.matAutocomplete_brach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocomplete_brach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocomplete_brach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete_brach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete_brach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_bra === true) {
                this.frs_serv.getbranchdropdown(this.branchContact_Input.nativeElement.value, this.currentpage_bra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_List = this.branch_List.concat(datas);
                    if (this.branch_List.length >= 0) {
                      this.has_next_bra = datapagination.has_next;
                      this.has_previous_bra = datapagination.has_previous;
                      this.currentpage_bra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displaybranch(branch?: frs_serv): string | undefined {
    return branch ? branch.code +"-"+ branch.name  : undefined;
  }
  public displaybranchs(branchs?: frs_serv): string | undefined {
    return branchs ? branchs.code +"-"+ branchs.name  : undefined;
  }
  public display_branch(branch_name?: frs_serv): string | undefined {
    return branch_name ? branch_name.code+"-"+branch_name.name : undefined;
  }
  public display_flag(branch_name?: frs_serv): string | undefined {
    return branch_name ? branch_name.name : undefined;
  }
  public display_employee(branch_name?: frs_serv): string | undefined {
    return branch_name ? branch_name.code+"-"+branch_name.full_name : undefined;
  }
  public display_employees(branch_name?: frs_serv): string | undefined {
    return branch_name ? branch_name.code+"-"+branch_name.full_name : undefined;
  }

  reversa_save_fun(expmapping,ind){
    console.log(expmapping)
 
    if(typeof expmapping.value.branch!='object'){
      this.toastr.warning('', 'Please Select Branch', { timeOut: 1500 });
      return false;
    }
    if(expmapping.value.flag == '' || expmapping.value.flag == null || expmapping.value.flag == undefined){
      this.toastr.warning('', 'Please Select Type', { timeOut: 1500 });
      return false;
    }  
    if(expmapping.value?.flag?.id == 2){
      if(expmapping.value.employee == '' || expmapping.value.employee == null || expmapping.value.employee == undefined){
        this.toastr.warning('', 'Please Select Employee', { timeOut: 1500 });
        return false;
      }
    }  
    let expmapping_parm
    if(expmapping.value?.exp_id==''){
      expmapping_parm={
        "branch_code":expmapping.value.branch?.code,
        "branch_name":expmapping.value.branch?.name,
        "flag":expmapping.value.flag?.id,
        "employee_id":expmapping.value.employee ? expmapping.value.employee?.id :'',
      }
    }
    else{
      expmapping_parm={
        "branch_code":expmapping.value?.branch?.code,
        "branch_name":expmapping.value?.branch?.name,
        "id":expmapping.value?.exp_id,
        "flag":expmapping.value.flag?.id,
        "employee_id":expmapping.value?.employee ? expmapping.value?.employee?.id :''
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
    this.frs_serv.reverse_create_update(expmapping_parm,"")
      .subscribe((results: any) => {
  
     this.SpinnerService.hide();
     this.create_id=results.id
      if (results.status == 'SUCCESS') {
        if(typeof expmapping.value.exp_id=='number'){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
        }else{
          this.toastr.success("",'Successfully Created',{timeOut:1500});
          this.isFileButtonDisabled= false
        }
        
        // this.reverse_grp.reset()
        this.reverse_clear()
        this.reversa_summary(val) 
        // this.file_insert()
      }else{
        this.toastr.warning("",results.message,{timeOut:1500});
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  reverse_clear(){
    let val=''
    this.reverse_search.controls['branch'].reset('')
    this.reverse_search.controls['Status'].reset('')
    this.reversa_summary(val) 
  }
  // get fileNameDisplay(): string {
  //   const name = this.file?.file_name;
  //   return name && name.trim() ? name : 'No files uploaded';
  // }
  reverse_clears(){
  this.reverse_create.reset()
  }
  reverse_cancel(expcancel,ind){
    if(expcancel.value.exp_id  != ""){
      console.log('true')
      var arrayControl = this.reverse_grp.get('reverse_grp_arry') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);
      this.reversa_summary(this.explevel_id) 
      
  
    }  if(expcancel.value.exp_id   == "" || expcancel.value.exp_id  == undefined  || expcancel.value.exp_id  ==null)
      {
      const control = <FormArray>this.reverse_grp.controls['reverse_grp_arry'];
      control.removeAt(ind)   
      console.log('false')
  
    }
  
  }
  file_view(data){
    this.btn_view= false
    this.isRemarkDisabled=true
    this.reverse_create.get('documentfiles')?.disable();
    this.upload_file= false

    this.upload_files= true
    this.upload_filess= false
    console.log("Edit data",data)
    this.rev_cre= true
    this.edits=true
    this.edit_id= data.id
    if(data.flag.id==2){
      this.emp_bra=true
      this.reverse_create.patchValue({
        employee_searchs:data.employee
      })
    }else{
      this.emp_bra=false
    }
    this.reverse_create.patchValue({
      branchs:data?.branch,
      flag_searchs:data?.flag,
      remark:data?.remark,
   })
   this.uploadedFiles=[]
   this.SpinnerService.show()
   this.frs_serv.reverse_file_fetch(this.edit_id).subscribe((results) => {
     this.SpinnerService.hide()
     this.file_upload_datas= results['data']
     for(let filess of this.file_upload_datas){
      this.uploadedFiles.push(filess)
     }
     
   }, error => {
     this.errorHandler.handleError(error);
     this.SpinnerService.hide();
   })

  }
  reverse_edit(data,i){
    this.btn_view= true
    this.upload_filess= false
    this.uploadedFiles=[]
    this.isRemarkDisabled=false
    this.reverse_create.get('documentfiles')?.disable();
    this.upload_file= false
    this.upload_files= false
    console.log("Edit data",data,i)
    this.rev_cre= true
    this.edits=true
    this.edit_id= data?.id
    if(data.flag.id==2){
      this.emp_bra=true
      this.reverse_create.patchValue({
        employee_searchs:data?.employee
      })
    }else{
      this.emp_bra=false
    }
    this.reverse_create.patchValue({
      branchs:data.branch,
      flag_searchs:data?.flag,
      remark:data?.remark,
   })
  }
  reverse_delete(expcancel,i){
    var sourceconfirm=window.confirm("Are You Sure Change The Status?")
    console.log(sourceconfirm)
    if(!sourceconfirm){
      return false;
    }else{
      // let delsource=expcancel.value.newsource[i]
      let id=expcancel.id
      let status=expcancel.status
      let sourcestatus
      if(status==0){
        sourcestatus=1
      }else{
        sourcestatus=0
      }
      
      let val=''
      this.SpinnerService.show()
      this.frs_serv.rever_delete(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        if(results.message=="Successfully Updated"){
          if(sourcestatus==1){
            this.toastr.success("","Succesfully Actived",{timeOut:1500})
            this.reverse_clear()
            this.reversa_summary(val) 
          }else{
            this.toastr.success("","Succesfully In-Active",{timeOut:1500})
            this.reverse_clear()
            this.reversa_summary(val) 
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }


   status_function(){
    this.Status_list=[{id:1,name:"Pending"},
    {id:2,name:"Approved"},
    {id:3,name:"Rejected"}]
   }

  //  back_master(){
  //   this.reverse_mas=false;
  //   this.gl_mapping=true;
  // }


  employee_name(ind) {
    let prokeyvalue: String = "";
    this.getemp_id(prokeyvalue);
    var arrayControl = this.reverse_grp.get('reverse_grp_arry') as FormArray;
    let item = arrayControl.at(ind);
    item.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.search_employee(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.emp_List = datas;

      })
  }

  private getemp_id(prokeyvalue) {
    this.frs_serv.search_employee(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.emp_List = datas;

      })
  }

  autocompleteemp_nameScroll() {
    this.has_next_emp = true
    this.has_previous_emp = true
    this.currentpage_emp = 1
    setTimeout(() => {
      if (
        this.matAutocomplete_employee &&
        this.autocompleteTrigger &&
        this.matAutocomplete_employee.panel
      ) {
        fromEvent(this.matAutocomplete_employee.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocomplete_employee.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocomplete_employee.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete_employee.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete_employee.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_emp === true) {
                this.frs_serv.search_employee(this.employeeContact_Input.nativeElement.value, this.currentpage_emp + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.emp_List = this.emp_List.concat(datas);
                    if (this.emp_List.length >= 0) {
                      this.has_next_emp = datapagination.has_next;
                      this.has_previous_emp = datapagination.has_previous;
                      this.currentpage_emp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  employee_search_sum() {
    let prokeyvalue: String = "";
    this.getemp_sum(prokeyvalue);
    this.reverse_search.get('employee_search').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.search_employee(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empList = datas;

      })
  }

  private getemp_sum(prokeyvalue) {
    this.frs_serv.search_employee(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empList = datas;

      })
  }

  autocompleteempScroll() {
    this.has_nextempsum = true
    this.has_previousempsum = true
    this.currentpageempsum = 1
    setTimeout(() => {
      if (
        this.emp_mat &&
        this.autocompleteTrigger &&
        this.emp_mat.panel
      ) {
        fromEvent(this.emp_mat.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.emp_mat.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.emp_mat.panel.nativeElement.scrollTop;
            const scrollHeight = this.emp_mat.panel.nativeElement.scrollHeight;
            const elementHeight = this.emp_mat.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextempsum === true) {
                this.frs_serv.search_employee(this.empsumInput.nativeElement.value, this.currentpageempsum + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.has_nextempsum = datapagination.has_next;
                      this.has_previousempsum = datapagination.has_previous;
                      this.currentpageempsum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  employee_search_sums() {
    let prokeyvalue: String = "";
    this.getemp_sums(prokeyvalue);
    this.reverse_create.get('employee_searchs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.search_employee(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empLists = datas;

      })
  }

  private getemp_sums(prokeyvalue) {
    this.frs_serv.search_employee(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empLists = datas;

      })
  }

  autocompleteempScrolls() {
    this.has_nextempsum = true
    this.has_previousempsum = true
    this.currentpageempsum = 1
    setTimeout(() => {
      if (
        this.emp_mats &&
        this.autocompleteTrigger &&
        this.emp_mats.panel
      ) {
        fromEvent(this.emp_mats.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.emp_mats.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.emp_mats.panel.nativeElement.scrollTop;
            const scrollHeight = this.emp_mats.panel.nativeElement.scrollHeight;
            const elementHeight = this.emp_mats.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextempsum === true) {
                this.frs_serv.search_employee(this.empsumInputs.nativeElement.value, this.currentpageempsum + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empLists = this.empLists.concat(datas);
                    if (this.empLists.length >= 0) {
                      this.has_nextempsum = datapagination.has_next;
                      this.has_previousempsum = datapagination.has_previous;
                      this.currentpageempsum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // fileupload(evt){
  //   this.file = evt.target.files[0];
  //   console.log("file",this.file)
  // }
  uploadedFiles: File[] = [];

  fileupload(event: any) {
    const selectedFiles = Array.from(event.target.files) as File[];

    this.uploadedFiles = [...this.uploadedFiles, ...selectedFiles];
    this.reverse_create.get('documentfile').reset()

  }
  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
  @ViewChild('closepopup') closepopup:any;
  @ViewChild('closepopupssss') closepopupssss:any;
  @ViewChild('closepopupss') closepopupss:any;


  file_submit(){
    if (this.uploadedFiles.length <= 0) {
      this.toastr.warning("Please Upload The File")
      return false
    }
  }
  // file_insert(){
  //   if (this.uploadedFiles.length <= 0) {
  //     this.toastr.warning("Please Upload The File")
  //     return false
  //   }
  //   for (var i=0; i<this.uploadedFiles.length; i++ ){
  //     if(this.uploadedFiles[i].name.length>75){
  //       console.log("this.file_data[i] length",this.uploadedFiles[i].name.length)
  //        this.toastr.warning("","Please Select File Name Length 75 Only Allowed ")
  //        return false
  //     }
  //   }
  //   console.log("file",this.uploadedFiles)
  //   this.SpinnerService.show()
  //   this.frs_serv.rever_file_upload(this.uploadedFiles,this.create_id).subscribe((results) => {
  //     this.SpinnerService.hide()
  //     if(results.set_code=="success"){
  //       this.toastr.success(results.set_description)
  //       this.rev_upload_id= results.id  
  //       this.closepopup.nativeElement.click();     
  //     }else{
  //       this.toastr.warning(results.set_description)
  //     }
  //   }, error => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   })
  // }

  approve_action(data,stat){
    console.log("Approve data",data)
    if(stat==2){
      if(this.approve_remark.value.remarkss == "" || this.approve_remark.value.remarkss == null || this.approve_remark.value.remarkss == undefined){
        this.toastr.warning("Please Fill Remarks")
      }else{
        this.expmapping_parms={
          "status":stat,
          "id":data.id,
          "branch_code":data.branch.code,
          "branch_name":data.branch.name,
          "remarks": this.approve_remark.value.remarkss,
          "flag":data?.flag?.id
        }
      }
     
    }else if(stat==3){
      if(this.approve_reject.value.remarksss == "" || this.approve_reject.value.remarksss == null || this.approve_reject.value.remarksss == undefined){
        this.toastr.warning("Please Fill Remarks")
      }else{
        this.expmapping_parms={
          "status":stat,
          "id":data.id,
          "branch_code":data.branch.code,
          "branch_name":data.branch.name,
          "remarks": this.approve_reject.value.remarksss,
          "flag":data?.flag?.id
        }
      }
    }
  
    this.SpinnerService.show()

    this.frs_serv.reverse_create_update(this.expmapping_parms,"")
      .subscribe((results: any) => {
  
     this.SpinnerService.hide();
      if (results.status == 'SUCCESS') {
        this.toastr.success(results.message)
        this.reversa_summary(this.reve_pass) 
        this.closepopupssss.nativeElement.click(); 
        this.closepopupss.nativeElement.click();
        this.approve_remark.reset()
        this.approve_reject.reset()     
    

      
        
        // this.reverse_grp.reset()
       
      }else{
        this.toastr.warning("",results.message,{timeOut:1500});
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    
  }

  History_fetch(data,page){
    console.log(data)
    let his_id = data?.id??""
    this.SpinnerService.show()
    this.frs_serv.reverse_history(his_id,page)
    .subscribe((results: any) => {

   this.SpinnerService.hide();
   let datapagination = results["pagination"];
   this.history_data= results['data']
   if (this.history_data?.length > 0) {
    this.has_nextss = datapagination.has_next;
    this.has_previousss = datapagination.has_previous;
    this.presentpagess = datapagination.index;
    this.datass_foundss=true
  }if( this.history_data?.length == 0){
    this.has_nextss = false;
    this.has_previousss = false;
    this.presentpagess = 1;
    this.datass_foundss=false
  }    
   
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })

  }


  branchnames() {
    let prokeyvalue: String = "";
    this.getbranchids(prokeyvalue);
    this.reverse_create.get('branchs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.frs_serv.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchLists = datas;

      })
  }

  private getbranchids(prokeyvalue) {
    this.frs_serv.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchLists = datas;

      })
  }

  autocompletebranchnameScrolls() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    setTimeout(() => {
      if (
        this.matAutocompletebrachs &&
        this.autocompleteTrigger &&
        this.matAutocompletebrachs.panel
      ) {
        fromEvent(this.matAutocompletebrachs.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrachs.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrachs.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrachs.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrachs.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.frs_serv.getbranchdropdown(this.branchContactInputs.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchLists = this.branchLists.concat(datas);
                    if (this.branchLists.length >= 0) {
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

  reverse_submit(data){
    console.log("Submit Data",data)
    // if(expmapping.value.exp_id==''){
    if(this.edits== true){
      this.expmapping_parmss={
        "id":this.edit_id,
        "branch_code":data.branchs?.code??"",
        "branch_name":data.branchs?.name??"",
        "flag":data.flag_searchs?.id??"",
        "employee_id":data.employee_searchs?.id??"",
        "remarks": data.remark,
      }
    }else{
      this.expmapping_parmss={
        "branch_code":data.branchs?.code??"",
        "branch_name":data.branchs?.name??"",
        "flag":data.flag_searchs?.id??"",
        "employee_id":data.employee_searchs?.id??"",
        "remarks": data.remark,
      }
    }
     

    this.SpinnerService.show()
      this.frs_serv.reverse_create_update(this.expmapping_parmss,this.uploadedFiles)
      .subscribe((results: any) => {
  
     this.SpinnerService.hide();
     this.create_id=results.id
      if (results.status == 'SUCCESS') {
       
        
        // this.reverse_grp.reset()
        this.rev_cre= false
        this.reverse_clear()
        this.reversa_summary("")
        this.uploadedFiles=[]
        // this.file_inserts()
      }else{
        this.toastr.warning("",results.message,{timeOut:1500});
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }

  Selectvalue_type($event,flag){
    console.log("flag",flag)
    if(flag.id==2){
      this.emp_bra= true
    } else{
      this.emp_bra= false
    }
  }
  

  // file_inserts(){
  //   if (this.uploadedFiles.length <= 0) {
  //     // this.toastr.warning("Please Upload The File")
  //     return false
  //   }
  //   for (var i=0; i<this.uploadedFiles.length; i++ ){
  //     if(this.uploadedFiles[i].name.length>75){
  //       console.log("this.file_data[i] length",this.uploadedFiles[i].name.length)
  //        this.toastr.warning("","Please Select File Name Length 75 Only Allowed ")
  //        return false
  //     }
  //   }
  //   console.log("file",this.uploadedFiles)
  //   this.SpinnerService.show()
  //   this.frs_serv.rever_file_upload(this.uploadedFiles,this.create_id).subscribe((results) => {
  //     this.SpinnerService.hide()
  //     if(results.set_code=="success"){
  //       this.toastr.success(results.set_description)
  //       this.rev_upload_id= results.id  
  //       this.rev_cre= false
  //       this.reverse_create.get('documentfile').reset()

  //     }else{
  //       this.toastr.warning(results.set_description)
  //     }
  //   }, error => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   })
  // }
  reverse_back(){
    this.rev_cre= false
    this.reverse_create.reset()
  }

  download_file(file,i){
    console.log("Donwload file",file,i)
    this.dow_id=file.id

    this.SpinnerService.show()
      this.frs_serv.reverse_file_download(this.dow_id)
  .subscribe((results: any[]) => {
    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = file.file_name;
      link.click();
      this.toastr.success('Successfully Download');
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }

}
