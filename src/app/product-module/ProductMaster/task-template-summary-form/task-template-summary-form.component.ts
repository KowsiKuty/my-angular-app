import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/service/notification.service';
import { MasterApiServiceService } from '../master-api-service.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskTemplateViewComponent } from '../task-template-view/task-template-view.component';


@Component({
  selector: 'app-task-template-summary-form',
  templateUrl: './task-template-summary-form.component.html',
  styleUrls: ['./task-template-summary-form.component.scss'],
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }
  }],
  // encapsulation: ViewEncapsulation.Native
})
export class TaskTemplateSummaryFormComponent implements OnInit {

  form = 'Task Template Form'
  summary = 'Tasks Template List'
  title = '';
  showSummary: boolean = true;
  searchForm: FormGroup;
  templateForm: FormGroup;

  ELEMENT_DATA
  ColumnList = ["template_name", "view", "update", "delete"];
  dataSource;
  pagination = {
    "has_next": false,
    "has_previous": false,
    "index": 1,
    "limit": 10
  };
  productId: number = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('activity') activity: ElementRef;
  @ViewChild('activityName') activityName: ElementRef;
  @ViewChild('duration') duration: ElementRef;
  @ViewChild('activityModal') actModal: ElementRef;

  updateActivity = '';
  updateActivityName = '';
  updateDuration = '';
  constructor(private fb: FormBuilder, private notification: NotificationService, private matDialog: MatDialog,
    private apiService: MasterApiServiceService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.templateForm.valueChanges.pipe().subscribe(res => {
    //   console.log(res)
    // })
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    // this.dataSource.paginator = this.paginator;
    // this.ColumnList = Object.keys(this.ele)
    this.showTable();
    this.productId = this.apiService.getproductid();
    console.log('product',);
    this.searchForm = this.fb.group({
      template_name: null,
      count: null
    })
    // this.createform()
    this.searchSummary();
    // this.title =
  }

  showForm() {
    this.title = this.form;
    this.showSummary = false;
  }
  showTable() {
    this.title = this.summary;
    this.showSummary = true;
  }



  searchSummary(page = 1) {
    let params = 'page=' + page;
    if (this.searchForm.value.template_name) {
      params += '&template_name=' + this.searchForm.value.template_name
    }
    params += '&product_id=' + this.productId
    this.apiService.getTasklist(params).subscribe(res => {
      this.dataSource = new MatTableDataSource(res['data']);
      // this.dataSource = res['data']
    })
  }
  onChangePage(pe) {
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    moveItemInArray(this.templateForm.get('task')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.templateForm.get('task').value, event.previousIndex, event.currentIndex);
  }

  openModal(element) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    // dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    // dialogConfig.height = "350px";
    dialogConfig.width = "60%";
    // dialogConfig.width = "60%";
    // dialogConfig.maxHeight = "60%";

    dialogConfig.data = element;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TaskTemplateViewComponent, dialogConfig);
  }

  editTask(id) {
    let params = 'id=' + id;
    this.showForm();
    this.apiService.getTask(params).subscribe(response => {
      this.templateForm = this.fb.group({
        template_name: new FormControl(response.template_name),
        product_id: new FormControl(response.product_id),
        details: new FormControl(response.details),
        id: new FormControl(id),
        task: new FormArray([])
      });
      // response.details = response.task.replace(/'/g, '"')
      // response.details = JSON.parse(response.details)
      response.task.forEach(element => {
        let group = this.fb.group({
          id: new FormControl(element.id),
          name: new FormControl(element.name),
          details: new FormControl(element.details),
          duration: new FormControl(element.duration),
          // order: element.order
        });
        (this.templateForm.get('task') as FormArray).push(group);
      });
    })

  }
  createform() {
    this.showForm();
    if (!this.showSummary) {
      this.templateForm = this.fb.group({
        template_name: '',
        details: '',
        product_id: Number(this.productId),
        task: new FormArray([])
      })

    }
    // this.addTask();
  }
  createTask() {
    let formInput;
    let length = this.templateForm.value.task.length;
    formInput = {
      name: this.activityName.nativeElement.value,
      details: this.activity.nativeElement.value,
      duration: this.duration.nativeElement.value,
      // order: length + 1
    };

    if (!formInput.details || !formInput.duration || !formInput.name) {
      this.notification.showError('Please fill the task detail/duration..');
    } else {
      this.addTask(formInput);
      this.activity.nativeElement.value = null;
      this.duration.nativeElement.value = null;
      this.activityName.nativeElement.value = null;
    }


  }

  addTask(value) {
    let group = this.fb.group({
      name: value?.name,
      details: value?.details,
      duration: value?.duration,
      // order: value?.order
    });
    (this.templateForm.get('task') as FormArray).push(group);
  }
  removeTask(ind) {
    let value = this.templateForm.value.task[ind];
    if (value?.id) {
      //api
      let payload = {
        "task_delete": 0,
        "id": [value.id]
      }
      this.apiService.createTask(payload).subscribe(res => {
      })

    }
    (this.templateForm.get('task') as FormArray).removeAt(ind);
  }
  removeTemplate(id) {
    let payload = {
      "delete": 0,
      "id": id
    }
    this.apiService.createTask(payload).subscribe(res => {
      if (res?.status == 'success') {
        // this.showTable();
        this.searchSummary()
      }
    })
  }

  submitdata() {
    let payload = this.templateForm.value;
    payload.task.forEach((element, index) => {
      element.order = index + 1
    })
    console.log(payload)
    this.apiService.createTask(payload).subscribe(res => {
      if (res?.status == 'success') {
        this.showTable();
        this.searchSummary()
      }
    });

    // this.apiService
  }
  activityId: number;
  order: number;
  actInd: number;


  getActivity(ind) {
    let value = this.templateForm.value.task[ind];
    this.actInd = ind;
    this.activityId = value?.id;
    this.updateActivity = value?.details;
    this.updateDuration = value?.duration;
    this.updateActivityName = value?.name
    this.order = ind + 1;
  }
  updateActivities() {
    let payload = this.templateForm.value;
    payload.task = [{
      id: this.activityId,
      name: this.updateActivityName,
      details: this.updateActivity,
      duration: this.updateDuration,
      order: this.order,
    }
    ]
    if (!this.updateActivity || !this.updateDuration || !this.updateActivityName) {
      this.notification.showError('Please fill the task detail/duration..');
      return false;
    }
    if (this.activityId) {
      this.apiService.createTask(payload).subscribe(res => {
        if (res?.status == 'success') {
          this.templateForm.get('task')['controls'].at(this.actInd).patchValue({
            name: this.updateActivityName,
            details: this.updateActivity,
            duration: this.updateDuration,
          })
          // const myModal = new (bootstrap as any).Modal(document.getElementById('myModal'));
          // this.actModal.nativeElement.classList.remove('show');
          // this.actModal.nativeElement.classList.add('hidden');
          this.actModal.nativeElement.click();
        };
      })
    }
    else {
      this.templateForm.get('task')['controls'].at(this.actInd).patchValue({
        details: this.updateActivity,
        duration: this.updateDuration,
        name: this.updateActivityName
      })
      // const myModal = new (bootstrap as any).Modal(document.getElementById('myModal'));
      // this.actModal.nativeElement.classList.remove('show');
      // this.actModal.nativeElement.classList.add('hidden');
      this.actModal.nativeElement.click();
    }

  }

}

