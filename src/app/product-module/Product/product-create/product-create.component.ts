import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'

export interface catdatas {
  code: any
  name: any
}



@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.APIServicesPath, imp.Master, imp.ProductAPI]
})
export class ProductCreateComponent implements OnInit {

  ProductForm: FormGroup; additional_info: FormGroup;

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private productpath: imp.ProductAPI,
    private notify: imp.ToastrService,
    private error: imp.ErrorHandlingServiceService, private route: Router,
    private path: imp.APIServicesPath, private master: imp.Master) { }


  productCreateObjects = {
    categoryList: '',
    subcategoryList: ''

  }

  OptionalFields: FormGroup

  ngOnInit(): void {
    this.ProductForm = this.fb.group({
      "name": "",
      "details": "",
      "category_id": "",
      "subcategory_id": ""
    })
    this.additional_info = this.fb.group({})

    this.OptionalFields = this.fb.group({
      name: '',
      type: ''
    })

  }



  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  catDD(typeddata) {
    // this.spin.show();
    // this.service.commoditysearch(data, 1)
    this.service.ApiCall("get", this.master.masters.category + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.productCreateObjects.categoryList = datas;
        // this.spin.hide();
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFncat(cat?: catdatas): string | undefined {
    return cat ? cat.name : undefined;
  }


  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatInput') subcatInput: any;

  subcatDD(typeddata, catdata) {
    // this.spin.show();
    // this.service.commoditysearch(data, 1)
    if (catdata == "" || catdata == null || catdata == undefined) {
      this.notify.warning("Please Check Category")
      return false
    }
    this.service.ApiCall("get", this.master.masters.subcategory + typeddata + "&" + this.master.subQuerys.category + "=" + catdata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.productCreateObjects.subcategoryList = datas;
        // this.spin.hide();
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnsubcat(subcat?: catdatas): string | undefined {
    return subcat ? subcat.name : undefined;
  }




  /////////////////////////////  Additional Info 
  SelectedDataJson = []



  SelectedCreateFormData() {
    // console.log("controls", controls) 
    let controls = {
      "name": this.OptionalFields.value.name,
      "label": this.OptionalFields.value.name,
      "value": "",
      "type": this.OptionalFields.value.type
    }

    this.SelectedDataJson.push(controls)
    // console.log("arr data",  this.SelectedDataJson) 
    let arrset: any = this.SelectedDataJson
    console.log("controls data", this.SelectedDataJson)
    for (const control of arrset) {
      console.log("loop control", control)
      this.additional_info.addControl(
        control.name,
        this.fb.control(control.value)
      );
    }

    console.log("this.SelectedDataJson.controls", this.SelectedDataJson);
    this.OptionalFields.reset('')


  }


  SubmitFinalDataProduct() {
    let StaticForm = this.ProductForm.value
    let DynamicForm = this.additional_info.value

    let obj = {

      "name": StaticForm.name,
      "details": StaticForm.details,
      "category_id": StaticForm.category_id?.id,
      "subcategory_id": StaticForm.subcategory_id?.id,
      "additional_info": this.additional_info.value
    }

    console.log(obj)
    let formdata = new FormData()
    formdata.append("data", JSON.stringify(obj))
    for (var i = 0; i < this.Documentfilearray.length; i++) {
      let keyvalue = 'file'
      let pairValue = this.Documentfilearray[i];
      formdata.append(keyvalue, pairValue)
    }
    this.service.ApiCall("post", this.productpath.ProductsAPI.product, formdata)
      .subscribe(results => {
        this.log.logging("Product Create API", results)
        if (results?.status == "Success") {
          this.ProductCancel()
          this.notify.success("Successfully Created")
        }
      })




  }


  ProductCancel() {
    this.route.navigate(['crm/crm', 'summary']);
  }
















  DataDropDown = [
    {
      "name": "Date",
      "type": "date"
    },
    {
      "name": "Text",
      "type": "text"
    },
    {
      "name": "Number",
      "type": "number"
    },
    {
      "name": "TextArea",
      "type": "textarea"
    },
  ]

  removecontrol(controlname) {
    this.additional_info.removeControl(controlname);
    console.log("remove data array before", this.SelectedDataJson, this.SelectedDataJson.findIndex(arr => arr.name == controlname))

    let index = this.SelectedDataJson.findIndex(arr => arr.name == controlname)

    this.SelectedDataJson.splice(index, 1)

    console.log("remove data array after", this.SelectedDataJson)
  }



  // imgInp.onchange = evt => {
  //   const [file] = imgInp.files
  //   if (file) {
  //     blah.src = URL.createObjectURL(file)
  //   }
  // }








  Documentfilearray: any = []
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  pdfurl: any
  jpgUrls: any
  // @ViewChild ('fileInpfileInputValueut') fileInputValue
  @ViewChild('fileInpfileInputValueut') fileInputValue: ElementRef;
  onFileSelected(event) {
    this.Documentfilearray = []
    // console.log("e in file", e)
    // for (var i = 0; i < e.target.files.length; i++) {
    //   this.Documentfilearray.push(e.target.files[i])
    // }
    console.log("document array===> before", this.Documentfilearray, this.jpgUrls)

    if (event.target.files && event.target.files[0]) {
      this.Documentfilearray.push(event.target.files[0])
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.jpgUrls = event.target.result;
      }
    }
    console.log("document array===> after", this.Documentfilearray, this.jpgUrls)

  }

  // deleteInlineFile(fileindex, data) {
  //   console.log("fileindex", fileindex)
  //   let filedata = this.Documentfilearray
  //   console.log("filedata for delete before", filedata)
  //   console.log("filedata selected", data)

  //   filedata.splice(fileindex, 1)
  //   console.log("filedata for delete after", filedata)
  // }

  deleteFile() {
    console.log("before", this.jpgUrls, this.Documentfilearray, this.fileInputValue)
    this.jpgUrls = "";
    this.Documentfilearray = [];
    //  document.getElementById('fileInput').files=null  
    this.fileInputValue.nativeElement.value = null 
    // console.log("after", this.jpgUrls, this.Documentfilearray, this.fileInputValue)
  }





  // filepreview(files) {
  //   console.log("file data to view ", files)

  //   let stringValue = files.name.split('.')
  //   if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
  //     this.showimageHeaderPreview = true
  //     this.showimageHeaderPreviewPDF = false

  //     // if(this.isEdit == false){

  //     const reader: any = new FileReader();
  //     reader.readAsDataURL(files);
  //     reader.onload = (_event) => {
  //       this.jpgUrls = reader.result
  //     }
  //   }
  //   if (stringValue[1] === "pdf") {
  //     this.showimageHeaderPreview = false
  //     this.showimageHeaderPreviewPDF = true
  //     const reader: any = new FileReader();
  //     reader.readAsDataURL(files);
  //     reader.onload = (_event) => {
  //       this.pdfurl = reader.result
  //     }
  //   }
  //   if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
  //     this.showimageHeaderPreview = false
  //     this.showimageHeaderPreviewPDF = false
  //     this.notify.info('Preview not available for this format')
  //   }
  // }






}
