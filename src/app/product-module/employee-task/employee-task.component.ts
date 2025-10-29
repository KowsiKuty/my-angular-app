import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MasterApiServiceService } from '../ProductMaster/master-api-service.service';


@Component({
  selector: 'app-employee-task',
  templateUrl: './employee-task.component.html',
  styleUrls: ['./employee-task.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI]
})
export class EmployeeTaskComponent implements OnInit {

  showSummary = true;
  constructor(private fb: FormBuilder, private service: ApicallserviceService, private apiService: MasterApiServiceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute,
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master,
    private notify: imp.ToastrService, private productApi: imp.ProductAPI
  ) { }


  ngOnInit(): void {
    this.EmployeeTask = this.fb.group({
      codename: ''
    })

    this.EmployeeTaskSearch('')
  }

  EmployeeTask: FormGroup

  EmployeeTaskObjects = {
    has_nextEmployeeTask: false,
    has_previousEmployeeTask: false,
    presentpageEmployeeTask: 1,
    EmployeeTaskList: '',
    categoryList: '',
    subcategoryList: ''

  }


  serviceCallEmployeeTaskSummaryget(search, pageno) {
    this.service.ApiCall('get', this.productApi.ProductsAPI.EmployeeTask + "?page="+pageno+"&", search)
      .subscribe(result => {
        this.spin.hide()
        this.log.logging("EmployeeTask Summary", result)
        let page = result['pagination']
        this.EmployeeTaskObjects.EmployeeTaskList = result['data']
        if (this.EmployeeTaskObjects.EmployeeTaskList?.length > 0) {
          this.EmployeeTaskObjects.has_nextEmployeeTask = page.has_next;
          this.EmployeeTaskObjects.has_previousEmployeeTask = page.has_previous;
          this.EmployeeTaskObjects.presentpageEmployeeTask = page.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  goToTask(object) {
    this.apiService.taskObject = object;
    this.apiService.leadId = object.lead.lead_id;
    this.route.navigate(['crm', 'leadsdata'], { queryParams: { for: 'taskUpdate', lead: object.lead.lead_id } });
    this.showSummary = false;
  }

  EmployeeTaskSearch(hint: any) {
    let search = this.EmployeeTask.value;
    let obj = {
      name: search?.codename
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallEmployeeTaskSummaryget(obj, this.EmployeeTaskObjects.presentpageEmployeeTask + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallEmployeeTaskSummaryget(obj, this.EmployeeTaskObjects.presentpageEmployeeTask - 1)
    }
    else {
      this.serviceCallEmployeeTaskSummaryget(obj, 1)
    }

  }

  ResetTask() {

  }




































}
