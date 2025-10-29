import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/service/notification.service";
import { MatTableDataSource } from "@angular/material/table";
import { BrsApiServiceService } from "../brs-api-service.service";
import { DialogDetails } from "src/app/dtpc/los-invoice-approval-view/los-invoice-approval-view.component";
import { data } from "jquery";
import { stringify } from "querystring";
import { ToastrService } from "ngx-toastr";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgxSpinnerService } from "ngx-spinner";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  takeUntil,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
export interface temp {
  template_name: string;
}

declare var bootstrap: any;
@Component({
  selector: "app-rulesummary",
  templateUrl: "./rulesummary.component.html",
  styleUrls: ["./rulesummary.component.scss"],
})
export class RulesummaryComponent implements OnInit {
  url = environment.apiURL;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("template_input") template_input: any;
  @ViewChild("temp_auto") temp_auto: MatAutocomplete;

  payload: any;
  statuss: any;
  recom: any;
  fetchfields: any;
  fetchfieldsC: any;
  daata2: any;
  @ViewChild("closebutton") closebutton: ElementRef;
  fas_full_column: any;
  wisecheckboxkey1: boolean = true;
  brsformsdata2: FormGroup;
  wisecheckboxkey2: boolean = true;
  status1: any;
  status2: any;
  wisefin1: boolean = false;
  wisefin2: boolean = false;
  checkboxvalidation: any[] = [];
  form: FormGroup;
  newform: FormGroup;
  checkboxvalidation1: any;
  filedata: FormGroup;
  fetchWise: any;
  temp_name: any;
  cbs_array: any;
  role_search_summary_api: any;
  wisefine_array: any;
  rules_btns: any;
  datassearchs: any;
  typearray: any = [
    { name: "Recon", id: '0' },
    { name: "ARS", id: '1' },
  ];
  typearray_dd = {
    label: "Type",
    data: this.typearray,
    params: "",
    searchkey: "",
    displaykey: "name",
    Outputkey: "id",
    fronentdata: true,
    SearchbyUrl:true
  };
  type_dd={
    label: "Type",
    data:this.typearray,
     params: "",
     searchkey: "",
     displaykey: "name",    
     Outputkey:"id",
     fronentdata:true,
  }
  searchrule: any = "String";

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private brsService: BrsApiServiceService,
    private router: Router,
    private toaster: ToastrService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.role_search_summary_api = {
      method: "get",
      url: this.url + "brsserv/get_rule",
      params: "",
    };
    this.rules_btns = [
      {
        icon: "add",
        tooltip: "Rule Creation",
        function: this.addrules.bind(this),
      },
    ];
    // this.datassearchs = [
    //   { type: "input", label: "Rule Name", formvalue: "rule_name" },
    //   { type: "input", label: "Template", formvalue: "temp_name" },
    //   { type: "input", label: "Description", formvalue: "description" },
    //   { "type": "dropdown", inputobj: this.typearray_dd, formvalue: "recon_ars" },
    // ];
    this.datassearchs = [{ type: "input", label: "Rule Name", formvalue: "rule_name" },
      { type: "input", label: "Template", formvalue: "temp_name" },
      { type: "input", label: "Description", formvalue: "description" },
    {"type":"dropdown",inputobj: this.typearray_dd,formvalue:"recon_ars" }]
    
  }
  summarylists = [];
  summaryslist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1,
  };

  checkboxkey: boolean[] = [true];
  wisecheckboxkey: boolean[] = [true];
  showstartwithwisefin: boolean[] = [false];
  showstartwithcbs: boolean[] = [false];
  nolimtfas: boolean[]=[true]
  nolimtcbs: boolean[]=[true]
  showdeliminater: boolean = false;
  diableposition: boolean = false;
  showlimit1: boolean[] = [false];
  showlimit: boolean[] = [false];
  // order: FormGroup;
  // orders: any = [];
  datassearch: FormGroup;
  brsformsdata: FormGroup;
  brsformsdata1: FormGroup;
  brsformdata2: FormGroup;
  templateeditform: FormGroup;
  status: any;
  newVal: any;
  hastemp_next: boolean;
  hastemp_previous: boolean;
  current_temp_page: number;
  isLoading: boolean;

  ngOnInit(): void {
    // this.getWiseXLs()
    // this.order = this.fb.group({
    //   order: '',
    // })
    this.brsService
      .getNtemplates1("", this.pagination.index)
      .subscribe((results) => {
        this.fetchWise = results["data"];
      });
    this.getFieldsC();
    this.getFields();
    this.newform = this.fb.group({
      name: [""],
      same_date: [0],
      statement_rule: [0],
      description: [""],
      order: [""],
      wisefinxl: "",
    });
    this.datassearch = this.fb.group({
      rule_name: "",
      temp_name: "",
      description: "",
      recon_ars: "",
    });

    this.filedata = this.fb.group({
      wisefinxl: "",
      cbsxl: "",
    });
    this.brsformsdata = this.fb.group({
      name: [""],
      fas_col_name: [""],
      fas_starts_with: [""],
      fas_delimiter: [""],
      fas_delimiter2: [""],
      occuranceControl2: [""],
      occuranceControl: [""],
      between_after: "after",
      order: [""],
      createordebit: [""],
      fas_starting_position: [""],
      fas_ending_position: [""],
      fas_word_character: [""],
      fas_forward_backward: [""],
      fas_full_column: [""],
      cbs_col_name2: [""],
      cbs_col_name: [""],
      cbs_starts_with: [""],
      cbs_delimiter: [""],
      cbs_starting_position: [""],
      cbs_ending_position: [""],
      cbs_word_character: [""],
      cbs_forward_backward: [""],
      cbs_full_column: [""],
      same_date: [0],
      count: 2,
      statement_rule: [0],
      fas_starts_with_number: [""],
      cbs_starts_with_number: [""],
    });
    this.brsformsdata1 = this.fb.group({
      fas_full_column1: [""],
      fas_col_name1: [""],
      fas_starts_with1: [""],
      fas_delimiter1: [""],
      occuranceControl1: [""],
      fas_starting_position1: [""],
      fas_ending_position1: [""],
      fas_forward_backward1: [""],
    });
    this.brsformsdata2 = this.fb.group({
      fas_full_column2: [""],
      fas_col_name2: [""],
      fas_starts_with2: [""],
      fas_delimiter3: [""],
      occuranceControl2: [""],
      fas_starting_position2: [""],
      fas_ending_position2: [""],
      fas_forward_backward2: [""],
    });
    this.templateeditform = this.fb.group({
      between_after: null,
      count: null,
      delimiter: null,
      description: null,
      ending_position: null,
      forward_backward: null,
      from_count: null,
      full_column: null,
      id: null,
      starting_position: null,
      same_date: null,
      starts_with: null,
      statement_rule: null,
      status: null,
      word_character: null,
      value: "",
      include: "",
      key: "",
    });

    this.form = this.fb.group({
      lessons: this.fb.array([]),
    });
    this.getFields();
    this.rule_search("");
  }

  getruleenginedata(params) {
    this.SpinnerService.show();
    this.brsService
      .getruledefinition1(this.pagination.index, params)
      .subscribe((results) => {
        this.SpinnerService.hide();
        if (!results) {
          return false;
        }

        this.summarylists = results["data"];
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
      });
  }
  Addcheckbox(e: MatCheckboxChange, i) {
    const formArray = this.lessons;
    const formGroup = formArray.at(i) as FormGroup;
    if (e.checked) {
      this.checkboxkey[i] = false;
      formGroup.get("cbs_full_column").setValue(1);
    } else {
      this.checkboxkey[i] = true;
      formGroup.get("cbs_full_column").setValue(0);
    }
  }
  // getData(id)
  // {
  //   let payload = {
  //     "id" : String(id)
  //   }
  //   this.brsService.postfile(payload).subscribe(results =>{

  //   })
  //   this.getFields();
  // }
  // wisebincheckbox(e:MatCheckboxChange){

  //   if (e.checked){
  //     this.wisecheckboxkey=false
  //   }else{
  //     this.wisecheckboxkey=true
  //   }

  // }
  characterclick() {
    this.showdeliminater = false;
  }
  getFields() {
    this.brsService.arsFields().subscribe((res) => {
      this.fetchfields = res["data"];
      if (this.fetchfields.length == 0) {
        this.fetchfields = [
          "Entry_gid",
          "Branch_code",
          "Gl_number",
          "Transaction date",
          "DR/CR",
          "Amount",
          "Remark",
          "Status",
          "Created Date",
          "Updated Date",
          "Entry_crno",
          "Entry_module",
          "Value_date",
          "Cbs_date",
        ];
      }
    });
  }

  getFieldsC() {
    this.brsService.arsFields().subscribe((res) => {
      this.fetchfieldsC = res["data"];
      console.log("column name", this.fetchfieldsC);
      if (this.fetchfieldsC.length == 0) {
        this.fetchfieldsC = [
          "Branch_code",
          "Date",
          "Narration",
          "DR/CR",
          "AC_CCY",
          "ACY AMOUNT",
          "EQ LCY AMOUNT",
          "RUNNING BALANCE",
          "Related account",
        ];
      }
    });
  }
  wordclick() {
    this.showdeliminater = true;
  }
  // characterclick(){
  //   this.showdeliminater=false
  // }
  numericclick() {
    this.showdeliminater = false;
  }

  runrules() {
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
    if (this.brsformsdata.controls["key"].value == "") {
      this.newVal = {
        name: this.brsformsdata.controls["name"].value,
        description: this.brsformsdata.controls["description"].value,
        starts_with: this.brsformsdata.controls["starts_with"].value,
        delimiter: this.brsformsdata.controls["delimiter"].value,
        between_after: "2",
        status: "2",
        starting_position:
          this.brsformsdata.controls["starting_position"].value,
        ending_position: this.brsformsdata.controls["ending_position"].value,
        word_character: this.brsformsdata.controls["word_character"].value,
        count: this.brsformsdata.controls["count"].value,
        forward_backward: this.brsformsdata.controls["forward_backward"].value,
        full_column: this.brsformsdata.controls["full_column"].value,
        statement_rule: this.brsformsdata.controls["statement_rule"].value,
        same_date: parseInt(this.brsformsdata.controls["same_date"].value),

        sub_rule: [],
      };
    } else {
      this.newVal = {
        name: this.brsformsdata.controls["name"].value,
        description: this.brsformsdata.controls["description"].value,
        starts_with: this.brsformsdata.controls["starts_with"].value,
        delimiter: this.brsformsdata.controls["delimiter"].value,
        between_after: "2",
        status: "2",
        starting_position:
          this.brsformsdata.controls["starting_position"].value,
        ending_position: this.brsformsdata.controls["ending_position"].value,
        word_character: this.brsformsdata.controls["word_character"].value,
        count: this.brsformsdata.controls["count"].value,
        forward_backward: this.brsformsdata.controls["forward_backward"].value,
        full_column: this.brsformsdata.controls["full_column"].value,
        statement_rule: this.brsformsdata.controls["statement_rule"].value,
        same_date: parseInt(this.brsformsdata.controls["same_date"].value),

        sub_rule: [
          {
            key: this.brsformsdata.controls["key"].value,
            value: this.brsformsdata.controls["value"].value,
            include: this.brsformsdata.controls["include"].value,
          },
        ],
      };

      // exclude_ledger_id : '',
      // exclude_statement_id:''
    }
    this.brsService.defineRuleEngine(this.newVal).subscribe((results) => {
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;

      if (results.status == "success") {
        this.notification.showSuccess("Rule Created Successfully...");
        // this.router.navigate(['brs/rulesumm'],{});
      } else {
        this.notification.showError(results.description);
      }
    });
  }
  rulecopy() {
    this.brsformsdata.get("name").setValue(this.brsformsdata.get("name").value);
  }

  wisebincheckbox(e: MatCheckboxChange, i, formgroup) {
    console.log(formgroup, "formgroup");
    const formArray = this.lessons;
    const formGroup = formArray.at(i) as FormGroup;

    console.log(formGroup, "form1");
    if (e.checked) {
      this.wisecheckboxkey[i] = false;
      formGroup.get("fas_full_column")?.setValue(1);
    } else {
      this.wisecheckboxkey[i] = true;
      formGroup.get("fas_full_column")?.setValue(0);
    }
    console.log(formgroup, "formgroup2");
  }
  wisebincheckbox1(e: MatCheckboxChange) {
    if (e.checked) {
      this.wisecheckboxkey1 = false;
    } else {
      this.wisecheckboxkey1 = true;
    }
  }
  wisebincheckbox2(e: MatCheckboxChange) {
    if (e.checked) {
      this.wisecheckboxkey2 = false;
    } else {
      this.wisecheckboxkey2 = true;
    }
  }
  Nwsefinrunrules() {
    console.log(this.form.value.lessons, "form_value");
    let payload = {
      name: this.newform.get("name").value,
      same_date: this.newform.get("same_date").value,
      statement_rule: this.newform.get("statement_rule").value,
      description: this.newform.get("description").value,
      temp_name: this.temp_name,
      order: this.newform.get("order").value,
      id: this.daata2,
      data: this.form.value.lessons,
    };
    console.log(payload);
    // return
    if (
      this.newform.controls["name"].value == "" ||
      this.newform.controls["name"].value == undefined ||
      this.newform.controls["name"].value == null
    ) {
      this.toaster.error("Enter Rule Name");
      return false;
    }
    let startingPositionValue =
      this.brsformsdata.controls["fas_starting_position"].value;
    if (startingPositionValue === "") {
      startingPositionValue = null;
    }
    let endingPositionValue =
      this.brsformsdata.controls["fas_ending_position"].value;
    if (endingPositionValue === "") {
      endingPositionValue = null;
    }
    let startingPositionValue1 =
      this.brsformsdata1.controls["fas_starting_position1"].value;
    if (startingPositionValue1 === "") {
      startingPositionValue1 = null;
    }
    let endingPositionValue1 =
      this.brsformsdata1.controls["fas_ending_position1"].value;
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
    let startingPositionValue2 =
      this.brsformsdata2.controls["fas_starting_position2"].value;
    if (startingPositionValue2 === "") {
      startingPositionValue2 = null;
    }
    let endingPositionValue2 =
      this.brsformsdata2.controls["fas_ending_position2"].value;
    if (endingPositionValue2 === "") {
      endingPositionValue2 = null;
    }
    let payloadArray = [];

    let wisefin = {
      name: this.brsformsdata.controls["name"].value,
      fas_starts_with: this.brsformsdata.controls["fas_starts_with"].value,
      fas_delimiter: this.brsformsdata.controls["fas_delimiter2"].value,
      fas_starting_position: startingPositionValue,
      fas_ending_position: endingPositionValue,
      fas_word_character:
        this.brsformsdata.controls["fas_word_character"].value,
      fas_forward_backward:
        this.brsformsdata.controls["fas_forward_backward"].value,
      fas_full_column: this.brsformsdata.controls["fas_full_column"].value,
      fas_col_name: this.brsformsdata.controls["fas_col_name"].value,
      cbs_col_name: this.brsformsdata.controls["cbs_col_name"].value,
      cbs_starts_with: this.brsformsdata.controls["cbs_starts_with"].value,
      cbs_delimiter: this.brsformsdata.controls["cbs_delimiter"].value,
      cbs_starting_position:
        this.brsformsdata.controls["cbs_starting_position"].value,
      cbs_ending_position:
        this.brsformsdata.controls["cbs_ending_position"].value,
      cbs_word_character:
        this.brsformsdata.controls["cbs_word_character"].value,
      cbs_forward_backward:
        this.brsformsdata.controls["cbs_forward_backward"].value,
      cbs_full_column: this.brsformsdata.controls["cbs_full_column"].value,
      cbs_occurrence: this.brsformsdata.controls["occuranceControl2"].value,
      between_after: this.brsformsdata.controls["createordebit"].value,
      same_date: this.brsformsdata.controls["same_date"].value,
      statement_rule: this.brsformsdata.controls["statement_rule"].value,
      fas_starts_with_number:
        this.brsformsdata.controls["fas_starts_with_number"].value,
      cbs_starts_with_number:
        this.brsformsdata.controls["cbs_starts_with_number"].value,
      recom: null,
      status: null,
      sub_rule: [],
    };

    let wisefin1 = {
      name: this.brsformsdata.controls["name"].value,
      fas_starts_with: this.brsformsdata1.controls["fas_starts_with1"].value,
      fas_delimiter: this.brsformsdata1.controls["fas_delimiter1"].value,
      fas_starting_position: startingPositionValue1,
      fas_ending_position: endingPositionValue1,
      // fas_word_character: this.brsformsdata1.controls['fas_word_character1'].value,
      fas_forward_backward:
        this.brsformsdata1.controls["fas_forward_backward1"].value,
      fas_full_column: this.brsformsdata1.controls["fas_full_column1"].value,
      fas_col_name: this.brsformsdata1.controls["fas_col_name1"].value,
      // fas_occurrence: this.brsformsdata1.controls['occuranceControl1'].value,
      cbs_col_name: "",
      cbs_starts_with: "",
      cbs_delimiter: "",
      cbs_starting_position: null,
      cbs_ending_position: null,
      cbs_word_character: "",
      cbs_forward_backward: "",
      cbs_full_column: 0,
      cbs_occurrence: "",
      same_date: this.brsformsdata.controls["same_date"].value,
      statement_rule: this.brsformsdata.controls["statement_rule"].value,
      fas_starts_with_number:
        this.brsformsdata.controls["fas_starts_with_number"].value,
      cbs_starts_with_number:
        this.brsformsdata.controls["cbs_starts_with_number"].value,
      recom: null,
      status: 1,
    };

    let wisefin2 = {
      name: this.brsformsdata.controls["name"].value,
      fas_starts_with: this.brsformsdata2.controls["fas_starts_with2"].value,
      fas_delimiter: this.brsformsdata2.controls["fas_delimiter3"].value,
      fas_starting_position: startingPositionValue2,
      fas_ending_position: endingPositionValue2,
      // fas_word_character: this.brsformsdata1.controls['fas_word_character1'].value,
      fas_forward_backward:
        this.brsformsdata2.controls["fas_forward_backward2"].value,
      fas_full_column: this.brsformsdata2.controls["fas_full_column2"].value,
      fas_col_name: this.brsformsdata2.controls["fas_col_name2"].value,
      // fas_occurrence: this.brsformsdata1.controls['occuranceControl1'].value,
      cbs_col_name: "",
      cbs_starts_with: "",
      cbs_delimiter: "",
      cbs_starting_position: null,
      cbs_ending_position: null,
      cbs_word_character: "",
      cbs_forward_backward: "",
      cbs_full_column: 0,
      cbs_occurrence: "",
      same_date: this.brsformsdata.controls["same_date"].value,
      statement_rule: this.brsformsdata.controls["statement_rule"].value,
      fas_starts_with_number:
        this.brsformsdata.controls["fas_starts_with_number"].value,
      cbs_starts_with_number:
        this.brsformsdata.controls["cbs_starts_with_number"].value,
      recom: null,
      status: 1,
    };

    payloadArray.push(wisefin);

    if (this.wisefin1) {
      payloadArray.push(wisefin1);
    }
    if (this.wisefin2) {
      payloadArray.push(wisefin2);
    }

    console.log("Payload Array", payloadArray);

    // if(this.brsformsdata.controls['key'].value == "")
    // {
    this.newVal = {
      name: this.brsformsdata.controls["name"].value,
      // description : this.brsformsdata.controls['description'].value,
      fas_starts_with: this.brsformsdata.controls["fas_starts_with"].value,
      fas_delimiter: this.brsformsdata.controls["fas_delimiter"].value,
      fas_starting_position:
        this.brsformsdata.controls["fas_starting_position"].value,
      fas_ending_position:
        this.brsformsdata.controls["fas_ending_position"].value,
      fas_word_character:
        this.brsformsdata.controls["fas_word_character"].value,
      fas_forward_backward:
        this.brsformsdata.controls["fas_forward_backward"].value,
      fas_full_column: this.brsformsdata.controls["fas_full_column"].value,
      fas_col_name: this.brsformsdata.controls["fas_col_name"].value,
      id: this.daata2,
      cbs_col_name: this.brsformsdata.controls["cbs_col_name2"].value,
      cbs_starts_with: this.brsformsdata.controls["cbs_starts_with"].value,
      cbs_delimiter: this.brsformsdata.controls["cbs_delimiter"].value,
      cbs_starting_position:
        this.brsformsdata.controls["cbs_starting_position"].value,
      cbs_ending_position:
        this.brsformsdata.controls["cbs_ending_position"].value,
      cbs_word_character:
        this.brsformsdata.controls["cbs_word_character"].value,
      cbs_forward_backward:
        this.brsformsdata.controls["cbs_forward_backward"].value,
      cbs_full_column: this.brsformsdata.controls["cbs_full_column"].value,
      cbs_occurencess: this.brsformsdata.controls["occuranceControl2"].value,
      between_after: this.brsformsdata.controls["createordebit"].value,
      same_date: parseInt(this.brsformsdata.controls["same_date"].value),
      order: this.brsformsdata.controls["order"].value,
      statement_rule: this.brsformsdata.controls["statement_rule"].value,
      fas_starts_with_number:
        this.brsformsdata.controls["fas_starts_with_number"].value,
      cbs_starts_with_number:
        this.brsformsdata.controls["cbs_starts_with_number"].value,
      // status:'2',
      // // count : this.brsformsdata.controls['count'].value,
      // statement_rule : this.brsformsdata.controls['statement_rule'].value,

      sub_rule: [],
      // }
    };
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
    this.brsService.NdefineRuleEngine(payload).subscribe((results) => {
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;

      if (results.status == "success") {
        this.notification.showSuccess("Rule Updated Successfully...");
        this.closebutton.nativeElement.click();
        this.rule_search("");
        // this.router.navigate(['brs/rulesumm']);
      } else {
        this.notification.showError(results.code);
      }
    });
  }

  // deleterules(data)
  // {
  //   if(data.status == 2)
  //   {
  //   this.payload = 0
  //   }
  //   else{
  //     this.payload =  2
  //   }
  //   this.brsService.deleterules(data.id, this.payload).subscribe(results => {
  //     if (results.status == 'Successfully Updated') {
  //       this.notification.showSuccess("Rule Successfully Updated...")

  //     }
  //     else {
  //       this.notification.showError(results.description)

  //     }
  //   })
  // }

  openbrsruleset() {
    this.router.navigate(["brs/newrulesets"], {});
  }

  prevpages() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1;
    }
    this.rule_search("");
  }
  nextpages() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.rule_search("");
  }
 
  rule_search(data) {
    // let params = "";
    // let formvalue = this.datassearch.value;
    // if (formvalue.temp_name) {
    //   params += "&temp_name=" + formvalue.temp_name;
    // }
    // if (formvalue.description) {
    //   params += "&description=" + formvalue.description;
    // }
    // if (formvalue.rule_name) {
    //   params += "&rule_name=" + formvalue.rule_name;
    // }
    // if (formvalue.recon_ars === 0 || formvalue.recon_ars === 1) {
    //   params += "&recon_ars=" + formvalue.recon_ars;
    // }
    // this.getruleenginedata(params);
    this.role_search_summary_api = {
      method: "get",
      url: this.url + "brsserv/get_rule",
      params: data,
    };
  }
  datassearchreset() {
    this.datassearch.reset();
    this.pagination.index = 1;
    this.rule_search("");
  }
  ruleedit(data) {}

  viewsinglerecord(vals) {
    this.brsService.getsinglerule(vals.id).subscribe((results) => {
      if (!results) {
        return false;
      }
      this.summaryslist = results["data"];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;
    });
    this.popupopenview();
  }

  UpdateForms() {
    if (this.templateeditform.controls["key"].value == undefined) {
      this.newVal = {
        id: this.templateeditform.controls["id"].value,
        description: this.templateeditform.controls["description"].value,
        starts_with: this.templateeditform.controls["starts_with"].value,
        delimiter: this.templateeditform.controls["delimiter"].value,
        between_after: this.templateeditform.controls["between_after"].value,
        starting_position:
          this.templateeditform.controls["starting_position"].value,
        ending_position:
          this.templateeditform.controls["ending_position"].value,
        word_character: this.templateeditform.controls["word_character"].value,
        count: this.templateeditform.controls["count"].value,
        forward_backward:
          this.templateeditform.controls["forward_backward"].value,
        full_column: this.templateeditform.controls["full_column"].value,
        statement_rule: this.templateeditform.controls["statement_rule"].value,
        same_date: parseInt(this.templateeditform.controls["same_date"].value),

        sub_rule: [],
      };
    } else {
      this.newVal = {
        id: this.templateeditform.controls["id"].value,
        description: this.templateeditform.controls["description"].value,
        starts_with: this.templateeditform.controls["starts_with"].value,
        delimiter: this.templateeditform.controls["delimiter"].value,
        between_after: this.templateeditform.controls["between_after"].value,
        starting_position:
          this.templateeditform.controls["starting_position"].value,
        ending_position:
          this.templateeditform.controls["ending_position"].value,
        word_character: this.templateeditform.controls["word_character"].value,
        count: this.templateeditform.controls["count"].value,
        forward_backward:
          this.templateeditform.controls["forward_backward"].value,
        full_column: this.templateeditform.controls["full_column"].value,
        statement_rule: this.templateeditform.controls["statement_rule"].value,
        same_date: parseInt(this.templateeditform.controls["same_date"].value),

        sub_rule: [
          {
            key: this.templateeditform.controls["key"].value,
            value: this.templateeditform.controls["value"].value,
            include: this.templateeditform.controls["include"].value,
          },
        ],
      };
    }

    this.brsService.ruleSedit(this.newVal).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Template Updated Successfully ...");
        // this.closebuttons.nativeElement.click();
        this.rule_search("");
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  editDatas(data) {
    this.lessons.clear();
    this.SpinnerService.show();
    this.brsService.editrulee(data.id).subscribe((results) => {
      this.SpinnerService.hide();
      console.log("m", data);
      let res = results["data"];
      for (let value of res) {
        let index = res.indexOf(value);
        this.checkboxvalidation[index] = value;
        this.checkboxvalidation1 = value;

        let lessonForm = this.fb.group({
          glnumber: [0],

          fas_col_name: [value.fas_col_name],
          fas_starts_with: [value.fas_starts_with],
          fas_starts_with_number: [value.fas_starts_with_number],
          // fas_delimiter:[""],
          fas_delimiter: [value.fas_delimiter],
          fas_occurencess: [value.fas_occurencess],
          cbs_occurencess: [value.cbs_occurencess],
          between_after: value.between_after,

          createordebit: [""],
          fas_starting_position: [value.fas_starting_position],
          fas_ending_position: [value.fas_ending_position],
          fas_word_character: [value.fas_word_character],
          fas_forward_backward: [value.fas_forward_backward],
          fas_full_column: [value.fas_full_column],
          cbs_col_name: [value.cbs_col_name],
          cbs_starts_with: [value.cbs_starts_with],
          cbs_starts_with_number: [value.cbs_starts_with_number],
          cbs_delimiter: [value.cbs_delimiter],
          cbs_starting_position: [value.cbs_starting_position],
          cbs_ending_position: [value.cbs_ending_position],
          cbs_word_character: [value.cbs_word_character],
          cbs_forward_backward: [value.cbs_forward_backward],
          cbs_full_column: [value.cbs_full_column],
          id: [value.id],
          wisefinxl: [""],
          count: 2,
        });

        this.lessons.push(lessonForm);
        if (this.checkboxvalidation[index]?.fas_full_column === 1) {
          this.wisecheckboxkey[index] = false;
        } else {
          this.wisecheckboxkey[index] = true;
        }
        if (this.checkboxvalidation[index]?.cbs_full_column === 1) {
          this.checkboxkey[index] = false;
        } else {
          this.checkboxkey[index] = true;
        }
        if (
          this.checkboxvalidation[index]?.fas_starts_with_number !== null ||
          this.checkboxvalidation[index]?.fas_starts_with !== ""
        ) {
          // this.wisecheckboxkey[index]=false
          this.showstartwithwisefin[index] = true;
        } else {
          // this.wisecheckboxkey[index]=true
          this.showstartwithwisefin[index] = false;
        }
        if (
          this.checkboxvalidation[index]?.cbs_starts_with_number !== null ||
          this.checkboxvalidation[index]?.cbs_starts_with !== ""
        ) {
          // this.checkboxkey[index]=false
          this.showstartwithcbs[index] = true;
        } else {
          // this.checkboxkey[index]=true
          this.showstartwithcbs[index] = false;
        }

        if(value.fas_forward_backward==='limit'){
          this.nolimtfas[index]=true
          this.showlimit[index] =true
        }
        else if(value.fas_forward_backward==='no_limit'){
          this.nolimtfas[index]=false
          this.showlimit[index] =true
        }
        if(value.cbs_forward_backward==='limit'){
          this.nolimtcbs[index]=true
          this.showlimit1[index] =true
        }
        else if(value.cbs_forward_backward==='no_limit'){
          this.nolimtcbs[index]=false
          this.showlimit1[index] =true
        }
      }
      this.newform.patchValue({
        name: results["data"][0]?.name,
        description: results["data"][0]?.description,
        order: results["data"][0]?.order,
      });
      if (this.checkboxvalidation1?.same_date === 1) {
        this.newform.get("same_date").setValue(1);
      } else {
        this.newform.get("same_date").setValue(0);
      }
      if (this.checkboxvalidation1?.statement_rule === 1) {
        this.newform.get("statement_rule").setValue(1);
      } else {
        this.newform.get("statement_rule").setValue(0);
      }
      for (let x of this.fetchWise) {
        if ((x.template_name = this.checkboxvalidation1?.temp_name)) {
          this.newform.get("wisefinxl").setValue(x);
          this.getData(x);
        }
      }
      
    });
    this.daata2 = data.id;
    this.fas_full_column = data.fas_full_column;
    // let same_date = data.same_date.toString();

    // this.brsformsdata.patchValue({
    //   name:data.name,
    //   createordebit:data.between_after,
    //   // same_date:same_date,
    //   order:data.order,
    //   fas_full_column : data.fas_full_column,
    //   fas_col_name:data.fas_col_name,
    //   fas_starts_with:data.fas_starts_with,
    //   fas_delimiter2:data.fas_delimiter,
    //   occuranceControl :data.fas_occurencess,
    //   id:data.id,
    //   fas_starting_position:data.fas_starting_position,
    //   fas_ending_position:data.fas_ending_position,
    //   fas_forward_backward:data.fas_forward_backward,
    //   cbs_col_name2:data.cbs_col_name,
    //   cbs_starts_with:data.cbs_starts_with,
    //   cbs_delimiter:data.cbs_delimiter,
    //   cbs_starting_position:data.cbs_starting_position,
    //   cbs_ending_position:data.cbs_ending_position,
    //   cbs_word_character:data.cbs_word_character,
    //   cbs_forward_backward:data.cbs_forward_backward,
    //   cbs_full_column:data.cbs_full_column,
    //   occuranceControl2:data.cbs_occurencess,
    // });
    this.popupopenviewdata();
  }

  deleteData(data) {
    var answer = window.confirm("Are you sure want to delete?");
    if (answer) {
      //some code
    } else {
      return false;
    }
    this.SpinnerService.show();
    this.brsService.deleteData(data.id).subscribe((response) => {
      if (response.status) {
        this.notification.showSuccess("Successfully Deleted!..");
        this.rule_search("");
        this.SpinnerService.hide();
      } else {
        this.notification.showError(response.description);
        this.SpinnerService.hide();
        return false;
      }
    });
  }
  statusrules(data) {
    let statusToggle = data.status;
    if (statusToggle == 2) {
      this.payload = 0;
    } else {
      this.payload = 2;
    }
    this.brsService.statusrules(data.id, this.payload).subscribe((results) => {
      if (results.status) {
        this.notification.showSuccess(results.status);
        this.role_search_summary_api = {
          method: "get",
          url: this.url + "brsserv/get_rule",
          params: "",
        };
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  recommendatory(data) {
    let recomToggle = data.recomm_field;
    if (recomToggle == 1) {
      this.recom = 0;
    } else {
      this.recom = 1;
    }
    this.brsService
      .recommendatory(data.id, this.recom)
      .subscribe((response) => {
        if (response.status) {
          this.notification.showSuccess("Successfully Updated");
        } else {
          this.notification.showError(response.code);
        }
      });
  }
  addrules(data) {
    this.router.navigate(["brs/newrulesets"], {});
  }
  glnumbercheck(event) {
    console.log(event.checked, "event");
    if (event.checked === true) {
      this.newform.get("statement_rule").setValue(1);
    } else {
      this.newform.get("statement_rule").setValue(0);
    }
  }
  samedatecheck(event) {
    console.log(event.checked, "event");
    if (event.checked === true) {
      this.newform.get("same_date").setValue(1);
    } else {
      this.newform.get("same_date").setValue(0);
    }
  }
  wisefinstartwith(e, i) {
    console.log(e.checked, "event");
    if (e.checked) {
      this.wisecheckboxkey[i] = false;
      this.showstartwithwisefin[i] = true;
    } else {
      this.wisecheckboxkey[i] = true;
      this.showstartwithwisefin[i] = false;
    }
  }
  cbsstartwith(e, i) {
    if (e.checked) {
      this.checkboxkey[i] = false;
      this.showstartwithcbs[i] = true;
    } else {
      this.checkboxkey[i] = true;
      this.showstartwithcbs[i] = false;
    }
  }
  addLesson() {
    let lessonForm = this.fb.group({
      glnumber: [0],

      fas_col_name: [""],
      fas_starts_with: [""],
      fas_starts_with_number: [null],
      fas_delimiter: [""],
      // fas_delimiter2:[""],
      cbs_occurencess: [null],
      fas_occurencess: [null],
      between_after: "after",

      createordebit: [""],
      fas_starting_position: [null],
      fas_ending_position: [null],
      fas_word_character: [""],
      fas_forward_backward: [""],
      fas_full_column: [0],
      cbs_col_name: [""],
      cbs_starts_with: [""],
      cbs_starts_with_number: [null],
      cbs_delimiter: [""],
      cbs_starting_position: [null],
      cbs_ending_position: [null],
      cbs_word_character: [""],
      cbs_forward_backward: [""],
      cbs_full_column: [0],

      wisefinxl: [""],
      count: 2,
    });

    this.lessons.push(lessonForm);
    console.log(this.lessons.length - 1, "this.lessons.length");
    this.checkboxkey[this.lessons.length - 1] = true;
    this.wisecheckboxkey[this.lessons.length - 1] = true;
    this.showstartwithwisefin[this.lessons.length - 1] = false;
    this.showstartwithcbs[this.lessons.length - 1] = false;
    this.nolimtfas[this.lessons.length - 1]=true
    this.nolimtcbs[this.lessons.length - 1]=true
  }
  get lessons() {
    return this.form.get("lessons") as FormArray;
  }
  deleterule(i) {
    if (this.lessons.length == 1) {
      this.notification.showInfo("Atleast have one rule to save");
    } else {
      this.lessons.removeAt(i);
    }
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

  displaylimitcbs(event: KeyboardEvent,i) {
    const input = (event.target as HTMLInputElement).value;
    // const newValue = input + event.key;
    this.showlimit1[i] = input.length === 1;
  }
  displaylimit(event: KeyboardEvent,i) {
    const input = (event.target as HTMLInputElement).value;
    // const newValue = input + event.key;
    this.showlimit[i] = input.length === 1;
  }
  // getWiseXLs()
  // {
  //   this.brsService.getNtemplates1s(1,'').subscribe(results => {
  //     this.fetchWise = results['data']

  //   })
  // }
  getData(id) {
    this.temp_name = id.template_name;
    console.log(id);
    let payload = {
      name: id.template_name,
    };
    this.brsService.gettemp_data(payload).subscribe((results) => {
      console.log(results);

      this.wisefine_array = results["wisefin"];
      this.cbs_array = results["cbs"];
    });

    // this.getFields();
  }

  public templ_display(payment_name?: temp): string | undefined {
    return payment_name ? payment_name.template_name : undefined;
  }
  getWiseXLs() {
    // this.spinnerService.show();
    this.brsService
      .getNtemplates1(this.template_input.nativeElement.value, 1)
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

  autocompletewisefinxlScroll() {
    this.hastemp_next = true;
    this.hastemp_previous = true;
    this.current_temp_page = 1;
    setTimeout(() => {
      if (this.temp_auto && this.autocompleteTrigger && this.temp_auto.panel) {
        fromEvent(this.temp_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.temp_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.temp_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.temp_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.temp_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hastemp_next === true) {
                this.brsService
                  .getNtemplates1(
                    this.template_input.nativeElement.value,
                    this.current_temp_page + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.fetchWise = this.fetchWise.concat(datas);
                    if (this.fetchWise.length >= 0) {
                      this.hastemp_next = datapagination.has_next;
                      this.hastemp_previous = datapagination.has_previous;
                      this.current_temp_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  popupopenviewdata() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editdatas"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenview() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("viewmodalforrules"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  rule_summary_table = [
    {
      columnname: "Automatic Match",
      key: "Match",
      toggle: true,
      function: true,
      clickfunction: this.recommendatory.bind(this),
      validate: true,
      validatefunction: this.status_togle.bind(this),
    },
    { columnname: "Rule Name", key: "name" },
    { columnname: "Template Name", key: "temp_name" },
    {
      columnname: "Recon / ARS",
      key: "recon",
      validate: true,
      validatefunction: this.recon_ars.bind(this),
    },
    { columnname: "Order", key: "order" },
    {
      columnname: "Edit",
      key: "edit",
      icon: "edit",
      style: { cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.editDatas.bind(this),
    },
    // {
    //   columnname: "View",
    //   key: "view",
    //   style: { color: "gray", cursor: "pointer" },
    //   icon: "visibility",
    //   button: true,
    //   function: true,
    //   clickfunction: this.viewsinglerecord.bind(this),
    // },
    {
      columnname: "Status",
      key: "status",
      toggle: true,
      function: true,
      clickfunction: this.statusrules.bind(this),
      validate: true,
      validatefunction: this.status_toggle.bind(this),
    },
    {
      columnname: "Delete",
      icon: "delete",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "delete",
      function: true,
      clickfunction: this.deleteData.bind(this),
    },
  ];

  recon_ars(template) {
    let config: any = {
      value: "",
    };

    if (template.recon_ars == 1) {
      config = {
        value: "ARS",
      };
    } else
      config = {
        value: "Recon",
      };
    return config;
  }

  status_togle(data) {
    {
      let config: any = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: "",
        function: true,
      };
      if (data.recomm_field == 1) {
        config = {
          disabled: false,
          style: "",
          class: "success",
          value: "",
          checked: true,
          function: true,
        };
      } else if (data.recomm_field == 0) {
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
  status_toggle(data) {
    {
      let config: any = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: "",
        function: true,
      };
      if (data.status == 2) {
        config = {
          disabled: false,
          style: "",
          class: "primary",
          value: "",
          checked: true,
          function: true,
        };
      } else if (data.status == 0) {
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

  showFasSection = false;
  showCbsSection = false;

  toggleFasSection() {
    this.showFasSection = !this.showFasSection;
  }

  toggleCbsSection() {
    this.showCbsSection = !this.showCbsSection;
  }
}
