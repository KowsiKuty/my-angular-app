import { DatePipe, formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { NotificationService } from 'src/app/service/notification.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faservice } from '../fa.service';
import { MatCheckbox } from '@angular/material/checkbox';
const isSkipLocationChange = environment.isSkipLocationChange

export interface assetgrplists {
  id: string;
  name: string;
}
export interface assetgrpsub {
  id: string;
  name: string;
  glno:string
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
export interface Branch {
  id: string;
  name: string;
  code:number;
}
export interface HSN {
  id: string;
  name: string;
  code:number;
  igstrate:number;
}
export interface Asset{
  id:string;
  subcatname:string;
}
export interface Assetnew{
  id:string;
  subcatname:string;
  glno:string;
}
export interface AssetDetails{
  id:string;
  barcode:string
}
export interface sales{
  id:string;
  name:string;
}
export interface state{
  name:string;
  id:string;
}
@Component({
  selector: 'app-assetsaleadd',
  templateUrl: './assetsaleadd.component.html',
  styleUrls: ['./assetsaleadd.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class AssetsaleaddComponent implements OnInit,AfterViewInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  @HostListener('window:scroll')

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('HSNInput') hsnInputRef: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  @ViewChild('hsncode') matAutocompletehsn: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('CustomerValueInput') CustomerValueInput: any;
  @ViewChild('CustomerAutoCompleteref') CustomerAutoCompleteref: MatAutocomplete;

  @ViewChild('CustomerStateInput') CustomerStateInput: any;
  @ViewChild('apcategory') matapAutocomplete: MatAutocomplete;
  @ViewChild('inputap') Inputap: any;

  @ViewChild('apsubcategory') matapsubAutocomplete: MatAutocomplete;
  @ViewChild('inputapsub') Inputapsub: any;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
  @ViewChild('CustomerStateAutoCompleteref') matStatelist:MatAutocomplete;
  salesSummaryAdd: FormGroup;
  hsntable:FormGroup;
  searchData: any={};
  @ViewChild('closebutton2') closebutton;
  @ViewChild('myCheckbox') private myCheckbox: MatCheckbox;
  @ViewChild('refe') ref;
  selectPage:number=10;
  // customarDetails:FormGroup;
  employeeList: Array<Branch>;
  hsnList: Array<HSN>;
  category:Array<Asset>
  CustomerValueDetails:Array<sales>
  CustomerValueState:Array<state>=null
  assetDetails:Array<AssetDetails>
  isLoading: boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  has_next_hsn = true;
  has_previous_hsn = true;
  currentpage_hsn: number = 1;
  presentpage: number = 1;
  isPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  assetsalesValue: any;
  data: any;
  newAssetSalesValue=[]
  newvalue = []
  sale_date=[]
  min_Date
  identificationData: any;
  reasons:any
  date: any = "";
  dates: string;
  minDate: any;
  today = new Date();
  sale_rate:number;
  CustomerValue= new FormControl()
  customerState=new FormControl()
  customerid: any;
  closeResult: string;
  customer_Name:any;
  has_statenxt:boolean=true;
  has_statepre:boolean=false;
  has_statepage:number=1;
  reg:any=new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
      gstno:any;
      contactno:any;
      customertype:any;
      customeraddress:any; 
      customercode:any;
  CustomerDetails: any=[];
  sateid: any;
  selectedsale: any;
  SaleNote=1;
  invoice=0;
  salesSummaryAddform:FormGroup;
  popupRef: Promise<void>;
  asset: any;
  btndisable:boolean=false;
  btndisablepopup:boolean=false;
  expform:any=FormGroup;
  as_apcategory:Array<any>=[];
  as_apsubcategory:Array<any>=[];
has_nextcom_ap:boolean=true
  has_previouscom :boolean=true;
  currentpagecom_ap = 1;
  has_nextcom_apsub :boolean=true;
  // has_previouscom :boolean=true;
  currentpagecom_apsub:number=1;
  overallCheck:boolean=false;
  intermediateCheck:boolean=false;
 hsnvalue = new FormControl('');
  selectedhsndata:any =[];
  hsnclicked: boolean = false;

       constructor(private Faservice:faservice,private toastr: ToastrService,private modalService: NgbModal,private faService:Fa3Service,private formBuilder:FormBuilder,private datePipe:DatePipe,private router:Router,private notification:NotificationService,private spinner:NgxSpinnerService
       ) { 
        // this.invoice = 1;
       }

  ngOnInit(): void {
    this.expform=this.formBuilder.group({
      'cat':new FormControl(''),
      'subcat':new FormControl(''),
      'glno':new FormControl(''),
      'amount':new FormControl(''),
      
    });
    this.expform.get('cat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetcategorydata_sale(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.as_apcategory = datas;
        // console.log('new wow=',results);
        // for(let i=0;i<datas.length;i++){
        //     this.as_apcategory.push(datas[i])
        //     console.log(datas[i])
        // }
        // console.log("apcategory=", datas)

      });
    this.salesSummaryAdd = this.formBuilder.group({
      category:[''],
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:[''],
      'crno':new FormControl('')
    });
    this.hsntable = this.formBuilder.group({  
      'hsn':new FormControl(''),
    });
    this.salesSummaryAddform = this.formBuilder.group({
      category:[''],
      glno:[''],
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:[''],
      'crno':new FormControl('')
    });
    this.assetsalesadd();

    this.hsnvalue.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => {
        return this.faService.getHSNSearchFilter(value , 1, 1)
          .pipe(finalize(() => this.isLoading = false));
      })
    )
    .subscribe((results: any[]) => {
      const datas = results["data"];
      this.hsnList = datas;
    });
   
  }
 
  assetsalesadd(pageNumber=1, pageSize=this.selectPage){
    this.newvalue=[];
    this.sale_date=[];
    this.searchData={};
    this.intermediateCheck=false;
    this.overallCheck=false;
    if(this.salesSummaryAdd){
      let assetsaleadd=this.salesSummaryAdd.value
      if((assetsaleadd.capdate_Value != null || assetsaleadd.capdate_Value != '')  ){
        var tranferdate=this.datePipe.transform(assetsaleadd.capdate_Value, 'yyyy-MM-dd')
        this.searchData['capdate']=tranferdate
      }
      if(assetsaleadd.asset_value !=null ||assetsaleadd.asset_value !=''){
          this.searchData['assetdetails_value'] = assetsaleadd.asset_value;
  
      }
      if(assetsaleadd.category!=undefined  && assetsaleadd.category!=null && assetsaleadd.category.id!=undefined){
        this.searchData['assetcat_id'] = assetsaleadd.category.id;
      }
      
      // this.searchData.assetdetails_id = assetsaleadd.barcode.id;
      if(assetsaleadd.barcode!="" && assetsaleadd.barcode!=undefined && assetsaleadd.barcode!=null){
        this.searchData['barcode'] = assetsaleadd.barcode;
      }
      if(assetsaleadd.branch_name!=undefined && assetsaleadd.branch_name!=null && assetsaleadd.branch_name.id!=undefined && assetsaleadd.branch_name.id!=null && assetsaleadd.branch_name.id!=""){

        this.searchData['branch_id'] = assetsaleadd.branch_name.id;
      }
      if(assetsaleadd.crno!=undefined && assetsaleadd.crno!=null && assetsaleadd.crno!=""){

        this.searchData['crno'] = assetsaleadd.crno;
      }

      
      // if(assetsaleadd.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = assetsaleadd.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = assetsaleadd.barcode;
    
      // }
    
   for (let i in this.searchData) {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }
     
      
    }
    
  
    else{
      this.searchData={}
    }
    this.spinner.show();
       this.faService.assetsalesadd(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.notification.showWarning(result['code']);
        this.notification.showWarning(result['description']);

      }
      else{
        this.assetsalesValue = result['data']
        this.data = result['data'];
        for(let i=0;i<this.assetsalesValue.length;i++){
          this.assetsalesValue[i]['con']=false;
        }
        let dataPagination = result['pagination'];
        if (this.assetsalesValue.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isPagination = true;
        } if (this.assetsalesValue <= 0) {
          this.isPagination = false;
        }
      }
      
      
    },
    (error)=>{
      this.spinner.hide();
    }
    )
}
clearSearch(){
     
  this.salesSummaryAdd.controls['capdate_Value'].reset('');
  this.salesSummaryAdd.controls['category'].reset('');
  this.salesSummaryAdd.controls['asset_value'].reset('');
  this.salesSummaryAdd.controls['barcode'].reset('');
  this.salesSummaryAdd.controls['branch_name'].reset('');
  this.salesSummaryAdd.controls['crno'].reset('');
  this.assetsalesadd();
}
private getasset_category(keyvalue) {
  this.faService.getAssetSearchFilter(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.category = datas;
     
    })
}
datafetchglno(data:any){
  this.salesSummaryAddform.get('glno').patchValue(data.subcategory_id.glno);
}
public displayFnAssest(Asset?: Asset): string | undefined {
  return Asset ? Asset.subcatname : undefined;
}
public displayFnAssest_new(Asset?: Assetnew): string | undefined {
  return Asset ? Asset.subcatname : undefined;
}
  asset_category(){
    let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.salesSummaryAdd.get('category').valueChanges
        .pipe(
          startWith(""),
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
         
          switchMap(value => this.faService.getAssetSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;
  
        })
  
  }
  asset_category_new(){
    let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.salesSummaryAddform.get('category').valueChanges
        .pipe(
          startWith(""),
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
         
          switchMap(value => this.faService.getAssetSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;
  
        })
  
  }


  autocompleteScrollcategory() {
    setTimeout(() => {
      if (
        this.categoryAutoComplete &&
        this.autocompleteTrigger &&
        this.categoryAutoComplete.panel
      ) {
        fromEvent(this.categoryAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.categoryAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.categoryAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.categoryAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.categoryAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.faService.getEmployeeBranchSearchFilter(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
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

// end asset _category



// branch

onFocusOutEvent(event){
  

}
valuechange_hsn(event){
  this.hsnvalue.setValue(event);
  // this.hsnclick('');
  }
  Branch(){
    let keyvalue: String = "";
      this.getEmployee(keyvalue);
      
      this.salesSummaryAdd.get('branch_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
          switchMap(value => this.faService.getEmployeeBranchSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeeList = datas;
  
        })
  
      }
    
      private getEmployee(keyvalue) {
        this.faService.getEmployeeBranchSearchFilter(keyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.employeeList = datas;
          })
      }

      public displayFn(branch?: Branch): string | undefined {
        return branch ? branch.name : undefined;
      }
    
      
      autocompleteScroll() {
        setTimeout(() => {
          if (
            this.matAutocomplete &&
            this.autocompleteTrigger &&
            this.matAutocomplete.panel
          ) {
            fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getEmployeeBranchSearchFilter(this.BranchInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.employeeList = this.employeeList.concat(datas);
                        if (this.employeeList.length >= 0) {
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
   
hsnclick(i) {
  const keyvalue: string = "";

  this.assetsalesValue[i].hsn_details = '';
  if(this.assetsalesValue[i]?.con == true) {
    this.assetsalesValue[i].con = false;
    for (let j=0;j<this.newvalue.length;j++){
      if(this.newvalue[j].assetdetails_id == this.assetsalesValue[i].assetdtls_id){
          this.newvalue.splice(j,1);
      }
    }
    
  }

  // Initial load
  // this.getHSN(keyvalue);
    this.faService.getHSNSearchFilter(keyvalue,1,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
    })

  // Reactive form control (assuming 'hsn' is already initialized in FormGroup)
  // this.salesSummaryAdd.get('hsn').valueChanges
  //   .pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //     }),
  //     switchMap(value => {
  //       // If user presses backspace or types, fetch filtered data
  //       return this.faService.getHSNSearchFilter(value?.code || value || '', 1, 1)
  //         .pipe(finalize(() => this.isLoading = false));
  //     })
  //   )
    // .subscribe((results: any[]) => {
    //   const datas = results["data"];
    //   this.hsnList = datas;
    // });
}

hsnID:any
onHSNSelected(data,i) {
  // this.selectedhsndata.push(data);
  this.hsnclicked = true;
  // const selectedHSN = this.hsnList.find(item => item.code === data.hsn_details.code);
  // if (selectedHSN) {
  console.log("selected hsn details",data);
  console.log("selected hsn index",i);
  // this.hsnID = data.id;
    this.assetsalesValue[i].hsn_details.id = data?.id;
    this.assetsalesValue[i].hsn_details.sgstrate = data?.sgstrate;
   this.assetsalesValue[i].hsn_details.cgstrate = data?.cgstrate;
    this.assetsalesValue[i].hsn_details.igstrate = data?.igstrate;


  // } else {
  //   data.hsn_details.sgstrate = null;
  //   data.hsn_details.cgstrate = null;
  //   data.hsn_details.igstrate = null;
  // }
}



  private getHSN(keyvalue) {
    this.faService.getHSNSearchFilter(keyvalue,1,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
    })
  }

      public displayFnHSN(hsn?: HSN): string | undefined {
        return hsn ? `${hsn.code} - ${hsn.igstrate}%` : '';      }
searchHSN(searchText: string) {
    this.isLoading = true;
    this.faService.getHSNSearchFilter(searchText, 1, 1).subscribe((results: any[]) => {
      this.isLoading = false;
      this.hsnList = results["data"] || [];
      const pagination = results["pagination"];
      this.has_next_hsn = pagination.has_next;
      this.has_previous_hsn = pagination.has_previous;
      this.currentpage_hsn = pagination.index;
    });
  }

  autocompleteScrollhsn() {
    setTimeout(() => {
      if (
        this.matAutocompletehsn &&
        this.autocompleteTrigger &&
        this.matAutocompletehsn.panel
      ) {
        fromEvent(this.matAutocompletehsn.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletehsn.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletehsn.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletehsn.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletehsn.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;

            if (atBottom && this.has_next_hsn) {
              this.faService.getHSNSearchFilter(this.hsnInputRef.nativeElement.value, this.currentpage_hsn + 1, 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.hsnList = this.hsnList.concat(datas);
                  this.has_next_hsn = datapagination.has_next;
                  this.has_previous_hsn = datapagination.has_previous;
                  this.currentpage_hsn = datapagination.index;
                });
            }
          });
      }
    });
  }

// end branch

// assest barcode

public displayFnAssestId(AssetDetails?: AssetDetails): string | undefined {
  return AssetDetails ? AssetDetails.barcode : undefined;
}

private getassetbarcode(keyvalue) {
  this.faService.getAssetIdSearchFilter(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.assetDetails = datas;
      // assetDetails:Array<AssetDetails>
    })
}

Assetbarcode(){
  let keyvalue: String = "";
      this.getassetbarcode(keyvalue);
      
      this.salesSummaryAdd.get('barcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            
  
          }),
          switchMap(value => this.faService.getAssetIdSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.assetDetails = datas;
  
        })
  
      }

      autocompleteScrollAssetId(){
        setTimeout(() => {
          if (
            this.AssetAutoComplete &&
            this.autocompleteTrigger &&
            this.AssetAutoComplete.panel
          ) {
            fromEvent(this.AssetAutoComplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.AssetAutoComplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.AssetAutoComplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.AssetAutoComplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.AssetAutoComplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getAssetIdSearchFilter(this.AssetInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.assetDetails = this.assetDetails.concat(datas);
                        if (this.assetDetails.length >= 0) {
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


      decimalFilter(event: any) {
        const reg = /^-?\d*(\.\d{0,2})?$/;
        let input = event.target.value + String.fromCharCode(event.charCode);
     
        if (!reg.test(input)) {
            event.preventDefault();
        }
     }
     nextClick() {
      if (this.has_next === true) {
  
        this.currentpage = this.presentpage + 1
        this.assetsalesadd(this.presentpage + 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
  
    }
  
    previousClick() {
      if (this.has_previous === true) {
  
        this.currentpage = this.presentpage - 1
        this.assetsalesadd(this.presentpage - 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
  
    }


    onCheckboxChange(event, value, index) {
      if (event.currentTarget.checked) {
        // for(let i=0;i<this.assetsalesValue.length;i++){
        //   if(this.assetsalesValue[i]['assetdetails_id']==value.assetdetails_id){
        //     this.assetsalesValue[i]['con']=true;
        //   }
        //   else{
        //     this.assetsalesValue[i]['con']=false;
        //   }
        // }
          this.assetsalesValue[index]['con']=true;
          this.newvalue.push({
            'assetdetails_id': value['assetdtls_id'],
            "branch_id": value['branch_id'],
            "sale_rate":value['sale_rate'],
            "hsn_id":value.hsn_details['id'],
            "hsn_code":value.hsn_details['code'],
            "sgst_rate":value.hsn_details['sgstrate'],
            "cgst_rate":value.hsn_details['cgstrate'],
            "igst_rate":value.hsn_details['igstrate']  
          });
          
          this.sale_date.push({
            "date":value['capdate']
          })
        
      
        // if(this.sale_rate===undefined){
        //   this.toastr.error("please give the sale rate ");
        //   
        //   return false;
        // }
        if(this.newvalue.length==0){
          this.intermediateCheck=false;
          this.overallCheck=false;
        }
        else if(this.newvalue.length==this.assetsalesValue.length){
          this.overallCheck=true;
          this.intermediateCheck=false;
          
        }
        else if(this.newvalue.length!=this.assetsalesValue.length){
          this.overallCheck=false;
          this.intermediateCheck=true;
         
        }
        
      }
      else {
        let value_ind:any=this.newvalue.findIndex((data:any)=>data.assetdetails_id== value['assetdtls_id']);
        this.newvalue.splice(value_ind,1);
        const date_index= this.sale_date.findIndex(date=>date.date == value.capdate);
        this.sale_date.splice(date_index,1);
        this.assetsalesValue[index]['con']=false;
        if(this.newvalue.length==0){
          this.intermediateCheck=false;
          this.overallCheck=false;
        }
        else if(this.newvalue.length==this.assetsalesValue.length){
          this.overallCheck=true;
          this.intermediateCheck=false;
          
        }
        else if(this.newvalue.length!=this.assetsalesValue.length){
          this.overallCheck=false;
          this.intermediateCheck=true;
         
        }
        // for(let i=0;i<this.assetsalesValue.length;i++){
        //   if(this.assetsalesValue[i]['id']==value.id){
        //     this.assetsalesValue[i]['con']=false;
        //   }
        // }
    
        // const index = this.newvalue.findIndex(list => list.assetdetails_id == value.assetdtls_id);//Find the index of stored id
        // this.newvalue.splice(index, 1);
      }
      
      
      
     
    }
    mindatefind(){
      this.min_Date=new Date(Math.max.apply(null, this.sale_date.map((e:any) => new Date(e.date))))
      // this.min_Date=new Date(Math.max.apply(...this.catalog_date.map((x:any) => new Date(x.date))));
  
      // for (let mindate of this.sale_date)
      //     {
      //       let datemax
      //      this.dates = this.datePipe.transform(this.minDate, 'yyyy-MM-dd')
      //       if(mindate.date>this.dates ||this.minDate===undefined){
      //         this.min_Date = new Date(mindate.date)
      //         datemax=this.min_Date
      //       
      //       
      //       
      //       }
      //     }
    }


    private getAssetCustomer(keyvalue) {
      this.faService.getCustomerFilter(keyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.CustomerValueDetails = datas;
         
        })
    }
    
    public displayFnCustomerAssest(sales?: sales): string | undefined {
      return sales ? sales.name : undefined;
    }
    assetCustomer(){
        let keyvalue: String = "";
          this.getAssetCustomer(keyvalue);
          this.CustomerValue.valueChanges
            .pipe(
              startWith(""),
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
               
      
              }),
             
              switchMap(value => this.faService.getCustomerFilter(value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                    
                    this.customerid=value.id
                    
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.CustomerValueDetails = datas;
      
            })
      
      }
    
    
      autocompleteScrollCustomerValue() {
        setTimeout(() => {
          if (
            this.CustomerAutoCompleteref &&
            this.autocompleteTrigger &&
            this.CustomerAutoCompleteref.panel
          ) {
            fromEvent(this.CustomerAutoCompleteref.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.CustomerAutoCompleteref.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.CustomerAutoCompleteref.panel.nativeElement.scrollTop;
                const scrollHeight = this.CustomerAutoCompleteref.panel.nativeElement.scrollHeight;
                const elementHeight = this.CustomerAutoCompleteref.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getEmployeeBranchSearchFilter(this.CustomerValueInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.employeeList = this.employeeList.concat(datas);
                        if (this.employeeList.length >= 0) {
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
      autocompleteScrollCustomerState() {
        setTimeout(() => {
          if (
            this.matStatelist &&
            this.autocompleteTrigger &&
            this.matStatelist.panel
          ) {
            fromEvent(this.matStatelist.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matStatelist.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matStatelist.panel.nativeElement.scrollTop;
                const scrollHeight = this.matStatelist.panel.nativeElement.scrollHeight;
                const elementHeight = this.matStatelist.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if ( this.has_statenxt === true) {
                    this.faService.getCustomerStateFilter(this.has_statepage+1,this.CustomerStateInput.nativeElement.value)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.CustomerValueState = this.CustomerValueState.concat(datas);
                        if (this.CustomerValueState.length >= 0) {
                          this.has_statenxt = datapagination.has_next;
                          this.has_statepre = datapagination.has_previous;
                          this.has_statepage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      onChangeSaleValue($event) {
        
        this.selectedsale = $event.value;
      }
    // end asset _Customer
    
    submit(){
      console.log("submitted value ------>",this.newvalue);
     
      let formatdate=this.datePipe.transform(this.date, 'yyyy-MM-dd')
      if (this.newvalue.length == 0) {
        this.toastr.error('Please Select Any checkbox ');
        return false;
      } 
      if(this.reasons===undefined){
        this.toastr.error('Please Give The Sale Reason');
        return false; 
      }
      if(this.selectedsale===undefined || this.selectedsale ==='' || this.selectedsale=== null){
        this.toastr.error('Please Select the Invoice or Sale Note')
        return false;
      }
      if(this.customerid===undefined){
        this.toastr.error('please Select the  Customer Name')
        return false;
      }
    if(formatdate===null){
      this.toastr.error('please Choose the Sale Date')
      return false;
    }
      let dataConfirm = confirm("Are you sure, Do you want to SUBMIT?")
    if (dataConfirm == false) {
      return false;
    }
  
    let data_min:any=(((this.newvalue.length*15000)/1000)/60).toFixed(2);
    this.toastr.warning('Wait for '+(data_min).toString()+ 'minutes','',{timeOut:(this.newvalue.length*15000),progressBar:true,progressAnimation:'decreasing'});
      this.spinner.show();
      this.btndisable=true;
      this.faService.assetchange(this.newvalue, this.reasons, formatdate,this.customerid,this.selectedsale,this.expform.value.subcat.id).subscribe(res => {
        if(res.code==='INVALID_DATA'){
          this.btndisable=false;
          this.toastr.error(res['code']);
          this.toastr.error(res['description']);
          this.spinner.hide();
        }else if(res.status==='success'){
          
        this.notification.showSuccess("Successfully Updated!...")
          this.spinner.hide();
        this.btndisable=false;
        this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
        }
    },
    (error)=>{
      this.btndisable=false;
      this.spinner.hide();
    }
      )
    }

    private getAssetCustomerState(keyvalue) {
    
      this.faService.getCustomerStateFilter(1,'')
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.CustomerValueState = datas;
         
        })
    }
    
    public displayFnState(state?: state): string | undefined {
      return state ? state.name : undefined;
    }
    CustomerState(){
        let keyvalue: String = "";
          this.getAssetCustomerState(keyvalue);
          this.customerState.valueChanges
            .pipe(
              startWith(""),
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
               
      
              }),
             
              switchMap(value => this.faService.getCustomerStateFilter(1,value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                    
                    this.sateid=value.id
                    
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.CustomerValueState = datas;
      
            })
      
      }
    
    

    onCancelClick(){
      this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
    }
    
    addCustomer(){
      if(this.customer_Name===undefined || this.customer_Name==='' ){
        this.toastr.error('Please Enter The Name');
        return false;
      }
      if(this.reg.test(this.gstno)){
        console.log('exe');
      }
      else{
        this.toastr.warning('Please Check GST No');
        this.toastr.warning('It Must Contain 15 Digits:')
        return false;
      }
      
     
      if(this.gstno===undefined || this.gstno===''){
        this.toastr.error('Please Enter The Gst No');
        return false;
      }
      if(this.customeraddress===undefined || this.customeraddress===''){
        this.toastr.error('Please Enter The Address')
        return false;
      }
      if(this.customerState.value.id===undefined || this.customerState.value.id ==='' || this.customerState.value.id ===null || this.customerState.value.id ===""){
        this.toastr.error('Please Choose The Sate');
        return false;
      }
      if(this.contactno==undefined || this.contactno=='' || this.contactno==null){
        this.notification.showError('Please Enter The Contact No');
        return false;
      }
     
     
      
      
      this.CustomerDetails=({"customer_name":this.customer_Name,"customer_GSTNO":this.gstno,"address":{"line1":this.customeraddress,"state_id":this.sateid},
      "contact":{"mobile": this.contactno}})
      
      this.btndisablepopup=true;
       this.spinner.show();
        this.faService.assetsaleadd(this.CustomerDetails).subscribe(res => {
          // this.show = !this.show;
          console.log(res)
          if(res['id'] !=undefined && res['id'] !=null && res['id']!=''){
            this.toastr.success('Succesfully Created');
            this.btndisablepopup=false;
            this.closebutton.nativeElement.click();
            this.reset();
            this.spinner.hide();
          }
          else{
            this.btndisablepopup=false;
            this.reset();
            this.spinner.hide();
          }
          // this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
        },  
        (error)=>{
          this.btndisablepopup=false;
          this.spinner.hide();

        }
        )}
        public onCancel() {
          this.reset()
          this.closebutton.nativeElement.click();
          // this.reset()
        }
        reset(){
          this.customer_Name=''
        this.gstno='';
        this.contactno='';
        this.customertype='';
        this.customeraddress=''; 
        this.sateid=''
        // this.CustomerValueState.values.name;
        this.CustomerStateInput.nativeElement.value=''
        
        }
        numberOnly(event): boolean {
          const charCode = (event.which) ? event.which : event.keyCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123)) {
            return false;
          }
          return true;
        }
        numberOnlys(event): boolean {
          const charCode = (event.which) ? event.which : event.keyCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
            return false;
          }
          return true;
        }
        public displayastgrp(autoapcat?: assetgrplists): string | undefined {
          return autoapcat ? autoapcat.name : undefined;
        }
        public displayastsub(autoapcat?: assetgrpsub): string | undefined {
          return autoapcat ? autoapcat.name : undefined;
        }
        assetgrps_apcategory_expsubcat(){
          if(this.expform.value.cat.id ==undefined || this.expform.value.cat==undefined || this.expform.value.cat==null || this.expform.value.cat==''){
            this.toastr.warning('Please Select The Invoice Category');
            return false;
          }
          this.expform.get('subcat').valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              this.isLoading=true;
            }),
            switchMap((value:string) => this.Faservice.getassetsubcategoryccdata(value,this.expform.value.cat.id)
            .pipe(
              finalize(() => {
                this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.as_apsubcategory = datas;
              // console.log("apcategory", results)
      
            });
          }

          autocompletecommodityScroll_ap() {
            setTimeout(() => {
              if (
                this.matapAutocomplete &&
                this.autocompleteTrigger &&
                this.matapAutocomplete.panel
              ) {
                fromEvent(this.matapAutocomplete.panel.nativeElement, 'scroll')
                  .pipe(
                    map(x => this.matapAutocomplete.panel.nativeElement.scrollTop),
                    takeUntil(this.autocompleteTrigger.panelClosingActions)
                  )
                  .subscribe(x => {
                    const scrollTop = this.matapAutocomplete.panel.nativeElement.scrollTop;
                    const scrollHeight = this.matapAutocomplete.panel.nativeElement.scrollHeight;
                    const elementHeight = this.matapAutocomplete.panel.nativeElement.clientHeight;
                    const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                    if (atBottom) {
                      if (this.has_nextcom_ap === true) {
                        this.Faservice.getassetcategorydata( this.Inputap.nativeElement.value, this.currentpagecom_ap+1 )
                          .subscribe((results: any[]) => {
                            let datas = results["data"];
                            // console.log('branch_branch=',results)
                            let datapagination = results["pagination"];
                            this.as_apcategory = this.as_apcategory.concat(datas);
                            if (this.as_apcategory.length >= 0) {
                              this.has_nextcom_ap = datapagination.has_next;
                              this.has_previouscom = datapagination.has_previous;
                              this.currentpagecom_ap = datapagination.index;
                            }
                          })
                      }
                    }
                  });
              }
            });
          }
          autocompletecommodityScroll_apsub() {
            setTimeout(() => {
              if (
                this.matapsubAutocomplete &&
                this.autocompleteTrigger &&
                this.matapsubAutocomplete.panel
              ) {
                fromEvent(this.matapsubAutocomplete.panel.nativeElement, 'scroll')
                  .pipe(
                    map(x => this.matapsubAutocomplete.panel.nativeElement.scrollTop),
                    takeUntil(this.autocompleteTrigger.panelClosingActions)
                  )
                  .subscribe(x => {
                    const scrollTop = this.matapsubAutocomplete.panel.nativeElement.scrollTop;
                    const scrollHeight = this.matapsubAutocomplete.panel.nativeElement.scrollHeight;
                    const elementHeight = this.matapsubAutocomplete.panel.nativeElement.clientHeight;
                    const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                    if (atBottom) {
                      if (this.has_nextcom_apsub === true) {
                        this.Faservice.getassetsubcategoryccdata( this.Inputapsub.nativeElement.value, this.currentpagecom_apsub+1 )
                          .subscribe((results: any[]) => {
                            let datas = results["data"];
                            // console.log('branch_branch=',results)
                            let datapagination = results["pagination"];
                            this.as_apsubcategory = this.as_apsubcategory.concat(datas);
                            if (this.as_apsubcategory.length >= 0) {
                              this.has_nextcom_apsub = datapagination.has_next;
                              this.has_previouscom = datapagination.has_previous;
                              this.currentpagecom_apsub = datapagination.index;
                            }
                          })
                      }
                    }
                  });
              }
            });
          }
          getdata(data){
            console.log('joo');
            this.expform.get('glno').patchValue(data['glno']);
          }     
          selectall(event:any){
            console.log(event.checked);
            if (event.checked) {
              this.newvalue=[];
              for(let i=0;i<this.assetsalesValue.length;i++){
                if(this.assetsalesValue[i]['sale_rate']!=undefined && this.assetsalesValue[i]['sale_rate']!=null && this.assetsalesValue[i]['sale_rate']!=""){
                  let value:any=this.assetsalesValue[i];
                  this.assetsalesValue[i]['con']=true;
                  this.newvalue.push({
          
                    'assetdetails_id': value['assetdtls_id'],
            "branch_id": value['branch_id'],
            "sale_rate":value['sale_rate'],
            "hsn_code":value.hsn_details['code'],
            "hsn_id":value.hsn_details['id'],
            "sgst_rate":value.hsn_details['sgstrate'],
            "cgst_rate":value.hsn_details['cgstrate'],
            "igst_rate":value.hsn_details['igstrate'] 
            
                  });
                }
                  
                
               
              };
              this.intermediateCheck=true;
              if(this.newvalue.length==0){
                
                this.notification.showWarning("Please Enter TheSale Rate  Least One Data..");
                this.overallCheck=false;
                // this.intermediateCheck=true;
                this.intermediateCheck=false;
                this.myCheckbox.checked = false;
                // return false;
              }
              else if(this.assetsalesValue.length!=this.newvalue.length){
                this.overallCheck=true;
                
                this.intermediateCheck=true;
              }
              else if (this.assetsalesValue.length==this.newvalue.length){
                this.overallCheck=true;
                this.intermediateCheck=false;
              }
            } 
            else {
              this.newvalue=[];
              for(let i=0;i<this.assetsalesValue.length;i++){
                if(this.assetsalesValue[i]['sale_rate']!=undefined && this.assetsalesValue[i]['sale_rate']!=null && this.assetsalesValue[i]['sale_rate']!=""){
                  this.assetsalesValue[i]['con']=false;
                }
                 
                
               
              }
              if(this.newvalue.length==0){
                this.myCheckbox.checked = false;
                this.overallCheck=false;
                this.intermediateCheck=false;
              }
              else if(this.assetsalesValue.length!=this.newvalue.length){
                this.overallCheck=true;
                this.intermediateCheck=true;
              }
              else if (this.assetsalesValue.length==this.newvalue.length){
                this.overallCheck=true;
                this.intermediateCheck=false;
              }
          }
          
          console.log("newvalue=>",this.newvalue);
         
          // console.log('branchshort=>',this.branchshort);
          //    console.log('transfer_date=>',this.transfer_date);
          
          }
          paginationChange(event:any){
            console.log(event);
            console.log(this.selectPage);
            this.assetsalesadd(this.presentpage, this.selectPage);
          }
          ngAfterViewInit(): void {
            this.assetsalesValue=this.assetsalesValue;
          
  }   
}