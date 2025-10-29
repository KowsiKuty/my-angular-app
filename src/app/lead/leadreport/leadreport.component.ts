import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { VowService } from 'src/app/service/vow.service';
import { LeadserviceService } from '../leadservice.service';

@Component({
  selector: 'app-leadreport',
  templateUrl: './leadreport.component.html',
  styleUrls: ['./leadreport.component.scss'],
  animations: [
    trigger('displayState', [
      state('false', style({ overflow: 'hidden', height: '0px', opacity: '0', })),
      state('true', style({ overflow: 'hidden', height: '*', opacity: '*' })),
      transition('false => true', animate('200ms ease-in')),
      transition('true => false', animate('200ms ease-out'))
    ]),
  ]
})
export class LeadreportComponent implements OnInit {
  vendorid: any;
  roleid: any;
  employeeleadsdata: any;
  employeeid: any;
  vendoremployeelimitsdata: any;
  vendorleadsreport: any;

  constructor(private leadservice: LeadserviceService, private vowservice: VowService) { }

  vendoremployeeleads: any

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem('sessionData'))
    console.log("vendorid", data);
    // this.vendorid = data.id;
    // this.vendorid = data.vendor_id;

    // this.roleid = data.role.id
    this.employeeid = data.employee_id
    // this.vendorname = data.company_name
    this.getvendorId();
    


    // if (this.roleid == 1) {
    //   // this.getemployeeofvendorleads(this.vendorid, '')
    //   this.getcampaignlead(this.vendorid)
    // }
    // else {
    //   this.getemployeeofvendorleads(this.vendorid, this.employeeid)
    // }
  }
  getvendorId(){
    this.leadservice.getVendor()
     .subscribe(result =>{
      console.log("vendor id",result)
      if(result.status == "success"){
      this.vendorid = result?.vendor_id
      this.getcampaignlead(this.vendorid)
      }
     })
  }

  getemployeeofvendorleads(vendorid, employee) {

    this.vowservice.show()
    this.vowservice.loader = true
    this.leadservice.getvendoremployeeleadsdata(vendorid, employee).subscribe(
      result => {
        this.vowservice.loader = false
        this.vowservice.hide()

        this.vendoremployeeleads = result['result']
        for (let i = 0; i < result['result'].length; i++) {
          this.vendoremployeeleads[i].is_expansion = false
          this.vendoremployeeleads[i].leadsdata = []
          this.vendoremployeeleads[i].leadview = -1
          this.vendoremployeeleads[i].remaining_leads = this.vendoremployeeleads[i].emp_leads - this.vendoremployeeleads[i].lead_to_customer - this.vendoremployeeleads[i].not_int_lead
          console.log('limits',)
        }
      }
    )
  }

  getemployeeleads(i, status, employeeid) {

    if (this.vendoremployeeleads[i].is_expansion && this.vendoremployeeleads[i].leadview == status ) {
      this.vendoremployeeleads[i].is_expansion = false
      this.vendoremployeeleads[i].leadview = -1
      return false
    }
    this.vendoremployeeleads[i].is_expansion = false

    this.vowservice.show()

    this.leadservice.getemployeeleadsdata(status, employeeid).subscribe(
      result => {
        this.vowservice.hide()

        this.vendoremployeeleads[i].leadview = status
        this.vendoremployeeleads[i].leadsdata = result['data']
        this.vendoremployeeleads[i].is_expansion = true
      }
    )
  }

  getemployeereports(employeeid) {
    // this.leadservice.getemployeeleadsdata(employeeid).subscribe(
    //   result => {
    //     this.vowservice.hide()
    //     this.employeeleadsdata = result['result']
    //     // this.vendoremployeeleads[i].leadsdata=result['data']
    //     // this.vendoremployeeleads[i].is_expansion=true
    //   }
    // )
  }

  getemployeelimits() {
    this.vowservice.show()
    let emp = (this.roleid == 1) ? '' : this.employeeid
    this.leadservice.getemployeelimits(this.vendorid, emp).subscribe(
      result => {
        this.vowservice.hide()
        this.vendoremployeelimitsdata = result['data']
      }
    )
  }

  getcampaignlead(vendorid) {
   
    // this.spinner.show()

    this.leadservice.getvendorcampaigndata(vendorid).subscribe(
      result => {
        // this.spinner.hide()

        this.vendorleadsreport= result['result']
        

        for (let i = 0; i < result['result'].length; i++) {
          this.vendorleadsreport[i].employee_list = []
          this.vendorleadsreport[i].is_expansion = false

        }

      })
  }

  getcampaignemployee(i, vendorid, campaign) {

    if (this.vendorleadsreport[i].is_expansion) {
      this.vendorleadsreport[i].is_expansion = false
      return false
    }
    
    // this.spinner.show()
    this.leadservice.getvendorleadsreport(vendorid, campaign).subscribe(
      result => {
        // this.spinner.hide()

        this.vendorleadsreport[i].employee_list = result['result']
        
        console.log('find', result['result'].find(x=> x.employee_id == this.employeeid ))
        
        this.vendorleadsreport[i].employee_list=(this.roleid == 1)? result['result'] : [result['result'].find(x=> x.employee_id == this.employeeid)]
        console.log()
        this.vendorleadsreport[i].is_expansion = true
        for (let k = 0; k < result['result'].length; k++) {
          // this.vendorleadsreport[i].employee_list[k].remaining_leads = this.reportdata[i].vendor_list[j].employee_list[k].emp_leads - this.reportdata[i].vendor_list[j].employee_list[k].lead_to_customer - this.reportdata[i].vendor_list[j].employee_list[k].not_int_lead
          this.vendorleadsreport[i].employee_list[k].leaadsdata = []
          this.vendorleadsreport[i].employee_list[k].is_expansion = false

        }

      }, error => {
        // this.spinner.hide()
      }
    )
  }

  getleadsofcampaignemployee(i, j, campaign, vendorid, empoyeeid) {

    if (this.vendorleadsreport[i].employee_list[j].is_expansion) {
      this.vendorleadsreport[i].employee_list[j].is_expansion = false
      return false
    }

    // this.spinner.show()
    this.leadservice.getemployeeleads(campaign, vendorid, empoyeeid).subscribe(
      result => {
        // this.spinner.hide()
        this.vendorleadsreport[i].employee_list[j].leaadsdata = result['data']

        this.vendorleadsreport[i].employee_list[j].is_expansion = true

        // for (let l = 0; l < result['result'].length; l++) {
        this.vendorleadsreport[i].employee_list[j].leaadsdata.sort((a, b) => parseFloat(b.lead_status) - parseFloat(a.lead_status));
      }

    )
  }


  

}
