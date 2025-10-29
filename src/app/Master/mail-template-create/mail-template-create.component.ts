import { Component,ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { masterService } from '../master.service';
import { fromEvent, Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { NotificationService } from 'src/app/service/notification.service';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
export interface supplierListss {
  mail_type: string;
  id: number;
}
export interface columnListss {
  column_name: string;
  display_name: string;
  id: number;
}
@Component({
  selector: 'app-mail-template-create',
  templateUrl: './mail-template-create.component.html',
  styleUrls: ['./mail-template-create.component.scss']
})

export class MailTemplateCreateComponent implements OnInit {
  mailtcrform:FormGroup;
  has_next = true;
  isLoading = false;
  has_previous = true;
  presentpage = 1;
  Supplierlist: Array<supplierListss>;
  Columnlist: Array<columnListss>;
  flag_type :any;
  @ViewChild("suppliertype") matsuppAutocomplete: MatAutocomplete;
  @ViewChild("suppInput") suppInput: any;
  @ViewChild("columntype") matcolumnAutocomplete: MatAutocomplete;
  @ViewChild("columnInput") columnInput: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  constructor(private formbuilder: FormBuilder,private spinner:NgxSpinnerService,
    private router:Router,private datepipe:DatePipe,private mastService: masterService,private Notification:NotificationService
    ) { }

  ngOnInit(): void {
    this.mailtcrform = this.formbuilder.group(
      {
        temp_name: [''],
        temp_type:[''],
        column_name:[''],
        toadd:[''],
        ccadd:[''],
        subject:[''],
        content:[''],
        column_name_n:['']
      });
  }
  getmailtype() {
    let parentkeyvalue: String = "";
    this.getmailtypedropdown(parentkeyvalue);
    this.mailtcrform
      .get("temp_type")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),

        switchMap((value) =>
          this.mastService.getmail_typescroll(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      });
  }
  getcolumntype() {
    let parentkeyvalue: String = "";
    let data = {"header_id":1}
    this.getcolumndropdown(data);
    this.mailtcrform
      .get("column_name")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),

        switchMap((value) =>
          this.mastService.getmail_typescroll(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      });
  }
  private getmailtypedropdown(parentkeyvalue) {
    this.mastService.getmail_type(parentkeyvalue).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      },
      (error) => {
        this.spinner.hide();
        this.Notification.showWarning(error.status + error.statusText);
      }
    );
  }
  private getcolumndropdown(data) {
    this.mastService.getconumn_type(data).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.Columnlist = datas;
      },
      (error) => {
        this.spinner.hide();
        this.Notification.showWarning(error.status + error.statusText);
      }
    );
  }
  public displayFnsupplier(suppliertype?: supplierListss): string | undefined {
    return suppliertype ? suppliertype.mail_type : undefined;
  }

  get suppliertype() {
    return this.mailtcrform.get("temp_type");
  }
  public displayFncolumn_name(column_name?: columnListss): string | undefined {
    return column_name ? column_name.column_name : undefined;
  }
  public displayFncolumn_type(column_name?: columnListss): string | undefined {
    return column_name ? column_name.column_name : undefined;
  }
  public displayFncolumn_type_n(display_name?: columnListss): string | undefined {
    return display_name ? display_name.display_name : undefined;
  }
  
  get column_name() {
    return this.mailtcrform.get("column_name");
  }
  get display_name() {
    return this.mailtcrform.get("column_name_n");
  }
  supplierScroll() {
    setTimeout(() => {
      if (
        this.matsuppAutocomplete &&
        this.matsuppAutocomplete &&
        this.matsuppAutocomplete.panel
      ) {
        fromEvent(this.matsuppAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsuppAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matsuppAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastService
                  .getmail_typescroll(
                    this.suppInput.nativeElement.value,
                    this.presentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Supplierlist.length >= 0) {
                      this.Supplierlist = this.Supplierlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  columntypeScroll() {
    setTimeout(() => {
      if (
        this.matsuppAutocomplete &&
        this.matsuppAutocomplete &&
        this.matcolumnAutocomplete.panel
      ) {
        fromEvent(this.matcolumnAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matcolumnAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matcolumnAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matcolumnAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matcolumnAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastService
                  .getcolumn_typescroll(
                    {column_name:this.suppInput.nativeElement.value,header_id:1},
                    this.presentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Columnlist.length >= 0) {
                      this.Columnlist = this.Columnlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  summernoteInit(event) {
    // console.log(event);
  }
  
  onBlur() {
    // console.log('Blur');
  }
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  create_click()
  {
    console.log("this.mailtcrform",this.mailtcrform.value.column_name['column_name'])
    if(this.mailtcrform.value.column_name == null || this.mailtcrform.value.column_name == undefined || this.mailtcrform.value.column_name =="")
    {
      window.alert("Please Select Column Name")
      return false
    }
    var displayvalue = this.mailtcrform.value.column_name['column_name']
    if(this.flag_type == "content_flag")
    {
      let dta:any=  this.mailtcrform.value.content + "{" + "{" + displayvalue + "}" + "}";
      this.mailtcrform.get('content').patchValue(dta);
    }
    else if(this.flag_type == "toadd"){
      this.mailtcrform.get('toadd').patchValue(displayvalue);
    }
    else if(this.flag_type == "ccadd"){
      let dta:any=  this.mailtcrform.value.ccadd + displayvalue ;
      this.mailtcrform.get('ccadd').patchValue(dta);
    }
    else if(this.flag_type == "subject"){
      let dta:any=  this.mailtcrform.value.subject  + "{" + displayvalue + "}"  ;
      this.mailtcrform.get('subject').patchValue(dta);
    }
  }
  displaynamechng(value)
  {
    this.flag_type = value;

  }
  selectedcolumname(data:any){
    this.mailtcrform.get('column_name_n').patchValue(data);
  }
  selectedisplayname(data:any){
    this.mailtcrform.get('column_name').patchValue(data);
  }
  save_template(){
    console.log("this.mailtcrform",this.mailtcrform.value)
    let api_data = {"name":this.mailtcrform.value.temp_name,
                    "to_address":this.mailtcrform.value.toadd,
                    "cc_address":this.mailtcrform.value.ccadd,
                    "subject":this.mailtcrform.value.subject,
                    "body":this.mailtcrform.value.content,
                  }
    this.mastService.create_mail_temp(api_data).subscribe(
      (results: any[]) => {
        if (results["status"] == "success") {
          this.Notification.showSuccess(results["message"]);
          this.router.navigate(['/master/mailtempsum'], {skipLocationChange: true });   
        }
        else{
          this.Notification.showSuccess(results["description"]);
        }
      },
      (error) => {
        this.spinner.hide();
        this.Notification.showWarning(error.status + error.statusText);
    });
  }
}
