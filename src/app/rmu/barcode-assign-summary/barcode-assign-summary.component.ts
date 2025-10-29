import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
//import { BarcoderAssignComponent  } from '../barcoder-assign/barcoder-assign.component;
import { MatDialog } from '@angular/material/dialog';
import { BarcoderAssignComponent } from '../barcoder-assign/barcoder-assign.component';
import { ArchivalformComponent } from '../archivalform/archivalform.component';
import { AddbarcodesComponent } from '../addbarcodes/addbarcodes.component';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
@Component({
  selector: 'app-barcode-assign-summary',
  templateUrl: './barcode-assign-summary.component.html',
  styleUrls: ['./barcode-assign-summary.component.scss', '../rmustyles.css']
})
export class BarcodeAssignSummaryComponent implements OnInit {

  assignsummarylist=[];
  request_count : any;
  archival_reequest_data: any;
  assignform: FormGroup;
  assignBarCode: FormGroup;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  vendorlist: Array<any>
  vendorlists: Array<any>
  vendorlis: Array<any>
  id: any;
  barcodetype = [];
  barcodecategory = [];
  productlist = []
  barcode_series_id: any
  totalcounts : any;
  bcstarts: any;
  dept: string = '';
  deptcode = ''
  barcodeavailable: any;
  available: any;
  reqcount: any;
  isButtonVisible: boolean = true;
  barcoderequestform: FormGroup
  breakpoint = 3;
  addressvalue:boolean = false;
  currentaddress = ''
  reloadstatus: boolean = false;
  
  
  constructor(public dialog: MatDialog, public formbuilder : FormBuilder, private notification: NotificationService,private rmuservice:RmuApiServiceService, private router:Router) { }


  @ViewChild('closebutton') closebtn: ElementRef
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  ngOnInit(): void {

    this.assignform = this.formbuilder.group
    ({
        // product : '',
        barcodetype: '',
        barcodecategory: '',
        reqDate: ''
    })
    this.assignBarCode = this.formbuilder.group({
      id:false,
      department : '',
      // product:'',
      barcode_type: '',
      barcode_category : '',
      count: '',
      vendor: '',
      startswith:'',
      barcodeavailable:'',
      comments:'',
      from_series: '',
      to_series: '',
      ids:'',
      barcode_series_id:'',
      barcodealloted:'',
    

    })
    

    this.getassignbarcodesummary();
    this.getvendorValue();

    this.rmuservice.getbrcategory().subscribe(res => {
      this.barcodecategory = res['data']
    })
    this.rmuservice.getbrtype().subscribe(res => {
      this.barcodetype = res['data']
    })
    this.rmuservice.getproducts().subscribe(res => {
      this.productlist = res['data']
    })
    this.rmuservice.getaddress().subscribe(res => {
      this.deptcode = res['code'];
      this.dept = `(${this.deptcode})${res['name']}`
      
    })
  }

  // assignbarcode(data)
  // {
  //   this.dialog.open(BarcoderAssignComponent, {
  //     disableClose:true,
  //     width:'60%',
  //     data:data,
  //     panelClass:'mat-container'
      
  //   });
    
  // }
  getassignbarcodesummary(){
    var val ='';
    this.rmuservice.getbarcodeapproverarchival(val,this.pagination.index).subscribe(results =>{
      this.assignsummarylist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
    })
  }

  newbarcode(){
    this.dialog.open(AddbarcodesComponent, {
      disableClose:false,
      width:'60%',
      panelClass:'mat-container'
    });
  }

  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getassignbarcodesummary()
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getassignbarcodesummary()
  }

  assignbarcode(data)
  {
    this.popupopen()
    console.log(data.barcode_request_data[0].id)
    this.rmuservice.getbarcoderequest(data.barcode_request_data[0].id).subscribe(response => {
      this.assignBarCode.patchValue({
        id: data.id,
        department: data.barcode_request_data[0].department,
        // product: data.barcode_request_data[0].product.name,
        barcode_type: data.barcode_request_data[0].barcode_type.name,
        barcode_category: data.barcode_request_data[0].sticker_series.name,
        count: data.barcode_request_data[0].request_count,
        vendor: '',
        startswith: '',
        barcodeavailable:'',
        comments:'',
        barcode_series_id:'',
        from_series:'',
        to_series: '',
        barcodealloted:'',
      })
    })
    }
    
    approvebarcode()
    {
     
      let payload = this.assignBarCode.value;
      this.rmuservice.getapproveBarcode(this.assignBarCode.value).subscribe(res => {
        console.log("ERRORS")
        console.log(res)
        if (res.status === "success") {
          this.notification.showSuccess('Barcode Assigned Successfully')
          this.getassignbarcodesummary();
          this.close()
          
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })
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
    // getvendorValues(data) {
    //   this.rmuservice.getvendorss(data)
    //     .subscribe(result => {
    //       this.vendorlists = result['data']
  
  
    //     })
    // }
    
    onChangeVendor(vendor) {
      
      let payload = this.assignBarCode.value;

      if (vendor) {
        this.rmuservice.getvendorss(vendor.id, payload.count).subscribe(
          result => {
            this.vendorlists = result['data'];
            
          }
        );
      } else {
       
      }
    }

    onChangeStartsWith(startw)
    {
      console.log(startw)
      if (startw) {
        let idvalue = this.vendorlists.values;
        console.log(idvalue)
        this.rmuservice.getdropdowndata(startw).subscribe(
          result => {
            this.vendorlis = result['data'];
            this.barcode_series_id = result['data'][0].id
            console.log( this.barcode_series_id )
            this.assignBarCode.get('barcode_series_id').setValue(this.barcode_series_id);
            this.barcodeavailable = result['data'][0].free_count
            this.assignBarCode.get('barcodeavailable').setValue(this.barcodeavailable);
            this.changevalue(this.barcodeavailable)
           
          }
        );
      } else {
       
      }

    }

    returnHome()
  {
    
    this.router.navigate(['rmu/adminpage'],{}); 
  }

  changevalue(val)
  {
       
       this.totalcounts = this.assignBarCode.value.barcodealloted;
       this.bcstarts = this.assignBarCode.value.from_series;
       //let vals = val.split(this.bcstarts);
       //console.log(vals)

       let ac = this.bcstarts.substring(0, 2);
       let bc  = this.bcstarts.slice(2)
       
       let bcend =  Number(bc) + Number(val) -1;
       let val1 = `${ac}${bcend}`;
       this.assignBarCode.get('to_series').setValue(val1);


       
  }

  checkvalue(val)
  {
    this.available = this.assignBarCode.value.barcodeavailable
    this.reqcount = this.assignBarCode.value.count
    if(val > this.available)
  
    {
      this.notification.showError("Please check the Allot count with Available count")
      this.isButtonVisible = false;
    }
    else
    {
      this.isButtonVisible = true;
    }

    if(val > this.reqcount)
  
    {
      this.notification.showError("Please check the Allot count with Requested count")
      this.isButtonVisible = false;
    }
    else
    {
      this.isButtonVisible = true;
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

  close(){
    this.closeretrivalpopup.nativeElement.click()
    this.assignBarCode.reset()
  }
  }  