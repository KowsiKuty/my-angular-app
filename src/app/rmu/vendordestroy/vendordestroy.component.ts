import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendordestroy',
  templateUrl: './vendordestroy.component.html',
  styleUrls: ['./vendordestroy.component.scss']
})
export class VendordestroyComponent implements OnInit {

  rmuurl = environment.apiURL
  vendordestroylist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  destroystatus = {
    PENDING : "VIEW",
    APPROVED: "VIEW",
    DESTROYED: "VIEW",
    ARCHIVED: "VIEW"
  }

  vendor_destory_summary:any
  vendor_destory_summaryapi:any
  constructor(private rmuservice: RmuApiServiceService, public router: Router, public formbuilder: FormBuilder, private notification: NotificationService) {
    this.vendor_destory_summary = [{"columnname": "Destroy Code", "key": "destroy_code"},
      {"columnname": "Request Date",  "key": "request_date","type": 'date',"datetype": "dd-MM-yyyy"},{"columnname": "Request Person",  "key": "employee",type: "object",objkey: "name"},{"columnname": "Status",  "key": "destroy_status",type: "object",objkey: "value"},{ "columnname": "Action","icon":"block", button:true,function:true ,clickfunction:this.destroys.bind(this) }]
   this.vendor_destory_summaryapi = {"method": "get", "url": this.rmuurl + "rmuserv/destroy_final",params: ""}
    }


  ngOnInit(): void {

    this.getvendordestroysummary();

  

  }

  getvendordestroysummary() {
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.rmuservice.getvendordestroysummary('', this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.vendordestroylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  prevpage()
  {

  }

  nextpage()
  {

  }

  destroys(data)
  {
    this.rmuservice.destroydelete(data.id).subscribe(results => {

      // this.vendorarchivallist = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;


      if (results.status == 'success') {
        this.notification.showSuccess("Destroy Completed")
        this.getvendordestroysummary();
      }
      else {
        this.notification.showError(results.description)

      }

    })

  }

}
