import { Component, OnInit, Output, EventEmitter, ViewChild, Pipe, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProofingService } from "../proofing.service";
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
export interface rule{
 'id':number,
 "rule_name":string,
 "date":any
}
export interface Templatedis{
  'id':any,
  'template':string
}
export interface Referanceno{
  'reference':any
}
export interface date{
  "date":any
}
export interface Description{
  "description":any
}
@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  tempid = null
  AddForm: FormGroup;
  filetypeList: Array<any>;
  maximumruleselected: boolean;
  columnlist: any = []
  template_name = '';
  no_of_reference: number = 0;
  inputcolumns = [];
  singleref:boolean = false
  multipleref:boolean = false
  ruleslist = [
  ]
  rulehasnext = false;
  selectedrules =[];
  selectedrulesres = [];
  selectedruleids = null;
  default = 'abcd';
  previewindex = null;
  mainindex = null;
  //Preview variables
  delimiter = null;
  del_occurence = null;
  rulename = null;
  ruletype = null;
  
  noofchars: any;
  ruledescription: any;
  rulepage = 1;
  selectRulesform:FormGroup;
  ruleform:FormGroup;
  templateform:FormGroup;
  isdelenabled: boolean = false;
  isnoofchars: boolean = false;
  isrole: boolean = false;
  @ViewChild('rulescroll') rulescroll: MatSelect
  uploadedFileName:any
  upload_file_name:any
  fileuploadform:FormGroup;
  drop_temp_array:any=[]
  tempinput_form=new FormControl()
  showdropdown:boolean=true
  showinput:boolean=false
  constructor(private formBuilder: FormBuilder, private router: Router, private notification: NotificationService,
    private proofingService: ProofingService, private spinner: NgxSpinnerService, private shareservice: ShareService,private renderer: Renderer2) { }

  ngOnInit(): void {
    this.columnlist.push({ sys_col_name: 'Reference No', column_name: '' }, { sys_col_name: 'Date', column_name: '' },
    { sys_col_name: 'Description', column_name: '' },{ sys_col_name: 'Branch Code', column_name: '' },{ sys_col_name: 'Branch Name', column_name: '' },{ sys_col_name: 'GL No', column_name: '' },{ sys_col_name: 'Running Balance', column_name: '' }
    )
    this.tempid = this.shareservice.templateEditValue.value;
    this.tempid = this.tempid?.id;

    if (this.tempid) {
      this.gettemplatedetails()
    }else{
    this.chooseAmtColumns('single');
    }
    console.log('sss', this.tempid)
    this.AddForm = this.formBuilder.group({
      template: ['', Validators.required],
      file_type: [-1, Validators.required],
      
    });
    this.selectRulesform=this.formBuilder.group({
      slectrules:[''],
      slectrules1:['']
    });
    this.ruleform=this.formBuilder.group({
    rulename: [''],
    description: [''],
    delimiter: [''],
    occurencess: [''],
    noofchars: [''],
    traversing:true,
    Field_type: 'reference_no',
    // id: 0,
    rule_type: 1,
    ruleadd:new FormArray([this.ruleadd()])
    });
    this.templateform=this.formBuilder.group({
      'template':['']
    })
    this.fileuploadform = this.formBuilder.group({
      file_upload: ['']
    })
    // this.
    this.getFileType();
    this.getrules();
    // this.ruleadd();
    // this.rule_typeupdate();
    this.gettemplate();
    this.selectRulesform.get('slectrules').valueChanges
    .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
    //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
     switchMap(value => this.proofingService.getruleslist('page=1&rulename='+value)
     .pipe(
       finalize(() => {
         this.isLoading = false
       }),)
     )
   )
   .subscribe((results: any[]) => {
     let datas = results['data'];
     this.ruleslist = datas
     
   });
   this.templateform.get('template').valueChanges
    .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
    //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
     switchMap(value => this.proofingService.getTemplateList("", "", '1&template_name='+value)
     .pipe(
       finalize(() => {
         this.isLoading = false
       }),)
     )
   )
   .subscribe((results: any[]) => {
     let datas = results['data'];
     this.templatelist = datas
     console.log("templatelist", this.templatelist)
   });
    
  }

  // ngAfterViewInit() {
  //   this.rulescroll.openedChange.subscribe(() => {
  //     const panel = this.rulescroll.panel.nativeElement;
  //     panel.addEventListener('scroll', event => this.scrolled(event));
  //   })
  // }

  public displayFnrule(data?: rule): string | undefined {
    return data ? data.rule_name : undefined;
  }
  public displayFntem(data?: Templatedis): string | undefined {
    return data ? data.template : undefined;
  }
  // public displayfnrefno(data?:Referanceno):string | undefined{
  //   return data?data:a
  // }
  ref_show(element) {
    let value = element
    return element ? value : ''
  }
  displayfndes(element) {
    let value = element
    return element ? value : ''
  }
  displayfndata(element) {
    let value = element
    return element ? value : ''
  }
  // public displayfndata(data?:date):string | undefined{
  //   return data ? data.date:undefined;
  // }
  // public displayfndes(data?:Description):string | undefined{
  //   return data ? data.description:undefined;
  // }

  amtValue = 'single'
  chooseAmtColumns(data) {
    if (this.amtValue == 'single') {
      if(this.columnlist.length == 11){
        this.columnlist.pop()
        this.columnlist.pop()
        
      }
      
      this.columnlist.length == 11 ? this.columnlist.splice(7,8,9,10) :''
      this.columnlist.length == 9? this.columnlist.splice(7,8) :''
      this.columnlist.push({ sys_col_name: 'Debit', column_name: '' })
      this.columnlist.push({ sys_col_name: 'Credit', column_name: '' })
    }
    else {
     data.value == 'multiple' ? this.columnlist.splice(7,8): ''
      this.columnlist.push(
        { sys_col_name: 'Amount', column_name: '' }
        , {
          sys_col_name: 'Credit_Debit_Type', column_name: ''},{
            sys_col_name: "Credit_type",
            column_name: null
          },
          {
            sys_col_name: "Debit_type",
            column_name: null
          },
      );
    }
  }

  // getrules() {
  //   this.isLoading = true;
  //   this.proofingService.getruleslist('page=' + this.rulepage).subscribe(res => {

  //     this.rulehasnext = res?.pagination.has_next
  //     res?.data.forEach((element) => {

  //       delete element.date
  //       element.rule_id = element.id
  //       delete element.id;
  //     });;
  //     this.ruleslist = this.ruleslist.concat(res['data']);
  //     this.isLoading = false;
  //   })
  // }
  // getrules(){
  //   this.isLoading=true;
  //   this.proofingService.getruleslist('page=' + this.rulepage).subscribe(result=>{
  //     this.rulehasnext = result?.pagination.has_next
  //     this.ruleslist = this.ruleslist.concat(result['data']);
  //     this.isLoading = false;
  //   })
  // }
  getrules(page = 1) {
    let params = 'page=' + page
    this.spinner.show();
    this.proofingService.getruleslist('page=' + this.rulepage).subscribe(results => {
      this.spinner.hide();
      if(results.code!=undefined && results.code!="" && results.code!=null){
        this.notification.showError(results.code)
        this.notification.showError(results.description);
        this.ruleslist=[];
      }
      else{
      this.ruleslist = results['data']
      let datapagination = results["pagination"];

      if (this.ruleslist.length >= 0) {
       
        this.rulehasnext = datapagination.has_next;
        
      }
    }
    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status+error.statusText);
    })
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objTemplate = new Template();
    objTemplate.template = data['template'].value;
    objTemplate.file_type = data['file_type'].value;
    console.log("objTemplate", objTemplate)
    return objTemplate;
  }
  filter(data) {
    console.log(data.value);
  }

  private getFileType() {
    // this.spinner.show()
    this.proofingService.getFileType()
      .subscribe((results: any[]) => {
        // this.spinner.hide()
        let datas = results["data"];
        this.filetypeList = datas;
        console.log("filetype", datas)

      })
  }

  template_file(e){
    const files= e.target.files[0];
    if (files ) {
      const fileExtension = files.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'xlsx') {
        console.error('Invalid file type. Please upload an XLSX file.');
        this.notification.showError("Unsupported file type");
        return;
      }
      this.uploadedFileName =files; 
      this.upload_file_name=files.name
      this.fileuploadform.get('file_upload').reset()
    }
  }

  deleteFile(){
 
    this.fileuploadform.get('file_upload').reset()
    this.upload_file_name=''
    this.uploadedFileName=undefined
  }

  clicktempupload(){
    
    console.log(this.uploadedFileName)
      if(this.uploadedFileName===undefined){
        this.notification.showError('Choose File')
        return
      }
      else{  
    this.spinner.show()
  this.proofingService.file_submit(this.uploadedFileName).subscribe(results => {
    this.spinner.hide()
  console.log(results,'results')
  let value=results['data']
  if(value){
    this.notification.showSuccess('File uploaded successfully')
    this.showdropdown=true
    this.showinput=false
  }
  
  for(let data of value){
    this.drop_temp_array=data.cols
  }
  })
      }
}
  submitForm() {
    let arr = [];
   if (this.template_name=='' || this.template_name==undefined || this.template_name==null){
    this.notification.showError("Please select Template Name");
    throw new Error;
   }
    let columnlist = this.columnlist.slice()
    // columnlist.forEach(element => {
    //   if(element.sys_col_name != 'Reference No' ){
    //     if (element.column_name == '') {
    //       this.notification.showError('Please Fill Column Names...')
    //       throw new Error;
    //     }
    //   }
    
    // });
   
    // submitForm() {
    //   let arr = [];
  
    //   let columnlist = this.columnlist.slice()
    //   columnlist.forEach(element => {
    //     if (element.column_name == '') {
    //       this.notification.showError('Please Fill Column Names...')
    //       throw new Error;
    //     }
    //   });
    //   this.selectedrules.forEach(element => {
    //     if (this.tempid) {
    //       arr.push({ template_id: this.tempid, rule_id: element.rule_id })
    //     }
    //     else if (!element?.id) {
    //       arr.push({ rule_id: element.rule_id })
    //     }
    //   })
    let debitcredit = 1;

    if (this.amtValue === 'single') {
      debitcredit = 0;
    } else if (this.amtValue === 'multiple') {
      debitcredit = 1;
    }
    // if (columnlist[4]?.split) {
    //   debitcredit = 0
    //   let data = columnlist[4].split;
    //   columnlist.push(data[0])
    //   columnlist.push(data[1])
      // delete columnlist[3].split
    // }
    let payload: any = {
      template_name: this.template_name,
      credit_debit_type: debitcredit,
      details: columnlist,
      rule: arr,
    }
    console.log(payload)
    this.tempid ? payload.id = this.tempid : false;
    // delete payload.details[3].split
    this.spinner.show()
    this.proofingService.createTemplate({ data: [payload] })
      .subscribe(res => {
        this.spinner.hide()
        if (res.description) {
          this.notification.showError(res.description)
        }
        else {
          this.notification.showSuccess(res.message)
          this.onSubmit.emit()
        }

      }
      )
  }

  refer_references() {
    if (this.no_of_reference > 1 && '') {

    }
  }
  finalvalue = [];
  createpreview(data) {
    console.log(data)
    let array = data;
    this.delimiter = array.delimiter
    this.del_occurence = array.occurencess;
    this.rulename = array.rulename;
    this.noofchars = array.noofchars;
    this.ruledescription = array.description
    // this.ruletype = array.ruletypes[this.previewindex].name;
    var value = [this.default];
    for (var i = 0; i < this.del_occurence; i++) {
      // value.push(this.delimiter)

      if (i + 1 == this.del_occurence) {
        value.push('REF_NO')
      }
      else {
        value.push(this.default);
      }
    }
    this.finalvalue = value;
  }
  gettemplatedetails() {
    console.log('hits', this.tempid);
    this.spinner.show()
    this.proofingService.getTemplateDetails(this.tempid)
      .subscribe(res => {
        this.spinner.hide();
        if(res.code!=undefined&&res.code!=null&&res.code!=''){
          this.spinner.hide();
          this.notification.showError(res.code);
          this.notification.showError(res.description);
        }
        else{
        let response = res;

        this.template_name = response.template_name;
        // response.details.forEach((element, index) => {
        //   this.columnlist[index].column_name = element.column_name;
        //   this.columnlist[index].id = element.id
        // });
        this.columnlist = response.details
        console.log("responcoulmn",this.columnlist)
        let length = this.columnlist.length;
        if(this.columnlist.length == 11) {
          
          this.amtValue = 'multiple'

          this.singleref = true
        }
        else {
          this.amtValue = 'single'
          this.multipleref = true
        }
        this.showinput= true
        this.showdropdown=false
        // if (response.credit_debit_type == '1') {
        //   let data = [];
        //   data.push(this.columnlist.pop())
        //   data.push(this.columnlist.pop());
        //   this.columnlist[4].split = data;

        //   this.amtValue = 'multiple'
        // }
        // this.selectedrules = response.rule;
        //  this.selectedrules=selectedrules;
        // this.selectRulesform.patchValue({
        //   'slectrules':this.selectedrules[0]
        // })
        // for(var i=0;i<selectedrules.length;i++){
        //        this.selectedrules=[selectedrules[i]]

        // }
        // selectedrules.forEach((element) =>{
        //   console.log(element.rule_name)
        //   this.selectedrules['rule_name'].push(element.rule_name);
        // })
        // if(this.selectedrules.length!=0){
        //   this.maximumruleselected = true;
        // }
        console.log('chek', this.columnlist)
      }
      }
        , error => { this.spinner.hide() })
  }
  ruleselected(data) {
    // this.selectedrules=[this.selectedrules]
    data['rule_id']=data.id;
    
    
    this.selectedrules=[data];
    // let a=Object(this.selectedrules)
    console.log(this.selectedrules);
    // this.selectedrulesres.push(this.selectedrules);
    this.maximumruleselected = false;
    if (this.selectedrules?.length > 4) {
      this.maximumruleselected = true;
    }
    // if(this.selectedrules.length!=0){
    //   this.selectedrules.push(this.selectedrules)
    // }
  }
  map_columns() {
    let array = [];
    this.columnlist.forEach((element) => {
      if (element.column_name != '') {
        array.push(element.column_name)
      }
    });
    this.inputcolumns = array;
    console.log(this.inputcolumns)
  }
  searchrules() {
    console.log('Searchsss')
  }

  onCancelClick() {
    this.onCancel.emit()
  } 
  open() {
    // this.accountscroll._getScrollTop.subscribe(() => {
    //   const panel = this.accountscroll.panel.nativeElement;
    //   panel.addEventListener('scroll', event => this.scrolled(event));
    // })
    this.renderer.listen(this.rulescroll.panel.nativeElement, 'scroll', () => {
      // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
      let evet = this.rulescroll.panel.nativeElement
      this.scrolled(evet)
    });

  }

  resetfunction(item: any) {
    item.column_name = ''; // Clears the selected value but keeps the field
  }
  
  FliterValue:string=''
  valuefilter(value){
    this.FliterValue=value;
    
    // value.valueChanges
    // .Pipe(
    //      debounceTime(100),
    //      distinctUntilChanged(),
    //      tap(() => {
    //        this.isLoading = true;
    //      }),
    //     //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
    //      switchMap(value => this.proofingService.getruleslist('page=1&rulename='+value)
    //      .pipe(
    //        finalize(() => {
    //          this.isLoading = false
    //        }),)
    //      )
    //    )
    //    .subscribe((results: any[]) => {
    //      let datas = results['data'];
    //      this.ruleslist = datas
         
    //    });
  }

  numberOnly(event) {
    if (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46 || event.charCode == 58) {
      this.no_of_reference = event.target.value;
    }
    else {
      this.no_of_reference = 1
    }
  }

  previewrules(rule) {
    // this.mainindex = ind1
    // this.previewindex = ind2
    // this.spinner.show()
    this.proofingService.getrule(rule.rule_id).subscribe(res => {
      // this.spinner.hide();
      this.createpreview(res['data'][0])
    })

  }
  isLoading: boolean = false;
  scrolled(scrollelement) {
    let value = scrollelement;
    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 10;


    if (scrollTop > upgradelimit && this.rulehasnext && !this.isLoading) {
      this.rulepage += 1
      this.getrules();
    }

  }
  rule_typeupdate(event,data) {
    if(data=='delemiter'){
      this.isdelenabled= event.checked;
    }
    if(data=='nofchars'){
      this.isnoofchars=event.checked;
    }

    if (!this.isdelenabled && !this.isnoofchars) {
      // this.ruleform.rule_type = 1
      this.ruleform.patchValue({
        'rule_type':1,
        'delimiter':'',
        'occurencess':'',
        'noofchars':''
      });
      // this.ruleform.delimiter = null
      // this.ruleform.occurencess = null
      // this.ruleform.noofchars = null
    }
    else if (!this.isdelenabled && this.isnoofchars) {
      // this.ruleform.rule_type = 4
      // this.ruleform.delimiter = null
      // this.ruleform.occurencess = null
      this.ruleform.patchValue({
        'rule_type':4,
        'delimiter':'',
        'occurencess':'',
      });
    }
    else if (this.isdelenabled && this.isnoofchars) {
      // this.ruleform.rule_type = 3
      this.ruleform.patchValue({
        'rule_type':3,
      });
    }
    else {
      this.ruleform.patchValue({
        'rule_type':2,
        'noofchars':''
      });
      // this.ruleform.noofchars = null
      // this.ruleform.rule_type = 2
    }
  }
  templatelist:Array<any>
  gettemplate(filter = "", sortOrder = 'asc',pageNumber = 1, pageSize = 10){
    let params=pageNumber
    this.proofingService.getTemplateList(filter, sortOrder, params, pageSize).subscribe(result=>{
      this.templatelist=result['data'];
      console.log(this.templatelist);
    })
  }
  referencelist:any;
  amountlist:any;
  datelist:any;
  descriptionlist:any;
  getreferencecolumns(data){
    // console.log(data);
    let temp_id=data?.id
    this.proofingService.templaebaselist(temp_id).subscribe(results=>{
       console.log(results);
       this.referencelist=results['reference'];
       this.datelist=results['date'];
       this.descriptionlist=results['desc'];
       console.log(this.referencelist);
       console.log(this.datelist);
       console.log(this.descriptionlist);

    });
  }
  submit(){
    console.log(this.ruleform.value);
    let rules=this.ruleform.controls.ruleadd.value;
    console.log(rules);
    let payload: any = this.ruleform.value;
    // payload['traversing']=true
    for (let i = 0; i < rules.length; i++) {
        payload['rule' +(i+1)]=[rules[i]]
    }
    payload = { data: [payload] } 
    this.proofingService.submitrulenew(payload).subscribe(res => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.notification.showSuccess(res.message);
        // this.onSubmit.emit()
      }
      else {
        this.notification.showError(res.description)
      }
    }, (error:HttpErrorResponse) => {
      this.spinner.hide();
      this.notification.showWarning(error.status + error.statusText);
    })
    // rules.forEach(element=>{
    //   element.rule1=element
    //   element.rule2=element
    //   element.rule3=element
    // })
  }
  ruleadd(){
    let group=this.formBuilder.group({
      'referanceno':new FormControl(''),
      'decription':new FormControl(''),
      'date':new FormControl(''),
      //'amount':new FormControl(''),
    })
    return group;
  }
  buttondisabled:number;
  stagingadd(){
    let a=this.ruleform.get('ruleadd').value;
    console.log("index number",);
    let add=this.ruleform.get('ruleadd')as FormArray
    add.push(this.ruleadd());
    this.buttondisabled = this.ruleform.value.ruleadd.length;
    console.log(this.buttondisabled)
   

    } 
    removerule(index){
      var form = this.ruleform.get('ruleadd') as FormArray;
    form.removeAt(index);
    this.buttondisabled = this.ruleform.value.ruleadd.length;
     console.log(this.buttondisabled)
    }
}


class Template {
  template: string;
  file_type: any;
}


import { Directive } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap, filter } from 'rxjs/operators';
import { error } from 'console';
import { element } from 'protractor';
import { HttpErrorResponse } from '@angular/common/http';

@Directive({
  selector: '[Numberonly]',

})

export class NumberonlyDirective implements OnInit {
  constructor() {
    console.log('Numberonly triggered')
  }

  ngOnInit(): void {

  }
}