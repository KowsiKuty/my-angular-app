import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil, tap } from 'rxjs/operators';

declare var bootstrap: any;
@Component({
  selector: 'app-account-mapping',
  templateUrl: './account-mapping.component.html',
  styleUrls: ['./account-mapping.component.scss']
})
export class AccountMappingComponent implements OnInit {
  accountsummaryarray: any[]=[]
  uploadedfasFileName: any;
  accountsearch: FormGroup;
  rulearray1: any[]=[]

  constructor(private fb:FormBuilder,private notification:NotificationService, private brsService: BrsApiServiceService,private spinner: NgxSpinnerService) { }
  accountform:FormGroup
  bulkuploadform:FormGroup
  rulearray:any[]=[]
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  } 
  paginationtemp = {
    has_next: false,
    has_previous: false,
    index: 1
  } 
  limit = 10;
  templatearray:any[]=[]
  @ViewChild("closebuttonclosed") closebuttonclosed: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger1: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger2: MatAutocompleteTrigger;
  @ViewChild('temp_name_input1') temp_name_input1: any;
  @ViewChild('temp_name_input2') temp_name_input2: any;
  @ViewChild('temp_name_input3') temp_name_input3: any;
  @ViewChild('temp_auto') temp_auto: MatAutocomplete
  @ViewChild('temp_auto1') temp_auto1: MatAutocomplete
  @ViewChild('temp_auto2') temp_auto2: MatAutocomplete
  ngOnInit(): void {

    this.accountform = this.fb.group({
      accountnumber:[''],
      template:[''],
      rule:[''],
    })
    this.bulkuploadform=this.fb.group({
      file:[''],
      template:[''],
      rule:[''],
    })
    this.accountsearch = this.fb.group({
      accountnumber:[''],
      temp_name:[''],
    
    })
    this.account_search()
   
    this.template()
  }
  map_account(){
    console.log('values',this.accountform.value)
    let form=this.accountform.value
    if(form.accountnumber===''||form.accountnumber===null||form.accountnumber===undefined){
      this.notification.showError('Enter Account number')
      return
    }
    if(form.template===''||form.template===null||form.template===undefined){
      this.notification.showError('Choose Template')
      return
    }
    if(form.rule?.length==0||form.rule===null){
      this.notification.showError('Choose Rule')
      return
    }
   let data= {
      "account_no":form.accountnumber,
      "temp_id":form.template,
      "rule_id":form.rule,
      "id":null
  }
    this.brsService.account_mapping(data).subscribe(result=>{
      console.log(result)
      if(result.code){
        this.notification.showError(result.code)
      }
      else{
        this.notification.showSuccess(result.message)
        this.account_search()
        this.accountform.reset()
        this.closebuttonclosed.nativeElement.click();
      }
    })
  }
  getmappingsummary(params){
    this.spinner.show()
    this.brsService.account_mapping_get(this.pagination.index,params).subscribe(result=>{
      this.spinner.hide()
      this.accountsummaryarray=result['data']
      this.pagination = result.pagination ? result.pagination : this.pagination;
    })
  }
  getruleenginedata(name) {

    let page=1
    this.brsService.getruledefinition1(page,name).subscribe(results => {
      if (!results) {
        return false;
      }

      this.rulearray= results['data'];
      
    })
  }
  getruleenginedata1(name) {

    let page=1
    this.brsService.getruledefinition1(page,name).subscribe(results => {
      if (!results) {
        return false;
      }

      this.rulearray1= results['data'];
      
    })
  }
  map_reset(){
    this.accountform.reset()
  }
  prevpages()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
      console.log('previous', this.pagination.index)
    }
    this.account_search()
  }
  nextpages()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
   this.account_search()
  
  }
  account_search(){
    let params=''
    let formvalue = this.accountsearch.value
    if(formvalue.temp_name){
     params+='&temp_name='+formvalue.temp_name
    }
    if(formvalue.accountnumber){
      params+='&no='+formvalue.accountnumber
     }
    
this.getmappingsummary(params)
  }
  datassearchreset(){
    this.accountsearch.reset()
    this.pagination.index=1
    this.account_search()
  }
  template(){
    
    this.brsService.getNtemplatess(this.paginationtemp.index,'').subscribe(results => {
this.templatearray=results['data']
this.paginationtemp=results.pagination

    })
  }
  gettemplate(){
    this.paginationtemp.index=1
    this.brsService.getNtemplates1(this.temp_name_input1.nativeElement.value,this.paginationtemp.index).subscribe(results => {
      this.templatearray=results['data']
      this.paginationtemp=results.pagination
    })
  }
  gettemplate1(){
    this.paginationtemp.index=1
    this.brsService.getNtemplates1(this.temp_name_input2.nativeElement.value,this.paginationtemp.index).subscribe(results => {
      this.templatearray=results['data']
      this.paginationtemp=results.pagination
    })
  }
  gettemplate2(){
    this.paginationtemp.index=1
    this.brsService.getNtemplates1(this.temp_name_input3.nativeElement.value,this.paginationtemp.index).subscribe(results => {
      this.templatearray=results['data']
      this.paginationtemp=results.pagination
    })
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
          if (fileExtension !== 'xlsx') {
            console.error('Invalid file type. Please upload an XLSX file.');
            this.notification.showError("Unsupported file type");
            this.bulkuploadform.get('file').reset()
            return;
          }
      this.uploadedfasFileName=file
      console.log('Selected file:', file.name);
    }
  }

  submitsForm() {
    let form=this.bulkuploadform.value
    console.log(this.uploadedfasFileName)
    if(this.uploadedfasFileName===undefined){
      this.notification.showError('Upload file')
      return
    }
    if(form.template===''||form.template===null||form.template===undefined){
      this.notification.showError('Choose Template')
      return
    }
    if(form.rule?.length==0||form.rule===null){
      this.notification.showError('Choose Rule')
      return
    }
    let data={
      "temp_id":form.template,
      "rule_id":form.rule,
    }
    const body = JSON.stringify(data)
    this.spinner.show()
  this.brsService.bulk_file_upload(this.uploadedfasFileName,body).subscribe(results => {
    this.spinner.hide()
  console.log(results,'results')
  if(results.status){
    this.notification.showSuccess(results.message)
    this.account_search()
    this.closebuttonclosed.nativeElement.click();
  }
  else{
    this.notification.showError(results.code)
  }
  
  })

  }
  getrule_temp(name){
    let params='&temp_name='+name
    this.accountform.get('rule').reset()
    this.rulearray=[]
this.getruleenginedata(params)
  }
  getrule_temp1(name){
    let params='&temp_name='+name
    this.bulkuploadform.get('rule').reset()
    this.rulearray1=[]
this.getruleenginedata1(params)
  }
  deleteaccount(data){
    this.brsService.deleteaccountmap(data.id).subscribe(res=>{
      if(res.status){
        this.notification.showSuccess(res.message)
        this.pagination.index=1
        this.account_search()
      }
      else{
        this.notification.showError(res.description)
      }
    })
  }
  autocompletewisefinxlScroll() {
    setTimeout(() => {
      if (
        this.temp_auto &&
        this.autocompleteTrigger &&
        this.temp_auto.panel
      ) {
        fromEvent(this.temp_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.temp_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.temp_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.temp_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.temp_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.paginationtemp.has_next === true) {                
                this.brsService.getNtemplates1(this.temp_name_input1.nativeElement.value,this.paginationtemp.index+1).subscribe(results => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.templatearray = this.templatearray.concat(datas);
                    this.paginationtemp=datapagination
                 
                  })
              }
            }
          });
      }
    });
  }
  autocompletewisefinxlScroll1() {
    setTimeout(() => {
      if (
        this.temp_auto1 &&
        this.autocompleteTrigger1 &&
        this.temp_auto1.panel
      ) {
        fromEvent(this.temp_auto1.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.temp_auto1.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger1.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.temp_auto1.panel.nativeElement.scrollTop;
            const scrollHeight = this.temp_auto1.panel.nativeElement.scrollHeight;
            const elementHeight = this.temp_auto1.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.paginationtemp.has_next === true) {                
                this.brsService.getNtemplates1(this.temp_name_input2.nativeElement.value,this.paginationtemp.index+1).subscribe(results => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.templatearray = this.templatearray.concat(datas);
                    this.paginationtemp=datapagination
                 
                  })
              }
            }
          });
      }
    });
  }
  autocompletewisefinxlScroll2() {
    setTimeout(() => {
      if (
        this.temp_auto2 &&
        this.autocompleteTrigger2 &&
        this.temp_auto2.panel
      ) {
        fromEvent(this.temp_auto2.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.temp_auto2.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger2.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.temp_auto2.panel.nativeElement.scrollTop;
            const scrollHeight = this.temp_auto2.panel.nativeElement.scrollHeight;
            const elementHeight = this.temp_auto2.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.paginationtemp.has_next === true) {                
                this.brsService.getNtemplates1(this.temp_name_input3.nativeElement.value,this.paginationtemp.index+1).subscribe(results => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.templatearray = this.templatearray.concat(datas);
                    this.paginationtemp=datapagination
                 
                  })
              }
            }
          });
      }
    });
  }
  resetmapping(){
    this.accountform.reset()
    this.bulkuploadform.reset()
    this.uploadedfasFileName=undefined
    this.popupopenviewdata()
  }
  popupopenviewdata() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editdatas"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  clicktodowntemp(){
  
    this.brsService.get_bulk_accountmappingtemp().subscribe((res=>{
      let binaryData = [];
      binaryData.push(res);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Account_mapping_template" + ".xlsx";
      link.click();
    }))

    
  }
}
