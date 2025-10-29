import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DrsService } from '../drs.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface drs {
  name: string;
  code: number;
  id: number;
  // reportmaster: string;
}




@Component({
  selector: 'app-currency-format',
  templateUrl: './currency-format.component.html',
  styleUrls: ['./currency-format.component.scss']
})
export class CurrencyFormatComponent implements OnInit {

  @ViewChild("statustype") statustype: MatAutocomplete;
  @ViewChild('Currency_sum_close') Currency_sum_close: ElementRef;


  Currencysummary: FormGroup;
  currency_summary_data: any;
  Status_Type = [{ name: "Active", id: "1" },
  { name: "In-Active", id: "0" },]
  name: string;
  CurrencyModal: FormGroup;
  Evalue: any;
  Avalue: any;
  currency_master_submit_btn: boolean;
  PARAMS: any;
  Modal_name: any;
  Modal_value: any;
  EditId: any;
  message: any;
  hasnext: any;
  hasprevious: any;
  presentpage: any;
  data_scdhele_found: boolean;
  cur_summary_name: any;
  currencydata: any;
  currentpage: number;
  has_previoustab: boolean;
  presentpagetab: number;
  has_nexttab: boolean;
  // Currency_view: boolean;
  DData: any;
  cur_summary_status: any;
  select_status: string;
  report_group_close: any;


  constructor(private fb: FormBuilder, private DrsService: DrsService, private Toastr: ToastrService, private spinnerservice: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {

    this.Currencysummary = this.fb.group({
      Summary_name: '',
      Statustypes: '',
    })
    this.CurrencyModal = this.fb.group({
      currency_modal_name: '',
      currency_modal_value: '',
    })
    this.Currency_search('');
  }
  public Currencytype_display(Statustypes?: drs): string | undefined {
    return Statustypes ? Statustypes.name : undefined;
  }

  Currency_search(data, pageNumber = 1) {
    let currencydata = data   
    let name = this.Currencysummary.value.Summary_name ? this.Currencysummary.value.Summary_name : "";
    let status = this.Currencysummary.value.Statustypes?.id ?? '';
    this.spinnerservice.show()
    this.DrsService.Currency_summary(name, pageNumber, status).subscribe((results: any) => {
      this.spinnerservice.hide()
      let data = results["data"];
      this.currency_summary_data = data;
      let datapagination = results["pagination"];
      if (this.currency_summary_data?.length > 0) {
        this.hasnext = datapagination.has_next;
        this.hasprevious = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_scdhele_found = true;
      }
      if (this.currency_summary_data?.length == 0) {
        this.hasnext = false;
        this.hasprevious = false;
        this.presentpage = 1;
        this.data_scdhele_found = false;
      }
    })
  }
  Currency_add(Add) {
    this.CurrencyModal.reset()
    this.Avalue = Add
    this.currency_master_submit_btn = true
    document.getElementById('exampleModalcurrency').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  currencyclose() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
  }
  Currency_clear() {
    this.Currencysummary.reset()
    this.Currency_search("")
  }
  Currency_edit(currency, edit) {
    this.currency_master_submit_btn = true
    this.Evalue = edit
    let id = currency.id
    this.EditId = id
    this.CurrencyModal.patchValue({
      "currency_modal_name": currency.name,
      "currency_modal_value": currency.value,
    })
  }
  Currency_delete(currency) {
    let status
    if (currency.status == 0) {
      status = 1
    } else {
      status = 0
    }
    let Currency_id = currency.id
    this.spinnerservice.show()
    this.DrsService.Currency_delete(Currency_id, status).subscribe((results: any) => {
      this.spinnerservice.hide()
      this.DData = results.message
      if (results.status == "success") {
        this.Toastr.success("Successfully Updated")
        this.Currency_search('')
        this.Avalue = ''
        this.Evalue = ''
      } else {
        this.Toastr.error('ERROR')
      }
    })
  }
  status_select_type(status) {
    let select_status = status.name
    if (select_status == 'Active') {
      console.log("select_status:", select_status)
    } else {
      console.log("select_status:", select_status)
    }
  }
  Status_check() {
  }
  currencycreatedata() {
    if (this.CurrencyModal.controls["currency_modal_name"].value == null || this.CurrencyModal.controls["currency_modal_name"].value == '') {
      this.Toastr.warning("Please Enter The Name")
      return false
    }
    if (this.CurrencyModal.controls["currency_modal_value"].value == null || this.CurrencyModal.controls["currency_modal_value"].value == '') {
      this.Toastr.warning("Please Enter The Value")
      return false
    }
    this.Modal_name = this.CurrencyModal.controls["currency_modal_name"].value
    this.Modal_value = this.CurrencyModal.controls["currency_modal_value"].value
    if (this.Avalue == 'Add') {
      this.PARAMS = {
        "name": this.Modal_name,
        "value": this.Modal_value,
      }
    }
    if (this.Evalue == 'edit') {
      this.PARAMS = {
        "name": this.Modal_name,
        "value": this.Modal_value,
        "id": this.EditId,
      }
    }

    this.spinnerservice.show()
    this.DrsService.Currency_create(this.PARAMS).subscribe((results: any) => {
      this.spinnerservice.hide()
      this.message = results.message
      if (results.message == "Successfully Created" || results.message == "Successfully Updated") {
        this.Toastr.success(results.message)
        this.Currency_search('')
        this.Currency_sum_close.nativeElement.click();
        this.Avalue = ''
        this.Evalue = ''
        this.currencyclose()

      }else{
        this.Toastr.error('Error')
        this.currencyclose()
      }
    })
  }
  previousClick() {
    if (this.hasprevious === true) {
      this.currentpage = this.presentpage - 1
      this.Currency_search(this.currencydata, this.presentpage - 1)
    }
  }
  nextClick() {
    if (this.hasnext === true) {
      this.currentpage = this.presentpage + 1
      this.Currency_search(this.currencydata, this.presentpage + 1)
    }
  }
}
