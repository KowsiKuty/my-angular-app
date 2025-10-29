import { Component, ElementRef, OnInit,Renderer2,ViewChild } from '@angular/core';
import { ProofingService } from '../proofing.service';
import { Observable, Notification } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proofing-master',
  templateUrl: './proofing-master.component.html',
  styleUrls: ['./proofing-master.component.scss']
})
export class ProofingMasterComponent implements OnInit {
  proofUrl = environment.apiURL
  @ViewChild('withreportInput')colref_int:any ;
  @ViewChild('withoutreportInput')without_int:any ;
  @ViewChild('account') accountscroll: MatAutocomplete
  @ViewChild('accountwith') accountwithcroll: MatAutocomplete
  @ViewChild("navTabs", { static: false }) navTabs: ElementRef;
  templateList: Array<any>=[];
  accountList: Array<any>=[];
  rulelist = []
  agingbucketlist:Array<any> = []
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  RuleForm: FormGroup
  AgingForm: FormGroup
  TemplateForm: FormGroup
  AccountForm: FormGroup
  reportForm: FormGroup
  isAgingreport:boolean=false;
  isLoading:boolean=false;
  temppagination:boolean=false;
  rulepagination:boolean=false;
  accounpagination:boolean=false;
  iswith:boolean=false;
  iswithout:boolean=false;
  isTemplate: boolean = false;
  selectedRadioValue: any = 1;
   radiolist:any =[{"name":"Report Based With Group","id":1,"value":true},{"name":"Report Based Without Group","id":2,"value":false}]
   addbutton:any
   tempbutton:any
   rulebutton:any
   agingbutton:any
   subModuleList = [ { name: 'Template', url: '/template', active: true }, { name: 'Rules', url: '/rule', active: false },
    { name: 'Account', url: '/account', active: false },
    { name: 'Aging Bucket', url: '/aging', active: false }];
   isRule = false;
  constructor(private proofingService: ProofingService, private fb: FormBuilder,
    private notification: NotificationService, private spinner: NgxSpinnerService,
    private router: Router, private shareService: ShareService,private renderer: Renderer2) { 

  

    }

  ngOnInit(): void {
    // this.getTemplate();
    // this.getAccountList();
    const defaultTab = this.subModuleList.find(sub => sub.active);
    if (defaultTab) {
      this.isTemplate = defaultTab.name === 'Template';
      this.subModuleData(defaultTab);
    }
  }
  templatereset(){
    this.TemplateForm.reset('');
    this.getTemplate();
  }
  getTemplate(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      let params:any=pageNumber
      if(this.TemplateForm.get('template_name').value){
        params+=this.formtoparams(this.TemplateForm.value)
      }
    this.spinner.show()
    this.proofingService.getTemplateList(filter, sortOrder, params, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        if(results['code']!=null && results['code']!=undefined && results['code']!=''){
            this.spinner.hide();
            this.notification.showError(results['code']);
            this.notification.showError(results['description']);
        }
        else{
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.templateList = datas;
        for (let i = 0; i < this.templateList.length; i++) {
          let ft = this.templateList[i].file_type
          if (ft == undefined) {
            this.templateList[i].file_name = ''
          } else {
            this.templateList[i].file_name = ft.text
          };
        }
        if (this.templateList.length >= 0) {
          this.temppagination=true;
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      }
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText);

      })
  }
  // templateEdit(data: any) {
  //   this.shareService.templateEditValue.next(data)
  //   this.router.navigateByUrl('/templateedit', { skipLocationChange: true })
  //   return data;
  // }
  nextClickTemplate() {
    if (this.has_next === true) {
      this.getTemplate("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickTemplate() {
    if (this.has_previous === true) {
      this.getTemplate("", 'asc', this.currentpage - 1, 10)
    }
  }
  deleteTemplate(data) {
    let value = data.id
    this.spinner.show()
    this.proofingService.templateDeleteForm(value)
      .subscribe(result => {
        this.spinner.hide()
        this.notification.showSuccess("Successfully deleted....")
        this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template"}
        // this.getTemplate();
        return true

      }, (error) => {
        this.spinner.hide()
      })
      
  }

  accountreset(){
    this.AccountForm.reset('');
    this.getAccountList("","asc",1,10);
   
  }
  getAccountList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      let params:any =  pageNumber
      if(this.AccountForm.get('account_name').value){
        params+=this.formtoparams(this.AccountForm.value)
      }
      
    this.spinner.show()
    this.proofingService.getAccountList(filter, sortOrder,pageNumber, this.AccountForm.get('account_name').value, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        if(results['code']!=null && results['code']!=undefined && results['code']!=''){
             this.spinner.hide();
             this.notification.showError(results['code']);
             this.notification.showError(results['description'])
        }
        else{
        let datas = results["data"];
        this.accountList = datas;
        console.log("account", this.accountList)
        for (let i = 0; i < this.accountList.length; i++) {
          let temp = this.accountList[i].template
          if (temp == undefined) {
            this.accountList[i].template_name = ''
          } else {
            this.accountList[i].template_name = temp.template
          };
        }
        let datapagination = results["pagination"];
        this.accountList = datas;
        if (this.accountList.length >= 0) {
          this.accounpagination=true;
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      }
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText);
      })
  }

  // accountEdit(data: any) {
  //   this.shareService.accountEditValue.next(data)
  //   this.router.navigateByUrl('/accountEdit', { skipLocationChange: true })
  //   return data;
  // }
  deleteAccount(data) {
    let value = data.id
    console.log("valueeee", value)
    this.spinner.show()
    this.proofingService.acctDeleteForm(value)
      .subscribe(result => {
        this.spinner.hide()
        this.notification.showSuccess("Successfully deleted....")
        // this.getAccountList();
        this.SummaryApiaccountmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/accounts"}

        return true

      }, (error) => {
        this.spinner.hide()
      })
  }
  nextClickAccount() {
    if (this.has_next === true) {
      this.getAccountList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickAccount() {
    if (this.has_previous === true) {
      this.getAccountList("", 'asc', this.currentpage - 1, 10)
    }
  }
  Rulereset(){
    this.RuleForm.reset('');
    this.getrulelist();
  }
  getrulelist(page = 1) {
    let params = 'page=' + page
    this.spinner.show();
    params+=this.formtoparams(this.RuleForm.value)
    this.proofingService.getruleslist(params).subscribe(results => {
      this.spinner.hide();
      if(results.code!=undefined && results.code!="" && results.code!=null){
        this.notification.showError(results.code)
        this.notification.showError(results.description);
        this.rulelist=[];
      }
      else{
      this.rulelist = results['data']
      let datapagination = results["pagination"];

      if (this.rulelist.length >= 0) {
        this.rulepagination=true;
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    }
    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status+error.statusText);
    })
  }
  scrollLeft() {
    this.navTabs.nativeElement.scrollBy({ left: -200, behavior: "smooth" });
  }

  scrollRight() {
    this.navTabs.nativeElement.scrollBy({ left: 200, behavior: "smooth" });
  }
  agingreportdownload(data){
    let accountid=data.id;
    let timeline=data.timeline;
    let parms ={
      'account_id':accountid,
      'timeline':timeline
    }
    this.spinner.show();
    this.proofingService.agingreport_download(parms)
      .subscribe(fullXLS=> {
        // this.spinner.hide();
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'AgingReport'+ date +".xlsx";
        link.click();
        this.spinner.hide();
        this.notification.showSuccess("Successfully Downloaded")
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText)
      })
      }
      Agingreset(){
        this.AgingForm.reset('');
        this.getaginglist()
      }
  getaginglist(page = 1) {
    let params = 'page=' + page
    this.spinner.show();
    params+=this.formtoparams(this.AgingForm.value);
    this.proofingService.getbucketslist(params).subscribe(results => {
      this.spinner.hide()
      if(results.code!=''&&results.code!=undefined&&results.code!=null){
        this.notification.showError(results.description);
        this.notification.showError(results.code);
      }
      else{
      this.agingbucketlist = results['data']
      let datapagination = results["pagination"];

      if (this.agingbucketlist.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    }
    }
      , (error:HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText)
      })
  }

  formtoparams(params) {
    Object.keys(params).forEach(key => !params[key] ? delete params[key] : '')
    return '&' + new URLSearchParams(params).toString()
  }


  url: string;
  urlTemplate: string;
  urlAccount: string;
  urlRule = ''
  urlAging = null
  makerNameBtn: any;

  isAccount: boolean = false;

  isAging = false;
  isTemplateForm: boolean;
  isTemplateEditform: boolean;
  isAccountForm: boolean;
  isRuleform: boolean;
  isAgingform: boolean;
  ismakerCheckerButton: boolean;

  setActiveTab(selectedSub: any) {
    console.log("Tab clicked:", selectedSub);
    this.subModuleList.forEach(sub => sub.active = false);
    selectedSub.active = true;
    this.isTemplate = selectedSub.name === 'Template';
    this.subModuleData(selectedSub)
 
  }

  subModuleData(data) {
    this.hidetemplates()
    this.url = data.url;
    this.urlTemplate = "/template";
    this.urlAccount = "/account";
    this.urlRule = "/rule"
    this.urlAging = "/aging"
    this.isTemplate = this.urlTemplate === this.url ? true : false;
    this.isAccount = this.urlAccount === this.url ? true : false;
    this.isRule = this.urlRule === this.url ? true : false;
    this.isAging = this.urlAging === this.url ? true : false;
    this.makerNameBtn = data.name;
    
    this.addbutton = [
      { icon: "add", function: this.addForm.bind(this), "tooltip": `Create New ${this.makerNameBtn}` }]


      this.tempbutton = [
        { icon: "add", function: this.addForm.bind(this), "tooltip": `Create New ${this.makerNameBtn}` }]

this.rulebutton = [
  { icon: "add", function: this.addForm.bind(this), "tooltip": `Create New ${this.makerNameBtn}` }]


  this.agingbutton = [
    { icon: "add", function: this.addForm.bind(this), "tooltip": `Create New ${this.makerNameBtn}`},{function: this.agingReport.bind(this),"name": "Reports"},{function: this.agingedit.bind(this, { id: 'acc_matching' }), "name": "Incorporate with Accounts"} ]

    if (this.isTemplate) {
      this.TemplateForm = this.fb.group({
        template_name: ['']
      })
      // this.getTemplate();
      this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template"}
      this.isTemplateForm = false;
      this.isTemplateEditform = false;
      this.isAccountForm = false;
      this.ismakerCheckerButton = true;
      this.isAgingreport=false;
    }
    if (this.isAccount) {
      this.AccountForm = this.fb.group({
        account_name: []
      })
      // this.getAccountList();
      this.SummaryApiaccountmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/accounts"}
      this.isTemplateForm = false;
      this.isTemplateEditform = false;
      this.isAccountForm = false;
      this.isAgingreport=false;
      this.ismakerCheckerButton = true;
    }
    if (this.isRule) {
      this.RuleForm = this.fb.group({
        rulename: ['']
      })
      // this.getrulelist()
      this.SummaryApirulesmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary"}
      this.hidetemplates();
      this.isRule = true;
      this.ismakerCheckerButton = true;
      this.isAgingreport=false;
    }
    if (this.isAging) {
      this.AgingForm = this.fb.group({
        name: ['']
      })
      // this.getaginglist()
      this.SummaryApimasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary"}
      this.hidetemplates();
      this.isAging = true;
      this.ismakerCheckerButton = true;
      this.reportForm=this.fb.group({
        accountno:[''],
        with_accountno:['']
      })
    }
  }



  addForm() {
    this.ismakerCheckerButton = false;
    if (this.makerNameBtn === "Template") {
      this.isTemplate = false;
      this.isTemplateForm = true;
      this.isTemplateEditform = false;
      this.isAccountForm = false;
      this.shareService.templateEditValue.next(null)

    } else if (this.makerNameBtn === "Account") {
      this.isAccount = false;
      this.isTemplateForm = false;
      this.isTemplateEditform = false;
      this.isAccountForm = true;
      let data = "";
      this.shareService.accountEditValue.next(data)
      // this.ismakerCheckerButton=false;
    }
    else if (this.makerNameBtn === "Rules") {
      this.hidetemplates();
      this.isRule = false;
      this.isRuleform = true;
      this.shareService.ruleEditValue.next(null)
      this.shareService.ruleEditValues.next(null);

    }
    else if (this.makerNameBtn === "Aging Bucket") {
      this.hidetemplates();
      this.isAging = false;
      this.isAgingform = true;
      this.shareService.agingEditValue.next(null)
    }
  }


  tempCancel() {
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
    this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template"}
  }
  ruleCancel() {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.isRule = true;
    this.isRuleform = false;
    this.ismakerCheckerButton = true;
    this.SummaryApirulesmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary"}
  }

  ruleSubmit() {
    this.hidetemplates();
    this.isRule = true;
    this.ismakerCheckerButton = true;
    // this.getrulelist();
    this.SummaryApirulesmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary"}
  }

  agingCancel() {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.isRule = false;
    this.isRuleform = false;
    this.isAging = true;
    this.isAgingform = false;
    this.ismakerCheckerButton = true;
    this.SummaryApimasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary"}
  }

  agingSubmit() {
    this.hidetemplates();
    this.isAging = true;
    this.ismakerCheckerButton = true;
    // this.getaginglist();
    this.SummaryApimasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary"}
  }
  tempSubmit() {
    this.hidetemplates()
    this.isTemplate = true;
    this.ismakerCheckerButton = true;
    // this.getTemplate();
    this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template"}
  }
  temEditCancel() {
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
  }

  tempeditSubmit() {
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
    // this.getTemplate();
    this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template"}

  }

  templateEdit(data) {
    this.isTemplate = false;
    this.isTemplateForm = true;
    this.isAccountForm = false;
    this.isAccount = false;
    this.ismakerCheckerButton = false;
    this.shareService.templateEditValue.next(data)
    return data;

  }
  accountEdit(data) {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = true;
    this.isAccount = false;
    this.ismakerCheckerButton = false;
    this.shareService.accountEditValue.next(data)
    return data;
  }
  acountCancel() {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = true;
    this.ismakerCheckerButton = true;
    this.SummaryApiaccountmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/accounts"}
  }
  acountSubmit() {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = true;
    this.ismakerCheckerButton = true;
    // this.getAccountList();
    this.SummaryApiaccountmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/accounts"}
  }

  hidetemplates() {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm = false;
    this.isAccount = false;
    this.isRuleform = false;
    this.isAgingform = false;
  }

  ruleedit(data) {
    console.log("Edit Data",data)
    this.hidetemplates();
    this.isRule = false;
    this.isRuleform = true;
    this.shareService.ruleEditValues.next(this.isRuleform);
    this.shareService.ruleEditValue.next(data.id);
  }

  ruledelete(rule) {
    let payload = { 'delete': { 'id': rule.id } };
    this.spinner.show()
    this.proofingService.deletetemplate(payload).subscribe(res => {
      this.spinner.hide()
      if (res?.status == 'success') {
        this.notification.showSuccess('Rule Deleted Successfully')
        this.SummaryApirulesmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary"}
        // this.getrulelist()
      }
      else {
        this.notification.showError(res.description)
      }
    }, (error) => {
      this.spinner.hide()
    })
    
  }

  agingedit(data) {
    this.hidetemplates();
    this.ismakerCheckerButton = false;
    this.isAging = false;
    this.isAgingform = true;
    this.shareService.agingEditValue.next(data.id);
  }

  agingdelete(data) {
    let payload = { data: [{ id: data.id, delete: 0 }] }
    this.spinner.show()
    this.proofingService.createbucket(payload).subscribe(res => {
      this.spinner.hide()
      if (res?.status == 'success') {
        this.notification.showSuccess('Bucket Deleted Successfully');
        // this.getaginglist()
        this.SummaryApimasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary"}
      }
      else {
        this.notification.showError(res.description)
      }
    }, (error) => {
      this.spinner.hide();
    })
    
  }
  agingReport(){
    this.isAgingreport=true;
    this.isAging=false;
    this.iswith=true;
    this.presentpage=1;
    this.selectedRadioValue = 1
  }

  backAgingreport(){
    this.isAgingreport=false;
    this.isAging=true;
    this.iswith=false;
    this.iswithout=false;
    this.chiplist=[];
  }
  chipSelected=[];
  with_chipSelected=[];
  chiplist=[];
  withtag_chiplist=[];
  report_accountid=[];
  withreport_accountid=[];
  visible = true;
  selectable = true;
  removable = true;
  searchproofmasvar :any = "String";
  searchprooftempsvar:any = "String";
  searchproofaccsvar:any = "String";
  searchagingvar:any = "String";
  separatorKeysCodes: number[] = [ENTER, COMMA];
  check_para(){
    if(this.reportForm.get('accountno').value){
      this.reportForm.get('accountno').valueChanges
      .pipe(
       debounceTime(1000),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
       }),
       switchMap(value => this.proofingService.getAccountList("","", 1,
        typeof(value)!='object' && value != undefined ? value:'')
      //  switchMap(value => this.proofingService.getAccountList("", "", '1&account_name='+value)
       .pipe(
         finalize(() => {
           this.isLoading = false
         }),)
       )
     )
     .subscribe((results: any[]) => {
       let datas = results['data'];
       this.chipSelected = datas
       console.log("Account List", this.chipSelected)
     });
    }
    this.proofingService.getAccountList("","",this.presentpage,'').subscribe(res=>{
      console.log(res['data']);
      this.chipSelected=this.chipSelected.concat(res['data']);

      if(this.chipSelected.length>0){
        let pagination=res['pagination'];
        this.has_next=pagination.has_next
        this.has_previous=pagination.has_previous
        this.presentpage=pagination.index
      }
    });
  }
  
  clickreport(e,index){
    if(e == 1){
      this.iswith=true;
      this.iswithout=false;
      this.chiplist=[];
      this.report_accountid=[];
    }
    if(e == 2){
      this.iswithout=true;
      this.iswith=false;
      this.chiplist=[];
      this.report_accountid=[];
    }
    // this.iswith=e
    // this.iswithout=e
    // this.typelist=e.value;
  
    // window.location.reload();
  }
  remove(chip){
    const index = this.chiplist.indexOf(chip);
    const indexid=this.report_accountid.indexOf(chip);

    if (index >= 0 || indexid >= 0) {
      this.chiplist.splice(index, 1);
      this.report_accountid.splice(index,1);
    }
   }
  selectdropdown(event)  {
    const value =event.account_number;
    const id =event.id;
    // this.report_accountid=id;
    
    if (value && !this.chiplist.includes(value)) {
      this.chiplist.push(value);
      this.report_accountid.push(id);  
    }
    else{
      this.notification.showWarning("Already_EXISTS")
    }
    this.chipSelected.push(value);
    // this.colref_int.nativeElement.value='';
    document.getElementById('btnDwnld').focus();
  }
  acc_show(element) {
    let value = `${element?.name} :  ${element?.account_number}`
    return element ? value : ''
  }
  
  reportdownload(){
    // console.log(this.report_accountid);
    // let params= {
    //   'account_id':this.report_accountid,
    
    // }
    // this.proofingService.bucketreport_dwn(params)
    //   .subscribe(res=>{
    //     let binaryData = [];
    //     binaryData.push(res)
    //     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //     let link = document.createElement('a');
    //     link.href = downloadUrl;
    //     // link.download = data.file_name;;
    //     link.click();
    //   });
    // let name = 'Aging Report'
    let params = {
      "account_id": this.report_accountid,
      // "timeline":data.timeline,
    }
    this.spinner.show();
    this.proofingService.bucketreport_dwn(params)
      .subscribe(fullXLS=> {
        console.log(fullXLS);
        if (fullXLS['type']=='application/json'){
          this.spinner.hide()
          this.notification.showError("Account Not Mapped in Bucket");
        //   const reader = new FileReader();

        // reader.onload = (event: any) => {
          // const fileContent = event.target.result;
          // Handle the file content here
          // console.log(fileContent);
          // let DataNew:any=JSON.parse(fileContent);
          // this.notification.showError(DataNew.code);
          // this.notification.showError(DataNew.description);
        // };

        // reader.readAsText(result);
         }
        else{
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'BucketReportNotag'+ date +".xlsx";
        link.click();
        this.spinner.hide()
        this.notification.showSuccess("Successfully Downloaded");
        
      }
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText)
      })
      }
      open() {
        // this.accountscroll._getScrollTop.subscribe(() => {
        //   const panel = this.accountscroll.panel.nativeElement;
        //   panel.addEventListener('scroll', event => this.scrolled(event));
        // })
        this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
          // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
          let evet = this.accountscroll.panel.nativeElement
          this.scrolled(evet)
        });
    
      }
      scrolled(scrollelement) {
        let value = scrollelement;
        const offsetHeight = value.offsetHeight;
        const scrollHeight = value.scrollHeight;
        const scrollTop = value.scrollTop;//current scrolled distance
        const upgradelimit = scrollHeight - offsetHeight - 10;
        if (scrollTop > upgradelimit && this.has_next && !this.isLoading) {
          this.presentpage += 1;
          this.check_para();
        }
        // else if(this.has_previous==true){
        //   this.presentpage -= 1;
        //   this.check_para();
        // }
    
      }
      report_withdownload(){
        let params = {
          "account_id": this.report_accountid,
          // "timeline":data.timeline,
        }
        this.spinner.show();
        this.proofingService.bucketreport_withgrpby(params)
          .subscribe(fullXLS=> {
            console.log(fullXLS);
            if (fullXLS.type=='application/json'){
              this.spinner.hide()
              this.notification.showError("Account Not Mapped in Bucket");
             }
            else{
            let binaryData = [];
            binaryData.push(fullXLS)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'BucketReportWithtag'+ date +".xlsx";
            link.click();
            this.spinner.hide()
            this.notification.showSuccess("Successfully Downloaded");
          }
          },
          (error)=>{
            this.spinner.hide();
            this.notification.showWarning(error.status+error.statusText)
          })
    
      }

      SummarymasterData:any = [{"columnname": "Bucket Name", "key": "name"}, { "columnname": "Time Frames", "key": "timeline"},{
        columnname: "Edit",
        key: "action",
        icon: "edit", 
        button: true,
        style:{color: "gray",cursor:"pointer"},
        function: true,
        clickfunction: this.agingedit.bind(this)
      },{ columnname: "delete",
      key: "action",
      icon: "delete", 
      button: true,
      style:{color: "gray",cursor:"pointer"},
      function: true,
      clickfunction: this.agingdelete.bind(this)}]

      SummaryApimasterObjNew: any = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary"}

      SummarytemplatemasterData:any = [{"columnname": "Template", "key": "template"},{"columnname": "Edit", "key": "edits",
      icon: "edit", 
      button: true,
      style:{color: "gray",cursor:"pointer"},
      function: true,
      clickfunction: this.templateEdit.bind(this)}, {"columnname": "Action", "key": "deleted",icon: "delete", 
      button: true,
      style:{color: "gray",cursor:"pointer"},
      function: true,
      clickfunction: this.deleteTemplate.bind(this)}]


      SummaryApitmpmasterObjNew:any = {"method": "get", "url": this.proofUrl + "prfserv/template"}

      SummaryaccountmasterData:any = [{"columnname": "Account Number", "key": "account_number"},{"columnname": "Template Name", "key": "template"},{"columnname": "Name", "key": "name"},{"columnname": "Closing Balance","key": "closing_bal"},{"columnname": "Partially Mapped", "key": "allow_partmap"},{"columnname": "Edit","key": "accountedit", icon: "edit", 
        button: true,
        style:{color: "gray",cursor:"pointer"},
        function: true,
        clickfunction: this.accountEdit.bind(this)},
        {"columnname": "delete", "key": "accountdeleted",icon: "delete", 
        button: true,
        style:{color: "gray",cursor:"pointer"},
        function: true,
        clickfunction: this.deleteAccount.bind(this)}]
      //   {"columnname": "Excel Upload Template Name", "key": "wisefin_template", "type":"object", "objkey": "template"},
      // {"columnname": "Data Fetch Template Name", "key": "cbs_template", "type": "object", "objkey": "template"},
  

      SummaryApiaccountmasterObjNew:any = {"method": "get", "url": this.proofUrl + "prfserv/accounts"}


      SummaryrulesmasterData:any = [{"columnname": "Template Name", "key": "template"},{"columnname": "Rule Name", "key": "rule_name"}, {"columnname": "Date","key": "date", "type": 'Date',"datetype": "dd-MMM-yyyy"},{"columnname": "Edit","key": "ruleedit",icon: "edit", 
      button: true,
      style:{color: "gray",cursor:"pointer"},
      function: true,
      clickfunction: this.ruleedit.bind(this)},
      {"columnname": "delete", "key": "ruledeleted",icon: "delete", 
      button: true,
      style:{color: "gray",cursor:"pointer"},
      function: true,
      clickfunction: this.ruledelete.bind(this)}]

      SummaryApirulesmasterObjNew:any = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary"}

      proofmastersearch:any = [{"type":"input","label":"Rule Name","formvalue":"rulename"},{"type":"input","label":"Template Name","formvalue":"temp_name"}]

      prooftempsearch:any = [{"type":"input","label":"Template Name","formvalue":"template_name"}]

      agingsearch:any = [{"type":"input","label":"Bucket Name","formvalue":"name"}]

      searchproofmasupload(prof){
        this.SummaryApirulesmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary","params": prof}
      }


      searchprooftempsupload(temp){
      this.SummaryApitmpmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/template", "params": temp}
      }

      proofaccsearch:any = [{"type":"input","label":"Account Number","formvalue":"account_name"},{"type":"input","label":"Template Name","formvalue":"temp_name"}]
      searchproofaccupload(acc){ 
      this.SummaryApiaccountmasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/accounts","params": acc}
      }

      searchagingsupload(aging){
        this.SummaryApimasterObjNew = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary", "params": aging}
      }

      excelfn(data){
        let config: any = {
          disabled: false,
          style: '',
          icon: '',
          class: '',
          value:'Excel',
          function:false
        };
        return config
      }



    }

