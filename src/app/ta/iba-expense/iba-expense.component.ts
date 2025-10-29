import { Component, OnInit, Output, EventEmitter ,HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { E, T } from '@angular/cdk/keycodes';
// import { timeStamp } from 'console';
import { NgxSpinnerService } from "ngx-spinner";

interface onward {
  id: number;
  Name: string;
}
interface sub {
  id: number;
  Name: string;
}
// interface center {
//   id: number;
//   Name: string;
// }
interface onwardd {
  id: number;
  Name: string;
}
@Component({
  selector: 'app-iba-expense',
  templateUrl: './iba-expense.component.html',
  styleUrls: ['./iba-expense.component.scss']
})
export class IbaExpenseComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() expense_navigate_new=new EventEmitter<any>();
  localexp: any
  showsubcatcreate = true
  showsubcatedit = false
  expenseid: any
  tour_reason: any
  exptype: any
  comm: any
  localid: any
  tourno: any
  trvlmodeList: any
  subcatList: any
  // centerList: any
  onwardLists: any
  // showlocal=false
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  claimreqid: any
  getlocalexpid: any
  expenseeditid: any
  subcatroadList: any
  // subcattrainList: any
  abc: any
  currentpage: number = 1;
  pagesize = 10;
  Ibaform: FormGroup
  expensedetails: any
  expensevalues: any;
  pageSize: number = 10;
  p: any = 1
  total_eligibleamt:number =0;
  roadlist: any;
  // trainlist: any;
  emptyarray: any = []
  data: any = []
  maker: any
  makerboolean: boolean = false;
  approveamountarray: any = []
  isonbehalf: boolean = false
  onbehalf_empName: any;
  tournumb: any;

  applevel: any = 0;
  approver: boolean = false;
  report: any;
  statusid: any;
  enb_all_exbdetails:boolean=false;
  showdistance = true;
  colspan : any=7;
  tourreqno:any;
  constructor(private formBuilder: FormBuilder, private taservice: TaService, private spinnerservice: NgxSpinnerService, private shareservice: ShareService, 
    private notification: NotificationService, private router: Router,private datePipe:DatePipe) { }

  ngOnInit(): void {
    let expense_edit = JSON.parse(localStorage.getItem("expense_edit"))
    // this.tourreqno=expense_edit.tourno
    this.expensevalues = expense_edit
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    this.report = expensedetails.report
    this.tourreqno=expensedetails.requestno
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
    }
    else{
      this.enb_all_exbdetails=false;
    }
    this.expensedetails = expensedetails

    this.maker = expensedetails['applevel']
    this.tournumb =expensedetails.tourid?expensedetails.tourid:expensedetails.id;

    this.statusid = expensedetails.claim_status_id;

    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }

    this.tournumb =expensedetails.tourid?expensedetails.tourid:expensedetails.id;


    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel == 2 || expensedetails.applevel == 1) {
      this.isonbehalf = false;
      this.tournumb = expensedetails.tourid?expensedetails.tourid:expensedetails.id;
      this.approver = true;
    }

    if (expensedetails.claim_status_id == 2 || expensedetails.claim_status_id == 3 || expensedetails.claim_status_id == 4) {
      this.approver = true;
    }



    this.Ibaform = this.formBuilder.group({
      tourno: this.tournumb,
      tourreqno:this.tourreqno,
      reason:this.tour_reason,
      employeename: '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name,
      designation: expensedetails.empdesignation?expensedetails.empdesignation:expensedetails.designation,
      employeegrade: expensedetails.empgrade?expensedetails.empgrade: expensedetails.emp_grade,
      data: new FormArray([])



    })
    console.log(this.expensedetails)

    console.log('Ibaform', this.Ibaform.value)
    let expensetype = this.shareservice.dropdownvalue.value;
    console.log("mmm", expensetype)

    this.exptype = expensedetails['expenseid']
    console.log("sf", this.exptype)
    this.comm = expensedetails['requestercomment']
    console.log("cc", this.comm)
    this.tourdatas = this.shareservice.expensesummaryData.value;
    console.log("tddddd", this.tourdatas)
    this.employeename = expensedetails['employee_name']
    this.employeegrade = expensedetails['empgrade']
    this.employeedesignation = expensedetails['empdesignation']
    let data = this.shareservice.expenseedit.value;
    let datavalue = this.shareservice.expensesummaryData.value;
    console.log("exedit", data)
    this.expenseeditid = expensedetails['id']
    this.expenseid = expensedetails['id']
    console.log("eeid", this.expenseeditid)
    this.tour_reason=expensedetails['reason']
    if (datavalue['requestno'] != 0) {
      this.tourno = datavalue['requestno']
    }
    this.localexp = {

      data: [],
    }
    if (this.tour_reason=='IBA'){
      this.showdistance=true;

    }
    // else{
    //   this.showdistance=false;
    // }

    this.localexp.data.push({

      tourgid: JSON.parse(this.expenseid),
      expense_id: 9,
      requestercomment: this.comm,
      modeoftravel: '',
      subcatogory: '',
      // center: '',
      fromplace: '',
      toplace: '',
      distance: '',
      onwardreturn: '',
      claimedamount: '',
      remarks: '',
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });
    this.gettravelmode()
    // this.gettravelmodebytrain()
    this.gettravelmodebybus()
    // this.getconvcenter()
    this.getonwardreturn()

    //myforms
    this.gettravelmodebus()
    // this.gettravelmodetrain()
    this.ibaedit()
    
  }
  gettravelmode(){
    {
      this.taservice.getiba_travelmode()
        .subscribe(res => {
          this.trvlmodeList = res
          this.trvlmodeList.forEach(element => {
            element.name = element.name.toUpperCase()
          });
          // console.log("trvlmodeList",this.trvlmodeList)
        })
      }
  }
  subcatindex: any
  subcatname: any
  getsubcat(data, i) {
    // this.showsubcatcreate=false
    // this.showsubcatedit=true
    console.log("subcatdata", data)
    console.log("subcatind", i)
    this.subcatindex = i
    this.subcatname = data.name
  }
  gettraveldata: any
  gettrvl(data, i, dtl) {
    let a = dtl.id
    console.log("index", i)
    console.log("dataaaaa", data)
    console.log("dtlll", dtl)
    // this.gettraveldata=data.value
    // for(var j=0;j<this.localexp.data.length;i++){
    //  if(dtl.id > this.localexp.data.length){
    if (data.value === "Road") {
      this.gettravelmodebybus()
    }
    //   if(data.value === "Train"){
    //     this.gettravelmodebybus() 
    //  }
    // }
    // else {
    //   this.gettravelmodebytrain()
    // }
    // }
    // else{
    //   if(data.value === "Road"){
    //     this.gettravelmodebybus() 
    //  }
    //  else{
    //   this.gettravelmodebytrain() 
    //  }

    // }
    // }

  }
  // gettravelmodebytrain() {
  //   this.taservice.getloc_convtrain()
  //     .subscribe(res => {
  //       this.subcattrainList = res

  //     })

  // }
  gettravelmodebybus() {
    this.taservice.getiba_road()
      .subscribe(res => {
        this.subcatroadList = res


      })

  }
  getonwardreturn() {
    this.taservice.getloc_convonward()
      .subscribe(res => {
        this.onwardLists = res

      })

  }
  public valueMappers = (value) => {
    let selection = this.onwardLists.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  addSection() {
    // this.showlocal=true


    this.localexp.data.push({

      ids: this.localexp.data.length + 1,
      tourgid: JSON.parse(this.expenseid),
      expense_id: 9,
      requestercomment: this.comm,
      modeoftravel: '',
      subcatogory: '',
      // center: '',
      fromplace: '',
      toplace: '',
      distance: '',
      onwardreturn: '',
      claimedamount: '',
      remarks: '',
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    })
  }
  removeSection(i, data) {
    console.log("dtldata", data)
    console.log("index", i)
    let localexpid = data.id
       this.localexp.data.splice(i, 1);
  }
  // eligibleamt: any
  // ondistanceChange(e, index) {
  //   let indexid = index.id
  //   const indexx = this.localexp.data.findIndex(fromdata => fromdata.id === indexid)
  //   const indexes = this.localexp.data.findIndex(fromdatas => fromdatas.ids === index.ids)
  //   console.log("localeveent", e)
  //   let ibaeligible = {
  //     distance:e,
  //     expense_id: 9,
  //     tourgid: JSON.parse(this.expenseid)
  //   }
  //   console.log("lceligible", ibaeligible)
  //   if (indexid === undefined) {
  //     if (ibaeligible.distance != undefined && ibaeligible.expense_id && ibaeligible.tourgid != undefined) {
  //       this.taservice.uservehicleibaeligibleamt(ibaeligible)
  //         .subscribe(res => {

  //           this.eligibleamt = res['eligible_amount']
  //           console.log("elg", this.eligibleamt)
  //           this.localexp.data[indexes].eligibleamount = this.eligibleamt

  //         })
  //     }
  //   }

  //   if (indexid != undefined) {
  //     if (ibaeligible.distance != undefined && ibaeligible.expense_id && ibaeligible.tourgid != undefined) {
  //       this.taservice.uservehicleibaeligibleamt(ibaeligible)
  //         .subscribe(res => {

  //           this.eligibleamt = res['eligible_amount']
  //           console.log("elg", this.eligibleamt)
  //           this.localexp.data[indexx].eligibleamount = this.eligibleamt

  //         })
  //     }
  //   }
  // }
  submitForm() {
    console.log("localexp", this.localexp)
    let data = this.shareservice.expenseedit.value;
    let comm = data['requestercomment']
    for (var i = 0; i < this.localexp.data.length; i++) {
      if (this.localexp.data[i].claimreqid != undefined) {
        delete this.localexp.data[i].tourid
        this.localexp.data[i].tourgid = JSON.parse(this.expenseid)
        this.localexp.data[i].expense_id = 9
        delete this.localexp.data[i].eligibleamount
        delete this.localexp.data[i].approvedamount
        this.localexp.data[i].requestercomment = comm
      }
      if (this.localexp.data[i].ids != undefined && this.localexp.data[i].claimreqid == undefined) {
        delete this.localexp.data[i].ids
        delete this.localexp.data[i].eligibleamount
        this.localexp.data[i].requestercomment = comm
        this.localexp.data[i].claimedamount = JSON.parse(this.localexp.data[i].claimedamount)
        this.localexp.data[i].onwardreturn = JSON.parse(this.localexp.data[i].onwardreturn)
      }
    }


    console.log("locexp1", this.localexp)
  }
  back() {
    this.spinnerservice.show()
    if (this.applevel == 0) {
      if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
        this.spinnerservice.hide();
        this.expense_navigate_new.emit();
      }
      else{
        this.spinnerservice.hide()
      this.router.navigateByUrl('ta/exedit')
      }
      
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/reporttourexpense')

    }
    else {
      this.spinnerservice.hide()
      this.router.navigateByUrl('ta/exapprove-edit')
    }

  }
  ibaedit() {
    this.spinnerservice.show()
    this.taservice.getibaeditSummary(this.Ibaform.value.tourno).subscribe(
      x => {
        console.log('x', x)
        let datas = x['data']
        let variable = x['requestercomment']
        for (let i = 0; i < datas.length; i++) {
          this.total_eligibleamt =this.total_eligibleamt+datas[i]['eligibleamount']
          // let array =this.formBuilder.group({total_eligibleamt:this.total_eligibleamt})
        }
        for (let i = 0; i < datas.length; i++) {
          let array = this.formBuilder.group({
            id: datas[i]['id'],
            tourgid: datas[i]['tourgid'],
            expense_id: datas[i]['exp_id'],
            eligibleamount: datas[i]['eligibleamount'],
            //Bug 8418 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
            // center: datas[i]['center']['value'],
            claimedamount: datas[i]['claimedamount'],
            requestercomment: variable,
            modeoftravel: datas[i]['modeoftravel']['value'],
            subcatogory: datas[i]['subcatogory']['value'],
            fromplace: datas[i]['fromplace'],
            toplace: datas[i]['toplace'],
            distance: datas[i]['distance'],
            total_eligibleamt:this.total_eligibleamt ,
            onwardreturn: datas[i]['onwardreturn']['value'].toString(),
            remarks: datas[i]['remarks'],
            approvedamount: datas[i]['approvedamount'],
            gstno:datas[i]['gstno']?datas[i]['gstno']:"",
            invoiceno:datas[i]['invoiceno']?datas[i]['invoiceno']:"",
            invoicedate:datas[i]['invoicedate']?datas[i]['invoicedate']:"",
          })

          const docu = this.Ibaform.get('data') as FormArray;
          docu.push(array)
        }

        if (this.Ibaform.value.data.length == 0) {
          this.adddata()
        }
        this.spinnerservice.hide()
      }
    )
  }
  
  createnewitem(): FormGroup {
    let datasarray = this.formBuilder.group({
      tourgid: this.Ibaform.value.tourno,
      expense_id: 9,
      eligibleamount: new FormControl(0), //Bug 8418 Fix
      claimedamount: null,
      requestercomment: this.expensevalues['requestercomment'],
      modeoftravel: null,
      subcatogory: null,
      // center: null,
      fromplace: null,
      toplace: null,
      distance:null,
      onwardreturn: null,
      remarks: null,
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null,
      total_eligibleamt:null,
      // approvedamount:new FormControl(0)
    });

    return datasarray;
  }
  adddata() {
    const data = this.Ibaform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.Ibaform.value.data)
  }
  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }
  gettravelmodebus() {
    this.taservice.getiba_road()
      .subscribe(res => {
        this.subcatroadList = res
        this.roadlist = res
      })
  }
  getsubcatogorychange(i) {
    let index = this.pageSize * (this.p - 1) + i;
    console.log(this.Ibaform.value.data[index])
      }
  modeoftravel(v) {
    console.log('modeoftravel', v)
  }
  // getdelete(i) {
  //   let index = this.pageSize * (this.p - 1) + i;
  //   const control = <FormArray>this.Ibaform.controls['data'];
  //   control.removeAt(index)
  // }
  getdelete(i) {
    if (this.Ibaform.value.data[i].id == undefined || this.Ibaform.value.data[i].id == null || this.Ibaform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.Ibaform.controls['data'];
      control.removeAt(ind)
    }
    else{
      this.spinnerservice.show()
      this.taservice.deleteuservehicle_iba(this.Ibaform.value.data[i].id)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
          }
          else {
            this.spinnerservice.hide()
            this.notification.showSuccess("Deleted Successfully....")
            let ind = this.pageSize * (this.p - 1) + i;
            const control = <FormArray>this.Ibaform.controls['data'];
            control.removeAt(ind)
            console.log("res", res)
            this.onSubmit.emit();
            return true
          }
        }
        )
    // this.localexp.data.splice(i, 1);
      }
  }
  
  // centerselect(v, i) {
  //   this.spinnerservice.show()
  //   // let index = this.pageSize * (this.p - 1) + i;
  //   // if(this.Ibaform.value.data[index].distance!=null){
  //   // console.log(v)
  //   if (this.tour_reason=="IBA"){
      
  //     let index = this.pageSize * (this.p - 1) + i;
  //     if(this.Ibaform.value.data[index].distance==null){
  //       console.log(v)
  //       this.spinnerservice.hide()
  //     }
  //     let obj = {
  //       expense_id: 9,
  //       tourgid: this.Ibaform.value.tour_id,
  //       subcatogory:this.Ibaform.value.data[index].subcatogory,
  //       distance:this.Ibaform.value.data[index].distance
  //     }
  //     // console.log('center obj', obj)
  //     if (this.expensevalues['expenseid'] && this.Ibaform.value.tour_id != undefined) {
  //       this.taservice.localconveligibleamt(obj)
  //         .subscribe(res => {
  //           this.spinnerservice.hide()
  //           this.Ibaform.get('data')['controls'][index].get('eligibleamount').setValue(res['eligible_amount'])
  //           console.log('eligibleamount', res['eligible_amount'])
  //           this.total_eligibleamt=0;
  //           console.log(this.Ibaform.value.data);
  //           for (let i = 0; i <this.Ibaform.value.data.length; i++) {           
  //             this.total_eligibleamt =Number(this.total_eligibleamt)+Number(this.Ibaform.value.data[i]['eligibleamount']);
      
  //           }
  //         })
  //     }
    
  //   }
  //   {
    
  //   let index = this.pageSize * (this.p - 1) + i;
  //   let obj = {
  //     distance: v.value,
  //     expense_id: 9,
  //     tourgid: this.Ibaform.value.tourno
  //   }
  //   // console.log('center obj', obj)
  //   if (v.value != undefined && this.expensevalues['expenseid'] && this.Ibaform.value.tour_id != undefined) {
  //     this.taservice.uservehicleibaeligibleamt(obj)
  //       .subscribe(res => {
  //         this.spinnerservice.hide()
  //         this.Ibaform.get('data')['controls'][index].get('eligibleamount').setValue(res['eligible_amount'])
  //         console.log('eligibleamount', res['eligible_amount'])
  //       })
  //   }}
  // }
  submit(value) {
    this.spinnerservice.show()
    this.taservice.IBACreate(value)
      .subscribe(res => {
        console.log("resss", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.onSubmit.emit();
          this.back();
          return true;
        }

        else {
          this.notification.showError(res.description)
          return false;

        }

      }
      )

  }
  
  submitcall() {

    for (let i = 0; i < this.Ibaform.value.data.length; i++) {
      if (this.Ibaform.value.data[i].modeoftravel == null || this.Ibaform.value.data[i].modeoftravel == '') {
        this.notification.showError('Please Select Mode of Travel')
        throw new Error
      }
      if (this.Ibaform.value.data[i].subcatogory == null || this.Ibaform.value.data[i].subcatogory == '') {
        this.notification.showError('Please Select Subcateogry')
        throw new Error
      }
      if (this.Ibaform.value.data[i].fromplace == null || this.Ibaform.value.data[i].fromplace == '') {
        this.notification.showError('Please Enter From Place')
        throw new Error
      }
      if (this.Ibaform.value.data[i].toplace == null || this.Ibaform.value.data[i].toplace == '') {
        this.notification.showError('Please Enter To Place')
        throw new Error
      }
      if (this.tour_reason=="IBA"){
        this.Ibaform.value.data[i].total_eligibleamt=this.total_eligibleamt
        console.log()
        // if (this.Ibaform.value.data[i].distance!=100){
        //   // this.getresetdelete(this.localform.value.data[i])
        //   this.notification.showError('Distance should be within 100 KM')
        //   return false;
        

        // }
        if (this.Ibaform.value.data[i].distance == null || this.Ibaform.value.data[i].distance == '') {
        this.notification.showError('Please Enter Distance')
        throw new Error
       }
      }
      if (this.Ibaform.value.data[i].onwardreturn == null || this.Ibaform.value.data[i].onwardreturn == '') {
        this.notification.showError('Please Select Onward/Return')
        throw new Error
      }
      if (this.Ibaform.value.data[i].claimedamount == null || this.Ibaform.value.data[i].claimedamount == '') {
        this.notification.showError('Please Enter Claimed Amount')
        throw new Error
      }
      if (this.Ibaform.value.data[i].remarks == null || this.Ibaform.value.data[i].remarks == '') {
        this.notification.showError('Please Enter Remarks')
        throw new Error
      }
      if (this.Ibaform.value.data[i].claimedamount) {
        this.Ibaform.value.data[i].claimedamount = JSON.parse(this.Ibaform.value.data[i].claimedamount)
      }
      if(this.shareservice.TA_Ap_Exp_Enb_type.value){
        if (this.Ibaform.value.data[i].gstno == null || this.Ibaform.value.data[i].gstno == '' || this.Ibaform.value.data[i].gstno==undefined) {
          // this.notification.showError('Please Enter Valid GST No..')
          // throw new Error
        }
        else {
          let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          if(regex.test(this.Ibaform.value.data[i].gstno)==false){
            this.notification.showError('Invalid GST No Format..');
            throw new Error
          }
        }
      }

    }


    console.log('finaldata', this.Ibaform.value.data)
    this.data = this.Ibaform.value.data
    console.log('data', this.data)
    let obj = {
      data: this.data
    }
    let ta_data_list:Array<any>=[];
    console.log('apiobj', obj);
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      for(let data_ta of this.Ibaform.value.data){
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
      this.spinnerservice.show();
    this.taservice.Submitapuser(ta_obj_be)
      .subscribe(res => {
        console.log("dailydeimres", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.back();
          return true;
        }
        else {
          this.notification.showError(res.description)
          return false;
        }
      })
  
  
  
  
    }   
  
    else{
    this.submit(obj);
    }
  }
  getmaker() {
    if (this.maker == 1) {
      return true
    }
    else {
      return false
    }
  }
  approverupdate(tourno, expenseid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expenseid, approvearray)
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
  iba() {
    this.approveamountarray.splice(0, this.approveamountarray.length)
    for (let i = 0; i < this.Ibaform.value.data.length; i++) {
      let json = {
        "id": this.Ibaform.value.data[i].id,
        "amount": JSON.parse(this.Ibaform.value.data[i].approvedamount),
      }
      this.approveamountarray.push(json)
    }
    console.log('approveamountchange', this.approveamountarray)
    this.approverupdate(this.Ibaform.value.tourno, 9, this.approveamountarray)

  }
  backchecker() {
    this.router.navigateByUrl('ta/exapprove-edit')
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
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  space(e) {
    if (e.target.selectionStart === 0 && e.code === 'Space') {
      e.preventDefault();
    }
  }
  nospace(e) {
    if (e.code === 'Space') {
      e.preventDefault();
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
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  eligible_amount_iba(index){
    let tour_id= this.Ibaform.value.tourno
    let subcatogory=this.Ibaform.value.data[index].subcatogory
    let distance=this.Ibaform.value.data[index].distance
    let input = {
      tour_id: tour_id,
      distance: distance,
      subcategory: subcatogory
    }
    this.spinnerservice.show()
    this.taservice.uservehicleibaeligibleamt(input).subscribe(res =>{
      this.spinnerservice.hide()
      if (res.status == 'success'){
      let iba_eligible_amount = res['eligible_amount']
      this.Ibaform.get('data')['controls'][index].get('eligibleamount').setValue(iba_eligible_amount)
      return true
      }
      else{
        this.notification.showError(res.description)
        return false
      }
    })
  }
}
