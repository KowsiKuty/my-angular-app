import { Component, OnInit,ViewChild,Output,EventEmitter,ElementRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ShareService } from '../share.service';
import { masterService } from '../master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize,distinctUntilChanged,debounceTime,tap,takeUntil,switchMap,map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

export interface role{
  'id':string;
  'operation_name':string; 
}



@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('role') matrole:MatAutocomplete;
  @ViewChild('roleinput') roleinput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger :MatAutocompleteTrigger;
  rolesummary:FormGroup;
  empsearch:FormGroup;
  modules_data:any[]=[];
  employee_data:any[]=[];
  employee_dup:any[]=[];
  roleList:any[]=[];
  emp_data:any[]=[];
  existinglistemp:any[]=[];
  existinglistmodule:any[]=[]
  submit_button:boolean;
  isLoading = false;
  rolelistpage:number=1;
  has_rolelistprev:boolean=false;
  has_rolelistnext:boolean=false;
  readonly:boolean=false;
  empname = new FormControl('');
  original_emp: any[] = [];
  mod_form = new FormControl('');
  original_mod: any[] = [];

  constructor( private fb:FormBuilder,private masterserv:masterService,private shareservice:ShareService,private spinner:NgxSpinnerService,private toast:ToastrService) { }

  ngOnInit(): void {
    this.rolesummary=this.fb.group({
      'name':new FormControl(''),
      'code':new FormControl(''),
      'role_id':new FormControl(''),
    });
    // this.empsearch=this.fb.group({
    //   'empname':new FormControl('')
    // })

    let data=this.shareservice.userroleEdit.value;
    if (data==''){
      this.submit_button=true;
      this.getdata();
      // this.getrole_grp(1);
    }
    else{
      this.geteditsummary(data);
      // this.getrole_grp(1);
    }
    // this.getdata();
    this.getempdata();
    // this.rolesummary.get('role_id').valueChanges .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.masterserv.getRolesdropdown(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   ).subscribe(res=>{
    //     this.roleList=res['data']
    //   })

      // this.empsearch.get('empname').valueChanges.pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //   }),
      //   switchMap(value => this.masterserv.empfilter(value,this.id_role)
      //     .pipe(
      //       finalize(() => {
      //         this.isLoading = false
      //       }),
      //     )
      //   )
      // ).subscribe(res=>{
      //   this.employee_data=res['data'];
      //   for (const item2 of this.employee_data) {
      //     const item1 = this.employee_dup.find(item => item.id === item2.id);
        
      //     if (item1) {
      //       item2.isSelected = item1.isSelected;
      //     }
      //   }
      // })
      this.sortemployee();
      // debugger
      this.masterserv.getRolegroupdropdown().subscribe(result=>{
        // debugger
        this.roleList=result['data'];
      });

  }
 
  getroleinterface(data?:role):string | undefined{
    // console.log('roledata',data.name)
    return data ? data.operation_name:undefined;
  }
  cancel(){
    this.shareservice.userroleEdit.next('');
    this.onCancel.emit();
  }
   selected_items:any[]=[]
  store_emp_list(employee:any){
  //  debugger;
    if(employee.isSelected){
      this.selected_items.push(employee.id);
    }
    else{
      const index =this.selected_items.findIndex(selecteditem =>selecteditem === employee.id);
      if(index !== -1){
        this.selected_items.splice(index,1);
      }
    }
    const targetItem = this.employee_dup.find(item => item.id === employee.id);

    if (targetItem) {
      targetItem.isSelected = employee.isSelected?true:false ;
    }
    this.sortemployee();
    this.reset_emp();
    console.log('dup_list',this.employee_dup);
    
  }
  
  submit(parentObj,employee_data,num){

    // if (this.rolesummary.get('role_id').value.id==undefined || this.rolesummary.get('role_id').value==''){
    //   this.toast.warning('Please Select Role Group');
    //   return false;
    // }\
    // debugger;
    var answer = window.confirm("Are You Sure To Create a New Role");
    if (answer) {
      
    }
    else {
      return false;
    }
    if (this.rolesummary.get('name').value==undefined || this.rolesummary.get('name').value==''){
      this.toast.warning('Please Enter Role Name');
      return false;
    }
    if (this.rolesummary.get('code').value==undefined || this.rolesummary.get('code').value==''){
      this.toast.warning('Please Enter Role Code');
      return false;
    }
    let list:any=[];
    let emp_list:any=[];
    let emp_remove_list:any=[];
    let module_remove_list:any=[];
    this.spinner.show();
    for (var i = 0; i < parentObj.length; i++) {
        if(parentObj[i].isSelected){
          list.push(parentObj[i].id);
          for (var j = 0; j < parentObj[i].sub_module.length; j++) {
            if(parentObj[i].sub_module[j].isSelected){
              list.push(parentObj[i].sub_module[j].id)
            }
        }
      }
    }
    for (var i = 0; i < employee_data.length; i++) {
      if(employee_data[i].isSelected){
        emp_list.push(employee_data[i].id);
    }
    }
    console.log('exis_list',this.existinglistemp)
    console.log('selec_items',this.selected_items)
    emp_remove_list=this.existinglistemp.filter(id=>!this.selected_items.includes(id));
    module_remove_list=this.existinglistmodule.filter(id=>!list.includes(id));
    if (list.length==0){
      this.toast.warning('Please Select Module');
      return false;
    }
    if (emp_list.length==0){
      this.toast.warning('Please Select Employee');
      return false;
    }
    console.log('selected_items',this.selected_items)
    console.log('existinglist',this.existinglistemp)
    console.log('finaldata',list);
    console.log('emp_data',emp_list);
    console.log('emp_remove',emp_remove_list)
    let dict={
      "role_grp":this.rolesummary.get('role_id').value.operation_name,
      "role_name":this.rolesummary.get('name').value,
      "role_code":this.rolesummary.get('code').value,
      "role_menumodule":list,
      "role_employee":this.selected_items,
      "role_employee_remove":emp_remove_list,
      "role_menumodule_remove":module_remove_list
      
    }
    if (num==1){
      dict["action"]="create"
    }
    else{
      dict["action"]="update"
    }
    this.spinner.show();
    this.masterserv.getcreaterolegrp(dict).subscribe(result=>{
      this.spinner.hide();
      if (result.status=='success'){
        this.toast.success(result.message);
        this.shareservice.userroleEdit.next('');
        this.onSubmit.emit();
      }
      else{
        this.toast.warning(result.description);
      }
    },
    (error)=>{
      this.spinner.hide();
    })
  }
  parentCheck(parentObj){
    for (var i = 0; i < parentObj.sub_module.length; i++) {
      parentObj.sub_module[i].isSelected = parentObj.isSelected;
    }
  }
  childCheck(parentObj,childObj,parentindex,childindex){
    (parentObj.sub_module).forEach(element => {
      if (element['isSelected']){
        parentObj['isSelected']=true;
      }
      
    });  
  }

  expandCollapseAll(obj){
    obj.isClosed = !obj.isClosed;
  }
  getdata(){
    this.spinner.show();
    this.masterserv.getmoduledata().subscribe(result=>{
      this.getempdata();
      this.modules_data=result[0]['master_list'];
      this.original_mod=result[0]['master_list'];
      console.log("data",this.modules_data);
    },
    (error)=>{
      this.spinner.hide();
    })
  }
  filter_emp() {
    let value_emp = this.empname.value.trim();
    this.employee_data = this.employee_dup.filter(res => {
      if ((res.name.toLowerCase()).includes(value_emp.toLowerCase())) {
        return res
      }
      else if((res.code.toLowerCase()).includes(value_emp)){
        return res
      }
    });
    console.log(this.employee_data);
  }
  filter_mod() {
    let value_emp = this.mod_form.value.trim();
    this.modules_data = this.original_mod.filter(res => {
      if (((res.value).toLowerCase()).includes(value_emp.toLowerCase()) || res?.sub_module.some(sub_res=> ((sub_res?.value).toLowerCase()).includes(value_emp.toLowerCase()))) {
        return res
      }
    });
    console.log("this.modules_data",this.modules_data);
  }
  onCheckboxChange(event:any) {
    // if (event.target.checked) {
    //   this.reset_emp();
    // }
    this.reset_emp();
    this.sortemployee();
  }
  sortemployee(){
    this.employee_data.sort((a,b)=>{
      if(a.isSelected && !b.isSelected){
        return -1;
      }else if(!a.isSelected && b.isSelected){
        return 1;
      }else{
        return 0;
      }
    })
  }
  reset_emp(){
    if(this.empname.value){
      this.empname.reset("");
      this.filter_emp();
    }
   
  }

  getempdata(){
    this.spinner.show();
    this.masterserv.getemployeedata().subscribe(result=>{
      this.spinner.hide();
      this.employee_data=result.sort((a,b)=>{
        if(a.name < b.name){
          return -1;
        }
        if(a.name > b.name){
          return 1;
        }
        return 0;
      });
      this.employee_dup=result.sort((a,b)=>{
        if(a.name < b.name){
          return -1;
        }
        if(a.name > b.name){
          return 0;
        }
        return 0;
      });

    },
    (error)=>{
      this.spinner.hide();
    })
  }
  getrole_grp(page){
    this.masterserv.getRolesListexp(page)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.roleList = datas;
          let pagination = results['pagination'];
          this.has_rolelistnext = pagination.has_next;
          this.has_rolelistprev = pagination.has_previous;
          this.rolelistpage = pagination.index;  
        })
    }
    stringify(obj:any) {
      return JSON.stringify(obj);
    }
   id_role:any=''
    geteditsummary(data){
      this.readonly=true;
      this.id_role=data.id;
      this.rolesummary.patchValue({
        'name':data.name,
        'code':data.code,
        'role_id':data,
      });
      this.spinner.show();
      this.masterserv.getsingleRole(data.id).subscribe(result=>{
        this.spinner.hide();
        this.modules_data=result[0]['module'][0]['master_list'];
        this.original_mod=result[0]['module'][0]['master_list'];
        this.employee_data=result[0]['employee'];
        this.employee_dup=result[0]['employee'];
        
        for (var i = 0; i < this.employee_data.length; i++) {
          if(this.employee_data[i].isSelected){
            this.existinglistemp.push(this.employee_data[i].id);
            this.selected_items.push(this.employee_data[i].id);
          }
        }
        for (var i = 0; i < this.modules_data.length; i++) {
          if(this.modules_data[i].isSelected){
            this.existinglistmodule.push(this.modules_data[i].id);
            for (var j = 0; j < this.modules_data[i].sub_module.length; j++) {
              if(this.modules_data[i].sub_module[j].isSelected){
                this.existinglistmodule.push(this.modules_data[i].sub_module[j].id)
              }
            }
          }
        }
        // for (var i = 0; i < this.modules_data.length; i++) {
        //   if(this.modules_data[i].isSelected){
        //     this.existinglistmodule.push(this.modules_data[i].id);
        //   }
        // }
      })
  
    }
    // employeefilter(event: any) {
    //   let data = event.target.value.trim();
    //     this.employee_data= this.employee_data.filter(function (res) {
    //       if(res.name.toLowerCase().includes(data.toLowerCase())){
    //         return res
    //       }
    //     })
    // }
    autocompltescrollroleGroup(){
      setTimeout(() => {
        if (
          this.matrole &&
          this.autocompletetrigger &&
          this.matrole.panel
         ) {
            fromEvent(this.matrole.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matrole.panel.nativeElement.scrollTop),
              takeUntil(this.autocompletetrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matrole.panel.nativeElement.scrollTop;
              const scrollHeight = this.matrole.panel.nativeElement.scrollHeight;
              const elementHeight = this.matrole.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if(this.has_rolelistnext === true){
                  this.masterserv.getRolesdropdown(this.roleinput.nativeElement.value,this.rolelistpage+1)
                  .subscribe((results: any[]) => {
                    this.roleList =  results["data"];
                    let pagination = results['pagination'];
                    this.has_rolelistnext = pagination.has_next;
                    this.has_rolelistprev = pagination.has_previous;
                    this.rolelistpage = pagination.index;
                  })
                }

                 
                
              }
            });
          }
      });
    }
    onCheckboxChange_module($event){
      if(this.mod_form.value){
        this.mod_form.reset("");
        this.filter_mod();
      }
    }
    
  
}
