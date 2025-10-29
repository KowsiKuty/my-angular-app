import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss', '../rmustyles.css']
})
export class ProductCreateComponent implements OnInit {
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  summarylist = [];
  summaryform: FormGroup;
  productform: FormGroup;
  @ViewChild('actionclose')closebutton:ElementRef
  @ViewChild("closeproducted") closeproducted;


  constructor(private rmuservice: RmuApiServiceService, private fb: FormBuilder,private notification: NotificationService) { }

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
    this.rmuservice.getproductsummary(name,code, this.pagination.index).subscribe(results => {
      if (!results) {
        return false
      }
      this.summarylist = results['data'];
      this.summarylist.forEach(element => {
        element.available_fields = this.getfields(element);
      })
      this.pagination = results.pagination ? results.pagination : this.pagination;
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
    if(this.productform.value.counts_per_box=="" || this.productform.value.counts_per_box==undefined || this.productform.value.counts_per_box==null){
      this.notification.showWarning("Please Enter The Counts per Box")
      return false
    }
    if(this.productform.value.retention_period=="" || this.productform.value.retention_period==undefined || this.productform.value.retention_period==null){
      this.notification.showWarning("Please Enter The Retention Period In Months")
      return false
    }
    let payload = this.productform.value;
    payload.id ? true : delete payload.id;
    this.rmuservice.createproduct([payload]).subscribe(res => {
      res?.status == 'success' ? this.closeproducted.nativeElement.click(): true;
      this.getsummary()
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
    
  }

  productformcreation(){
    this.productpopupopen()    
    this.productform.get("id").reset(); 
    this.productform.reset()
    
  }

  summaryform_reset(){
    this.summaryform.reset()
    this.getsummary()
  }
}


