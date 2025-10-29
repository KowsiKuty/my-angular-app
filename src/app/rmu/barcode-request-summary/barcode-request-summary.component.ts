import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { BarcodeRequestComponent } from '../barcode-request/barcode-request.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";


@Component({
  selector: 'app-barcode-request-summary',
  templateUrl: './barcode-request-summary.component.html',
  styleUrls: ['./barcode-request-summary.component.scss', '../rmustyles.css'],
  providers: [
    { provide: RmuApiServiceService }
  ]
})



export class BarcodeRequestSummaryComponent implements OnInit {
  @ViewChild("closebarcode") closebarcode;
  barcodesummaryData:any
  barcodesummary:any
  url = environment.apiURL
  //summarydata
  summaryform: FormGroup;
  summarylist = [];
  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  //drodowndata 
  deptlist: [];
  prodlist: [];
  barcodelist: [];
  barcodecategory: any;
  barcodecategorydrop:any
  barcodetype: any;
  productlist: any;
  check: any;
  barcode_request_search:any
  barcodebutton:any
  barcoderequest:any
  Status:any
  barcoderequestform: FormGroup
  breakpoint = 3;
  addressvalue:boolean = false;
  currentaddress = ''
  dept:String=null;
  reloadstatus: boolean = false;
  vendorlist: any;
  data: any;
  datass: any;
  searchvar: any = "String";
  constructor(private fb: FormBuilder, private rmuservice: RmuApiServiceService, public dialog: MatDialog) {
  
    this.barcoderequest = {
      label: "Barcode Type",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=barcode_type",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
    }

    this.barcodecategorydrop= {
      label: "Barcode Category",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=sticker_type",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
    }

    this.Status = {
      label: "Status",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=barcode_type",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
    }
    this.barcode_request_search = [{"type":"dropdown",inputobj:this.barcoderequest,formvalue:"type"},{"type":"dropdown",inputobj:this.barcodecategorydrop,formvalue:"barcode"},{"type":"dropdown",inputobj:this.Status,formvalue:"status"}]
    this.barcodebutton = [
      {icon: "add","tooltip":"rmutooltip",function: this.addrequest.bind(this), "name": "ADD" }
    ];
   
this.barcodesummaryData = [{"columnname": "Requested Date", "key": "requested_date",type: "Date","datetype": "dd-MMM-yyyy"},{"columnname": "Barcode Type", "key": "barcode_type","type": "object", "objkey": "name"},{"columnname": "Requested Count", "key": "request_count"},{"columnname": "Status", "key": "request_status","type": "object", "objkey": "value"},{"columnname": "Alloted Count", "key": "approved_count"},{"columnname": "From Series", "key": "from_series"},{"columnname": "To Series", "key": "to_series"},{"columnname": "Edit", "key": "edit",icon: "edit", button: true,style:{color: "black",cursor:"pointer"},function: true,clickfunction: this.editrequest.bind(this),}]
this.barcodesummary = {"method": "get", "url": this.url + "rmuserv/barcode_maker" ,params:"" }
  }
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
  
  
      this.data.id ? this.patchdata('') : false;
      this.rmuservice.getvendors()
        .subscribe(result => {
          this.vendorlist = result['data']
  
  
        })

    this.summaryform = this.fb.group({
      product_id: '',
      department: '',
      barcodetype: null,
      barcodecategory: null,
      status: null
    })
    this.getbrsummary()
    this.rmuservice.getbrcategory().subscribe(res => {
      this.barcodecategory = res['data']
    })
    this.rmuservice.getbrtype().subscribe(res => {
      this.barcodetype = res['data']
    })
    // this.rmuservice.getproducts().subscribe(res => {
    //   this.productlist = res['data']
    // })

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

  patchdata(data) {
    this.data = data
    this.datass = data.id
    this.rmuservice.getbarcoderequest(this.datass).subscribe(response => {
     
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
        vendor:response?.preferred_vendor.id,
      })
    })
    this.productpopupopen()

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
        this.closebarcode.nativeElement.click();
        this.barcoderequestform.reset()

      }
    });
  }
  
  addrequest(data) {
    this.barcoderequestform.reset()
    this.rmuservice.getbrcategory().subscribe(res => {
      this.barcodecategory = res['data']
    })
    this.rmuservice.getbrtype().subscribe(res => {
      this.barcodetype = res['data']
    })
    this.rmuservice.getvendors()
    .subscribe(result => {
      this.vendorlist = result['data']


    })

    // this.barcoderequestform.get("barcode_type").value
    // this.barcoderequestform.get("sticker_series").value
    // this.barcoderequestform.get("vendor").value

  //   this.barcodecategory.forEach( (type) =>{
  //  let barcode =  type.name
  //  this.barcodecategory.push(barcode)
  //   });

  //   this.barcodetype.forEach( (code) =>{
  //     let barcodetype =  code.value
  //     this.barcodetype.push(barcodetype)
  //      });

  //      this.vendorlist.forEach( (bacodevendor) =>{
  //       let vendor =  bacodevendor.vendor_master_id
  //       this.vendorlist.push(vendor)
  //        });

    // var data = Object.assign({});
    // data.barcatlist = this.barcodecategory;
    // data.bartypelist = this.barcodetype;
    // data.productlist = this.productlist;
    this.productpopupopen()
    // this.dialog.open(BarcodeRequestComponent, {
    //   disableClose: true,
    //   width: '60%',
    //   panelClass: 'mat-container',
    //   data: data
    // }).afterClosed().subscribe(result => {
    //   console.log('hits')
    //   if (result) {
    //     this.getbrsummary();
    //   }
    // });

  }
  editrequest(data) {
    data.barcatlist = this.barcodecategory;
    data.bartypelist = this.barcodetype;
    data.productlist = this.productlist;
    let datass = data
    this.patchdata(datass)
    // this.check = this.dialog.open(BarcodeRequestComponent, {
    //   disableClose: true,
    //   width: '60%',
    //   data: data,
    //   panelClass: 'mat-container'
    // });
    // this.check.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getbrsummary();
    //   }
    // });
  }


  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getbrsummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getbrsummary()
  }

  getbrsummary() {
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.rmuservice.getbrsummary('', this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }
  barcoderequestSearch(barcode){
    this.barcodesummary = {"method": "get", "url": this.url + "rmuserv/barcode_maker" ,params:barcode }
  }

  // popupopen() {
  //   var myModal = new (bootstrap as any).Modal(
  //     document.getElementById("singlerecordform"),
  //     {
  //       backdrop: 'static',
  //       keyboard: false
  //     }
  //   );
  //   myModal.show();
  // }

  // closedpopup() {
  //   this.closebarcode.nativeElement.click();
  // }

  productpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("barcodepopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedpopup() {
  this.closebarcode.nativeElement.click(); 
  this.barcoderequestform.reset()
  }
}
