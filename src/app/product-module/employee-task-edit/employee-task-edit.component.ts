import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ScrollDirection } from '@angular/material/tabs';


import { MasterApiServiceService } from '../ProductMaster/master-api-service.service';
@Component({
  selector: 'app-employee-task-edit',
  templateUrl: './employee-task-edit.component.html',
  styleUrls: ['./employee-task-edit.component.scss']
})
export class EmployeeTaskEditComponent implements OnInit {
  @Output() processFinished = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  taskList = [];
  // {
  //   icon: 'lock',
  //   value: 'Pending',
  //   class: '',
  //   id: ''
  // },
  // {
  //   icon: 'lock_open',
  //   value: 'Active',
  //   class: '',
  //   id: ''
  // }
  statusList = [];
  notesList = [];
  assignedTo = false;
  // sts = [{ text: 'Not Started', id: 1 }, { text: 'Open', id: 2 }, { text: 'Completed', id: 3 }];
  //icon list key name id is respective with the next updating status.... eg, if the
  // current status is not-started the next status will be open
  iconList = {
    3: { icon: 'check_circle', color: 'green', prev_status: 'Done', text: 'Completed' },
    2: {
      icon: 'lock_open', color: 'blue', prev_status: 'Invalid id', text: 'Open'
    },
    1: {
      icon: 'lock', color: 'grey', prev_status: 'Invalid id', text: 'Not Started'
    }
  }
  equalIconList = {
    1: {
      icon: 'lock_open', color: 'blue', prev_status: 'Not Started', text: 'Open', action: 'start'
    },
    2: {
      icon: 'done_outline', color: 'blue', prev_status: 'Open', text: 'Complete', action: 'end'
    },
    3: {
      icon: '', color: 'green', prev_status: 'Closed', action: '-'
    }
  }

  @ViewChild('activityModal') closebtn: ElementRef;
  @ViewChild('taskCloseBtn') taskCloseBtn: ElementRef;
  constructor(private datePipe: DatePipe, private apiService: MasterApiServiceService,
    private scroller: ViewportScroller) { }

  ActivityName = '';
  Note = '';
  ActivityDetails = '';
  dueDate: any = '';
  taskName = '';
  taskId: number = null;
  lead_id: number = null;
  product: any = {
    product_code: '',
    product_name: ''
  };
  lead: any = {
    lead_first_name: '',
    lead_last_name: ''
  };
  taskCloseAction = '';
  taskCloseMessage = '';
  disableTask = false;
  allTasks = [];
  permission: boolean;

  ngAfterViewInit() {
    this.taskList.length > 4 ? setTimeout(() => {
      document.querySelector('#test').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 450) : '';
    let mainObj = this.apiService.taskObject;
    let obj = this.apiService?.leadWithTasks[0];
    if (mainObj) {
      console.log('task', mainObj)
      this.taskId = mainObj?.id;
      this.navToTask(mainObj);
    }
    else {
      obj ? this.navToTask(obj) : '';
    }

  }

  ngOnDestroy() {
    // this.apiService.nullify();
  }
  ngOnInit(): void {


  }

  getLeadWithTasks() {
    this.allTasks = this.apiService.leadWithTasks;
    console.log(this.apiService.leadWithTasks);
  }

  navToTask(obj) {
    obj.lead_map_id = obj?.id;
    this.taskObject(obj);
  }
  isOwner = false;
  taskObject(mainObj) {
    this.lead_id = mainObj?.lead_map_id;
    this.product = mainObj?.product;
    this.lead = mainObj?.lead;
    this.isOwner = mainObj?.is_owner ? mainObj.is_owner : false;
    mainObj?.is_closed == "CLOSED" ? this.disableTask = true : '';
    this.getTasks(this.lead_id);
  }

  getTasks(id) {
    this.permission = false;
    this.apiService.getEmployeeTask({ lead_map_id: id }).subscribe(res => {
      this.taskList = res['data'];
      this.taskList.forEach(element => {
        element.id == this.taskId ? this.permission = true : '';
        // let today = new Date().getDate();
        let today = new Date().toLocaleDateString();
        let date2 = new Date(element.due_date).toLocaleDateString();
        // this.disableTask = true;
        if (date2 == today && this.isOwner) {
          this.taskId = element.id;
          this.disableTask = false;
        }
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
  hover(data) {
    if (data.status.id == 1) {
      this.statusList = [{
        icon: 'thumb_up',
        value: 'Done',
        class: 'green',
        id: ''
      },
      {
        icon: 'thumb_down',
        value: 'Closed',
        class: 'red',
        id: ''
      }]
    }
  }
  createActivity() {
    let payload = {
      "lead_map_id": this.lead_id,
      "name": this.ActivityName,
      "details": this.ActivityDetails,
      "due_date": this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')
    };
    this.apiService.createActivity(payload).subscribe(res => {
      if (res.status == 'success') {
        this.ActivityName = '';
        this.ActivityDetails = '';
        this.dueDate = '';
        this.closebtn.nativeElement.click();
        this.getTasks(this.lead_id);
      }
    })
  }
  statusUpdate(ind, status) {
    let params = 'action=' + status.action;
    this.apiService.taskStatusUpdate(params, { id: this.taskList[ind].id }).subscribe(res => {
      if (res.status == 'success') {
        if (status.action == 'end') {
          // this.taskId = null;
          this.disableTask = true;
        }

        this.getTasks(this.lead_id);
      }
    })
  }
  closeMessage() {
    this.taskCloseAction = 'close';
    this.taskCloseMessage = 'Are you ok to close this task Completely ! ?';
  }

  customerMessage() {
    this.taskCloseAction = 'customer';
    this.taskCloseMessage = 'Are you ok to add this Lead as Customer :) ?';
  }

  leadTaskUpdate() {
    let params = 'action=' + this.taskCloseAction;
    this.apiService.leadTaskUpdate(params, { id: this.lead_id }).subscribe(res => {
      this.taskCloseBtn.nativeElement.click();
      if (res.status == 'success') {
        this.processFinished.emit();
      }

    })
  }


  getNotes() {
    let params = 'id=' + this.lead_id
    this.apiService.getNotes(params).subscribe(res => {
      this.notesList = res['data']
    })
  }
  createNote() {
    let payload = {
      lead_product_id: this.lead_id,
      note: this.Note
    }
    this.apiService.createNote(payload).subscribe(res => {
      if (res.status.toLowerCase() == 'success') {
        this.getNotes();
        this.Note = ''
      }
    })
  }



}
