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
  selector: 'app-memoskip',
  templateUrl: './memoskip.component.html',
  styleUrls: ['./memoskip.component.scss']
})
export class MemoskipComponent implements OnInit {
  public SelectedApprover = [];
  @ViewChild('txtComments') txtComments: ElementRef;
  commentdraftClick_disabled = false;
  CommentintervalId: any;
  commentType = {
    comments: 1, superscript: 2, forward: 3, reply: 4, opinion_cmt: 5, approver_cmt: 6, recommender_cmt: 7, skip_cmt: 8, reviewresubmit: 9
  }

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
  approveData: Array<any>;
  recommenderData: Array<any>;
  attachmentData: Array<any>
  mid: any;
  memoviewfrom: string;
  images: string[] = [];
  replyButton = false;
  can_approve: boolean;
  Ask_Opinion: boolean;
  CancelAskedOpinion: boolean
  Add_Opinion: boolean = false
  is_toemployee: boolean;
  is_sender_dept: boolean;
  can_comment: boolean;
  MemoStatus_openclosed: any;
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
  approveTextValue = " Approved..."
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


  contentScript: any;
  recommendlist: any;


  isLoading = false;
  AssigntoList: any;
  assignData: any;
  commentdatas: any
  comment: any;
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
  constructor(private dataService: DataService, private http: HttpClient,
    private notification: NotificationService, private memoService: MemoService,
    private router: Router, private activateRoute: ActivatedRoute, private fb: FormBuilder,
    private sanitizer: DomSanitizer, private route: ActivatedRoute,
    public sharedService: SharedService, private toastr: ToastrService,
    private renderer: Renderer2, private el: ElementRef,
    private modalService: NgbModal, public datepipe: DatePipe, private SpinnerService: NgxSpinnerService
  ) { this.offset = new Date().getTimezoneOffset(); }

  ngOnDestroy() {
    this.stopInterval();
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.mid = params.mid;
        this.memoviewfrom = params.from;
        this.permissionToHandle = params.permissionToHandle
        if (this.permissionToHandle == undefined) {
          this.permissionToHandle = 'true'
        }
        this.sharedService.fetchData.next(this.mid);
      }
      );
    this.getFetch();
    this.getOpinion();
    this.memoService.get_Comment(this.mid, this.commentType.skip_cmt)
      .subscribe(result => {
        if (result.content) {
          this.txtComments.nativeElement.value = result.content
        }
      })
  }

  onTextareaFocus() {
    // Handle the focus event here
    // console.log('Textarea focused');
    this.stopInterval();
    this.CommentintervalId = setInterval(() => {
      // console.log("CommentintervalId skip" );
      this.commentdraft_Click(this.commentType.skip_cmt);
    }, 1000 * 120);
  }

  getFetch() {
    if (this.mid === undefined) {
      return false;
    }
    // console.log("getFetch data called ")
    this.dataService.getFetch(this.mid)
      .subscribe((data) => {
        this.commentdatas = data.is_forward_comment;
        this.paralleldelivery = data.parallel_delivery;
        this.subjectName = data.subject;
        this.manualreference = data.manual_reference;
        this.watermarktext = data.watermark_txt;
        if (data.superscript_content == null) {
          this.contentName = data.content;
        }
        this.contentScript = data.content;

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
        if (data?.opinion?.id == 1 && (this.can_approve == true || this.can_recommend == true) && this.MemoStatus_openclosed == 'OPEN') {
          askopinionValidation = true
        } else {
          askopinionValidation = false
        }

        this.Ask_Opinion = askopinionValidation
        // console.log("ask opinion validation>>>>>", this.Ask_Opinion, data?.opinion?.id, this.can_approve, this.can_recommend, this.MemoStatus_openclosed)
        this.Add_Opinion = data?.can_opinion
        this.CancelAskedOpinion = data?.asked_opinion


        let toValue = data['to_emp'];
        this.toList = toValue;
        this.Versioned = data.versioned;
        let approve = data['approver'];
        this.approverList = approve.sort((n1, n2) => n1.order - n2.order);
        this.AllareApproved = true;
        this.PartiallyApproved = false;
        this.NoofPending_Approvers = 0;
        // console.log("this.approverList",this.approverList)
        this.approverList.forEach((al) => {
          if (al.status !== 2) {
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
        // this.SpinnerService.show()
        // this.memoService.getMemoSequence(this.mid)
        //   .subscribe((results) => {
        //     this.SpinnerService.hide()
        //     this.memolist = results["data"];
        //   }, error => {
        //     this.SpinnerService.hide()
        //   });
      })
  }

  SelectSkipCheckBox(event, skipObj) {
    // console.log(event.target.checked);
    // console.log(skipObj);
    if (event.target.checked == true) {
      this.SelectedApprover.push(skipObj);
    }
    if (event.target.checked == false) {
      const index = this.SelectedApprover.indexOf(skipObj);
      if (index >= 0) {
        this.SelectedApprover.splice(index, 1);
      }
    }
    // console.log(this.SelectedApprover)
  }
  btnSubmit() {
    // console.log(this.txtComments);
    // console.log(this.txtComments.nativeElement.value);
    var answer = window.confirm("Skip Memo?");
    if (answer == false) {
      return false;
    }
    if (this.txtComments.nativeElement.value === "" || this.txtComments.nativeElement.value === null || this.txtComments.nativeElement.value === undefined) {
      this.SpinnerService.hide();
      this.notification.showError("Please enter valid comment/remarks");
      return false;
    }
    this.stopInterval()
    if (this.SelectedApprover.length === 0) {
      this.SpinnerService.hide();
      this.toastr.error('SKIP MEMO', 'Pls select valid Recommender/Approver', { timeOut: 1500 });
      return false;
    }
    let objSkipMemo = {
      "memo_id": this.mid,
      "to": this.SelectedApprover,
      "type": this.commentType.skip_cmt,
      "comment": this.txtComments.nativeElement.value
    }
    this.SpinnerService.show();
    this.dataService.SkipMemo_service(objSkipMemo)
      .subscribe(res => {
        this.SpinnerService.hide();
        if (res.code === 'INVALID_DATA') {
          this.notification.showError(res.description);
        } else {
          this.notification.showSuccess("Updated Successfully....")
          this.router.navigate(["/ememo/memoView"], { queryParams: { mid: this.mid, from: this.memoviewfrom, permissionToHandle: this.permissionToHandle }, skipLocationChange: isSkipLocationChange });
        }
      },
        error => {
          this.SpinnerService.hide();
        }
      );

  }
  btnBack() {
    this.router.navigate(["/ememo/memoView"], { queryParams: { mid: this.mid, from: this.memoviewfrom, permissionToHandle: this.permissionToHandle }, skipLocationChange: isSkipLocationChange });
  }

  commentdraft_Click(commenttype) {
    this.commentdraftClick_disabled = true;
    this.SpinnerService.show();
    // console.log(commenttype)
    // console.log("formGroup.value2 ", this.txtComments.nativeElement.value)
    if (this.txtComments.nativeElement.value === "" || this.txtComments.nativeElement.value === null || this.txtComments.nativeElement.value === undefined) {
      this.SpinnerService.hide();
      this.commentdraftClick_disabled = false;
      this.notification.showError("Please enter valid comment/remarks");
      return false;
    }
    this.memoService.commentdraftClick(this.txtComments.nativeElement.value, this.mid, commenttype)
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
  status(status) {
    if (status["memo_status"] === 1) {
      return "OPEN"
    } else if (status["memo_status"] === 0) {
      return "DRAFT"
    } else {
      return "CLOSED"
    }
  }






  formatDate(obj) {
    // return new Date(obj);
    return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }

}
class SkipMemo {
  memo_id: any;
  to: any;
  comment: any;
}
