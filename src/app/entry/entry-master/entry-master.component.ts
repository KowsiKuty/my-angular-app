import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter,} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EntryService } from '../entry.service';

export interface catlistss {
  id: any;
  name: string;
  code: string
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
interface status {
  value: string;
  viewValue: string;
}

interface transaction {
  value: string;
  viewValue: string;
}

interface display {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-entry-master',
  templateUrl: './entry-master.component.html',
  styleUrls: ['./entry-master.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EntryMasterComponent implements OnInit {
  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catidInput') catidInput: any;

  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatidInput') subcatidInput: any;
  // @ViewChild("userInput") private _userInput: ElementRef;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  statusCheckFirst: boolean;
  statusCheckSecond: boolean;
  statusCheck: boolean;
  updateID: number;
  
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  debitsave:any= FormGroup;
  EntryForm: FormGroup;
  presentpage:any=1;
  pageSize = 10;
  has_next = true;
  has_previous = true;
  entrylist = []
  subcatdata: Array<subcatlistss>;
  catdata: Array<catlistss>;
  isLoading: boolean = true;
  has_nextcom_branch=true;
  has_previouscom=true;
  currentpagecom_branch: number=1;
  presentpagebuk:number = 1
  EntryTemplateNewAddRow:any=[{'dynamic':false,'dynamiccat':false,'dynamicsubcat':false,
  'dynamicsecond':false, 'dynamiccat1':false, 'dynamicsubcat1':false,}];
  display: display[] = [
    {value: 'Y', viewValue: 'YES'},
    {value: 'N', viewValue: 'NO'},
  ]
  status: status[] = [
    {value: 'F', viewValue: 'FIXED '},
    {value: 'D', viewValue: 'DYNAMIC'},
  ];
  transaction: transaction[] = [
    {value: 'D', viewValue: 'DEBIT'},
    {value: 'C', viewValue: 'CREDIT'},
  ];
   l1:any='';
  l2:any='';
  l3:any='';
  l4:any='';
  l5:any='';
  l6:any='';
  subtasks: any=[
    {name: 'BASEAMOUNT', color: 'primary'},
    {name: 'IGST', color: 'primary'},
    {name: 'SGST', color: 'accent'},
    {name: 'CGST', color: 'accent'},
    {name: 'INVAMOUT', color: 'warn'},
    // {name: 'DEBITAMOUNT', color: 'warn'}
  ];
  paramid:any;
  entrylistID: any;
  @Output() linesChange = new EventEmitter<any>();

    constructor(private service: EntryService, private formBuilder:FormBuilder,
    private toastr:ToastrService, private spinner: NgxSpinnerService, 
    public dialog: MatDialog, private router:Router) { }

  ngOnInit(): void {
    this.EntryForm = this.formBuilder.group({
      code: [''],
      parametername: [''],
    })
    this.debitsave =this.formBuilder.group({
      "listTransactionDebit":this.formBuilder.array([
        this.formBuilder.group({
        'condition1':new FormControl('',Validators.required),
        'cat':new FormControl(''),
        'subcat':new FormControl(''),
        'cat1':new FormControl(''),
        'subcat1':new FormControl(''),
        'transnew':new FormControl('',Validators.required),
        'transactionNewValue':new FormControl(''),
        'display1':new FormControl('',Validators.required),
        'cattrans':new FormControl(''),
        'subcattrans':new FormControl(''),
        'formula':new FormControl(''),
        'type':new FormControl('update'),
        'enb':new FormControl(false)
        })
      ])
        
      });
      (this.debitsave.get('listTransactionDebit') as FormArray).at(0).get('cat').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.service.getcatsearch(value,1).pipe(
        // switchMap(value=>this.service.getcatsearchnew(value,1).pipe(

          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe((results: any[]) => {
        this.catdata = results["data"];
      });

    ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('subcat').valueChanges    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getsubcatsearch1(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.subcatdata = results["data"];
    });
      (this.debitsave.get('listTransactionDebit') as FormArray).clear();
    this.getApiAP(this.presentpage);

    this.service.getcatsearch('',1).subscribe(data=>{
    // this.service.getcatsearchnew('',1).subscribe(data=>{
      this.catdata=data['data'];
    }),
    this.service.getsubcatsearch('',139,1).subscribe(data=>{
      this.subcatdata=data['data'];
    })
  }

   reset(){
    this.EntryForm.reset();
    this.getApiAP(this.presentpage);

   }


  getApiAP(presentpage){
    this.spinner.show();
    let code = this.EntryForm.get('code').value || ''
    let name = this.EntryForm.get('parametername').value || ''
    this.service.getEntryListData(this.presentpage,code,name).subscribe(data=>{
      console.log('rr=',data);
      if(data.code == 'INVALID_DATA'){
        this.toastr.warning('INVALID_DATA')
      }
      else{
        let datas=data['data'];
        this.entrylist = datas
        this.spinner.hide();
        let datapagination = data["pagination"];
        if (datas.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
  }

  dialogRef:any
  ogFlag = 0
  initialView = false
  onFocusCat(){
    this.initialView = false
  }
  actionView(temp, id, j):void {
    this.paramid=id;
    this.spinner.show();
    this.dialogRef = this.dialog.open(temp, {
      
      width: '80%',
      height: '80%',
      panelClass: 'newClass',
      disableClose:true,
      position:{top:'5%'}
      // data: { name: this.name, animal: this.animal }
    });

    this.service.getEntryIdList(id).subscribe(data=>{
      console.log('entryid=',data);
      let datas=data['data'];
      this.entrylistID = datas
      this.spinner.hide();
      // if(this.ogFlag==0){
        (this.debitsave.get('listTransactionDebit') as FormArray).clear();
        for(let i=0;i<this.entrylistID.length;i++){
          this.EntryTemplateNewAddRow[i] = [];
          this.EntryTemplateNewAddRow[i]['cat']=[]
          this.EntryTemplateNewAddRow[i]['subcat']=[]
          this.EntryTemplateNewAddRow[i]['dynamicsecond'] = false;
          this.EntryTemplateNewAddRow[i]['dynamic'] = false;
          this.EntryTemplateNewAddRow[i]['dynamiccat'] = false;
          this.EntryTemplateNewAddRow[i]['dynamicsubcat'] = false;
          this.EntryTemplateNewAddRow[i]['dynamiccat1'] = false;
          this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = false;
          this.EntryTemplateNewAddRow[i]['flagTemplate'] = false;
          this.EntryTemplateNewAddRow[i]['tempDebit']=[];
          this.EntryTemplateNewAddRow[i]['sourcegetAddNew']=false;
          this.EntryTemplateNewAddRow[i]['sourcegetDebsecond']=[];
          this.EntryTemplateNewAddRow[i]['sourcegetAddNewSecond']=false;
          this.EntryTemplateNewAddRow[i]['isDelete']=false;
          this.EntryTemplateNewAddRow[i]['type']='update';
          this.EntryTemplateNewAddRow[i]['enb']=false;
          console.log('hiii');
      (this.debitsave.get('listTransactionDebit') as FormArray).push(this.formBuilder.group({

        'condition1':new FormControl('',Validators.required),
        'cat':new FormControl(''),
        'subcat':new FormControl(''),
        'cat1':new FormControl(''),
        'subcat1':new FormControl(''),
        'transnew':new FormControl('',Validators.required),
        'transactionNewValue':new FormControl(''),
        'display1':new FormControl('',Validators.required),
        'cattrans':new FormControl(''),
        'subcattrans':new FormControl(''),
        'formula':new FormControl(''),
        'type':new FormControl('update'),
        'enb':new FormControl(false)
      })),

      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('condition1').patchValue(this.entrylistID[i].id);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('cat').patchValue(this.entrylistID[i].category_code);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('subcat').patchValue(this.entrylistID[i].subcategory_code);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('cat1').patchValue('');
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('subcat1').patchValue('');
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('transnew').patchValue(this.entrylistID[i].debitglno);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('transactionNewValue').patchValue(this.entrylistID[i].transaction);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('display1').patchValue(this.entrylistID[i].display);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('cattrans').patchValue('');
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('subcattrans').patchValue('');
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('formula').patchValue(this.entrylistID[i].value_to_taken);
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('type').patchValue('update');
      ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('enb').patchValue(false);


//       let raw = this.entrylistID[i].category_code; 
// // raw = "{'code': 'SUSPENSE', 'no': 0}"

// // Convert to proper JSON
// let fixed = raw.replace(/'/g, '"');  
// let parsed = JSON.parse(fixed);  
// // parsed = { code: "SUSPENSE", no: 0 }
// ((this.debitsave.get("listTransactionDebit") as FormArray)
//   .at(i) as FormGroup)
//   .get("cat")
//   .patchValue(parsed.code); // only patch "SUSPENSE"



//    let raw1 = this.entrylistID[i].subcategory_code; 

// // Convert to proper JSON
// let fixed1 = raw1.replace(/'/g, '"');  
// let parsed1 = JSON.parse(fixed1);  
// ((this.debitsave.get("listTransactionDebit") as FormArray)
//   .at(i) as FormGroup)
//   .get("subcat")
//   .patchValue(parsed1.code); // only patch "SUSPENSE"


      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.getcatsearch(value,1)
        // switchMap(value => this.service.getcatsearchnew(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.catdata = results["data"];
        this.linesChange.emit(this.debitsave.value['listTransactionDebit']);


      }),
    
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.getsubcatsearch1(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.subcatdata = results["data"];
        this.linesChange.emit(this.debitsave.value['listTransactionDebit']);
      })
    // }
    this.ogFlag=1;
    this.updateID = id

      // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('display1').
    
    this.initialView = true
    }
      // ((this.debitsave.get('listTransactionDebit') as FormArray).removeAt(j-1))
    },
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });

    this.dialogRef.afterClosed().subscribe(result => {
    });
  }

  
  // public displaycatFn(cattype?: catlistss): string | undefined {
  //   // return cattype ? cattype.code : undefined;
  //   return cattype ? cattype : undefined;

  // }
  public displaycatFn(cattype?: catlistss): string | undefined {
  return cattype ? cattype.name : undefined;   // or cattype.name
}

  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.name : undefined;
  }
  dialogRef1:any
  actionDelete(temp1, id, i):void {
    this.dialogRef1 = this.dialog.open(temp1, {
      // width: '60%',
      // height: '70%',
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'YES',
          cancel: 'NO'
        }
      }
    });

    this.dialogRef1.afterClosed().subscribe(result => {
    });
  }

  actionDelete1(i){
    // const d:number=((this.splitquantity.get('listofquantity') as FormArray).length);
      ((this.debitsave.get('listTransactionDebit') as FormArray).removeAt(i-1))
    }
    conditionAddCredit(d,i){
      console.log(d)
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
                this.service.getcatsearch( this.catidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  // this.service.getcatsearchnew( this.catidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.catdata = this.catdata.concat(datas);
                    if (this.catdata.length >= 0) {
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

  autocompleteScroll_subcat() {
    setTimeout(() => {
      if (this.matsubcatAutocomplete && this.autocompleteTrigger && this.matsubcatAutocomplete.panel) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.service.getsubcatsearch('', this.catidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.subcatdata = this.subcatdata.concat(datas);
                    if (this.subcatdata.length >= 0) {
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

  displayselect1(d,i){

  }

  displayselect2(d,i){
    
  }


  onConfirmClick(id, i){
    this.spinner.show()
    this.service.EntryIdListDelete(id).subscribe(data=>{
      console.log('entryid=',data);
      this.spinner.hide();
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
      this.dialogRef1.close(true);
      this.toastr.error('Parameter Deleted')
      this.getApiAP(this.presentpage);
    }

  entryCreate(){
    this.router.navigateByUrl('/entry/entry')
  }

  transadddynamiccat(d,i){
    if(d.value == "D"){
      this.EntryTemplateNewAddRow[i]['dynamiccat']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=true;
      this.EntryTemplateNewAddRow[i]['dynamiccat1']=false;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1']=false;
      // this.entryListDebit[i]['cat'] = 'DYNAMIC';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat1').patchValue('DYNAMIC'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue('DYNAMIC'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').patchValue('DYNAMIC')
      // this.modeSelect = 'DYNAMIC';
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcattrans').patchValue('DYNAMIC')
    }
    if(d.value == "F"){
      this.EntryTemplateNewAddRow[i]['dynamiccat1']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=false;
      this.EntryTemplateNewAddRow[i]['dynamiccat']=false;
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcattrans').patchValue('FIXED'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').patchValue(''),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue(''),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').patchValue('')
      // this.modeSelect = 'FIXED';
   }
  }


  transaddnewDebit(d,i){
    if(d.value == "D"){
      this.statusCheckFirst = true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=true;
      this.EntryTemplateNewAddRow[i]['dynamic']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = false;
      this.EntryTemplateNewAddRow[i]['subcat'] = 'DYNAMIC';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue('DYNAMIC')
      // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('booleannew').patchValue(true);
      
    }
    if(d.value == "F"){
      this.statusCheckFirst = false;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=false;
      this.EntryTemplateNewAddRow[i]['dynamic']=false;
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').patchValue('')
     //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
     //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
     //   'id': null,
     //  }))
   }
  }

  templateDebit(d,i){
    if(d.value == "D"){
      this.EntryTemplateNewAddRow[i]['tempDebit']='DEBIT';
      this.EntryTemplateNewAddRow[i]['sourcegetAddNew']=true
    }
    if(d.value == "C"){
      this.EntryTemplateNewAddRow[i]['tempCredit']='CREDIT';
      this.EntryTemplateNewAddRow[i]['sourcegetAddNew']=true
   }
  }

  transaddnewvalue(d,i){
    if(d.value == "D"){
      this.statusCheckSecond = true;
      // this.EntryTemplateNewAddRow[i]['value']='';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').patchValue('DYNAMIC'),
      this.EntryTemplateNewAddRow[i]['dynamicsecond']=false;
      this.EntryTemplateNewAddRow[i]['sourcegetDebsecond']="F"
      this.EntryTemplateNewAddRow[i]['sourcegetAddNewSecond']=true 
    }
    if(d.value == "F"){
      this.statusCheck = false;
      // this.EntryTemplateNewAddRow[i]['value']='';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').patchValue(''),
      this.EntryTemplateNewAddRow[i]['dynamicsecond']=true;
      this.EntryTemplateNewAddRow[i]['sourcegetDebsecond']="D"
      this.EntryTemplateNewAddRow[i]['sourcegetAddNewSecond']=true
      this.statusCheckSecond = false;
      // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('booleannew').patchValue(true);
     //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
     //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
     //   'id': null,
     //  }))
   }
  }
  
  dialogRef2:any
  getpaystatus(temp):void {
    this.dialogRef2 = this.dialog.open(temp, {
      width: '60%',
      height: '70%',
    });

    this.dialogRef2.afterClosed().subscribe(result => {
    });
  }

  checker_cat(d,i){
    let arr = d.id;
    this.EntryTemplateNewAddRow[i]['cat']=d.code;
    this.service.getsubcatsearch('',arr,1).subscribe(data=>{
      this.subcatdata=data['data'];
    })
  }

  checker_subcat(d,i){
    this.EntryTemplateNewAddRow[i]['subcat']=d.code;
    ((this.debitsave.get("listTransactionDebit") as FormArray).at(i)).get('transnew').patchValue(d.glno);
  }

  nextClick() {
    this.spinner.show();
      if (this.has_next === true) {
        this.presentpage=this.presentpage+1;
        this.getApiAP(this.presentpage);
      }
    }
  previousClick() {
    this.spinner.show();
      if (this.has_previous === true) {      
        this.presentpage=this.presentpage-1;
        this.getApiAP(this.presentpage);
      }
    }


  new(){
    this.l1='';
    this.l2='';
    this.l3='';
    this.l4='';
    this.l5='';
    this.l6='';
  }

  cancel(){
    this.dialogRef.close();
  }

  update(event){
    this.spinner.show();
    let a:any;
    let flag: Array<any>=[];
    let ent1 = [];
    for(let i=0; i<this.EntryTemplateNewAddRow.length; i++){
      // if(this.EntryTemplateNewAddRow[i]['flagTemplate']==true){
        let e = {'id':this.entrylistID[i]?.id ? this.entrylistID[i].id : null,
                'gl_no': ((this.debitsave.get("listTransactionDebit") as FormArray)?.at(i) as FormGroup)?.get('transnew').value,
                'transaction':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transactionNewValue').value,
                'value_to_taken':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').value,
                // 'wisefin_category':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').value,
                // 'wisefin_subcategory':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').value,
                'wisefin_category': ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').value?.code,
                'wisefin_subcategory': ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').value?.code,
                'display':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('display1').value,
                'param_id':this.paramid,
                'type':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('type').value
              }
            console.log('eeee',e)
            flag.push(e)
            a=flag
        // }
      }

      // if (a !=undefined){
      //   ent1.push(a)
      // }

      var paradata = flag
      console.log(paradata)
      this.service.getEntryUpdate(paradata).subscribe((results: any) => {
      console.log("saveEntry", results);
        if(results.status == 'success'){
          this.toastr.success('SUCCESS')
          this.spinner.hide();
          this.getApiAP(this.presentpage);
        }
        if(results.code == 'INVALID_DATA'){
          this.toastr.error('Duplicate entry')
          this.spinner.hide()
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
    )
    this.dialogRef.close()
  };

  Entry(){
    let fill = {}
    fill['code'] = this.EntryForm.get('code').value
    fill['parametername'] = this.EntryForm.get('parametername').value
    console.log(fill)
  }
  adddebitcredit(){
    (this.debitsave.get('listTransactionDebit') as FormArray).push(this.formBuilder.group({
      'condition1':new FormControl('',Validators.required),
      'cat':new FormControl(''),
      'subcat':new FormControl(''),
      'cat1':new FormControl(''),
      'subcat1':new FormControl(''),
      'transnew':new FormControl('',Validators.required),
      'transactionNewValue':new FormControl(''),
      'display1':new FormControl('',Validators.required),
      'cattrans':new FormControl(''),
      'subcattrans':new FormControl(''),
      'formula':new FormControl(''),
      'type':new FormControl('create'),
      'enb':new FormControl(false)
    }));
    let i:any=(this.debitsave.get('listTransactionDebit') as FormArray).length;
    (this.debitsave.get('listTransactionDebit') as FormArray).at(i-1).get('cat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.service.getcatsearch(value,1).pipe(
      // switchMap(value=>this.service.getcatsearchnew(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((results: any[]) => {
      this.catdata = results["data"];
    });

  ((this.debitsave.get("listTransactionDebit") as FormArray).at(i-1) as FormGroup).get('subcat').valueChanges    .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;

    }),
    switchMap(value => this.service.getsubcatsearch1(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  ).subscribe((results: any[]) => {
    this.subcatdata = results["data"];
  });
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('condition1').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('cat').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('subcat').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('cat1').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('subcat1').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('transnew').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('transactionNewValue').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('display1').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('cattrans').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('subcattrans').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('formula').patchValue('');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('type').patchValue('create');
    ((this.debitsave.get('listTransactionDebit') as FormArray).at(i-1) as FormGroup).get('enb').patchValue(false);
    this.EntryTemplateNewAddRow[i-1] = [];
          this.EntryTemplateNewAddRow[i-1]['cat']=[]
          this.EntryTemplateNewAddRow[i-1]['subcat']=[]
          this.EntryTemplateNewAddRow[i-1]['dynamicsecond'] = false;
          this.EntryTemplateNewAddRow[i-1]['dynamic'] = false;
          this.EntryTemplateNewAddRow[i-1]['dynamiccat'] = false;
          this.EntryTemplateNewAddRow[i-1]['dynamicsubcat'] = false;
          this.EntryTemplateNewAddRow[i-1]['dynamiccat1'] = false;
          this.EntryTemplateNewAddRow[i-1]['dynamicsubcat1'] = false;
          this.EntryTemplateNewAddRow[i-1]['flagTemplate'] = false;
          this.EntryTemplateNewAddRow[i-1]['tempDebit']=[];
          this.EntryTemplateNewAddRow[i-1]['sourcegetAddNew']=false;
          this.EntryTemplateNewAddRow[i-1]['sourcegetDebsecond']=[];
          this.EntryTemplateNewAddRow[i-1]['sourcegetAddNewSecond']=false;
          this.EntryTemplateNewAddRow[i-1]['isDelete']=false;
          this.EntryTemplateNewAddRow[i-1]['type']='create';
          this.EntryTemplateNewAddRow[i-1]['enb']=false;
        let len_data:any=this.entrylistID.length;
        this.entrylistID[len_data]={};
  }
  // updateAllComplete(event,data,i){
  //   console.log(data);
  //   //let arr_data=(this.debitsave.get('listTransactionDebit') as FormArray).get('formula').value.toString();
  //   if(event.checked==true){
  //     if(data=='BASEAMOUNT'){
  //       this.l1 = 'BASEAMOUNT';
  //     }
  //     if(data=='IGST'){
  //       this.l2 = 'IGST';
  //     }
  //     if(data=='SGST'){
  //       this.l3 = 'SGST';
  //     }
  //     if(data=='CGST'){
  //       this.l4 = 'CGST';
  //     }
  //     if(data=='INVAMOUNT'){
  //       this.l5 = 'INVAMOUNT';
  //     }
  //     if(data=='DEBITAMOUNT'){
  //       this.l6 = 'DEBITAMOUNT';
  //     }
  //   }
  //   else if(event.checked==false){
  //     if(data=='BASEAMOUNT'){
  //       this.l1 = '';
  //     }
  //     if(data=='IGST'){
  //       this.l2 = '';
  //     }
  //     if(data=='SGST'){
  //       this.l3 = '';
  //     }
  //     if(data=='CGST'){
  //       this.l4 = '';
  //     }
  //     if(data=='INVAMOUNT'){
  //       this.l5 = '';
  //     }
  //     if(data=='DEBITAMOUNT'){
  //       this.l6 = '';
  //     }
  //   }
  //   //let dta_val:any=((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('formula').value.toString()?((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('formula').value.toString():'';
  //   let dta_val:any='';
  //   if (this.l1 !='' && this.l1 !=undefined){
  //     dta_val +=this.l1;
  //   }
  //   if (this.l2 !='' && this.l2 !=undefined){
  //     dta_val +=this.l2;
  //   }
  //   if (this.l3 !='' && this.l3 !=undefined){
  //     dta_val +=this.l3;
  //   }
  //   if (this.l4 !='' && this.l4 !=undefined){
  //     dta_val +=this.l4;
  //   }
  //   if (this.l5 !='' && this.l5 !=undefined){
  //     dta_val +=this.l5;
  //   }
  //   if (this.l6 !='' && this.l6 !=undefined){
  //     dta_val +=this.l6;
  //   }
  //  ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).patchValue({'formula':dta_val});
  // //  this._userInput.nativeElement.focus();
  // }
  updateAllComplete(event, data: string, i: number) {
  const formGroup = (this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup;
  let currentValue: string = formGroup.get('formula')?.value || '';

  if (event.checked) {
    // append with operator if needed
    if (currentValue && !/[+\-*/]$/.test(currentValue)) {
      // currentValue += '+';     // default operator
    }
    currentValue += data;
  } else {
    // remove if unchecked
    currentValue = currentValue.replace(data, '');
  }

  formGroup.get('formula')?.setValue(currentValue);
}
  optionClicked(event: Event,data) {
    event.stopPropagation();
    //  this.toggleSelection(data,event);
   }
   deletedata(data,i,event){
    if (event.currentTarget.checked == true) {
      let data:any=((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('type').value;
      if (data=='create'){
      (this.debitsave.get("listTransactionDebit") as FormArray).removeAt(i);
      }
      else{
        ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).patchValue({'type':'delete'});
      }
    }
    else{
      let data:any=((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('type').value;
      if(data=='delete'){
        ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).patchValue({'type':'update'});
      }
      else{
        ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).patchValue({'type':'update'});
      }
    }
   }

  
}
