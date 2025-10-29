import { Component, OnInit, Output, EventEmitter,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { finalize, switchMap, tap,map, distinctUntilChanged,debounceTime,takeUntil } from 'rxjs/operators';
import { fromEvent} from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

// export interface catlistss {
//   id: string;
//   name: string;
// }
export interface isitorod {
  id: number;
  text: string;
}
export interface explistss {
  id: string;
  head: string;
}
@Component({
  selector: 'app-apcategory-edit',
  templateUrl: './apcategory-edit.component.html',
  styleUrls: ['./apcategory-edit.component.scss']
})

export class ApcategoryEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;
  @ViewChild('exp') matexpAutocomplete: MatAutocomplete;
  @ViewChild('expInput') expInput: any;
  apCategoryEditForm: FormGroup;
  categoryList: Array<any>;
  oditList:isitorod[]=[];
  expenseList:Array<any>=[];
  disableSubmit = true;
  odit={1:'OD',2:'IT'};
  filtersiasset:any={'1':'Y','0':'N'};
  assetlist=[{'id':'1', 'name':'Y','show':'Yes'},
            {'id':'2', 'name':'N','show':'No'}]
  isLoading=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  constructor(private fb: FormBuilder,private notification: NotificationService,private router: Router,private shareService: ShareService,private atmaService: AtmaService,
              private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.apCategoryEditForm = this.fb.group({
      name: ['', Validators.required],
      no: ['', Validators.required],
      glno: ['', Validators.required],
      isasset: ['', Validators.required],
      expense_id:['',Validators.required],
      // isodit:['',Validators.required],
      code:['',Validators.required]


    })
    this.getexpenselistdropdown();
    this.apCategoryEditForm.get('expense_id').valueChanges
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
    this.getApCategoryEdit();
    // this.getODIT();
  }
 
    public displayFnexp(exp?: explistss): string | undefined {
      return exp ? exp.head : undefined;
      }
   
    // getODIT(){
    //   this.atmaService.getODIT()
    //       .subscribe((results: any[]) => {
    //         let datas = results["data"];
    //         this.oditList = datas;
    //         console.log("oditList", datas)
    //       })
    // }
    getexpenselistdropdown(){
      this.atmaService.getexpen('',1).subscribe((result:any)=>{
        this.expenseList=result['data']
        console.log("expence list",this.expenseList)
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
  getApCategoryEdit() {
    let id = this.shareService.apCategoryEdit.value
    console.log('data',id)
    this.atmaService.getApCategoryEdit(id).subscribe((results: any) => {
        let Name = results.name;
        let No=results.no;
        let Glno = results.glno;
        let Isasset=results.isasset;
         let Expense = results.expense?.head;
        // let odit=results.isodit;
        let Code=results.code
        console.log(Isasset)
        this.apCategoryEditForm.patchValue({
          // category_id: {'id':results?.id,'name':results?.name},
          name:Name,
          no:No,
          glno:Glno,
          isasset:Isasset,
          expense_id:{'id':results?.expense?.id,'head':results?.expense?.head},
          // isodit:{'id':odit,'text':this.odit[odit]},
          code:Code

         
        });
        // this.apCategoryEditForm.get('isodit').patchValue({"id":odit,"text":this.odit[odit]})
      })
    }

  apcategory_EditForm() {
    this.disableSubmit = true;
    if(this.apCategoryEditForm.valid){
    let idValue: any = this.shareService.apCategoryEdit.value
    let data = {
      "no":this.apCategoryEditForm.value.no,
      "name": this.apCategoryEditForm.value.name,
      "code":this.apCategoryEditForm.value.code,
      'expense_id':this.apCategoryEditForm.value.expense_id.id,
      "glno":this.apCategoryEditForm.value.glno?this.apCategoryEditForm.value.glno:0,
      "isasset":this.apCategoryEditForm.value.isasset,
    }
    // data.expense_id = data.expense_id ? data.expense_id.id : null;
    this.spinner.show();
    this.atmaService.apCategoryEdit(data, idValue.id).subscribe(res => {
    this.spinner.hide(); 

         if(res.status === "success"){
        this.notification.showSuccess("Updated Successfully");
        this.onSubmit.emit();
      }
        else {
            this.notification.showWarning(res.description)
            this.disableSubmit = false;
          }
      })} else {
        this.notification.showError("INVALID_DATA!...")
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

}