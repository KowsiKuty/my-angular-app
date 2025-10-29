import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CbdaserviceService } from "../cbdaservice.service";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { NotificationService } from "../../service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
export interface PriorityValue {
  id: string;
  name: string;
}
@Component({
  selector: "app-specialproduct-cbda",
  templateUrl: "./specialproduct-cbda.component.html",
  styleUrls: ["./specialproduct-cbda.component.scss"],
})
export class SpecialproductCbdaComponent implements OnInit {
  URL = environment.apiURL
  specialForm: FormGroup;
  showcreation: boolean = false;
  constructor(
    private fb: FormBuilder,
    private cbdaservice: CbdaserviceService,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe
  ) { }
  colList: any;
  SearchForm = new FormGroup({
    product: new FormControl(),
    glno: new FormControl()
  })
  uploadsearch = [
    {
      type: 'input',
      formvalue: 'product',
      label: 'Product'
    },
    {
      type: 'input',
      formvalue: 'glno',
      label: 'Gl No'
    },
    {
      type: 'date',
      formvalue: 'date',
      label: 'Date'
    },
  ]
  templatebutton = [
    { icon: "add", function: this.create.bind(this) }
  ]
  SummarynewtemplateData = [
    {
      'columnname': 'Type',
      'key': 'Type'
    },
    {
      'columnname': 'Product Code',
      'key': 'prod_code'
    },
    {
      'columnname': 'Product Description',
      'key': 'prod_desc',
    },
    {
      'columnname': 'GL',
      'key': 'gl_no'
    },
    {
      'columnname': 'Short Order	',
      'key': 'created_date'
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
    'url': this.URL + 'reportserv/get_spcprod_sumamry',
    'data': {}
  }
  ngOnInit(): void {
    this.specialForm = this.fb.group({
      type: [""],
      glno: [""],
      Particular: [""],
      shortorder: [""],
      productcode: [""],
      prod_disc: ['']
    });
  }
  fileuploadlist: any;
  searchincexc(event) {
    let params = {
      prod_code: event?.product,
      gl_no: event?.glno,
      date: event?.date ? this.datepipe.transform(event?.date, 'yyyy-MM-dd') : ''
    }
    this.SummaryApinewtempObjNew = {
      'method': 'post',
      'url': this.URL + 'reportserv/get_spcprod_sumamry',
      'data': params
    }
  }
  refreshincexc() { }
  productcodelist() {
  }
  back() {
    this.showcreation = false;
    this.specialForm.reset()
  }
  create() {
    this.showcreation = true;
  }
  submiTo() {
    if (!this.specialForm?.value?.type) {
      this.notification.showError('Please Enter Type')
    }
    else if (!this.specialForm?.value?.Particular) {
      this.notification.showError('Please Enter Particular')
    }
    else if (!this.specialForm?.value?.shortorder) {
      this.notification.showError('Please Enter Short Order')
    }
    else if (!this.specialForm?.value?.glno) {
      this.notification.showError('Please Enter GL No')
    }
    else if (!this.specialForm?.value?.productcode) {
      this.notification.showError('Please Enter Product Code')
    }
    else if (!this.specialForm?.value?.prod_disc) {
      this.notification.showError('Please Enter Product Description')
    }
    else {
      let valuesdict = {
        "data": [
          {
            "Type": this.specialForm?.value?.type ? this.specialForm?.value?.type : '',
            "prod": this.specialForm?.value?.productcode ? this.specialForm?.value?.productcode : '',
            "prod_desc": this.specialForm?.value?.prod_disc ? this.specialForm?.value?.prod_disc : '',
            "particulars": this.specialForm?.value?.Particular ? this.specialForm?.value?.Particular : '',
            "gl_no": this.specialForm?.value?.glno ? this.specialForm?.value?.glno : '',
            "sortorder": this.specialForm?.value?.shortorder ? this.specialForm?.value?.shortorder : '',
          }
        ]
      };
      this.spinner.show();
      this.cbdaservice.specialprodmaster(valuesdict).subscribe((result) => {
        this.spinner.hide();
        if (result.code != undefined) {
          this.notification.showError(result.description);
          this.spinner.hide();
        } else {
          console.log("Inserted", result);
          this.notification.showSuccess("Data inserted Successfully");
          this.specialForm.reset()
          this.spinner.hide();
          this.showcreation = false;
        }
      },
    error=>{
      this.spinner.hide();
    });
    }
  }
  public displayColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
}
