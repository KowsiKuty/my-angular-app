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
import { MatStepper } from '@angular/material/stepper';

export interface UserDefinedItem {
  label: { id: string; label_name: string };
  header: string;
}


@Component({
  selector: 'app-leads-mainpage',
  templateUrl: './leads-mainpage.component.html',
  styleUrls: ['./leads-mainpage.component.scss']
})
export class LeadsMainpageComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  dataArray: any;
  dataArrays: any[] = [];
  showmapping: boolean = false;
  showMappings: boolean = false;

  columnList = [{ key: 'ph_no', value: 'Phone No' }, { key: 'mail_id', value: 'Mail' }, { key: 'adhaar_no', value: 'Adhaar No' }, { key: 'pan_no', value: 'PAN' }, { key: 'CIF', value: 'CIF' }];
  droplist: any;
  droplists: any;
  reflist: any;
  // apiResponses: any = [];

  constructor(private fb: FormBuilder, private prodservice: LeadsmainService, private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private router: Router, private matDialog: MatDialog,
    private apiService: MasterApiServiceService) { }

  value: any;
  index: any;
  filecolumns: any;
  headercols: any;
  labelGroup: FormGroup;


  // Data2: LeftsideMapping[] = [
  //   { "heading": "Name" },
  //   { "heading": "DOB" },
  //   { "heading": "PAN" },
  //   { "heading": "Adhaar" },
  //   // { "heading": "Occupation" },
  //   // { "heading": "Interested In" },

  // ];


  displayedColumns1: string[] = ['heading'];
  displayedColumns2: string[] = ['fileheadings'];
  @ViewChild('table', { static: true }) table: MatTable<RightsideMapping>;
  @ViewChild('sortCol1') sortCol1: MatSort;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatTable) table: MatTable<any>;
  // @ViewChild('list1') list1: CdkDropList;
  findindex: any;
  nsources: any;
  ntemplates: any;
  item: any;
  newBookId: any;


  // public dataSource1 = new MatTableDataSource(this.Data2);
  // dataSource2  = new MatTableDataSource(ColumnData);
  public dataSource1;
  public dataSource2;
  todo = [];
  center: any;
  leadsupload: FormGroup;
  matchcolumns: FormGroup;
  dupColumnsForm: FormGroup;
  newTempl: FormGroup;
  uploadfile: any;
  searchText: string;
  leadsuploadform: FormGroup;
  isLinear = true;
  isShowMappingss: boolean = true;
  isShowUploadss: boolean = false;
  leadsform: FormGroup;
  // apiResponses: any; 

  filetitles = ['Names', 'Pan', 'Phone', 'adhaar', 'interested', 'age', 'occupation', 'address', 'mail'];
  // filetitles = [];
  // @Output('completed') Completed: EventEmitter<any>;
  @Output() completed = new EventEmitter();
  ngOnInit(): void {

    this.leadsuploadform = this.fb.group({
      FormArray: this.fb.array([
        this.leadsupload = this.fb.group({
          source_name: '',
          filedata: '',
          name: '',
          dob: '',
          panno: '',
          adhaarno: '',
          templates: '',
        }),

        this.matchcolumns = this.fb.group({
          first_name: null,
          middle_name: null,
          last_name: null,
          dob: null,
          panno: null,
          adhaarno: null,
          gender: null,
          marital_status: null,
          occupancy: null,
          ph_no: null,
          mail_id: null,
          line1: null,
          line2: null,
          line3: null,
          pincode: null,
          district_name: null,
          state_name: null,
          city_name: null,
          account_number: null,
          bank: null,
          branch: null,
          father_name: null,
          father_dob: null,
          mother_name: null,
          mother_dob: null,
          spouse_name: null,
          spouse_dob: null,
          dupColumns: null,
          cifno: null,
          template_name: null,
          customheader: null,
          customfield: null,
          createddate: null,
          leadsource: null,
          leadstatus: null,
          code: null,
          presaddress: null,
          sources: null,
          rows: this.fb.array([]),


        }),








        this.dupColumnsForm = this.fb.group({
          dupColumns: null

        }),
        this.newTempl = this.fb.group({
          template_name: null
        })
      ])
    })

    // this.tableheaders();
    this.getLabels();

    this.prodservice.getsources()
      .subscribe(result => {
        this.nsources = result['data']
      })

    this.prodservice.gettemplates()
      .subscribe(result => {
        this.ntemplates = result['data']
      })

    this.labelGroup = this.fb.group({
      name: '',
      label_type: '',
      ref_module: '',
      label_option: ['']
    })


    this.getDropDown();
    this.getRefValues();
    this.getDropDowns();

    this.leadsform = this.fb.group({
      rows: this.fb.array([]),
    });




    // this.dataSource2 = this.Data3;

    // this.dataSource.sort = this.sortCol1;
  }
  ngAfterViewInit() {

  }
  sortData(sort) {
    // this.dataSource.sort = this.sort; 
  }

  productList = [];
  public showName(subject) {
    return subject ? subject.name : undefined;
  }
  productGet(page = 1) {
    let params = '?action=summary&page=' + page;
    let formValue = this.leadsupload.value.Tproducts;
    formValue ? params += '&name=' + formValue : '';
    let sub = this.apiService.getProductList(params).subscribe(res => {
      this.productList = res['data']
    })
    // this.apiService.subscriptions.push(sub)
  }
  moveUp(value, index) {
    if (index > 0) {
      const tmp = this.filetitles[index - 1];
      this.filetitles[index - 1] = this.filetitles[index];
      this.filetitles[index] = tmp;
    }
  }

  moveDown(value, index) {
    if (index < this.filetitles.length) {
      const tmp = this.filetitles[index + 1];
      this.filetitles[index + 1] = this.filetitles[index];
      this.filetitles[index] = tmp;
    }
  }

  // removeAll() {
  //   this.dataSource2.data = [];
  // }

  // removeAt(index: number) {
  //   const data = this.dataSource2.data;
  //   data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);

  //   this.dataSource2.data = data;
  // }

  dropTable(event: CdkDragDrop<RightsideMapping[]>) {
    const prevIndex = this.dataSource2.findindex((d) => d === event.item.data);
    moveItemInArray(this.dataSource2, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  uploadheader() {
    // this.showmapping = true;
    this.SpinnerService.show();
    this.isShowMappingss = false;
    this.isShowUploadss = true;
    this.prodservice.uploadfileheaders(this.leadsupload.get('filedata').value).subscribe(results => {
      // this.summarylist = results['data'];
      // this.getStmtdata();
      this.SpinnerService.hide();

      this.dataArray = results;
      this.dataSource2 = new MatTableDataSource(this.dataArray);
      this.filecolumns = results;

      this.automapping();
      // this.filetitles = [];
      // this.pagination = results.pagination ? results.pagination : this.pagination;
      // if (results.status == 'success') {
      //   this.notification.showSuccess("Files Uploaded ")
      //   // this.getStmtdata();
      //   // this.closebtn.nativeElement.click();
      // }
      // else
      // {
      // this.notification.showError(results.description)

      // }
    });

  }

  uploadchooses(evt) {

    this.uploadfile = evt.target.files[0];
    this.leadsupload.get('filedata').setValue(this.uploadfile);

  }

  uploadmapping() {
    // let col1 = this.matchcolumns.controls['panno'].value;
    // let col2 = this.matchcolumns.controls['first_name'].value;
    // let col3 = this.matchcolumns.controls['dob'].value;
    // let col4 = this.matchcolumns.controls['adhaarno'].value;
    // let col5 = this.matchcolumns.controls['last_name'].value;
    // let col6 = this.matchcolumns.controls['middle_name'].value;
    // let col7 = this.matchcolumns.controls['gender'].value;
    // let col8 = this.matchcolumns.controls['marital_status'].value;
    // let col21 = this.matchcolumns.controls['occupancy'].value;
    // let col9 = this.matchcolumns.controls['ph_no'].value;
    // let col10 = this.matchcolumns.controls['mail_id'].value;
    // let col11 = this.matchcolumns.controls['line1'].value;
    // let col12 = this.matchcolumns.controls['line2'].value;
    // let col13 = this.matchcolumns.controls['line3'].value;
    // let col14 = this.matchcolumns.controls['pincode'].value;
    // let col15 = this.matchcolumns.controls['district_name'].value;
    // let col16 = this.matchcolumns.controls['state_name'].value;
    // let col22 = this.matchcolumns.controls['city_name'].value;
    // let col17 = this.matchcolumns.controls['account_number'].value;
    // let col18 = this.matchcolumns.controls['bank'].value;
    // let col19 = this.matchcolumns.controls['branch'].value;
    // let col20 = this.matchcolumns.controls['father_name'].value;
    // let col23 = this.matchcolumns.controls['father_dob'].value;
    // let col24 = this.matchcolumns.controls['mother_name'].value;
    // let col25 = this.matchcolumns.controls['mother_dob'].value;
    // let col26 = this.matchcolumns.controls['spouse_name'].value;
    // let col27 = this.matchcolumns.controls['spouse_dob'].value;
    // let col28 = this.matchcolumns.controls['cifno'].value;
    // let col29 = this.matchcolumns.controls['customheader'].value;


    // const userDefinedArray: UserDefinedItem[] = this.rows.value.map((rowValue: any) => {
    //   return {
    //     label: { id: '1', label_name: rowValue.customheader },
    //     header: rowValue.customfield,
    //   };
    // });
    // console.log("userDefinedArray", userDefinedArray)


    // let data: any =
    // {
    //   "header_mapping": {
    //     "system_defined": {

    //       [col7]: 'gender',
    //       [col8]: 'marital_status',
    //       [col3]: 'lead_dob',
    //       [col21]: 'occupancy',
    //       [col14]: 'pincode',
    //       [col15]: 'district_name',
    //       [col16]: 'state_name',
    //       [col22]: 'city_name',
    //       [col1]: 'pan_no',
    //       [col2]: 'first_name',
    //       [col4]: 'aadhaar_no',
    //       [col5]: 'last_name',
    //       [col6]: 'middle_name',
    //       [col9]: 'ph_no',
    //       [col10]: 'mail_id',
    //       [col28]: 'cifno'




    //     },
    //     "user_defined":

    //       userDefinedArray
    //   },
    //   "source_name": this.leadsupload.controls['source_name'].value,
    //   "duplicate_check": this.dupColumnsForm.controls['dupColumns'].value,


    // }

    // file: this.leadsupload.controls['filedata'].value
    // this.SpinnerService.show();
    // this.prodservice.fileuploads(data, this.leadsupload.controls['filedata'].value).subscribe(results => {

    //   this.SpinnerService.hide();

    //   if (results.status == 'success') {
    //     this.notification.showSuccess("Files Uploaded Successfully")

    //   }
    //   else {
    //     this.notification.showError(results.description)

    //   }
    // }, error => {
    //   this.SpinnerService.hide()
    // });

      const fieldMappings = {
        panno: 'pan_no',
        first_name: 'first_name',
        dob: 'lead_dob',
        adhaarno: 'aadhaar_no',
        last_name: 'last_name',
        middle_name: 'middle_name',
        gender: 'gender',
        marital_status: 'marital_status',
        occupancy: 'occupancy',
        ph_no: 'ph_no',
        mail_id: 'mail_id',
        line1: 'line1',
        line2: 'line2',
        line3: 'line3',
        pincode: 'pincode',
        district_name: 'district_name',
        state_name: 'state_name',
        city_name: 'city_name',
        account_number: 'account_number',
        bank: 'bank',
        branch: 'branch',
        father_name: 'father_name',
        father_dob: 'father_dob',
        mother_name: 'mother_name',
        mother_dob: 'mother_dob',
        spouse_name: 'spouse_name',
        spouse_dob: 'spouse_dob',
        cifno: 'cifno',
        customheader: 'customfield',
      };
    
   
      const header_mapping = {
        system_defined: Object.keys(fieldMappings).reduce((mapping, controlName) => {
          const fieldValue = this.matchcolumns.controls[controlName].value;
          if (fieldValue) {
            mapping[fieldValue] = fieldMappings[controlName];
          }
          return mapping;
        }, {}),
        user_defined: this.rows.value.map((rowValue: any) => ({
          label: { id: '1', label_name: rowValue.customheader },
          header: rowValue.customfield,
        })),
      };
    
      const data = {
        header_mapping,
        source_name: this.leadsupload.controls['source_name'].value,
        duplicate_check: this.dupColumnsForm.controls['dupColumns'].value ? this.dupColumnsForm.controls['dupColumns'].value : [],
      };

      file: this.leadsupload.controls['filedata'].value
    this.SpinnerService.show();
    this.prodservice.fileuploads(data, this.leadsupload.controls['filedata'].value).subscribe(results => {

      this.SpinnerService.hide();

      if (results.status == 'success') {
        this.notification.showSuccess("Files Uploaded Successfully")

      }
      else {
        this.notification.showError(results.description)

      }
    }, error => {
      this.SpinnerService.hide()
    });
    

    
    

  }

  // tableheaders() {
  //   this.SpinnerService.show();
  //   this.prodservice.tableheaderdata().subscribe(results => {
  //     this.SpinnerService.hide();

  //     this.dataArrays = results;
  //     this.dataSource1 = new MatTableDataSource(this.dataArrays);
  //   })
  // }

  getLabels() {
    //leadmasterlabel
    this.SpinnerService.show();
    this.prodservice.leadmasterlabel().subscribe(results => {
      // this.summarylist = results['data'];
      // this.getStmtdata();
      this.SpinnerService.hide();
      let data = results;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.dataArrays.push(data[key]);
        }
        console.log("LABEL ARRAY", this.dataArrays)
      }

      // this.dataArrays = results;
      // this.dataSource1 = new MatTableDataSource(this.dataArrays);
    })

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  newTemp() {
    this.showMappings = true;
    this.showmapping = false;
    // this.matDialog.open(DialogComponent, {
    //   maxWidth: '40vw',
    //   maxHeight: '90vh',
    //   height: '90%',
    //   width: '60%',
    //   panelClass: 'full-screen-modal'
    // })
  }


  automapping() {
    //check length of two string which one length is greater make that as main string and compare another on as substring;
    //Patch the values if a condition is true which is default false;
    let keys = Object.keys(this.matchcolumns.value);
    // keys = keys.map(element => element.replace("_", ''))
    let filecolumns = this.filecolumns;
    var matchedArray = [];
    keys.forEach(element => {

      let str1 = element.replace("_", "");
      let keyLength = str1.length;
      var match = false;
      var matchedValue = ''

      try {
        filecolumns.forEach((element_f, index) => {
          // fileindex = index;
          let str2 = element_f.toLowerCase().replace(" ", "").replace("_", "")
          let columnLength = element_f.length;

          if (columnLength >= keyLength) {
            if (str2.includes(str1) && !matchedArray?.includes(element_f)) {
              match = true;
              matchedValue = element_f;

              throw new DOMException("")
            }
          }

          else {
            if (str1.includes(str2) && !matchedArray?.includes(element_f)) {
              match = true;
              matchedValue = element_f

              throw new DOMException("")
            }
          }
        })
      }
      catch {
        if (match) {
          console.log('Matched')
          this.matchcolumns.controls[element].setValue(matchedValue);
          matchedArray.push(matchedValue);
        }
      }



    })


  }

  existingTemp() {
    this.showmapping = true;
    this.showMappings = false;
    this.isShowUploadss = false;
    // this.showmappings = false;
  }

  // openDialog() {

  // }

  // showDialog(){
  //   this.matDialog.open(DialogComponent)
  // }


  createTemplate() {
    let col1 = this.matchcolumns.controls['panno'].value;
    let col2 = this.matchcolumns.controls['first_name'].value;
    let col3 = this.matchcolumns.controls['dob'].value;
    let col4 = this.matchcolumns.controls['adhaarno'].value;
    let col5 = this.matchcolumns.controls['last_name'].value;
    let col6 = this.matchcolumns.controls['middle_name'].value;
    let col7 = this.matchcolumns.controls['gender'].value;
    let col8 = this.matchcolumns.controls['marital_status'].value;
    let col21 = this.matchcolumns.controls['occupancy'].value;
    let col9 = this.matchcolumns.controls['ph_no'].value;
    let col10 = this.matchcolumns.controls['mail_id'].value;
    let col11 = this.matchcolumns.controls['line1'].value;
    let col12 = this.matchcolumns.controls['line2'].value;
    let col13 = this.matchcolumns.controls['line3'].value;
    let col14 = this.matchcolumns.controls['pincode'].value;
    let col15 = this.matchcolumns.controls['district_name'].value;
    let col16 = this.matchcolumns.controls['state_name'].value;
    let col22 = this.matchcolumns.controls['city_name'].value;
    let col17 = this.matchcolumns.controls['account_number'].value;
    let col18 = this.matchcolumns.controls['bank'].value;
    let col19 = this.matchcolumns.controls['branch'].value;
    let col20 = this.matchcolumns.controls['father_name'].value;
    let col23 = this.matchcolumns.controls['father_dob'].value;
    let col24 = this.matchcolumns.controls['mother_name'].value;
    let col25 = this.matchcolumns.controls['mother_dob'].value;
    let col26 = this.matchcolumns.controls['spouse_name'].value;
    let col27 = this.matchcolumns.controls['spouse_dob'].value;
    let col28 = this.matchcolumns.controls['cifno'].value;
    let col29 = this.matchcolumns.controls['customheader'].value;

    const userDefinedArrays: UserDefinedItem[] = this.rows.value.map((rowValue: any) => {
      return {
        label: { id: '1', label_name: rowValue.customheader },
        header: rowValue.customfield,
      };
    });


    let data: any = {
      "template_name": this.newTempl.controls['template_name'].value,

      "header_mapping": {
        "system_defined": {
          [col7]: 'gender',
          [col8]: 'marital_status',
          [col3]: 'lead_dob',
          [col21]: 'occupancy',
          [col14]: 'pincode',
          [col15]: 'district_name',
          [col16]: 'state_name',
          [col22]: 'city_name',
          [col1]: 'pan_no',
          [col2]: 'first_name',
          [col4]: 'aadhaar_no',
          [col5]: 'last_name',
          [col6]: 'middle_name',
          [col9]: 'ph_no',
          [col10]: 'mail_id',
          [col28]: 'cifno'

        },
        "user_defined":
          userDefinedArrays
        // {
        //   [col29]: 'customfield'
        // }
      }
    }

    this.prodservice.createnewtemplate(data).subscribe(results => {

      if (results) {
        this.notification.showSuccess(results.message)
      }
      else {
        this.notification.showError(results.description)

      }
    });



  }

  uploadtempdata() {


    let data: any = {
      "template_id": this.leadsupload.controls['templates'].value,
      "source_name": this.leadsupload.controls['source_name'].value,
      // "duplicate_check": this.dupColumnsForm.controls['dupColumns'].value,
      duplicate_check: this.dupColumnsForm.controls['dupColumns'].value ? this.dupColumnsForm.controls['dupColumns'].value : [],
      // "product_id": this.leadsupload.value.Tproducts.id
    }
    file: this.leadsupload.controls['filedata'].value
    this.SpinnerService.show();
    this.prodservice.fileuploads(data, this.leadsupload.controls['filedata'].value).subscribe(results => {
      // this.summarylist = results['data'];
      // this.getStmtdata();
      this.SpinnerService.hide();
      // this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Files Uploaded Successfully");
        this.completed.emit('reload');
        // this.closebtn.nativeElement.click();
      }
      else {
        this.notification.showError(results.description)

      }
    },
      (error) => {

        this.SpinnerService.hide();
        this.notification.showWarning('Check API & Request')
      });


  }
  skipToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < this.stepper.steps.length) {
      this.stepper.selectedIndex = stepIndex;
    }
  }

  getDropDown() {
    this.prodservice.dropdownvalues()
      .subscribe((results: any) => {
        this.droplist = results['Data'];
      })
  }
  getRefValues() {
    this.prodservice.dropdownRefValues().subscribe((results: any) => {
      this.reflist = results['Data'];
    })
  }
  addNewLabel() {
    let formValue = this.labelGroup.value;
    if (formValue.label_option == "" || formValue.label_option == undefined || formValue.label_option == null) {
      let payload = {
        "name": formValue.name,
        "label_type": formValue.label_type,
        "ref_module": formValue.ref_module

      }
      this.prodservice.addNewLabel(payload).subscribe(result => {
        if (result.id !== null) {
          // this.apiResponses = result;
          this.notification.showSuccess("Added Successfully")
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })
    }
    else {
      let payload = {
        "name": formValue.name,
        "label_type": formValue.label_type,
        "ref_module": formValue.ref_module

      }
      this.prodservice.addNewLabel(payload).subscribe(result => {
        if (result.status !== null) {
          // this.apiResponses = result;
          this.notification.showSuccess("Added Successfully ")
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })
    }
  }

  // addApiResponse(response: any) {
  //   this.apiResponses.push(response);
  // }

  getDropDowns() {
    this.prodservice.dropdownLabel()
      .subscribe((results: any) => {
        this.droplists = results['Data'];
      })
  }

  addRow() {
    let formsValue = this.matchcolumns.value;
    console.log('Leads Custom Arrya', formsValue)
    const newRow = this.fb.group({
      customheader: [''], // You can set an initial value here if needed
      customfield: [''], // You can set an initial value here if needed
    });
    this.rows.push(newRow);

  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  get rows() {
    return this.matchcolumns.get('rows') as FormArray;
  }













}
