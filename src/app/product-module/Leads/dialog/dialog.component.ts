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
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  dataArray: any;
  matchcolumns: FormGroup;
  filecolumns: any;

  constructor(private prodservice: LeadsmainService, private fb: FormBuilder,  private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private router: Router, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.matchcolumns = this.fb.group({
      fname:null,
      mname:null,
      lname:null,
      dob:null,
      panno:null,
      adhaarno:null,
      gender:null,
      marital_status:null,
      occupancy:'',
      ph_no:null,
      mail_id:null,
      line1: null,
      line2: null,
      line3: null,
      pincode:null,
      district_name:null,
      state_name: null,
      city_name: null,
      account_number: null,
      bank:null,
      branch: null,
      father_name: null,
      father_dob: null,
      mother_name: null,
      mother_dob: null,
      spouse_name : null,
      spouse_dob: null,
      dupColumns: null,
    

    })

    this.tableheaders();
  }

  tableheaders()
  {


    this.prodservice.tableheaderdata().subscribe(results => {   

      this.dataArray = results;
      
    })
  }

  uploadheader(vals) {
    this.SpinnerService.show();
    this.prodservice.uploadfileheaders(vals).subscribe(results => {
      this.filecolumns = results;   
    });

  }

}
