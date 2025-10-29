import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { DataService } from '../inward.service'
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorExceptionService } from '../error-exception.service';
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ActivatedRoute } from '@angular/router';
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
export interface channelListss {
  id: any;
  name: string;
}
export interface courierListss {
  id: any;
  name: string;
}
// export interface courierlistss {
//   code: string
//   name: string
//   id: string
// }
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface reportbranchlistss {
  id: any;
  code: string;
  name: string;
  fullname:string;
}
export interface listss {
  id: any;
  code: string;
  name: string;
}
export interface depttypelistss {
  id: any
  code: any
  name: any
}
export interface refdeptlistss {
  id: any;
  code: string;
  name: string;
  fullname: any;
  branch_id:any;
}
export interface Emplistss {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-inward-summary',
  templateUrl: './inward-summary.component.html',
  styleUrls: ['./inward-summary.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InwardSummaryComponent implements OnInit {

  InwardMenuList: any
  urls: string;
  statusselected1: any='Update';
  urlinwardSummary;
  urlinwarddetailsSummary;
  isinwardsummary: boolean
  // isinwardsummary = true
  issummaryreportpage:boolean
  isinwarddetailsummary: boolean
  urlinwardDocAssignSummary;
  isemployee:boolean=true
  urlinwardDocResponseSummary
  urlinwardreportSummary
  isinwardDocumentAssign: boolean
  isinwardDocumentResponse: boolean
  // isinwardDocumentResponse=true
  ismakerCheckerButton: boolean;
  statusselected: any='All';
  roleValues: string;
  addFormBtn: any;
  ischanged:boolean=false
  isinwardAdd: boolean;
  isinwarddetail: boolean;
  InwardDocAssignSummarySearchForm: FormGroup
  InwardDocResponsesummarySearchForm: FormGroup

  InwardDocAssignSummaryList: any
  InwardDocResponseSummaryList: any

  InwardDetailSummarySearchForm: FormGroup
  inwardSummaryList: Array<any>
  InwardDetailSummaryList: any
  InwardsummarySearchForm: FormGroup
  Inwardreport:FormGroup
  has_next = true;
  has_previous = true;
  has_nextdet = true;
  has_previousdet = true;
  currentpage: number = 1;
  reportpage: number = 1
  currentpagedet: number = 1;
  isLoading: boolean=false;
  isinwardreport:boolean
  ChannelList: any
  CourierList: any = [];
  branchList: Array<branchlistss>;
  reportbranchList: Array<reportbranchlistss>;

  List: Array<listss>;
  pageSize = 10
  has_nextDocAssign = true;
  has_previousDocAssign = true;
  has_nextDocResponse = true;
  has_previousDocResponse = true;
  currentpageDocAssign: number = 1;
  currentpageDocResponse: number = 1;
  employeeList: Array<Emplistss>;
  imageUrl = environment.apiURL
  todayy = new Date();




  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('Channel') matChannelAutocomplete: MatAutocomplete;
  @ViewChild('channelInput') channelInput: any;

  @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
  @ViewChild('CourierInput') CourierInput: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('branchauto') branchAutocomplete: MatAutocomplete;
  @ViewChild('Input') Input: any;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  @ViewChild('refdept') matrefdeptAutocomplete: MatAutocomplete;
  @ViewChild('refdeptInput') refdeptInput: any;

  @ViewChild('reportbranch') matreportbranchAutocomplete: MatAutocomplete;
  @ViewChild('reportbranchInput') reportbranchInput: any;

  @ViewChild('refdeptAss') matrefdeptAssign: MatAutocomplete;
  @ViewChild('refdeptInputAss') refdeptInputAss: any;

  @ViewChild('refdeptRes') matrefdeptResponse: MatAutocomplete;
  @ViewChild('refdeptInputRes') refdeptInputRes: any;

  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('fileInputResponse', { static: false }) fileInputResponse: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closepopup') closepopup : ElementRef  ;
  @ViewChild('comments') firstModal : ElementRef  ;
  @ViewChild('files') secondModal : ElementRef  ;
  @ViewChild('imageModal') thirdModal : ElementRef  ;
  @ViewChild('pdfModal') pdfModal : ElementRef  ;
  @ViewChild('closeassignpopup') closeassignpopup;
  @ViewChild('closeresponsepopup') closeresponsepopup;



  
  typefilter: any[] = [
    { value: 1, display: 'All' },
    { value: 2, display: 'Assigned' },
    { value:3, display: 'Unassigned',}
  ]

  headerfilter:any[]=[
    { value: 1, display: 'Type' },
    { value: 2, display: 'Status' },
  ]

  docstatus:any[] =[
    {value:1, display:'Open'},
    {value:2, display:'Pending'},
    {value:3, display:'Closed'},
    {value:4, display:'Reopen'},
    {value:5, display:'Return'},

  ]
  ifyes:boolean=false
  maxDate:string
  Comments: FormGroup
  BulkUpdate: FormGroup
  PresentLoginEmployeeId: any
  PresentLoginEmployeeName: any
  EmployeeviewMode: any;
  totalcount: any;
  inwardpresentpage: number;
  issummarypage: boolean = true;
  branchsingle:boolean
  branchmulti:boolean
  totalcountindet: any;
  inwarddetpresentpage: any;
  issummarypageindet: boolean;
  inwarddocassignpresentpage: number;
  totalcountdocassign: any;
  issummarypagedocassign: boolean;
  inwarddocrespresentpage: number;
  totalcountdocres: any;
  issummarypagedocres: boolean;
  isbranch:boolean=false
  docUrl: string;
  viewclick: boolean=false;
  inwardtranspresentpage: number=1;
  totalcounttrans: any;
  transpresentpage: any;
  datatrans: any;
  issummarypagetrans: boolean;
  employeename: any;
  branchcode: any;
  designation: any;
  assigndept_id: any;
  getreportList: any;
  totalcountreport: any;
  selectedOption: any = 1;   
  type: any;
  docstatus1: string;
  actionType1: any;
  statusdata: any;
  currentstatus: any;
  previoudstatus: any;
  statusname: string;
  inwardeditprntpage: any;
  pageno: any=1;
  headerId: any;
  datatype: any;
  // loginemployeeId: string;
  single: any;
  selectedactiontype: any;
  actionTypeid: any;
  issave:boolean=false
  ResponseTranHistoryArray: unknown[];
  displayedRecords: any[] = [];

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  file_name: any;
  activeTab: any;
  has_nextt: boolean = true;
  has_previouss: any;
  currentpages: any;
  currentpageCourier: number = 1;
  has_nextCourier: boolean = true;
  has_previousCourier: boolean = true;
  currentpageCourier2: number = 1;
  has_nextCourier2: boolean = true;
  has_previousCourier2: boolean = true;
  currentpageCourier3: number = 1;
  has_nextCourier3: boolean = true;
  has_previousCourier3: boolean = true;
  commentpopup: boolean = false;
  popoverVisible: boolean;
  selectedComment: any;
  responseDueDate: Date;
  formatedDate: string;
  formattedDate: string;
  pendingreassign: boolean = false;
  pendingreassignindexx: any;
  inwardlist: any[];
  oldassigndata: any[];
  inwardlistres: any[];
  selectedempreassign: any;
  minDate: any;
  showReassignHeader: any;
  showReassignHeaderres: any;
  RefDeptAssign: FormGroup;
  RefDeptResponse: FormGroup;

  constructor(private dataService: DataService, private MainshareService: SharedService, private router: Router, private shareService: ShareService, private fb: FormBuilder, private datePipe: DatePipe,
    private notification: NotificationService,private SpinnerService: NgxSpinnerService,  private renderer: Renderer2, private errorHandler: ErrorExceptionService,private modalService: NgbModal) {
      this.responseDueDate = null;

     }
  ngOnInit(): void {


    // this.activateroute.queryParams.subscribe(
    //   params => {
    //     console.log('logs', params)

    //     if (params['actionTypeid']) {
    //       // this.vendorObjs.vendorid = params['vendorid'];
    //       this.actionTypeid = params['actionTypeid'];

    //       // console.log('vendorid', this.vendorObjs.vendorid)
    //       console.log('actionTypeid', params['vendorid'])
    //     }
    //      })
    //  if(this.actionTypeid == 4){
    //   this.isinwardDocumentAssign = false;
    //   this.isinwardDocumentResponse = true;
    //   this.ismakerCheckerButton = false;
    //   this.isinwardAdd = false;
    //   this.isinwarddetail = false;
    //   this.isinwardsummary = false;
    //   this.isinwarddetailsummary = false;
    //   this.getInwardDocResponsesummary('')
    //   this.DivShow = false
    //   this.Comments.reset("")
    //   let fileresponselength = this.filearrayResponse
    //   if (fileresponselength.length > 0) {
    //     this.filearrayResponse = []
    //     this.fileInputResponse.nativeElement.value = "";

    //   }
    //  }
    this.minDate = new Date();
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    let datas = this.MainshareService.menuUrlData;
    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Branch Inward") {
        this.InwardMenuList = subModule;
        console.log("InwardMenuList", this.InwardMenuList)
        if (this.InwardMenuList.length!=0){
          // this.activeTab = this.InwardMenuList[0];
          console.log("acttab",this.activeTab)
          // this.subModuleData(this.activeTab)
          
        }
      }
    })

    this.RefDeptAssign = this.fb.group({
      assigndept_id : ['']
    })
    this.RefDeptResponse = this.fb.group({
      assigndept_id : ['']
    })
    this.InwardsummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      inwardfrom: [''],
      courier_id: [''],
      awb_no: [''],
      inward_no: '',
      docnumber: '',
    })
    this.Inwardreport = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      inwardfrom: [''],
      courier_id: [''],
      awb_no: [''],
      docstatus: [''],                                                      
      doctype_id:[''],
      assign_branchfrom:[''],
      assign_deptto:[''],
      docsubject:'',        
      inward_no: '',
      docnumber: '',
    })

    this.InwardDetailSummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      inwardfrom: [''],
      branch_id: [''],
      inward_no: '',
      docnumber: ''
    })

    this.InwardDocAssignSummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      assigndept_id:[''],
      courier_id: [''],
      awb_no: [''],
      doctype_id: [''],
      docstatus: [''],
      branch_id: [''],
      assignedto: [3],
      inward_no: '',
      docnumber: '',
      docsubject:''  ,      //5023
      radio:[1]

    })

    this.InwardDocResponsesummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      courier_id: [''],
      awb_no: [''],
      doctype_id: [''],
      docstatus: [2],
      branch_id: [''],
      // assignedto: [''],
      inward_no: '',
      docnumber: '',
      docsubject:'' //9275
    })

    this.Comments = this.fb.group({
      comment: ''
    })

    this.BulkUpdate = this.fb.group({
      assigndept_id: '',
      actiontype: '',
      docaction:'',
      assignremarks:'',
      tenor: '',
      due_date:'',
      response_due_date:'',
      assignemployee_id: '',
      selectedEmployees: new FormArray([]),
      filearray : new FormArray([])
    })
    this.getbranchFK();
    this.InwardDetailSummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
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
        // Set the value of the second dropdown to 'ALL'
    // this.InwardDetailSummarySearchForm.get('assignedto').setValue('ALL');
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.InwardDocAssignSummarySearchForm.get('assigndept_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getassignDeptFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.refdeptList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
      this.BulkUpdate.get('assigndept_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getassignDeptFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.refdeptList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.InwardDocAssignSummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
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
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  

    this.InwardDocResponsesummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
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
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.Inwardreport.get('assign_branchfrom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        // switchMap(value => this.dataService.getassignDeptFK(value, 1)
        switchMap(value => this.dataService.getassignbranch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.reportbranchList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.Inwardreport.get('assign_deptto').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getassignDeptFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.List = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.getChannelFK();
    // this.getCourierFK();
    this.getbranchFK();
    this.actionType();
    this.Statusdd();
    this.docstatusDD();
    // this.getemployeeFKData();
    this.docAssignUnAssignstatusDD();
    this.docAssignUnAssignstatusDDResponse();
    this.getSearchstatusList();
    this.getSearchstatusListresponse();

    // this.getChannelFK();
    // this.getCourierFK();
    // this.getbranchFK();
    // this.getInwardsummary('');
    // this.getInwardDocResponsesummary('')
 // Check if any item in the list has the status 'Pending'
 this.showReassignHeader = this.InwardDocAssignSummaryList.some(inward => inward?.docstatus === 'Pending');
 this.showReassignHeaderres = this.InwardDocResponseSummaryList.some(inward => inward?.docstatus === 'Update');

 

  }
  openFirstModal() {
    const modalRef = this.modalService.open(this.firstModal, { 
      windowClass: 'modal-large modal-stack' 
    });
    modalRef.result.finally(() => {
      document.body.classList.remove('modal-stack');
    });
    document.body.classList.add('modal-stack');
  }

  openSecondModal() {
    const modalRef = this.modalService.open(this.secondModal, { 
      windowClass: 'modal-small modal-stack' 
    });
    modalRef.result.finally(() => {
      document.body.classList.remove('modal-stack');
    });
    document.body.classList.add('modal-stack');
  }
  
  openThirdModal() {
    const modalRef = this.modalService.open(this.thirdModal, { 
      windowClass: 'modal-image modal-stack' 
    });
    modalRef.result.finally(() => {
      document.body.classList.remove('modal-stack');
    });
    document.body.classList.add('modal-stack');
  }
  openPdfModal() {
    const modalRef = this.modalService.open(this.pdfModal, { 
      windowClass: 'modal-pdf modal-stack' 
    });
    modalRef.result.finally(() => {
      document.body.classList.remove('modal-stack');
    });
    document.body.classList.add('modal-stack');
  }

  subModuleData(data) {
   
    this.activeTab = data;

    this.urls = data.url;
    this.urlinwardSummary = "/inwardsummary";
    this.urlinwarddetailsSummary = "/inwarddetail";
    this.urlinwardDocAssignSummary = "/inwarddocumentAssign";
    this.urlinwardDocResponseSummary = "/inwarddocumentresponse";
    this.urlinwardreportSummary = "/inwardreport";
    this.isinwardDocumentAssign = this.urlinwardDocAssignSummary === this.urls ? true : false;
    this.isinwardDocumentResponse = this.urlinwardDocResponseSummary === this.urls ? true : false;
    this.isinwardsummary = this.urlinwardSummary === this.urls ? true : false;
    this.isinwardreport = this.urlinwardreportSummary === this.urls ? true : false;
    this.isinwarddetailsummary = this.urlinwarddetailsSummary === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;``
    }

    if (this.isinwardsummary) {
      this.isinwardsummary = true;
      this.isinwarddetailsummary = false;
      this.ismakerCheckerButton = true;

      this.isinwardAdd = false;
      this.isinwarddetail = false;

      this.isinwardDocumentAssign = false;
      this.isinwardDocumentResponse = false;
      // this.getInwardsummary('inwardedit');
       this.tabchange_reset()
      this.getInwardsummary('');
    } else if (this.isinwarddetailsummary) {
      this.isinwardsummary = false;
      this.isinwarddetailsummary = true;
      this.ismakerCheckerButton = false;

      this.isinwardAdd = false;
      this.isinwarddetail = false;
      this.isinwardDocumentAssign = false;
      this.isinwardDocumentResponse = false;
       this.tabchange_reset()
      this.getInwardDetailsummary('');
    }

    else if (this.isinwardDocumentAssign) {
      this.isinwardDocumentAssign = true;
      this.isinwardDocumentResponse = false;
      this.ismakerCheckerButton = true;
      this.checkboxShow = false;
      this.isinwardAdd = false;
      this.isinwarddetail = false;
      this.isinwardsummary = false;
      this.isinwarddetailsummary = false;
      this.tabchange_reset()
      this.InwardDocAssignSummarySearchForm.controls['assignedto'].setValue(3)
      this.InwardDocAssignSummarySearchForm.controls['radio'].setValue(1);
      // console.log('radionbuuton value==>',this.InwardDocAssignSummarySearchForm.value.radio)
     
      
      this.getInwardDocAssignsummary('')
    } else if (this.isinwardDocumentResponse) {
      this.isinwardDocumentAssign = false;
      this.isinwardDocumentResponse = true;
      this.ismakerCheckerButton = false;
      this.isinwardAdd = false;
      this.isinwarddetail = false;
      this.isinwardsummary = false;
      this.isinwarddetailsummary = false;
       this.tabchange_reset()
       this.InwardDocResponsesummarySearchForm.controls['docstatus'].setValue(2)
      this.getInwardDocResponsesummary('')
      this.DivShow = false
      this.Comments.reset("")
      let fileresponselength = this.filearrayResponse
      if (fileresponselength.length > 0) {
        this.filearrayResponse = []
        this.fileInputResponse.nativeElement.value = "";

      }
    }
    else if (this.isinwardreport) {
      this.isinwardsummary = false;
      this.isinwarddetailsummary = false;
      this.isinwardDocumentAssign = false;
      this.isinwardDocumentResponse = false
       this.tabchange_reset()
      this.getreportsummary(this.Inwardreport.value,1,this.pageSize);
    }
    

  }

  tabchange_reset(){
    this.InwardsummarySearchForm.reset()
    this.InwardDetailSummarySearchForm.reset()
    this.InwardDocAssignSummarySearchForm.reset({ assignedto: 3, radio: 1 })
    this.InwardDocResponsesummarySearchForm.reset()
    this.Inwardreport.reset()
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Inward Summary

  ////// summary
length_ecf = 0;
pageindex = 0;
pageSizeOptions = [5, 10, 25];
pageSize_ecf=10;
showFirstLastButtons:boolean=true;
handlePageEvent(event: PageEvent) {
    this.length_ecf = event.length;
    this.pageSize_ecf = event.pageSize;
    this.pageindex = event.pageIndex;
    this.inwardpresentpage=event.pageIndex+1;
    let searchInward = this.InwardsummarySearchForm.value
    for (let i in searchInward) {
      if (searchInward[i] === null || searchInward[i] === "") {
        delete searchInward[i];
      }
    }
    this.serviceCallInwardSummary(searchInward,this.inwardpresentpage,this.pageSize_ecf);   //check here
    
  }
  serviceCallInwardSummary(searchInwardSummary, pageno, pageSize) {

    this.SpinnerService.show()
    
    this.dataService.getInwardSummarySearch(searchInwardSummary, pageno)
      .subscribe((result) => {
        this.SpinnerService.hide()
        console.log(" InwardSummary", result)
        let datass = result['data'];
        console.log("Inward Status",datass.inwardstatus);
        this.inwardSummaryList = datass;
                if (result['data'] != undefined) {
          this.length_ecf=result.total_count;
         
          let datapagination = result["pagination"];
          this.totalcount=result.total_count
          if (this.inwardSummaryList.length === 0) {
            this.issummarypage = false
          }
          if (this.inwardSummaryList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.inwardpresentpage = datapagination.index;
            this.issummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.length_ecf=0;
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }
  // serviceCallInwardSummary(searchInwardSummary, pageno, pageSize) {
  //   this.dataService.getInwardSummarySearch(searchInwardSummary, pageno)
  //     .subscribe((result) => {
  //       console.log(" InwardSummary", result)
  //       let datass = result['data'];
  //       let datapagination = result["pagination"];
  //       this.inwardSummaryList = datass;
  //       this.totalcount=result.total_count
  //       console.log(" serviceCallInwardSummary", this.inwardSummaryList)
       
  //       if (this.inwardSummaryList.length > 0) {
  //         this.has_next = datapagination.has_next;
  //         this.has_previous = datapagination.has_previous;
  //         this.currentpage = datapagination.index;

  //       }
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }


  getInwardsummary(hint) {
    let searchInward = this.InwardsummarySearchForm.value
    // if (searchInward.fromdate !== '' && searchInward.todate === '') {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (searchInward.todate !== '' && searchInward.fromdate === '') {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
    if ((searchInward.fromdate != '' && searchInward.fromdate != null && searchInward.fromdate != undefined) && 
        (searchInward.todate == '' || searchInward.todate == undefined || searchInward.todate == null)) {
      this.notification.showError("Please enter 'To date' ")
      return false
    }

    else if ((searchInward.todate != ''  && searchInward.todate != null &&  searchInward.todate != undefined)&& 
    (searchInward.fromdate == '' || searchInward.fromdate == null || searchInward.fromdate == undefined )) {
      this.notification.showError("Please enter 'From date' ")
      return false
    }

    if (searchInward.fromdate != '' || searchInward.fromdate != null || searchInward.fromdate != undefined) {
      searchInward.fromdate = this.datePipe.transform(searchInward.fromdate, 'yyyy-MM-dd')
      searchInward.todate = this.datePipe.transform(searchInward.todate, 'yyyy-MM-dd')
    }
    for (let i in searchInward) {
      if (searchInward[i] === null || searchInward[i] === "") {
        delete searchInward[i];
      }
    }
    console.log("search inward data", searchInward)

    if (hint == 'next') {
      this.serviceCallInwardSummary(searchInward, this.currentpage + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallInwardSummary(searchInward, this.currentpage - 1, 10)
    }
    // if(hint == 'inwardedit'){
    //   if(this.inwardeditprntpage == '' || this.inwardeditprntpage == null || this.inwardeditprntpage == undefined){
    //     this.inwardeditprntpage = 1
    //   }
    //   this.serviceCallInwardSummary(searchInward, this.inwardeditprntpage, 10)
    // }

    else {
      this.serviceCallInwardSummary(searchInward, 1, 10)
    }

  }

  inwardRoute() {
    let dataToShare = ''
    this.shareService.inwardData.next(dataToShare)
    // this.router.navigate(['inward/inwardForm'])
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = true;
    this.isinwarddetail = false;
    return dataToShare
  }


  resetInward() {
    this.InwardsummarySearchForm.reset()
    this.getInwardsummary('');
  }
clearclick(){
  this.Inwardreport.reset()
  this.getreportsummary(this.Inwardreport.value,1,this.pageSize);
}

  editInwardMaker(dataToShare,inwardpresentpage) {
    this.shareService.inwardData.next(dataToShare);
    console.log("Inward SHare",dataToShare);
    // this.router.navigate(['inward/inwardForm'])
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = true;
    this.isinwarddetail = false;
    return dataToShare
    this.inwardeditprntpage=inwardpresentpage
  }


  inwardCreateEditSubmit() {
    // this.getInwardsummary('inwardedit')
    // this.getInwardsummary()
    this.isinwardsummary = true;
    this.isinwarddetailsummary = false;

    this.isinwardAdd = false
    this.isinwarddetail = false
    this.isinwardDocumentAssign = false;
    this.isinwardDocumentResponse = false;
    this.getInwardsummary('')
  }

  inwardCreateEditCancel() {
    this.isinwardAdd = false;
    this.isinwarddetail = false;

    this.isinwardsummary = true;
    this.isinwarddetailsummary = false;
    this.isinwardDocumentAssign = false;
    this.isinwardDocumentResponse = false;
    this.getInwardsummary('')
  }

  resetInwardDetail() {
    this.InwardDetailSummarySearchForm.controls['fromdate'].reset("")
    this.InwardDetailSummarySearchForm.controls['todate'].reset("")
    this.InwardDetailSummarySearchForm.controls['channel_id'].reset("")
    this.InwardDetailSummarySearchForm.controls['branch_id'].reset("")
    this.InwardDetailSummarySearchForm.controls['inward_no'].reset("")
    this.InwardDetailSummarySearchForm.controls['inwardfrom'].reset("")
    this.InwardDetailSummarySearchForm.controls['docnumber'].reset("")
    this.getInwardDetailsummary('')
  }

  //////inward summary detail
  // serviceCallInwardDetailSummary(searchInwardDetail, pageno, pageSize) {
  //   this.dataService.getInwardDetailsearch(searchInwardDetail, pageno)
  //     .subscribe((result) => {
  //       console.log(" InwardDetailSummaryList full list", result)
  //       let datass = result['data'];
  //       let datapagination = result["pagination"];
  //       this.InwardDetailSummaryList = datass;
  //       console.log(" InwardDetailSummaryList", this.InwardDetailSummaryList)
  //       if (this.InwardDetailSummaryList.length > 0) {
  //         this.has_nextdet = datapagination.has_next;
  //         this.has_previousdet = datapagination.has_previous;
  //         this.currentpagedet = datapagination.index;
  //       }
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  length_indet = 0;
pageIndexindet = 0;
pageSizeOptionsindet = [5, 10, 25];
pageSize_indet=10;
showFirstLastButtonsindet:boolean=true;
handlePageEvent1(event: PageEvent) {
    this.length_indet = event.length;
    this.pageSize_indet = event.pageSize;
    this.pageIndexindet = event.pageIndex;
    this.inwarddetpresentpage=event.pageIndex+1;   
    let searchInwardDetail = this.InwardDetailSummarySearchForm.value
    for (let i in searchInwardDetail) {
      if (searchInwardDetail[i] === null || searchInwardDetail[i] === "") {
        delete searchInwardDetail[i];
      }
    }
    this.serviceCallInwardDetailSummary(searchInwardDetail,this.inwarddetpresentpage,this.pageSize_indet);   
    
  }
  serviceCallInwardDetailSummary(searchInwardDetail, pageno, pageSize) {
    this.SpinnerService.show()
    this.dataService.getInwardDetailsearch(searchInwardDetail, pageno)
      .subscribe((result) => {
        console.log(" InwardDetailSummaryList full list", result)
        let datass = result['data'];
        this.InwardDetailSummaryList = datass;
        console.log(" InwardDetailSummaryList", this.InwardDetailSummaryList)
    
                if (result['data'] != undefined) {
          this.length_indet=result.total_count;
         
          let datapagination = result["pagination"];
          this.totalcountindet=result.total_count
          if (this.InwardDetailSummaryList.length === 0) {
            this.issummarypageindet = false
          }
          if (this.InwardDetailSummaryList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.inwarddetpresentpage = datapagination.index;
            this.issummarypageindet = true
          }
          this.SpinnerService.hide()
        } else {
          this.length_indet=0;
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  getInwardDetailsummary(hint) {
    let searchInwardDetail = this.InwardDetailSummarySearchForm.value

    // if (searchInwardDetail.fromdate !== '' && searchInwardDetail.todate === '') {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (searchInwardDetail.todate !== '' && searchInwardDetail.fromdate === '') {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
    // here
    if ((searchInwardDetail.fromdate != '' && searchInwardDetail.fromdate != null && searchInwardDetail.fromdate != undefined) && 
    (searchInwardDetail.todate == '' || searchInwardDetail.todate == undefined || searchInwardDetail.todate == null)) {
    this.notification.showError("Please enter 'To date' ")
    return false
}

else if ((searchInwardDetail.todate != ''  && searchInwardDetail.todate != null &&  searchInwardDetail.todate != undefined)&& 
(searchInwardDetail.fromdate == '' || searchInwardDetail.fromdate == null || searchInwardDetail.fromdate == undefined )) {
  this.notification.showError("Please enter 'From date' ")
  return false
}


    if (searchInwardDetail.fromdate != '' || searchInwardDetail.fromdate != null || searchInwardDetail.fromdate != undefined) {
      searchInwardDetail.fromdate = this.datePipe.transform(searchInwardDetail.fromdate, 'yyyy-MM-dd')
      searchInwardDetail.todate = this.datePipe.transform(searchInwardDetail.todate, 'yyyy-MM-dd')
    }
    for (let i in searchInwardDetail) {
      if (searchInwardDetail[i] === null || searchInwardDetail[i] === "") {
        delete searchInwardDetail[i];
      }
    }

    if (hint == 'next') {
      this.serviceCallInwardDetailSummary(searchInwardDetail, this.currentpagedet + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallInwardDetailSummary(searchInwardDetail, this.currentpagedet - 1, 10)
    }
    else {
      this.serviceCallInwardDetailSummary(searchInwardDetail, 1, 10)
    }

  }


  detailView(data) {
    data = this.shareService.inwardDetailViews.next(data)
    // this.router.navigateByUrl("inward/inwardDetailView", { skipLocationChange: true });
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = false;
    this.isinwarddetail = true;
  }

  InwardDetailCancel() {
    this.isinwardAdd = false;
    this.isinwarddetail = false;

    this.isinwardsummary = false;
    this.isinwarddetailsummary = true;
    this.getInwardDetailsummary('')
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////


  // serviceCallInwardDocAssignSummary(searchInwardSummary, pageno, pageSize) {
  //   this.dataService.getInwardDocAssignSummarySearch(searchInwardSummary, pageno)
  //     .subscribe((result) => {
  //       console.log(" InwardDocAssignSummaryList", result)
  //       let datass = result['data'];
  //       let datapagination = result["pagination"];
  //       this.InwardDocAssignSummaryList = datass;
  //       console.log(" serviceCallInwardSummary", this.InwardDocAssignSummaryList)
  //       if (this.InwardDocAssignSummaryList.length > 0) {
  //         this.has_nextDocAssign = datapagination.has_next;
  //         this.has_previousDocAssign = datapagination.has_previous;
  //         this.currentpageDocAssign = datapagination.index;
  //       }
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  //bug id:6048
  length_docassign = 0;
  pageIndexdocassign = 0;
  pageSizeOptionsdocassign = [5, 10, 25];
  pageSize_docassign=10;
  showFirstLastButtonsdocassign:boolean=true;
  handlePageEvent2(event: PageEvent) {
      this.length_docassign = event.length;
      this.pageSize_docassign = event.pageSize;
      this.pageIndexdocassign = event.pageIndex;
      this.inwarddocassignpresentpage=event.pageIndex+1;   
      let searchInwardDocassign = this.InwardDocAssignSummarySearchForm.value
      for (let i in searchInwardDocassign) {
        if (searchInwardDocassign[i] === null || searchInwardDocassign[i] === "") {
          delete searchInwardDocassign[i];
        }
      }
      this.serviceCallInwardDocAssignSummary(searchInwardDocassign,this.inwarddocassignpresentpage,this.pageSize_docassign);   
      
    }
    serviceCallInwardDocAssignSummary(searchInwardSummary, pageno, pageSize) {
        
      this.SpinnerService.show()
      this.issave = false
        this.dataService.getInwardDocAssignSummarySearch(searchInwardSummary, pageno)
          .subscribe((result) => {
            console.log(" InwardDocAssignSummaryList", result)

        let branch = result["branch_status"]
        if(branch=="Single"){
          this.branchsingle=true
          this.branchmulti=false
        }
        else{
          this.branchsingle=false
          this.branchmulti=true
        }
            let datass = result['data'];
            let datapagination = result["pagination"];
            this.InwardDocAssignSummaryList = datass;
            this.showReassignHeader = this.InwardDocAssignSummaryList.some(inward => inward?.docstatus === 'Pending');

            console.log(" serviceCallInwardSummary", this.InwardDocAssignSummaryList)      
                  if (result['data'] != undefined) {
            this.length_docassign=result.total_count;
           
            let datapagination = result["pagination"];
            this.totalcountdocassign=result.total_count
            if (this.InwardDocAssignSummaryList.length === 0) {
              this.issummarypagedocassign = false
            }
            if (this.InwardDocAssignSummaryList.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.inwarddocassignpresentpage = datapagination.index;
              this.issummarypagedocassign = true
            }
            this.SpinnerService.hide()
          } else {
            this.length_docassign=0;
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
  
        )
    }

  getInwardDocAssignsummary(hint) {

let assignid = this.InwardDocAssignSummarySearchForm.value.assigndept_id
let assigndept_id = typeof assignid

if( (assigndept_id === 'object') && (assignid !=null || assignid !='' || assignid != undefined )){

  this.InwardDocAssignSummarySearchForm.value.assigndept_id = assignid?.id
}
if( (assigndept_id === 'number') && (assignid !=null || assignid != undefined )){

  this.InwardDocAssignSummarySearchForm.value.assigndept_id = assignid
}
let branchid = this.InwardDocAssignSummarySearchForm.value.branch_id

if( branchid !=null || branchid !='' || branchid != undefined ){

  this.InwardDocAssignSummarySearchForm.value.branch_id = branchid?.id
}
    // this.InwardDocAssignSummarySearchForm.value.assigndept_id = this.assigndept_id
    
    // this.InwardDocAssignSummarySearchForm.value.assigndept_id = assignid

    let searchInwardDocAssign = this.InwardDocAssignSummarySearchForm.value
    if(this.InwardDocAssignSummarySearchForm.value.assignedto==""||this.InwardDocAssignSummarySearchForm.value.assignedto==null ||
    this.InwardDocAssignSummarySearchForm.value.assignedto==undefined){
      // this.InwardDocAssignSummarySearchForm.value.assignedto=1
    }
    if(searchInwardDocAssign.assignedto==1 || searchInwardDocAssign.assignedto==2 || (branchid !='' && branchid != null && branchid != undefined) ){
      this.ischanged=true
    }
    else{
      this.ischanged=false
    }
    // if (searchInwardDocAssign.fromdate !== '' && searchInwardDocAssign.todate === '') {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (searchInwardDocAssign.todate !== '' && searchInwardDocAssign.fromdate === '') {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
    // here2

    if ((searchInwardDocAssign.fromdate != '' && searchInwardDocAssign.fromdate != null && searchInwardDocAssign.fromdate != undefined) && 
    (searchInwardDocAssign.todate == '' || searchInwardDocAssign.todate == undefined || searchInwardDocAssign.todate == null)) {
  this.notification.showError("Please enter 'To date' ")
  return false
}

else if ((searchInwardDocAssign.todate != ''  && searchInwardDocAssign.todate != null &&  searchInwardDocAssign.todate != undefined)&& 
(searchInwardDocAssign.fromdate == '' || searchInwardDocAssign.fromdate == null || searchInwardDocAssign.fromdate == undefined )) {
  this.notification.showError("Please enter 'From date' ")
  return false
}


    if (searchInwardDocAssign.fromdate != '' || searchInwardDocAssign.fromdate != null || searchInwardDocAssign.fromdate != undefined) {
      searchInwardDocAssign.fromdate = this.datePipe.transform(searchInwardDocAssign.fromdate, 'yyyy-MM-dd')
      searchInwardDocAssign.todate = this.datePipe.transform(searchInwardDocAssign.todate, 'yyyy-MM-dd')
    }
   
    for (let i in searchInwardDocAssign) {
      if (searchInwardDocAssign[i] === null || searchInwardDocAssign[i] === "") {
        delete searchInwardDocAssign[i];
      }
    }
    console.log("search inward data", searchInwardDocAssign)

    if (hint == 'next') {
      this.serviceCallInwardDocAssignSummary(searchInwardDocAssign, this.currentpageDocAssign + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallInwardDocAssignSummary(searchInwardDocAssign, this.currentpageDocAssign - 1, 10)
    }
    else {
      this.serviceCallInwardDocAssignSummary(searchInwardDocAssign, 1, 10)
    }

  }
  getbranchdata(){
    this.ischanged=true
  }
  resetInwardDocAssign() {
    this.InwardDocAssignSummarySearchForm.controls['fromdate'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['todate'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['channel_id'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['branch_id'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['courier_id'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['docstatus'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['awb_no'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['doctype_id'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['assignedto'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['assigndept_id'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['inward_no'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['docnumber'].reset("")
    this.InwardDocAssignSummarySearchForm.controls['docsubject'].reset("")  //5023
    this.InwardDocAssignSummarySearchForm.controls['assignedto'].setValue(3)
    this.InwardDocAssignSummarySearchForm.controls['radio'].setValue(1);


  }

  onFileSelected(e, outerindex, innerdata) {
    console.log("e in file", e)
    console.log("outerindex in file", outerindex)
    console.log("innerdata in file", innerdata)


    let datavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      innerdata.filearray.push(e.target.files[i])
    }
  }

  onbulkFileSelected(e) {
    console.log("e in file", e)
    // console.log("outerindex in file", outerindex)
    // console.log("innerdata in file", innerdata)


    let datavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      // innerdata.filearray.push(e.target.files[i])
      //  let formArrayForEmployees = this.BulkUpdate.value.selectedEmployees 
      this.BulkUpdate.value.filearray.push(e.target.files[i])

    }
  }


  deleteFileOnParticular(outerindex, innerdata) {

    console.log("outerindex in file", outerindex)
    console.log("innerdata in file", innerdata)
    innerdata.filearray = []

    console.log(" this. fileinput", this.fileInput.toArray())
    let filesValue = this.fileInput.toArray()
    let filesValueLength = filesValue.length

    for (let i = 0; i < filesValueLength; i++) {
      filesValue[i].nativeElement.value = ""
      console.log("filesValue[i].nativeElement.value", filesValue[i].nativeElement.value)


    }



  }

  deleteInlineFile(innerdata, indexouter, fileindex) {

    console.log("innerdata", innerdata)
    console.log("indexouter", indexouter)
    console.log("fileindex", fileindex)
    let filedata = innerdata.filearray
    console.log("filedata for delete before", filedata)
    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)

  }
  
  deletebulkInlineFile(fileindex) {

    // console.log("innerdata", innerdata)
    // console.log("indexouter", indexouter)
    console.log("fileindex", fileindex)
    // let filedata = innerdata.filearray
    let filedata = this.BulkUpdate.value.filearray
    console.log("filedata for delete before", filedata)
    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)

  }


  savedataDocAssign(data, index) {

    console.log("submit data for API", data)
    console.log("Index data for API", index)
this.SpinnerService.show();

    if (typeof data.assigndept_id == 'string') {
      this.notification.showWarning("Please Select Ref Dept from Dropdown")
      return false
    }
    if (typeof data.assignemployee_id == 'string') {
      this.notification.showWarning("Please Select Assign Employee from Dropdown")
      return false
    }

    let idData = data.id
    let dataToSubmit = {
      "id": [idData],
      "actiontype": data.actiontype,
      "tenor": data.tenor,
      "response_due_date": data.response_due_date,
      "assigndept_id": data.assigndept_id.id,
      "assignemployee_id": data.assignemployee_id.id,
      "docaction": data.docaction,
      "docstatus": data.docstatus,
      "assignremarks": data.assignremarks,
      "bulk": 0,
    }

    console.log("Final data", dataToSubmit)
    this.dataService.postDocAssignUpdate(dataToSubmit)
      .subscribe((results) => {
this.SpinnerService.hide();
        console.log(results)
        this.notification.showSuccess("Updated Successfully")
        data.rmucode = results.rmucode
      })

  }


  bulkAssignIdData:any = []
  checkboxShow: boolean = false
  bulkIDCollection(data, index, e) {

    console.log("data while checkbox", data)
    // data.assigndept_id = ""
    // data.actiontype = ""
    // data.tenor = 0
    // data.assignemployee_id = ""

    //here110
    this.file_name = data.file_name 


    let fullIDData = this.bulkAssignIdData

    if (fullIDData.length <= 0) {
      this.checkboxShow = false
    }
    if (e.target.checked) {
      this.bulkAssignIdData.push(data.id)
      console.log("remove of particular data b4", fullIDData)
      data.check_key = true
      data.fieldkey = true
      if (fullIDData.length > 0) {
        this.checkboxShow = true
      }
    }
    else {
      for (let i in fullIDData) {
        console.log("particular data in array initial", fullIDData[i])
        if (data.id == fullIDData[i]) {
          let indexdata = fullIDData.indexOf(data.id);
          console.log("particular data in array", fullIDData[i])
          console.log("remove of particular data b4", fullIDData)
          console.log("index of particular data", indexdata)
          if(this.bulkAssignIdData.length>0){
            this.bulkAssignIdData.forEach((n, j)=> {
          if(n.id==data.id){
          this.bulkAssignIdData.splice(j,1)
          }
        })
      }
          // this.bulkAssignIdData.splice(indexdata, 1)
          console.log("remove of particular data after", fullIDData)
          data.check_key = false
          data.fieldkey = false
        }
        if (fullIDData.length <= 0) {
          this.checkboxShow = false
        }
        if (fullIDData.length > 0) {
          this.checkboxShow = true
        }
      }
    }
  }

  updatecheckboxForBullkAssign() {

    let ListIDData = this.bulkAssignIdData
    console.log("ListIDData", ListIDData)
    let dataList = this.InwardDocAssignSummaryList
    this.showReassignHeader = this.InwardDocAssignSummaryList.some(inward => inward?.docstatus === 'Pending');

    for (let i in ListIDData) {
      for (let j in dataList) {
        if (ListIDData[i] == dataList[j].id) {
          dataList[j].assigncheck_key = true
        }

      }

    }
  }

  submitAssign(data, index,reassignkey) {
    console.log("submit data for API", data)
    console.log("Index data for API", index)

    this.SpinnerService.show()

    let idData = data.id

    const getToken = localStorage.getItem("sessionData");
    let empvalue = JSON.parse(getToken);
    let empID = empvalue.employee_id;

    if (!this.isDeptedit && data.assigndept_id == '' || data.assigndept_id == null || data.assigndept_id == undefined) {
      this.notification.showWarning("Please fill Ref Department")
      this.SpinnerService.hide()
      return false
    }
    if(this.isDeptedit && (this.assigndept_id == null || this.assigndept_id== undefined ||this.assigndept_id == '')){
      this.notification.showWarning("Please fill Ref Department")
      this.SpinnerService.hide()
      return false
    }

    if (data.actiontype == '' || data.actiontype == null || data.actiontype == undefined) {
      this.notification.showWarning("Please fill Action Type")
      this.SpinnerService.hide()
      return false
    }

    // if (data.tenor == '' || data.tenor == null || data.tenor == undefined) {
    //   // this.notification.showWarning("Please fill Tenor")
    //   this.notification.showWarning("Please fill  TAT")
    //   return false
    // }
// if(data.docstatus !='Return'){
//   if (data.responseDueDate == null || data.responseDueDate === undefined) {
//     this.notification.showWarning("Please Fill Date");
//     return false;
// }

// }

    if (data.responseDueDate == null && data.responseDueDate === undefined && reassignkey != 1 )  {
      // if (data.response_due_date == null || data.response_due_date === undefined) {
      this.notification.showWarning("Please Fill Date");
      this.SpinnerService.hide()
      return false;
  }



    if (data?.emp_ass_key?.length == 0 && data?.actiontype != 1) {
      this.notification.showWarning("Please Add Assign Employee")
      this.SpinnerService.hide()
      return false
    }
 
    if(reassignkey == 1 &&  data?.actiontype != 1 && (data?.emp_ass_key?.length == this.oldassigndata.length )){

      // if (data?.emp_ass_key == this.oldassigndata) {

      //   for(let i=0;i<data?.emp_ass_key;i++)

      //     if(data?.emp_ass_key[i].full_name == this.oldassigndata[i].full_name ){

      //     }
      //     else{

      //     }

      // }

      if( data?.emp_ass_key.every((obj, index) => obj.full_name === this.oldassigndata[index].full_name)){
        
        this.notification.showWarning("Please Check ReAssign Employee same as Already Assigned Employee")
      this.SpinnerService.hide()
      return false
      }
    }




    if (data?.emp_ass_key?.length > 3) {
      this.notification.showWarning(" Assign Employee must be less than or equal to three")
      this.SpinnerService.hide()
      return false
    }

    // if (data.assignemployee_id == '' || data.assignemployee_id == null || data.assignemployee_id == undefined) {
    //   this.notification.showWarning("Please fill Assign Employee")
    //   return false
    // }
    // if (data.assignremarks == '' || data.assignremarks == null || data.assignremarks == undefined) {
    //   this.notification.showWarning("Please fill Assignor Remarks")
    //   return false
    // }
    if (typeof data.assigndept_id == 'string') {
      this.notification.showWarning("Please Select Ref Dept from Dropdown")
      this.SpinnerService.hide()
      return false
    }
    // if (typeof data.assignemployee_id == 'string') {
    //   this.notification.showWarning("Please Select Assign Employee from Dropdown")
    //   return false
    // }
    if(data.assigndept_id!='' && data.actiontype!='' && data.tenor !='' && data.emp_ass_key.length >0){
      this.issave=true
    }


    let selectedEmp = data.emp_ass_key.map(x => x.id)

    let actiontypeBasedstatus;
    let assignemployeeBasedOnDocAction;


    if ( data.actiontype == 1){
      // docactionBasedstatus = "Closed"
      // actiontypeBasedstatus = 3
      actiontypeBasedstatus = 2
      assignemployeeBasedOnDocAction = [0]
    }else{
      // docactionBasedstatus = "Assigned"
      actiontypeBasedstatus = 2
      assignemployeeBasedOnDocAction = selectedEmp
    }

 //for bulk choosefile here10
 // 27/10/23----(BUG_ID - 9491)----faritha 
   let emptyarray=[]
   for(let iteratearray of this.InwardDocAssignSummaryList){
   if(idData!=iteratearray.id){
    emptyarray.push(iteratearray)
  }
  }
  // console.log('emptyarray===>',emptyarray)

  //check here
  // this.formatedDate = data.responseDueDate? this.datePipe.transform(data.responseDueDate, 'yyyy-MM-dd'): null;  
  // if(data.response_due_date !=  'None' &&  data.response_due_date !=  'none' && data.response_due_date !=  "None"   ){

  if(data.responseDueDate !=  null &&  data.responseDueDate !=  undefined && reassignkey !=  1   ){
    
    this.formatedDate = data.responseDueDate? this.datePipe.transform(data.responseDueDate, 'yyyy-MM-dd'): null;

  }
  else{
    this.formatedDate = data.response_due_date
  }

  let assigndept_id = this.isDeptedit ? this.assigndept_id : data.assigndept_id.id;


    let dataToSubmit = {
      "id": [idData],
      "actiontype": data.actiontype,
      "tenor": data.tenor,
      "response_due_date":this.formatedDate,
      "assigndept_id": assigndept_id,
      "assignemployee_id": assignemployeeBasedOnDocAction,
      "docaction": data.docaction,
      "docstatus": actiontypeBasedstatus,
      "assignremarks": data.assignremarks,
      "bulk": 0,
      "filekey": [data.file_name],
      // "status": docactionBasedstatus
    }

    if(reassignkey == 1){
      // let dataToSubmit = {
      //   "id": [idData],
      //   "actiontype": data.actiontype,
      //   "tenor": data.tenor,
      //   "response_due_date":this.formatedDate,
      //   "assigndept_id": data.assigndept_id.id,
      //   "assignemployee_id": assignemployeeBasedOnDocAction,
      //   "docaction": data.docaction,
      //   "docstatus": actiontypeBasedstatus,
      //   "assignremarks": data.assignremarks,
      //   "bulk": 0,
      //   "filekey": [data.file_name],
      //   "reassign":1
      // }
      Object.assign(dataToSubmit, {
        reassign: 1,
    });
     
    }
    console.log('datatosubmit==>',dataToSubmit)
    // if (dataToSubmit.assignemployee_id != empID && dataToSubmit.docstatus == 2) {
    //   this.notification.showWarning("Please Reopen If want to forward")
    //   return false
    // }
    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataToSubmit)
    formData.append('data', datavalue);
    let filekeydata = data.file_name

    let fileArray = data.filearray
    for (let individual in fileArray) {
      formData.append(filekeydata, fileArray[individual])

    }

    console.log("Final data", formData)
    this.dataService.postDocAssignUpdate(formData)
      .subscribe((results) => {
        if(results.description){
          // this.notification.showWarning("You're not allowed to choose other branch")
          this.notification.showError(results.description)
          this.SpinnerService.hide()
          this.issave = false
          return false
        }
        console.log(results)
    this.SpinnerService.hide()
          data.docstatus = results.docstatus
        this.notification.showSuccess("Submitted Successfully")
        this.isDeptedit = false;
        if(reassignkey == 1){
          this.closeassignpopup.nativeElement.click();

}
        data.rmucode = results.rmucode
        this.issave=false
        let searchInward = this.InwardDocAssignSummarySearchForm.value
      for (let i in searchInward) {
        if (searchInward[i] === null || searchInward[i] === "") {
          delete searchInward[i];
        }
      }
      // this.serviceCallInwardDocAssignSummary(searchInward,1,10)
    
      // 27/10/23----(BUG_ID - 9491)----faritha 
      this.dataService.getInwardDocAssignSummarySearch(searchInward, 1)
          .subscribe((result) => {
            console.log(" InwardDocAssignSummaryList", result)


        let branch = result["branch_status"]
        if(branch=="Single"){
          this.branchsingle=true
          this.branchmulti=false
        }
        else{
          this.branchsingle=false
          this.branchmulti=true
        }
            let datass = result['data'];
            let datapagination = result["pagination"];
            this.InwardDocAssignSummaryList = datass;
            // console.log('InwardDocAssignSummaryList from BE==>',this.InwardDocAssignSummaryList)

            for(let iteratearray of this.InwardDocAssignSummaryList){
              for(let iteratearrayss of emptyarray ){
              if (iteratearrayss.id==iteratearray.id){
              const vari = this.InwardDocAssignSummaryList.indexOf(iteratearray)
              this.InwardDocAssignSummaryList.splice(vari,1)
              // console.log('InwardDocAssignSummaryList after slice==>',this.InwardDocAssignSummaryList)

              // this.InwardDocAssignSummaryList.push(iteratearrayss)
              this.InwardDocAssignSummaryList.splice(vari,0,iteratearrayss)

              // console.log('InwardDocAssignSummaryList after push==>',this.InwardDocAssignSummaryList)
              }
              }
                    }
            console.log(" serviceCallInwardSummary", this.InwardDocAssignSummaryList)      
                  if (result['data'] != undefined) {
            this.length_docassign=result.total_count;
           
            let datapagination = result["pagination"];
            this.totalcountdocassign=result.total_count
            if (this.InwardDocAssignSummaryList.length === 0) {
              this.issummarypagedocassign = false
            }
            if (this.InwardDocAssignSummaryList.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.inwarddocassignpresentpage = datapagination.index;
              this.issummarypagedocassign = true
            }
            this.SpinnerService.hide()
          } else {
            this.length_docassign=0;
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
  
        )
      })
    
   
  }

  savedataBulkDocAssign() {
    // console.log("submit data for API", data)

    // console.log("Index data for API", index)

    this.SpinnerService.show()

    let dataForm = this.BulkUpdate.value

    if (dataForm.assigndept_id == '') {
      this.notification.showWarning("Please fill Assign Department in the table below")
      return false
    }
    if (dataForm.actiontype == '') {
      this.notification.showWarning("Please fill Action Type in the table below")
      return false
    }

    // if (dataForm.tenor == '') {
    //   this.notification.showWarning("Please fill TAT in the table below")
    //   return false
    // }

    if(this.BulkUpdate.value.due_date == '' || this.BulkUpdate.value.due_date == null || this.BulkUpdate.value.due_date == undefined){
      this.notification.showWarning("Please fill Due Date")
      return false
    }

    

    // if (dataForm.assignemployee_id == '' ) {
    //   this.notification.showWarning("Please fill Assign Employee in the table below")
    //   return false
    // }
    // if (typeof dataForm.assigndept_id == 'string') {
    //   this.notification.showWarning("Please Select Ref Dept from Dropdown")
    //   return false
    // }
    // if (typeof dataForm.assignemployee_id == 'string') {
    //   this.notification.showWarning("Please Select Assign Employee from Dropdown")
    //   return false
    // }
    
    let SelectedEmployeesId: any
    if( dataForm.selectedEmployees.length <= 0 && this.datatype!="Information Only"){
      this.notification.showWarning("Please select Assigner employee")
      return false 
    }
    if( dataForm.selectedEmployees.length > 0 && this.datatype!="Information Only"){
      let selectedEmployeesForBluk = this.BulkUpdate.value.selectedEmployees
      SelectedEmployeesId = selectedEmployeesForBluk.map(x => x.id)
    }
    else{
      SelectedEmployeesId = [0]
    }
    if(dataForm.docaction == '' || dataForm.docaction == null || dataForm.docaction == undefined){
      dataForm.docaction = 0
    }

    this.formattedDate = this.datePipe.transform(dataForm.due_date, 'yyyy-MM-dd');

    let dataToSubmit: any = {
      id: this.bulkAssignIdData,
      actiontype: dataForm.actiontype,
      tenor: dataForm.tenor,
      response_due_date: this.formattedDate,
      docaction:dataForm.docaction,
      assignremarks:dataForm.assignremarks,
      assigndept_id: dataForm.assigndept_id.id,
      assignemployee_id: SelectedEmployeesId,
      bulk: 1,
      docstatus: 2,
      "filekey": [this.file_name],
    }
    // "filekey": [data.file_name], for reference
    // "status": docactionBasedstatus
  

  // if (dataToSubmit.assignemployee_id != empID && dataToSubmit.docstatus == 2) {
  //   this.notification.showWarning("Please Reopen If want to forward")
  //   return false
  // }
  const formData: FormData = new FormData();
  let datavalue = JSON.stringify(dataToSubmit)
  formData.append('data', datavalue);
  let filekeydata = this.file_name
// 
  let fileArray = this.BulkUpdate.value.filearray
  for (let individual in fileArray) {
    formData.append(filekeydata, fileArray[individual])
  }

    console.log("Final data", dataToSubmit)
    // this.dataService.postDocAssignBulkUpdate(dataToSubmit)
    this.dataService.postDocAssignBulkUpdatenew(formData)
      .subscribe((results) => {
        if(results.description){
    this.SpinnerService.hide()
          // this.notification.showWarning("You're not allowed to choose other branch")
          this.notification.showError(results.description)
          return false
        }
        console.log(results)
    this.SpinnerService.hide()
        this.notification.showSuccess("Submitted Successfully")
        let dataset = results
        dataToSubmit=""
        this.bulkAssignIdData=[  ]
        this.BulkUpdate.reset() //to empty the filled details
        this.checkboxShow = false  //to hide bulkassign fields
        // data.rmucode = results.rmucode
        this.updateDataWhiteBulkUpdate(dataset)
        let searchInward = this.InwardDocAssignSummarySearchForm.value
        for (let i in searchInward) {
          if (searchInward[i] === null || searchInward[i] === "") {
            delete searchInward[i];
          }
        }
      this.serviceCallInwardDocAssignSummary(searchInward,1,10)


      })

  }

  updateDataWhiteBulkUpdate(resultdataFor) {
    let dataList = this.InwardDocAssignSummaryList
    console.log("resultdataFor", resultdataFor)
    let resultsarr = resultdataFor.id_arr
    for (let i in resultsarr) {
      for (let j in dataList) {
        console.log("i", i)
        console.log("j", j)
        console.log("resultsarr 1", resultsarr)
        console.log("resultsarr[i] 2", resultsarr[i])
        console.log(" dataList[j].id", dataList[j].id)
        if (resultdataFor.id_arr[i] == dataList[j].id) {
          dataList[j].assigndept_id = resultdataFor.assigndept_id
          dataList[j].emp_ass_key = resultdataFor.emp_ass_key
          dataList[j].actiontype = resultdataFor.actiontype
          dataList[j].tenor = resultdataFor.tenor
          dataList[j].docstatus = resultdataFor.docstatus
          console.log("dataList[j].assigncheck_key", dataList[j].assigncheck_key)
          // dataList[j].assigncheck_key = false
        }
      }
    }
  }
  isDeptedit : boolean = false;
  docRefDeptDD() {
    let dataToSearchCheck = ''
    this.dataService.getassignDeptFK(dataToSearchCheck, this.currentpageref)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.refdeptList = datas;
        this.List = datas;
        this.isLoading = false;
      })
  }

  reportbranchDD() {
    let dataToSearchCheck = ''
    this.dataService.getassignbranch(dataToSearchCheck, this.currentpageref)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.reportbranchList = datas;
        this.List = datas;
      })
  }

  resetEmpData(data, type){ 
   

       if(type == 'summary'){
      data.assignemployee_id = ''
      data.emp_ass_key = []
    }
    else if (type == 'form'){
      this.BulkUpdate.controls['assignemployee_id'].reset("");
      // this.BulkUpdate.value.selectedEmployees.clear()
      // (this.BulkUpdate.controls['selectedEmployees'] as FormArray).clear();
      // this.BulkUpdate.get('selectedEmployees').removeAt(0)

      let clearArray = this.BulkUpdate.controls.selectedEmployees as FormArray;
      clearArray.removeAt(0)

    }
  }
  chooseDept(data, ref){
    this.assigndept_id = ref.id   //9132
    data.emp_ass_key = []
    this.isDeptedit = true;
  }
  resetEmp(data, type,ref){ 
    this.assigndept_id = ref.id   //9132
    this.InwardDocAssignSummarySearchForm.value.assigndept_id = this.assigndept_id

       if(type == 'summary'){
      data.assignemployee_id = ''
      data.emp_ass_key = []
    }
    else if (type == 'form'){
      this.BulkUpdate.controls['assignemployee_id'].reset("");
      // this.BulkUpdate.value.selectedEmployees.clear()
      // (this.BulkUpdate.controls['selectedEmployees'] as FormArray).clear();
      // this.BulkUpdate.get('selectedEmployees').removeAt(0)

      let clearArray = this.BulkUpdate.controls.selectedEmployees as FormArray;
      clearArray.removeAt(0)

    } 
  }


  docRefDept(e) {
    console.log("event dataaa", e)
    let dataToSearchCheck = e.target.value
    this.dataService.getassignDeptFK(dataToSearchCheck, this.currentpageref)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.refdeptList = datas;
        this.isLoading = false;
        // this.isDeptedit = (type == "poup") ? true : false
      })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////Doc Response
  // serviceCallInwardDocResponseSummary(searchInwardSummary, pageno, pageSize) {
  //   this.dataService.getInwardDocResponseSummarySearch(searchInwardSummary, pageno)
  //     .subscribe((result) => {
  //       console.log(" InwardDocResponseSummaryList", result)
  //       let datass = result['data'];
  //       let datapagination = result["pagination"];
  //       this.InwardDocResponseSummaryList = datass;
  //       console.log(" serviceCallInwardSummary", this.InwardDocResponseSummaryList)
  //       if (this.InwardDocResponseSummaryList.length > 0) {
  //         this.has_nextDocResponse = datapagination.has_next;
  //         this.has_previousDocResponse = datapagination.has_previous;
  //         this.currentpageDocResponse = datapagination.index;
  //       }
  //       if (result) {
  //         this.updateWhileUsingDocResponseCheckBoxDisable()
  //       }
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  //bug id:6048
  length_docres = 0;
  pageIndexdocres = 0;
  pageSizeOptionsdocres = [5, 10, 25];
  pageSize_docres=10;
  showFirstLastButtonsdocres:boolean=true;
  handlePageEvent3(event: PageEvent) {
      this.length_docres = event.length;
      this.pageSize_docres = event.pageSize;
      this.pageIndexdocres = event.pageIndex;
      this.inwarddocrespresentpage=event.pageIndex+1;   
      let searchInwardDocres = this.InwardDocResponsesummarySearchForm.value
      for (let i in searchInwardDocres) {
        if (searchInwardDocres[i] === null || searchInwardDocres[i] === "") {
          delete searchInwardDocres[i];
        }
      }
      this.serviceCallInwardDocResponseSummary(searchInwardDocres,this.inwarddocrespresentpage,this.pageSize_docres);   
      
    }
    serviceCallInwardDocResponseSummary(searchInwardSummary, pageno, pageSize) {
      this.SpinnerService.show()
        this.dataService.getInwardDocResponseSummarySearch(searchInwardSummary, pageno)
          .subscribe((result) => {
            console.log(" InwardDocResponseSummaryList", result)
            let datass = result['data'];
            this.type=result.actiontype
            this.docstatus1=result.docstatus
            let datapagination = result["pagination"];
            this.InwardDocResponseSummaryList = datass;
            this.showReassignHeaderres = this.InwardDocResponseSummaryList.some(inward => inward?.docstatus === 'Update');
            if (result['data'] != undefined) {
            this.length_docres=result.total_count;
           
            let datapagination = result["pagination"];
            this.totalcountdocres=result.total_count
            if (this.InwardDocResponseSummaryList.length === 0) {
              this.issummarypagedocres = false
            }
            if (this.InwardDocResponseSummaryList.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.inwarddocrespresentpage = datapagination.index;
              this.issummarypagedocres = true
            }
            this.SpinnerService.hide()
          } else {
            this.length_docres=0;
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
  
        )
    }


  getInwardDocResponsesummary(hint) {

    this.SpinnerService.show();
    let searchInwardDocResponse = this.InwardDocResponsesummarySearchForm.value
    // if (searchInwardDocResponse.fromdate !== '' && searchInwardDocResponse.todate === '') {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (searchInwardDocResponse.todate !== '' && searchInwardDocResponse.fromdate === '') {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
    // here3
    if ((searchInwardDocResponse.fromdate != '' && searchInwardDocResponse.fromdate != null && searchInwardDocResponse.fromdate != undefined) && 
    (searchInwardDocResponse.todate == '' || searchInwardDocResponse.todate == undefined || searchInwardDocResponse.todate == null)) {
  this.notification.showError("Please enter 'To date' ")
  this.SpinnerService.hide()
  return false
}


else if ((searchInwardDocResponse.todate != ''  && searchInwardDocResponse.todate != null &&  searchInwardDocResponse.todate != undefined)&& 
(searchInwardDocResponse.fromdate == '' || searchInwardDocResponse.fromdate == null || searchInwardDocResponse.fromdate == undefined )) {
  this.notification.showError("Please enter 'From date' ")
  this.SpinnerService.hide()
  return false
}



    if (searchInwardDocResponse.fromdate != '' || searchInwardDocResponse.fromdate != null || searchInwardDocResponse.fromdate != undefined) {
      searchInwardDocResponse.fromdate = this.datePipe.transform(searchInwardDocResponse.fromdate, 'yyyy-MM-dd')
      searchInwardDocResponse.todate = this.datePipe.transform(searchInwardDocResponse.todate, 'yyyy-MM-dd')
    }
    for (let i in searchInwardDocResponse) {
      if (searchInwardDocResponse[i] === null || searchInwardDocResponse[i] === "") {
        delete searchInwardDocResponse[i];
      }
    }
    console.log("search inward data", searchInwardDocResponse)

    if (hint == 'next') {
  this.SpinnerService.hide()
      this.serviceCallInwardDocResponseSummary(searchInwardDocResponse, this.currentpageDocResponse + 1, 10)
    }
    else if (hint == 'previous') {
  this.SpinnerService.hide()
      this.serviceCallInwardDocResponseSummary(searchInwardDocResponse, this.currentpageDocResponse - 1, 10)
    }
    else {
  this.SpinnerService.hide()
      this.serviceCallInwardDocResponseSummary(searchInwardDocResponse, 1, 10)
    }

  }

  resetInwardDocResponse() {
    this.InwardDocResponsesummarySearchForm.controls['fromdate']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['todate']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['channel_id']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['branch_id']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['courier_id']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['docstatus']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['awb_no']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['doctype_id']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['assignedto']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['inward_no']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['docnumber']?.reset("")
    this.InwardDocResponsesummarySearchForm.controls['docsubject']?.reset("")

  }

  filearrayResponse = []
  onFileSelectedResponse(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.filearrayResponse.push(e.target.files[i])
    }
    console.log("filearrayResponse", this.filearrayResponse)
  }

  deleteFilesResponse() {
    this.filearrayResponse = []
    this.fileInputResponse.nativeElement.value = ""
    console.log("filearrayResponse after delete", this.filearrayResponse)

  }

  CommentList: any
  DataForResponseToSubmit: any
  DivShow: boolean = false
  dateTimenow = Date.now()
  GlobalIdForDocResponseSelection: any
  ChoosedataDocResponse(data, index, e) {

    console.log("submit data for API", data)
    console.log("Index data for API", index)
    console.log("e", e)

    let idData = data.id
    this.GlobalIdForDocResponseSelection = idData
    this.currentstatus = data.docstatus_id;
    this.previoudstatus = data.status;
    this.selectedactiontype = data.actiontype   //here
    // let selectedEmpId = data.emp_ass_key
    const getToken = localStorage.getItem("sessionData");
    let empvalue = JSON.parse(getToken);
    let empID = empvalue.employee_id;
    // if (selectedEmpId != empID && data.docstatus_id == 3) {
    //   this.notification.showWarning("Please Reopen If want to forward")
    //   e.preventDefault();
    //   e.stopPropagation();
    //   return false
    // }
    // if(data.emp_ass_key.length <=0){
    //   this.notification.showWarning("Please Select Atleast One Employee")
    //     e.preventDefault();
    //   e.stopPropagation();
    //   return false

    // }
    let employeeID = data.emp_ass_key.map(x=>x.id)
    console.log("employeeID[0]", data.emp_ass_key)
    // if(  data.emp_ass_key[0].full_name == 'all'  ){
      // employeeID = [0]
    // if(  data.emp_ass_key[0].full_name == 'ALL'  ){
      if(data.actiontype == 1){
      employeeID = this.MainshareService.loginEmpId;
      console.log('PresentLoginEmployeeId==>',this.PresentLoginEmployeeId)
    }
    else{
      employeeID = employeeID
    }

    this.formattedDate = this.responseDueDate ? this.datePipe.transform(this.responseDueDate, 'yyyy-MM-dd'): null;

    if (e) {
      this.commentpopup = true
      this.CommentList = data.comment_data
      let dataToSubmit = {
        "id": idData,
        "actiontype": data.actiontype,
        "tenor": data.tenor,
        "response_due_date":this.formattedDate,
        "assigndept_id": data.assigndept_id.id,
        "assignemployee_id": employeeID,
        "docaction": data.docaction,
        "docstatus": data.docstatus_id,
        "assignremarks": data.assignremarks,
        "branch_id": data.branch_id.id,
        "filekey": [data.file_name]
      }
      // if (data.assigned == false) {
      //   this.CommentsShowOrHide = true
      // }
      // if (data.assigned == true) {
      //   this.CommentsShowOrHide = false
      // }

      this.DataForResponseToSubmit = dataToSubmit
      console.log("this.DataForResponseToSubmit", this.DataForResponseToSubmit)
      // this.ScrollBottomFunction()
    }
    else {
      this.DataForResponseToSubmit = ""
      // this.updateWhileUsingDocResponseCheckBoxDisable()
      this.commentpopup = false
    }
  }


  updateWhileUsingDocResponseCheckBoxDisable() {
    let dataList = this.DataForResponseToSubmit
    console.log("Data List to Submit Response", dataList)
    let summaryListForRezponse = this.InwardDocResponseSummaryList

    if (dataList == "" || dataList == undefined) {
      this.InwardDocResponseSummaryList.forEach((row, index) => {
        row.assigncheck_key = false
        row.check_key = false;
        row.fieldkey = false
      })
      return false

    }

    if (dataList != "") {
      this.InwardDocResponseSummaryList.forEach((row, index) => {
        if (dataList.id == row.id) {
          row.assigncheck_key = true
          row.check_key = false;
          row.fieldkey = true
        }
        else {
          row.assigncheck_key = false
          row.check_key = true;
          row.fieldkey = false;

        }
        console.log("row.fieldkey==>",row.fieldkey)
        console.log("row.assigncheck_key==>",row.assigncheck_key)
        console.log("row.check_key==>",row.check_key)


      });
    }
  }
  getbranch(){
    // this.ischanged=true
  }

  //DOCUMENT RESPONSE SUBMIT API
  DataResponseSubmit(modal) {

    this.SpinnerService.show();
    let dataFormComment = this.Comments.value
    console.log("Comment", dataFormComment)

    this.issave=true

    // for update docstatus=2

    if(this.currentstatus == 3){
      this.statusname = 'Closed' 
    }
    if(this.currentstatus == 4){
      this.statusname = 'Reopened'
    }
    if(this.currentstatus == 5){
      this.statusname = 'Returned'
    }

    // if(this.currentstatus == this.previoudstatus && this.currentstatus != 2 && this.selectedactiontype !=1){
    if(this.currentstatus == this.previoudstatus && this.currentstatus != 2){
      this.notification.showError("This Data is Already" +" "+ this.statusname)
      this.issave=false
    this.SpinnerService.hide();
      return false; 

    }

    // if(this.currentstatus != this.previoudstatus && this.currentstatus == 2 && this.selectedactiontype ==1){
      //  this.issave=true
    // }
    // let employeeID = this.DataForResponseToSubmit.assignemployee_id

    let commentdata = {
      comment: dataFormComment.comment,
      branch_id: this.DataForResponseToSubmit.branch_id,
      // assignemployee_id: employeeID,
      filekey: this.DataForResponseToSubmit.filekey

    }

    let dataArray = {
      comments: [commentdata]
    }

    let FinalData = Object.assign({}, this.DataForResponseToSubmit, dataArray)



    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(FinalData)
    formData.append('data', datavalue);
    let filekeydata = this.DataForResponseToSubmit.filekey

    let fileArray = this.filearrayResponse
    console.log("file array check for file", fileArray)
    for (let individual in fileArray) {
      formData.append(filekeydata, fileArray[individual])

    }
    console.log("Final data to submit Comment dataa", FinalData)

    this.dataService.postDocResponseUpdate(formData)
      .subscribe((results => {
    this.SpinnerService.hide();
        console.log("API data", results)
        if(results["code"]){
          this.notification.showError(results["description"])
          this.issave=false
          return false
        }
        else{
        this.notification.showSuccess("Updated Successfully")
        this.issave=false
        this.DataForResponseToSubmit = ""
        datavalue=""
        this.getInwardDocResponsesummary('')
        this.Comments.reset()
        modal.dismiss();
        this.filearrayResponse = []
        this.DivShow = false
        // this.ScrollTopFunction();
        }
        
      }))

  }


  hideBackdrop() {
    const body = document.querySelector('body');
    this.renderer.removeClass(body, 'modal-open');
    const backdrop = body.querySelector('.modal-backdrop');
    if (backdrop) {
      this.renderer.removeChild(body, backdrop);
    }
  }
  /////////////////////////////////////////////////////////////////////////////// file



  showInnerimagepopup: boolean = false
  fileListHeader: any

  HeaderFiles(data) {
    console.log("For Header Files", data)
    let detailId = data.id
    // this.SpinnerService.show()
    this.dataService.fileListViewnward(detailId, 0)
      .subscribe(results => {
        // this.SpinnerService.hide()
        console.log("file results data get from API", results)
        this.fileListHeaderComment = results["file_data"]
        if (results) {
          this.showimagepopupComment = true
        }
      }
        // , (error) => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }


  // showimageHeader: boolean
  // jpgUrls: any
  // tokenValues: any
  // commentPopupHeaderFiles(pdf_id) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   this.tokenValues = token
  //   let id = pdf_id.file_id;
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let stringValue = pdf_id.filedata.file_name.split('.')
  //   if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
  //     // if (pdf_id) {
  //     this.showimageHeader = true
  //     this.showimageHeaderPreviewPDF = false
  //     this.jpgUrls = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;
  //     console.log("urlHeader", this.jpgUrls)
  //   }
  //   if (stringValue[1] === "pdf") {
  //     this.showimageHeader = false
  //     this.showimageHeaderPreviewPDF = true
  //     this.pdfurl = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;
  //   }
  //   if (stringValue[1] === "csv" || stringValue[1] === "xlsx" || stringValue[1] === "ods" || stringValue[1] === "txt") {
  //     this.showimageHeader = false
  //     this.showimageHeaderPreviewPDF = false
  //   }
  // }
  imagepopupclose(){
    this.showimageHeaderPreview = false;
    this.hideBackdrop();

  }
  pdfpopupclose(){
    this.showimageHeaderPreviewPDF = false;
    this.hideBackdrop();

  }
  showimageHeaderPreviewPDF: boolean = false
  showimageHeaderPreview: boolean = false
  showtxt:boolean
  showdoc:boolean
  pdfurl: any
  jpgUrls: any
  commentPopupHeaderFiles(dataforFile) {
    let id = dataforFile.file_id
    let file_name = dataforFile.filedata.file_name;
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.').pop()?.toLowerCase() || '';
    if (stringValue === "png" || stringValue === "jpeg" || stringValue === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      this.showtxt =false
      this.showdoc=false
      this.jpgUrls = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;

      this.openThirdModal();

      console.log("urlHeader", this.jpgUrls)
    }
    if (stringValue === "pdf") {
      this.openPdfModal()
      this.showimageHeaderPreviewPDF = true
      this.showimageHeaderPreview = false
      this.showtxt =false
      this.showdoc=false
      this.dataService.pdfPopup(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        }, (error) => {
          this.errorHandler.handleError(error);
          this.showimageHeaderPreviewPDF = true
          this.showimageHeaderPreview = false
          this.showtxt =false
          this.showdoc=false
          this.SpinnerService.hide();
        })
    }
    // imagePreview_attachment(pdf_id, file_name) {
    //   const getToken = localStorage.getItem("sessionData");
    //   let tokenValue = JSON.parse(getToken);
    //   let token = tokenValue.token;
    //   this.tokenValues = token
    //   let stringValue = file_name.split('.')
    //   this.fileextension=stringValue.pop();
    //   if ( this.fileextension === "pdf"){
    //    window.open( this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token, "_blank");
    //     // this.pdffilename=this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token
    //     // this.modalService.open(this.popupcontent,{size: 'xl', windowClass:"huge"})
        
    //   }
    //   else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    //     this.imgfilename = this.imageUrl + "memserv/memo/download/" + pdf_id + "?token=" + token;
    //     // this.modalService.open(this.popupcontent)
    //     // window.open( this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=" + fileextension + "&token=" + token, "_blank");
        
    //   }
    //   else{
    //     this.pdfUrls = this.imageUrl + "memserv/memo/download/" + pdf_id + "?type= " +  this.fileextension + "&token=" + token;
    //         let anchor = document.createElement('a');
    //         anchor.href = this.pdfUrls;
    //         anchor.target = '_blank';
    //         anchor.click();
           
    //   }
    // }
      
    // if (stringValue[1] === "txt") {
    //   this.showimageHeaderPreview = false
    //   this.showimageHeaderPreviewPDF = false
    //   this.showtxt =true
    //   this.showdoc=false
    //   this.dataService.pdfPopup(id)
    //     .subscribe((data) => {
    //       let binaryData = [];
    //       binaryData.push(data)
    //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //       let link = document.createElement('a');
    //       link.href = downloadUrl;
    //       this.pdfurl = downloadUrl
    //     }, (error) => {
    //       this.errorHandler.handleError(error);
    //       this.showimageHeaderPreview = false
    //       this.showimageHeaderPreviewPDF = false
    //       this.showtxt =true
    //       this.showdoc=false
    //       // this.SpinnerService.hide();
    //     })
    // }
  //  if (stringValue[1] === "docx") {
  //   this.showimageHeaderPreview = false
  //   this.showimageHeaderPreviewPDF = false
  //   this.showtxt =false
  //   this.showdoc=true
  //     this.dataService.pdfPopup(id)
  //       .subscribe((data) => {
  //         let fileUrl = URL.createObjectURL(data);
  //         // this.docUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(fileUrl);
  //         this.docUrl = 'https://docs.google.com/viewer?url=https://example.com/my-document.docx';
  //                }, (error) => {
  //         this.errorHandler.handleError(error);
  //         this.showimageHeaderPreview = false
  //         this.showimageHeaderPreviewPDF = false
  //         this.showtxt =false
  //         this.showdoc=true
  //       });
  //   }
  if (stringValue === "csv" || stringValue === "ods" || stringValue === "xlsx" || stringValue === "txt" || stringValue === "doc" || stringValue === "docx") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
      this.showtxt =false
          this.showdoc=false
      this.notification.showInfo('Preview not available for this format')
    }
  }
  length_trans = 0;
  pageIndextrans = 0;
  pageSizeOptionstrans = [3, 5, 10];
  pageSize_trans=10;
  showFirstLastButtonstrans:boolean=true;
  handlePageEventtrans(event: PageEvent) {
    this.length_trans = event.length;
    this.pageSize_trans = event.pageSize;
    this.pageIndextrans = event.pageIndex;
    this.inwardtranspresentpage=event.pageIndex+1;   
    // let searchInwardtrans = this.InwardtransponsesummarySearchForm.value
    // this.gettranhistory(this.datatrans,this.inwardtranspresentpage,this.pageSize_trans);
    // this.gettranhistory(this.datatrans,this.inwardtranspresentpage);
    // this.gettranhistorypagination(this.headerId,this.inwardtranspresentpage,10);
    this.updateDisplayedRecords()

      }
  ResponseTranHistoryList: any
  
  gettranhistorypagination(data,pagno,pageSize) {
  //   this.employeename="";
  //   this.branchcode="";
  // this.designation=""
  //   let headerId = data?.id
  if(data == null || data == undefined || data == ''){
    data = ''
  }

    console.log("headerId", data)
    this.SpinnerService.show();
    this.dataService.gettranhistory(data,pagno)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        // this.length_trans=results['total_count'];
        this.length_trans=datas.length;

        console.log("getranhistory", datas);
        this.ResponseTranHistoryList = datas;
        if (results['data'] != undefined) {
         
          let datapagination = results["pagination"];
          this.totalcounttrans=results['total_count']
          // Convert ResponseTranHistoryList into an array of objects
        //  this.ResponseTranHistoryArray = Object.values(this.ResponseTranHistoryList);

          if (this.ResponseTranHistoryList.length === 0) {
            this.issummarypagetrans = false
          }
          
          if (this.ResponseTranHistoryList.length > 0) {
            // this.has_next = datapagination.has_next;
            // this.has_previous = datapagination.has_previous;
            // this.transpresentpage = datapagination.index;
            // this.datatrans=results[data]
            this.issummarypagetrans = true
            this.updateDisplayedRecords();
          }
          this.SpinnerService.hide()
        } else {
          this.length_trans=0;
          // this.notification.showError(results?.description)
          // this.SpinnerService.hide()
          // return false
        }
              
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // pageno(headerId: any, pageno: any) {
  //   throw new Error('Method not implemented.');
  // }

  gettranhistory(data,hint) {

    this.employeename="";
    this.branchcode="";
  this.designation=""
    this.headerId = data?.id

    if (hint == 'next') {
      this.gettranhistorypagination(this.headerId, this.currentpage + 1, 10)
    }
    else if (hint == 'previous') {
      this.gettranhistorypagination(this.headerId, this.currentpage - 1, 10)
    }
   
    else {
      this.gettranhistorypagination(this.headerId, 1, 10)
    }

  }





  deleteFilesIndividualResponse(indexOfFile) {
    let dataIndex = indexOfFile
    this.filearrayResponse.splice(indexOfFile, 1)

  }


  showHeaderPDFview: boolean = false
  showHeaderimageview: boolean = false
  pdfurl1: any
  filepreview(files) {
    console.log("file data to view ", files)



    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showHeaderimageview = true
      this.showHeaderPDFview = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showHeaderimageview = false
      this.showHeaderPDFview = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "ods" || stringValue[1] === "csv" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showHeaderPDFview = false
      this.showHeaderimageview = false
    }
  }
  viewFile(f){

  }
  downloadFile(f){

  }
  closePopover(): void {
    this.popoverVisible = false;
    this.selectedComment = null;
  }
  showimagepopupComment: boolean=false

  fileListHeaderComment: any
  getFileApiComments(e, dataSetForComments) {
    console.log("data for comments file", dataSetForComments)
    let detailId = dataSetForComments.inwarddetails
    let commentId = dataSetForComments.id
    // this.SpinnerService.show()
    // e.stopPropagation();
    // this.popoverVisible = !this.popoverVisible;
    // this.selectedComment = this.popoverVisible ? dataSetForComments : null;
    this.dataService.fileListViewnward(detailId, commentId)
      .subscribe(results => {
        // this.SpinnerService.hide()
        console.log("file results data get from API", results)
        this.fileListHeaderComment = results["file_data"]
        if (results["file_data"].length>0) {
          // this.showimagepopupComment = true
          // this.openFilePopup()
          this.openSecondModal()
        }
        else if(results["file_data"].length<=0){
          // this.showimagepopupComment = false
          this.notification.showInfo("No file attached")
        }
      }
        // , (error) => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }


  employeeBranchData: any
  CommentsShowOrHide: boolean = true

  employeeBranch() {
    this.dataService.employeeBranch()
      .subscribe((results: any) => {
        this.employeeBranchData = results.name;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  closepopupp(){
    this.showimagepopupComment = false
    // this.commentpopup = true
    this.hideBackdrop();
  }




  downloadFileXLSX(type) {
    let inwardexcel;
    if (type == "inwardsummary") {
      inwardexcel = this.InwardsummarySearchForm.value
    }

    if (type == "inwarddetails") {
      inwardexcel = this.InwardDetailSummarySearchForm.value
    }

    if (type == "assign") {
      inwardexcel = this.InwardDocAssignSummarySearchForm.value
    }

    if (type == "response") {
      inwardexcel = this.InwardDocResponsesummarySearchForm.value
    }
    if (type == "report") {
      inwardexcel = this.Inwardreport.value
      if(this.getreportList.length == 0){
         this.notification.showError("No Datas To Download")
         return false
      }
    }
    // if (inwardexcel.fromdate !== '' && inwardexcel.todate === '') {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (inwardexcel.todate !== '' && inwardexcel.fromdate === '') {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
//  if ((inwardexcel.fromdate != '' || inwardexcel.fromdate != null || inwardexcel.fromdate != undefined) &&
//        (inwardexcel.todate == '' || inwardexcel.todate == undefined || inwardexcel.todate == null)) {
//       this.notification.showError("Please enter 'To date' ")
//       return false
//     }
//     else if ((inwardexcel.todate != '' || inwardexcel.todate != undefined || inwardexcel.todate != null) && 
//      (inwardexcel.fromdate == '' || inwardexcel.fromdate == undefined || inwardexcel.fromdate == null)) {
//       this.notification.showError("Please enter 'From date' ")
//       return false
//     }
       if ((inwardexcel.fromdate != '' && inwardexcel.fromdate != null && inwardexcel.fromdate != undefined) && 
      (inwardexcel.todate == '' || inwardexcel.todate == undefined || inwardexcel.todate == null)) {
      this.notification.showError("Please enter 'To date' ")
      return false
      }

else if ((inwardexcel.todate != ''  && inwardexcel.todate != null &&  inwardexcel.todate != undefined)&& 
(inwardexcel.fromdate == '' || inwardexcel.fromdate == null || inwardexcel.fromdate == undefined )) {
this.notification.showError("Please enter 'From date' ")
return false
}


    if (inwardexcel.fromdate != '' || inwardexcel.fromdate != null || inwardexcel.fromdate != undefined) {
      inwardexcel.fromdate = this.datePipe.transform(inwardexcel.fromdate, 'yyyy-MM-dd')
      inwardexcel.todate = this.datePipe.transform(inwardexcel.todate, 'yyyy-MM-dd')
    }
    for (let i in inwardexcel) {
      if (inwardexcel[i] === null || inwardexcel[i] === "") {
        delete inwardexcel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.DownloadExcel(type, inwardexcel)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Inward Report.xlsx"
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  documenttypeList: any
  currentpagedoctype: any = 1
  has_nextdoctype: boolean
  has_previousdoctype: boolean
  Documenttype(e) {
    console.log("event dataaa", e)
    let dataToSearchCheck = e.target.value
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }
        // ,(error) => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }

  DocumenttypeDD() {
    let dataToSearchCheck = ''
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }
      )
  }


  public displayFnDocType(doc?: depttypelistss): string | undefined {
    // return doc ? doc.name : undefined;
    return doc ? this.documenttypeList.find(_ => _.id === doc).name : undefined;
  }




  has_nextemp: any
  has_previousemp: any
  currentpageemp: any = 1
  getemployeeFK(e, data, type) {

    this.isLoading = true;
    let dataToSearch = e.target.value
    let refDeptid = data?.id
    console.log("data for emp dropdown", data)
    // if(type == 'summary'){
    //   if(refDeptid.id == '' || refDeptid.id == null || refDeptid.id == undefined){
    //     this.notification.showWarning("Please Select Ref department")
    //     return false
    //   }
    // }
    // if(type == 'form'){
    //   let formvalue = this.BulkUpdate?.value.assigndept_id
    //   if(formvalue == '' || formvalue){

    //   }

    // }

    let assign_id = type == 'popup' ? this.RefDeptAssign.get("assigndept_id")?.value?.id : type == 'popup1' ? this.RefDeptResponse.get("assigndept_id")?.value?.id : "";

    if (refDeptid == '' || refDeptid == null || refDeptid == undefined) {
      this.notification.showWarning("Please Select Ref department")
      this.employeeList = []
      return false
    }
    if(type == 'popup' || type == 'popup1'){
        if(assign_id == null || assign_id == undefined || assign_id == ""){
          this.notification.showWarning("Please Select Ref department")
          return false;
      }
    }

    let assigndept_id = (this.isDeptedit) ? assign_id : refDeptid

    this.dataService.getemployeeFKddBasedOnDept(dataToSearch, assigndept_id, this.currentpageemp)
      .subscribe((results: any[]) => {
    this.isLoading = false;
        let datas = results["data"];
        this.employeeList = datas;
        // let datapagination = results["pagination"];
        // this.has_nextemp = datapagination.has_next;
        // this.has_previousemp = datapagination.has_previous;
        // this.currentpageemp = datapagination.index;
      })
  }


  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }



  ScrollTopFunction() {
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  ScrollBottomFunction() {
    // window.scrollTo(0, 1000);

    setTimeout(() => {
      window.scrollTo({ top: 2000, behavior: 'smooth' })
    }, 500);

  }

  statuslistforChoose = {
    "data": [
      {
        "id": 1,
        "text": "Open"
      },
      {
        "id": 2,
        "text": "Closed"
      },
      {
        "id": 3,
        "text": "Reopen"
      }
    ]
  }

  selectStatusListCondition: any
  statusListDataget(statusdata, type, empdata,actiontype) {
    const getToken = localStorage.getItem("sessionData");
    let empvalue = JSON.parse(getToken);
    let empID = empvalue.employee_id;
    this.actionType1=actiontype;
    this.statusdata=statusdata
    // if (empdata == '' || empdata == null || empdata == undefined || empdata.id != empID ) {
      // if (statusdata == 'Closed') {
      //   this.selectStatusListCondition = ['Update', 'Return'];
      // } else if (statusdata == 'Update') {
      //   this.selectStatusListCondition = ['Reopen'];
      // } else if (statusdata == 'Reopen') {
      //   this.selectStatusListCondition = ['Update', 'Return'];
      // }\\\
      // INFORMATION_ONLY = 1
      // REPLY_MUST = 2

      // ACTION_MUST = 3

    //   if(actiontype == 1 && statusdata=="Update"){
    //     this.selectStatusListCondition = ['Return','Reopen'];
    //     }
    //   if(actiontype==2 || actiontype== 3 && statusdata=="Update"){
    //       this.selectStatusListCondition = ['Reopen'];
    //       }
    //   if (actiontype== 1 &&statusdata=="Closed") {
    //         this.selectStatusListCondition = ['Update', 'Return','Reopen'];
    //       }
    //   if (actiontype==2 || actiontype==3  && statusdata=="Closed") {
    //         this.selectStatusListCondition = ['Update','Reopen'];
    //       }
    //   if (actiontype== 1 && statusdata=="Return") {
    //         this.selectStatusListCondition = ['Update', 'Closed','Reopen'];
    //       }
    //   if (actiontype==2 || actiontype==3  && statusdata=="Return") {
    //         this.selectStatusListCondition = ['Update','Reopen'];
    //       }
    }
    shouldHideOption(text: string, actiontype: number, statusdata: string): boolean {
      // if (this.actionType == 1 && this.statusdata == "Update") {
        // if (this.actionType1 == 1 && this.statusdata == "Update") {
          if (actiontype == 1 && statusdata == "Update") {
        return !['Closed'].includes(text);
      }
    
      // if ((this.actionType1 == 2 || this.actionType1 == 3) && this.statusdata == "Update") {
        if ((actiontype == 2 || actiontype == 3) && statusdata == "Update") {
        return !['Update','Closed','Return'].includes(text);
      }
    
      // if (this.actionType1 == 1 && this.statusdata == "Closed") {
        if (actiontype == 1 && statusdata == "Closed") {
        // return !['Update', 'Return', 'Reopen'].includes(text);
        return !['Closed'].includes(text);
      }
    
      // if ((this.actionType1 == 2 || this.actionType1 == 3) && this.statusdata == "Closed") {
      if ((actiontype == 2 || actiontype == 3) && statusdata == "Closed") {
        // return !['Update', 'Reopen'].includes(text);
        return !['Reopen'].includes(text);
      }
    
      // if (this.actionType1 == 1 && this.statusdata == "Return") {
      //   return !['Update', 'Closed', 'Reopen'].includes(text);
      // }
    
      // if ((this.actionType1 == 2 || this.actionType1 == 3) && this.statusdata == "Return") {
      if ((actiontype == 2 || actiontype == 3) && statusdata == "Return") {
        // return !['Update', 'Reopen'].includes(text);
        return !['Closed'].includes(text);
      }
      // if ((this.actionType1 == 2 || this.actionType1 == 3) && this.statusdata == "Reopen") {
      if ((actiontype == 2 || actiontype == 3) && statusdata == "Reopen") {
        // return !['Update', 'Reopen'].includes(text);
        return !['Closed','Return','Update'].includes(text);
      }
    
      return false;
    }
    
    
    
    
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////// DD

  getChannelFK() {
    this.dataService.getChannelFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ChannelList = datas;
        console.log("channel list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  autocompleteCourierScroll1() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_nextCourier = datapagination.has_next;
                      this.has_previousCourier = datapagination.has_previous;
                      this.currentpageCourier = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  autocompleteCourierScroll2() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier2 === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier2 + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_nextCourier2 = datapagination.has_next;
                      this.has_previousCourier2 = datapagination.has_previous;
                      this.currentpageCourier2 = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  autocompleteCourierScroll3() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier3 === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier3 + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_nextCourier3 = datapagination.has_next;
                      this.has_previousCourier3 = datapagination.has_previous;
                      this.currentpageCourier3 = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  displayFnCourier(courier?: any) {
    return courier ? this.CourierList.find(_ => _.id === courier)?.name : undefined;
  }

  getCourierList(keyValue){
    this.dataService.getCourierFKdd(keyValue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;
        console.log("CourierList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  
  getCourierFK() {
    let keyValue: String = "";
  this.currentpageCourier = 1;
  this.has_nextCourier = true;
  this.has_previousCourier = true;
    this.getCourierList(keyValue)
    this.InwardsummarySearchForm.get('courier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    
  }
  getCourierDOcAssign() {
    let keyValue: String = "";
    this.currentpageCourier2 = 1;
  this.has_nextCourier2 = true;
  this.has_previousCourier2 = true;
    this.getCourierList(keyValue)
    this.InwardDocAssignSummarySearchForm.get('courier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }

  getCourierDocResponse() {
    let keyValue: String = "";
    this.currentpageCourier3 = 1;
  this.has_nextCourier3 = true;
  this.has_previousCourier3 = true;
    this.getCourierList(keyValue)
    this.InwardDocResponsesummarySearchForm.get('courier_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getCourierFKdd(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.CourierList = datas;

    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

  

  //////////////////////////////////////////branch scroll

  currentpagebranch: number = 1;
  has_nextbranch = true;
  has_previousbranch = true;
  pagebranch: number = 1;
  has_nexbranch = true;
  has_previoubranch = true;
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
                this.dataService.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  autocompletereportbranchScroll() {
    setTimeout(() => {
      if (
        this.matreportbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matreportbranchAutocomplete.panel
      ) {
        fromEvent(this.matreportbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matreportbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matreportbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matreportbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matreportbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.dataService.getassignbranch(this.reportbranchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.reportbranchList = this.reportbranchList.concat(datas);
                    if (this.reportbranchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  branchScroll() {
    setTimeout(() => {
      if (
        this.branchAutocomplete &&
        this.autocompleteTrigger &&
        this.branchAutocomplete.panel
      ) {
        fromEvent(this.branchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.branchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nexbranch === true) {
                this.dataService.getassignDeptFK(this.Input.nativeElement.value, this.pagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.List = this.List.concat(datas);
                    if (this.List.length >= 0) {
                      this.has_nexbranch = datapagination.has_next;
                      this.has_previoubranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  // public displayFnbranch(branch?: branchlistss) {
    // let code = branch ? branch.code : undefined;
    // let name = branch ? branch.name : undefined;
    // return branch ? code + "-" + name : undefined;
    // return branch ? "(" + branch.code + ") " + branch.name : undefined;
    // return branch ? this.refdeptList.find(_ => _.id === branch).name : undefined;
    // return branch ? this.branchList.find(_ => _.id === branch) : undefined;
  // }

  public displayFnbranch(branch?: branchlistss): string | undefined {
    return branch ? `${branch.code}-${branch.name}` : undefined;
  }
  

  public displayFnreportbranch(branch?: reportbranchlistss): string | undefined {
    // let code = branch ? branch.code : undefined;
    // let name = branch ? branch.name : undefined;
    // return branch ? code + "-" + name : undefined;
    // return branch ? "(" + branch.code + ") " + branch.name : undefined;
    return branch ? this.reportbranchList.find(_ => _.id === branch).fullname : undefined;
  }

  public displayFn(branch?: listss): string | undefined {
    // let code = branch ? branch.code : undefined;
    // let name = branch ? branch.name : undefined;
    // return branch ? code + "-" + name : undefined;
    return branch ? this.List.find(_ => _.id === branch).name : undefined;
  }
  getbranchFK() {
    this.dataService.getbranchFK('', 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.single = results["data"][0].full_name
        this.branchList = datas;
        console.log("branchList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  has_nextref: any
  has_previousref: any
  currentpageref: any = 1
  refdeptList: any

  public displayFnrefdept(ref?: refdeptlistss): string | undefined {
    return ref ? ref.fullname : undefined;
  }


  statusList: any
  actionTypeList: any
  PhysicalstatusList: any
  HeaderDocstatusList: any
  statusListResponse: any
  actionType() {
    this.dataService.ActiontypeDD()
      .subscribe(res => {
        let data = res['data'];
        this.actionTypeList = data;
      })
  }

  Statusdd() {
    this.dataService.StatusDD()
      .subscribe(res => {
        let data = res['data'];
        this.statusList = data;
        this.statusListResponse = data
      })
  }


  docstatusDD() {
    this.dataService.docstatusDD()
      .subscribe(res => {
        let data = res['data'];
        this.PhysicalstatusList = data;
      })
  }

  docAssignUnAssignstatusDD() {
    this.dataService.docAssignUnAssignstatusDD()
      .subscribe(res => {
        let data = res['data'];
        this.HeaderDocstatusList = data;
      })
  }
  HeaderDocstatusListResponse: any
  docAssignUnAssignstatusDDResponse() {
    this.dataService.docAssignUnAssignstatusDDresponse()
      .subscribe(res => {
        let data = res['data'];
        this.HeaderDocstatusListResponse = data;
      })
  }

  SearchstatusList: any

  getSearchstatusList() {
    this.dataService.getSearchstatusList()
      .subscribe(res => {
        let data = res['data'];
        this.SearchstatusList = data;
      })
  }

  // //BUG ID:9134
  SearchstatusListres: any

  getSearchstatusListresponse() {
    this.dataService.getSearchstatusListres()
      .subscribe(res => {
        let data = res['data'];
        this.SearchstatusListres = data;
      })
  }

  tenureAutoFill(type, inward) {
    console.log("type", type)
    console.log("inward", inward)

    inward.tenor = type.tenure
    inward.emp_ass_key = []


  }

  tenureAutoFillBulk(type) {
    console.log("type", type)
    this.datatype=type.text
    if(type.text=="Information Only"){
      this.isemployee==false
    }
    this.BulkUpdate.patchValue({
      tenor: type.tenure
    })


  }

  emppushToIndividual(index, data){
    this.pendingreassign = true;

    console.log("index", index)
    console.log("data", data)
    let empdata = data.assignemployee_id
    console.log("empdataaa", empdata)

    let empArray = data.emp_ass_key

    for(let i in empArray){
    console.log("data.assignemployee_id.id", data.assignemployee_id.id)
    console.log("empArray[i].id", empArray[i].id)
      if( data.assignemployee_id.id == empArray[i].id  ){
        this.notification.showError("Already Selected")
        return false
      }
    }
    if(empArray?.length == 3){
      this.notification.showWarning("Maximun Selected Employee Reached")
      return false 
    }
    if(data.assignemployee_id.full_name){
      data.emp_ass_key.push(empdata)
    }
    data.assignemployee_id = ''
    console.log("emp after push", data)
    console.log("oldassigneddata on push==>",this.oldassigndata)
  }



  deleteEmpremove(index, data, fulldata){
    this.pendingreassign = true;
    fulldata.emp_ass_key.splice(index, 1)
    console.log("oldassigneddata on delete==>",this.oldassigndata)


  }

  pendingreassignclk(index, fulldata){
    this.pendingreassign = false;

    this.pendingreassignindexx = index
    // this.inwardlist = Object.values(fulldata); // converting object values to an array
    // this.inwardlist = Array.isArray(fulldata) ? fulldata : Object.values(fulldata);
    // this.inwardlist.push(fulldata)
    this.inwardlist = [fulldata];
    let refDept = fulldata?.assigndept_id;
    this.RefDeptAssign.patchValue({
      assigndept_id :refDept
    })
    // this.oldassigndata.push(this.inwardlist[0]?.emp_ass_key)
    if(!this.pendingreassign){
      this.oldassigndata = [];
      this.oldassigndata = JSON.parse(JSON.stringify(this.inwardlist[0]?.emp_ass_key || [])); //Createing a Deep Copy of the Data
    }
    this.pendingreassign = true;
    this.isDeptedit = false;
    console.log('this.inwardlist==>',this.inwardlist)
    console.log('this.oldassigndata==>',this.oldassigndata)


  }

  pendingreassignclkres(index, fulldata){

    this.pendingreassignindexx = index
    
    this.inwardlistres = [fulldata];
    let refDept = fulldata?.assigndept_id;
    this.RefDeptResponse.patchValue({
      assigndept_id :refDept
    })
    // if(    this.pendingreassign != true){
    //   this.oldassigndata = [];

    //   this.oldassigndata = JSON.parse(JSON.stringify(this.inwardlist[0]?.emp_ass_key || [])); //Createing a Deep Copy of the Data

    // }
    // this.pendingreassign = true;

    console.log('this.inwardlistres==>',this.inwardlistres)
    // console.log('this.oldassigndata==>',this.oldassigndata)


  }


    employeeOnBluk(){
      let selectedEmployee = this.BulkUpdate.value.assignemployee_id

      let formArrayForEmployees = this.BulkUpdate.value.selectedEmployees 
      
      if( selectedEmployee == '' || selectedEmployee == null || selectedEmployee == undefined  ){
        this.notification.showWarning("Select atleast one Assigner")
        return false 

      }else if(selectedEmployee.full_name){
        formArrayForEmployees.push(selectedEmployee)
      }

    }

    deleteEmpremoveBulk(index){
      this.BulkUpdate.value.selectedEmployees.splice(index, 1)
  
    }
     
    filedownload(data,event) {
      console.log("fileName",data)
      this.SpinnerService.show();
      event.stopPropagation();
      // let fileName = data.file_name
      let fileName = data.filedata.file_name
      this.dataService.downloadfile(data.file_id)
        .subscribe((results) => {
          this.SpinnerService.hide();
          // let filevalue = fileName.split('.')
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          link.click();
          this.SpinnerService.hide();
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
      
    clicktoyes(){
      this.closebutton.nativeElement.click();
      this.ifyes=true
    }

    Viweclick(tran){
      this.viewclick=true;
      this.employeename=tran.from_user_id.name;
      this.branchcode=tran.from_user_id.employee_branch_code
      this.designation=tran.from_user_id.designation
      

    }
    Viweclicktoemp(tran){
      this.viewclick=true;
      this.employeename=tran.name;
      this.branchcode=tran.employee_branch_code
      this.designation=tran.designation

    }
    length_report = 0;
    pageIndexreport = 0;
    pageSizeOptionsreport = [5, 10, 25];
    pageSize_report=10;
    showFirstLastButtonsreport:boolean=true;
    handlePageEventreport(event: PageEvent) {
        this.length_report = event.length;
        this.pageSize_report = event.pageSize;
        this.pageIndexreport = event.pageIndex;
        this.reportpage=event.pageIndex+1;
        let searchInward = this.Inwardreport.value
        for (let i in searchInward) {
          if (searchInward[i] === null || searchInward[i] === "") {
            delete searchInward[i];
          }
        }
        this.getreportsummary(searchInward,this.reportpage,this.pageSize_report);   //check here
        
      }
    getreportsummary(val,
      pageNumber,pageSize) {
        this.SpinnerService.show()
        val= this.Inwardreport.value
        if ((val.fromdate != '' && val.fromdate != undefined && val.fromdate != null) && 
        (val.todate == '' || val.todate == null || val.todate == undefined )) {
           this.SpinnerService.hide()
          this.notification.showError("Please enter 'To date' ") 
          return  false
        }




        else if ((val.todate != '' && val.todate != undefined && val.todate != null) && 
        (val.fromdate == '' || val.fromdate == null || val.fromdate == undefined)) {
          this.SpinnerService.hide()
          this.notification.showError("Please enter 'From date' ")
          return false
        }
        
        if (val.fromdate != '' || val.fromdate != null || val.fromdate != undefined) {
          val.fromdate = this.datePipe.transform(val.fromdate, 'yyyy-MM-dd')
          val.todate = this.datePipe.transform(val.todate, 'yyyy-MM-dd')
        }
        for (let i in val) {
          if (val[i] === null || val[i] === "") {
            delete val[i];
          }
        }
        if(pageNumber==undefined)
        {
          pageNumber=1
        }
      this.dataService.getreportsummary(val,pageNumber)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()
          let datas = results["data"];
          this.getreportList = datas;
          let datapagination = results["pagination"];
          this.totalcountreport=results["total_count"]
          this.getreportList = datas;

          if (results['data'] != undefined) {
            this.length_report=results["total_count"];
           
            let datapagination = results["pagination"];
            this.totalcount=results["total_count"]
            if (this.getreportList.length === 0) {
              this.issummaryreportpage = false
            }
            if (this.getreportList.length > 0) {
              this.issummaryreportpage = true
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.reportpage = datapagination.index;
            }
            this.SpinnerService.hide()
          } else {
            this.length_report=0;
            this.notification.showError(results["description"])
            this.SpinnerService.hide()
            return false
          }

         
        })
    
    }
    currentpagecom = 1
  has_nextcom = true;
  has_previouscom = true;
  dataToSearchCheck='';

  autocompleteassignrefdeptScroll() {
    this.currentpagecom = 1
    this.has_nextcom = true;
    this.has_previouscom = true;
    console.log("hasnext of commodity",this.has_nextcom)
    setTimeout(() => {
      if (
        this.matrefdeptAutocomplete &&
        this.autocompleteTrigger &&
        this.matrefdeptAutocomplete.panel
      ) {
        fromEvent(this.matrefdeptAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrefdeptAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrefdeptAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrefdeptAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrefdeptAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getassignDeptFK(this.refdeptInput.nativeElement.value, this.currentpagecom+1)
                .subscribe((results: any[]) => {
                     let data = results["data"];
                    let datapagination = results["pagination"];
                    // this.commodityList = this.commodityList.concat(datas);
                    this.refdeptList = this.refdeptList.concat(data)
                    if (this.refdeptList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
 autocompleterefdeptScroll() {
    this.currentpagecom = 1
    this.has_nextcom = true;
    this.has_previouscom = true;
    console.log("hasnext of commodity",this.has_nextcom)
    setTimeout(() => {
      if (
        this.matrefdeptAssign &&
        this.autocompleteTrigger &&
        this.matrefdeptAssign.panel
      ) {
        fromEvent(this.matrefdeptAssign.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrefdeptAssign.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrefdeptAssign.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrefdeptAssign.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrefdeptAssign.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getassignDeptFK(this.refdeptInputAss.nativeElement.value, this.currentpagecom+1)
                .subscribe((results: any[]) => {
                     let data = results["data"];
                    let datapagination = results["pagination"];
                    // this.commodityList = this.commodityList.concat(datas);
                    this.refdeptList = this.refdeptList.concat(data)
                    if (this.refdeptList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  typeclick(value){
    if(value >0){
      // this.InwardDocAssignSummarySearchForm.value.docstatus.reset();
      this.InwardDocAssignSummarySearchForm.controls['docstatus'].reset("")


    }
  }

  statusclick(value){
    if(value>0){
      // this.InwardDocAssignSummarySearchForm.value.assignedto.reset();
      this.InwardDocAssignSummarySearchForm.controls['assignedto'].reset("")

    }
  }
  radioclick(value){
this.selectedOption =value;
if(this.selectedOption == 1){
  this.InwardDocAssignSummarySearchForm.controls['docstatus'].reset("")
}
if(this.selectedOption ==2 ){
  this.InwardDocAssignSummarySearchForm.controls['assignedto'].reset("")

}
  }

  bulkreset(){
    this.BulkUpdate.reset();
  }
 
  onPageChange(event) {
    this.updateDisplayedRecords();

  }
  updateDisplayedRecords() {
    const startIndex = this.pageIndextrans * this.pageSize_trans;
    const endIndex = startIndex + this.pageSize_trans;
    this.displayedRecords = this.ResponseTranHistoryList.slice(startIndex, endIndex);
    console.log('startIndex==>',startIndex)
    console.log('endIndex==>',endIndex)
    console.log('displayedRecords==>',this.displayedRecords)
  }

  commentZIndex = 1050;

  // Function to open the file popup
  openFilePopup() {
      this.commentZIndex = 1040; // Lower the z-index of the comment popup
      this.showimagepopupComment = true; // Show the file popup
  }

  // Function to close the file popup
  closeFilePopup() {
      this.commentZIndex = 1050; // Reset the z-index of the comment popup
      this.showimagepopupComment = false; // Hide the file popup
  }

  selectedemp(data){
    this.selectedempreassign = data.id
  }
  Reassignsubmitdocres(data,index,reassignkey){


      console.log("submit data for API", data)
      console.log("Index data for API", index)
      // console.log("e", e)
  
      let idData = data.id
      this.GlobalIdForDocResponseSelection = idData
      this.currentstatus = data.docstatus_id;
      this.previoudstatus = data.status;
      this.selectedactiontype = data.actiontype   //here
      // const getToken = localStorage.getItem("sessionData");
      // let empvalue = JSON.parse(getToken);
      // let empID = empvalue.employee_id;

      // let employeeID = data.emp_ass_key.map(x=>x.id)
      // console.log("employeeID[0]", data.emp_ass_key)

      //   if(data.actiontype == 1){
      //   employeeID = this.MainshareService.loginEmpId;
      //   console.log('PresentLoginEmployeeId==>',this.PresentLoginEmployeeId)
      // }
      // else{
      //   employeeID = employeeID
      // }
      if (!this.isDeptedit && data.assigndept_id == '' || data.assigndept_id == null || data.assigndept_id == undefined) {
        this.notification.showWarning("Please fill Ref Department")
        this.SpinnerService.hide()
        return false
      }
      if(this.isDeptedit && (this.assigndept_id == null || this.assigndept_id== undefined ||this.assigndept_id == '')){
        this.notification.showWarning("Please fill Ref Department")
        this.SpinnerService.hide()
        return false
      }
      if(this.selectedempreassign == null || this.selectedempreassign == undefined || this.selectedempreassign == ""){
        this.notification.showWarning("Please fill Employee Name to ReAssign!");
        this.SpinnerService.hide()
        return false
      }
      
      let assigndept_id = this.isDeptedit ? this.assigndept_id : data.assigndept_id.id;

     let  employeeID  = [this.selectedempreassign]
     if(employeeID.length == 0){
      this.notification.showWarning("Please fill Employee Name to ReAssign!");
      this.SpinnerService.hide()
      return false
    }
      this.formattedDate = this.responseDueDate ? this.datePipe.transform(this.responseDueDate, 'yyyy-MM-dd'): null;
  
      // if (e) {
        this.commentpopup = true
        this.CommentList = data.comment_data
        let dataToSubmit = {
          "id": idData,
          "actiontype": data.actiontype,
          "tenor": data.tenor,
          "response_due_date":this.formattedDate,
          "assigndept_id": assigndept_id,
          "assignemployee_id": employeeID,
          "docaction": data.docaction,
          "docstatus": data.docstatus_id,
          "assignremarks": data.assignremarks,
          "branch_id": data.branch_id.id,
          "filekey": [data.file_name],
          "reassign":1
        }

  
        this.DataForResponseToSubmit = dataToSubmit
        // this.updateWhileUsingDocResponseCheckBoxDisable()
        console.log("this.DataForResponseToSubmit", this.DataForResponseToSubmit)
      // }
      // else {
      //   this.DataForResponseToSubmit = ""
      //   this.updateWhileUsingDocResponseCheckBoxDisable()
      //   this.commentpopup = false
      // }

        let dataFormComment = this.Comments.value
        console.log("Comment", dataFormComment)
    
        this.issave=true
    
    
        
    

        let commentdata = {
          comment: dataFormComment.comment,
          branch_id: this.DataForResponseToSubmit.branch_id,
          // assignemployee_id: employeeID,
          filekey: this.DataForResponseToSubmit.filekey
    
        }
    
        let dataArray = {
          comments: [commentdata]
        }
    
        let FinalData = Object.assign({}, this.DataForResponseToSubmit, dataArray)
    
    
    
        const formData: FormData = new FormData();
        let datavalue = JSON.stringify(FinalData)
        formData.append('data', datavalue);
        let filekeydata = this.DataForResponseToSubmit.filekey
    
        let fileArray = this.filearrayResponse
        console.log("file array check for file", fileArray)
        for (let individual in fileArray) {
          formData.append(filekeydata, fileArray[individual])
    
        }
        console.log("Final data to submit Comment dataa", FinalData)
        this.SpinnerService.show()
    
        this.dataService.postDocResponseUpdate(formData)
          .subscribe((results => {
            console.log("API data", results)
            if(results["code"]){
              this.SpinnerService.show()
              this.notification.showError(results["description"])
              this.issave=false
              this.SpinnerService.hide()
              return false
            }
            else{
              this.SpinnerService.hide()
              this.notification.showSuccess("Updated Successfully")
            this.issave=false
            this.DataForResponseToSubmit = ""
            datavalue=""
            this.selectedempreassign = ''
            employeeID = [];
            this.closeresponsepopup.nativeElement.click();
            this.getInwardDocResponsesummary('')
            this.Comments.reset()
            this.filearrayResponse = []
            }
            
          }))

  }
  cancelDept(){
    this.RefDeptAssign.get('assigndept_id').reset();
    this.isLoading = true;
    this.assigndept_id = ''
    this.isDeptedit = false;
    this.docRefDeptDD()
  }
  cancelDeptRes(){
    this.RefDeptResponse.get('assigndept_id').reset();
    this.isLoading = true;
    this.assigndept_id = ''
    this.isDeptedit = false;
    this.docRefDeptDD()
  }
  autocompleterefdeptResScroll(){
    this.currentpagecom = 1
    this.has_nextcom = true;
    this.has_previouscom = true;
    console.log("hasnext of commodity",this.has_nextcom)
    setTimeout(() => {
      if (
        this.matrefdeptResponse &&
        this.autocompleteTrigger &&
        this.matrefdeptResponse.panel
      ) {
        fromEvent(this.matrefdeptResponse.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrefdeptResponse.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrefdeptResponse.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrefdeptResponse.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrefdeptResponse.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getassignDeptFK(this.refdeptInputRes.nativeElement.value, this.currentpagecom+1)
                .subscribe((results: any[]) => {
                     let data = results["data"];
                    let datapagination = results["pagination"];
                    // this.commodityList = this.commodityList.concat(datas);
                    this.refdeptList = this.refdeptList.concat(data)
                    if (this.refdeptList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
}
