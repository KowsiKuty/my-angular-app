import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment'
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RemsShareService } from '../rems-share.service';
import { SharedService } from 'src/app/service/shared.service';
import { DatePipe } from '@angular/common';
import { RemsService } from '../rems.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from 'src/app/rems/error-handling.service';

const isSkipLocationChange = environment.isSkipLocationChange
export interface BSList {
  name: string;
  id: number;
}
export interface CCList {
  name: string;
  id: number;
}
export interface OccupancyList {
  id: number;
  code: string;
  area_occupied:number;
}
export interface primaryOffice {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-occupancyccbs',
  templateUrl: './occupancyccbs.component.html',
  styleUrls: ['./occupancyccbs.component.scss']
})


export class OccupancyccbsComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('prioffice') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;
  @ViewChild('CCInput') CCInput: any;
  @ViewChild('OccupancyInput') OccupancyInput: any;
  @ViewChild('BSInput') BSInput: any;
  public BSList: BSList[];
  public CCList: CCList[];
  public Occupancylist: OccupancyList[];
  primaryData: Array<primaryOffice>;
  isLoading = false;
  occupancyccbsForm: FormGroup;
  bsid: any;
  premiseId: any;
  occupancyccbsid:any;
  has_next = true;
  has_previous = true;
  presentpage: number = 1;
  occupancyId:any;
  occupancyarea:any;
  occupancyCCBSList:any;
  request_Status: any;
  premise_status: any;
  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1;

  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, 
    private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService,
    ) { }

  ngOnInit(): void {

    this.occupancyccbsForm = this.fb.group({
      businesssegment_id: ['', Validators.required],
      costcentre_id: ['', Validators.required],
      occupancy_id: ['', Validators.required],
      branch_id: [],
      area:[]
    });

    this.premiseId = this.remsshareService.premiseViewID.value
    this.request_Status = this.remsshareService.premiseReqStatus.value
    this.premise_status = this.remsshareService.premisesStatus.value
    console.log("this.premiseId", this.premiseId);
    this.getOccupancyCCBSList();

    this.remsService.getMultipleOccupancy(this.premiseId, "")
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Occupancylist = datas;
    })      
    
    this.remsService.getUsageCode("", 1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.primaryData = datas;
    })  

    this.remsService.get_BSListwithpageno( "", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BSList = datas;
      })
    this.occupancyccbsForm.get('occupancy_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getMultipleOccupancy(this.premiseId, value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Occupancylist = datas;
      });   
    this.occupancyccbsForm.get('businesssegment_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.get_BSListwithpageno(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BSList = datas;
      });
    this.occupancyccbsForm.get('costcentre_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.get_CCList(value, this.bsid)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CCList = datas;
      });
    this.occupancyccbsForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primaryData = datas;

      });


  }//ngOnInit

  getccList()
  {
    this.remsService.get_CCList("", this.bsid)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.CCList = datas;
    })
  }

  occupancyCCBSedit(occupancy){
    console.log("occupancyCCBSedit",occupancy)
    this.occupancyccbsid=occupancy.id;
    this.OccupancyInput.nativeElement.value = occupancy.occupancy_details.code;
    this.office1Input.nativeElement.value = occupancy.branch_id.name;
    this.BSInput.nativeElement.value = occupancy.businesssegment_details.name;
    this.CCInput.nativeElement.value = occupancy.costcentre_details.name;
    this.occupancyccbsForm.patchValue({
      businesssegment_id:occupancy.businesssegment_details.id ,
      costcentre_id:occupancy.costcentre_details.id,
      occupancy_id: occupancy.occupancy_details.id,
      branch_id:occupancy.branch_id.id,
      area:occupancy.area
    });
  }
  getOccupancyCCBSList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.remsService.getOccupancyCCBSList(filter, sortOrder, pageNumber, pageSize, this.premiseId)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.occupancyCCBSList = datas;
        let datapagination = results["pagination"];
        this.occupancyCCBSList = datas;
        // for(let i=0; i < this.occupancyList.length; i++){
        //  let number = this.occupancyList[i].occupancy_status
        //   if(number == 2){
        //    this.occu_Status = "Closed"
        //   }
        //   if(number == 1){
        //     this.occu_Status = "Open"
        //   }
        // }
        
        if (this.occupancyCCBSList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      })
  }
  previousClickOccupancyCCBS(){

  }
  nextClickOccupancyCCBS(){

  }
  OccupancyCCBSFormSubmit() {
    this.remsService.OccupancyCCBSFormCreate(this.occupancyccbsForm.value,  this.premiseId,this.occupancyId,this.occupancyccbsid)
    .subscribe(result => {
      let code = result.code
      if (code === "INVALID_MODIFICATION_REQUEST") {
        this.notification.showError("You can not Modify before getting the Approval")
        return false;
      }
      else if (result.id === undefined) {
        this.notification.showError(result.description)
        return false
      }
      else {
        this.notification.showSuccess("Successfully created!...")
        this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details" }, skipLocationChange: isSkipLocationChange });
      }
    },
    error => {     
      this.errorHandler.handleError(error);
     this.SpinnerService.hide();
   });
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details" }, skipLocationChange: isSkipLocationChange });
  }
  priOffScroll() {
    setTimeout(() => {
      if (
        this.matpriofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matpriofficeAutocomplete.panel
      ) {
        fromEvent(this.matpriofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpriofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpriofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpriofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpriofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_prinext === true) {
                this.remsService.getUsageCode(this.office1Input.nativeElement.value, this.pricurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.primaryData = this.primaryData.concat(datas);
                    if (this.primaryData.length >= 0) {
                      this.has_prinext = datapagination.has_next;
                      this.has_priprevious = datapagination.has_previous;
                      this.pricurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
 
  displayFnBS(bsId: any) {
    if (bsId !== "") {
      this.bsid = bsId;
      return this.BSList.find(bs => bs.id === bsId).name;
    }
  }

  displayFnCC(CCId: any) {
    if (CCId !== "") {
      console.log("this.CCList",this.CCList)
      return this.CCList.find(cc => cc.id === CCId).name;
    }
  }

  displayFnOccupancy(OccupancyId: any) {
    console.log("OccupancyId",OccupancyId);
    if (OccupancyId !== "" && OccupancyId !== undefined) {
      console.log("this.OccupancyList",this.Occupancylist);
      this.occupancyId=OccupancyId;
      this.occupancyarea=this.Occupancylist.find(occ => occ.id === OccupancyId).area_occupied;
      this.occupancyccbsForm.patchValue({
        area:this.occupancyarea
      });
      console.log("this.occupancyarea",this.occupancyarea);
      return this.Occupancylist.find(occ => occ.id === OccupancyId).code;
    }
  }

  displayFNPriOff(priofficeId: any) {
    console.log("priofficeId",priofficeId);
    if (priofficeId !== "" && priofficeId !== null ) {
      console.log("this.primaryData",this.primaryData)
      return this.primaryData.find(p => p.id === priofficeId).name;
    }
  }
  // public displayFnOccupancy(autoOccupancy?: OccupancyList): string | undefined {
  //   return autoOccupancy ? autoOccupancy.code : undefined;
  // }

  // public displayFNPriOff(prioffice?: primaryOffice): string | undefined {
  //   return prioffice ? prioffice.name : undefined;
  // }
}