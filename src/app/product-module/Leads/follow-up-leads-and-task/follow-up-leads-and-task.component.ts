import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/service/notification.service';
import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';

@Component({
  selector: 'app-follow-up-leads-and-task',
  templateUrl: './follow-up-leads-and-task.component.html',
  styleUrls: ['./follow-up-leads-and-task.component.scss'],
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }
  }]
})
export class FollowUpLeadsAndTaskComponent implements OnInit, OnDestroy {

  title = 'Mapping product and task template';

  //Form Field key names, incase BE key changed then we can adjust the below variables so Validations 
  // and so on will not  be worried :)
  // The reason for f-prefix its a form field identifier
  fLeadId = 'lead_id'
  fStartDate = 'start_date'
  fPriority = 'priority'
  fDescription = 'description'
  fTask = 'task'
  fProduct = 'product_id'
  fTaskTemplate = 'template_id'
  //Form Field key  

  columnList = ['Product']
  constructor(private fb: FormBuilder, private notification: NotificationService, private datePipe: DatePipe,
    private apiService: MasterApiServiceService) {
  }
  mappingForm: FormGroup
  templateId: number;

  productList = [];
  templatesList: [] = [];
  tasksList: [] = [];

  @ViewChild('activity') activity: ElementRef;
  @ViewChild('duration') duration: ElementRef;

  productID: number = null;
  leadId: number = null;
  dataSource;
  ngOnDestroy() {
    this.apiService.unsubscibe();;
    this.apiService.nullify()
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.leadId = this.apiService.leadId;
    this.mappingForm = this.fb.group({
      [this.fLeadId]: this.leadId,
      [this.fStartDate]: '',
      // [this.fPriority]: '',
      // [this.fDescription]: '',
      [this.fProduct]: '',
      [this.fTaskTemplate]: '',

      // [this.fTask]: new FormArray([

      // ])
    });
    if (this.leadId) {
      // this.productGet();
      this.getMappedList();
    }

  }

  getMappedList(page = 1) {
    let params = 'page=' + page + '&lead_id=' + this.leadId;
    let sub = this.apiService.getMappedList(params).subscribe(res => {
      // this.dataSource = new MatTableDataSource(res['data']);
      this.dataSource = res['data'];
      this.apiService.leadWithTasks = res['data']
    });
    this.apiService.subscriptions.push(sub)
  }
  public showName(subject) {
    return subject ? subject.name : undefined;
  }
  public showTemplateName(subject) {
    return subject ? subject.template_name : undefined;
  }

  // productGet(page = 1) {
  //   let params = '?action=summary&page=' + page;
  //   let formValue = this.mappingForm.value[this.fProduct];
  //   formValue ? params += '&name=' + formValue : '';
  //   let sub = this.apiService.getProductList(params).subscribe(res => {
  //     this.productList = res['data']
  //   })
  //   this.apiService.subscriptions.push(sub)
  // }

  templatesGet(page = 1) {
    let params = 'page=' + page;
    params += '&product_id=' + this.productID;
    let formValue = this.mappingForm.value[this.fTaskTemplate];
    formValue ? params += '&template_name=' + formValue : '';

    let sub1 = this.apiService.getTasklist(params).subscribe(res => {
      this.templatesList = res['data'];
      if (this.templatesList.length == 0) {
        this.notification.showWarning('No Task Template Found..')
      }
      // this.dataSource = new MatTableDataSource(res['data']);
      // this.dataSource = res['data']
    });
    this.apiService.subscriptions.push(sub1);
  }

  mapLeadProduct() {
    let payload = JSON.parse(JSON.stringify((this.mappingForm.value)));
    // let payload = this.mappingForm.value;

    payload[this.fStartDate] = this.datePipe.transform(payload[this.fStartDate], "yyyy-MM-dd");
    payload[this.fProduct] = payload[this.fProduct]?.id
    payload[this.fTaskTemplate] = payload[this.fTaskTemplate]?.id
    console.log(payload);
    let sub = this.apiService.mapLeadProduct(payload).subscribe(res => {
      if (res.status == 'success') {
        this.mappingForm.reset();
        this.mappingForm.get(this.fLeadId).setValue(this.leadId)
        this.getMappedList();
      }
    });
    this.apiService.subscriptions.push(sub);
  }

  defaultTasksGet() {

  }


}
