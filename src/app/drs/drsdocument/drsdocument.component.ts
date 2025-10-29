import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';

// import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { DrsService } from '../drs.service';
import { SharedDrsService } from '../shared-drs.service';
export interface aws{
  name:string,
  id:number
  gl_no: string;
  code: string;
  glno: string;
  stage: any;
  finyer: string;
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
  selector: 'app-drsdocument',
  templateUrl: './drsdocument.component.html',
  styleUrls: ['./drsdocument.component.scss'],
   providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },DatePipe]
})
export class DrsdocumentComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    @ViewChild('Currency_sum_close') Currency_sum_close: ElementRef;
  aws_summary: FormGroup;
  aws_data: { created_date: string; file_name: string; id: number; status: number; type: string; }[];
  has_next: boolean=false;
  has_previous: boolean=false;
  presentpage: any=1;
  presentpages: any=1;
  aws_search_val: any;
  data_found: boolean=true;
  file_info: any;
  current_date=new Date();
  file: any;
  tb_views: boolean = false;
  TB_summary: FormGroup;
  isLoading: boolean;
  brasum_list_sum: any;
  has_nextbrasum: boolean;
  has_previousbrasum: any;
  currentpagebrasum: any;
  has_nextFinsum: boolean;
  glsum_list1: any;
  has_previousFinsum: boolean;
  currentpageFinsum: number;
  TB_data: any;
  has_previouss: any;
  has_nexts: any;
  table_view: boolean = false;
  tb_search_val: any;
  DeleteModal: FormGroup;
  dates: string;
  constructor(private drsservice: SharedDrsService, private errorHandler:ErrorhandlingService,private formBuilder:FormBuilder,private service:DrsService,public datepipe:DatePipe,private SpinnerService:NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit(): void {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.drsservice.isSideNav = false;
    this.aws_summary=this.formBuilder.group({
      status:[''],
      create_date:[''],
      file_name:[''],
      documentfile:"",
      upload_type:{'name':"TB Upload","id":1}
    })
    this.TB_summary = this.formBuilder.group({
      tb_branch: '',
      tb_Gl: '',
      tb_desc: '',
      create_dates: '',
   
      // selectAllCheckbox_for_Checker_Approver: '',
      // singleCheckbox_for_checker_approver: ''
    })
    this.DeleteModal=this.formBuilder.group({
      delete_date:[''],
     
    })

    this.aws_search(this.aws_summary.value)
  }
  status_list=[
    {'name':"Processing","id":1},
    {"name":"Success","id":4}
  ]
  upload_type_value=[
     {'name':"TB Upload","id":1},
    {"name":"Master Upload","id":2}
  ]
  public displayStatus(aws_name?: aws): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }
    public displaytype(type_name?: aws): string | undefined {
    return type_name ? type_name.name : undefined;
  }
  public displayfnbranchsum(tb_branch?: aws): string | undefined {
    return tb_branch ? tb_branch.name + "-" + tb_branch.code : undefined;
  }

  public displayGLsum(tb_Gl?: aws): string | undefined {
    return tb_Gl ? tb_Gl.glno : undefined;
  }

  aws_search(aws,pagenumber=1){
    let date=''
    if(aws.create_date!='' || aws.create_date!= undefined || aws.create_date!=null){
      date=this.datepipe.transform(aws.create_date,'yyyy-MM-dd')
    }
    this.aws_search_val=aws
    let search_val={
      status:aws?.status?.id,
      filename:aws?.file_name,
      created_date:date
    }
    for(let val in search_val){
      if (search_val[val] === null || search_val[val] === "" || search_val[val] === undefined) {
        search_val[val]=''
      }
    }
 
    this.SpinnerService.show()
    this.service.docaws_summary(search_val,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.aws_data=data
      let datapagination = results["pagination"];
      if(results['set_code']){
        this.data_found=false
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.toastr.warning('',results['set_description'],{timeOut:1500})
        return false;
      }
  
      if (this.aws_data.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_found=true
      }

    },error=>{
      this.SpinnerService.hide()
    })
  }
  previousClick() {
    if (this.has_previous === true) {
      this.aws_search(this.aws_search_val,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.aws_search(this.aws_search_val,this.presentpage + 1)
    }
  }
  clear_aws(){
    this.aws_summary.reset('')
     this.aws_summary.patchValue({
      upload_type:{'name':"TB Upload","id":1}
    })
  }
  aws_file(aws){
    console.log(aws)
    let fileName=aws.gen_filename
    let filekey=aws.file_name
  this.SpinnerService.show()
  this.service.drsreport(fileName)
  .subscribe((results: any[]) => {
    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = filekey;
      link.click();
      this.toastr.success('Successfully Download');
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
  Awt_file_data(file_info){
    console.log("element=>",file_info.target.files[0])
    this.file_info=file_info.target.files[0]
  }

  fil_upload(data){
    if(data== 1){
      if (this.aws_summary.value["documentfile"] === null || this.aws_summary.value["documentfile"] === '') {
        this.toastr.warning("Please Upload The File")
        return false
      }
      let flag=1
  if(this.aws_summary.value.upload_type?.id==1){
      this.SpinnerService.show()
      this.service.document_upload(this.file,flag,'TB').subscribe(results=>{
        this.SpinnerService.hide();
        let data = results["data"]
        if(data[0].status == "SUCCESS"){
          this.toastr.success("","Successfully Uploded")
          this.aws_summary.reset()
          this.aws_summary.patchValue({
          upload_type:{'name':"TB Upload","id":1}
          })
          this.aws_search(this.aws_search_val)
          this.file = ""
        }
      })
    }else{
      this.SpinnerService.show()
      this.service.document_upload(this.file,flag,'').subscribe(results=>{
        this.SpinnerService.hide();
        let data = results["data"]
        if(data[0].status == "SUCCESS"){
          this.toastr.success("","Successfully Uploded")
          this.aws_summary.reset()
           this.aws_summary.patchValue({
          upload_type:{'name':"TB Upload","id":1}
          })
          this.aws_search(this.aws_search_val)
          this.file = ""
        }
      })
    }
  

    }else{
      let flag = 2
   if(this.aws_summary.value.upload_type?.id==1){
      this.SpinnerService.show()
      this.service.document_uploads(flag,'TB').subscribe((results : Blob) =>{
        this.SpinnerService.hide();
        // let data = results["data"]
        const blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "TB Template Download.xlsx";        
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);

      //   let binaryData = [];
      // binaryData.push(results)
      // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // let link = document.createElement('a');
      // link.href = downloadUrl;
      // let date: Date = new Date();
      // link.download = "TB Template Download";
      // link.click();
      this.toastr.success('Successfully Download');
      
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}else{
   this.SpinnerService.show()
      this.service.document_uploads(flag,'').subscribe((results : Blob) =>{
        this.SpinnerService.hide();
        // let data = results["data"]
        const blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Master Template Download.xlsx";        
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      this.toastr.success('Successfully Download');
      
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
    }
   
  }

  fileupload(evt){
    this.file = evt.target.files[0];
    console.log("file",this.file)
  }

   @ViewChild('branchSumContactInput') branchSumContactInput: any;
    @ViewChild('branchsum') matAutocompletebrasum: MatAutocomplete;

    Branch_fun_sum() {
      // this.spinnerservice.show()
  
      let prokeyvalue: String = "";
      this.getaudict_brasum_drop(prokeyvalue);
      this.TB_summary.get('tb_branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
  
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbranchdropdown(value, 1)
            .pipe(
              finalize(() => {
                console.log(value)
                this.isLoading = false
  
              }),
            )
          )
        )
        .subscribe((results: any) => {
          // this.spinnerservice.hide()
          let data_bra_sum = results["data"]
          this.brasum_list_sum = data_bra_sum;
          console.log("Branch-Dropdown", this.brasum_list_sum)
          this.isLoading = false
        })
  
    }
  
    private getaudict_brasum_drop(prokeyvalue) {
      // this.spinnerservice.show()
      this.service.getbranchdropdown(prokeyvalue, 1)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()
          let data_bra_sum = results["data"];
          this.brasum_list_sum = data_bra_sum;
          this.isLoading = false
        })
  
    }
  
    autocompletebranchsumScroll() {
      this.has_nextbrasum = true
      this.has_previousbrasum = true
      this.currentpagebrasum = 1
      setTimeout(() => {
        if (
          this.matAutocompletebrasum &&
          this.autocompleteTrigger &&
          this.matAutocompletebrasum.panel
        ) {
          fromEvent(this.matAutocompletebrasum.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebrasum.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletebrasum.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebrasum.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebrasum.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbrasum === true) {
                  this.service.getbranchdropdown(this.branchSumContactInput.nativeElement.value, this.currentpagebrasum + 1)
                    .subscribe((results: any[]) => {
                      let data_bra_sum = results["data"];
                      let datapagination = results["pagination"];
                      this.brasum_list_sum = this.brasum_list_sum.concat(data_bra_sum);
                      if (this.brasum_list_sum.length >= 0) {
                        this.has_nextbrasum = datapagination.has_next;
                        this.has_previousbrasum = datapagination.has_previous;
                        this.currentpagebrasum = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
  
    }

    @ViewChild('GLsumContactInput') GLsumContactInput: any;
    @ViewChild('GLNumbersum') matAutocompleteGLsum: MatAutocomplete;

    GL_fun_sum() {
      // this.spinnerservice.show()
  
      let prokeyvalue: String = "";
      this.getaudict_glsum_drop(prokeyvalue);
      this.TB_summary.get('tb_Gl').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
  
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.GL_dropdown(value, 1)
            .pipe(
              finalize(() => {
                console.log(value)
                this.isLoading = false
  
              }),
            )
          )
        )
        .subscribe((results: any) => {
          // this.spinnerservice.hide()
          let datasum = results["data"]
          this.glsum_list1 = datasum;
          console.log("GL-Dropdown", this.glsum_list1)
          this.isLoading = false
        })
    }
  
    private getaudict_glsum_drop(prokeyvalue) {
      this.service.GL_dropdown(prokeyvalue, 1)
        .subscribe((results: any) => {
          // this.spinnerservice.hide()
          this.glsum_list1 = results["data"]
          console.log("GL-Dropdown", this.glsum_list1)
          this.isLoading = false
        })
  
    }
  
    autocompleteGLsumScroll() {
      this.has_nextFinsum = true;
      this.has_previousFinsum = true;
      this.currentpageFinsum = 1
      let flag = 0
      setTimeout(() => {
        if (
          this.matAutocompleteGLsum &&
          this.autocompleteTrigger &&
          this.matAutocompleteGLsum.panel
        ) {
          fromEvent(this.matAutocompleteGLsum.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompleteGLsum.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompleteGLsum.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompleteGLsum.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompleteGLsum.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextFinsum === true) {
                  this.service.GL_dropdown(this.GLsumContactInput.nativeElement.value, this.currentpageFinsum + 1)
                    .subscribe((results: any[]) => {
                      let datasum = results["data"];
                      let datapagination5 = results["pagination"];
                      this.glsum_list1 = this.glsum_list1.concat(datasum);
                      if (this.glsum_list1.length >= 0) {
                        this.has_nextFinsum = datapagination5.has_next;
                        this.has_previousFinsum = datapagination5.has_previous;
                        this.currentpageFinsum = datapagination5.index;
                      }
                      console.log("GL-Dropdown:", this.glsum_list1)
                    })
                }
  
              }
            })
        }
      })
    }

    previousClicks() {
      if (this.has_previouss === true) {
        this.tb_search(this.tb_search_val,this.presentpages - 1);
      }
    }
    nextClicks() { 
      if (this.has_nexts === true) {
        this.tb_search(this.tb_search_val,this.presentpages + 1)
      }
    }

    tb_clear(){
      this.TB_summary.reset()
    }

  tb_view(aws){
    console.log("View Datas:",aws)
    this.tb_views= true
  }
  back(){
    this.tb_views= false
    this.table_view= false
  }
  tb_search(fields,pagenumbers=1){
    console.log("TB Search Fields",fields)
    this.tb_search_val=fields
    if(this.TB_summary.controls["create_dates"].value!='' || this.TB_summary.controls["create_dates"].value!= undefined || this.TB_summary.controls["create_dates"].value!=null){
     this.dates=this.datepipe.transform(this.TB_summary.controls["create_dates"].value,'yyyy-MM-dd')
    } else if(this.TB_summary.controls["create_dates"].value=='' || this.TB_summary.controls["create_dates"].value== undefined || this.TB_summary.controls["create_dates"].value==null){
      this.dates= ""
    }

    // let branch_code = this.TB_summary
    let glno = this.TB_summary.controls["tb_Gl"].value?.glno ?? ''
    let branchcode = this.TB_summary.controls["tb_branch"].value?.code ?? ''
    let Description = this.TB_summary.controls["tb_desc"]?.value??""

    // let glno = this.TB_summary.value.tb_Gl?.glno ?? '';
    // let branchcode = this.TB_summary.value.tb_branch?.code ?? '';
    // let Description = this.TB_summary.value.tb_desc;


    this.SpinnerService.show()
    this.service.TB_summarys(glno,branchcode,Description,pagenumbers,this.dates).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.TB_data=data
      let datapagination = results["pagination"];
      if(results){
        this.table_view= true
        this.data_found=false
        this.has_nexts = false;
        this.has_previouss = false;
        this.presentpages = 1;
      } else{
        this.SpinnerService.hide()
      }
  
      if (this.TB_data.length >= 0) {
        this.has_nexts = datapagination.has_next;
        this.has_previouss = datapagination.has_previous;
        this.presentpages = datapagination.index;
        this.data_found=true
        this.table_view= true
      } else{        
        this.data_found=false
        this.has_nexts = false;
        this.has_previouss = false;
        this.presentpages = 1;

      }

    },error=>{
      this.SpinnerService.hide()
    })

  }
  delete_tb(data){
    let date1 = ""
    if(this.DeleteModal.value.delete_date== undefined || this.DeleteModal.value.delete_date== null || this.DeleteModal.value.delete_date== ""){
      this.toastr.warning("Please choose date")
      return false;
    }
    date1=this.datepipe.transform(this.DeleteModal.value.delete_date,'yyyy-MM-dd')

    console.log("Date1",date1)
    let date = date1
    let status= 2


    this.SpinnerService.show()
    this.service.TB_Delete(date,status).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      // let data=results['message']
      // this.TB_data=data
      if(results.status == "success"){
        this.toastr.success(results.message)
        this.Currency_sum_close.nativeElement.click();
        // this.deleteclose()
      }
    },error=>{
      this.SpinnerService.hide()
    })
  }
  tb_deletess(){
    this.DeleteModal.reset()
  }

  deleteclose() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
  }

  getStatusLabel(aws: any): string {
  if (aws.type == 1) {
    if (aws.set_status != 4) return "Processing";
    if (aws.set_status == 4) return "Success";
  }

  if (aws.type == 3) {
    if (aws.set_status == 4) return "Success";
    if (aws.set_status == 5) return "Processing";
    if (aws.set_status == 6) return "Uploaded";
    if (aws.set_status == 7) return "Failed";
  }

  if (aws.type == 4) {
    if (aws.set_status == 4) return "Success";
    if (aws.set_status == 5) return "Processing";
    if (aws.set_status == 6) return "Uploaded";
    if (aws.set_status == 7) return "Failed";
  }

  if (aws.type == 8) {
    if (aws.set_status == 4) return "Success";
    if (aws.set_status == 5) return "Processing";
    if (aws.set_status == 6) return "Uploaded";
    if (aws.set_status == 7) return "Failed";
  }
   if (aws.type == 9 || aws.type == 10) {
    if (aws.set_status == 4) return "Success";
    if (aws.set_status == 5) return "Processing";
    if (aws.set_status == 6) return "Uploaded";
    if (aws.set_status == 7) return "Failed";
  }

  return "";
}



}
