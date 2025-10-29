import { Component, OnInit, Output, EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged,debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
export interface ApCategory {
  id: string;
  name: string;
}
export interface catlistss {
  id: string;
  name: string;
}

export interface gllist{
  id:number;
  no:string;
}
@Component({
  selector: 'app-apsubcategory-edit',
  templateUrl: './apsubcategory-edit.component.html',
  styleUrls: ['./apsubcategory-edit.component.scss']
})
export class ApsubcategoryEditComponent implements OnInit {
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

@ViewChild('cat') matcatAutocomplete: MatAutocomplete;
@ViewChild('catInput') catInput: any;

@ViewChild('glno') matglno:MatAutocomplete
@ViewChild('glInput') matglinput:ElementRef;

  apSubCategoryEditForm: FormGroup
  categoryList: Array<ApCategory>;
  categoryID: any;
  category_id = new FormControl();
  disableSubmit = true;
  gstlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
  gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
  assetlist={'Y':'Yes','N':'No'}
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  glnolist:Array<any>=[]


  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,private spinner:NgxSpinnerService,
    private atmaService: AtmaService, private router: Router) { }

  ngOnInit(): void {
    this.apSubCategoryEditForm = this.fb.group({
      category_id: ['', Validators.required],
      // expense: ['', Validators.required],
      glno: ['', Validators.required],
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],
      category_no:[''],
      assetcode:[''],
      code:['']

    })

    this.getApSubCategoryEdit();

    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apSubCategoryEditForm.get('category_id').valueChanges
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
    let glkeyvalue:String="";
    this.getglnolist(glkeyvalue);
    this.apSubCategoryEditForm.get('glno').valueChanges
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

  public displayapcat(apcatname?: ApCategory): string | undefined {
    return apcatname ? apcatname.name : undefined;
  }

public displayFncat(cat?: catlistss): string | undefined {
  return cat ? cat.name : undefined;
  }
  get apcatname() {
    return this.apSubCategoryEditForm.get('category_id');
  }
  public glnointerface(data?: gllist):string | undefined{
    return data? data.no:undefined
  }
  
  private getcategory(apcatkeyvalue) {
    this.atmaService.getcategory_subcat(apcatkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;

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

  getApSubCategoryEdit() {
    let id = this.shareService.apSubCategoryEdit.value
    this.atmaService.getApSubCategoryEdit(id)
      .subscribe((results: any) => {
        let Category = results.category;
        // let Expense = results.expense?.head;
        let Glno = results.glno;
        let Gstblocked = results.gstblocked;
        let Gstrcm = results.gstrcm;
        let Name = results.name;
        let No = results.no;
        let APcatNo=results.category_id?.no;
        let isassest=results.category_id?.isasset
        let Code=results.code
        let Assestcode=results.assetcode


        this.apSubCategoryEditForm.patchValue({
          category_id: {'id':results?.category_id?.id,'name':results?.category_id?.name},
          // expense:Expense,
          glno:{'id':results?.gl_id,'no':results?.glno},
          gstblocked: Gstblocked,
          gstrcm: Gstrcm,
          name: Name,
          no: No,
          category_no:APcatNo,
          assetcode:Assestcode,
          code:Code
        })
      })
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
    getcategotydata(){
      console.log('1')
      console.log(this.apSubCategoryEditForm.get('category_id').value.id);
      this.apSubCategoryEditForm.get('category_no').patchValue(this.apSubCategoryEditForm.get('category_id').value.no);
    
    }
    

  createFormate() {
    let data = this.apSubCategoryEditForm.controls;
    let apatclass = new apcatsubtype();
    apatclass.category_id = data['category_id'].value.id;
    // apatclass.expense = data['expense'].value;
    apatclass.glno = data['glno'].value.no;
    apatclass.gl_id = data['glno'].value.id;
    apatclass.gstblocked = data['gstblocked'].value;
    apatclass.gstrcm = data['gstrcm'].value;
    apatclass.name = data['name'].value;
    apatclass.no = data['no'].value;
    apatclass.category_no =data['category_no'].value;
    apatclass.assetcode = data['assetcode'].value;
    apatclass.code=data['code'].value;
    return apatclass;
  }
  apsubcategoryEdit_Form() {
    if (this.apSubCategoryEditForm.get('category_id').value==='' || this.apSubCategoryEditForm.get('category_id').value.id ==undefined || this.apSubCategoryEditForm.get('category_id').value === null){
      this.notification.showWarning('Please Select the Category Field');
      return false;
    }
    if (this.apSubCategoryEditForm.value.name===""){
      this.notification.showWarning('Please Enter the AP SubCategory Name');
      return false;
    }
    if (this.apSubCategoryEditForm.value.no===""){
      this.notification.showWarning('Please Enter the AP SubCategory No');
      return false;
    }
   
    if (this.apSubCategoryEditForm.value.glno===''||this.apSubCategoryEditForm.value.glno.id ===undefined || this.apSubCategoryEditForm.value.glno==null){
      this.notification.showWarning('Please Select the GL No Field');
      return false;
    }
    if (this.apSubCategoryEditForm.value.assetcode===""){
      this.notification.showWarning('Please Enter the AssetCode');
      return false;
    }
    if (this.apSubCategoryEditForm.value.gstblocked==="" ){
      this.notification.showWarning('Add Gst Blocked Field');
      return false;
    }if (this.apSubCategoryEditForm.value.gstrcm===""){
      this.notification.showWarning('Add GST RCM Field');
      return false;
    }
    if (this.apSubCategoryEditForm.valid) {
      let idValue: any = this.shareService.apSubCategoryEdit.value
      this.spinner.show();
      this.atmaService.apSubCategoryEdit(this.createFormate(), idValue.id).subscribe(res => {
          console.log("res", res)
      this.spinner.hide();

      if(res.status === "success"){
        this.notification.showSuccess("Updated Successfully");
        this.onSubmit.emit();
      }
        else {
            this.notification.showWarning(res.description)
            this.disableSubmit = false;
          }
        }
        )
    } else {
      this.spinner.hide();
      this.notification.showError(("INVALID_DATA"))
      this.disableSubmit = false;
    }

  }

  onCancelClick() {
    this.onCancel.emit()
  }
  dataevent(event:any){
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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

class apcatsubtype {
  category_id: any;
  expense: string;
  glno: string;
  gstblocked: string;
  gstrcm: string;
  name: string;
  no: string;
  assetcode:string;
  category_no:string;
  code:string;
  gl_id: any;

}