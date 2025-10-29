import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PprService } from '../ppr.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorhandlingService } from '../errorhandling.service';
import { stat } from 'fs';
export interface dropdowninterface {
  id: number
  name: string
  combo_level:string
  value:string
}
@Component({
  selector: 'app-exception-master',
  templateUrl: './exception-master.component.html',
  styleUrls: ['./exception-master.component.scss']
})
export class ExceptionMasterComponent implements OnInit {
  @ViewChild('exception_popup') exception_popup:any;
  @ViewChild('level_popup') level_popup:any;
  @ViewChild('closepopup_expmaster') closepopup_expmaster:any;
  @ViewChild('closepopup_level_mapp') closepopup_level_mapp:any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('product_auto')product_auto:MatAutocomplete;
  @ViewChild('productInput')product_Input :any;
  @ViewChild('category_auto')category_auto:MatAutocomplete;
  @ViewChild('category_Input')category_Input :any;
  @ViewChild('subcategory_auto')subcategory_auto:MatAutocomplete;
  @ViewChild('subcategory_Input')subcategory_Input :any;
  @ViewChild('levelauto')level_auto:MatAutocomplete;
  @ViewChild('levelInput')level_Input :any;
  @ViewChild('bs_Auto')bs_auto:MatAutocomplete;
  @ViewChild('bs_Input')bs_Input :any;
  @ViewChild('cc_Auto')cc_auto:MatAutocomplete;
  @ViewChild('cc_Input')cc_Input :any;
  // edit
  @ViewChild('product_edit_auto')product_edit_auto:MatAutocomplete;
  @ViewChild('product_edit_Input')product_edit_Input :any;
  @ViewChild('category_edit_auto')category_edit_auto:MatAutocomplete;
  @ViewChild('category_edit_Input')category_edit_Input :any;
  @ViewChild('subcategory_edit_auto')subcategory_edit_auto:MatAutocomplete;
  @ViewChild('subcategory_edit_Input')subcategory_edit_Input :any;
  @ViewChild('level_edit_auto')level_edit_auto:MatAutocomplete;
  @ViewChild('level_edit_Input')level_edit_Input :any;
  @ViewChild('bs_edit_Auto')bs_edit_auto:MatAutocomplete;
  @ViewChild('bs_edit_Input')bs_edit_Input :any;
  @ViewChild('cc_edit_Auto')cc_edit_auto:MatAutocomplete;
  @ViewChild('name_Auto')name_Auto:MatAutocomplete;
  @ViewChild('cc_edit_Input')cc_edit_Input :any;
  @ViewChild('name_Input')name_Input:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('branchsearchInput') branchsearchInput: any;

  exception_master_search: FormGroup
  exception_master_edit:FormGroup
  productdetails: any;
  isLoading: boolean;
  dropdown_next: boolean;
  dropdown_previous: boolean;
  dropdown_currentpage: number;
  categorydetails: any;
  subcategorydetails: any;
  exceptionmaster_search: any;
  leveldetails: any;
  bsdetails: any;
  ccdetails: any;
  summaryview:boolean
  edit_ccdetails: any;
  edit_bsdetails: any;
  edit_leveldetails: any;
  edit_subcategorydetails: any;
  edit_categorydetails: any;
  edit_productdetails: any;
  excep_edit_id: any;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  currentpage: number;
  summarysearch:any
  type_exception: any;
  Dcs_level_condition:boolean=true
   level_mapping_condition:boolean=false;
  Dcs_List=[{id:1, "name": "DCS Level"},
{id:2,"name":"Level Mapping"}]
Level_mapping:FormGroup;
  name_list: any;
  branchList: any;
  branchid: any;
  constructor(private formbuilder: FormBuilder, private exception_service: PprService,private toastr:ToastrService,private SpinnerService:NgxSpinnerService,private Errorhandling:ErrorhandlingService) { }

  ngOnInit(): void {
    this.exception_master_search = this.formbuilder.group({
      product: [''],
      category: [''],
      subcategory: [''],
      level:[''],
      glno:[''],
      bs:[''],
      cc:[''],
      dcs_list_name:['']
    })
    this.exception_master_edit = this.formbuilder.group({
      edit_product: [''],
      edit_category: [''],
      edit_subcategory: [''],
      edit_level:[''],
      edit_glno:[''],
      edit_bs:[''],
      edit_cc:[''],
      edit_vertical:[''],
      edit_gl:[''],
      edit_branch:['']
    })
    this.Level_mapping=this.formbuilder.group({
      name:"",
      level:""
    })
    // this.exception_Serch(this.exception_master_search)
  }
  public productdisplay(product?: dropdowninterface): string | undefined {
    return product ? product.name : undefined;
  }
  getproduct(productvalue) {
    this.exception_service.get_product(productvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productdetails = datas
      })
  }
  product_dropdown() {
    let productvalue: String = "";
    this.getproduct(productvalue);
    this.exception_master_search.get('product').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_product(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productdetails = datas;
      })
  }
  product_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.product_auto &&
        this.autocompleteTrigger &&
        this.product_auto.panel
      ) {
        fromEvent(this.product_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.product_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.product_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.product_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.product_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_product(this.product_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productdetails = this.productdetails.concat(datas);
                    if (this.productdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public categorydisplay(category?: dropdowninterface): string | undefined {
    return category ? category.name : undefined;
  }
  getcategory(categoryvalue) {
    this.exception_service.get_category(categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categorydetails = datas
      })
  }
  category_dropdown() {
    let categoryvalue: String = "";
    this.getcategory(categoryvalue);
    this.exception_master_search.get('category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_category(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categorydetails = datas;
        if(this.exception_master_search.value.subcategory!=undefined || this.exception_master_search.value.subcategory!=null || this.exception_master_search.value.subcategory!='' ){
          this.exception_master_search.controls['subcategory'].reset('')
        }
      })
  }
  category_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.category_auto &&
        this.autocompleteTrigger &&
        this.category_auto.panel
      ) {
        fromEvent(this.category_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.category_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.category_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.category_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.category_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_category(this.category_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categorydetails = this.categorydetails.concat(datas);
                    if (this.categorydetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public subcategorydisplay(subcat?: dropdowninterface): string | undefined {
    return subcat ? subcat.name : undefined;
  }
  getsubcategory(categoryvalue,cat_id) {
    this.exception_service.get_subcategory(categoryvalue, 1, cat_id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategorydetails = datas
      })
  }
  subcategory_dropdown() {
    let categoryvalue: String = "";
    let cat_id
    if(this.exception_master_search.value.category=='' || this.exception_master_search.value.category==null || this.exception_master_search.value.category==undefined){
      cat_id=''
    }else{
    cat_id=this.exception_master_search.value.category.id
    }
    this.getsubcategory(categoryvalue,cat_id);
    this.exception_master_search.get('subcategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_subcategory(value, 1,cat_id)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategorydetails = datas;
      })
  }
  subcategory_scroll() {
    let cat_id
    if(this.exception_master_search.value.cat_id=='' || this.exception_master_search.value.cat_id==null || this.exception_master_search.value.cat_id==undefined){
      cat_id=''
    }else{
    cat_id=this.exception_master_search.value.cat_id.id
    }
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.subcategory_auto &&
        this.autocompleteTrigger &&
        this.subcategory_auto.panel
      ) {
        fromEvent(this.subcategory_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.subcategory_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.subcategory_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.subcategory_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.subcategory_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_subcategory(this.subcategory_Input.nativeElement.value, this.dropdown_currentpage + 1,cat_id)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subcategorydetails = this.subcategorydetails.concat(datas);
                    if (this.subcategorydetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public leveldisplay(level?: dropdowninterface): string | undefined {
    return level ? level.name : undefined;
  }
  getlevel(categoryvalue) {
    this.exception_service.getallocationleveldropdown(categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.leveldetails = datas
      })
  }
  level_dropdown() {
    let categoryvalue: String = "";
    this.getlevel(categoryvalue);
    this.exception_master_search.get('level').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.getallocationleveldropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.leveldetails = datas;
      })
  }
  level_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.level_auto &&
        this.autocompleteTrigger &&
        this.level_auto.panel
      ) {
        fromEvent(this.level_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.level_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.level_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.level_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.level_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.getallocationleveldropdown(this.level_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.leveldetails = this.leveldetails.concat(datas);
                    if (this.leveldetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public bsdisplay(bs?: dropdowninterface): string | undefined {
    return bs ? bs.name : undefined;
  }
  getbs(categoryvalue) {
    this.exception_service.get_bs_dropdown(1,categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsdetails = datas
      })
  }
  bs_Dropdown() {
    let categoryvalue: String = "";
    this.getbs(categoryvalue);
    this.exception_master_search.get('bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_bs_dropdown(1,value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsdetails = datas;
      })
  }
  bsscroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.bs_auto &&
        this.autocompleteTrigger &&
        this.bs_auto.panel
      ) {
        fromEvent(this.bs_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.bs_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.bs_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.bs_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.bs_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_bs_dropdown(1,this.bs_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsdetails = this.bsdetails.concat(datas);
                    if (this.bsdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }  

  public ccdisplay(cc?: dropdowninterface): string | undefined {
    return cc ? cc.name : undefined;
  }
  getcc(categoryvalue) {
    this.exception_service.get_cc_dropdown(1,categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccdetails = datas
      })
  }
  cc_Dropdown() {
    let categoryvalue: String = "";
    this.getcc(categoryvalue);
    this.exception_master_search.get('cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_cc_dropdown(1,value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccdetails = datas;
      })
  }
  ccscroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.cc_auto &&
        this.autocompleteTrigger &&
        this.cc_auto.panel
      ) {
        fromEvent(this.cc_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.cc_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.cc_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.cc_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.cc_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_cc_dropdown(1,this.cc_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ccdetails = this.ccdetails.concat(datas);
                    if (this.ccdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }  

  exception_Serch(exception_value,pageNumber=1){
    // this.summaryview=false
    console.log(exception_value)
    let level_id:any
    let bs_id:any
    let cc_id:any
    let cat_id:any
    let subcat_id:any
    let glno_id:any
    let product_id:any
    let dcs_id:any
    let flag_dcs:any
    if(this.exception_master_search.value.dcs_list_name=='' || this.exception_master_search.value.dcs_list_name==null || this.exception_master_search.value.dcs_list_name==undefined){
      this.toastr.warning("","Please Selete Type")
      return false
      dcs_id=''
    }else{
      dcs_id=this.exception_master_search.value.dcs_list_name.id
      if(dcs_id==1){
        flag_dcs=false       
      }else{
        flag_dcs=true  
      }
    }
    if(this.exception_master_search.value.product=='' || this.exception_master_search.value.product==undefined || this.exception_master_search.value.product==null){
      product_id=''
    }else{
      product_id=this.exception_master_search.value.product
    }
    if(this.exception_master_search.value.level=='' || this.exception_master_search.value.level==undefined || this.exception_master_search.value.level==null){
      level_id=''
    }else{
      level_id=this.exception_master_search.value.level.id
    }
    if(this.exception_master_search.value.bs=='' || this.exception_master_search.value.bs==undefined || this.exception_master_search.value.bs==null){
      bs_id=''
    }else{
      bs_id=this.exception_master_search.value.bs.id
    }
    if(this.exception_master_search.value.category=='' || this.exception_master_search.value.category==undefined || this.exception_master_search.value.category==null){
      cat_id=''
    }else{
      cat_id=this.exception_master_search.value.category.id
    }
    if(this.exception_master_search.value.subcategory=='' || this.exception_master_search.value.subcategory==undefined || this.exception_master_search.value.subcategory==null){
      subcat_id=''
      glno_id=''
    }else{
      subcat_id=this.exception_master_search.value.subcategory.id
      glno_id=this.exception_master_search.value.subcategory.glno
    }
    if(this.exception_master_search.value.cc=='' || this.exception_master_search.value.cc==null || this.exception_master_search.value.cc==undefined){
      cc_id=''
    }else{
      cc_id=this.exception_master_search.value.cc.id
    }
 
    this.summarysearch={
      level:level_id,
      bs_id:bs_id,
      category_id:cat_id,
      subcategory_id:subcat_id,
      cc_id:cc_id,
      glno:glno_id,
      product:product_id,
      flag:flag_dcs,
    }
    console.log('summarysearch',this.summarysearch)
    this.SpinnerService.show()
    this.exception_service.exceptionmastersummary(this.summarysearch,pageNumber).subscribe(results=>{
      console.log(results)   
      this.exceptionmaster_search=results['data']
      if(dcs_id==1){
        // flag_dcs=false
        this.Dcs_level_condition=true;
        this.level_mapping_condition=false;
      }else{
        // flag_dcs=true
        this.Dcs_level_condition=false;
        this.level_mapping_condition=true;
      }  
      this.SpinnerService.hide()  
      let dataPagination=results['pagination']
      if (this.exceptionmaster_search.length > 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      }
    },error => {
      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick(){
    if (this.has_previous === true) {
      console.log("previous")   
      this.currentpage = this.presentpage - 1
      this.exception_Serch(this.summarysearch,this.presentpage - 1)
    }
  }
  nextClick() {
    if (this.has_next === true) {
        this.currentpage = this.presentpage + 1
        this.exception_Serch(this.summarysearch,this.presentpage + 1)
      }
   
    }
  reset_exception_search(){
    this.exception_master_search.controls['product'].reset('')
    this.exception_master_search.controls['category'].reset('')
    this.exception_master_search.controls['subcategory'].reset('')
    this.exception_master_search.controls['level'].reset('')
    this.exception_master_search.controls['glno'].reset('')
    this.exception_master_search.controls['bs'].reset('')
    this.exception_master_search.controls['cc'].reset('')
    this.exception_master_search.controls['dcs_list_name'].reset('')
  }
  exception_edit_add(value,excep_id){
    this.exception_popup.nativeElement.click();
    this.type_exception=value
    if(value == 'view'){
      let excep_view_id=excep_id
      this.SpinnerService.show()
      this.exception_service.exceptionpaticular_value_get(excep_view_id).subscribe(e=>{
        console.log('paticular value=>',e)
        this.SpinnerService.hide()
        let patculardata=e['data'][0]
        this.exception_master_edit.patchValue({
          'edit_product':patculardata.product_code,
          'edit_subcategory':"",
          'edit_bs':patculardata.bs_id,
          'edit_cc':patculardata.set_cc_id,
          'edit_category':"",
          "edit_level":patculardata.set_level,
          "edit_vertical":patculardata.vertical,
          "edit_gl":patculardata.glno,
          "edit_branch":patculardata.set_branch_code
      })
      })
    }else if(value=='add'){
      // this.closepopup()
      
    }else{
      console.log("edit",excep_id)
      
      this.excep_edit_id=excep_id
      this.SpinnerService.show()
      this.exception_service.exceptionpaticular_value_get(this.excep_edit_id).subscribe(e=>{
        console.log('paticular value=>',e)
        this.SpinnerService.hide()
        let patculardata=e['data'][0]
        this.exception_master_edit.patchValue({
          'edit_product':patculardata.product_code,
          'edit_subcategory':"",
          'edit_bs':patculardata.bs_id,
          'edit_cc':patculardata.set_cc_id,
          'edit_category':"",
          "edit_level":patculardata.set_level,
          "edit_vertical":patculardata.vertical,
          "edit_gl":patculardata.glno,
          "edit_branch":patculardata.set_branch_code
      })
      })

    }
  }

  level_edit_add(){
    this.Level_mapping.reset()
this.level_popup.nativeElement.click();

  }

  level_mapping_list(){
    let Name_value=this.Level_mapping.value.name?.key??""
    let Level_value=this.Level_mapping.value.level
    this.SpinnerService.show()
    this.exception_service.level_Add_data(Name_value,Level_value).subscribe((results: any[]) => {
      this.SpinnerService.hide()
      if(results["set_code"]=="success"){
        this.toastr.success('','Successfully Created',{timeOut:1500})
        this.closepopup_level_mapp.nativeElement.click()
        let rerun=''
        this.exception_Serch(rerun)
      }else{
        this.toastr.warning('',results['set_description'],{timeOut:1500})
      }      
     
    },error => {
      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
  }

  closepopups(){
    this.Level_mapping.value.reset()
  }

  public product_edit_display(product?: dropdowninterface): string | undefined {
    return product ? product.name : undefined;
  }

  level_status_change(level,status){
let data_id=level
let data_status=status
let dataConfirm = confirm("Are you sure,You Are Change The Status?")
if (dataConfirm == false) {
  return false;
}
this.SpinnerService.show()
this.exception_service.level_change_status(data_id,data_status).subscribe((results: any[]) => {
  this.SpinnerService.hide()
  this.toastr.success('',results["message"],{timeOut:1500})
  let rerun=''
  this.Level_mapping.reset()
  this.exception_Serch(rerun)
},error => {
  this.Errorhandling.handleError(error);
  this.SpinnerService.hide();
})
  }
  getproduct_edit(productvalue) {
    this.exception_service.get_product(productvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_productdetails = datas
      })
  }
  product_edit_dropdown() {
    let productvalue: String = "";
    this.getproduct_edit(productvalue);
    this.exception_master_edit.get('edit_product').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_product(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_productdetails = datas;
      })
  }
  product_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.product_edit_auto &&
        this.autocompleteTrigger &&
        this.product_edit_auto.panel
      ) {
        fromEvent(this.product_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.product_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.product_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.product_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.product_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_product(this.product_edit_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_productdetails = this.edit_productdetails.concat(datas);
                    if (this.edit_productdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public category_edit_display(category?: dropdowninterface): string | undefined {
    return category ? category.name : undefined;
  }
  getcategory_edit(categoryvalue) {
    this.exception_service.get_category(categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_categorydetails = datas
      })
  }
  subcat_show=true
  category_edit_dropdown() {
    this.subcat_show=false
    let categoryvalue: String = "";
    this.getcategory_edit(categoryvalue);
    this.exception_master_edit.get('edit_category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_category(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_categorydetails = datas;
        if(this.subcat_show==false){

        if((this.exception_master_edit.value.edit_subcategory!='' || this.exception_master_edit.value.edit_subcategory !=undefined || this.exception_master_edit.value.edit_subcategory !=null)){
          this.exception_master_edit.controls['edit_subcategory'].reset('')
          this.subcat_show=true
        }
      }
      })
  }
  category_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.category_edit_auto &&
        this.autocompleteTrigger &&
        this.category_edit_auto.panel
      ) {
        fromEvent(this.category_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.category_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.category_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.category_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.category_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_category(this.category_edit_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_categorydetails = this.edit_categorydetails.concat(datas);
                    if (this.edit_categorydetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public subcategory_edit_display(subcat?: dropdowninterface): string | undefined {
    return subcat ? subcat.name : undefined;
  }
  getsubcategory_edit(categoryvalue,cat_id) {
    this.exception_service.get_subcategory(categoryvalue, 1,cat_id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_subcategorydetails = datas
      })
  }
  subcategory_edit_dropdown() {
    let categoryvalue: String = "";
    let cat_id
    if(this.exception_master_edit.value.edit_category=='' || this.exception_master_edit.value.edit_category==null || this.exception_master_edit.value.edit_category==undefined){
      cat_id=''
    }else{
    cat_id=this.exception_master_edit.value.edit_category.id
    }
    this.getsubcategory_edit(categoryvalue,cat_id);
    this.exception_master_edit.get('edit_subcategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_subcategory(value, 1,cat_id)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_subcategorydetails = datas;
      })
  }
  subcategory_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    let cat_id
    if(this.exception_master_edit.value.edit_category=='' || this.exception_master_edit.value.edit_category==null || this.exception_master_edit.value.edit_category==undefined){
      cat_id=''
    }else{
    cat_id=this.exception_master_edit.value.edit_category.id
    }
    setTimeout(() => {
      if (
        this.subcategory_edit_auto &&
        this.autocompleteTrigger &&
        this.subcategory_edit_auto.panel
      ) {
        fromEvent(this.subcategory_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.subcategory_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.subcategory_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.subcategory_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.subcategory_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_subcategory(this.subcategory_edit_Input.nativeElement.value, this.dropdown_currentpage + 1,cat_id)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_subcategorydetails = this.edit_subcategorydetails.concat(datas);
                    if (this.edit_subcategorydetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public level_edit_display(level?: dropdowninterface): string | undefined {
    return level ? level.combo_level : undefined;
  }
  getlevel_edit(categoryvalue) {
    this.exception_service.getallocationleveldcsdropdown(categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_leveldetails = datas
      })
  }
  level_edit_dropdown() {
    let categoryvalue: String = "";
    this.getlevel_edit(categoryvalue);
    this.exception_master_edit.get('edit_level').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.getallocationleveldcsdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_leveldetails = datas;
      })
  }
  level_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.level_edit_auto &&
        this.autocompleteTrigger &&
        this.level_edit_auto.panel
      ) {
        fromEvent(this.level_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.level_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.level_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.level_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.level_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.getallocationleveldcsdropdown(this.level_edit_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_leveldetails = this.edit_leveldetails.concat(datas);
                    if (this.edit_leveldetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public bs_edit_display(bs?: dropdowninterface): string | undefined {
    return bs ? bs.name : undefined;
  }
  getbs_edit(categoryvalue) {
    this.exception_service.get_bs_dropdown(1,categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_bsdetails = datas
      })
  }
  bs_edit_Dropdown() {
    let categoryvalue: String = "";
    this.getbs_edit(categoryvalue);
    this.exception_master_edit.get('edit_bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_bs_dropdown(1,value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_bsdetails = datas;
      })
  }
  bs_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.bs_edit_auto &&
        this.autocompleteTrigger &&
        this.bs_edit_auto.panel
      ) {
        fromEvent(this.bs_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.bs_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.bs_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.bs_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.bs_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_bs_dropdown(1,this.bs_edit_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_bsdetails = this.edit_bsdetails.concat(datas);
                    if (this.edit_bsdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }  

  public cc_edit_display(cc?: dropdowninterface): string | undefined {
    return cc ? cc.name : undefined;
  }
  getcc_edit(categoryvalue) {
    this.exception_service.get_cc_dropdown(1,categoryvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_ccdetails = datas
      })
  }
  cc_edit_Dropdown() {
    let categoryvalue: String = "";
    this.getcc_edit(categoryvalue);
    this.exception_master_edit.get('edit_cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.get_cc_dropdown(1,value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.edit_ccdetails = datas;
      })
  }
  cc_edit_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.cc_edit_auto &&
        this.autocompleteTrigger &&
        this.cc_edit_auto.panel
      ) {
        fromEvent(this.cc_edit_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.cc_edit_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.cc_edit_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.cc_edit_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.cc_edit_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_cc_dropdown(1,this.cc_edit_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.edit_ccdetails = this.edit_ccdetails.concat(datas);
                    if (this.edit_ccdetails.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }  

  public name_display(names?: dropdowninterface): string | undefined {
    return names ? names.value : undefined;
  }
  name_Dropdown() {
    this.exception_service.get_name_level_dropdown()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.name_list = datas
      })
  }
  // name_Dropdown() {
  //   let categoryvalue: String = "";
  //   this.getname_edit(categoryvalue);
  //   this.exception_master_edit.get('edit_cc').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap(value => this.exception_service.get_cc_dropdown(1,value, 1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.name_list = datas;
  //     })
  // }
  name_scroll() {
    this.dropdown_next = true;
    this.dropdown_previous = true;
    this.dropdown_currentpage = 1;
    setTimeout(() => {
      if (
        this.name_Auto &&
        this.autocompleteTrigger &&
        this.name_Auto.panel
      ) {
        fromEvent(this.name_Auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.name_Auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.name_Auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.name_Auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.name_Auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dropdown_next === true) {
                this.exception_service.get_cc_dropdown(1,this.name_Input.nativeElement.value, this.dropdown_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.name_list = this.name_list.concat(datas);
                    if (this.name_list.length >= 0) {
                      this.dropdown_next = datapagination.has_next;
                      this.dropdown_previous = datapagination.has_previous;
                      this.dropdown_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  } 

  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.exception_master_edit.get('edit_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.exception_service.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              // this.branchid=value.id
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
    this.exception_service.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
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
                this.exception_service.getbranchdropdown(this.branchsearchInput.nativeElement.value, this.currentpagebra + 1)
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

  public displayfnbranch(branch?: dropdowninterface): string | undefined {
    return branch ? branch.name : undefined;

  }
  exception_master_list(exception){
    console.log("exception=>",exception)
    let product_code    
    let cat_id
    let cat_no
    let subcat_id
    let subcat_no
    let level_id
    let bs_id
    let bs_no
    let cc_id
    let cc_no
    let vertical_number
    let gl_no
    let branch_code=exception.edit_branch?.code??""
    if(typeof exception.edit_product !='object'){
      product_code=''
      // product_id=''
    }else{
      product_code=exception.edit_product?exception.edit_product:""
      // product_id=exception.edit_product.id
    }
    // if(typeof exception.edit_category !='object'){
    //   this.toastr.warning('','Please Select The Category')
    //   return false;
    // }else{
    //   cat_id=exception.edit_category.id
    //   cat_no=exception.edit_category.no
    // }
    // if(typeof exception.edit_subcategory !='object'){
    //   this.toastr.warning('','Please Select The Sub-Category')
    //   return false;
    // }else{
    //   subcat_id=exception.edit_subcategory.id
    //   subcat_no=exception.edit_subcategory.no
    //   gl_no=exception.edit_subcategory.glno
    // }
    if(typeof exception.edit_level !='object'){
      this.toastr.warning('','Please Select The Level')
      return false;
    }else{
      level_id=exception.edit_level.id
    }
    if(typeof exception.edit_bs !='object'){
      this.toastr.warning('','Please Select The BS')
      return false;
    }else{
      bs_id=exception.edit_bs.id
      bs_no=exception.edit_bs.microcccode
    }
    if(typeof exception.edit_cc !='object'){
      this.toastr.warning('','Please Select The CC')
      return false;
    }else{
      cc_id=exception.edit_cc.id
      cc_no=exception.edit_cc.microcccode
    }
    if(typeof exception.edit_vertical !='number'){
      // this.toastr.warning('','Please Select The Vertical')
      // return false;
      vertical_number=''
    }else{
      vertical_number=exception.edit_vertical
    }

    let exception_param={
    "id":this.excep_edit_id,
    "product_code":exception?.edit_product??"",    
    "glno":exception.edit_gl,   
    "bs_id":bs_id,   
    "cc_unique":exception.edit_cc?.microcccode??"",
    "branch_code":branch_code,   
    "level":exception.edit_level?.dcs_level??"",
    'vertical':exception?.edit_vertical??""
  }
 
    if (exception_param.id == null || exception_param.id == undefined || exception_param.id == '') {
      delete exception_param.id;
    }
    this.SpinnerService.show()
    this.exception_service.exception_masterlevel_create(exception_param).subscribe(e=>{
      console.log(e)
      this.SpinnerService.hide()
      this.reset_exception_search()
      if(e){
        if(typeof this.excep_edit_id == 'number' ){
          this.toastr.success('','Successfully Updated',{timeOut:1500})
        }else{
          this.toastr.success('','Successfully Created',{timeOut:1500})
        }
      }
      let rerun=''
      this.closepopup()
      this.excep_edit_id=''
      this.type_exception=''
      this.closepopup_expmaster.nativeElement.click();
      // this.exception_Serch(rerun)

    },error => {
      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
    
  }
  typeOf(value){
    return typeof value;
  }
  closepopup(){
    this.exception_master_edit.controls['edit_product'].reset('')
    this.exception_master_edit.controls['edit_category'].reset('')
    this.exception_master_edit.controls['edit_subcategory'].reset('')
    this.exception_master_edit.controls['edit_level'].reset('')
    this.exception_master_edit.controls['edit_bs'].reset('')
    this.exception_master_edit.controls['edit_cc'].reset('')
    this.exception_master_edit.controls['edit_vertical'].reset('')
    this.excep_edit_id=''
    this.type_exception=''
  }
  exception_status_change(id,status){
    console.log(id)
    let dataConfirm = confirm("Are you sure,You Are Change The Status?")
    if (dataConfirm == false) {
      return false;
    }
    this.SpinnerService.show()
    this.exception_service.change_status(id,status).subscribe((results: any[]) => {
      this.SpinnerService.hide()
      this.toastr.success('','Successfully Change Status',{timeOut:1500})
      let rerun=''
      this.exception_Serch(rerun)
    },error => {
      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
  }
}
