import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DrsService } from '../drs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
// import { Directive, HostListener } from '@angular/core'; 

export interface drs {
  Name: string;
  name: string,
  id: number,
  sort_order: number,
  cal: string,
  code:number,
  finyer:string
}
@Component({
  selector: 'app-schedule-item',
  templateUrl: './schedule-item.component.html',
  styleUrls: ['./schedule-item.component.scss']
})
// @Directive({
//   selector: '[appCopyPaste]'
// })

export class ScheduleItemComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("cata_data") cata_data: any;
  @ViewChild("Catagory") Catagory: MatAutocomplete;
  @ViewChild("sort_order_dta") sort_order_dta: any;
  @ViewChild("SortOrd") SortOrd: MatAutocomplete;
  // @ViewChild("schdularmaster") schdularmaster: MatAutocomplete;
  @ViewChild("calcular") calcular: MatAutocomplete;
  @ViewChild("schdulartype") schdulartype: MatAutocomplete;
  @ViewChild("Sche_data") Sche_data: any;
  @ViewChild("schdularmaster") schdularmaster: MatAutocomplete;
  @ViewChild("Schdular") Schdular: MatAutocomplete;
  @ViewChild('editableContent', { static: false }) editableContentRef!: ElementRef;
  @ViewChild('add_less_mat')add_less_mat:MatAutocomplete;







  isLoading: boolean;
  Catagory_list: any;
  cat_id: any;
  cat_has_next: boolean;
  cat_has_previous: boolean;
  cat_currentpage: number;
  currentpage: number;
  SortOrder_list: any;
  Schdularmaster_list: any;
  cal_lists = [{ id: 1, cal: "+" },
  { id: 2, cal: "-" },
  { id: 3, cal: "%" },
  { id: 4, cal: "*" },
  { id: 5, cal: "(" },
  { id: 6, cal: ")" }]
  deffference: any;
  multidata: any[] = []
  multidata1: any = []
  patch_data: any;
  sortorder_hide: boolean = false;
  category_hide: boolean = false;
  schdule_value: any;
  opratetor: any;
  Schedule_Type = [{ name: "Item", Id: "1" },
  { name: "Element", Id: "2" },]
  Upper_aierachy: any;
  Schdulartype: any;
  schedule_master: boolean;
  Schedulemaster: any;
  check_value_summary:boolean;
  // summary: any;
  summarydata: any;
  summaryshow: boolean = true;
  summarysshow: boolean = true;
  hasprevious: boolean = false;
  presentpage: number;
  hasnext: boolean = false;
  data_found: boolean;
  Editdata: any;
  Evalue: any;
  params: any;
  type: any;
  Schdularmastercreate_list: any;
  Avalue: any;
  Eid: any;
  status: any;
  cat: any;
  sort: any;
  trimmedArr: any;
  name_value: any = [];
  id_value: any = [];
  mas_currentpage: any;
  mas_has_previous: any;
  mas_has_next: any;
  conditioncheck: any;
  Schdularmaster_item_number: any;
  schdular_createtype_edit: any;
  scdular_type_sub_btn: boolean;
  schd_itm_view: boolean;
  schdular_createtype_edit_id: any;
  scdular_mas_sub_btn: boolean;
  schd_mas_view: boolean;
  schdule_master_create_edit: any;
  ref_element_null: HTMLElement;
  report_datas_ele: any;
  element_deffs: any;
  array_edit_data: any;
  refe_id: any=[];
  refe_value: string;
  edit_schedule_value: any;
  data_scdhele_found: boolean;
  finyearList: any;
  has_previousfinyr: any;
  has_nextfinyr: any;
  currentpagefinyr: number;
  map_hide_show:boolean=true;
  checked_map: boolean=false;
  map_show_hide: boolean=false;
  add_or_less_list=[{ name: "Add", id: "1" },
  { name: "Less", id: "2" },]
  check_value: boolean;
  summary_checked: boolean=false;
  summary_data_checked:boolean=false;
  map_show_show: boolean;
  viewFunctionActive: boolean;
  editingEnabled: boolean;
  editingEnabled_con: boolean;
  contenteditable: boolean;
  isEditable: boolean = true;
  view_true: boolean = false;
  validate: boolean;
  editsss: any;
  content: any;
  formattedNumbers: any;
  PARAMS: any;
  PARAMSSS: { short_order: number[]; };
  submit_btn: boolean = true;
  sub_show: boolean;
  sub_level: any;
  selected: boolean;
  selecteddd: boolean = false;
  template_value: any;
  types: number;
  upper_key: any;
  sub_key: any;
  sub_lev: any;
  // PARAMSSS: number;
  // multidata1: any[];
  constructor(private router: Router, private spinnerService: NgxSpinnerService, private toastr: ToastrService,
    private fb: FormBuilder, private DrsService: DrsService, private sanitizer: DomSanitizer) { }
 
  Schdularmastersum: FormGroup;
  Schdular_master_summary: FormGroup;
  ngOnInit(): void {
    
   
    this.summaryshow = true; 
    this.Schdularmastersum = this.fb.group({
      Schdularmastername: '',
      Schdularmaster_item_number: "",
      Schdularmaster: [''],
      cat: '',
      template: '',
      sort: [''],
      calculation: [''],
      status: [''],
      Upper_aierachy: [''],
      Schdulartypes: [''],
      finyear:[''],
      sub_level:[''],
      add_or_less:[''],
      is_quarter:''
    })
    this.Schdular_master_summary = this.fb.group({
      Schdularmastersummaryname: [''],
    })

    this.Schedule_summary('')

  }

  public Catagory_display(cat_name?: drs): string | undefined {
    return cat_name ? cat_name.name : undefined;
  }

  public sort_order_display(sort_name?: drs): string | undefined {
    return sort_name ? sort_name.name : undefined;
  }

  public schdularmaster_display(schdular_master_name?: drs): string | undefined {
    return schdular_master_name ? schdular_master_name.name+"-"+schdular_master_name.code : undefined;
  }

  public Calculation_display(schdular_name?: drs): string | undefined {
    return schdular_name ? schdular_name.cal : undefined;
  }

  public add_less_display(add_less_display_name?: drs): string | undefined {
    return add_less_display_name ? add_less_display_name.name : undefined;
  }
  public schdulartype_display(schdular_type_name?: drs): string | undefined {
    return schdular_type_name ? schdular_type_name.name : undefined;
  }

  Catagorys() {
    // this.Schdularmaster.value.Catagorys.reset()
    // this.spinnerService.show();
    this.DrsService
      .Catagorys(this.cata_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerService.hide();
        let datas = results["data"];
        this.Catagory_list = datas;
        // this.cat_id = this.Catagory_list.id;
        console.log("main=>", this.Catagory_list);
      });
  }

  autocompletecatScroll() {
    // let catid = this.cat_id;
    this.cat_has_next = true;
    this.cat_has_previous = true;
    this.cat_currentpage = 1;
    setTimeout(() => {
      if (this.Catagory && this.autocompleteTrigger && this.Catagory.panel) {
        fromEvent(this.Catagory.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.Catagory.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Catagory.panel.nativeElement.scrollTop;
            const scrollHeight = this.Catagory.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.Catagory.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.cat_has_next === true) {
                this.DrsService.Catagorys(this.cata_data.nativeElement.value, this.cat_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.Catagory_list = this.Catagory_list.concat(datas);
                  if (this.Catagory_list.length >= 0) {
                    this.cat_has_next = datapagination.has_next;
                    this.cat_has_previous = datapagination.has_previous;
                    this.cat_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  autocompleteschedule_mas_Scroll() {
    this.mas_has_next = true;
    this.mas_has_previous = true;
    this.mas_currentpage = 1;
    setTimeout(() => {
      if (this.schdularmaster && this.autocompleteTrigger && this.schdularmaster.panel) {
        fromEvent(this.schdularmaster.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.schdularmaster.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schdularmaster.panel.nativeElement.scrollTop;
            const scrollHeight = this.schdularmaster.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.schdularmaster.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.mas_has_next === true) {
                this.DrsService.Schdularmaster_dropdowns(this.Sche_data.nativeElement.value, this.mas_currentpage + 1, this.upper_key,this.sub_key).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.Schdularmaster_list = this.Schdularmaster_list.concat(datas);
                  if (this.Schdularmaster_list.length >= 0) {
                    this.mas_has_next = datapagination.has_next;
                    this.mas_has_previous = datapagination.has_previous;
                    this.mas_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  SortOrder() {
    // this.spinnerService.show();
    this.DrsService
      .SortOrder(this.sort_order_dta.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerService.hide();
        let datas = results["data"];
        this.SortOrder_list = datas;
        // this.cat_id = this.Catagory_list.id;
        console.log("SortOrder_list=>", this.SortOrder_list);
      });
  }

  autocompleteSortOrderScroll() {
    // let catid = this.cat_id;
    this.cat_has_next = true;
    this.cat_has_previous = true;
    this.cat_currentpage = 1;
    setTimeout(() => {
      if (this.SortOrd && this.autocompleteTrigger && this.SortOrd.panel) {
        fromEvent(this.SortOrd.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.SortOrd.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.SortOrd.panel.nativeElement.scrollTop;
            const scrollHeight = this.SortOrd.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.SortOrd.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.cat_has_next === true) {
                this.DrsService.SortOrder(this.sort_order_dta.nativeElement.value, this.cat_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.SortOrder_list = this.SortOrder_list.concat(datas);
                  if (this.SortOrder_list.length >= 0) {
                    this.cat_has_next = datapagination.has_next;
                    this.cat_has_previous = datapagination.has_previous;
                    this.cat_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  schedule_clear() {
    this.summarysshow = true
    this.Schdularmastersum.reset()
    // this.Schdularmaster_item_number.reset()
    this.sortorder_hide = false;
    this.category_hide = false;
    setTimeout(() =>{
      this.schedule_master= false
      this.summarysshow = true
    })
    this.sub_show= false
    // this.schedule_master = false;
    this.validate= false;
    this.submit_btn = true
    this.selectedOption = ""
    this.selectedOption1 = ""
    this.selectedOption2 = ""
    this.multidata = [];
    this.arr = ""

    // this.Upper_aierachy.reset()
    // this.Schdularmaster.reset()

  }

  submit(PARAMS) {
    

    // if (PARAMS.finyear?.finyer == "" || PARAMS.finyear?.finyer == null || PARAMS.finyear?.finyer == undefined) {
    //   this.toastr.warning("", "Please Select The Finyear")
    //   return false
    // }
    if (PARAMS.Schdularmastername == "" || PARAMS.Schdularmastername == null || PARAMS.Schdularmastername == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
let map_to_less
// this.map_schedule("")
   if(this.checked_map==false){
    map_to_less=1
    if(this.editsss== 'edit'){
      if (PARAMS.Schdulartypes?.name == "" || PARAMS.Schdulartypes?.name == null || PARAMS.Schdulartypes?.name == undefined){
        this.toastr.warning("", "Please Select The Schedule Type")
        return false
      }
    } else{
      if (PARAMS.Schdulartypes?.name == "" || PARAMS.Schdulartypes?.name == null || PARAMS.Schdulartypes?.name == undefined) {
        this.toastr.warning("", "Please Select The Schedule Type")
        return false
      }
    }
    
   
    if (this.Schdularmastersum.controls["Upper_aierachy"].value == "" || this.Schdularmastersum.controls["Upper_aierachy"].value == null || this.Schdularmastersum.controls["Upper_aierachy"].value == undefined) {
      this.toastr.warning("", "Please Choose The Upper Hierarchy")
      return false
    }
    if(PARAMS.Upper_aierachy=="YES"){
      if(PARAMS.sub_level=="" || PARAMS.sub_level ==null || PARAMS.sub_level ==undefined){
        this.toastr.warning("", "Please Choose The Sub level")
      return false
      }
      if(PARAMS.Schdularmaster?.id =="" || PARAMS.Schdularmaster?.id ==null || PARAMS.Schdularmaster?.id ==undefined){
        this.toastr.warning("", "Please Select The Schedule Master")
      return false
      }
    }
    if (PARAMS.status == "" || PARAMS.status == null || PARAMS.status == undefined) {
      this.toastr.warning("", "Please Choose The GL Or SL")
      return false
    }   

    if (PARAMS.Upper_aierachy=="YES"){
      if(PARAMS.sub_level=="NO"){
        if(PARAMS.status=="GL"){
          if(this.editableContentRef.nativeElement.innerText=="" || this.editableContentRef.nativeElement.innerText == null || this.editableContentRef.nativeElement.innerText==undefined){
              this.toastr.warning("", "Please Enter The Sort Order Formula")
              return false
              }
          // if(PARAMS.sort==""|| PARAMS.sort==undefined || PARAMS.sort==null ){
          //   this.toastr.warning("", "Please Select The Sort Order")
          //   return false
          // }
        }else{
          if(this.editableContentRef.nativeElement.innerText=="" || this.editableContentRef.nativeElement.innerText == null || this.editableContentRef.nativeElement.innerText==undefined){
              this.toastr.warning("", "Please Enter The Category Formula")
              return false
              }
          // if(PARAMS.cat.id==""|| PARAMS.cat.id==undefined || PARAMS.cat.id==null ){
          //   this.toastr.warning("", "Please Select The Category")
          //   return false
          // }
        }
      }   
    }else{
    // if(PARAMS.status=="GL"){
    //   if(this.editableContentRef.nativeElement.innerText=="" || this.editableContentRef.nativeElement.innerText == null || this.editableContentRef.nativeElement.innerText==undefined){
    //   this.toastr.warning("", "Please Enter The Sort Order Formula")
    //   return false
    //   }
    // }else{
    //   if(this.editableContentRef.nativeElement.innerText=="" || this.editableContentRef.nativeElement.innerText == null || this.editableContentRef.nativeElement.innerText==undefined){
    //   this.toastr.warning("", "Please Enter The Category Formula")
    //   return false
    //   }
    // }

  }
}else{
  map_to_less=2
  // if (this.Schdularmastersum.controls["add_or_less"].value == "" || this.Schdularmastersum.controls["add_or_less"].value == null || this.Schdularmastersum.controls["add_or_less"].value == undefined) {
  //   this.toastr.warning("", "Please Select The Add or Less")
  //   return false
  // }   
}

let type_value
let flags
if(this.checked_map==false){
   
    if (PARAMS.status === 'GL') {
      this.conditioncheck = "GL"
      type_value = 1
    } else {
      type_value = 2
      this.conditioncheck = "SL"

    }
    if(PARAMS.Schdulartypes?.name === "Item"){
      flags = 1
    } else{
      flags = 2
    }
    if (PARAMS.sub_level === "YES" ) {
      // if(PARAMS.sub_level === "YES"){
        if (PARAMS.status === 'GL') {
          this.schdule_value = this.Schdularmastersum.value.sort?.name
        }
        if (PARAMS.status === 'SL') {
          this.schdule_value = this.Schdularmastersum.value.cat?.id
        }
        
      // }
      
    } else if(PARAMS.sub_level === "NO") {
      
      let rep_value
      if (PARAMS.status === 'GL') {
        // this.schdule_value = this.editableContentRef.nativeElement.innerText.replace(/(\r\n|\n|\r)/gm, "");
        rep_value = this.editableContentRef.nativeElement.innerText;
        this.schdule_value = rep_value.replace(/(\r\n|\n|\r)/gm, "");

      } else {
        
      if(this.schdule_master_create_edit=='edit'){        
        this.schdule_value = this.editableContentRef.nativeElement.innerText; 
        for(let i = 0; i <this.array_edit_data.length; i++){
          console.log("this.id_value[i] ", this.id_value[i])
          rep_value = this.schdule_value.replaceAll(this.array_edit_data[i], this.refe_id[i])
          this.schdule_value = rep_value.replace(/(\r\n|\n|\r)/gm, "");
        }
      }else{
       let reps_value = this.editableContentRef.nativeElement.innerText; 
        let replacedValue = reps_value;
        for (let i = 0; i < this.name_value.length; i++) {
          console.log("this.name_value[i]", this.name_value[i])
          console.log("this.id_value[i] ", this.id_value[i])
          reps_value = reps_value.replaceAll(this.name_value[i], this.id_value[i]);
          this.schdule_value = reps_value.replace(/(\r\n|\n|\r)/gm, "");
        }  
      } 
       
      }
    }
  }else{

  }
  if(PARAMS.status == "GL"){
    let types= 1

  } else if(PARAMS.status == "SL"){

    let types= 2
  } else{
    let types= ""
  }
  // if(this.Schdularmastersum.value.add_or_less?)
  this.template_value = this.editableContentRef?.nativeElement?.innerText || '';

  // this.template_value= this.editableContentRef.nativeElement.innerText; 

    console.log('hghgfgfg', this.schdule_value)
    if (this.schdule_master_create_edit == 'ADD') {
      if(PARAMS.status == "GL"){
        this.types= 1
    
      } else if(PARAMS.status == "SL"){
    
        this.types= 2
      } 
      if(PARAMS.Upper_aierachy == "YES"){
        this.sub_lev=this.Schdularmastersum.value.sub_level?this.Schdularmastersum.value.sub_level:""
      } else{
        this.sub_lev= ""
      }
      this.params = {    
        "name":PARAMS.Schdularmastername,
        "upper_hierarchy":PARAMS.Upper_aierachy?PARAMS.Upper_aierachy:"",
        "template":this.template_value?this.template_value:"",
        "flag":flags,
        "code":PARAMS.Schdularmaster_item_number?PARAMS.Schdularmaster_item_number:"",
        // "parent_id": this.Schdularmastersum.value.Schdularmaster?.id ?? '',
        "parent_id": PARAMS.Schdularmaster?.id??"",
        "type": this.types,
        "map_toschdule":map_to_less,
        "add_or_less":this.Schdularmastersum.value.add_or_less?.id??"",
        // "finyear":this.Schdularmastersum.value.finyear?.finyer??"",
        "sub_level": this.sub_lev,
        "Quarter":PARAMS?.is_quarter?1:''
      }

    }else{
      if(PARAMS.status == "GL"){
        this.types= 1
    
      } else if(PARAMS.status == "SL"){
    
        this.types= 2
      } 
      if(PARAMS.Upper_aierachy == "YES"){
        this.sub_lev=this.Schdularmastersum.value.sub_level?this.Schdularmastersum.value.sub_level:""
      } else{
        this.sub_lev= ""
      }
      this.params = {
        "name":PARAMS.Schdularmastername,
        "upper_hierarchy":PARAMS.Upper_aierachy?PARAMS.Upper_aierachy:"",
        "template":this.template_value?this.template_value:"",
        "flag":flags,
        "code":PARAMS.Schdularmaster_item_number?PARAMS.Schdularmaster_item_number:"",
        // "parent_id": this.Schdularmastersum.value.Schdularmaster?.id ?? '',
        "parent_id": PARAMS.Schdularmaster?.id??"",
        "type":this.types,
        "map_toschdule":map_to_less,
        "add_or_less":this.Schdularmastersum.value.add_or_less?.id??"",
        // "finyear":this.Schdularmastersum.value.finyear?.finyer??"",
        "sub_level": this.sub_lev,
        
          "id":this.schdule_master_create_edit_id,
          "Quarter":PARAMS?.is_quarter?1:''
          // "name":this.Schdularmastersum.value.Schdularmastername,
          // "upper_hierarchy":this.Schdularmastersum.value.Upper_aierachy?this.Schdularmastersum.value.Upper_aierachy:"",
          // "template":this.template_value?this.template_value:"",
          // "flag":flags?flags:"",
          // "code":this.Schdularmastersum.value.Schdularmaster_item_number?this.Schdularmastersum.value.Schdularmaster_item_number:"",
          // // "parent_id": this.Schdularmastersum.value.Schdularmaster?.id ?? '',
          // "parent_id": PARAMS.Schdularmaster?.id,
          // "type":type_value?type_value:"",
          // "map_toschdule":map_to_less,
          // "add_or_less":this.Schdularmastersum.value.add_or_less?.id??"",
          // "finyear":this.Schdularmastersum.value.finyear?.finyer??"",
          // "sub_level": this.Schdularmastersum.value.sub_level?this.Schdularmastersum.value.sub_level:"",
      

      }
    }

    this.spinnerService.show()

    this.DrsService.create_summary(this.params).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      this.Schdularmastercreate_list = data;
      this.summarysshow = true;
      if (results.set_code== "SUCCESS") {
        this.toastr.success(results.set_description)
        this.Schedule_summary('')
        this.summaryshow = true;
        this.summarysshow = true;
        // this.Schdularmastersum.reset()
        // this.Avalue=''
        this.Evalue = ''
        this.editsss= ''
        // this.Search('')

      } else {
        this.toastr.error(results.set_description)
        this.summarysshow = true;
      }
      this.summarysshow = true;

    })
    this.summarysshow= true

  }


  // private get_schedule__drop(prokeyvalue) {
  //   this.DrsService.Schdularmaster_dropdowns(prokeyvalue, 1, this.upper_key,this.sub_key)
  //     .subscribe((results: any) => {
  //       this.spinnerService.hide()
  //       this.Schdularmaster_list = results["data"]
  //       console.log("schedule pass values:", this.Schdularmaster_list)
  //       this.isLoading = false
  //     })


  // }

  Schdularmaster_dropdown() {
    // this.spinnerservice.show()
    this.upper_key= ""
    this.sub_key= ""

    let prokeyvalue: String = "";
    this.get_schedule__drop(prokeyvalue);
    this.Schdularmastersum.get('Schdularmaster').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DrsService.Schdularmaster_dropdowns(value, 1, this.upper_key,this.sub_key)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let data_bra_sum = results["data"]
        this.Schdularmaster_list = data_bra_sum;
        console.log("report_create_dropdown", this.Schdularmaster_list)
        this.isLoading = false
      })

  }

  private get_schedule__drop(prokeyvalue) {
    // this.spinnerservice.show()
    this.DrsService.Schdularmaster_dropdowns(prokeyvalue, 1, this.upper_key,this.sub_key)
      .subscribe((results: any[]) => {
        this.spinnerService.hide()
        let data_bra_sum = results["data"];
        this.Schdularmaster_list = data_bra_sum;
        this.isLoading = false
      })

  }

  // autocompleteschedule_mas_Scroll() {
  //   this.has_nextbrasum = true
  //   this.has_previousbrasum = true
  //   this.currentpagebrasum = 1
  //   setTimeout(() => {
  //     if (
  //       this.matAutocompletebrasum &&
  //       this.autocompleteTrigger &&
  //       this.matAutocompletebrasum.panel
  //     ) {
  //       fromEvent(this.matAutocompletebrasum.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(() => this.matAutocompletebrasum.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(() => {
  //           const scrollTop = this.matAutocompletebrasum.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocompletebrasum.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocompletebrasum.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextbrasum === true) {
  //               this.drsservice.getbranchdropdown(this.branchSumContactInput.nativeElement.value, this.currentpagebrasum + 1)
  //                 .subscribe((results: any[]) => {
  //                   let data_bra_sum = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.brasum_list_sum = this.brasum_list_sum.concat(data_bra_sum);
  //                   if (this.brasum_list_sum.length >= 0) {
  //                     this.has_nextbrasum = datapagination.has_next;
  //                     this.has_previousbrasum = datapagination.has_previous;
  //                     this.currentpagebrasum = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });

  // }


  // Schdularmaster_dropdown() {
  //   // this.spinnerService.show();
  //   this.upper_key= ""
  //   this.sub_key= ""
  //   let prokeyvalue: String = "";
  //   this.get_schedule__drop(prokeyvalue),

  //   this.DrsService
  //     .Schdularmaster_dropdowns(this.Sche_data.nativeElement.value, 1, this.upper_key,this.sub_key)
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       finalize(() => {
  //         this.isLoading = false;
  //       })
  //     )
  //     .subscribe((results) => {
  //       // this.spinnerService.hide();
  //       let datas = results["data"];
  //       this.Schdularmaster_list = datas;
  //       // this.cat_id = this.Catagory_list.id;
  //       console.log("Schdularmaster_list=>", this.Schdularmaster_list);
  //     });
  // }

  form_data: any
  select_value(form_value, deff) {
    // if (this.multidata = []) {
    //   this.multidata = []
    // }
    if (this.Schdularmastersum.value.sub_level == "YES") {

    } else if(this.Schdularmastersum.value.sub_level == "NO") {
      let formdata_cond = form_value;
      this.deffference = deff;
      if (this.deffference == 'Category') {
        if(this.schdule_master_create_edit=='edit'){
          let a=""
      //    this.edit_schedule_value= formdata_cond.name
      //    this.array_edit_data.push(formdata_cond.name)  
      //    this.refe_id.push(formdata_cond.id)
      //     a=a+ this.edit_schedule_value
      //     console.log("aa",a)      
      //  this.refe_value = this.editableContentRef.nativeElement.innerText+a
      //    this.updateContent()
      //    console.log(" this.refe_value", this.refe_value)
        } else{
          
        }
        this.form_data = formdata_cond
        this.name_value.push(formdata_cond.name)
        this.id_value.push(formdata_cond.id)

      } else {
         this.form_data = formdata_cond
         if(this.schdule_master_create_edit=='edit'){         
        this.refe_value = this.editableContentRef.nativeElement.innerText+ this.form_data.name  
        this.updateContent()
         }else{
          this.refe_value = this.editableContentRef.nativeElement.innerText+ this.form_data.name  
        this.updateContent()
         }  
      }
      this.multidata.push(this.form_data)
      console.log("multidata", this.multidata)
      // this.trimmedArr =this.multidata.trim();

      if (this.deffference == 'Category') {
        this.Schdularmastersum.get('cat').reset()
      } else {
        this.Schdularmastersum.get('sort').reset()
      }
    }
  }

  data_values: any
  calcular_value(values) {


    this.data_values = values
    console.log("data_valyeghf", this.data_values)
    let datas = this.data_values.cal
    this.arr.push(datas)
    // if(this.form_data=="" || this.form_data==undefined || this.form_data==null){
    // this.multidata.push(data_values)
    // }
    // this.multidata.push(this.form_data)
    // this.calculation()
    // console.log("this.multidata",data_values)
  }

  formulas: any = []
  arr: any = []
  matcard_mulityselect: any
  matcard_data(selected_data) {
    if (this.arr == '') {
      this.arr = []
    }
    if (this.multidata = []) {
      this.multidata = []
    }

    this.matcard_mulityselect = selected_data
    let datas = this.matcard_mulityselect.name
    this.arr.push(datas)
    console.log("this.formulas", this.arr)
    console.log("this.matcard_mulityselect", this.matcard_mulityselect)
    // this.formulas.push(this.matcard_mulityselect)
    console.log("this.formulas", this.formulas)
    // this.calculation()
  }

  cat_val: any;
  calu: any;
  calculation() {
    if (this.matcard_mulityselect == "" || this.matcard_mulityselect == null || this.matcard_mulityselect == undefined) {
      this.patch_data = this.data_values.cal
    } else {
      if (this.data_values == "" || this.data_values == null || this.data_values == undefined) {
        this.patch_data = this.matcard_mulityselect.name
      } else {
        this.patch_data = this.data_values.cal + this.matcard_mulityselect.cat.name
      }
    }
    // this.calc_value.forEach((element) => {
    //   let ele_val= element;
    //   console.log("ele_valnhbnvbn",ele_val)
    //  this.cat_val=ele_val.cat.name
    //   this.calu=ele_val.calculation.cal

    // })
    // this.Schdularmaster.get('cat').reset()
    // this.Schdularmaster.get('calculation').reset()
  }

  close(data, i) {
    let removedata = this.multidata.splice(i, 1)
    console.log("removedata", removedata)
  }

  closes(event, ind) {
    console.log("mnnmmnnmmnnmn", event.code)
    if (event.code == "Backspace") {
      let removedata = this.arr.splice(ind, 1)
      console.log("removedatacvbcv", removedata)
    }

  }

  editable(event) {
    let text_value = event.target.innerText
    text_value = text_value.replace(/(\r\n|\n|\r)/gm, "");
    this.schdule_value = text_value.trim()
    console.log("this.schdule_value", this.schdule_value)
    console.log("eventvhxchnc", text_value, event)
  }

  key_event(event) {
    console.log("mnn", event.code)
    // if(event.code =="Backspace"){
    //   let removedata=this.arr.splice(ind,1)
    //   console.log("removedatacvbcv",removedata)
    // }
  }

  selectedOption2: string = "";
  onRadioChange2(Option : string){
    this.selecteddd= true
    this.selectedOption2 = Option;
    console.log("Selected....", this.selectedOption2)
    this.Schdularmastersum.get('status').reset()
    

    if(this.selectedOption2 === "YES"){
    // this.subLevelSubscription?.unsubscribe();
    //   this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
    //     console.log("sub_level changed to:", value);  
    //   }) 
      // setTimeout(() =>{
      //   this.summarysshow= true
      // })
      this.summarysshow= true
      this.sortorder_hide= false
    } else if(this.selectedOption2 === "NO"){
      this.summarysshow= false
      // setTimeout(() =>{
      //   this.summarysshow= false
      // })
      this.summarysshow= false
    //   setTimeout(() => {
    //     this.Schdularmastersum.get('sub_level')?.setValue(this.selectedOption2 || '', { emitEvent: false });
    // });
    // this.subLevelSubscription?.unsubscribe();

      // this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
      //   console.log("sub_level changed to:", value);
      // }) 
    }
    // setTimeout(() => {}, 0);

  }

  selectedOption: string = "";
  onRadioChange(options: string) {
    this.selectedOption= options
    if(this.editsss == "edit"){

    } else{
      this.multidata = [];
    }
    this.Schdularmastersum.get("cat").reset();
    this.Schdularmastersum.get("sort").reset();
    this.Schdularmastersum.get("calculation").reset();
    if(this.Schdularmastersum.controls['sub_level'].value=== "YES" ){
      if (this.selectedOption === 'SL') {
      
        this.sortorder_hide = false;
        this.category_hide = false;
        console.log('Option SL selected');
        // this.multidata = [];
        this.arr = ""
      }
      if (this.selectedOption === 'GL') {
        this.sortorder_hide = false;
        this.category_hide = false;
        console.log('Option GL selected');
        // this.multidata = [];
        this.arr = ""
      }

    } else if(this.Schdularmastersum.controls['sub_level'].value=== "NO"){
      if (this.selectedOption === 'SL') {
      
        this.sortorder_hide = false;
        this.category_hide = true;
        console.log('Option SL selected');
        // this.multidata = [];
        this.arr = ""
      }
      if (this.selectedOption === 'GL') {
        this.sortorder_hide = true;
        this.category_hide = false;
        console.log('Option GL selected');
        // this.multidata = [];
        this.arr = ""
      }
    }
    
  }
  // arr = [];
  download_types = [
    { name: 'kowsi' },
    { name: 'kavin' },
    { name: 'karthi' },
    { name: 'selvi' },
    { name: 'sub' },
    { name: 'Maddy!' },
  ];

  divd(param) {
    if (this.arr == '') {
      this.arr = []
    }
    let pam_value = param.slice(0, 2)
    console.log("paramaaaa", param)
    let kk = {
      name: param,
    };
    this.opratetor = param
    this.arr.push(kk);
    console.log(kk);
    console.log('arr', this.arr);
  }

  hgjh = [];
  ty(type) {
    this.hgjh.push(type);
    console.log('type', type);
  }

  // <button class="symbols" (click)="divd('+')">+</button>
  // <button class="symbols" (click)="divd('-')">-</button>
  // <button class="symbols" (click)="divd('%')">%</button>
  // <button class="symbols" (click)="divd('*')">*</button>
  // <button class="symbols" (click)="divd('x')">x</button>
  // <button class="symbols" (click)="divd('÷')">÷</button>
  // // <button class="symbols" (click)="divd('(')">(</button>
  // <button class="symbols" (click)="divd(')')">)</button>

  comon(val) {
    if (this.arr == '') {
      this.arr = []
    }
    this.arr.push(val);

    console.log('val', val);
    console.log('arr222', this.arr);
  }

  selectedOption1: string = "";
  onRadioChange1() {
    // this.Schdularmastersum.get('sub_level')?.setValue('', { emitEvent: false });
    this.summarysshow = true
    this.Schdularmastersum.get("Schdularmaster").reset();
    this.Schdularmastersum.get('sub_level').reset();

    

    // this.Schdularmaster.get("sort").reset();
    // this.Schdularmaster.get("calculation").reset();
    if (this.selectedOption1 === 'YES') {
      // this.Schdularmastersum.get('sub_level')?.setValue('', { emitEvent: false });
      this.Schdularmastersum.get("sub_level").reset();
      //  this.sortorder_hide=false;
      // setTimeout(() =>{
        this.summarysshow = true
      // })
      setTimeout(() =>{
        this.schedule_master= true
      })
      
      // this.schedule_master = true;
      setTimeout(() =>{
        this.sub_show= true
      })
      
      console.log('Option YES selected');
      this.multidata = [];
      this.arr = ""
    } else if(this.selectedOption1 === 'NO'){
            this.sortorder_hide= false;
            this.category_hide= false
      this.Schdularmastersum.get("sub_level").reset();
      // this.Schdularmastersum.get('sub_level')?.setValue('', { emitEvent: false });
      // setTimeout(() =>{
        this.summarysshow = true
      // })
      setTimeout(() =>{
        this.sub_show= false
      })
      // this.sub_show= false
      this.schedule_master = false;
      console.log('Option No selected');
      this.multidata = [];
      this.arr = ""
    }
    this.summarysshow = true
    this.Schdularmastersum.get("sub_level").reset();

    //  if (this.selectedOption1 === 'No') {
    //   // this.sortorder_hide= true;
    //   this.schedule_master=false;
    //   console.log('Option No selected');
    //   this.multidata=""
    //   this.arr=""
    // }

  }

  select_value1(Schdularmaster, Master) {
    if (this.multidata1 == '') {
      this.multidata1 = []
    }

    let schedule_data = Schdularmaster;
    this.Schedulemaster = Master;
    if (this.Schedulemaster == 'Schedule') {
      this.form_data = schedule_data
    } else {
      this.form_data = schedule_data
    }
    this.multidata1.push(this.form_data)
    console.log("multidata1", this.multidata1)
    // if(this.Schedulemaster== 'Schedule'){
    // // this.Schdularmaster.get('Schdularmaster').reset()
    // }else{
    //   this.Schdularmaster.get('Schdularmaster').reset()
    // }
  }

  Schdulartype_dropdown() {

  }
  private subLevelSubscription: Subscription | null = null;


  Add(ADD) {
    this.sub_show= false
    if (this.subLevelSubscription) {
      this.subLevelSubscription.unsubscribe(); // Unsubscribe before setting value
  }

  this.Schdularmastersum.get('sub_level')?.setValue('', { emitEvent: false });
    this.check_value = false;
    this.map_hide_show= true;
    this.map_show_hide= false;
    this.checked_map=false;
    this.summary_checked=false;
    this.schdule_master_create_edit=ADD
    this.Avalue = ADD
    this.schd_mas_view = false;
    this.summaryshow = false;
    this.scdular_mas_sub_btn = true;
    this.isEditable = true;
    this.validate= false
    // this.Schdularmastersum.reset()
    // this.Upper_aierachy.reset()
    // this.status.reset()
    // this.cat.reset()
    // this.sort.reset()
    this.Schdularmastersum.reset()
    setTimeout(() => {
      this.Schdularmastersum.get('sub_level')?.reset();
  }, 100);
    // this.Schdularmastersum.get('sub_level')?.reset();
    this.sortorder_hide = false;
    this.category_hide = false;
    this.schedule_master = false;
    this.selectedOption = ""
    this.selectedOption1 = ""
    this.viewFunctionActive= false
    this.multidata = [];
    this.arr = ""


  }

  Schedule_summary(data,pageNumber = 1) {
    let Sumdata = data;
    this.summarysshow= true
    let name = this.Schdular_master_summary.value.Schdularmastersummaryname ? this.Schdular_master_summary.value.Schdularmastersummaryname : "";
    let map_toschedule
    if(this.summary_checked ==true){
     map_toschedule=2
    }else{
      map_toschedule=1
    }
   
    this.spinnerService.show()
    this.DrsService.Schedules_summary(name,pageNumber,map_toschedule).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      this.summarysshow = true;
      this.summarydata = data;
      if(this.summary_checked ===true){
     this.summary_data_checked=true
      }else{
        this.summary_data_checked=false
      }
      
      let datapagination = results["pagination"];
      this.summarydata = data;
      if (this.summarydata?.length > 0) {
        this.hasnext = datapagination.has_next;
        this.hasprevious = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_scdhele_found = true;
        this.summarysshow = true;

      }
      if (this.summarydata?.length == 0) {
        this.hasnext = false;
        this.hasprevious = false;
        this.presentpage = 1;
        this.data_scdhele_found = false;
        this.summarysshow = true;

      }
    });
    this.summarysshow = true;

    // });

  }

  Summary_Edit(Summary, Edit) {
    this.Evalue = Edit
    this.summaryshow = false;
    let Id = Summary.id
    this.Eid = Id
    // this.type= this.Schdularmastersum.controls["status"].value
    // console.log("Type",this.type)
    // if(this.selectedOption === 'GL'){
    //   this.type= 1
    // }
    // if(this.selectedOption === 'SL'){
    //   this.type= 2

    // }
    // this.params={
    //   "name": this.Schdularmastersum.value.Schdularmastername?.Schdularmastername??'',
    //   "upper_hierarchy": this.Schdularmastersum.value.Upper_aierachy?.Upper_aierachy??'',
    //   "template": this.schdule_value,
    //   "parent_id": this.Schdularmastersum.value.Schdularmaster_list.id?.Schdularmaster_list.id??'',
    //   "type": this.type,

    // }
    // this.DrsService.Edit_table(Id,this.params).subscribe((results: any) => {
    //   let data = results["data"];
    //   this.Editdata = data;

    // })
    this.Schdularmastersum.patchValue({
      "Schdularmastername": Summary.name != null ? Summary.name : '',
      "status": Summary.type.name != null ? Summary.type.name : '',
      "Upper_aierachy": Summary.upper_hierarchy != null ? Summary.upper_hierarchy : '',
      "Schdulartype": Summary.flag.name != null ? Summary.flag.name : '',
      // "status": Summary.type.name,
      // "status": Summary.type.name,

    })
  }

  previousSummaryClick() {
    if (this.hasprevious === true) {
      this.Schedule_summary("",this.presentpage - 1);
    }
  }

  nextSummaryClick() {
    if (this.hasnext === true) {
      this.Schedule_summary("",this.presentpage + 1);
    }
  }

  back() {
    this.summarysshow = true;
    this.checked_map==false
    if (this.subLevelSubscription) {
      this.subLevelSubscription.unsubscribe(); 
      this.summarysshow = true;
  }

    this.summaryshow = true;
    this.summarysshow = true;
    this.editsss= '';
    this.Schdularmastersum.reset()
    setTimeout(() => {
      this.Schdularmastersum.get('sub_level')?.reset();
  }, 100);
    // this.Schdularmastersum.get('sub_level')?.reset();
    this.Schedule_summary('')
    this.summarysshow = true;
  }

  scd_type(sub) {
    // if (sub.name == "Item") {
    //   this.summarysshow = true
    //   this.validate= false
    //   this.submit_btn= true
    // } else {
    //   this.summarysshow = true
    //   this.validate= true
    //   this.submit_btn= false
    // }
  }
  // validate_fun(data){
  //   if (this.editableContentRef) {
  //     const container = this.editableContentRef.nativeElement;
  //     this.content = container.innerText; // Gets all the text content inside the container
  //     console.log('Container Content:', this.content);
  //     // return this.content;
  //   } else{
  //     this.toastr.warning("Please fill the template")
  //   }
  //   let numbers = this.content.match(/[-+]?\d+(\.\d+)?/g) || [];
  //   let sanitizedNumbers = numbers.map(num => num.replace(/["'+-]/g, ''));
  //   // let shortOrderArray = numbers.map(Number);

  //   // let sanitizedNumbers = numbers.map(num => num.replace(/[+-]/g, ''));
  //   // this.formattedNumbers = sanitizedNumbers.join(', ');
  //   // this.formattedNumbers = this.formattedNumbers.map(Number);


  //   let sort_array=[]
  //   // sort_array.push(this.formattedNumbers)
  //   // console.log('Removed Content:', this.formattedNumbers);
  //   sort_array=sanitizedNumbers.map(item=>parseInt(item))
  //   // for(let i of sanitizedNumbers){
  //   //   sort_array.push(i)

  //   // }


  //   if(sort_array.length== 0){
  //     this.toastr.warning("Please select sort order")
  //     return false
  //   }
  //   this.PARAMSSS = {
  //     "short_order": sort_array,
  //   }

  //   console.log("Data",this.PARAMSSS)
  //   this.spinnerService.show()
  //   this.DrsService.sort_validate(this.PARAMSSS).subscribe((results: any) => {
  //     this.spinnerService.hide()
  //     if(results.status=== true){
  //       this.submit_btn = true

  //     } else{
  //       this.toastr.warning("Please Enter Correct Sort order!")
  //       this.submit_btn = false
  //     }
  //   });
  // }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    // console.log("Paste:")

  }
  // containEditing(){
  //   this.editingEnabled_con = this.contenteditable;

  // }

  toggleEditing() {
    this.editingEnabled = !this.editingEnabled;
  }

  SchdularMater_edit(report, deff) {
    this.editsss= deff
    
    this.summary_checked=false;
    this.report_datas_ele=report
     this.element_deffs=deff
    let report_id = report.id
    if (deff == 'edit') {
      this.summaryshow=false;
      this.scdular_mas_sub_btn = true;
      this.schd_mas_view = false;
      this.isEditable = true;
      this.view_true = false
      this.viewFunctionActive= false
      if(report.sub_level== 'YES'){
        this.sub_show= true
        this.summarysshow= true
      } else if(report.sub_level== 'NO'){
        this.sub_show= true
        this.summarysshow= false
      } else{
        this.sub_show= false
        this.summarysshow= true
      }
      if(report.flag?.name== 'Item'){
        this.validate= false
        this.submit_btn= true
      } else{
        this.validate= true
        this.submit_btn= false
      }
      // this.containEditing()
      // this.editingEnabled = true;
    } else {
      this.toggleEditing()
      this.viewFunctionActive= true
      this.summaryshow=false;
      this.scdular_mas_sub_btn = false;
      this.schd_mas_view = true;
      this.isEditable = false;
      this.view_true = true
      this.validate= false
      this.submit_btn= false
      // this.editingEnabled = false;
      
    }
    this.schdule_master_create_edit = deff
    this.schdule_master_create_edit_id = report_id
    this.spinnerService.show()
    this.DrsService.SchdularMater_edit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      console.log("dataaaa",data)
      // let fin ={"finyer":data.finyear}
      let sub ={"sub_level":data.sub_level}
      console.log("Sublevel", sub)
      if(data.map_toschedule==1){
        this.check_value=false;
        this.checked_map= false
        this.map_hide_show=true;
        this.map_show_hide=false;
    if(data.sub_level=="YES"){
      this.summarysshow=true;
      if(data.type.name == "GL"){       
        if(data.upper_hierarchy=="YES"){
          // if(data.sub_level=="YES"){
          //   this.sub_show= true
          //   this.Schdularmastersum.patchValue({
          //     sub_level: data.sub_level || ''
          //   })
          // } else{

          // }
          console.log('this.report_list = data', data)     
          this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            // "cat":data.cat_sort != null ? data.cat_sort : '',
            "sort":data.cat_sort != null ? data.cat_sort : '',
            // // "finyear":fin !=null ? fin:"",
            "sub_level":data.sub_level != null ? data.sub_level : '',
            "is_quarter":data?.Quarter?true:false
            // "sub_level": sub,
            //  "sub_level": data.sub_level || ''

          })   
          // this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '');
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
          }
        });
        console.log('this.patched = data9', this.Schdularmastersum)  
          }else{
            // if(data.sub_level=="YES"){
            //   this.sub_show= true
            //   this.Schdularmastersum.patchValue({
            //     "sub_level": data.sub_level != null ? data.sub_level : '',
            //   })
            // } else{

            // }
            this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            // "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            // "cat":data.cat_sort != null ? data.cat_sort : '',
            "sort":data.cat_sort != null ? data.cat_sort : '',
            // "finyear":fin !=null ? fin:"",
            "sub_level": data.sub_level != null ? data.sub_level : '',

          })   
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
            }
          })
         
          console.log('this.patched = data8', this.Schdularmastersum)
               

         }
      }else{
        if(data.sub_level=="YES"){
          this.sub_show= true
          this.Schdularmastersum.patchValue({
            "sub_level": data.sub_level != null ? data.sub_level : '',
          })
        } else{

        }
        if(data.upper_hierarchy=="YES"){
          console.log('this.report_list = data', data)     
          this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            "cat":data.cat_sort != null ? data.cat_sort : '',
            // "finyear":fin !=null ? fin:"",
            "sub_level": data.sub_level != null ? data.sub_level : '',

            // "sort":data.cat_sort != null ? data.cat_sort : '',
          })   

          console.log('this.patched = data7', this.Schdularmastersum)  
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
            }
          })   

        }else{
          if(data.sub_level=="YES"){
            this.sub_show= true
            this.Schdularmastersum.patchValue({
              "sub_level": data.sub_level != null ? data.sub_level : '',
            })
          } else{

          }
            this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            // "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            "cat":data.cat_sort != null ? data.cat_sort : '',
            // "finyear":fin !=null ? fin:"",
            "sub_level": data.sub_level != null ? data.sub_level : '',

            // "sort":data.cat_sort != null ? data.cat_sort : '',
          })  
          console.log('this.patched = data6', this.Schdularmastersum)  
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
            }
          })   
 
        }
        // this.Schdularmastersum.patchValue({
        //   "Schdularmastername":data.name != null ? data.name : '',
        //   "Schdularmaster_item_number":data.number != null ? data.number : '',
        //   "Schdulartypes":data.flag != null ? data.flag : '',
        //   "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
        //   // "Schdularmaster":data.parent_id != null ? data.parent_id : '',
        //   "status":data.type.name != null ? data.type.name : '',
        //   "cat":data.cat_sort != null ? data.cat_sort : '',
        //   // "sort":data.cat_sort != null ? data.cat_sort : '',
        // }) 
      }
    }else{
      if(data.sub_level=="YES"){
        this.sub_show= true
        this.Schdularmastersum.patchValue({
          "sub_level": data.sub_level != null ? data.sub_level : '',
        })
      } else{

      }
      // this.summarysshow=false;
      // console.log("this.summarysshow=false;",this.summarysshow=false)
      let dataaaa = data.cat_sort?.name ?? "";

      // let dataaaa= data?.cat_sort.name??""
      // let dataaaas= data.template
      this.array_edit_data=data.cat_sort?.name?? "";
      this.refe_id=data.template

      let a=""
      let value_reg
      let resultObject = {};
      let key_assign
      // for(let data of dataaaa){     
      //        a=a+data
      //   console.log("aa",a)      
      // }
      let dataa_id=data.template
      let b=""
      // for(let data of dataa_id){     
      //   b=b+data
      //   console.log("bb",b)      
      //  }
      // console.log("aaa",a)
      // this.summarysshow= false
      //     // this.multidata.push(dataa_id);
      //     if (Array.isArray(this.multidata)) {
      //       this.multidata.push(dataa_id);
      //   } else {
      //       console.log("multidata is not an array:", this.multidata);
      //   }

      console.log("this.multidata",this.multidata)
      this.refe_value=a   
        console.log('this.report_list = data', data)    
      if(data.type.name == "GL"){
        
        // console.log("this.summarysshow=false; GL",this.summarysshow=false)
        if(data.upper_hierarchy=="YES"){
          if(data.sub_level=="YES"){
            this.sub_show= true
            this.Schdularmastersum.patchValue({
              "sub_level": data.sub_level != null ? data.sub_level : '',
            })
          } else{

          }
          for(let data of dataaaa){     
            a=a+data
       console.log("aa",a)      
     }
     let dataa_id=data.template
     let b=""
     for(let data of dataa_id){     
       b=b+data
       console.log("bb",b)      
      }
     console.log("aaa",a)
          this.summarysshow= false
          
          console.log("this.summarysshow=false; GL YES",this.summarysshow=false)
          console.log('this.report_list = data', data)     
          this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            // "finyear":fin !=null ? fin:"",
            "sub_level": data.sub_level != null ? data.sub_level : '',

            // "cat":data.cat_sort != null ? data.cat_sort : '',
            // "sort":data.cat_sort != null ? data.cat_sort : '',
          })   
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
            }
          }) 
          this.summarysshow= false
          if(data.type.name== "GL"){
            this.sortorder_hide= true

          } else{
            this.category_hide = true
          }
        console.log('this.patched = data5', this.Schdularmastersum)    
          if (Array.isArray(this.multidata)) {
            this.multidata = [];
            this.multidata.push(dataa_id);
        } else {
          this.multidata = [];
          this.multidata.push(dataa_id);
            console.log("multidata is not an array:", this.multidata);
        }
        // this.multidata.push(dataa_id);
        console.log("multidata --- array:", this.multidata);

          

          }else{
            if(data.sub_level=="YES"){
              this.sub_show= true
              this.Schdularmastersum.patchValue({
                "sub_level": data.sub_level != null ? data.sub_level : '',
              })
            } else{

            }
            // console.log("this.summarysshow=false; GL no",this.summarysshow=false)
            this.Schdularmastersum.patchValue({
            "Schdularmastername":data.name != null ? data.name : '',
            "Schdularmaster_item_number":data.number != null ? data.number : '',
            "Schdulartypes":data.flag != null ? data.flag : '',
            "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
            // "Schdularmaster":data.parent_id != null ? data.parent_id : '',
            "status":data.type.name != null ? data.type.name : '',
            // "finyear":fin !=null ? fin:"",
            "sub_level": data.sub_level != null ? data.sub_level : '',

            // "cat":data.cat_sort != null ? data.cat_sort : '',
            // "sort":data.cat_sort != null ? data.cat_sort : '',
          })  
          console.log('this.patched = data4', this.Schdularmastersum)    
          this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
            console.log("sub_level changed to:", value);
        
            if (!this.selectedOption2) {
              setTimeout(() => {
                  this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
              });
            }
          }) 
 
         }
  
        }else{
          if(data.sub_level=="YES"){
            this.sub_show= true
            this.Schdularmastersum.patchValue({
              sub_level: data.sub_level === 'YES' ? 'YES' : 'NO'
              // "sub_level": data.sub_level != null ? data.sub_level : '',
            })
          } else{

          }
          // console.log("this.summarysshow=false; SL ",this.summarysshow=false)
          if(data.upper_hierarchy=="YES"){
            // console.log("this.summarysshow= YES false; SL ",this.summarysshow=false)
            console.log('this.report_list = data', data)     
            this.Schdularmastersum.patchValue({
              "Schdularmastername":data.name != null ? data.name : '',
              "Schdularmaster_item_number":data.number != null ? data.number : '',
              "Schdulartypes":data.flag != null ? data.flag : '',
              "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
              "Schdularmaster":data.parent_id != null ? data.parent_id : '',
              "status":data.type.name != null ? data.type.name : '',
              // "finyear":fin !=null ? fin:"",
              "sub_level": data.sub_level != null ? data.sub_level : '',

              // "cat":data.cat_sort != null ? data.cat_sort : '',
              // "sort":data.cat_sort != null ? data.cat_sort : '',
            })   
            console.log('this.patched = data3', this.Schdularmastersum)     
            this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
              console.log("sub_level changed to:", value);
          
              if (!this.selectedOption2) {
                setTimeout(() => {
                    this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
                });
              }
            })

            }else{
              if(data.sub_level=="YES"){
                this.sub_show= true
                this.Schdularmastersum.patchValue({
                  "sub_level": data.sub_level != null ? data.sub_level : '',
                })
              } else{
  
              }
              // console.log("this.summarysshow= YES false; SL ",this.summarysshow=false)
            console.log('this.report_list = data', data)   
              this.Schdularmastersum.patchValue({
              "Schdularmastername":data.name != null ? data.name : '',
              "Schdularmaster_item_number":data.number != null ? data.number : '',
              "Schdulartypes":data.flag != null ? data.flag : '',
              "Upper_aierachy":data.upper_hierarchy != null ? data.upper_hierarchy : '',
              // "Schdularmaster":data.parent_id != null ? data.parent_id : '',
              "status":data.type.name != null ? data.type.name : '',
              // "finyear":fin !=null ? fin:"",
              "sub_level": data.sub_level != null ? data.sub_level : '',

              // "cat":data.cat_sort != null ? data.cat_sort : '',
              // "sort":data.cat_sort != null ? data.cat_sort : '',
            })  
            console.log('this.patched = data2', this.Schdularmastersum)  
            this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
              console.log("sub_level changed to:", value);
          
              if (!this.selectedOption2) {
                setTimeout(() => {
                    this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
                });
              }
            })   
 
           }
     
        
    
    

        } 
  
        // this.updateContent()
    }}
    else{
      this.checked_map= true
      this.check_value=true;
      this.map_hide_show=false;
      this.map_show_hide=true; 
      this.schedule_master= true    

      this.Schdularmastersum.patchValue({
        // "finyear":fin !=null ? fin:"",
        "Schdularmastername":data.name != null ? data.name : '',
       "add_or_less":data.add_or_less !=null ? data.add_or_less:"",
       "Schdularmaster":data.parent_id != null ? data.parent_id : '',

      })  
      console.log('this.patched = data1', this.Schdularmastersum)     
      this.subLevelSubscription = this.Schdularmastersum.get('sub_level')?.valueChanges.subscribe(value => {
        console.log("sub_level changed to:", value);
    
        if (!this.selectedOption2) {
          setTimeout(() => {
              this.Schdularmastersum.get('sub_level')?.setValue(data.sub_level || '', { emitEvent: false });
          });
        }
      })

    }
   
    });
  }
  schdule_master_create_edit_id: any
  SchdularMater_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.DrsService.SchdularMater_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;

      this.Schdularmastersum.patchValue({
        Schdularmastercreate_name: data.name != null ? data.name : '',
        Schdularmastercreate_report: data.report_type != null ? data.report_type : '',
        yesorno: data.upper_hierarchy != null ? data.upper_hierarchy : '',
        
      })

    });
  }
  SchdularMater_delete(delete_id) {
    let reportdelete = delete_id.id;
    let evantlue = 0;
    this.spinnerService.show()
    this.DrsService.SchdularMater_delete(reportdelete, evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
      } else {
        this.toastr.warning('', results.message)
      }
      this.Schedule_summary('');
    });
  }

  Schedule_Master_clear(){
    this.Schdular_master_summary.reset()
    this.summary_checked=false;
    this.Schedule_summary("");
    
  }

  updateContent() {   
    var s = document.getElementById('editableContents');    
    this.ref_element_null = s
    if (s == null) {
      this.SchdularMater_edit(this.report_datas_ele, this.element_deffs)
      this.Schedule_summary("")
    } else {   
    s.innerHTML = this.refe_value;

    }
  }

  // finyear_dropdown() {
  //   let prokeyvalue: String = "";
  //   this.getfinyear(prokeyvalue);
  //   this.Schdularmastersum.get('finyear').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap(value => this.DrsService.getfinyeardropdown(value, 1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //            }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.finyearList = datas;      
  //     })
  // }

  // @ViewChild('fin_year') fin_yearauto: MatAutocomplete
  // @ViewChild('finyearInput') finyearInput: any;
  // autocompletefinyearScroll() {
  //   this.has_nextfinyr = true;
  //   this.has_previousfinyr = true;
  //   this.currentpagefinyr = 1;
  //   setTimeout(() => {
  //     if (
  //       this.fin_yearauto &&
  //       this.autocompleteTrigger &&
  //       this.fin_yearauto.panel
  //     ) {
  //       fromEvent(this.fin_yearauto.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(() => this.fin_yearauto.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(() => {
  //           const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextfinyr === true) {
  //               this.DrsService.getfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpagefinyr + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.finyearList = this.finyearList.concat(datas);
  //                   if (this.finyearList.length >= 0) {
  //                     this.has_nextfinyr = datapagination.has_next;
  //                     this.has_previousfinyr = datapagination.has_previous;
  //                     this.currentpagefinyr = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  // private getfinyear(prokeyvalue) {
  //   this.DrsService.getfinyeardropdown(prokeyvalue, 1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.finyearList = datas;
  //       console.log(this.finyearList)

  //     })
  // }
  // public displayfnfinyear(fin_year?: drs): string | undefined {
  //   return fin_year ? fin_year.finyer : undefined;

  // }

  map_schedule(event){
    this.sub_show= false;
    this.summarysshow=true;
    this.category_hide= false
    this.sortorder_hide= false
    this.Schdularmastersum.get("Schdularmaster").reset();
    this.Schdularmastersum.get("sort").reset();
    this.Schdularmastersum.get("cat").reset();
    this.Schdularmastersum.get("Schdularmaster_item_number").reset();
    this.Schdularmastersum.get("Schdulartypes").reset();
    this.Schdularmastersum.get("Upper_aierachy").reset();
    this.Schdularmastersum.get("status").reset();
    this.Schdularmastersum.get("add_or_less").reset();
this.checked_map=event.checked
if(event.checked==true){
  setTimeout(() =>{
    this.schedule_master= true
  })
  this.map_hide_show=false;
  this.map_show_hide=true;
  this.summarysshow=true;
  this.validate= false
}else{
  this.map_hide_show=true;
  this.map_show_hide=false;
}
  }
  map_schedule_summary(event){
this.summary_checked=event.checked
  }

}




