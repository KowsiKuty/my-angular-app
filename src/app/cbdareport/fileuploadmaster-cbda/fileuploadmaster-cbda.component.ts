import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { NotificationService } from "../../service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CbdaserviceService } from "../cbdaservice.service";
import { DatePipe } from "@angular/common";
import { Tooltip } from "chart.js";
import { environment } from "src/environments/environment";

export interface PriorityValue {
  id: string;
  name: string;
}
export interface ColumnValue {
  id: string;
  column: string;
}
@Component({
  selector: "app-fileuploadmaster-cbda",
  templateUrl: "./fileuploadmaster-cbda.component.html",
  styleUrls: ["./fileuploadmaster-cbda.component.scss"],
})
export class FileuploadmasterCbdaComponent implements OnInit {
  Url=environment.apiURL
  filecreationform: FormGroup;
  colList: any = [];
  fileuploadform: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private cbdaservice: CbdaserviceService,
    private datepipe: DatePipe
  ) { }
  filePagination={
    hasNext:false,
    hasPrev:false,
    index:1,
    count:0
  }
  ColumnObj: any = {
    method: 'GET',
    url: this.Url + 'reportserv/get_column_names',
    params: '',
    displaykey: 'column',
    Outputkey: 'column',
    valuekey: 'column',
    label: 'Column',
    formcontrolname: 'Column_value',
    id: 'Column-id',
  };
   uploadsearch = [
      {
        type:'dropdown',
        formvalue:'Column_value',
        'label':'Column',
        inputobj: this.ColumnObj,
      },
      { "type": "date", "label": "Date", "formvalue": "transdate" }
    ]
    templatebutton=[
      {icon:"add",function:this.filecreation.bind(this)}
    ]
    SummarynewtemplateData=[
      {
        'columnname':'Column',
        'key':'file_column'
      },
      {
        'columnname':'Date',
        'key':'created_date'
      },
      {
        'columnname':'File Name	',
        'key':'file_name'
      },
      {
        'columnname':'Status	',
        'key':'file_name'
      },
      {
        'columnname':'Delete	',
        'key':'file_name',
        'button':true,
        'icon':'delete',
      },
    ]
    SummaryApinewtempObjNew={
      'method':'post',
      'url':this.Url+'reportserv/get_file_summary',
      'data':{}
    }

  ngOnInit(): void {
    this.filecreationform = this.fb.group({
      columninput: [""],
      dateinput: [""],
      fileTypeInput: [""],
      fileUpload: [null],
    });
    this.fileuploadform = this.fb.group({
      columninput: [""],
      dateinput: [""],
      filetype: ''
    });
    this.columnList();
    // this.SearchData({})
  }
  FileTypeList = []

  fileuploadlist: any;
  filelistdata: any;
  columnList() {
    this.showfilesummary = true;
    // this.dataService.types_id(id).subscribe((res) => {
    //   this.colList = res.data || [];
    // });
  }
  filelist() {
    // this.filelistdata = res.data
    if (!this.filecreationform.get('columninput').value) {
      this.notification.showError('Please Select Column')
    }
    else {
      let params = {
        'column': this.filecreationform.get('columninput')?.value?.column
      }
      this.cbdaservice.fileType(params).subscribe(result => {
        this.FileTypeList = result['data']['file_name']
      })
    }
  }

  public displayColumn(priority?: ColumnValue): string | undefined {
    return priority ? priority.column : undefined;
  }
  public filetypeColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
  backtosum() {
    this.showfilesummary = true;
    this.showfilecreation = false;
    this.filecreationform.reset()
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
    // Optional: reset file input value
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }
  submitTo() {
    let data = this.filecreationform.value
    if (!data.dateinput) {
      this.notification.showError('Please Enter Date')
    }
    else if (!data?.columninput) {
      this.notification.showError('Please Select column')
    }
    else if (!data?.fileTypeInput) {
      this.notification.showError('Please Select File Type')
    }
    else if (!this.selectedFile) {
      this.notification.showError('Please Select File')
    }
    else {
      let valuesdict = {
        'date': this.datepipe.transform(data?.dateinput, 'yyyy-MM-dd'),
        'column': data?.columninput ? data?.columninput?.column : '',
        'file_type': data?.fileTypeInput ? data?.fileTypeInput : ''
      };
      let files = this.selectedFile;
      // let string = JSON.stringify(valuesdict)
      // let formData = new FormData()
      // formData.append('file', files)
      // formData.append('data', string)
      this.spinner.show();
      this.cbdaservice.docInwAdd(files,valuesdict).subscribe((result) => {
        this.spinner.hide()
        if (result.code != undefined) {
          this.notification.showError(result.description);
          this.spinner.hide();
        } else {
          console.log("Inserted", result);
          this.notification.showSuccess("Data inserted Successfully");
          this.backtosum()
          this.selectedFile=null
          this.spinner.hide();
        }
      },
        error => {
          this.spinner.hide();
        });
    }
  }

  searchfilemaster() { }
  refreshfilemaster() {
    this.fileuploadform.reset()
    this.SearchData({})
  }
  fileuploadsummary() {
    this.showfilesummary = true;
    this.showfilecreation = false;
    this.showincsummary = true;
    // this.dataService.fileuploadsummary().subscribe((res) => {
    //   this.fileuploadlist = res.data || [];
    // });
  }
  showfilecreation: boolean = false;
  showfilesummary: boolean = false;
  showincCreation: boolean = false;
  showincsummary: boolean = false;
  filecreation() {
    this.showfilecreation = true;
    this.showfilesummary = false;
    this.FileTypeList = []
  }
  incexccreation() {
    this.showincCreation = true;
    this.showincsummary = false;
  }
  searchincexc() { }
  refreshincexc() { }
  backtosum2() {
    this.showincCreation = false;
    this.showincsummary = true;
  }
  ColumnDropData() {
    this.cbdaservice.cloumn_api().subscribe(result => {
      this.colList = result['data']
    })
  }
  FileTypeData() {
    if (!this.fileuploadform.get('columninput').value) {
      this.notification.showError('Please Select Column')
    }
    else {
      let params = {
        'column': this.fileuploadform.get('columninput')?.value?.column
      }
      this.cbdaservice.fileType(params).subscribe(result => {
        this.FileTypeList = result['data']['file_name']
      })
    }
  }
  
  Summary(params) {
    // this.spinner.show()
    // this.cbdaservice.CBDAFileUploadSummary(params).subscribe(result => {
    //   this.spinner.hide()
    //   this.fileuploadlist = result['data']
    //   this.filePagination={
    //     hasNext:result['pagination']?.has_next,
    //     hasPrev:result['pagination']?.has_previous,
    //     index:result['pagination']?.index,
    //     count:result['pagination']?.count
    //   }
    // },
    //   error => {
    //     this.spinner.hide()
    //   })
     this.SummaryApinewtempObjNew={
      'method':'post',
      'url':this.Url+'reportserv/get_file_summary',
      'data':params
    }
  }
  SearchData(event) {
    let params =
    {

    }
    let formValue=event
    if (formValue?.Column_value) {
      params['column'] = formValue?.Column_value
    }
    if (formValue?.transdate) {
      params['date'] = this.datepipe.transform(formValue?.transdate, 'yyyy-MM-dd')
    }
    if (formValue?.filetype) {
      params['status'] = formValue?.filetype
    }
    this.Summary(params)

  }
}
