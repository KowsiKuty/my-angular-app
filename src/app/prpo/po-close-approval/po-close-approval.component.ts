import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'

@Component({
  selector: 'app-po-close-approval',
  templateUrl: './po-close-approval.component.html',
  styleUrls: ['./po-close-approval.component.scss']
})
export class PoCloseApprovalComponent implements OnInit {
  poclosecreate: FormGroup;
  pocloseremarks: FormGroup;
  poclosedataList: any
  approvalForm: FormGroup
  rejectForm: FormGroup
  approvedisable = false;
  rejectdisable = false;
  totalcount: any;
  totallcount: any;
  tottalcount: any;
  summary: boolean;
  totalcountt: any;
  hasnext=true;
  hasprevious=true;
  presentpg: number = 1;
  summ: boolean;
  summary1: boolean;
  hasnnext: boolean;
  haspprevious: boolean;
  hasnextt: boolean;
  haspreviouus: boolean;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      remarks: [''],
      id: ''
    })
    this.rejectForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })




    this.poclosecreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    this.getPoclose();
  }
  id: any
  approvedcheck: boolean = true
  totallineAmount: any = 0.00
  isApproved: boolean = true
  getPoclose(page=1) {
    // let data:any = this.prposhareService.PocloseapprovalShare.value
    let data: any = this.prposhareService.PocloseapprovalShare.value
    this.pocloseid = data.poheader.id
    console.log("pocloseappdata", data)
    let poclose_status = data?.poclose_status;
    if(poclose_status == 'REJECTED' || poclose_status == 'APPROVED'){
      this.approvalForm.disable();
      this.rejectForm.disable();
      this.isApproved = false;
    }
    // if(data.closedata[0].poclose_status=="APPROVED"){
    //   this.approvedcheck=false
    this.pocloseIDfortran = data.id
    // }
    console.log(" this.pocloseIDfortran = data.id", this.pocloseIDfortran)
    this.poclosecreate.patchValue({
      no: data.poheader.no,
      supplier_id: data.poheader.supplierbranch_id.name
    })

    let id = data.poheader.id
    this.SpinnerService.show();
    this.dataService.grnproduct(id,page)

      .subscribe(results => {
        this.SpinnerService.hide();
        let datapatch = results
        this.id = datapatch.id

        let datas = results["data"];
        this.totalcount = results.total_count;
        this.poclosedataList = datas
        let datapagination = results.pagination

        let dataamount = datas.map(amount => amount.totalamount)
        this.totallineAmount = dataamount.reduce((acc, current) => acc + current, 0);
        console.log("total amount data", dataamount)

        console.log(this.poclosedataList, "data poclose list")

        if(this.poclosedataList.length > 0){
          this.hasnextt = datapagination.has_next;
          this.haspreviouus = datapagination.has_previous;
          this.presentpg = datapagination.index;
          this.summary = true
        }
        if(this.poclosedataList.length == 0){
          this.hasnextt = datapagination.has_next;
          this.haspreviouus = datapagination.has_previous;
          this.presentpg = datapagination.index;
          this.summary = false
        }
        
        this.approvalForm.patchValue({
          id: data.id
        })
        this.rejectForm.patchValue({
          id: data.id
        })
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  salessweightnextClick() {
    if (this.hasnextt === true) {
      this.getPoclose(this.presentpg + 1)
    }
  }
  salessweightpreviousClick() {
    if (this.haspreviouus === true) {
      this.getPoclose(this.presentpg - 1)
    }
  }
 

  deliverylist: any
  pocloseid: any
  hasPreviousDelivery: boolean;
  hasNextDelivery: boolean;
  currentPageDelivery: number;
  delivery(data) {
    console.log("poidsssss", this.pocloseid, data)
    this.SpinnerService.show();
    this.dataService.product(this.pocloseid, data)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.deliverylist = datas
        let datapagination = results.pagination
        this.totalcountt = results.total_count;
        if(this.deliverylist.length > 0){
          this.hasNextDelivery = datapagination.has_next;
          this.hasPreviousDelivery = datapagination.has_previous
          this.currentPageDelivery = datapagination.index
          this.summ = true
        }
        if(this.deliverylist.length == 0){
          this.hasNextDelivery = datapagination.has_next;
          this.hasPreviousDelivery = datapagination.has_previous
          this.currentPageDelivery = datapagination.index
          this.summ = false
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



  }

  salesweightnexttClick() {
    if (this.hasNextDelivery === true) {
      this.delivery(this.currentPageDelivery + 1)
    }
  }
  salesweightprevioussClick() {
    if (this.hasPreviousDelivery === true) {
      this.delivery(this.currentPageDelivery - 1)
    }
  }


  approveClick() {
    // let datas:any = this.prposhareService.PocloseapprovalShare.value 
    this.approvedisable = true;
    const data = this.approvalForm.value;
    // data.id = this.id
    this.SpinnerService.show();
    this.dataService.getpocloseapprovaldata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          this.SpinnerService.hide();
          this.approvedisable = false;
          return false
        } else {

          this.notification.showSuccess("Successfully Approved!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  rejectClick() {
    this.rejectdisable = true;
    const data = this.rejectForm.value;
    // data.id = this.id
    this.SpinnerService.show();
    this.dataService.getpocloserejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.SpinnerService.hide();
          this.approvedisable = false;
          return false
        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Rejected!...")
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  onCancelClick() {
    this.onCancel.emit()
  }


  PocloseTranHistoryList: any
  pocloseIDfortran: any
  gettranhistory(data) {
    console.log("data for trans", data)
    let headerId = this.pocloseIDfortran
    console.log("headerId", headerId)
    let name = "poclose_tran"
    this.SpinnerService.show();
    this.dataService.getclosecanceltranhistory(headerId, name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results['pagination']
        this.SpinnerService.hide();
        console.log("getranhistory", datas);
        this.PocloseTranHistoryList = datas;
        this.totallcount = results["total_count"]
        if(this.PocloseTranHistoryList.length > 0){
          this.hasnext = datapagination.has_next;
          this.hasprevious = datapagination.has_previous;
          this.presentpg = datapagination.index
          this.summary1 = true
        }
        if(this.PocloseTranHistoryList.length == 0){
          this.hasnext = datapagination.has_next;
          this.hasprevious = datapagination.has_previous;
          this.presentpg = datapagination.index
          this.summary1 = false
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  salesweightnextClick() {
    if (this.hasnext === true) {
      this.gettranhistory(this.presentpg + 1)
    }
  }
  salesweightpreviousClick() {
    if (this.hasprevious === true) {
      this.gettranhistory(this.presentpg - 1)
    }
  }


  ProductNameForSelectedLine:any
  QtyForSelectedLine:any
  dataForSelectedLine(data1){
    console.log("ProductNameForSelectedLine", data1)
    this.ProductNameForSelectedLine = data1.product_name
    this.QtyForSelectedLine = data1.qty
  }

}
