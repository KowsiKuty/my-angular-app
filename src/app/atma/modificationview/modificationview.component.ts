import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { Observable, Observer } from 'rxjs';
import * as $ from 'jquery';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";


export interface ExampleTab {
  tab_name: string;
  tab_id: string;
}

@Component({
  selector: 'app-modificationview',
  templateUrl: './modificationview.component.html',
  styleUrls: ['./modificationview.component.scss']
})
export class ModificationviewComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  @Output() onCancel = new EventEmitter<any>();
  // asyncTabs: Observable<ExampleTab[]>;

  vendor_flag = false;
  client_flag = false;
  contractor_flag = false;
  branch_flag = false
  payment_flag = false;
  document_flag = false;
  branchtax_flag = false;
  catalouge_flag = false;
  activitydetails_flag=false;
  activity_flag=false;
  product_flag=false;
  contract_data = [];
  document_data = [];
  payment_data = [];
  branchtax_data = [];
  catalouge_data = [];
  activity_detail = [];
  activity_data = [];
  document_modify = false;
  vendor_data = [];
  client_data = [];
  product_data = [];
  branch_data = [];
  modificationdata: any
  contract_modify = false;
  client_modify = false;
  product_modify = false;
  branch_modify = false;
  vendorId: any
  modify_changestatus: any;
  SummarymodifyData:any
  SummaryApimodifyObjNew:any
  SummaryApimodify1ObjNew:any
  Summarymodify1Data:any
  Summarymodify2Data:any
  SummaryApimodify2ObjNew:any
  Summarymodify3Data:any
  SummaryApimodify3ObjNew:any
  Summarymodify4Data:any
  SummaryApimodify4ObjNew:any
  Summarymodify5Data:any
  SummaryApimodify5ObjNew:any
  Summarymodify6Data:any
  SummaryApimodify6ObjNew:any
  Summarymodify7Data:any
  SummaryApimodify7ObjNew:any
  Summarymodify8Data:any
  SummaryApimodify8ObjNew:any
  Summarymodify9Data:any
  SummaryApimodify9ObjNew:any
  Summarymodify10Data:any
  SummaryApimodify10ObjNew:any
  Summarymodify11Data:any
  SummaryApimodify11ObjNew:any
  asyncTabs: any[];
  tabs: any =[];
  constructor(private shareService: ShareService, private router: Router, private atmaService: AtmaService,private notification: NotificationService,) {

    this.SummarymodifyData = [
      {  
        columnname: "Status",
        key: "new_data",
        button:true,
        validate: true,
        validatefunction: this.flag_status1.bind(this),
      },
    { "columnname": "Name", "key": "new_data", "type": "object", "objkey": "name"},
    { "columnname": "GST No", "key": "new_data", "type": "object", "objkey": "gstno"},
    {"columnname": "PAN No", "key": "new_data", "type": "object", "objkey": "panno"},
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_vendor.bind(this),}
  ]
    this.Summarymodify1Data= [
      {  
        columnname: "Status",
        key: "new_data",
        button:true,
        validate: true,
        validatefunction: this.flag_status2.bind(this),
      },
      {
      columnname: "Name",
      key: "new_data",
      type: "object",
      objkey: "name"
    },
      {
      columnname: "Address",
      key: "address",
      function: true,
      validate: true,
      validatefunction: this.addressmodify.bind(this),
    },
    {
      columnname: "City",
      key: "city",
      function: true,
      validate: true,
      validatefunction: this.citymodify.bind(this),
    },
    {
      columnname: "District",
      key: "district",
      function: true,
      validate: true,
      validatefunction: this.districtmodify.bind(this),
    },
    {
      columnname: "State",
      key: "state",
      function: true,
      validate: true,
      validatefunction: this.statemodify.bind(this),
    },
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_client.bind(this),}
    ]


    this.Summarymodify2Data = [
      {  
        columnname: "Status",
        key: "new_data",
        button:true,
        validate: true,
        validatefunction: this.flag_status2.bind(this),
      },
      {
        columnname: "Name",
        key: "new_data",
        type: "object",
        objkey: "name"
      },
      {
        columnname: "Service",
        key: "new_data",
        type: "object",
        objkey: "service"
      },
      {
        columnname: "Remarks",
        key: "new_data",
        type: "object",
        objkey: "remarks"
      },
      {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_contract.bind(this),}
    ]
    this.Summarymodify3Data = [
      {  
      columnname: "Status",
      key: "new_data",
      button:true,
      validate: true,
      validatefunction: this.flag_status.bind(this),
    },
      {
      columnname: "Name",
      key: "new_data",
      type: "object",
      objkey: "name"
    },
    {
      columnname: "PAN No",
      key: "new_data",
      type: "object",
      objkey: "panno"
    },
    {
      columnname: "GST No",
      key: "new_data",
      type: "object",
      objkey: "gstno"
    },
    {
      columnname: "Credits",
      key: "new_data",
      type: "object",
      objkey: "creditterms"
    },
    {
      columnname: "Limit Days",
      key: "new_data",
      type: "object",
      objkey: "limitdays"
    },
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_branch.bind(this),}
  ]
this.Summarymodify4Data =[ 
  {  
    columnname: "Status",
    key: "new_data",
    button:true,
    validate: true,
    validatefunction: this.flag_status2.bind(this),
  },
  {
  columnname: "Name",
  key: "new_data",
  type: "object",
  objkey: "name"
},
{
  columnname: "Service",
  key: "new_data",
  type: "object",
  objkey: "service"
},
{
  columnname: "Remarks",
  key: "new_data",
  type: "object",
  objkey: "remarks"
},]

this.Summarymodify5Data = [
  {  
    columnname: "Status",
    key: "new_data",
    button:true,
    validate: true,
    validatefunction: this.flag_status2.bind(this),
  },
  {
  columnname: "Name",
  key: "new_data",
  type: "object",
  objkey: "name"
},
{
  columnname: "Type",
  key: "new_data",
  type: "object",
  objkey: "type"
},
{
  columnname: "Age",
  key: "new_data",
  type: "object",
  objkey: "age"
},
{"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_product.bind(this),}
]

this.Summarymodify6Data = [
  {  
    columnname: "Status",
    key: "new_data",
    button:true,
    validate: true,
    validatefunction: this.flag_status2.bind(this),
  },
  {
  columnname: "Partner",
  key: "new_data",
  type: "object",
  objkey: "partner_id"
},
{
  columnname: "Remarks",
  key: "new_data",
  type: "object",
  objkey: "remarks"
},
{"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_doc.bind(this),}]

this.Summarymodify7Data = [
  {  
    columnname: "Status",
    key: "new_data",
    button:true,
    validate: true,
    validatefunction: this.flag_status2.bind(this),
  },
  {
    columnname: "Department",
    key: "state",
    function: true,
    validate: true,
    validatefunction: this.activitemodify.bind(this),
  },
  {
  columnname: "Activity Type",
  key: "new_data",
  type: "object",
  objkey: "type"
},
{
  columnname: "Description",
  key: "new_data",
  type: "object",
  objkey: "description"
},
{
  columnname: "Activity Status",
  key: "new_data",
  type: "object",
  objkey: "activity_status"
},
{
  columnname: "Header Name",
  key: "new_data",
  type: "object",
  objkey: "rm"
},
{"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_activity.bind(this),}]

this.Summarymodify8Data = [
  {  
    columnname: "Status",
    key: "new_data",
    button:true,
    validate: true,
    validatefunction: this.flag_status2.bind(this),
  },
  {
    columnname: "Code",
    key: "new_data",
    type: "object",
    objkey: "code"
  },
  {
    columnname: "Detail Name",
    key: "new_data",
    type: "object",
    objkey: "detailname"
  },
  {
    columnname: "Raisor",
    key: "raise",
    function: true,
    validate: true,
    validatefunction: this.activitedetail1modify.bind(this),
  },
  {
    columnname: "Approver",
    key: "approve",
    function: true,
    validate: true,
    validatefunction: this.activitedetail2modify.bind(this),
  },
  {
    columnname: "Remarks",
    key: "new_data",
    type: "object",
    objkey: "remarks"
  },
  {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_activityddl.bind(this),}]

  this.Summarymodify9Data = [
    {  
      columnname: "Status",
      key: "new_data",
      button:true,
      validate: true,
      validatefunction: this.flag_status2.bind(this),
    },
    {
      columnname: "Product",
      key: "prod",
    function: true,
    validate: true,
    validatefunction: this.activitedetail3modify.bind(this),
    },

    { "columnname": "Make", "key": "make",
    validate: true,
    validatefunction: this.makemodify.bind(this),
     },
  
    { "columnname": "Model", "key": "model",
    validate: true,
    validatefunction: this.modelmodify.bind(this),
     },

    {
      columnname: "Category",
      key: "cate",
    function: true,
    validate: true,
    validatefunction: this.activitedetail4modify.bind(this),
    },
    {
      columnname: "SubCategory",
      key: "subcate",
      function: true,
      validate: true,
      validatefunction: this.activitedetail5modify.bind(this),
    },
    {
      columnname: "From Date",
      key: "new_data",
      type: "object",
      objkey: "fromdate",
      datetype:  "dd-MMM-yyyy" 
    },
    {
      columnname: "To Date",
      key: "new_data",
      type: "object",
      objkey: "todate",
      datetype:  "dd-MMM-yyyy" 
    },
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_cat.bind(this),}
  ]
  this.Summarymodify11Data = [
    {  
      columnname: "Status",
      key: "new_data",
      button:true,
      validate: true,
      validatefunction: this.flag_status2.bind(this),
    },
    {
      columnname: "MSME",
      key: "ms",
      function: true,
      validate: true,
      validatefunction: this.activitedetail6modify.bind(this),
    },
    {
      columnname: "PAN No",
      key: "new_data",
      type: "object",
      objkey: "detailname"
    },
    {
      columnname: "From Date",
      key: "new_data",
      type: "object",
      objkey: "excemfrom",
      datetype:  "dd-MMM-yyyy" 
    },
    {
      columnname: "Todate Date",
      key: "new_data",
      type: "object",
      objkey: "excemto",
      datetype:  "dd-MMM-yyyy" 
    },
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_tax.bind(this),}
  ]

  this.Summarymodify10Data = [
    {  
      columnname: "Status",
      key: "new_data",
      button:true,
      validate: true,
      validatefunction: this.flag_status3.bind(this),
    },
    {
      columnname: "Supplier Branch",
      key: "new_data",
      type: "object",
      objkey: "supplier"
    },
    {
      columnname: "Paymode",
      key: "pay",
      function: true,
      validate: true,
      validatefunction: this.activitedetail7modify.bind(this),
    },
    {
      columnname: "Bank",
      key: "bank",
      function: true,
      validate: true,
      validatefunction: this.activitedetail8modify.bind(this),
    },
    {
      columnname: "Account Number",
      key: "new_data",
      type: "object",
      objkey: "account_no"
    },
    {
      columnname: "Beneficiary Name",
      key: "new_data",
      type: "object",
      objkey: "beneficiary"
    },
    {"columnname": "View", "icon": "visibility" ,'wholedata':true ,"button":true, function: true, clickfunction: this.modify_payment.bind(this),}
  ]

//  let tab :any = this.getmodification_vender()

   

  }
  ngOnInit(): void {

    this.getmodification_vender();
    this.modify_changestatus = 'modify_changestatus'
  }
  modify_vendor(j) {
    console.log("modify_vendor",j)
    this.vendor_flag = true;
    this.shareService.modification_data.next(j);
    this.popupopen()
  }
  modify_client(j) {
    this.client_flag = true;
    this.shareService.modification_data.next(j);
    this.popupopen()
  }
  modify_contract(j) {

    this.contractor_flag = true;
    this.shareService.modification_data.next(j);
    this.popupopen()
  }

  modify_branch(data) {
    this.branch_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen()
  }

  modify_payment(data) {
    this.payment_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen()
  }
  modify_doc(data) {
    this.document_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen()
  }
  modify_tax(data) {
    this.branchtax_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen()
  }
  modify_cat(data){
    this.catalouge_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen() 
  }
  modify_activity(data){
    this.activity_flag=true;
    this.shareService.modification_data.next(data); 
    this.popupopen()
  }
  modify_activityddl(data){
    this.activitydetails_flag=true;
    this.shareService.modification_data.next(data); 
    this.popupopen()
  }
  modify_product(data){
    this.product_flag=true;
    this.shareService.modification_data.next(data); 
    this.popupopen()
  }
  clientCancel() {
    this.vendor_flag = false;
    this.product_flag=false;
    this.activitydetails_flag=false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.document_flag = false;
    this.branchtax_flag = false;
    this.catalouge_flag = false;
    this.activity_flag=false;

    this.onCancel.emit()
    this.closeaddpopup.nativeElement.click();
  }
  // 
  getmodification_vender() {
    // this.SpinnerService.show()
    this.vendor_data = [];
    this.contract_data = [];
    this.client_data = [];
    this.product_data = [];
    this.branch_data = [];
    this.document_data = [];
    this.payment_data = [];
    this.branchtax_data = [];
    this.catalouge_data = [];
    this.activity_detail = [];
    this.activity_data = [];
    this.vendorId = this.shareService.vendorID.value

    this.atmaService.getmodification(this.vendorId)
    // this.atmaService.getmodification(this.branch_code)
      .subscribe(result => {

        this.modificationdata = result['data'];
        console.log("modificationdata",this.modificationdata)
        // this.modificationdata = result['data']
        // this.spin.hide()
        // this.modificationdata.forEach(element => {
        //   if (element.action == 2)//edit
        //   {
        //     if (element.type_name == 1) {
        //       this.vendor_data.push(element)
        //     }
        //     if (element.type_name == 11) {
        //       this.branchtax_data.push(element)
        //     }
        //     if (element.type_name == 15) {
        //       this.catalouge_data.push(element)
        //     }

        //     if (element.type_name == 8) {
        //       this.contract_data.push(element)
        //     }
        //     if (element.type_name == 7) {
        //       this.client_data.push(element)
        //     }
        //     if (element.type_name == 9) {
        //       this.product_data.push(element)
        //     }

        //     if (element.type_name == 6) {
        //       this.branch_data.push(element)
        //     }

        //     if (element.type_name == 10) {
        //       this.document_data.push(element)
        //     }

        //     if (element.type_name == 12) {

        //       this.payment_data.push(element)
        //     }
        //     if (element.type_name == 14) {
        //       this.activity_detail.push(element)
        //     }
        //     if (element.type_name == 13) {
        //       this.activity_data.push(element)
        //     }

        //   }
        //   if (element.action == 1)//create
        //   {
        //     if (element.type_name == 8) {
        //       this.contract_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 7) {
        //       this.client_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
            
        //     if (element.type_name == 9) {
        //       this.product_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 6) {
        //       this.branch_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 10) {
        //       this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }

        //     if (element.type_name == 12) {

        //       this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 11) {
        //       this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 15) {
        //       this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 14) {
        //       this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 13) {
        //       this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }

        //   }if(element.action==3){
        //     if(element.type_name==12 ){
        //       this.payment_data.push(element)
        //     }
        //     if (element.type_name == 6) {
        //       this.branch_data.push(element)
        //     }
        //   }
        //   if(element.action==4){
        //     if(element.type_name==12 ){
        //       this.payment_data.push(element)
        //     }
        //     if (element.type_name == 6) {
        //       this.branch_data.push(element)
        //     }
        //   }
        //   if (element.action == 0) {
        //     if (element.type_name == 10) {
        //       this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }

        //     if (element.type_name == 12) {

        //       this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 11) {
        //       this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 15) {
        //       this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 14) {
        //       this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //     if (element.type_name == 13) {
        //       this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
        //     }
        //   }

        // });
        this.modificationdata.forEach(element => {
          if (element.action == 2)//edit
          {
            if (element.type_name == 1) {
              this.vendor_data.push(element)
              this.modify()
            }
            if (element.type_name == 11) {
              this.branchtax_data.push(element)
              this.modify11()
            }
            if (element.type_name == 15) {
              this.catalouge_data.push(element)
              this.modify10()
            }

            if (element.type_name == 8) {
              this.contract_data.push(element)
              this.modify3()
              this.modify5()
            }
            if (element.type_name == 7) {
              this.client_data.push(element)
              this.madify2()
            }
            if (element.type_name == 9) {
              this.product_data.push(element)
            this.modify6()
            }

            if (element.type_name == 6) {
              this.branch_data.push(element)
              this.modify4()
            }

            if (element.type_name == 10) {
              this.document_data.push(element)
              this.modify7()
            }

            if (element.type_name == 12) {

              this.payment_data.push(element)
              this.modify12()
            }
            if (element.type_name == 14) {
              this.activity_detail.push(element)
              this.modify9()
            }
            if (element.type_name == 13) {
              this.activity_data.push(element)
              this.modify8()
            }

          }
          if (element.action == 1)//create
          {
            if (element.type_name == 8) {
              this.contract_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify3()
            }
            if (element.type_name == 7) {
              this.client_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.madify2()
            }
            
            if (element.type_name == 9) {
              this.product_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify6()
            }
            if (element.type_name == 6) {
              this.branch_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify4()
            }
            if (element.type_name == 10) {
              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify7()
            }

            if (element.type_name == 12) {

              this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify12()
            }
            if (element.type_name == 11) {
              this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify11()
            }
            if (element.type_name == 15) {
              this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify10()
            }
            if (element.type_name == 14) {
              this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify9()
            }
            if (element.type_name == 13) {
              this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              this.modify8()
            }

          }if(element.action==3){
            // active/inactive
            if(element.type_name==12 ){
              this.payment_data.push(element)
              this.modify12()
            }
            if (element.type_name == 6) {
              this.branch_data.push(element)
              this.modify4()
            }
          }
          if(element.action==4){
            // blocked/unblocked
            if(element.type_name==12 ){
              this.payment_data.push(element)
              this.modify12()
            }
            if (element.type_name == 6) {
              this.branch_data.push(element)
              this.modify4()
            }
          }
          if (element.action == 0) {
            if (element.type_name == 10) {
              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 12) {

              this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 11) {
              this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 15) {
              this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 14) {
              this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 13) {
              this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
          }

        });


          // const asyncTabs: ExampleTab[] = [];
          // observer.next([
            // { "tab_name": "VENDOR", "tab_id": "1" },
            // // { "tab_name": "CLIENT", "tab_id": "7" },
            // { "tab_name": "BRANCH DETAILS", "tab_id": "6" },
            // // { "tab_name": "CONTRACTOR", "tab_id": "8" },
            // { "tab_name": "PRODUCT", "tab_id": "9" },
            // { "tab_name": "DOCUMENT", "tab_id": "10" },
            // { "tab_name": "ACTIVITY", "tab_id": "13" },
            // { "tab_name": "ACTIVITYDETAIL", "tab_id": "14" },
            // { "tab_name": "CATELOG", "tab_id": "15" },
            // { "tab_name": "PAYMENT", "tab_id": "12" },
            // { "tab_name": "SUPPLIERTAX", "tab_id": "11" }
            this.asyncTabs = [];


          if(this.modificationdata.length >0 ) {

            if (this.vendor_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "VENDOR", "tab_id": "1" });
              this.modify()
            }
  
            if (this.client_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "CLIENT", "tab_id": "7" });
              this.madify2()

            }
  
            if (this.branch_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "BRANCH DETAILS", "tab_id": "6" });
              this.modify4()

            }
  
            if (this.contract_data.length > 0) {
             this.asyncTabs.push({ "tab_name": "CONTRACTOR", "tab_id": "8" });
             this.modify3()

            }
            if (this.product_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "PRODUCT", "tab_id": "9" });
              this.modify6()

            }
            
            if (this.document_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "DOCUMENT", "tab_id": "10" });
              this.modify7()

            }
            if (this.activity_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "ACTIVITY", "tab_id": "13" });
              this.modify8()

            }
            if (this.activity_detail.length > 0) {
              this.asyncTabs.push({ "tab_name": "ACTIVITYDETAIL", "tab_id": "14" });
              this.modify9()

            }
            if (this.catalouge_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "CATELOG", "tab_id": "15" });
              this.modify10()
            }
            if (this.payment_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "PAYMENT", "tab_id": "12" });
              this.modify12()
            }
            if (this.branchtax_data.length > 0) {
              this.asyncTabs.push({ "tab_name": "SUPPLIERTAX", "tab_id": "11" });
              this.modify11()
            }
           
          }
          
          else if(this.modificationdata.length === 0){
            this.notification.showWarning("No Changes Found")
            this.backButton()
            return false
          }
          // else if(this.asyncTabs.length === 0){
          //   this.notification.showError("No Changes Found")
          //   this.backButton()
          //   return false
          // }
          // else{
          //   this.asyncTabs.push({ "tab_name": "No Changes Found", "tab_id": "17" });

          // }
            
          // ]);

      })


  }   

  backButton(){
    this.router.navigate(['/atma/vendorView'], { skipLocationChange: true })
  }
  get_tabe(value) {
    this.modify_changestatus = value.tab.textLabel
    console.log(this.contract_data)

  }

modify(){
  this.SummaryApimodifyObjNew = {
    FeSummary: true, 
    data: this.vendor_data,
}
}

addressmodify(dataaddress){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: dataaddress.new_data.address_id.line1,
    function: false,
  };
  return config
}

citymodify(datacity){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: datacity.new_data.address_id.city_id.name,
    function: true,
  };
  return config
}

districtmodify(datadis){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: datadis.new_data.address_id.district_id.name ,
    function: true,
  };
  return config
}

statemodify(statedata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: statedata.new_data.address_id.state_id.name,
    function: true,
  };
  return config
}

activitemodify(activdata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: activdata.new_data.service_branch.name,
    function: true,
  };
  return config
}
flag_status(data){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: "",
    function: false,
  };
  if(data.new_data.modify_status == 1){
    //Create 
    config={
        style: {color: "green"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 2){
    //Edit 
    config={
        style: {  color: "orange"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 0){
    //Delete  
    config={
        style: { color: "red"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 3){
    //Active/Inactive  
    config={
      style: { color: "red"},
      icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 4){
    //Blocked/Unblocked
      config={
        style: { color: "red"},
        icon: "",
        class: "fa fa-flag create",
        value: "",
      }
  }
  return config
}
flag_status1(data){
  let config: any = {
    style: "",
    icon: "",
    class: "",
    value: "",
  };
  if(data.new_data.modify_status == 1){
    //Edit 
    config={
        style: {color: "orange"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }

  return config
}
flag_status2(data){
  let config: any = {
    style: "",
    icon: "",
    class: "",
    value: "",
  };
  if(data.new_data.modify_status == 1){
    //Create 
    config={
        style: {color: "green"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 2){
    //Edit 
    config={
        style: {color: "orange"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 0){
    //Delete 
    config={
        style: {color: "red"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }

  return config
}
flag_status3(data){
  let config: any = {
    style: "",
    icon: "",
    class: "",
    value: "",
  };
  if(data.new_data.modify_status == 1){
    //Create 
    config={
        style: {color: "green"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 2){
    //Edit 
    config={
        style: {color: "orange"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 0){
    //Delete 
    config={
        style: {color: "red"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }
  else if(data.new_data.modify_status == 3){
    //Active/InActive 
    config={
        style: {color: "red"},
        icon: "",
        class: "fa fa-flag",
        value: "",
      }
  }

  return config
}


activitedetail1modify(activedetail1data){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: activedetail1data.new_data.raisor.full_name,
    function: true,
  };
  return config
}

activitedetail2modify(activedetaildata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: activedetaildata.new_data.approver.full_name,
    function: true,
  };
  return config
}

activitedetail3modify(productdata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: productdata.new_data.productname.name,
    function: true,
  };
  return config
}
makemodify(data){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: data.new_data.make.name,
    function: true,
  };
  return config
}
modelmodify(data){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: data.new_data.model.name,
    function: true,
  };
  return config
}

activitedetail4modify(categorydata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: categorydata.new_data.category.name,
    function: true,
  };
  return config
}

activitedetail5modify(subcategorydata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: subcategorydata.new_data.subcategory.name,
    function: true,
  };
  return config
}

activitedetail6modify(msmedata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: "",
    function: true,
  };

  if(msmedata.new_data.msme == true){
    config = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "Yes",
      function: true,
    };
  }
  else if(msmedata.new_data.msme == false){
    config = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "No",
      function: true,
    };
  }
  return config
}

activitedetail7modify(paymodedata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: paymodedata.new_data.paymode_id.name,
    function: true,
  };
  return config
}


activitedetail8modify(paymodedata){
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: paymodedata.new_data.bank_id.name,
    function: true,
  };
  return config
}

madify2(){
  this.SummaryApimodify1ObjNew = {
    FeSummary: true, 
    data: this.client_data,
  }
}

modify3(){
  this.SummaryApimodify2ObjNew = {
    FeSummary: true, 
    data: this.contract_data,
  }
}

modify4(){
  this.SummaryApimodify3ObjNew  = {
    FeSummary: true, 
    data: this.branch_data,
  }
}

modify5(){
  this.Summarymodify4Data ={
    FeSummary: true, 
    data: this.contract_data,
  }
}

modify6(){
  this.SummaryApimodify5ObjNew ={
    FeSummary: true, 
    data: this.product_data,
  }
}

modify7(){
  this.SummaryApimodify6ObjNew ={
    FeSummary: true, 
    data: this.document_data,
  }
}

modify8(){
  this.SummaryApimodify7ObjNew = {
    FeSummary: true, 
    data: this.activity_data,
  }
}

modify9(){
this.SummaryApimodify8ObjNew = {
  FeSummary: true, 
  data: this.activity_detail,
}
}

modify10(){
  this.SummaryApimodify9ObjNew = {
    FeSummary: true, 
    data: this.catalouge_data,
  }
}
modify11(){
  this.SummaryApimodify11ObjNew = {
    FeSummary: true, 
    data: this.branchtax_data,
  }
}

modify12(){
  this.SummaryApimodify10ObjNew = {
    FeSummary: true, 
    data: this.payment_data,
  }
}
popupopen(){
  var myModal = new (bootstrap as any).Modal(document.getElementById('changesModal'), {
    keyboard: false
  })

  myModal.show()
}

closepopup(){
 this.clientCancel()
}
}