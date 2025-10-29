import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { ShareService } from '../share.service';
import { Router } from '@angular/router'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize,flatMap, map } from 'rxjs/operators';
import { ProofingService } from '../proofing.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
// export interface ac_type{
//   id:any,
//   name:any
// }
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  proofUrl = environment.apiURL
  tempid = null
  maximumruleselected: boolean;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild("closeaddpopup") closeaddpopup;
  AddForm: FormGroup;
  bulkcreation_form:FormGroup;
  ctrltemplate = new FormControl();
  inputaccount:any={label: "Select Rules"}
  isLoading = false;
  templateList=[];
  cbsvalue: any
  rulehasnext = false;
  templateText: string
  images: any;
  AccountType=[{"id":1,"type":"Excel Upload"},{"id":2,"type":"Data Fetch"}]
    acceptfiles = { EXCEL: '.xls, .xlsx, .xlsm, .csv' }
  account_Id: any = '';
  account_data : any;
  delimiter = null;
  del_occurence = null;
  rulename = null;
  ruletype = null;
  rulepage = 1;
  ruleslist = []
  SummaryaccountData:any
  SummaryApiaccountObjNew:any
  excel_ac_file: File;
  default = 'abcd';
  noofchars: any;
  ruledescription: any;
  selectedrules =[];
  selectedrulesres = [];
  datafeth:boolean = false
  execeldata:boolean = false
  dataaasfetch:any
  restformexcel:any
  restformdatafetch:any
  templatedata:any
  templatename:any
  filteredToppings!: Observable<string[]>;
  selectedToppings: string[] = [];
  acounttypepay=[
    {'id':0,'name':"Payble"},
    {'id':1,'name':"Receivable"},
    {'id':2,'name':"AR's"},
    {'id':3,'name':"SY's"},
    {'id':4,'name':"Suspense"},
    {'id':5,'name':"Deferred"},
  ]
  acc_type_patch={1:"Payble",2:"Receivable",3:"AR's",4:"SY's",5:"Suspense",6:"Deferred"}
  account_risk=[
    {'id':0,'name':'HIGH', value: "HIGH"},
    {'id':1,'name':'LOW', value: "LOW"},
    {'id':2,'name':'MEDIUM', value: "MEDIUM"},
  ]
  acc_risk_patch={1:"HIGH",2:"LOW",3:"MEDIUM"}
  acc_Category=[
    {'id':0,'name':"Normal"},
    {'id':1,'name':"InterBranch"},
    {'id':2,'name':"Intergroup"},
    {'id':3,'name':"Contract"},
    {'id':4,'name':"Integrity"},
    {'id':5,'name':"P&L"},
    {'id':6,'name':"No Proof a/c"},
  ]
  acc_cat_patch={1:"Normal",2:"InterBranch",3:"Intergroup",4:"Contract",5:"Integrity",6:"P&L",7:"No Proof a/c"}
  bulk_upload = [{
    'id': 0, 'name': 'ExcelUpload'
  },
  {
    'id': 1, 'name': 'Data Fetch'
  }]
  templates: File;
data: any;
  excel: File;
  @ViewChild('fileLabel') fileLabel!: ElementRef;
  constructor(private formBuilder: FormBuilder, private shareService: ShareService,
    private router: Router,
    private proofservice: ProofingService,private notification: NotificationService,private spinner:NgxSpinnerService,private shareservice: ShareService) { 
     
      this.SummaryaccountData = [{ "columnname": "Name", "key": "rule_name"},{ "columnname": "Preview", "key": "statuus","icon":"visibility" , button:true, function: true,
 clickfunction:this.previewrules.bind(this)}]

    }

  ngOnInit(): void {
    

    this.tempid = this.shareservice.templateEditValue.value;
    // this.tempid = this.tempid?.id;
    console.log("afsasxcxjkcds", this.tempid)
    this.AddForm = this.formBuilder.group({
      'account_number': ['', Validators.required],
      'name': ['', Validators.required],
      'ctrltemplate' :'',
      'ctrltemplate1':'',
      'accountrisk':new FormControl(''),
      'accounttype':new FormControl(''),
      'unitcode':new FormControl(''),
      'accountowner':new FormControl(''),
      'accountcat':new FormControl(''),
      'slectrules': new FormControl(''),
      'delimiter': new FormControl(''),
      'templateType': new FormControl(''),
     'Partially_Mapped_Entries': [true],
     'closingbalance':new FormControl(0),
     'acc_temp_dropdown': new FormControl(''),
    });
    this.bulkcreation_form=this.formBuilder.group({
      'excel':[''],
      'template':[''],
      'wisefintemplate':[''],
      'cbstemplate_id':['']
    })

    this.AddForm.get('slectrules').valueChanges.subscribe(value => {
      const query = typeof value === 'string' ? value : '';
      this.filterRules(query);
    });
    this.getacount();
    let tempkeyvalue: String = "";
    this.getTemplate(tempkeyvalue);

    this.AddForm.get('ctrltemplate').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.proofservice.getTemplate(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.templateList = datas;
        console.log("template", datas)

      })

  }
  ctrltemplate1:any
  accounttype:any
  accountrisk:any
  accountid:any
  data_id: number[] = [];
  displayRules:any
  chipselect(data: any) {
    console.log("Selected Data:", data);
    this.templatename=data?.template
    this.templatedata = data?.template || null;
    let temp: any = this.shareService.accountEditValue.value;
if(temp.template != data.template){
  this.AddForm.get('slectrules')?.reset()
}
    // this.inputaccount = {
    //   label: "Select Rules",
    //   method: "get",
    //   url: this.proofUrl + "prfserv/rule_summary",
    //   params: "&temp_name="+ this.templatename,
    //   searchkey: "rulename",
    //   displaykey: "rule_name",
    //   Outputkey: "id",
    // }
  }


  getacount() {
    let data: any = this.shareService.accountEditValue.value;

    this.accountid = data.id
    this.templatename=data.template
this.proofservice.editAccountform(data.id)
.subscribe(res => {
  if (res && res.data) {
    const rules = res.data[0].rule_engine_data;
    const uniqueIds = new Set<number>();
    this.displayRules = [];
  
    for (let rule of rules) {
      if (rule && rule.id && !uniqueIds.has(rule.id)) {
        uniqueIds.add(rule.id);
        this.data_id.push(rule.id);
        this.displayRules.push({ id: rule.id, rule_name: rule.rule_name });
      }
    }
  
    console.log("Unique Data IDs:", this.data_id);
    console.log("Display Rules:", this.displayRules);
  } else {
    console.error("data property is missing in response");
  }
    if (res != '') {
      const ruleData = res.data[0].rule_engine_data.map(rule => ({
        id: rule.id,
        rule_name: rule.rulename
      }));
      this.selectedrules = ruleData;
      this.AddForm.patchValue({
        account_number: res.data[0].account_number,
        name: res.data[0].name,
        'unitcode':res.data[0].unit_code,
        'accountowner':res.data[0].account_owner,
        templateType: this.cbsvalue,
        Partially_Mapped_Entries: res.data[0].allow_partmap,
        // 'accountrisk':{'name':this. acc_risk_patch[(data.account_risk)],'id':Number(data.account_risk)},
        // 'accounttype':{'name':this.acc_type_patch[data.account_type],'id':Number(data.account_type)}
         accountrisk: this.account_risk[Number(res.data[0].account_risk)],
         accounttype:this.acounttypepay[Number(res.data[0].account_type)],
         accountcat:this.acc_Category[Number(res.data[0].account_category)],
         closingbalance: res.data[0].closing_balance,
         acc_temp_dropdown :res.data[0].template,
         slectrules: ruleData
      });
      console.log("sdsdsa===",res.data[0].account_type )
      console.log("sdsdsa===",res.data[0].account_risk )
      // this.AddForm.get('accountrisk').patchValue({"name":this. acc_risk_patch[(data.account_risk)],"id":Number(data.account_risk)});
      // console.log(this.AddForm)
      this.selectedrules = res.data[0].rule_engine_data;
      console.log("sds====",   this.selectedrules)
      this.templatedata=res.data[0].template
    }
    else {
      this.account_Id = ''

    }
    this.datafetchedfield = {
      label: "Data Fetch Template",
      method: "get",
      url: this.proofUrl + "prfserv/template",
      params: "",
      searchkey: "query",
      displaykey: "template",
      outpukey:"id",
      defaultvalue:res.data[0].cbs_template,
    }
    this.exceldatafield = {
      label: "Excel upload Template",
      method: "get",
      url: this.proofUrl + "prfserv/template",
      params: "",
      searchkey: "query",
      displaykey: "template",
      outputkey: "id",
      defaultvalue:res.data[0].wisefin_template,
    }

    // this.acc_template_drop= {
    //   label: "Template",
    //   searchkey: "query",
    //   displaykey: "template",
    //   url: this.proofUrl + "prfserv/template",
    //   // formcontrolname: "acc_temp_dropdown",
    //   defaultvalue:res.data[0].template,
    //   wholedata:true
    // }
    // this.risktype  = {label: "Account Risk", fronentdata: true, data: this.account_risk, params: "", "searchkey": "", "displaykey": "name",  required: true,defaultvalue:this.accountrisk}
    // const ids = data.rules.map(item => item.rule_id);
    // let rulesid = data.rules[0].rule_id
     
    this.risktype = { label: "Account Risk", fronentdata: true, data: this.account_risk, "displaykey": "name",  outputkey: "id", valuekey: "id", defaultvalue: Number(res.account_risk), required: true,}
    this.inputaccount = {
      label: "Select Rules",
      method: "get",
      url: this.proofUrl + "prfserv/rule_summary",
      params:"&temp_name="+ this.templatename,
      searchkey: "rulename",
      displaykey: "rulename",
      Outputkey: "id",
      defaultvalue: this.selectedrules 
    }
    
    console.log("dsfdsf===", this.inputaccount)
  })
  
  }
  public displayFn(template): string | undefined {
    console.log('id', template.id);
    console.log('name', template.template);
    return template ? template.template : undefined;
  }


  public displayFn1(template): string | undefined {
    console.log('id', template.id);
    console.log('name', template.template);
    return template ? template.template : undefined;
  }
  public displayType(template): string | undefined {
    // console.log('id', template.id);
    // console.log('name', template.template);
    return template ? template.type : undefined;
  }

  get template() {
    return this.AddForm.get('ctrltemplate');
  }


  
  createFormate() {
    let data = this.AddForm.controls;
    const selectedRules = this.AddForm.get('slectrules').value || [];
  
    let memoclass = new Memo();
    memoclass.account_number = data['account_number'].value;
    memoclass.name = data['name'].value;
    memoclass.unit_code = data['unitcode'].value;
    memoclass.account_owner = data['accountowner'].value;
    memoclass.account_risk = data['accountrisk'].value?.id;
    memoclass.account_category = data['accountcat'].value?.id;
    memoclass.account_type = data['accounttype'].value?.id;
    memoclass.allow_partmap = this.AddForm.value.Partially_Mapped_Entries ? 1 : 0;
    memoclass.gl_bal = data['closingbalance'].value;
  
    if (!this.account_Id) {
      memoclass.rules = selectedRules.map(rule => rule.id);
      memoclass.temp_name = data['acc_temp_dropdown'].value?.template || '';
    } else {
      memoclass.rules = selectedRules.map(rule => rule.id);
      memoclass.temp_name = data['acc_temp_dropdown'].value || '';
    }
  
    console.log("MemoClass", memoclass);
    return memoclass;
  }
  
  private getTemplate(tempkeyvalue) {
    console.log("templatename", tempkeyvalue)
    this.proofservice.getTemplate(tempkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.templateList = datas;
        console.log("templatename", datas)

      })
  }
  acc_template_drop:any= {
    label: "Template",
    searchkey: "query",
    displaykey: "template",
    url: this.proofUrl + "prfserv/template",
    formcontrolname: "acc_temp_dropdown",
   wholedata:true
  }

  submitForm() {
    let arr = [];
    this.account_data =this.AddForm.value
    console.log("Account FORM", this.account_data)

      this.spinner.show();
      this.proofservice.creatAccountForm(this.createFormate(),this.accountid)
      .subscribe(res => {
        this.spinner.hide();
   

        if(res['status']=='success'){
          this.notification.showSuccess(res.message);
          this.onSubmit.emit();
          this.shareService.accountEditValue.next('');
        }
        else{
          this.notification.showError(res.description)
        }
        // console.log("creatAccountForm", res);
        // this.onSubmit.emit();
        // this.router.navigate(['/ProofingMaster'], { skipLocationChange: true })

        // return true

      })
  
    
    this.selectedrules.forEach(element => {
      if (this.tempid) {
        arr.push({ id:element.id,template_id: this.tempid, rule_id: element.id })
      }
      else{
        arr.push({ rule_id: element.id })
      }
    })
  }
  onCancelClick() {
    this.onCancel.emit()
    this.shareService.accountEditValue.next('')
    
  }
  fileChange(event, data) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileName = input.files[0].name;
      this.fileLabel.nativeElement.innerText = fileName; // Update label text

      if (data === 'notbulk') {
        this.excel = input.files[0];
        this.images = <File>event.target.files[0];
      } else if (data === 'bulk') {
        this.excel_ac_file = <File>event.target.files[0];
      }
    }
  }
  upload_acc(){

    // let file = this.fileLabel
    if (!this.images) {
      this.notification.showError("Please select a File");
      return false;
    }
    this.spinner.show();
    this.proofservice.bulk_accountupload(this.images).subscribe(result=>{
      // console.log(result);
      this.spinner.hide();
      // if(result?.description){
      //   this.notification.showError(result?.description);
      // }
      // else{
      //   this.spinner.hide();
      //   this.notification.showSuccess(result?.message);
      // }
      if(result?.status=='success'){
        this.notification.showSuccess(result?.message);
        this.closeaddpopup.nativeElement.click();
        const fileInput = document.getElementById('inputGroupFile02') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      
        const fileLabel = document.querySelector('label[for="inputGroupFile02"]') as HTMLLabelElement;
        if (fileLabel) {
          fileLabel.innerText = "Choose file";
        }

        // this.onSubmit.emit();
      }
      else{
        this.notification.showError(result?.description);
        this.spinner.hide();
      }
    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status+error.message);
    })
  }
  template_download(){
    this.spinner.show();
    this.proofservice.Template_ac_download().subscribe((fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'AccountTemplate'+ date +".xlsx";
      link.click();
      this.spinner.hide()
      this.notification.showSuccess("Successfully Downloaded")
    }),
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status + error.statusText);
    })
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



  previewrules(rule) {
    // this.mainindex = ind1
    // this.previewindex = ind2
    // this.spinner.show()
    console.log("da=====>", rule)
    this.proofservice.getrule(rule.id).subscribe(res => {
      // this.spinner.hide();
      this.createpreview(res['data'][0])
     
    })
    this.popupopen()
  }
  selectedvalues(data){
this.AddForm.patchValue({
  slectrules:data
})
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("preview"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupbulkopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("bulkupload"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  
  
  ruleselected(data) {
    // data['rule_id']=data.id;
    // this.selectedrules=[this.selectedrules]
    console.log("ssdds===", data)
    console.log("sdasdasdsa",this.AddForm.get("acc_temp_dropdown").value.template)

   

   
  
      this.selectedrules=data;
      // let a=Object(this.selectedrules)
      console.log("chip val",this.selectedrules);
      // this.selectedrulesres.push(this.selectedrules);
      this.maximumruleselected = false;
      if (this.selectedrules?.length > 4) {
        this.maximumruleselected = true;
      }
      this.dropsuum(data)
      // if(this.selectedrules.length!=0){
      //   this.selectedrules.push(this.selectedrules)
      // }
    
    
  }
 
  filteredRules: any[] = [];

  filterRules(value) {
    const filterValue =
      typeof value === 'string' ? value.toLowerCase() :
      value?.rule_name ? value.rule_name.toLowerCase() :
      '';
  
    this.filteredRules = this.ruleslist.filter(rule =>
      rule.rule_name.toLowerCase().includes(filterValue)
    );
  }
  
  
  getrules(page = 1) {
    this.spinner.show();
    this.proofservice.getaccountruleslist('page=' + page,this.templatename).subscribe(results => {
      this.spinner.hide();
      if (results.code) {
        this.notification.showError(results.code);
        this.notification.showError(results.description);
        this.ruleslist = [];
        this.filteredRules = [];
        return;
      }
  
      const data = results['data'];
      const datapagination = results['pagination'];
      this.rulehasnext = datapagination?.has_next || false;
  
      // Append new data to ruleslist
      if (page === 1) {
        this.ruleslist = data;
      } else {
        this.ruleslist = [...this.ruleslist, ...data];
      }
  
      this.filterRules(this.AddForm.value || ''); // re-filter after data load
    }, (error: HttpErrorResponse) => {
      this.spinner.hide();
      this.notification.showWarning(error.status + ' ' + error.statusText);
    });
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ruleslist.filter(topping => topping.toLowerCase().includes(filterValue));
  }

  toggleSelection(topping: any) {
    let currentSelections = this.AddForm.get('slectrules').value;
  
    if (!Array.isArray(currentSelections)) {
      currentSelections = [];
    }
  
    const index = currentSelections.findIndex(item => item.rule_name === topping.rule_name);
  
    if (index === -1) {
      currentSelections.push(topping);
    } else {
      currentSelections.splice(index, 1);
    }
  
    this.AddForm.get('slectrules').setValue(currentSelections);
    this.AddForm.get('slectrules').markAsDirty();
  }
  
  
  isSelected(topping: any): boolean {
    const selected = this.AddForm.get('slectrules').value;
    if (Array.isArray(selected)) {
      return selected.some(item => item.rule_name === topping.rule_name);
    }
    return false;
  }
  
  
  displayRuleName = (selected: any): string => {
    if (Array.isArray(selected)) {
      return selected.map(s => s.rule_name).join(', ');
    }
    return selected?.rule_name || '';
  };
  

  dropsuum(rules){
    let ps="&rule_id=" +JSON.stringify(rules)
    this.SummaryApiaccountObjNew = {"method": "get", "url": this.proofUrl + "prfserv/rule_summary", params:ps  }
  }

  exceluploaddata(execel){
this.bulkcreation_form.patchValue({
  cbstemplate_id:execel
})
  }
  exceluploadfield:any = {
    label: "Excel upload Template",
    method: "get",
    url: this.proofUrl + "prfserv/template",
    params: "",
    searchkey: "query",
    displaykey: "template",
    wholedata: true,
    required: true,
  }

  datafetchfield:any = {
    label: "Data Fetch Template",
    method: "get",
    url: this.proofUrl + "prfserv/template",
    params: "" ,
    searchkey: "query",
    displaykey: "template",
    wholedata: true,
    required: true,
  }

  datafetchdata(fetch){
    this.bulkcreation_form.patchValue({
      wisefintemplate:fetch 
  })
  
}

datafetchedfield:any = {
  label: "Data Fetch Template",
  method: "get",
  url: this.proofUrl + "prfserv/template",
  params: "",
  searchkey: "query",
  displaykey: "template",
}

datafetcheddata(fetched){
  this.AddForm.patchValue({
    ctrltemplate1 : fetched
  })
}

exceldatafield: any = {
  label: "Excel upload Template",
  method: "get",
  url: this.proofUrl + "prfserv/template",
  params: "",
  searchkey: "query",
  displaykey: "template",
}

dataexeceldata(execlds){
  this.AddForm.patchValue({
    ctrltemplate : execlds
  })
}

risktype : any  = {label: "Account Risk", fronentdata: true, data: this.account_risk, params: "", "searchkey": "", "displaykey": "name", Outputkey: "name",  required: true}

risksubmit(risk){
  this.AddForm.patchValue({
    accountrisk:risk
  })
}

acctype:any = {label: "Account Type", fronentdata: true, data: this.acounttypepay, params: "", "searchkey": "", "displaykey": "name", Outputkey: "name",  required: true}

accsubmit(risk){
  this.AddForm.patchValue({
    accounttype:risk
  })
}

acccattype:any = {label: "Account Category", fronentdata: true, data: this.acc_Category, params: "", "searchkey": "", "displaykey": "name", Outputkey: "name",  required: true}

acccatsubmit(risk){
  this.AddForm.patchValue({
    accountcat:risk
  })
} 
datafetch(){
  console.log("click data fetch")
this.datafeth = true
this.execeldata = false
}
exceldatass(){
  console.log("click excel fetch")
this.execeldata = true
this.datafeth = false
}

closedpopup() {
  this.closeaddpopup.nativeElement.click();
  this.bulkcreation_form.get("excel").reset();

  const fileInput = document.getElementById('inputGroupFile02') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }

  const fileLabel = document.querySelector('label[for="inputGroupFile02"]') as HTMLLabelElement;
  if (fileLabel) {
    fileLabel.innerText = "Choose file";
  }
}

}


class Memo {
  account_number: string;
  name: string;
  cbs_template_id: any;
  account_type:string;
  wisefin_template_id: any;
  // accounttype:any;
  account_risk:any;
  account_owner:any;
  unit_code:any;
  account_category:any;
  rules:any=[]
  allow_partmap:any
  gl_bal:any
  temp_name:any
}
