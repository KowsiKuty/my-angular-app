import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
// import { AnyRecordWithTtl } from 'dns';

@Component({
  selector: 'app-addbarcodes',
  templateUrl: './addbarcodes.component.html',
  styleUrls: ['./addbarcodes.component.scss', '../rmustyles.css']
})
export class AddbarcodesComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService, private rmuservice:RmuApiServiceService, private router:Router) { }
  addBarcodes : FormGroup;
  fileupload: FormGroup
  barcodetype = [];
  barcodecategory = [];
  productlist = []
  startlist  = []
  vendorlist = []
  totalcounts : any;
  bcstarts: any;
  uploadfile: any;

  ngOnInit(): void {

    this.addBarcodes = this.fb.group({
      vendor : '',
      barcode_startswith :'',
      barcode_type: '',
      from_series : '',
      total_count: '',
      to_series:'',
      filedatas: '' 
    

    })
    this.fileupload = this.fb.group({
      filedata: '' ,
    })
    const queryparams={
      admin:'home'
    };

    this.rmuservice.getbrcategory().subscribe(res => {
      this.barcodecategory = res['data']
    })
    this.rmuservice.getbrtype().subscribe(res => {
      this.barcodetype = res['data']
    })
    this.rmuservice.getproducts().subscribe(res => {
      this.productlist = res['data']
    })
    // this.rmuservice.getbarcodestarts().subscribe(res => {
    //   this.startlist = res['data']
    // })


    this.getvendorValue();
    
  }

  newBarcodes()
  {
    if (this.addBarcodes.value.vendor == '' || this.addBarcodes.value.vendor  == null) {
      console.log('show error in Vendor')
      this.notification.showError('Please Enter Vendor')
      throw new Error;
    }
    if (this.addBarcodes.value.barcode_type == '' || this.addBarcodes.value.barcode_type  == null) {
      console.log('show error in barcode type')
      this.notification.showError('Please Enter Barcode type')
      throw new Error;
    }
    if (this.addBarcodes.value.total_count == '' || this.addBarcodes.value.total_count  == null) {
      console.log('show error in total count')
      this.notification.showError('Please Enter Total count')
      throw new Error;
    }
    if (this.addBarcodes.value.barcode_startswith == '' || this.addBarcodes.value.barcode_startswith  == null) {
      console.log('show error in barcode startswith')
      this.notification.showError('Please Enter Barcode Starts With')
      throw new Error;
    }
    if (this.addBarcodes.value.from_series == '' || this.addBarcodes.value.from_series  == null) {
      console.log('show error in barcode from series')
      this.notification.showError('Please Enter Barcode From Series')
      throw new Error;
    }
    if (this.addBarcodes.value.to_series == '' || this.addBarcodes.value.to_series  == null) {
      console.log('show error in barcode to series')
      this.notification.showError('Please Enter Barcode To Series')
      throw new Error;
    }
    this.rmuservice.submitnewbarcodes(this.addBarcodes.value, this.addBarcodes.get('filedatas').value
    ).subscribe(res => {
      console.log("input Values ", this.addBarcodes.value)
      // console.log("File", this.fileupload.get('filedata').value)
      if (res.status === "success") {
        this.notification.showSuccess('Barcodes Added Successfully')
        this.router.navigate(['rmu/barcodesummary'],{}); 
         this.addBarcodes.reset();
         
        return true;
      } else {

       this.notification.showError(res.description)
        return false;
      }
    })

   
    

  }

  returnHome()
  {
    
    this.router.navigate(['rmu/adminpage'],{}); 
  }

  getvendorValue() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }

  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    this.addBarcodes.get('filedatas').setValue(this.uploadfile);

  }

  changevalue(val)
  {
       
       this.totalcounts = this.addBarcodes.value.total_count;
       this.bcstarts = this.addBarcodes.value.barcode_startswith;
       //let vals = val.split(this.bcstarts);
       //console.log(vals)
       //let vals = val.slice(2)

       var vals = val;
       var regex = new RegExp('([0-9]+)|([a-zA-Z]+)','g');
       var splittedArray = vals.match(regex);

       if(splittedArray.length == 2)
       {

        var text= splittedArray[0];
        var num = splittedArray[1];
        let bcend =  Number(num) + this.totalcounts -1;
        let val1 = `${this.bcstarts}${bcend}`;
        this.addBarcodes.get('to_series').setValue(val1);
       }
       else
       {
        var num = splittedArray[0];
        let bcend =  Number(num) + this.totalcounts -1;
        let val1 = `${bcend}`;
        this.addBarcodes.get('to_series').setValue(val1);
       }
       
      


       
  }

 
}
