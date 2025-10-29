import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { AssetDetailsServiceService } from '../asset-details-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-asset-details-component',
  templateUrl: './asset-details-component.component.html',
  styleUrls: ['./asset-details-component.component.scss']
})
export class AssetDetailsComponentComponent implements OnInit {

  constructor(private service: AssetDetailsServiceService, private Spinnerservice: NgxSpinnerService, private notification: NotificationService, private datepipe: DatePipe) { }
  SearchForm = new FormGroup({
    SerialNo: new FormControl(''),
    AssetId: new FormControl(''),
    CCBSBranch: new FormControl(''),
    ProductType: new FormControl(''),
    ProductName: new FormControl(''),
    Vendor: new FormControl(''),
    PoNo: new FormControl(''),
    InvoiceNo: new FormControl(''),
    FromDate: new FormControl(''),
    ToDate: new FormControl(''),
  })
  selectedTypeQ: any = ''
  SummaryData = []
  SummaryPagination = {
    hasNext: false,
    hasPrev: false,
    index: 1
  }
  ngOnInit(): void {
    let payload = {
      "serial_no": '',
      "ccbs_branch": '',
      "product_type": '',
      "vendor": '',
      "po_no": '',
      "invoice_no": '',
      "from_date": '',
      "to_date": '',
      "ref_date": '',
      "asset_id": '',
      "product_name": ''
    }
    this.SummaryFunc(payload, this.SummaryPagination.index)
  }
  SummaryFunc(params, page) {
    this.Spinnerservice.show()
    this.service.AssetDetailSummary(params, page).subscribe(result => {
      this.Spinnerservice.hide()
      this.SummaryData = result['data']
      this.SummaryPagination = {
        hasNext: result?.pagination?.has_next,
        hasPrev: result?.pagination?.has_previous,
        index: result?.pagination?.index
      }
    },
      error => {
        this.Spinnerservice.hide()
      })
  }
  Search(page) {
    let form = this.SearchForm.value
    if (this.selectedTypeQ) {
      if (!form?.FromDate) {
        this.notification.showError('Please Select From Date')
        return
      }
      else if (!form?.ToDate) {
        this.notification.showError('Please Select To Date')
        return
      }
    }
    let payload = {
      "serial_no": form?.SerialNo ? form?.SerialNo : '',
      "ccbs_branch": form?.CCBSBranch ? form?.CCBSBranch : '',
      "product_type": form?.ProductType ? form?.ProductType : '',
      "vendor": form?.Vendor ? form?.Vendor : '',
      "po_no": form?.PoNo ? form?.PoNo : '',
      "invoice_no": form?.InvoiceNo ? form?.InvoiceNo : '',
      "from_date": form?.FromDate ? this.datepipe.transform(form?.FromDate, 'yyyy-MM-dd') : '',
      "to_date": form?.ToDate ? this.datepipe.transform(form?.ToDate, 'yyyy-MM-dd') : '',
      "ref_date": this.selectedTypeQ ? this.selectedTypeQ : '',
      "asset_id": form?.AssetId ? form?.AssetId : '',
      "product_name": form?.ProductName ? form?.ProductName : ''
    }
    this.SummaryFunc(payload, page)

  }
  DownloadFunc() {
    let form = this.SearchForm.value
    if (this.selectedTypeQ) {
      if (!form?.FromDate) {
        this.notification.showError('Please Select From Date')
        return
      }
      else if (!form?.ToDate) {
        this.notification.showError('Please Select To Date')
        return
      }
    }
    let payload = {
      "serial_no": form?.SerialNo ? form?.SerialNo : '',
      "ccbs_branch": form?.CCBSBranch ? form?.CCBSBranch : '',
      "product_type": form?.ProductType ? form?.ProductType : '',
      "vendor": form?.Vendor ? form?.Vendor : '',
      "po_no": form?.PoNo ? form?.PoNo : '',
      "invoice_no": form?.InvoiceNo ? form?.InvoiceNo : '',
      "from_date": form?.FromDate ? this.datepipe.transform(form?.FromDate, 'yyyy-MM-dd') : '',
      "to_date": form?.ToDate ? this.datepipe.transform(form?.ToDate, 'yyyy-MM-dd') : '',
      "ref_date": this.selectedTypeQ ? this.selectedTypeQ : '',
      "asset_id": form?.AssetId ? form?.AssetId : '',
      "product_name": form?.ProductName ? form?.ProductName : ''
    }
    this.Spinnerservice.show()
    this.service.AssetDetailDownload(payload).subscribe(res => {
      this.Spinnerservice.hide()
      if(res['type']=='application/json'){
        this.notification.showError(res?.description)
      }
      else{
        let binaryData = [];
        binaryData.push(res)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Asset Details Report'+".xlsx";
        link.click();
      }
    },
      error => {
        this.Spinnerservice.hide()
      })
  }
  ClearFunc() {
    this.SearchForm.reset()
    let payload = {
      "serial_no": '',
      "ccbs_branch": '',
      "product_type": '',
      "vendor": '',
      "po_no": '',
      "invoice_no": '',
      "from_date": '',
      "to_date": '',
      "ref_date": '',
      "asset_id": '',
      "product_name": ''
    }
    this.selectedTypeQ = ''
    this.SummaryPagination.index = 1
    this.SummaryFunc(payload, this.SummaryPagination.index)
  }

  price_Quot(event) {
    this.selectedTypeQ = event.value
  }
  PrevHead() {
    this.SummaryPagination.index = this.SummaryPagination.index - 1
    this.Search(this.SummaryPagination?.index)
  }
  NextHead() {
    this.SummaryPagination.index = this.SummaryPagination.index + 1
    this.Search(this.SummaryPagination?.index)
  }

}
