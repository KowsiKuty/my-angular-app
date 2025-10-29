import { Component, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-barcoder-assign',
  templateUrl: './barcoder-assign.component.html',
  styleUrls: ['./barcoder-assign.component.scss','../rmustyles.css']
})
export class BarcoderAssignComponent implements OnInit {

  constructor( private fb: FormBuilder, private rmuservice:RmuApiServiceService, @Inject(MAT_DIALOG_DATA) public data) { }
  approvelist=[]; 
  assignBarCode: FormGroup;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  vendorlist: Array<any>


  ngOnInit(): void {

    this.assignBarCode = this.fb.group({
      id:false,
      department : '',
      product:'',
      barcode_type: '',
      barcode_category : '',
      count: '',
      vendor: '',
      startswith:'',
      barcodeavailable:'',
      address:''

    })
    this.data ? this.patchdata() : false;
    this.getvendorValue();
    
  }
  patchdata() {
    this.rmuservice.getbarcodeapprove(this.data.id).subscribe(response => {
      response  = response['data'][this.data.id]
      this.assignBarCode.patchValue({
        id: response.id,
        department: response.barcode_request_data[0].department,
        product: response.barcode_request_data[0].product_id,
        barcode_type: response.barcode_request_data[0].barcode_type,
        barcode_category: response.request_type,
        count: response.barcode_request_data[0].request_count,
        vendor: '',
        startswith: '',
        barcodeavailable:'',
        address:'',
      })
    })
    
  }
  approvebarcode()
  {
   
    let payload = this.assignBarCode.value;
    payload.id ? true:delete payload.id;
    
    this.rmuservice.getapproveBarcode(payload).subscribe();
    // this.rmuservice.getapproveBarcode(this.assignBarCode.value).subscribe(results =>{
    //   this.approvelist = results['data'];
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    // })
  }
  getvendorValue() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }
 
  

}
