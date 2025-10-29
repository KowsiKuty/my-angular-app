import { Component, OnInit,EventEmitter,Output,ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormBuilder, FormArray, FormControl,AbstractControl } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {JvService} from '../jv.service'
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ExceptionHandlingService} from '../exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ShareService } from '../share.service';

export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any
}
export interface cclistss {
  id: any;
  name: string;
  code: any
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}



export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-jv-creation',
  templateUrl: './jv-creation.component.html',
  styleUrls: ['./jv-creation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class JvCreationComponent implements OnInit {

  JVcreationForm:FormGroup
  jvdebitamt:any
  jvcreditamt:any
  debitsum:any
  creditsum:any
  jvamt :any
  sum:any
  @Output() linesChange = new EventEmitter<any>();

  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('branchtyperole') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchtype') matbranchddAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;


  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  Branchlist: Array<branchListss>;
  categoryid:any
  bsidd: any
  bscode:any
  ccidd: any
  cccode: any
  totalcount = 1

  formData: any = new FormData();
  file_length:number = 0
  list:any
  fileextension:any
  totalcounts:any
  base64textString =[]
  fileData:any
  pdfimgview:any
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  images: string[] = [];
  showreasonattach: boolean = true;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  today = new Date();
  JvTypeList:any
  JvDetailList:any
  showjv = false
  jvstatus:any
  jvid:any

  @ViewChild('fileInputs', { static: false }) InputVar: ElementRef;

  
 
  constructor(private fb:FormBuilder,private datePipe: DatePipe,private jvservice:JvService,
    private notification:NotificationService,private router:Router,private toastr:ToastrService,
    private errorHandler:ExceptionHandlingService,
    private spinnerservice:NgxSpinnerService,public jvshared :ShareService) { }

  ngOnInit(): void {
    
    this.JVcreationForm = this.fb.group({
      jemode:[''],
      jebranch:[''],
      jetype:[''],
      jerefno:[''],
      jedescription:[''],
      jetransactiondate:[''],
      jeamount:[''],
      filevalue:new FormArray([]),

      jvcreator :new FormArray([
         this.JVHeader()
      ])

    })
    this.jvstatus = this.jvshared.jvstatus.value
    this.jvid = this.jvshared.jvlist.value
    if(this.jvstatus == 'returned'){
      this.getjvview()
    }

    this.getjournaltype()
    this.getjournaldtltype()

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.JVcreationForm.get('jebranch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
        // console.log("Branchlist", datas)
      })



    

  }


  getjournaltype(){
    this.jvservice.getjournaltype()
    .subscribe(result =>{
      if(result){
      let JvTypeList = result['data']
      this.JvTypeList = JvTypeList?.filter(x=>x.id != 4)
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getjournaldtltype(){
    this.jvservice.getjournaldtltype()
    .subscribe(result =>{
      if(result){
      this.JvDetailList = result['data']
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }


  getcatdropdown() {
    this.getcat('')
  }
  getbsdropdown() {
    this.getbs('')
  }

  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.JVcreationForm.get('jebranch');
  }

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.code + "-" + branchtype.name : undefined;

  }

  get branchtype() {
    return this.JVcreationForm.get('jedbranch');
  }



  branchdropdown(branchkeyvalue) {
    this.jvservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.Branchlist = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  branchddScroll() {
    setTimeout(() => {
      if (
        this.matbranchddAutocomplete &&
        this.matbranchddAutocomplete &&
        this.matbranchddAutocomplete.panel
      ) {
        fromEvent(this.matbranchddAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchddAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchddAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchddAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchddAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getRowBackgroundColor(typeId: number): string {
    if (typeId === 1) {
      return 'debit-row';
    } else if (typeId === 2) {
      return 'credit-row';
    } else {
      return '';
    }
  }
  getSections(forms) {
    return forms.controls.jvcreator.controls;
  }

  addSection(){

    const control = <FormArray>this.JVcreationForm.get('jvcreator');
    control.push(this.JVHeader());
    this.totalcount = control?.value?.length

  }

  JVHeader(){
    let group = new FormGroup({
      id : new FormControl(''),
     jedtype : new FormControl(''),
     jeddescription : new FormControl(''),
     jedamount: new FormControl(''),
     jedcat_code : new FormControl(''),
     jedsubcat_code : new FormControl(''),
     jedglno :  new FormControl(''),
     jedcc_code : new FormControl(''),
     jedbs_code : new FormControl(''),
     jedbranch : new FormControl ('')
    

    })

    group.get('jedamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalsum()
      if (!this.JVcreationForm.valid) {
        return;
      }
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
    }
    )

    group.get('jedbranch').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.jvservice.getbranchscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Branchlist = datas;
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
    })


    group.get('jedcat_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.spinnerservice.show();
      }),
      switchMap(value => this.jvservice.getcategoryscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.spinnerservice.hide();
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryNameData = datas;
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
    })

  group.get('jedsubcat_code').valueChanges
    .pipe(
      // debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.spinnerservice.show();
      }),
      switchMap(value => this.jvservice.getsubcategoryscroll(this.categoryid, value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.spinnerservice.hide();
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.subcategoryNameData = datas;
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);

    })
  // let bskeyvalue: String = "";
  // this.getbs(bskeyvalue);
  group.get('jedbs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.spinnerservice.show();
      }),
      switchMap(value => this.jvservice.getbsscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
            this.spinnerservice.hide();
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsNameData = datas;
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
    })

  group.get('jedcc_code').valueChanges
    .pipe(
      // debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.spinnerservice.show();
      }),
      switchMap(value => this.jvservice.getccscroll(this.bsidd, value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.spinnerservice.hide();
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccNameData = datas;
      // console.log("ccdata", this.ccNameData)
      this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
    })
    return group
  }
  
 

  
  calcTotalsum(){
    let jvcreation = this.JVcreationForm?.value?.jvcreator
    let creditlist = jvcreation?.filter(a=>a.jedtype == 2)
    let debitlist = jvcreation?.filter(a=>a.jedtype == 1)
    this.jvdebitamt = debitlist?.map(x => Number(x.jedamount));
    this.debitsum = this.jvdebitamt?.reduce((a, b) => a + b, 0);
    this.jvcreditamt = creditlist?.map(x => Number(x.jedamount));
    this.creditsum = this.jvcreditamt?.reduce((a, b) => a + b, 0);
    this.sum =  Number(this.debitsum)+ Number(this.creditsum )
   }


  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.JVcreationForm.get('jedcat_code');
  }
  getcat(catkeyvalue) {
    this.jvservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.categoryNameData = datas;
        this.categoryid = datas.id;
        }

      })
  }


  cid(data,ind) {
    this.categoryid = data['id'];
    this.subcatClear(ind)
    this.getsubcat(this.categoryid, "");

  }

  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.JVcreationForm.get('jedsubcat_code');
  }

  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getsubcategoryscroll(this.categoryid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }                  
                  })
              }
            }
          });
      }
    });
  }


  subcatid: any;
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.jvservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.subcategoryNameData = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.JVcreationForm.get('jvcreator')['controls'][index].get('jedglno').setValue(data.glno)

  }


  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.JVcreationForm.get('jedbs_code');
  }
  getbs(bskeyvalue) {
    this.jvservice.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
      if(results){
        let datas = results["data"];
        this.bsNameData = datas;
        this.categoryid = datas.id;
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  bsid(data, code) {
    this.bsidd = data['id'];
    this.bscode = code;
    this.getcc(this.bsidd, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.JVcreationForm.get('jedcc_code');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.jvservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })

  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getccscroll(this.bsidd, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getccdata(code, id) {
    this.ccidd = code
    this.cccode = id

  }

  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  
  
 

  goback(){
    this.onCancel.emit()
  }
  jvdetailid:any
  removeSection(section,i) {
    this.jvdetailid = section?.value?.id
   
    // console.log("detailid",this.jvdetailid )
    if(this.jvdetailid != undefined && this.jvdetailid != "" && this.jvdetailid != null ){
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.spinnerservice.show()
      this.jvservice.jvdetaildelete(this.jvdetailid)
      .subscribe(res =>{
        this.spinnerservice.hide()
        if(res.status == "success"){
         this.notification.showSuccess("Deleted Successfully")
         const control = <FormArray>this.JVcreationForm.get('jvcreator');
         control.removeAt(i);
         this.calcTotalsum();
         this.totalcount = control?.value?.length
        }else{
          this.notification.showError(res.description)
          return false;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
      
    }else{
    this.spinnerservice.hide()
    const control = <FormArray>this.JVcreationForm.get('jvcreator');
    control.removeAt(i);
    this.calcTotalsum();
    this.totalcount = control?.value?.length
    }
  }

  
  gettype(data){
    
  }
  

  uplimage:any [] = []
  uploadList = []
  fileupload(event){
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.uplimage.push(event.target.files[i]);
      this.JVcreationForm?.value?.filevalue?.push(event.target.files[i])
      
    }
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.uplimage);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });

  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.uplimage.splice(index, 1);
        let value = this.JVcreationForm.value.filevalue
        value.splice(index,1)
       
      }
    })
  }


  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any

  filepreview(files) {

    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
     stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }


  }

  
  


  testarray:Array<any> = []
  submitjv(){

   
    const jvheaderdata = this.JVcreationForm?.value
    
    if(jvheaderdata?.jetype == "" || jvheaderdata?.jetype == null || jvheaderdata?.jetype == undefined){
      this.notification.showError("Please Select Header Type")
      return false
    }
    if(jvheaderdata?.jetransactiondate == "" || jvheaderdata?.jetransactiondate == null || jvheaderdata?.jetransactiondate == undefined){
      this.notification.showError("Please Select Transaction Date")
      return false
    }

    if(jvheaderdata?.jebranch == "" || jvheaderdata?.jebranch == null || jvheaderdata?.jebranch == undefined){
      this.notification.showError("Please Select Header Branch")
      return false
    }

    if(jvheaderdata?.jedescription == "" || jvheaderdata?.jedescription == null || jvheaderdata?.jedescription == undefined){
      this.notification.showError("Please Enter Below Description")
      return false
    }

    if(jvheaderdata?.filevalue?.length == 0){
      this.notification.showError("Please Choose File")
      return false
    }
   
   

    jvheaderdata.jetransactiondate = this.datePipe.transform(jvheaderdata?.jetransactiondate,'yyyy-MM-dd')
    if(typeof(jvheaderdata?.jebranch)=='object'){
      jvheaderdata. jebranch = jvheaderdata?.jebranch?.id
      }else  if(typeof(jvheaderdata?.jebranch)=='number'){
        jvheaderdata.jebranch = jvheaderdata?.jebranch
        }else{
        this.notification.showError("Please Choose Any One Branch from the Dropdown");
        return false;
       }
    jvheaderdata.jeamount =  this.sum

    this.testarray = []
    // 
    let jvdetaildata = this.JVcreationForm?.value?.jvcreator
    if(this.is_rectify == true){
      jvdetaildata = this.rectifyenryvalues
      for(let i =0;i<this.rectifyenryvalues.length ;i++){
      let journaldetails={
        "jedtype": this.rectifyenryvalues[i]?.type.id,
        "jeddescription":this.JVcreationForm.value.jvcreator[i].jeddescription ,
        "jedamount": this.rectifyenryvalues[i]?.amount,
        "jedcat_code": this.rectifyenryvalues[i]?.category?.code,
        "jedsubcat_code": this.rectifyenryvalues[i]?.subcategory?.code,
        "jedglno": this.rectifyenryvalues[i]?.gl,
        "jedcc_code": this.rectifyenryvalues[i]?.cc?.cccode,
        "jedbs_code": this.rectifyenryvalues[i]?.bs?.code,
        "jedbranch": this.rectifyenryvalues[i]?.branch?.id
      }
      this.testarray.push(journaldetails)
    }
    }
    else if(this.is_taentry == true){
      jvdetaildata = this.taentryvalues
      for(let i =0;i<this.taentryvalues.length ;i++){
      let journaldetails={
        "jedtype": this.taentryvalues[i]?.type.id,
        "jeddescription":this.JVcreationForm.value.jvcreator[i].jeddescription  ,
        "jedamount": this.taentryvalues[i]?.amount,
        "jedcat_code": this.taentryvalues[i]?.category?.code,
        "jedsubcat_code": this.taentryvalues[i]?.subcategory?.code,
        "jedglno": this.taentryvalues[i]?.gl,
        "jedcc_code": this.taentryvalues[i]?.cc?.cccode,
        "jedbs_code": this.taentryvalues[i]?.bs?.code,
        "jedbranch": this.taentryvalues[i]?.branch?.id
      }
      this.testarray.push(journaldetails)
    }
    }
    else{
      
    for(let i in jvdetaildata){

      if( jvdetaildata[i]?.jedtype == "" ||  jvdetaildata[i]?.jedtype == null ||  jvdetaildata[i]?.jedtype == undefined ){
        this.notification.showError("Please Select Entry Type")
        return false;
      }
      if( jvdetaildata[i]?.jedbranch == "" ||  jvdetaildata[i]?.jedbranch == null ||  jvdetaildata[i]?.jedbranch == undefined ){
        this.notification.showError("Please Select Branch")
        return false;
      }
      if( jvdetaildata[i]?.jedcat_code == "" ||  jvdetaildata[i]?.jedcat_code == null ||  jvdetaildata[i]?.jedcat_code == undefined ){
        this.notification.showError("Please Select AP Category")
        return false;
      }
      if( jvdetaildata[i]?.jedsubcat_code == "" ||  jvdetaildata[i]?.jedsubcat_code == null ||  jvdetaildata[i]?.jedsubcat_code == undefined ){
        this.notification.showError("Please Select AP Subcategory")
        return false;
      }
      if( jvdetaildata[i]?.jedbs_code == "" ||  jvdetaildata[i]?.jedbs_code == null ||  jvdetaildata[i]?.jedbs_code == undefined ){
        this.notification.showError("Please Select BS")
        return false;
      }
      if( jvdetaildata[i]?.jedcc_code == "" ||  jvdetaildata[i]?.jedcc_code == null ||  jvdetaildata[i]?.jedcc_code == undefined ){
        this.notification.showError("Please Select CC")
        return false;
      }
      if( jvdetaildata[i]?.jeddescription == "" ||  jvdetaildata[i]?.jeddescription == null ||  jvdetaildata[i]?.jeddescription == undefined ){
        this.notification.showError("Please Enter Description")
        return false;
      }
      if( jvdetaildata[i]?.jedamount == "" ||  jvdetaildata[i]?.jedamount == null ||  jvdetaildata[i]?.jedamount == undefined ||  +jvdetaildata[i]?.jedamount <= 0 ){
        this.notification.showError("Please Enter Valid Amount")
        return false;
      }

      if(this.debitsum != this.creditsum){
        this.notification.showError("Debit And Credit Total Amount Must be Equal")
        return false
      }
      if(jvdetaildata[i]?.id == ""){
        delete jvdetaildata[i]?.id
      }
      if(typeof(jvdetaildata[i]?.jedbranch)=="string"){
        this.notification.showError("Please Choose Any One Branch from the Dropdown");
        return false;
      }

      if(typeof(jvdetaildata[i]?.jedcat_code)!="object"){
        this.notification.showError("Please Choose Any One AP Category from the Dropdown");
        return false;
      }
      if(typeof(jvdetaildata[i]?.jedsubcat_code)!="object"){
          this.notification.showError("Please Choose Any One AP Subcategory from the Dropdown");
          return false;
      }
      if(typeof(jvdetaildata[i]?.jedbs_code)!="object"){
        this.notification.showError("Please Choose Any One BS from the Dropdown");
        return false;
      }
      if(typeof(jvdetaildata[i]?.jedcc_code)!="object"){
          this.notification.showError("Please Choose Any One CC from the Dropdown");
          return false;
      }
           

      let obj = {
        "jedtype": jvdetaildata[i]?.jedtype,
        "jeddescription":jvdetaildata[i]?.jeddescription ,
        "jedamount": jvdetaildata[i]?.jedamount,
        "jedcat_code": jvdetaildata[i]?.jedcat_code?.code,
        "jedsubcat_code": jvdetaildata[i]?.jedsubcat_code?.code,
        "jedglno": jvdetaildata[i]?.jedglno,
        "jedcc_code": jvdetaildata[i]?.jedcc_code?.code,
        "jedbs_code": jvdetaildata[i]?.jedbs_code?.code,
        "jedbranch": jvdetaildata[i]?.jedbranch?.id
      }
      this.testarray.push(obj)
     
   
     console.log("testarray",this.testarray)
      // if(typeof(jvdetaildata[i]?.jedbranch)=="object"){
      //   jvdetaildata[i].jedbranch = jvdetaildata[i]?.jedbranch?.id
      //   }else  if(typeof(jvdetaildata[i]?.jedbranch)=="number"){
      //     jvdetaildata[i].jedbranch = jvdetaildata[i]?.jedbranch
      //     }else{
      //     this.notification.showError("Please Choose Any One Branch from the Dropdown");
      //     return false;
      //    }
      //    if(typeof(jvdetaildata[i]?.jedcat_code)=="object"){
      //   jvdetaildata[i].jedcat_code = jvdetaildata[i]?.jedcat_code?.code
      //    }else{
      //     this.notification.showError("Please Choose Any One AP Category from the Dropdown");
      //     return false;
      //    }
      //    if(typeof(jvdetaildata[i]?.jedsubcat_code)=="object"){
      //   jvdetaildata[i].jedsubcat_code =  jvdetaildata[i]?.jedsubcat_code?.code
      //    }else{
      //     this.notification.showError("Please Choose Any One AP Subcategory from the Dropdown");
      //     return false;
      //    }
      //    if(typeof(jvdetaildata[i]?.jedbs_code)=="object"){
      //   jvdetaildata[i].jedbs_code =  jvdetaildata[i]?.jedbs_code?.code
      //    }else{
      //     this.notification.showError("Please Choose Any One BS from the Dropdown");
      //     return false;
      //    }
      //    if(typeof(jvdetaildata[i]?.jedcc_code)=="object"){
      //   jvdetaildata[i].jedcc_code  =  jvdetaildata[i]?.jedcc_code.code
      //    }else{
      //     this.notification.showError("Please Choose Any One CC from the Dropdown");
      //     return false;
      //    }
       }
      }
    let jvdata:any = {
      "jemode":1,
      "jebranch": jvheaderdata?.jebranch,
      "jetype":jvheaderdata?.jetype,
      "jerefno":jvheaderdata?.jerefno,
      "jedescription":jvheaderdata?.jedescription,
      "jetransactiondate": jvheaderdata?.jetransactiondate,
      "jeamount":this.debitsum,
      "JournalDetail":this.testarray

    }
    if (this.jvstatus === 'returned') {
      jvdata.id = this.jvid;
    }

   

    
    this.spinnerservice.show()
    this.jvservice.createjv(jvdata, this.uplimage)
    .subscribe(result =>{
      this.spinnerservice.hide()
      if(result?.id != undefined){
      this.notification.showSuccess("JV Created Successfully")
      this.onSubmit.emit()
      }else{
        this.notification.showError(result?.description)
       return false;
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getheadertype(data){
    if(data.id == 1){
      this.showjv = false
      this.resetfunction()
    }else{
      this.showjv = true 
      this.resetfunction()
    }
  }

  is_rectify:boolean= false
  is_taentry:boolean = false
  searchcrno(){

    let jvrecords = this.JVcreationForm?.value
    if(jvrecords?.jerefno == "" || jvrecords?.jerefno == null || jvrecords?.jerefno == undefined){
      this.notification.showError("Please Enter CR Number")
      return false
    }
    if(jvrecords.jetype == 3){
      this.is_taentry = true
      this.TAentrycrnosearch(jvrecords?.jerefno)
      return;
      }
    this.spinnerservice.show()
    this.jvservice.crnosearch(jvrecords?.jerefno)
     .subscribe(res =>{
      
      //  if(res['data'].length == 0){
      //    this.notification.showError("CR Number Not Found")
      //  }
       
      //  if(res['data'].length != 0){
      //    this.notification.showSuccess("CR Number Found")
      //  }

      if(res.message == 'Found'){
        this.notification.showSuccess("CR Number Found")
        this.spinnerservice.hide()
        if(jvrecords.jetype == 2){
        this.rectifyentrysearch(jvrecords?.jerefno)
        this.is_rectify = true
        }
      }else{
        this.notification.showError("CR Number Not Found")
        this.spinnerservice.hide()
        return false
      }
       
     },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  searchjvno(){

    let jvrecords = this.JVcreationForm?.value
    if(jvrecords?.jerefno == "" || jvrecords?.jerefno == null || jvrecords?.jerefno == undefined){
      this.notification.showError("Please Enter JV Number")
      return false;
    }
   
    
     this.spinnerservice.show()
     this.jvservice.jvnosearch(jvrecords?.jerefno)
     .subscribe(res =>{
      
      if(res.code == "Invalid JVCRNO"){
        this.notification.showError(res.description)
        this.spinnerservice.hide()
        return false;
      }
      else if(res.status == "success"){
        this.notification.showSuccess("JV Number Found")
        this.spinnerservice.hide()
      }else{
        this.notification.showError(res.description)
        this.spinnerservice.hide()
        return false;
      }
       
     },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
  typeMapping = {
    'DEBIT': 1,   
    'CREDIT': 2, 
  };
  rectifyenryvalues:any
  rectifyentrysearch(val: any) {
    this.spinnerservice.show(); 
    this.jvservice.rectifyentrysearch(val).subscribe(
      results => {
        if (results?.code) {
          this.notification.showError(results?.description);
          this.spinnerservice.hide();
        }  
        
        this.rectifyenryvalues = results["data"];
        const control = <FormArray>this.JVcreationForm.get('jvcreator');
        control.clear();
       
        this.rectifyenryvalues.forEach((item) => {
          const rectifygroup = new FormGroup({
            id: new FormControl(item.id),
            jedtype: new FormControl(item.type.id),
            jeddescription: new FormControl(item.glnodescription),
            jedamount: new FormControl(item.amount),
            jedcat_code: new FormControl(item.category),
            jedsubcat_code: new FormControl(item.subcategory),
            jedglno: new FormControl(item.gl),
            jedcc_code: new FormControl(item.cc),
            jedbs_code: new FormControl(item.bs),
            jedbranch: new FormControl(item.branch) 
          });
          this.totalcount += control?.value?.length
          control.push(rectifygroup); 
        });
        this.calcTotalsum();
        this.disableControls();
        // this.linesChange.emit(this.JVcreationForm.value['jvcreator']);
        this.spinnerservice.hide(); 
      },
      error => {
        this.spinnerservice.hide();
        this.errorHandler.handleError(error);
      }
    );
  }
  
  disableControls() {
    const controlArray = <FormArray>this.JVcreationForm.get('jvcreator');
    controlArray.controls.forEach(group => {
      group.get('jedtype')?.disable();
      // group.get('jeddescription')?.disable();
      group.get('jedamount')?.disable();
      group.get('jedcat_code')?.disable();
      group.get('jedsubcat_code')?.disable();
      group.get('jedglno')?.disable();
      group.get('jedcc_code')?.disable();
      group.get('jedbs_code')?.disable();
      group.get('jedbranch')?.disable();
    });
  }
  taentryvalues:any
  TAentrycrnosearch(val){
    this.spinnerservice.show()
    this.jvservice.TAEntrysearch(val).subscribe(results=>{
      if(results?.code){
        this.notification.showError(results?.description)
        this.spinnerservice.hide()
      }
      else{
        this.taentryvalues=results["data"]
        
        const control = <FormArray>this.JVcreationForm.get('jvcreator');
        control.clear();
        this.spinnerservice.hide()
        this.taentryvalues.forEach((item) => {
          const rectifygroup = new FormGroup({
            id: new FormControl(item.id),
            jedtype: new FormControl(item.type.id),
            jeddescription: new FormControl(item.glnodescription),
            jedamount: new FormControl(item.amount),
            jedcat_code: new FormControl(item.category),
            jedsubcat_code: new FormControl(item.subcategory),
            jedglno: new FormControl(item.gl),
            jedcc_code: new FormControl(item.cc),
            jedbs_code: new FormControl(item.bs),
            jedbranch: new FormControl(item.branch) 
          });
          this.totalcount += control?.value?.length
          control.push(rectifygroup); 
        });
        this.calcTotalsum();
        this.disableControls();
      }
    },error=>{
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }
    catClear(ind)
  {
    const formArray = this.JVcreationForm.get('jvcreator') as FormArray;
  if (formArray && formArray.at(ind)) {
    const group = formArray.at(ind) as FormGroup;
    // Clear specific form controls
    group.get('jedcat_code')?.reset();
    group.get('jedsubcat_code')?.reset();
  }
}
subcatClear(ind){
  const formArray = this.JVcreationForm.get('jvcreator') as FormArray;
  if (formArray && formArray.at(ind)) {
    const group = formArray.at(ind) as FormGroup;
    // Clear specific form controls
    group.get('jedsubcat_code')?.reset();
  }
}
BS_Clear(ind){
  const formArray = this.JVcreationForm.get('jvcreator') as FormArray;
  if (formArray && formArray.at(ind)) {
    const group = formArray.at(ind) as FormGroup;
    // Clear specific form controls
    group.get('jedbs_code')?.reset();
    group.get('jedcc_code')?.reset();
  }
}
CC_Clear(ind){
const formArray = this.JVcreationForm.get('jvcreator') as FormArray;
  if (formArray && formArray.at(ind)) {
    const group = formArray.at(ind) as FormGroup;
    // Clear specific form controls
    group.get('jedcc_code')?.reset();
  }
}
resetfunction(){
  this.JVcreationForm.get('jerefno').reset()
  this.JVcreationForm.get('jerefno').reset()
  this.JVcreationForm.get('jetransactiondate').reset()
  this.JVcreationForm.get('jebranch').reset()
  this.JVcreationForm.get('jedescription').reset()
  this.JVcreationForm.get('filevalue').reset()
  this.debitsum=0
  this.creditsum=0
  const control = <FormArray>this.JVcreationForm.get('jvcreator');
    control.clear()
    this.addSection()
}

remarkLength: number = 0;
charLimitExceeded: boolean = false;
notificationShown: boolean = false; 

checkCharLimit(event: any) {
  const value = event.target.value;

  if (value.length > 70) {
    event.target.value = value.substring(0, 70); 
    this.charLimitExceeded = true;

    if (!this.notificationShown) {
      this.notification.showError("Maximum character limit exceeded");
      this.notificationShown = true;
    }
  } else {
    this.charLimitExceeded = false;
    this.notificationShown = false; 
  }

  this.remarkLength = event.target.value.length;
}

onPaste(event: ClipboardEvent) {
  const pastedText = event.clipboardData?.getData('text') || '';
  const textarea = event.target as HTMLTextAreaElement;
  const remaining = 70 - textarea.value.length;

  if (pastedText.length > remaining) {
    event.preventDefault();
    textarea.value += pastedText.substring(0, remaining);
    this.charLimitExceeded = true;

    if (!this.notificationShown) {
      this.notification.showError("Maximum character limit exceeded");
      this.notificationShown = true;
    }
  } else {
    this.charLimitExceeded = false;
    this.notificationShown = false;
  }

  this.remarkLength = textarea.value.length;
}

createJVRow(data?: any): FormGroup {
  return this.fb.group({
    jedtype: [data?.jedtype_id || ''],
    jedbranch: [data?.jedbranch || ''],
    jedcat_code: [data?.jedcat_code || ''],
    jedsubcat_code: [data?.jedsubcat_code || ''],
    jedbs_code: [data?.jedbs_code || ''],
    jedcc_code: [data?.jedcc_code || ''],
    jedglno: [data?.jedglno || ''],
    jeddescription: [data?.jeddescription || ''],
    jedamount: [data?.jedamount || '']
  });
}

getjvview() {
  this.spinnerservice.show();
  this.jvservice.jvsingleget(this.jvid).subscribe({
    next: (result) => {
      this.spinnerservice.hide();

      if (result) {
        this.JVcreationForm.patchValue({
          jetype: result.jetype_id,
          jerefno: result.jerefno,
          jecrno: result.jecrno,
          jetransactiondate: this.datePipe.transform(result.jetransactiondate, 'yyyy-MM-dd'),
          jebranch: result.jebranch,
          jedescription: result.maker_remarks,
        
        });
        const fileArray = this.JVcreationForm.get('filevalue') as FormArray;
          fileArray.clear(); 
          if (result.file_data && result.file_data.length > 0) {
            result.file_data.forEach((file: any) => {
              fileArray.push(new FormControl({
                file_id: file.file_id,
                name: file.file_name,  
                id: file.id
              })); 
            });
          }

        const formArray = this.JVcreationForm.get('jvcreator') as FormArray;
        formArray.clear();

        if (result.journaldetails && result.journaldetails.length > 0) {
          result.journaldetails.forEach((entry: any) => {
            formArray.push(this.createJVRow(entry));
          });
          const debit = result.journaldetails
            .filter((x: any) => x.jedtype === 'Debit')
            .reduce((sum: number, x: any) => sum + x.jedamount, 0);

          const credit = result.journaldetails
            .filter((x: any) => x.jedtype === 'Credit')
            .reduce((sum: number, x: any) => sum + x.jedamount, 0);

          this.debitsum = debit;
          this.creditsum = credit;
          this.totalcount = result.journaldetails.length;
          this.sum = debit === credit ? debit : debit + credit;
        }
      }
    },
    error: (err) => {
      this.spinnerservice.hide();
      this.errorHandler.handleError(err);
    }
  });
}


}
