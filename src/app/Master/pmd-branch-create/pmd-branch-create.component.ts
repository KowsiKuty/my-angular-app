import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';
import { masterService } from '../master.service';
import { NotificationService } from 'src/app/service/notification.service';

export interface BRANCH {
  name: string;
  code: string;
  id: string;  
}

export interface pmdloc {
  branch_name: string;
  branch_code: string;
  id: string;  
}
interface status {
  value: string;
  viewValue: string;
}
export interface categorylista {
  id: string;
  name: string;
}
export interface subcatgorylista {
  id: string;
  name: string;
}
export interface cgst{
  id:string;
  name:string;
  rate:string
}
export interface igst{
  id:string;
  name:string;
  rate:string
}
export interface sgst{
  id:string;
  name:string;
  rate:string
}


@Component({
  selector: 'app-pmd-branch-create',
  templateUrl: './pmd-branch-create.component.html',
  styleUrls: ['./pmd-branch-create.component.scss']
})
export class PmdBranchCreateComponent implements OnInit {

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  
  pageNumber:number = 1;
  currentpagecom_branch=1;
  as_branchname=[];
  has_nextcom_branch=true;
  has_previouscom=true;
  selectedPersonId: number;
  presentpagebuk: number = 1;
  pageSize = 10;
  branchdata: any=[];
  branch_id: any;
  branch_names: any;
  branch_codes: any;
  PMDForm:any= FormGroup;
  pmdlocationform:any=FormGroup;
  isLoading = false;
  status: status[] = [
    {value: 'YES', viewValue: 'YES '},
    {value: 'NO', viewValue: 'NO'}]
  gst_number = new FormControl('auto');
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  radioFlag: any = [];
    
  constructor(private router: Router, private http: HttpClient, private toastr:ToastrService, 
    private spinner: NgxSpinnerService, private fb: FormBuilder, route:ActivatedRoute, 
    private el: ElementRef, private mstservice: masterService,private notification: NotificationService,) { }

  ngOnInit(): void {
    this.PMDForm =this.fb.group({
      'branch':new FormControl(),
      // 'location':new FormControl(),
      'gst_number': new FormControl(),
      'remarks': new FormControl()
      
    });
    this.pmdlocationform=this.fb.group({
      'branch':new FormControl(),
      'location':new FormControl(),
      'gstno':new FormControl(),
      'apcat':new FormControl(),
      'subcat':new FormControl(),
      'glno':new FormControl(),
      'igst':new FormControl(),
      'sgst':new FormControl(),
      'cgst':new FormControl(),
      'remarks':new FormControl()

    })

    this.branchget();
    this.getpmdbranch();
    this.pmdlocationform.get('apcat').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.mstservice.getapcat_pmd(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(datas => {
      this.productcatlist = datas['data'];
    })
    
    this.pmdlocationform.get('branch').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')

      }),
      switchMap(value => this.mstservice.getpmdbranchloc(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.pmdbranchlist = results["data"];
      if (results.length == 0){
        this.toastr.warning('No Branch Data')
        this.spinner.hide();
      }
    })
    
    
    
  }

  autocompleteScroll_branch() {
    setTimeout(() => {
      if (this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.mstservice.getpmdbranch( this.branchidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    if (this.branchdata.length >= 0) {
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

  branchget() {
    let boo: String = "";
    this.getbranch(boo);
  
    this.PMDForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
  
        }),
        switchMap(value => this.mstservice.getpmdbranch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        if (results.length == 0){
          this.toastr.warning('No Branch Data')
          this.spinner.hide();
        }
      })
    }

  getbranch(val) {
    this.mstservice.getpmdbranch(val,1).subscribe((results: any[]) => {
      this.branchdata = results["data"];
      if (results.length == 0){
        this.toastr.warning('No Branch Data')
        this.spinner.hide();
      }
    })
  
  }
  public displaybranch(_branchval ? : BRANCH): string | undefined {
    return _branchval ? _branchval.name : undefined;
  }
  public displaypmdbranch(data ? : pmdloc): string | undefined {
    return data ? data.branch_name : undefined;
  }
  
  get _branchval() {
    return this.PMDForm.get('branch');
  }

  checker_branchs(data){
    this.branch_id=data.id;
    this.branch_names=data.name;
    this.branch_codes=data.code;
    this.PMDForm.get('gst_number').patchValue(data.gstin)
 };

 radioChange(event: MatRadioChange,a) {
  console.log(event.value.value);
  if(event.value.value == 'YES'){
    this.radioFlag = 1
  }
  else if(event.value.value == 'NO'){
    this.radioFlag = 0
  }
  console.log('radio_flag ',this.radioFlag);
}

 PMDSubmit(){
  if (this.PMDForm.value.branch===undefined||this.PMDForm.value.branch===null||this.PMDForm.value.branch===''){
    this.toastr.error('Please Select branch Name');
    return false;
  }
  // if(this.PMDForm.value.location == '' || this.PMDForm.value.location == null||this.PMDForm.value.location == undefined){
  //   this.toastr.error('Please Enter The Location Name')
  //   return false;
  // }
  if (this.PMDForm.value.gst_number==''||this.PMDForm.value.gst_number==null||this.PMDForm.value.gst_number==undefined){
    this.toastr.error('Please Enter The Gst No');
    return false;
  }
  if(this.PMDForm.value.remarks==''|| this.PMDForm.value.remarks==null||this.PMDForm.value.remarks==undefined){
    this.toastr.error('Please Enter The Remarks')
    return false;
  }
    let data = this.PMDForm.value
    // data['status'] = this.radioFlag
    data["branch_id"] = this.branch_id,
    data["branch_name"] = this.branch_names,
    data["branch_code"] = this.branch_codes,
    this.spinner.show();
   this.mstservice.PMDCreateForm(data).subscribe(res => {
    this.spinner.hide();
    if(res['status']=='success'){
      this.notification.showSuccess(res['message']);
      // this.onSubmit.emit();
    }else{
      this.notification.showWarning(res['description']);
    }
  },(error)=>{
    this.notification.showError(error.status+error.statusText)
    this.spinner.hide();
  })


  }
  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
 onCancelClick(){
   this.onCancel.emit()
 }
 pmdbranchlist:Array<any>=[]
 productcatlist:Array<any>=[];
 subcategorylistdata:Array<any>=[];
 cgstlist:Array<any>=[];
 igstlist:Array<any>=[];
 sgstlist:Array<any>=[];
 apcat_id:any;
 datacategory() {
  this.mstservice.getapcat_pmd('', 1).subscribe(datas => {
    this.productcatlist = datas['data'];
  });
}
getapsubcategorydata() {
  if (this.pmdlocationform.get('apcat').value == null || this.pmdlocationform.get('apcat').value == '' || this.pmdlocationform.get('apcat').value == undefined ) {
    this.notification.showError('Please Select The Category');
    return false;
  }else{
    this.apcat_id=this.pmdlocationform.get('apcat').value.id;
  }
  this.mstservice.getapsubcat_pmd(this.apcat_id,'',1).subscribe(datas => {
    this.subcategorylistdata = datas['data'];
  });
  this.pmdlocationform.get('subcat').valueChanges.pipe(
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.mstservice.getapsubcat_pmd(this.apcat_id,this.pmdlocationform.get('subcat').value,1).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ))
  ).subscribe(datas => {
    this.subcategorylistdata = datas['data'];
  });
}
cgstcategorydata() {
  if (this.pmdlocationform.get('apcat').value.id == undefined || this.pmdlocationform.get('apcat').value == '' || this.pmdlocationform.get('apcat').value == undefined || this.pmdlocationform.get('apcat').value.id == null || this.pmdlocationform.get('apcat').value.id == "") {
    this.notification.showError('Please Select The Category');
    return false;
  }else{
    this.apcat_id=this.pmdlocationform.get('apcat').value.id;
  }
  this.mstservice.getapsubcat_pmd(this.apcat_id,'',1).subscribe(datas => {
    this.cgstlist = datas['data'];
  });
  this.pmdlocationform.get('cgst').valueChanges.pipe(
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.mstservice.getapsubcat_pmd(this.apcat_id,this.pmdlocationform.get('cgst').value,1).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ))
  ).subscribe(datas => {
    this.cgstlist = datas['data'];
  });
}
igstcategorydata() {
  if (this.pmdlocationform.get('apcat').value.id == undefined || this.pmdlocationform.get('apcat').value == '' || this.pmdlocationform.get('apcat').value == undefined || this.pmdlocationform.get('apcat').value.id == null || this.pmdlocationform.get('apcat').value.id == "") {
    this.notification.showError('Please Select The Category');
    return false;
  }else{
    this.apcat_id=this.pmdlocationform.get('apcat').value.id;
  }
  this.mstservice.getapsubcat_pmd(this.apcat_id,'',1).subscribe(datas => {
    this.igstlist = datas['data'];
  });
  this.pmdlocationform.get('igst').valueChanges.pipe(
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.mstservice.getapsubcat_pmd(this.apcat_id,this.pmdlocationform.get('igst').value,1).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ))
  ).subscribe(datas => {
    this.igstlist = datas['data'];
  });
}
sgstcategorydata() {
  if (this.pmdlocationform.get('apcat').value.id == undefined || this.pmdlocationform.get('apcat').value == '' || this.pmdlocationform.get('apcat').value == undefined || this.pmdlocationform.get('apcat').value.id == null || this.pmdlocationform.get('apcat').value.id == "") {
    this.notification.showError('Please Select The Category');
    return false;
  }else{
    this.apcat_id=this.pmdlocationform.get('apcat').value.id;
  }
  this.mstservice.getapsubcat_pmd(this.apcat_id,'',1).subscribe(datas => {
    this.sgstlist = datas['data'];
  });
  this.pmdlocationform.get('sgst').valueChanges.pipe(
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.mstservice.getapsubcat_pmd(this.apcat_id,this.pmdlocationform.get('sgst').value,1).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ))
  ).subscribe(datas => {
    this.sgstlist = datas['data'];
  });
}
has_categorypre: boolean = false;
has_categorynxt: boolean = true;
has_categorypage: number = 1;
has_subcategorypre: boolean = false;
has_subcategorynxt: boolean = true;
has_subcategorypage: number = 1;
cgstpage:number=1;
cgst_next:boolean=true;
cgst_previous:boolean=false;
igstpage:number=1;
igst_next:boolean=true;
igst_previous:boolean=false;
sgstpage:number=1;
sgst_next:boolean=true;
sgst_previous:boolean=false;
pmdbran_page:number=1;
pmdbran_prev:boolean=false;
pmdbran_next:boolean=true;
@ViewChild('catinput') catinput;
@ViewChild('catlists') matcategoryAutocomplete: MatAutocomplete;
@ViewChild('subInput') subcatinput;
@ViewChild('catsublists') matcatsublists: MatAutocomplete;

@ViewChild('cgstinput') cgstInput:any;
@ViewChild('cgstref') matcgst:MatAutocomplete;
@ViewChild('igstinput') igstInput:any;
@ViewChild('igstref') matigst:MatAutocomplete;
@ViewChild('sgstinput') sgstInput:any;
@ViewChild('sgstref') matsgst:MatAutocomplete;

@ViewChild('pmdbraninput') pmdbranInput:any
@ViewChild('pmdbran') matpmdbran:MatAutocomplete;

gl_no:any;
glno_cgst:any;
glno_igst:any;
glno_sgst:any;

subcategoryfocusout(data: any) {
  this.pmdlocationform.get('glno').patchValue(data.glno);
  this.gl_no=data.glno;
}

cgstfocusout(data:any){
  this.glno_cgst=data.glno;
}
igstfocusout(data:any){
  this.glno_igst=data.glno;
}
sgstfocusout(data:any){
  this.glno_sgst=data.glno;
}
getdisplaycategoryinterface(data?: categorylista): string | undefined {
  return data ? data.name : undefined;
}
getsubcategoryinterface(data?: subcatgorylista): string | undefined {
  return data ? data.name : undefined;
}
public getdisplaycgstinterface(data?:cgst):string | undefined{
  return data?data.name:undefined;
}
public getdisplayigstinterface(data?:igst):string | undefined{
  return data?data.name:undefined;
}
public getdisplaysgstinterface(data?:sgst):string | undefined{
  return data?data.name:undefined;
}
getinfinitecategory() {
  setTimeout(() => {
    if (
      this.matcategoryAutocomplete &&
      this.autocompleteTrigger &&
      this.matcategoryAutocomplete.panel
    ) {
      fromEvent(this.matcategoryAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matcategoryAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matcategoryAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcategoryAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcategoryAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_categorynxt === true) {
              this.mstservice.getapcat_pmd(this.catinput.nativeElement.value, this.has_categorypage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.productcatlist = this.productcatlist.concat(datas);
                  if (this.productcatlist.length >= 0) {
                    this.has_categorynxt = datapagination.has_next;
                    this.has_categorypre = datapagination.has_previous;
                    this.has_categorypage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

getpmdbranch() {
  this.mstservice.getpmdbranchloc('',1).subscribe((results: any[]) => {
    this.pmdbranchlist = results["data"];
    if (results.length == 0){
      this.toastr.warning('No Branch Data')
      this.spinner.hide();
    }
  })

}

autocompleteScroll_pmdbranch() {
  setTimeout(() => {
    if (this.matpmdbran && this.autocompleteTrigger && this.matpmdbran.panel) {
      fromEvent(this.matpmdbran.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matpmdbran.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
          const scrollTop = this.matpmdbran.panel.nativeElement.scrollTop;
          const scrollHeight = this.matpmdbran.panel.nativeElement.scrollHeight;
          const elementHeight = this.matpmdbran.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.pmdbran_next === true) {
              this.mstservice.getpmdbranchloc( this.pmdbranInput.nativeElement.value, this.pmdbran_page + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  console.log('branch=',results)
                  let datapagination = results["pagination"];
                  this.pmdbranchlist = this.pmdbranchlist.concat(datas);
                  if (this.pmdbranchlist.length >= 0) {
                    this.pmdbran_next = datapagination.has_next;
                    this.pmdbran_prev = datapagination.has_previous;
                    this.pmdbran_page = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
getsubcategoryinfinite() {
  setTimeout(() => {
    if (
      this.matcatsublists &&
      this.autocompleteTrigger &&
      this.matcatsublists.panel
    ) {
      fromEvent(this.matcatsublists.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matcatsublists.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matcatsublists.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcatsublists.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcatsublists.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_subcategorynxt === true) {
              this.mstservice.getapsubcat_pmd(this.apcat_id,this.subcatinput.nativeElement.value, this.has_subcategorypage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.subcategorylistdata = this.subcategorylistdata.concat(datas);
                  if (this.subcategorylistdata.length >= 0) {
                    this.has_subcategorypre = datapagination.has_next;
                    this.has_subcategorynxt = datapagination.has_previous;
                    this.has_subcategorypage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
keypressnodigit(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
    return false;
  }
  return true;
}

autocompletecgstScroll() {
  setTimeout(() => {
    if (
      this.matcgst &&
      this.autocompleteTrigger &&
      this.matcgst.panel
    ) {
      fromEvent(this.matcgst.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matcgst.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matcgst.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcgst.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcgst.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.cgst_next === true) {
              this.mstservice.getapsubcat_pmd(this.apcat_id,this.cgstInput.nativeElement.value, this.cgstpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.cgstlist = this.cgstlist.concat(datas);
                  // console.log("emp", datas)
                  if (this.cgstlist.length >= 0) {
                    this.cgst_next = datapagination.has_next;
                    this.cgst_previous = datapagination.has_previous;
                    this.cgstpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
autocompleteigstScroll() {
  setTimeout(() => {
    if (
      this.matigst &&
      this.autocompleteTrigger &&
      this.matigst.panel
    ) {
      fromEvent(this.matigst.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matigst.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matigst.panel.nativeElement.scrollTop;
          const scrollHeight = this.matigst.panel.nativeElement.scrollHeight;
          const elementHeight = this.matigst.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.igst_next === true) {
              this.mstservice.getapsubcat_pmd(this.apcat_id,this.igstInput.nativeElement.value, this.igstpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.igstlist = this.igstlist.concat(datas);
                  // console.log("emp", datas)
                  if (this.igstlist.length >= 0) {
                    this.igst_next = datapagination.has_next;
                    this.igst_previous = datapagination.has_previous;
                    this.igstpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
autocompletesgstScroll() {
  setTimeout(() => {
    if (
      this.matsgst &&
      this.autocompleteTrigger &&
      this.matsgst.panel
    ) {
      fromEvent(this.matsgst.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matsgst.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matsgst.panel.nativeElement.scrollTop;
          const scrollHeight = this.matsgst.panel.nativeElement.scrollHeight;
          const elementHeight = this.matsgst.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.sgst_next === true) {
              this.mstservice.getapsubcat_pmd(this.apcat_id,this.sgstInput.nativeElement.value, this.sgstpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.sgstlist = this.sgstlist.concat(datas);
                  // console.log("emp", datas)
                  if (this.sgstlist.length >= 0) {
                    this.sgst_next = datapagination.has_next;
                    this.sgst_previous = datapagination.has_previous;
                    this.sgstpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}



pmdlocsubmit(){
  if (this.pmdlocationform.value.branch===undefined||this.pmdlocationform.value.branch===null||this.pmdlocationform.value.branch===''){
    this.toastr.error('Please Select branch Name');
    return false;
  }
  if (this.pmdlocationform.value.gstno==''||this.pmdlocationform.value.gstno== null||this.pmdlocationform.value.gstno== undefined){
    this.toastr.error('Please Enter The Gst No');
    return false;
  }
  if(this.pmdlocationform.value.location == '' || this.pmdlocationform.value.location == null||this.pmdlocationform.value.location == undefined){
    this.toastr.error('Please Enter The Location Name')
    return false;
  }
  if (this.pmdlocationform.value.apcat==''||this.pmdlocationform.value.apcat==null||this.pmdlocationform.value.apcat==undefined){
    this.toastr.error('Please Select The  Category');
    return false;
  }
  // if (this.pmdlocationform.value.subcat==''||this.pmdlocationform.value.subcat==null||this.pmdlocationform.value.subcat==undefined){
  //   this.toastr.error('Please Select The Sub Category');
  //   return false;
  // }
  if (this.pmdlocationform.value.cgst==''||this.pmdlocationform.value.cgst==null||this.pmdlocationform.value.cgst==undefined){
    this.toastr.error('Please Select The CGST');
    return false;
  }
  if (this.pmdlocationform.value.igst==''||this.pmdlocationform.value.igst==null||this.pmdlocationform.value.igst==undefined){
    this.toastr.error('Please Select The IGST');
    return false;
  }
  if (this.pmdlocationform.value.sgst==''||this.pmdlocationform.value.sgst==null||this.pmdlocationform.value.sgst==undefined){
    this.toastr.error('Please Select The SGST');
    return false;
  }
  if(this.pmdlocationform.value.remarks==''|| this.pmdlocationform.value.remarks==null||this.pmdlocationform.value.remarks==undefined){
    this.toastr.error('Please Enter The Remarks')
    return false;
  }
  let data:any={
    "branch_id":this.pmdlocationform.value.branch.id,
    "location":this.pmdlocationform.value.location,
    "gstno":this.pmdlocationform.value.gstno,
    "category_code":this.pmdlocationform.value.apcat.code,
    // "subcategory_code":this.pmdlocationform.value.subcat.code,
    // "glno":this.pmdlocationform.value.glno,
    "cgst_code":this.pmdlocationform.value.cgst.code,
    "igst_code":this.pmdlocationform.value.igst.code,
    "sgst_code":this.pmdlocationform.value.sgst.code,
    "remarks":this.pmdlocationform.value.remarks    
  }
  this.spinner.show()
  this.mstservice.pmdloc_create(data).subscribe(res=>{
    this.spinner.hide();
    if(res['status']=='success'){
      this.notification.showSuccess(res['message']);
      this.onSubmit.emit();
    }else{
      this.notification.showWarning(res['description']);
    }
  },(error)=>{
    this.notification.showError(error.status+error.statusText)
    this.spinner.hide();
  })
  console.log(data)

}
}
