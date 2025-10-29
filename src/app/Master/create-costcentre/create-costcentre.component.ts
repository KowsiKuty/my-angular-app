import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../master.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatRadioChange } from '@angular/material/radio';

export interface bsseg{
  id:number;
  code:string;
  name:string;
}
interface status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-costcentre',
  templateUrl: './create-costcentre.component.html',
  styleUrls: ['./create-costcentre.component.scss']
})
export class CreateCostcentreComponent implements OnInit {
//   AddForm: FormGroup;

//   constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

//   ngOnInit(): void {
//     this.AddForm = this.formBuilder.group({
//       code: ['', Validators.required],
//       name: ['', Validators.required],
//       no: ['', Validators.required],
//       description: ['', Validators.required],
//       remarks: ['', Validators.required]
//     })
//   }
//   createFormat() {
//     let data = this.AddForm.controls;
//     let objCostcentre = new Costcentre();
//     objCostcentre.code = data['code'].value;
//     objCostcentre.name = data['name'].value;
//     objCostcentre.no = data['no'].value;
//     objCostcentre.description = data['description'].value;
//     objCostcentre.remarks = data['remarks'].value;
//     // console.log("objCostcentre", objCostcentre)
//     return objCostcentre;
//   }


//   submitForm() {
//     this.dataService.createCostCentreForm(this.createFormat())
//       .subscribe(res => {
//         // console.log("createCostCentreForm", res);
//         // console.log(this.dataService.ComingFrom)
//         this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
//         return true
//       }
//       )
//   }

// }
// class Costcentre {
//   code: string;
//   name: string;
//   no: string;
//   description: string;
//   remarks: string;

// }




  CCForm: FormGroup;
  isLoading = false;
  BusinesssegmentList:any=[]
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  status: status[] = [
    {value: 'YES', viewValue: 'YES '},
    {value: 'NO', viewValue: 'NO'}]
    radioFlag: any = [];
  
  floatLabelControl = new FormControl('auto');

  @ViewChild('Businesssegment') matBusinesssegmentAutocomplete: MatAutocomplete;
  @ViewChild('BusinesssegmentInput') BusinesssegmentInput: any;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bsCode: any;
  bsName: any;
  bsID: any;

  constructor(private fb: FormBuilder, private shareService: SharedService,private spinner:NgxSpinnerService,
    private toastr:ToastrService, private router: Router, private dataService: masterService ) { }
  ngOnInit(): void {
    this.CCForm = this.fb.group({
      Businesssegment:[''],
      bsname:['', Validators.required],
      bscode:[''],
      name:['', Validators.required],
      no:['', Validators.required],
      code:[''],
      remarks:[''],
      description:['', Validators.required]
    })

  this.dataService.getBusinesssegmentname('',1).subscribe(data=>{
      this.BusinesssegmentList=data['data'];
    })
    this.CCForm.get('bsname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.dataService.getBusinesssegmentname(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.BusinesssegmentList = results["data"];
      console.log('branch_id=',results)
      console.log('branch_data=',this.BusinesssegmentList)

    })
  }

  autocompleteScroll_Businesssegment(){
    setTimeout(() => {
      if (this.matBusinesssegmentAutocomplete && this.autocompleteTrigger && this.matBusinesssegmentAutocomplete.panel) {
        fromEvent(this.matBusinesssegmentAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.dataService.getBusinesssegmentname( this.BusinesssegmentInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.BusinesssegmentList = this.BusinesssegmentList.concat(datas);
                    if (this.BusinesssegmentList.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  checker_segment(data){
   console.log(data)
   this.bsCode = data.code
   this.bsName = data.name
   this.bsID = data.id
 };

 radioChange(event: MatRadioChange,a) {
  console.log(event.value.value);
  if(event.value.value == 'YES'){
    this.radioFlag = 1
  }
  else if(event.value.value == 'NO'){
    this.radioFlag = 0
  }
  console.log('radio_flag ',this.radioFlag);
}
public getbsseginteface(data?:bsseg):string |undefined{
  return data?data.name:undefined;
}

  CCSubmit(){
    if (this.CCForm.value.bsname==="" ||this.CCForm.value.bsname.id === undefined ||this.CCForm.value.bsname ===null  ){
      this.toastr.error('Select BS Name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    // if (this.CCForm.value.bscode==="" ||this.CCForm.value.bscode===undefined || this.CCForm.value.bscode===null){
    //   this.toastr.error('Add code Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    if (this.CCForm.value.code===""||this.CCForm.value.code===undefined || this.CCForm.value.code===null){
      this.toastr.error('Add CC code Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.name==="" || this.CCForm.value.name===undefined || this.CCForm.value.name===null){
      this.toastr.error('Add CC name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.no==="" || this.CCForm.value.no===undefined || this.CCForm.value.no===null){
      this.toastr.error('Add CC No Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.remarks==="" || this.CCForm.value.remarks===undefined || this.CCForm.value.remarks===null){
      this.toastr.error('Add Remarks Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.description==="" || this.CCForm.value.description===undefined || this.CCForm.value.description===null){
      this.toastr.error('Add Description Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    


    let data = this.CCForm.value
    data['no'] = parseInt((this.CCForm.get('no').value))
    data['businesssegment_id'] = this.bsID
    data['status'] = this.radioFlag;
    console.log('CC Data',data)
   this.spinner.show(); 
   this.dataService.CCCreateForm(data).subscribe(res => {
   this.spinner.hide();
    if (res.code === "INVALID_DATA") {
      this.toastr.error(res.description)
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO CREATE COSTCENTER") {
      this.toastr.error("NOT ALLOWED TO COSTCENTER  IN 'PROD' ENVIRONMENT")
    } else if (res.code === "UNEXPECTED_ERROR") {
      this.toastr.error(res.description)
    }
     else {
       this.toastr.success("Successfully created")
      this.onSubmit.emit();
     }
       console.log("CCForm SUBMIT", res)
       return true
     }) 


  }

  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  
  onCancelClick(){
    this.onCancel.emit()
  }
  }






