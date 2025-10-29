import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NotificationService } from '../../service/notification.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ErrorHandlingService } from 'src/app/rems/error-handling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';

export interface icompanyList {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit {

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  pagination_mapping = {
    has_next: false,
    has_previous: false,
    index: 1
  }
 summarylist = [];
  summaryform: FormGroup;
  productform: FormGroup;
  product_mapping_form: FormGroup;
  product_mapping_popup: FormGroup;

  @ViewChild(MatAutocompleteTrigger)autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('actionclose')closebutton:ElementRef
  @ViewChild("closeproducted") closeproducted;
  @ViewChild("closeproductedmapping")closeproductedmapping;
@ViewChild('auto') auto: MatAutocomplete;
  @ViewChild('chip_box_input') chip_box_input: any; 
  @ViewChild("Products") Products: any;
  @ViewChild("product_auto") product_auto: MatAutocomplete;

  @ViewChild("Products_sub") Products_sub: any;
  @ViewChild("product_auto_sub") product_auto_sub: MatAutocomplete;
  

  public chipSelectedprodid = [];
  box = new FormControl();
  product_master:boolean=true;
  product_mapping_screen:boolean=false;
  box_searchloading: boolean;
  box_hold_data: icompanyList[];
  box_selected_data: icompanyList[] = [];
  chip_selected_data = [];
    public separatorKeysCodes: number[] = [ENTER, COMMA];
  product_master_dda_list: any;
  prodct_searchloading: boolean;
  hasven_next: boolean=true;
  currentven_page: number=1;
  vendorlist: any;
  hasven_previous:boolean=true;
  mapping_summarylist: any=[];
  check_box_id: any;
  @ViewChild('closesubproduct')closesubproduct;
  sub_product_form:FormGroup;
  product_master_sub_list: any;
  hassub_next: boolean;
  currentsub_page: number;
  hassub_previous: any;
  prodct_search_subloading: boolean;
  retention_period: any;
  edit_summary_datas: any;

  constructor(private rmuservice: RmuApiServiceService, private fb: FormBuilder,private notification: NotificationService,private SpinnerService:NgxSpinnerService, private errorHandler:ErrorHandlingServiceService) { }


  ngOnInit(): void {
    this.summaryform = this.fb.group({
      name: '',
      code: ''
    });
    this.productform = this.fb.group({
      id:null ,
      name: "",
      code: "",
      business_owner: "",
      counts_per_batch: null,
      batches_per_box: null,
      counts_per_box: null,
      retention_period: null,
      arc_1: null,
      arc_2: null,
      arc_3: null,
      arc_4: null,
      arc_5: null,
      arc_6: null,
      arc_7: null,
      arc_8: null,
    })
    this.product_mapping_form=this.fb.group({
      name:[],
      code:[],
      product_box:[]
    })
    this.product_mapping_popup=this.fb.group({
      product:[],
      box:[],
      count_box:[],
      retention_period:[],
      box_count:[]
    })

    this.sub_product_form=this.fb.group({
      product:[]
    })

    this.sub_product_form = this.fb.group({
      product:[],
      sub_product_arry: this.fb.array([])
    });
    this.getsummary();
  }

  editproduct(data) {
    this.productform.patchValue({
      id: data.id,
      name: data.name,
      code: data.code,
      business_owner: data.business_owner ? data.business_owner : null,
      counts_per_batch: data.counts_per_batch ? data.counts_per_batch :null,
      batches_per_box: data.batches_per_box ? data.batches_per_box :null,
      counts_per_box: data.counts_per_box ? data.counts_per_box :null,
      retention_period:data.retention_period,
      arc_1: data.arc_1 ? data.arc_1:null,
      arc_2: data.arc_2 ? data.arc_2:null,
      arc_3: data.arc_3 ? data.arc_3:null,
      arc_4: data.arc_4 ? data.arc_4:null,
      arc_5: data.arc_5 ? data.arc_5:null,
      arc_6: data.arc_6 ? data.arc_6:null,
      arc_7: data.arc_7 ? data.arc_7:null,
      arc_8: data.arc_8 ? data.arc_8:null,
    })
    this.productpopupopen()
  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getsummary()
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getsummary()
  }

  getsummary() {
    let val = this.summaryform.value;
    let name=this.summaryform.value.name?this.summaryform.value.name:""
    let code =this.summaryform.value.code?this.summaryform.value.code:""
    // Object.keys(val).map(key => !val[key] ? delete val[key] : true)
    // val = Object.keys(val).map(key => key + '=' + val[key]).join('&');
    this.rmuservice.product_master_summary(name,code, this.pagination.index).subscribe(results => {
      if (!results) {
        return false
      }
      this.summarylist = results['data'];
      this.summarylist.forEach(element => {
        element.available_fields = this.getfields(element);
      })
      this.pagination = results.pagination ? results.pagination : this.pagination;
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }

  getfields(val) {
    var value = [];
    Object.keys(val).map(key => {
      if (!val[key]) {
        delete val[key];
      }
      else {
        key.startsWith('arc_') ? value.push(val[key]) : false;
      }
    }
    );
    return value;
  }

  submitproduct() {
    if(this.productform.value.name=="" || this.productform.value.name==undefined || this.productform.value.name==null){
      this.notification.showWarning("Please Enter The Product Name")
      return false
    }
    if(this.productform.value.code=="" || this.productform.value.code==undefined || this.productform.value.code==null){
      this.notification.showWarning("Please Enter The Product Code")
      return false
    }
    // if(this.productform.value.batches_per_box=="" || this.productform.value.batches_per_box==undefined || this.productform.value.batches_per_box==null){
    //   this.notification.showWarning("Please Enter The Batches per Box")
    //   return false
    // }
    // if(this.productform.value.counts_per_box=="" || this.productform.value.counts_per_box==undefined || this.productform.value.counts_per_box==null){
    //   this.notification.showWarning("Please Enter The Counts per Box")
    //   return false
    // }
    if(this.productform.value.retention_period=="" || this.productform.value.retention_period==undefined || this.productform.value.retention_period==null){
      this.notification.showWarning("Please Enter The Retention Period In Months")
      return false
    }
    let payload = this.productform.value;
    payload.id ? true : delete payload.id;
    // this.rmuservice.createproduct([payload]).subscribe(res => {
    //   res?.status == 'success' ? this.closeproducted.nativeElement.click(): true;
    //   this.getsummary()
    // })
    const pattern = /e.*?c.*?f/gi; 
    const matches = this.productform.value.name.match(pattern);
    console.log("matches",matches)
  

    let product
    if(!this.productform.value.id){   
      let mat_value
      if (matches){
        mat_value=true
      }else{
        mat_value=false
      }
    product={
      "name":this.productform.value.name?this.productform.value.name:"",
      "code":this.productform.value.code?this.productform.value.code:'',
      "retention_period":this.productform.value.retention_period?this.productform.value.retention_period:'',      
      "is_ecf":mat_value
  }
    }else{
      let mat_value
      if (matches){
        mat_value=true
      }else{
        mat_value=false
      }
      product={
        "name":this.productform.value.name?this.productform.value.name:"",
        "code":this.productform.value.code?this.productform.value.code:'',
        "retention_period":this.productform.value.retention_period?this.productform.value.retention_period:'',
        "is_ecf":mat_value,
        "id":this.productform.value.id
    }
}
this.SpinnerService.show()
    this.rmuservice.product_mapping_create_update(product).subscribe(data => {
      this.SpinnerService.hide()
      if(data.status=="success"){
        this.notification.showSuccess(data.message)
        this.closeproducted.nativeElement.click()
        this.getsummary()
      }else{
        this.notification.showError(data.description)
      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })

  }


  productpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("productmodal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedpopup() {
    this.closeproducted.nativeElement.click();
    this.productform.reset()
  }

  

  productformcreation(){
    this.productpopupopen()    
    this.productform.get("id").reset(); 
    this.productform.reset()
    
  }

  product_mapping_create(){ 
    this.product_mappingpopupopen() 
    console.log("this.product",this.product_mapping_popup)   
    this.box_selected_data = [];
    this.chip_selected_data = [];
    if (this.chip_box_input) {
      this.chip_box_input.nativeElement.value = '';
    }   
    this.product_mapping_popup.get('product').reset();
    this.product_mapping_popup.get("id").reset();  
    
   
  }

  summaryform_reset(){
    this.summaryform.reset()
    this.getsummary()
  }

  product_mapping(){
this.product_mapping_screen=true;
this.product_master=false;
this.summaryform.reset()
this.productform.reset()
this.get_mapping_summary()
  }

  product_mappingpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("mappingmodal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closed_mappingpopup() {
    this.closeproductedmapping.nativeElement.click();
    this.product_mapping_popup.reset()
  }
  paycomponent_search(value) {
    this.box_searchloading=true
    this.rmuservice.box_master_summary(value, 1).subscribe(data => {
      this.box_searchloading=false
      this.box_hold_data = data['data'];
      console.log("this",this.box_hold_data)
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }

  product_master_dd(value) {
    this.prodct_searchloading=true
    this.rmuservice.product_master_summary(value,"", 1).subscribe(data => {
      this.prodct_searchloading=false
      this.product_master_dda_list = data['data'];
      console.log("this",this.product_master_dda_list)
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }


  product_master_Scroll() {
        setTimeout(() => {
          if (
            this.product_auto &&
            this.autocompleteTrigger &&
            this.product_auto.panel
          ) {
            fromEvent(this.product_auto.panel.nativeElement, "scroll")
              .pipe(
                map(() => this.product_auto.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(() => {
                const scrollTop = this.product_auto.panel.nativeElement.scrollTop;
                const scrollHeight =
                  this.product_auto.panel.nativeElement.scrollHeight;
                const elementHeight =
                  this.product_auto.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.hasven_next === true) {
                    this.rmuservice.product_master_summary(this.Products.nativeElement.value,"",this.currentven_page + 1 )
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.product_master_dda_list =this.product_master_dda_list.concat(datas);
                        if (this.product_master_dda_list.length >= 0) {
                          this.hasven_next = datapagination.has_next;
                          this.hasven_previous = datapagination.has_previous;
                          this.currentven_page = datapagination.index;
                        }
                      });
                  }
                }
              });
          }
        });
      }
  
      
  public product_display(vendor_name?: icompanyList): string | undefined {
    return vendor_name ? vendor_name.name : undefined;
  }

  back_btn(){
    this.product_mapping_screen=false;
    this.product_master=true
  }

  get_mapping_summary(){
    let name =this.product_mapping_form.value.name?this.product_mapping_form.value.name:""
    let code =this.product_mapping_form.value.code?this.product_mapping_form.value.code:""
    let product_box=this.product_mapping_form.value.product_box?.id??""
    this.rmuservice.product_mapping_summary(name,code,product_box, this.pagination.index).subscribe(results => {
      if (!results) {
        return false
      }
      this.mapping_summarylist = results['data'];
      this.mapping_summarylist.forEach(element => {
        element.available_fields = this.getfields(element);
      })
      this.pagination_mapping = results.pagination ? results.pagination : this.pagination;
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }



public removedcompany(company: icompanyList): void {
  const index = this.box_selected_data.findIndex(data => data.id === company.id);
  if (index >= 0) {
    this.box_selected_data.splice(index, 1);
    this.chip_selected_data = this.box_selected_data.map(data => data.id);
    const targetBoxDataId = this.chip_selected_data[0];
    const particular_data_id = this.edit_summary_datas.find(item => item?.box_data?.id === targetBoxDataId);
    this.rmuservice.product_mapping_remove(particular_data_id).subscribe(data => { 
      console.log("response inactive",data)
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
    
    console.log("this.chip_selectremove",this.chip_selected_data)
    if (this.chip_box_input) {
      this.chip_box_input.nativeElement.value = '';
    }
    this.check_box_id= this.chip_selected_data
    this.product_mapping_popup.patchValue({ box: this.chip_selected_data });
  }
}

public companySelected(event: MatAutocompleteSelectedEvent): void {
  const selectedCompany = event.option.value;
  if (!this.box_selected_data.some(data => data.id === selectedCompany.id)) {
    this.box_selected_data.push(selectedCompany);
    this.chip_selected_data = this.box_selected_data.map(data => data.id);
    console.log("this.chip_select",this.chip_selected_data)
    this.check_box_id= this.chip_selected_data
    this.product_mapping_popup.patchValue({ box: this.chip_selected_data });
  }
  if (this.chip_box_input) {
    this.chip_box_input.nativeElement.value = '';
  }
}

public selectcompanyByName(companyName: string): void {
  if (this.box_selected_data.some(company => company.name === companyName)) {
    return;
  }
  const foundCompany = this.box_hold_data.find(company => company.name === companyName);
  if (foundCompany) {
    this.box_selected_data.push(foundCompany);
    this.chip_selected_data.push(foundCompany.id);

    if (this.chip_box_input) {
      this.chip_box_input.nativeElement.value = '';
    }

    this.product_mapping_popup.patchValue({ box: this.chip_selected_data });
  }
}


edit_mapping_product(data: any) {
  console.log("data", data);
this.edit_summary_datas=data?.productbox_data
  const boxDataArray = data?.productbox_data.map(item => item?.box_data);
  const extractedId = boxDataArray.map(item => item?.id);
  this.product_mapping_popup.get('box').setValue(extractedId);
  this.box_selected_data = boxDataArray;
  this.retention_period=data?.retention_period
  const refIds = this.box_selected_data.map(box => ({ "box_id": box?.id }));
  this.check_box_id=extractedId
  console.log("boxDataArray", boxDataArray, "Extracted IDs:", extractedId, "Reference IDs:", refIds,'editdata',this.edit_summary_datas);

  this.product_mapping_popup.patchValue({
    id: data.id,
    product: data,
    box_count:data?.productbox_data[0]?.box_count
  });

  this.product_mappingpopupopen();
}
product_box
boxmaster
  
  submit_mapping_product(){
    if(this.product_mapping_popup.value.product=="" || this.product_mapping_popup.value.product==undefined || this.product_mapping_popup.value.product==null){
      this.notification.showWarning("Please Select Product")
      return false
    }
    if(this.product_mapping_popup.value.box_count=="" || this.product_mapping_popup.value.box_count==undefined || this.product_mapping_popup.value.box_count==null){
      this.notification.showWarning("Please Enter Box Count")
      return false
    }
    if(!this.check_box_id?.length){
      this.notification.showWarning("Please Select The Box")
      return false
    }
    
    let product={
      "name":this.product_mapping_popup.value.product?.name?this.product_mapping_popup.value.product?.name:"",
      "id":this.product_mapping_popup.value.product?.id?this.product_mapping_popup.value.product?.id:'',
      "code":this.product_mapping_popup.value.product?.code?this.product_mapping_popup.value.product?.code:"",
      "box_id":this.check_box_id,
      "retention_period":this.retention_period,
      "box_count": this.product_mapping_popup.value.box_count?this.product_mapping_popup.value.box_count:"",
  }
  console.log("product",product)
    this.rmuservice.product_mapping_create_update(product).subscribe(data => { 
      if(data.status=="success"){
        this.notification.showSuccess(data.message)
        this.closed_mappingpopup()
        this.get_mapping_summary()
      }else{
        this.notification.showError(data.description)
      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  } 

  summaryform_mapping_reset(){
    this.product_mapping_form.reset()
    this.get_mapping_summary()
  }

  
  sub_product(){
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("subproduct"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedsubpopup(){
this.closesubproduct.nativeElement.click()
this.sub_product_form.reset()
  }

  submit_sub_product(){

  }
  sub_product_arry(): FormArray {
    return this.sub_product_form.get('sub_product_arry') as FormArray;
  }

  newEmployee(): FormGroup {
    return this.fb.group({
      sub_prod: '',
      lastName: '',
      sub_prod_arry: this.fb.array([])
    });
  }

  addEmployee() {
    this.sub_product_arry().push(this.newEmployee());
  }

  removeEmployee(index: number) {
    this.sub_product_arry().removeAt(index);
  }

  sub_prod_2form(index: number): FormArray {
    return this.sub_product_arry()
      .at(index)
      .get('sub_prod_arry') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      skill: '',
      exp: ''
    });
  }

  addEmployeeSkill(index: number) {
    this.sub_prod_2form(index).push(this.newSkill());
  }

  removeEmployeeSkill(index: number, sub_index: number) {
    this.sub_prod_2form(index).removeAt(sub_index);
  }

  onSubmit() {
    console.log(this.sub_product_form.value);
  }


  product_master_sub(value) {
    this.prodct_search_subloading=true
    this.rmuservice.product_master_summary(value,"", 1).subscribe(data => {
      this.prodct_search_subloading=false
      this.product_master_sub_list = data['data'];
      console.log("this",this.product_master_sub_list)
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }


  product_master_sub_Scroll() {
        setTimeout(() => {
          if (
            this.product_auto_sub &&
            this.autocompleteTrigger &&
            this.product_auto_sub.panel
          ) {
            fromEvent(this.product_auto_sub.panel.nativeElement, "scroll")
              .pipe(
                map(() => this.product_auto_sub.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(() => {
                const scrollTop = this.product_auto_sub.panel.nativeElement.scrollTop;
                const scrollHeight =
                  this.product_auto_sub.panel.nativeElement.scrollHeight;
                const elementHeight =
                  this.product_auto_sub.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.hassub_next === true) {
                    this.rmuservice.product_master_summary(this.Products_sub.nativeElement.value,"",this.currentsub_page + 1 )
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.product_master_sub_list =this.product_master_sub_list.concat(datas);
                        if (this.product_master_sub_list.length >= 0) {
                          this.hassub_next = datapagination.has_next;
                          this.hassub_previous = datapagination.has_previous;
                          this.currentsub_page = datapagination.index;
                        }
                      });
                  }
                }
              });
          }
        });
      }
  
      
  public product_sub_display(vendor_name?: icompanyList): string | undefined {
    return vendor_name ? vendor_name.name : undefined;
  }

}
