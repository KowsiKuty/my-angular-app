import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsService } from '../rems.service';
import { Rems2Service } from '../rems2.service'

import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RemsShareService } from '../rems-share.service'

@Component({
  selector: 'app-remstemplate',
  templateUrl: './remstemplate.component.html',
  styleUrls: ['./remstemplate.component.scss']
})
export class RemstemplateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  remstemplateForm: FormGroup;
  isremstemplateForm: boolean;
  TemplateList: any;
  CategoryList: any;
  SubcategoryList: any;
  RMButton = false;
  presentpage: number = 1;
  currentpage: number = 1;
  pageSize = 10;
  is_page: any;
  has_previous = false;
  has_next = false;
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @ViewChild('myInput')
  myInputVariable: ElementRef;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private toastr: ToastrService, private remsservice: RemsService, private notification: NotificationService,
    private router: Router, private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    this.remstemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      // category_id: ['', Validators.required],
      // subcategory_id: ['', Validators.required],
      description: ['', Validators.required],
      images: []

    })
    this.getTemplate();
    this.getcategory();
    this.getsubcategory();
  }

  private getcategory() {
    this.remsservice.getcategory()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.CategoryList = databb;
        console.log("typedetails", databb)
      })
  }

  private getsubcategory() {
    this.remsservice.getsubcategory()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.SubcategoryList = databb;
        console.log("typedetails", databb)
      })
  }

  fileDownload(id, fileName) {
    this.remsservice.fileDownloadtemp(id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }
  getTemplate(pageNumber = 1, pageSize = 10) {
    this.remsservice.gettemplate(pageNumber, pageSize,)
      .subscribe((result) => {
        console.log("eb", result)
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.TemplateList = datas;
        console.log("re", this.TemplateList)
        if (this.TemplateList.length === 0) {
          this.is_page = false
        }
        if (this.TemplateList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.is_page = true
        }
      })
  }

  previous() {
    if (this.has_previous === true) {
      this.currentpage = this.presentpage - 1
      this.getTemplate(this.presentpage - 1)
    }
  }

  next() {
    if (this.has_next === true) {
      this.currentpage = this.presentpage + 1
      this.getTemplate(this.presentpage + 1)
    }
  }
  idValue: any;

  gettemplate() {

    let data: any = this.remsshareService.remstemplateForm.value;
    console.log("data", data)
    console.log(">>hai", data)
    this.idValue = data.id;
    if (data === '') {
      this.remstemplateForm.patchValue({
        name: '',
        // category_id: '',
        // subcategory_id: '',
        description: '',

      })
    } else {



      this.remstemplateForm.patchValue({

        name: data.name,
        // category_id: data.category.category.id,
        // subcategory_id: data.category.id,
        description: data.description,

      })
      console.log("data", data)
    }
  }
  images: any;
  onFileSelected(e) {
    this.images = e.target.files;
  }

  templateEdit(data) {
    this.remsshareService.remstemplateForm.next(data)
    this.gettemplate();

  }

  templateDelete(data) {

    let value = data.id
    this.remsservice.templateDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getTemplate();
        return true

      })

  }

  submitForm() {
    if (this.remstemplateForm.value.name === "") {
      this.toastr.warning('', 'Please Enter Template name', { timeOut: 1500 });
      return false;
    }
    // if (this.remstemplateForm.value.category_id === "") {
    //   this.toastr.warning('', 'Please Enter Categoryname', { timeOut: 1500 });
    //   return false;
    // }
    // if (this.remstemplateForm.value.subcategory_id === "") {
    //   this.toastr.warning('', 'Please Enter SubCategoryname', { timeOut: 1500 });
    //   return false;
    // }
    if (this.remstemplateForm.value.description === "") {
      this.toastr.warning('', 'Please Enter Description', { timeOut: 1500 });
      return false;
    }
    if (this.remstemplateForm.value.images === "" || this.remstemplateForm.value.images === null || this.remstemplateForm.value.images === undefined) {
      this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
      return false;
    }



   
    if (this.idValue == undefined) {
      this.remsservice.addtemplate(this.remstemplateForm.value, '', this.images)
        .subscribe(result => {
          console.log("llb", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            // this.RMButton=false;
          }
          else if(result.code === "INVALID_FILETYPE") {
            this.notification.showError("Invalid FileType...")
           
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.reset();

            this.images = null
            this.getTemplate();

            this.fromGroupDirective.resetForm()
            this.router.navigate(['/rems/remstemplate'], { skipLocationChange: true });

          }
          this.images = null

        })
    } else {
      this.remsservice.addtemplate(this.remstemplateForm.value, this.idValue, this.images)
        .subscribe(result => {
          console.log("llb", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            // this.RMButton=false;
          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.reset();
            this.images = null
            this.idValue = undefined;
            this.getTemplate();
            this.fromGroupDirective.resetForm()
            //  this.router.navigate(['/rems/remstemplate'], { skipLocationChange: true });

          }
          this.images = null

        })
    }



  }

  onCancelClick() { }
  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

}


