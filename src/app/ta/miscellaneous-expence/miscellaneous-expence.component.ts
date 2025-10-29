import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
// import { join } from 'path';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-miscellaneous-expence',
  templateUrl: './miscellaneous-expence.component.html',
  styleUrls: ['./miscellaneous-expence.component.scss']
})
export class MiscellaneousExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  // @Output() expense_navigate_n=new EventEmitter<any>();
  @Output() expense_navigate_new=new EventEmitter<any>();
  miscellaneousexpence: FormGroup
  miscellaneous: any
  expenseid: any
  reasonlist: Array<any>
  centerlist: Array<any>
  exptype: any
  comm: any
  tourno: any
  reason: any;
  currentpage: number = 1;
  pagesize = 10;
  detailsframe: any;
  feild_disable: boolean = true
  shiftreason: any;
  center: any;
  eligibleamount: any;
  tourdatas: string;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  datas: any
  id: any;
  claimid: any;
  expenceid: string;
  approvedamount: any;
  miscellaneousform: FormGroup
  miscellaneoustableform: FormGroup
  p: any = 1;
  pageSize = 10;
  arrays: any;
  length: any;
  commenter: any
  expenseids: any
  isonbehalf: boolean = false;
  onbehalf_empName: any;
  tourreq_no:any;
  makercheck: any;
  maker: boolean = false;
  approverarray: any = []
  tourid: any

  applevel: any = 0;
  approver: boolean = false;
  report: any;
  enb_all_exbdetails:boolean=false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private router: Router, private SpinnerService: NgxSpinnerService, private activatedroute: ActivatedRoute,
    private shareservice: ShareService) { }
  ngOnInit(): void {

    let expense_edit = JSON.parse(localStorage.getItem("expense_edit"))
    console.log('expense__edit', expense_edit)
    // this.tourreq_no = expense_edit.requestno

    let expensetype = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    this.report = expensetype.report
    this.tourreq_no = expensetype.requestno

    console.log("expense__types", expensetype)

    // this.tourid = expense_edit['tourid']
    this.makercheck = 1

    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
    }
    else{
      this.enb_all_exbdetails=false;
    }


    // if (expensetype.onbehalfof) {
    //   this.isonbehalf = true;
    //   this.tourid = expensetype['id']
    //   this.onbehalf_empName = '(' + expensetype.employee_code + ') ' + expensetype.employee_name
    //   console.log("onbehalf_empName", this.onbehalf_empName)
    // } else {
    //   this.tourid = expensetype['id']
    //   this.isonbehalf = false;
    // }
    // if (expensetype.applevel == 2 || expensetype.applevel == 1) {
    //   this.isonbehalf = false;
    //   this.maker = true
    //   this.tourid = expensetype['tourid']
    // }

    if (expensetype.applevel) {
      this.applevel = expensetype.applevel
    }

    this.tourid = expensetype.tourid?expensetype.tourid:expensetype.id;
    if (expensetype.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensetype.employee_code + ') ' + expensetype.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (expensetype.applevel == 2 || expensetype.applevel == 1) {
      this.isonbehalf = false;
      this.tourid = expensetype.tourid?expensetype.tourid:expensetype.id;
      this.approver = true;
    }

    if (expensetype.claim_status_id == 2 || expensetype.claim_status_id == 3 || expensetype.claim_status_id == 4) {
      this.approver = true;
    }



    this.miscellaneousform = this.formBuilder.group({
      tourno: this.tourid,
      tourreq_no:this.tourreq_no,
      employeename: '(' + expensetype.employee_code + ') ' + expensetype.employee_name,
      designation: expensetype.empdesignation?expensetype.empdesignation:expensetype.designation,
      employeegrade: expensetype.empgrade?expensetype.empgrade: expensetype.emp_grade,
      tablerowdata: new FormArray([])



    })





    this.exptype = expensetype['expenseid']
    console.log("sf", this.exptype)
    this.comm = expensetype['requestercomment']
    console.log("cc", this.comm)
    this.datas = expensetype
    this.expenseid = this.datas['id']
    // this.miscellaneousform.get('tourno').setValue(this.tourid)
    console.log("datas", this.datas)
    this.reason = this.datas['reason']
    // if (this.reason == 'Transfer with family') {
    //   this.taservice.getexpreasonValue()
    //     .subscribe(result => {
    //       this.shiftreason = result[2].name
    //       console.log("Reason", this.reasonlist)
    //     })
    // }


    this.taservice.getexpreasonValueshifting()
      .subscribe(result => {
        this.reasonlist = result
        for (let i = 0; i < this.reasonlist.length; i++) {
          if (this.reasonlist[i].name == 'Shifting Expenses' && this.reason != 'Transfer with family') {
            this.reasonlist.splice(i, 1)
          }
          else {
            this.taservice.getexpreasonValue()
              .subscribe(result => {
                this.shiftreason = result
                console.log("Reason", this.shiftreason)
              })
          }
        }
        console.log("Reason", this.reasonlist)
      })


    this.tourdatas = expensetype;
    console.log("tddddd", this.tourdatas)
    this.employeename = this.tourdatas['employee_name']
    // this.miscellaneousform.get('employeename').setValue(this.employeename)

    this.employeegrade = this.tourdatas['empgrade']
    // this.miscellaneousform.get('employeegrade').setValue(this.employeegrade)

    this.employeedesignation = this.tourdatas['empdesignation']
    // this.miscellaneousform.get('designation').setValue(this.employeedesignation)

    let data = expense_edit;
    let datavalue = expensetype;
    console.log("data111", data)
    console.log("datavalue111", datavalue)
    this.expenceid = data['expenseid']
    this.commenter = data['requestercomment']
    this.expenseids = data['expenseid']
    if (datavalue['requestno'] != 0) {
      this.tourno = datavalue['requestno']
      console.log("id", this.tourno)
      this.existingdata(this.miscellaneousform.value.tourno)
      // this.taservice.getmisceditSummary(datas['id'])
      //   .subscribe((results: any[]) => {
      //     console.log("Tourmaker", results)
      //     let val = results['data']
      //     let varible = results['requestercomment']

      //     for (let i = 0; i < val.length; i++) {
      //       this.arrays = this.formBuilder.group({
      //         id: val[i]['id'],
      //         tourgid: val[i]['tourgid'],
      //         expense_id: val[i]['exp_id'],
      //         description: val[i]['description'],
      //         eligibleamount: val[i]['eligibleamount'],
      //         expreason: val[i]['expreason'],
      //         center: val[i]['center'],
      //         claimedamount: val[i]['claimedamount'],
      //         requestercomment: varible
      //       });
      //       const docu = this.miscellaneousform.get('tablerowdata') as FormArray;
      //       docu.push(this.arrays)
      //       console.log(this.arrays)
      //     }


      // this.miscellaneous = results;
      // this.approvedamount = results['approvedamount']
      // this.id = this.miscellaneous.id;
      // console.log("id", this.id)
      // this.claimid = this.miscellaneous.claimreqid;
      // console.log("claimid", this.claimid)
      // this.miscellaneous.tourid = this.tourno
      // });
    }
    this.centrecall()



  }
  // addSection() {
  //   this.miscellaneous.data.push({
  //     ids: this.miscellaneous.data.length + 1,
  //     requestercomment: this.comm,
  //     expense_id: 6,
  //     tourgid: this.expenseid,
  //     description: '',
  //     expreason: '',
  //     claimedamount: '',
  //     center: ''
  //   })
  // }
  // removeSection(i) {
  //   this.miscellaneous.data.splice(i, 1);
  // }

  centrecall() {
    this.taservice.getshiftCenter()
      .subscribe(result => {
        this.centerlist = result
        console.log("centerlist", this.centerlist)
      })
  }



  selectReason(e, ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let reason = e.value
    let myform = (this.miscellaneousform.get('tablerowdata') as FormArray).at(ind)
    myform.patchValue({
      center: 0
    })
    if (reason == 'shifting') {
      this.feild_disable = false
      this.taservice.getshiftCenter()
        .subscribe(result => {
          this.centerlist = result
          console.log("centerlist", this.centerlist)
        })
    }
    else {
      this.feild_disable = true
    }
  }
  center_check(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.miscellaneousform.value.tablerowdata.at(ind).expreason;
    if (myform != 'shifting') {
      return true
    }
    else {
      return false
    }

  }
  getPosts(e, i) {
    this.center = e
    console.log(this.center);
    this.detailsframe = {
      "tourgid": this.expenseid,
      "center": this.center,
      "expense_id": this.expenseids,
    };
    this.SpinnerService.show()
    this.taservice.getmisceligibleAmount(this.detailsframe)
      .subscribe(result => {
        this.SpinnerService.hide()
        let eligibleamount = result['Eligible_amount']
        console.log("eligibleamount", this.eligibleamount)
        let myform = (this.miscellaneousform.get('tablerowdata') as FormArray).at(i)
        myform.patchValue({
          eligibleamount: eligibleamount
        })
        // for (var i = 0; i < this.miscellaneousform.value.tablerowdata.length; i++) {
        //   this.miscellaneousform.value.tablerowdata[i]['eligibleamount'] = this.eligibleamount
      // }

      })

  }



  existingdata(datas) {
    this.SpinnerService.show()
    this.taservice.getmisceditSummary(datas, this.report)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        console.log("Tourmaker", results)
        let val = results['data']
        let varible = results['requestercomment']

        for (let i = 0; i < val.length; i++) {
          this.arrays = this.formBuilder.group({
            id: val[i]['id'],
            tourgid: val[i]['tourgid'],
            expense_id: val[i]['exp_id'],
            description: val[i]['description'],
            eligibleamount: val[i]['eligibleamount'],
            expreason: val[i]['expreason']['value'],
            center: val[i]['center']['value'],
            claimedamount: val[i]['claimedamount'],
            requestercomment: varible,
            approvedamount: val[i]['approvedamount'],
            // gstno:datas[i]['gstno']?datas[i]['gstno']:"",
            // invoiceno:datas[i]['invoiceno']?datas[i]['invoiceno']:"",
            // invoicedate:datas[i]['invoicedate']?datas[i]['invoicedate']:"",
          });
          // if (this.maker) {
          //   delete this.arrays['approvedamount']
          // }

          const docu = this.miscellaneousform.get('tablerowdata') as FormArray;
          docu.push(this.arrays)
          console.log('arrays', this.arrays.value)
        }

        if (this.miscellaneousform.value.tablerowdata.length == 0) {

          this.addSet()

        }
        this.SpinnerService.hide()
      }, error => this.SpinnerService.hide());
  }



  back() {
    // this.SpinnerService.show()
    this.router.navigateByUrl('ta/exedit');
    // this.SpinnerService.hide()
    // if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
    //   this.expense_navigate_n.emit();
    // }
    // else{
    //   this.router.navigateByUrl('ta/exedit');
    // }
  }

  miscellaneouscreatecall(value) {
    this.SpinnerService.show()
    this.taservice.miscellaneousCreate(value)
      .subscribe(res => {
        this.SpinnerService.hide()
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")

          this.onSubmit.emit();
          this.back()
          return true;
        }

        else {
          this.notification.showError(res.description)
          return false;

        }
      }, error => this.SpinnerService.hide()
      )

  }


  createnewitem(): FormGroup {


    let dataArraySet = this.formBuilder.group({
      tourgid: this.miscellaneousform.value.tourno,
      expense_id: 6,
      description: null,
      eligibleamount: null,
      expreason: null,
      center: 0,
      claimedamount: null,
      requestercomment: this.commenter,
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    })
    return dataArraySet;
  }

  addSet() {
    const data = this.miscellaneousform.get('tablerowdata') as FormArray;
    data.push(this.createnewitem());
    console.log(this.miscellaneousform.value)
    this.length = this.miscellaneousform.value.tablerowdata.length
  }
  // formarraydatadelete(i) {

  //   let dat = this.pageSize * (this.p - 1) + i;
  //   const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
  //   control.removeAt(dat)
  // }
  removeSection(i) {
    if (this.miscellaneousform.value.tablerowdata[i].id == undefined || this.miscellaneousform.value.tablerowdata[i].id == null || this.miscellaneousform.value.tablerowdata[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
      control.removeAt(ind)
    }
    else {
      this.SpinnerService.show()
      this.taservice.deletemiscdeleteSummary(this.miscellaneousform.value.tablerowdata[i].id)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
          }
          else {
            this.SpinnerService.hide()
            this.notification.showSuccess("Deleted Successfully....")
            let ind = this.pageSize * (this.p - 1) + i;
            const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
            control.removeAt(ind)
            console.log("res", res)
            this.onSubmit.emit();
            return true
          }
        }
        )

    // this.dailydiem.data.splice(i, 1);
    }
    // console.log("bb",this.fromdate)
  }
  sub() {

    let value = JSON.parse(JSON.stringify(this.miscellaneousform.value.tablerowdata));
    for (let i = 0; i < value.length; i++) {
      console.log(value[i].center)
      if (value[i].center == "" || value[i].center == null) {
        delete value[i]['center'];
      }
      if (value[i]['eligibleamount'] == "" || value[i]['eligibleamount'] == null) {

        delete value[i]['eligibleamount'];
      }

      if (value[i]['description'] == "" || value[i]['description'] == null) {
        value[i]['description'] = null
        this.notification.showError('Please Enter Description')
        throw new Error
      }

      if (value[i]['expreason'] == "" || value[i]['expreason'] == null) {
        value[i]['expreason'] = null
        this.notification.showError('Please Enter Expense Reason')
        throw new Error
      }
      if (value[i]['claimedamount'] == "" || value[i]['claimedamount'] == null) {
        value[i]['claimedamount'] = null
        this.notification.showError('Please Enter Claimed Amount')
        throw new Error
      }
      if (value[i]['claimedamount']) {
        value[i]['claimedamount'] = JSON.parse(value[i]['claimedamount'])
      }
      if(this.shareservice.TA_Ap_Exp_Enb_type.value){
        if (value[i].gstno == null || value[i].gstno == '' || value[i].gstno==undefined) {
          // this.notification.showError('Please Enter Valid GST No..')
          // throw new Error
        }
        else {
          let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          if(regex.test(value[i].gstno)==false){
            this.notification.showError('Invalid GST No Format..');
            throw new Error
          }
        }
        // if (value[i].invoicedate == null || value[i].invoicedate == '' || value[i].invoicedate==undefined) {
        //   this.notification.showError('Please Select The Invoice Date..')
        //   throw new Error
        // }
        // if (value[i].invoiceno == null || value[i].invoiceno == '' || value[i].invoiceno==undefined) {
        //   this.notification.showError('Please Enter The Valid Invoice No..')
        //   throw new Error
        // }
      }
    }

    let obj = {
      data: value
    }

    console.log("obbbb", obj)
    let ta_data_list:Array<any>=[];
    console.log('apiobj', obj)
   if(this.shareservice.TA_Ap_Exp_Enb_type.value){
    for(let data_ta of value){
      let a:object={
        'id':data_ta['id'],
        'tourid':data_ta['tourgid'],
        'gstno':data_ta['gstno'],
        'expenseid':data_ta['expense_id'],
        'invoice_date':this.datePipe.transform(data_ta.invoicedate, 'yyyy-MM-dd'),
        'invoice_no':data_ta['invoiceno']
      }
      ta_data_list.push(a);
    }
    let ta_obj_be:any={"data":ta_data_list};
    console.log('apuser',ta_obj_be)
    this.SpinnerService.show();
  this.taservice.Submitapuser(ta_obj_be)
    .subscribe(res => {
      console.log("dailydeimres", res)
      this.SpinnerService.hide()
      if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
        this.notification.showSuccess("Successfully Created")
        this.backchecker();
        return true;
      }
      else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  else{
    this.miscellaneouscreatecall(obj);
  }
    
  }

    // const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
    // control.clear()

    // this.existingdata(this.miscellaneousform.value.tourno);
    // this.back()


  

  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  space(e) {
    if (e.target.selectionStart === 0 && e.code === 'Space') {
      e.preventDefault();
    }
  }
  minus(e) {
    if (e.charCode >= 48 && e.charCode <= 57) {
      e.preventDefault();
    }
    else if (e.charCode == 190) {
      e.preventDefault();
    }
    else {
      return
    }
  }

  approverupdate(tourno, expid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expid, approvearray)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          this.router.navigateByUrl('ta/exapprove-edit')
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })

  }

  getupdateapprove() {
    this.approverarray.splice(0, this.approverarray.length)

    for (let i = 0; i < this.miscellaneousform.value.tablerowdata.length; i++) {
      let json = {
        "id": this.miscellaneousform.value.tablerowdata[i].id,
        "amount": JSON.parse(this.miscellaneousform.value.tablerowdata[i].approvedamount),
      }
      this.approverarray.push(json)

    }

    console.log('approveamountchange', this.approverarray)
    console.log('expid', this.expenseids)
    this.approverupdate(this.miscellaneousform.value.tourno, 6, this.approverarray)


  }

  backchecker() {
    if (this.applevel == 0) {
      if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
        this.SpinnerService.hide();
        this.expense_navigate_new.emit();
      }
      else{
        this.router.navigateByUrl('ta/exedit')
      }
      
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/reporttourexpense')

    }
    else {
      this.router.navigateByUrl('ta/exapprove-edit')
    }

  }

  zero(e) {
    let a = ''
    if (e.code == 'Digit0') {
      a = a + e.target.value
      if (a == "0") {
        e.preventDefault();
        console.log('hello')
      }

    }
    if (e.code == 'Period') {
      a = a + e.target.value
      if (a.includes(".")) {
        e.preventDefault()
      }
    }

  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  keyPressAmounts(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp) || event.keyCode == 32) {
      return true;
    }
    else {
      event.preventDefault();
      return false;

    }
  }

  nospace(e) {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  //Bug 8368 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:25/04/2023

}   