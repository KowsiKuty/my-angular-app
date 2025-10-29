import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { faservice } from '../fa.service';
import { NotificationService } from 'src/app/service/notification.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
const isSkipLocationChange = environment.isSkipLocationChange

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
export interface Asset{
  id:string;
  subcatname:string;
}
export interface AssetDetails{
  id:string;
  barcode:string
}
@Component({
  selector: 'app-assetsalesummary',
  templateUrl: './assetsalesummary.component.html',
  styleUrls: ['./assetsalesummary.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class AssetsalesummaryComponent implements OnInit {
  searchData: any={};
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
  @ViewChild('closebutton2') closebutton;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  accountDetailslist:Array<any>=[];
has_accnext:boolean=false;
has_accprevious:boolean=false;
has_accpage:number=1;
sumofcredit:number=0;
sumofdebit:number=0;
detailsdata:any={};
  salesSummarySearch: FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  assetDetails:Array<AssetDetails>
  isLoading: boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  identificationData:any
  assetsalesValue: any;
  data: any;
  newAssetSalesValue: any=[];
  pdfSrc: any;
  id: any='';
  reassons:any;
  downloadUrl: string;
  select:Date
  previousDate: Date;
  constructor(private notification:NotificationService,private Faservice:faservice,private faService:Fa3Service,private formBuilder:FormBuilder,private datePipe:DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
   
    this.salesSummarySearch = this.formBuilder.group({
      category:[''],
      // ,[RequireMatch]
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:[''],
      crno:[''],
      fromdate:[''],
      todate:[''],

    });
    this.assetsalesapprove(1,5);
    
  }
  assetsalesapprove(pageNumber=1, pageSize=5){
    this.searchData={};
// if(this.salesSummarySearch){
  let assetsalesummarysearch=this.salesSummarySearch.value;
  if((this.salesSummarySearch.get('capdate_Value').value != null && this.salesSummarySearch.get('capdate_Value').value!= '')  ){
    var tranferdate=this.datePipe.transform(this.salesSummarySearch.get('capdate_Value').value, 'yyyy-MM-dd')
    this.searchData['capdate']=tranferdate
  }
  if(this.salesSummarySearch.get('asset_value').value!=null && this.salesSummarySearch.get('asset_value').value !=''){
      this.searchData['assetdetails_value'] = this.salesSummarySearch.get('asset_value').value;

  }
  if(this.salesSummarySearch.get('category').value !=null && this.salesSummarySearch.get('category').value!='' ){
    this.searchData['assetcat_id'] = this.salesSummarySearch.get('category').value.id;
  }
  if(this.salesSummarySearch.get('barcode').value !=null && this.salesSummarySearch.get('barcode').value!=''){
    this.searchData['barcode'] = this.salesSummarySearch.get('barcode').value;
  }
  if(this.salesSummarySearch.get('branch_name').value !=null && this.salesSummarySearch.get('branch_name').value!=''){
    this.searchData['branch_id'] = this.salesSummarySearch.get('branch_name').value.id;
  }
  if(this.salesSummarySearch.get('crno').value !=null && this.salesSummarySearch.get('crno').value!=''){
    this.searchData['crno'] = this.salesSummarySearch.get('crno').value;
  }
 
  // if(assetsalesummarysearch.barcode.barcode){
  //   console.log("true")
  //   this.searchData.barcode = assetsalesummarysearch.barcode.barcode;
  // }else{
  //   console.log("false")
  //   this.searchData.barcode = assetsalesummarysearch.barcode;

  // }
  console.log(this.salesSummarySearch.value);
// for (let i in this.searchData) {
//       if (this.searchData[i] === null || this.searchData[i] === "") {
//         delete this.searchData[i];
//       }
//     }
 
  
// }


// else{
//   this.searchData={}
// }
this.spinner.show();
    this.faService.getassetsale(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      this.spinner.hide();
      if (result?.code!='' && result?.code!=null && result?.code!=undefined){
          this.notification.showWarning(result?.code);      
          this.notification.showWarning(result?.description);      
      }
      else{
      this.assetsalesValue = result['data']
      let dataPagination = result['pagination'];
      if (this.assetsalesValue.length >= 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isPagination = true;
      } if (this.assetsalesValue <= 0) {
        this.isPagination = false;
      }
      console.log(this.has_previous)
      // for (let i in this.assetsalesValue) {

      //   this.newAssetSalesValue.push(<any>{
      //     newvalue: this.assetsalesValue[i].newvalue,


      //   })
      // }
      console.log("result=>", result)
    }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      console.log(error);
    }
    )
}
nextClick() {
  if (this.has_next === true) {

    // this.currentpage = this.presentpage + 1
    this.assetsalesapprove(this.presentpage + 1, 10)
  }

}

previousClick() {
  if (this.has_previous === true) {

    // this.currentpage = this.presentpage - 1
    this.assetsalesapprove(this.presentpage - 1, 10)
  }
}
private getasset_category(keyvalue) {
  this.faService.getAssetSearchFilter(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.category = datas;
     console.log("datas",keyvalue)
    })
}

public displayFnAssest(Asset?: Asset): string | undefined {
  return Asset ? Asset.subcatname : undefined;
}
  asset_category(){
    let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.salesSummarySearch.get('category').valueChanges
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
  console.log(event.target.value);

}
  Branch(){
    let keyvalue: String = "";
      this.getEmployee(keyvalue);
      
      this.salesSummarySearch.get('branch_name').valueChanges
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
      
      this.salesSummarySearch.get('barcode').valueChanges
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

     binaryData:any[]=[]
    pdfpup(pdf_id) {

     
     
     
      this.id = pdf_id.assetsaleheader_id
    
        this.spinner.show();
        this.faService.getpdfPO(this.id)
          .subscribe((data) => {
            this.spinner.hide();
            console.log(data.type);
            if(data.type=='application/json'){
              const reader = new FileReader();
                reader.onload = (event) => {
                  // Process the blob data here
                  const result = reader.result as string;
                  console.log(JSON.parse(result));
                  console.log(result);
                  this.notification.showWarning(JSON.parse(result)['code']);
                  this.notification.showWarning(JSON.parse(result)['description']);
                };

                reader.readAsText(data);
              // this.notification.showWarning(data['code']);
              // this.notification.showWarning(data['description']);
            }    
            else{
              this.binaryData = [];
              console.log(this.binaryData)
                
                this.binaryData.push(data)
                console.log("data",data)
                console.log("binaryData",this.binaryData)
                this.downloadUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
                let link = document.createElement('a');
                console.log(link)
                link.href = this.downloadUrl;
                link.target='_blank';
                link.click()
                // this.pdfSrc = this.downloadUrl;
                // console.log("url",this.pdfSrc)
              
              
            }  
      },(error)=>{
        this.spinner.hide();
      });
      this.pdfSrc=undefined
         
      }

    PDfDownload(data) {
      // let id = this.getMemoIdValue(this.idValue)
      let id = data.assetsaleheader_id;
      let date_new=this.datePipe.transform(new Date(),'yyyy-MM-dd hh:mm a');
      console.log(date_new);
      let name =  'Asset Sale Invoice-'+ date_new.toString();
      this.faService.fileDownloadpo(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = name + ".pdf";
          link.click();
        })
    }
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
        this.spinner.show();
        this.Faservice.accounting_ddl(i.barcode,this.has_accpage,'Sale','','').subscribe((result) => {
        if(result){
          this.spinner.hide();
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
            this.spinner.hide();
            this.sumofcredit=0;
            this.sumofdebit=0;
            this.accountDetailslist=[];
          }
          )
    }
    has_nextdata(){
      if(this.has_accnext){
        this.Faservice.accounting_ddl(this.detailsdata.barcode,this.has_accpage+1,'Sale','','').subscribe((result) => {
          if(result){
            this.spinner.hide();
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
              this.spinner.hide();
              this.sumofcredit=0;
              this.sumofdebit=0;
              this.accountDetailslist=[];
            }
            )
      }
    }
    has_previousdata(){
      if(this.has_accprevious){
        this.Faservice.accounting_ddl(this.detailsdata.barcode,this.has_accpage-1,'Sale','','').subscribe((result) => {
          if(result){
            this.spinner.hide();
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
              this.spinner.hide();
              this.sumofcredit=0;
              this.sumofdebit=0;
              this.accountDetailslist=[];
            }
            )
      }
    }
    clearSearch(){
     
      this.salesSummarySearch.controls['capdate_Value'].reset('')
      this.salesSummarySearch.controls['category'].reset('')
      this.salesSummarySearch.controls['asset_value'].reset('')
      this.salesSummarySearch.controls['barcode'].reset('')
      this.salesSummarySearch.controls['branch_name'].reset('')
      this.salesSummarySearch.controls['fromdate'].reset('');
      this.salesSummarySearch.controls['todate'].reset('');
      this.salesSummarySearch.controls['crno'].reset('');
      this.assetsalesapprove(1,5);
    }
    clickreason(data){
      this.reassons=data.reason;
    }
    salehistorydownload(){
      let params='?fromdate=';
      
      if((this.salesSummarySearch.get('fromdate').value=='' || this.salesSummarySearch.get('fromdate').value == null  || this.salesSummarySearch.get('fromdate').value == undefined) || (this.salesSummarySearch.get('todate').value=='' || this.salesSummarySearch.get('todate').value == null  || this.salesSummarySearch.get('todate').value == undefined)){
        this.notification.showWarning("Please Select from and todate");
        return false;
      }
      if (this.salesSummarySearch.get('fromdate').value!='' && this.salesSummarySearch.get('fromdate').value!= null && this.salesSummarySearch.get('fromdate').value!=undefined){
        let fromdate = this.datePipe.transform((this.salesSummarySearch.get('fromdate').value),'yyyy-MM-dd');
        params+=fromdate;
      }
      if (this.salesSummarySearch.get('todate').value!='' && this.salesSummarySearch.get('todate').value!= null && this.salesSummarySearch.get('todate').value!=undefined){
        let todate=this.datePipe.transform(this.salesSummarySearch.get('todate').value,'yyyy-MM-dd');       
         params+='&todate='+todate;
      }
        
        if((this.salesSummarySearch.get('capdate_Value').value != null && this.salesSummarySearch.get('capdate_Value').value!= '')  ){
          let tranferdate=this.datePipe.transform(this.salesSummarySearch.get('capdate_Value').value, 'yyyy-MM-dd')
          // this.searchData['capdate']=tranferdate
          params+='&capdate='+tranferdate;;
        }
        if(this.salesSummarySearch.get('asset_value').value!=null && this.salesSummarySearch.get('asset_value').value !=''){
            // this.searchData['assetdetails_value'] = this.salesSummarySearch.get('asset_value').value;
            params+='&assetdetails_value='+this.salesSummarySearch.get('asset_value').value;
      
        }
        if(this.salesSummarySearch.get('category').value !=null && this.salesSummarySearch.get('category').value!='' ){
          // this.searchData['assetcat_id'] = this.salesSummarySearch.get('category').value.id;
          params+='&assetcat_id='+this.salesSummarySearch.get('category').value.id;
        }
        if(this.salesSummarySearch.get('barcode').value !=null && this.salesSummarySearch.get('barcode').value!=''){
          // this.searchData['barcode'] = this.salesSummarySearch.get('barcode').value;
          params+='&barcode='+this.salesSummarySearch.get('barcode').value;
        }
        if(this.salesSummarySearch.get('branch_name').value !=null && this.salesSummarySearch.get('branch_name').value!=''){
          // this.searchData['branch_id'] = this.salesSummarySearch.get('branch_name').value.id;
          params+='&branch_id='+this.salesSummarySearch.get('branch_name').value.id;
        }
        if(this.salesSummarySearch.get('crno').value !=null && this.salesSummarySearch.get('crno').value!=''){
          // this.searchData['crno'] = this.salesSummarySearch.get('crno').value;
          params+='&crno='+this.salesSummarySearch.get('crno').value;
        }
        this.spinner.show();
      this.Faservice.Sale_history_downloads(params).subscribe(result=>{
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
              link.download = 'FA Sale History Reports_'+ date +".xlsx";
              link.click();
              this.notification.showSuccess('Success');
            }

      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.notification.showWarning(error?.status+error.message);
      })
    
    }
    fromdateSelection(event: string) {
      const date = new Date(event)
      this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
    }
}
