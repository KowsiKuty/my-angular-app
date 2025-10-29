import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Tablecolumns } from '../models/tablecolumns';
import { LeftsideMapping } from '../models/leftside-mapping';
import { RightsideMapping } from '../models/rightside-mapping';
import { MatPaginator } from '@angular/material/paginator';

import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { LeadsmainService } from '../leadsmain.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/service/notification.service';
import { ColumnData } from '../data';
import { MENU_PANEL_TOP_PADDING } from '@angular/material/menu/menu-trigger';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NullTemplateVisitor } from '@angular/compiler';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';

@Component({
  selector: 'app-customleads',
  templateUrl: './customleads.component.html',
  styleUrls: ['./customleads.component.scss']
})
export class CustomleadsComponent implements OnInit {

  dataArrays: any;
  addTextFieldToFirstDiv : boolean; 
  showMatCard : boolean;
  userFriendlyColumnNames : any = {
    "aadhaar_no": "Aadhaar No",
    "pan_no": "PAN No",
    "ph_no": "Phone Number",
    "mail_id": "Email ID",
    "cif_no" : "CIF No",
    "first_name": "First Name",
    "pincode":"Pincode",
    "district_name" : "District Name",
    "state_name" : "State Name",
    "city_name" : "City Name",
    "account_number" : "Account Number",
    "middle_name" : "Middle Name",
    "bank" : "Bank",
    "branch" : "Branch",
    "last_name" : "Last Name",
    "father_name" : "Father Name",
    "lead_dob" : "Lead DOB",
    "father_dob" : "Father DOB",
    "gender" : "Gender",
    "mother_name" : "Mother Name",
    "marital_status" : "Marital Status",
    "mother_dob" : "Mother DOB",
    "occupancy" : "Occupancy",
    "spouse_name" : "Spouse Name",
    "line 1" : "Line 1",
    "spouse_dob" : "Spouse DOB"
    
  };
  labelGroup : FormGroup;
  droplist: [];
  reflist :[];
  sysdeflist:any;
  systemdefinedForm : FormGroup;

  constructor(private fb: FormBuilder, private prodservice: LeadsmainService, private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private router: Router, private matDialog: MatDialog,
    private apiService: MasterApiServiceService) { }

  ngOnInit(): void {
    this.labelGroup = this.fb.group({
      name :  '',
      label_type: '',
      ref_module:'',
      label_option:['']
    })
    this.systemdefinedForm = this.fb.group({
      sysdefheader: new FormArray([
      ]),
    })

    this.prodservice.tableheaderdata().subscribe(results => {
      // this.summarylist = results['data'];
      // this.getStmtdata();
      this.SpinnerService.hide();

      this.dataArrays = results;
      console.log("Data ", this.dataArrays)
      // this.dataSource1 = new MatTableDataSource(this.dataArrays);
    })
    this.getDropDown();
    this.getRefValues();
    this.getsysdefDropDown();
    
  }

 
  toggleTextField() {
    this.addTextFieldToFirstDiv = !this.addTextFieldToFirstDiv;
    this.showMatCard = !this.showMatCard;
  }

  getDropDown() {
    this.prodservice.dropdownvalues()
      .subscribe((results: any) => {
        this.droplist = results['Data'];
      })
  }
  getsysdefDropDown() {
    this.prodservice.sysdefvalues()
      .subscribe(results => {
        this.sysdeflist = results['data'];
        this.getsysdefrecords(results)
        console.log("sysdeflist",this.sysdeflist)
      })
  }
  getSections(forms) {
    return forms.controls.sysdefheader.controls;
  }
  SysdefFormArray(): FormArray {
    return this.systemdefinedForm.get('sysdefheader') as FormArray;
  }

  getsysdefrecords(result){
    for (let hdr of result?.data) {
      let id: FormControl = new FormControl('');
      let field_name: FormControl = new FormControl('');
      let field_type: FormControl = new FormControl('');
      id.setValue(hdr?.id)
      field_name.setValue(hdr?.field_id?.text)
      field_type.setValue(hdr?.field_type?.text)
      this.SysdefFormArray().push(new FormGroup({
        id: id,
        field_name: field_name,
        field_type: field_type,
      }))
    }
    
  }

  getRefValues()
  {
    this.prodservice.dropdownRefValues().subscribe((results:any)=>
  {
    this.reflist = results['Data'];
  })
  }
  addNewLabel()
  {
    let formValue = this.labelGroup.value;
    if(formValue.label_option == "" || formValue.label_option == undefined || formValue.label_option == null)
    {
      let payload = {
        "name": formValue.name,
        "label_type": formValue.label_type,
        "ref_module": formValue.ref_module
         
      }
    this.prodservice.addNewLabel(payload).subscribe(result => {
      if (result.id !== null) {
        this.notification.showSuccess("Added Successfully")
      } else {
        this.notification.showError(result.description)
        return false;
      }
    })
    }
    else
    {
      let payload = {
        "name": formValue.name,
        "label_type": formValue.label_type,
        "ref_module": formValue.ref_module
         
      }
    this.prodservice.addNewLabel(payload).subscribe(result => {
      if (result.status == 'success') {
        this.notification.showSuccess("Successfully Approved")
      } else {
        this.notification.showError(result.description)
        return false;
      }
    })
  }
  }
  

}
