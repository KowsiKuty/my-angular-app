import { Component, OnInit, ViewChild } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/service/notification.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

@Component({
  selector: 'app-barcodesummary',
  templateUrl: './barcodesummary.component.html',
  styleUrls: ['./barcodesummary.component.scss','../rmustyles.css']
})
export class BarcodesummaryComponent implements OnInit {
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  send_value: string;
  barcode_search:any;
  rmuurl=environment.apiURL
  assignBarCode: FormGroup;
  barcode_assign:any;
  addBarcodes : FormGroup;
  
  barcodecategory = [];
  productlist = []
  startlist  = []
  vendorlist = []
  totalcounts : any;
  bcstarts: any;
  uploadfile: any;
  barcodebutton:any
  barcode_searchvar:any = "String"
  vendor:any
  barcodetype: any
  constructor(private rmuservice:RmuApiServiceService, public router:Router, private fb: FormBuilder,private notification: NotificationService,) { 
    this.vendor = {
      label: "Vendor",
      method: "get",
      url: this.rmuurl + 'rmuserv/vendor',
      params: "&type=1",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "name"
      // required : true,
    }

    this.barcodetype= {
      label: "Barcode Type",
      method: "get",
      url: this.rmuurl + 'rmuserv/common_dropdown',
      params: "&code=barcode_type",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "value",
    }
    this.barcode_search=[{"type":"dropdown",inputobj:this.vendor,formvalue:"vendors"},{"type":"dropdown",inputobj:this.barcodetype,formvalue:"barcode_type"}]
this.barcode_assign=[{"type":"input","label":"Product","formvalue":"product"},{"type":"input","label":"Department","formvalue":"product_id"},{"type":"input","label":"Barcode Type","formvalue":"product_id"},{"type":"input","label":"Request Type","formvalue":"product_id"},{"type":"input","label":"Requested Count","formvalue":"product_id"},{"type":"dropdown",inputobj:this.vendor_master,formvalue:"vendor", required: true},{"type":"dropdown",inputobj:this.vendor_start,formvalue:"vendor", required: true},{"type":"dropdown",inputobj:this.vendor_free,formvalue:"vendor", required: true},{"type":"input","label":"GL NO","formvalue":"product_id"},]
this.barcodebutton = [
  {icon: "add","tooltip":"rmutooltip",function: this.popupopen.bind(this), "name": "ADD" }
];

  }
 
  barcodeform: FormGroup;
  summarylist=[];  
  


  vendor_master:any = {
    label: "Vendor",
    method: "get",
    url: this.rmuurl + 'rmuserv/vendor',
    params: "&type=1",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
  }
  vendor_start:any = {
    label: "Starts With",
    method: "get",
    url: this.rmuurl + 'rmuserv/vendor',
    params: "&type=1",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
  }
  vendor_free:any = {
    label: "Available Barcodes",
    method: "get",
    url: this.rmuurl + 'rmuserv/vendor',
    params: "&type=1",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
  }
  //pagination
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  queryparams={
    barcodes:'add'
  };
  searchpresentpage: any;
  ngOnInit(): void {
    this.getbssummary();

    this.barcodeform = this.fb.group({
        vendor: '',
        barcodetype: '',
    })
    this.addBarcodes = this.fb.group({
      vendor : '',
      barcode_startswith :'',
      barcode_type: '',
      from_series : '',
      total_count: '',
      to_series:'',
      filedatas: '' 
    

    })
    this.rmuservice.getbrtype().subscribe(res => {
      this.barcodetype = res['data']
    })
    this.rmuservice.getvendors()
    .subscribe(result => {
      this.vendor= result['data']


    })

    this.getvendorValue()
  }
  barcode_search_summary_api:any;
  barcode_summary_table:any=[{ "columnname": "Vendor",  "key": "vendor", type: "object", objkey: "name",},
    {"columnname": "Barcode Type", "key": "barcode_type", type: "object", objkey: "name",},
    {"columnname": "From Series", key: "from_series",},
    {"columnname": "To Series", "key": "to_series"},  
    {"columnname": "Total Count", "key": "total_count"},  
    {"columnname": "Issued Count", "key": "used_count"},
    {"columnname": "Available Count","key": "free_count",}
  ]

  
  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getbssummary()
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getbssummary()
  }

  getbssummary(){
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    // this.rmuservice.getbssummary('',this.pagination.index).subscribe(results =>{
    //   if(!results){
    //     return false;
    //   }
    //   this.summarylist = results['data'];
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    // })
    this.barcode_search_summary_api= { "method": "get", "url": this.rmuurl + "rmuserv/barcode_series"}
  }
  add_function:boolean=false;
  summary_data:boolean=true;
  returnHome(){
   
    this.router.navigate(['rmu/adminpage'],{}); 
  }

  openbarcode()
  {
    this.queryparams,
    console.log("this.queryparams",this.queryparams)
    // this.router.navigate(['rmu/addbarcodes'],{queryParams: this.queryparams});
    //   this.dialog.open(AddbarcodesComponent, {
    //     disableClose:true,
    //     width:'60%',
    //     panelClass:'mat-container'
    //   });
    
  }

  barcodeSearch(event){
    // let vendors =  this.barcodeform.value.vendor
    // let bctype = this.barcodeform.value.barcodetype
    // this.send_value = ''
    // if(vendors){
    // this.send_value = this.send_value+"&vendors="+vendors
    // }
    // if(vendors && bctype)
    // {
    //   this.send_value = this.send_value+"&barcode_type="+bctype 
    // }
    // if(bctype)
    // {
    //   this.send_value = this.send_value+"&barcode_type="+bctype 
    // }
    // if (this.barcodeform.value.vendor != null || this.barcodeform.value.barcodetype != null ) {
    //   this.searchpresentpage = 1
    //   //  this.rmuservice.getbssummary(this.send_value, this.searchpresentpage);

    // }
    
    this.barcode_search_summary_api= { "method": "get", "url": this.rmuurl + "rmuserv/barcode_series",params:event}

  }

  approvebarcode()
  {
    let payload = this.assignBarCode.value;
    payload.id ? true:delete payload.id;
    
    this.rmuservice.getapproveBarcode(payload).subscribe();
    // this.rmuservice.getapproveBarcode(this.assignBarCode.value).subscribe(results =>{
    //   this.approvelist = results['data'];
    //   this.pagination = results.pagination?results.pagination:this.pagination;
  }

  back_summary(){
    this.add_function=false;
    this.summary_data=true;
  }


  getvendorValue() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }

  close(){
    this.closeretrivalpopup.nativeElement.click()
    this.addBarcodes.reset()
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
         this.close()
         
        return true;
      } else {

       this.notification.showError(res.description)
        return false;
      }
    })
    

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
  
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("barcodeassignform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }


}
