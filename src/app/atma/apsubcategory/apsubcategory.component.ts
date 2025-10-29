import { Component, OnInit, Output, EventEmitter, ViewChild,ElementRef } from '@angular/core';
import { AtmaService } from '../atma.service'
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize} from 'rxjs/operators';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
// export interface ApCategory {
//   id: string;
//   name: string;
// }
export interface catlistss {
  id: string;
  name: string;
}

export interface explistss {
  id: string;
  head: string;
}
export interface gllist{
  id:number;
  no:string;
}
@Component({
  selector: 'app-apsubcategory',
  templateUrl: './apsubcategory.component.html',
  styleUrls: ['./apsubcategory.component.scss']
})
export class ApsubcategoryComponent implements OnInit {
//   isLoading = false;
//   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
//   @Output() onCancel = new EventEmitter<any>();
//   @Output() onSubmit = new EventEmitter<any>();
//   apSubCategoryForm: FormGroup
//   disableSubmit = true;
//   categoryList: Array<ApCategory>;
//   categoryID: any;
//   category_id = new FormControl();

//   gstblockedlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
//   gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]

//   constructor(private fb: FormBuilder, private router: Router,
//     private atmaService: AtmaService, private notification: NotificationService,
//     private toastr: ToastrService) { }

//   ngOnInit(): void {
//     this.apSubCategoryForm = this.fb.group({
//       category_id: ['', Validators.required],
//       expense: ['', Validators.required],
//       glno: ['', Validators.required],
//       gstblocked: ['', Validators.required],
//       gstrcm: ['', Validators.required],
//       name: ['', Validators.required],
//       no: ['', Validators.required],

//     })
//     let apcatkeyvalue: String = "";
//     this.getcategory(apcatkeyvalue);
//     this.apSubCategoryForm.get('category_id').valueChanges
//       .pipe(
//         debounceTime(100),
//         distinctUntilChanged(),
//         tap(() => {
//           this.isLoading = true;
//         }),
//         switchMap(value => this.atmaService.getcategory(value)
//           .pipe(
//             finalize(() => {
//               this.isLoading = false
//             }),
//           )
//         )
//       )
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.categoryList = datas;
//         console.log("category", datas)

//       })

//   }

//   public displayapcat(apcatname?: ApCategory): string | undefined {
//     return apcatname ? apcatname.name : undefined;
//   }
//   get apcatname() {
//     return this.apSubCategoryForm.get('category_id');
//   }

//   private getcategory(apcatkeyvalue) {
//     this.atmaService.getcategory(apcatkeyvalue)
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.categoryList = datas;

//       })
//   }
//   createFormate() {
//     let data = this.apSubCategoryForm.controls;
//     let apatclass = new apcatsubtype();
//     apatclass.category_id = data['category_id'].value.id;
//     apatclass.expense = data['expense'].value;
//     apatclass.glno = data['glno'].value;
//     apatclass.gstblocked = data['gstblocked'].value;
//     apatclass.gstrcm = data['gstrcm'].value;
//     apatclass.name = data['name'].value;
//     apatclass.no = data['no'].value;
//     return apatclass;
//   }

//   apsubcategoryCreateForm() {
//     this.disableSubmit = true;
//     if (this.apSubCategoryForm.valid) {
//       this.atmaService.apSubCategoryCreateForm(this.createFormate())
//         .subscribe(res => {
//           console.log("res", res)
//           if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
//             this.notification.showWarning("Duplicate! Code Or Name ...")
//             this.disableSubmit = false;

//           } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
//             this.notification.showError("INVALID_DATA!...")
//             this.disableSubmit = false;

//           } else {
//             this.notification.showSuccess("saved Successfully!...")
//             this.onSubmit.emit();
//           }
//         }
//         )
//     } else {
//       this.notification.showError(("INVALID_DATA..."))
//       this.disableSubmit = false;
//     }
//   }

//   onCancelClick() {
//     this.onCancel.emit()
//   }

// }


// class apcatsubtype {
//   category_id: any;
//   expense: string;
//   glno: string;
//   gstblocked: string;
//   gstrcm: string;
//   name: string;
//   no: string;

// }



@Output() onCancel = new EventEmitter<any>();
@Output() onSubmit = new EventEmitter<any>();
apSubCategoryForm: FormGroup


categoryList: Array<catlistss>;
category_id     = new FormControl();


expenseList: Array<catlistss>;
expense_id     = new FormControl();
isLoading = false;
has_next = true;
has_previous = true;
currentpage: number = 1;
glnolist:Array<any>=[]

@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

@ViewChild('cat') matcatAutocomplete: MatAutocomplete;
@ViewChild('catInput') catInput: any;

@ViewChild('exp') matexpAutocomplete: MatAutocomplete;
@ViewChild('expInput') expInput: any;

@ViewChild('glno') matglno:MatAutocomplete
@ViewChild('glInput') matglinput:ElementRef;

gstblockedlist=[{'id':'1', 'show':'Yes', 'name':'Y'},{'id':'2', 'show':'No', 'name':'N'}]
gstrcmlist=[{'id':'1','show':'Yes', 'name':'Y'},{'id':'2','show':'No', 'name':'N'}]

  constructor(private fb: FormBuilder, private router: Router,
    private atmaService: AtmaService, private notification: NotificationService,
    private toastr: ToastrService,private spinner:NgxSpinnerService) { }
  
  
  ngOnInit(): void {
    this.apSubCategoryForm = this.fb.group({
      category_id: ['', this.SelectionValidator],
      name: ['', Validators.required],
      no: ['', Validators.required],
      expense_id: ['', Validators.required],
      glno: ['', Validators.required],
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      assetcode: ['',Validators.required],
      category_no:['',Validators.required],
      blocked_rcm:['',Validators.required],
      code:['',Validators.required],
      gldesc:['',Validators.required],
      glsort:['',Validators.required]

    })


    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apSubCategoryForm.get('category_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getcategory_subcat(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryList = datas;

    })
    let expkeyvalue: String = "";
    this.getexp(expkeyvalue);
    this.apSubCategoryForm.get('expense_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getexpen(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.expenseList = datas;

    })

    let glkeyvalue:String="";
    this.getglnolist(glkeyvalue);
    this.apSubCategoryForm.get('glno').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value => this.atmaService.getglno(value,1)
      .pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      ))
    ).subscribe((results:any[])=>{
      this.glnolist=results['data'];
    })



}


dataevent(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
autocompletecatScroll() {
setTimeout(() => {
  if (
    this.matcatAutocomplete &&
    this.autocompleteTrigger &&
    this.matcatAutocomplete.panel
  ) {
    fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
        const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
        const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.atmaService.getcategory_subcat(this.catInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.categoryList = this.categoryList.concat(datas);
                // console.log("emp", datas)
                if (this.categoryList.length >= 0) {
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

public displayFncat(cat?: catlistss): string | undefined {
return cat ? cat.name : undefined;
}

get cat() {
return this.apSubCategoryForm.get('category_id');
}


private getcategory(apcatkeyvalue) {
this.atmaService.getcategory_subcat(apcatkeyvalue,1)
.subscribe((results: any[]) => {
let datas = results["data"];
this.categoryList = datas;
})
}


autocompleteexpScroll() {
setTimeout(() => {
  if (
    this.matexpAutocomplete &&
    this.autocompleteTrigger &&
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
          if (this.has_next === true) {
            this.atmaService.getexpen(this.expInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.expenseList = this.expenseList.concat(datas);
                // console.log("emp", datas)
                if (this.expenseList.length >= 0) {
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

public displayFnexp(exp?: explistss): string | undefined {
return exp ? exp.head : undefined;
}

get exp() {
return this.apSubCategoryForm.get('expense_id');
}
public glnointerface(data?: gllist):string | undefined{
  return data? data.no:undefined
}

private getexp(expkeyvalue) {
this.atmaService.getexp(expkeyvalue)
.subscribe((results: any[]) => {
let datas = results["data"];
this.expenseList = datas;
})
}

getglnolist(glkey){
  this.atmaService.getglno().subscribe(data=>{
    this.glnolist=data['data'];
    if(this.glnolist.length>0){
      let datapagination =data['pagination'];
      this.has_next =datapagination.has_next;
      this.has_previous=datapagination.has_previous;
      this.currentpage=datapagination.index;
    }
  })
}

autocompleteglnoscroll(){
      
  setTimeout(() => {
    if (
      this.matglno &&
      this.autocompleteTrigger &&
      this.matglno.panel
    ) {
      fromEvent(this.matglno.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matglno.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matglno.panel.nativeElement.scrollTop;
          const scrollHeight = this.matglno.panel.nativeElement.scrollHeight;
          const elementHeight = this.matglno.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.atmaService.getglno(this.matglinput.nativeElement.value,this.currentpage+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.glnolist = this.glnolist.concat(datas);
                  if (this.glnolist.length > 0) {
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
private SelectionValidator(fcvalue: FormControl) {
if (typeof fcvalue.value === 'string') {
  return { incorrectValue: `Selected value only Allowed` }
}
return null;
}
gldescription(data:any){
  this.apSubCategoryForm.get('gldesc').patchValue(data['description']);
  this.apSubCategoryForm.get('glsort').patchValue(data['sortorder']); 
}
apsubcategoryCreateForm(){
  // if(this.apSubCategoryForm.value.glno.trim().toString().length==9 || this.apSubCategoryForm.value.glno.trim().toString().length==16){
  //  console.log('1');
  // }
  // else{
  //   this.notification.showError("Please Enter The GlNo 9 or 16 digits");
  //   return false;
  // }
if (this.apSubCategoryForm.value.category_id=== '' ||this.apSubCategoryForm.value.category_id.id== undefined || this.apSubCategoryForm.value.category_id==null ){
  this.toastr.error('Add Category Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}
if (this.apSubCategoryForm.value.name===""){
  this.toastr.error('Add Name Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.name.trim()===""){
  this.toastr.error('Add Name Field',' WhiteSpace Not Allowed',{timeOut: 1500});
  return false;
}
if (this.apSubCategoryForm.value.name.trim().length > 128){
  this.toastr.error('Not more than 20 characters','Enter valid Name' ,{timeOut: 1500});
  return false;
}
if (this.apSubCategoryForm.value.no===""){
  this.toastr.error('Add No Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}
if(this.apSubCategoryForm.value.code==''){
  this.toastr.error('Please Enter the AP SubCategory Code');
  return false;
}
// if (this.apSubCategoryForm.value.expense_id===""){
//   this.toastr.error('Add Expense Field','Empty value inserted' ,{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.expense.trim()===""){
//   this.toastr.error('Add Expense Field',' WhiteSpace Not Allowed',{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.expense.trim().length > 20){
//   this.toastr.error('Not more than 20 characters','Enter valid Expense' ,{timeOut: 1500});
//   return false;}
if (this.apSubCategoryForm.value.glno===''||this.apSubCategoryForm.value.glno.id ===undefined || this.apSubCategoryForm.value.glno==null){
  this.toastr.error('Add GL NO Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}
// if (this.apSubCategoryForm.value.glno.trim()===""){
//   this.toastr.error('Add GL NO Field',' WhiteSpace Not Allowed',{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.glno.trim().length > 20){
//   this.toastr.error('Select valid GL NO');
//   return false;
// }
if (this.apSubCategoryForm.value.assetcode===""){
  this.toastr.error('Please Enter the AssetCode');
  return false;
}
if (this.apSubCategoryForm.value.gstblocked==="" ){
  this.toastr.error('Add Gst Blocked Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.gstrcm===""){
  this.toastr.error('Add GST RCM Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}

// this.apSubCategoryForm.value.category_id=this.apSubCategoryForm.value.category_id.id;
// this.apSubCategoryForm.value.expense_id=this.apSubCategoryForm.value.expense_id.id;

// let data = this.apSubCategoryForm.value;
let data:any={
  "no":this.apSubCategoryForm.value.no,
  "name":this.apSubCategoryForm.value.name.trim(),  
  "category_id": this.apSubCategoryForm.value.category_id.id,
  "glno":this.apSubCategoryForm.value.glno.no,
  "gl_id":this.apSubCategoryForm.value.glno.id,
  // "expense_id":this.apSubCategoryForm.value.expense_id,
  "code":this.apSubCategoryForm.value.code,
  "gstblocked":this.apSubCategoryForm.value.gstblocked,
  "gstrcm":this.apSubCategoryForm.value.gstrcm,
  "assetcode":this.apSubCategoryForm.value.assetcode
  
}
console.log(data);


this.spinner.show();
this.atmaService.apSubCategoryCreateForm(data)
.subscribe(res => {
 this.spinner.hide();
    if(res.status === 'success'){
      this.notification.showSuccess(res.message)
      this.onSubmit.emit();      
    }
    else  {
      this.notification.showWarning(res.description)
    }
  }
),
(error)=>{
  this.spinner.hide();
  this.notification.showWarning(error.status+error.statusText);
}
}
onCancelClick() {
this.onCancel.emit()
}
omit_special_char(event) {
  var k;
  k = event.charCode;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
getcategotydata(){
  console.log('1')
  console.log(this.apSubCategoryForm.get('category_id').value);
  this.apSubCategoryForm.get('category_no').patchValue(this.apSubCategoryForm.get('category_id').value.no);

}
}