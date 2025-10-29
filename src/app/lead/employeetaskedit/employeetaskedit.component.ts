import { DatePipe } from '@angular/common';
// import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { VowService } from 'src/app/service/vow.service';
import { FollowupleadandtaskComponent } from '../followupleadandtask/followupleadandtask.component';
import { LeadComponent } from '../lead/lead.component';
// import { LeaddataComponent } from '../leaddata/leaddata.component';

import { LeadserviceService } from '../leadservice.service';

@Component({
  selector: 'app-employeetaskedit',
  templateUrl: './employeetaskedit.component.html',
  styleUrls: ['./employeetaskedit.component.scss'],
  // providers: [FollowupleadandtaskComponent,LeaddataComponent,LeadComponent] 
})
export class EmployeetaskeditComponent implements OnInit {
  @Output() processFinished = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Output() onCancel = new EventEmitter<any>();
  // @Output() onSubmit = new EventEmitter<any>();
  @Output() ptb = new EventEmitter<any>();


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
      icon: 'lock_open', color: 'blue', prev_status: 'Not Started', text: 'Open', action: 'start',tooltip:"Open Task"
    },
    2: {
      icon: 'done_outline', color: 'cornflowerblue', prev_status: 'Open', text: 'MAC', action: 'end',tooltip:"Mark as Completed"
    },
    3: {
      icon: '', color: 'green', prev_status: 'Closed', action: '-',tooltip:''
    }
  }

  @ViewChild('activityModal') closebtn: ElementRef;
  @ViewChild('taskCloseBtn') taskCloseBtn: ElementRef;

  @ViewChild('continuetask') continuetask:ElementRef

  @ViewChild('contineutaskpop') contineutaskpop: ElementRef
  @ViewChild('taskcontinueclosebutton') taskcontinueclosebutton: ElementRef;

  // @ViewChild(LeadComponent) leadcomp:LeadComponent;
  // @ViewChild(FollowupleadandtaskComponent) followuplead:FollowupleadandtaskComponent;
  

  currenttaskindex: any;
  constructor(private datePipe: DatePipe, private leadservice: LeadserviceService, 
    private notification:NotificationService,private router:Router,private vowservice:VowService
   ) { }

  ActivityName = '';
  Note = '';
  ActivityDetails = '';
  dueDate: any = '';
  taskName = '';
  taskId: number = 2;
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

  isOwner:boolean=false;
  notespopup=''

  todaydate=new Date()

  ngAfterContentInit() {
    setTimeout(() => {
      document.querySelector('#test').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 450);
  }
  ngOnInit(): void {

    console.log('routerrrrr',this.router.url);

    let mainObj = this.leadservice.leadtaskobj;

    if (mainObj) {
      this.taskId = mainObj?.id;
      // this.taskId = 2;
      mainObj?.is_closed == "CLOSED" ? this.disableTask = true : '';
      // this.taskObject(mainObj);
    // this.allTasks = this.leadservice.leadWithTasks;
      this.getMappedList(mainObj,1)
    }

    // this.href = this.router.url;

  }
  getMappedList(mainObj,page) {
    let leadid=mainObj.lead_id.id? mainObj.lead_id.id: mainObj.lead_id.lead_id? mainObj.lead_id.lead_id:mainObj.lead_id.id ;
    let params = 'page=' + page + '&lead_id=' +  leadid
    console.log('params',params )
    let sub = this.leadservice.getMappedList(params).subscribe(res => {
      // this.dataSource = new MatTableDataSource(res['data']);
      // this.dataSource = res['data'];
      this.leadservice.leadWithTasks = res['data']

      this.allTasks=this.leadservice.leadWithTasks
      this.navToTask(this.allTasks[0])
    });
    this.leadservice.subscriptions.push(sub)
   

  }

  getLeadWithTasks() {
    this.allTasks = this.leadservice.leadWithTasks;
    // this.navToTask(this.allTasks[0])
    console.log('aaaaaaaaaaa',this.leadservice.leadWithTasks);
    console.log('product',this.product)

  }

  navToTask(obj){
    obj.is_closed = "CLOSED"
    obj.lead_map_id = obj.id;
    this.tasksumaryobject(obj);
    console.log(this.taskId)
    this.getNotes()
  }

  tasksumaryobject(mainObj){
    this.lead_id = mainObj?.lead_map_id;
    this.product = mainObj?.product;
    this.lead = mainObj?.lead;

    this.isOwner = mainObj?.is_owner ? mainObj.is_owner : false;

    this.getTasks(this.lead_id);

  }

  taskObject(mainObj) {
    // this.lead_id = mainObj?.lead_map_id;


    this.lead_id = mainObj.lead_id.id? mainObj.lead_id.id: mainObj.lead_id.lead_id? mainObj.lead_id.lead_id:mainObj.lead_id.id ;
    this.product = mainObj?.product_id;
    // this.lead = mainObj?.lead;
    this.lead =  mainObj.lead_id

    // this.getTasks(this.lead_id);
  }

  getTasks(id) {
    this.permission = false;
    this.vowservice.loader=true

    this.leadservice.getEmployeeTask({ lead_map_id: id }).subscribe(res => {
      this.vowservice.loader=false
      this.taskList = res['data'];
      this.taskList.forEach(element => {

        let today = new Date().toLocaleDateString();
        let date2 = new Date(element.due_date).toLocaleDateString()

        // this.disableTask=true;


        if (date2 <= today && this.isOwner) {
          this.taskId = element.id;
          this.disableTask=false;
        }

        console.log('task id check',this.taskId);

        element.id == this.taskId ? this.permission = true : '';

        element.reschedule=(element.status.id == 1)? false:(element.status.id == 2 )? true:false

        console.log(element)

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
    }),error=>{
      this.vowservice.loader=false

    }
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
 
    this.leadservice.createActivity(payload).subscribe((res:any) => {
      if (res.status == 'success') {
        this.ActivityName = '';
        this.ActivityDetails = '';
        this.dueDate = '';
        this.closebtn.nativeElement.click();
        if(this.currenttaskindex != -1  ){
          // this.contineutaskpop.nativeElement.click()
          this.closethetask()
          this.leadservice.leadtaskobj={
            lead_id:{
              id:res?.lead_map_id?.lead_product_id
            },id:''
          }
          this.leadservice.leadId=res?.lead_map_id?.lead_product_id
          this.ngOnInit() 

      this.ptb.emit()
      }
      this.getTasks(this.lead_id);

      }
    })

    // this.contineutaskpop.nativeElement.click()

    

  }

  statusUpdate(ind, status) {
    let params = 'action=' + status.action;
    this.currenttaskindex=ind

    this.leadservice.taskStatusUpdate(params, { id: this.taskList[ind].id }).subscribe((res:any) => {
      if (res.status == 'success') {
        if (status.action == 'end') {
          // this.taskId = null;
          this.disableTask = true;
        }

        this.getTasks(this.lead_id);
      }
    })
  }
  closeMessage(ind) {
    this.currenttaskindex=ind
    this.taskCloseAction = 'close';
    this.taskCloseMessage = 'Are you ok to close this task Completely ! ?';
  }

  customerMessage(ind) {
    this.currenttaskindex=ind

    this.taskCloseAction = 'customer';
    this.taskCloseMessage = 'Are you ok to add this Lead as Customer :) ?';
  }

  leadTaskUpdate() {
    let params = 'action=' + this.taskCloseAction;
    this.leadservice.leadTaskUpdate(params, { id: this.lead_id }).subscribe((res:any) => {
      this.taskCloseBtn.nativeElement.click();
      if (res.status == 'success') {
        this.notification.showSuccess(res.message)
        this.processFinished.emit();
        this.closethetask()

        this.getTasks(this.lead_id) ;
        this.leadservice.leadtaskobj={
          lead_id:{
            id:res?.lead_product_id?.lead_product_id
          },id:''
        }
        this.leadservice.leadId=res?.lead_product_id?.lead_product_id
        // this.followuplead.ngOnInit()
        // this.ngOnInit()
        // this.leaddatacomp.viewLeadDetails(this.leadservice.leadtaskobj)
        this.leadservice.nextleadboolean=true;
        // this.leaddatacall.ngOnInit()
        // this.LeadComponent.ngOnInit()
        // this.followUpCall.ngOnInit()



        // this.leadcomp.ngOnInit()
        // this.followuplead.ngOnInit()
        // window.location.reload()
        this.ngOnInit() 

      this.ptb.emit()
      }
      


    })
  }


  getNotes() {
    let params = 'id=' + this.lead_id
    this.leadservice.getNotes(params).subscribe(res => {
      this.notesList = res['data']
    })
  }

  createNote() {
    let payload = {
      lead_product_id: this.lead_id,
      note: this.Note
    }
    this.leadservice.createNote(payload).subscribe((res:any) => {
      if (res.status.toLowerCase() == 'success') {
        this.getNotes();
        this.Note = ''
      }
    })
  }


  closethetask(){
    let endtask="end"
    let params = 'action=' +endtask;

    // if(this.notespopup == ''){
    //   this.notification.showError('Please enter notes')
    //   return false
    // }

    this.notesadd();


    this.leadservice.taskStatusUpdate(params, { id: this.taskList[this.currenttaskindex].id }).subscribe((res:any) => {
      if (res.status == 'success') {
          //  if (status.action == 'end') {
         // this.taskId = null;
          this.disableTask = true;
       //  }
      //  this.continuetask.nativeElement.click()

        // this.getTasks(this.lead_id);
        this.taskcontinueclosebutton.nativeElement.click()
      }
    }), (error)=>{ 
      console.log("error", error) 
    }
  }

  reschedule(ind){
     this.currenttaskindex=ind
    
  }

  continuetaskmodal(){

  }

  closerescheduletask(){
    this.closethetask()
  }


  continuerescheduletask(){
    this.taskList[this.currenttaskindex].reschedule=false
  }

  notesadd(){
    let payload = {
      lead_product_id: this.lead_id,
      note: (this.notespopup)? this.notespopup:''
    }
    console.log('notesadd',this.notespopup)
    this.leadservice.createNote(payload).subscribe((res:any) => {
      if (res.status.toLowerCase() == 'success') {
        this.getNotes();
        this.Note = ''
        this.notespopup=''
      }
    })
  }
}
