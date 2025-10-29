import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterApiServiceService } from '../master-api-service.service';

@Component({
  selector: 'app-task-template-view',
  templateUrl: './task-template-view.component.html',
  styleUrls: ['./task-template-view.component.scss',]
})
export class TaskTemplateViewComponent implements OnInit {

  constructor(private apiService: MasterApiServiceService, @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<TaskTemplateViewComponent>) { }
  taskList = [];
  taskName = '';
  taskDetails = '';
  totalDuration: number = null;
  ngOnInit(): void {
    if (this.data?.id) {
      this.getTemplate(this.data.id)
    }
    // this.taskList = [{
    //   name: 'Calling ',
    //   details: 'Make a phone call to client to check whether they are okay with our product or not,if no then close it.',
    //   duration: 2
    // },
    // {
    //   name: 'Meeting on place',
    //   details: 'Make ah our product or not,if no then close it.',
    //   duration: 1
    // },
    // {
    //   name: 'Document Verify',
    //   details: 'y are okay with our product or not,if no then close it.',
    //   duration: 0
    // },
    // ]
  }



  getTemplate(id) {
    let params = 'id=' + id;
    this.apiService.getTask(params).subscribe(response => {
      this.taskList = response.task;
      this.totalDuration = 0;
      this.taskList.forEach(element => this.totalDuration += element.duration)
    })

  }
}
