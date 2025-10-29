import { Component, OnInit,Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';

@Component({
  selector: 'app-actionmaster',
  templateUrl: './actionmaster.component.html',
  styleUrls: ['./actionmaster.component.scss']
})
export class ActionmasterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, 
    private notification: NotificationService, private location: Location, 
    private interService: InterintegrityApiServiceService) { }
  AddForm: FormGroup;
  accounteditform: FormGroup;
  summarylists=[];
  @ViewChild('closebuttons') closebuttons; 
  has_next=true;
  has_previous=true;
  currentpage=1;
  pagesize = 10;

  uploadfile: any;
  

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  ngOnInit(): void {

    this.AddForm = this.formBuilder.group({
      actionCode:'',
      actionDesc:'',
    
    })

    this.accounteditform = this.formBuilder.group({
      acc_no:'',
      acc_name:'',
      acc_description:'',
      id:''
    })

    // this.getaccdata();
  }

  accountedit(val)
  {

  }

  deleteaccount(val)
  {

  }
  prevpage()
  {

  }
  nextpage()
  {

  }
  editForm()
  {
    
  }

  // getaccdata() {

  //   this.interService.getActionData().subscribe(results => {
  //     if (!results) {
  //       return false;
  //     }
  //     this.summarylists = results['data'];
 
  //     this.pagination = results.pagination ? results.pagination : this.pagination;
  //   })
  // }

  submitForm() {

    // this.brsService.accountS(this.AddForm.value)
    this.interService.accountS(this.AddForm.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Added Successfully ...")
        // this.getaccdata();
        this.AddForm.reset();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }

  accountuploads()
  {
    // this.SpinnerService.show();
    this.interService.accountfileUpload( this.AddForm.get('filedatas').value).subscribe(results => { 
      // this.summarylist = results['data'];
      // this.getStmtdata();
      // this.SpinnerService.hide();
        this.pagination = results.pagination ? results.pagination : this.pagination;
        if (results.status == 'success') {
          this.notification.showSuccess("Files Uploaded Successfully")
          // this.closebtn.nativeElement.click();
        }
        else
        {
        this.notification.showError(results.description)
  
        }
      });
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    this.AddForm.get('filedatas').setValue(this.uploadfile);
  
  }

  

}
