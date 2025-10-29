import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { param } from 'jquery';
import { icon } from 'src/app/AppAutoEngine/import-services/CommonimportFiles';
import { environment } from 'src/environments/environment';
import { style } from '@angular/animations';

declare var bootstrap: any;
@Component({
  selector: 'app-nwisefinsumm',
  templateUrl: './nwisefinsumm.component.html',
  styleUrls: ['./nwisefinsumm.component.scss']
})
export class NwisefinsummComponent implements OnInit {
  url=environment.apiURL;
  wisefin_temp_id: any;
  fas_form: FormGroup;
  cbs_form: FormGroup;
  dynamic_fas_data: any[]=[]
  dynamic_cbs_data: any[]=[]
  wisefine_id: any;
  cbs_id: any;
  fascolumnlist:any[]=[]
  cbscolumnlist: any[]=[]
  fasfilterform: FormGroup;
  cbsfilterform: FormGroup;
  conditionlist: any[]=[]
  template_name: any;
  temp_filter_sum: any[]=[]
  fas_filter_array: any[]=[]
  cbs_filter_array: any[]=[]
  typearray:any[]=[{name:'Recon',id:'0'},{name:'ARS',id:'1'},{name:'DCS',id:'2'},{name:"Consolidation",id:3}]
  showfasrange: boolean;
  showcbsrange: boolean;
  fascondition_id: any;
  cbscondition_id: any;
  teplate_btns:any;
  datassearchs:any;
  searchtemplate: any = "String";
  status_array:any[]=[{name:"Active",id:'1'},{name:"Inactive",id:'0'}]
   wisefininput_form=new FormControl()
   cbsinput_form=new FormControl()
  status_dd={
      label: "Status",
     data:this.status_array,
      params: "",
      searchkey: "",
      displaykey: "name",    
      Outputkey:"id",
      fronentdata:true,
    
  }
  type_dd={
    label: "Type",
    data:this.typearray,
     params: "",
     searchkey: "",
     displaykey: "name",    
     Outputkey:"id",
     fronentdata:true,
  }
  showandhide: any;
  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, private spinner: NgxSpinnerService) {
      this.teplate_btns = [{icon: "add","tooltip":"Template", function: this.openBrsform.bind(this),"name": "Template"}]
      this.datassearchs = [{ type: "input", label: "Template Name", formvalue: "name" },{ type: "input", label: "Description", formvalue: "description" },{"type":"dropdown",inputobj: this.status_dd,formvalue:"status" },{"type":"dropdown",inputobj: this.type_dd,formvalue:"recon_ars" }]
     }

    summarylist = [];
    singleList = [];
    summaryslist=[];
   
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  } 
  datassearch: FormGroup;
  templateedit: FormGroup;
  templateeditform: FormGroup;
  newcbsform: FormGroup;
  newisefinform: FormGroup;
  recon_ars_array : any[] = [{name:'Reconcil',id:0}, {name:"ARS",id:1},{name:"DCS",id:2},{name:"Consolidation",id:3}];
  accounts: any;
  templates : any;
  Column_type: string;
  ctypes : string[] = ['Single Column', 'Seperate Column'];
  singleColumn : boolean = false;
  multiColumns : boolean = false;
  amount_type: any;
  amount_types: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonedittemp') closebuttonedittemp;

  ngOnInit(): void {
      

      this.datassearch = this.fb.group({
        temp_name: '',
        description:'',
        // delims:'',
        status:'',
        recon_ars:''
      })
      this.fasfilterform = this.fb.group({
        col_name: '',
        condition:'',
        symbols:'',
        range_value:''
      })
      this.cbsfilterform = this.fb.group({
        col_name: '',
        condition:'',
        symbols:'',
        range_value:''
      })
      this.templateeditform = this.fb.group({
        line_description:null,
        gl_date:null,
        customer_ref_no:null,
        payment_date:null,
        transaction_date:null,
        credit_amount:null,
        debit_amount:null,
        running_balance:null,
        amount:null,
        //mount_type:1,
        credit_name:null,
        debit_name:null,
        source : null,
        category:null,
        gl_doc_no:null,
        user_name:null,
        invoice_no:null,      
        ref_1:1,
        pv_no:null,
        journal_name:null,
        account_description:null,
        amount_type:null,
        credit_debit:null,
        amount_types:null,
        account_number:'',
        id:'',
        template_name:'',
        branch_code:''
      });

      this.templateedit = this.fb.group({
        

      })
      this.newcbsform=this.fb.group({
        account_number:null,
        branch_code:null,
        narration:null,
        credit_debit:null,
        amount:null,
        transaction_date:null
      })
      // this.addRow();
  this.newisefinform=this.fb.group({
    template_name:null,
    description:null,
    account_number:null,
  branch_code:null,
  transaction_date:null,
  credit_debit:null,
  amount:null,
  entry_crno:null,
  remarks:null,
  entry_gid:null,
  entry_module:null,
  recon_ars:[null],
  })
  
  this.fas_form = this.fb.group({
    fas: this.fb.array([])
});
this.cbs_form = this.fb.group({
  cbs: this.fb.array([])
});
this.temp_search("");
  }

  gettemplatedata(params) {
this.spinner.show()
    this.brsService.getNtemplatess(this.pagination.index,params).subscribe(results => {
      this.spinner.hide()
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  deletetemplate(data)
  {
    console.log(data,'data')
let value=data.id
let status:any=''
if(data.status===1){
  status=0
}
else if(data.status===0){
  status=1
}

    this.brsService.deleteNtemplates(value,status).subscribe(results => {
      if (results.status) {
        this.notification.showSuccess(results.message)
        this.temp_search("");
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  openBrsform()
  {
    this.router.navigate(['brs/createbrs'],{}); 
  }

  viewsinglerecord(vals)
  {
    this.brsService.getNsingletemplate(vals).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summaryslist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      // this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  editDatas(data)
  {
    console.log(data)
    // this.templateeditform.patchValue({
    //   line_description:data.line_description,
    //   gl_date:data.gl_date,
    //   customer_ref_no:data.customer_ref_no,
    //   payment_date:data.payment_date,
    //   transaction_date:data.transaction_date,
    //   credit_amount:data.credit_amount,
    //   debit_amount:data.debit_amount,
    //   running_balance:data.running_balance,
    //   amount:data.amount,
    //   credit_name:data.credit_name,
    //   debit_name:data.debit_name,
    //   source : data.source,
    //   category:data.category,
    //   gl_doc_no:data.gl_date,
    //   user_name:data.user_name,
    //   invoice_no:data.invoice_no,      
    //   ref_1: data.ref_1,
    //   pv_no:data.pv_no,
    //   journal_name:data.journal_name,
    //   account_description:data.account_description,
    //   amount_type:data.amount_type,
    //   credit_debit:data.credit_debit,
    //   amount_types:data.amount_types ? data.amount_types:0,
    //   account_number:data.account_number,
    //   id: data.id,
    //   template_name: data.template_name,
    //   branch_code: data.branch_code
    //  })
    this.wisefin_temp_id=data.id
    this.showandhide=data.recon_ars
if(data.recon_ars===3){
  this.newcbsform.reset()
  this.cbsinput_form.reset()
}
this.getwisefinedata(data.template_name)
if(data.recon_ars!==3){
  this.getcbsdata(data.template_name)
}


     this.changeColumn();
     this.popupopenedit()
}

viewsinglerecords(vals)
{
  this.brsService.getNsingletemplate(vals).subscribe(results => {
    if (!results) {
      return false;
    }
    this.summaryslist = results['data'];
  
    this.pagination = results.pagination ? results.pagination : this.pagination;
  })
}

inputColumns(event)
  {
    if(this.Column_type == "Single Column")
    {
      this.singleColumn = true;
      
    }
  }

  changeColumn()
  {
    if(this.templateeditform.controls['amount_types'].value == 1)
    {
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.templateeditform.get('amount_type').setValue(val); 
      this.singleColumn = true;
      this.multiColumns = false;
    }
    if(this.templateeditform.controls['amount_types'].value == 0)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.templateeditform.get('amount_type').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;

    }
  }

  UpdateForms()
  {
    this.brsService.templateSedit(this.templateeditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Template Updated Successfully ...")
        this.temp_search("");
        this.closebutton.nativeElement.click();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }
  prevpages()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
      console.log('previous', this.pagination.index)
    }
    this.temp_search("")
  }
  nextpages()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
   this.temp_search("")
  
  }
  template_search_summary_api:any;
  temp_search(form_value){
    //  let params=''
    // let formvalue = this.datassearch.value
   
    // if(form_value.temp_name){
    //  params+='&name='+form_value.temp_name
    // }
    // if(form_value.description){
    //   params+='&description='+form_value.description
    //  }
    //  if(form_value.status===0||form_value.status===1){
    //   params+='&status='+formvalue.status
    //  }
    //  if(form_value.recon_ars===0||form_value.recon_ars===1){
    //   params+='&recon_ars='+form_value.recon_ars
    //  }
     this.template_search_summary_api = {
      method: "get",
      url: this.url + "brsserv/wisefin_template",
      params: form_value
    };
   
    // this.gettemplatedata(params)
  }
  datassearchreset(){
    this.datassearch.reset()
    this.pagination.index=1
    this.temp_search("")
  }
  submitsForm()
  {
    let validation=this.newisefinform.get('template_name').value
   if(validation===''||validation===null||validation===undefined){
    this.notification.showError('Enter template name')
    return
   }
    console.log(this.newisefinform.value,'formvalue')
    this.wisefine_update()
    if(this.showandhide!==3){
      this.cbs_update()
    }
    
    
  }
  goback(){
    // this.closebutton.nativeElement.click();
    this.closebuttonedittemp.nativeElement.click();
  }
  getwisefinedata(name){
    this.fas.clear()
    this.spinner.show()
    this.brsService.getwisefie_data(name).subscribe(results => {
      this.spinner.hide()
      let value=results['data']   
      this.wisefine_id=value[0].id  
     for(let data of results['data']){
      let recon
      if(data.recon_ars==1){
         recon= {name:"ARS",id:1}
      }else if (data.recon_ars==0){
        recon={name:'Reconcil',id:0}
      }
      else if (data.recon_ars==2){
        recon={name:'DCS',id:2}
      }
      else if (data.recon_ars==3){
        recon={name:'Consolidation',id:3}
      }
     this.newisefinform.patchValue({
      recon_ars:recon.id
     })
      this.newisefinform.patchValue({
        template_name:data.template_name,
        description:data.description,
   account_number:data.account_number,
 branch_code:data.branch_code,
 transaction_date:data.transaction_date,
 credit_debit:data.credit_debit,
 amount:data.amount,
 entry_crno:data.entry_crno,
 remarks:data.remarks,
 entry_gid:data.entry_gid,
 entry_module:data.entry_module,
 

     })
     this.wisefininput_form.patchValue(data.customize_temp_wisefin)
     }
     for(let data of value){
      this.dynamic_fas_data=data['dynamic_field']
    }
    for(let data of this.dynamic_fas_data){
      const formControlName:any = Object.keys(data)
      let lessonForm = this.fb.group({
     [formControlName]:Object.values(data)
      });
    
      this.fas.push(lessonForm);
     }
    console.log(this.dynamic_fas_data,'dynamic_fas_data')
    })
    
  }
  getcbsdata(name){
    this.cbs.clear()
    this.spinner.show()
    this.brsService.getcbsdata(name).subscribe(results => {
      this.spinner.hide()
      let value=results['data']
      this.cbs_id=value[0].id
      for(let data of results['data']){
        this.dynamic_cbs_data=data['dynamic_field']
        this.newcbsform.patchValue({
          account_number:data.account_number,
          branch_code:data.branch_code,
          narration:data.narration,
          credit_debit:data.credit_debit,
          amount:data.amount,
          transaction_date:data.transaction_date
       })
       this.cbsinput_form.patchValue(data.customize_temp_cbs)
       }
       for(let data of value){
        this.dynamic_cbs_data=data['dynamic_field']
       }
       for(let data of this.dynamic_cbs_data){
        const formControlName:any = Object.keys(data)
        let lessonForm = this.fb.group({
       [formControlName]:Object.values(data)
        });
      
        this.cbs.push(lessonForm);
       }
      console.log(this.dynamic_cbs_data,'dynamic_cbs_data')
    })
   
  }
  wisefine_update(){
    let form=this.newisefinform.value
    form.id=this.wisefine_id
    form.dynamic_data=this.fas_form.value.fas
    form.customize_temp_wisefin=this.wisefininput_form.value
    let formarray=[]
    formarray.push(form)
    console.log(formarray)
    this.brsService.wisefine_edit_update(formarray,).subscribe(results => {

      if (results.status == 'success') {
        this.notification.showSuccess("Template updated Successfully")
        this.goback()
      
      }
      else {
        this.notification.showError(results.code)

      }
    })

  }
  cbs_update(){
    let form=this.newcbsform.value
    form.id=this.cbs_id
    form.dynamic_data=this.cbs_form.value.cbs
    form.template_name=this.newisefinform.get('template_name').value
    form.customize_temp_cbs=this.cbsinput_form.value
    let formarray=[]
    formarray.push(form)
    console.log(formarray)
    this.brsService.cbs_edit_update(formarray).subscribe(results => {

      if (results.status == 'success') {
        this.notification.showSuccess("Template updated Successfully")
        this.goback()
      
      }
      else {
        this.notification.showError(results.code)

      }
    })

  }
  fasaddform() {
    let index=this.fas?.length
    const formControlName = 'column'+(index + 1);
    let lessonForm = this.fb.group({
   [formControlName]:['']
    });
  
    this.fas.push(lessonForm);
    console.log(this.fas)
  }
  cbsaddform() {
  let index=this.cbs?.length
  let formControlName='column'+(index+1)
    let lessonForm = this.fb.group({
      [formControlName]:['']
    });
  
    this.cbs.push(lessonForm);
    
  }
  get fas() {
    return this.fas_form.get('fas') as FormArray;
  }
  get cbs() {
    return this.cbs_form.get('cbs') as FormArray;
  }
  deletefascolumn(i){
    this.fas.removeAt(i);
  }
  deletecbscolumn(i){
    this.cbs.removeAt(i);
  }
  getfilter(id){
    this.fasfilterform.reset()
    this.cbsfilterform.reset()
    this.showcbsrange=false
    this.showfasrange=false
this.template_name=id.template_name
    console.log(id)
    let payload = {
      "name" : id.template_name
    }
    this.brsService.gettemp_data(payload).subscribe(results =>{
      console.log(results)
  
      this.fascolumnlist=results['wisefin']
      this.cbscolumnlist=results['cbs']
      
    })
    this.brsService.getcondition().subscribe(res=>{
      this.conditionlist=res['data']
    })
  this.getfiltervalues()
  this.popupopenfilter()
  }
  getfiltervalues(){
    this.fas_filter_array=[]
    this.cbs_filter_array=[]
    this.spinner.show()
    this.brsService.gettemp_filter(this.template_name).subscribe(res=>{
      this.spinner.hide()
      this.temp_filter_sum=res['data']
      console.log('temp_filter_sum',this.temp_filter_sum)
     
      for(let x of this.temp_filter_sum){
        if(x.flag===1){
          this.fas_filter_array.push(x)
        }
        if(x.flag===2){
          this.cbs_filter_array.push(x)
        }
      }
      console.log('fas_filter_array',this.fas_filter_array)
      console.log('cbs_filter_array',this.cbs_filter_array)
    })
  }
  fasfiltersubmit(){
    let validation=this.fasfilterform.value
    if (validation.col_name === '' || validation.col_name === null || validation.col_name === undefined) {
      this.notification.showError('Choose FAS Column')
      return
    }
    if (validation.symbols === '' || validation.symbols === null || validation.symbols === undefined) {
      this.notification.showError('Choose FAS Conditions')
      return
    }
    if (this.fascondition_id === 3) {
      if (validation.condition === '' || validation.condition === null || validation.condition === undefined) {
        this.notification.showError('Enter FAS Range From value')
        return
      }
      if (validation.range_value === '' || validation.range_value === null || validation.range_value === undefined) {
        this.notification.showError('Enter FAS Range To value')
        return
      }
    } else {
      if (validation.condition === '' || validation.condition === null || validation.condition === undefined) {
        this.notification.showError('Enter FAS value')
        return
      }
    }

let value=this.fasfilterform.value
value.type=1
value.temp_name=this.template_name

if(value.symbols===3){
  let condition_array=[]
  condition_array.push(value.condition)
  value.condition=condition_array
}
else{
  let condition_array=[]
  condition_array.push(value.condition)
  value.condition=condition_array
 delete value.range_value
}
console.log(value)
this.spinner.show()
this.brsService.post_filter_data(value).subscribe(res=>{
  this.spinner.hide()
  console.log(res)
  if(res.status){
    this.notification.showSuccess(res.message)
    this.fasfilterform.reset()
    this.getfiltervalues()
    this.showfasrange=false
  }
  else{
    this.notification.showError(res.description)
  }
})
  }
  cbsfiltersubmit(){
    let validation=this.cbsfilterform.value
    if (validation.col_name === '' || validation.col_name === null || validation.col_name === undefined) {
      this.notification.showError('Choose CBS Column')
      return
    }
    if (validation.symbols === '' || validation.symbols === null || validation.symbols === undefined) {
      this.notification.showError('Choose CBS Conditions')
      return
    }
    if (this.cbscondition_id === 3) {
      if (validation.condition === '' || validation.condition === null || validation.condition === undefined) {
        this.notification.showError('Enter CBS Range From value')
        return
      }
      if (validation.range_value === '' || validation.range_value === null || validation.range_value === undefined) {
        this.notification.showError('Enter CBS Range To value')
        return
      }
    } else {
      if (validation.condition === '' || validation.condition === null || validation.condition === undefined) {
        this.notification.showError('Enter CBS value')
        return
      }
    }
    console.log('CBS',this.cbsfilterform.value)
    let value=this.cbsfilterform.value
value.type=2
value.temp_name=this.template_name
if(value.symbols===3){
  let condition_array=[]
  condition_array.push(value.condition)
  value.condition=condition_array
}
else{
  let condition_array=[]
  condition_array.push(value.condition)
  value.condition=condition_array
 delete value.range_value
}
console.log(value)
this.spinner.show()
this.brsService.post_filter_data(value).subscribe(res=>{
  this.spinner.hide()
  console.log(res)
  if(res.status){
    this.notification.showSuccess(res.message)
    this.cbsfilterform.reset()
    this.getfiltervalues()
    this.showcbsrange=false
  }
  else{
    this.notification.showError(res.description)
  }
})
  }
  removeChipfas(index,data){
    if (index >= 0) {
      this.fas_filter_array.splice(index, 1);
      this.spinner.show()
      this.brsService.delete_filter(data.id).subscribe(res=>{
    this.spinner.hide()
        if(res.status){
          this.notification.showSuccess(res.message)
          this.getfiltervalues()
        }
        else{
          this.notification.showError(res.description)
        }
      })
    }
  }
  removeChipcbs(index,data){
    if (index >= 0) {
      this.cbs_filter_array.splice(index, 1);
      this.spinner.show()
      this.brsService.delete_filter(data.id).subscribe(res=>{
      this.spinner.hide()
        if(res.status){
          this.notification.showSuccess(res.message)
          this.getfiltervalues()
        }
        else{
          this.notification.showError(res.description)
        }
      })
    }

  }
  fasrangecondition(id){
    this.fascondition_id=id
if(id===3){
  this.showfasrange=true
  this.fasfilterform.get('condition').reset()
}
else{
  this.showfasrange=false
}
  }
  cbsrangecondition(id){
    this.cbscondition_id=id
    if(id===3){
      this.showcbsrange=true
      this.cbsfilterform.get('condition').reset()
    }
    else{
      this.showcbsrange=false
    }
      }
      popupopenfilter() {
        var myModal = new (bootstrap as any).Modal(document.getElementById("filterscreen"), {
          backdrop: "static",
          keyboard: false,
        });
        myModal.show();
      }
      popupopenedit() {
        var myModal = new (bootstrap as any).Modal(document.getElementById("editdatas"), {
          backdrop: "static",
          keyboard: false,
        });
        myModal.show();
      }

      template_summary_table=[ { columnname: "Template Name", key: "template_name" },
        { columnname: "Description", key: "description" },
        {
          columnname: "Type",
          key: "recon",
          validate: true,
          validatefunction: this.recon_ars.bind(this),
        },
        {
          columnname: "Edit",
          key:"edit",
          icon:"edit",
          style:{cursor:"pointer"},
          button:true,
          function: true,
          clickfunction: this.editDatas.bind(this),
        },        
        { columnname: "Status", key: "status", toggle: true, function: true,style:{cursor:"pointer"},
          clickfunction: this.deletetemplate.bind(this), validate: true, validatefunction: this.status_togle.bind(this)},
        {
          columnname: "Filter",
          icon:"filter_alt",
          button:true,
          style:{cursor:"pointer"},
          key:"filter",
          function: true,
          clickfunction: this.getfilter.bind(this),
        },
        ]

        recon_ars(template){
          let config: any = {
            value: "",
          };
      
          if (template.recon_ars == 1) {
            config = {
              value: "ARS",
            };
          }
          else if(template.recon_ars == 0){
            config = {
              value: "Recon",
            }
          }
     
      else if(template.recon_ars == 2){
        config = {
          value: "DCS",
        }
        
      }
      else if(template.recon_ars == 3){
        config = {
          value: "Consolidation",
        }
        
      }
    return config;
        }

        status_togle(data){
          {
            let config: any = {
              disabled: false,
              style: "",
              class: "",
              value: "",
              checked: "",
              function: true,
            };
            if (
              data.status == 1
            ) {
              config = {
                disabled: false,
                style: "",
                class: "",
                value: "",
                checked:true,
                function: true,
              };
            } else if (
              data.status == 0
            ) {
              config = {
                disabled: false,
                style: "",
                class: "",
                value: "",
                checked: false,
                function: true,
              };
            }
            return config;
          } 
        }

        isFormExpanded: boolean = false;
        isFormExpandedcbs: boolean = false;

        toggleForm() {
          this.isFormExpanded = !this.isFormExpanded;
        }

        toggleFormcbs() {
          this.isFormExpandedcbs = !this.isFormExpandedcbs;
        }
        gettemplateid(id){
          this.showandhide=id
          if(id===3){
            this.newcbsform.reset()
            this.cbsinput_form.reset()
          }
        }
}
