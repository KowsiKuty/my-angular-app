import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, ElementRef, HostListener, } from '@angular/core';
import { DataService } from '../../service/data.service'
import { Observable, } from 'rxjs'
import { SharedService } from '../../service/shared.service'
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { element } from 'protractor';
import { NotificationService } from '../../service/notification.service'
import { DomSanitizer } from '@angular/platform-browser';
import { MemoService } from 'src/app/ememo/memo.service';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { event } from 'jquery';

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

export interface iEmployeeList {
  full_name: string;
  id: number;
}
export interface ApproverListss {
  full_name: string;
  id: number;
}
@Component({
  selector: 'app-memo-view',
  templateUrl: './memo-view.component.html',
  styleUrls: ['./memo-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MemoViewComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closebutton2') closebutton2;
  @ViewChild('popupcontent') popupcontent;

  imageUrl = environment.apiURL

  MemoViewForm: FormGroup;
  commentForm: FormGroup;
  approveForm: FormGroup;
  resubmitForm: FormGroup;
  assignForm: FormGroup;
  ForwardcommentForm: FormGroup;
  recommendForm: FormGroup;
  opinionForm: FormGroup;
  appList: Array<ApproverListss>;
  CommentintervalId: any;
  commentType = {
    comments: 1, superscript: 2, forward: 3, reply: 4, opinion_cmt: 5, approver_cmt: 6, recommender_cmt: 7, skip_cmt: 8, reviewresubmit: 9
  }
  i1: any;
  // html: string;
  window: any;
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'hr']]
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };


  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.MemoViewForm.get('html').value);
  }
  comment2Click_disabled = false;
  Approve2Click_disabled = false;
  Review2Click_disabled = false;
  Recommend2Click_disabled = false;
  Opinion2Click_disabled = false;
  commentdraftClick_disabled = false;
  memoViewList: any;
  sendList: Array<any>;
  cateoryList: Array<any>;
  sub_cateoryList: Array<any>;
  toList: Array<any>;
  departmentList: Array<any>;
  ccList: Array<any>;
  btoList: Array<any>;
  memolist: Array<any>;
  approverList: Array<any>;
  AllareApproved: boolean;
  PartiallyApproved: boolean;
  NoofPending_Approvers: any;
  Versioned: boolean;
  isSkip: boolean;
  historyList: Array<any>;
  userList: Array<any>;
  commentDataList: any;
  documentDatas: Array<any>;
  approveData: Array<any>;
  recommenderData: Array<any>;
  attachmentData: Array<any>
  idValue: any;
  mid: any;
  memoviewfrom: string;
  images: string[] = [];
  replyButton = false;
  can_approve: boolean;
  Ask_Opinion: boolean;
  CancelAskedOpinion: boolean
  Can_Opinion: boolean = false
  can_opinion_status: any;
  is_toemployee: boolean;
  is_sender_dept: boolean;
  can_comment: boolean;
  MemoStatus_openclosed: any;
  imageView: any;
  commentTag = "comments"
  tokenValues: any
  urlTypes: string;
  pdfUrls: string;
  imgfilename: string;
  pdffilename: string;
  isSender: boolean;
  isRef: string;
  commentDocuments: any;
  ionName: any;
  confidential = "YES"
  confidential1 = "NO"
  subjectName: string;
  memocloneid: any;
  senderName: string;
  contentName: any;
  categoryName: string;
  subCategoryName: string;
  createdDate: string;
  createdBy: any;
  manualreference: string;
  watermarktext: string;
  refIonName: string;
  priorityName: string;
  rdo_IOM_nfa_bna: any;
  confidentialselect: string;
  public Confidential: boolean = false;
  buttonshow:any
  aa: any;
  tdwidth1 =
    {
      style: {
        width: "60%",
        "vertical-align": "top"
      }
    };
  tdwidth2 =
    {
      style: {
        width: "40%",
        "vertical-align": "top"
      }
    };
  ShowExpandMemoView = true;
  ShowExpandCommentView = true;
  ShowExpandMemoView1 = true;
  ShowExpandCommentView1 = true;

  superScriptForm: FormGroup;
  selectText: string;
  scriptContent: any;
  scriptRemarks: string;
  isSuperScript: boolean = false;
  contentScript: any;
  recommendlist: any;
  superscriptid: any;
  superScriptCommentForm: FormGroup;
  SuperscriptEditForm: FormGroup;


  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployeeCC: iEmployeeList[] = [];
  public chipSelectedEmployeeApprover: iEmployeeList[] = [];
  public chipSelectedEmployeeApproverid = [];
  @ViewChild('employeeccInput') employeeccInput: any;
  isLoading = false;
  public employeeccControl = new FormControl();
  public employeeApproverControl = new FormControl();
  public Opinioncontent = new FormControl('')
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('apptype') matappAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  AssigntoList: any;
  assignData: any;
  commentdatas: any
  comment: any;
  // @ViewChild('closebutton') closebutton;
  frwdcmts = true;
  assdata = false;
  cmtdata = true;
  commentdata: any;
  commentdata1: any;
  recomm: any[] = [
    { value: "recommended", display: 'recommended' },
    { value: "not_recommended", display: 'not_recommended' }
  ]
  recomList: any;
  can_recommend: boolean;
  annotation_notification: boolean;
  paralleldelivery: any;
  logindetail: any
  showannotation: boolean = false;
  showannotations: boolean;
  commentlist: any;
  commentslist: any;
  fileextension: any;
  permissionToHandle: any
  offset: number;
  OpinionList: any
  OpinionListHistory: any
  viewempids:any;
  constructor(private dataService: DataService, private http: HttpClient,
    private notification: NotificationService, private memoService: MemoService,
    private router: Router, private activateRoute: ActivatedRoute, private fb: FormBuilder,
    private sanitizer: DomSanitizer, private route: ActivatedRoute,
    public sharedService: SharedService, private toastr: ToastrService,
    private renderer: Renderer2, private el: ElementRef,
    private modalService: NgbModal, public datepipe: DatePipe, private SpinnerService: NgxSpinnerService
  ) { this.offset = new Date().getTimezoneOffset(); }

  ngOnDestroy() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.sharedService.isSideNav = false;
    this.stopInterval();
  }

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    // this.sharedService.MyModuleName=this.ionName
  }

  ngOnInit(): void {
    this.sharedService.isSideNav = true;
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";

    this.commentForm = this.fb.group({
      content: ['',]
    })
    this.opinionForm = this.fb.group({
      content: [''],
      status: 2
    })
    this.superScriptForm = this.fb.group({
      remarks: ['',]
    })
    this.superScriptCommentForm = this.fb.group({
      remarks: ['',]
    })
    this.SuperscriptEditForm = this.fb.group({
      remarks: ['',]
    })
    this.approveForm = this.fb.group({
      content: ['',],
    })
    this.resubmitForm = this.fb.group({
      content: ['',],
    })
    this.assignForm = this.fb.group({
      to: [''],
      comments: ['',],
      action: ['']
    })
    this.recommendForm = this.fb.group({
      content: [''],
      status: [''],
      type: 1
    })
    this.ForwardcommentForm = this.fb.group({
      comment: ['']
    })
    this.route.queryParams
      .subscribe(params => {
        this.mid = params.mid;
        this.memoviewfrom = params.from;
        this.permissionToHandle = params.permissionToHandle
        this.viewempids = params.empid
        if (this.viewempids == undefined){
        // this.viewempids = this.logindetail.employee_id
        this.viewempids = ''

        }
        // console.log("*ngIf=permissionToHandle", this.permissionToHandle)
        // console.log("*ngIf=permissionToHandle type", typeof(this.permissionToHandle))
        if (this.permissionToHandle == undefined) {
          this.permissionToHandle = 'true'
        }

        this.sharedService.fetchData.next(this.mid);
      }
      );
    if (this.employeeApproverControl !== null) {
      this.employeeApproverControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allEmployeeList = datas;
        })
    }

    if (this.memoviewfrom === 'email') {
      this.getMenuUrl()
    }

    // this.getMemoHistoryView();
    this.getCommentData();
    this.getFetch();
    // this.getDocuments();
    // this.getApprove();
    this.getTokenValues();
    this.disableEditor();
    this.getAssigntoList();
    this.getassign();
    this.getFwdcommentdetails();
    this.getOpinion()
    const item = localStorage.getItem('sessionData');
    let itemValue = JSON.parse(item);
    this.logindetail = itemValue
    // this.getApprovers();

    let parentkeyvalue: String = "";
    this.getApprovers_Assignto();
    this.assignForm.get('to').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getapproverDropdown(value, this.mid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appList = datas;
      })

    let ccc = this.commentdata1

    // console.log("this.permission to handle", this.permissionToHandle)
  } ///endof ngoninit

  public employeeApproverSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName(event.option.value.full_name);
    this.employeeApproverInput.nativeElement.value = '';
  }
  private selectEmployeeApproverByName(employee) {
    let foundEmployeeApprover1 = this.chipSelectedEmployeeApprover.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover1.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      // We found the employeecc name in the allEmployeeList list
      this.chipSelectedEmployeeApprover.push(foundEmployeeApprover[0]);
      this.chipSelectedEmployeeApproverid.push(foundEmployeeApprover[0].id)
    }
  }
  public removeEmployeeApprover(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeApprover.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeApprover.splice(index, 1);
      this.chipSelectedEmployeeApproverid.splice(index, 1);
      this.employeeApproverInput.nativeElement.value = '';
    }
  }

  private getMenuUrl() {
    this.sharedService.menuUrlData = [];
    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        let data = results['data'];
        if (data) {
          this.sharedService.titleUrl = data[0].url;
          this.sharedService.menuUrlData = data;
        };
        this.sharedService.menuUrlData.forEach(element => {
          if (element.type === "transaction") {
            this.sharedService.transactionList.push(element);
          } else if (element.type === "master") {
            this.sharedService.masterList.push(element);
          }
        });
      })
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  ExpandMemoView() {
    this.tdwidth1 =
    {
      style: {
        width: "100%",
        "vertical-align": "top"
      }
    };
    this.tdwidth2 =
    {
      style: {
        width: "0%",
        "vertical-align": "top"
      }
    };
    this.ShowExpandCommentView = false;
    this.ShowExpandMemoView1 = false
  }
  ExpandCommentView() {
    this.tdwidth1 =
    {
      style: {
        width: "0%",
        "vertical-align": "top"
      }
    };
    this.tdwidth2 =
    {
      style: {
        width: "100%",
        "vertical-align": "top"
      }
    };
    this.ShowExpandMemoView = false;
    this.ShowExpandCommentView1 = false;
  }
  NormalView() {
    this.ShowExpandCommentView = true;
    this.ShowExpandMemoView = true;
    this.ShowExpandCommentView1 = true;
    this.ShowExpandMemoView1 = true;
    this.tdwidth1 =
    {
      style: {
        width: "60%",
        "vertical-align": "top"
      }
    };
    this.tdwidth2 =
    {
      style: {
        width: "40%",
        "vertical-align": "top"
      }
    };
  }
  updateEditor() {
    this.editorDisabled = true;
    let m_json: any = [];
    m_json["memo_content"] = this.MemoViewForm.value.html
    let finaljson = JSON.stringify(Object.assign({}, m_json));
    this.dataService.memoContentUpdate(finaljson, this.mid)
      .subscribe(res => {
        this.notification.showSuccess("Updated Successfully....")
      }
      )
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  CloseAndClone() {
    var answer = window.confirm("Edit and review this Memo?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.memoService.getCloseAndClone(this.mid)
      .subscribe((data) => {
        this.memocloneid = data.id;
        this.sharedService.fetchData.next(this.memocloneid)
        this.router.navigate(["/ememo/memoRedraft"], { queryParams: { memofrom_rf: 'REDRAFT', MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        this.SpinnerService.hide();
      });
  }
  Skip_Rec_App() {
    var answer = window.confirm("Using this SKIP option ,you can skip the Recommender/Approver.Continue?");
    if (answer == false) {
      // console.log("skip cancelled")
      return false;
    }
    this.router.navigate(["/ememo/memoskip"], { queryParams: { mid: this.mid, from: this.memoviewfrom, permissionToHandle: this.permissionToHandle }, skipLocationChange: isSkipLocationChange });

  }
  Forward() {
    var answer = window.confirm("Forward this Memo?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.memoService.getForward(this.mid)
      .subscribe((data) => {
        this.memocloneid = data.id;
        this.sharedService.fetchData.next(this.memocloneid)
        this.SpinnerService.hide();
        this.router.navigate(["/ememo/memoRedraft"], { queryParams: { memofrom_rf: 'FORWARD', MemoView: "NO" }, skipLocationChange: isSkipLocationChange });

      },
        error => {
          this.SpinnerService.hide();
        }
      );
  }

  getFwdcommentdetails() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getForwardComments(this.mid)
      .subscribe((result) => {
        this.commentdata = result['data']
        for (var i = 0; i < this.commentdata.length; i++) {
          this.commentdata1 = this.commentdata[i].content
        }
      })

  }
  hidden: any
  getFetch() {
    if (this.mid === undefined) {
      return false;
    }
    // console.log("getFetch data called ")
    this.dataService.getnewFetch(this.mid,this.viewempids)
      .subscribe((data) => {
        this.commentdatas = data.is_forward_comment;
        this.paralleldelivery = data.parallel_delivery;
        this.memoViewList = data
        this.subjectName = data.subject;
        this.manualreference = data.manual_reference;
        this.watermarktext = data.watermark_txt;
        this.buttonshow = data.button_show
        console.log("button",this.buttonshow)
        if(this.buttonshow === undefined || this.buttonshow === "" || this.buttonshow === null){
          this.buttonshow = true;
          console.log("buttontrue",this.buttonshow)
        }
        if (data.superscript_content == null) {
          this.contentName = data.content;
        }
        if (data.superscript_content) {
          this.contentName = data.superscript_content.content;
          this.hidden = data.superscript_content.content;
        }
        this.contentScript = data.content;
        this.getSuperScript();
        // this.contentName =this.sanitizer.bypassSecurityTrustHtml(data.content);
        if (data.memo_status !== 1) {
          this.MemoStatus_openclosed = 'CLOSED'
        } else {
          this.MemoStatus_openclosed = 'OPEN'
        }
        this.senderName = ""
        if (data.sender.branch_code) {
          this.senderName = "(" + data.sender.branch_code + "-" + data.sender.branch + ")";
        }
        if (data.sender.name) {
          this.senderName = this.senderName + data.sender.name;
        }
        if (data.type !== undefined) {
          if (data.type === 'iom') {
            this.rdo_IOM_nfa_bna = 'Inter-Office Memo';
            this.sharedService.Memofrom = 'IOMEMO'
          }
          if (data.type === 'nfa') {
            this.rdo_IOM_nfa_bna = 'Note for Approval';
            this.sharedService.Memofrom = 'NFA-MEMO'
          }
          if (data.type === 'bna') {
            this.rdo_IOM_nfa_bna = 'Board Notes';
            this.sharedService.Memofrom = 'BNA-MEMO'
          }
        }
        if (this.Confidential === data.confidential) {
          this.confidentialselect = this.confidential1
        } else {
          this.confidentialselect = this.confidential
        }
        this.categoryName = data.category.name;
        this.subCategoryName = data.sub_category.name;
        this.priorityName = data.priority.name
        this.createdDate = data.created_date;
        let cby = data.created_by;
        this.createdBy = cby.full_name;
        this.refIonName = data.ref_ion;
        this.can_approve = data.can_approve
        this.is_toemployee = data.is_toemployee;
        this.is_sender_dept = data.is_sender_dept;
        this.can_comment = data.can_comment;
        this.can_recommend = data.can_recommend;
        this.annotation_notification = data.annotation_notification;
        if (this.annotation_notification === true) {
          this.showannotations = true;
        }
        else {
          this.showannotations = false;
        }
        //// Ask opinion button validation 
        let askopinionValidation
        if ((data?.opinion?.id == 1 || data?.opinion?.id == 7) && (this.can_approve == true || this.can_recommend == true) && this.MemoStatus_openclosed == 'OPEN') {
          askopinionValidation = true
        } else {
          askopinionValidation = false
        }

        this.Ask_Opinion = askopinionValidation
        // console.log("ask opinion validation>>>>>", this.Ask_Opinion, data?.opinion?.id, this.can_approve, this.can_recommend, this.MemoStatus_openclosed)
        this.Can_Opinion = data?.can_opinion
        this.can_opinion_status = data?.can_opinion_status
        this.CancelAskedOpinion = data?.asked_opinion


        let toValue = data['to_emp'];
        this.toList = toValue;
        this.Versioned = data.versioned;
        this.isSkip = data.isSkip;
        let approve = data['approver'];
        this.approverList = approve.sort((n1, n2) => n1.order - n2.order);
        this.AllareApproved = true;
        this.PartiallyApproved = false;
        this.NoofPending_Approvers = 0;
        this.approverList.forEach((al) => {
          if (![2, 8, 6].includes(al.status)) {
            this.AllareApproved = false;
            this.NoofPending_Approvers = this.NoofPending_Approvers + 1;
          }
          else if (al.status === 2 || al.status === 8) {
            this.PartiallyApproved = true;
          }
        });
        if (this.NoofPending_Approvers <= 1 && data.type === 'iom') {
          this.paralleldelivery = true;
        }
        this.btoList = data['bto'];
        let cc = data['cc'];
        this.ccList = cc;
        let recomm = data['recommender']
        for (var i = 0; i < recomm.length; i++) {
          this.recommendlist = recomm[i].status
        }

        this.recomList = recomm;
        this.recomList = recomm.sort((n1, n2) => n1.order - n2.order);
        let dept = data['to_dept'];
        this.departmentList = dept;

        let attachment = data['document_arr'];
        this.attachmentData = attachment;
        let isSender = data.is_sender
        this.isSender = isSender;
        this.ionName = data.ion;
        this.sharedService.MyModuleName = this.ionName;
        this.sharedService.ionName.next(this.ionName)
        this.sharedService.forwardMessage.next(data)
        this.SpinnerService.show()
        this.memoService.getMemoSequence(this.mid)
          .subscribe((results) => {
            this.SpinnerService.hide()
            this.memolist = results["data"];
          }, error => {
            this.SpinnerService.hide()
          });
      })
  }

  status(status) {
    if (status["memo_status"] === 1) {
      return "OPEN"
    } else if (status["memo_status"] === 0) {
      return "DRAFT"
    } else {
      return "CLOSED"
    }
  }
  dupcontentname: any
  dupcon: boolean
  bindSelection_alert(id) {
    alert(id);
  }
  tooltipinfo: any
  isversioned: any
  getReference(id) {
    this.mid = id
    this.historyList = [];
    this.documentDatas = [];
    this.approveData = [];
    this.recommenderData = [];
    this.OpinionListHistory = [];
    this.getFetch()
    this.getOpinion();
    //this.getCommentData();
    this.dataService.getCommentData(id)
      .subscribe((result) => {
        let data = result['data'];
        this.commentDataList = data;
        this.commentDocuments = [];
        data.forEach(element => {
          let doc = element.document
          this.commentDocuments = this.commentDocuments.concat(doc);
        });
        // this.replyButton=data.can_reply
      })
    return false
    // console.log("getFetch data called reference ")
    this.dataService.getnewFetch(id,this.viewempids)
      .subscribe((data) => {
        this.memoViewList = data
        this.subjectName = data.subject;
        this.manualreference = data.manual_reference;
        this.paralleldelivery = data.parallel_delivery;
        this.watermarktext = data.watermark_txt;
        this.buttonshow = data.button_show
        if (data.superscript_content == null) {
          this.contentName = data.content;
        }
        if (data.superscript_content) {
          this.contentName = data.superscript_content.content;
        }
        this.dupcontentname = data.content;
        this.senderName = ""
        if (data.sender.branch_code) {
          this.senderName = "(" + data.sender.branch_code + "-" + data.sender.branch + ")";
        }
        if (data.sender.name) {
          this.senderName = this.senderName + data.sender.name;
        }

        if (data.memo_status !== 1) {
          this.MemoStatus_openclosed = 'CLOSED'
        } else {
          this.MemoStatus_openclosed = 'OPEN'
        }

        if (data.type !== undefined) {
          if (data.type === 'iom') {
            this.rdo_IOM_nfa_bna = 'Inter-Office Memo';
            this.sharedService.Memofrom = 'IOMEMO'
          }
          if (data.type === 'nfa') {
            this.rdo_IOM_nfa_bna = 'Note for Approval';
            this.sharedService.Memofrom = 'NFA-MEMO'
          }
          if (data.type === 'bna') {
            this.rdo_IOM_nfa_bna = 'Board Notes';
            this.sharedService.Memofrom = 'BNA-MEMO'
          }
        }
        if (this.Confidential === data.confidential) {
          this.confidentialselect = this.confidential1
        } else {
          this.confidentialselect = this.confidential
        }
        this.categoryName = data.category.name;
        this.subCategoryName = data.sub_category.name;
        this.priorityName = data.priority.name
        this.createdDate = data.created_date;
        let cby = data.created_by;
        this.createdBy = cby.full_name;
        this.refIonName = data.ref_ion;
        this.can_approve = data.can_approve
        this.is_toemployee = data.is_toemployee;
        this.is_sender_dept = data.is_sender_dept;
        this.can_comment = data.can_comment;
        this.can_recommend = data.can_recommend;
        let askopinionValidation
        if (data?.opinion?.id == 1 && (this.can_approve == true || this.can_recommend == true) && this.MemoStatus_openclosed == 'OPEN') {
          askopinionValidation = true
        } else {
          askopinionValidation = false
        }

        this.Ask_Opinion = askopinionValidation
        // console.log("ask opinion validation>>>>>", this.Ask_Opinion, data?.opinion?.id, this.can_approve, this.can_recommend, this.MemoStatus_openclosed)
        this.CancelAskedOpinion = data?.asked_opinion
        let toValue = data['to_emp'];
        this.toList = toValue;
        this.Versioned = data.versioned;
        this.isSkip = data.isSkip;
        let approve = data['approver'];
        this.approverList = approve.sort((n1, n2) => n1.order - n2.order);
        this.AllareApproved = true;
        this.PartiallyApproved = false;
        this.NoofPending_Approvers = 0;
        this.approverList.forEach((al) => {
          if (al.status !== 2 && al.status !== 6) {
            this.AllareApproved = false;
            this.NoofPending_Approvers = this.NoofPending_Approvers + 1;
          }
          else if (al.status === 2) {
            this.PartiallyApproved = true;
          }
        });
        if (this.NoofPending_Approvers <= 1 && data.type === 'iom') {
          this.paralleldelivery = true;
        }
        this.btoList = data['bto'];
        let cc = data['cc'];
        this.ccList = cc;
        let dept = data['to_dept'];
        this.departmentList = dept;
        let attachment = data['document_arr'];
        this.attachmentData = attachment;
        let isSender = data.is_sender
        this.isSender = isSender;
        this.ionName = data.ion;
        this.sharedService.MyModuleName = this.ionName
        this.sharedService.ionName.next(this.ionName)
        this.sharedService.forwardMessage.next(data)
        this.memoService.getMemoSequence(id)
          .subscribe((results) => {
            this.memolist = results["data"];
          });

      });
    this.dataService.getCommentData(id)
      .subscribe((result) => {
        let data = result['data'];
        this.commentDataList = data;
        this.commentDocuments = [];
        data.forEach(element => {
          let doc = element.document
          this.commentDocuments = this.commentDocuments.concat(doc);
        });
        // this.replyButton=data.can_reply
      })
    this.historyList = [];
    this.documentDatas = [];
    this.approveData = [];
    this.recommenderData = [];
    this.OpinionListHistory = [];
    // this.dataService.getassign(id)
    // .subscribe((result) => {
    //   // this.assignedDocuments =[];
    //   let data = result['data'];
    //   this.assignData = data;
    //   this.assignedDocuments =[];
    //   data.forEach(element => {
    //     let doc = element.document
    //     this.assignedDocuments=this.assignedDocuments.concat(doc);
    //   });
    //   // this.replyButton=data.can_reply
    // });
  }

  getMemoHistoryView() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getnew_MemoHistoryView(this.mid,this.viewempids)
      .subscribe((result) => {
        let data = result['data'];
        this.historyList = data;
      })
  }

  Download_WoutComm() {
    this.SpinnerService.show();
    this.dataService.downloadnew_FilePDF(this.memoViewList.id, false,this.viewempids)
      .subscribe((data) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Memo.pdf";
        link.click();
      },
        error => {
          this.SpinnerService.hide();
        }

      )
  }

  Download_WithComm() {
    this.SpinnerService.show();
    this.dataService.downloadnew_FilePDF(this.memoViewList.id, true,this.viewempids)
      .subscribe((data) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Memo.pdf";
        link.click();
      },
        error => {
          this.SpinnerService.hide();
        })
  }

  printFile() {
    this.dataService.printFilePDF(this.mid)
      .subscribe((response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        window.open(downloadLink, "_blank");

        /*To open in same page use this comments*/

        // let downloadLink = document.createElement('a');
        // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        // downloadLink.click();


      })
  }


  fileChange(event) {
    this.images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
  }

  commentdraft_Click(commenttype, formGroup: FormGroup) {

    if (formGroup.value.content === "Approved..." || formGroup.value.content === "Resubmit..." || formGroup.value.content === "undefined") {
      // console.log("formGroup.value1 ", formGroup.value)
      return false;
    }

    this.commentdraftClick_disabled = true;
    this.SpinnerService.show();
    // console.log(commenttype)
    // console.log("formGroup.value2 ", formGroup.value)
    if (formGroup.value.content === "" || formGroup.value.content === null || formGroup.value.content === undefined) {
      this.SpinnerService.hide();
      this.commentdraftClick_disabled = false;
      this.notification.showError("Please enter valid comment/remarks");
      return false;
    }

    this.memoService.commentdraftClick(formGroup.value.content, this.mid, commenttype)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID DATA....")
        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Comment saved in draft....")
          this.commentdraftClick_disabled = false;
        }
      },
        error => {
          this.commentdraftClick_disabled = false;
          this.SpinnerService.hide();
        }
      );
  }

  stopInterval() {
    if (this.CommentintervalId) {
      clearInterval(this.CommentintervalId);
      this.CommentintervalId = null;
      // console.log("CommentintervalId stopped")
    }
  }

  createCommentform() {
    this.stopInterval()
    this.comment2Click_disabled = true;
    this.SpinnerService.show();
    if (this.commentForm.value.content === "" || this.commentForm.value.content === null) {
      this.SpinnerService.hide();
      this.comment2Click_disabled = false;
      this.notification.showError("Please enter valid comment/remarks");
      return false;
    }
    // let confirmData = confirm("Are you sure! Do you want to continue?")
    // if(confirmData){
    this.dataService.createCommentform(this.commentForm.value, this.mid, this.images)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID DATA....")

        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("submitted Successfully....")

        }
        this.images = null;
        this.getCommentData();
        this.getDocuments();
        this.getMemoHistoryView();
        this.getApprove();
        this.showValue.commentValue = false;
        this.addReply.comment = false;
        this.commentForm.reset();
        this.comment2Click_disabled = false;
      },
        error => {
          this.comment2Click_disabled = false;
          this.SpinnerService.hide();
        }
      );
    // }else{
    //   this.comment2Click_disabled = false;
    //         this.SpinnerService.hide();
    // }
  }

  createAssignform() {
    this.SpinnerService.show();
    this.memoService.createAssignform(this.assignForm.value, this.mid)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID DATA....")

        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("submitted Successfully....")

        }
        this.getassign();
        this.getDocuments();
        this.getMemoHistoryView();
        this.getApprove();
        this.showValues.assignValue = false;
        this.addReply.assign = false;
        this.assignForm.reset();
      },
        error => {
          this.SpinnerService.hide();
        }
      )
  }
  reviewpopup: boolean = true

  resubmitCommentForm() {
    // var answer = window.confirm("Resubmit this Memo?");
    // if (answer) {
    //   //some code
    // }
    // else {
    //   return false;
    // }
    this.stopInterval()
    this.Review2Click_disabled = true;
    // let confirmData = confirm("Are you sure! Do you want to continue?")
    // if(confirmData){
    this.SpinnerService.show();
    if (this.resubmitForm.value.content === "" || this.resubmitForm.value.content === null) {
      this.SpinnerService.hide();
      this.Review2Click_disabled = false;
      this.notification.showError("Please enter valid remarks");
      return false;
    }

    this.dataService.resubmitCommentForm(this.resubmitForm.value, this.mid, this.images)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Resubmitted Successfully....");
        this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        // this.reviewpopup=false
        // this.images = null;
        // this.getCommentData()
        // this.getDocuments();
        // this.getMemoHistoryView();
        // this.getApprove();

        // this.addReply.approve = false;
        // this.addReply.resubmit = false;
        // this.addReply.assign = false;
        // this.addReply.recommend = false;
        // this.approveForm.reset();
        // this.getReference(this.mid);
        // this.Review2Click_disabled = false;

      },
        error => {
          this.Review2Click_disabled = false;
          this.SpinnerService.hide();
        }
      );
    // }else{
    //   this.SpinnerService.hide();
    //   this.Review2Click_disabled = false;
    // }
  }

  approveCommentForm() {
    this.stopInterval()
    this.Approve2Click_disabled = true;
    this.SpinnerService.show();
    if (this.approveForm.value.content === "" || this.approveForm.value.content === null) {
      this.SpinnerService.hide();
      this.Approve2Click_disabled = false;
      this.notification.showError("Please enter valid remarks");
      return false;
    }
    if (this.paralleldelivery === true && this.recommendlist === 1) {
      let answer = confirm("Recommender didn't recommend. Do you want to proceed?");
      if (answer) {
        //some code

        // return false 
      }
      else {
        this.Approve2Click_disabled = false;
        this.SpinnerService.hide();
        return false;
      }
    }
    this.dataService.approveCommentForm(this.approveForm.value, this.mid, this.images)
      .subscribe(res => {
        this.SpinnerService.hide();
        if (res.code == "INVALID_APPROVER_ID" && res.description == "Invalid Approver Id") {
          this.notification.showWarning("Invalid Approver")
          this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        }
        else {
          this.notification.showSuccess("Approved Successfully....")
          this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        }
        return true
      },
        error => {
          this.Approve2Click_disabled = false;
          this.SpinnerService.hide();
        }
      )



    // let confirmData = confirm("Are you sure! Do you want to continue?")
    // if(confirmData ){
    //   this.dataService.approveCommentForm(this.approveForm.value, this.mid, this.images)
    // .subscribe(res => {
    //   this.SpinnerService.hide();
    //   if(res.code == "INVALID_APPROVER_ID" && res.description == "Invalid Approver Id"){
    //     this.notification.showWarning("Invalid Approver")
    //     this.router.navigate(["/ememo/memosummary"], { queryParams: {  MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
    //   }
    //   else{
    //   this.notification.showSuccess("Approved Successfully....")
    //   this.router.navigate(["/ememo/memosummary"], { queryParams: {  MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
    //   }
    // },
    //   error => {
    //     this.Approve2Click_disabled = false;
    //     this.SpinnerService.hide();
    //   }
    // )

    // }else{
    //   this.Approve2Click_disabled = false 
    //   this.SpinnerService.hide();
    // }




  }
  showValue = {
    commentValue: false,

  }
  showValues = {
    assignValue: false,
  }
  selectedIndex

  sho(selectedIndex) {
    this.selectedIndex = selectedIndex;
    this.showValue.commentValue = !this.showValue.commentValue
    this.showValues.assignValue = !this.showValues.assignValue
  }

  addReply = {
    comment: false,
    approve: false,
    resubmit: false,
    assign: false,
    recommend: false,
    opinion: false
  }



  historyStatus(action) {
    if (action["action"] === 1) {
      return "Memo Created";
    } else if (action["action"] === 2) {
      return "Memo Closed";
    } else if (action["action"] === 3) {
      return "Comment Added";
    } else if (action["action"] === 4) {
      return "Comment Added";
    } else if (action["action"] === 5) {
      return "Approved";
    } else if (action["action"] === 6) {
      return "Review/Resubmit initiated";
    } else if (action["action"] === 7) {
      return "Edited";
    } else if (action["action"] === 8) {
      return "Forwarded";
    } else if (action["action"] === 9) {
      return "Recommended";
    } else if (action["action"] === 10) {
      return "Not Recommended";
    } else if (action["action"] === 11) {
      return "Comment Ignored";
    } else if (action["action"] === 12) {
      return "Opinion Asked";
    } else if (action["action"] === 13) {
      return "Opinion Recommended";
    } else if (action["action"] === 14) {
      return "Opinion Not Recommended";
    } else if (action["action"] === 15) {
      return "Opinion Cancelled";
    } else if (action["action"] === 16) {
      return "Skipped";
    } else if (action["action"] === 17) {
      return "DA Recommended";
    } else if (action["action"] === 18) {
      return "DA Not Recommended";
    } else if (action["action"] === 19) {
      return "DA Opinion Asked";
    } else if (action["action"] === 20) {
      return "DA Opinion Recommended";
    } else if (action["action"] === 21) {
      return "DA Opinion Not Recommended";
    } else if (action["action"] === 22) {
      return "DA Approved";
    } else if (action["action"] === 23) {
      return "DA Review/Resubmit initiated";
    } else {
      return action["action"];
    }

  }

  approvedStatus(status) {
    if (status["approver_status"] === 0 || status["approver_status"] === 1) {
      return "Pending for Approval";
    } else if (status["approver_status"] === 2) {
      return "Approved";
    } else if (status["approver_status"] === 3) {
      return "Review/Resubmit initiated";
    } else if (status["approver_status"] === -1) {
      return "Pending For Approval";
    } else if (status["approver_status"] === 4) {
      return "Asked Opinion";
    } else if (status["approver_status"] === 6) {
      return "Skipped";
    } else if (status["approver_status"] === 7) {
      return "DA Pending for Approval";
    } else if (status["approver_status"] === 8) {
      return "DA Approved";
    } else if (status["approver_status"] === 9) {
      return "DA Rejected";
    } else if (status["approver_status"] === 10) {
      return "DA Asked Opinion";
    } else {
      return status["approver_status"];
    }

  }

  getDocuments() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getnew_Documents(this.mid,this.viewempids)
      .subscribe((result) => {
        let data = result['data'];
        this.documentDatas = data;
      })
  }

  getApprove() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getnew_Approve(this.mid,this.viewempids)
      .subscribe((result) => {
        let data = result['data'];
        this.approveData = data;
      });
  }

  getRecommender() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.ds_getRecommender(this.mid)
      .subscribe((result) => {
        let data = result['data'];
        this.recommenderData = data;
      });
  }

  getOpinion() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.ds_getOpinion(this.mid)
      .subscribe((result) => {
        let data = result['data'];
        this.OpinionList = data;
        // console.log("opinion list data ", this.OpinionList)
      });
  }
  getOpinionHistory() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.ds_getOpinionHistory(this.mid)
      .subscribe((result) => {
        let data = result['data'];
        this.OpinionListHistory = data;
        // console.log("opinion list data ", this.OpinionListHistory)
      });
  }

  assignedDocuments: any;
  getassign() {

    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getassign(this.mid)
      .subscribe((result) => {
        let data = result['data'];
        this.assignData = data;
        this.assignedDocuments = [];
        data.forEach(element => {
          let doc = element.document
          this.assignedDocuments = this.assignedDocuments.concat(doc);
        });
        this.replyButton = data.can_reply
      });
    // this.assignedDocuments =[];
  }


  getCommentData() {
    if (this.mid === undefined) {
      return false;
    }
    this.dataService.getCommentData(this.mid)
      .subscribe((result) => {
        let data = result['data'];
        this.commentDataList = data;
        this.commentDocuments = [];
        data.forEach(element => {
          let doc = element.document
          this.commentDocuments = this.commentDocuments.concat(doc);
        });
        this.replyButton = data.can_reply
      })
  }

  CloseMemo() {
    var answer = window.confirm("This note will not be available for further approval and comments in the future. Do you want to proceed?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.dataService.getCloseMemo(this.mid)
      .subscribe((result) => {
        this.SpinnerService.hide();
        this.toastr.success('Memo View', 'Memo closed ', { timeOut: 1500 });
      },
        error => {
          this.SpinnerService.hide();
        }
      )
    this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });

  }

  getTokenValues() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
  }

  imagePreview(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id
    let attachments = this.commentDocuments;
    attachments.forEach((element) => {
      let stringValue = element.file_name.split('.')
      if (file_name === element.file_name) {
        if (stringValue[1] === "pdf") {
          window.open(this.imageUrl + "memserv/memo/download/" + id + "?type=pdf&token=" + token, "_blank");
        }
      }

    })
    let data = this.sharedService.forwardMessage.value;
    let attachment = data['document_arr'];
    attachment.forEach((element) => {
      let stringValue = element.file_name.split('.')

      if (file_name === element.file_name) {
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
          this.imgfilename = this.imageUrl + "memserv/memo/download/" + id + "?token=" + token;

        }
        else {
          this.pdfUrls = this.imageUrl + "memserv/memo/download/" + id + "?type= " + file_name + "&token=" + token;
          let anchor = document.createElement('a');
          anchor.href = this.pdfUrls;
          anchor.target = '_blank';
          anchor.click();
          if (stringValue[1] === "pdf") {
            window.open(this.imageUrl + "memserv/memo/download/" + id + "?type=pdf&token=" + token, "_blank");
          }

        }
      }

    });

  }


  imagePreview_attachment(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      window.open(this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token, "_blank");
      // this.pdffilename=this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token
      // this.modalService.open(this.popupcontent,{size: 'xl', windowClass:"huge"})

    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      this.imgfilename = this.imageUrl + "memserv/memo/download/" + pdf_id + "?token=" + token;
      // this.modalService.open(this.popupcontent)
      // window.open( this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=" + fileextension + "&token=" + token, "_blank");

    }
    else {
      this.pdfUrls = this.imageUrl + "memserv/memo/download/" + pdf_id + "?type= " + this.fileextension + "&token=" + token;
      let anchor = document.createElement('a');
      anchor.href = this.pdfUrls;
      anchor.target = '_blank';
      anchor.click();

    }
  }
  downloaddata(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    this.pdfUrls = this.imageUrl + "memserv/memo/download/" + pdf_id + "?type= " + name + "&token=" + token;
    let anchor = document.createElement('a');
    anchor.href = this.pdfUrls;
    anchor.target = '_blank';
    anchor.click();

  }


  imagePreview_documentDatas(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id
    let attachments = this.commentDocuments;
    attachments.forEach((element) => {
      let stringValue = element.file_name.split('.')
      if (file_name === element.file_name) {
        if (stringValue[1] === "pdf") {
          window.open(this.imageUrl + "memserv/memo/download/" + id + "?type=pdf&token=" + token, "_blank");
        }
      }

    })
    let data = this.sharedService.forwardMessage.value;
    let attachment = data['document_arr'];
    attachment.forEach((element) => {
      let stringValue = element.file_name.split('.')

      if (file_name === element.file_name) {
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
          this.imgfilename = this.imageUrl + "memserv/memo/download/" + id + "?token=" + token;

        }
        else {
          this.pdfUrls = this.imageUrl + "memserv/memo/download/" + id + "?type= " + file_name + "&token=" + token;
          let anchor = document.createElement('a');
          anchor.href = this.pdfUrls;
          anchor.target = '_blank';
          anchor.click();
          if (stringValue[1] === "pdf") {
            window.open(this.imageUrl + "memserv/memo/download/" + id + "?type=pdf&token=" + token, "_blank");
          }

        }
      }

    });

  }
  public displayFnparent(apptype?: ApproverListss): string | undefined {
    return apptype ? apptype.full_name : undefined;
  }

  get apptype() {
    return this.assignForm.get('to');
  }

  formatDate(obj) {
    // return new Date(obj);
    return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }

  private getApprovers_Assignto() {
    if (this.mid === undefined) {
      return false;
    }
    this.memoService.getAssignto(this.mid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appList = datas;
      })
  }


  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    let attachment = this.commentDocuments;
    attachment.forEach((element) => {
      let stringValue = element.file_name.split('.')
      if (file_name === element.file_name) {
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
          this.imgfilename = this.imageUrl + "memserv/memo/download/" + id + "?token=" + token;

        }
        else {
          this.pdfUrls = this.imageUrl + "memserv/memo/download/" + id + "?type= " + file_name + "&token=" + token

          let anchor = document.createElement('a');
          anchor.href = this.pdfUrls;
          anchor.target = '_blank';
          anchor.click();
          if (stringValue[1] === "pdf") {
            window.open(this.imageUrl + "memserv/memo/download/" + id + "?type=pdf&token=" + token, "_blank");
          }

        }
      }
    });
  }
  getAssigntoList() {
    if (this.mid === undefined) {
      return false;
    }
    this.memoService.getAssignto(this.mid)
      .subscribe(result => {
        this.AssigntoList = result['data']
      })
  }

  addReplyCommentBtn(data) {

    // console.log(data);
    data = true;
    this.memoService.get_Comment(this.mid, this.commentType.comments)
      .subscribe(result => {
        if (result.content) {
          this.commentForm.patchValue({
            content: result.content
          })
        }
      })
    if (data) {
      this.can_approve;
      this.addReply.approve = false
      this.addReply.resubmit = false
      this.NormalView();
      this.addReply.assign = false
      this.addReply.recommend = false
      this.addReply.opinion = false
      this.assdata = false;
      this.cmtdata = true
    }

    this.stopInterval();
    this.i1 = 1
    this.CommentintervalId = setInterval(() => {
      // console.log("CommentintervalId" + this.i1);
      this.i1 = this.i1 + 1
      this.commentdraft_Click(this.commentType.comments, this.commentForm);
    }, 1000 * 120);
  }

  approveTextBtn(data) {
    data = true

    if (data) {
      this.addReply.comment = false;
      this.addReply.resubmit = false
      this.NormalView();
      this.addReply.resubmit = false;
      this.addReply.assign = false;
      this.addReply.recommend = false
      this.addReply.opinion = false
    }
    this.approveForm.patchValue({
      content: "Approved..."
    })
    this.memoService.get_Comment(this.mid, this.commentType.approver_cmt)
      .subscribe(result => {
        if (result.content) {
          this.approveForm.patchValue({
            content: result.content
          })
        }
      })
    this.stopInterval();
    this.i1 = 1
    this.CommentintervalId = setInterval(() => {
      // console.log("ApproveCommentintervalId" + this.i1);
      this.i1 = this.i1 + 1
      this.commentdraft_Click(this.commentType.approver_cmt, this.approveForm);
    }, 1000 * 120);
  }

  addAssignBtn(data) {

    data = true
    if (data) {
      this.addReply.comment = false;
      this.addReply.resubmit = false;
      this.addReply.approve = false;
      this.addReply.recommend = false;
      this.addReply.opinion = false
      this.cmtdata = false
      this.assdata = true

    }

  }
  addRecommendBtn(data) {
    data = true
    if (data) {
      this.addReply.comment = false;
      this.addReply.resubmit = false;
      this.addReply.approve = false;
      this.addReply.assign = false;
      this.addReply.opinion = false
      this.cmtdata = false
      this.assdata = false
    }
    this.memoService.get_Comment(this.mid, this.commentType.recommender_cmt)
      .subscribe(result => {
        if (result.content) {
          this.recommendForm.patchValue({
            content: result.content
          })
        }
      })
    this.stopInterval();
    this.i1 = 1
    this.CommentintervalId = setInterval(() => {
      // console.log("CommentintervalId" + this.i1);
      this.i1 = this.i1 + 1
      this.commentdraft_Click(this.commentType.recommender_cmt, this.recommendForm);
    }, 1000 * 120);

  }

  resubmitTextBtn(data) {
    data = true
    if (data) {
      this.addReply.comment = false;
      this.addReply.approve = false;
      this.NormalView();
      this.addReply.assign = false;
      this.addReply.recommend = false;
      this.addReply.opinion = false
    }
    this.resubmitForm.patchValue({
      content: 'Resubmit...'
    })
    this.memoService.get_Comment(this.mid, this.commentType.reviewresubmit)
      .subscribe(result => {
        if (result.content) {
          this.resubmitForm.patchValue({
            content: result.content
          })
        }
      })
    this.stopInterval();
    this.i1 = 1
    this.CommentintervalId = setInterval(() => {
      // console.log("ResubmitCommentintervalId" + this.i1);
      this.i1 = this.i1 + 1
      this.commentdraft_Click(this.commentType.reviewresubmit, this.resubmitForm);//<!-- comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8 ,reviewresubmit=9-->
    }, 1000 * 120);
  }

  OpinionTextBtn(data) {
    data = true
    if (data) {
      this.addReply.comment = false;
      this.addReply.approve = false;
      this.NormalView();
      this.addReply.assign = false;
      this.addReply.recommend = false;
      // this.addReply.opinion = false  
    }
    this.opinionForm.patchValue({
      content: 'Recommended'
    })
    this.memoService.get_Comment(this.mid, this.commentType.opinion_cmt)
      .subscribe(result => {
        if (result.content) {
          this.opinionForm.patchValue({
            content: result.content
          })
        }
      })
    this.stopInterval();
    this.i1 = 1
    this.CommentintervalId = setInterval(() => {
      // console.log("CommentintervalId-opinion" + this.i1);
      this.i1 = this.i1 + 1
      this.commentdraft_Click(this.commentType.opinion_cmt, this.opinionForm);
    }, 1000 * 120);
  }

  onCancel(data) {
    data = true;
    if (data) {
      this.stopInterval();
      this.notification.showWarning("Cancelled!.")
    }
  }


  addResubmitBtn(data) {
    this.addReply.resubmit = false
  }
  content: any
  startIndex: number;
  endIndex: number;

  superscriptlist: any
  highlight() {


    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    const {
      commonAncestorContainer,
      startContainer,
      endContainer,
      startOffset,
      endOffset,
    } = range;
    const nodes = [];



    console.groupEnd();
    this.addnumber = this.superscriptlist.length + 1



    if (startContainer === endContainer) {
      const span = document.createElement("span");
      span.className = "highlight";
      span.setAttribute('title', this.addnumber);
      span.setAttribute('value', this.addnumber);
      range.surroundContents(span);
      return;
    }

    // get all posibles selected nodes
    function getNodes(childList) {
      console.group("***** getNode: ", childList);
      childList.forEach((node) => {
        const nodeSel = sel.containsNode(node, true);

        // if is not selected
        if (!nodeSel) return;

        const tempStr = node.nodeValue;

        if (node.nodeType === 3 && tempStr.replace(/^\s+|\s+$/gm, "") !== "") {
          nodes.push(node);
        }

        if (node.nodeType === 1) {
          if (node.childNodes) getNodes(node.childNodes);
        }
      });
      console.groupEnd();
    }

    getNodes(commonAncestorContainer.childNodes);


    nodes.forEach((node, index, listObj) => {
      const { nodeValue } = node;
      let text, prevText, nextText;

      if (index === 0) {
        prevText = nodeValue.substring(0, startOffset);
        text = nodeValue.substring(startOffset);
      } else if (index === listObj.length - 1) {
        text = nodeValue.substring(0, endOffset);
        nextText = nodeValue.substring(endOffset);
      } else {
        text = nodeValue;
      }

      const span = document.createElement("span");
      span.className = "highlight";
      span.setAttribute('title', this.addnumber);
      span.setAttribute('value', this.addnumber);
      span.append(document.createTextNode(text));
      const { parentNode } = node;

      parentNode.replaceChild(span, node);

      if (prevText) {
        const prevDOM = document.createTextNode(prevText);
        parentNode.insertBefore(prevDOM, span);
      }

      if (nextText) {
        const nextDOM = document.createTextNode(nextText);
        parentNode.insertBefore(nextDOM, span.nextSibling);
      }
    });

    sel.removeRange(range);

  }

  // content: any
  updateModel(event) {
    this.content = document.getElementById('para').innerHTML

  }

  closepopup() {
    this.titlesinglevar = ""


  }
  titlesinglevar: any
  arraybool: boolean
  nonarraybool: boolean
  idval: any
  idmatchval: any
  popover: boolean = true
  comtdate: any
  empname: any
  title: any;

  @HostListener('document:mouseover', ['$event'])



  mouseover(event) {
    if (event.target.matches('.highlight')) {
      this.title = event.target.innerHTML

      // if (this.idval === event.composedPath()[0].attributes.value.value) {
      //   this.popover = false
      // }
      //   if (this.idval != event.composedPath()[0].attributes.value.value) {
      //       this.popover = true
      //  }
      this.idval = event.composedPath()[0].attributes.value.value

      if (event.composedPath()[1].attributes.length === 0 || event.composedPath()[1].attributes[0].name != "class") {
        this.superscriptlist.forEach((element, index) => {

          if (event.composedPath()[0].attributes.value.value == element.order) {
            this.superscriptid = element.id
            let a = element.order

            // event.composedPath()[0].title = element.comments[i].content
            // this.titlesinglevar = element.comments[i].content
            // this.comtdate = element.comments[i].created_date
            // this.empname=element.comments[i].created_by.full_name
            let listvalue = this.superscriptlist
            for (var i = 0; i < listvalue.length; i++) {
              if (a == listvalue[i].order) {
                this.commentlist = listvalue[i].comments
              }
            }

            this.nonarraybool = true
            this.arraybool = false
          }
        })
        this.nonarraybool = true
        this.arraybool = false
        if (this.popover === true) {
          document.getElementById("myCheck").click();
        }
      }
      else {
        this.superscriptlist.forEach((element, index) => {
          let x = 15
          this.arrays = []
          for (var i = 0; i < x; i++) {
            if (event.composedPath()[i].attributes.length === 3) {
              let jsonof = {
                value: event.composedPath()[i].attributes.value.value,
                title: event.composedPath()[i].attributes.title.value
              }
              this.arrays.push(jsonof)
              this.nonarraybool = false
              this.arraybool = true
            }
            else {
              this.wish(event)
              break;
            }
          }
        })
        this.wish(event)
      }
    }
  }

  arrays: any[] = [];

  immediate: any[] = [];
  finalist: any[] = [];
  isabc: boolean

  wish(e) {
    this.immediate = []
    // this.arrays.sort((a, b) => (a.value > b.value ? 1 : -1))

    var today = new Date();
    var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let j = 0

    this.superscriptlist.forEach((element, index) => {
      if (this.arrays[j].value == element.order) {
        let jsons = {
          remarks: element.comments[0].content,
          dates: element.comments[0].created_date,
          employees: element.comments[0].created_by.full_name
        }
        this.immediate.push(jsons)
        j++

      }
      if (this.popover === true) {
        document.getElementById("myCheck").click();


      }

    })
  }
  b: any



  bindSelection(event) {

    if (this.isSender === false) {

      // setTimeout(() => {
      //   this.content = event.target.innerHTML;
      // }, 1000)
      this.content = document.getElementById('para').innerHTML
      this.selectText = window.getSelection().toString();
      let selection = window.getSelection();
      let start = window.getSelection().getRangeAt(0).startOffset
      this.startIndex = start;
      let end = window.getSelection().getRangeAt(0).endOffset
      this.endIndex = end;
      //this.textSelect();
      this.highlight();
      // this.abc = this.sanitizer.bypassSecurityTrustHtml(this.contentName)
      // this.xyz = this.abc.changingThisBreaksApplicationSecurity
      // if (this.selectText === "") {
      //   this.isSuperScript = false;

      // }
      // else{
      //   this.isSuperScript = true;
      //   this.content = document.getElementById('para').innerHTML

      // }

      // if (this.selectText === "" || this.reviewpopup===false) {
      //   this.isSuperScript = false;

      // }
      if (this.selectText === "" || this.MemoStatus_openclosed === 'CLOSED' || this.Versioned === true ||
        // (this.can_recommend ===false && this.can_approve ===false)||
        this.reviewpopup === false

      ) {
        this.isSuperScript = false;

      }

      // if(this.can_recommend ===false && this.can_approve ===false){
      //   this.isSuperScript = false;

      // }
      else {
        this.isSuperScript = true;
        this.content = document.getElementById('para').innerHTML

      }
      // if(this.can_recommend ===true || this.can_approve ===true){
      //   this.isSuperScript = true;
      //   this.content = document.getElementById('para').innerHTML


      // }
      // if(this.can_approve ===true){
      //   this.isSuperScript = true;

      // }
      // else{
      //   this.isSuperScript = true;
      //   this.content = document.getElementById('para').innerHTML

      // }
      // if(this.can_approve===true || this.can_recommend ===true){
      //   this.isSuperScript = true;
      //   this.content = document.getElementById('para').innerHTML

      // }
      // else {
      //   this.isSuperScript = true;
      //   this.content = document.getElementById('para').innerHTML

      //   // this.abc=this.sanitizer.bypassSecurityTrustHtml(this.contentName)
      //   // this.xyz=this.abc.changingThisBreaksApplicationSecurity
      //   // this.lmn=this.xyz.replace(this.selectText,`<span style="color:green;">${this.selectText}</span>`)

      // }
    }

  }
  replacestring = 'Letraset'

  abc: any
  xyz: any;
  lmn: any
  addnumber: any
  hiddenvariable: any
  hiddens: any
  process_selected_nodes(pNode, nodes, range) {
    var stext = '';
    var otext = '';

    for (var i = 0; i < nodes.length; i++) {
      stext = stext + " " + nodes[i].innerHTML;
      otext = otext + " " + nodes[i].outerHTML;
    }
  }

  process_selected_text(pNode, node, startOffset, endOffset) {
    var sl = node.textContent.length;
    var parent = node.parentNode;
    var stext = '';
    var otext = '';
    for (var i = startOffset; i < endOffset; i++) {
      stext = stext + node.textContent[i];
    }
    otext = otext + " " + parent.outerHTML;
  }

  textSelect() {
    var selection = document.getSelection();
    var pNode = document.getElementById("SuperScriptContent");
    var aNode = selection.anchorNode.parentElement;
    var range = selection.getRangeAt(0);
    var startNode = range.startContainer;
    var endNode = range.endContainer;
    var startOffset = range.startOffset;
    var endOffset = range.endOffset;
    var selected_nodes = range.cloneContents().querySelectorAll("*");
    var stext = '';
    var selected_nodes_length = selected_nodes.length;
    var len_diff = startOffset - endOffset;
    if (selected_nodes_length > 0) {
      this.process_selected_nodes(pNode, selected_nodes, range);
    } else if (len_diff != 0) {
      this.process_selected_text(pNode, startNode, startOffset, endOffset);
    } else {
      console.log('No text selected');
    }
  }

  close() {
    if (this.hiddenvariable == undefined) {
      this.hiddenvariable = this.contentName
    }
    document.getElementById('para').innerHTML = this.hiddenvariable
  }
  superScriptFormCreate() {
    let dataValue = this.superScriptForm.value;
    if (dataValue.remarks === "" || dataValue.remarks === null) {
      this.notification.showWarning("Invalid remarks")
      return true;
    }
    this.hiddenvariable = document.getElementById('para').innerHTML
    this.abc = this.sanitizer.bypassSecurityTrustHtml(this.contentName)
    this.xyz = this.abc.changingThisBreaksApplicationSecurity

    let finale = {
      content: this.xyz,
      memo_id: this.mid,
      ref_id: this.mid,
      status: "comment",
      type: 2,
      super_script: {
        start_index: this.startIndex,
        end_index: this.endIndex,
        remarks: dataValue.remarks,
        content: this.content
      }
    }

    this.SpinnerService.show();
    this.dataService.superScriptForm(this.mid, finale)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showWarning("Duplicate Code & Name ...")

        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID_DATA!...")

        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Success!")
          this.superScriptForm.reset()
          this.closebutton.nativeElement.click();
          this.showannotation = true;
          this.showannotations = false;
          this.contentName = this.content
          this.getSuperScript();

        }

      },
        error => {
          this.SpinnerService.hide();
        }
      )
  }
  supindex: any
  order: any

  getSuperScript() {
    this.dataService.getSuperScript(this.mid)
      .subscribe(result => {

        let script = result.data;
        this.superscriptlist = script
        this.supindex = this.superscriptlist.length + 1
        script.forEach((element, index) => {
          let indexValue = index;
          this.scriptContent = element.content;
          for (var i = 0; i < element.comments.length; i++) {
            this.scriptRemarks = element.comments[i].content;


          }

          let supSript: string = "[" + indexValue + "]"
          let final: string =
            "<b  >" + this.scriptContent + "<sup  title = " + "'" + this.scriptRemarks + "'" + ">" + supSript + "</sup>" + "</b>"
          this.contentName = this.contentName.replace(this.scriptContent, final)

        });
      })
  }


  commentCreateForm() {
    this.SpinnerService.show();
    this.dataService.createcommentsForm(this.ForwardcommentForm.value, this.mid)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Submitted Successfully!...");
        this.frwdcmts = false;
        this.dataService.getForwardComments(this.mid)
          .subscribe((result) => {
            this.commentdata = result['data']
            for (var i = 0; i < this.commentdata.length; i++) {
              this.commentdata1 = this.commentdata[i].content
            }
            this.SpinnerService.hide();
          },
            error => {
              this.SpinnerService.hide();
            }
          )
        this.ForwardcommentForm.reset();
        this.closebutton.nativeElement.click();
      },
        error => {
          this.SpinnerService.hide();
        }
      )

  }
  submitRecommendBtn() {
    this.stopInterval()
    this.Recommend2Click_disabled = true;
    this.SpinnerService.show();
    if (this.recommendForm.value.content === "") {
      this.SpinnerService.hide();
      this.Recommend2Click_disabled = false;
      this.notification.showError("Please enter valid content/remarks");
      return true;
    }
    if (this.recommendForm.value.status === "") {
      this.SpinnerService.hide();
      this.Recommend2Click_disabled = false;
      this.notification.showError("Please select Recommended or Not Recommended");
      return true;
    }
    if (this.PartiallyApproved === true && this.recommendForm.value.status === "not_recommended") {
      this.SpinnerService.hide();
      this.Recommend2Click_disabled = false;
      this.notification.showError("This is approved memo.You can not select NOT RECOMMENDED");
      return true;
    }

    // let confirmData = confirm("Are you sure! Do you want to continue?")
    // if(confirmData){
    this.dataService.reCommendForm(this.recommendForm.value, this.mid, this.images)
      .subscribe(res => {
        if (res.code === undefined) {
          if (this.recommendForm.value.status === "not_recommended") {
            this.SpinnerService.hide();
            this.notification.showSuccess("Updated as Not Recommended")
          } else {
            this.SpinnerService.hide();
            this.notification.showSuccess("Recommended Successfully")

          }
          this.can_recommend = false;
          this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });

        } else {
          this.SpinnerService.hide();
          this.notification.showError(res.description)
          this.Recommend2Click_disabled = false;

        }
      },
        error => {
          this.Recommend2Click_disabled = false;
          this.SpinnerService.hide();
        }
      );
    // }else{
    //     this.Recommend2Click_disabled = false;
    //     this.SpinnerService.hide();
    // }
  }
  submitparallel() {
    var answer = window.confirm("Parallel Delivery?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.dataService.ParallelDelivery(this.mid)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Not Updated");
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Updated Successfully");
          this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      )
  }
  submitannotation() {
    var answer = window.confirm("Send Notification?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.dataService.AnnotationNotification(this.mid)
      .subscribe(res => {

        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Invalid Data or DB Constraint...");

        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Success...");
          this.showannotation = false;
          this.showannotations = false;
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      )
  }
  removeComment(comment) {
    var answer = window.confirm("Delete this comment?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.memoService.removeComment_service(comment.id)
      .subscribe((data) => {
        this.SpinnerService.hide();
        this.notification.showSuccess(data.message);
        this.getCommentData();
      },
        error => {
          this.SpinnerService.hide();
        });
  }
  commentsubmit() {
    this.SpinnerService.show();
    if (this.superScriptCommentForm.value.remarks === "") {
      this.SpinnerService.hide();
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.dataService.CreateAnnotation(this.superScriptCommentForm.value, this.mid, this.superscriptid)
      .subscribe(res => {

        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Invalid Data or DB Constraint...");
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Success...");
          this.superScriptCommentForm.reset()
          this.closebutton1.nativeElement.click();
          // this.content= this.scriptRemarks
          this.getSuperScript();
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      )



  }
  values: any
  commentEditForm() {
    this.SpinnerService.show();
    if (this.SuperscriptEditForm.value.remarks === "") {
      this.SpinnerService.hide();
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.dataService.superscriptEditForm(this.SuperscriptEditForm.value, this.mid, this.values, this.superscriptid)
      .subscribe(res => {

        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Invalid Data or DB Constraint...");
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Updated Successfully");
          this.superScriptCommentForm.reset()
          this.closebutton1.nativeElement.click();
          this.closebutton2.nativeElement.click();
          this.getSuperScript();
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      )

  }
  data(data) {
    this.values = data.id
    this.SuperscriptEditForm.patchValue({
      remarks: data.content
    })
  }

  removescriptComment(comment) {
    var answer = window.confirm("Delete this comment?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.SpinnerService.show();
    this.dataService.superscriptDeleteForm(comment.id)
      .subscribe(res => {

        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Invalid Data or DB Constraint...");

        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Deleted Successfully");
          this.superScriptCommentForm.reset()
          this.closebutton1.nativeElement.click();
          this.getSuperScript();
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      )


  }
  back() {
    this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
  }



  ChoosingEmpForOpinion() {
    // console.log("chip selectedd emp data for Opinion ", this.chipSelectedEmployeeApproverid)
    if (this.chipSelectedEmployeeApproverid?.length == 0) {
      this.notification.showWarning("Please select atleast One")
      return false
    }
    if (this.Opinioncontent.value == '' || this.Opinioncontent.value == null || this.Opinioncontent.value == undefined) {
      this.notification.showWarning("Please fill Remarks")
      return false
    }
    let dataEmpForOpinion = this.chipSelectedEmployeeApproverid
    // this.dataService.SelectedEmpOpinionform( dataEmpForOpinion, this.mid)


    let objEmpopinion = {
      memo_id: this.mid,
      to: [],
      comment: this.Opinioncontent.value
    }
    for (let emp in dataEmpForOpinion) {
      let ordersOpinion = {
        id: dataEmpForOpinion[emp],
        order: parseInt(emp) + 1,
      }
      objEmpopinion.to.push(ordersOpinion)
    }

    // console.log("objEmpopinion data for submit", objEmpopinion)

    this.dataService.SelectedEmpOpinionform(objEmpopinion)
      .subscribe(res => {
        // console.log(res)

        if (res?.code == 'INVALID_DATA' && res?.description == 'INVALID OPINIONER') {
          this.notification.showWarning("INVALID OPINIONER")
          return false
        }
        else {
          this.notification.showSuccess("Opinion Request Raised Successfully....")
          this.chipSelectedEmployeeApprover = []
          this.chipSelectedEmployeeApproverid = []
          this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
        }
        return true
      }, error => {

      })
  }


  createOpinionform() {
    this.stopInterval()
    this.Opinion2Click_disabled = true;
    this.SpinnerService.show();
    if (this.opinionForm.value.content === "" || this.opinionForm.value.content === null) {
      this.SpinnerService.hide();
      this.Opinion2Click_disabled = false;
      this.notification.showError("Please enter valid Opinion/remarks");
      return false;
    }
    if (this.opinionForm.value.status === 2 && this.can_opinion_status === "DA Pending") {
      this.opinionForm.patchValue({
        status: 8 //DA Approved
      })
    }
    if (this.opinionForm.value.status === 3 && this.can_opinion_status === "DA Pending") {
      this.opinionForm.patchValue({
        status: 9 //DA Rejected
      })
    }
    this.dataService.createOpinionform(this.opinionForm.value, this.mid)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID DATA....")

        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Submitted Successfully....")
          this.images = null;
          this.getCommentData();
          this.getDocuments();
          this.getMemoHistoryView();
          this.getApprove();
          this.getOpinion();
          this.getFetch();
          this.showValue.commentValue = false;
          this.addReply.opinion = false;
          this.opinionForm.reset();
          this.Opinion2Click_disabled = false;

        }

      },
        error => {
          this.Opinion2Click_disabled = false;
          this.SpinnerService.hide();
        }
      );
  }


  OpinionChange(event: MatRadioChange) {
    // console.log(event.source.name, event.value);
    let OpinionValueChange = event.value == 2 ? 'Recommended' : 'Not Recommended'
    this.opinionForm.patchValue({
      content: OpinionValueChange
    })
  }

  cancelopinionRequest() {
    let confirmData = confirm("Are you sure do you want to Cancel the opinion request?")
    if (confirmData) {
      let objCancelOpinion = {
        memo_id: this.mid
      }
      this.dataService.CancelOpinionform(objCancelOpinion)
        .subscribe(res => {
          // console.log(res)

          if (res?.code == 'INVALID_DATA' && res?.description == 'INVALID OPINIONER') {
            this.notification.showWarning("INVALID OPINIONER")
            return false
          }
          else {
            this.notification.showSuccess("Opinion Request Raised Successfully....")
            // this.getFetch();
            this.router.navigate(["/ememo/memosummary"], { queryParams: { MemoView: "NO" }, skipLocationChange: isSkipLocationChange });
          }
          return true
        }, error => {

        })
    }

  }





}