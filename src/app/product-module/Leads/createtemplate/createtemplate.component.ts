import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Tablecolumns } from '../models/tablecolumns';
import { LeftsideMapping } from '../models/leftside-mapping';
import { RightsideMapping } from '../models/rightside-mapping';
import { MatPaginator } from '@angular/material/paginator';

import { FormGroup, FormBuilder,  FormArray, FormControl } from '@angular/forms';
import { LeadsmainService } from '../leadsmain.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/service/notification.service';
import { ColumnData } from '../data';
import { MENU_PANEL_TOP_PADDING } from '@angular/material/menu/menu-trigger';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { NullTemplateVisitor } from '@angular/compiler';
import { Router } from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-createtemplate',
  templateUrl: './createtemplate.component.html',
  styleUrls: ['./createtemplate.component.scss']
})
export class CreatetemplateComponent implements OnInit {

  summarylists: any;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  TemplateSearchForm: FormGroup; 

  constructor(private fb: FormBuilder, private prodservice: LeadsmainService, private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private router: Router) { }

  ngOnInit(): void {

    this.TemplateSearchForm = this.fb.group({
      codename: ''
    })



    this.gettemplatedata();

  }

  TemplateSearch() {
    this.TemplateSearchForm.reset('')
  }

  gettemplatedata() {

    this.prodservice.gettemplatesummary(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  prevpages()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.gettemplatedata();
  }
  nextpages()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.gettemplatedata();

  }

  deletetemplates(value)
  {
    this.prodservice.deletetemplates(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Template Successfully Updated...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  
}
