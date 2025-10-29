import { Component, OnInit, ViewChild, EventEmitter, ElementRef, TemplateRef, ViewEncapsulation, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import {fromEvent, Observable, range} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';


export interface bucketdata{
  id:string;
  name:string;
}
export interface User {
  title: string;
  model:string
}
export interface BRANCH {
  name: string;
  id: string;
  
}
export interface apcatlistss {
  id: string;
  name: string;
}
export interface Product{
  name:string;
  id:string;
}
@Component({
  selector: 'app-faquery',
  templateUrl: './faquery.component.html',
  styleUrls: ['./faquery.component.scss'],
  encapsulation:ViewEncapsulation.None
})


export class FaqueryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @ViewChild('opendata') opendialogdata:TemplateRef<any>;
  @ViewChild('refclose') refsdatapopdata:ElementRef;
  @ViewChild('refcloseExp') refsdatapopdataExp:ElementRef;
  @ViewChild('refcloseApvl') refsdatapopdataAPvl:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('productinfo') Productname:MatAutocomplete
  @ViewChild('productInput') Productinput:ElementRef;

accountingarray = [];
sumofcredit:number=0;
sumofdebit:number=0;
sumofcreditExp:number=0;
sumofdebitExp:number=0;
cp_date = false;
first:boolean=false;
transfer_branch = false;
asset_enddate = false;
ins_date = false;
asset_leasedate = false;
asset_value = false;
po_no_enter = false;
invoice_no_enter = false;
mep_no_enter = false;
invoice_amt_enter = false;
vendor_name_enter = false;
dep_hold_enter = false;
asset_source=false;
Loadinggrid = false;
accountDetailslist:Array<any>=[];
accountDetailslistExp:Array<any>=[];
has_accnext:boolean=false;
has_accprevious:boolean=false;
has_accpage:number=1;
expdatalist:Array<any>=[];
productlist:Array<any>=[];
checkersum:any=FormGroup;
prpoqueryform:any=FormGroup;
  exp_presentpage:number=1;
  exp_previouspage:boolean=false;
  exp_nextpage:boolean=false;
  product_hasnext:boolean=false;
  product_hasprevious:boolean=false;
  product_presentpage:number=1;
appvl_history:Array<any>=[]
countdata = {
  "cap_count": '',
  "writeoff_count": '',
  "impair_count": "",
  "assetvalue_count": "",
  "merge_count": "",
  "transfer_count": "",
  "split_count": '',
  "cat_count": 0,
  "sale_count": ''
}
Datas = [{'title':"Cap date",'value' :1 },
         {'title':"WriteOff",'value' :2} ,
         {'title':"Impairment",'value' :3} ,
         {'title':"Value Change",'value' :4},
         {'title':"Merge",'value' :5},
         {'title':"Split",'value' :6},
         {'title':"Transfer",'value' :7},
         {'title':"Category",'value' :8},
         {'title':"Sale",'value' :9}];
pagesize=10;
filter_options:User[]=[{'title':"CP Date",'model':"cp_date"},
                       {'title':"Transfer Branch",'model':"transfer_branch"},
                       {'title':"Asset EndDate",'model':"asset_enddate"},
                       {'title':"Invoice Date",'model':"ins_date"},
                       {'title':"Asset Lease Date",'model':"asset_leasedate"},
                       {'title':"Asset Value",'model':"asset_value"},
                       {'title':"PO No",'model':"po_no_enter"},
                       {'title':"MEP No",'model':"mep_no_enter"},
                       {'title':"Invoice No",'model':"invoice_no_enter"},
                       {'title':"Taxable Amount",'model':"invoice_amt_enter"},
                       {'title':"Vendor Name",'model':"vendor_name_enter"},
                       {'title':"Depreciation Hold",'model':"dep_hold_enter"},
                       {'title':"Asset Source",'model':"asset_source"}
                      ]
depreciation_options = [{'title':"Yes",'value' :1 },
                        {'title':"No",'value' :0}]
assetsource=[]
 enbfirst:boolean=false;
fasearchform:FormGroup;
  branchdata: any;
  apcategoryList: any;
  selectedValues: any;
  faquerygrid=[];
  has_nextloc=false;
  has_previousloc=false;
  presentpageloc=1;
  checker_assetcat:Array<any>=[];
  checker_branch:Array<any>=[];
  ppr_querybranch:Array<any>=[];
  ppr_queryproduct:Array<any>=[]
  branch_id:any;
  count: any;
  asset_id:any;
  findcount=[]
  count_search='1';
  options: string[] = ["10", "20", "50","100","200","250"];
  depselectionvalue: string;
  version: any;
  asst_source_id:any=[];
  selectedQuantityData:number=10;
  fromBucketList:Array<any>=[];
  constructor(private matdialog:MatDialog,private fb: FormBuilder, private router: Router,
    private notification: NotificationService,public datepipe: DatePipe, private toastr: ToastrService, private Faservice: faservice,private SpinnerService: NgxSpinnerService) { }

  myControl = new FormControl();
  
  filteredOptions: Observable<User[]>;
  isLoading=false;
  searchdata = {
    "asstsrc":"",
    "assetdetails_id": "",
    "assetgroup_id": "",
    "barcode": "",
    "branch": "",
    "capend_date": "",
    "capstart_date": "",
    "cat": "",
    "crnum": "",
    "enddate": "",
    "enddatefrom": "",
    "enddateto": "",
    "lease_enddate": "",
    "lease_startdate": "",
    "ponum": "",
    "mepno": "",
    "subcat": "",
    "vendorname": "",
    "invoicedate": "",
    "amount": "",
    "invoiceno": "",
    "assetto_value": "",
    "assetfrom_value": "",
    "branchfrom": "",
    "branchto": "",
    "deponhold":"",
    "bucname":'',
    'make':"",
    'model':'',
    'serialno':'',
    'specifications':'',
    'product':''
   
  }
  ngOnInit() {
    this.Faservice.getassetsource().subscribe(
      data=>{
        this.assetsource=data
        console.log(this.assetsource)
      }  
    )

    this.fasearchform = this.fb.group({
      asstsrc:[''],
      assetdetails_id: ['' ],
      barcode: ['' ],
      invoicedate:['' ],
      amount:[''],
      invoiceno: [""],
      assetgroup_id: [''],
      cat: ['', ],
      subcat: ['', ],
      lease_startdate: ['' ],
      lease_enddate: ['' ],
      enddate: [''],
      vendorname: ['' ],
      crnum: ['' ],
      ponum: ['' ],
      deponhold:[''],
      capstart_date: ['' ],
      capend_date: [''],
      branch: [''],
      enddatefrom: [''],
      enddateto: ['' ],
      branchfrom:[''],
      branchto:[''],
      assetfrom_value:[''],
      assetto_value:[''],
      mepno:[''],
      bucname:[''],
      product:[''],
      'make':[''],
      'model':[''],
      'serialno':[''],
      'specifications':[''],
      



    });
    this.checkersum=this.fb.group({
      'date':new FormControl(),
      'assetcat':new FormControl(),
      'branch':new FormControl(),
      'crno':new FormControl(),
      'expense_code':new FormControl()
    });
    this.prpoqueryform=this.fb.group({
      'asset_id':new FormControl(),
      'branch':new FormControl(),
      'product':new FormControl(),
    })
    this.checkersum.get('assetcat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any) => this.Faservice.getassetcategorynew( this.checkersum.get('assetcat').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).
      subscribe((results: any[]) => {
        this.checker_assetcat=results['data']
          
        console.log('assetcat=',results)
      });
      this.Faservice.getassetbranchdata('',1).subscribe(data=>{
        this.checker_branch=data['data'];
        this.ppr_querybranch=data['data'];
        
      })
      this.checkersum.get('branch').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any) => this.Faservice.getassetbranchdata( this.checkersum.get('branch').value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).
        subscribe((results: any[]) => {
            this.checker_branch=results['data']
            // console.log('branch_name=',results)
        }); 
    this.fasearchform.get('bucname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.Faservice.getbucketsummarydropdown(1,value,'Y').pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.fromBucketList=data['data'];
      // this.additionData=data['data'];
      // for(let i=0;i<this.additionData.length;i++){
      //   this.additionData[i]['con']=false;
      // }
      
    });
    this.faqueryget({},1,10,'')
    this.faqueryversion();
    // console.log('do')
    this.filteredOptions=this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.title)),
      map(title => (title ? this._filter(title) : this.filter_options.slice())),
    );

    // this.Faservice.querycount(10)

    // .subscribe((result) => {
    // if(result){
    //   let datass = result['data'];
    //   // this.countdata=result;
    //   this.faquerygrid = datass;
    //   // console.log("landlord", this.faquerygrid)
    //   if (datass.length>0) {
    //     let datapagination = result["pagination"];
    //     this.count=result['count']
    //   }}})  

    this.fasearchform.get('product').valueChanges
        .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
         }),
         switchMap(value => this.Faservice.getassetproductdata(value ,1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),)
         )
       )
       .subscribe((results: any[]) => {
         let datas = results['data'];
         this.productlist = datas
         console.log("product List", this.productlist)
       });

       this.prpoqueryform.get('product').valueChanges
       .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value:any) => this.Faservice.getassetproductdata(value ,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),)
        )
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.productlist = datas
        console.log("product List", this.productlist)
      });
    this.getproduct();    
  }

  displayFn(user: User): string {
    return user && user.title ? user.title : '';
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.filter_options.filter(option => option.title.toLowerCase().includes(filterValue));
}

branchget() {
  let bs: String = "";
  this.getbranch(bs);
  this.prpoqueryform.get('branch').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      // console.log('inside tap')

    }),
    switchMap(value => this.Faservice.search_employeebranch(value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

    .subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
  this.fasearchform.get('branch').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      // console.log('inside tap')

    }),
    switchMap(value => this.Faservice.search_employeebranch(value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

    .subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
    this.fasearchform.get('branchfrom').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')
  
      }),
      switchMap(value => this.Faservice.search_employeebranch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
       
      })
      this.fasearchform.get('branchto').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
    
        }),
        switchMap(value => this.Faservice.search_employeebranch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
    
        .subscribe((results: any[]) => {
          this.branchdata = results["data"];
         
        })    
}

getbranch(val){
  this.Faservice.search_employeebranch(val).subscribe((results: any[]) => {
    this.branchdata = results["data"];
   
  })

}
public displayFnbranch(_branchval?: BRANCH): string | undefined {
  return _branchval ? _branchval.name : undefined;
}

get _branchval() {
  return this.fasearchform.get('branch');
}
get _branchvalfrom() {
  return this.fasearchform.get('branchfrom');
}
get _branchvalto() {
  return this.fasearchform.get('branchto');
}
public displayFnbranchfrom(_branchvalfrom?: BRANCH): string | undefined {
  return _branchvalfrom ? _branchvalfrom.name : undefined;
}

public displayFnbranchto(_branchvalto?: BRANCH): string | undefined {
  return _branchvalto ? _branchvalto.name : undefined;
}



getcat(){
let apcatkeyvalue: String = "";
    this.getapcat(apcatkeyvalue);
    // this.getsubcatid();


    this.fasearchform.get('cat').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcat(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;
        console.log("cat", datas)

      })}

      public displayapsscat(autoapcat?: apcatlistss): string | undefined {
        return autoapcat ? autoapcat.name : undefined;
      }
      
    
      get autocit() {
        return this.fasearchform.get('cat');
      }
    
     getapcat(apcatkeyvalue) {
        this.Faservice.getapcat(apcatkeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.apcategoryList = datas;
    
          })}
    

filter_flags(ev,fg){
  console.log(fg)
}

edit(d:number){
  console.log(d)
   this.depselectionvalue = d.toString()
 console.log(this.depselectionvalue)
}
sourceget(event,asst_src_data){
  console.log(event)
  console.log(asst_src_data)

  if (event.isUserInput && event.source.selected == false) {
    if(asst_src_data=='1'){
      delete this.asst_source_id[0];
    }
    if(asst_src_data=='2'){
      delete this.asst_source_id[1];
    }
    if(asst_src_data=='3'){
      delete this.asst_source_id[2];
    }
    if(asst_src_data=='4'){
      delete this.asst_source_id[3];
    }
    if(asst_src_data=='5'){
      delete this.asst_source_id[4];
    }
    if(asst_src_data=='6'){
      delete this.asst_source_id[5];
    }
    if(asst_src_data=='7'){
      delete this.asst_source_id[6];
    }
    if(asst_src_data=='8'){
      delete this.asst_source_id[7];
    }
    if(asst_src_data=='9'){
      delete this.asst_source_id[8];
    }
    if(asst_src_data=='10'){
      delete this.asst_source_id[9];
    }
    if(asst_src_data=='11'){
      delete this.asst_source_id[10];
    }
    if(asst_src_data=='12'){
      delete this.asst_source_id[11];
    }
    if(asst_src_data=='13'){
      delete this.asst_source_id[12];
    }
    if(asst_src_data=='14'){
      delete this.asst_source_id[13];
    }
  }
  if (event.isUserInput && event.source.selected == true) {
    if(asst_src_data=='1'){
      this.asst_source_id[0]='1';
    }
    if(asst_src_data=='2'){
      this.asst_source_id[1]='2';
    }
    if(asst_src_data=='3'){
      this.asst_source_id[2]='3';
    }
    if(asst_src_data=='4'){
      this.asst_source_id[3]='4';
    }
    if(asst_src_data=='5'){
      this.asst_source_id[4]='5';
    }
    if(asst_src_data=='6'){
      this.asst_source_id[5]='6';
    }
    if(asst_src_data=='7'){
      this.asst_source_id[6]=7;
    }
    if(asst_src_data=='8'){
      this.asst_source_id[7]='8';
    }
    if(asst_src_data=='9'){
      this.asst_source_id[8]='9';
    }
    if(asst_src_data=='10'){
      this.asst_source_id[9]='10';
    }
    if(asst_src_data=='11'){
      this.asst_source_id[10]='11';
    }
    if(asst_src_data=='12'){
      this.asst_source_id[11]='12';
    }
    if(asst_src_data=='13'){
      this.asst_source_id[12]='13';
    }
    if(asst_src_data=='14'){
      this.asst_source_id[13]='14';
    }
  }
}

selectionChange(event) {
  if (event.isUserInput && event.source.selected == false) {
    // let index = this.selectedValues.indexOf(event.source.value);
    // this.selectedValues.splice(index, 1)
    if(event.source.value.model=='cp_date'){
      this.cp_date=false;
      this.fasearchform.value.capstart_date='';
    }
    if(event.source.value.model=='transfer_branch'){
      this.transfer_branch=false;
      this.fasearchform.value.branchfrom=''
    }
    if(event.source.value.model=='asset_enddate'){
      this.asset_enddate=false;
      this.fasearchform.value.enddatefrom='';
    }
    if(event.source.value.model=='ins_date'){
      this.ins_date=false;
      // this.fasearchform.value.in='';
    }
    if(event.source.value.model=='asset_leasedate'){
      this.asset_leasedate=false;
      this.fasearchform.value.lease_startdate=''
    }
    if(event.source.value.model=='asset_value'){
      this.asset_value=false;
      this.fasearchform.value.assetfrom_value=''
    }
    if(event.source.value.model=='po_no_enter'){
      this.po_no_enter=false;
      this.fasearchform.value.ponum=''
    }
    if(event.source.value.model=='invoice_no_enter'){
      this.invoice_no_enter=false;
    }
    if(event.source.value.model=='mep_no_enter'){
      this.mep_no_enter=false;

      this.fasearchform.value.mepno=''
    }
    if(event.source.value.model=='invoice_amt_enter'){
      this.invoice_amt_enter=false;
    }
    if(event.source.value.model=='vendor_name_enter'){
      this.vendor_name_enter=false;
      this.fasearchform.value.vendorname=''
    }
    if(event.source.value.model=='dep_hold_enter'){
      this.dep_hold_enter=false;
    }
    if(event.source.value.model=='asset_source'){
      this.asset_source=false;
    }
  
  }
  else if(event.isUserInput && event.source.selected == true){

    if(event.source.value.model=='cp_date'){
      this.cp_date=true;
    }
    if(event.source.value.model=='transfer_branch'){
      this.transfer_branch=true;
    }
    if(event.source.value.model=='asset_enddate'){
      this.asset_enddate=true;
    }
    if(event.source.value.model=='ins_date'){
      this.ins_date=true;
    }
    if(event.source.value.model=='asset_leasedate'){
      this.asset_leasedate=true;
    }
    if(event.source.value.model=='asset_value'){
      this.asset_value=true;
    }
    if(event.source.value.model=='po_no_enter'){
      this.po_no_enter=true;
    }
    if(event.source.value.model=='invoice_no_enter'){
      this.invoice_no_enter=true;
    }
    if(event.source.value.model=='mep_no_enter'){
      this.mep_no_enter=true;
    }
    if(event.source.value.model=='invoice_amt_enter'){
      this.invoice_amt_enter=true;
    }
    if(event.source.value.model=='vendor_name_enter'){
      this.vendor_name_enter=true;
    }
    if(event.source.value.model=='dep_hold_enter'){
      this.dep_hold_enter=true;}
    
    if(event.source.value.model=='asset_source'){
        this.asset_source=true;
        console.log(this.asset_source)
      }
  }



}
totalcount(event,type){
  
  if(event.isUserInput && event.source.selected == true){
this.findcount.push(event.source.value.value)

  }
  else if(event.isUserInput && event.source.selected == false){
    
  this.deleteMsg(event.source.value.value)
}

if(!this.findcount?.length){
  this.count_search='1';

}else{

this.count_search=type
}
}
deleteMsg(msg:any) {
  const index: number = this.findcount.indexOf(msg);
  if (index !== -1) {
      this.findcount.splice(index, 1);
  }        
}
FA_Countarray(){
  // this.faqueryget({"value":this.findcount},1,0,this.count_search)
  this.SpinnerService.show();

  this.Faservice.queryget({"value":this.findcount},1,0,this.count_search)
    .subscribe((result) => {
    if(result){
      console.log('FilterCount',result)
      let datass = result;
      this.countdata=result;
      
      this.SpinnerService.hide()
      this.Loadinggrid=false
    }else{this.SpinnerService.hide()
    
      this.Loadinggrid=false
    }

    },
    (error)=>{
      this.SpinnerService.hide();
      this.toastr.warning(error.status+error.statusText)
    }
    )
  
}

faqueryversion(){
  this.Faservice.queryverisonget().subscribe((data)=>{
    console.log('version',data)
    this.version = data['data']
  })
}

faqueryget(data,page,size,type) {
  // this.SpinnerService.show();
  this.Loadinggrid=true
  this.SpinnerService.show()
  this.Faservice.queryget(data,page,size,type)
    .subscribe((result) => {
      this.SpinnerService.hide()
    if(result){
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.notification.showWarning(result.code);
        this.notification.showWarning(result.description);
      }
      else{
        let datass = result['data'];

      this.faquerygrid = datass;
      console.log('datass',datass)
      console.log("landlord", this.faquerygrid)
      let datapagination = result["pagination"];
      this.count=result['count']
      console.log('count',this.count)
      this.has_nextloc = datapagination.has_next;
      this.has_previousloc = datapagination.has_previous;
      this.presentpageloc = datapagination.index;
      
      this.SpinnerService.hide()
      this.Loadinggrid=false
      }
      
    }
    else{
      this.SpinnerService.hide()
      this.Loadinggrid=false
    }

    },
    (error)=>{
      this.SpinnerService.hide();
    }
    )
  

}
download_file(){
  
  this.Loadinggrid=true;
if(this.fasearchform.value.capstart_date!=""||undefined){
  this.searchdata.capstart_date=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.capstart_date;
}
if(this.fasearchform.value.branchfrom!=''||undefined){
  this.searchdata.branchfrom=this.fasearchform.value.branchfrom.id
  this.searchdata.branchto=this.fasearchform.value.branchto.id
}else{
  delete this.searchdata.branchfrom;
  delete this.searchdata.branchto;
}
if(this.fasearchform.value.assetfrom_value!=''||undefined){
  this.searchdata.assetfrom_value=this.fasearchform.value.assetfrom_value
  this.searchdata.assetto_value=this.fasearchform.value.assetto_value
}else{
  delete this.searchdata.assetfrom_value;
  delete this.searchdata.assetto_value;
}
if(this.fasearchform.value.lease_startdate!=""||undefined){
  this.searchdata.lease_startdate=this.datepipe.transform(this.fasearchform.value.lease_startdate, 'yyyy-MM-dd')
  this.searchdata.lease_enddate=this.datepipe.transform(this.fasearchform.value.lease_enddate, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.lease_startdate;
  
}
if(this.fasearchform.value.enddatefrom!=""||undefined){
  this.searchdata.enddatefrom=this.datepipe.transform(this.fasearchform.value.enddatefrom, 'yyyy-MM-dd')
  this.searchdata.enddateto=this.datepipe.transform(this.fasearchform.value.enddateto, 'yyyy-MM-dd')

  
}else{
  delete this.searchdata.enddatefrom; 
}
if(this.fasearchform.value.deponhold!=""||undefined ){
  this.searchdata.deponhold=this.depselectionvalue
  console.log('deponhold',this.searchdata.deponhold)
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.asstsrc!=""||undefined ){
  this.searchdata.asstsrc=this.asst_source_id;
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.amount!=""||undefined ){
  this.searchdata.amount=this.fasearchform.value.amount
}else{
  delete this.searchdata.amount;
}
if(this.fasearchform.value.invoicedate!=""||undefined ){
  this.searchdata.invoicedate=this.datepipe.transform(this.fasearchform.value.invoicedate, 'yyyy-MM-dd')
  
}else{
  delete this.searchdata.invoicedate;
}

if(this.fasearchform.value.invoiceno!=""||undefined ){
  this.searchdata.invoiceno=this.fasearchform.value.invoiceno  
  
}else{
  delete this.searchdata.invoiceno;
}

if(this.fasearchform.value.cat!="" && this.fasearchform.value.cat!=undefined && this.fasearchform.value.cat!=null && this.fasearchform.value.cat.id!=undefined){
  this.searchdata.cat=this.fasearchform.value.cat.id
}else{
  delete this.searchdata.cat;
}
 if(this.fasearchform.value.branch!=""||undefined){
  this.searchdata.branch=this.fasearchform.value.branch.id
}else{
  delete this.searchdata.branch;
}
if(this.fasearchform.value.vendorname!=""||undefined){
  this.searchdata.vendorname=this.fasearchform.value.vendorname
}else{
  delete this.searchdata.vendorname;
}
if(this.fasearchform.value.assetdetails_id!=""||undefined){
  this.searchdata.assetdetails_id=this.fasearchform.value.assetdetails_id
}else{
  delete this.searchdata.assetdetails_id;
}

if(this.fasearchform.value.ponum!=""||undefined){
  this.searchdata.ponum=this.fasearchform.value.ponum
}else{
  delete this.searchdata.ponum;
}
if(this.fasearchform.value.mepno!=""||undefined){
  this.searchdata.mepno=this.fasearchform.value.mepno
}else{
  delete this.searchdata.mepno;
}
if(this.fasearchform.value.crnum!=""||undefined){
  this.searchdata.crnum=this.fasearchform.value.crnum
}else{
  delete this.searchdata.crnum;
}
if(this.fasearchform.value.make!="" && this.fasearchform.value.make!=undefined && this.fasearchform.value.make!=null){
  this.searchdata.make=this.fasearchform.value.make
}else{
  delete this.searchdata.make;
}
if(this.fasearchform.value.model!="" && this.fasearchform.value.model!=undefined && this.fasearchform.value.model!=null){
  this.searchdata.model=this.fasearchform.value.model
}else{
  delete this.searchdata.model;
}
if(this.fasearchform.value.serialno!="" && this.fasearchform.value.serialno!=undefined && this.fasearchform.value.serialno!=null){
  this.searchdata.serialno=this.fasearchform.value.serialno
}else{
  delete this.searchdata.serialno;
}
if(this.fasearchform.value.specifications!="" && this.fasearchform.value.specifications!=undefined && this.fasearchform.value.specifications!=null){
  this.searchdata.specifications=this.fasearchform.value.specifications
}else{
  delete this.searchdata.specifications;
}
if(this.fasearchform.get('product').value !='' && this.fasearchform.get('product').value != null && this.fasearchform.get('product').value!=null){
  this.searchdata.product=this.fasearchform.get('product').value.id
}
else{
  delete this.searchdata.specifications;
}


  // this.Faservice.queryget(this.searchdata,this.presentpageloc,this.pagesize,this.count_search)

  //   .subscribe((result) => {
  //   if(result){
  //     let datass = result['data'];
  //     // this.countdata=result;
  //     this.faquerygrid = datass;
  //     // console.log("landlord", this.faquerygrid)
  //     if (datass.length>0) {
  //       let datapagination = result["pagination"];
  //       this.count=result['count']
  //       this.has_nextloc = datapagination.has_next;
  //       this.has_previousloc = datapagination.has_previous;
  //       this.presentpageloc = datapagination.index;
  //     }
  //     this.Loadinggrid=false
  //     this.SpinnerService.hide();
  //   }
  //     else{
  //       this.SpinnerService.hide();
  //       this.Loadinggrid=false
  //       this.faquerygrid =[];
  //     }

  //   })
  this.enbfirst=true;
  if(this.first==true){
    this.notification.showWarning('Already Work In Progress Please Wait..');
    return true;
  }
  
  else{
    this.toastr.warning('Please Wait 5 mins','',{timeOut:10000,progressBar:true,progressAnimation:'decreasing'});
    this.first=true;
    this.Faservice.downloadfile(this.searchdata,this.presentpageloc,this.pagesize,this.count_search).subscribe(
      (response: any) =>{
        if(response.code!=undefined && response.code!=""){
          this.toastr.warning(response.code);
          this.toastr.warning(response.description);
        }
        else{
          this.toastr.success(response.status);
          this.toastr.success(response.message);

        }
       
          // this.first=false;
          // let filename:any='document';
          // let dataType = response.type;
          // let binaryData = [];
          // binaryData.push(response);
          // let downloadLink:any = document.createElement('a');
          // console.log()
          // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          
          // downloadLink.setAttribute('download',filename);
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
      },
      (error)=>{
        this.first=false;
        this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
        this.toastr.error(error.message,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});

      }
  )
  setTimeout(() => {
    this.first=false;
    this.enbfirst=false;
    this.toastr.success('Success','',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});

  }, 10000);
  }
  

}
download_file_prepare(){
  if(this.enbfirst==true){
    this.toastr.warning('Please Wait');
    return false;
  }
  this.SpinnerService.show();
  this.Faservice.downloadfile_prepare().subscribe(
    (response: any) =>{
      this.SpinnerService.hide();
        // this.first=false;
        // this.first=false;
        if (response['type']=='application/json'){
          this.toastr.error('INVALID_DATA')
         }
         else{
          let filename:any='FA-Query';
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink:any = document.createElement('a');
          console.log()
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          
          downloadLink.setAttribute('download',filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
         }
          
    },
    (error)=>{
      // this.first=false;
      this.SpinnerService.hide();
      this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
      this.toastr.error(error.message,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});

    }
)
}
fasearch(a,b){


  this.SpinnerService.show();
  this.Loadinggrid=true
if(a=='count'){
  this.pagesize=b
  this.presentpageloc=this.presentpageloc;
}
else{
  this.pagesize=this.selectedQuantityData;
  // this.presentpageloc=1;

}
console.log(this.pagesize);



if(this.fasearchform.value.capstart_date!=""||undefined){
  this.searchdata.capstart_date=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.capstart_date;
}
if(this.fasearchform.value.branchfrom!=''||undefined){
  this.searchdata.branchfrom=this.fasearchform.value.branchfrom.id
  this.searchdata.branchto=this.fasearchform.value.branchto.id
}else{
  delete this.searchdata.branchfrom;
  delete this.searchdata.branchto;
}
if(this.fasearchform.value.assetfrom_value!=''||undefined){
  this.searchdata.assetfrom_value=this.fasearchform.value.assetfrom_value
  this.searchdata.assetto_value=this.fasearchform.value.assetto_value
}else{
  delete this.searchdata.assetfrom_value;
  delete this.searchdata.assetto_value;
}
if(this.fasearchform.value.lease_startdate!=""||undefined){
  this.searchdata.lease_startdate=this.datepipe.transform(this.fasearchform.value.lease_startdate, 'yyyy-MM-dd')
  this.searchdata.lease_enddate=this.datepipe.transform(this.fasearchform.value.lease_enddate, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.lease_startdate;
  
}
if(this.fasearchform.value.enddatefrom!=""||undefined){
  this.searchdata.enddatefrom=this.datepipe.transform(this.fasearchform.value.enddatefrom, 'yyyy-MM-dd')
  this.searchdata.enddateto=this.datepipe.transform(this.fasearchform.value.enddateto, 'yyyy-MM-dd')

  
}else{
  delete this.searchdata.enddatefrom; 
}
if(this.fasearchform.value.deponhold!=""||undefined ){
  this.searchdata.deponhold=this.depselectionvalue
  console.log('deponhold',this.searchdata.deponhold)
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.asstsrc!=""||undefined ){
  this.searchdata.asstsrc=this.asst_source_id;
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.amount!=""||undefined ){
  this.searchdata.amount=this.fasearchform.value.amount
}else{
  delete this.searchdata.amount;
}
if(this.fasearchform.value.invoicedate!=""||undefined ){
  this.searchdata.invoicedate=this.datepipe.transform(this.fasearchform.value.invoicedate, 'yyyy-MM-dd')
  
}else{
  delete this.searchdata.invoicedate;
}

if(this.fasearchform.value.invoiceno!=""||undefined ){
  this.searchdata.invoiceno=this.fasearchform.value.invoiceno  
  
}else{
  delete this.searchdata.invoiceno;
}

if(this.fasearchform.value.cat!="" && this.fasearchform.value.cat!=undefined && this.fasearchform.value.cat!=null && this.fasearchform.value.cat.id!=undefined){
  this.searchdata.cat=this.fasearchform.value.cat.id
}else{
  delete this.searchdata.cat;
}
 if(this.fasearchform.value.branch!=""||undefined){
  this.searchdata.branch=this.fasearchform.value.branch.id
}else{
  delete this.searchdata.branch;
}
if(this.fasearchform.value.vendorname!=""||undefined){
  this.searchdata.vendorname=this.fasearchform.value.vendorname
}else{
  delete this.searchdata.vendorname;
}
if(this.fasearchform.value.assetdetails_id!=""||undefined){
  this.searchdata.assetdetails_id=this.fasearchform.value.assetdetails_id
}else{
  delete this.searchdata.assetdetails_id;
}

if(this.fasearchform.value.ponum!=""||undefined){
  this.searchdata.ponum=this.fasearchform.value.ponum
}else{
  delete this.searchdata.ponum;
}
if(this.fasearchform.value.mepno!=""||undefined){
  this.searchdata.mepno=this.fasearchform.value.mepno
}else{
  delete this.searchdata.mepno;
}
if(this.fasearchform.value.crnum!=""||undefined){
  this.searchdata.crnum=this.fasearchform.value.crnum
}else{
  delete this.searchdata.crnum;
}
console.log(this.fasearchform.value.bucname);
if(this.fasearchform.value.bucname!=""|| this.fasearchform.value.bucname!=undefined){
  this.searchdata.bucname=this.fasearchform.value.bucname.id;
}else{
  delete this.searchdata.bucname;
}
if(this.fasearchform.value.make!="" && this.fasearchform.value.make!=undefined && this.fasearchform.value.make!=null){
  this.searchdata.make=this.fasearchform.value.make
}else{
  delete this.searchdata.make;
}
if(this.fasearchform.value.model!="" && this.fasearchform.value.model!=undefined && this.fasearchform.value.model!=null){
  this.searchdata.model=this.fasearchform.value.model
}else{
  delete this.searchdata.model;
}
if(this.fasearchform.value.serialno!="" && this.fasearchform.value.serialno!=undefined && this.fasearchform.value.serialno!=null){
  this.searchdata.serialno=this.fasearchform.value.serialno
}else{
  delete this.searchdata.serialno;
}
if(this.fasearchform.value.specifications!="" && this.fasearchform.value.specifications!=undefined && this.fasearchform.value.specifications!=null){
  this.searchdata.specifications=this.fasearchform.value.specifications
}else{
  delete this.searchdata.specifications;
}
if(this.fasearchform.get('product').value !='' && this.fasearchform.get('product').value != null && this.fasearchform.get('product').value!=null){
  this.searchdata.product=this.fasearchform.value.product.id;
}
else{
  delete this.searchdata.product;
}

  this.Faservice.queryget(this.searchdata,this.presentpageloc,this.pagesize,this.count_search)

    .subscribe((result) => {
      this.SpinnerService.hide();
    if(result){
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.notification.showWarning(result.code);
        this.notification.showWarning(result.description);
        this.faquerygrid=[];
      }
      else{
        let datass = result['data'];
        // this.countdata=result;
        this.faquerygrid = datass;
        // console.log("landlord", this.faquerygrid)
        if (datass.length>0) {
          let datapagination = result["pagination"];
          this.count=result['count']
          this.has_nextloc = datapagination.has_next;
          this.has_previousloc = datapagination.has_previous;
          this.presentpageloc = datapagination.index;
        }
        else{
          this.count=0;
          this.has_nextloc = false;
          this.has_previousloc = false;
          // this.presentpageloc = datapagination.index;
        }
        this.Loadinggrid=false
        this.SpinnerService.hide();
      }
     
    }
      else{
        this.SpinnerService.hide();
        this.Loadinggrid=false
        this.faquerygrid =[];
      }

    })
    // this.SpinnerService.hide();

}
locnextClick() {

  if (this.has_nextloc === true) {
    
    this.presentpageloc=this.presentpageloc + 1;
    this.pagesize=10
    this.fasearch('', '')

  }
}

locpreviousClick() {

  if (this.has_previousloc === true) {
    this.presentpageloc=this.presentpageloc - 1;
    this.pagesize=10
    this.fasearch('', '')

  }
}
detailsdata:any={};
Accountdetails(i){
  this.sumofcredit=0;
  this.sumofdebit=0;
  this.detailsdata=i;
  // const dialogConfig = new MatDialogConfig();
  //      dialogConfig.disableClose = true;
  //      dialogConfig.autoFocus = true;
  //      dialogConfig.position = {
  //        top:  '0'  ,
  //        // right: '0'
  //      };
  //      dialogConfig.width = '70%' ;
  //      dialogConfig.height = '500px' ;
       
  //      dialogConfig.hasBackdrop=true;
       
  //      console.log(dialogConfig);
  //    this.matdialog.open(this.opendialogdata,dialogConfig);
    console.log(i)
    this.SpinnerService.show();
    this.Faservice.accounting_ddl(i.barcode,this.has_accpage,'',i.source,i.assetdetails_id).subscribe((result) => {
      this.SpinnerService.hide();
    if(result.data!=undefined && result.data!="" && result.data!=null){
      this.SpinnerService.hide();
      this.accountDetailslist = result['data'];
      console.log(this.accountDetailslist.length);
      if(this.accountDetailslist.length>0){
        for(let i=0;i<this.accountDetailslist.length;i++){
          if(this.accountDetailslist[i]['type']== "CREDIT"){
            this.sumofcredit=this.sumofcredit+Number(this.accountDetailslist[i]['amount']);
          }
          if(this.accountDetailslist[i]['type']== "DEBIT"){
            this.sumofdebit=this.sumofdebit+Number(this.accountDetailslist[i]['amount']);
          }
        }
        let pagination:any=result['pagination'];
        this.has_accnext=pagination.has_next;
        this.has_accprevious=pagination.has_previous;
        this.has_accpage=pagination.index;

      }
      else{
        this.SpinnerService.hide();
        this.notification.showWarning('No Data ');
        this.has_accnext=false;
        this.has_accprevious=false;
        this.sumofcredit=0;
  this.sumofdebit=0;
        
      }
    }
    else{
      this.SpinnerService.hide();
      this.accountDetailslist = result['data'];
    }
      },
      (error)=>{
        this.SpinnerService.hide();
        this.sumofcredit=0;
        this.sumofdebit=0;
        this.accountDetailslist=[];
      }
      )
}
AccountdetailsExp(i){
  this.sumofcreditExp=0;
  this.sumofdebitExp=0;
 
    this.SpinnerService.show();
    this.Faservice.accounting_ddl_expence(i.id,this.has_accpage,'Expense',i.crnum).subscribe((result) => {
    if(result){
      this.SpinnerService.hide();
      this.accountDetailslistExp = result['data'];
      
      if(this.accountDetailslistExp.length>0){
        for(let i=0;i<this.accountDetailslistExp.length;i++){
          if(this.accountDetailslistExp[i]['type']== "CREDIT"){
            this.sumofcreditExp=this.sumofcreditExp+Number(this.accountDetailslistExp[i]['amount']);
          }
          if(this.accountDetailslistExp[i]['type']== "DEBIT"){
            this.sumofdebitExp=this.sumofdebitExp+Number(this.accountDetailslistExp[i]['amount']);
          }
        }
        // let pagination:any=result['pagination'];
        // this.has_accnext=pagination.has_next;
        // this.has_accprevious=pagination.has_previous;
        // this.has_accpage=pagination.index;

      }
      else{
        this.notification.showWarning('No Data ');
        // this.has_accnext=false;
        // this.has_accprevious=false;
        
      }
    }
      },
      (error)=>{
        this.SpinnerService.hide();
        this.sumofcreditExp=0;
        this.sumofdebitExp=0;
        this.accountDetailslistExp=[];
      }
      )
}
has_nextdata(){
  if(this.has_accnext){
    this.Faservice.accounting_ddl(this.detailsdata.barcode,this.has_accpage+1,'','','').subscribe((result) => {
      if(result){
        this.SpinnerService.hide();
        this.accountDetailslist = result['data'];
        
        if(this.accountDetailslist.length>0){
          for(let i=0;i<this.accountDetailslist.length;i++){
            if(this.accountDetailslist[i]['type']== "CREDIT"){
              this.sumofcredit=this.sumofcredit+Number(this.accountDetailslist[i]['amount']);
            }
            if(this.accountDetailslist[i]['type']== "DEBIT"){
              this.sumofdebit=this.sumofdebit+Number(this.accountDetailslist[i]['amount']);
            }
          }
          let pagination:any=result['pagination'];
          this.has_accnext=pagination.has_next;
          this.has_accprevious=pagination.has_previous;
          this.has_accpage=pagination.index;
  
        }
        else{
          this.notification.showWarning('No Data ');
          this.has_accnext=false;
          this.has_accprevious=false;
          
        }
      }
        },
        (error)=>{
          this.SpinnerService.hide();
          this.sumofcredit=0;
          this.sumofdebit=0;
          this.accountDetailslist=[];
        }
        )
  }
}
has_previousdata(){
  if(this.has_accprevious){
    this.Faservice.accounting_ddl(this.detailsdata.barcode,this.has_accpage-1,'','','').subscribe((result) => {
      if(result){
        this.SpinnerService.hide();
        this.accountDetailslist = result['data'];
        
        if(this.accountDetailslist.length>0){
          for(let i=0;i<this.accountDetailslist.length;i++){
            if(this.accountDetailslist[i]['type']== "CREDIT"){
              this.sumofcredit=this.sumofcredit+Number(this.accountDetailslist[i]['amount']);
            }
            if(this.accountDetailslist[i]['type']== "DEBIT"){
              this.sumofdebit=this.sumofdebit+Number(this.accountDetailslist[i]['amount']);
            }
          }
          let pagination:any=result['pagination'];
          this.has_accnext=pagination.has_next;
          this.has_accprevious=pagination.has_previous;
          this.has_accpage=pagination.index;
  
        }
        else{
          this.notification.showWarning('No Data ');
          this.has_accnext=false;
          this.has_accprevious=false;
          
        }
      }
        },
        (error)=>{
          this.SpinnerService.hide();
          this.sumofcredit=0;
          this.sumofdebit=0;
          this.accountDetailslist=[];
        }
        )
  }
}
opendialognew(){
  const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.position = {
         top:  '0'  ,
         // right: '0'
       };
       dialogConfig.width = '70%' ;
       dialogConfig.height = '700px' ;
       dialogConfig.hasBackdrop=true;
       
       console.log(dialogConfig);
     this.matdialog.open(this.opendialogdata,dialogConfig);
}
closenewdialog(){
  console.log('h');
  // this.matdialog.closeAll();
  this.refsdatapopdata.nativeElement.click();
  this.accountDetailslist=[];
}
closenewdialogExp(){
  console.log('h');
  // this.matdialog.closeAll();
  this.refsdatapopdataExp.nativeElement.click();
  this.accountDetailslistExp=[];
}
public tobucketinterface(data?:bucketdata):string | undefined{
  return data?data.name:undefined;
}
enbexpensedata(i:any){
  this.expdatalist[i]['sub_enb']=!this.expdatalist[i]['sub_enb'];
}
enbleexpense(event:any,index:any){
  if(event.currentTarget.checked){
    this.expdatalist[index]['enb']=true;
  }
  else{
    this.expdatalist[index]['enb']=false;
  }
}
exp_page(type:any){
  if(type=='pre'){
    if(this.exp_previouspage){
      this.exp_presentpage=this.exp_presentpage-1;
      this.getexpencecheckersummary();
    }
  }
  if(type=='next'){
    if(this.exp_nextpage){
      this.exp_presentpage=this.exp_presentpage+1;
      this.getexpencecheckersummary();
    }
  }
}
expandedRow: number | null = null;
toggleExpand(index: number) {
  this.expandedRow = this.expandedRow === index ? null : index;
}
prpoquery_pagination(key){
  if(key=='pre'){
    if(this.pprqueryprev){
      this.getprpofaquerysummary(this.pprquerypage-1)
    }
  }
  if(key=='next'){
    if(this.pprquerynext){
      this.getprpofaquerysummary(this.pprquerypage+1)
    }
  }
}
prpoquerysummarylist:Array<any>
pprqueryprev:boolean=false;
pprquerynext:boolean=false;
pprquerypage:number=1;
getprpofaquerysummary(page){
  let asset_id,product,branch;
  if(!(this.prpoqueryform.get('asset_id').value)){
    asset_id=''
  }else{
    asset_id=this.prpoqueryform.get('asset_id').value;
  }
  if(!(this.prpoqueryform.get('product').value)){
    product=''
  }else{
    product=this.prpoqueryform.get('product').value.id;
  }
  if(!(this.prpoqueryform.get('branch').value)){
    branch=''
  }else{
    branch=this.prpoqueryform.get('branch').value.id
  }
  this.SpinnerService.show();
  this.Faservice.prpoquerysummary(asset_id,branch,product,page).subscribe(datas=>{
    this.SpinnerService.hide()
    this.prpoquerysummarylist=datas['data'];
    console.log(this.prpoquerysummarylist)
    let pagination =datas['pagination'];
    this.pprquerypage=pagination.index;
    this.pprquerynext=pagination.has_next;
    this.pprqueryprev=pagination.has_previous;

  })
}
getAttributeKeys(obj: any): string[] {
  return Object.keys(obj);
}

getexpencecheckersummary(page=1,pageSize=10){
  let dear:any={};
  let search:string="page="+this.exp_presentpage;
  // if(this.checkersum.get('date').value !=null && this.checkersum.get('date').value!=""){
  //   let dateval=this.datepipe.transform(this.checkersum.get('date').value,"yyyy-MM-dd");
  //   search=search+'&capdate='+dateval;
  // }
  // if(this.checkersum.get('assetcat').value !=null && this.checkersum.get('assetcat').value!=""){
    
  //   search=search+'&cat='+this.asset_id;
    
  // }
 
  if(this.checkersum.get('branch').value !=null && this.checkersum.get('branch').value!=""){
    
    search=search+'&branch='+this.branch_id;
  }
  if(this.checkersum.get('crno').value !=null && this.checkersum.get('crno').value!=""){
    
    search=search+'&crno='+this.checkersum.get('crno').value;
  }
  if(this.checkersum.get('expense_code').value !=null && this.checkersum.get('expense_code').value!=""){
    
    search=search+'&expense_code='+this.checkersum.get('expense_code').value;
  }
  dear['page']=search;
  this.SpinnerService.show();
  this.Faservice.getExpenseQuerysummary(dear,pageSize).subscribe((event: HttpEvent<any>) => {
    console.log('type=',event.type);
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        console.log(Math.round(event.loaded / event.total * 100));
        
        break;
        case HttpEventType.DownloadProgress:
          console.log(Math.round(event.loaded / event.total * 100));
          
          break;
      case HttpEventType.Response:
        console.log('User successfully created!', event.body);
        let result:any=event.body;
        this.SpinnerService.hide();
        if(result.code !=undefined && result.code !="" && result.code !=null){
          this.notification.showWarning(result.code);
          this.notification.showWarning(result.description);
        }
        else{
          this.expdatalist=result['data'];
          let pagination:any=result['pagination'];
          this.exp_presentpage=pagination.index;
          this.exp_previouspage=pagination.has_previous;
          this.exp_nextpage=pagination.has_next;
        }
      
       //add whatever thing you have to do here. 
        setTimeout(() => {
         console.log("Done");
        }, 1500);
  
    }
  })
}
tabClick(event:any){
  console.log(event);
  if(event.tab.textLabel=='Asset Query - AQ'){
    console.log(1)
  }
  else if(event.tab.textLabel=='Expense Query - EQ'){
    this.getexpencecheckersummary();
  }
  else if(event.tab.textLabel=='Asset Query - PRPO'){
    this.getprpofaquerysummary(1)
  }
}
checket_asset(data){
  this.asset_id=data.id;

}
checker_branchs(data){
  this.branch_id=data.id;
};
resets(){
  this.checkersum.get('date').patchValue('');
  this.checkersum.get('assetcat').patchValue('');
  this.checkersum.get('branch').patchValue("");
  this.checkersum.get('crno').patchValue('');
  this.checkersum.get('expense_code').patchValue('');
  this.getexpencecheckersummary();
}
resetpprquery(){
  this.prpoqueryform.reset('');
  this.getprpofaquerysummary(1)
}
public displayFnproduct(productval?: Product): string | undefined {
  return productval ? productval.name : undefined;
}
autocompleteScrollProduct(){

  setTimeout(() => {
    if (
      this.Productname &&
      this.autocompleteTrigger &&
      this.Productname.panel
    ) {
      fromEvent(this.Productname.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.Productname.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.Productname.panel.nativeElement.scrollTop;
          const scrollHeight = this.Productname.panel.nativeElement.scrollHeight;
          const elementHeight = this.Productname.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.product_hasnext === true) {
              this.Faservice.getassetproductdata(this.Productinput.nativeElement.value,this.product_presentpage+1)
                .subscribe((data: any[]) => {
                  let datas = data["data"];
                  let datapagination = data["pagination"];
                  this.productlist = this.productlist.concat(datas);
                  if (this.productlist.length > 0) {
                    this.product_hasnext = datapagination.has_next;
                    this.product_hasprevious = datapagination.has_previous;
                    this.product_presentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

getproduct(){
  this.Faservice.getassetproductdata('',1).subscribe(result=>{
    if(result?.code!=null && result?.code!="" && result?.code!=undefined){
      this.notification.showWarning(result?.code);
      this.notification.showWarning(result?.description);
    }
    else{
    this.productlist=result['data'];
    let pagination=result['pagination'];
    if(this.productlist.length>0){
      this.product_hasnext=pagination.has_next;
      this.product_hasprevious=pagination.has_previous;
      this.product_presentpage=pagination.index;
    }
    }
  },(error:HttpErrorResponse)=>{
    this.notification.showWarning(error.status+error.message);
  }
  )
}
reset(){
  this.fasearchform.reset('');
  // this.filteredOptions.next([]);
  this.myControl.reset('');
  this.count_search='1';
  this.cp_date=false;
  this.transfer_branch=false;
  this.asset_enddate=false;
  this.ins_date=false;
  this.asset_value=false;
  this.asset_leasedate=false;
  this.asset_source=false;
  this.dep_hold_enter=false;
  this.vendor_name_enter=false;
  this.invoice_amt_enter=false;
  this.mep_no_enter=false;
  this.invoice_no_enter=false;
  this.po_no_enter=false;
  this.asset_value=false;
    
}

approval_history(id){
  this.SpinnerService.show();
  this.Faservice.approvalHistory(id?.barcode).subscribe(result=>{
    this.SpinnerService.hide();
    if (result?.code !=null && result?.code !='' && result?.code != undefined){
      this.toastr.warning(result?.code);
      this.toastr.warning(result?.description);
    }
    else{
      this.appvl_history=result['data']
      this.appvl_history['barcode']=id?.barcode;
    }

  },(error:HttpErrorResponse)=>{
    this.SpinnerService.hide();
    this.toastr.warning(error.status+error.message);
  })
}
closedialogapl_history(){
  this.refsdatapopdataAPvl.nativeElement.click();
  this.apcategoryList=[];
}
}