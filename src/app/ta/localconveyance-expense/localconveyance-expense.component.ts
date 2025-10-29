import { Component, OnInit, Output, EventEmitter ,HostListener} from '@angular/core';
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
import { E } from '@angular/cdk/keycodes';
// import { timeStamp } from 'console';
import { NgxSpinnerService } from "ngx-spinner";

// interface details {
//   id:number
// 	startdate: any
// 	enddate: any
//   startingpoint:string,
//   placeofvisit:string,
//   purposeofvisit:string
// }
interface onward {
  id: number;
  Name: string;
}
interface sub {
  id: number;
  Name: string;
}
interface center {
  id: number;
  Name: string;
}
interface onwardd {
  id: number;
  Name: string;
}

@Component({
  selector: 'app-localconveyance-expense',
  templateUrl: './localconveyance-expense.component.html',
  styleUrls: ['./localconveyance-expense.component.scss']
})
export class LocalconveyanceExpenseComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() expense_navigate_new=new EventEmitter<any>();
  localexp: any
  // showonwardcreate=true
  // showonwardedit=false
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
  centerList: any
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
  subcattrainList: any
  abc: any
  currentpage: number = 1;
  pagesize = 10;
  localform: FormGroup
  expensedetails: any
  expensevalues: any;
  pageSize: number = 10;
  p: any = 1
  total_eligibleamt:number =0;
  roadlist: any;
  trainlist: any;
  emptyarray: any = []
  data: any = []
  maker: any
  makerboolean: boolean = false;
  approveamountarray: any = []
  isonbehalf: boolean = false
  onbehalf_empName: any;
  tournumb: any;
  tourreq_no:any;
  applevel: any = 0;
  approver: boolean = false;
  report: any;
  statusid: any;
  enb_all_exbdetails:boolean=false;
  showdistance = false;
  colspan : any=7;
  constructor(private formBuilder: FormBuilder, private taservice: TaService, private spinnerservice: NgxSpinnerService, private shareservice: ShareService, 
    private notification: NotificationService, private router: Router,private datePipe:DatePipe) { }

  ngOnInit(): void {

    let expense_edit = JSON.parse(localStorage.getItem("expense_edit"))
    this.expensevalues = expense_edit
    // this.tourreq_no =expense_edit.requestno
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    this.report = expensedetails.report
    this.tourreq_no =expensedetails.requestno
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



    this.localform = this.formBuilder.group({
      tourno: this.tournumb,
      tourreqno: this.tourreq_no,
      reason:this.tour_reason,
      employeename: '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name,
      designation: expensedetails.empdesignation?expensedetails.empdesignation:expensedetails.designation,
      employeegrade: expensedetails.empgrade?expensedetails.empgrade: expensedetails.emp_grade,
      data: new FormArray([])



    })
    console.log(this.expensedetails)

    console.log('localform', this.localform.value)



    // let expensedetails = JSON.parse(localStorage.getItem("expense_details"))

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
    // this.tourreq_no = expensedetails['requestno']
    console.log("eeid", this.expenseeditid)
    this.tour_reason=expensedetails['reason']
    if (datavalue['requestno'] != 0) {
      this.tourno = datavalue['requestno']
      // console.log("id",this.tourno)

      // this.taservice.getlocaleditSummary(datavalue['id'])
      //   .subscribe((results: any[]) => {

      //     console.log("Tourmaker", results)
      //     this.localexp = results;
      //     this.localexp.data.forEach(currentValue => {
      //       currentValue.onwardreturn = currentValue.onwardreturn.value
      //        public valueMappers = (value) => {
      //         let selection = this.onwardLists.find(e => {
      //           return e.value == value;
      //         });
      //         if (selection){
      //           return selection.name;
      //         }
      //       }

      //       }
      //     })




      // });
    }
    this.localexp = {

      data: [],
    }
    if (this.tour_reason=='CTC Sales Local Conveyance'){
      this.showdistance=true;

    }
    else{
      this.showdistance=false;
    }

    this.localexp.data.push({

      tourgid: JSON.parse(this.expenseid),
      expense_id: 4,
      requestercomment: this.comm,
      modeoftravel: '',
      subcatogory: '',
      center: '',
      fromplace: '',
      toplace: '',
      onwardreturn: '',
      claimedamount: '',
      remarks: '',
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });
    this.gettravelmode()
    this.gettravelmodebytrain()
    this.gettravelmodebybus()
    this.getconvcenter()
    this.getonwardreturn()

    //myforms
    this.gettravelmodebus()
    this.gettravelmodetrain()
    this.localconveyanceedit()



  }

  gettravelmode() {
    if( this.tour_reason==="CTC Sales Local Conveyance"){
     console.log(this.tourdatas['reason'],this.tour_reason)
     // getctcloc_convtravelmode
     this.taservice.getctcloc_convtravelmode()
       .subscribe(res => {
         this.trvlmodeList = res
         this.trvlmodeList.forEach(element => {
           element.name = element.name.toUpperCase()
         });
         // console.log("trvlmodeList",this.trvlmodeList)
       })
 
    }
    else{
     this.taservice.getloc_convtravelmode()
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
    else {
      this.gettravelmodebytrain()
    }
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

  // showsubcat(){
  //   this.showsubcatcreate=true
  //   this.showsubcatedit=false
  // }




  gettravelmodebytrain() {
    this.taservice.getloc_convtrain()
      .subscribe(res => {
        this.subcattrainList = res

      })

  }

  gettravelmodebybus() {
    this.taservice.getloc_convroad()
      .subscribe(res => {
        this.subcatroadList = res


      })

  }


  getconvcenter() {
    if( this.tour_reason==="CTC Sales Local Conveyance"){
      this.taservice.getloc_conv_center()
      .subscribe(res => {
        this.centerList = res

      })

    }

    else{
    this.taservice.getloc_convcenter()
      .subscribe(res => {
        this.centerList = res

      })
    }

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

  // showonward(i){
  //   this.showonwardcreate=true
  //   this.showonwardedit=false

  // }
  // localexp:any=[]
  addSection() {
    // this.showlocal=true


    this.localexp.data.push({

      ids: this.localexp.data.length + 1,
      tourgid: JSON.parse(this.expenseid),
      expense_id: 4,
      requestercomment: this.comm,
      modeoftravel: '',
      subcatogory: '',
      center: '',
      fromplace: '',
      toplace: '',
      onwardreturn: '',
      claimedamount: '',
      remarks: '',
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    })
    // this.adddata()
    //  this.localexp.data.push(data)
    // this.localexp.data.forEach(elm=>delete elm.id)

  }
  removeSection(i) {
    if (this.localform.value.data[i].id == undefined || this.localform.value.data[i].id == null || this.localform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.localform.controls['data'];
      control.removeAt(ind)
    }
    else{
      this.spinnerservice.show()
      this.taservice.deletelocal(this.localform.value.data[i].id)
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
            const control = <FormArray>this.localform.controls['data'];
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
  eligibleamt: any
  oncenterChange(e, index) {
    let indexid = index.id
    const indexx = this.localexp.data.findIndex(fromdata => fromdata.id === indexid)
    const indexes = this.localexp.data.findIndex(fromdatas => fromdatas.ids === index.ids)
    console.log("localeveent", e)
    let localeligible = {
      center: e,
      expense_id: 4,
      tourgid: JSON.parse(this.expenseid)
    }
    console.log("lceligible", localeligible)
    if (indexid === undefined) {
      if (localeligible.center != undefined && localeligible.expense_id && localeligible.tourgid != undefined) {
        this.taservice.localconveligibleamt(localeligible)
          .subscribe(res => {

            this.eligibleamt = res['Eligible_amount']
            console.log("elg", this.eligibleamt)
            this.localexp.data[indexes].eligibleamount = this.eligibleamt

          })
      }
    }

    if (indexid != undefined) {
      if (localeligible.center != undefined && localeligible.expense_id && localeligible.tourgid != undefined) {
        this.taservice.localconveligibleamt(localeligible)
          .subscribe(res => {

            this.eligibleamt = res['Eligible_amount']
            console.log("elg", this.eligibleamt)
            this.localexp.data[indexx].eligibleamount = this.eligibleamt

          })
      }
    }
  }

  submitForm() {
    console.log("localexp", this.localexp)

    // const index = this.localexp.data.findIndex(fromdept => fromdept.status === undefined);
    // console.log("constindex",index)
    // console.log("locexp",this.localexp)
    // for(var i=0;i<this.localexp.data.length;i++){
    //   let reqid=this.localexp.data[i].claimreqid
    //   let id=this.localexp.data[i].id
    //   delete this.localexp.data[i].tourid
    //   this.localexp.data[i].tourgid=this.expenseid
    //   this.localexp.data[i].expense_id=4
    //   delete this.localexp.data[i].eligibleamount
    //   if(reqid === undefined && id != undefined){
    //     delete this.localexp.data[i].id
    //    delete this.localexp.data[i].eligibleamount
    //    let data=this.shareservice.expenseedit.value;
    //    console.log("exeeeedit",data)
    //    let comm=data['requestercomment']
    //    this.localexp.data[i].requestercomment = comm
    //    console.log("commmmmmm",comm)

    //   }
    // }
    let data = this.shareservice.expenseedit.value;
    let comm = data['requestercomment']
    for (var i = 0; i < this.localexp.data.length; i++) {
      if (this.localexp.data[i].claimreqid != undefined) {
        delete this.localexp.data[i].tourid
        this.localexp.data[i].tourgid = JSON.parse(this.expenseid)
        this.localexp.data[i].expense_id = 4
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
    // this.taservice.LocalconveyanceCreate(this.localexp)
    //   .subscribe(res => {
    //     console.log("resss", res)
    //     if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
    //       this.notification.showSuccess("Success....")
    //       this.onSubmit.emit();
    //       return true;
    //     }

    //     else {
    //       this.notification.showError(res.description)
    //       return false;

    //     }
    //   }
    //   )

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

  localconveyanceedit() {
    this.spinnerservice.show()
    this.taservice.getlocaleditSummary(this.localform.value.tourno, this.report).subscribe(
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

            //Bug 8418 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
            // eligibleamount: new FormControl({ value: datas[i]['eligibleamount'].value }),
            eligibleamount: datas[i]['eligibleamount'],
            //Bug 8418 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
            center: datas[i]['center']['value'],
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

          const docu = this.localform.get('data') as FormArray;
          docu.push(array)
        }

        if (this.localform.value.data.length == 0) {
          this.adddata()
        }
        this.spinnerservice.hide()
      }
    )




  }


  createnewitem(): FormGroup {



    let datasarray = this.formBuilder.group({
      tourgid: this.localform.value.tourno,
      expense_id: 4,
      eligibleamount: new FormControl(0), //Bug 8418 Fix
      claimedamount: null,
      requestercomment: this.expensevalues['requestercomment'],
      modeoftravel: null,
      subcatogory: null,
      center: null,
      fromplace: null,
      toplace: null,
      distance:null,
      onwardreturn: null,
      remarks: null,
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null,
      total_eligibleamt:null
    });

    return datasarray;
  }

  adddata() {
    const data = this.localform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.localform.value.data)
  }

  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }

  gettravelmodebus() {
    if(this.tour_reason==="CTC Sales Local Conveyance"){
      this.taservice.getloc_conv_road()
      .subscribe(res => {
        this.subcatroadList = res
        this.roadlist = res
      })
      }
    else{
    this.taservice.getloc_convroad()
      .subscribe(res => {
        this.subcatroadList = res
        this.roadlist = res
      })
    }

  }

  gettravelmodetrain() {
    this.taservice.getloc_convtrain()
      .subscribe(res => {
        this.subcatroadList = res
        this.trainlist = res
      })

  }

  getsubcatogorychange(i) {
    let index = this.pageSize * (this.p - 1) + i;
    console.log(this.localform.value.data[index])
    // if(this.localform.value.data[index]['modeoftravel']=="Train"){
    //   this.gettravelmodetrain()
    // }
    // else if(this.localform.value.data[index]['modeoftravel']=="Road" ){
    //   this.gettravelmodebus()
    // }
    // else{
    //   this.subcatroadList.splice(0,this.subcatroadList.length)
    // }

  }



  modeoftravel(v) {
    console.log('modeoftravel', v)
    // if(v.name=="Train"){
    //   this.gettravelmodetrain()
    // }
    // else{
    //   this.gettravelmodebus()
    // }
  }

  getdelete(i) {
    let index = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.localform.controls['data'];
    control.removeAt(index)
  }
  // getresetdelete(i) {
  //   console.log()
  //   let index :any='';
  //   const control = <FormArray>i['distance'];
  //   control.removeAt(index)
  // }

  centerselect(v, i) {
    this.spinnerservice.show()
    // let index = this.pageSize * (this.p - 1) + i;
    // if(this.localform.value.data[index].distance!=null){
    // console.log(v)
    if (this.tour_reason=="CTC Sales Local Conveyance"){
      
      let index = this.pageSize * (this.p - 1) + i;
      if(this.localform.value.data[index].distance==null){
        console.log(v)
        this.spinnerservice.hide()
      }
      let obj = {
        center: this.localform.value.data[index].center,
        expense_id: 4,
        tourgid: this.localform.value.tourno,
        subcatogory:this.localform.value.data[index].subcatogory,
        distance:this.localform.value.data[index].distance
      }
      // this.spinnerservice.hide()
      console.log('center obj', obj)
      if (this.expensevalues['expenseid'] && this.localform.value.tourno != undefined) {
        this.taservice.localconveligibleamt(obj)
          .subscribe(res => {
            this.spinnerservice.hide()
            // this.localform.value.data[index].eligibleamount.setValue(res['Eligible_amount'])
            this.localform.get('data')['controls'][index].get('eligibleamount').setValue(res['Eligible_amount'])
            console.log('eligibleamount', res['Eligible_amount'])
            this.total_eligibleamt=0;
            console.log(this.localform.value.data);
            for (let i = 0; i <this.localform.value.data.length; i++) {           
              this.total_eligibleamt =Number(this.total_eligibleamt)+Number(this.localform.value.data[i]['eligibleamount']);
      
            }


  
  
  
          })
      }
    
    }
    else{
    
    let index = this.pageSize * (this.p - 1) + i;
    let obj = {
      center: v.value,
      expense_id: 4,
      tourgid: this.localform.value.tourno
    }
    console.log('center obj', obj)
    if (v.value != undefined && this.expensevalues['expenseid'] && this.localform.value.tourno != undefined) {
      this.taservice.localconveligibleamt(obj)
        .subscribe(res => {
          this.spinnerservice.hide()
          // this.localform.value.data[index].eligibleamount.setValue(res['Eligible_amount'])
          this.localform.get('data')['controls'][index].get('eligibleamount').setValue(res['Eligible_amount'])
          console.log('eligibleamount', res['Eligible_amount'])
          // this.spinnerservice.hide()



        })
    }}
  }

  submit(value) {
    this.spinnerservice.show()
    this.taservice.LocalconveyanceCreate(value)
      .subscribe(res => {
        console.log("resss", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.onSubmit.emit();
          this.back(); //BUG 8211 FIX *30/03/2023 Harikrishnan
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

    // tourgid: this.localform.value.tourno,
    //   expense_id: this.expensevalues['expenseid'],
    //   eligibleamount: new FormControl({value:null,disabled:true}),
    //   claimedamount: null,
    //   requestercomment: this.expensevalues['requestercomment'],
    //   modeoftravel: null,
    //   subcatogory: null,
    //   center: null,
    //   fromplace: null,
    //   toplace: null,
    //   onwardreturn: null,
    //   remarks: null,


    for (let i = 0; i < this.localform.value.data.length; i++) {
      if (this.localform.value.data[i].modeoftravel == null || this.localform.value.data[i].modeoftravel == '') {
        this.notification.showError('Please Select Mode of Travel')
        throw new Error
      }
      if (this.localform.value.data[i].subcatogory == null || this.localform.value.data[i].subcatogory == '') {
        this.notification.showError('Please Select Subcateogry')
        throw new Error
      }
      if (this.localform.value.data[i].center == null || this.localform.value.data[i].center == '') {
        this.notification.showError('Please Select Center')
        throw new Error
      }
      if (this.localform.value.data[i].fromplace == null || this.localform.value.data[i].fromplace == '') {
        this.notification.showError('Please Enter From Place')
        throw new Error
      }
      if (this.localform.value.data[i].toplace == null || this.localform.value.data[i].toplace == '') {
        this.notification.showError('Please Enter To Place')
        throw new Error
      }
      if (this.tour_reason=="CTC Sales Local Conveyance"){
        this.localform.value.data[i].total_eligibleamt=this.total_eligibleamt
        console.log()
        if (this.localform.value.data[i].distance > 100){
          // this.getresetdelete(this.localform.value.data[i])
          this.notification.showError('Distance should be within 100 KM')
          return false;
        

        }
        if (this.localform.value.data[i].distance == null || this.localform.value.data[i].distance == '') {
        this.notification.showError('Please Enter Distance')
        throw new Error
       }
      }
      if (this.localform.value.data[i].onwardreturn == null || this.localform.value.data[i].onwardreturn == '') {
        this.notification.showError('Please Select Onward/Return')
        throw new Error
      }
      if (this.localform.value.data[i].claimedamount == null || this.localform.value.data[i].claimedamount == '') {
        this.notification.showError('Please Enter Claimed Amount')
        throw new Error
      }
      if (this.localform.value.data[i].remarks == null || this.localform.value.data[i].remarks == '') {
        this.notification.showError('Please Enter Remarks')
        throw new Error
      }
      if (this.localform.value.data[i].claimedamount) {
        this.localform.value.data[i].claimedamount = JSON.parse(this.localform.value.data[i].claimedamount)
      }
      if(this.shareservice.TA_Ap_Exp_Enb_type.value){
        if (this.localform.value.data[i].gstno == null || this.localform.value.data[i].gstno == '' || this.localform.value.data[i].gstno==undefined) {
          // this.notification.showError('Please Enter Valid GST No..')
          // throw new Error
        }
        else {
          let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          if(regex.test(this.localform.value.data[i].gstno)==false){
            this.notification.showError('Invalid GST No Format..');
            throw new Error
          }
        }
        // if (this.localform.value.data[i].invoicedate == null || this.localform.value.data[i].invoicedate == '' || this.localform.value.data[i].invoicedate==undefined) {
        //   this.notification.showError('Please Select The Invoice Date..')
        //   throw new Error
        // }
        // if (this.localform.value.data[i].invoiceno == null || this.localform.value.data[i].invoiceno == '' || this.localform.value.data[i].invoiceno==undefined) {
        //   this.notification.showError('Please Enter The Valid Invoice No..')
        //   throw new Error
        // }
      }

    }


    console.log('finaldata', this.localform.value.data)
    this.data = this.localform.value.data
    console.log('data', this.data)
    let obj = {
      data: this.data
    }
    let ta_data_list:Array<any>=[];
    console.log('apiobj', obj);
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      for(let data_ta of this.localform.value.data){
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

  center_check(i) {
    let index = this.pageSize * (this.p - 1) + i;
    let myform = this.localform.value.data.at(index).subcatogory
    if (myform == null) {
      return true
    }
    else {
      return false
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

  // incidentalApproveButton(){
  //   this.applist=[];
  //   console.log("form-app",this.incidentalform.value)
  //   for(var i=0;i<this.incidentalform.value.data.length;i++){
  //     // this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
  //     // this.incidentalform.value.data[i].travel_hours = JSON.parse( this.incidentalform.value.data[i].travel_hours)
  //     // this.incidentalform.value.data[i].single_fare = JSON.parse( this.incidentalform.value.data[i].single_fare)
  //     // if (this.incidentalform.value.data[i].id == 0){
  //     //   delete this.incidentalform.value.data[i].id;
  //     // }
  //     let json = {
  //       "id": this.incidentalform.value.data[i].id,
  //       "amount": this.incidentalform.value.data[i].amount,

  //     }
  //     this.applist.push(json)
  //   }
  //   for(var i=0;i<this.applist.length;i++){
  //     this.applist[i].amount = JSON.parse(this.applist[i].amount)

  //   }
  //   console.log("createdlist",this.applist)
  //   this.taservice.approver_Incidental(this.applist,this.expenseid)
  //       .subscribe(res => {
  //         console.log("incires", res)
  //         if (res.status === "success") {
  //           this.notification.showSuccess("Success....")
  //           this.onSubmit.emit();
  //           return true;
  //         }else {
  //           this.notification.showError(res.description)
  //           return false;
  //         }
  //       })

  //   }

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


  localconveyance() {
    this.approveamountarray.splice(0, this.approveamountarray.length)
    for (let i = 0; i < this.localform.value.data.length; i++) {
      let json = {
        "id": this.localform.value.data[i].id,
        "amount": JSON.parse(this.localform.value.data[i].approvedamount),
      }
      this.approveamountarray.push(json)
    }



    console.log('approveamountchange', this.approveamountarray)
    this.approverupdate(this.localform.value.tourno, 4, this.approveamountarray)

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

  //Bug 8368 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:25/04/2023


}