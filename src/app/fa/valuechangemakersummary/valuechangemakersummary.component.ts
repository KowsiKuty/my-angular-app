import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Fa3Service } from '../fa3.service';
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
export interface iEmployeeList {
  full_name: string;
  id: number;
}
export interface classification {
  id: string;
  text: string;
}
export interface Branch {
  id: string;
  name: string;
  code: number;
}
export interface Asset {
  id: string;
  subcatname: string;
}
export interface AssetDetails {
  id: string;
  barcode: string
}

@Component({
  selector: 'app-valuechangemakersummary',
  templateUrl: './valuechangemakersummary.component.html',
  styleUrls: ['./valuechangemakersummary.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class ValuechangemakersummaryComponent implements OnInit {
  first: boolean;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  valueChangeSearch: FormGroup;
  employeeList: Array<Branch>;
  category: Array<Asset>
  assetDetails: Array<AssetDetails>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading = false;
  identificationData: any;
  assetValue: any;
  presentpage: number = 1;
  isSummaryPagination: boolean;
  pageSize: number = 5;
  identificationSize: number = 10;
  presentIdentification: number = 1;
  searchData: any={};
  reasondata:any;
  select:Date;
  PreviousDate:Date;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;


  constructor(private router: Router, private formBuilder: FormBuilder, private toastr:ToastrService,
    private faService: Fa3Service,private datePipe: DatePipe,private spinner:NgxSpinnerService ) {
    
  }

  ngOnInit(): void {
    
    this.valueChangeSearch = this.formBuilder.group({
      category: [''],
      capdate_Value:[''],
      assetValue:[''],
      barcode: [''],
      branch_name: [''],
      crno:[''],
      to_date:[''],
      from_date:['']

    });
    this.getAssetValueChange()
  }

  getAssetValueChange(pageNumber = 1, pageSize = 5) {
    console.log(this.valueChangeSearch.value);
    
    let valuechangesummary=this.valueChangeSearch.value
    if(this.valueChangeSearch.get('capdate_Value').value != null && this.valueChangeSearch.get('capdate_Value').value != ''){
      var tranferdate=this.datePipe.transform(this.valueChangeSearch.get('capdate_Value').value, 'yyyy-MM-dd')
      this.searchData.capdate=tranferdate
    }
    if(this.valueChangeSearch.get('assetValue').value !=null && this.valueChangeSearch.get('assetValue').value !=''){
        this.searchData.assetdetails_value = this.valueChangeSearch.get('assetValue').value;

    }
    if(this.valueChangeSearch.get('category').value !=null && this.valueChangeSearch.get('category').value !=''){
      this.searchData.assetcat_id = this.valueChangeSearch.get('category').value.id;
    }
    if(this.valueChangeSearch.get('barcode').value !=null && this.valueChangeSearch.get('barcode').value !=''){
      this.searchData.barcode = this.valueChangeSearch.get('barcode').value;
    }
    if(this.valueChangeSearch.get('branch_name').value !=null && this.valueChangeSearch.get('branch_name').value !=''){
      this.searchData.branch_id = this.valueChangeSearch.get('branch_name').value.id;
    }
    if(this.valueChangeSearch.get('crno').value !=null && this.valueChangeSearch.get('crno').value !=''){
      this.searchData.crno = this.valueChangeSearch.get('crno').value;
    }
  //   for (let i in this.searchData) {
  //       if (this.searchData[i] === null || this.searchData[i] === "") {
  //         delete this.searchData[i];
  //       }
  //     }
   
    
  // 

  

  // else{
  //   this.searchData={}
  // }
  
   console.log( this.searchData)
  this.spinner.show();
    this.faService.getAssetValueChange(pageNumber, pageSize, this.searchData)
      .subscribe((result:any) => {
        if(result.code!=undefined && result.code!="" && result.code!=null){
          this.spinner.hide();
          this.toastr.warning(result.code);
          this.toastr.warning(result.description);
        }
        else{
          this.spinner.hide();
          this.assetValue = result['data']
        
          console.log(this.assetValue)
          let dataPagination = result['pagination'];
          if (this.assetValue.length >= 0) {
            this.has_next = dataPagination.has_next;
            this.has_previous = dataPagination.has_previous;
            this.presentpage = dataPagination.index;
            this.isSummaryPagination = true;
          } if (this.assetValue <= 0) {
            this.isSummaryPagination = false;
          }
        }
       

        
      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();

     } 
      )
    }
barcodeValues
barcodeValue(value){
  this.barcodeValues=value
  // console.log(value)
}

    nextClick() {
      if (this.has_next === true) {

        this.currentpage = this.presentpage + 1
        this.getAssetValueChange(this.presentpage + 1, 10)
      }
      
    }


    previousClick() {
      if (this.has_previous === true) {

        this.currentpage = this.presentpage - 1
        this.getAssetValueChange(this.presentpage - 1, 10)
      }
    }


    // asset_category
    private getasset_category(keyvalue) {
      this.faService.getAssetSearchFilter(keyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;

        })
    }

    public displayFnAssest(Asset?: Asset): string | undefined {
      return Asset ? Asset.subcatname : undefined;
    }
    asset_category() {
      let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.valueChangeSearch.get('category').valueChanges
        .pipe(
          startWith(""),
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;


          }),

          switchMap(value => this.faService.getAssetSearchFilter(value, 1)
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

    onFocusOutEvent(event) {
      console.log(event.target.value);

    }
    Branch() {
      let keyvalue: String = "";
      this.getEmployee(keyvalue);

      this.valueChangeSearch.get('branch_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;


          }),
          switchMap(value => this.faService.getEmployeeBranchSearchFilter(value, 1)
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
      this.faService.getEmployeeBranchSearchFilter(keyvalue, 1)
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
      this.faService.getAssetIdSearchFilter(keyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.assetDetails = datas;
          // assetDetails:Array<AssetDetails>
       }
      )
    }

    Assetbarcode() {
      let keyvalue: String = "";
      this.getassetbarcode(keyvalue);

      this.valueChangeSearch.get('barcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;


          }),
          switchMap(value => this.faService.getAssetIdSearchFilter(value, 1)
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

    autocompleteScrollAssetId() {
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
    reasonclick(data:any){
      this.reasondata=data.reason;
    }
    clearSearch(){
     
      this.valueChangeSearch.controls['capdate_Value'].reset('')
      this.valueChangeSearch.controls['category'].reset('')
      this.valueChangeSearch.controls['assetValue'].reset('')
      this.valueChangeSearch.controls['barcode'].reset('')
      this.valueChangeSearch.controls['branch_name'].reset('')
      this.valueChangeSearch.controls['crno'].reset('')
      this.searchData={}
      this.getAssetValueChange();
      this.first=false;
      // return false;
    }
    fromdateSelection(event: string) {
      const date = new Date(event)
      this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
    }
    preparefile(){
      if(this.first==true){
        this.toastr.warning('Please Wait');
        return false;
      }
      let valuechangesearh=this.valueChangeSearch.value;
      if(this.valueChangeSearch.get('from_date').value==undefined || this.valueChangeSearch.get('from_date').value=='' || this.valueChangeSearch.get('from_date').value==null ){
          this.toastr.warning("Please Select From date");
          return false;
      }
      if(this.valueChangeSearch.get('to_date').value==undefined || this.valueChangeSearch.get('to_date').value=='' || this.valueChangeSearch.get('to_date').value==null ){
           this.toastr.warning("Please Select to date");
           return false;
      }
      this.first=true;
      let dates = this.datePipe.transform(valuechangesearh.from_date, 'yyyy-MM-dd');
      valuechangesearh.from_date=dates;
      let todate = this.datePipe.transform(valuechangesearh.to_date,'yyyy-MM-dd');
      valuechangesearh.to_date=todate;
      if(this.valueChangeSearch.get('capdate_Value').value!=null && this.valueChangeSearch.get('capdate_Value').value !='' && this.valueChangeSearch.get('capdate_Value').value!=null){
        let capdate = this.datePipe.transform(valuechangesearh.capdate_Value,'yyyy-MM-dd');
        valuechangesearh.capdate=capdate;
      }
      for(let value in valuechangesearh){
        if(valuechangesearh[value]=='' || valuechangesearh[value]==undefined || valuechangesearh[value]==null){
          delete valuechangesearh[value];
        }
      }
      this.spinner.show();
      this.faService.valuchange_download_prepare(valuechangesearh).subscribe(result=>{
        this.first=false;
        this.spinner.hide();
        if(result.code!=undefined && result.code!=null && result.code!=''){
          this.toastr.warning(result.code);
          this.toastr.warning(result.description);
        }
        else{
          this.toastr.success(result.status);
          this.toastr.success(result.message);
        }
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.first=false;
        this.toastr.warning(error.status+error.message);
      })
    }
    download_file(){
      if(this.first==true){
        this.toastr.warning('Please Wait');
        return false;
      } 
      this.spinner.show();
      this.faService.valuechange_downloadfile().subscribe(
        (response: any) =>{
          this.spinner.hide();
            // this.first=false;
            // this.first=false;
            if (response['type']=='application/json'){
              this.toastr.warning('INVALID_DATA')
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
          this.toastr.warning(error.status+error.statusText);
        }
    )
  
    }


  
  }