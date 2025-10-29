import { Component, OnInit,ViewChild,ElementRef,Output,EventEmitter } from '@angular/core';
import { FormGroup,FormBuilder,FormControl } from '@angular/forms';
import { masterService } from '../master.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { Observable, fromEvent, } from 'rxjs'
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/service/shared.service';

export interface employee {
  id: string;
  full_name: string
  code:string
}
@Component({
  selector: 'app-emccontacts-add',
  templateUrl: './emccontacts-add.component.html',
  styleUrls: ['./emccontacts-add.component.scss']
})
export class EmccontactsAddComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeauto') matemp: MatAutocomplete;
  @ViewChild('empinput') empinput;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  Emc_Creationform:any=FormGroup
  isLoading:boolean=false;
  emplist:Array<any>=[];
  emp_next:boolean=true;
  emp_prev:boolean=false;
  emp_page:number=1;
  emc_create:boolean=true;
  readonly:boolean=true;
  constructor(private masterservice:masterService,private fb:FormBuilder,private spinnerservice:NgxSpinnerService,private notification:NotificationService,private sharedservice:SharedService) { }

  ngOnInit(): void {
    this.Emc_Creationform =this.fb.group({
      'employee':new FormControl(''),
      'desg':new FormControl(''),
      'section': new FormControl(''),
      'landline':new FormControl(''),
      'mobile':new FormControl('')

    })
    this.Emc_Creationform.get('employee').valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value =>this.masterservice.get_Emp_List(value,1)
      .pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      ))
    ).subscribe((res:any)=>{
      this.emplist=res['data']
    })
    this.get_emp_dropdown('')
    this.EMC_contactEdit();
  }
  emc_edit_id:any;
  EMC_contactEdit(){
    let emc_editdata=this.sharedservice.Emc_contactEditValue?.value;
    this.emc_edit_id=emc_editdata['id']
    if (emc_editdata != undefined && emc_editdata != null && emc_editdata['id'] != "" && emc_editdata['id'] != undefined) {
      this.emc_create=false;
      this.readonly=true;
      this.Emc_Creationform.patchValue({
      'desg':emc_editdata?.['designation'],
      'mobile':emc_editdata?.['mobile_no'],
      'landline':emc_editdata?.['landline_no'],
      'section':emc_editdata?.['section_handling'],
      'employee':{'id':emc_editdata?.['emp_detail']?.['id'],
                  'code':emc_editdata['emp_detail']?.['code'],
                  'full_name':emc_editdata?.['emp_detail']?.['full_name'],} ,
    })




    }

  }
 
   
  public employeeinterface(employee?: employee): string | undefined {
    return employee ? employee.full_name : undefined;
  }
  get_emp_dropdown(emp){
    this.masterservice.get_Emp_List(emp,1).subscribe(data =>{
      this.emplist = data['data']
    })
  }
    autocompleteempScroll() {
      setTimeout(() => {
        if (
          this.matemp &&
          this.autocompleteTrigger &&
          this.matemp.panel
        ) {
          fromEvent(this.matemp.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matemp.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matemp.panel.nativeElement.scrollTop;
              const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
              const elementHeight = this.matemp.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.emp_next === true) {
                  this.masterservice.get_Emp_List(this.empinput.nativeElement.value, this.emp_page + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.emplist = this.emplist.concat(datas);
                      if (this.emplist.length >= 0) {
                        this.emp_next = datapagination.has_next;
                        this.emp_prev = datapagination.has_previous;
                        this.emp_page = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
  
    }
    Emc_creation(){
      if(!(this.Emc_Creationform.get('employee').value.id)){
        this.notification.showWarning("Please Select Employee");
        return false;
      }
      if(!(this.Emc_Creationform.get('desg').value)){
        this.notification.showWarning("Please Enter The Designation");
        return false;
      }
      if(!(this.Emc_Creationform.get('section').value)){
        this.notification.showWarning("Please Enter The Section Handling");
        return false;
      }
      if(!(this.Emc_Creationform.get('landline').value)){
        this.notification.showWarning("Please Enter The LandLine No");
        return false;
      }
      if(!(this.Emc_Creationform.get('mobile').value)){
        this.notification.showWarning("Please Enter The Mobile No");
        return false;
      }
      let data:any={
        'emp_details':this.Emc_Creationform.get('employee').value,
        'designation':this.Emc_Creationform.get('desg').value,
        'section_handling':this.Emc_Creationform.get('section').value,
        'landline_no':this.Emc_Creationform.get('landline').value,
        'mobile_no':this.Emc_Creationform.get('mobile').value
      }
      this.spinnerservice.show()
      this.masterservice.emc_contact_create(data).subscribe(res=>{
        this.spinnerservice.hide();
        if(res['status']=='success'){
          this.notification.showSuccess(res['message']);
          this.onSubmit.emit();
        }
        else{
          this.notification.showError(res['description']);
        }
        },
      (error)=>{
        this.notification.showError(error.status+error.statusText)
      })
      
      console.log('data',data)
    }

    Emc_Edit(){
      if(!(this.Emc_Creationform.get('employee').value.id)){
        this.notification.showWarning("Please Select Employee");
        return false;
      }
      if(!(this.Emc_Creationform.get('desg').value)){
        this.notification.showWarning("Please Enter The Designation");
        return false;
      }
      if(!(this.Emc_Creationform.get('section').value)){
        this.notification.showWarning("Please Enter The Section Handling");
        return false;
      }
      if(!(this.Emc_Creationform.get('landline').value)){
        this.notification.showWarning("Please Enter The LandLine No");
        return false;
      }
      if(!(this.Emc_Creationform.get('mobile').value)){
        this.notification.showWarning("Please Enter The Mobile No");
        return false;
      }
      let data:any={
        'id':this.emc_edit_id,
        'emp_details':this.Emc_Creationform.get('employee').value,
        'designation':this.Emc_Creationform.get('desg').value,
        'section_handling':this.Emc_Creationform.get('section').value,
        'landline_no':this.Emc_Creationform.get('landline').value,
        'mobile_no':this.Emc_Creationform.get('mobile').value
      }
      this.spinnerservice.show()
      this.masterservice.emc_contact_create(data).subscribe(res=>{
        this.spinnerservice.hide();
        if(res['status']=='success'){
          this.notification.showSuccess(res['message']);
          this.emc_create=true;
          this.readonly=false;
          this.sharedservice.Emc_contactEditValue.next('');
          this.onSubmit.emit();

          
        }
        else{
          this.notification.showError(res['description']);
        }
        },
      (error)=>{
        this.notification.showError(error.status+error.statusText)
      })
      
      console.log('data',data)
    }
    onCancelClick(){
      this.emc_create=true;
      this.readonly=false;
      this.sharedservice.Emc_contactEditValue.next('');
      this.onCancel.emit();
      

    }
    keypress(event){
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    omit_special_char(event) {
      var k;
      k = event.charCode;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
    
}
