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
import { ShareService } from '../share.service';

export interface BRANCH {
  name: string;
  code: string;
  id: string;  
}

interface status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pmd-branch-edit',
  templateUrl: './pmd-branch-edit.component.html',
  styleUrls: ['./pmd-branch-edit.component.scss']
})
export class PmdBranchEditComponent implements OnInit {
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
  status: status[] = [
    {value: 'YES', viewValue: 'YES '},
    {value: 'NO', viewValue: 'NO'}]
  gst_number = new FormControl('auto');
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  radioFlag: any = [];
  isLoading = false;
  constructor(private router: Router, private http: HttpClient, private toastr:ToastrService, 
    private spinner: NgxSpinnerService, private fb: FormBuilder, route:ActivatedRoute, 
    private el: ElementRef, private mstservice: masterService,private shareService:ShareService) { }

  ngOnInit(): void {
    this.PMDForm =this.fb.group({
      'branch':new FormControl(),
      'location':new FormControl(),
      'gst_number': new FormControl(),
      'remarks': new FormControl()
    });

    this.branchget();
    this.getpmdbranchEdit();
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
                this.mstservice.getbranchsearchscroll( this.branchidInput.nativeElement.value, this.currentpagecom_branch + 1)
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
  getpmdbranchEdit() {
    let id = this.shareService.pmdbranchEdit.value
    console.log('data',id)
    this.mstservice.getpmdbranchEdit(id).subscribe((results: any) => {
      let Name = results.branch_name;
      let loc=results.location;
      let Gstno = results.gst_number;
      let Remarks=results.remarks;
      let status=results.status;
      this.branch_id=results?.id;
      this.branch_names=results?.branch_name;
      this.branch_codes=results?.branch_code;

      if( status=== 1){
        this.radioFlag = 1
        this.gst_number.patchValue(this.status[0]);
      }
       if(status === 0){
        this.radioFlag = 0
        this.gst_number.patchValue(this.status[1]);
      }
      // this.gst_number.patchValue=status;
        this.PMDForm.patchValue({
          // category_id: {'id':results?.id,'name':results?.name},
          branch:Name,
          location:loc,
          gst_number:Gstno,
          remarks:Remarks,
        })
      })
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
        switchMap(value => this.mstservice.getbranchsearchscroll(value,1)
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
    this.mstservice.getbranchsearchscroll(val,1).subscribe((results: any[]) => {
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
  
  get _branchval() {
    return this.PMDForm.get('branch');
  }

  checker_branchs(data){
    this.branch_id=data.id;
    this.branch_names=data.name;
    this.branch_codes=data.code;
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
    this.toastr.error('Select branch Name','Empty value inserted' ,{timeOut: 1500});
    return false;
  }
  if(this.PMDForm.value.location==''|| this.PMDForm.value.location==null ||this.PMDForm.value.location==undefined){
    this.toastr.error('Please Enter The Location Name')
    return false
  }
  if (this.PMDForm.value.gst_number==''||this.PMDForm.value.gst_number==null||this.PMDForm.value.gst_number==undefined){
    this.toastr.error('Please Enter The Gst NO');
    return false;
  }
  if(this.PMDForm.value.remarks==''|| this.PMDForm.value.remarks==null||this.PMDForm.value.remarks==undefined){
    this.toastr.error('Please Enter The Remarks')
    return false
  }
    let data = this.PMDForm.value
    data['id']=this.shareService.pmdbranchEdit.value.id
    data['status'] = this.radioFlag
    data["branch_id"] = this.branch_id,
    data["branch_name"] = this.branch_names,
    data["branch_code"] = this.branch_codes,
    this.spinner.show();
   this.mstservice.PMDCreateForm(data).subscribe(res => {
    this.spinner.hide();
    if(res.status === "success"){
      this.toastr.success("Updated Successfully");
      this.onSubmit.emit();
    }
      else {
          this.toastr.warning(res.description)
        }
       return true
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
}
