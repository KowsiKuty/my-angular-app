import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { Validators, FormArray } from '@angular/forms';
import { SharedService } from '../../service/shared.service'
import { DataService } from '../../service/data.service'
import { ElementRef, ViewChild } from '@angular/core';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '../../service/notification.service'
import { MatChipInputEvent } from '@angular/material/chips';
import { masterService } from '../master.service';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.scss']
})
export class MailTemplateComponent implements OnInit {
  mailtemplatedata:any;
  presentpage=1;
  pagesize=10;
  has_previousbs = true;
  has_nextbs = true;
  temp_name = '';
  constructor(private formBuilder: FormBuilder, private notification: NotificationService,
    private mastService: masterService, private router: Router ) { }

  ngOnInit(): void {
    this.getmailtemplateName(1,'')
  }
  getmailtemplateName(page,name) {
    this.mastService.mailtemplatelist(page,name)
      .subscribe((results: any[]) => {
        let value = results;
        console.log("----> vlaue for dept", value);
        this.mailtemplatedata = value['data']
        let datapagination = results["pagination"];
        if (value.length > 0) {
          this.has_nextbs = datapagination.has_next;
          this.has_previousbs = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      })
  }
  activeinact(id,status) {
    this.mastService.mailtemplactinact(id,status)
      .subscribe((results: any[]) => {
        if(results['status'] == "success")
        {
        this.notification.showSuccess(results['message'])
        this.getmailtemplateName(this.presentpage,'');
        }
      else{
        this.notification.showError(results['message'])
        this.getmailtemplateName(this.presentpage,'');
      }
      })
  }
  nextClick() {
    if (this.has_nextbs === true) {
     this.presentpage=this.presentpage + 1;
     this.getmailtemplateName(this.presentpage,this.temp_name);
    }
  }
  
  previousClick() {
    if (this.has_previousbs === true) {
      this.presentpage=this.presentpage - 1;
      this.getmailtemplateName(this.presentpage,this.temp_name);
    }
  }
  templateSearch()
  {
    this.getmailtemplateName(this.presentpage,this.temp_name)
  }
  resetcommon(){
    this.temp_name = ''
    this.getmailtemplateName(this.presentpage,this.temp_name)
  }
}
