import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup ,} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete/autocomplete';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { fromEvent } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';



export interface rmu {
  name: string;
  code: string;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-acacknowledgement',
  templateUrl: './acacknowledgement.component.html',
  styleUrls: ['./acacknowledgement.component.scss'],
  providers:[{ provide: DateAdapter, useClass: PickDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
          DatePipe],
})
export class AcacknowledgementComponent implements OnInit {
   @ViewChild(MatAutocompleteTrigger)autocompleteTrigger: MatAutocompleteTrigger;
   ///vendor dd
  @ViewChild("vendor_input") vendor_input: any;
   @ViewChild("vendor_auto") vendor_auto: MatAutocomplete;

   ///box name
@ViewChild("box_name_input") box_name_input: any;
@ViewChild('box_name_auto') box_name_auto:MatAutocomplete

//popup
@ViewChild("closebutton")closebutton;

  vendorlist: any;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  summarylist: any;
  chechbox_id: any= [];
  selectedData: any=[];
  checkbox_select: boolean;
  sumary_id: any=[];
  ischeckedall: boolean;
  checked: boolean;
  selectedCount: any;
  checkAllTrades: any;
  ischecked: any;
  isloading: boolean;
  box_name_DownData: any;
  box_name_pagination: { prev: any; next: any; index: any; };
  archivalmasterForm: any;
  BarCodepagination: any;
  status_listed: { name: string; id: number; }[];
  file_info: any;
  summary_id: any;
  hole_select: boolean;
  currentSelectedFile: any;
  selectedFiles: any;
  filesrc: string| Blob = 'path-to-your-pdf-file.pdf';
  pdfshow: boolean = false;
  imgshow: boolean = false;
  file_gen_name: any;
  product_name: any;
  pdfsrc: any;
  constructor(private errorHandler: ErrorHandlingServiceService,private datePipe:DatePipe,private rmuservice:RmuApiServiceService,private fb:FormBuilder,private notification: NotificationService, private SpinnerService: NgxSpinnerService) { }
  summaryform:FormGroup;
  ngOnInit(): void {
    this.summaryform=this.fb.group({
      archival_date:[''],
      vendor:[''],
      status_name:[],
      box_names:[],
      file_fas_upload:[],
      cr_no:['']
    })
    this.getsummary()
  }

  ////summary

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getsummary()
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getsummary()
  }

  getsummary() {
    let from_date=this.datePipe.transform(this.summaryform.value.archival_date, 'yyyy-MM-dd')
    let  fromdate=from_date?from_date:""
    let vendor=this.summaryform.value.vendor?.id??""
    let archival_status=this.summaryform.value.status_name?.id??""
    let box_name=this.summaryform.value.box_names?.id??""
    let cr_no = this.summaryform.value.cr_no?this.summaryform.value.cr_no:""
    this.SpinnerService.show()
    this.rmuservice.get_archival_master_summary(cr_no,fromdate,vendor,archival_status,box_name,2,this.pagination.index).subscribe(results => {
      if (!results) {
        this.SpinnerService.hide()
        return false
      }
      this.SpinnerService.hide()
      this.summarylist = results['data'];
      this.summarylist=this.summarylist.map(even=>{
        return {...even,disable:false}
      })
      this.pagination = results.pagination ? results.pagination : this.pagination;
    }, error => {
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    console.error(error);
  }); 
  }

  ///clear function
  summaryform_reset(){
    this.summaryform.reset()
    this.getsummary()
    this.selectedFile=''
  }

////vendor dd  
public vendor_display(vendor_name?: rmu): string | undefined {
    return vendor_name ? vendor_name.name : undefined;
  }

  getvendorValue(value) {   
    this.rmuservice.vendor_summary(value,'', 1).subscribe(data => {
      this.vendorlist = data['data'];
      console.log("this",this.vendorlist)
    }, error => {
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    console.error(error);
  }); 
  }

  has_vendor_next:boolean=true;
has_vendor_previous:boolean=true;
current_vendor_page=1
vendor_Scroll() {
    setTimeout(() => {
      if (
        this.vendor_auto &&
        this.autocompleteTrigger &&
        this.vendor_auto.panel
      ) {
        fromEvent(this.vendor_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.vendor_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.vendor_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.vendor_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.vendor_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_vendor_next === true) {
                this.rmuservice.vendor_summary(this.vendor_input.nativeElement.value,'',this.current_vendor_page + 1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.vendorlist =this.vendorlist.concat(datas);
                    if (this.vendorlist.length >= 0) {
                      this.has_vendor_next = datapagination.has_next;
                      this.has_vendor_previous = datapagination.has_previous;
                      this.current_vendor_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  ////check box
  singleCheckbox(event, value) {
    this.checkbox_select = true;
    console.log("values", value);
  
    if (event.checked === true) {
      this.ischecked = true;
      if (!this.chechbox_id.includes(value.id)) {
        this.chechbox_id.push(value.id); 
        this.selectedData.push(value); 
      }
  
      if (this.ischecked && this.checkAllTrades) {
        event.checked = true;
      }
    }
  
    if (event.checked === false) {
      const indexToRemoveChecker = this.chechbox_id.indexOf(value.id);
      
      if (indexToRemoveChecker !== -1) {
        this.chechbox_id.splice(indexToRemoveChecker, 1); 
        const indexToRemoveData = this.selectedData.findIndex(item => item.id === value.id);
        if (indexToRemoveData !== -1) {
          this.selectedData.splice(indexToRemoveData, 1);  
        }
        console.log("Removed from checker:", this.chechbox_id);
      }
      this.selectedFiles=''
      this.summaryform.get('file_fas_upload').reset()
    this.hole_select=true
    }
  
    if (this.chechbox_id.length === 0) {
      this.checkbox_select = false;
    }
  
    console.log("this.chechbox_id", this.chechbox_id);
    console.log("Selected Data:", this.selectedData);
  }
  
  toggleCheckboxAll(event){  
    this.checked = event.checked;
    this.selectedCount =
    this.summarylist.forEach(item => item.checked = this.checked);
    console.log("checked",this.checked)
  
  if(event.checked === true){
    this.checkbox_select=true;
    this.ischeckedall=true
    // for(let sumdata of this.summarylist){
     this.summarylist.map((item) => {
      let All_data= item
      console.log("All_data",All_data)
      this.sumary_id.push(item?.id)
      console.log("this.sumary_id",this.sumary_id)
    })
    // }
    this.chechbox_id=this.sumary_id
    console.log("this.chechbox_id=this.sumary_id",this.chechbox_id)
  }else{
    this.checkbox_select=false;
    this.chechbox_id=[]
    this.sumary_id=[]
      this.ischeckedall=false;
      this.selectedFiles=''
      this.summaryform.get('file_fas_upload').reset()
  }
  }
  selectedFile: any;

  ack_file_data(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file: File = input.files[0];
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // Type + extension check
  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension!)) {
    this.notification.showError('❌ Only PDF, JPG, JPEG, PNG files are allowed.');
    this.resetFileInput(input);
    return;
  }

  // Size check (optional, here 5 MB max)
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    this.notification.showError(`❌ File size should not exceed ${maxSizeMB} MB.`);
    this.resetFileInput(input);
    return;
  }

  // ✅ Valid file
  this.selectedFiles = file;
  this.summaryform.get('file_fas_upload')?.setValue(file);
  console.log('Selected file:', file);
}

private resetFileInput(input: HTMLInputElement): void {
  this.selectedFile = null;
  this.summaryform.get('file_fas_upload')?.reset();
  input.value = '';
}


  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFiles = input.files[0];
  //     console.log('Selected file:', this.selectedFiles);
  //   } else {
  //     this.selectedFiles ='';
  //   }
  // }
  ack_files_data(event: Event, summary: any): void {       
  this.hole_select = false;

  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file: File = input.files[0];
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension!)) {
    this.notification.showError(' Only PDF, JPG, JPEG, PNG files are allowed.');
    this.resetFilesInput(input, summary);
    return;
  }
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    this.notification.showError(` File size should not exceed ${maxSizeMB} MB.`);
    this.resetFilesInput(input, summary);
    return;
  }
  summary.selectedFile = file;
  this.selectedFile = file;
  this.summary_id = summary?.id;
  this.summarylist = this.summarylist.map((item) => {
    return { ...item, checked: false };
  });
  for(let i of this.summarylist){
    if(summary?.box_number==i?.box_number){
      i.disable=false
    }
    else{
      i.disable=true
    }
  }

  console.log("this.summarylist", this.summarylist);
}

private resetFilesInput(input: HTMLInputElement, summary: any): void {
  summary.selectedFile = null;
  this.selectedFile = null;
  input.value = '';
}

//   ack_files_data(event: Event, summary: any): void {       
//    this.hole_select=false
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//         summary.selectedFile = input.files[0]; 
//         this.selectedFile=input.files[0]; 
//         this.summary_id=summary?.id
//     }
//     this.summarylist = this.summarylist.map((item) => {
//       if (item.selectedFile) {
//         this.hole_select===false
//         return { ...item, checked: false };        
//       } else {
//         this.hole_select===false
//         return { ...item, checked: false };
//       }
//     });
//     console.log("this.summarylist",this.summarylist)
// }
removeFile(summary: any): void {
  this.hole_select=true
    summary.selectedFile = null;
    this.selectedFile ='';
    this.summary_id=''
    for(let i of this.summarylist){
      i.disable=false
    }
}

  submit(file){
    let files_data
    let check_box
    if(!this.summary_id){
    if(this.chechbox_id==="" || this.chechbox_id.length===0){
      this.notification.showError("Please Select Data")
      return false
    }
    if(this.summaryform.value.file_fas_upload=='' || this.summaryform.value.file_fas_upload== undefined || this.summaryform.value.file_fas_upload == null){
      this.notification.showWarning('Please Choose The File');
      return false;
    }
check_box=this.chechbox_id
   files_data=this.selectedFiles
  }else{
    files_data=this.selectedFile
    check_box=[this.summary_id]
  }

  console.log("thischeckbox",this.chechbox_id)  
  this.SpinnerService.show()
    this.rmuservice.file_upload(files_data,check_box,5).subscribe(result=>{

      this.SpinnerService.hide()
      if(result.status==="success"){
        this.notification.showSuccess(result?.message)
        this.summaryform.get('file_fas_upload').reset()       
        this.selectedFiles=''
        this.selectedFile ='';
        this.ischeckedall=false;
        this.checkbox_select=false;
        this.hole_select=true;
        this.chechbox_id=[]
        this.getsummary()
      }else{
        this.notification.showError(result?.message)
      }
    }, error => {
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    console.error(error);
  }); 
    

  }

  ///file view
  master_view_data(summary){
this.file_gen_name=summary?.upload_data?.gen_file_name
  this.product_name=summary?.product_data.name
    let file = summary?.upload_data?.gen_file_name
    if(!summary?.upload_data?.gen_file_name){
      this.notification.showError("File Not Found")
      return false
    }
    this.productpopupopen()
    this.SpinnerService.show()
    this.rmuservice.getfileview(file).subscribe(result=>{
      console.log("smnbfjhfdbgn",result)
      this.SpinnerService.hide()
      const fileType = result.type;
      let reader = new FileReader();
          reader.onload = (e: any) => {              
              if (fileType === 'application/pdf') {
                this.pdfshow = true;
                this.imgshow = false;
                this.pdfsrc = e.target.result;
            } else if (fileType.startsWith('image')) {
                this.pdfshow = false;
                this.imgshow = true;
                this.filesrc = e.target.result;
            } else {
                console.error('Unsupported file format:', fileType);
            }
        };
          reader.readAsDataURL(result);         
        }, error => {
          this.SpinnerService.hide()
          this.errorHandler.handleError(error);
        console.error(error);
      });
  }

////download
  onDownload(){
    this.rmuservice.getfileview(this.file_gen_name).subscribe(results => { 
      const fileExtension = this.file_gen_name.split('.').pop()?.toLowerCase();
      let mimeType = '';
  
      switch (fileExtension) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        default:
          console.error('Unsupported file type');
          return;
      }
      const downloadUrl = window.URL.createObjectURL(new Blob([results], { type: mimeType }));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.file_gen_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
    (error) => {
      console.error('Error downloading the file:', error);
    }
  );
  }

  ///popupview
  productpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("viewDownload"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedpopup() {
    this.closebutton.nativeElement.click();
    
  }

  


  ////box dd
  box_name(name,page=1){
    this.isloading=true
    this.rmuservice.BoxNameDropDown(name,page).subscribe(result=>{
      this.isloading=false
      this.box_name_DownData=result['data']
      this.box_name_pagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.isloading=false
  })
  }

  box_name_Scroll() {
    setTimeout(() => {
      if (
        this.box_name_auto &&
        this.autocompleteTrigger &&
        this.box_name_auto.panel
      ) {
        fromEvent(this.box_name_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.box_name_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.box_name_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.box_name_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.box_name_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.box_name_pagination.next === true) {
                this.rmuservice.BoxNameDropDown(this.archivalmasterForm.get('box_names').value?this.archivalmasterForm.get('box_names').value:'',this.BarCodepagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.box_name_DownData=this.box_name_DownData.concat(result['data'])
                  this.box_name_pagination={
                    prev:result['pagination'].has_previous,
                    next:result['pagination'].has_next,
                    index:result['pagination'].index
                  }
                  });
              }
            }
          });
      }
    });
  }

  ///status dd
  status_ddown(){
    this.status_listed=[
      // {"name":'Un Occupied',id:1},
      // {"name":'Ready For Dispatch',id:1},
      {"name":'Archived',id:3},
      {"name":'Acknowledgement Received',id:5}
    ]
  }
  
  // zoomIn(event: MouseEvent) {
  //   const img = event.target as HTMLImageElement;
  //   img.style.transform = 'scale(1.5)';
  // }
  
  // zoomOut(event: MouseEvent) {
  //   const img = event.target as HTMLImageElement;
  //   img.style.transform = 'scale(1)';
  // }

//   zoomLevel: number = 1; // Initial zoom level

// zoomIn() {
//   if (this.zoomLevel < 3) {  // Limit the zoom level
//     this.zoomLevel += 0.1;
//   }
// }

// zoomOut() {
//   if (this.zoomLevel > 1) {  // Prevent shrinking below original size
//     this.zoomLevel -= 0.1;
//   }
// }


zoomLevel: number = 1; 
zooming: boolean = false;

toggleZoom() {
  this.zooming = !this.zooming;
  this.zoomLevel = this.zooming ? 2 : 1;  
}
zoomImage(event: MouseEvent) {
  if (!this.zooming) return;

  const image = event.target as HTMLImageElement;
  const { offsetX, offsetY } = event;
  const { width, height } = image;

  const scaleX = (offsetX / width) * 100;
  const scaleY = (offsetY / height) * 100; 

  image.style.transformOrigin = `${scaleX}% ${scaleY}%`; 
}


  

}
