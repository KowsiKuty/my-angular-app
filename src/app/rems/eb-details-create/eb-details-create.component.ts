import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RemsService } from '../rems.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { RemsShareService } from '../rems-share.service'
import { NgxSpinnerService } from 'ngx-spinner';

import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface ebdetailsidLists {
  circle_name: string;
  id: number;
}
export interface serviceProviderLists {
  name: string;
  id: number;
}

export interface branchList {
  id: number
  region_name: string
  // code:string
}
export interface premiseList {
  id: number
  name: string
  code: string
}

export interface boardtype {
  name: string;
  id: number;
}

export interface statelist {
  id: number;
  name: string;
}

export interface cclistss {
  id: any;
  name: string;
  code: any
}

export interface bslistss {
  id: any;
  name: string;
  code: any
}

export interface occupancy{
  id:any;
  text:string;
}

export interface landloard{
  id:any;
  name:string;
  code:string;
}

export interface occupancydata{
  id:any;
  text:string;
  usage_code_id:{
    name:string
  };

}

@Component({
  selector: 'app-eb-details-create',
  templateUrl: './eb-details-create.component.html',
  styleUrls: ['./eb-details-create.component.scss']
})
export class EbDetailsCreateComponent implements OnInit {
  statedata: any;
  state_has_next = true;
  state_has_previous = true;
  state_presentpage = 1;

  cc_has_next = true;
  ccNameData: any;
  cc_has_previous = true;
  cc_currentpage = 1;


  bsNameData: any;
  catid: any;


  bs_has_next=true;
  bs_currentpage=1;
  bs_has_previous=true;
  premisesid: any;
  premisesdetail:any
  occupancydata: any;
  occupancy_has_next=true;
  occupancy_has_previous=true;
  occupancy_currentpage=1;

  landloarddata: any;
  landloard_has_next=true;
  landloard_has_previous=true;
  landloard_currentpage=1;
  venodordetails: any;

  occupancy: any;
  sitedata: any;
  billcycledropdown: any;


  @HostListener('document:keydown', ['$event']) onkeyboard(event: KeyboardEvent) {

    if (event.code == "Escape") {
      this.spinner.hide();
    }

  }
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput: any;
  @ViewChild('producttype') matAutocompletepremise: MatAutocomplete;
  @ViewChild('closebutton') closebutton;


  @ViewChild('boardinput') boardinput: any;
  @ViewChild('boardtype') boardtype: MatAutocomplete;


  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;


  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;

  @ViewChild('branchContactInput') typeinput: any;
  @ViewChild('branchtype') typeauto: MatAutocomplete;

  

  @ViewChild('supplierinput') supplierinput: any;
  @ViewChild('suppliercode') suppliercode: MatAutocomplete;

  addElectricityForm: FormGroup;
  // stateName = [{ id: 1, name: "Tamil Nadu" }]
  electricityBoard = [{ id: 1, name: "TNEB" }]
  isLoading = false;
  branchlist: any;
  premiselistt: any;
  branch_Id: number;
  array = [];

  board_hasnext = true;
  board_hasprevious = true;
  board_currentpage = 1;

  boarddata: any;

  disableform = true;

  active = false;
  occupancydetails:any

  constructor(private spinner: NgxSpinnerService, private router: Router,  private fb: FormBuilder,
    private notification: NotificationService, private errorHandler: ErrorHandlingServiceService, private toastr:
      ToastrService, private shareService: SharedService,private remservice:RemsService,private remsshareService:RemsShareService) { }

  ngOnInit(): void {

    this.premisesid= this.remsshareService.premiseViewID.value
    console.log('value', this.premisesid)
    console.log('electrictiy maker id', this.premisesid)

    const data = this.remsshareService.ebdetailsEditValue.value
    console.log(this.remsshareService.ebdetailsEditValue.value)

    this.getpremisesdetails(this.premisesid)

    this.addElectricityForm = this.fb.group({

      consumer_state: [''],
      consumer_board: [''],
      region_id: [''],
      premises_id: [''],
      premise_name: [''],
      occupancy_id: [''],
      occupancy_name: [''],
      premise_type: [''],
      personname: [''],
      contactno: ['', Validators.required],
      consumer_no: [''],
      consumer_name: [''],

      supplier_code: [''],
      is_gst: [false],
      cc_id: [''],
      bs_id: [''],

      billingcycle: [''],
      siteid: [''],
      remarks: [''],
      branch_id: [''],
      id: [''],
      makerisactive: [''],
      consumer_status: [''],
      modstatus:[''],
      occupancy_type:[''],
      ownership:[''],
      occupancy_branch_id:['']
    })
    this.getbranchId();

    this.getoccupancydetails();

    this.getoccupancy('',this.occupancy_currentpage=1);
    (data.id)?  this.getconsumerdetailsget(data.id):''
    // (data.id) ? this.getconsumerdetailsget(data.id) : ''
    this.getbillcycledropdown();
  }

  getbranchId() {
    this.remservice.getbranchId()
      .subscribe((results) => {
        this.branch_Id = results.id;
        console.log("branchId", this.branch_Id)
        this.getFindPremises();
      })

  }

  addElectricitySubmit() {


    if (this.addElectricityForm.value.consumer_state == "") {
      this.toastr.error('Please Select State');
      return false;
    }

    if (this.addElectricityForm.value.consumer_state.id == undefined) {
      this.toastr.error('Please Select State from Options');
      return false;
    }

    if (this.addElectricityForm.value.consumer_board  == '' ) {
      this.toastr.error('Please Select Board');
      return false;
    }

    if (this.addElectricityForm.value.consumer_board.id == undefined ) {
      this.toastr.error('Please Select Board from Options');
      return false;
    }

    if (this.addElectricityForm.value.region_id == "") {
      this.toastr.error('Please Select Region ');
      return false;
    }

    if (this.addElectricityForm.value.region_id.id == undefined )  {
      this.toastr.error('Please Select Region from Options');
      return false;
    }

    if (this.addElectricityForm.value.personname == "") {
      this.toastr.error('Please Enter Contact Person ');
      return false;
    }

    // if (this.addElectricityForm.value.contactno == "") {
    //   this.toastr.error('Please Enter Contact Number ');
    //   return false;
    // }

    if (this.addElectricityForm.value.contactno === "") {
      this.toastr.error('Please Enter Contact Number');
      return false;
    }
    // if (this.addElectricityForm.value.contactno.length != 10) {
    //   this.toastr.error('Please Enter Valid Contact Number');
    //   return false;
    // }


    if (this.addElectricityForm.value.consumer_no == "") {
      this.toastr.error('Please Enter Consumer Number ');
      return false;
    }

    if (this.addElectricityForm.value.consumer_name == "") {
      this.toastr.error('Please Valid Consumer No');
      return false;
    }

    if(this.addElectricityForm.value.occupancy_id == ''){
      this.toastr.error('Please Select Occupancy Type ')
      return false;
    }

    if(this.addElectricityForm.value.supplier_code == ''){
      this.toastr.error('Please Select Supplier Name ')
      return false;
    }

    if (this.addElectricityForm.value.supplier_code.id == undefined ) {
      this.toastr.error('Please Select Supplier Name from options');
      return false;
    }

    if(this.addElectricityForm.value.bs_id == ''){
      this.toastr.error('Please Select BS ')
      return false;
    }

    if (this.addElectricityForm.value.bs_id.id == undefined ) {
      this.toastr.error('Please Select BS from Options');
      return false;
    }

    if(this.addElectricityForm.value.cc_id == ''){
      this.toastr.error('Please Select CC ')
      return false;
    }

    if (this.addElectricityForm.value.cc_id.id == undefined ) {
      this.toastr.error('Please Select CC from Options');
      return false;
    }

    if (this.addElectricityForm.value.billingcycle == "") {
      this.toastr.error('Please Enter Billing Cycle');
      return false;
    }

    // if (this.addElectricityForm.value.siteid == "") {
    //   this.toastr.error('Please Enter Site ID');
    //   return false;
    // }



    // this.addElectricityForm.value.consumer_state = this.addElectricityForm.value.consumer_state.id
    // // this.addElectricityForm.value.consumer_board = this.addElectricityForm.value.consumer_board.id

    // this.addElectricityForm.value.region_id = this.addElectricityForm.value.region_id.id
    // this.addElectricityForm.value.branch_id = this.branch_Id
    // this.addElectricityForm.value.consumer_board = this.addElectricityForm.value.consumer_board.id

    // this.addElectricityForm.value.bs_id= this.addElectricityForm.value.bs_id.id
    // this.addElectricityForm.value.cc_id= this.addElectricityForm.value.cc_id.id
    // this.addElectricityForm.value.supplier_code= this.addElectricityForm.value.supplier_code?.code


   


    let obj={
      "consumer_state": this.addElectricityForm.value.consumer_state.id,
      "consumer_board": this.addElectricityForm.value.consumer_board.id,
      "region_id": this.addElectricityForm.value.region_id.id,
      "premises_id": this.addElectricityForm.value.premises_id,
      "premise_name":this.addElectricityForm.value.premise_name,
      "occupancy_id": this.addElectricityForm.value.occupancy_id,
      "occupancy_name": this.addElectricityForm.value.occupancy_name,
      "premise_type": this.addElectricityForm.value.premise_type,
      "personname": this.addElectricityForm.value.personname,
      "contactno": this.addElectricityForm.value.contactno,
      "consumer_no": this.addElectricityForm.value.consumer_no  ,
      "consumer_name": this.addElectricityForm.value.consumer_name,
      "supplier_code": this.addElectricityForm.value.supplier_code.code,
      "is_gst": this.addElectricityForm.value.is_gst,
      "cc_id": this.addElectricityForm.value.cc_id.id,
      "bs_id": this.addElectricityForm.value.bs_id.id,
      "billingcycle": this.addElectricityForm.value.billingcycle,
      "siteid": this.addElectricityForm.value.siteid,
      "remarks":  this.addElectricityForm.value.remarks,
      "branch_id":this.branch_Id,
      "makerisactive": this.addElectricityForm.value.makerisactive,
      "consumer_status": this.addElectricityForm.value.consumer_status,
      "id":this.addElectricityForm.value.id,
      "occupancy_type":this.addElectricityForm.value.occupancy_type,
      "ownership":this.addElectricityForm.value.ownership,
      "occupancy_branch_id":this.addElectricityForm.value.occupancy_branch_id
    }


    if (this.addElectricityForm.value.id == '' || this.addElectricityForm.value.id == null) {
      delete obj.id
    }

    console.log(obj,this.addElectricityForm.value)

    this.remservice.addElectricity(obj,this.addElectricityForm.value.modstatus)
      .subscribe(result => {

        if(result.id){
          this.notification.showSuccess('Successfully Created')
          this.onCancelClick()

        }
        else if(result.message == "Successfully Updated"){
          this.notification.showSuccess(result.message)
          this.onCancelClick()

        }
        else if(result.code == "DUPLICATE ENTRY"){
          this.notification.showError(result.description)
          // this.onCancelClick()
          this.resetform()
        }
        else{
          this.notification.showError(result)
        }

        // if (result.message == 'Successfully Updated') {
        //   this.notification.showSuccess('Successfully Updated')
        //   this.router.navigate(['tneb/electricityexpense/electricitySummary'], { skipLocationChange: true })

        // }
        // else if (result.message == 'Successfully Created') {
        //   this.notification.showSuccess('Successfully Created')
        //   this.router.navigate(['tneb/electricityexpense/electricitySummary'], { skipLocationChange: true })

        // }
        // else {
        //   this.notification.showError(result)
        // }

      },
        error => {
          this.errorHandler.handleError(error);
        })

  }

  onCancelClick() {
    this.shareService.submodulestneb.next('');
   this.remsshareService.ebdetailsEditValue.next('');

    // this.router.navigate(['/tneb/electricityexpense/electricitySummary'], { skipLocationChange: true })

    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "EB Details" }, skipLocationChange: true });

  }



  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.addElectricityForm.get('region_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remservice.getregiondata(value, this.addElectricityForm.value.consumer_board.id, 1)
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
        console.log("region", datas)

      })


  }


  private getbranchid(prokeyvalue) {
    this.remservice.getregiondata(prokeyvalue, this.addElectricityForm.value.consumer_board.id, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }


  public displaydiss2(branchtype?: branchList): string | undefined {
    // return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    return branchtype ? branchtype.region_name : undefined;

  }

  // Branch  dropdown

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompleteregion() {

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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.remservice.getregiondata(this.branchContactInput.nativeElement.value, this.addElectricityForm.value.consumer_board.id, this.currentpagebra + 1)
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


  premisename() {
    // let prokeyvalue: String = "";
    // this.getpremiseid(prokeyvalue);
    // this.addElectricityForm.get('premises_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.remservice.getpremisedropdown(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.premiselistt = datas;

    //   })


  }
  private getpremiseid(prokeyvalue) {
    // this.remservice.getpremisedropdown(prokeyvalue, 1)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.premiselistt = datas;

    //   })
  }

  public displaydiss1(producttype?: premiseList): string | undefined {
    return producttype ? "(" + producttype.code + " )" + producttype.name : undefined;

  }

  // Premies dropdown
  currentpagepre: any = 1
  has_nextpre: boolean = true
  has_previouspre: boolean = true
  autocompletePremisenameScroll() {

    // setTimeout(() => {
    //   if (
    //     this.matAutocompletepremise &&
    //     this.autocompleteTrigger &&
    //     this.matAutocompletepremise.panel
    //   ) {
    //     fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(() => {
    //         const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_nextpre === true) {
    //             this.remservice.getpremisedropdown(this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.premiselistt = this.premiselistt.concat(datas);
    //                 if (this.premiselistt.length >= 0) {
    //                   this.has_nextpre = datapagination.has_next;
    //                   this.has_previouspre = datapagination.has_previous;
    //                   this.currentpagepre = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  // popup
  findPremisesList: any;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  ispaymentpage: boolean = true;

  // getFindPremises List
  getFindPremises(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    // this.remservice.findPremises(filter, sortOrder, pageNumber, pageSize, this.branch_Id)
    //   .subscribe((results: any[]) => {
    //     console.log("branchlist", results)
    //     // let datas = results["data"];
    //     this.findPremisesList = results;
    //     // let datapagination = results["pagination"];
    //     // this.findPremisesList = datas;
    //     // if (this.findPremisesList.length === 0) {
    //     //   this.ispaymentpage = false
    //     // }
    //     // if (this.findPremisesList.length > 0) {
    //     //   this.has_paymentnext = datapagination.has_next;
    //     //   this.has_paymentprevious = datapagination.has_previous;
    //     //   this.paymentpresentpage = datapagination.index;
    //     //   this.ispaymentpage = true
    //     // }
      // })
  }

  // nextClickPayment() {
  //   if (this.has_paymentnext === true) {
  //     this.getFindPremises("", 'asc', this.paymentpresentpage + 1, 10)
  //   }
  // }

  // previousClickPayment() {
  //   if (this.has_paymentprevious === true) {
  //     this.getFindPremises("", 'asc', this.paymentpresentpage - 1, 10)
  //   }


  // }

  checkedtrue(data, list) {
    console.log(data)
    console.log(list)
    this.array.push(list)
    console.log("abcd", this.array)
  }


  selectOk() {
    this.addElectricityForm.patchValue({
      "premise_name": this.array[0].premise_name,
      "occupancy_name": this.array[0].usage.occupancy_name,
      "premise_type": this.array[0].premise_ownership.ownership_type,
      "premises_id": this.array[0].premise_id,
      "occupancy_id": this.array[0].usage.id
    })
    this.closebutton.nativeElement.click();
    this.array = [];
    this.getFindPremises();

  }

  clear() {
    this.addElectricityForm.patchValue({
      "premise_name": '',
      "occupancy_name": '',
      "premise_type": '',
      "premises_id": '',
      "occupancy_id": ''
    })
    this.getFindPremises();
    this.array = [];

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  getboard(value, state, page) {
    this.isLoading = true;

    state = (state) ? state : ''

    this.remservice.getstatebasedboard(value, state, page).subscribe(
      result => {
        this.isLoading = false;

        this.boarddata = result['data'];
        let datapagination = result['pagination']
        console.log(result)

        if (this.boarddata.length >= 0) {
          this.board_hasnext = datapagination.has_next;
          this.board_hasprevious = datapagination.has_previous;
          this.board_currentpage = datapagination.index;
        }

      })
  }

  public displaywithboard(boardtype?: boardtype): string | undefined {
    return boardtype ? boardtype.name : undefined;

  }

  autoboardscroll() {
    setTimeout(() => {
      if (
        this.boardtype &&
        this.autocompleteTrigger &&
        this.boardtype.panel
      ) {
        fromEvent(this.boardtype.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.boardtype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.boardtype.panel.nativeElement.scrollTop;
            const scrollHeight = this.boardtype.panel.nativeElement.scrollHeight;
            const elementHeight = this.boardtype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.board_hasnext === true) {
                this.remservice.getebboard(this.boardinput.nativeElement.value, this.board_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];

                  console.log(results)
                  this.boarddata = this.boarddata.concat(datas);

                  if (this.boarddata.length >= 0) {
                    this.board_hasnext = datapagination.has_next;
                    this.board_hasprevious = datapagination.has_previous;
                    this.board_currentpage = datapagination.index;
                  }
                })
              }
            }
          });
      }
    });
  }

  getconsumerdetails(value) {
    this.spinner.show()

    this.remservice.getconsumerdetail(value)
      .subscribe((results: any[]) => {

        this.spinner.hide()


        let datas = results["data"];
        console.log(results)
        this.premiselistt = datas;

        this.addElectricityForm.patchValue({
          "premise_name": datas[0]?.premise_name,
          "occupancy_name": datas[0]?.occupancy_type[0]?.usage?.text,
          "premise_type": datas[0]?.premise_type?.text,
          "premises_id": datas[0]?.id,
          "occupancy_id": datas[0]?.occupancy_type[0]?.usage?.id,
        })


      })

  }

  getstatelist(value, page) {

    this.remservice.getstate(value, page).subscribe(
      result => {

        this.statedata = result['data']
        let dataPagination = result['pagination']
        if (this.statedata.length >= 0) {
          this.state_has_next = dataPagination.has_next;
          this.state_has_previous = dataPagination.has_previous;
          this.state_presentpage = dataPagination.index;
        }


      }
    )

  }


  public displaystate(data?: statelist): string | undefined {
    return data ? data.name : undefined;
  }

  statescroll() {
    setTimeout(() => {
      if (
        this.typeauto &&
        this.autocompleteTrigger &&
        this.typeauto.panel
      ) {
        fromEvent(this.typeauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.typeauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.typeauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.typeauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.typeauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.state_has_next === true) {
                this.remservice.getstate(this.typeinput.nativeElement.value, this.currentpagebra+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.statedata = this.statedata.concat(datas);
                    if (this.statedata.length >= 0) {
                      this.state_has_next = datapagination.has_next;
                      this.state_has_previous = datapagination.has_previous;
                      this.state_presentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  getconsumerdetailsget(value) {



    this.spinner.show()
    this.remservice.getparticularelectricityconsumer(value).subscribe(
      result => {
        this.spinner.hide()
        console.log('before edlectricity form',this.addElectricityForm.value)


        let data = result
        console.log("EBeditvalue====>",result)
        // this.disableform = data?.maker
        let consumerdetails=this.remsshareService.ebdetailsEditValue.value
        console.log('consymer transfer',consumerdetails,consumerdetails.maker)
        this.disableform = (consumerdetails.maker == false)? false:true
        console.log('consumer bool check',consumerdetails.maker == false)
        console.log('disableform',this.disableform,'datas',result)
        // this.active=data?.makerisactive == 1? true:false

        // this.getconsumerdetails(123)


        // this.getvendordetails(data?.supplier_code?.vendor_id,data?.supplier_code?.id)

        if (!data?.maker) {
          this.getdisableform()
        }
        this.addElectricityForm.patchValue({
          consumer_state: data?.consumer_state,
          consumer_board: data?.consumer_board,
          region_id: data?.region_id,
          personname: data?.personname,
          contactno: data?.contactno,
          consumer_no: data?.consumer_no,
          consumer_name: data?.consumer_name, 
          billingcycle: data?.billingcycle?.id,
          siteid: data?.siteid,
          remarks: data?.remarks,
          branch_id: data?.branch_id?.id,
          id: data?.id,
          makerisactive: data?.makerisactive == 1 ? true : false,
          consumer_status: data?.consumer_status,
          supplier_code: data?.supplier_code,
          is_gst: data?.is_gst,
          cc_id: data?.cc_id,
          bs_id: data?.bs_id,
          occupancy_id:+data?.occupancy_id?.id,
          occupancy_name:data?.occupancy_id?.usage,
          occupancy_type: data?.occupancy_type,
          ownership: data?.ownership,
          premise_type: data?.occupancy_id?.ownership_type?.text,
          occupancy_branch_id:data?.occupancy_branch_id
          
        })

        console.log('after edlectricity form',this.addElectricityForm.value)

      },(error)=>{
        this.spinner.hide()
  
      }
    )

  }

  consumervalidation() {

    if (this.addElectricityForm.value.contactno != '' && this.addElectricityForm.value.contactno != null &&
      this.addElectricityForm.value.consumer_no != '' && this.addElectricityForm.value.consumer_no != null &&
      this.addElectricityForm.value.contactno.length == 10 ) {

      let obj = {
        "consumer_no": this.addElectricityForm.value.consumer_no,
        "contactno": this.addElectricityForm.value.contactno
      }

      this.spinner.show()
      this.remservice.tnebconsumervalidation(obj).subscribe(
        result => {
          this.spinner.hide()

          console.log(result)
          if (result?.validation_status && result?.validation_status.out_msg.MININFO != 'Invalid Consumer' && result?.validation_status?.bpms_error_msg != "Failed" ) {

            this.addElectricityForm.patchValue({
              "consumer_name": result?.validation_status?.out_msg?.CNAME
            })

            if(result?.validation_status?.out_msg?.STATUS == "K"){
              this.notification.showSuccess('Consumer Number validated')
            }
            else{
            this.notification.showSuccess('Consumer Number validated.')
            }


          }
          else {
            this.notification.showError('Consumer Number validation failed')
          }


          // this.getconsumerdetails(123)

        })

    }
  }

  getdisableform() {
    // this.addElectricityForm.disable();
  }


  activatetoggle() {

    console.log('before', this.addElectricityForm.value.makerisactive)

    let status = (this.addElectricityForm.value.makerisactive) ? 1 : 0

    console.log('after', this.addElectricityForm.value.makerisactive)

    // this.remservice.getconsumeractivated(this.addElectricityForm.value.id,status).subscribe(
    //   result => {
    //     console.log(result)
    //     if (result.status == 'success') {
    //       if (this.addElectricityForm.value.makerisactive) {
    //         this.notification.showSuccess('Successfully Activated')
    //       }
    //       else {
    //         this.notification.showSuccess('Successfully Deactivated')
    //       }
    //     }
    //     else {
    //       this.notification.showError(result)
    //       this.addElectricityForm.value.makerisactive = false
    //     }
    //   }
    // )
  }

  approve_reject_consumer(status) {




    // this.remservice.getconsumerapprove(this.addElectricityForm.value.id, status).subscribe(
    //   result => {
    //     console.log(result)
    //     if (result.status == 'success') {
    //       if (status == 1) {
    //         this.notification.showSuccess('Successfully Approved')
    //         this.router.navigate(['tneb/electricityexpense/electricitySummary'], { skipLocationChange: true })
    //       } else if (status == 0) {
    //         this.notification.showSuccess('Successfully Rejected')
    //         this.router.navigate(['tneb/electricityexpense/electricitySummary'], { skipLocationChange: true })
    //       }
    //       else {
    //         this.notification.showError(result)
    //       }


    //     }
    //     else {
    //       this.notification.showError(result)
    //     }
    //     // if(result.status == 'success'){
    //     //   this.notification.showSuccess(result.status)
    //     // }
    //     // else{
    //     //   this.notification.showError(result)
    //     //   this.addElectricityForm.value.makerisactive=false
    //     // }
    //   }
    // )
  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.cc_has_next === true) {
                this.remservice.getccscroll(this.addElectricityForm.value.bs_id.id, this.ccInput.nativeElement.value, this.cc_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
                      this.cc_has_next = datapagination.has_next;
                      this.cc_has_previous = datapagination.has_previous;
                      this.cc_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  ccget( value, page) {

    let bsid=this.addElectricityForm.value.bs_id.id;

if(bsid){

}
else{
  return false
}
    this.remservice.getccscroll( bsid,value, page)
      .subscribe((results: any[]) => {
        this.ccNameData = results['data']
        let datapagination = results["pagination"];
        if (this.ccNameData.length >= 0) {

          this.cc_has_next = datapagination.has_next;
          this.cc_has_previous = datapagination.has_previous;
          this.cc_currentpage = datapagination.index;
        }
      })
    }

    public displayccFn(cctype?: cclistss): string | undefined {
      return cctype ? cctype.name : undefined;
    }

    getbs(bskeyvalue) {
      this.remservice.getbs(bskeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsNameData = datas;
          this.catid = datas.id;
          let datapagination=results['pagination']
          if (this.bsNameData.length >= 0) {
         
            this.bs_has_next = datapagination.has_next;
            this.bs_has_previous = datapagination.has_previous;
            this.bs_currentpage = datapagination.index;
          }
         
        })
    }

    public displaybsFn(bstype?: bslistss): string | undefined {
      return bstype ? bstype.name : undefined;
    }

    bsScroll() {
      setTimeout(() => {
        if (
          this.matbsAutocomplete &&
          this.matbsAutocomplete &&
          this.matbsAutocomplete.panel
        ) {
          fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.bs_has_next === true) {
                  this.remservice.getbsscroll(this.bsInput.nativeElement.value, this.bs_currentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.bsNameData.length >= 0) {
                        this.bsNameData = this.bsNameData.concat(datas);
                        this.bs_has_next = datapagination.has_next;
                        this.bs_has_previous = datapagination.has_previous;
                        this.bs_currentpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }

    getpremisesdetails(value){
      console.log(this.remsshareService.premiseViewID.value)
      this.remservice.getPremiseView(value).subscribe(
        result =>{
          this.premisesdetail=result

          this.addElectricityForm.patchValue({
            
            premise_name:this.premisesdetail?.name,
            premise_type:this.premisesdetail?.type?.text,
            premises_id:this.premisesdetail?.id,
            modstatus:(this.premisesdetail.premise_status == 'DRAFT' && this.premisesdetail.requeststatus == 'MODIFICATION' )? 2:1
          })
        }
      )
    }

    getoccupancy(value,page){
      this.remservice.getoccupancydatas(value,page).subscribe(
        result =>{
          this.occupancydata=result['data']
          let datapagination=result['pagination']

          // if (this.occupancydata.length >= 0) {
           
          //   this.occupancy_has_next = datapagination.has_next;
          //   this.occupancy_has_previous = datapagination.has_previous;
          //   this.occupancy_currentpage = datapagination.index;
          // }
        }
      )
    }

    autocompletesupplier(){
      setTimeout(() => {
        if (
          this.suppliercode &&
          this.autocompleteTrigger &&
          this.suppliercode.panel
        ) {
          fromEvent(this.suppliercode.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.suppliercode.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(()=> {
              const scrollTop = this.suppliercode.panel.nativeElement.scrollTop;
              const scrollHeight = this.suppliercode.panel.nativeElement.scrollHeight;
              const elementHeight = this.suppliercode.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.state_has_next === true) {
                  this.remservice.getsuppliercode(this.supplierinput.nativeElement.value, this.currentpagebra+ 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.landloarddata = this.landloarddata.concat(datas);
                      if (this.landloarddata.length >= 0) {
                        this.landloard_has_next = datapagination.has_next;
                        this.landloard_has_previous = datapagination.has_previous;
                        this.landloard_currentpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }

    public displayoccupancy(data?: occupancy): string | undefined {
      return data ? data.text : undefined;
    }

    getoocupancyid(value){
      this.addElectricityForm.patchValue({
        occupancy_name:value.text
      })
    }
  
    getlandloarddetails(value,page){
      

      this.remservice.getsuppliercode(value,page).subscribe(
        result =>{
          this.landloarddata=result['data']
          let datapagination=result['pagination']

          if (this.landloarddata.length >= 0) {
           
            this.landloard_has_next = datapagination.has_next;
            this.landloard_has_previous = datapagination.has_previous;
            this.landloard_currentpage = datapagination.index;
          }
        }
      )

    }

    

    public displaylandloard(data?: landloard): string | undefined {
      return data ? "(" + data.code + ") " + data.name : undefined;
    }


    getvendordetails(vendorid,branchid){

      this.addElectricityForm.patchValue({
        is_gst:false
      })

      this.remservice.getVendor(vendorid,branchid).subscribe(
        result=>{
         this.venodordetails=result
         if(this.addElectricityForm.value.supplier_code?.gstno != ''){
          this.addElectricityForm.patchValue({
            is_gst:true
          })
         }
        })
    }

    stateselection(){
      this.addElectricityForm.patchValue({
        consumer_board:'',
        region_id:''
      })
    }

    boardselect(){
      this.addElectricityForm.patchValue({
        
        region_id:''
      })
    }

    bsselect(){
      this.addElectricityForm.patchValue({
        cc_id:''
      })
    }


    getoccupancydetails(){
      this.remservice.getpremisesoccupancy(this.premisesid).subscribe(
        result =>{
          this.occupancy=result['data']
          let datapagination=result['pagination']
          //   if (this.occupancy.length >= 0) {
           
          //   this.occupancy_has_next = datapagination.has_next;
          //   this.occupancy_has_previous = datapagination.has_previous;
          //   this.occupancy_currentpage = datapagination.index;
          // }
        }
      )
    }

    public displayoccupancydata(data?: occupancydata): string | undefined {
      return data ? data.usage_code_id.name : undefined;
    }

    occupancyselect(value){
      console.log("values===>",value)
      // this.getsiteid(value.id)

      this.addElectricityForm.patchValue({
        "occupancy_name":value.usage,
        "occupancy_type": value?.occupancy_type_id,
        "ownership": value?.ownership_type_id,
        "occupancy_branch_id": value?.branch_id,

      });
      console.log('occupancy branch',this.addElectricityForm.value.branch_id);
    }

    getsiteid(id){
      this.remservice.getoccupancysiteids(id).subscribe(
        result=>{

          let data=''

          result['data'].forEach(element => {
              data =data+element.terminal_id+', '
          });
        console.log('site data',data)
          this.addElectricityForm.patchValue({
            siteid:data
          })
      
          
      })
    }

    resetform(){
      this.addElectricityForm.patchValue({
        // consumer_state: '',
        // consumer_board: '',
        // region_id: '',
        // // premises_id: '',
        // // premise_name: '',
        // occupancy_id: '',
        // occupancy_name: '',
        // // premise_type: '',
        // personname: '',
        // contactno: '',
        consumer_no: '',
        consumer_name:'',
  
        // supplier_code: '',
        // is_gst: false,
        // cc_id: '',
        // bs_id: '',
  
        // billingcycle: '',
        // siteid: '',
        // remarks: '',
        // // branch_id: '',
        // // id: '',
        // makerisactive: '',
        // consumer_status: '',
        // // modstatus:''
      })
    }

    getbillcycledropdown(){
      this.remservice.getbillcycledropdown().subscribe(
        result=>{
          this.billcycledropdown=result['data']
        }
      )
    }

  }