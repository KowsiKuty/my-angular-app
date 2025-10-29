import { Component, OnInit, ViewChild, Output, EventEmitter,  } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators,} from '@angular/forms';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { BreApiServiceService } from '../bre-api-service.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../error-handling-service.service';
import { BreShareServiceService } from '../bre-share-service.service';
import { environment } from 'src/environments/environment';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';


export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface approverListss {
  id: string;
  name: string;
  code : string
  limit: number;
  employee_id : any;
  designation :string;
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
  selector: 'app-claim-maker',
  templateUrl: './claim-maker.component.html',
  styleUrls: ['./claim-maker.component.scss'],
  providers:[  
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
    ]
})
export class ClaimMakerComponent implements OnInit {

  bretoEcfviewForm : FormGroup
  invHdrForm : FormGroup
  claimMakerSubmitForm : FormGroup
  bretoEcfID : any
  bretoECFData : any
  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;  
  @ViewChild('brInput') brInput:any;
  brList : Array<branchListss>
  isLoading:boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  approverList: Array<approverListss>;
  currentpageapp:any=1
  has_nextapp:boolean=true
  has_previousapp:boolean=true
  @ViewChild('appInput') appInput:any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;
  exptypeCommodity : any
  createdbyid: any
  filedata =[]
  tomorrow = new Date();
  viewOrEdit : string

  constructor(private fb: FormBuilder, private toastr:ToastrService, private errorHandler: ErrorHandlingService,
     public datePipe: DatePipe, private shareservice : BreShareServiceService,private breapiservice:BreApiServiceService,
     private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {const getToken = localStorage.getItem("sessionData")
  let tokendata = JSON.parse(getToken)

  this.createdbyid = tokendata.employee_id
    this.bretoEcfID = this.shareservice.bretoecfid.value
    this.viewOrEdit = this.shareservice.bretoecfViewOrEdit.value
    this.bretoEcfviewForm = this.fb.group({
      branch: [''],
      supplier: [''],
      commodity: [''],
      rsrbranch: [''],
      
    })

    this.invHdrForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
    })

    this.claimMakerSubmitForm = this.fb.group({
      remark: [''],
      branch_id: [''],
      approved_by: [''],
    })


   this.breapiservice.bretoEcfFetch(this.bretoEcfID).subscribe((results) => {
    if(results.code == undefined)
    {
      this.bretoECFData = results
      console.log("this.bretoECFData----",this.bretoECFData)
      this.filedata =this.bretoECFData?.file?.data
      this.invHdrForm.get('invoiceno').setValue('');
      this.invHdrForm.get('invoicedate').setValue('');
      this.exptypeCommodity = this.bretoECFData?.commodity_id?.id
    }               
  })
  }
  

claimMakerSubmit()
{

  if(this.claimMakerSubmitForm.value.approved_by?.id == undefined || this.claimMakerSubmitForm.value.approved_by?.id == null || this.claimMakerSubmitForm.value.approved_by?.id == '')
  {
    this.toastr.error("Please Choose Approver")
    return false
  }
  let data =[{
    "id":this.bretoEcfID,
    "remark":this.claimMakerSubmitForm.value.remark,
    "file_key": this.filearr.length > 0 ? this.filenames : undefined,
    "invoiceno":this.invHdrForm.value.invoiceno,
    "invoicedate": this.invHdrForm.value.invoicedate == "" ? "" : this.datePipe.transform(this.invHdrForm.value.invoicedate, 'yyyy-MM-dd'),
    "approved_by": this.claimMakerSubmitForm.value.approved_by?.id,
    "particulars":this.bretoECFData?.particulars??'',

   }]
  this.formData.append("data",JSON.stringify(data));

   this.breapiservice.claimMakerCreate(this.formData).subscribe((results) => {
    if(results[0].status == "success"){
                this.toastr.success(results[0].message,results[0].status)  
                this.formData = new FormData();
                this.onCancel.emit()
      }
      else
      {
        this.toastr.error(results.description,results.code) 
        this.formData = new FormData();
    }
})
}
formData: FormData = new FormData();
filenames=[]
filearr =[]
uploaddata(event:any){
  debugger
  this.formData = new FormData();
  // this.filearr =[]
  this.filenames=[]

  console.log(event.target.files.length);
  for(let i=0;i<event.target.files.length;i++)
  {
    this.formData.append('file_'+(i+1),event.target.files[i])
    this.filearr.push(event.target.files[i]);
    this.filenames.push("file_"+(i+1))
  } 
} 
  getfiles(data) {
    this.SpinnerService.show()
    this.breapiservice.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }




back()
{
  this.onCancel.emit()
}


tokenValues: any
showimageHeaderAPI: boolean
showimagepdf: boolean
pdfurl: any
jpgUrlsAPI: any
imageUrl = environment.apiURL
showimageHeaderPreview: boolean = false
showimageHeaderPreviewPDF: boolean = false
jpgUrls: any

data1(datas) {
   
  this.showimageHeaderAPI = false
  this.showimagepdf = false
  let id = datas?.file_id
  let filename = datas?.file_name
  // this.ecfservice.downloadfile(id)




  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  this.tokenValues = token
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = filename.split('.')
 
  
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG" || stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  this.jpgUrlsAPI = window.open(this.imageUrl + "breserv/bretoecf_file/" + id + "?token=" + token, '_blank');
  }

  // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  // stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

  //     // this.showimageHeaderAPI = true
  //     // this.showimagepdf = false
     
     
  //   }
  //   if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  //     // this.showimagepdf = true
  //     // this.showimageHeaderAPI = false
  //     this.ecfservice.downloadfile1(id)
  //       // .subscribe((data) => {
  //       //   let dataType = data.type;
  //       //   let binaryData = [];
  //       //   binaryData.push(data);
  //       //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
  //       //   window.open(downloadLink, "_blank");
  //       // }, (error) => {
  //       //   this.errorHandler.handleError(error);
  //       //   this.showimagepdf = false
  //       //   this.showimageHeaderAPI = false
  //       //   this.SpinnerService.hide();
  //       // })
  //   }
  //   if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
  //   stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
  //     // this.showimagepdf = false
  //     // this.showimageHeaderAPI = false
  //   }  

    }
    
 filepreview(files) {
  let stringValue = files.file_name.split('.')
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
    // this.showimageHeaderPreview = true
    // this.showimageHeaderPreviewPDF = false
    const reader: any = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
    this.jpgUrls = reader.result
    const newTab = window.open();
    newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
    newTab.document.close();
    }
  }
  // if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
  //   // this.showimageHeaderPreview = false
  //   // this.showimageHeaderPreviewPDF = true
  //   const reader: any = new FileReader();
  //   reader.readAsDataURL(files);
  //   reader.onload = (_event) => {
  //   this.pdfurl = reader.result
  //   const link = document.createElement('a');
  //   link.href = this.pdfurl;
  //   link.target = '_blank'; // Open in a new tab
  //   link.click();
  //   }
  // }

  if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
    const reader: any = new FileReader();
    reader.onload = (_event) => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    reader.readAsArrayBuffer(files);
  }
  if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
    stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
  }
}

fileback() {
  this.closedbuttons.nativeElement.click();
}

viewtrnlist:any=[];
viewtrn()
{
  this.SpinnerService.show()
  this.breapiservice.getBretoEcfViewTrans(this.bretoEcfID).subscribe(data=>{
    this.SpinnerService.hide()
    this.viewtrnlist=data['data'];
  })
}
name:any;
branch:any;
desig: any
view(dt){
  this.name=dt?.emp?.name
  this.branch=dt?.emp_branch?.name
  this.desig=dt?.emp?.designation
 }


 getBranches(keyvalue) 
 {
    
  this.breapiservice.branchget(keyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.brList = datas;
    })
  }
    getbranchname(){
      let keyvalue: String = "";  
      this.getBranches(keyvalue) 
      this.claimMakerSubmitForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.breapiservice.branchget(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.brList = datas;
  
      })
  
    }
   

branchScroll() {
  setTimeout(() => {
    if (
      this.branchmatAuto &&
      this.branchmatAuto &&
      this.branchmatAuto.panel
    ) {
      fromEvent(this.branchmatAuto.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.branchmatAuto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.branchmatAuto.panel.nativeElement.scrollTop;
          const scrollHeight = this.branchmatAuto.panel.nativeElement.scrollHeight;
          const elementHeight = this.branchmatAuto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.breapiservice.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.brList.length >= 0) {
                    this.brList = this.brList.concat(datas);
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

 public displayFnBranch(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.code + " - " + branchtype.name : undefined;
  } 

  approvername() {
   let appkeyvalue: String = "";
   this.getapprover(appkeyvalue);
   let branch_id = this.claimMakerSubmitForm.controls['branch_id'].value?.id ? this.claimMakerSubmitForm.controls['branch_id'].value?.id : ""
 
   this.claimMakerSubmitForm.get('approved_by').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
         console.log('inside tap')
 
       }),
       switchMap(value => this.breapiservice.getECFapproverscroll(1,this.exptypeCommodity,this.createdbyid,branch_id,value)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.approverList = datas;
 
     })
 
 }

 private getapprover(appkeyvalue) {
   let branch_id = this.claimMakerSubmitForm.controls['branch_id'].value?.id ? this.claimMakerSubmitForm.controls['branch_id'].value?.id : ""
  
   this.breapiservice.getECFapproverscroll(1,this.exptypeCommodity,this.createdbyid,branch_id,appkeyvalue)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       let datapagination = results["pagination"];
       this.approverList = datas;
       if (this.approverList.length >= 0) {
        this.has_nextapp = datapagination.has_next;
        this.has_previousapp = datapagination.has_previous;
        this.currentpageapp = datapagination.index;
      }
     })
 }
 
 public displayFnApprover(approver?: approverListss): string | undefined {
  return approver ?  approver.name + ' - ' + approver.code +' - ' +approver.limit + ' - '+ approver.designation : undefined;
 }

 get approver() {
   return this.claimMakerSubmitForm.get('approved_by');
 }

 autocompleteapproverScroll() {
   let branch_id = this.claimMakerSubmitForm.controls['branch_id'].value?.id ? this.claimMakerSubmitForm.controls['branch_id'].value?.id : ""
 
   setTimeout(() => {
     if (
       this.matappAutocomplete &&
       this.autocompleteTrigger &&
       this.matappAutocomplete.panel
     ) {
       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
         .pipe(
           map(() => this.matappAutocomplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(()=> {
           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextapp === true) {
               this.breapiservice.getECFapproverscroll( this.currentpageapp + 1,this.exptypeCommodity,this.createdbyid,branch_id,this.appInput.nativeElement.value)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   this.approverList = this.approverList.concat(datas);
                   if (this.approverList.length >= 0) {
                     this.has_nextapp = datapagination.has_next;
                     this.has_previousapp = datapagination.has_previous;
                     this.currentpageapp = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
 }
 view_filess(datas) {
   
  this.showimageHeaderAPI = false
  this.showimagepdf = false
  let id = datas?.file_id
  let filename = datas?.name
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  this.tokenValues = token
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = filename.split('.')
 
  
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG" || stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  this.jpgUrlsAPI = window.open(this.imageUrl + "breserv/bretoecf_file/" + id + "?token=" + token, '_blank');
  }
    }

    onDateChange(event: any) {
      let ecfdate = this.invHdrForm?.value?.invoicedate; 
      ecfdate = this.datePipe.transform(ecfdate, 'dd-MMM-yyyy')?.toUpperCase();// Convert ecfdate to a Date object
      // const selectedDate = new Date(event.value); // Set the selected date
    
      // const sixMonthsAgo = new Date(ecfdate.getFullYear(), ecfdate.getMonth() - 6, ecfdate.getDate()); // Calculate the date six months before ecfdate
    
      // // Set the time values to zero (optional if you want to compare dates only)
      // selectedDate.setHours(0, 0, 0, 0);
      // sixMonthsAgo.setHours(0, 0, 0, 0);
    
      // if (selectedDate < sixMonthsAgo) {
      //   alert('Invoice Date is greater than six months');
      // }
    }
    Reject()
{
  let rem = this.claimMakerSubmitForm.value.remark
  if(rem == undefined || rem == null || rem == "")
  {
    this.toastr.error("Please Enter Remarks")
    return false
  }

  let data ={
    "id":this.bretoEcfID,
    "remark":rem,
   }
  
   this.breapiservice.bretoEcfReject(data).subscribe((results) => {
    if(results.status == "success"){
                this.toastr.success(results.message,results.status)  
               this.back()
      }
      else
      {
       this.toastr.error(results.description,results.code)   
        this.back()   
    }
})
}
}

