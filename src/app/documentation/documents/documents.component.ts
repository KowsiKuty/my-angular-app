import { Component, OnInit,ViewChild,ElementRef,Injectable } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, takeUntil, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DocumentationService } from '../documentation.service'
import { NotificationService } from 'src/app/service/notification.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from 'ngx-spinner';



export interface employeee {
  id: string;
  full_name: string;
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

@Injectable()
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
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class DocumentsComponent implements OnInit {

  docList: any;
  doctviewlist:any;
  urls: string;
  urlSGdoc;
  isSG:boolean
  isSGTab: boolean
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;
  isLOSTab : boolean;
  urlLOSdoc;
  isLOS:boolean;
  urlDocUpload;
  isDocUpload: boolean;
  isDocUploadTab: boolean;
  urlDocView;
  isDocView: boolean;
  isDocViewTab: boolean;
  @ViewChild('fileInputs', { static: false }) InputVars: ElementRef;
  @ViewChild('mod') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('modInput') modInput: any;
  @ViewChild('empInput') empInput:any;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;

  documentForm: FormGroup;
  documentSearchForm: FormGroup;
  documentviewsearchForm: FormGroup;
  moduleList: Array<any>;
  doctlist:any;
  currentpage: number = 1;
  presentpagedoc: number = 1;
  pagesize = 10;
  has_nextdoc = true;
  has_previousdoc = true;
  isdocList:boolean;
  uplimages:any [] = [];
  uploadLists = [];
  presentpagedocview: number = 1;
  has_nextdocview = true;
  has_previousdocview = true;
  isdocviewList:boolean;
  employeeList:any
  isLoading=false;
  currentpageemp:any=1
  has_nextemp:boolean=true
  has_previousemp:boolean=true
  disableupload:boolean = false
 



  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,private dataService: DocumentationService,
    private notify:NotificationService,private datePipe:DatePipe,private errorHandler:ErrorHandlingService,
    private spinner:NgxSpinnerService) {
  }

  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Documentation") {
        this.docList = subModule;
        // this.isSGTab = subModule[0].name;
        // console.log("doc menu list", this.docList)
      }
    })

    this.documentSearchForm = this.fb.group({
      remarks : [''],
      fromdate : [''],
      todate : [''],
      created_by : ['']
    })
    this.documentviewsearchForm = this.fb.group({
      remarks : [''],
      fromdate : [''],
      todate : [''],
      created_by : ['']
    })

    this.documentForm = this.fb.group({
      remarks:[''],
      file_data:new FormArray([]),
    })
    // this.getModule();
   
  }

  
  getModule() {
    this.dataService.getModulesList()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduleList = datas;
        // console.log("modlist", this.moduleList)
      })
  }

  employeename() {
    let employeekeyvalue: String = "";
    this.getemployee(employeekeyvalue);
  
    this.documentSearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.dataService.getEmployeeFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
  
      })
  
  }

  employeeViewname() {
    let employeekeyvalue: String = "";
    this.getemployee(employeekeyvalue);
  
    this.documentviewsearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.dataService.getEmployeeFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
  
      })
  
  }
  
  
  private getemployee(employeekeyvalue) {
    this.dataService.getEmployeeFilter(employeekeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }
  
  public displayFnEmployee(employee?: employeee): string | undefined {
    return employee ? employee.full_name : undefined;
  }

  get employee() {
    return this.documentSearchForm.get('created_by');
  }

  public displayFnEmployeeView(employeeview?: employeee): string | undefined {
    return employeeview ? employeeview.full_name : undefined;
  }

  get employeeview() {
    return this.documentviewsearchForm.get('created_by');
  }


  autocompleteemployeeScroll() {
     
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextemp === true) {
                this.dataService.getEmployeeFilter(this.empInput.nativeElement.value, this.currentpageemp + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_nextemp = datapagination.has_next;
                      this.has_previousemp = datapagination.has_previous;
                      this.currentpageemp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }




 





  subModuleData(data) {
    this.urls = data.url;
    this.urlSGdoc = "/sg_usermanual";
    this.urlLOSdoc = "/dtpc_usermanual";
    this.urlDocUpload = "/docupload";
    this.urlDocView = "/docview";

    this.isSG = this.urlSGdoc === this.urls ? true : false;
    this.isLOS = this.urlLOSdoc === this.urls?true:false;
    this.isDocUpload = this.urlDocUpload === this.urls?true:false;
    this.isDocView = this.urlDocView === this.urls?true:false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isSG) {
      this.isSGTab = true
      this.isLOSTab = false
      this.isDocUploadTab = false 
      this.isDocViewTab = false

    }
    if (this.isLOS) {
      this.isLOSTab = true
      this.isSGTab = false
      this.isDocUploadTab = false
      this.isDocViewTab = false

    }

    if (this.isDocUpload) {
      this.isLOSTab = false
      this.isSGTab = false
      this.isDocUploadTab = true
      this.isDocViewTab = false
      this.uploadsearch(1)

    }

    if (this.isDocView) {
      this.isLOSTab = false
      this.isSGTab = false
      this.isDocUploadTab = false
      this.isDocViewTab = true
      this.uploadviewsearch(1)

    }


  }


  downloadSGuserManual(){
    this.dataService.getpdfSG()
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Security Guard User Manual' + ".pdf";
        link.click();
      })
  }

  downloadLOSuserManual(){
    this.dataService.getpdflos()
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS User Manual' + ".pdf";
        link.click();
      })
  }

 
  fileupload(event){
    let imagesLists = [];
    for (var i = 0; i < event?.target?.files?.length; i++) {
      if(event?.target?.files?.length > 1){
        this.notify.showError("Please Upload Only One File");
        this.InputVars.nativeElement.value = '';
        return false
      }
      this.uplimages.push(event?.target?.files[i]);
      this.documentForm?.value?.file_data.push(event?.target?.files[i])
      
    }
    this.InputVars.nativeElement.value = '';
    imagesLists.push(this.uplimages);
    this.uploadLists = [];
    imagesLists.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadLists.push(io);
      });
    });
  }

  uploaduserManual(){
    // console.log("value",this.documentForm.value)
    this.disableupload = true
    if(this.documentForm.value.remarks == "" || this.documentForm.value.remarks == null || this.documentForm.value.remarks == undefined){
      this.notify.showError("Please Enter Document Title");
      this.disableupload = false
      return false;
    }
    let dataa = {
      "remarks": this.documentForm?.value?.remarks
    }
    // console.log("dataa",dataa)
    this.spinner.show();
    this.dataService.uploadpdf(dataa,this.uplimages)
    .subscribe(result =>{
      this.spinner.hide();
      let data = result
      if(data?.id != undefined){
        this.notify.showSuccess("Success");
        this.uploadsearch(1);
        this.documentForm.controls['remarks'].reset(""),
        this.InputVars.nativeElement.value = '';
        this.uploadLists.forEach((s, i) => {
        this.uploadLists.splice(i, 1);
        this.uplimages.splice(i,1);
        this.documentForm?.value?.file_data?.splice(i,1);
        })
      }else{
        this.notify.showError(data?.description);
        this.disableupload = false;
        return false;
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.disableupload = false;
      this.spinner.hide();
    })

  }

  deleteUpload(s, index) {
    this.uploadLists.forEach((s, i) => {
      if (index === i) {
        this.uploadLists.splice(index, 1);
        this.uplimages.splice(index,1);
        this.documentForm?.value?.file_data?.splice(index,1);
      }
    })
  }

  reset(){
    this.documentForm.controls['remarks'].reset(""),
    this.InputVars.nativeElement.value = '';
    this.uploadLists.forEach((s, i) => {
    this.uploadLists.splice(i, 1);
    this.uplimages.splice(i,1);
    this.documentForm?.value?.file_data?.splice(i,1);
    })
  }

  resetsearch(){
    this.documentSearchForm.controls['remarks'].reset(""),
    this.documentSearchForm.controls['fromdate'].reset(""),
    this.documentSearchForm.controls['todate'].reset(""),
    this.documentSearchForm.controls['created_by'].reset(""),
    this.uploadsearch(1);
  }

  resetviewsearch(){
    this.documentviewsearchForm.controls['remarks'].reset(""),
    this.documentviewsearchForm.controls['fromdate'].reset(""),
    this.documentviewsearchForm.controls['todate'].reset(""),
    this.documentviewsearchForm.controls['created_by'].reset(""),
    this.uploadviewsearch(1);
  }


  uploadsearch(pageNumber = 1){
    let searchdata = this.documentSearchForm?.value
    if (searchdata.fromdate != "" && searchdata.todate == "") {
      this.notify.showError("Please Choose To Date");
      return false;
    }
    if (searchdata.fromdate == "" && searchdata.todate != "") {
      this.notify.showError("Please Choose From Date");
      return false;
    }
    if(typeof(searchdata?.created_by)=='object'){
      searchdata.created_by = searchdata?.created_by?.id
    }else if(typeof(searchdata?.created_by)=='number'){
      searchdata.created_by =  searchdata?.created_by
    }else{
      searchdata.created_by = ""

    }

    if (searchdata.fromdate == null || searchdata.fromdate == undefined || searchdata.fromdate == "") {
      searchdata.fromdate = ""
    } else {
      searchdata.fromdate = this.datePipe.transform(searchdata.fromdate, 'yyyy-MM-dd');
    }

    if (searchdata.todate == null || searchdata.todate == undefined || searchdata.todate == "") {
      searchdata.todate = ""
    } else {
      searchdata.todate = this.datePipe.transform(searchdata.fromdate, 'yyyy-MM-dd');
    }
    this.spinner.show();
    this.dataService.docuploadSearch(searchdata,pageNumber)
    .subscribe(results=>{
      this.spinner.hide();
      let datas = results["data"];
        let datapagination = results["pagination"];
        this.doctlist = datas;
        if (this.doctlist.length >= 0) {
          this.has_nextdoc = datapagination.has_next;
          this.has_previousdoc = datapagination.has_previous;
          this.presentpagedoc = datapagination.index;
          this.isdocList = true;
        } else if (this.doctlist.length == 0) {
          this.isdocList = false;
        }
    })
  }

  doc_nextClick() {
    if (this.has_nextdoc === true) {
    this.uploadsearch(this.presentpagedoc + 1)
    }
  }

  doc_previousClick() {
    if (this.has_previousdoc === true) {
     this.uploadsearch(this.presentpagedoc - 1)
    }
  }
  uploadviewsearch(pageNumber = 1){
    let searchdata = this.documentviewsearchForm?.value

    if (searchdata.fromdate != "" && searchdata.todate == "") {
      this.notify.showError("Please Choose To Date");
      return false;
    }
    if (searchdata.fromdate == "" && searchdata.todate != "") {
      this.notify.showError("Please Choose From Date");
      return false;
    }
    if(typeof(searchdata?.created_by)=='object'){
      searchdata.created_by = searchdata?.created_by?.id
    }else if(typeof(searchdata?.created_by)=='number'){
      searchdata.created_by =  searchdata?.created_by
    }else{
      searchdata.created_by = ""

    }

    if (searchdata?.fromdate == null || searchdata?.fromdate == undefined || searchdata?.fromdate == "") {
      searchdata.fromdate = ""
    } else {
      searchdata.fromdate = this.datePipe.transform(searchdata?.fromdate, 'yyyy-MM-dd');
    }

    if (searchdata?.todate == null || searchdata?.todate == undefined || searchdata?.todate == "") {
      searchdata.todate = ""
    } else {
      searchdata.todate = this.datePipe.transform(searchdata?.fromdate, 'yyyy-MM-dd');
    }
    this.spinner.show();
    this.dataService.docuploadSearch(searchdata,pageNumber)
    .subscribe(results=>{
      this.spinner.hide();
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.doctviewlist = datas;
      if (this.doctviewlist.length >= 0) {
        this.has_nextdocview = datapagination.has_next;
        this.has_previousdocview = datapagination.has_previous;
        this.presentpagedocview = datapagination.index;
        this.isdocviewList = true;
      } else if (this.doctviewlist.length == 0) {
        this.isdocviewList = false;
      }
    
    })
  }

  docview_nextClick() {
    if (this.has_nextdocview === true) {
    this.uploadviewsearch(this.presentpagedocview + 1)
    }
  }

  docview_previousClick() {
    if (this.has_previousdocview === true) {
     this.uploadviewsearch(this.presentpagedocview - 1)
    }
  }
  deletedocUpload(data,index){
    this.spinner.show();
   this.dataService.deleteupload(data?.id)
    .subscribe(result =>{
      this.spinner.hide();
      if(result?.status == "success"){
        this.notify.showSuccess("Deleted");
        this.uploadsearch(1);
      }else{
        this.notify.showError(result?.description);
        return false;
      }
    })
  }

  downloadfiledocument(id,filename){
    this.spinner.show();
    this.dataService.downloadfile(id)
      .subscribe((data) => {
        this.spinner.hide();
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();
      })
  }












}
