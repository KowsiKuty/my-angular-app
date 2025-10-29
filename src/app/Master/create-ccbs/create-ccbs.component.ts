import { masterService } from '../master.service'
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent, combineLatest } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {isBoolean} from 'util';
import { ShareService} from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';
export interface bslistss {
  id: string;
  name: string;
}
export interface cclistss {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-ccbs',
  templateUrl: './create-ccbs.component.html',
  styleUrls: ['./create-ccbs.component.scss']
})
export class CreateCCBSComponent implements OnInit {
//   AddForm: FormGroup;
//   costCentreList: Array<any>;
//   businessSegmentList: Array<any>;
//   constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

//   ngOnInit(): void {
//     this.AddForm = this.formBuilder.group({
//       code: ['', Validators.required],
//       name: ['', Validators.required],
//       no: ['', Validators.required],
//       glno: ['', Validators.required],
//       costcentre_id: ['', Validators.required],
//       businesssegment_id: ['', Validators.required],
//       description: ['', Validators.required],
//       remarks: ['', Validators.required]
//     })
//     this.getCostCentre();
//     this.getBusinessSegment();

//   }
//   filter(data) {
//     // console.log(data.value);
//   }
//   filter1(data) {
//     // console.log(data.value);
//   }

  
  
//   createFormat() {
//     let data = this.AddForm.controls;
//     let objCcbs = new Ccbs();
//     objCcbs.code = data['code'].value;
//     objCcbs.name = data['name'].value;
//     objCcbs.no = data['no'].value;
//     objCcbs.glno = data['glno'].value;
//     objCcbs.costcentre = data['costcentre_id'].value;
//     objCcbs.businesssegment = data['businesssegment_id'].value;
//     objCcbs.description = data['description'].value;
//     objCcbs.remarks = data['remarks'].value;
//     // console.log("objCcbs", objCcbs)
//     return objCcbs;
//   }

//   private getCostCentre() {
//     this.dataService.getCostCentre()
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.costCentreList = datas;
//         // console.log("cc", datas)
  
//       })
//   }
//   private getBusinessSegment() {
//     this.dataService.getBusinessSegment()
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.businessSegmentList = datas;
//         // console.log("bs", datas)
  
//       })
//   }

  


//   submitForm() {
//     this.dataService.createCCBSMappingForm(this.createFormat())
//       .subscribe(res => {
//         // console.log("createCCBSMappingForm", res);
//         this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
//         return true
//       }
//       )
//   }

// }
// class Ccbs {
//   code: string;
//   name: string;
//   no: string;
//   glno: string;
//   costcentre: number;
//   businesssegment: number;
//   description: string;
//   remarks: string;

// }


@Output() onCancel = new EventEmitter<any>();
@Output() onSubmit = new EventEmitter<any>();
CCBSForm: FormGroup

bsList: Array<bslistss>;
costcentre         = new FormControl();

ccList: Array<cclistss>;
businesssegment    = new FormControl();



isLoading = false;
has_next = true;
has_previous = true;
currentpage: number = 1;

@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

@ViewChild('bs') matbsAutocomplete: MatAutocomplete;
@ViewChild('bsInput') bsInput: any;

@ViewChild('cc') matccAutocomplete: MatAutocomplete;
@ViewChild('ccInput') ccInput: any;

constructor(private fb: FormBuilder, private shareService: SharedService,private spinner:NgxSpinnerService,
  private toastr:ToastrService, private router: Router, private dataService: masterService,  private mastershareService: ShareService  ) { }

ngOnInit(): void {
  this.CCBSForm = this.fb.group({
    //code: ['', Validators.required],
    businesssegment: ['', this.SelectionValidator],
    costcentre: ['', this.SelectionValidator],
    name:[''],
    no: [''],
    glno: ['', Validators.required],
    remarks: [''],
    description: [''],
  })


  let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
  this.CCBSForm.get('businesssegment').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getbsFKdd(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;

    })


    let cckeyvalue: String = "";
    this.getcc(cckeyvalue);
  this.CCBSForm.get('costcentre').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getccFKdd(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;

    })



     this.getbsforadd();
    // this.getccforadd();



  }

//////////////////////////////bs
autocompletebsScroll() {
setTimeout(() => {
  if (
    this.matbsAutocomplete &&
    this.autocompleteTrigger &&
    this.matbsAutocomplete.panel
  ) {
    fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
        const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
        const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.dataService.getbsFKdd(this.bsInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.bsList = this.bsList.concat(datas);
                // console.log("emp", datas)
                if (this.bsList.length >= 0) {
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

public displayFnbs(bs?: bslistss): string | undefined {
return bs ? bs.name : undefined;
}

get bs() {
return this.CCBSForm.get('businesssegment');
}

private getbs(bskeyvalue) {
this.dataService.getbsvalue(bskeyvalue)
.subscribe((results: any[]) => {
let datas = results["data"];
this.bsList = datas;
})
}







//////////////////////////////////////////cc

autocompleteccScroll() {
setTimeout(() => {
  if (
    this.matccAutocomplete &&
    this.autocompleteTrigger &&
    this.matccAutocomplete.panel
  ) {
    fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
        const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
        const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.dataService.getccFKdd(this.ccInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.ccList = this.ccList.concat(datas);
                if (this.ccList.length >= 0) {
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

public displayFncc(cc?: cclistss): string | undefined {
return cc ? cc.name : undefined;
}

get cc() {
return this.CCBSForm.get('costcentre');
}

private getcc(cckeyvalue) {
this.dataService.getccvalue(cckeyvalue)
.subscribe((results: any[]) => {
let datas = results["data"];
this.ccList = datas;
})
}



private SelectionValidator(fcvalue: FormControl) {
if (typeof fcvalue.value === 'string') {
  return { incorrectValue: `Selected value only Allowed` }
}
return null;
}


getbsforadd(){
this.CCBSForm.controls['costcentre'].reset("")
let data:any = this.mastershareService.BSShare.value
let businesssegment         = data;
this.CCBSForm.patchValue({
  businesssegment: businesssegment
})
}



patch(){
setTimeout(()=>{ 
let bs = this.CCBSForm.value.businesssegment.name
let cc = this.CCBSForm.value.costcentre.name
let bsno = this.CCBSForm.value.businesssegment.no
let ccno = this.CCBSForm.value.costcentre.no


//let str3 = str1.concat( '&', str2);
this.CCBSForm.patchValue({
  // a: alert('name'),
  name: bs + ' & '+ cc,
  no : bsno.toString() + ccno.toString()
  //no : String(bsno) + String(ccno)

})

}, 500);
}









CCBSCreateForm(){
// if (this.CCBSForm.value.code==="000"){
//   this.toastr.error('Add Proper Code Field','000 Not Allowed');
//   return false;
// }

this.CCBSForm.value.businesssegment=this.CCBSForm.value.businesssegment.id;
this.CCBSForm.value.costcentre=this.CCBSForm.value.costcentre.id;

let data = this.CCBSForm.value
this.dataService.ccbsCreateForm(data)
.subscribe(res => {
console.table("result", res)
if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
  this.toastr.error(res.description)
}
else if(res.code === "UNEXPECTED_ERROR" && res.description ==="NOT ALLOWED TO CREATE CCBSMAPPING"){
  this.toastr.error("NOT ALLOWED TO CCBSMAPPING  IN 'PROD' ENVIRONMENT");
}
// else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
//   this.toastr.warning("Duplicate Data! ...")
// }
 else if (res.code === "UNEXPECTED_ERROR") {
  this.toastr.error(res.description)
}else {
  this.toastr.success("saved Successfully!...")
  this.onSubmit.emit();
  }
}
)
}
onCancelClick() {
this.onCancel.emit()
}
}