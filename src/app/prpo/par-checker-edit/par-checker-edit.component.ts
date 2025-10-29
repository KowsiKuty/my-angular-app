import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { isBoolean } from 'util';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
// import { ViewChild } from '@angular/core';
// import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
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
  selector: 'app-par-checker-edit',
  templateUrl: './par-checker-edit.component.html',
  styleUrls: ['./par-checker-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ParCheckerEditComponent implements OnInit {
  approvalForm: FormGroup
  rejectForm: FormGroup

  PARmakerForm: FormGroup;
  PARmakerDetailsForm: FormGroup;
  tokenValues: any
  pdfUrls: string;
  jpgUrls: any;
  imageUrl = environment.apiURL
  pardetails: Array<any> = [];
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]

  expensetype: any;

  fileData: File = null;
  fileName: string
   
  todayDate = new Date();

  // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  // @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  // @ViewChild('rforInput') rforInput: any;
  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  approvedisable = false;
  rejectdisable = false;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      id: '',
      remarks: ''
    })
    this.rejectForm = this.fb.group({
      id: '',
      remarks: ['', Validators.required]
    })

    this.PARmakerForm = this.fb.group({
      id: [''],
      content: [''],
      no: [''],
      date: [{ value: "" }],
      year: [''],
      amount: [''],
      desc: [''],
      isbudgeted: [0],
      burstlinewise: [0],
      burstmepwise: [0],
      contigency: [0],
    })

    this.getparedit();
    this.getappremoveid();
  }
  getappremoveid() {
    let data: any = this.prposhareService.ParcheckerShare.value
    let id = data.id
    this.approvalForm.patchValue({
      id: id
    })
    this.rejectForm.patchValue({
      id: id
    })
  }


  amt: any;
  sum: any =0.00;
  perceTotalsum: any;
  datasums() {
    this.amt = this.PardetailsList.map(x => x.originalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    

  }
  datasumscon() {
    this.amt = this.PardetailsList.map(x => x.amount);
    this.perceTotalsum = this.amt.reduce((a, b) => a + b, 0);

  }

  fileidnumber: any
  fileinfo: any 
  PardetailsList: any 
  getparedit() {
    let data: any = this.prposhareService.ParcheckerShare.value
    let id = data.id
    this.SpinnerService.show();
    this.dataService.getparEdit(id)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
      
        this.fileidnumber = result.pardetails[0].file_id
        this.fileinfo = result['pardetails']
        const { no, year, originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date, contigency, content } = result;
        let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.PARmakerForm.patchValue({
          id, no, year, amount:originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date: dates, contigency, content
        })
        this.PardetailsList = result.pardetails
        if(result){
          this.datasums();
          this.datasumscon();
          this.SpinnerService.hide();
        }

        console.log(JSON.stringify(this.PardetailsList))
        

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  onCancelClick() {
    this.onCancel.emit()
  }

  fileDownloads(id, fileName) {
    console.log("fileName",fileName)
    this.SpinnerService.show();
    this.dataService.fileDownloadspar(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let filevalue = fileName.split('.')
        let binaryData = [];
        binaryData.push(results)
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl+ "prserv/prpo_fileview/"+ id+"?token=" + token 
    }
    else {
      this.showimagepopup = false
    }

  };


  approveClick() {
    this.approvedisable = true;
    let data = this.approvalForm.value
    this.SpinnerService.show();
    this.dataService.getparapprovaldata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("Maker Not Allowed To Approve")
          this.approvedisable = false;
          return false
        } else if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description );
          return false;
        }        
        else {

          this.notification.showSuccess("Successfully Approved!...")
          this.SpinnerService.hide();
          this.approvalForm.controls['remarks'].reset()
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  rejectClick() {
    this.rejectdisable = true;
    if (this.rejectForm.value.remarks == "") {
      this.notification.showWarning('Remarks is Must to Reject');
      this.rejectdisable = false;
      return false;
    }
    let data = this.rejectForm.value
    this.SpinnerService.show();
    this.dataService.getparrejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.SpinnerService.hide();
          this.rejectdisable = false;
          return false
        } else if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description);
          return false;
        } 
        else {
          this.SpinnerService.hide();
          this.notification.showError("Successfully Rejected!...")
          this.onSubmit.emit();
        }
        this.rejectForm.controls['remarks'].reset()
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }











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


}


