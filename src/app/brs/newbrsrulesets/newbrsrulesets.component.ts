import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ShareserviceService } from '../shareservice.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil, tap } from 'rxjs/operators';
export interface temp{
  template_name:string;
}


@Component({
  selector: 'app-newbrsrulesets',
  templateUrl: './newbrsrulesets.component.html',
  styleUrls: ['./newbrsrulesets.component.scss'],
})
export class NewbrsrulesetsComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('template_input') template_input: any;
  @ViewChild('temp_auto') temp_auto: MatAutocomplete;
  brsformsdata : FormGroup;
  brsformsdata1: FormGroup;

  ruleTable: FormGroup;
  filedata: FormGroup;
  
  newVal: any;
  userTable: FormGroup;
  control: FormArray;
  brsformdata : FormGroup;
  mode: boolean;
  touchedRows: any;
  el: any;
  dragger :any;
  bgcolor : any = "black";

  rulepreview: boolean = false;

  selectedvalue: string;
  cstatus: any;
  statuss: any;
  status1 : any;
  status2 : any;

  reuploadfileArr:any
  CBSuploadfileArr:any
  conditionss = [
    { value: 'between', text: 'BETWEEN' },
    { value: 'after', text: 'AFTER' },
    
  ];
  Submoduledatas  = [
    {name: 'Rule Creation'},
    // {name: 'View Data'},
    {name: 'Summary'},

  ]

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  shownwisefin= true;
  showbnkstmt = true;
  isHidden=false;
  isHiddens = false;
  isHidde = false;
  isHiddns = false;
  isHiddn = false;
  isnorules =false;
  fetchfields : any = [];
  fetchfieldsC : any = [];
  fetchWise: any;
  fetchCBS: any;
  rulecreate: boolean;
  rulesummary: boolean;
  checkboxkey: boolean[]=[true];
  wisecheckboxkey: boolean[]=[true];
  showlimit: boolean[]=[false];
  showlimit1: boolean[]=[false];
  diableposition: boolean=false;
  showdeliminater: boolean =false
  showcbsdeliminater: boolean = false
  cards: { title: string, formGroup: FormGroup }[] = [];
  addButtonDisabled: boolean = false;
  addButtonEnabled: boolean = false;
  wisefin1: boolean = false;
  wisefin2: boolean = false;
  wisecheckboxkey1: boolean=true;
  brsformsdata2: FormGroup;
  wisecheckboxkey2: boolean = true;
  showstartwithwisefin: boolean[]=[false]
  nolimtfas: boolean[]=[true]
  nolimtcbs: boolean[]=[true]
  showstartwithcbs: boolean[]=[false]
  wisefine_array: any[]=[]
  cbs_array: any[]=[]
  form: FormGroup;
  newform: FormGroup;
  temp_name: any;

  hastemp_next: boolean;
  hastemp_previous: boolean;
  current_temp_page: number;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder, 
    private notification: NotificationService, 
    private brsService: BrsApiServiceService, 
    private spinner: NgxSpinnerService,
    private toster: ToastrService,
    private router: Router,
    // private shareService: ShareserviceService
  ) {}

  ngOnInit(): void {
    // this.isChecked = true;
    this.touchedRows = [];
    this.getFieldsC();
    this.getFields();
    this.brsformsdata = this.fb.group({
      glnumber:[0],
      name:[""],
      fas_col_name:[""],
      fas_starts_with:[""],
      fas_starts_with_number:[''],
      // fas_delimiter:[""],
      fas_delimiter2:[""],
      occuranceControl2:[""],
      occuranceControl:[""],
      "between_after":"after",
      same_date:[0],
      createordebit:[''],
      fas_starting_position:[''],
      fas_ending_position:[''],
      fas_word_character:[""],
      fas_forward_backward:[""],
      fas_full_column: [''],
      cbs_col_name:[""],
      cbs_starts_with:[""],
      cbs_starts_with_number:[""],
      cbs_delimiter:[""],
      cbs_starting_position:[''],
      cbs_ending_position:[''],
      cbs_word_character:[""],
      cbs_forward_backward:[""],
      cbs_full_column:[''],
      statement_rule:[''],
      wisefinxl:[''],
      "count":2,
     
    });
    this.brsformsdata1 = this.fb.group({
      fas_full_column1 : [''],
      fas_col_name1 : [''],
      fas_starts_with1:[''],
      fas_delimiter1:[''],
      occuranceControl1:[''],
      fas_starting_position1:[''],
      fas_ending_position1:[''],
      fas_forward_backward1:[''],

    })
    this.brsformsdata2 = this.fb.group({
      fas_full_column2 : [''],
      fas_col_name2 : [''],
      fas_starts_with2:[''],
      fas_delimiter3:[''],
      occuranceControl2:[''],
      fas_starting_position2:[''],
      fas_ending_position2:[''],
      fas_forward_backward2:[''],

    })
    // this.addRow();
    this.ruleTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.newform=this.fb.group({
      name:[""],
      same_date:[0],
      statement_rule:[0],
      description:[''],
      order:[''],
      wisefinxl:['']
    })
    this.form = this.fb.group({
      lessons: this.fb.array([])
  });
    this.addRow();
    this.getFields()
    this.getFieldsC();
    // this.getWiseXLs();
    this.getCBSXLs();
 this.brsService.getNtemplates1("",this.pagination.index).subscribe(results => {
      this.fetchWise = results['data']
     
    })
    // this.setValues();
      
    this.filedata = this.fb.group({
      wisefinxl:'',
      cbsxl:''
    })
   
this.addLesson()
  }

  ngAfterOnInit() {
    this.control = this.ruleTable.get('tableRows') as FormArray;

  //   this.el = document.getElementById('tables');
   
  //   this.dragger = tableDragger(this.el, {
  //    mode: 'free',
  //    dragHandler: '.handle',
  //    onlyBody: true,
  //    animation: 300
  //  });
   

  //   this.dragger.on('drop',function(from, to){
  //     this.console(from);
  //     this.console(to);
  //   });
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      startsWith: [null],
      delimeter: [null],
      words: [null],
      traverse: [null],
      // orderdisplay: [null],
      // comments: [null, [Validators.required]],
      isEditable: [true]
    });
  }

  addRow() {
    const control =  this.ruleTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control =  this.ruleTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveUserDetails() {
    console.log(this.ruleTable.value);
  }

  displaylimit(event: KeyboardEvent,i){
    const input = (event.target as HTMLInputElement).value;
    // const newValue = input + event.key;
    this.showlimit[i] = input.length === 1;

  }

  displaylimitcbs(event: KeyboardEvent,i){
    const input = (event.target as HTMLInputElement).value;
    // const newValue = input + event.key;
    this.showlimit1[i] = input.length === 1;
  }

  disableposition(i,type){
    this.diableposition = true;
    const formArray = this.lessons;
      const formGroup = formArray.at(i) as FormGroup;
     if(type===1){
      formGroup.get('fas_starting_position').reset()
      formGroup.get('fas_ending_position').reset()
      this.nolimtfas[i]=false
     }
     if(type===2){
      formGroup.get('cbs_starting_position').reset()
      formGroup.get('cbs_ending_position').reset()
      this.nolimtcbs[i]=false
     }
     
      
  }

  enableposition(i,type){
    this.diableposition = false;
    const formArray = this.lessons;
    const formGroup = formArray.at(i) as FormGroup;
    if(type===1){
      formGroup.get('fas_starting_position').reset()
      formGroup.get('fas_ending_position').reset()
      this.nolimtfas[i]=true
     }
     if(type===2){
      formGroup.get('cbs_starting_position').reset()
      formGroup.get('cbs_ending_position').reset()
      this.nolimtcbs[i]=true
     }
  }

  get getFormControls() {
    const control = this.ruleTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.ruleTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    console.log(this.touchedRows);
  }

  toggleTheme() {
    this.mode = !this.mode;
    document.body.style.background = this.bgcolor;
  }

  toggle(){
    this.isHidden=!this.isHidden;
  }
  toggles()
  {
    this.isHiddens = !this.isHiddens;
  }
  toggless()
  {
    this.isHidde = !this.isHidde;
  }
  togg()
  {
    this.isHiddns = !this.isHiddns;
  }
  toggs()
  {
    this.isHiddn = !this.isHiddn;
  }

  noshows()
  {
    this.isnorules = !this.isnorules;
  }
  Addcheckbox(e:MatCheckboxChange,i){
    const formArray = this.lessons;
    const formGroup = formArray.at(i) as FormGroup;
    if (e.checked){
      this.checkboxkey[i]=false
      formGroup.get('cbs_full_column').setValue(1);
    }else{
      this.checkboxkey[i]=true
      formGroup.get('cbs_full_column').setValue(0);
    }
  
  }
  wisebincheckbox(e:MatCheckboxChange,i,formgroup){
    console.log(formgroup,'formgroup')
    const formArray = this.lessons;
      const formGroup = formArray.at(i) as FormGroup;
  
   console.log(formGroup,'form1')
    if (e.checked){
      this.wisecheckboxkey[i]=false
      formGroup.get('fas_full_column')?.setValue(1);
    }else{
      this.wisecheckboxkey[i]=true
      formGroup.get('fas_full_column')?.setValue(0);
    }
    console.log(formgroup,'formgroup2')
  }
wisebincheckbox1(e:MatCheckboxChange){
    
  if (e.checked){
    this.wisecheckboxkey1=false
  }else{
    this.wisecheckboxkey1=true
  }
}
wisebincheckbox2(e:MatCheckboxChange){
    
  if (e.checked){
    this.wisecheckboxkey2=false
  }else{
    this.wisecheckboxkey2=true
  }

}
  runrules()
  {

    // let data = {
    //   description : this.brsformsdata.controls['description'].value,
    //   starts_with : this.brsformsdata.controls['starts_with'].value,
    //   delimiter: this.brsformsdata.controls['delimiter'].value,
    //   between_after : '',
    //   starting_position : '',
    //   ending_position: '',
    //   word_character : this.brsformsdata.controls['word_character'].value,
    //   count : this.brsformsdata.controls['count'].value,
    //   forward_backward: this.brsformsdata.controls['forward_backward'].value,
    //   full_column : this.brsformsdata.controls['full_column'].value,
    //   statement_rule : this.brsformsdata.controls['statement_rule'].value,
    //   same_date: parseInt(this.brsformsdata.controls['same_date'].value),
    //   sub_rule:[{
    //     key: this.brsformsdata.controls['key'].value,
    //     value: this.brsformsdata.controls['value'].value,
    //     include: parseInt(this.brsformsdata.controls['include'].value),

    //   }]
    if(this.brsformsdata.controls['key'].value == "")
    {
    this.newVal = {
      name : this.brsformsdata.controls['name'].value,
      description : this.brsformsdata.controls['description'].value,
      starts_with : this.brsformsdata.controls['starts_with'].value,
      delimiter: this.brsformsdata.controls['delimiter'].value,
      between_after : '2',
      status: '2',
      starting_position : this.brsformsdata.controls['starting_position'].value ,
      ending_position: this.brsformsdata.controls['ending_position'].value,
      word_character : this.brsformsdata.controls['word_character'].value,
      count : this.brsformsdata.controls['count'].value,
      forward_backward: this.brsformsdata.controls['forward_backward'].value,
      full_column : this.brsformsdata.controls['full_column'].value,
      statement_rule : this.brsformsdata.controls['statement_rule'].value,
      same_date: parseInt(this.brsformsdata.controls['same_date'].value),
      
    
      sub_rule:[
      ]
    }
  }
      else
      {
        this.newVal= {
          name : this.brsformsdata.controls['name'].value,
          description : this.brsformsdata.controls['description'].value,
          starts_with : this.brsformsdata.controls['starts_with'].value,
          delimiter: this.brsformsdata.controls['delimiter'].value,
          between_after : '2',
          status:'2',
          starting_position : this.brsformsdata.controls['starting_position'].value ,
          ending_position: this.brsformsdata.controls['ending_position'].value,
          word_character : this.brsformsdata.controls['word_character'].value,
          count : this.brsformsdata.controls['count'].value,
          forward_backward: this.brsformsdata.controls['forward_backward'].value,
          full_column : this.brsformsdata.controls['full_column'].value,
          statement_rule : this.brsformsdata.controls['statement_rule'].value,
          same_date: parseInt(this.brsformsdata.controls['same_date'].value),
          
        
          sub_rule:[{
            key: this.brsformsdata.controls['key'].value,
            value: this.brsformsdata.controls['value'].value,
            include: this.brsformsdata.controls['include'].value
            
          }
          ]
      }

      
      // exclude_ledger_id : '',
      // exclude_statement_id:''

    }
    this.spinner.show();
    this.brsService.defineRuleEngine(this.newVal).subscribe(results => {



      this.pagination = results.pagination ? results.pagination : this.pagination;

 
      if (results.status == 'success') {
        this.spinner.hide();
        this.notification.showSuccess("Rule Created Successfully!..")
        // this.router.navigate(['brs/rulesumm'],{}); 
      }
      else {
        this.notification.showError(results.code);
        this.spinner.hide();

      }
    })
  }

  Nwsefinrunrules()
  {
    console.log(this.form.value.lessons,'form_value')
    let payload={
      name:this.newform.get('name').value,
      same_date:this.newform.get('same_date').value,
      statement_rule:this.newform.get('statement_rule').value,
      description:this.newform.get('description').value,
      temp_name:this.temp_name,
      order:this.newform.get('order').value,
      data:this.form.value.lessons
    }
    console.log(payload)
    
    if (this.newform.controls['name'].value == "" || this.newform.controls['name'].value == undefined || this.newform.controls['name'].value == null) {
      this.toster.error("Enter Rule Name")
      return false
    }
    // if (this.brsformsdata.controls['fas_starting_position'].value == "") {
    //   this.brsformsdata.controls['fas_ending_position'].setValue(null);
    //   return false
    // }
    // if (this.brsformsdata.controls['fas_ending_position'].value == "") {
    //   this.brsformsdata.controls['fas_ending_position'].setValue(null);
    //   return false
    // }
    // if (this.brsformsdata.controls['fas_starting_position'].value) {
    //   this.brsformsdata.controls['fas_starting_position'].value;
    // } else {
    //   this.brsformsdata.controls.get['fas_starting_position'] = null;
    let startingPositionValue = this.brsformsdata.controls['fas_starting_position'].value;
    if (startingPositionValue === "") {
        startingPositionValue = null;
    }
    let endingPositionValue = this.brsformsdata.controls['fas_ending_position'].value;
    if (endingPositionValue === "") {
      endingPositionValue = null;
    }

    let startingPositionValuecbs = this.brsformsdata.controls['cbs_starting_position'].value;
    if (startingPositionValuecbs === "") {
      startingPositionValuecbs = null;
    }
    let endingPositionValuecbs = this.brsformsdata.controls['cbs_ending_position'].value;
    if (endingPositionValuecbs === "") {
      endingPositionValuecbs = null;
    }


    let startingPositionValue1 = this.brsformsdata1.controls['fas_starting_position1'].value;
    if (startingPositionValue1 === "") {
      startingPositionValue1 = null;
    }
    let endingPositionValue1 = this.brsformsdata1.controls['fas_ending_position1'].value;
    if (endingPositionValue1 === "") {
      endingPositionValue1 = null;
    }
    // let cbsstartingPositionValue1 = this.brsformsdata1.controls['cbs_starting_position1'].value;
    // if (cbsstartingPositionValue1 === "") {
    //   cbsstartingPositionValue1 = null;
    // }
    // let cbsendingPositionValue1 = this.brsformsdata1.controls['cbs_ending_position1'].value;
    // if (cbsendingPositionValue1 === "") {
    //   cbsendingPositionValue1 = null;
    // }
    let startingPositionValue2 = this.brsformsdata2.controls['fas_starting_position2'].value;
    if (startingPositionValue2 === "") {
      startingPositionValue2 = null;
    }
    let endingPositionValue2 = this.brsformsdata2.controls['fas_ending_position2'].value;
    if (endingPositionValue2 === "") {
      endingPositionValue2 = null;
    }
    if(this.brsformsdata.controls['fas_starts_with_number'].value===''){
      this.brsformsdata.controls['fas_starts_with_number'].setValue(0);
    }
    if(this.brsformsdata.controls['cbs_starts_with_number'].value===''){
      this.brsformsdata.controls['cbs_starts_with_number'].setValue(0);
    }
      let payloadArray = [];

      let wisefin = {
        name: this.brsformsdata.controls['name'].value,
        fas_starts_with: this.brsformsdata.controls['fas_starts_with'].value,
        
        fas_delimiter: this.brsformsdata.controls['fas_delimiter2'].value,
        fas_starting_position: startingPositionValue,
        fas_ending_position: endingPositionValue,
        fas_word_character: this.brsformsdata.controls['fas_word_character'].value,
        fas_forward_backward: this.brsformsdata.controls['fas_forward_backward'].value,
        fas_full_column: this.brsformsdata.controls['fas_full_column'].value,
        fas_col_name: this.brsformsdata.controls['fas_col_name'].value,
        fas_occurence: this.brsformsdata.controls['occuranceControl'].value,
        cbs_col_name: this.brsformsdata.controls['cbs_col_name'].value,
        cbs_starts_with: this.brsformsdata.controls['cbs_starts_with'].value,
       
        cbs_delimiter: this.brsformsdata.controls['cbs_delimiter'].value,
        cbs_starting_position: startingPositionValuecbs,
        cbs_ending_position: endingPositionValuecbs,
        cbs_word_character: this.brsformsdata.controls['cbs_word_character'].value,
        cbs_forward_backward: this.brsformsdata.controls['cbs_forward_backward'].value,
        cbs_full_column: this.brsformsdata.controls['cbs_full_column'].value,
        cbs_occurrence: this.brsformsdata.controls['occuranceControl2'].value,
        between_after: this.brsformsdata.controls['createordebit'].value,
        same_date: this.brsformsdata.controls['same_date'].value,
        template:this.brsformsdata.controls['wisefinxl'].value,
        statement_rule:this.brsformsdata.controls['statement_rule'].value,
        fas_starts_with_number: this.brsformsdata.controls['fas_starts_with_number'].value,
        cbs_starts_with_number: this.brsformsdata.controls['cbs_starts_with_number'].value,
        recom: null,
        status: null,
        sub_rule: []
      };
      
      let wisefin1 = {
        name: this.brsformsdata.controls['name'].value,
        fas_starts_with: this.brsformsdata1.controls['fas_starts_with1'].value,
        fas_starts_with_number: this.brsformsdata.controls['fas_starts_with_number'].value,
        fas_delimiter: this.brsformsdata1.controls['fas_delimiter1'].value,
        fas_starting_position:startingPositionValue1,
        fas_ending_position:endingPositionValue1,
        // fas_word_character: this.brsformsdata1.controls['fas_word_character1'].value,
        fas_forward_backward: this.brsformsdata1.controls['fas_forward_backward1'].value,
        fas_full_column: this.brsformsdata1.controls['fas_full_column1'].value,
        fas_col_name: this.brsformsdata1.controls['fas_col_name1'].value,
        // fas_occurrence: this.brsformsdata1.controls['occuranceControl1'].value,
        cbs_col_name: '',
        cbs_starts_with: '',
        cbs_delimiter: '',
        cbs_starting_position: null,
        cbs_ending_position: null,
        cbs_word_character: '',
        cbs_forward_backward: '',
        cbs_full_column: 0,
        cbs_occurrence: '',
        same_date: this.brsformsdata.controls['same_date'].value,
        recom: null,
        template:this.brsformsdata.controls['wisefinxl'].value,
        statement_rule:this.brsformsdata.controls['statement_rule'].value,
        status: 1
      };

      let wisefin2 = {
        name: this.brsformsdata.controls['name'].value,
        fas_starts_with: this.brsformsdata2.controls['fas_starts_with2'].value,
          fas_starts_with_number: this.brsformsdata.controls['fas_starts_with_number'].value,
        fas_delimiter: this.brsformsdata2.controls['fas_delimiter3'].value,
        fas_starting_position: startingPositionValue2,
        fas_ending_position: endingPositionValue2,
        // fas_word_character: this.brsformsdata1.controls['fas_word_character1'].value,
        fas_forward_backward: this.brsformsdata2.controls['fas_forward_backward2'].value,
        fas_full_column: this.brsformsdata2.controls['fas_full_column2'].value,
        fas_col_name: this.brsformsdata2.controls['fas_col_name2'].value,
        // fas_occurrence: this.brsformsdata1.controls['occuranceControl1'].value,
        cbs_col_name: '',
        cbs_starts_with: '',
        cbs_delimiter: '',
        cbs_starting_position: null,
        cbs_ending_position: null,
        cbs_word_character: '',
        cbs_forward_backward: '',
        cbs_full_column: 0,
        cbs_occurrence: '',
        same_date: this.brsformsdata.controls['same_date'].value,
        template:this.brsformsdata.controls['wisefinxl'].value,
        statement_rule:this.brsformsdata.controls['statement_rule'].value,
        recom: null,
        status: 1
      };
     
    payloadArray.push(wisefin)

    if(this.wisefin1){ 
      payloadArray.push(wisefin1);
    }
    if(this.wisefin2){
      payloadArray.push(wisefin2);
    } 
   
    console.log("Payload Array",payloadArray);


    this.newVal = {
      name : this.brsformsdata.controls['name'].value,
      // description : this.brsformsdata.controls['description'].value,
      fas_starts_with : this.brsformsdata.controls['fas_starts_with'].value,
      fas_starts_with_number: this.brsformsdata.controls['fas_starts_with_number'].value,
      fas_delimiter: this.brsformsdata.controls['fas_delimiter2'].value,
      fas_starting_position : startingPositionValue,
      fas_ending_position: endingPositionValue,
      fas_word_character : this.brsformsdata.controls['fas_word_character'].value,
      fas_forward_backward: this.brsformsdata.controls['fas_forward_backward'].value,
      fas_full_column : this.brsformsdata.controls['fas_full_column'].value,
      fas_col_name : this.brsformsdata.controls['fas_col_name'].value,

      cbs_col_name : this.brsformsdata.controls['cbs_col_name'].value,
      cbs_starts_with : this.brsformsdata.controls['cbs_starts_with'].value,
      cbs_starts_with_number: this.brsformsdata.controls['cbs_starts_with_number'].value,
      cbs_delimiter: this.brsformsdata.controls['cbs_delimiter'].value,
      cbs_starting_position : startingPositionValuecbs,
      cbs_ending_position: endingPositionValuecbs,
      cbs_word_character : this.brsformsdata.controls['cbs_word_character'].value,
      cbs_forward_backward: this.brsformsdata.controls['cbs_forward_backward'].value,
      cbs_full_column : this.brsformsdata.controls['cbs_full_column'].value,
      cbs_occurencess : this.brsformsdata.controls['occuranceControl2'].value,
      template:this.brsformsdata.controls['wisefinxl'].value,
      statement_rule:this.brsformsdata.controls['statement_rule'].value,
      same_date: this.brsformsdata.controls['same_date'].value,
      
      // between_after : this.brsformsdata.controls['createordebit'].value,
      // same_date: parseInt(this.brsformsdata.controls['same_date'].value),
      recom: null,
      status: null,
      // status:'2',
      // // count : this.brsformsdata.controls['count'].value,
      // statement_rule : this.brsformsdata.controls['statement_rule'].value,
      
      
    
      sub_rule:[
      ]
    // }
  }

    //   else
    //   {
    //     this.newVal= {
    //       name : this.brsformsdata.controls['name'].value,
    //       description : this.brsformsdata.controls['description'].value,
    //       starts_with : this.brsformsdata.controls['starts_with'].value,
    //       delimiter: this.brsformsdata.controls['delimiter'].value,
    //       between_after : parseInt(this.brsformsdata.controls['createordebit'].value),
    //       starting_position : 1,
    //       ending_position: 15,
    //       word_character : this.brsformsdata.controls['word_character'].value,
    //       count : this.brsformsdata.controls['count'].value,
    //       forward_backward: this.brsformsdata.controls['forward_backward'].value,
    //       full_column : this.brsformsdata.controls['full_column'].value,
    //       statement_rule : this.brsformsdata.controls['statement_rule'].value,
    //       same_date: parseInt(this.brsformsdata.controls['same_date'].value),
          
        
    //       sub_rule:[{
    //         key: this.brsformsdata.controls['key'].value,
    //         value: this.brsformsdata.controls['value'].value,
    //         include: this.brsformsdata.controls['include'].value
            
    //       }
    //       ]
    //   }

     
    //   // exclude_ledger_id : '',
    //   // exclude_statement_id:''

    // }
    // if(this.wisefin1 == true){
    //   this.brsService.NdefineRuleEngine(this.newVal, wisefin1).subscribe(results => {



    //     this.pagination = results.pagination ? results.pagination : this.pagination;
  
   
    //     if (results.status == 'success') {
    //       this.notification.showSuccess("Rule Created Successfully...")
    //       // this.router.navigate(['brs/rulesumm']); 
    //       this.filedata.reset();
    //       this.brsformsdata.reset();
        
    //     }
    //     else {
    //       this.notification.showError(results.description)
  
    //     }
    //   })
    // }
    this.spinner.show();
    // this.brsService.NdefineRuleEngine(payloadArray).subscribe(results => {
      this.brsService.NdefineRuleEngine(payload).subscribe(results => {

      this.pagination = results.pagination ? results.pagination : this.pagination;
 
      if (results.status) {
        this.notification.showSuccess(results.message);
        this.spinner.hide();
        // this.shareService.ruleData.next(results);

        // this.router.navigate(['brs/brsmaster']);
this.backtosummary()
        this.filedata.reset();
        this.brsformsdata.reset();
        this.brsformsdata1.reset();
        this.brsformsdata2.reset();
        payloadArray = [];
      }
      else {
        this.spinner.hide();
        this.notification.showError(results.description);
      }
    })
  }

  activatePreview()
  {
    this.rulepreview = true;
  }


  goback()
  {
    this.router.navigate(['brs/brsmaster'],{});  
  }
  onFileSelect(e){
    let reuploaddatavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      this.reuploadfileArr.push(e.target.files[i])
    }

  }
  CBSFileSelect(e){
    let reuploaddatavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      this.CBSuploadfileArr.push(e.target.files[i])
    }
  }
  // setValues() {
  //   this.brsformsdata.setValue({
  //     between_after:'BETWEEN'
  //   });
  // }

  showwisefin()
  {
    this.shownwisefin = true;
    this.showbnkstmt = false;
  }

  showbnkstmtss()
  {
    this.showbnkstmt = true;
    this.shownwisefin = false;
  }

  getFields()
  {
    this.brsService.arsFields().subscribe(res =>{
      this.fetchfields = res['data']
      if(this.fetchfields.length == 0)
      {
        this.fetchfields = ['Entry_gid','Branch_code','Gl_number','Transaction date','DR/CR','Amount','Tag_no','Remark','Status','Created Date','Updated Date','Entry_crno','Entry_module','Value_date','Cbs_date']
      }
    })
  }

  getFieldsC()
  {
    this.brsService.arsFields().subscribe(res =>{
      this.fetchfieldsC = res['data']
      if(this.fetchfieldsC.length == 0)
      {
        this.fetchfieldsC = ['Branch_code','Date','Narration','DR/CR','AC_CCY','ACY AMOUNT','EQ LCY AMOUNT','RUNNING BALANCE','Related Account']
      }
    })
  }

  // getWiseXLs()
  // {
  //   this.brsService.getNtemplates1s(this.pagination.index,'').subscribe(results => {
  //     this.fetchWise = results['data']
     
  //   })
  // }
  public templ_display(payment_name?: temp): string | undefined {
    return payment_name ? payment_name.template_name : undefined;
  }
  getWiseXLs()
  {
    // this.spinnerService.show();
    this.brsService
      .getNtemplates1(this.template_input.nativeElement.value,  1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerService.hide();
        let datas = results["data"];
        this.fetchWise = datas;        
      });
    // this.brsService.getNtemplates1(this.pagination.index).subscribe(results => {
    //   this.fetchWise = results['data']
     
    // })
  }

  getCBSXLs()
  {
    this.brsService.CBSfiles().subscribe(res =>{
      this.fetchCBS = res['data']
     
    })
  }
  getData(id)
  {
    this.temp_name=id.template_name
    console.log(id)
    let payload = {
      "name" : id.template_name
    }
    this.brsService.gettemp_data(payload).subscribe(results =>{
      console.log(results)
  
      this.wisefine_array=results['wisefin']
      this.cbs_array=results['cbs']
      
    })

    // this.getFields();
  }
  
  subModuleData(data)
{
    if(data.name == 'Rule Creation')
    {
      this.rulecreate = true;
      this.rulesummary = false;
     
    }
    if(data.name == 'Summary')
    {
      this.rulecreate = false;
      this.rulesummary = true;
   
    }


}
rulecopy()
{
  this.brsformsdata.get('name').setValue(this.brsformsdata.get('name').value);
}
wordclick(){
this.showdeliminater=true
}
characterclick(){
  this.showdeliminater=false
}
numericclick(){
  this.showdeliminater=false
}
cbswordclick(){
  this.showcbsdeliminater=true
}
cbscharacterclick(){
  this.showcbsdeliminater=false
}
cbsnumericclick(){
  this.showcbsdeliminater=false
}
// addWisefinCard(){
//     const newCardNumber = this.cards.length + 1;
//     const newCardTitle = `WISEFIN ${newCardNumber}`;
//     const newCardForm = this.fb.group({
//       name:[""],
//       fas_col_name:[""],
//       fas_starts_with:[""],
//       fas_delimiter:[""],
//       fas_delimiter2:[""],
//       occuranceControl2:[""],
//       occuranceControl:[""],
//       "between_after":"after",
//       same_date:[''],
//       createordebit:[''],
//       fas_starting_position:[''],
//       fas_ending_position:[''],
//       fas_word_character:[""],
//       fas_forward_backward:[""],
//       fas_full_column: [''],
//       cbs_col_name:[""],
//       cbs_starts_with:[""],
//       cbs_delimiter:[""],
//       cbs_starting_position:[''],
//       cbs_ending_position:[''],
//       cbs_word_character:[""],
//       cbs_forward_backward:[""],
//       cbs_full_column:[''],
//       "count":2,
//       "statement_rule":0,
//      });

//     this.cards.push({ title: newCardTitle, formGroup: newCardForm });
//     if (this.cards.length === 2) {
//       this.addButtonDisabled = true;
//     }
//     // if (this.cards.length <= 1) {
//     //   this.addButtonEnabled = true;
//     // }
//     //  if (this.cards.length === 0) {
//     //   this.addButtonEnabled = true;
//     // } else if (this.cards.length >= 1) {
//     //   this.addButtonEnabled = false;
//     // }
//   }
//   removeWisefinCard(index){
//     this.cards.splice(index, 1);
//     this.addButtonDisabled = false; // Re-enable the add button
//   }
  addWisefinCard() {
    this.wisefin1 = true;
    this.addButtonDisabled = true;
  }
  removeWisefinCard() {
    this.wisefin1 = false;
    this.addButtonDisabled = false;
    this.brsformsdata1.reset();
  }
  addWisefinCard1() {
    this.wisefin1 = true;
    // this.wisefin2 = true;
  }
  addWisefinCard2(){
    this.wisefin1 = true;
    this.wisefin2 = true;
    this.addButtonDisabled = true;
  }
  removeWisefinCard2(){
    this.wisefin2 = false;
    this.addButtonDisabled = false;
    this.brsformsdata2.reset();
  }
  backtosummary(){
    console.log('clicked')
    this.router.navigate(['brs/brsmaster'],{queryParams: {key:'rulesummary'},skipLocationChange: true});  
  }
  glnumbercheck(event){
    console.log(event.checked,'event');
    if(event.checked===true){
      this.newform.get('statement_rule').setValue(1)
    }
    else{
      this.newform.get('statement_rule').setValue(0)
    }
  }
  samedatecheck(event){
    console.log(event.checked,'event');
    if(event.checked===true){
      this.newform.get('same_date').setValue(1)
    }
    else{
      this.newform.get('same_date').setValue(0)
    }
  }
  wisefinstartwith(e,i){
    console.log(e.checked,'event');
    if (e.checked){
      this.wisecheckboxkey[i]=false
      this.showstartwithwisefin[i]=true
    }else{
      this.wisecheckboxkey[i]=true
      this.showstartwithwisefin[i]=false
    }
  }
  cbsstartwith(e,i){
    if (e.checked){
      this.checkboxkey[i]=false
      this.showstartwithcbs[i]=true
    }else{
      this.checkboxkey[i]=true
      this.showstartwithcbs[i]=false
    }
  }
  addLesson() {
    let lessonForm = this.fb.group({
      glnumber:[0],
     
      fas_col_name:[""],
      fas_starts_with:[""],
      fas_starts_with_number:[null],
      fas_delimiter:[""],
      // fas_delimiter2:[""],
      cbs_occurencess:[null],
      fas_occurencess:[null],
      "between_after":"after",
     
      createordebit:[''],
      fas_starting_position:[null],
      fas_ending_position:[null],
      fas_word_character:[""],
      fas_forward_backward:[""],
      fas_full_column: [0],
      cbs_col_name:[""],
      cbs_starts_with:[""],
      cbs_starts_with_number:[null],
      cbs_delimiter:[""],
      cbs_starting_position:[null],
      cbs_ending_position:[null],
      cbs_word_character:[""],
      cbs_forward_backward:[""],
      cbs_full_column:[0],
   
      wisefinxl:[''],
      "count":2,
    });
  
    this.lessons.push(lessonForm);
    this.checkboxkey[this.lessons.length]=true
    this.wisecheckboxkey[this.lessons.length]=true
    this.showstartwithwisefin[this.lessons.length]=false
    this.showstartwithcbs[this.lessons.length]=false
    this.nolimtfas[this.lessons.length]=true
    this.nolimtcbs[this.lessons.length]=true

  }
  get lessons() {
    return this.form.get('lessons') as FormArray;
  }
  deleterule(i){
   
    if(this.lessons.length==1){
this.notification.showInfo('Atleast have one rule to save')
    }
    else{
      this.lessons.removeAt(i);
    }
    
  }

  autocompletewisefinxlScroll() {
    this.hastemp_next = true;
    this.hastemp_previous = true;
    this.current_temp_page = 1
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
              if (this.hastemp_next === true) {                
                this.brsService.getNtemplates1(this.template_input.nativeElement.value, this.current_temp_page + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.fetchWise = this.fetchWise.concat(datas);
                    if (this.fetchWise.length >= 0) {
                      this.hastemp_next = datapagination.has_next;
                      this.hastemp_previous = datapagination.has_previous;
                      this.current_temp_page = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}


