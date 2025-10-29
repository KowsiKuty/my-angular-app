import { Component, ElementRef, Inject, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';



@Component({
  selector: 'app-barcode-request',
  templateUrl: './barcode-request.component.html',
  styleUrls: ['./barcode-request.component.scss', '../rmustyles.css']
})


export class BarcodeRequestComponent implements OnInit {

 
  barcoderequestform: FormGroup
  breakpoint = 3;
  barcodetype = [];
  barcodecategory = [];
  productlist = []
  addressvalue:boolean = false;
  currentaddress = ''
  dept:String=null;
  reloadstatus: boolean = false;
  vendorlist: any;
  constructor( public dialogRef: MatDialogRef<BarcodeRequestComponent>,private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data, private rmuservice: RmuApiServiceService,
    private router: Router) {
      
  }
  @ViewChild('closebtn') closebtn: ElementRef
  ngOnInit(): void {
    // this.dept = this.rmuservice.;
    this.reloadstatus = false;
    this.rmuservice.getaddress().subscribe(res => {
      this.dept = `(${res['code']})-${res['name']}`
      this.currentaddress = res['address'];
      if (!this.data.id) {
        this.changeaddress()
      }

    })
    this.barcoderequestform = this.fb.group({
      id: false,
      // department: [1, Validators.required],
      product_id: null,
      barcode_type: "1",
      sticker_series: "1",
      vendor:1,
      contact_address: this.currentaddress,
      request_count: null,
      comment: null,
      addressvalue:false,
      contact_no:null
    })


    this.barcodecategory = this.data.barcatlist
    this.barcodetype = this.data.bartypelist;
    this.productlist = this.data.productlist;


    this.data.id ? this.patchdata() : false;
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }


  changeaddress(){
    let adrs
    if(this.barcoderequestform.value.addressvalue){
      adrs = ''
    }
    else{
      adrs =this.currentaddress
    }
    this.barcoderequestform.patchValue({ contact_address:adrs })
  }

  patchdata() {
    this.rmuservice.getbarcoderequest(this.data.id).subscribe(response => {
     
      if (this.currentaddress != response.address){
        
        this.addressvalue = true;
      }
      this.barcoderequestform.patchValue({
        id: response.id,
        department: response.department,
        product_id: response.product_id,
        barcode_type: String(response.barcode_type.value),
        sticker_series: String(response.sticker_series.value),
        contact_address: response.contact_address,
        request_count: response.request_count,
        comment: response.maker_data.comment,
        addressvalue:false,
        contact_no:response.contact_no,
        vendor:response?.vendor.id,
      })
    })

  }

  onResize(evt) {
    this.breakpoint = (evt.target.innerWidth > 700) ? 3 : 2;
  }

  submitform() {
    let payload = this.barcoderequestform.value;
    payload.id ? true : delete payload.id;
    payload.barcode_type = Number(payload.barcode_type);
    payload.sticker_series = Number(payload.sticker_series)
    payload.product_id = 1;
    this.rmuservice.barcodesubmit(payload).subscribe(res => {
      if (res.status == 'success') {
        this.reloadstatus = true;
        this.closebtn.nativeElement.click();

      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close(this.reloadstatus);
  }
//  ngOnDestroy(val){
//   if(val == 'success'){
//     console.log('make reload')
//   }
//  }
}
