import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
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
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface categorylistss {
  id: any;
  subcatname: string;
}

@Component({
  selector: 'app-write-off-summary',
  templateUrl: './write-off-summary.component.html',
  styleUrls: ['./write-off-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class WriteOffSummaryComponent implements OnInit {
  first: boolean;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  isLoading = false;
  currentpage: number = 1;
  pageSize = 10
  writeOffSearchForm: FormGroup;
  writeOffCheckerSearchForm: FormGroup;

  maker: boolean
  checker: boolean;
  select:Date;
  PreviousDate:Date;


  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;
  btndisable:boolean=false;
  btndisablepopup:boolean=false;

  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private toastr:ToastrService,
     private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }
 

  ngOnInit(): void {

    this.writeOffSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
      crno:[''],
      to_date:[''],
      from_date:[''] 
       })

    this.writeOffCheckerSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
      crno:['']
    })


    this.writeOffSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetbranchdata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      })


      this.writeOffSearchForm.get('assetcat_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetCatdata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      });
      this.writeOffCheckerSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetbranchdata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      })


      this.writeOffCheckerSearchForm.get('assetcat_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetCatdata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })


      this.activatedRoute.paramMap.subscribe((params: ParamMap)=>{
        let SummaryCall: any = params.get('data')
        console.log("summary call",SummaryCall)
        if( SummaryCall == 'maker'){
          this.maker = true
          this.checker = false;
          this.getAssetWriteOffsummary();
        }
        if( SummaryCall == 'checker'){
          this.maker = false
          this.checker = true;
          // this.getAssetWriteOffApprovalsummary();
          this.getwriteOffAppsummarySearch();
        }
        

      })


    // this.getAssetWriteOffsummary();
    // this.getAssetWriteOffApprovalsummary()
   
  }












    ////////////////////////////////////////////////////////////////////Write Off Summary
    WriteOffMakerlist: Array<any>
    has_nextWriteoff = true;
    has_previousWriteoff = true;
    presentpageWriteoff: number = 1
  
    getAssetWriteOffsummary(pageNumber = 1, pageSize = 10) {
      this.spinner.show();
      this.Faservice2.getAssetWriteOffsummary(pageNumber, pageSize)
        .subscribe((result:any) => {
          this.spinner.hide();
          if(result.code!=undefined && result.code!="" && result.code!=null){
            this.toastr.warning(result.code);
            this.toastr.warning(result.description);
          }
          else{
            console.log("Asset Write Off", result)
          
            let datas = result['data'];
            let datapagination = result["pagination"];
            this.WriteOffMakerlist = datas;
            if (this.WriteOffMakerlist.length > 0) {
              this.has_nextWriteoff = datapagination.has_next;
              this.has_previousWriteoff = datapagination.has_previous;
              this.presentpageWriteoff = datapagination.index;
            }
          }
         
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
        }
        )
    }
  
    WriteOffnextClick() {
      if (this.has_nextWriteoff == true) {
        this.getAssetWriteOffsummary(this.presentpageWriteoff + 1, 10)
      }
    }
  
    WriteOffpreviousClick() {
      if (this.has_previousWriteoff == true) {
        this.getAssetWriteOffsummary(this.presentpageWriteoff - 1, 10)
      }
    }
  
    resetWriteOff() {
      this.writeOffSearchForm.reset();
      this.getAssetWriteOffsummary();
      this.first=false;
      return false
    }
  
    getwriteOffsummarySearch() {
      let searchWriteoff = this.writeOffSearchForm.value;
      if( searchWriteoff.capdate != ""){
        let capdatedata = searchWriteoff.capdate 
        let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
        searchWriteoff.capdate = dates
      }
      
      for (let i in searchWriteoff) {
        if (searchWriteoff[i] === null || searchWriteoff[i] === "") {
          delete searchWriteoff[i];
        }
      }
      this.spinner.show();
      this.Faservice2.getwriteOffsummarySearch(searchWriteoff)
        .subscribe(result => {
          this.spinner.hide();
          this.WriteOffMakerlist = result['data']
          return true
        })
    }
  
    barcodeData:any;  ProductNameData: any;   CatagoryData:any;
    CapitalizationDate: any;  AssetValueData:any;  BranchData:any;  LocationData: any;
    ReasonData: any;  StatusData:any
    getAssetWriteOffIdData(data){
      let id:any = data.id
      this.spinner.show();
      this.Faservice2.getAssetWriteOffIdData(id,data?.writeoff_id)
        .subscribe((results) => {
          this.spinner.hide();
          this.barcodeData = results.barcode
          this.ProductNameData = results.product_id.name
          this.CatagoryData = results.assetcatchange_id.subcatname
          this.CapitalizationDate = results.capdate
          this.AssetValueData = results.assetdetails_value
          this.BranchData = results.branch_id.name
          this.LocationData = results.assetlocation_id.name
          this.ReasonData = results.writeoff_reason
          this.StatusData = results.assetdetails_status
        })
    }
    ReasonShow:any
    ReasonWriteOffmaker: boolean
      ReasonShowOff(data){
        this.ReasonShow = data.writeoff_reason
        this.ReasonWriteOffmaker = true
    
      }
    
      ReasonShowApp:any
      ReasonShowApproval: boolean
      ReasonShowOffApp(data){
        this.ReasonShowApp = data.writeoff_reason
        this.ReasonShowApproval = true
    
      }  
  
    ////////////////////////////////////////////////////////////////////Write Off checker Summary
    WriteOffApprovallist: Array<any>
    has_nextWriteoffApp = true;
    has_previousWriteoffApp = true;
    presentpageWriteoffApp: number = 1
  
    getAssetWriteOffApprovalsummary(pageNumber = 1, pageSize = 10) {
      this.spinner.show();
      this.Faservice2.getAssetWriteOffApprovalsummary(pageNumber, pageSize)
        .subscribe((result) => {
          this.spinner.hide();
          if(result.code!=undefined && result.code!="" && result.code !=null){
            this.toastr.warning(result.code);
            this.toastr.warning(result.description);

          }
          else{
            console.log("Asset Write Off Approval ", result)
          
          let datas = result['data'];
          let datapagination = result["pagination"];
          this.WriteOffApprovallist = datas;
          if (this.WriteOffApprovallist.length > 0) {
            this.has_nextWriteoffApp = datapagination.has_next;
            this.has_previousWriteoffApp = datapagination.has_previous;
            this.presentpageWriteoffApp = datapagination.index;
          }
          }
          
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();

        }
        )
    }
  
    WriteOffAppnextClick() {
      if (this.has_nextWriteoffApp == true) {
        this.getAssetWriteOffApprovalsummary(this.presentpageWriteoffApp + 1, 10)
      }
    }
  
    WriteOffApppreviousClick() {
      if (this.has_previousWriteoffApp == true) {
        this.getAssetWriteOffApprovalsummary(this.presentpageWriteoffApp - 1, 10)
      }
    }
  
  
    resetWriteOffApp() {
      this.writeOffCheckerSearchForm.reset('');
      this.getwriteOffAppsummarySearch();
      this.arrayForIds=[];
      return false
    }
  
    getwriteOffAppsummarySearch() {
      let searchWriteoffApp = this.writeOffCheckerSearchForm.value;
      if( searchWriteoffApp.capdate != ""){
        let capdatedata = searchWriteoffApp.capdate 
        let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
        searchWriteoffApp.capdate = dates
      }
      for (let i in searchWriteoffApp) {
        if (searchWriteoffApp[i] == null || searchWriteoffApp[i] == "" || searchWriteoffApp[i] == undefined) {
          delete searchWriteoffApp[i];
        }
      }
      this.spinner.show();
      this.Faservice2.getwriteOffApprovalsummarySearch(searchWriteoffApp)
        .subscribe((result:any) => {
          this.spinner.hide();
          if(result.code!=undefined && result.code!="" && result.code!=null){
            this.toastr.warning(result.code);
            this.toastr.warning(result.description);

          }
          else{
            this.WriteOffApprovallist = result['data'];
            let pagination=result['pagination'];
  
            
            if(this.WriteOffApprovallist.length>0){
              this.has_previousWriteoffApp=pagination.has_previous;
              this.has_nextWriteoffApp=pagination.has_next;
              this.presentpageWriteoffApp=pagination.index;
            }
            return true
          }
          
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
        }
        )
    }
  
  
  
    arrayForIds = []
    ReasonShowApprovalSubmit: boolean
    selectedAssetValue(data, event){
      
      let assetIdPush = data.id
      console.log(assetIdPush)
      if( event.target.checked ){
        this.arrayForIds.push(assetIdPush)
      }
      else{
        let idarray = this.arrayForIds
        for( let id in idarray){
  
          if(idarray[id] == assetIdPush){
          console.log("idarray[id] ",idarray[id])
          console.log("assetIdPush", assetIdPush)
          
          let idAsNumber = Number(id)
          console.log("idAsNumber", idAsNumber)
          this.arrayForIds.splice(idAsNumber, 1)
          }
        }
        console.log(this.arrayForIds)
      }
      if(this.arrayForIds.length >0){
        this.ReasonShowApprovalSubmit = true
      }
      else{
        this.ReasonShowApprovalSubmit = false
      }
      // this.autoCheckUpdation()
    }
    
    
  
    updateWhenUsingPagination(){
     let IdSelectedArray = this.arrayForIds
  
     this.WriteOffApprovallist.forEach((row, index) => {
      IdSelectedArray.forEach((rowarray, index) => {
        if (rowarray == row.id) {
          console.log("1",rowarray)
          console.log("2",row.id)
          row.checkbox = true
        }
      })
    })
    // this.autoCheckUpdation()
    }
  
  
    WriteOffChecker(input, type){
      let dataToChecker
      if( type == 1 ){
        dataToChecker = {"assetdetails_id":this.arrayForIds,
                              "reason":"",
                              "action":'APPROVE'
                            }
  
      }
      if( type == 3){
        if( input == '' || input == null || input == undefined){
          this.notification.showWarning('Please Fill Remarks While Reject')
          return false 
        }
        dataToChecker = {"assetdetails_id":this.arrayForIds,
                              "reason":input,
                              "action":'REJECT'
                            }
      }
      console.log("data submit", dataToChecker)
      this.spinner.show();
      this.btndisable=true;
      this.Faservice2.WriteOffCheckerSubmit(dataToChecker)
        .subscribe(result => {
          this.spinner.hide();
          this.btndisable=false;
          if(result?.code !='' && result?.code!=null && result?.code!=undefined){
            this.notification.showError(result?.code);
            this.notification.showError(result?.description);
            return false;
          }
          if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
            this.spinner.hide();
            this.notification.showError("Maker Not Allowed To Approve")
            return false
          } 
          if(result.message == 'Approved Successfully'){
            this.notification.showSuccess("Successfully Approved")
            this.spinner.hide();
            this.getAssetWriteOffApprovalsummary()
          }
          if(result.message == 'Rejected Successfully'){
            this.notification.showSuccess("Successfully Rejected")
            this.spinner.hide();
            this.getAssetWriteOffApprovalsummary()
          }
          this.ReasonShowApproval = false
          
          return true;
        },
        (error)=>{
          this.btndisable=false;
          this.spinner.hide();
        }
        )
  
  
  
  
  
  
  
  
    }
  
  
  
  

    currentpagecategory: number = 1;
    has_nextcategory = true;
    has_previouscategory = true;
    autocompletecategoryScroll() {
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
                if (this.has_nextbranch === true) {
                  this.Faservice.getassetCatdata(this.categoryInput.nativeElement.value, this.currentpagecategory + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.categoryList = this.categoryList.concat(datas);
                      if (this.categoryList.length >= 0) {
                        this.has_nextcategory = datapagination.has_next;
                        this.has_previouscategory = datapagination.has_previous;
                        this.currentpagecategory = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  
  
    public displayFncategory(category?: any) {
      return category ? this.categoryList.find(_ => _.id === category).subcatname : undefined;
    }
  
    // public displayFncategory(category?: categorylistss): string | undefined {
    //   return category ? category.subcatname : undefined;
    // }
  
  
    getCategoryFK() {
      let categorykeyvalue = '';
      this.Faservice.getassetCatdata(categorykeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryList = datas;
          console.log("categoryList", datas)
        })
    }
  
  
    /////  branch
  
    currentpagebranch: number = 1;
    has_nextbranch = true;
    has_previousbranch = true;
    autocompletebranchScroll() {
      setTimeout(() => {
        if (
          this.matbranchAutocomplete &&
          this.autocompleteTrigger &&
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
                if (this.has_nextbranch === true) {
                  this.Faservice.getassetbranchdata(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length >= 0) {
                        this.has_nextbranch = datapagination.has_next;
                        this.has_previousbranch = datapagination.has_previous;
                        this.currentpagebranch = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  
  
    public displayFnbranch (branch?: any) {
      return branch ? this.branchList.find(_ => _.id === branch).name : undefined;
    }
    //return branch ? branch.code : undefined;
  
  
  
  // public displayFnbranch(branch?: branchlistss): string | undefined {
  //   let code = branch ? branch.code : undefined;
  //   let name = branch ? branch.name : undefined;
  //   return branch ? code + "-" + name : undefined;
  //   //return branch ? branch.code : undefined;
  // }
  
  
    getbranchFK() {
      let branchkeyvalue = '';
      // this.spinner.show();
      this.Faservice.getassetbranchdata(branchkeyvalue, 1)
        .subscribe((results: any[]) => {
          this.spinner.hide();
          let datas = results["data"];
          this.branchList = datas;
          console.log("branchList", datas)
        })
    }
  
  
  
  
    

    isWriteOffAdd: boolean = false

    addWriteOff(){
      this.isWriteOffAdd = true
      this.maker = false
      this.checker = false
      
    }

    WriteOffCreateSubmit(){
      this.getAssetWriteOffsummary()
      this.isWriteOffAdd = false
      this.maker = true
      this.checker = false
    }

    WriteOffCreateCancel(){
      this.isWriteOffAdd = false
      this.maker = true
      this.checker = false
    }

    fromdateSelection(event: string) {
      const date = new Date(event)
      this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
    }
    preparefile(){
      if(this.first==true){
        this.notification.showWarning('Please Wait');
        return false;
      } 
      let searchWriteoff = this.writeOffSearchForm.value;;
      if(this.writeOffSearchForm.get('from_date').value==undefined || this.writeOffSearchForm.get('from_date').value=='' || this.writeOffSearchForm.get('from_date').value==null ){
          this.notification.showWarning("Please Select From date");
          return false;
      }
      if(this.writeOffSearchForm.get('to_date').value==undefined || this.writeOffSearchForm.get('to_date').value=='' || this.writeOffSearchForm.get('to_date').value==null ){
           this.notification.showWarning("Please Select to date");
           return false;
      }
      this.first=true;
      let dates = this.datePipe.transform(searchWriteoff.from_date, 'yyyy-MM-dd');
      searchWriteoff.from_date=dates;
      let todate = this.datePipe.transform(searchWriteoff.to_date,'yyyy-MM-dd');
      searchWriteoff.to_date=todate;
      if(this.writeOffSearchForm.get('capdate').value !='' && this.writeOffSearchForm.get('capdate').value !=null && this.writeOffSearchForm.get('capdate').value !=undefined ){
        let capdate= this.datePipe.transform(searchWriteoff.capdate,'yyyy-MM-dd');
        searchWriteoff.capdate= capdate;
      }
      for(let value in searchWriteoff){
        if(searchWriteoff[value]=='' || searchWriteoff[value]==undefined || searchWriteoff[value]==null){
          delete searchWriteoff[value];
        }
      }
      this.spinner.show();
      this.Faservice2.writeoff_download_prepare(searchWriteoff).subscribe(result=>{
        this.spinner.hide();
        this.first=false;
        if(result.code!=undefined && result.code!=null && result.code!=''){
          this.notification.showWarning(result.code);
          this.notification.showWarning(result.description);
        }
        else{
          this.notification.showSuccess(result.status);
          this.notification.showSuccess(result.message);
        }
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.first=false;
        this.notification.showWarning(error.status+error.message);
      })
    }
    download_file(){
      if(this.first==true){
        this.notification.showWarning('Please Wait');
        return false;
      } 
      this.spinner.show();
      this.Faservice2.writeoff_downloadfile().subscribe(
        (response: any) =>{
          this.spinner.hide();
            // this.first=false;
            // this.first=false;
            if (response['type']=='application/json'){
              this.notification.showWarning('INVALID_DATA')
             }
             else{
              let filename:any='Writeoff-reort';
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
        (error:HttpErrorResponse)=>{
          // this.first=false;
          this.spinner.hide();
          this.notification.showWarning(error.status+error.statusText);
        }
    )
  
    }


}
