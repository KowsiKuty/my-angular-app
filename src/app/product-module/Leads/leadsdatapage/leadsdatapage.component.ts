import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Tablecolumns } from '../models/tablecolumns';

import { MatPaginator } from '@angular/material/paginator';

import { LeadsmainService } from '../leadsmain.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';
import { ViewportScroller } from '@angular/common';
import { NgForm } from '@angular/forms';
import { EmployeeTaskEditComponent } from '../../employee-task-edit/employee-task-edit.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-leadsdatapage',
  templateUrl: './leadsdatapage.component.html',
  styleUrls: ['./leadsdatapage.component.scss']
})
export class LeadsdatapageComponent implements OnInit {

  leadssummarylist: [];
  searchText: any;
  showdatatable: boolean;
  showleadsview: boolean;
  leadsview: any;
  // router: any;
  tabIndex = 0;
  ngForm: NgForm
  component: EmployeeTaskEditComponent

  constructor(private prodservice: LeadsmainService, private SpinnerService: NgxSpinnerService, private activatedRoute: ActivatedRoute,
    private apiService: MasterApiServiceService, private scroller: ViewportScroller,
    private notification: NotificationService, private router: Router) { }



  // the Below array defines the structure for  each row to template.
  leadDetails: any = []

  addressDetails: any = []
  familyDetails: any = []
  bankDetails: any = []
  vendor: string[] = ['Assigned', 'Unassigned'];
  leads: string[] = ['Assigned', 'Unassigned', 'Open', 'Closed', 'Rejected'];
  displayedColumns: string[] = ['cus_name', 'age', 'occupation', 'interestedIn', 'view'];

  updateHistory: [];
  dynamicupdatehistorydata = []
  // <td>{{ data.field 
  //   < td > {{ data.value }}</>
  //     < td > {{ data.updon }}</>
  //       < td > {{ data.updfrom }}</>
  // {
  //   field: 'DOB',
  //   value:'02-Jun-2022',
  //   updon:new Date().toLocaleDateString(),
  //   updfrom:'Source 1'
  // }

  // public dataSource = new MatTableDataSource(this.Data1);
  public dataSource: MatTableDataSource<Tablecolumns>;

  @ViewChild('sortCol1') sortCol1: MatSort;
  @ViewChild('pageCol1') pageCol1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('campaign') campaign;
  @Output('campaignEmit') campaignEmit = new EventEmitter();
  center: any;
  public dataArray: any;

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  historycurrentpage = 1;
  pageSize = 15

  taskUpdate: boolean = false;

  ngAfterViewInit() {
    if (this.taskUpdate) {
      // setTimeout(()=>{
      //   this.scroller.scrollToAnchor('target')
      // },250)
    }
  }

  ngOnDestroy() {
    this.editSub.unsubscribe()
  }
  ngOnInit(): void {

    this.getLeadsData();
    // this.updateHistory();


    this.showdatatable = true;
    let params = this.activatedRoute.snapshot.queryParams;
    if (params.for == 'taskUpdate') {
      this.showdatatable = false;
      this.showleadsview = true;
      this.viewLeadDetails(params.lead)
      this.taskUpdate = true;
      this.tabIndex = 1;
      this.currentIndex = 1
    }
    this.editSub = this.apiService.isReload.subscribe(res => {
      console.log(res)
      if (res == 'reload') {
        this.viewLeadDetails(this.apiService.leadId);
      }
    })
    // this.showleadsview = false; 
  }

  campaignData: any = null
  getCampaignData() {
    this.apiService.getCampaignData(this.campaign.id).subscribe(res => {
      // "created_by": {
      //   "code": "EMP112",
      //     "full_name": "kavika",
      //       "id": 6
      // },
      // "created_date": 1669453126183,
      //   "customer_count": 2,
      //     "lead_count": 3,
      //       "total_count": 5
      this.campaignData = res;
    })
  }
  getLeadsData() {
    let params = '';

    this.apiService.isReload.next('no');
    // this.apiService.unsubscibe();

    this.SpinnerService.show()
    if (this.campaign) {
      params += '&action=campaign_summary&campaign_id=' + this.campaign.id;
      this.getCampaignData();
      this.getVendorListCounts(this.campaign.id)
    }
    this.prodservice.leadmasterdata(this.pagination.index, params).subscribe(results => {
      this.SpinnerService.hide();
      console.log('TAbIndex', this.tabIndex)
      console.log('current', this.currentIndex)
      if (!results) {
        return false;
      }

      // this.summarylists = results['data'];
      // this.dataArray = results['data'] ;
      // this.dataSource = new MatTableDataSource<Tablecolumns> (this.dataArray);
      // this.cdr.detectChanges();
      // this.dataSource.paginator = this.pageCol1;
      // this.dataSource.sort = this.sortCol1;

      //NORMAL TABLE
      this.leadssummarylist = results['data'];
      // this.leadssummarylist = this.sort;
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        // this.notification.showSuccess("Records Uploaded Successfully")
      }
      else {
        // this.notification.showError(results.description)

      }

    })
  }
  prevpage() {

    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1

    }
    this.getLeadsData()

  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1

    }
    this.getLeadsData()
  }

  lead_id: number = null;
  viewLeadDetails(id) {
    // this.router.navigate(['crm/viewleads'])
    this.showdatatable = false;
    this.showleadsview = true;
    this.apiService.leadId = id;
    this.lead_id = id;
    this.bankDetails = [];
    this.familyDetails = [];
    this.leadDetails = [];
    this.prodservice.getleadsview(id).subscribe(results => {
      if (!results) {
        return false;
      }
      this.updateHistory = results.historyinfo
      console.log("result", this.updateHistory)

      this.dynamicupdatehistorydata = this.dynamicupdatehistory(results.historyinfo)

      console.log("result data", results)
      if (results.status == 'success') {
        // this.notification.showSuccess("Records Uploaded Successfully")
      }
      else {
        // this.notification.showError(results.description)

      }


      //NORMAL TABLE
      let leadsView = results;
      this.leadsview = results
      let contact = leadsView.contactinfo[0];
      let address = leadsView.addressinfo[0]
      let bank = leadsView.bankinfo[0];

      let family = leadsView.familyinfo;
      const relationshipFilter = (key, value) => {
        return family.filter(element => element[key] == value)[0]
      }
      let mother = relationshipFilter('relationship', 'mother')
      let father = relationshipFilter('relationship', 'father')
      let spouse = relationshipFilter('relationship', 'spouse')
      // the Below array defines the structure for  each row to template.
      //If we have to change the order or position we can change the number suffixes




      const leadObj = {
        Mail_id: contact?.Mail_id ? contact.Mail_id : null,
        Phone_No: contact?.Phone_No ? contact.Phone_No : null,
        dob: leadsView.dob ? leadsView.dob : null,
        gender: leadsView?.gender?.text ? leadsView.gender.text : null,
        marital_status: leadsView?.marital_status?.text ? leadsView.marital_status.text : null,
        pan_no: leadsView?.pan_no ? leadsView.pan_no : null,
        aadhaar_no: leadsView?.aadhaar_no ? leadsView.aadhaar_no : null,
      }
      // [{"c_value":943683474,"type":"Phone_No","lead_id":1}]type=Phone_No,Mail_id

      //The key here refers payload object key for edit Modal, which has value name editedValue in editable component,
      //Name here refers Edit Modal Header Update (e.g Mail)
      //Url here means some keys may have different so pass the url to directive.
      //while setting the fields and additions property keep in mind the order for key1 -> fields[0]and key2 -> fields[1]... etc
      this.leadDetails = [
        {
          name1: 'Mail', value1: leadObj.Mail_id, key1: 'mail_id',
          name2: 'Phone', value2: leadObj.Phone_No, key2: 'ph_no',
          // additions: [{ type: 'Mail_id' }, { type: 'Phone_No' }],
          fields: ['email', 'number'],
          // url: ['contact']
        },
        {
          name1: 'DOB', value1: leadObj.dob, key1: 'lead_dob'
          , name2: 'Marital Status', value2: leadObj.marital_status, key2: 'marital_status',
          fields: ['date', 'text']
        },
        {
          name1: 'Aadhaar', value1: leadObj.aadhaar_no, key1: 'aadhar_no', name2: 'Gender', value2: leadObj.gender, key2: 'gender',
          fields: ['number', 'text']
        },
        { name1: 'PAN', value1: leadObj.pan_no, key1: 'pan_no', name2: '', value2: '' }
      ]
      //leadObj is now have all the attributes either null or value so error wont  come. to avoid "Null undefined"
      const addressObj = {
        line1: address?.line1 ? address.line1 : null,
        city: address?.city?.name ? address.city.name : null,
        state: address?.state?.name ? address.state.name : null,
        pincode: address?.pincode?.no ? address.pincode.no : null,
        district: address?.district?.name ? address.district.name : null,
      }
      // [{ "line1": "nehrunagar", "city_name": "Trichy", "district_name": "Tiruchirapalli", 
      // "state_name": "Tamilnadu", "pincode": "621251", "lead_id": 1 }]
      console.log("address", addressObj)
      this.addressDetails = [
        {
          name1: 'Line1', value1: addressObj.line1, key1: 'line1',
          name2: 'State', value2: addressObj?.state, key2: 'state_name',
          fields: [null, 'searchable']
          // url: ['address']
        },
        {
          name1: 'City', value1: addressObj?.city, key1: 'city_name',
          name2: 'District', value2: addressObj?.district, key2: 'district_name',
          fields: ['searchable', 'searchable']
          // url: ['address']
        },
        {
          name1: 'PinCode', value1: addressObj?.pincode, key1: 'pincode',
          fields: ['searchable']
          // url: ['address']
        }
      ]

      const detailObj = {
        father_name: father?.name ? father.name : null,
        father_dob: father?.dob ? father.dob : null,
        mother_name: mother?.name ? mother.name : null,
        mother_dob: mother?.dob ? mother.dob : null,
        spouse_name: spouse?.name ? spouse.name : null,
        spouse_dob: spouse?.dob ? spouse.dob : null,
      }

      // [{"id":6,"name":"i","relationship":"spouse","dob":"2001-09-07","lead_id":1}]relationship=father,mother,spouse
      this.familyDetails = [
        {
          name1: 'Father', value1: detailObj.father_name, key1: 'father_name',
          //  additions: [{ relationship: "father" }, { relationship: "father" }],
          name2: 'DOB', value2: detailObj.father_dob, key2: 'father_dob', fields: [null, 'date'],
          // url: ['family']
        },
        {
          name1: 'Mother', value1: detailObj.mother_name, key1: 'mother_name',
          // additions: [{ relationship: "mother" }, { relationship: "mother" }],
          name2: 'DOB', value2: detailObj.mother_dob, key2: 'mother_dob', fields: [null, 'date'],
          // url: ['family']
        },
        {
          name1: 'Spouse', value1: detailObj.spouse_name, key1: 'spouse_name',
          // additions: [{ relationship: "spouse" }, { relationship: "spouse" }],
          name2: 'DOB', value2: detailObj.spouse_dob, key2: 'spouse_dob', fields: [null, 'date'],
          // url: ['family']
        }
      ]


      const bankObj = {
        bankName: bank?.bank?.name ? bank.bank.name : null,
        accountNo: bank?.account_number,
        branch: bank?.branch?.name ? bank.branch.name : null,
        ifsc_code: bank?.ifsc_code ? bank.ifsc_code : null

      }

      // [{"lead_id":1,"bank_id":"ABHYUDAYA CO-OP BANK LTD","branch_id":"AB","account_number":"12334","ifsc_code":"SBIN0005940"}]
      this.bankDetails = [
        {
          name1: 'Bank', value1: bankObj.bankName, key1: 'bank_id',
          name2: 'Account No', value2: bankObj.accountNo, key2: 'account_number',
          fields: ['searchable', null]
          // url: ['bank']
        },
        {
          name1: 'Branch', value1: bankObj.ifsc_code, key1: 'branch_id',
          name2: 'IFSC code', value2: bankObj.branch, key2: 'ifsc_code',
          fields: ['searchable', null]
          // url: ['bank']
        }
      ]

      //Incorporation Lead id here to all arrays in the field of additions, we can share number of objects also.
      let arrays = ['leadDetails', 'bankDetails', 'familyDetails', 'addressDetails'];
      arrays.forEach(array => {
        //addition key defines common objects for both  elements in array
        //additionS key defines required object for particular element,
        this[array].forEach(element => {
          element.addition = {}
          element.addition.lead_id = this.lead_id
        })
      })

    })

    // this.apiService.subscriptions.push(sub);

  }

  editSub: Subscription;
  gotoDatapage() {
    if (this.taskUpdate) {
      window.history.back()
      // this.router.navigate(['crm', 'employeetask'])
    }
    // this.editSub.unsubscribe();
    this.showdatatable = true;
    this.showleadsview = false;
    this.tabIndex = 0;
  }

  currentIndex: number = 0;
  loadOn(evt) {
    this.tabIndex = evt.index;
    // this.tabIndex = evt.index
    // this.component.ngOnInit();
  }


  dynamicupdatehistory(historyarray) {

    let array = []

    for (let i = 0; i < historyarray.length; i++) {
      console.log('history datacheck', historyarray[i], historyarray[i].lead_data)
      if (historyarray[i].lead_data) {

        for (let lead in historyarray[i].lead_data) {

          if (lead != 'lead_id') {
            let obj = {
              field: lead,
              value: historyarray[i].lead_data[lead],
              // lead_source_id:historyarray[i].lead_source_id,

              // lead_id: historyarray[i].lead_id,
            }
            // delete obj['lead_id'];
            array.push(obj)

          }
        }

        let obj1 = {
          lead_source_id: historyarray[i].lead_source_id,
          created_date: historyarray[i].created_date,
        }
        array.push(obj1)

      }
    }
    console.log('completed dynamic data', array)

    return array

  }



  VendorCountsList: any 

  getVendorListCounts(id){
    this.apiService.getVendorListCounts(id).subscribe(res => {
      this.VendorCountsList = res["result"];
    })
  }




  

}
