import { Component, OnInit,Output,EventEmitter, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { TnebService } from '../tneb.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface branchList{
  id:number
  name:string
  code:string
}
export interface premiseList{
  id:number
  name:string
  code: string
}

@Component({
  selector: 'app-view-ele-detail',
  templateUrl: './view-ele-detail.component.html',
  styleUrls: ['./view-ele-detail.component.scss']
})
export class ViewEleDetailComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
    // branch dropdown
    @ViewChild('branchContactInput') branchContactInput:any;
    @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    // Premise dropdown
    @ViewChild('PremiseContactInput') PremiseContactInput:any;
    @ViewChild('producttype') matAutocompletepremise: MatAutocomplete;
  viewElectricityForm: FormGroup;
  stateName = [{ id: 1, name: "Tamil Nadu" }]
  electricityBoard = [{ id: 1, name: "TNEB" }]
  isLoading= false;
  branchlist:any;
  premiselistt:any;

  constructor(private spinner:NgxSpinnerService,private router:Router, private tnebService: TnebService, private fb:FormBuilder,
    private notification:NotificationService,private errorHandler: ErrorHandlingServiceService,
    private shareService: SharedService) { }

  ngOnInit(): void {
    this.viewElectricityForm=this.fb.group({
      id:[''],
      consumer_state: [''],
      consumer_board: [''],
      regioncode:[''],
      premises_id:[''],
      occupancy_id:[''],
      premise_type:[''],
      personname:[''],
      contactno:[''],
      consumer_no: [''],
      consumer_name: [''],
      billingcycle:[''],
      siteid:[''],
      remarks:[''],
      "branch_id":[''],
     
      "occupancy_name": [''],
    "premise_name": ['']
    })
    this.viewElectricity();
  }
  // occupancy_id: 1
  // occupancy_name: "Onsite ATM"
  
  // premise_name: "Dindugal"
  viewElectricity(){

    let data = this.shareService.submodulestneb.value;
    console.log("viewelectricity",data)
    this.viewElectricityForm.patchValue({
      id: data.id,
      consumer_state: data.consumer_state,
      consumer_board: data.consumer_board,
      regioncode: {'id':data.regioncode.id,'name':data.regioncode.region_name,'code':data.regioncode.region_code},
      premises_id: {'id':data.premise.id,'name':data.premise.name,'code':data.premise.code},
      occupancy_name: data.premise.occupancy_name,
      premise_name:data.premise.name,
      occupancy_id:data.premise.id,
      premise_type: data.premise.premise_type,
      personname: data.personname,
      contactno:data.contactno,
      consumer_no: data.consumer_no,
      consumer_name: data.consumer_name,
      billingcycle:data.billingcycle,
      siteid:data.siteid,
      remarks:data.remarks,
      branch_id:data.branch_id.id,
  })

}
  
  viewElectricitySubmit(){
    this.viewElectricityForm.value.regioncode = this.viewElectricityForm.value.regioncode.id
    this.viewElectricityForm.value.premises_id = this.viewElectricityForm.value.premises_id.id

    
      this.tnebService.addElectricity(this.viewElectricityForm.value, )
        .subscribe(result => {
          if(result.id == undefined){
            this.notification.showError(result.description)
          }
          else {
            this.notification.showSuccess("Successfully updated!...")
            this.router.navigate(['/tneb/electricitySummary'], { skipLocationChange: true })
          } 
        },
        error => {
          this.errorHandler.handleError(error);
        })  

  }

  onCancelClick(){
    this.router.navigate(['/electricitySummary'], { skipLocationChange: true })
  }




  
  branchname(){
    let prokeyvalue: String = "";
      this.getbranchid(prokeyvalue);
      this.viewElectricityForm.get('regioncode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.tnebService.getbranchdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("branch", datas)

        })


  }
  private getbranchid(prokeyvalue)
  {
    this.tnebService.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    
  }

    // Branch  dropdown

    currentpagebra:any=1
    has_nextbra:boolean=true
    has_previousbra:boolean=true
    autocompletebranchnameScroll() {
      
      setTimeout(() => {
        if (
          this.matAutocompletebrach &&
          this.autocompleteTrigger &&
          this.matAutocompletebrach.panel
        ) {
          fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(()=> {
              const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbra === true) {
                  this.tnebService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchlist = this.branchlist.concat(datas);
                      if (this.branchlist.length >= 0) {
                        this.has_nextbra = datapagination.has_next;
                        this.has_previousbra = datapagination.has_previous;
                        this.currentpagebra = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }


    premisename(){
      let prokeyvalue: String = "";
        this.getpremiseid(prokeyvalue);
        this.viewElectricityForm.get('premises_id').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.tnebService.getpremisedropdown(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.premiselistt = datas;
  
          })
  
  
    }
    private getpremiseid(prokeyvalue)
    {
      this.tnebService.getpremisedropdown(prokeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.premiselistt = datas;
  
        })
    }
  
    public displaydiss1(producttype?: premiseList): string | undefined {
      return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
      
    } 

    // Premies dropdown
  currentpagepre:any=1
  has_nextpre:boolean=true
  has_previouspre:boolean=true
  autocompletePremisenameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletepremise&&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre=== true) {
                this.tnebService.getpremisedropdown(this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiselistt = this.premiselistt.concat(datas);
                    if (this.premiselistt.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


}
