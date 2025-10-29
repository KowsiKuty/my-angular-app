import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { RmuApiServiceService } from "../rmu-api-service.service";
import { NotificationService } from "src/app/service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from "src/app/service/error-handling-service.service";

export interface icompanyList {
  id: string;
  name: string;
}

@Component({
  selector: "app-uploaddocument",
  templateUrl: "./uploaddocument.component.html",
  styleUrls: ["./uploaddocument.component.scss"],
})
export class UploaddocumentComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  //product
  @ViewChild("Products_sub") Products_sub: any;
  @ViewChild("product_auto_sub") product_auto_sub: MatAutocomplete;
  @ViewChild('mand_Type')mand_Type:MatAutocomplete;
  @ViewChild('Status_Type')Status_Type:MatAutocomplete;
  @Output() Onback = new EventEmitter<any>();
  @Input() InputData: any;
  prodct_search_subloading: boolean;
  product_master_sub_list: any;
  hassub_next: boolean;
  currentsub_page: number;
  hassub_previous: any;
  status_lists: any;
  SubmitArray = [];
  SummaryScreen = false;
  MainAddScreen = true;
  FileUploadPagination = {
    has_prev: false,
    has_next: false,
    index: 1,
  };
  SearchSummary = [];
  BoolArray = [
    {
      id: true,
      name: "Yes",
    },
    {
      id: false,
      name: "No",
    },
  ];
  product_upload_tepmlate: any;
  tableshow: boolean = true;
  summary_datas: any;
  form_array_data: boolean;
  Submit_btn: boolean;

  constructor(
    private fb: FormBuilder,
    private rmuservice: RmuApiServiceService,
    private notificationservice: NotificationService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService
  ) {}
  sub_product_form: FormGroup;

  ngOnInit(): void {
    this.sub_product_form = this.fb.group({
      product: [""],
      sub_product_arry: this.fb.array([]),
    });
    this.sub_product_form.patchValue({
      product: this.InputData,
    });
    console.log("this.in", this.InputData);

    this.rmuservice
      .product_template_created_data(this.InputData?.id,'')
      .subscribe((data) => {
        this.product_upload_tepmlate = data["data"];
        console.log("this", this.product_upload_tepmlate);        
        this.product_upload_tepmlate = this.product_upload_tepmlate.map((item) => {
          const manddd = {
            id: item.mand,
            name: item.mand ? "Yes" : "No",
          };
          return {
            ...item,
            mand: manddd, 
          };
        });
        this.product_upload_tepmlate =  this.product_upload_tepmlate.map((item) => {
          return {
            ...item,
            disabled: item.mand.id === true,
          };
        });
        this.patchResponseData(this.product_upload_tepmlate);
      });
    this.summary_data();
  }

  product_data(value) {
    this.newEmployee("");
    this.product_upload_tepmlate = "";
    const formArray = this.sub_product_form.get(
      "sub_product_arry"
    ) as FormArray;
    formArray.controls.forEach((control) => {
      control.reset();
    });
    for (let i = formArray.length - 1; i >= 0; i--) {
      formArray.removeAt(i);
    }

    if (value === "") {
      value = this.sub_product_form.value?.product;
    }
    this.rmuservice.product_template_created_data(value?.id,'').subscribe(
      (data) => {
        this.product_upload_tepmlate = data["data"];
        console.log("this", this.product_upload_tepmlate);
        this.patchResponseData(this.product_upload_tepmlate);
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
  }

  sub_product_arry(): FormArray {
    return this.sub_product_form.get("sub_product_arry") as FormArray;
  }

  patchResponseData(data: any[]): void {
    data.forEach(
      (item) => {
        this.sub_product_arry().push(this.newEmployee(item));
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
  }

  addEmployee() {
    if (this.tableshow === true) {
      this.tableshow = false;
      this.form_array_data = true;
      this.product_data("");
    } else {
      this.form_array_data = true;
      // if( this.product_upload_tepmlate.length!=0){
      // this.product_data('')
      // }
      this.sub_product_arry().push(this.newEmployee());
    }

    this.Submit_btn = true;
  }
  // newEmployee(): FormGroup {
  //   return this.fb.group({
  //     field_type: '',
  //     Feild: '',
  //     mand:false
  //   });
  // }

  newEmployee(item?: any): FormGroup {
    let manddd = {
      id: item?.mand === true,
      name: item?.mand === true ? "Yes" : "No",
    };
    return this.fb.group({
      field_type: item?.field_type || "",
      name: item?.name || "",
      mand: manddd || false,
      id: item?.id,
    });
  }
  
  removeEmployee(index: number, data) {
    this.template_delete(data, index);
  }
  onSubmit() {
    console.log(this.sub_product_form.value.sub_product_arry);
    console.log("length", this.sub_product_form);
  }

  product_master_sub(value) {
    this.prodct_search_subloading = true;
    this.rmuservice.product_master_summary(value, "", 1).subscribe(
      (data) => {
        this.prodct_search_subloading = false;
        this.product_master_sub_list = data["data"];
        console.log("this", this.product_master_sub_list);
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
  }

  product_master_sub_Scroll() {
    setTimeout(() => {
      if (
        this.product_auto_sub &&
        this.autocompleteTrigger &&
        this.product_auto_sub.panel
      ) {
        fromEvent(this.product_auto_sub.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.product_auto_sub.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.product_auto_sub.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.product_auto_sub.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.product_auto_sub.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hassub_next === true) {
                this.rmuservice
                  .product_master_summary(
                    this.Products_sub.nativeElement.value,
                    "",
                    this.currentsub_page + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.product_master_sub_list =
                      this.product_master_sub_list.concat(datas);
                    if (this.product_master_sub_list.length >= 0) {
                      this.hassub_next = datapagination.has_next;
                      this.hassub_previous = datapagination.has_previous;
                      this.currentsub_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public product_sub_display(vendor_name?: icompanyList): string | undefined {
    return vendor_name ? vendor_name.name : undefined;
  }

  ///feild dd

  public Status_display(status?: icompanyList): string | undefined {
    return status ? status.name : undefined;
  }

///mand
  public mand_display(mand?: icompanyList): string | undefined {
    return mand ? mand.name : undefined;
  }
  status_dd_arch() {
    this.status_lists = [
      { id: 1, name: "Char Field" },
      { id: 2, name: "Int Field" },
      { id: 3, name: "Date Field" },
      { id: 4, name: "Date time Field" },
      { id: 5, name: "Decimal Field" },
    ];
  }
  SubmitData() {
    if (!this.sub_product_form.get("product").value) {
      this.notificationservice.showError("Please Select Product");
      return false;
    }
    console.log(this.sub_product_form.get("sub_product_arry").value);
    for (let i of this.sub_product_form.get("sub_product_arry").value) {
      let params = {
        name: i?.name,
        type: i?.field_type?.id,
        mand: i?.mand?.id ?? "",
        id: i?.id ?? "",
        product_id: this.sub_product_form.get("product").value?.id,
      };
      this.SubmitArray.push(params);
      if (!i?.name || !i?.field_type) {
        this.notificationservice.showError("Please Enter All Fields");
        this.SubmitArray = [];
        return false;
      }
    }
    //   let mergedArray = [...this.product_upload_tepmlate, ...this.SubmitArray];
    //   let nameCount = mergedArray.reduce((acc, item) => {
    //     acc[item.name] = (acc[item.name] || 0) + 1;
    //     return acc;
    // }, {});

    // let uniqueArray = mergedArray.filter(item => nameCount[item.name] === 1);
    // if(uniqueArray.length !=0){
    this.SpinnerService.show();
    this.rmuservice.SubmitUpload(this.SubmitArray).subscribe(
      (result) => {
        this.SpinnerService.hide();
        this.SubmitArray = [];
        this.product_upload_tepmlate = [];
        if (result?.message) {
          this.notificationservice.showSuccess(result?.message);
          this.Formarray.clear();
          // this.sub_product_form.reset();
          this.tableshow = true;
          this.form_array_data = false;
          this.summary_data();
        } else if (result?.description) {
          this.notificationservice.showError(result?.description);
          this.tableshow = false;
          this.form_array_data = true;
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
    // }else{
    //   this.notificationservice.showError("Not Allowed For Dublicate Records")
    //   return false
    // }
  }
  get Formarray() {
    return this.sub_product_form.get("sub_product_arry") as FormArray;
  }
  BackToSummary() {
    this.Onback.emit();
  }

  ///activedata
  activedata(sum) {
    this.SpinnerService.show();
    this.rmuservice.template_status_change(sum).subscribe(
      (data) => {
        this.SpinnerService.hide();
        if (data?.status) {
          this.notificationservice.showSuccess(data?.message);
          this.summary_data();
        } else if (data?.description) {
          this.notificationservice.showError(data?.description);
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
  }

  ///summary

  summary_data(page=1) {
    this.tableshow = true;
    this.form_array_data = false;
    this.Submit_btn = false;
    let param = this.sub_product_form?.value?.product?.id;
    this.SpinnerService.show();
    this.rmuservice.product_template_created_data(param,page).subscribe(
      (data) => {
        this.SpinnerService.hide();
        this.summary_datas = data["data"];
        this.FileUploadPagination={
          has_prev:data['pagination']?.has_previous,
          has_next:data['pagination']?.has_next,
          index:data['pagination']?.index
        }
        console.log("summary_datas", this.summary_datas);
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
      }
    );
  }

  PreviousSearch(){
    this.FileUploadPagination.index=this.FileUploadPagination.index-1
    this.summary_data(this.FileUploadPagination.index)

  }
  NextSearch(){
    this.FileUploadPagination.index=this.FileUploadPagination.index+1
    this.summary_data(this.FileUploadPagination.index)
  }

  template_delete(sum, index) {
    let params = sum?.value;
    if (sum?.value?.id != null) {
      this.rmuservice.template_delete(params).subscribe(
        (data) => {
          this.SpinnerService.hide();
          if (data?.status) {
            this.notificationservice.showSuccess(data?.message);
            this.sub_product_arry().removeAt(index);
          } else if (data?.description) {
            this.notificationservice.showError(data?.description);
          }
        },
        (error) => {
          this.SpinnerService.hide();
          this.errorHandler.handleError(error);
        }
      );
    } else {
      this.sub_product_arry().removeAt(index);
    }
  }
  get hasYesSelected(): boolean {
  return this.sub_product_arry().controls.some(ctrl => ctrl.get('mand')?.value?.name === 'Yes');
}

}
