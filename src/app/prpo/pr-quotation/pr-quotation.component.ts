import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  Input
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { PRPOSERVICEService } from "../prposervice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../notification.service";

import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { fromEvent, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
// import { prodlistss } from "../prpomaster/prpomaster.component";
import { DatePipe } from "@angular/common";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { SafeUrl } from "@angular/platform-browser/platform-browser";
import { ReportserviceService } from "src/app/reports/reportservice.service";
// import { branchlistss } from "../po-create/po-create.component";

export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface qfList {
  id: any;
  code: string;
  name: string;
}

@Component({
  selector: "app-pr-quotation",
  templateUrl: "./pr-quotation.component.html",
  styleUrls: ["./pr-quotation.component.scss"],
})
export class PrQuotationComponent implements OnInit {
  quotationForm: FormGroup;
  masterForm: FormGroup;
  quotationSearch: FormGroup;

  @Input() quotation : any;

  productList: any[] = [];
  Lists: any = [];
  activestatus:number = 2;
  StatusList: any = [
    { id: "3", name: "All" },
    { id: "1", name: "Fresh" },
    { id: "2", name: "Executed" },
  ];
  activeList: any = [
    { id: "1", name: "Fresh" },
    { id: "2", name: "Active" },
    { id: "3", name: "Inactive" },
    // { id : "3", name : "Executed"}
  ];
  speccstring:any;
  productnametype:any;
  servicekey:boolean = false;
  quotationMasterSearch: FormGroup;
  showimageHeaderPreviewPDF:boolean
 showimageHeaderPreview:boolean
 jpgUrls:SafeUrl;
 payload:any;
 payloadques:any;
 pdfurl:any;
  has_next: any;
  has_previous: any;
  currentpage: any;
overallarray: any[] = [];
  datapagination: any;
  hasnext: any;
  hasprevious: any;
  pageSize=10
  totalcount: any;
   producttype_next = false;
  producttype_pre = false;
  producttype_crtpage= 1;
 prdTypes: any=[]
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  @ViewChild("productauto1") productAutocomplete1: MatAutocomplete;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private prposervice: PRPOSERVICEService,
    private errorHandler: ErrorHandlingServiceService,
    private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,
    private datepipe: DatePipe,
    private reportService: ReportserviceService
  ) {}
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
        ["delete", ["deleteRow", "deleteCol", "deleteTable"]],
        ["style", ["tableHeader", "tableBorderStyle", "tableBorderColor"]],
      ],
      link: [["link", ["linkDialogShow", "unlink"]]],
      air: [
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
      ],
    },
    height: "200px",
    toolbar: [
      ["misc", ["codeview", "undo", "redo", "codeBlock"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style0", "ul", "ol", "paragraph", "height"]],
      ["insert", ["picture", "link", "video", "hr", "customTable"]],
      [
        "table",
        ["addRow", "addColumn", "deleteRow", "deleteColumn", "deleteTable"],
      ],
    ],
    buttons: {
      customTable: function (context) {
        const ui = ($ as any).summernote.ui;
        return ui
          .button({
            contents: '<i class="note-icon-table"/>Table',
            tooltip: "Insert a 3x3 Table",
            click: function () {
              context.invoke("editor.focus"); // Ensure the editor is focused

              const editor = context.layoutInfo.editable[0];
              if (!editor) {
                console.error("Editor context is undefined");
                return;
              }

              const table = document.createElement("table");
              table.style.borderCollapse = "collapse";
              table.style.width = "100%";

              for (let i = 0; i < 3; i++) {
                const row = table.insertRow();
                for (let j = 0; j < 3; j++) {
                  const cell = row.insertCell();
                  cell.style.border = "1px solid black";
                  cell.style.padding = "5px 3px";
                  cell.style.height = "30px";
                  cell.style.width = "270px";
                  cell.style.boxSizing = "border-box";
                  cell.innerText = " ";
                }
              }

              const range = window.getSelection()?.getRangeAt(0);
              if (!range) {
                console.error(
                  "Range is undefined. Ensure the editor is focused."
                );
                return;
              }

              range.deleteContents();
              range.insertNode(table);
              range.collapse(false);
            },
          })
          .render();
      },
    },
    callbacks: {
      onInit: function () {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector(".note-editable");
        if (editor) {
          editor.addEventListener("input", function () {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName("table"));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = "collapse";
              htmlTable.style.width = "100%";
              htmlTable.style.textAlign = "left";

              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll("th, td");
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = "1px solid black";
                htmlCell.style.padding = "5px 3px";
                htmlCell.style.boxSizing = "border-box";
              });
            });
          });
        }
      },
    },
  };

  // @HostListener('click')
  // @HostListener('keydown.enter')

  // @ViewChild("popoverElement", { static: true }) popoverElement!: ElementRef;

  // ngAfterViewInit() {
  //   new bootstrap.Popover(this.popoverElement.nativeElement);
  // }
  ngOnInit(): void {
    this.quotationMasterSearch = this.fb.group({
      quotation_no: [""],
      quotation_for_id: [""],
      producttype_id: [""],
      product_id: [""],
      quotation_status: [""],
    });
    this.masterForm = this.fb.group({
      quotation_for_id: [""],
      purpose: [""],
      quotation_date: [""],
      quotation_for_name: [""],
      producttype: [""],
      product: [""],
      make: [""],
      model: [""],
      amc_start_date: [""],
      amc_end_date: [""],
      // asset_id: [""],
      spec_config: this.fb.control(
        { id: "", specification: "" },
        Validators.required
      ),
      qty: [""],
      quotation_note: [""],
      file_key: ["file"],
      unit_price: ["", [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    this.quotationSearch = this.fb.group({
      supplier_id: [""],
      quotation_date: [""],
      supplier_quot_reference: [""],
      supplier_quot: [""],
      // product_type:[""],
      // product_name: [""],
      ref_status: [""],
      // supplier_quot:[''],
      product_id : [""],
      supp_product_id:[''],
      product_name : [""],
      make_name : [""],
      model_name : [""],
      start_date: [""],
      end_date: [""],
      price: [""],
      specification: [""],
      qty : [""],
      uom : ['']

    });
    this.quotationForm = this.fb.group({
      file_key: ["file"],
      uom: [""],
      tax: ["1"],
      qty: [""],
      mode: ["mail"],
      supplier_quot_reference: [""],
      supplier: ["", Validators.required],
      supplier_id: [""],
      quotation_id: [""],
      quotation_date: ["", Validators.required],
      remarks: [""],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      producttype: ["", Validators.required],
      product: ["", Validators.required],
      make: ["", Validators.required],
      model: ["", Validators.required],
      spec_config: this.fb.control(
        { id: "", specification: "" },
        Validators.required
      ),
      amc_start_date: [""],
      amc_end_date: [""],
      // specification: [""],
      unit_price: [
        "",
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
    this.forQuotationDD();
    // this.getmodall()
    this.getpproduct(0, 1)

    // this.getpproduct(0,"");
    this.getSuppliersearch();
    this.getMasterQuotation(this.page);
    this.getproductType();
    this.setupQuotationForValueChanges(this.masterForm, "quotation_for_id");
    this.setupQuotationForValueChanges(
      this.quotationMasterSearch,
      "quotation_for_id"
    );
    if(this.quotation == true){
      const modalTrigger = document.getElementById("modal1");
      modalTrigger?.click();
    }

this.quotationSearch.get('model_name')
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getModalserch(this.quotationSearch.value?.product_name?.code,this.quotationSearch.value?.make_name?.id,value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]);
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.modelList = datas;
      });
  
      this.quotationSearch.get('make_name')
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getMake(this.quotationSearch.value?.product_name?.code,value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]);
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.itemList = datas;
      });

      this.quotationSearch.get('product_name')
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getproductfn('','', value,1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]);
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      });

    this.quotationSearch.get('product_name').valueChanges.subscribe(value => {
    if (value) {
      this.quotationSearch.get('make_name').enable();
      this.quotationSearch.get('model_name').enable();
    } else {
      this.quotationSearch.get('make_name').disable();
      this.quotationSearch.get('model_name').disable();
    }
  });

  this.quotationSearch.get('make_name').disable();
  this.quotationSearch.get('model_name').disable();
  }
  private setupQuotationForValueChanges(
    formGroup: FormGroup,
    controlName: string
  ): void {
    const control = formGroup.get(controlName);
    if (!control) {
      console.error(`Control ${controlName} not found in formGroup`);
      return;
    }

    control.valueChanges
      .pipe(
        tap((value) => console.log(`Value changed:`, value)), // Debug input value
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => typeof value === "string" && value.trim() !== ""), // Avoid null/empty values
        tap(() => {
          this.isLoading = true;
          console.log("Fetching data...");
        }),
        switchMap((value) =>
          this.prposervice.getreqforFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
              console.log("API call complete");
            }),
            catchError((error) => {
              console.error("API error:", error);
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]);
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        console.log("Received results:", results);
        this.forQuotationList = results["data"] ?? [];
      });
  }

  

  resetDD(FormControl, table) {
    if (FormControl == "qfor" && table == "sum") {
      this.quotationMasterSearch.get("quotation_for_id").reset();
    }
  }

  assetDetails: boolean = false;
  // addSpecConfig(id: number, specification: string, configuration: string, formGroup: FormGroup) {
  //   const specConfig = formGroup.get("spec_config") as FormControl;
  
  //   // Get existing value (as object) and extract specification string
  //   let existingValue = specConfig.value ? specConfig.value.specification : "";
  
  //   // Convert to array of strings
  //   let specList = existingValue ? existingValue.split(", ") : [];
  
  //   // New formatted entry
  //   const newEntry = `${specification} : ${configuration}`;
  
  //   // Remove existing entry with the same specification (but possibly old config)
  //   specList = specList.filter(entry => !entry.startsWith(`${specification} :`));
  
  //   // Add updated entry
  //   specList.push(newEntry);
  
  //   // Update the control with new ID and updated specification list
  //   specConfig.setValue({
  //     id: id,
  //     specification: specList.join(", "),
  //   });
  // }
  addSpecConfig(id: number, specification: string, configuration: string, formGroup: FormGroup) {
    const specConfigControl = formGroup.get("spec_config") as FormControl;
  
    if (!specConfigControl) return;
  
    const currentValue = specConfigControl.value || {};
    const existingSpecs = currentValue.specification || "";
  
    // Split to array
    let specList = existingSpecs ? existingSpecs.split(", ") : [];
  
    const newEntry = `${specification} : ${configuration}`;
  
    // Remove old entry with same `specification`
    specList = specList.filter(entry => !entry.startsWith(`${specification} :`));
  
    // Push new/updated entry
    specList.push(newEntry);

    if (specification === "IT Spare For") {
      this.conf_for = true;
      this.handleSpecialSpecification(specification, configuration, formGroup);  // Pass configuration as well
    }
    // Preserve ID and update specification
    specConfigControl.setValue({
      ...currentValue, // preserve other fields like id
      id: id,          // you can update ID if needed
      specification: specList.join(", "),
    });
  }
  selectedMakeModelMap: { [key: number]: { make: string; model: string } } = {};

  conf_for: boolean = false;
  handleSpecialSpecification(specification: string, configuration: string, formGroup: FormGroup) {
  // if (specification === "Service For") {
    this.prposervice.getHwsw(1, configuration).subscribe((res) => {
      this.configList = res["data"];
    });
  }
  currentSpecIndex = 0;

modelMenuMap = new Map<number, any>();

setModelMenuMap(brandId: number, menu: any): boolean {
  this.modelMenuMap.set(brandId, menu);
  return true;
}
selectModel(make: string, model: string, whole_dict: any) {
  if (this.currentSpecIndex !== null) {
    this.selectedMakeModelMap[this.currentSpecIndex] = { make, model };
  }
  this.whole_dict = whole_dict;
  console.log("Selected Make and Model:", this.whole_dict);
}
whole_dict: any = {};
// selectModel(make: string, model: string) {
//   const selected = `${make} - ${model}`;
//   this.specList[this.currentSpecIndex].selectedConfig = selected;
// }
  configList: any = [];
//   configList: any = [
//     {
//         "id": 78,
//         "make_name": "HP",
//         "model": [
//             {
//                 "id": 79,
//                 "name": "A"
//             },
//             {
//                 "id": 80,
//                 "name": "B"
//             },
//             {
//                 "id": 81,
//                 "name": "C"
//             }
//         ],
//         "product_code": "P01248"
//     },
//     {
//         "id": 82,
//         "make_name": "Dell",
//         "model": [
//             {
//                 "id": 83,
//                 "name": "A"
//             },
//             {
//                 "id": 84,
//                 "name": "B"
//             },
//             {
//                 "id": 85,
//                 "name": "C"
//             }
//         ],
//         "product_code": "P01248"
//     }
// ];
  getproductType() {
    // this.isLoading = true;
    this.prposervice.getproductType().subscribe(
      (results: any[]) => {
        // this.isLoading = false;
        let datas = results["data"];
        // let datapagination = results["pagination"];
        this.Lists = results;
        // this.has_nextprod = datapagination.has_next;
        // this.has_previousprod = datapagination.has_previous;
        // this.currentpageprod = datapagination.index;
      },
      (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  // formatSpecConfig(specList: any[], configMap: { [key: string]: string }) {
  //   // Create a formatted specification string: "Key : Value, Key : Value"
  //   let formattedSpec = specList
  //     .map(spec => `${spec.specification} : ${configMap[spec.specification] || ""}`)
  //     .join(", ");

  //   return {
  //     id: 218,
  //     spec_config: {
  //       specification: formattedSpec
  //     }
  //   };
  // }
  configMap: any;
  onSelectConfig(event: any, specItem: any) {
    this.configMap[specItem.specification] = event.option.value;
  }

  // Get the formatted output
  // console.log(this.formatSpecConfig(this.specList, this.configMap));
  // HeaderFilesDelete() {
  //   let checkvalue = this.filesHeader.value.file_upload;
  //   for (let i in checkvalue) {
  //     checkvalue.splice(i);
  //   }
  //   console.log("checkvalue", checkvalue);
  //   this.InputVar.nativeElement.value = "";
  //   console.log("checkvalue", checkvalue);
  // }
  // onFileSelectedHeader(e) {
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     this.filesHeader.value.file_upload.push(e.target.files[i]);
  //     let checkvalue = this.filesHeader.value.file_upload;
  //     console.log("checkvalue", checkvalue);
  //   }
  // }
  selectedFile: any = [];
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = Array.from(input.files); 
      console.log(this.selectedFile, "selectedFiles");
    }
  }
  MasquotationSubmit() {
    if( this.masterForm.value.unit_price === undefined ||  this.masterForm.value.unit_price  === "" ||  this.masterForm.value.unit_price ===null){
      this.notification.showError("Please Enter Unit Price")
      return
    }
   
    const formValues = this.masterForm.value;
    if (formValues.producttype.name == "Service"){
    if(formValues.amc_start_date == null || formValues.amc_start_date == undefined || formValues.amc_start_date == ''){
      this.notification.showError("Please Select AMC Bedin Date")
      return

    }
    if((formValues.amc_end_date == null || formValues.amc_end_date == undefined || formValues.amc_end_date == '')){
      this.notification.showError("Please Select AMC End Date")
      return

    }
  }
    Object.keys(formValues).forEach((key) => {
      if (
        formValues[key] === null ||
        formValues[key] === undefined ||
        formValues[key] === ""
      ) {
        formValues[key] = "";
      }
    });
    // formValues.validity_start = this.formatDate(formValues?.validity_start)
    // formValues.validity_end = this.formatDate(formValues?.validity_end)
    formValues.quotation_for_name =
      this.masterForm.value?.quotation_for_id?.name;
    formValues.quotation_for_id = this.masterForm.value?.quotation_for_id?.id;
    let currentDate = new Date().toJSON().slice(0, 10);
    formValues.quotation_date = currentDate;
    formValues.AMC_Begin_Date = this.formatDate(formValues.amc_start_date);
    formValues.AMC_End_Date = this.formatDate(formValues.amc_end_date);
    formValues.unit_price=typeof(formValues?.unit_price)=='string'?parseFloat(formValues?.unit_price?.replace(/,/g,'')):formValues?.unit_price

    if(formValues.producttype.name == "Service"){
    this.speccstring = formValues.spec_config.specification;
    // this.speccstring += `, AMC_Begin_Date: ${formValues.amc_start_date}, AMC_End_Date: ${formValues.amc_end_date}`;
     this.speccstring += `, AMC_Begin_Date : ${formValues.AMC_Begin_Date}, AMC_End_Date : ${formValues.AMC_End_Date}`;
    this.payload = {
          ...formValues,
          spec_config: {
            id: formValues.spec_config.id,
            specification: this.speccstring
          }
        };
      }
      else{
        this.payload = {
                ...formValues,
                spec_config: {
                  id: formValues.spec_config.id,
                  specification: formValues.spec_config.specification,
                },
              };
      }
    // if(formValues.valid){
    // this.specList.forEach(element => {
    //   let spec = element?.specification
    //   let conf = formValues?.con
    // });

    // const filteredValues = Object.keys(formValues)
    // .filter(
    //   (key) =>
    //     formValues[key] !== null &&
    //     formValues[key] !== undefined &&
    //     formValues[key] !== ""
    // )
    // .reduce((acc, key) => {
    //   acc[key] = formValues[key];
    //   return acc;
    // }, {});
    const formData = new FormData();

    formData.append("data", JSON.stringify( this.payload));

    if (this.selectedFile && this.selectedFile.length > 0) {
      this.selectedFile.forEach((file, index) => {
        formData.append("file", file); // Send multiple files
      });
    }
    this.SpinnerService.show();
    this.prposervice.getQuotationSubmit(formData).subscribe((res) => {
      this.SpinnerService.hide();
      if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          return false
      }

      if (res["status"] == "Success") {
        this.notification.showSuccess(res["message"]);
        const modalTrigger = document.getElementById("assetmodal");
        modalTrigger?.click();
        this.getMasterQuotation(this.page);
        this.masterForm.reset();
        this.selectedFile = [];

      } else {
        this.notification.showInfo(res["description"]);
      }
    });
    this.masterForm.reset();
    this.specList = [];

    // } else {
    //   this.notification.showInfo("Please Fill All the Details!");
    //   return
    // }
  }
  getDetailData(data) {
    let quotation_no = data.quotation_no;
  }
  DetailsQ(q) {
      this.detailsArr = [q];
    console.log("detailsArr", this.detailsArr);
  }
  
  
  detailsArr: any = [];
  ViewQuotation(supp,data) {
    this.readonly = true;
    this.patchFormValues(supp, data);
  }
  readonly: boolean = false;
  showservice:boolean = false
  prodname:any;
  patchFormValues(supp, data: any) {
    this.prodname = data.producttype.name;
    if(this.prodname == "services"){
      this.showservice = true
    }
    this.selectedFile = data.file_data;
    this.quotationForm.patchValue({
      supplier: supp.supplier_name || "",
      supplier_id: supp.supplier_id || "",
      quotation_id: data.quotation_id || "",
      quotation_date: data.quot_date || "",
      remarks: data.remarks || "",
      start_date: data.start_date || "",
      supplier_quot_reference: data.supplier_quot_reference || "",
      end_date: data.end_date || "",
      producttype: this.Lists.find(item => String(item.id) === String(data.producttype.id)),
      tax: 1,
      mode: "mail",
      file_key: "file",
      uom: data.uom || "",
      // producttype: data.producttype?.name || "",
      product: data.product || "",
      make: data.make || "",
      model: data.model || "",
      unit_price: data.price || "",
      spec_config: data.spec_config || "",
      qty: data.qty || "",
    });
    const specConfigStr = data.spec_config?.specification || "";
    const configMap: { [key: string]: string } = {};
    specConfigStr.split(",").forEach(pair => {
      const [key, value] = pair.split(":").map(str => str.trim());
      if (key && value !== undefined) {
        configMap[key] = value;
      }
    });
  
    this.specList.forEach(spec => {
      const specName = spec.specification?.trim();
      spec.configuration = configMap[specName] || "";
    });
    // this.getProductCode(data?.product?.id, 0);
    // this.patchSpecConfigurationsFromSpecConfig(this.specList, this.quotationForm);

  }
  patchSpecConfigurationsFromSpecConfig(specList: any[], formGroup: FormGroup) {
    const specConfig = formGroup.get("spec_config")?.value;
    if (!specConfig?.specification) return;
  
    // Parse the string: "A : 1, B : 2" → { A: 1, B: 2 }
    const entries = specConfig.specification.split(", ");
    const configMap: Record<string, string> = {};
  
    for (const entry of entries) {
      const [key, value] = entry.split(" : ");
      if (key && value) {
        configMap[key.trim()] = value.trim();
      }
    }
  
    // Now update specList with matching configuration values
    for (const spec of specList) {
      const specName = spec.specification;
      if (configMap.hasOwnProperty(specName)) {
        spec.configuration = configMap[specName];
      }
    }
  }
  

  View: boolean = false;
  resetQuotation(type) {
    if(type == 'master'){
    this.quotationMasterSearch.reset();
    this.getMasterQuotation(this.page);
    }
    if(type == 'detail'){
      this.quotationSearch.reset();
      this.quotationData()
    }
    // this.quotationSearch.reset();
  }
  gettype(data){
    this.product_type = data.id;
    this.quotationForm.get('product').reset();
    this.quotationForm.get('make').reset();
    this.quotationForm.get('model').reset();
    this.quotationForm.get('spec_config').reset();
  }
  resetfieldss(types) {
    this.product_type = types?.id
    if(types?.name==='Service' || types?.name==='IT Related Services'){
      this.Services=true
    }else{
      this.Services=false
    }
    // Services = types.name == 'Service' || types.name == 'IT Related Services' ? true : false;
    this.masterForm.get('product').reset();
    this.masterForm.get('make').reset();
    this.masterForm.get('model').reset();
    this.masterForm.get('spec_config').reset();  
  }
  page: number = 1;
  QuotationList: any[] = [];
  detailData: boolean = false;

  addQuotationData() {
    //  this.masterData = data;
    this.readonly = false;
    this.product_type = this.masterData.producttype.id;
    this.productnametype = this.masterData.producttype.name
    if( this.productnametype =="Service"){
      this.servicekey = true;
    }
    // this.selectedFile = this.masterData?.file_data
    this.quotationForm.patchValue({
      make: this.masterData.make,
      model: this.masterData.model,
      quotation_id: this.masterData.id,
      // product_type: this.masterData.producttype.id,
      producttype: this.Lists.find(item => String(item.id) === String(this.masterData.producttype.id)),
    //   producttype:  {
    //     "id": product_type.toString(),
    //     "name": this.masterData.producttype.name
    // },
      // producttype: this.masterData?.producttype,
      unit_price: this.masterData.unitprice,
      product: this.masterData.product,
      // spec_config: this.masterData.spec_config,
      // specification: this.masterData.
      qty: this.masterData?.qty,
      quotation_note: this.masterData?.quotation_note,
      tax:1,
      mode:"mail",
      file_key: "file",
    });
    // if (this.masterData?.file_data?.length > 0) {
      
    // this.prposervice.fileDownloadpo(this.masterData?.file_data[0]?.file_id).subscribe(
    //   (results: Blob) => {
    //     this.SpinnerService.hide();

    //     const fileName = this.masterData?.file_data[0]?.file_name;
    //     const fileExt = fileName.split('.').pop()?.toLowerCase();

    //     // ✅ Convert Blob to File
    //     const file = new File([results], fileName, {
    //       type: results.type || 'application/octet-stream',
    //       lastModified: Date.now()
    //     });
    //     this.fileVal = file;
    //   });
    // }
    // this.quotation.patchValue({ file: file });
    // this.downloadedFile = new File([results], fileName, { type: results.type });

    const specConfigStr = this.masterData.spec_config?.specification || "";
    const configMap: { [key: string]: string } = {};
    specConfigStr.split(",").forEach(pair => {
      const [key, value] = pair.split(":").map(str => str.trim());
      if (key && value !== undefined) {
        configMap[key] = value;
      }
    });
  
    this.specList.forEach(spec => {
      const specName = spec.specification?.trim();
      spec.configuration = configMap[specName] || "";
    });
    // this.quotationForm.get('producttype')?.setValue(this.masterData.producttype);
    // this.quotationForm.get('producttype')?.updateValueAndValidity();

    // setTimeout(() => {
    //   this.quotationForm.patchValue({
    //   })
    // this.cdr.detectChanges();

    //   }, 100);
    console.log("Patg Opched Product Type:", this.quotationForm.get("producttype")?.value);
    console.log("Available Options in Lists:", this.Lists);
    console.log("Matching Option:", this.Lists.find(item => item.id === this.masterData.producttype.id));
    const matchingOption = this.Lists.find(item => String(item.id) === String(this.masterData.producttype.id));
    console.log("Matchintio11n:", matchingOption);

  


  }
  fileVal: any;
  Services: boolean = false;
  getProductCode(p_id, id){
    this.prposervice.getProductCode(p_id).subscribe(
      (results) => {
        
      this.product_code = results.code;
      let uom  = results.uom;
      let uom_id = results.uom_id;
      let dict = {
        id : uom_id,
        name : uom 
      }
      if(id == 1) {
        this.quotationForm.get('uom').setValue(dict)
      }
        if(this.product_code){
          this.getOtherAttributes(results)
          }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  getQdtl(data) { 

    this.detailData = true;
    const formValues = this.quotationSearch.value;
    formValues.quotation_no = data.quotation_no;
    // formValues.supplier_code = formValues.supplier_code ? formValues?.supplier_code?.code : "";
    // formValues.product_name = formValues.product_name ? formValues?.product_name?.name : "";

    // Create a new object only containing keys that have a truthy value
    const filteredValues = Object.keys(formValues)
      .filter(
        (key) =>
          formValues[key] !== null &&
          formValues[key] !== undefined &&
          formValues[key] !== ""
      )
      .reduce((acc, key) => {
        acc[key] = formValues[key];
        return acc;
      }, {});

    this.SpinnerService.show();
    this.prposervice.quotationSearchnew(filteredValues,1).subscribe((res) => {
      if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          return false
        }
        else{
      this.QuotationList = res["data"][0];
      // this.datapagination = res['pagination']
      // if(this.datapagination){
      //   this.hasnext = this.datapagination.has_next
      //   this.hasprevious = this.datapagination.hasprevious
      //   this.currentpage = this.datapagination.has_next
      // }
      this.SpinnerService.hide();
        }
    });
    // this.showCard = true;
    this.masterData = data;
    this.getProductCode(this.masterData.product.id, 1);

    // this.getOtherAttributes(data.product)
    // this.quotationForm.patchValue({
    //   make: data.make,
    //   model: data.model,
    //   quotation_id: data.id,
    //   producttype: data.producttype?.name,
    //   product: data.product,
    //   spec_config: data.spec_config,
    //   tax:1,
    //   mode:"mail"
    // });
    this.quotation_no = data.quotation_no;
    // this.specList
  }
  masterData: any;
  quotation_no: any;
  getMasterQuotation(page) {
    const formValues = this.quotationMasterSearch.value;
    formValues.quotation_for_id = formValues.quotation_for_id ? formValues?.quotation_for_id?.id : "";
    formValues.product_id = formValues.product_id ? formValues?.product_id?.id : "";
    formValues.producttype_id = formValues.producttype_id ? formValues?.producttype_id?.id : "";

    // Create a new object only containing keys that have a truthy value
    const filteredValues = Object.keys(formValues)
      .filter(
        (key) =>
          formValues[key] !== null &&
          formValues[key] !== undefined &&
          formValues[key] !== ""
      )
      .reduce((acc, key) => {
        acc[key] = formValues[key];
        return acc;
      }, {});

    this.SpinnerService.show();
    this.prposervice
      .quotationSearchMaster(filteredValues, page)
      .subscribe((res) => {
      // res.count=317
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          return false
        }
        else{
        this.masterQuotationList = res["data"];        
        console.log('this.masterQuotationList 1===>',this.masterQuotationList)


        
        // this.overallarray.push(res["data"])
        // console.log('this.overallarray===>',this.overallarray)
        let datapagination = res["pagination"];
        this.has_next = datapagination?.has_next;
        this.has_previous = datapagination?.has_previous;
        this.currentpage = datapagination?.index;
        this.totalcount=res?.total_count
        this.SpinnerService.hide();
        }
      });
  }
  // islastpage(){
  //   let data = Math.ceil(this.totalcount/10)
  //  this.currentpage = data
  //  this.onScroll()
  // }
  // isfirstpage(){
  //   this.currentpage = 1
  //   this.onScroll()
  // }
innerpage = 1;
outerpage = 1;
limit = 10;

splitArray(array: any[]): any[] {
  const start = (this.innerpage - 1) * this.limit;
  const end = this.innerpage * this.limit;
  return array.slice(start, end);
}
nextPage() {
  this.innerpage=this.innerpage+1
}
prevPage() {
this.innerpage=this.innerpage-1
}
splitmainArray(array: any[]): any[] {
   if (!array || array.length === 0){
    return [];
   }
  const start = (this.outerpage - 1) * this.limit;
  const end = this.outerpage * this.limit;
  return array.slice(start, end);
}
mainnextPage() {
  this.outerpage=this.outerpage+1
}
mainprevPage() {
this.outerpage=this.outerpage-1
}
onScroll() {
  if (!this.has_next) return; // Don't scroll if no more data

  const formValues = this.quotationMasterSearch.value;
  formValues.quotation_for_id = formValues.quotation_for_id ? formValues?.quotation_for_id : "";
  formValues.product_id = formValues.product_id ? formValues?.product_id : "";

  const filteredValues = Object.keys(formValues)
    .filter(key => formValues[key])
    .reduce((acc, key) => {
      acc[key] = formValues[key];
      return acc;
    }, {});

  this.SpinnerService.show();
  this.prposervice.quotationSearchMaster(filteredValues, this.currentpage).subscribe((res) => {
    if (res?.code) {
      this.SpinnerService.hide();
      this.notification.showError(res?.description);
      return;
    }

    const newData = res['data'] || [];
    this.masterQuotationList = newData

    const pagination = res['pagination'];
    this.has_next = pagination.has_next;
    this.currentpage = pagination.index;
    this.has_previous = pagination.has_previous;
    this.SpinnerService.hide();
  });
}
previousClick(){
  this.currentpage=this.currentpage-1
 this.onScroll() 
 
}
hasnextClick(){
  this.currentpage=this.currentpage+1
 this.onScroll() 
 
}
onScrollchild() {
  if (!this.hasnext) return; // Don't scroll if no more data

  const formValues = this.quotationSearch.value;

    formValues.supplier_id = formValues.supplier_id
      ? formValues?.supplier_id: "";
      // const formValues = this.quotationSearch.value;
    formValues.quotation_no = this.masterData?.quotation_no;
  
    // formValues.quotation_id = this.masterData.quotation_id;
    // formValues.product_name = formValues.product_name ? formValues?.product_name?.name : "";

    // Create a new object only containing keys that have a truthy value
    const filteredValues = Object.keys(formValues)
      .filter(
        (key) =>
          formValues[key] !== null &&
          formValues[key] !== undefined &&
          formValues[key] !== ""
      )
      .reduce((acc, key) => {
        acc[key] = formValues[key];
        return acc;
      }, {});

    this.SpinnerService.show();
    this.prposervice.quotationSearchnew(filteredValues,this.currentpage+1).subscribe((res) => {

     const newData = res['data'] || [];
     this.QuotationList = [...this.QuotationList, ...newData];
 


      this.datapagination = res['pagination']
      if(this.datapagination){
        this.hasnext = this.datapagination.has_next
        this.hasprevious = this.datapagination.hasprevious
        this.currentpage = this.datapagination.has_next
      }
      this.SpinnerService.hide();
    });

}



  masterQuotationList: any = [];
  formatDate(dateString: string): string | null {
    return this.datepipe.transform(dateString, "yyyy-MM-dd");
  }
  addQuotation: boolean = false;
  public displayFnproduct(prod): string | undefined {
    return prod ? prod.name : undefined;
  }
  public displayFnproductt(prod): string | undefined {
    return prod ? prod.name : undefined;
  }
  public displayFnQuot(qf: qfList): string | undefined {
    return qf ? qf.name : undefined;
  }
  currentpagerfor: number = 1;
  has_nextrfor = true;
  has_previousrfor = true;
  @ViewChild("quotfor") matrforAutocomplete: MatAutocomplete;
  // @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('scrollContainerchild') scrollContainerchild!: ElementRef;
  
  @ViewChild("qforInput") rforInput: any;
  autocompleterforScroll() {``
    setTimeout(() => {
      if (
        this.matrforAutocomplete &&
        this.autocompleteTrigger &&
        this.matrforAutocomplete.panel
      ) {
        fromEvent(this.matrforAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matrforAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matrforAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matrforAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =

              this.matrforAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextrfor === true) {
                this.prposervice
                  .getreqforFK(
                    this.rforInput.nativeElement.value,
                    this.currentpagerfor + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.forQuotationList =
                        this.forQuotationList.concat(datas);
                      if (this.forQuotationList.length >= 0) {
                        this.has_nextrfor = datapagination.has_next;
                        this.has_previousrfor = datapagination.has_previous;
                        this.currentpagerfor = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  // ngDoCheck(){
  //   this.forQuotation();
  // }
  activeCheck(data: any, event: MatSlideToggleChange) {
    let previousChecked = event; 
    if (previousChecked){
      this.activestatus = 2
    }else{
      this.activestatus = 3
    }
    console.log("active",this.activestatus)
    
    let confirmed = window.confirm(
      "Are you sure you want to change the Active Status? This action will add this quotation to the vendor catalog."
    );
  
    if (!confirmed) {
      event.source.checked = !previousChecked;
      return;
    }
    let { quotation_id, id: quot_dtl, supplier_id } = data;
  
    this.SpinnerService.show();
    this.prposervice.activeCheck(quotation_id, quot_dtl, supplier_id,this.activestatus).subscribe(
      (res) => {
        this.SpinnerService.hide();
        if (res["status"] === "Success") {
          this.notification.showSuccess(res["message"]);
          this.getQdtl(this.masterData); 
        } else {
          this.notification.showError(res["description"]);
          this.getQdtl(this.masterData); 
          event.source.checked = !previousChecked; 
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.notification.showError("Something went wrong. Please try again.");
        event.source.checked = !previousChecked; 
        this.getQdtl(this.masterData); 
      }
    );
  }

  
  forQuotationDD() {
    this.isLoading = true;
    // this.SpinnerService.show();
    this.prposervice.getreqfor().subscribe(
      (results: any[]) => {
        // this.SpinnerService.hide();
        this.isLoading = false;

        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found");
          return false;
        }
        this.forQuotationList = datas;
        console.log("forQuotationList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
    // }
  }
  forQuotationList: any = [];
  isLoading: boolean = false;
  currentpageprod = 1;
  has_nextprod = true;
  has_previousprod = true;
  product_type: any;
  getproductFK(id) {
    this.SpinnerService.show();
    // let commodity = this.quotationForm.value?.commodity?.id;
    // let supplier = this.quotationForm.value?.supplier?.id;
    // let type = this.quotationForm.value?.type;
    let value = this.productInput?.nativeElement?.value;
    // // let assetvalue=this.assetvalue.nativeElement.value
    // let assetvalue = this.quotationForm.value.is_asset;
    // console.log("value==>", value);

    // let productCat = this.prForm.value.productCategory.id
    // let prodType = this.prForm.value.productType.id
    // let Dts = this.quotationForm.value.dts;
    if (
      id == 1 &&
      (this.product_type == undefined ||
        this.product_type == null ||
        this.product_type == "")
    ) {
      this.notification.showError("Select Product Type!");
      this.SpinnerService.hide();
      return false;
    }

    // else {
    // this.prposervice.getproductDependencyFK(commodity,value,assetvalue,1)
    this.prposervice
      .getproductfn("", this.product_type, value, 1)
      // .getproductDependencyFK(type, commodity, supplier, Dts, value, 1, this.product_type)
      .subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          this.isLoading = false;

          let data = results;
          let datas = results["data"];
          //BUG ID/:8452
          this.currentpageprod = 1;
          this.has_nextprod = true;
          this.has_previousprod = true;
          //

          console.log("datas.length==>", datas.length);
          if (datas.length == 0) {
            this.notification.showInfo("No Records Found");
            return false;
          }
          //BUG ID:7538
          //  if (data['description'] ===  "The Product Doesn't Have a Valid Catalog") {
          //   this.SpinnerService.hide()
          //   this.notification.showError("The Product Doesn't Have a Valid Catalog")
          // }
          ("The Product Doesn't Have a Valid Catalog");
          this.productList = datas;
          console.log("product", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    // }
  }
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("productcatt") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInputt") productInputt: any;
  @ViewChild("producct") matproducctAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInputtype") productInputtype: any;
  @ViewChild("productInput1") productInput1: any;
  autocompleteproductScrollP() {
    setTimeout(() => {
      if (
        this.matproducctAutocomplete &&
        this.autocompleteTrigger &&
        this.matproducctAutocomplete.panel
      ) {
        fromEvent(this.matproducctAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matproducctAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matproducctAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matproducctAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matproducctAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprod === true) {
                this.prposervice
                  .getproductdata(
                    // this.prForm.value.type,
                    // this.prForm.value.commodity.id,
                    // this.prForm.value.dts,
                    this.productInput.nativeElement.value,
                    this.currentpageprod + 1,
                    this.product_type
                  )

                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.productList = this.productList.concat(datas);
                      if (this.productList.length >= 0) {
                        this.has_nextprod = datapagination.has_next;
                        this.has_previousprod = datapagination.has_previous;
                        this.currentpageprod = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  autocompleteproductScroll() {
    setTimeout(() => {
      if (
        this.matproductAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductAutocomplete.panel
      ) {
        fromEvent(this.matproductAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matproductAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprod === true) {
                this.prposervice
                  .getproductdata(
                    // this.prForm.value.type,
                    // this.prForm.value.commodity.id,
                    // this.prForm.value.dts,
                    this.productInputt.nativeElement.value,
                    this.currentpageprod + 1,
                    this.product_type
                  )

                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.productList = this.productList.concat(datas);
                      if (this.productList.length >= 0) {
                        this.has_nextprod = datapagination.has_next;
                        this.has_previousprod = datapagination.has_previous;
                        this.currentpageprod = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  has_nextitem = true;
  has_previousitem = true;
  currentpageitem = 1;
  getitemFK() {
    // this.SpinnerService.show();
    // this.MAKE = true;
    // console.log("data", this.MAKE);
    // let product = this.masterForm.value.product.id;
    // let commodity = this.quotationForm.value.commodity.id;
    // let dts = this.quotationForm.value.dts;
    // let supplier = this.quotationForm.value.supplier.id;
    this.SpinnerService.show();
    if (
      // supplier == undefined ||
      this.product_code == ""
      // commodity == undefined
    ) {
      this.notification.showError("Kindly Choose Product!");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice.getMake(this.product_code, "", 1).subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          this.isLoading = false;
          let datas = results["data"];
          let data = results;

          //BUG ID:8452
          this.currentpageitem = 1;
          this.has_nextitem = true;
          this.has_previousitem = true;
          //

          // if (datas?.length == 0) {
          //   this.notification.showInfo("No Records Found")
          // }
          if (datas.length == 0) {
            this.notification.showError("No data is there against make");
            this.quotationForm.patchValue({
              unitprice: datas[0].unitprice,
              uom: datas[0].uom,
            });
          } else {
            this.itemList = datas;
          }

          console.log("product", datas);
          //BUG ID:6902
          // if (data['description'] === "Kindly Choose Other Item") {
          //   this.SpinnerService.hide()
          //   this.notification.showError("Kindly Choose Other Item")
          // }
          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.SpinnerService.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }
  itemList: any = [];
  public displayFnitem(item): string | undefined {
    return item ? item.name : undefined;
  }
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;

  make_id: any;
  makeCheck(data) {
    // this.is_model = data.model_check;
    this.make_id = data?.id;
    this.quotationForm.get("model").reset();
  }
  autocompleteitemScroll() {
    console.log("has next of item==>", this.has_nextitem);
    setTimeout(() => {
      if (
        this.matitemAutocomplete &&
        this.autocompleteTrigger &&
        this.matitemAutocomplete.panel
      ) {
        fromEvent(this.matitemAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matitemAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matitemAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matitemAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matitemAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextitem === true) {
                this.prposervice
                  .getMake(
                    this.product_code,
                    this.itemInput.nativeElement.value,
                    this.currentpageitem + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.itemList = this.itemList.concat(datas);
                      if (this.itemList.length >= 0) {
                        this.has_nextitem = datapagination.has_next;
                        this.has_previousitem = datapagination.has_previous;
                        this.currentpageitem = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  getpproduct(id, type) {
    this.getproductFK(id);

    if(type == 2){ 
      this.setupValueChanges(this.masterForm, "product");
    }
    if(type == 3){
      this.setupValueChanges(this.quotationForm, "product");
    }
    if(type == 1){
    this.setupValueChanges(this.quotationMasterSearch, "product_id");
    }
    // this.setupValueChanges(this.quotationMasterSearch, "product_id");
  }
  setupValueChanges(formGroup: FormGroup, controlName: string) {
    formGroup
      .get(controlName)
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getproductfn("", this.product_type, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]); // Return an empty array or fallback data
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      });
  }

  // getpproduct() {
  //   this.getproductFK();

  //   this.quotationForm
  //     .get("product")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         // console.log('inside tap')
  //       }),
  //       switchMap((value) =>
  //         this.prposervice
  //           .getproductfn(
  //             "",
  //             this.product_type,
  //             // this.prForm.value.type,
  //             // this.prForm.value.commodity.id,
  //             // this.prForm.value.dts,
  //             value,
  //             1
  //             // this.product_type
  //           )
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false;
  //             }),
  //             catchError((error) => {
  //               this.errorHandler.handleError(error); // Handle the error
  //               this.SpinnerService.hide(); // Hide the spinner
  //               // Optionally return a fallback value to continue the observable stream
  //               return of([]); // Empty array or fallback response
  //             })
  //           )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productList = datas;
  //     });
  // }
  isProductChoosen: boolean = true;
  attrList: any = [];
  product_code: any;
  specList: any = [];
  showCard: boolean = false;
  specsList: any = [];
//   specsList: any = [
//     {
//         "code": "P00001",
//         "id": 1,
//         "name": "(DOT MATRIX) PRINTER",
//         "product_fullname": "Hardware>(DOT MATRIX) PRINTER",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "dot matrix",
//         "uom": "NUMBER"
//     },
//     {
//         "code": "P01282",
//         "id": 1282,
//         "name": "12 V POWER SUPPLY UNIT",
//         "product_fullname": "Hardware>12 V POWER SUPPLY UNIT",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P00002",
//         "id": 2,
//         "name": "132 col PRINTER",
//         "product_fullname": "Hardware>132 col PRINTER",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "Kilogram"
//     },
//     {
//         "code": "P00003",
//         "id": 3,
//         "name": "16 CHANNEL HYBRID DVR",
//         "product_fullname": "Hardware>16 CHANNEL HYBRID DVR",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P00004",
//         "id": 4,
//         "name": "16 CHANNEL TRIBRID DVR",
//         "product_fullname": "Hardware>16 CHANNEL TRIBRID DVR",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P00005",
//         "id": 5,
//         "name": "16 PORT SWITCH",
//         "product_fullname": "Hardware>16 PORT SWITCH",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P00006",
//         "id": 6,
//         "name": "2 PORT CHANNELISED E 1",
//         "product_fullname": "Hardware>2 PORT CHANNELISED E 1",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": null,
//         "id": 7,
//         "name": "24 PORT SAN SWITCH",
//         "product_fullname": "Hardware>24 PORT SAN SWITCH",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P00008",
//         "id": 8,
//         "name": "24 PORT SWITCH",
//         "product_fullname": "Hardware>24 PORT SWITCH",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     },
//     {
//         "code": "P01283",
//         "id": 1283,
//         "name": "32 CHANNEL TRIBRID DVR",
//         "product_fullname": "Hardware>32 CHANNEL TRIBRID DVR",
//         "product_type": {
//             "code": "PDTCL004",
//             "id": 4,
//             "name": "Hardware"
//         },
//         "productdisplayname": "0",
//         "uom": "testing by a2"
//     }
// ];
  getConf(spec: string): void {
    if (spec.toLowerCase() === "service for".toLowerCase()) {
      this.SpinnerService.show();
      this.prposervice.getConf_for(1, 2, "").subscribe((res) => {
        this.SpinnerService.hide();
        this.specsList = res["data"];
      });
    } else if (spec.toLowerCase() === "it spare for".toLowerCase()) {
      this.SpinnerService.show();
      this.prposervice.getConf_for(1, 1, "").subscribe((res) => {
        this.SpinnerService.hide();
        this.specsList = res["data"];
      });
    } else {
      this.SpinnerService.show();
      this.prposervice.getConf(1, spec, this.product_code).subscribe((res) => {
        this.SpinnerService.hide();
        this.specsList = res["data"];
      });
    }

  }
  debounceTimer: any;

  onInputChange(value: string, spec: any): void {
    clearTimeout(this.debounceTimer);
  
    this.debounceTimer = setTimeout(() => {
      this.isLoading = true;
  
      let apiCall;
  
      // Choose the correct API based on spec like in getConf()
      if (spec?.specification === "Service for") {
        apiCall = this.prposervice.getConf_for(1, 2, value);
      } else if (spec?.specification === "IT Spare For") {
        apiCall = this.prposervice.getConf_for(1, 1, value);
      } else {
        apiCall = this.prposervice.getConf(1, spec?.specification, value);
      }
  
      apiCall.pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
          return of([]);
        })
      ).subscribe((results: any[]) => {
        this.specsList = results["data"];
      });
  
    }, 200);
  }
  

  
  getOtherAttributes(product) {
    this.product_code = product?.code;
    this.prod_id = product?.id;
    this.prposervice.getOtherAttributes(this.product_code, 1).subscribe((res) => {
      // this.attrList = res;
      // this.itemList = res?.make;
      // this.modelList = res?.model;
      this.specList = res["data"];
      this.specList.length > 0 ? (this.showCard = true) : (this.showCard = false);
      // this.specDict = this.specList
      // this.configList = res?.specification?.configuration;
    });
  }
  resetfields(){
    this.quotationForm.get('make').reset();
    this.quotationForm.get('model').reset();
    this.quotationForm.get('spec_config').reset();
  }

  public displayFnmodel(model): string | undefined {
    return model ? model.name : undefined;
  }
  modelList: any = [];
  getmodall() {
    // this.SpinnerService.show();
    // let product = this.prForm.value.product.id;
    // let commodity = this.prForm.value.commodity.id;
    // let dts = this.prForm.value.dts;
    // let supplier = this.prForm.value.supplier.id;
    // let makeId = this.prForm.value.items.make.id;
    // let make = this.prForm.value.items.make;

    this.SpinnerService.show();
    if (
      this.make_id == undefined ||
      this.make_id == "" ||
      this.product_code == "" ||
      this.product_code == undefined
    ) {
      this.notification.showError("Kindly Choose Product Name and Make");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice.getModal(this.product_code, this.make_id, 1).subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          this.isLoading = false;

          let datas = results["data"];
          let data = results;
          // this.modelID = datas[0].model.id;
          // this.modellname = datas[0].model.name;

          this.currentpagemodel = 1;
          this.has_nextmodel = true;
          this.has_previousmodel = true;

          if (datas?.length == 0) {
            this.notification.showInfo("No Records Found");
          }
          this.modelList = datas;
          console.log("product", datas);

          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.SpinnerService.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }

  currentpagemodel = 1;
  has_nextmodel = true;
  has_previousmodel = true;
  @ViewChild("model") matmodelAutocomplete: MatAutocomplete;
  @ViewChild("modelInput") modelInput: any;
  public displayFnspecs(spec): string | undefined {
    return spec ? spec.configuration : undefined;
  }
  autocompletemodelScroll() {
    console.log("has next of model==>", this.has_nextmodel);
    setTimeout(() => {
      if (
        this.matmodelAutocomplete &&
        this.autocompleteTrigger &&
        this.matmodelAutocomplete.panel
      ) {
        fromEvent(this.matmodelAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matmodelAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matmodelAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matmodelAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matmodelAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextmodel === true) {
                this.prposervice
                  .getModal(
                    this.product_code,
                    this.make_id,
                    this.currentpagemodel + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.modelList = this.modelList.concat(datas);
                      if (this.modelList.length >= 0) {
                        this.has_nextmodel = datapagination.has_next;
                        this.has_previousmodel = datapagination.has_previous;
                        this.currentpagemodel = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  public displayFnsupplier(supplier: branchlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }
  public displayFnsupp(supplier: branchlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }

  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  @ViewChild("suppliersearch") matsuppliersearchAutocomplete: MatAutocomplete;
  @ViewChild("suppliersearchInput") suppliersearchInput: any;
  @ViewChild("suppliersearchh") matsuppliersearchAutocompletee: MatAutocomplete;
  @ViewChild("suppliersearchInputt") suppliersearchInputt: any;
  autocompletesuppliersearchScroll() {
    setTimeout(() => {
      if (
        this.matsuppliersearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matsuppliersearchAutocomplete.panel
      ) {
        fromEvent(
          this.matsuppliersearchAutocomplete.panel.nativeElement,
          "scroll"
        )
          .pipe(
            map(
              (x) =>
                this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsuppliersearchAutocomplete.panel.nativeElement
                .scrollHeight;
            const elementHeight =
              this.matsuppliersearchAutocomplete.panel.nativeElement
                .clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.prposervice
                  .getsupplierDropdownFKdd(
                    this.suppliersearchInput.nativeElement.value,
                    this.currentpagesupplier + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.suppliersearchList =
                        this.suppliersearchList.concat(datas);
                      if (this.suppliersearchList.length >= 0) {
                        this.has_nextsupplier = datapagination.has_next;
                        this.has_previoussupplier = datapagination.has_previous;
                        this.currentpagesupplier = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  uomlist: any = [];
  public displayFnuom(uomtype?: any): string | undefined {
    if (typeof uomtype === "string") {
      return uomtype;
    }
    return uomtype ? uomtype?.name : undefined;
  }
  getSuppliersearch() {
    this.getSupplier();
    this.setupValueChangesSupplier(this.quotationSearch, "supplier_id");
    this.setupValueChangesSupplier(this.quotationForm, "supplier");
  }
  setupValueChangesSupplier(formGroup: FormGroup, controlName: string) {
    formGroup
      .get(controlName)
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getsupplierDropdownFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
              return of([]);
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.suppliersearchList = datas;
      });
  }
  
  


  
  getSupplier() {
    this.SpinnerService.show();
    this.prposervice.getsupplierDropdown().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.suppliersearchList = datas;
        console.log("suppliersearchList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  suppliersearchList: any = [];

  getbruom() {
    this.getuom();
    this.quotationForm
      .get("uom")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getuomFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.uomlist = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getuom() {
    this.prposervice.getuomFK("").subscribe((results: any[]) => {
      let datas = results["data"];
      this.uomlist = datas;
    });
  }
  has_nextu: boolean = true;
  currentpageuom = 1;
  has_previousu: boolean = true;

  @ViewChild("uom") matuomAutocomplete: MatAutocomplete;
  @ViewChild("uomInput") uomInput: any;
  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextu === true) {
                this.prposervice
                  .getuomFKdd(
                    this.uomInput.nativeElement.value,
                    this.currentpageuom + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomlist.length >= 0) {
                      this.uomlist = this.uomlist.concat(datas);
                      this.has_nextu = datapagination.has_next;
                      this.has_previousu = datapagination.has_previous;
                      this.currentpageuom = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  quotationData() {
    const formValues = this.quotationSearch.value;
    formValues.supplier_id = formValues.supplier_id
      ? formValues?.supplier_id?.id
      : "";
      // const formValues = this.quotationSearch.value;
    formValues.quotation_no = this.masterData?.quotation_no;
  
    // formValues.quotation_id = this.masterData.quotation_id;
    formValues.product_name = formValues.product_name ? formValues?.product_name?.name : "";
    formValues.make_name = formValues.make_name ? formValues?.make_name?.name : "";
    formValues.model_name = formValues.model_name ? formValues?.model_name?.name : "";



    //Format dates using DatePipe (only if they exist)
formValues.quotation_date = formValues.quotation_date
  ? this.datepipe.transform(formValues.quotation_date, "yyyy-MM-dd")
  : "";
formValues.start_date = formValues.start_date
  ? this.datepipe.transform(formValues.start_date, "yyyy-MM-dd")
  : "";
formValues.end_date = formValues.end_date
  ? this.datepipe.transform(formValues.end_date, "yyyy-MM-dd")
  : "";

    // Create a new object only containing keys that have a truthy value
    const filteredValues = Object.keys(formValues)
      .filter(
        (key) =>
          formValues[key] !== null &&
          formValues[key] !== undefined &&
          formValues[key] !== ""
      )
      .reduce((acc, key) => {
        acc[key] = formValues[key];
        return acc;
      }, {});

    this.SpinnerService.show();
    this.prposervice.quotationSearchnew(filteredValues,1).subscribe((res) => {
      this.SpinnerService.hide();

      if(res["data"]){
      this.QuotationList = res["data"][0];

      }
      if(res.code){
       this.notification.showError(res.description)
      }
      // 
    },
    (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
  );
  }

  closeresett() {
    this.quotationForm.reset();
    this.selectedFile = [];
    this.servicekey = false;
    this.specList = [];
    this.showCard = false;
  }
  quotationSubmit() {
    // let formValues = this.quotationForm.value;
    const formValues = this.quotationForm.value;
    if (formValues.producttype.name == "Service"){
    if(formValues.amc_start_date == null || formValues.amc_start_date == undefined || formValues.amc_start_date == '') {
      this.notification.showError("Please Select AMC Start Date")
      return
    }
    if(formValues.amc_end_date == null || formValues.amc_end_date == undefined || formValues.amc_end_date == '') {
      this.notification.showError("Please Select AMC End Date")
      return
    }

  }

    Object.keys(formValues).forEach((key) => {
      if (
        formValues[key] === null ||
        formValues[key] === undefined ||
        formValues[key] === ""
      ) {
        formValues[key] = "";
      }
    });
    formValues.quotation_date = this.formatDate(formValues?.quotation_date);
    formValues.start_date = this.formatDate(formValues?.start_date);
    formValues.end_date = this.formatDate(formValues?.end_date);
    formValues.amc_start_date = this.formatDate(formValues?.amc_start_date);
    formValues.amc_end_date = this.formatDate(formValues?.amc_end_date);
    formValues.unit_price=typeof(formValues?.unit_price)=='string'?parseFloat(formValues?.unit_price?.replace(/,/g,'')):formValues?.unit_price
    
    if (formValues.uom && typeof formValues.uom === "object") {
      formValues.uom = formValues.uom.name;
    }    
   
  if(this.readonly){
    formValues.supplier_id = formValues.supplier_id;
    delete formValues.supplier
  } else {
    formValues.supplier_id = formValues.supplier
    ? formValues?.supplier?.id
    : "";
  }
   
    // formValues.quotation_for_name = this.masterForm.value?.quotation_for_id?.name;
    // formValues.quotation_for_id = this.masterForm.value?.quotation_for_id?.id;
    // let currentDate = new Date().toJSON().slice(0, 10);
    // formValues.quotation_date = currentDate;


if(formValues.producttype.name == "Service"){
  this.speccstring = formValues.spec_config.specification;
  this.speccstring += `, AMC_Begin_Date : ${formValues.amc_start_date}, AMC_End_Date : ${formValues.amc_end_date}`;
  this.payloadques = {
        ...formValues,
        spec_config: {
          id: formValues.spec_config.id,
          specification: this.speccstring
        }
      };
    }
    else{
      this.payloadques = {
              ...formValues,
              spec_config: {
                id: formValues.spec_config.id,
                specification: formValues.spec_config.specification,
              },
            };
    }


    // specification: `${formValues.spec_config.specification}, amc_start_date: ${formValues.amc_start_date},amc_end_date: ${formValues.amc_end_date}`,
    // if(formValues.valid){
    // this.specList.forEach(element => {
    //   let spec = element?.specification
    //   let conf = formValues?.con
    // });

    // const filteredValues = Object.keys(formValues)
    // .filter(
    //   (key) =>
    //     formValues[key] !== null &&
    //     formValues[key] !== undefined &&
    //     formValues[key] !== ""
    // )
    // .reduce((acc, key) => {
    //   acc[key] = formValues[key];
    //   return acc;
    // }, {});
    const formData = new FormData();

    formData.append("data", JSON.stringify(this.payloadques));

    if (this.selectedFile && this.selectedFile.length > 0) {
      this.selectedFile.forEach((file, index) => {
        // Only append if file is not a plain object
        // if (!(typeof file === 'object' && !(file instanceof File))) {
          formData.append("file", file);
        // }
      });
    }
    
    // const fileFromForm = this.fileVal;
    // if (fileFromForm) {
    //   formData.append("file", this.fileVal); // Append the auto-patched file
    // }
    this.SpinnerService.show();
    this.prposervice.getQuotationSubmitData(formData).subscribe((res) => {
      this.SpinnerService.hide();

      if (res["status"] == "Success") {
        this.notification.showSuccess(res["message"]);
        this.quotationForm.reset();
        this.selectedFile = [];
        this.servicekey = false;
        this.specList = [];
        const modalTrigger = document.getElementById("assetmodall");
        modalTrigger?.click();
        this.getQdtl(this.masterData);
      } else {
        this.notification.showInfo(res["description"]);
      }
    });
    // this.specList = [];

    // this.quotationForm.reset();
    // } else {
    //   this.notification.showInfo("Please Fill All the Details!");
    //   return
    // }
  }
  asset_id: any;
  assetList: any = [];
  @ViewChild("assetDD") assetDD: MatAutocomplete;
  @ViewChild("assetInput") assetInput: any;

  getAsset(){
    // if (!this.assetForm.get("request_for").value) {
    //   this.notification.showInfo("Please Select Request For");
    //   return;
    // }
    if (!this.masterForm.get("product").value) {
      this.notification.showInfo("Please Select Product Name");
      return;
    }
    this.prposervice
    .get_Asset(this.assetInput.nativeElement.value, "", this.prod_id, 1)
    .subscribe((results) => {
      let datas = results["data"];
      this.assetList = datas;
      this.SpinnerService.hide();
      if(results?.code){
        this.notification.showInfo(results["description"]);
        this.SpinnerService.hide();
      }
      if (this.assetList.length == 0) {
        this.notification.showInfo("No Asset Specified!");
        this.SpinnerService.hide();
      }
     
    });
  }
  prod_id: any;

    getAssetId(){
      this.getAsset()
      this.masterForm
        .get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.get_Asset(value, "", this.prod_id , 1).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
          )
        )
        .subscribe(
          (results: any[]) => {
            let datas = results["data"];
            this.assetList = datas;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
    public displayFnAsset(item): string | undefined {
      return item ? item.assetid : undefined;
    }
    has_next_asset = true;
    has_previous_asset = true;
    current_ass = 1;
    autocompleteAssetScroll(){
      setTimeout(() => {
        if (
          this.assetDD &&
          this.autocompleteTrigger &&
          this.assetDD.panel
        ) {
          fromEvent(this.assetDD.panel.nativeElement, "scroll")
            .pipe(
              map(
                (x) => this.assetDD.panel.nativeElement.scrollTop
              ),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe((x) => {
              const scrollTop =
                this.assetDD.panel.nativeElement.scrollTop;
              const scrollHeight =
                this.assetDD.panel.nativeElement.scrollHeight;
              const elementHeight =
                this.assetDD.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_next_asset === true) {
                  this.prposervice
                    .get_Asset(
                      this.assetInput.nativeElement.value, "", this.prod_id, 
                      this.current_ass + 1
                    )
                    .subscribe(
                      (results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.assetList = this.assetList.concat(datas);
                        if (this.assetList.length >= 0) {
                          this.has_next_asset = datapagination.has_next;
                          this.has_previous_asset = datapagination.has_previous;
                          this.current_ass = datapagination.index;
                        }
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
                    );
                }
              }
            });
        }
      });
    }
  

    isadd: boolean = false;
    assetDict: any = [];
    specification : any = [];
    getSpecificationKeys(specification: any): string[] {
      return specification ? Object.keys(specification) : [];
    }

    addAsset() {
      let asset_value = this.masterForm.get("asset_id").value.assetid;
      if (asset_value == "" || asset_value == null || asset_value == undefined) {
        this.notification.showInfo("Select an Asset ID to Add!");
        return;
      }
      this.SpinnerService.show();
      this.prposervice.
      get_Asset(asset_value, '', this.prod_id, 1)
      .subscribe(
        (res) => {
          if (res["data"]) {
  
            // for (let element of this.assetArray) {
            //   if (element?.asset_id == res["data"][0]?.asset_id) {
            //     this.notification.showInfo("Asset ID Already Exists");
            //     // this.assetForm.reset();
            //      this.assetForm.get('asset_id').reset();
  
            //     this.SpinnerService.hide();
            //     return; 
            //   }
            // }
              this.assetArray.push(res["data"][0]);
            // let podetail_id = res.podetail_id
            // let asset_id = res.asset_id
            // let dict = {
            //   podetail_id : res.podetail_id,
            //   asset_id : res.asset_id
            // }
            // this.assetDict.push(dict)
  
            this.SpinnerService.hide();
          } else if(res['code'] == "Asset ID Already Exists"){
            let assetArr: any = [];
            assetArr = res.description['Asset ID'];
            let assets = assetArr.map((x) => x.error);
            this.notification.showInfo(assets.join('\n')); 
          } 
          else {
            this.notification.showInfo(res.description);
            this.SpinnerService.hide();
          }
          // this.isadd = true;
          this.masterForm.get('asset_id').reset();
        },
        (error) => {
          this.SpinnerService.hide();
          this.notification.showError(error);
        }
      );
    }
    closereset(){
      this.masterForm.reset();
    }
    del: any = []
    assetArray: any = []
    editKey: number = 0;
    deleteAsset(data, i) {
      if (this.editKey != 1) {
        this.assetArray.forEach((e, ind) => {
          if (i === ind) {
            this.assetArray.splice(i, 1);
          }
        });
      }
      if (this.editKey == 1 && data.id != undefined) {
        let con = confirm("Are you sure want to Delete?");
        if(con){
        this.assetArray.forEach((e, ind) => {
          if (i === ind) {
            this.assetArray.splice(i, 1);
            this.del.push(data.id);
            this.assetArray[i].status = 0;
          }
        });
      }  
      else 
        return
      }
      if(this.editKey == 1 && data.id == undefined){
        this.assetArray.forEach((e, ind) => {
          if (i === ind) {
            this.assetArray.splice(i, 1);
            // this.del.push(data.id);
          }
        });   
     } else {
      return
     }
    }

    fileview(files) {
      console.log("file data to view ", files)
      if(files.id == undefined || files.id == "" || files.id == null){
        let stringValue = files.type.toLowerCase(); 
        if (stringValue === "PNG" || stringValue === "png" || stringValue === "jpeg" || stringValue === "jpg" || stringValue === "JPG" || stringValue === "JPEG" || stringValue === "image/jpeg" || stringValue ==="image/png") {
        this.showimageHeaderPreview = true
        this.showimageHeaderPreviewPDF = false
        const reader: any = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = (_event) => {
          this.jpgUrls = reader.result
        }
      }
      else if (stringValue === "pdf" || stringValue === "application/pdf") {
        this.showimageHeaderPreview = false
        this.showimageHeaderPreviewPDF = true
        const reader: any = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = (_event) => {
          this.pdfurl = reader.result
        }
      }
      else {
        this.showimageHeaderPreview = false
        this.showimageHeaderPreviewPDF = false
        const reader = new FileReader();
      reader.onload = (event: any) => {
      const blob = new Blob([event.target.result], { type: stringValue });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files.name; // Preserve the original file name
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
    };
    reader.readAsArrayBuffer(files); // Read file as binary data
      }
    }
     else {
      this.SpinnerService.show();
      this.prposervice.fileDownloadpo(files?.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = files?.file_name.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = files?.file_name;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
     }
  
    }

    enterPressed = false
  onEnterKey(event: KeyboardEvent) {
  if (!this.enterPressed) {
    this.enterPressed = true;
    this.getMasterQuotation(this.page);
    setTimeout(() => {
      this.enterPressed = false;
    }, 500); 
  }

  event.preventDefault();      
  event.stopPropagation();  
}

 enterPressedchild = false
  onEnterKeychild(event: KeyboardEvent) {
  if (!this.enterPressedchild) {
    this.enterPressedchild = true;
    this.quotationData();
    setTimeout(() => {
      this.enterPressedchild = false;
    }, 500); 
  }

  event.preventDefault();      
  event.stopPropagation();  
}
resetAfterPRODUCTChange(){
  this.quotationSearch.get('product_name').reset();
this.quotationSearch.get('make_name').reset();
this.quotationSearch.get('model_name').reset();

  

}
resetAfterMAKEChange(){
  this.quotationSearch.get('make_name').reset();
this.quotationSearch.get('model_name').reset();

}
resetAfterModelChange(){

this.quotationSearch.get('model_name').reset();

}

    // fileDownloads(id, fileName) {
    //   this.SpinnerService.show();
    //   this.dataService.fileDownloadpo(id)
    //     .subscribe((results) => {
    //       this.SpinnerService.hide();
    //       console.log("re", results)
    //       let binaryData = [];
    //       binaryData.push(results)
    //       let filevalue = fileName.split('.')
    //       if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
    //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //       let link = document.createElement('a');
    //       link.href = downloadUrl;
    //       link.download = fileName;
    //       link.click();
    //       }else{
    //         let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
    //         window.open(downloadUrl, "_blank");
    //       }
    //     },(error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     })
    // }
// onAmountInput(event: any, section: FormGroup,controlName: string) {
//   const input = event.target.value;
//   const rawValue = input ? input.toString().replace(/,/g, '') : '';
//  const rawvaluenum = Number(rawValue)
//   section.get(controlName)?.setValue(input, { emitEvent: false });
// }


//  omit_special_num(event) {
//     var k;
//     k = event.charCode;
//     return k == 190 || (k >= 48 && k <= 57) || k == 46; //6556
//     // return ((k == 190) || (k >= 48 && k <= 57));
//   }
// omit_special_num(event) {
//   let k = event.charCode ? event.charCode : event.keyCode;

//   // Allow numbers (0–9) → ASCII 48–57
//   if (k >= 48 && k <= 57) {
//     return true;
//   }

//   // Allow dot (.) → ASCII 46
//   if (k === 46) {
//     return true;
//   }

//   return false;
// }

onAmountInput(event: any, section: FormGroup, controlName: string) {
  const inputEl = event.target as HTMLInputElement;
  let rawValue = inputEl.value ? inputEl.value.replace(/,/g, '') : '';

  // allow empty
  if (rawValue === '') {
    section.get(controlName)?.setValue(null, { emitEvent: false });
    return;
  }

  // detect trailing dot
  const hasTrailingDot = rawValue.endsWith('.');

  let num = Number(rawValue);

  if (!isNaN(num)) {
    // round to 2 decimals
    num = Math.round(num * 100) / 100;

    // ✅ always patch number into form control
    section.get(controlName)?.setValue(num, { emitEvent: false });

    // format for display
    let formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(num);

    // if user typed trailing dot, keep it visually
    if (hasTrailingDot) {
      formatted += '.';
    } else if (rawValue.includes('.')) {
      // keep typed decimals if within 2 digits
      const [, dec] = rawValue.split('.');
      if (dec && dec.length <= 2) {
        formatted = formatted.split('.')[0] + '.' + dec;
      }
    }

    inputEl.value = formatted;
  } else {
    section.get(controlName)?.setValue(null, { emitEvent: false });
  }
}
AmountCalculation(event,section,values){
     let value = event.target.value.replace(/,/g, ''); // remove commas
  // Allow numbers with optional dot and up to 2 decimals
  if (!/^\d*\.?\d{0,2}$/.test(value) && value !== '.') {
    value = value.slice(0, -1);
  }
  // Don't format if user has only typed a dot
  if (value !== '.') {
    const parts = value.split('.');
    let integerPart = parts[0] || '';
    // ✅ Keep dot and decimals correctly
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    // ✅ Indian numbering format (e.g. 1,00,000)
    // integerPart = integerPart.replace(/\B(?=(\d{2})+(?!\d)(?<=\d{3,}))/g, ',');
    integerPart = integerPart.replace(/\B(?=(\d{3})(\d{2})*$)/g, ',');
    value = integerPart + decimalPart;
  }
   section.get(values)?.setValue(value, { emitEvent: false });
  }

onAmountBlur(event: any, section: FormGroup, controlName: string) {
  let val = section.get(controlName)?.value;

  if (val === null || val === undefined || val === '') return;

  // ensure numeric
  let num = Number(val);
  if (isNaN(num)) num = 0;

  // ✅ force to 2 decimals always
  num = Number(num.toFixed(2));

  // ✅ patch numeric value back (with 2 decimals)
  section.get(controlName)?.setValue(num, { emitEvent: false });

  // ✅ update display with 2 decimals + Indian commas
  (event.target as HTMLInputElement).value = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

omit_special_num(event: KeyboardEvent) {
  const k = event.key;

  if (/^[0-9]$/.test(k)) return true; // allow digits
  if (k === '.') return true;         // allow dot
  event.preventDefault();             // block others
  return false;
}
getProductTypes() {
    this.isLoading=true
    this.reportService.getpdtclasstype('',1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results['data'];
        this.prdTypes = datas;
        let datapagination = results["pagination"];
                 
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                      
      }
    });
  }
  input_getProductTypes() {
    this.isLoading=true
    this.reportService.getpdtclasstype(this.productInputtype.nativeElement.value,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results['data'];
        this.prdTypes = datas;
        let datapagination = results["pagination"];
                 
                     
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
      }
    });
  }
   input_getProductTypes1() {
    this.isLoading=true
    this.reportService.getpdtclasstype(this.productInput1.nativeElement.value,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results['data'];
        this.prdTypes = datas;
        let datapagination = results["pagination"];
                 
                     
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
      }
    });
  }
 protype_autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.productAutocomplete &&
        this.autocompleteTrigger &&
        this.productAutocomplete.panel
      ) {
        fromEvent(this.productAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.productAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.productAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.productAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.productAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.producttype_next === true) {
                this.reportService
                  .getpdtclasstype(this.productInputtype.nativeElement.value,this.producttype_crtpage +1 )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.prdTypes = this.prdTypes.concat(datas);
                    
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
   protype_autocompleteassetScroll1() {
    setTimeout(() => {
      if (
        this.productAutocomplete1 &&
        this.autocompleteTrigger &&
        this.productAutocomplete1.panel
      ) {
        fromEvent(this.productAutocomplete1.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.productAutocomplete1.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.productAutocomplete1.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.productAutocomplete1.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.productAutocomplete1.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.producttype_next === true) {
                this.reportService
                  .getpdtclasstype(this.productInput1.nativeElement.value,this.producttype_crtpage +1 )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.prdTypes = this.prdTypes.concat(datas);
                    
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
}
