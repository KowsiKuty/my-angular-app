import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { VowService } from 'src/app/service/vow.service';
import { FollowupleadandtaskComponent } from '../followupleadandtask/followupleadandtask.component';
import { LeadserviceService } from '../leadservice.service';

export interface employee {
  full_name: any;
  id: any;
}

export interface group {
  id: any;
  name: any;
}

export interface groupbaseedemployee {
  id: any;
  employee_ids: {
    full_name: any
  };
  limit: any
}

export interface groupbaseedemployees {
  id: any;
  full_name: any

}

export interface vendorbasedgroup {
  id: any;
  vendorgroup_id: {
    name: any;
  };
}

@Component({
  selector: 'app-leaddata',
  templateUrl: './leaddata.component.html',
  styleUrls: ['./leaddata.component.scss'],
  providers: [FollowupleadandtaskComponent]
})
export class LeaddataComponent implements OnInit {

  @ViewChild('employeeinput') employeeinput

  leadssummarylist: [];
  searchText: any;
  showdatatable: boolean;
  showleadsview: boolean;
  showassignemployee: boolean = false;

  leadsview: any = [];
  // router: any;
  tabIndex = 0;
  employeedata = [];
  leaddata_hasnext = true;
  leaddata_hasprevious = true;
  currentleaddatapage = 1;
  roleid: any;
  filterdata = [];
  vendorid: any;
  currentsearchrole = 0;

  leadDetails = []

  addressDetails = []
  familyDetails = []
  bankDetails = []
  vendor: string[] = ['Assigned', 'Unassigned'];
  leads: string[] = ['Assigned', 'Unassigned', 'Open', 'Closed', 'Rejected'];
  displayedColumns: string[] = ['cus_name', 'age', 'occupation', 'interestedIn', 'view'];


  isLoading = true;

  groupdatapagination = {
    has_next: true,
    has_previous: true,
    currentpage: 1
  }

  selectedemployees = [];
  selectedemployeesid = [];
  groupbasedemployee = [];
  employeeid: any;
  notesList: any;



  constructor(private leadservice: LeadserviceService, private SpinnerService: NgxSpinnerService, private activatedRoute: ActivatedRoute,
    private notification: NotificationService, private router: Router, private fb: FormBuilder, private datePipe: DatePipe, private vowservice: VowService,
    private followUpCall: FollowupleadandtaskComponent) { }

  // Data1 : Tablecolumns[] =[{
  //   "s_no":1,
  //   "cus_name": "George",
  //   "occupation": "Electrician",
  //   "age": 32,
  //   "interestedIn": "Loan",
  //   "view":''

  // }, {
  //   "s_no":2,
  //   "cus_name": "Winston",
  //   "occupation": "IT",
  //   "age": 26,
  //   "interestedIn": "Credit Card",
  //   "view":''
  // }, {
  //   "s_no": 3,
  //   "cus_name": "Robin",
  //   "occupation": "Musician",
  //   "age": 23,
  //   "interestedIn": "Insurance",
  //   "view":''
  // }, {
  //   "s_no": 4,
  //   "cus_name": "Harry",
  //   "occupation": "Farmer",
  //   "age": 36,
  //   "interestedIn": "Account Open",
  //   "view":''
  // },
  // {
  //   "s_no": 5,
  //   "cus_name": "Dravid",
  //   "occupation": "Mechanic",
  //   "age": 33,
  //   "interestedIn": "Credit Card",
  //   "view":''
  // },
  // {
  //   "s_no": 6,
  //   "cus_name": "Ronaldo",
  //   "occupation": "Sportsman",
  //   "age": 36,
  //   "interestedIn": "Loan",
  //   "view":''
  // },
  // {
  //   "s_no": 7,
  //   "cus_name": "Gary",
  //   "occupation": "Driver",
  //   "age": 27,
  //   "interestedIn": "Insurance",
  //   "view":''
  // },
  // {
  //   "s_no": 8,
  //   "cus_name": "Leo",
  //   "occupation": "Software Developer",
  //   "age": 25,
  //   "interestedIn": "Personal Loan",
  //   "view":''
  // },
  // {
  //   "s_no": 9,
  //   "cus_name": "Max",
  //   "occupation": "Engineer",
  //   "age": 29,
  //   "interestedIn": "Manager",
  //   "view":''
  // },
  // {
  //   "s_no": 10,
  //   "cus_name": "Robin",
  //   "occupation": "Musician",
  //   "age": 23,
  //   "interestedIn": "Insurance",
  //   "view":''
  // },
  // {
  //   "s_no": 11,
  //   "cus_name": "Dev",
  //   "occupation": "Actor",
  //   "age": 27,
  //   "interestedIn": "Credit Card",
  //   "view":''
  // }];


  // public dataSource = new MatTableDataSource(this.Data1);
  // public dataSource: MatTableDataSource<Tablecolumns>;

  @ViewChild('sortCol1') sortCol1: MatSort;
  @ViewChild('pageCol1') pageCol1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  center: any;
  public dataArray: any;

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  vendorgroupdata = [];
  leadsearchform: FormGroup

  taskUpdate: boolean = false;

  assignleadform: FormGroup

  ngOnInit(): void {

    // this.getLeadsData();

    this.assignleadform = this.fb.group({
      lead_product_id: [''],
      employee_id: [''],
      vendorgroup_id: ['']
    })

    // const data = JSON.parse(localStorage.getItem('UserData'))
    const data = JSON.parse(localStorage.getItem('sessionData'))
    // let roleid = data?.role.id
    // this.roleid = data?.role.id
    // this.vendorid = data?.vendor_id
    this.employeeid = data?.employee_id

    this.leadsearchform = this.fb.group({
      employee: [''],
      filter: ['']
    })

    if (this.roleid == 1) {
      this.filterdata = [
        { name: 'Unassigned', id: 2 }, 
        { name: 'All Lead', id: 1 }, 
        {name:'All Lead To Customer',id:5}, 
        // {name:'All Not Interest',id:6}
      ]

      this.leadsearchform.patchValue({
        filter: 1
      })
    }
    else {
      this.filterdata = [
        { name: 'My Lead', id: 0 }, 
        { name: 'Lead to Customer', id: 3 }, 
        // { name: 'Not Intersted', id: 4 }
      ]
      this.leadsearchform.patchValue({
        filter: 0
      })
    }

    this.showdatatable = true;
    // let params = this.activatedRoute.snapshot.queryParams;
    // if (params.for == 'taskUpdate') {
    //   this.showdatatable = false;
    //   this.showleadsview = true;
    //   this.viewLeadDetails(params.lead)
    //   this.taskUpdate = true;
    //   this.tabIndex = 1
    // }
    // this.showleadsview = false;

    // if(this.leadservice.nextleadboolean){
    //   this.viewLeadDetails(this.leadservice.leadtaskobj)
      
      
    // }

      // vendor id
      this.getvendorId();


  }

  getvendorId(){
    this.leadservice.getVendor()
     .subscribe(result =>{
      console.log("vendor id",result)
      if(result.status == "success"){
      this.vendorid = result?.vendor_id;
      this.getagentlead(this.currentleaddatapage = 1)

      }
     })
  }

  getLeadsData() {

    this.vowservice.loader = true

    this.leadservice.leadmasterdata(this.pagination.index).subscribe(results => {
      this.vowservice.loader = false

      if (!results) {
        return false;
      }
      this.SpinnerService.hide();
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
    }, (error) => {
      this.vowservice.loader = false

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

  // viewLeadDetails(data) {
  //   // this.router.navigate(['crm/viewleads'])
  //   this.showdatatable = false;
  //   this.showleadsview = true;
  //   this.leadservice.leadId = data?.id;
  //   this.leadservice.taskObject = data

  //   this.taskUpdate = true;
  //   // this.followupleadandtask.ngOnInit()

  //   this.leadservice.getleadsview(data?.id).subscribe(results => {
  //     if (!results) {
  //       return false;
  //     }



  //     //NORMAL TABLE
  //     this.leadsview = results['data'];

  //   })

  // }

  viewLeadDetails(data) {
    // this.router.navigate(['crm/viewleads'])
    this.showdatatable = false;
    this.showleadsview = true;
    this.showassignemployee = false;

    this.leadservice.leadtaskobj = data;
    this.leadservice.leadsummaryid = data.id;

    console.log('unassigned id', this.leadservice.leadsummaryid)
    this.leadservice.leadId = data.lead_id.id ? data.lead_id.id : data.lead_id.lead_id ? data.lead_id.lead_id : data.lead_id.id;

    // this.vowservice.loader=true

    // this.getNotes()

    this.leadservice.getleadsview(this.leadservice.leadId)
    .subscribe((results:any) => {
      console.log("lead view",results)
      
      // this.vowservice.loader=false

      if (!results) {
        return false;
      }


      this.getNotes()


      //NORMAL TABLE
      let leadsView = results;
      this.leadsview = results
      let labelkey = results.label_key;
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
      this.leadDetails = [
        { name1: labelkey.mail_id, value1: contact.Mail_id, name2: labelkey.ph_no, value2: contact.Phone_No },
        { name2: labelkey.dob, value2: leadsView.dob, pipe2: 'date', name1: labelkey.gender, value1: leadsView.gender?.text },
        { name1: labelkey.aadhaar_no, value1: leadsView.aadhaar_no, name2: labelkey.marital_status, value2: leadsView.marital_status?.text },
        { name1: labelkey.pan_no, value1: leadsView.pan_no, name2: '', value2: '' }
      ]
      console.log(this.leadDetails)

      this.addressDetails = [
        { name1: 'Line1', value1: address.line1, name2: labelkey.state_id, value2: address.state.name },
        { name1: labelkey.city_id, value1: address.city.name, name2: labelkey.district_id, value2: address.district.name },
        { name1: labelkey.pincode_id, value1: address.pincode.no }
      ]

      this.familyDetails = [
        { name1: 'Father', value1: father?.name, name2: labelkey.dob, value2: father?.dob },
        { name1: 'Mother', value1: mother?.name, name2: labelkey.dob, value2: mother?.dob },
        { name1: 'Spouse', value1: spouse?.name, name2: labelkey.dob, value2: spouse?.dob }

      ]

      this.bankDetails = [
        { name1: 'Bank', value1: bank.bank.name, name2: 'Account No', value2: bank.account_number },
        { name1: 'Branch', value1: bank.branch.name, name2: 'IFSC code', value2: bank.ifsc_code }
      ]
    }, (error) => {
      this.vowservice.loader = false

    })

  }

  clickassignemployee(data) {
    this.showdatatable = false;
    this.showleadsview = false;
    this.showassignemployee = true;
    this.leadservice.leadId = data.lead_id.id ? data.lead_id.id : data.lead_id.lead_id ? data.lead_id.lead_id : data.lead_id.id;

    this.leadservice.leadsummaryid = data.id

    this.leadservice.getleadsview(this.leadservice.leadId).subscribe(results => {
      if (!results) {
        return false;
      }



      //NORMAL TABLE
      let leadsView = results;
      this.leadsview = results;
    })

  }

  gotoDatapage() {
    // if (this.taskUpdate) {
    //   window.history.back()
    // }
    this.showdatatable = true;
    this.showleadsview = false;
    this.showassignemployee = false;

    this.leadservice.nextleadboolean=false

    this.getagentlead(this.currentleaddatapage)


    this.leadservice.leadWithTasks = [];
    this.leadservice.taskObject = null;

    this.leadservice.leadId = null;
    this.leadservice.leadsummaryid = null;
    this.leadservice.leadtaskobj = null

    this.clearemployeedetails()
    this.assignleadform.patchValue({
      vendorgroup_id: '',
      employee_id: '',
      lead_product_id: ''
    })

  }

  editContent() {
    // var mailid = $('.mails').text();

    // var newmail = $('<input id="newmails" type="text" value= " ' +mailid+ '"  style="font-size: 0.875rem;width: 260px; border-style:groove; border: #c3c6ca 1px solid !important;padding: 3px;cursor: pointer; border-radius: 5px;">');
    // if(mailid != "")
    // {
    //     $('.mails').text("").append(newmail);

    // }



    // newmail.select();

    // $(".mails").toggle();





  }

  getemployee(value) {
    this.isLoading = true;
    this.leadservice.get_EmployeeList(value).subscribe(
      result => {
        this.isLoading = false;

        this.employeedata = result['data']
      }
    )
  }


  getemployeeclick() {
    this.leadservice.get_EmployeeList('').subscribe(
      result => {
        this.isLoading = false;

        this.employeedata = result['data']
      }
    )
  }

  public displayfnemployee(employee?: employee): string | undefined {

    return employee ? employee.full_name : undefined;
  }

  resetsearchform() {
    this.leadsearchform.patchValue({
      employee: '',
      filter: 0
    })
    // this.currentsearchrole = 0
    this.getagentlead(this.currentleaddatapage = 1)
  }

  getsearch() {
    this.getagentlead(this.currentleaddatapage = 1)
  }

  getagentlead(page) {
    // let role=value == 1? true:false
    let role = this.leadsearchform.value.filter != '' && this.leadsearchform.value.filter != null ? this.leadsearchform.value.filter : 0
    console.log('role', role) 
    this.vowservice.loader = true

    this.leadservice.getagentlead(this.vendorid, role, this.employeeid, page).subscribe(
      result => {
        this.vowservice.loader = false      

        this.currentsearchrole = role

        console.log(this.leadssummarylist)
        this.leadssummarylist = result['data'];

        // this.leadssummarylist = this.currentsearchrole == 2 ? this.changeleadsummarrydata_tempporary(result['data']) : result['data']

        let pagination = result['pagination']
        console.log(this.leadssummarylist)

        if (this.leadssummarylist.length != 0) {
          this.leaddata_hasnext = pagination['has_next']
          this.leaddata_hasprevious = pagination['has_previous']
          this.currentleaddatapage = pagination['index']
        }
      }, 
      // (error) => {
      //   this.vowservice.loader = false

      // }
    )
  }

  changeleadsummarrydata_tempporary(array) {
    for (let i = 0; i < array.length; i++) {
      array[i].employeedata = '';
      array[i].employee_edit = true;

    }
    return array
  }

  getpreviouslead() {
    if (this.leaddata_hasprevious) {
      this.getagentlead(this.currentleaddatapage - 1)
    }
  }

  getnextlead() {
    if (this.leaddata_hasprevious) {
      this.getagentlead(this.currentleaddatapage + 1)
    }
  }

  routetounassignedlead(data) {

    this.leadservice.leadId = data?.id;
    this.router.navigate['lead']

  }




  leadagentemployeemapping() {

    // console.log('lead mapping', data)

    // if (data?.employeedata?.id == undefined) {
    //   this.notification.showError('Please select Employee')
    //   return false
    // }


    // let obj = {
    //   lead_product_id: data.id,
    //   employee_id: data?.employeedata?.id
    // }

    // console.log('agentsumbit', obj)

    this.assignleadform.patchValue({
      employee_id: this.selectedemployeesid,
      vendorgroup_id: this.assignleadform.value.vendorgroup_id.id,
      lead_product_id: this.leadservice.leadsummaryid
    })

    this.leadservice.leadagentmapping(this.assignleadform.value).subscribe(
      result => {
        // this.notification.showSuccess(result.message)

        if (result.message == "Successfully Created") {
          this.notification.showSuccess("Successfully Created")
          this.gotoDatapage()
          this.getagentlead(this.currentleaddatapage = 1)
        }
        else {
          this.notification.showError(result)
        }

      }
    )
  }

  getvendorgroupdropdown() {
    this.leadservice.getvendorgroupdropdownsearch(this.vendorid).subscribe(
      result => {

        this.vendorgroupdata = result['data']
        let pagination = result['pagination']
        this.groupdatapagination.has_next = pagination['has_next']
        this.groupdatapagination.has_previous = pagination['has_next']
        this.groupdatapagination.currentpage = pagination['index']

      }
    )
  }

  public displaygroup(rule?: group): string | undefined {

    return rule ? rule.name : undefined;
  }

  getremovechip(value) {
    const index = this.selectedemployees.indexOf(value);
    const indexid = this.selectedemployeesid.indexOf(value.id)
    this.selectedemployees.splice(index, 1);
    this.selectedemployeesid.splice(indexid, 1);
  }

  selectedemployee(event: MatAutocompleteSelectedEvent) {

    console.log('value', event.option.value)
    console.log('value id', event.option.value.id)


    let foundEmployee1 = this.selectedemployees.filter(employee => employee.employee_ids.full_name == event.option.viewValue);
    console.log(foundEmployee1, this.selectedemployees)
    if (foundEmployee1.length) {
      return false;
    }


    this.selectedemployees.push(event.option.value);
    this.selectedemployeesid.push(event.option.value.id)
    this.employeeinput.nativeElement.value = '';

    this.assignleadform.patchValue({
      employee_id: ''
    })
  }

  getgroupbasedemployee(value) {

    // id = id == undefined ? 'None' : id
    let id = this.vendorid

    this.leadservice.getportaluseremployee(id, value).subscribe(
      result => {
        this.groupbasedemployee = result['data']
      }
    )
  }

  public displayfngroupbasedemployee(groupbaseedemployee?: groupbaseedemployee): string | undefined {

    return groupbaseedemployee ? groupbaseedemployee.employee_ids.full_name + (' Limit' + ' : ' + groupbaseedemployee.limit) : undefined;
  }

  public displayfngroupbasedemployees(groupbaseedemployee?: groupbaseedemployees): string | undefined {

    return groupbaseedemployee ? groupbaseedemployee.full_name : undefined;
  }

  clearemployeedetails() {
    this.selectedemployees = []
    this.selectedemployeesid = []
    this.employeeinput.nativeElement.value = '';

    this.assignleadform.patchValue({
      employee_id: ''
    })
  }

  public displayvendorbasedgroup(vendorbasedgroup?: vendorbasedgroup): string | undefined {

    return vendorbasedgroup ? vendorbasedgroup.vendorgroup_id.name : undefined;
  }

  selectallemployee() {

    if (this.selectedemployees.length == this.groupbasedemployee.length && this.selectedemployees.length > 0 && this.groupbasedemployee.length > 0) {
      this.clearemployeedetails()
      return false
    }

    this.clearemployeedetails()
    for (let i = 0; i < this.groupbasedemployee.length; i++) {
      this.selectedemployees.push(this.groupbasedemployee[i])
      this.selectedemployeesid.push(this.groupbasedemployee[i].id)
    }

  }

  ptb(){
    this.viewLeadDetails(this.leadservice.leadtaskobj)

  }

  getNotes() {
    let mainobj=this.leadservice.leadtaskobj;
    let lead= mainobj.lead_id.id? mainobj.lead_id.id: mainobj.lead_id.lead_id? mainobj.lead_id.lead_id:mainobj.lead_id.id ;

    let params = 'id=' + lead;

    this.leadservice.getNotes(params).subscribe(res => {
      this.notesList = res['data']
      console.log('note list',this.notesList)
    })
  }

}
