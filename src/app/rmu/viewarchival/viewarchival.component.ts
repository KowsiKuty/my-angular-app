import { Component, OnInit } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-viewarchival',
  templateUrl: './viewarchival.component.html',
  styleUrls: ['./viewarchival.component.scss', '../rmustyles.css']
})
export class ViewarchivalComponent implements OnInit {

  constructor(private rmuservice:RmuApiServiceService,  private notification: NotificationService) { }
  isShow = false;
  isFile = false;
  isBox = false;
  isTrack= false;
  singlefilelist = []
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }

  ngOnInit(): void {

    this.getsinglesummary();
   
    
  }
  toggleDisplay()
  {
      this.isShow = true;
      this.isFile = false;
      this.isBox = false;
      this.isTrack = false;
      this.getsinglesummary();
  }
  toggleDisplays()
  {
    this.isFile = true;
    this.isBox = false;
    this.isShow = false;
    this.isTrack = false;
  }
  toggleDisplayss()
  {
    this.isBox = true;
    this.isShow = false;
    this.isFile = false;
    this.isTrack = false;
  }
  toggleDisplyas()
  {
    this.isBox = false;
    this.isShow = false;
    this.isFile = false;
    this.isTrack= true;
  }
  getsinglesummary(){
    
    this.rmuservice.getsinglesummary(1).subscribe(results =>{
      this.singlefilelist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
       //this.notification.showSuccess("Records Uploaded Successfully")
      }
      else
      {
      //this.notification.showError(results.description)

      }
      
    })
  }
}
