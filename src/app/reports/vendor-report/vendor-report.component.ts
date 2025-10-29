import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { ReportserviceService } from '../reportservice.service'
import { SharedService } from 'src/app/service/shared.service';
import { HttpResponse } from '@angular/common/http';
export interface Vendor {
  id: number;
  name: string;
}

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
  // toformat(todate: Date, displayFormat: Object): string {
  //   if (displayFormat === 'input') {
  //     return formatDate(todate, 'dd-MMM-yyyy', this.locale);
  //   } else {
  //     return todate.toDateString();
  //   }
  // }
}

@Component({
  selector: 'app-vendor-report',
  templateUrl: './vendor-report.component.html',
  styleUrls: ['./vendor-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class VendorReportComponent implements OnInit {
  vendorForm: FormGroup;
  @ViewChild('ven') matcatAutocomplete: MatAutocomplete;
  @ViewChild('venidInput') venidInput: any;
  @ViewChild('closepopup') closepopup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('closepopupbulk') closepopupbulk;
  @ViewChild('closebox') closebox: any;
  dateNew: any;
  // _inputCtrl: FormControl = new FormControl();
  month: any = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' }
  mo1: any;
  role: boolean = true;

  filruploadform: FormGroup
  bulkuploadform: FormGroup;
  notification: any;
  // closepopup: any;
  @HostListener('document:keydown', ['$event']) onkeyboard(event: KeyboardEvent) {
    console.log('welcome', event.code);
    if (event.code == "Escape") {
      this.spinner.hide();
    }
  }
  first = false;
  second = false;
  // vendorForm: FormGroup;
  vendata: any;
  operatorDataVendor: Array<any> = [];
  venName: any;
  venId: any;
  venNameDetail: Array<any> = [];
  pageSize = 10;
  isLoading = false;
  has_nextcom_branch = true;
  has_previouscom = true;
  currentpagecom_branch: number = 1;
  presentpagebuk: number = 1
  presentpage: number = 1
  has_next: boolean = false;
  has_previous: boolean = false;
  file: File = null;
  fileName = '';
  bulkfilename = '';
  entityid: any;
  menuurl = [];
  subopenbulk: boolean = false;
  constructor(private service: ReportserviceService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private spinner: NgxSpinnerService,
    public dialog: MatDialog, private router: Router, private datepipe: DatePipe, private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.vendorForm = this.formBuilder.group({
      // ven: [''],
      ven: new FormControl(),
      _inputCtrl: new FormControl(),
      // _inputCtrl: ['']
    });
    this.filruploadform = this.formBuilder.group({
      fileArr: ['']
    });
    //   let entity= this.sharedService.newentityid.value
    //  this.entityid = entity;
    //  console.log("entity",this.entityid)
    //  this.menuurl = this.sharedService.menuUrlData;
    //  console.log("menuurl",this.menuurl)
    //  for (let menudatas of this.menuurl){
    //   console.log("mennn",menudatas)
    //   if (menudatas.url =="/report"){
    //     for( let submenus of menudatas.submodule){
    //      console.log("sub",submenus)
    //      if (submenus.name =="Vendor Report"){
    //       for(let x of submenus.role){
    //         console.log("xxx",x.name)
    //         if(x.name =="Dsa_upload"){
    //           this.subopenbulk = true;
    //         }
    //       }

    //      }
    //     }
    //     break;
    //   }
    //  }


    // this.filruploadform=this.fb.group({
    //   fileArr : [],
    //   reuploadfileArr:[],
    //   uploadfileArr:[],
    //   monthyear:[],
    //   subsystem:[]
    // })

    this.service.getRole()
      .subscribe((results: any) => {
        console.log("getVendorrole", results);
        if (results[0].role == 1) {
          this.role = false;
        }
        else {
          this.role = true;
        }
      });

    this.service.getvensearch('', 1).subscribe(data => {
      this.vendata = data['data'];
    }),

      this.vendorForm.get('ven').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;

          }),
          switchMap(value => this.service.getvensearch(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )

        .subscribe((results: any[]) => {
          this.vendata = results["data"];
          console.log('cat_id=', results)

        })
  }

  autocompleteScroll_cat() {
    setTimeout(() => {
      if (this.matcatAutocomplete && this.autocompleteTrigger && this.matcatAutocomplete.panel) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
              const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextcom_branch === true) {
                  this.service.getvensearch(this.venidInput.nativeElement.value, this.currentpagecom_branch + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      console.log('branch=', results)
                      let datapagination = results["pagination"];
                      this.vendata = this.vendata.concat(datas);
                      if (this.vendata.length >= 0) {
                        this.has_nextcom_branch = datapagination.has_next;
                        this.has_previouscom = datapagination.has_previous;
                        this.currentpagecom_branch = datapagination.index;
                      }
                    })
                }
              }
            });
      }
    });
  }

  vendor() {
    this.service.getvensearch('', 1).subscribe((results: any[]) => {
      this.vendata = results["data"];
      let datapagination = results["pagination"];
      this.has_nextcom_branch = datapagination.has_next;
      this.has_previouscom = datapagination.has_previous;
      this.currentpagecom_branch = datapagination.index;
      // console.log('cat_id=',results)

    })
    this.vendorForm.get('ven').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.getvensearch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.vendata = results["data"];
        console.log('cat_id=', results)

      })
  }
  // date(){
  //   // const mon = this._inputCtrl.value
  //   this.dateNew.push(mon._d.getMonth());  //month
  //   const month1 = this.dateNew[0]; //month convert string
  //   this.mo1 = this.month[month1]
  // }

  previousClick() {
    if (this.presentpage == 1) {
      this.toastr.warning('No Page Available')
      return false;
    }
    this.presentpage = this.presentpage - 1
    this.spinner.show();
    let datevalue = this.vendorForm.get('_inputCtrl').value;
    let date1 = this.datepipe.transform(datevalue, 'yyyy-MM-dd');
    // let todatevalue=this.vendorForm.get('_toinputCtrl').value;
    // let date2 =this.datepipe.transform(todatevalue,'yyyy-MM-dd');
    let d = { "supplier_id": this.venId.toString(), "from_date": date1, "page_number": this.presentpage, "page_size": 10 }
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if (results.code == "INVALID_DATA") {
          this.toastr.warning('No Data')
        }
        else {
          let datas = results;
          if (datas === undefined) {
            this.toastr.warning("No Records")
          }
          else {
            this.operatorDataVendor = results['data']
            this.spinner.hide()
          }
        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.warning(error.status + error.statusText)
      })
  }

  nextClick() {
    this.presentpage = this.presentpage + 1
    this.spinner.show();
    let datevalue = this.vendorForm.get('_inputCtrl').value;
    let date1 = this.datepipe.transform(datevalue, 'yyyy-MM-dd');
    // let todatevalue=this.vendorForm.get('_toinputCtrl').value;
    // let date2 =this.datepipe.transform(todatevalue,'yyyy-MM-dd');
    let d = { "supplier_id": this.venId.toString(), "from_date": date1, "page_number": this.presentpage, "page_size": 10 }
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if (results.code == "INVALID_DATA") {
          this.toastr.warning('No Data')
        }
        else {
          let datas = results;
          if (datas === undefined) {
            this.toastr.warning("No Records")
          }
          else {
            this.operatorDataVendor = results['data']
            this.spinner.hide()
          }
        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.warning(error.status + error.statusText)
      })
  }

  getvensum(presentpage, pageSize) {
    this.spinner.show();
    let datevalue = this.vendorForm.get('_inputCtrl').value || '';
    let date1 = this.datepipe.transform(datevalue, 'yyyy-MM-dd') ? this.datepipe.transform(datevalue, 'yyyy-MM-dd') : '';

    let d = { "supplier_id": this.venId.toString(), "from_date": date1, "page_number": presentpage, "page_size": pageSize }
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        this.spinner.hide()
        let datas = results['data'];
        if (results.code == "INVALID_DATA") {
          this.toastr.warning('No Data')
        }
        else {
          let datas = results['data'];
          if (datas === undefined) {
            this.operatorDataVendor = []
            this.toastr.warning(results['Message'])
          }
          else {
            this.operatorDataVendor = results['data']
            let datapagination = results["pagination"];
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.presentpage = datapagination.index;
            this.spinner.hide()
          }
        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.warning(error)
      })
  }
  currentpage: number = 1
  nextClic() {
    if (this.has_next === true) {

      this.currentpage = this.presentpage + 1
      this.getvensum(this.presentpage + 1, 10)
    }
  }

  previousClic() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.getvensum(this.presentpage - 1, 10)
    }
  }
  vendorAct(data) {
    this.venName = data.name
    this.venId = data.id
  }

  clear() {
    this.vendorForm.get('ven').patchValue('')
    this.vendorForm.get('_inputCtrl').patchValue('')
    this.venName = ''
  }

  submit() {

    const vendorValue = this.vendorForm.get('ven').value;

    if (!vendorValue) {
      this.toastr.warning('Select Vendor');
      return;
    }

    const datevalue = this.vendorForm.get('_inputCtrl').value || '';
    const date = this.datepipe.transform(datevalue, 'yyyy-MM-dd') || '';

    const d = {
      supplier_id: this.venId.toString(),
      from_date: date,
      page_number: 1,
      page_size: 10
    };

    this.spinner.show();

    this.service.getVendorDetails(d).subscribe(
      (results: any) => {
        console.log("getList", results);

        if (results.code === "INVALID_DATA") {
          this.spinner.hide();
          this.toastr.warning('No Data');
        } else if (results['data'] === undefined) {

          this.operatorDataVendor = [];
          this.spinner.hide();
          this.toastr.warning(results['Message']);
        } else {
          this.operatorDataVendor = results['data'];
          const datapagination = results["pagination"];
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.vendorName();
        }

      },
      (error) => {
        console.error("API Error:", error);
        this.spinner.hide();
        if (error.error && error.error.message) {
          this.toastr.warning(error.error.message);
        } else {
          this.toastr.warning("An error occurred. Please try again.");
        }
      }
    );
  }

  vendorName() {
    let d = { "supplier_id": "", "from_date": "", "page_number": 1, "page_size": 10 }
    this.spinner.show();
    this.service.getVendorDetailsName(d).subscribe((results: any) => {

      console.log("getList", results);
      if (results.code == "INVALID_DATA") {
        this.toastr.warning('No Data')

      }
      else {
        let datas = results['DATA'];
        this.venNameDetail = datas

      }
      this.spinner.hide();
    })

  }

  dialogRef: any
  ogFlag = 0
  invoiceNo(data, i, temp) {
    console.log(data)
    this.spinner.show();
    this.dialogRef = this.dialog.open(temp, {
      width: '80%',
      height: '70%',
      panelClass: 'newClass',
    });
  }
  displayVendorName(vendor: any): string {
    return vendor ? vendor.name : '';
  }

  actionVendorDownload() {


    let selectedVendor = this.vendorForm.get('ven')?.value;
    let datevalue = this.vendorForm.get('_inputCtrl').value;
    let date1 = this.datepipe.transform(datevalue, 'yyyy-MM-dd');
    // if (!selectedVendor || !selectedVendor.id) {
    //   this.toastr.warning('Select Vendor');
    //   return;
    // }

    if (this.first) {
      this.toastr.warning('Already in Progress');
      return;
    }

    this.first = true
    this.service.getVendorDownloadReport(selectedVendor.id || '', date1 || '')
      .subscribe(fullXLS => {
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Report_Download' + date + ".xlsx";
        link.click();
        this.first = false;
      },
        (error) => {
          this.first = false;
          this.toastr.warning(error.status + error.statusText)
        })
  }

  pdfVendorDownload() {
    let selectedVendor = this.vendorForm.get('ven')?.value;
    let datevalue = this.vendorForm.get('_inputCtrl').value;
    let date1 = this.datepipe.transform(datevalue, 'yyyy-MM-dd');
    if (this.second == true) {
      this.toastr.warning('Already Progress')
      return true
    }
    this.second = true
    this.service.getVendorDownloadReportpdf(selectedVendor.id || '', date1 || '')
      .subscribe(fullXLS => {
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Vendor_Report_Download' + date + ".pdf";
        link.click();
        this.second = false;
      },
        (error) => {
          this.second = false;
          this.toastr.warning(error.status + error.statusText)
        })
  }

  manualRun() {
    this.spinner.show();
    let d = {
      "report_id": [
        {
          "operators": "DATE BETWEEN",
          "value1date": "2022-05-27",
          "value2date": "2022-05-27",
          "module": "Vendor Statement",
          "scheduler": 1
        }
      ]
    }
    this.service.getVendorManualRun(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if (results.code == "INVALID_DATA") {
          this.toastr.warning('No Data')
          this.spinner.hide()
        }
        else {
          let datas = results;
          if (datas === undefined) {
            this.toastr.warning("No Records")
            this.spinner.hide()
          }
          else {
            // (datas.status == "success"){
            this.toastr.success("Manual Run Data Inserted Successfully")
            this.spinner.hide()

          }
        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.warning(error.status + error.statusText)
      })
  }
  IMmigration() {
    this.spinner.show();
    this.spinner.hide()
  }

  onUpload() {
    this.spinner.show();
    console.log('onUpload function called');
    if (this.file) {
      console.log('File:', this.file);
      this.fileName = this.file.name;
      const formData = new FormData();
      formData.append("file", this.file);

      this.service.IMmigrationDownloadReportpdf(formData)
        .pipe(debounceTime(1000))
        .subscribe(
          (response) => {
            if (response instanceof Blob) {
              const contentType = response.type;
              if (contentType === 'application/json') {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const data = JSON.parse(reader.result as string);
                  if (data.message) {
                    this.toastr.success(data.message);
                    this.spinner.hide()

                  } else if (data.ERROR) {
                    const errorCode = data.ERROR.description;
                    this.toastr.warning(errorCode);
                    this.spinner.hide()

                  }
                };
                reader.readAsText(response);
              } else {
                // ...
                let binaryData = [];
                binaryData.push(response)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                let link = document.createElement('a');
                link.href = downloadUrl;
                let date: Date = new Date();
                link.download = 'Vendorreport' + date + ".xlsx";
                link.click();
                this.spinner.hide()

              }
            }
          },
          (error) => {
            console.error('Error uploading/downloading file:', error);
            this.toastr.error("An error occurred while processing the file. Please try again later.");
          }
        );

    }
  }




  resetformup() {
    this.filruploadform.reset();
  }


  onFileSelected($event) {
    this.file = $event.target.files[0];
    // this.onUpload();
  }

  BulkUpload(fileinput1) {
    this.spinner.show();
    if (this.file) {
      console.log('File:', this.file);
      this.bulkfilename = this.file.name;
      const formData = new FormData();
      formData.append("file", this.file);
      this.service.Bulkupload(formData)
        .pipe(debounceTime(1000))
        .subscribe(
          (response) => {
            this.spinner.hide();
            if (response instanceof Blob) {
              const contentType = response.type;
              if (contentType === 'application/json') {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const bulkdata = JSON.parse(reader.result as string);
                  if (bulkdata.status == "success") {
                    this.toastr.success(bulkdata.message);
                    this.spinner.hide()
                    fileinput1.value = ""
                    this.closefunc();
                    // this.closepopupbulk.nativeElement.click();
                  } else if (bulkdata.status == "error") {
                    this.toastr.error(bulkdata.description);
                    fileinput1.value = ""
                    this.spinner.hide()
                    this.closefunc();
                    // this.closepopupbulk.nativeElement.click();

                  }
                };
                reader.readAsText(response);
              } else {
                // ...
                let binaryData = [];
                binaryData.push(response)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                fileinput1.value = ""
                this.spinner.hide()
                // this.closepopupbulk.nativeElement.click();
                this.closefunc();
                let link = document.createElement('a');
                link.href = downloadUrl;
                let date: Date = new Date();
                link.download = 'BulkUploadReport' + date + ".xlsx";
                link.click();
              }
            }
          },
          (error) => {
            console.error('Error uploading/downloading file:', error);
            this.toastr.error("An error occurred while processing the file. Please try again later.");
            this.spinner.hide();
            this.closefunc();
          }
        );
    }
  }





  // PDfDownload(data) {
  // let id = this.getMemoIdValue(this.idValue)
  // let id = data.assetsaleheader_id
  // let name =  'Karur Vysya Bank'
  // this.faService.fileDownloadpo(id)
  // .subscribe((data) => {
  // let binaryData = [];
  // binaryData.push(data)
  // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  // let link = document.createElement('a');
  // link.href = downloadUrl;
  // link.download = name + ".pdf";
  // link.click();
  // })
  // }
  closefunc() {
    this.closebox.nativeElement.click();
  }
}