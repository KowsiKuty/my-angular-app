import { Component, OnInit, Inject, ViewChild, HostListener, ElementRef } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { TriggerService } from "../TriggerService";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, map, takeUntil } from 'rxjs/operators';

import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
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

export interface Bucketname {
  id: number;
  name: string;
  doctype: number;
}




@Component({
  selector: 'app-asset-maker',
  templateUrl: './asset-maker.component.html',
  styleUrls: ['./asset-maker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetMakerComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('supnames') matsupname:MatAutocomplete;
  @ViewChild("qtyclose") qtyclose:ElementRef;
  @ViewChild('supnameids') supname:any;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  assetcatlist: Array<any>=[];
  assetmakerblist: Array<any>=[];
  assetmakerreglist: Array<any>=[];
  assetmakerwbcwlist: Array<any>=[];
  assetmakerwbbuclist: Array<any>=[];
  bucketnamelist: Array<any>=[];
  checkboxselectlist: any[] = [];
  checkboxselectchiplist:any[]=[];
  checkboxselectreglist:any[]=[];
  checklist: any;
  isbuc: boolean = true
  supnamelist:Array<any>=[];
  selectIndex:any=0;

  assetmakerSearchForm:any= FormGroup;

  bucketlist: Array<any>
  // bucketlist: any[] = [];


  selectedGender: any

  checkedValuesreg: boolean[]

  checkedValuescwip: boolean[]
  checkedValuesbuc: boolean[]
  ischeck: boolean = false

  isbuce: boolean = true;
  ISBUC: boolean;

  ISREG: boolean = true;

  ISCWIP: boolean;
  is_buc:boolean=true;
  is_cwip:boolean=true;
  is_reg:boolean=true;
  

  iscwip: boolean;

  bucketform:any= FormGroup;
  bucketnameform: FormGroup
  d:number=0;

  defaultSelected = "REGULAR"
  CheckShoenAlert:boolean=false;

  selectedValue: string;
  red: any
  ecfnum:string;
  qtyChangeArray:Array<any>=[];
  QtyChangeAppendArray:Array<any>=[];
  qtyChangeArrayForm:any=FormGroup;
  cwbuc = "CWIP";

  buckettlist = [{ 'id': 1, 'name': 'REGULAR' }, { 'id': 2, 'name': 'CWIP' }, { 'id': 3, 'name': 'BUC' }]




  isassetmaker: boolean
  isassetbuk: boolean
  isassetbucbuk: boolean
  isassetregbuk: boolean
  isassetcwipbuk: boolean
  iswithbuk:boolean=false;
  iswithoutbuk:boolean=false;
  add_btn_enb:boolean=true;
  add_atn_enb_buc:boolean=true;
  add_btn_enb_reg:boolean=true;
  isinvoice: boolean
  isassetwbuk: boolean
  view: String = "View"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;

  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  pageSize = 10;
  test: string
  isb: boolean;
  iswb: boolean;
  isLoading = false;
  isgrp:string;
  bucket_id:number=0;
  supid:number;
  // buck
  has_nextcom_product=true;
  currentpagecom_product=1;
  has_previouscom=false;
  value: any;
  page:number=1;
  total_counts:number=0;
  qty_totalamount:number=0;
  qty_taxamount:number=0;
  qty_totaltaxableamount:number=0;
  qty_invoicecoount:number=0;
  qty_capitalizeamount:number=0;
  qty_balanceamount:number=0;
  total_countsenb:boolean=false;
  reportform:FormGroup;
  constructor(private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }
  // public onValueChange() {
  //   this.selectedValue = this.value;
  //   this.withoutbucBtn()
  //     if (this.value === "REGULAR") {
  //       this.bucketform.get("doctype").setValue(this.value);}
  //       if (this.value === "CWIP") {
  //         this.bucketform.get("doctype").setValue(this.value);}
  //         if (this.value === "BUC") {
  //           this.bucketform.get("doctype").setValue(this.value);

  //     }


  // }

  public onValueChange(value) {
    this.selectIndex=0;
    this.test=value;
    this.selectedValue = value;
    this.selectIndex=this.d;
    this.withoutbucBtn(this.d);
    if (value === "REGULAR") {
      this.bucketform.get("doctype").setValue(value);
    }
    if (value === "CWIP") {
      this.bucketform.get("doctype").setValue(value);
    }
    if (value === "BUC") {
      this.bucketform.get("doctype").setValue(value);

    }


  }
  public onSelect(value) {
    this.selectedValue = value;
  }
  selectedObjects: any[];
  length_reg = 0;
  // pageSize = 10;
  pageIndex_reg = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;

  handlePageEvent_reg(event: PageEvent) {
    this.length_reg = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex_reg = event.pageIndex;
    this.page= event.pageIndex+1;
    console.log(this.pageIndex_reg );
    console.log(this.pageSize);
    console.log(this.length_reg);
    this.presentpagewbuk=event.pageIndex+1;
    this.presentpagewbuk=event.pageIndex+1;
    const list = document.getElementsByClassName('mat-paginator-range-label');
    console.log(list);
    list[0].innerHTML =list[0].innerHTML+ ' Page: ' + this.page.toString();
    this.withoutbucBtn(this.d);
  }
  

  abcd: any
  ngOnInit() {
    this.spinner.show();
    this.ISREG = true;
    this.cwbuc = 'CWIP'
    this.red = 2
    this.bucket();
    this.test = "REGULAR";
    
    
    this.selectedObjects = [{ id: 1, text: 'REGULAR' }];





    this.bucketform = this.fb.group({
      'name': new FormControl(),

      'doctype':new FormControl(['REGULAR', Validators.required]),



    })



    this.assetmakerSearchForm = this.fb.group({

      'invno': new FormControl(),
      'invoicedate': new FormControl(),
      'suppliername':new FormControl(),
      'crno':new FormControl()
    })

    this.bucketnameform = this.fb.group({
      'bucketname': new FormControl()
    });
    this.qtyChangeArrayForm=this.fb.group({
      'headertaxvalue':new FormControl(""),
      'headeramount':new FormControl(""),
      'headertotalamount':new FormControl(""),
      'ecfnum':new FormControl(""),
      'totalcount':new FormControl(""),
      "dataArray":new FormArray([
        this.fb.group({
          'productname':new FormControl(""),
          'taxamount':new FormControl(""),
          'taxableamount':new FormControl(""),
          'totalamount':new FormControl(""),
          'qty':new FormControl(""),
          'balanceQty':new FormControl(""),
          'detailsid':new FormControl(""),
          'select_enb':new FormControl(false),
          'enb':new FormControl(false),
          'availbale_qty':new FormControl(""),
          "existing_balanceqty":new FormControl("")
        })
      ])
    });
    this.reportform=this.fb.group({
      'maker_doctype':new FormControl(''),
      'bucket_doctype':new FormControl('')
    });
    (this.qtyChangeArrayForm.get('dataArray') as FormArray).clear();
    this.Faservice.getassetsuppliername("",1).subscribe(data=>{
      console.log("dd=",data['data']);
      this.supnamelist=data['data'];
      let pagination=data['pagination'];
      if(this.supnamelist.length>0){
        this.has_nextbuk=pagination.has_next;
        this.has_previouswbuk=pagination.has_previous;
        this.presentpagewbuk=pagination.index;
      }
    });
    this.assetmakerSearchForm.get('suppliername').valueChanges.pipe(
      debounceTime(100),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetsuppliername(this.assetmakerSearchForm.get('suppliername').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.supnamelist=data['data']
    })
    let bucvalue: String = "";
    this.bucketnameSearch(bucvalue);

    this.bucketnameform.get('bucketname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.bucketnameSearch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketnamelist = datas;

      })
      this.withoutbucBtn(this.d);
      this.onValueChange('REGULAR');
    console.log('hi=',this.assetmakerSearchForm.value);
  }



  public displayFnBuc(bucket?: Bucketname): string | undefined {

    return bucket ? bucket.name : undefined;
  }

  get bank() {
    return this.bucketnameform.get('bucketname');
  }



  private bucketnameSearch(bucvalue) {
    this.Faservice.bucketnameSearch(bucvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketnamelist = datas;
        console.log("bucname", datas)

      })






  }




  getassetmakerbsummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice.getassetmakerbsummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("asset", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        // this.assetmakerblist = datass;


        // console.log("asset", this.assetmakerblist)
        if (this.assetmakerblist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      
      );
      

  }
  bucBtn() {
    console.log('hii here function called 2nd one');
    this.isassetbuk = false;    //
    // this.isbuce=!this.isbuce
    // this.getassetmakerbsummary();
    // this.isassetregbuk = false;
    // this.iswb = false;
    // this.isb = true;
    this.isassetcwipbuk = false;   //
    this.isassetbucbuk = false;
    this.isassetregbuk = false;   
    //below code newly added
    if (this.test === "CWIP") {
      this.page=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbcwipsummary(1,10);
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;
      




    }
    if (this.test === "BUC") {
      this.page=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbbucsummary();
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');





    } if (this.test === "REGULAR") {
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerregsummary()
      this.isassetregbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      // this.assetmakerwbcwlist=this.assetmakerreglist.filter(data=> data.groupno==1);





    }



  }
  showAlertMsg(){
    this.CheckShoenAlert=true;
    setTimeout(()=>{
      this.CheckShoenAlert=false;
    },5000);
    return true;
  }
  withoutbucBtn(d:any) {
    this.total_counts=null;
    this.d=d;
    console.log(d);
    if(d==0){
    // this.iswb = true;
    this.selectIndex=0;
    this.isb = false;



    if (this.test === "CWIP") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;

       this.page=1;
       this.has_previousbuk=true;
       this.has_nextbuk=true;
       this.presentpagebuk=1;
       this.getassetmakerwbcwipsummary(1,10);



    }
    if (this.test === "BUC") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
      this.page=1;
       this.has_previousbuk=true;
       this.has_nextbuk=true;
       this.presentpagebuk=1;
      this.getassetmakerwbbucsummary();
      






    } if (this.test === "REGULAR") {
      
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      console.log('regularenter;')
      
      this.isassetregbuk = true;
      
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      this.page=1;
       this.has_previousbuk=true;
       this.has_nextbuk=true;
       this.presentpagebuk=1;
       this.getassetmakerregsummary();
    
    }
  }
  if(d==1){
    this.selectIndex=1;
    this.isassetbuk = false;    //
    // this.isbuce=!this.isbuce
    // this.getassetmakerbsummary();
    // this.isassetregbuk = false;
    // this.iswb = false;
    // this.isb = true;
    this.isassetcwipbuk = false;   //
    this.isassetbucbuk = false;
    this.isassetregbuk = false; 
    // this.showAlertMsg();  
    //below code newly added
    if (this.test === "CWIP") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;
      
      this.page=1;
      this.has_previousbuk=true;
      this.has_nextbuk=true;
      this.presentpagebuk=1;
      this.getassetmakerwbcwipsummary(1,10);




    }
    if (this.test === "BUC") {
      this.presentpagewbuk=1;
      this.page=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
      this.page=1;
       this.has_previousbuk=true;
       this.has_nextbuk=true;
       this.presentpagebuk=1; 
       this.getassetmakerwbbucsummary();





    } if (this.test === "REGULAR") {
      this.page=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      
      this.isassetregbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      // this.assetmakerwbcwlist=this.assetmakerreglist.filter(data=> data.groupno==1);
       
      this.page=1;
       this.has_previousbuk=true;
       this.has_nextbuk=true;
       this.presentpagebuk=1;
       this.getassetmakerregsummary(this.presentpagewbuk);



    }


  }




  }


  invoiceBtn() {
    this.isinvoice = true;
  }

  expenseBtn() {
    this.isinvoice = false;


  }
  BackBtn() {
    this.router.navigate(['/fa/fatransactionsummary'], { skipLocationChange: true });


  }



  assetView(id:any) {
    setTimeout(()=>{
      this.spinner.show();
      
    });
    
    // console.log(id)
    // console.log(this.test);
    this.shareservice.regular.next(this.test);
    this.shareservice.asset_id.next(id);
    
    // console.log(this.shareservice.asset_id.value);
    // console.log("logs:",this.test);   //
    // console.log(this.shareservice.regular.next(this.test));  //
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true });

  }




  buknextClick() {

    if (this.has_nextbuk === true) {

      this.getassetmakerbsummary(this.presentpagebuk + 1, 10)

    }
  }

  bukpreviousClick() {

    if (this.has_previousbuk === true) {

      this.getassetmakerbsummary(this.presentpagebuk - 1, 10)

    }
  }
  getassetmakerregsummary(pageNumber = 1, pageSize = 10) {
    this.checkboxselectreglist=[];
    let data:any={};
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let search:string="page="+this.page+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
   
    console.log('dear1=',data);
    this.spinner.show();
    this.Faservice.getassetmakerregsummary(pageNumber, pageSize,data)
      .subscribe((result) => {
        this.spinner.hide();
        this.showAlertMsg();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerreglist=[];
          this.length_reg=0;
        }
        else{
          console.log("asset", result)
          let datass = result['data'];
          this.length_reg=result['count'];
          let datapagination = result["pagination"];
          // this.assetmakerreglist = datass;
          this.assetmakerreglist=datass;
         
          // this.checkedValuesreg = this.assetmakerreglist.map(() => false);
          this.checkedValuesreg = this.assetmakerreglist.map(b => b===false)
          console.log("assetreg=", this.assetmakerreglist)
          if (this.assetmakerreglist.length >= 0) {
            this.has_nextwbuk = datapagination.has_next;
            this.has_previouswbuk = datapagination.has_previous;
            this.presentpagewbuk = datapagination.index;
          }
        }
       

      },
      (error)=>{
        this.spinner.hide();
      }
      );
      
      console.log('hii=',this.assetmakerSearchForm.valid);

  }

  wbuknextClick() {

    if (this.has_nextwbuk === true) {
      this.page=this.page+1;
      this.getassetmakerregsummary(this.presentpagewbuk + 1, 10)

    }
  }

  wbukpreviousClick() {

    if (this.has_previouswbuk === true) {
      this.page=this.page-1;
      this.getassetmakerregsummary(this.presentpagewbuk - 1, 10);

    }
  }


  getassetmakerwbcwipsummary(pageNumber, pageSize) {
    this.checkboxselectlist=[];
    let data:any={};
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let search:string="page="+pageNumber+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
   
    console.log('dear1=',data);
    this.spinner.show();
    this.Faservice.getassetmakerwbCWIPsummary(pageNumber, pageSize ,data)
      .subscribe((result) => {
        console.log("welcome")
        console.log("assetasasas", result);
        this.spinner.hide();
        this.showAlertMsg();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerwbcwlist=[];
        }
        else{
          let datass = result['data'];
          let datapagination = result["pagination"];
          this.assetmakerwbcwlist = datass;
          this.checkedValuescwip = this.assetmakerwbcwlist.map(() => false);
          this.spinner.hide();
  
  
          console.log("assetwip", this.assetmakerwbcwlist)
          if (this.assetmakerwbcwlist.length >= 0) {
            this.has_nextbuk = datapagination.has_next;
            this.has_previousbuk = datapagination.has_previous;
            this.presentpagebuk = datapagination.index;
            this.presentpagewbuk=datapagination.index;
          }
        }
       

      },
      (error)=>{
        this.spinner.hide();

      }
      );
     


  }
  wbuknextClickbuc() {
    
    if (this.has_nextbuk === true) {
      this.page=this.page+1;
      this.getassetmakerwbcwipsummary(this.presentpagebuk + 1, 10)

    }
  }

  wbukpreviousClickbuc() {

    if (this.has_previousbuk === true) {
      this.page=this.page-1;
      this.getassetmakerwbcwipsummary(this.presentpagebuk - 1, 10);

    }
  }

  getassetmakerwbbucsummary(pageNumber = 1, pageSize = 10) {
    let data:any={};
      this.checkboxselectchiplist=[];
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp }
    let search:string="page="+pageNumber+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    this.spinner.show();
    this.Faservice.getassetmakerwbBUCsummary(pageNumber, pageSize,data)
      .subscribe((result) => {
        console.log("asset", result);
        this.spinner.hide();
        this.showAlertMsg();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerwbbuclist=[];
        }
        else{
          let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetmakerwbbuclist = datass;
        this.spinner.hide();
        this.checkedValuesbuc = this.assetmakerwbbuclist.map(() => false);


        console.log("assetbuc", this.assetmakerwbbuclist)
        if (this.assetmakerwbbuclist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
          this.presentpagewbuk=datapagination.index;
          // presentpagewbuk
        }
        }
        

      },
      (error)=>{
        this.spinner.hide();
      }
      );
      

  }

  wbuknextClickbucc() {
    
    if (this.has_nextbuk === true) {
      this.page=this.page+1;
      this.getassetmakerwbbucsummary(this.presentpagewbuk + 1, 10)

    }
  }

  wbukpreviousClickbucc() {

    if (this.has_previousbuk === true) {
      this.page=this.page-1;
      this.getassetmakerwbbucsummary(this.presentpagewbuk - 1, 10);

    }
  }


  iscwi() {
    return this.checkedValuescwip.some(b => b);
  }
  // ischeckss:boolean= this.checkedValuesreg.some((b:boolean) => b);
  ischeckss() {
    // return this.checkedValuesreg.some(b => b);
    return this.checkedValuesreg.some((b:boolean) => b);
  }

  isbu() {
    return this.checkedValuesbuc.some(b => b);
  }


  private bucket() {
    this.Faservice.bucket()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketlist = datas;
        console.log("bucket", datas)
      })

  }

  buccreateForm() {
    // if (this.bucketform.value.doctype===""){
    //   this.toastr.error('Add Depreciation type Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    // if (this.bucketform.value.depgl===""){
    //   this.toastr.error('Add GL Number  Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    if(this.bucketform.get('name').value ==null || this.bucketform.get('name').value =='' ||  this.bucketform.get('name').value =="" ){
      this.notification.showError('Please Enter The Bucket Name');
      return false;
    }

    let data = this.bucketform.value;
    console.log('edata=',data)
    this.Faservice.bucCreateForm(data)
      .subscribe(

        (data)=>{
          if(data['code']=='DUPLICATE_BUCKET'){
            this.notification.showWarning(data['code']);
            this.notification.showWarning(data['description']);
          }
          else{
            this.notification.showSuccess("Saved Successfully!...");
          }
        
        },
        (error)=>{
          this.notification.showError('Failed To Upload');
        }
        // this.onSubmit.emit();
        // this.router.navigate(['/fa/famastersummary'], { skipLocationChange: true })



        
      )
      this.bucketform.get('name').patchValue(" ");

  }

  filterResults(obj: any, e: any) {
   



    if (e.currentTarget.checked == true) {
      this.checkboxselectlist.push({'id':obj.id});
      console.log("chekclist", this.checkboxselectlist)
      this.shareservice.checklist.next(this.checkboxselectlist);
      this.is_cwip=true;
      this.add_btn_enb=false;
     
    }
    else {
      const index = this.checkboxselectlist.indexOf(obj.id)
      this.checkboxselectlist.splice(index, 1)
      console.log('liste', this.checkboxselectlist);
      this.is_cwip=false;
      this.add_btn_enb=true;
      
    }
    if(this.checkboxselectlist.length>=1){
      this.add_btn_enb=false;
    }
    
  }
  selectata(data:any){
    console.log('ee=',data);
    this.bucket_id=data.code;
  }
  filterResults_buc(obj:any,e:any){
    if (e.currentTarget.checked == true) {
      this.checkboxselectchiplist.push({'id':obj.id});
      console.log("chekclist", this.checkboxselectchiplist)
      this.shareservice.checklist.next(this.checkboxselectlist);
      this.is_buc=true;
      this.add_atn_enb_buc=false;
      // if(this.checkboxselectchiplist.length >=1){
      //   this.add_atn_enb_buc=false;
      // }
      // else{
      //   this.add_atn_enb_buc=true;
      // }

    }
    else {
      const index = this.checkboxselectchiplist.indexOf(obj.id)
      this.checkboxselectchiplist.splice(index, 1)
      console.log('liste', this.checkboxselectchiplist);
      this.is_buc=false;
      this.add_atn_enb_buc=true;
     
    }
   
    if(this.checkboxselectchiplist.length>=1){
      this.add_atn_enb_buc=false;
    }

  }
  filterResults_reg(obj:any,e:any){
    console.log('click')
    if (e.currentTarget.checked == true) {
      this.checkboxselectreglist.push({'id':obj.id});
      console.log("chekclist", this.checkboxselectreglist)
      this.shareservice.checklist.next(this.checkboxselectreglist);
      this.is_reg=true;
      this.add_btn_enb_reg=false;
      

    }

    else {
      const index = this.checkboxselectreglist.indexOf(obj.id)
      this.checkboxselectreglist.splice(index, 1);
      this.is_reg=false;
      this.add_btn_enb_reg=true;
    }
    if(this.checkboxselectreglist.length>=1){
      this.add_btn_enb_reg=false;
    }
   console.log(this.checkboxselectreglist.length);
    
  }

  bucketnameCreateForm() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    let data = this.bucketnameform.value;
   const a= {
      "clearing_header":  this.checkboxselectlist ,
      "bucket_code":this.bucket_id
      }
    console.log('jj=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {
        console.log(res);
        if(res.status=="success"){
       
        this.spinner.hide();
        this.notification.showSuccess(res.message)
        
        this.getassetmakerwbcwipsummary(1,10);

        return true;
        }
        else{
          this.spinner.hide();
          this.notification.showWarning(res.code);
          this.notification.showWarning(res.description);
        }
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      )
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
     


  }

  bucketnameCreateForm_buc() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    let data = this.bucketnameform.value;
    
    const a= {
      "clearing_header": this.checkboxselectchiplist,
      "bucket_code":this.bucket_id 
      }
    console.log('jj=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {

        if(res.status=="success"){
          this.spinner.hide();
        this.notification.showSuccess(res.message);
        this.getassetmakerwbbucsummary();
        }
        else{
          this.spinner.hide();
          this.notification.showError(res.code);
          this.notification.showError(res.description);
        }


        return true;
      },
      (error)=>{
        console.log(error);
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      )
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
      


  }
  bucketnameCreateForm_reg() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    // let data = this.bucketnameform.value;

    const a= {
      "clearing_header": this.checkboxselectreglist ,
      "bucket_code":  this.bucket_id
      };
      console.log(this.checkboxselectreglist);
    console.log('jjreg=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {
        console.log(res)
        if(res.status=="success"){
          this.spinner.hide();
          this.notification.showSuccess(res.message);
          this.getassetmakerregsummary();
        }
        else{
          
          this.spinner.hide();
          this.notification.showError(res.code);
          this.notification.showError(res.description);

        }
       



        return true;
      },
      (error)=>{
        console.log(error);
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      );
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
     



  }




  createFormate() {
    let data = this.assetmakerSearchForm.controls;
    let assetmakersearchclass = new assetmakerSearchtype();
    assetmakersearchclass.invno = data['invno'].value;
    assetmakersearchclass.invoicedate = data['invoicedate'].value
    assetmakersearchclass.suppliername = data['suppliername'].value;
    assetmakersearchclass.crno = data['crno'].value
    return assetmakersearchclass;
  }

  j: any
  k: any
  assetmakercreateForm() {
    this.presentpagebuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagewbuk+'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    
    data['page']=search;
    console.log('dear1=',dear);
    this.spinner.show();
    this.Faservice.getassetmakerwbCWIPsummary(this.presentpagebuk, 10 ,data)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("welcome")
        console.log("assetasasas", result);
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerwbcwlist=[];
        }
        else{
        let datass = result['data'];
        let datapagination = result["pagination"];
        
        this.checkedValuescwip = this.assetmakerwbcwlist.map(() => false);
        this.spinner.hide();
        if(result['data'].lenght==0){
          this.spinner.hide();
          this.notification.showWarning('Matching Data Not Found..')
          this.assetmakerwbcwlist = [];
        }
        else{
          this.spinner.hide();
          this.assetmakerwbcwlist=result['data'];
        }

        console.log("assetwip", this.assetmakerwbcwlist)
        if (this.assetmakerwbcwlist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }
      }
      },
      (error)=>{
        this.spinner.hide();

      }
      );
    
  }
  reset() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerwbcwipsummary(1,10);
  }

  assetmakerbuccreateForm() {
    this.presentpagebuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagebuk +'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    
    dear['page']=search;
    console.log('dear1=',dear);
    this.spinner.show();
    this.Faservice.getassetmakerwbBUCsummary(1, 10,dear)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("asset", result);
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerwbbuclist=[];
        }
        else{
        let datass = result['data'];
        let datapagination = result["pagination"];
        
        this.spinner.hide();
        this.checkedValuesbuc = this.assetmakerwbbuclist.map(() => false);
        if(result['data'].length==0){
          this.assetmakerwbbuclist =[];
          this.notification.showWarning('Matching Data Not Found..');
          this.spinner.hide();
        }
        else{
          this.assetmakerwbbuclist=result['data'];
          this.spinner.hide();
        }

        console.log("assetbuc", this.assetmakerwbbuclist)
        if (this.assetmakerwbbuclist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }
      }

      },
      (error)=>{
        this.spinner.hide();
      }
      );
    
  }
  resets() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerwbbucsummary();
  }

  assettotalcount(){
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    //let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+'1'+'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    this.total_countsenb=true;
    this.Faservice.getassettotalcount(data).subscribe((result:any)=>{
      this.total_countsenb=false;
      if(result.code!=undefined && result.code!=""){
        this.notification.showWarning(data.description);
        this.total_counts=null;
      }
      else{
        this.total_counts=result.count;
      }
    })
  }
  assetmakerregcreateForm() {
    this.presentpagewbuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagewbuk +'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    data['page']=search;
    this.spinner.show();
    this.Faservice.getassetmakerregsummary(this.presentpagewbuk,10,data)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("asset", result);
        this.length_reg=result['count'];
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.notification.showWarning(result.description)
          this.assetmakerreglist=[];
        }
        else{
        let datass = result['data'];
        let datapagination = result["pagination"];
        // this.assetmakerreglist = datass;
        
        this.spinner.hide();
        if(result['data'].length==0){
          this.assetmakerreglist=[];
          this.spinner.hide();
          this.notification.showWarning('Matching Data Not Found');
        }
        else{
          this.assetmakerreglist=datass;
          this.spinner.hide();
        }
        // this.checkedValuesreg = this.assetmakerreglist.map(() => false);
        this.checkedValuesreg = this.assetmakerreglist.map(b => b===false)
        console.log("assetreg=", this.assetmakerreglist)
        if (this.assetmakerreglist.length >= 0) {
          this.has_nextwbuk = datapagination.has_next;
          this.has_previouswbuk = datapagination.has_previous;
          this.presentpagewbuk = datapagination.index;
        }
      }

      },
      (error)=>{
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
        this.spinner.hide();
      }
      );
  }
  resetss() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerregsummary();
  }
  supnameid(data:any){
    this.supid=data.id;
  }
  autocompletecommodityScroll_product() {
    console.log('ente')
    setTimeout(() => {
      if (
        this.matsupname&&
        this.autocompletetrigger &&
        this.matsupname.panel
      ) {
        console.log('enter1')
        fromEvent(this.matsupname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_product === true) {
                this.Faservice.getassetsuppliername(this.supname.nativeElement.value, this.currentpagecom_product+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.supnamelist = this.supnamelist.concat(datas);
                    console.log(datapagination);
                    if (this.supnamelist.length >= 0) {
                      this.has_nextcom_product = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_product = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  qtyappend(event:any,data:any){
    if(event.currentTarget.checked == true){
      this.QtyChangeAppendArray.push(data);
    }
    else{
      let index_qty=this.QtyChangeAppendArray.findIndex((dtaqty:any)=>dtaqty.detailsid==data.detailsid);
      this.QtyChangeAppendArray.splice(index_qty,1);
    }
  }
  viewdata(data:any){
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp};
    (this.qtyChangeArrayForm.get('dataArray') as FormArray).clear();
    this.spinner.show();
    this.Faservice.getqtybaseDetails(data.id,id,this.isgrp,data.groupname)
      .subscribe((result:any)=>{
        this.spinner.hide();
        console.log(result);
        if(result.code!=undefined && result.code!=null && result.code!=""){
          this.notification.showWarning(result.code);
          this.notification.showWarning(result.description);
        }
        else{
          (this.qtyChangeArrayForm.get('dataArray') as FormArray).clear();
          this.ecfnum=result['crnumlist'];
          this.qty_capitalizeamount=result?.capitalizedamount;
          this.qty_balanceamount=result?.balanceamount;
          this.qty_invoicecoount=result?.invoicecount;
          this.qty_taxamount=result?.tax_amount;
          this.qty_totaltaxableamount=result?.taxabale_amount;
          this.qty_totalamount=result?.totamount;
          for(let i=0;i<result['data'].length;i++){
            (this.qtyChangeArrayForm.get('dataArray') as FormArray).push(this.fb.group({
              'productname':result['data'][i]['product_name'],
              'taxamount':result['data'][i]['taxamount'],
              'taxableamount':result['data'][i]['taxable_amount'],
              'totalamount':result['data'][i]['totamount'],
              'qty':result['data'][i]['qty'],
              'balanceQty':result['data'][i]['balanceqty'],
              'detailsid':result['data'][i]['id'],
              'enb':result['data'][i]['enb'],
              'select_enb':result['data'][i]['select_enb'],
              'availbale_qty':result['data'][i]['existing_qty'],
              "existing_balanceqty":result['data'][i]['existing_balanceqty']
            }));
          }
          console.log(result);
        }
      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();
     } 
      )
  }
   enb_process:number=0;
  ngAfterViewChecked() {
    // if(this.enb_process==0){
    //   const list = document.getElementsByClassName('mat-paginator-range-label');
    // console.log(list);
    // list[0].innerHTML =list[0].innerHTML+ ' Page: ' + this.page.toString();
    // }
    // this.enb_process=1;
    // console.log('123');
    
}
chenageStatus(event:any,index:number){
  console.log(event.currentTarget.checked);
  if(event.currentTarget.checked){
    ((this.qtyChangeArrayForm.get('dataArray') as FormArray).at(index) as FormGroup).get('select_enb').patchValue(true);
  }
  else{
    ((this.qtyChangeArrayForm.get('dataArray') as FormArray).at(index) as FormGroup).get('select_enb').patchValue(false);
  }
 
}

  quantitychangesubmit(){
    let cnt:number=0;
    let data_array:Array<any>=[];
    console.log(((this.qtyChangeArrayForm.get('dataArray') as FormArray)).value);
    for(let i=0;i<((this.qtyChangeArrayForm.get('dataArray') as FormArray)).value.length;i++){
      if(((this.qtyChangeArrayForm.get('dataArray') as FormArray).at(i) as FormGroup).get('select_enb').value==true){
        cnt=cnt+1;
        data_array.push(((this.qtyChangeArrayForm.get('dataArray') as FormArray).at(i) as FormGroup).value);
      }
    }
    if (cnt==0){
      this.notification.showWarning("Please Select The Data..");
      return false;
    }
    this.spinner.show();
    this.Faservice.getqtybaseDetails_submit(data_array).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.notification.showWarning(result.code);
        this.notification.showWarning(result.description);
      }
      else{
        this.notification.showSuccess(result.status);
        this.notification.showSuccess(result.message);
        this.qtyclose.nativeElement.click();
      }
    },
    (error:HttpErrorResponse)=>{
      this.notification.showWarning("Quantity Change Failed..");
      this.spinner.hide();
    }
    )
  }
  maker_reportdowload(){
    if(this.reportform.get('maker_doctype').value=='' || this.reportform.get('maker_doctype').value==undefined || this.reportform.get('maker_doctype').value==null){
      this.notification.showWarning("Please Select the type");
      return false;
    }
    let params ='?doctype='+this.reportform.get('maker_doctype').value;
    this.spinner.show();
    this.Faservice.fa_makerdownload(params).subscribe(result=>{
      this.spinner.hide();
          if(result.type=='application/json'){
            this.notification.showWarning("INVALID DATA");
            const reader = new FileReader();
    
            reader.onload = (event: any) => {
              const fileContent = event.target.result;
              // Handle the file content here
              console.log(fileContent);
              let DataNew:any=JSON.parse(fileContent);
              this.notification.showWarning(DataNew.code);
              this.notification.showWarning(DataNew.description);
            };
    
            reader.readAsText(result);
          }
          else{
            let binaryData = [];
            binaryData.push(result)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'FA Maker Reports_'+ date +".xlsx";
            link.click();
            this.notification.showSuccess('Success');
          }

    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error?.status+error.message);
    })
  }
  bucket_reportdowload(){
    if(this.reportform.get('bucket_doctype').value=='' || this.reportform.get('bucket_doctype').value==undefined || this.reportform.get('bucket_doctype').value==null){
      this.notification.showWarning("Please Select the type");
      return false;
    }
    let params= '?doctype='+this.reportform.get('bucket_doctype').value;
    this.spinner.show();
    this.Faservice.fa_bucket_download(params).subscribe(result=>{
      this.spinner.hide();
          if(result.type=='application/json'){
            this.notification.showWarning("INVALID DATA");
            const reader = new FileReader();
    
            reader.onload = (event: any) => {
              const fileContent = event.target.result;
              // Handle the file content here
              console.log(fileContent);
              let DataNew:any=JSON.parse(fileContent);
              this.notification.showWarning(DataNew.code);
              this.notification.showWarning(DataNew.description);
            };
    
            reader.readAsText(result);
          }
          else{
            let binaryData = [];
            binaryData.push(result)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'FA Bucket Reports_'+ date +".xlsx";
            link.click();
            this.notification.showSuccess('Success');
          }

    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error?.status+error.message);
    })

  }
  closereport(){
    this.reportform.reset('');
  }
  delete_bucket(data){
    if (data?.id === 0 || data?.id === '0'){
      this.notification.showWarning("This Bucket's are not able to delete...");
      return;
    }
    let paramas ='?clearingheader_id='+data?.id+'&code='+data?.groupcode;
    this.spinner.show();
    this.Faservice.fa_bucket_delete(paramas).subscribe(res=>{
      this.spinner.hide();
      if(res['code']!=null && res['code']!='' && res['code']!=undefined){
        this.notification.showWarning(res?.code);
        this.notification.showWarning(res?.description);
      }
      else{
        // this.notification.showSuccess(res?.status);
        this.notification.showSuccess(res?.message);
        if(this.test === "REGULAR"){
          this.getassetmakerregsummary()
        }
        else if(this.test === "CWIP" ){
          this.getassetmakerwbcwipsummary(1,10);
        }
        else if (this.test === "BUC"){
          this.getassetmakerwbbucsummary();
          
        }
      }
    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error?.status + error?.message);
    })

  }
}


class assetmakerSearchtype {
  invno: string;
  invoicedate: any;
  suppliername:string;
  crno:any;

} 