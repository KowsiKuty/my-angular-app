import { Component, OnInit,Output,ElementRef, EventEmitter,ViewChild,Input } from '@angular/core';
import {FormGroup,FormBuilder,FormControl, Validators} from '@angular/forms';
import {AtmaService} from '../atma.service';
import { MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent} from 'rxjs';
import { ShareService } from '../share.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';
import { style } from '@angular/animations/animations';
import { color } from 'html2canvas/dist/types/css/types/color';
// export interface documentListss {
//   name: string;
//   id: number;
// }


@Component({
  selector: 'app-vendordocumentcreate',
  templateUrl: './vendordocumentcreate.component.html',
  styleUrls: ['./vendordocumentcreate.component.scss']
})
export class VendordocumentcreateComponent implements OnInit {
  atmaUrl = environment.apiURL
  documentcreate:any
  DocumentAddForm:FormGroup;
  // Documentlist:Array<documentListss>;
  fileList:Array<any>;
  attachments:Array<any>;
  isLoading=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  file:string;
  i:number;
  vendorId:number;
  documentButton=false;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  fileLabelText:any;
  images:any  []  =  [];
  // @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  // @ViewChild('docInput') docInput: any;
  // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  //BUG ID:7026
  @Input() deactivatebtnclk :boolean=true;  
  @Input() activatebtnclk :boolean=true;   
  //7026

  type: any;
  deactivateid: any;
  @ViewChild('closepopup') closepopup: ElementRef;



  constructor(private formBuilder: FormBuilder,private notification:NotificationService,
    private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router:Router,private atmaService:AtmaService,private shareService: ShareService
    ) {
      this.documentcreate = {"method": "get", "url": this.atmaUrl+  "mstserv/documentgroup_search","searchkey":"query",params:"","displaykey":"name","label":"DocGroup", required: true,
        formcontrolname: 'docgroup_id'
      }
     }

  ngOnInit(): void {
    
     let data: any = this.shareService.vendorView.value;
    this.vendorId = data.id;
    this.DocumentAddForm = this.formBuilder.group({
      partner_id: [''],
      docgroup_id: [''], 
      period: new FormControl('0'),
      remarks: [''],
      // id:['']    7026
      })
    this.DocumentAddForm.get('partner_id').setValue(this.vendorId);

    // Disable or enable based on vendorId value
    if (this.vendorId) {
    this.DocumentAddForm.get('partner_id').disable();
    } else {
    this.DocumentAddForm.get('partner_id').enable();
    }

    // let parentkeyvalue: String="";
    // this.getParent(parentkeyvalue);
    // this.DocumentAddForm.get('docgroup_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //       console.log('inside tap')
          
    //   }),

    //   switchMap(value => this.atmaService.get_parentScroll(value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.Documentlist = datas;
    //   console.log("Documentlist", datas)
    // })
    console.log('this.deactivatebuttonchildng===>',this.deactivatebtnclk)
    console.log('this.activatebuttonchildng===>',this.activatebtnclk)

 }
//  docgroupname(){
//   let parentkeyvalue: String="";
//   this.getParent(parentkeyvalue);
//   this.DocumentAddForm.get('docgroup_id').valueChanges
//   .pipe(
//     debounceTime(100),
//     distinctUntilChanged(),
//     tap(() => {
//       this.isLoading = true;
//         console.log('inside tap')
        
//     }),

//     switchMap(value => this.atmaService.get_parentScroll(value,1)
//       .pipe(
//         finalize(() => {
//           this.isLoading = false
//         }),
//       )
//     )
//   )
//   .subscribe((results: any[]) => {
//     let datas = results["data"];
//     this.Documentlist = datas;
//     console.log("Documentlist", datas)
//   })
//  }
createFormat() {
    let data = this.DocumentAddForm.controls;
    let objdocument = new document();
    objdocument.partner_id = data['partner_id']?.value;
    objdocument.docgroup_id = data['docgroup_id'].value?.id;
    //7026
    // if(this.activatebtnclk==false){
      // objdocument.docgroup_id = 14;
      // objdocument.id = data['id'].value;

    // }
    // if(this.deactivatebtnclk==false){
      // objdocument.docgroup_id = 13;
    // }
    objdocument.is_portal = -1
    objdocument.is_kvb = 'False'
    //7026
    objdocument.period = data['period'].value;
    // objdocument.remarks = data['remarks'].value;

    var str = data['remarks'].value
    var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
    objdocument.remarks = cleanStr_rmk

    return objdocument; 
    }
  submitForm() {
    // console.log('this.deactivatebutton===>',this.deactivatebtnclk)

    
    if(this.deactivatebtnclk!=false && this.activatebtnclk!=false){

    this.SpinnerService.show();
    console.log("Submitting:", this.docFunctionList);
    
      if (this.docFunctionList.length === 0) {
        this.toastr.error('Please Fill All Details');
        this.SpinnerService.hide();
        return false;
      }
    
      let formData = new FormData();
      let formattedData = [];

      // Process each document entry
      this.docFunctionList.forEach((item, index) => {
        let formattedItem = this.createFormat(); // Get structured object
    
        // Assign dynamically extracted values
        formattedItem.sno = index + 1; // Assign serial number
        formattedItem.docgroup_id = item.docgroup_id?.id ?? item.docgroup_id; // Handle `id`
        formattedItem.period = item.period ?? ""; // Ensure `period` is included
        formattedItem.remarks = item.remarks?.trim() || ""; // Ensure `remarks` is included
        formattedItem.file_key = `file${index + 1}`; // Assign file_key dynamically
    
        formattedData.push(formattedItem);
    
        // Append file if available
        if (item.filekey && item.filekey.length > 0) {
          formData.append(`file${index + 1}`, item.filekey[0]); // Match `file_key`
        }
      });
    
      // Append structured data
      formData.append('data', JSON.stringify(formattedData));

    // if (this.DocumentAddForm.value.docgroup_id.id==undefined||this.DocumentAddForm.value.docgroup_id.id<=0  ){
    //   this.toastr.error('Please Select DocumentGroup Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.DocumentAddForm.value.period ===""){
    //   this.toastr.error('Please Enter Period');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    
    // let createFormatvar = this.createFormat()
    this.atmaService.createDocumentForm(this.vendorId,formData)
    .subscribe(result => {
      console.log("result", result);
      //  if(result.id === undefined){
      //   this.notification.showError(result.description)
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // else{
      //   this.notification.showSuccess("Saved Successfully!...")
      //   this.SpinnerService.hide();
      //   this.onSubmit.emit();
      
      // }

      if (result.status === "success") {
        this.notification.showSuccess("Saved Successfully!...");
        this.SpinnerService.hide();
        this.onSubmit.emit();
        this.editIndex = null; // Reset edit index
        this.docFunctionList = []; // Clear list after success
      } else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }
  //BUG ID:7026
  else{
    this.SpinnerService.show();
    
    if(this.deactivatebtnclk == false){
      this.type = 2
    }
    if(this.activatebtnclk == false){
      this.type=1
    }
    
    this.atmaService.Deactivateclk(this.vendorId,this.createFormat(),this.images,this.type)
    .subscribe(result => {
      console.log("result", result);
      // this.deactivateid=result.id;
      this.DocumentAddForm.patchValue({
        id : result.id 
      })

        if(result.id === undefined){
        this.notification.showError(result.description)
        this.SpinnerService.hide();
        return false;
      }
      else{
        this.notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.onSubmit.emit();
      
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }
  }
  submit_active_deactiveForm() {
    // console.log('this.deactivatebutton===>',this.deactivatebtnclk)

    
    if(this.deactivatebtnclk!=false && this.activatebtnclk!=false){

    this.SpinnerService.show();
    console.log("Submitting:", this.docFunctionList);
    
      if (this.docFunctionList.length === 0) {
        this.toastr.error('Please Fill All Details');
        this.SpinnerService.hide();
        return false;
      }
    
      let formData = new FormData();
      let formattedData = [];

      // Process each document entry
      this.docFunctionList.forEach((item, index) => {
        let formattedItem = this.createFormat(); // Get structured object
    
        // Assign dynamically extracted values
        formattedItem.sno = index + 1; // Assign serial number
        formattedItem.docgroup_id = item.docgroup_id?.id ?? item.docgroup_id; // Handle `id`
        formattedItem.period = item.period ?? ""; // Ensure `period` is included
        formattedItem.remarks = item.remarks?.trim() || ""; // Ensure `remarks` is included
        formattedItem.file_key = `file${index + 1}`; // Assign file_key dynamically
    
        formattedData.push(formattedItem);
    
        // Append file if available
        if (item.filekey && item.filekey.length > 0) {
          formData.append(`file${index + 1}`, item.filekey[0]); // Match `file_key`
        }
      });
    
      // Append structured data
      formData.append('data', JSON.stringify(formattedData));

    // if (this.DocumentAddForm.value.docgroup_id.id==undefined||this.DocumentAddForm.value.docgroup_id.id<=0  ){
    //   this.toastr.error('Please Select DocumentGroup Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.DocumentAddForm.value.period ===""){
    //   this.toastr.error('Please Enter Period');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    
    // let createFormatvar = this.createFormat()
    this.atmaService.createDocumentForm(this.vendorId,formData)
    .subscribe(result => {
      console.log("result", result);
      //  if(result.id === undefined){
      //   this.notification.showError(result.description)
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // else{
      //   this.notification.showSuccess("Saved Successfully!...")
      //   this.SpinnerService.hide();
      //   this.onSubmit.emit();
      
      // }

      if (result.status === "success") {
        this.notification.showSuccess("Saved Successfully!...");
        this.SpinnerService.hide();
        this.onSubmit.emit();
        this.editIndex = null; // Reset edit index
        this.docFunctionList = []; // Clear list after success
      } else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }
  //BUG ID:7026
  else{
    this.SpinnerService.show();
    
    if(this.deactivatebtnclk == false){
      this.type = 2
    }
    if(this.activatebtnclk == false){
      this.type=1
    }
      this.type = this.deactivatebtnclk == false ? 2 : 1;

      let formData = new FormData();
      // let formattedData = [];

let formattedData: any = {}; // Now object, not array

this.docFunctionListactivedeactivecreate.forEach((item, index) => {
  formattedData.partner_id = item.partner_id ?? null;
  formattedData.docgroup_id = item.docgroup_id?.id ?? item.docgroup_id ?? null;
  formattedData.period = item.period ?? "";
  formattedData.remarks = item.remarks?.trim() || "";
  formattedData.file_name = [];

  if (item.filekey && item.filekey.length > 0) {
    let file = item.filekey[0];

    // You can customize the below generated filename logic
    let originalName = file.name;
    let genName = `vendor_${this.getTodayDate()}_${this.getCurrentTime()}${file.name}`;
    let fileId = item.id ?? null;

    formattedData.file_name.push({
      date: this.getTodayDate(), // Helper below
      file_name: originalName,
      gen_file_name: genName,
      // id: fileId,
    });

    // formData.append(`file${index + 1}`, file);
  }
});

// Final structured data
formData.append('data', JSON.stringify(formattedData));


  // formData.append('data', JSON.stringify(formData));
    this.atmaService.Deactivateclk(this.vendorId,this.createFormat(),this.images,this.type)
    .subscribe(result => {
      console.log("result", result);
      // this.deactivateid=result.id;
      this.DocumentAddForm.patchValue({
        id : result.id 
      })

        if(result.id === undefined){
        this.notification.showError(result.description)
        this.SpinnerService.hide();
        return false;
      }
      else{
        this.notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.onSubmit.emit();
      
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }
  }
  //BUG ID:7026
 
  // public displayFnparent(parenttype?: documentListss): string | undefined {
  //   //  console.log('id',parenttype.id);
  //   //  console.log('name',parenttype.name);
  //   return parenttype ? parenttype.name : undefined;
  // }
  
  // get parenttype() {
  //   return this.DocumentAddForm.get('docgroup_id');
  // }
  
  // private getParent(parentkeyvalue) {
  //   this.atmaService.getParentDropDown(parentkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Documentlist = datas;
  //       console.log("prnt", datas)
        
  //     })
  //  }
  
  // parentScroll() {
  //   setTimeout(() => {
  //   if (
  //   this.matdocAutocomplete &&
  //   this.matdocAutocomplete &&
  //   this.matdocAutocomplete.panel
  //   ) {
  //   fromEvent(this.matdocAutocomplete.panel.nativeElement, 'scroll')
  //   .pipe(
  //   map(x => this.matdocAutocomplete.panel.nativeElement.scrollTop),
  //   takeUntil(this.autocompleteTrigger.panelClosingActions)
  //   )
  //   .subscribe(x => {
  //   const scrollTop = this.matdocAutocomplete.panel.nativeElement.scrollTop;
  //   const scrollHeight = this.matdocAutocomplete.panel.nativeElement.scrollHeight;
  //   const elementHeight = this.matdocAutocomplete.panel.nativeElement.clientHeight;
  //   const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //   if (atBottom) {
  //   if (this.has_next === true) {
  //   this.atmaService.get_parentScroll(this.docInput.nativeElement.value, this.currentpage + 1)
  //   .subscribe((results: any[]) => {
  //   let datas = results["data"];
  //   let datapagination = results["pagination"];
  //   if (this.Documentlist.length >= 0) {
  //   this.Documentlist = this.Documentlist.concat(datas);
  //   this.has_next = datapagination.has_next;
  //   this.has_previous = datapagination.has_previous;
  //   this.currentpage = datapagination.index;
  //   }
  //   })
  //   }
  //   }
  //   });
  //   }
  //   });
  //   }

  getTodayDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

getCurrentTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}${mm}${ss}`;
}

    fileChange(event) {
      let imagesList = [];
      // for (var i = 0; i < event.target.files.length; i++) {
      //   this.images.push(event.target.files[i]);
      // }
      if (event.target.files.length > 0) {
        this.images = [event.target.files[0]]; // Allow only the first selected file
      }
      this.fileInput.nativeElement.value = '';
		imagesList.push(this.images);
		this.uploadList = [];
		imagesList.forEach((item) => {
			let s = item;
			s.forEach((it) => {
				let io = it.name;
        this.fileLabelText  = io
				this.uploadList.push(io);
			});
    });
      }
     
    deleteUpload(s, index) {
      this.uploadList.forEach((s, i) => {
        if (index === i) {
          this.uploadList.splice(index, 1)
          this.images.splice(index, 1);
        }
      })
    }
  onCancelClick() {
 
    this.onCancel.emit()


    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 45 || charCode >46)  && (charCode < 48 || charCode > 57) ){ 
      return false;
      }
      return true;
    }
  
    docFunctionList =[];
    docFunctionListactivedeactivecreate =[];
    editIndex: number | null = null; // Initialize edit index to null

    createaddDocument(){
      console.log("createaddDocument called images", this.images);
      // if (this.DocumentAddForm.value.partner_id.id==undefined||this.DocumentAddForm.value.docgroup_id.id<=0  ){
      //    this.toastr.error('Please Select DocumentGroup Name');
      //    this.SpinnerService.hide();
      //    return false;
      //  }
      //  if (this.DocumentAddForm.value.period ===""){
      //    this.toastr.error('Please Enter Period');
      //    this.SpinnerService.hide();
      //    return false;
      //  }
       if(this.images.length == 0){
         this.toastr.error('', 'Choose Upload Files ', { timeOut: 1500 });
         this.SpinnerService.hide();
         return false;
       }
    this.fileLabelText = "";
    let dataArray = this.DocumentAddForm.value
    let data ={
     partner_id: this.vendorId,
     docgroup_id: dataArray.docgroup_id,
     period: dataArray.period,
     remarks: dataArray.remarks,
     attachment: "",
     sno: this.docFunctionListactivedeactivecreate.length + 1,
     filekey: this.images,
    }
    
    // console.log("dataArray",data)
    // this.docFunctionList.push(data)
    // console.log("array",this.docFunctionList)  
    if (this.editIndex !== null) {
      // **Update the existing row instead of adding a new one**
      this.docFunctionListactivedeactivecreate[this.editIndex] = { ...data, sno: this.editIndex + 1 };
      this.toastr.success('Updated Successfully');
      this.editIndex = null; // Reset edit index

    } else {
      // **Add new document**
      this.docFunctionListactivedeactivecreate.push(data);
      this.toastr.success('Added Successfully');
      this.editIndex = null; // Reset edit index

    }
    
    // this.DocumentAddForm.controls["period"].reset('');
    this.DocumentAddForm.controls["remarks"].reset('');
    // this.DocumentAddForm.controls["docgroup_id"].reset('');
    this.images = [];
    this.fileInput.nativeElement.value = ""
     }
    addDocument(){
      if (this.DocumentAddForm.value.docgroup_id.id==undefined||this.DocumentAddForm.value.docgroup_id.id<=0  ){
         this.toastr.error('Please Select DocumentGroup Name');
         this.SpinnerService.hide();
         return false;
       }
       if (this.DocumentAddForm.value.period ===""){
         this.toastr.error('Please Enter Period');
         this.SpinnerService.hide();
         return false;
       }
       if(this.images.length == 0){
         this.toastr.error('', 'Choose Upload Files ', { timeOut: 1500 });
         this.SpinnerService.hide();
         return false;
       }
    this.fileLabelText = "";
    let dataArray = this.DocumentAddForm.value
    let data ={
     partner_id: this.vendorId,
     docgroup_id: dataArray.docgroup_id,
     period: dataArray.period,
     remarks: dataArray.remarks,
     attachment: "",
     sno: this.docFunctionList.length + 1,
     filekey: this.images,
    }
    
    // console.log("dataArray",data)
    // this.docFunctionList.push(data)
    // console.log("array",this.docFunctionList)  
    if (this.editIndex !== null) {
      // **Update the existing row instead of adding a new one**
      this.docFunctionList[this.editIndex] = { ...data, sno: this.editIndex + 1 };
      this.toastr.success('Updated Successfully');
      this.editIndex = null; // Reset edit index

    } else {
      // **Add new document**
      this.docFunctionList.push(data);
      this.toastr.success('Added Successfully');
      this.editIndex = null; // Reset edit index

    }
    
    this.DocumentAddForm.controls["period"].reset('');
    this.DocumentAddForm.controls["remarks"].reset('');
    this.DocumentAddForm.controls["docgroup_id"].reset('');
    this.images = [];
    this.fileInput.nativeElement.value = ""
     }

  ResetDoc(){
  this.DocumentAddForm.controls["period"].reset('');
  this.DocumentAddForm.controls["remarks"].reset('');
  this.DocumentAddForm.controls["docgroup_id"].reset('');
  this.editIndex = null;
  this.fileLabelText = ""
  // this.fileInput.nativeElement.value = ""
  //   this.selectedFiles = [];
  //   this.images = []; 
  }
  showimageHeaderPreviewPDF:boolean
  showimageHeaderPreview:boolean
  jpgUrls:any;
  pdfurl:any;
  closeimgModal(){
  this.showimageHeaderPreview = false;
  this.showimageHeaderPreviewPDF = false;
  }
  fileview(files) {
    console.log("file data to view ", files);
  
    let stringValue = files.type.toLowerCase(); // Get MIME type
    
    if (
      stringValue === "image/png" || stringValue === "image/jpeg" ||
      stringValue === "png" || stringValue === "jpeg" || 
      stringValue === "jpg" || stringValue === "JPG" || stringValue === "JPEG"
    ) {
      // Display Image Preview
      this.showimageHeaderPreview = true;
      this.showimageHeaderPreviewPDF = false;
  
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
        const newTab = window.open();
        newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
        newTab.document.close();
      }
    } 
    else if (stringValue === "application/pdf" || stringValue === "pdf") {
      // Display PDF Preview
      this.showimageHeaderPreview = false;
      this.showimageHeaderPreviewPDF = true;
  
      const reader = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    } 
    else if (
      stringValue === "text/csv" || stringValue === "application/vnd.oasis.opendocument.spreadsheet" ||
      stringValue === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // XLSX
      stringValue === "text/plain" || stringValue === "csv" || 
      stringValue === "ods" || stringValue === "xlsx" || stringValue === "txt"
    ) {
      // this.closepopup.nativeElement.click();
      // Download File
      this.downloadFile(files);
    }
  }
fileviewactivedeactive(files) {
  console.log("file data to view ", files);

  const stringValue = files.filekey?.split('.').pop()?.toLowerCase(); // get extension like "pdf", "jpg", etc.

    if (
      stringValue === "image/png" || stringValue === "image/jpeg" ||
      stringValue === "png" || stringValue === "jpeg" || 
      stringValue === "jpg" || stringValue === "JPG" || stringValue === "JPEG"
    ) {
      // Display Image Preview
      this.showimageHeaderPreview = true;
      this.showimageHeaderPreviewPDF = false;
  
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
        const newTab = window.open();
        newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
        newTab.document.close();
      }
    } 
    else if (stringValue === "application/pdf" || stringValue === "pdf") {
      // Display PDF Preview
      this.showimageHeaderPreview = false;
      this.showimageHeaderPreviewPDF = true;
  
      const reader = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    } 
    else if (
      stringValue === "text/csv" || stringValue === "application/vnd.oasis.opendocument.spreadsheet" ||
      stringValue === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // XLSX
      stringValue === "text/plain" || stringValue === "csv" || 
      stringValue === "ods" || stringValue === "xlsx" || stringValue === "txt"
    ) {
      // this.closepopup.nativeElement.click();
      // Download File
      this.downloadFile(files);
    }
}

  downloadFile(file) {
    const url = URL.createObjectURL(file);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = file.name; // Keeps the original file name
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

//     doccreate(docdata){
// this.DocumentAddForm.patchValue({
//   docgroup_id:docdata
// })
//     }

docListDelete(index: number) {
  if (window.confirm('Are you sure you want to delete this item?')) {
    this.docFunctionList.splice(index, 1);
    this.notification.showInfo('Deleted Successfully!');
 }
}
docListDeleteactivedeactive(index: number) {
  if (window.confirm('Are you sure you want to delete this item?')) {
    this.docFunctionListactivedeactivecreate.splice(index, 1);
    this.notification.showInfo('Deleted Successfully!');
 }
}

selectedFiles: any[] = [];
docListEdit(data,index: number) {
  const selectedDoc = this.docFunctionList[index];
  this.DocumentAddForm.controls["docgroup_id"].setValue(this.docFunctionList[index].docgroup_id);
  this.DocumentAddForm.controls["period"].setValue(this.docFunctionList[index].period);
  this.DocumentAddForm.controls["remarks"].setValue(this.docFunctionList[index].remarks);
  this.images = this.docFunctionList[index].filekey;
  this.fileLabelText = this.images.map(file => file.name).join(', ');
  // this.selectedFiles = selectedDoc.filekey || []; // Store the already uploaded files
  this.editIndex = index;  // Set current edit index

  // this.uploadList.push(this.docFunctionList[index].filekey[0].name);
}
docListEditactivedeactive(data,index: number) {
  const selectedDoc = this.docFunctionListactivedeactivecreate[index];
  // this.DocumentAddForm.controls["docgroup_id"].setValue(this.docFunctionList[index].docgroup_id);
  // this.DocumentAddForm.controls["period"].setValue(this.docFunctionList[index].period);
  this.DocumentAddForm.controls["remarks"].setValue(this.docFunctionListactivedeactivecreate[index].remarks);
  this.images = this.docFunctionListactivedeactivecreate[index].filekey;
  this.fileLabelText = this.images.map(file => file.name).join(', ');
  // this.selectedFiles = selectedDoc.filekey || []; // Store the already uploaded files
  this.editIndex = index;  // Set current edit index

  // this.uploadList.push(this.docFunctionList[index].filekey[0].name);
}

clearSelectedFiles() {
  this.selectedFiles = [];
  this.DocumentAddForm.get('images')?.reset();
}
SummaryApidocumentbulkcreateObjNew:any = {
  FeSummary: true,
  data: this.docFunctionList,
}
documentbulkcreate:any = [
  {
  columnname: 'DocumentGroup',
  key:"docgroup_id",type:"object",
  objkey:"name"
},
{
  columnname: 'Period',
  key:"period",
},
{
  columnname:"Remarks",
  key:"remarks",
},
{
  columnname:"File",
  key:"filekey", // for file array name need to pass in key
  function:true,
  array: true,
  objkey:"name",
  clickfunction:this.fileview.bind(this),
  style:{cursor:"pointer",color:"blue"},
},
{
  columnname:"Action",
  key:"edit",
  type:"button",
  button: true,
  icon:"edit",
  function:true,
  clickfunction:this.docListEdit.bind(this),
  style:{cursor:"pointer"},
},
{
  columnname:"",
  key:"delete",
  type:"button",
  button: true,
  function:true,
  icon:"delete",
  clickfunction:this.docListDelete.bind(this),
  style:{cursor:"pointer"},
}
]
SummaryApidocumentactivedeactivecreateObjNew:any = {
  FeSummary: true,
  data: this.docFunctionListactivedeactivecreate,
}
documentactivedeactivecreate:any = [
//   {
//   columnname: 'DocumentGroup',
//   key:"docgroup_id",type:"object",
//   objkey:"name"
// },
// {
//   columnname: 'Period',
//   key:"period",
// },
{
  columnname:"Remarks",
  key:"remarks",
},
{
  columnname:"File",
  key:"filekey",
  // type:"object",

  // function:true,
  array: true,
  objkey:"name",
  // clickfunction:this.fileviewactivedeactive.bind(this),
  // style:{cursor:"pointer",color:"blue"},
},
// {
//   columnname:"Action",
//   key:"edit",
//   type:"button",
//   button: true,
//   icon:"edit",
//   function:true,
//   clickfunction:this.docListEditactivedeactive.bind(this),
//   style:{cursor:"pointer"},
// },
{
  columnname:"Action",
  key:"delete",
  type:"button",
  button: true,
  function:true,
  icon:"delete",
  clickfunction:this.docListDeleteactivedeactive.bind(this),
  style:{cursor:"pointer"},
}
]

 }
class document {
  partner_id: number;
  docgroup_id: any;
  period: any;
  remarks: any;
  is_portal :any;
  is_kvb : 'False'
  file_key: string;
  sno: number;
  // id: any; 7026
  
}