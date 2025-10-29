import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { CbdaserviceService } from "../cbdaservice.service";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { NotificationService } from "../../service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Button } from "protractor";
import { DatePipe } from "@angular/common";

export interface PriorityValue {
  id: string;
  name: string;
}
@Component({
  selector: "app-incusemaster-cbda",
  templateUrl: "./incusemaster-cbda.component.html",
  styleUrls: ["./incusemaster-cbda.component.scss"],
})
export class IncusemasterCbdaComponent implements OnInit {
  Url = environment.apiURL
  @ViewChild("employeeInput") employeeInput!: ElementRef;
  cbdaForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private cbdaservice: CbdaserviceService,
    private datePipe: DatePipe
  ) { }
  incandexcForm: FormGroup;
  incandexcForm2: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ColumnObj: any = {
    method: 'GET',
    url: this.Url + 'reportserv/get_column_names',
    params: '',
    displaykey: 'column',
    Outputkey: 'id',
    valuekey: 'column',
    label: 'Column',
    formcontrolname: 'Column_value',
    id: 'Column-id',
  };
  inc_Exc_datas: any = [
    {
      id: "1",
      names: "Include",
    },
    {
      id: "2",
      names: "Exclude",
    },
  ];
  bran_prod_datas: any = [
    {
      id: 1,
      name: "Branch",
    },
    {
      id: 1,
      name: "Product",
    },
  ];
  BranchProduct = {
    method: 'POST',
    url: this.Url + 'reportserv/get_target',
    data: {},
    displaykey: 'name',
    Outputkey: 'id',
    valuekey: 'name',
    label: 'Branch/Product',
    formcontrolname: 'bran_prod_Control',
    id: 'branch-id',
  }
  uploadsearch = [
    {
      type: 'dropdown',
      formvalue: 'Column_value',
      'label': 'Column',
      inputobj: this.ColumnObj,
    },
    { "type": "date", "label": "Date", "formvalue": "transdate" },
    { "type": "dropdown", "formvalue": "in_ex_cludeControl", inputobj: { fronentdata: true, data: this.inc_Exc_datas, "label": "Include/Exclude", displaykey: 'names' } },
    { "type": "dropdown", "label": "Branch/Product", "formvalue": "bran_prod_Control", inputobj: this.BranchProduct },
  ]
  templatebutton = [
    { icon: "add", function: this.incexccreation.bind(this) }
  ]
  IncludeExclude = { fronentdata: true, data: this.inc_Exc_datas, "label": "Include/Exclude", displaykey: 'names', formcontrolname: 'in_ex_cludeControl', valuekey: 'id' }

  ngOnInit(): void {
    this.cbdaForm = this.fb.group({
      in_ex_cludeControl: [""],
      bran_prod_Control: [""],
      chip_control: [""],
    });
    this.incandexcForm = this.fb.group({
      columninput: [""],
      dateinput: [""],
      in_ex_cludeControl: [""],
      bran_prod_Control: [""],
      chip_control: [""],
    });
    this.incandexcForm2 = this.fb.group({
      columninput: [""],
      dateinput: [""],
      in_ex_cludeControl: [""],
      bran_prod_Control: [""],
      chip_control: [""],
    });
    // this.columnList();
    this.branch_product_api();
  }
  SummarynewtemplateData = [
    {
      'columnname': 'Column',
      'key': 'column'
    },
    {
      'columnname': 'Date',
      'key': 'created_date'
    },
    {
      'columnname': 'Include/Exclude',
      'key': 'isinclude',
      validate: true,
      validatefunction: this.Validatefunction.bind(this)
    },
    {
      'columnname': 'Branch/Product',
      'key': 'target'
    },
    {
      'columnname': 'View',
      'key': 'view',
      'button': true,
      'icon': 'visibility',
      'function': true,
      'clickfunction': this.ViewClickFunc.bind(this)

    },
    {
      'columnname': 'Delete	',
      'key': 'delete',
      'button': true,
      'icon': 'delete',
    },
  ]
  SummaryApinewtempObjNew = {
    'method': 'post',
    'url': this.Url + 'reportserv/get_inc_exc_sumamry',
    'data': {}
  }

  colList: any = [];
  fileuploadlist: any;
  filelistdata: any;



  columnList() {
    // this.showincsummary = true;
    // this.cbdaservice.cloumn_api().subscribe((res) => {
    //   this.colList = res.data || [];
    // });
  }
  submitTo() {
    this.spinner.show();
    let dataofarray = this.incandexcForm.get("chip_control")?.value;
    let valuesdict = {
      column_no: this.incandexcForm.get("columninput")?.value || "",
      isinclude: this.incandexcForm.get("in_ex_cludeControl")?.value || "",
      target: this.incandexcForm.get("bran_prod_Control")?.value || "",
      data: dataofarray,
    };

    this.cbdaservice.incmaster(valuesdict).subscribe((result) => {
      if (result.code != undefined) {
        this.notification.showError(result.description);
        this.spinner.hide();
      } else {
        console.log("Inserted", result);
        this.notification.showSuccess("Data inserted Successfully");
        this.spinner.hide();
      }
    });
  }
  filelist() {
    // this.filelistdata = res.data
  }

  public displayColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
  public filetypeColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
  backtosum() {
    this.showfilesummary = true;
    this.showfilecreation = false;
  }
  searchfilemaster() { }
  refreshfilemaster() { }
  fileuploadsummary() {
    this.showfilesummary = true;
    this.showfilecreation = false;
    this.showincsummary = true;
    // this.dataService.fileuploadsummary().subscribe((res) => {
    //   this.fileuploadlist = res.data || [];
    // });
  }
  showfilecreation: boolean = false;
  showfilesummary: boolean = false;
  showincCreation: boolean = false;
  showincsummary: boolean = true;
  filecreation() {
    this.showfilecreation = true;
    this.showfilesummary = false;
  }
  incexccreation() {
    this.showincCreation = true;
    this.showincsummary = false;
  }
  searchincexc(event) {
    let params = {
      "column_no": event?.Column_value,
      "isinclude": event?.in_ex_cludeControl ? parseInt(event?.in_ex_cludeControl?.id) : '',
      "target": event?.bran_prod_Control?.name,
      "date": event?.transdate ? this.datePipe.transform(event?.transdate, 'yyyy-MM-dd') : ''
    }
    this.SummaryApinewtempObjNew = {
      'method': 'post',
      'url': this.Url + 'reportserv/get_inc_exc_sumamry',
      'data': params
    }
  }
  refreshincexc() { }
  backtosum2() {
    this.showincCreation = false;
    this.showincsummary = true;
    this.incandexcForm.reset()
     this.SummaryApinewtempObjNew = {
      'method': 'post',
      'url': this.Url + 'reportserv/get_inc_exc_sumamry',
      'data': {}
    }
  }
  employeelist: any;
  filterEmployee(value: string): void {
    this.alldropdown();
  }
  employeeddapi(id) {
    let query = "";
    let page = 1;
    this.cbdaservice.employeeapi_dd(id, query, page).subscribe((res) => {
      this.employeelist = res.data;
    });
  }
  selectEmployee(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value;
    const current = this.incandexcForm.get("chip_control")?.value || [];

    const exists = current.some((e: any) => e.id === selected.id);
    if (!exists) {
      current.push(selected);
      this.incandexcForm.get("chip_control")?.setValue(current);
    }

    this.employeeInput.nativeElement.value = "";
  }
  backscenario() { }

  resetScenario() {
    this.cbdaForm.reset();
  }
  removeEmployee(index: number): void {
    const control = this.cbdaForm.get("chip_control");
    const current = control?.value || [];
    current.splice(index, 1);
    control?.setValue(current);
  }

  // toggleColumn(header: string) {
  //   const values = this.columnValues[header] || [];

  //   this.new_body.forEach((row, index) => {
  //     row[header] = values[index] || "-";
  //   });

  //   console.log("After filling", this.new_body);
  // }
  safeLower(value: any): string {
    return typeof value === "string" ? value.toLowerCase() : value;
  }


  branch_product_api() {
    this.cbdaservice.branch_product_api().subscribe((res) => {
      this.bran_prod_datas = res.data;
    });
  }
  alldropdown() {
    if (this.data_chipname === "Branch") {
      this.cbdaservice.branchdd().subscribe((res) => {
        this.employeelist = res.data;
      });
    } else if (this.data_chipname === "Product") {
      this.cbdaservice.productdd().subscribe((res) => {
        this.employeelist = res.data;
      });
    } else if (this.data_chipname === "GL") {
      this.cbdaservice.gldd().subscribe((res) => {
        this.employeelist = res.data;
      });
    }
  }

  data_chipname: any = "";
  getshowchip(id) {
    console.log("ids", id);
    if (id.id === 1) {
      this.data_chipname = id.name;
      console.log(" this.data_chipname", this.data_chipname);
    } else if (id.id === 2) {
      this.data_chipname = id.name;
    } else if (id.id === 3) {
      this.data_chipname = id.name;
    }
    this.alldropdown();
  }
  addEmployee(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      const current = this.cbdaForm.get("chip_control")?.value || [];
      const alreadyExists = current.some(
        (e: any) => e.name || e.no.toLowerCase() === value.trim().toLowerCase()
      );

      if (!alreadyExists) {
        current.push({
          id: value.trim().toLowerCase(),
          name: value.trim(),
        });
        this.cbdaForm.get("chip_control")?.setValue(current);
      }
    }

    if (input) input.value = "";
  }

  // dynamic dropdown
  response: any = {
    data: [
      {
        column: 'column3',
        mappings: [
          {
            From: { id: 1, field: 'GL' },
            To: { id: 1, field: 'GL' },
          },
          {
            From: { id: 2, field: 'Product' },
            To: { id: 2, field: 'Product' },
          },
        ],
      },
      {
        column: 'column6',
        mappings: [
          {
            From: { id: 2, field: 'Product' },
            To: { id: 2, field: 'Product' },
          },
          {
            From: { id: 1, field: 'GL' },
            To: { id: 2, field: 'Product' },
          },
        ],
      },
      {
        column: 'column8',
        mappings: [
          {
            From: { id: 1, field: 'GL' },
            To: { id: 1, field: 'GL' },
          },
        ],
      },
    ],
  };

  selectedColumn = '';
  selectedMappings: any[] = [];

  // onColumnChange(columnName: string) {
  //   this.selectedColumn = columnName;

  //   const selectedColObj = this.response.data.find(
  //     (col: any) => col.column === columnName
  //   );

  //   this.selectedMappings = selectedColObj ? selectedColObj.mappings : [];
  //   // this.onFieldChange(columnName)
  // }

  // dynamicdatas:any;
  //  onFieldChange(selectedValue: string) {
  //    if (selectedValue === "Branch") {
  //     this.cbdaservice.branchdd().subscribe((res) => {
  //       this.dynamicdatas = res.data;
  //     });
  //   }
  //    else if (selectedValue === "Product") {
  //     this.cbdaservice.productdd().subscribe((res) => {
  //       this.dynamicdatas = res.data;
  //     });
  //   } else if (selectedValue === "GL") {
  //     this.cbdaservice.gldd().subscribe((res) => {
  //       this.dynamicdatas = res.data;
  //     });
  //   }

  // }


  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  submit_fun() {
    let form = this.incandexcForm.value
    if (!form?.Column_value) {
      this.notification.showError('Please Enter Column')
    }
    else if (!form?.in_ex_cludeControl) {
      this.notification.showError('Please Enter Include/Exclude')
    }
    else if (!form?.bran_prod_Control) {
      this.notification.showError('Please Enter Branch/Product')
    }
    else if (!form?.chip_control) {
      this.notification.showError('Please Enter Product')
    }
    else {
      let params = {
        column_no: form?.Column_value ? form?.Column_value?.id : '',
        isinclude: form?.in_ex_cludeControl ? form?.in_ex_cludeControl : '',
        target: form?.bran_prod_Control ? form?.bran_prod_Control?.name : '',
        data: []
      }
      if (form?.chip_control.length) {
        for (let i of form?.chip_control) {
          let branch = {
            Branch_code: i?.code,
            Branch_name: i?.name
          }
          params['data'].push(branch)
        }
      }
      this.spinner.show()
      this.cbdaservice.CBDAINCEXCDataSubmit(params).subscribe(result => {
        this.spinner.hide()
        if (result?.message) {
          this.notification.showSuccess(result?.message)
          this.incandexcForm.reset()
          this.data_chipname=''
          this.showincCreation = false
          this.showincsummary = true
        }
        else {
          this.notification.showError(result?.description)
        }

      },
    error=>{
      this.spinner.hide()
    })
    }

  }
  ColumnDropData() {
    this.cbdaservice.cloumn_api().subscribe(result => {
      this.colList = result['data']
    })
  }
  Validatefunction(data) {
    let config = {
      disabled: false,
      style: '',
      class: '',
      value: '',
      icon: '',
      tooltipValue: '',
      function: false,
      button: false,
      id: "",
    }
    if (data?.isinclude == 2) {
      config.value = 'Exclude'
      return config
    }
    else if (data?.isinclude == 1) {
      config.value = 'Include'
      return config
    }
    else {
      return config
    }
  }
  PopupTriggerBool: boolean = false
  ViewRecord: any
  ViewClickFunc(data) {
    this.PopupTriggerBool = true
    let params = {
      id: data?.id
    }
    this.spinner.show()
    this.cbdaservice.CBDAINCEXCDataViewSummary(params).subscribe(result => {
      this.spinner.hide()
      this.ViewRecord = result
    })
  }
  closePopup() {
    this.PopupTriggerBool = false
  }
}
