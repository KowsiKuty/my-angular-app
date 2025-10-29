import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VowService } from 'src/app/service/vow.service';
import { LeadserviceService } from '../leadservice.service';

export interface employee {
  full_name: any;
  id: any;
}
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  leaddata=[];
  leaddata_hasnext=true;
  leaddata_hasprevious=true;
  currentleaddatapage=1;
  employeedata: any;

  leadsearchform:FormGroup
  roleid: any;

  assignleadform:FormGroup
  vendorid: any;
  allTasks: any;
  lead_id: any;
  product: any;
  lead: any;
  isOwner: any;
  taskList: any;
  permission: boolean;
  taskId: any;
  disableTask: boolean;

  productselectvavlue=''
  showdatatable: boolean=false;
  showleadsview: boolean=false;
  showassignemployee: boolean=false;
  leadsview: any;
  leadDetails: any;
  addressDetails: any;
  familyDetails: any;
  bankDetails: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor(private leadservice:LeadserviceService, private fb:FormBuilder,private vowservice:VowService) { }

  ngOnInit(): void {
    const data=JSON.parse(localStorage.getItem('UserData'))
    let roleid=data.role.id
    this.roleid=data.role.id
    this.vendorid=data.vendor_id
    
    let mainObj = this.leadservice.leadtaskobj;

    this.lead_id=mainObj.lead_id.id? mainObj.lead_id.id: mainObj.lead_id.lead_id? mainObj.lead_id.lead_id:mainObj.lead_id.id ;
    // this.allTasks = this.leadservice.leadWithTasks;
    
    
    console.log('sss',this.productselectvavlue)
    // this.getMappedList(this.lead_id,1)

    this.viewLeadDetails(this.leadservice.leadtaskobj)
   
  }


  getMappedList(lead,page) {
    let params = 'page=' + page + '&lead_id=' +lead
   
    console.log('params',params )
    let sub = this.leadservice.getMappedList(params).subscribe(res => {
      // this.dataSource = new MatTableDataSource(res['data']);
      // this.dataSource = res['data'];
      this.leadservice.leadWithTasks = res['data']

      this.allTasks=this.leadservice.leadWithTasks
      this.productselectvavlue=this.allTasks[0].product?.product_name
      this.navToTask(this.allTasks[0])
    });
    this.leadservice.subscriptions.push(sub)
   

  }

  navToTask(obj){
    obj.is_closed = "CLOSED"
    obj.lead_map_id = obj.id;
    this.tasksumaryobject(obj);
    console.log(this.taskId)
  }

  tasksumaryobject(mainObj){
    this.lead_id = mainObj?.lead_map_id;
    this.product = mainObj?.product;
    this.lead = mainObj?.lead;

    this.isOwner = mainObj?.is_owner ? mainObj.is_owner : false;

    this.getTasks(this.lead_id);

  }

  getTasks(id) {
    this.permission = false;
    this.leadservice.getEmployeeTask({ lead_map_id: id }).subscribe(res => {
      this.taskList = res['data'];
      this.taskList.forEach(element => {

        let today = new Date().toLocaleDateString();
        let date2 = new Date(element.due_date).toLocaleDateString()

        // this.disableTask=true;


        if (date2 == today && this.isOwner) {
          this.taskId = element.id;
          this.disableTask=false;
        }

        console.log('task id check',this.taskId)

        element.id == this.taskId ? this.permission = true : '';
        element.expansion=(element.status.id == 2)? true:false
        

        if (element.id == this.taskId && !this.disableTask) {
          element.class = 'cardEnabled';
        }
        else if (element.status.id == 3) {
          element.class = 'cardCompleted'
        }
        else {
          element.class = 'cardDisabled'
        }
      })
      // this.dueDate = new Date(this.taskList[this.taskList.length - 1].due_date);
    })
  }

  expansionopenclose(i){
    this.taskList[i].expansion = !this.taskList[i].expansion
  }


  viewLeadDetails(data) {
    // this.router.navigate(['crm/viewleads'])
    this.leadsview = ''
    this.showdatatable = false;
    this.showleadsview = true;
    this.showassignemployee = false;

    this.leadservice.leadtaskobj = data
    this.leadservice.leadsummaryid = data.id

    console.log('unassigned id', this.leadservice.leadsummaryid)
    this.leadservice.leadId = data.lead_id.id ? data.lead_id.id : data.lead_id.lead_id ? data.lead_id.lead_id : data.lead_id.id;

    // this.vowservice.loader=true

    this.leadservice.getleadsview(this.leadservice.leadId)
    .subscribe((results:any) => {
      // this.vowservice.loader=false

      if (!results) {
        return false;
      }



      //NORMAL TABLE
      let leadsView = results;
      this.leadsview = results
      console.log('refersh comp',this.leadsview)
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
        { name1: 'Mail', value1: contact.Mail_id, name2: 'Phone', value2: contact.Phone_No },
        { name2: 'Date of Birth', value2: leadsView.dob, pipe2: 'date', name1: 'Gender', value1: leadsView.gender?.text },
        { name1: 'Aadhaar', value1: leadsView.aadhaar_no, name2: 'Marital Status', value2: leadsView.marital_status?.text },
        { name1: 'PAN', value1: leadsView.pan_no, name2: '', value2: '' }
      ]
      console.log(this.leadDetails)

      this.addressDetails = [
        { name1: 'Line1', value1: address.line1, name2: 'State', value2: address.state.name },
        { name1: 'City', value1: address.city.name, name2: 'District', value2: address.district.name },
        { name1: 'PinCode', value1: address.pincode.no }
      ]

      this.familyDetails = [
        { name1: 'Father', value1: father?.name, name2: 'DOB', value2: father?.dob },
        { name1: 'Mother', value1: mother?.name, name2: 'DOB', value2: mother?.dob },
        { name1: 'Spouse', value1: spouse?.name, name2: 'DOB', value2: spouse?.dob }

      ]

      this.bankDetails = [
        { name1: 'Bank', value1: bank.bank.name, name2: 'Account No', value2: bank.account_number },
        { name1: 'Branch', value1: bank.branch.name, name2: 'IFSC code', value2: bank.ifsc_code }
      ]
    }
    // , (error) => {
    //   this.vowservice.loader = false

    // }
    )

  }

  gotoDatapage(){
    this.onCancel.emit()
  }

 

}
