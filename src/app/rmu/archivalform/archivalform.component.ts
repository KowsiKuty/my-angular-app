import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../address.model';
import { AddressComponent } from '../address/address.component';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { NotificationService } from '../../service/notification.service';

import { MaterialModule } from '../../material/material.module'
@Component({
  selector: 'app-archivalform',
  templateUrl: './archivalform.component.html',
  styleUrls: ['./archivalform.component.scss']
})
export class ArchivalformComponent implements OnInit {

  file: any;
  summarylist = [];
  addrdetails =[];
  exceldata: any;
  isLinear = true;
  title = 'materialApp';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  archivalrequestForm: FormGroup;
  uploadform : FormGroup;
  current_address : any;
  inputAddressTextValue = "";
  modalRef: NgbModalRef;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  uploadfile = null;
  barcodetype = [];
  address: any;
  barcodecategory = [];
  productlist = [];
  vendorlist = [];
  mychoice = false;
  formJoin: FormGroup;
  emplogCode: any;
  emplogPhone: any;
  constructor(private _formBuilder: FormBuilder, private modalService: NgbModal, private rmuservice: RmuApiServiceService, private notification: NotificationService) { }
  @ViewChild('closebtn') closebtn: ElementRef
  ngOnInit() {
 
    // this.archivalrequestForm = this._formBuilder.group({
    //   archival_type: 1,
    //   barcode_type: 1,
    //   vendor: '',
    //   num_of_boxes: ['', Validators.required],
    //   comments: '',
    //   filedata : '',
    //   productlist: '',
    //   contact_person:'',
    //   contact_no:'',
    //   contact_address:'',

    // })
    this.archivalrequestForm = this._formBuilder.group({
      FormArray: this._formBuilder.array([
        this.firstFormGroup = this._formBuilder.group({
          archival_type: 1,
          barcode_type: 1,
          vendor: '',
          num_of_boxes: ['', Validators.required],
          comments: ''
        }),
        this.uploadform = this._formBuilder.group({
            filedata : '',
            productlist: '',

        }),
        this.secondFormGroup = this._formBuilder.group({
          secondCtrl: ['', Validators.required],
          contact_address:  ['', Validators.required],
          contact_person: '',
          contact_no:['',[Validators.required,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        }),

      ])

      

     
    });
    this.getaddres();
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

    const label= document.querySelector('label');
    function onEnter()
    {
        label.classList.add('active');
       // this.notification.showSuccess(' File Added Successfully and will be Validated')

    }
    function onLeave()
    {
        label.classList.remove('active');
    }
    label.addEventListener('dragenter', onEnter);


    label.addEventListener('drop', onLeave);
    label.addEventListener('dragend', onLeave);
    label.addEventListener('dragleave', onLeave);
    label.addEventListener('dragexit', onLeave);

    const input = document.querySelector('input');
    input.addEventListener('change', event=>{
      if(input.files.length > 0)
      {

        //this.notification.showSuccess(' File Added Successfully and will be Validated')
      }
    })

    this.rmuservice.getproducts().subscribe(res => {
      this.productlist = res['data']
    })


  }
  formatdownload() {
    let vals = this.uploadform.value.productlist;
    console.log("Product Value",+vals);
    this.rmuservice.archivalformatdownload(vals).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'SampleFormat' + ".xlsx";
      link.click();
    })
  }

  // openAddressModal() {

  //   const modalRef = this.modalService.open(AddressComponent, {
  //     backdrop: 'static',
  //     centered: true
  //   }).result.then((res: Address) => {
  //     this.inputAddressTextValue = res.toStringFormat();
  //   });
  // }

  submitArchivalrequest() {
    console.log("FILE", this.uploadfile);
    console.log("JSON", this.firstFormGroup.value);

   // this.formJoin=new FormGroup({form1:this.firstFormGroup.value,form2:this.secondFormGroup.value})
    // console.log("Join form", this.firstFormGroup.value + this.secondFormGroup.value)

    if (this.uploadfile) {
      // this.rmuservice.submitarchival(this.firstFormGroup.value, this.uploadform.get('filedata').value).subscribe(results => {
        this.rmuservice.submitarchival(this.firstFormGroup.value,   this.uploadform.get('filedata').value).subscribe(results => { 
      this.summarylist = results['data'];
        this.pagination = results.pagination ? results.pagination : this.pagination;
        if (results.status == 'success') {
          this.notification.showSuccess("Files Uploaded Successfully")
          this.closebtn.nativeElement.click();
        }
        else
        {
        this.notification.showError(results.description)
  
        }
      });
    }
  }

  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    this.uploadform.get('filedata').setValue(this.uploadfile);

  }

  //addrdetails

  // getaddress(){
    
  //   this.rmuservice.getaddress().subscribe(results =>{
  //     this.addrdetails = results['data'];
  //     console.log(this.addrdetails)
  //     //this.pagination = results.pagination?results.pagination:this.pagination;
  //     if (results.status == 'success') {
  //      // this.notification.showSuccess("Records Uploaded Successfully")
  //     }
  //     else
  //     {
  //       console.log("Errorssssaa");
  //      // this.addrdetails = results['data'];
        
  //     //this.notification.showError(results.description)

  //     }
      
  //   })
  // }

  getaddres() {
    this.rmuservice.getaddress()
      .subscribe(result => {
        this.addrdetails = result.address
        this.emplogCode = result.code
        this.emplogPhone = result.phone_number
        this.secondFormGroup.patchValue({  contact_person: this.emplogCode })
        this.secondFormGroup.patchValue({  contact_no: this.emplogPhone })

        // console.log(result.address)

      


      })
  }
  enableAddress()
  {

    
    this.mychoice = true;
    
  }
  getvendorValue() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }

  addresschange(donull=true) {
    let val = this.secondFormGroup.value.addresschange;
    if (val && donull) {
      this.secondFormGroup.patchValue({ address: '' })
    }
    else{
      this.secondFormGroup.patchValue({ address: this.current_address })
    }
  }
 

}

