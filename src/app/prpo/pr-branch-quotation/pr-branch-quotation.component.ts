import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PRPOSERVICEService } from "../prposervice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../notification.service";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { fromEvent, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
// import { prodlistss } from "../prpomaster/prpomaster.component";
import { DatePipe } from "@angular/common";
import { qfList } from "../pr-quotation/pr-quotation.component";
// import { branchlistss } from "../po-create/po-create.component";
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
@Component({
  selector: 'app-pr-branch-quotation',
  templateUrl: './pr-branch-quotation.component.html',
  styleUrls: ['./pr-branch-quotation.component.scss']
})
export class PrBranchQuotationComponent implements OnInit {
  quotationForm: FormGroup;
  quotationSearch: FormGroup;
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @Input() selectedRows: any = [];
  @Input() branchForm: FormGroup;
  productList: any =[];
  Lists: any = [];
  quotation_no: any;
  detailData: boolean;
  servicecheck:boolean = false;

  constructor(
    private fb: FormBuilder,
    private prposervice: PRPOSERVICEService,
    private errorHandler: ErrorHandlingServiceService,
    private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,
    private datepipe : DatePipe
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
      onInit: function() {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector('.note-editable');
        if (editor) {
          editor.addEventListener('input', function() {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName('table'));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = 'collapse';
              htmlTable.style.width = '100%';
              htmlTable.style.textAlign = 'left';
  
              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll('th, td');
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = '1px solid black';
                htmlCell.style.padding = '5px 3px';
                htmlCell.style.boxSizing = 'border-box';
              });
            });
          });
        }
      },
    },
  };
  ngOnInit(): void {
    this.quotationSearch = this.fb.group({
      supplier_code: [""],
      quotation_code: [""],
      quotationno: [""],
      product_type:[""],
      product_name: [""],
      // status:['']
    });
    this.quotationMasterSearch = this.fb.group({
      quotation_no: [""],
      quotation_for_id: [""],
      producttype_id: [""],
      product_id: [""],
      quotation_status: [""],
    });
    this.quotationForm = this.fb.group({
      quotation_for_id: [""],
      purpose: [""],
      supplier: ["", Validators.required],
      supplier_id: [""],
      quotation_for_name: [""],

      // quotationCode: ["", Validators.required],
      // quot_number: ["", Validators.required],
      quotation_date: ["", Validators.required],
      quotation_note: [""],
      validity_start: ["", Validators.required],
      validity_end: ["", Validators.required],
      producttype: ["", Validators.required],
      product: ["", Validators.required],
      make: ["", Validators.required],
      qty: [""],
      model: ["", Validators.required],
      spec_config: this.fb.control({ id: "", specification: "" }, Validators.required), 
      unit_price: ["", [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    console.log("selectedRows", this.selectedRows[0]);
    this.quotationForm.get('product').setValue(this.selectedRows[0].product_id);
    this.quotationForm.get('producttype').setValue(this.selectedRows[0].product_type?.name);
    if(this.selectedRows[0].product_type?.name == "Service" || this.selectedRows[0].product_type?.name == "IT Related Services"){
      this.servicecheck = true
    }
   
    // this.quotationForm.get('qty').setValue((this.selectedRows[0].qty).toFixed(2));
    const totalQty = this.selectedRows.reduce((sum, item) => sum + item.qty, 0);
    this.quotationForm.get('qty').setValue((totalQty));

    console.log("branchForm",this.branchForm);

    let code = this.selectedRows[0]?.product_id?.code
    this.getOtherAttributes(this.quotationForm.get('product').value);
    this.product_code = code;
    this.forQuotationDD();
    // this.getMasterQuotation(1);
    this.getSuppliersearch();

    // this.getQuotation(this.page);
    this.getproductType();
  }
    quotationMasterSearch: FormGroup;
        getMasterQuotation(id) {
          const formValues = this.quotationMasterSearch.value;
          // formValues.quotation_for_id = formValues.quotation_for_id ? formValues?.quotation_for_id?.id : "";
          // formValues.product_id = this.selectedRows[0].product_id.id || "";
          formValues.id = id;
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
            .quotationSearchMaster(filteredValues, this.page)
            .subscribe((res) => {
              this.masterQuotationList = res["data"];
              this.SpinnerService.hide();
            });
        }
        masterQuotationList: any = [];
      
  
  addSpecConfig(id: number, specification: string, configuration) {
    let specConfig = this.quotationForm.get('spec_config') as FormControl;
  
    // Get existing value and parse it
    let existingValue = specConfig.value ? specConfig.value.specification : "";
  
    // Convert to array, remove duplicates, and join as a string
    let specList = existingValue ? existingValue.split(", ") : [];
    let newEntry = `${specification} : ${configuration}`;
  
    if (!specList.includes(newEntry)) {
      specList.push(newEntry);
    }
  
    // Set the new comma-separated value with the correct ID
    specConfig.setValue({
      id: id, // Dynamically set ID
      specification: specList.join(", ")
    });
    // this.quotationForm.get("remarks").setValue(specList.join(", "))
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
    this.prposervice.quotationSearch(filteredValues).subscribe((res) => {
      this.QuotationList = res["data"][0];
      this.SpinnerService.hide();
    });
    // this.showCard = true;
    this.masterData = data;
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

  getproductType(){
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
  configMap: any
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
  selectedFile: File | null = null;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
    }
  }
  getQuotationFor(q){
    this.quotation_for_id = q.id;
    this.quotation_for_name = q.name;
  }
  quotation_for_id: any;
  quotation_for_name: any;
  quotationSubmit() {
    // let formValues = this.quotationForm.value;
    const formValues = this.quotationForm.value;
    // formValues.quotation_for_name =
    // this.quotationForm.value?.quotation_for_id?.name;
    formValues.quotation_for_id = this.quotation_for_id;
    formValues.quotation_for_name = this.quotation_for_name;
  
    formValues.supplier = this.selectedSuppliers;
    formValues.quotation_date = this.formatDate(formValues?.quotation_date)
    formValues.validity_start = this.formatDate(formValues?.validity_start)
    formValues.validity_end = this.formatDate(formValues?.validity_end)
    // producttype: this.Lists.find(item => String(item.name) === String(formValues.producttype)),
    formValues.producttype = this.Lists.find(item => String(item.name) === String(formValues.producttype))
    // formValues.supplier_id = this.selectedSuppliers.map(e => e.id);

  const payload = {
    ...formValues,
    spec_config: {
      id: formValues.spec_config.id, 
      specification: formValues.spec_config.specification, 
    }
  };
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

      formData.append("data", JSON.stringify(payload));
    
      if (this.selectedFile) {
        formData.append("file", this.selectedFile);
      }
      this.SpinnerService.show();
      this.prposervice.getQuotationSubmit(formData)
      .subscribe((res) => {
        this.SpinnerService.hide();

        if(res){
          let id = res?.id;
          // this.selectedSuppliers.forEach((e) => {
          //   this.quotationData(id, e);
          // })
          // formData.append("id", id);
          this.notification.showSuccess(res['message']);
          const modalTrigger = document.getElementById("assetmodal");
          modalTrigger?.click();
          this.getMasterQuotation(id);
          this.ngOnInit();
          this.showSummary = true;
        } else {
          this.notification.showInfo(res['description']);
        }
      })
    // } else {
    //   this.notification.showInfo("Please Fill All the Details!");
    //   return
    // }
  }
  showSummary: boolean = false;
  quotationData(id, sup) {
    // let formValues = this.quotationForm.value;
    const formValues = this.quotationForm.value;
    formValues.quotation_date = this.formatDate(formValues?.quotation_date);
    formValues.start_date = this.formatDate(formValues?.validity_start);
    formValues.end_date = this.formatDate(formValues?.validity_end);
    formValues.supplier = sup
    formValues.supplier_id = sup.id

    // formValues.quot_date = this.formatDate(formValues?.quot_date)
    // formValues.start_date = this.formatDate(formValues?.validity_start)
    // formValues.validity_end = this.formatDate(formValues?.validity_end)

    formValues.supplier_id = formValues.supplier
    ? formValues?.supplier?.id
    : "";
    formValues.quotation_id = id;
    formValues.tax = 1;
    formValues.mode = "mail"

    // delete formValues.quotation_for_id;
    // delete formValues.quotation_for_name;
    // delete formValues.start_date;
    // delete formValues.end_date;
    // delete formValues.

    // formValues.quotation_for_name = this.masterForm.value?.quotation_for_id?.name;
    // formValues.quotation_for_id = this.masterForm.value?.quotation_for_id?.id;
    // let currentDate = new Date().toJSON().slice(0, 10);
    // formValues.quotation_date = currentDate;

    const payload = {
      ...formValues,
      spec_config: {
        id: formValues.spec_config.id,
        specification: formValues.spec_config.specification,
      },
    };
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

    formData.append("data", JSON.stringify(payload));

    // if (this.selectedFile && this.selectedFile.length > 0) {
    //   this.selectedFile.forEach((file, index) => {
    //     formData.append("file", file); // Send multiple files
    //   });
    // }
    this.SpinnerService.show();
    this.prposervice.getQuotationSubmitData(formData).subscribe((res) => {
      this.SpinnerService.hide();

      if (res["status"] == "Success") {
        this.notification.showSuccess(res["message"]);
        const modalTrigger = document.getElementById("assetmodall");
        modalTrigger?.click();
        // this.getQdtl(this.masterData);
      } else {
        this.notification.showInfo(res["description"]);
      }
    });
    this.specList = [];

    this.quotationForm.reset();
    // } else {
    //   this.notification.showInfo("Please Fill All the Details!");
    //   return
    // }
  }
  quotationSum() {
    const formValues = this.quotationSearch.value;
    formValues.supplier_id = formValues.supplier_id
      ? formValues?.supplier_id?.id
      : "";
      // const formValues = this.quotationSearch.value;
    // formValues.quotation_no = this.masterData?.quotation_no;
  
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
    this.prposervice.quotationSearch(filteredValues).subscribe((res) => {
      this.QuotationList = res["data"][0];
      this.SpinnerService.hide();
    });
  }

  ViewQuotation(data){
    this.View = true;
    this.patchFormValues(data);
  }
  patchFormValues(data: any) {
    this.quotationForm.patchValue({
      supplier: data.supplier_name || "",
      supplier_id: data.supplier_id || "",
      quot_number: data.quotation_no || "",
      quotation_date: data.quotation_date || "",
      remarks: data.remarks || "",
      validity_start: data.validity_start_date || "",
      validity_end: data.end_date || "",
      producttype: data.producttype?.name || "",
      product: data.product?.name || "",
      make: data.make?.name || "",
      model: data.model?.name || "",
      unit_price: data.unitprice || "",
      specification: data.spec_config?.specification || "",
    });
  }
  
  View: boolean = false;
  resetQuotation() {
    this.quotationSearch.reset();
  }
  page: number = 1;
  QuotationList: any = [];
  getQuotation(page) {
    const formValues = this.quotationSearch.value;
    formValues.supplier_code = formValues.supplier_code ? formValues?.supplier_code?.code : "";
    formValues.product_name = formValues.product_name ? formValues?.product_name?.name : "";

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
    this.prposervice.quotationSearch(filteredValues).subscribe((res) => {
      this.QuotationList = res["data"];
      this.SpinnerService.hide();
    });
  }
  formatDate(dateString: string): string | null {
    return this.datepipe.transform(dateString, 'yyyy-MM-dd');
  }
  addQuotation: boolean = false;
  public displayFnproduct(prod): string | undefined {
    return prod ? prod.name : undefined;
  }
  public displayFnproductt(prod): string | undefined {
    return prod ? prod.name : undefined;
  }
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
    if (id == 1 && (this.product_type == undefined || this.product_type == null || this.product_type == "")) {
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
  autocompleteproductScrollP() {
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
  has_nextitem = true;
  has_previousitem = true;
  currentpageitem = 1;
  getitemFK() {
    // this.SpinnerService.show();
    // this.MAKE = true;
    // console.log("data", this.MAKE);
    let product = this.quotationForm.value.product.id;
    // let commodity = this.quotationForm.value.commodity.id;
    // let dts = this.quotationForm.value.dts;
    // let supplier = this.quotationForm.value.supplier.id;
    this.SpinnerService.show();
    if (
      // supplier == undefined ||
      product == undefined || this.product_code == ""
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
  getpproduct(id) {
    this.getproductFK(id);
  
    this.setupValueChanges(this.quotationForm, "product");
    this.setupValueChanges(this.quotationSearch, "product_name"); 
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
          this.prposervice
            .getproductfn("", this.product_type, value, 1)
            .pipe(
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
  getConf(spec) {
    // this.product_code = product?.code;

    this.prposervice.getConf(1, spec, this.product_code).subscribe((res) => {
      // this.attrList = res;
      // this.itemList = res?.make;
      // this.modelList = res?.model;
      this.specsList = res["data"];
      // this.configList = res?.specification?.configuration;
    });
  }
  getOtherAttributes(product) {
    this.product_code = product?.code;

    this.prposervice.getOtherAttributes(product?.code, 1).subscribe((res) => {
      // this.attrList = res;
      // this.itemList = res?.make;
      // this.modelList = res?.model;
      this.showCard = true;
      this.specList = res["data"];
    
      // this.specDict = this.specList
      // this.configList = res?.specification?.configuration;
    });
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
  public displayFnsupplier(supplier : branchlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }
  public displayFnsupp(supplier : branchlistss): string | undefined {
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
  getSuppliersearch() {
    this.getSupplier();
    // this.setupValueChangesSupplier(this.quotationSearch, "supplier_id");
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
  public displayFnuom(uomtype?: any): string | undefined {
    if (typeof uomtype === "string") {
      return uomtype;
    }
    return uomtype ? uomtype?.name : undefined;
  }
  uomlist: any = [];
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
  public displayFnQuot(qf: qfList): string | undefined {
    return qf ? qf.name : undefined;
  }
  currentpagerfor: number = 1;
  has_nextrfor = true;
  has_previousrfor = true;
  @ViewChild("quotfor") matrforAutocomplete: MatAutocomplete;
  @ViewChild("qforInput") rforInput: any;
  autocompleterforScroll() {
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
  // quotationMasterSearch: FormGroup;
  //      getMasterQuotation(page) {
  //        const formValues = this.quotationMasterSearch.value;
  //        formValues.quotation_for_id = formValues.quotation_for_id ? formValues?.quotation_for_id?.id : "";
  //        formValues.product_id = formValues.product_id ? formValues?.product_id?.id : "";
     
  //        // Create a new object only containing keys that have a truthy value
  //        const filteredValues = Object.keys(formValues)
  //          .filter(
  //            (key) =>
  //              formValues[key] !== null &&
  //              formValues[key] !== undefined &&
  //              formValues[key] !== ""
  //          )
  //          .reduce((acc, key) => {
  //            acc[key] = formValues[key];
  //            return acc;
  //          }, {});
     
  //        this.spinnerservice.show();
  //        this.prposervice
  //          .quotationSearchMaster(filteredValues, page)
  //          .subscribe((res) => {
  //            this.masterQuotationList = res["data"];
  //            this.spinnerservice.hide();
  //          });
  //      }
  //      masterQuotationList: any = [];
  selectedSuppliers: any[] = []; // Store selected suppliers

  selectSupplier(event: MatAutocompleteSelectedEvent) {
    const supplier = event.option.value;
    if (!this.selectedSuppliers.some(s => s.id === supplier.id)) {
      this.selectedSuppliers.push(supplier);
    }
  }
  
  removeSupplier(supplier: any) {
    this.selectedSuppliers = this.selectedSuppliers.filter(s => s.id !== supplier.id);
  }
  
  preventEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    // this.getSuppliersearch();

  }
   // this.prForm.get('supplier').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     // console.log('inside tap')

    //   }),

    //   switchMap(value => this.prposervice.getsupplierPDependencyFKdd(this.prForm.value.product.id,this.prForm.value.dts,value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.supplierList = datas;

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

 omit_special_num(event: KeyboardEvent) {
  
  const k = event.which || event.keyCode;

  // allow digits (48–57), dot (46 or 190), backspace (8), delete (46), arrows (37–40), tab (9)
  if (
    (k >= 48 && k <= 57) || // 0-9
    k === 46 ||             // dot / delete
    k === 190 ||            // dot on numpad / main keyboard
    k === 8  ||             // backspace
    (k >= 37 && k <= 40) || // arrows
    k === 9                 // tab
  ) {
    return true;
  }

  return false;
}


// onAmountInput(event: any, section: FormGroup,controlName: string) {
//   const input = event.target.value;
//   const rawValue = input ? input.toString().replace(/,/g, '') : '';
//   section.get(controlName)?.setValue(rawValue, { emitEvent: false });
// }


onAmountInput(event: any, section: FormGroup, controlName: string) {
  const inputEl = event.target as HTMLInputElement;
  let rawValue = inputEl.value ? inputEl.value.replace(/,/g, '') : '';

  let num = Number(rawValue);

  if (rawValue.endsWith('.')) {
    section.get(controlName)?.setValue(rawValue, { emitEvent: false });
    return; // don't format yet
  }
  if (!isNaN(num)) {
    // store rounded number
    num = Math.round(num * 100) / 100;

    // patch numeric value
    section.get(controlName)?.setValue(num, { emitEvent: false });

    // show commas while typing, but don’t force .00
    inputEl.value = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(num);
  } else {
    section.get(controlName)?.setValue(null, { emitEvent: false });
  }
}
onAmountBlur(section: FormGroup, controlName: string, event: any) {
  const inputEl = event.target as HTMLInputElement;
  const value = section.get(controlName)?.value;

  if (value === null || value === undefined || value === '') return;

  const num = Number(value);
  if (!isNaN(num)) {
    // ✅ force 2 decimals with commas
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);

    // update form control with numeric value
    section.get(controlName)?.setValue(num, { emitEvent: false });

    // update input box for display
    inputEl.value = formatted;
  }
}
}



