import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
import { fromEvent } from 'rxjs';
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { environment } from 'src/environments/environment'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit,Output,EventEmitter,ViewChild,HostListener,ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer } from '@angular/core';
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
@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class VehicleDetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  vehicledetailForm:FormGroup
  vehicleid: any;
  has_presenntids:any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('inputproductid') commodityInput: any;
  vehicledetailid: any;
  catlist: any;
  branchlist: any;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  id: any;
  barcodelist: any;
  product_list: any;
  asset: any;
  assetlist: any;
  vehiclepurchase_date: any;
  purchase_value: any;
  wdv: any;
  sale_value: any;
  asset_life: any;
  capitalised_value: any;
  constructor(private datePipe: DatePipe,private errorHandler: ErrorHandlingServiceService,private shareservice:ShareService, private spinnerservice:NgxSpinnerService,private router: Router,private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }

  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.vehicledetailForm = this.fb.group({
      purchase_value: [''],
      capitalised_value:[''],
      asset_life: [''],
      wdv: [''],
      sale_value: [''],
      subcat_name:[''],
      subcat_id:[''],
      vehiclepurchase_date: [''],
      asset_id: ['']
    })
    if(this.vehicledetailid!=0){
    this.vfmService.getvehicledetailslist(this.vehicleid,this.vehicledetailid)
    .subscribe((results: any) => {
      console.log("res",results)
      this.issubmitbtn = false;
      this.iseditbtn=true;
      let purchase_value=results['purchase_value']
      let vehiclepurchase_date=this.datePipe.transform(results['vehiclepurchase_date'], 'yyyy-MM-dd')
      let capitalised_value=results['capitalised_value']
      let asset_life=results['asset_life']
      let asset_id=results['asset_id']
      let wdv=results['wdv']
      let sale_value=results['sale_value']

      this.vehicledetailForm.patchValue({
        purchase_value: purchase_value,
        capitalised_value:capitalised_value,
        asset_life: asset_life,
        wdv: wdv,
        sale_value: sale_value,
        vehiclepurchase_date:vehiclepurchase_date,
        asset_id:asset_id
      })
    })
    this.vehicledetailForm.get('asset_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        console.log('inside tap')

      }),
      switchMap(value => this.vfmService.getasset(value, 1,this.id)
      
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.product_list = datas;

    },(error) => {
      this.errorHandler.handleError(error);
    })
    this.vehicledetailForm.get('subcat_name').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.vfmService.getsubcat(value, 1))
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchlist = datas;
      console.log("Branch List", this.branchlist)
    });
  }
  this.getcat()
  this.getbranch()
  }
  getcat(){
    this.vfmService.getcat() .subscribe(res=>{
      this.catlist = res['data'][0].name
    }
  )

  }
  branchname(id){
    this.id=id
    this.vfmService.getbarcode(id) .subscribe(res=>{
      this.barcodelist = res['data']
    })
  }
  getProductData(id){
    this.asset=id
    this.vfmService.getassetlist(id) .subscribe(res=>{
     let data = res['data']
      this.vehiclepurchase_date=data.vehiclepurchase_date
      this.purchase_value=data.purchase_value
      this.wdv=data.wdv
      this.sale_value=data.sale_value
      this.asset_life=data.asset_life
      this.capitalised_value=data.capitalised_value
      this.vehicledetailForm.patchValue(
        {vehiclepurchase_date:this.vehiclepurchase_date,
          purchase_value:this.purchase_value,
          wdv:this.wdv,
          sale_value:this.sale_value,
          asset_life:this.asset_life,
          capitalised_value:this.capitalised_value
        })
    })
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  submitForm(){
    if (this.vehicledetailForm.value.purchase_value === "") {
      this.notification.showError("Please Enter Purchase Value");
      return false;
    }
    if (this.vehicledetailForm.value.vehiclepurchase_date === "") {
      this.notification.showError("Please Enter Purchase Date");
      return false;
    }
    if (this.vehicledetailForm.value.capitalised_value === "") {
      this.notification.showError("Please Enter Capitalised Value");
      return false;
    }  
    if (this.vehicledetailForm.value.asset_life === "") {
      this.notification.showError("Please Enter Asset Life");
      return false;
    } 
    if (this.vehicledetailForm.value.asset_id === "") {
      this.notification.showError("Please Enter Asset Id");
      return false;
    } 
    if (this.vehicledetailForm.value.wdv === "") {
      this.notification.showError("Please Enter wdv");
      return false;
    } 
    if (this.vehicledetailForm.value.sale_value === "") {
      this.notification.showError("Please Enter Sale Value");
      return false;
    } 
  this.vehicledetailForm.value.subcat_id=this.id
  this.vehicledetailForm.value.vehiclepurchase_date = this.datePipe.transform(this.vehicledetailForm.value.vehiclepurchase_date, 'yyyy-MM-dd');
  this.vfmService.createvehicledetailmakers(this.vehicledetailForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit(); 
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Asset Details" }, skipLocationChange: true });                              

                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Asset Details" }, skipLocationChange: true });                              

  }
  Editform(){
    if (this.vehicledetailForm.value.purchase_value === "") {
      this.notification.showError("Please Enter Purchase Value");
      return false;
    }
    if (this.vehicledetailForm.value.vehiclepurchase_date === "") {
      this.notification.showError("Please Enter Purchase Date");
      return false;
    }
    if (this.vehicledetailForm.value.asset_id === "") {
      this.notification.showError("Please Enter Asset Id");
      return false;
    } 
    if (this.vehicledetailForm.value.capitalised_value === "") {
      this.notification.showError("Please Enter Capitalised Value");
      return false;
    }  
    if (this.vehicledetailForm.value.asset_life === "") {
      this.notification.showError("Please Enter Asset Life");
      return false;
    } 
    if (this.vehicledetailForm.value.wdv === "") {
      this.notification.showError("Please Enter wdv");
      return false;
    } 
    if (this.vehicledetailForm.value.sale_value === "") {
      this.notification.showError("Please Enter Sale Value");
      return false;
    } 
  this.vehicledetailForm.value.subcat_id=this.id
  this.vehicledetailForm.value.vehiclepurchase_date = this.datePipe.transform(this.vehicledetailForm.value.vehiclepurchase_date, 'yyyy-MM-dd');
    this.vfmService.editvehiclemakerdetail(this.vehicleid,this.vehicledetailid,this.vehicledetailForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Asset Details" }, skipLocationChange: true });                              

                                                
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  getbranch() {
    this.vfmService.getsub() .subscribe(res=>{
        this.branchlist = res['data']
      }
    )

  }
  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.vfmService.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
  currentpagecom = 1
  has_nextcom = true;
  has_previouscom = true;
  productautocomplete() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompletetrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.vfmService.getasset(this.commodityInput.nativeElement.value, this.currentpagecom + 1, this.id)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.product_list = this.product_list.concat(datas);
                    if (this.product_list.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.spinnerservice.hide();
                  })
              }
            }
          });
      }
    });
  }
}
