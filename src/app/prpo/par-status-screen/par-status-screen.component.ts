import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { isBoolean } from 'util';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-par-status-screen',
  templateUrl: './par-status-screen.component.html',
  styleUrls: ['./par-status-screen.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ParStatusScreenComponent implements OnInit {
  PARmakerForm: FormGroup;
  PARmakerDetailsForm: FormGroup;
  pardetails: Array<any> = [];
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
 
  expensetype: any;
  todayDate = new Date();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;
  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    this.PARmakerForm = this.fb.group({
      id: [''],
      no: [''],
      date: [{ value: ""}],
      year: [''],
      amount: [''],
      desc: [''],
      isbudgeted: [1],
      burstlinewise: [0],
      burstmepwise: [0],
      contigency: [0],
      content: [''],
      pardetails: new FormArray([
      ])
    })

    this.getParexpensetype();
    this.getparedit();
  }

  amt: any;
  sum: any = 0.00;
  perceTotalsum: any;
  datasums() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => x.amount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }
  datasumscon() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => x.perceTotal);
    this.perceTotalsum = this.amt.reduce((a, b) => a + b, 0);

  }

  getSections(form) {
    return form.controls.pardetails.controls;
  }
 

  getFormArray(): FormArray {
    return this.PARmakerForm.get('pardetails') as FormArray;
  }

  status: any
  statusremarks: any
  getparedit() {
    let data: any = this.prposhareService.ParStatusShare.value
    let id = data.id
    this.SpinnerService.show();
    this.dataService.getparEdit(id)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
        const { no, year, originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date, contigency, par_status, remarks, content } = result;
        let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.PARmakerForm.patchValue({
          id, no, year, amount: originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date: dates, contigency, content
        })
        this.status = par_status
        this.statusremarks = remarks
        for (let detail of result.pardetails) {

          let exptypeControl: FormControl = new FormControl('');
          let requestfor: FormControl = new FormControl('');
          let budgetedControl: FormControl = new FormControl('');
          let descControl: FormControl = new FormControl('');
          let remarkControl: FormControl = new FormControl('');
          let yearControl: FormControl = new FormControl('');
          let amountControl: FormControl = new FormControl('');
          let idControl: FormControl = new FormControl('');
          let perceControl: FormControl = new FormControl('');
          let perceTotalControl: FormControl = new FormControl('');


          idControl.setValue(detail.id);
          exptypeControl.setValue(detail.exptype)
          requestfor.setValue(detail.requestfor);
          budgetedControl.setValue(detail.budgeted);
          descControl.setValue(detail.desc);
          remarkControl.setValue(detail.remarks);
          yearControl.setValue(detail.year);
          amountControl.setValue(detail.originalamount);
          perceControl.setValue((contigency * amountControl.value) / 100);
          perceTotalControl.setValue((amountControl.value + perceControl.value));

          this.getFormArray().push(new FormGroup({
            id: idControl,
            exptype: exptypeControl,
            requestfor: requestfor,
            budgeted: budgetedControl,
            desc: descControl,
            remarks: remarkControl,
            year: yearControl,
            amount: amountControl,
            perce: perceControl,
            perceTotal: perceTotalControl
          }));
          this.datasums();
          this.datasumscon();
          requestfor.valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                // console.log('inside tap')

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
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnrfor(rfor?: any) {
    if ((typeof rfor) === 'string') {
      return rfor;
    }
    return rfor ? this.requestforList.find(_ => _.name === rfor).name : undefined;
  }
 

  onCancelClick() {
    this.onCancel.emit()
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

  getParexpensetype() {
    this.SpinnerService.show();
    this.dataService.getParexpensetype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.expensetype = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
}
