import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';



export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface datesvalue {
  value: any;
}

@Component({
  selector: 'app-prpo-par-tabs',
  templateUrl: './prpo-par-tabs.component.html',
  styleUrls: ['./prpo-par-tabs.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PrpoParTabsComponent implements OnInit {
  prpoPARList: any
  urls: string;
  urlparmaker;
  urlparapprover

  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isParTab: boolean
  isParmaker: boolean;
  isParmakerTab: boolean;

  isParapprover: boolean
  isParapproverTab: boolean

  isParcreateTab: boolean
  isParEditTab: boolean
  isParContigencyTab: boolean
  isParStatusTab: boolean
  isParApproverScreenTab: boolean
  FinancialYearList:any
  isexportButton:boolean=false
  statuslist: any;
  bpa_summary=1
  constructor(private fb: FormBuilder,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService,
    private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,private toastr:ToastrService,
    private notification :NotificationService, private router: Router,
    ) {

  }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "BPA") {
        this.prpoPARList = subModule;
        this.isParmaker = subModule[0].name;
        console.log("prpoParmenuList", this.prpoPARList)
      }
    })
    this.parsummarySearchForm = this.fb.group({
      no: [''],
      desc:[''],
      date: [""],
      amount: [''],
      year: [''],
      isbudgeted: null,
      par_status:['']
    })

    //////////////////////////////////////
    this.approvalForm = this.fb.group({
      id: '',
      remarks: ''
    })
    this.rejectForm = this.fb.group({
      id: '',
      remarks: ''
    })
    this.parAppsummarySearchForm = this.fb.group({
      no: [''],
      desc: [''],
      date: [""],
      amount: [''],
      year: [''],
      isbudgeted: null,
      par_status:['']
    })

  // Listen to changes in "amount"
  this.parsummarySearchForm.get('amount')?.valueChanges.subscribe(val => {
    if (val !== null && val !== undefined && val !== '') {
      // Always keep numeric value
      const numericValue = val.toString().replace(/,/g, '');
      if (!isNaN(numericValue)) {
        const numberValue = Number(numericValue);

        // Format with commas for display
        const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

        // Patch formatted string into the input field
        this.parsummarySearchForm.get('amount')?.setValue(formatted, { emitEvent: false });
      }
    }
  });

    this.parAppsummarySearchForm.get('amount')?.valueChanges.subscribe(val => {
    if (val !== null && val !== undefined && val !== '') {
      // Always keep numeric value
      const numericValue = val.toString().replace(/,/g, '');
      if (!isNaN(numericValue)) {
        const numberValue = Number(numericValue);

        // Format with commas for display
        const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

        // Patch formatted string into the input field
        this.parAppsummarySearchForm.get('amount')?.setValue(formatted, { emitEvent: false });
      }
    }
  });
  


  }
  subModuleData(data) {
    this.tabchange_reset()
    this.urls = data.url;
    this.urlparmaker = "/bpamaker";
    this.urlparapprover = "/bpaapprover";

    this.isParmaker = this.urlparmaker === this.urls ? true : false;
    this.isParapprover = this.urlparapprover === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isParmaker) {

      this.isParmakerTab = true
      this.isParapproverTab = false
      this.ismakerCheckerButton = true;

      this.isParcreateTab = false
      this.isParEditTab = false;
      this.isParContigencyTab = false;
      this.isParStatusTab = false;
      this.isParApproverScreenTab = false;
      this.parsummarySearch();
      this.getbpastatus()
      this.getParyear()
    } else if (this.isParapprover) {

      this.isParmakerTab = false
      this.isParapproverTab = true
      this.ismakerCheckerButton = false;

      this.isParcreateTab = false
      this.isParEditTab = false;
      this.isParContigencyTab = false;
      this.isParStatusTab = false;
      this.isParApproverScreenTab = false;
      this.parAppsummarySearch();
      this.getbpastatus()
      this.getParyear()
    }

  }
  addForm() {
    if (this.addFormBtn === "PAR Maker") {
      this.isParcreateTab = true;
      this.isParmakerTab = false;
      this.ismakerCheckerButton = false;
    }
    
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Par MAKER
  parsummarySearchForm: FormGroup;
  presentpagepar: number = 1;
  has_nextpar = true;
  has_previouspar = true;
  pageSize = 10;
  parList: any;
  isbudgeted: number
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]

  total_count: any;
  getpar(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpar(pageNumber, pageSize)
      .subscribe((results) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        let datapagination = results["pagination"];
        this.total_count = results?.total_count;
        this.parList = datas;
        if (this.parList.length > 0) {
          this.has_nextpar = datapagination.has_next;
          this.has_previouspar = datapagination.has_previous;
          this.presentpagepar = datapagination.index;
          this.isexportButton=false
        }if(this.parList.length == 0){
          this.isexportButton=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpar() {
    if (this.has_nextpar === true) {
      this.parsummarySearch(this.presentpagepar + 1, 10)
    }
  }

  previousClickpar() {
    if (this.has_previouspar === true) {
      this.parsummarySearch(this.presentpagepar - 1, 10)
    }
  }

  resetpar() {
    this.parsummarySearchForm.reset();
    this.parsummarySearch();
    return false
  }
  parsummarySearch(pageNumber=1,pageSize = 10) {

    let date = this.parsummarySearchForm.value.date
    let dates = this.datePipe.transform(date, 'yyyy-MM-dd');

    this.parsummarySearchForm.value.date = dates;

     // 🔹 Remove commas from amount before sending

    let searchdel = this.parsummarySearchForm.value;

      if (searchdel.amount) {
    searchdel.amount = searchdel.amount.toString().replace(/,/g, '');
  }


    for (let i in searchdel) {
      if (searchdel[i] === null || searchdel[i] === "" || searchdel[i] === undefined) {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getparsummarySearch(searchdel,this.bpa_summary,pageNumber,pageSize)
      .subscribe(result => {
        if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description);
          return false;
        }
        this.SpinnerService.hide();
        this.parList = result['data']
        this.total_count = result?.total_count
        let datapagination = result["pagination"];
        if (this.parList.length > 0) {
          this.has_nextpar = datapagination.has_next;
          this.has_previouspar = datapagination.has_previous;
          this.presentpagepar = datapagination.index;
          this.isexportButton=false
        }if(this.parList.length == 0){
          this.isexportButton=true
        }
        // if (searchdel.no === '' && searchdel.desc === '' && searchdel.date === '' && searchdel.amount === '' && searchdel.year === '' && searchdel.isbudgeted === null) {
        //   this.getpar();
        // }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  makerexceldownload(){

    let bpano:any
    let bpadesc:any
    let bpadate:any
    let bpaamount:any
    let bpayear:any
    let par_status:any

    let data = this.parsummarySearchForm.value
    if(data.no == null || data.no == undefined || data.no == ""){
      bpano = ""
    }else{
      bpano = data.no
    }

    if(data.desc == null || data.desc == undefined || data.desc == ""){
      bpadesc = ""
    }else{
      bpadesc = data.desc
    }

    if(data.date == null || data.date == undefined || data.date == ""){
      bpadate = ""
    }else{
      bpadate = this.datePipe.transform(data.date, 'yyyy-MM-dd');
    }

    if(data.amount == null || data.amount == undefined || data.amount == ""){
      bpaamount = ""
    }else{
      bpaamount = data.amount
    }

    if(data.year == null || data.year == undefined  || data.year == ""){
      bpayear = ""
    }else{
      bpayear = data.year
    }
    if(data.par_status == null || data.par_status == undefined || data.par_status == ""){
      par_status = ""
    }else{
      par_status = data.par_status
    }
    this.SpinnerService.show();
    this.dataService.getPARMakerExcel(bpano,bpadesc,bpadate, bpaamount,bpayear,par_status)
    .subscribe((data) => {
      if (data.code) {
          this.SpinnerService.hide();
          this.notification.showError(data.description);
          return false;
        }
      this.SpinnerService.hide()
      if(data['size']<=75){
        this.toastr.warning("",'Records Not Found',{timeOut:1500})
        return false;
      }else{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'BPA Maker Report'+".xlsx";
      link.click();
      }
    },error=>{
      this.SpinnerService.hide();
    })

  }

  checkerexceldownload(){

    let bpano:any
    let bpadesc:any
    let bpadate:any
    let bpaamount:any
    let bpayear:any
    let par_status:any
    let data = this.parAppsummarySearchForm.value
    if(data.no == null || data.no == undefined || data.no == ""){
      bpano = ""
    }else{
      bpano = data.no
    }

    if(data.desc == null || data.desc == undefined  || data.desc == ""){
      bpadesc = ""
    }else{
      bpadesc = data.desc
    }

    if(data.date == null || data.date == undefined || data.date == ""){
      bpadate = ""
    }else{
      bpadate = this.datePipe.transform(data.date, 'yyyy-MM-dd');
    }

    if(data.amount == null || data.amount == undefined || data.amount == "") {
      bpaamount = ""
    }else{
      bpaamount = data.amount
    }

    if(data.year == null || data.year == undefined || data.year == ""){
      bpayear = ""
    }else{
      bpayear = data.year
    }
    if(data.par_status == null || data.par_status == undefined || data.par_status == ""){
      par_status = ""
    }else{
      par_status = data.par_status
    }
   
    this.SpinnerService.show();
    this.dataService.getPARCheckerExcel(bpano,bpadesc,bpadate,bpaamount,bpayear,par_status)
    .subscribe((data) => {
      if (data.code) {
        this.SpinnerService.hide();
        this.notification.showError(data.description);
        return false;
      }
      this.SpinnerService.hide()
      if(data['size']<=75){
        this.toastr.warning("",'Records Not Found',{timeOut:1500})
        return false;
      }else{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'BPA Checker Report'+".xlsx";
      link.click();
      }
    },error=>{
      this.SpinnerService.hide();
    })

  }


  editparmake(data) {
    this.prposhareService.ParParentShare.next(data)
    this.ismakerCheckerButton = false;
    this.isParmakerTab = false;
    this.isParcreateTab = false
    this.isParEditTab = false;
    this.isParContigencyTab = true;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
    return data;
  }

  parcreateedit(data) {
    this.prposhareService.ParParentShare.next(data)
    this.ismakerCheckerButton = false;
    this.isParmakerTab = false;
    this.isParEditTab = true;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParcreateTab = false
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
    return data;
  }

  StatusScreen(data) {
    this.prposhareService.ParStatusShare.next(data)
    this.ismakerCheckerButton = false;
    this.isParmakerTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = true;
    this.isParcreateTab = false
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
    return data;
  }
  addpar() {
    this.ismakerCheckerButton = false;
    this.isParmakerTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParcreateTab = true;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParCreateSubmit() {
    this.getpar();
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParcreateTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParCreateCancel() {
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParcreateTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParEditSubmit() {
    this.getpar();
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParEditCancel() {
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParContigencySubmit() {
    this.getpar();
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParContigencyCancel() {
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ParStatusCancel() {
    this.ismakerCheckerButton = true;
    this.isParmakerTab = true;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = false
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Approver summary

  parAppsummarySearchForm: FormGroup;
  presentpageparApp: number = 1;
  has_nextparApp = true;
  has_previousparApp = true;
  pageSizeApp = 10;
  parAppList: any;
  approvalForm: FormGroup
  rejectForm: FormGroup
  total_countt : any
  isBPAApproverexportButton:boolean
  getparchecker(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getparchecker(pageNumber, pageSize)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.parAppList = datas;
        this.total_countt = results?.total_count;
        if (this.parAppList.length > 0) {
          this.has_nextparApp = datapagination.has_next;
          this.has_previousparApp = datapagination.has_previous;
          this.presentpageparApp = datapagination.index;
          this.isBPAApproverexportButton=false
        }
        if(this.parAppList.length == 0){
          this.isBPAApproverexportButton=true

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickparApp() {
    if (this.has_nextparApp === true) {
      this.parAppsummarySearch(this.presentpageparApp + 1, 10)
    }
  }

  previousClickparApp() {
    if (this.has_previousparApp === true) {
      this.parAppsummarySearch(this.presentpageparApp - 1, 10)
    }
  }

  approveorreject(data) {
    this.prposhareService.ParcheckerShare.next(data)
    this.ismakerCheckerButton = false;
    this.isParmakerTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = true;
    this.isParapproverTab = false
    return data
  }


  resetparApp() {
    this.parAppsummarySearchForm.reset();
    this.parAppsummarySearch();

  }
  parAppsummarySearch(pageNumber=1,pageSize=10) {
    let date = this.parAppsummarySearchForm.value.date
    let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.parAppsummarySearchForm.value.date = dates;
    let searchdel = this.parAppsummarySearchForm.value;


      // 🔹 Remove commas from amount before sending


      if (searchdel.amount) {
    searchdel.amount = searchdel.amount.toString().replace(/,/g, '');
  }

    for (let i in searchdel) {
      if (searchdel[i] === null || searchdel[i] === "" || searchdel[i] === undefined) {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getparcheckerSearch(searchdel,this.bpa_summary,pageNumber,pageSize)
      .subscribe(result => {
        if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description);
          return false;
        }
        this.SpinnerService.hide();
        let datas=result['data']
        let datapagination = result["pagination"];
        this.parAppList = datas;
        this.total_countt = result?.total_count
        if (this.parAppList.length > 0) {
          this.has_nextparApp = datapagination.has_next;
          this.has_previousparApp = datapagination.has_previous;
          this.presentpageparApp = datapagination.index;
          this.isBPAApproverexportButton=false
        }
        if(this.parAppList.length == 0){
          this.isBPAApproverexportButton=true

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ParApproverCancel() {
    this.ismakerCheckerButton = true;
    this.isParmakerTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = true
  }


  ParApproverSubmit() {
    // this.getpar();
    this.parAppsummarySearch();
    this.ismakerCheckerButton = true;
    this.isParmakerTab = false;
    this.isParEditTab = false;
    this.isParContigencyTab = false;
    this.isParStatusTab = false;
    this.isParApproverScreenTab = false;
    this.isParapproverTab = true
  }


  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getParyear() {
    this.SpinnerService.show();
    this.dataService.getParyear()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.FinancialYearList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  getbpastatus(){
    this.dataService.getbpaStatus()
    .subscribe(result=>{
      this.statuslist = result['data']
      console.log("statuslist", this.statuslist)
    })
  }
tabchange_reset(){
  this.parsummarySearchForm.reset();
  this.parAppsummarySearchForm.reset();
}
isActiveTab(sub: any): boolean {
  // Check if the current tab is active
  return sub.url === this.urls; // Add your condition based on your logic
}

// formatAmount(event: any) {
//     let input = event.target.value;
//     const formatted = this.amountPipe.transform(input);
//     event.target.value = formatted;

//     // keep numeric in form control
//     this.parsummarySearchForm.get('amount')!.setValue(
//       Number(input.toString().replace(/,/g, '')),
//       { emitEvent: false }
//     );
//   }

// formatAmount(event: any) {
//   // Remove commas first
//   let rawValue = event.target.value.replace(/,/g, '');

//   // If valid number, format
//   if (rawValue && !isNaN(rawValue)) {
//     const numberValue = Number(rawValue);

//     // Format with commas
//     const formattedValue = new Intl.NumberFormat('en-US').format(numberValue);

//     // Show formatted value in the input box
//     event.target.value = formattedValue;

//     // Update FormControl with raw number (no commas)
//     this.parsummarySearchForm.get('amount')?.setValue(numberValue, { emitEvent: false });
//   } else {
//     this.parsummarySearchForm.get('amount')?.setValue(null, { emitEvent: false });
//   }
// }


}
