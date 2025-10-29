import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import {MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AmountPipeCustomPipe } from '../amount-pipe-custom.pipe';
import { Console } from 'console';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface amountlistss {
  amount: any;
}
export interface rforlistss {
  id: any;
  name: string;
}


@Component({
  selector: 'app-par-make-details',
  templateUrl: './par-make-details.component.html',
  styleUrls: ['./par-make-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class PARMakeDetailsComponent implements OnInit {
  files: FormGroup;
  PARmakerForm: FormGroup;
  PARmakerDetailsForm: FormGroup;
  pardetails: Array<any> = [];
  // PARmakerconForm: FormGroup;   //6558

  
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]


  
  expensetype: any;
  fileData: File = null;
  fileName: any
  todayDate = new Date();
  images = [];
  groups: any;
  file_id: any;
  public errorMessage: string = '';
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;
  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pardett: any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();
  clicked = false;
  x: any;
  fileUpload: any = [];
  FinancialYearList: any
  conti_value: any;
  percentage: any;
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private SpinnerService: NgxSpinnerService, private datePipe: DatePipe, private errorHandler: ErrorHandlingServiceService, private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    //6558
    // this.PARmakerconForm = this.fb.group({
    //   id: '',
    //   contigency: [0, Validators.required],
    // })
//6558
    this.PARmakerForm = this.fb.group({
      content: ['', Validators.required],
      date: ["", Validators.required],
      year: ['', Validators.required],
      amount: [0, Validators.required],
      desc: ['', Validators.required],
      isbudgeted: [1, Validators.required],
      burstlinewise: [0, Validators.required],
      burstmepwise: [0, Validators.required],
      contigency: [0, Validators.required],
      par_status:[""],
      pardetails: new FormArray([
        this.pardet(),

      ]),

    })
    


    this.files = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

// Listen to changes in "amount"
  this.PARmakerForm.get('amount')?.valueChanges.subscribe(val => {
    if (val !== null && val !== undefined && val !== '') {
      // Always keep numeric value
      const numericValue = val.toString().replace(/,/g, '');
      if (!isNaN(numericValue)) {
        const numberValue = Number(numericValue);

        // Format with commas for display
        const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

        // Patch formatted string into the input field
        this.PARmakerForm.get('amount')?.setValue(formatted, { emitEvent: false });
      }
    }
  });

  this.PARmakerForm.get('amount')?.valueChanges.subscribe(val => {
    if (val !== null && val !== undefined && val !== '') {
      // Always keep numeric value
      const numericValue = val.toString().replace(/,/g, '');
      if (!isNaN(numericValue)) {
        const numberValue = Number(numericValue);

        // Format with commas for display
        const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

        // Patch formatted string into the input field
        this.PARmakerForm.get('amount')?.setValue(formatted, { emitEvent: false });
      }
    }
  });


    let rforkeyvalue: String = "";
    // this.getreqforFK();
    this.getParyear();
    this.getParexpensetype();

  }
  pardet() {
    let group = new FormGroup({
      exptype: new FormControl(''),
      budgeted: new FormControl(1),
      requestfor: new FormControl(''),
      desc: new FormControl(''),
      year: new FormControl(''),
      amount: new FormControl(0,),
      remarks: new FormControl(''),
      //6558
      perce : new FormControl(''),
      perceTotal: new FormControl('')
//6558
    })


    group.get('requestfor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          

        }),
        switchMap(value => this.dataService.getreqforFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.requestforList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    group.get('amount').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
      ).subscribe(value => {
        //console.log("should be called first")
        this.datasums()
        if (!this.PARmakerForm.valid) {
          return;
        }

        this.linesChange.emit(this.PARmakerForm.value['pardetails']);
      }
      )
    return group
  }
//6558

perceTotalsum: any =0.00
  datasumscon() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => x.perceTotal);
    this.perceTotalsum = this.amt.reduce((a, b) => a + b, 0);
  }
  // checkonevalue: any
  // contigencyvaluechanges(amountControl, perceControl, perceTotalControl: FormControl) {
  //   this.checkonevalue = ((this.PARmakerconForm.value.contigency * amountControl.value) / 100)
  //   perceControl.setValue(this.checkonevalue) //contigency amt
  //   perceTotalControl.setValue(amountControl.value + perceControl.value)
  //   this.datasumscon()
  // }
//   //6558
  
 
  ///////////to add total amount
  amt: any;
  sum: any = 0.00;
  filesss: any;
  sumsss: any;
  datasums() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => +x.amount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);

    //  this.sum = this.PARmakerForm.value.pardetails
    // .reduce((total, x) => total + +(x.amount?.toString().replace(/,/g, '') || 0), 0);

    
  }
  


///to check BPA AMT WITH BPA DETAILS TOTAL AMT-6558
  amtcheck(){
    if(this.sum != this.PARmakerForm.value.amount ){
      // this.toastr.warning
      this.toastr.warning('','Pls check BPA AMT & TOTAL AMOUNT',{timeOut:1500})

    }
  }
  

  getSections(form) {
    return form.controls.pardetails.controls;
  }
  ////// to add table row
  addSection(data) {
    console.log("data for add", data)
    if(data.length==2){
      this.notification.showWarning("Maximum Limit Reached")
      return false 
    }
    const control = <FormArray>this.PARmakerForm.get('pardetails');
    control.push(this.pardet());
    let exptypeAuto 
    if( data[0].exptype == "Capex"){
      exptypeAuto = "Opex"
    }else if(data[0].exptype == "Opex"){
      exptypeAuto = "Capex"
    }
    else{
      exptypeAuto = ""
    }
    this.PARmakerForm.get('pardetails')['controls'][1].get('exptype').setValue(exptypeAuto)
  }
  /////// to remove table row
  removeSection(index) {
    const control = <FormArray>this.PARmakerForm.get('pardetails');
    control.removeAt(index);
    // this.files.value.file_upload.splice(i)
    this.FileDataArray.splice(index, 1)	
    this.FileDataArrayIndex.splice(index, 1)	
    this.datasums()
  }
  //////////////autocomplete scroll requestfor
  autocompleterforScroll() {
    setTimeout(() => {
      if (
        this.matrforAutocomplete &&
        this.autocompleteTrigger &&
        this.matrforAutocomplete.panel
      ) {
        fromEvent(this.matrforAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrforAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrforAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrforAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrforAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getreqforFK(this.rforInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.requestforList = this.requestforList.concat(datas);
                    
                    if (this.requestforList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  /////////////////////display function requestfor
  displayFnrfor(rfor?: any) {
    return rfor ? this.requestforList.find(_ => _.name === rfor).name : undefined;
  }

  getreqforFK() {
    this.SpinnerService.show();
    this.dataService.getreqfor()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.requestforList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  //////////////////par submit
  parmakerSubmit() {

    
    
    if( (this.PARmakerForm.value.date == "") || (this.PARmakerForm.value.date == null) || (this.PARmakerForm.value.date == undefined)   ){
      this.notification.showWarning("Choose Date")
      return false
    }

    if( (this.PARmakerForm.value.year == "") || (this.PARmakerForm.value.year == null) || (this.PARmakerForm.value.year == undefined)   ){
      this.notification.showWarning("Choose Year")
      return false
    }

    if( (this.PARmakerForm.value.amount == "") || (this.PARmakerForm.value.amount == null) || (this.PARmakerForm.value.amount == undefined)   ){
      this.notification.showWarning("Please Fill Amount")
      return false
    }

    if( (this.PARmakerForm.value.desc == "") || (this.PARmakerForm.value.desc == null) || (this.PARmakerForm.value.desc == undefined)   ){
      this.notification.showWarning("Please Fill Description")
      return false
    }


    let searchdel = this.PARmakerForm.value;

      if (searchdel.amount) {
    searchdel.amount = searchdel.amount.toString().replace(/,/g, '');
    searchdel.amount = +searchdel.amount;

  }

      let dataPardetails = this.PARmakerForm.value.pardetails


dataPardetails.forEach((item: any) => {
  item.amount = +item.amount;
  item.perce = +item.perce;
  item.perceTotal = +item.perceTotal;
});







    if( dataPardetails.length == 0  ){
      this.notification.showWarning("Details are not Filled")
      return false
    }

    let duplicateCheckOnExpense = this.PARmakerForm.value['pardetails'].map(x => x.exptype);
    console.log("duplicate check in commodity", duplicateCheckOnExpense)

    for (let i in duplicateCheckOnExpense){
      let first_index = duplicateCheckOnExpense.indexOf(duplicateCheckOnExpense[i]);
      let last_index = duplicateCheckOnExpense.lastIndexOf(duplicateCheckOnExpense[i]);

      console.log("first_index--->", first_index);
        console.log("last_index--->", last_index);  

      if (first_index !== last_index) {
        console.log('Duplicate item in array ' + duplicateCheckOnExpense[i]);
        console.log('Duplicate item in array index ' + i);   
        let indexNumber = Number(i)
        this.notification.showWarning("There is a duplicate Expense Type of '"+ duplicateCheckOnExpense[i] +"' indentified in line "+ (indexNumber + 1))
        return false
      }
    }

    //For year validation - BUG ID:6712-c
    let a= this.PARmakerForm.value.pardetails
    const d = new Date();
    let year = d.getFullYear();
    if(a.length !=0){
    for(let i=0; i<a.length;i++){

      
   let yr = this.PARmakerForm.get('pardetails')['controls'][i].get('year')
   let indexNumber = Number(i)

   if( yr.value <= year-2 || yr.value>= year+2){
    
    this.toastr.warning('','Pls Enter Correct Year in line no' + (indexNumber+1),{timeOut:1500});
    return false

   }
  }
}
// console.log('contigency value field',this.PARmakerForm.value.contigency),
// console.log('this.percentage',this.percentage)
//6558

if(this.PARmakerForm.value.contigency > this.percentage || this.PARmakerForm.value.contigency <0 ){

  this.notification.showError('Contigency should be more than 1 and less than' + this.percentage + '%');
  return false;

}


    for (let i in dataPardetails) {
      let exptype = dataPardetails[i].exptype
      let requestfor = dataPardetails[i].requestfor

      let desc = dataPardetails[i].desc
      let year = dataPardetails[i].year

      let amount = dataPardetails[i].amount
      let remarks = dataPardetails[i].remarks

      let indexNumber = Number(i)
      if ((exptype == "") || (exptype == undefined) || (exptype == null)) {
        this.notification.showWarning("Expense Type is not filled, Please check on line " + (indexNumber + 1))
        return false
      }
      
      if ((requestfor == "") || (requestfor == undefined) || (requestfor == null)) {
        this.notification.showWarning("Request For is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((desc == "") || (desc == undefined) || (desc == null)) {
        this.notification.showWarning("Description is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((year == "") || (year == undefined) || (year == null)) {
        this.notification.showWarning("Year is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((amount == "") || (amount == undefined) || (amount == null)) {
        this.notification.showWarning("Amount is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((remarks == "") || (remarks == undefined) || (remarks == null)) {
        this.notification.showWarning("Remarks is not filled, Please check on line " + (indexNumber + 1))
        return false
      }
    }
    
    this.SpinnerService.show();
    let amtvalid = this.PARmakerForm.value.amount
    if (this.PARmakerForm.value.amount <= 0) {
      this.notification.showWarning('Invalid BPA Amount')
      this.SpinnerService.hide();
    }
    if (amtvalid > this.sum) {
      this.notification.showWarning("Check BPA Details Amount is Low")
      this.SpinnerService.hide();
      return false
    }
    if (amtvalid < this.sum) {
      this.notification.showWarning("Check BPA Amount is Low, BPA Details Amount exceed")
      this.SpinnerService.hide();
      return false
    }
    let date = this.PARmakerForm.value.date
    // console.log('dataaaaaa', date)
    let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
    //console.log('datessss', dates)  
    this.PARmakerForm.value.date = dates;
    // let datadetails = this.PARmakerForm.value.pardetails
    let filesvalue = this.files.value.file_upload
    // if( datadetails.length != filesvalue.length ) { 
    //   this.SpinnerService.hide();
    //   this.clicked = false
    //   this.notification.showWarning("Files are missing on the details, Please check ")
    //   return false
    //   }
    if( (this.PARmakerForm.value.contigency == "") || (this.PARmakerForm.value.contigency == null) || (this.PARmakerForm.value.contigency == undefined) ){
      
      this.PARmakerForm.value.contigency = 0;

    }
    // this.Getyear();
    this.clicked = true
    let data = this.PARmakerForm.value
    // this.PARconFormSubmit(data);


    this.formDataChange(data);
    
    

  }
  /////////////to prevent special charecters
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  ///////////////////accept only for number
  omit_special_num(event) {
    var k;
    k = event.charCode;
    return ((k == 190) || (k >= 48 && k <= 57));
  }

  omit_special_charcter(event){
    var k;
    k = event.charCode;
    return ((k != 8) && (k >= 48 && k <= 57));

  }
  ///////////// cancel path
  onCancelClick() {
    this.onCancel.emit()
  }
  

  ////////////////////////content editor

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
        ["delete", ["deleteRow", "deleteCol", "deleteTable"]],
        ["style", ["tableHeader", "tableBorderStyle", "tableBorderColor"]],
      ],
      link: [["link", ["linkDialogShow", "unlink"]]],
      air: [
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
      ],
    },
    height: "200px",
    toolbar: [
      ["misc", ["codeview", "undo", "redo", "codeBlock"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style0", "ul", "ol", "paragraph", "height"]],
      ["insert", ["picture", "link", "video", "hr", "customTable"]],
      [
        "table",
        ["addRow", "addColumn", "deleteRow", "deleteColumn", "deleteTable"],
      ],
    ],
    buttons: {
      customTable: function (context) {
        const ui = ($ as any).summernote.ui;
        return ui
          .button({
            contents: '<i class="note-icon-table"/>Table',
            tooltip: "Insert a 3x3 Table",
            click: function () {
              context.invoke("editor.focus"); // Ensure the editor is focused

              const editor = context.layoutInfo.editable[0];
              if (!editor) {
                console.error("Editor context is undefined");
                return;
              }

              const table = document.createElement("table");
              table.style.borderCollapse = "collapse";
              table.style.width = "100%";

              for (let i = 0; i < 3; i++) {
                const row = table.insertRow();
                for (let j = 0; j < 3; j++) {
                  const cell = row.insertCell();
                  cell.style.border = "1px solid black";
                  cell.style.padding = "5px 3px";
                  cell.style.height = "30px";
                  cell.style.width = "270px";
                  cell.style.boxSizing = "border-box";
                  cell.innerText = " ";
                }
              }

              const range = window.getSelection()?.getRangeAt(0);
              if (!range) {
                console.error(
                  "Range is undefined. Ensure the editor is focused."
                );
                return;
              }

              range.deleteContents();
              range.insertNode(table);
              range.collapse(false);
            },
          })
          .render();
      },
    },
    callbacks: {
      onInit: function() {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector('.note-editable');
        if (editor) {
          editor.addEventListener('input', function() {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName('table'));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = 'collapse';
              htmlTable.style.width = '100%';
              htmlTable.style.textAlign = 'left';
  
              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll('th, td');
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = '1px solid black';
                htmlCell.style.padding = '5px 3px';
                htmlCell.style.boxSizing = 'border-box';
              });
            });
          });
        }
      },
    },
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.PARmakerForm.get('html').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }
  FileDataArray = []
  FileDataArrayIndex = []
  onFileSelected(e, j) {
    // let datavalue = this.files.value.file_upload
    // if (this.files.value.file_upload.length > j) {
    //   this.files.value.file_upload[j] = e.target.files[0]
    // } else {
    //   for (var i = 0; i < e.target.files.length; i++) {
    //     this.files.value.file_upload.push(e.target.files[i])
    //     let checkvalue = this.files.value.file_upload
    //   }
    // }

    let datavalue = this.files.value.file_upload
      this.FileDataArray[j] = e.target.files[0]
      this.FileDataArrayIndex[j] = j
      console.log("this.FilesDataArray", this.FileDataArray)
      console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex)
  }



  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  getParyear() {
    this.SpinnerService.show();
    this.dataService.getParyear()
      .subscribe((results: any) => {
        if (results.code) {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }
        this.SpinnerService.hide();
        let datas = results["data"];
        this.FinancialYearList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  
  getParexpensetype() {
    this.SpinnerService.show();
    this.dataService.getParexpensetype()
      .subscribe((results: any) => {
        if (results.code) {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }
        this.SpinnerService.hide();
        let datas = results["data"];
        this.expensetype = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }




  formDataChange(dataPAR){
    console.log("fdataPAR", dataPAR)
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex
    let formdataValue = this.FileDataArray
    console.log("formdataIndex  after", formdataIndex)
    console.log("formdataValue  after", formdataValue)
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = 'file_key' + formdataIndex[i];
      let pairValue = formdataValue[i];
      if( formdataValue[i] == ""  ){
        console.log("")
      }else{
      formData.append( keyvalue, pairValue)
      }
  }
    let ParFormData = this.PARmakerForm.value.pardetails
  
    for( let filekeyToinsert in formdataIndex ){
      let datakey = "file_key"+filekeyToinsert
      console.log("datakey", datakey)
      ParFormData[filekeyToinsert].file_key = datakey
    }
    
    let datavalue = JSON.stringify(dataPAR)
    formData.append('data', datavalue);
      console.log(datavalue)
      console.log(formData)
      this.SpinnerService.show();


      // this.dataService.PARmakerFormSubmit(formData)
      this.dataService.PAReditFormSubmit(formData)
      .subscribe(result => {
        this.SpinnerService.hide();
        //6558
        // console.log('result.Percentage==>',result.percentage)
        // if (result.percentage) {
        //   this.notification.showError('Maximum Allotted Contingency Percentage is ' + result.percentage + ' %',)
        //   this.clicked = false
        //   this.SpinnerService.hide();
        //   return false
        // }

        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.SpinnerService.hide();
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("UNEXPECTED ERROR")
          this.SpinnerService.hide();
        }
        else if(result?.code){
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
        }
        else {
          this.notification.showSuccess("Successfully Created!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        
        return true
      }
      ,(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  
  
  }
  duplicateCheckExpense(){

  }

  //BUG ID:6558-C while changing amount conti amount calculation1

  ContigencyCal(e,section,i){
    // console.log('e==>',e.target.value);
    // let z= this.PARmakerForm.value.pardetails;
    // console.log('z==>',z)
    // console.log('amount',z[i].amount)
    // console.log('contigencyfield=>',z[i].perce)
    let x=((this.PARmakerForm.value.contigency * section.value.amount) / 100)
    this.PARmakerForm.get('pardetails')['controls'][i].get('perce').setValue(x)

    let amount1=section.value.amount;
    let contiamt = section.value.perce;
    let totalamt = (+amount1) + (contiamt);
    this.PARmakerForm.get('pardetails')['controls'][i].get('perceTotal').setValue(totalamt)
    
    this.datasumscon()
  }


 
// while changing Contigency contigency amount calculation
  ContigencyCalculation(e){
    let a= this.PARmakerForm.value.pardetails
    // console.log('arraylength==>',a.length)
    // let conti=e.target.value;
    // let b= this.PARmakerForm.value.pardetails.value.amount
    // let b= this.PARmakerForm.value.pardetails
    // let c= this.PARmakerForm.value.pardetails.value.perce
    // let c= this.PARmakerForm.value.pardetails
    //  console.log('b[0].amount==>',a[0].amount)
    //  console.log('c[0].perce==>',a[0].perce)


   if(a.length != 0){

    for(let i=0; i<a.length;i++){
     
      let amountfield = this.PARmakerForm.get('pardetails')['controls'][i].get('amount').value 
      console.log("amount field", amountfield) 
      // let concalculation = (this.PARmakerForm.get('pardetails')['controls'][i].get('amount').value * this.PARmakerForm.value.Contingency ) / 100 
      let concalculation=((this.PARmakerForm.value.contigency * this.PARmakerForm.get('pardetails')['controls'][i].get('amount').value) / 100)
      console.log('concalculation==>',concalculation)
      this.PARmakerForm.get('pardetails')['controls'][i].get('perce').setValue(concalculation) 
      this.PARmakerForm.get('pardetails')['controls'][i].get('perceTotal').setValue((+amountfield) + (+concalculation))

//       const perceValue = concalculation ? Number(concalculation) : 0;
// const perceTotalValue = (amountfield ? Number(amountfield) : 0) + (+concalculation);




  // // Format Indian currency style
  //     const formattedperceValue = new Intl.NumberFormat('en-IN').format(perceValue);
  //     const formattedperceTotalValue = new Intl.NumberFormat('en-IN').format(perceTotalValue);


  //        this.PARmakerForm.get('pardetails')['controls'][i].get('perce').setValue(formattedperceValue) 
  //     this.PARmakerForm.get('pardetails')['controls'][i].get('perceTotal').setValue(formattedperceTotalValue)



          this.datasumscon()
       
    }

   }

    
   }
    //Contigency validation API
   contivalue(){
      this.dataService.getcontivalue()
      .subscribe(result => {
        this.conti_value = result
        this.percentage = result.percentage
          console.log('conti_value',this.conti_value);
      })
   }

   convalidation(e){
    
let per = e.target.value;
let a= this.PARmakerForm.value.pardetails


    if( per > this.percentage || per <0 ){

      this.toastr.warning('','Contigency should be more than 1 and less than' + this.percentage + '%',{timeOut:1500});
      // this.PARmakerForm.get('contigency').reset();
      // for(let i=0; i<a.length;i++){
    //   this.PARmakerForm.get('pardetails')['controls'][i].get('perce').reset();
    // }
     
   }
   
  }
  //6558

  formatAmount(index: number) {
  const pardetailsArray = this.PARmakerForm.get('pardetails') as FormArray;
  const group = pardetailsArray.at(index) as FormGroup;
  const amountControl = group.get('amount');

  let val = amountControl?.value;

  if (val !== null && val !== undefined && val !== '') {
    // remove commas
    const numericValue = val.toString().replace(/,/g, '');
    if (!isNaN(numericValue)) {
      const numberValue = Number(numericValue);

      // Format Indian currency style
      const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

      if (formatted !== val) {
        amountControl?.setValue(formatted, { emitEvent: false });
      }
    }
  }
}

onAmountInput(event: any, section: FormGroup) {
  const input = event.target.value;
  const rawValue = input ? input.toString().replace(/,/g, '') : '';
  section.get('amount')?.setValue(rawValue, { emitEvent: false });
}

// datasums() {
//   // Sum all amounts (strip commas just in case)
//   this.sum = this.PARmakerForm.value.pardetails
//     .reduce((total, x) => total + +(x.amount?.toString().replace(/,/g, '') || 0), 0);
// }


}
    

