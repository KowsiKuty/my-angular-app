import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TbReportService } from "../tb-report.service";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
export interface PriorityValue {
  id: string;
  name: string;
}
@Component({
  selector: "app-cbda-report",
  templateUrl: "./cbda-report.component.html",
  styleUrls: ["./cbda-report.component.scss"],
})
export class CbdaReportComponent implements OnInit {
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
  new_header: any = ["sl", "name", "desc", "rrr", "vvv", "ddd", "uuu"];
  shownColumns: string[] = [];

  new_body: any = [
    { sl: 1, name: "name1", desc: "desc1", rrr: "r1", vvv: "v1" },
    { sl: 2, name: "name2", desc: "desc2", rrr: "r2", vvv: "v2" },
    { sl: 3, name: "name3", desc: "desc3", rrr: "r3", vvv: "v3" },
  ];

  columnValues: any = {
    ddd: ["rfef", "rfvfve", "r3"],
    uuu: ["x1", "x2", "x3"],
  };
  cbdaForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild("employeeInput") employeeInput!: ElementRef;

  // bran_prod_datas:any;
  constructor(private fb: FormBuilder, private dataService: TbReportService) {}
  filecreationform: FormGroup;
  fileuploadform: FormGroup;
  incandexcForm:FormGroup;
  specialForm:FormGroup;
  ngOnInit(): void {
    this.cbdaForm = this.fb.group({
      in_ex_cludeControl: [""],
      bran_prod_Control: [""],
      chip_control: [""],
    });
    this.filecreationform = this.fb.group({
      columninput: [""],
      dateinput: [""],
      fileTypeInput:[""]
    });
    this.fileuploadform = this.fb.group({
      columninput: [""],
      dateinput: [""],
    });
    this.incandexcForm = this.fb.group({
      columninput:[''],
      dateinput:[''],
      in_ex_cludeControl:[''],
      bran_prod_Control:[''],
      chip_control:['']

    })
    this.specialForm = this.fb.group({
      product:[''],
      glno:['']
    })
    this.fileuploadsummary();
  }

  isColumnEmpty(header: string): boolean {
    return this.new_body.every((row: any) => !row[header]);
  }

  toggleColumn(header: string) {
    const values = this.columnValues[header] || [];

    this.new_body.forEach((row, index) => {
      row[header] = values[index] || "-";
    });

    console.log("After filling", this.new_body);
  }
  safeLower(value: any): string {
    return typeof value === "string" ? value.toLowerCase() : value;
  }

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
  branch_product_api() {
    this.dataService.branch_product_api().subscribe((res) => {
      this.bran_prod_datas = res;
    });
  }
  data_chipname: any = "";
  getshowchip(id) {
    if (id.id === 1) {
      this.data_chipname = id.name;
    } else if (id.id === 2) {
      this.data_chipname = id.name;
    }
  }

  // chip product || branch
  removeEmployee(index: number): void {
    const control = this.cbdaForm.get("chip_control");
    const current = control?.value || [];
    current.splice(index, 1);
    control?.setValue(current);
  }

  addEmployee(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      const current = this.cbdaForm.get("chip_control")?.value || [];
      const alreadyExists = current.some(
        (e: any) => e.full_name.toLowerCase() === value.trim().toLowerCase()
      );

      if (!alreadyExists) {
        current.push({
          id: value.trim().toLowerCase(),
          full_name: value.trim(),
        });
        this.cbdaForm.get("chip_control")?.setValue(current);
      }
    }

    if (input) input.value = "";
  }
  employeelist: any;
  filterEmployee(value: string): void {
    this.employeeddapi(value);
  }
  employeeddapi(id) {
    let query = "";
    let page = 1;
    this.dataService.employeeapi_dd(id, query, page).subscribe((res) => {
      this.employeelist = res.data;
    });
  }
  selectEmployee(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value;
    const current = this.cbdaForm.get("chip_control")?.value || [];

    const exists = current.some((e: any) => e.id === selected.id);
    if (!exists) {
      current.push(selected);
      this.cbdaForm.get("chip_control")?.setValue(current);
    }

    this.employeeInput.nativeElement.value = "";
  }
  backscenario() {}

  resetScenario() {
    this.cbdaForm.reset();
  }

  // file upload master search
  colList: any;
  fileuploadlist: any;
  filelistdata:any;
  columnList() {
    // this.dataService.types_id(id).subscribe((res) => {
    //   this.colList = res.data || [];
    // });
  }
  filelist(){
// this.filelistdata = res.data
  }

  public displayColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
    public filetypeColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
  backtosum(){
    this.showfilesummary = true;
    this.showfilecreation = false;
  }
  searchfilemaster() {}
  refreshfilemaster() {}
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
  showincCreation:boolean = false;
  showincsummary:boolean = false;
  filecreation() {
    this.showfilecreation = true;
    this.showfilesummary = false;
  }
  incexccreation(){
this.showincCreation = true;
this.showincsummary = false;
  }
  searchincexc(){

  }
  refreshincexc(){

  }
  backtosum2(){
    this.showincCreation = false;
    this.showincsummary = true;
  }
}
