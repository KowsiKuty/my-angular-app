import { Component, OnInit, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { RemsService } from '../rems.service';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { fromEvent } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment'

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
  selector: 'app-premisedocinfo-view',
  templateUrl: './premisedocinfo-view.component.html',
  styleUrls: ['./premisedocinfo-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PremisedocinfoViewComponent implements OnInit {
  premiseDocInfoForm: FormGroup
  approverForm: FormGroup
  approverFormForReject: FormGroup
  premiseDocumentInfoData: any;
  commentForm: FormGroup;
  defaultValue: string = '';
  docno: number = 0
  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  imageUrl = environment.apiURL
  hideid: boolean;
  doccreatecheck: any
  premiseIdViewData: any;
  premisenameViewData: any;
  approvedData: any;
  selectable = true;
  dropDownTag = "premise_document_info";
  next_docInfo = true;
  previous_docInfo = true;
  isDocInfo = false;
  presentPageDocInfo: number = 1;
  pageSizeDocInfo = 10;
  fileextension: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closePop') closePop;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  @ViewChild('primaryyContactInput') primaryyContactInput: any;
  @ViewChild('autoPrimary1') matAutocomplete: MatAutocomplete;
  primaryContactList: any;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  documentTypeData: any;
  documentTypeapp: any;
  documentTypecomments: any;
  images: any;
  imagess: any;
  approvalflag: any;
  imagesforApprover: any;

  premiseIdentification: number;
  idValue: number;
  isDocInfoForm = true
  isDocumentCountButton = true
  ispremisename = true
  id: any;
  iList: any;
  abc: any
  abcd: any
  iMasterList: any;
  has_premisesnamenext = true;
  has_premisesnameprevious = true;
  premisesnamecurrentpage: number = 1;

  // ismakercheckerButton: boolean = true
  textbox: boolean = false
  click: boolean[]

  docid: any
  premisesName: string;
  rolesvalue: any
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  isApprove = false;
  isReject = false;
  termDetailsForm: FormGroup;
  premiseIdentificationId: number;
  proposedPremiseId: number;
  termDetailsList: any;
  isTermDetails: boolean;
  termDetailsId: number;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective
  constructor(private shareService: RemsShareService, private router: Router, private fb: FormBuilder,
    private notification: NotificationService, private toastr: ToastrService,
    private sharedService: SharedService, private remsservice: RemsService, private datePipe: DatePipe,
    private remsService: Rems2Service,) { }

  ngOnInit(): void {
    console.log("doccreatecheck", this.doccreatecheck)
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "REMS") {
        this.iMasterList = subModule;
        // this.rolesvalue=this.iMasterList.name
        this.rolesvalue = element.role[0].name
        console.log('emplyeerole', this.rolesvalue)
        if (this.rolesvalue === "Checker") {
          // this.ismakercheckerButton = false
        }
        if (this.rolesvalue === "Maker") {
          // this.ismakercheckerButton = true
        }




      }
      if (element.role[0].name === "Checker") {
        // this.ismakercheckerButton = false
        // this.rolesvalue=element.role[0].name
        // console.log('emplyeerole', this.rolesvalue)


        console.log('cakerr', element.role.name)

      }

    });
    let data: any = this.shareService.premisenameView.value;
    let dataa: any = this.shareService.premisenameeView.value;
    console.log("data>>1", data)
    console.log("data>>2", dataa)
    this.abc = data
    this.abcd = dataa
    this.premisesName = dataa;

    this.commentForm = this.fb.group({
      content: ['',],
      doctype: [''],
      identificationdocinfo_id: [this.docid],
      approval_flag: [],
      status: []


    })

    this.approverForm = this.fb.group({
      approved_rent: [''],
      content: [''],
      doctype: ['']

    })

    this.approverFormForReject = this.fb.group({
      content: [''],


    })



    //   this.commentForm.patchValue({
    //     content: commentForm.content,
    //     identificationdocinfo_id: this.docid
    //  });

    this.premiseDocInfoForm = this.fb.group({
      doctype: ['', Validators.required,],
      // initiation_date: ['', Validators.required],
      approved_by: ['', Validators.required],
      remarks: ['', Validators.required],
      premiseidentificationname: ['', Validators.required],
      images: []

    })
    this.premiseDocInfoForm.get("premiseidentificationname").setValue(this.abcd)
    this.id = this.shareService.premiseIdView.value;
    // this.id = this.shareService.premiseIdnameView.value;


    let primaykey: String = "";
    this.primaryContact(primaykey);
    this.premiseDocInfoForm.get('approved_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsservice.approvername(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })



    let primaykey1: String = "";
    this.primaryContact1(primaykey1);
    this.premiseDocInfoForm.get('premiseidentificationname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsservice.premisesName(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.iList = datas;
      })
    // this.docInfoEdit();
    this.getDocumentType();
    this.getPremiseIDView();
    // this.getPremisename();
    this.getcomments();
    this.getPremisenameView();
    this.approvedGet();
    this.documentTypeApp();
    this.documentTypeComments();


    this.termDetailsForm = this.fb.group({
      term: ['',],
      base_rent: ['',],
      no_of_month: ['',],
    })

  }

  premisesNameScroll() {
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
              if (this.has_premisesnamenext === true) {
                this.remsservice.premisesNameloadmore(this.primaryyContactInput.nativeElement.value, this.premisesnamecurrentpage + 1, 'all')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.iList = this.iList.concat(datas);
                    if (this.iList.length >= 0) {
                      this.has_premisesnamenext = datapagination.has_next;
                      this.has_premisesnameprevious = datapagination.has_previous;
                      this.premisesnamecurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFn1(autoPrimary1?: PremisesName): string | undefined {
    return autoPrimary1 ? autoPrimary1.name : undefined;
  }

  get autoPrimary1() {
    return this.premiseDocInfoForm.get('premiseidentificationname');
  }

  private primaryContact1(primaykey) {
    this.remsservice.premisesName(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.iList = datas;
      })
  }
  autocompletePrimaryScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteDept &&
        this.autocompleteTrigger &&
        this.matAutocompleteDept.panel
      ) {
        fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.remsservice.approverscroll(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.primaryContactList = this.primaryContactList.concat(datas);
                    if (this.primaryContactList.length >= 0) {
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

  public displayFn(primary?: PrimaryContact): string | undefined {
    return primary ? primary.name : undefined;
  }

  get primary() {
    return this.premiseDocInfoForm.get('approved_by');
  }

  private primaryContact(primaykey) {
    this.remsservice.approvername(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }
  fileData: any;
  docInfoEdit(data: any) {
    // if(this.ismakercheckerButton===false){
    //   this.toastr.warning('', 'You dont have permissions to edit this file', { timeOut: 1500 });
    //   return false;


    // }
    this.isDocInfoForm = true;
    let datas: any = this.shareService.premiseDocuInfo.value
    console.log("edit", data)
    this.premiseIdentification = datas.premisesIdentification;
    this.idValue = data.id;
    if (data === '') {
      this.premiseDocInfoForm.patchValue({
        doctype: '',
        // initiation_date: '',
        approved_by: '',
        premiseidentificationname: '',
        remarks: '',

      })
    } else {
      this.premiseDocInfoForm.patchValue({
        remarks: data.remarks,
        // initiation_date: data.initiation_date,
        approved_by: data.approved_by,
        premiseidentificationname: data.premiseidentificationname,
        doctype: data.doctype?.id,
        fileData: data.file_data



      })
      // this.premiseDocInfoForm.reset();

    }
  }
  prelist: any
  // private getPremisename() {
  //   this.remsService.getPremisename(this.de)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.prelist = datas;
  //       console.log("product", datas)

  //     })
  //   }
  premiseDocInfoCreate() {
    // console.log("filedata", this.fileData)

    // let data: any = this.shareService.premiseDocuInfo.value
    // this.premiseIdentification = data.premisesIdentification;
    if (this.premiseDocInfoForm.value.doctype === "") {
      this.toastr.error('', 'Please Enter Document Type', { timeOut: 1500 });
      return false;
    }
    //  if (this.premiseDocInfoForm.value.initiation_date === "") {
    //   this.toastr.warning('', 'Select Date', { timeOut: 1500 });
    //   return false;
    // }
    if (this.premiseDocInfoForm.value.remarks === "") {
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.approved_by?.id == "" || this.premiseDocInfoForm.value.approved_by?.id == undefined|| this.premiseDocInfoForm.value.approved_by?.id == null) {
      this.toastr.error('', 'Please Select Approver', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.images === "" || this.premiseDocInfoForm.value.images === null || this.premiseDocInfoForm.value.images === undefined) {
      this.toastr.error('', 'Choose Upload Files ', { timeOut: 1500 });
      return false;
    }

    // const Date = this.premiseDocInfoForm.value;
    // Date.initiation_date = this.datePipe.transform(Date.initiation_date, 'yyyy-MM-dd');
    if (this.premiseDocInfoForm.value.premiseidentificationname.id) {
      this.premiseDocInfoForm.value.premiseidentificationname = this.premiseDocInfoForm.value.premiseidentificationname.id
    } else {
      this.premiseDocInfoForm.value.premiseidentificationname;
    }


    if (this.idValue == undefined) {
      this.remsService.premiseDocInfoForm(this.premiseDocInfoForm.value, '', this.images, this.id)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else if(result.code === "INVALID_FILETYPE") {
            this.notification.showError("Invalid FileType...")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            // this.router.navigate(['/premiseIDview'], { skipLocationChange: true });
            this.getPremiseDocInfoForm();
            // this.premiseDocInfoForm.reset();
            this.formGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
          // this.idValue = result.id;
        })
    } else {
      this.remsService.premiseDocInfoForm(this.premiseDocInfoForm.value, this.idValue, this.images, this.id)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.idValue = undefined

            // this.router.navigate(['/premiseIDview'], { skipLocationChange: true });
            this.getPremiseDocInfoForm();
            // this.premiseDocInfoForm.reset();
            this.formGroupDirective.resetForm();

            this.closebutton.nativeElement.click();
          }
        })
    }
  }
  onFileSelected(e) {
    this.images = e.target.files;
  }

  onFileSelecteds(e) {
    this.imagess = e.target.files;
  }
  onFileSelectedForApprover(e) {
    this.imagesforApprover = e.target.files;
  }

  onCancel() {
    this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
  }
  getDocumentType() {
    this.remsService.getDocumentType()
      .subscribe(result => {
        let data = result.data;
        this.documentTypeData = data;
      })
  }
  downloadUrlimage: any
  fileDownload(id, fileName) {

    this.remsservice.fileDownloadForComments(id)
      .subscribe((results) => {
        this.downloadUrlimage = results
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        console.log("imagurl", downloadUrl)
        let link = document.createElement('a');
        link.href = downloadUrl;
        // this.downloadUrlimage=downloadUrl;
        link.download = fileName;
        link.click();
      })
  }


  fileDownloads(id, fileName) {
    // this.fileDownload(id, fileName)
    this.remsservice.fileDownloadForApprovedPremise(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }
  a: any
  b: number
  de: any
  c: any
  ownershipType : any
  getPremiseIDView() {
    let id: any = this.shareService.premiseIdView.value;

    this.remsService.getPremiseIdView(id)
      .subscribe(result => {
        this.premiseIdViewData = result
        console.log("logn", this.premiseIdViewData)
        this.premiseIdentificationId = result.id;
        this.ownershipType = result?.ownership_type?.id
        console.log("this.premiseIdentificationId", this.premiseIdentificationId)
        this.a = this.premiseIdViewData.approver_flag
        console.log("appr", this.a)

        this.b = this.premiseIdViewData.status.id
        this.c = this.premiseIdViewData.id
        this.de = this.c
        this.getPremiseDocInfoForm();
        this.getPremisename();
        this.getTermDetails()
        let json: any = {
          data: [{
            title: "PremisesDocInfoView",
            code: "",
            name: this.premiseIdViewData.code + " (" + this.premiseIdViewData.name + " ) " + " / " + this.premisesName,
            routerUrl: "/premiseIDview",
            headerName: "REMS"
          }]
        }
        this.shareService.premiseBackNavigation.next(json)
      })
  }


  statusForPremiseName: number;
  premiseNameId: number;
  statusFlag = false;
  v: number
  note: any;
  // getPremisename
  getPremisenameView() {
    let id: any = this.shareService.premiseIdView.value;
    let ids: any = this.shareService.premisenameView.value;
    this.v = ids


    this.remsService.getPremisenamee(id, ids)
      .subscribe(result => {
        this.premisenameViewData = result
        this.premiseNameId = this.premisenameViewData.id
        this.statusForPremiseName = this.premisenameViewData.status.id
        this.statusFlag = this.premisenameViewData.status.approval_flag
        this.note = this.premisenameViewData.description
        this.proposedPremiseId = result.id;
        console.log("flag", this.statusFlag)
        console.log("detail", this.premisenameViewData)
        console.log("proposedPremiseId", this.proposedPremiseId)
        // this.getTermDetails()
        // let json: any = {
        //   data: [{
        //     title: "PremisesIdentificationView",
        //     name: result.name,
        //     code: result.code,
        //     routerUrl: "/rems",
        //     headerName: "REMS"
        //   }]
        // }
        // this.shareService.premiseBackNavigation.next(json)
      })

  }
  approvedGet() {
    this.remsService.approvedGet(this.v)
      .subscribe(result => {
        // console.log("approvedData",result )
        let data = result["data"];
        this.approvedData = data[0];
        console.log("aaaa", this.approvedData)


      })
  }


  fileDownloadsapproved(id, fileName) {
    this.remsservice.fileDownloadForApprovedPP(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }

  private getPremisename() {
    this.remsService.getPremisename(this.de)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.prelist = datas;
        // this.prelist.forEach(element => {
        //   this.premisesName = element.name
        // });


      })
  }

  premiseDocumentInfo() {
    let json: any = {
      premisesIdentification: this.premiseIdViewData.id,
      data: ""
    }
    this.shareService.premiseDocuInfo.next(json);
    this.router.navigate(['/rems/premiseDocInfo'], { skipLocationChange: isSkipLocationChange });
  }

  // docInfoEdit(data) {
  //   this.shareService.premiseDocuInfo.next(data);
  //   // this.router.navigate(['/premiseDocInfo'], { skipLocationChange: true });
  // }
  docInfoDelete(id) {
    this.remsService.docInfoDelete(id)
      .subscribe(result => {
        console.log("........", result)
        this.notification.showSuccess("Deleted....")
        this.getPremiseDocInfoForm()
        this.isDocInfoForm = true;
        this.isDocumentCountButton = true;
      })
  }
  adddocinfo(data) {
    if (data == '') {
      this.premiseDocInfoForm.patchValue({
        doctype: '',
        // initiation_date: '',
        approved_by: '',
        remarks: '',
        premiseidentificationname: this.premisenameViewData
      })
    }

    this.getPremiseDocInfoForm();
  }
  statussapproverid: any
  getPremiseDocInfoForm(pageNumber = 1) {
    this.remsService.getPremiseDocInfoForm(this.abc)
      .subscribe(results => {
        console.log(".....DOC<<<<>><<>...", results)
        this.premiseDocumentInfoData = results.data;
        // this.doccreatecheck=this.premiseDocumentInfoData.can_create
        // this.click = this.premiseDocumentInfoData.map(() => false);
        this.premiseDocumentInfoData.forEach((element) => {

          this.doccreatecheck = element.can_create
          console.log(".doccreatecheck.", this.doccreatecheck)
        })
        let datapagination = results.pagination;
        if (this.premiseDocumentInfoData.length == 0) {
          this.isDocInfo = false;
        } else if (this.premiseDocumentInfoData.length > 0) {
          this.next_docInfo = datapagination.has_next;
          this.previous_docInfo = datapagination.has_previous;
          this.presentPageDocInfo = datapagination.index;
          this.isDocumentCountButton = false;
          this.isDocInfo = true;
          // this.isDocInfoForm=false;
        }
      })
  }

  nextDocInfo() {
    if (this.next_docInfo === true) {
      this.getPremiseDocInfoForm(this.presentPageDocInfo + 1)
    }
  }

  previousDocInfo() {
    if (this.previous_docInfo === true) {
      this.getPremiseDocInfoForm(this.presentPageDocInfo - 1)
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }

  movetoapp() {

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 1 }
    console.log("identificationid", identificationid)
    console.log("json", json)
    console.log("json", json)
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Moved for Approval!...")
        }
        return true
      })
  }


  accept() {

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 1 }
    console.log("identificationid", identificationid)
    console.log("json", json)
    console.log("json", json)
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Approved Successfully!...")
        }
        return true
      })

  }

  reject() {

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 0 }
    console.log("identificationid", identificationid)
    console.log("json", json)
    console.log("json", json)
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showError("Rejected!...")
        }
        return true
      })

  }
  toggle(list) {
    this.docid = list.id
    this.statussapproverid = list.status.id
    console.log("approveerid", this.statussapproverid)

    this.commentForm.reset()
    this.formGroupDirective.resetForm();
    this.defaultValue = '';
    return (list.show = !list.show);
  }
  canceltext(list) {
    // this.textbox=false;
    return (list.show = !list.show);
  }


  approverSubmitForPremiseName(status = 2) {
    if (this.approverForm.value.approved_rent === "" && (this.ownershipType != 1 && this.ownershipType != 4)) {
      this.toastr.warning('', 'Please Enter Approved Rent', { timeOut: 1500 });
      return false;
    }
    else if(this.ownershipType == 1 || this.ownershipType == 4)
    {
      this.approverForm.value.approved_rent =0
    }
    if (this.approverForm.value.content === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    this.remsService.approverForPremiseName(this.approverForm.value, this.premiseNameId, this.imagesforApprover, status)
      .subscribe(result => {
        console.log("approve", result)
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Already premise Approved ...")
        } else if( result.code === "INVALID_FILETYPE"){
          this.notification.showError("Invalid FileType...")
        }
        else {
          this.notification.showSuccess("Approved Successfully!...")
          this.imagess = null
          this.getPremisenameView();
          this.approvedGet();

        }


        // this.remsService.approvedGet(this.premiseNameId)
        // .subscribe(result => {
        //   console.log("approvedData",result )
        //   let data = result["data"];
        //   this.approvedData = data;
        //   console.log("aaaa",this.approvedData )


        // })

      })
  }

  approverSubmitForReject(status = 0) {
    this.remsService.approverSubmitForReject(this.approverFormForReject.value, this.premiseNameId, status)
      .subscribe(result => {
        console.log("reject", result)
        // this.notification.showSuccess("Submitted Successfully!...")
        this.notification.showError("Rejected!...")
        this.getPremisenameView()

      })
  }





  submitcomment(docInfo) {
    if (this.commentForm.value.content === "") {
      this.toastr.warning('', 'Please Enter Some Content', { timeOut: 1500 });
      return false;
    }
    if (this.commentForm.value.doctype === ""|| this.commentForm.value.doctype === null ) {
      this.toastr.warning('', 'Please Select Any One Document Type ', { timeOut: 1500 });
      return false;
    }
    const docid = this.commentForm.value;
    docid.identificationdocinfo_id = docInfo.id
    docid.approval_flag = false
    // docid.status=1

    this.remsService.createCommentform(docid, '', this.imagess, this.abc)
      .subscribe(result => {
        this.notification.showSuccess("Submitted Successfully!...")
        this.imagess = null

        this.getcomments()
        this.getPremiseDocInfoForm()




      })
  }

  submitcommentapproved(docInfo) {
    if (this.commentForm.value.content === "") {
      this.toastr.warning('', 'Please Enter Some Content', { timeOut: 1500 });
      return false;
    }
    const docid = this.commentForm.value;
    docid.identificationdocinfo_id = docInfo.id
    docid.approval_flag = true
    docid.status = 2
    this.remsService.createCommentform(docid, '', this.imagess, this.abc)
      .subscribe(result => {
        this.notification.showSuccess("Approved Successfully!...")
        this.imagess = null

        this.getcomments()
        this.getPremiseDocInfoForm()
        this.getPremisenameView();





      })
  }


  submitcommentreject(docInfo) {
    if (this.commentForm.value.content === "") {
      this.toastr.warning('', 'Please Enter Some Content', { timeOut: 1500 });
      return false;
    }
    const docid = this.commentForm.value;
    docid.identificationdocinfo_id = docInfo.id
    docid.approval_flag = true
    docid.status = 0
    this.remsService.createCommentform(docid, '', this.imagess, this.abc)
      .subscribe(result => {
        this.notification.showSuccess("Rejected!...")
        this.imagess = null

        this.getcomments()
        this.getPremiseDocInfoForm()
        this.getPremisenameView();




      })
  }
  commentssummarylist: any
  getcomments() {
    this.remsService.getcomments(this.abc)
      .subscribe(result => {
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.commentssummarylist = datass;
        // console.log("ddddddd",datas)
      })
  }

  getContent(id: number) {
    // console.log("commentsaasummarylist",this.commentssummarylist.filter(ob => ob.identificationdocinfo_id === id))
    return this.commentssummarylist.filter(ob => ob.identificationdocinfo_id === id)
  }


  commentDocuments: any

  showPopupImages: boolean = true
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }

    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/files/" + id + "?identification_name=true&token=" + token, "_blank");
     }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      // this.fileDownload(pdf_id,file_name)
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/files/" + id + "?identification_name=true&token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {

      this.fileDownload(pdf_id, file_name)
      this.showPopupImages = false
    }

  };
  estatecellAttachment(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/files/" + id + "?identification_name=true&token=" + token, "_blank");
     }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/files/" + id + "?identification_name=true&token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownloadsapproved(pdf_id, file_name)
      this.showPopupImages = false
    }
  };

  documentSummary(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/files/Rems_" + id + "?premiseidentificationfile=true&token=" + token, "_blank");
     }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/files/Rems_" + id + "?premiseidentificationfile=true&token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownloads(pdf_id, file_name)
      this.showPopupImages = false
    }
  };

  approveButton() {
    this.isApprove = true;
    this.isReject = false;

  }

  rejectButton() {
    this.isApprove = false;
    this.isReject = true;

  }

  documentTypeApp() {
    this.remsService.getDocumentType()
      .subscribe(result => {
        let data = result.data;
        this.documentTypeapp = data;
      })
  }
  documentTypeComments() {
    this.remsService.getDocumentType()
      .subscribe(result => {
        let data = result.data;
        this.documentTypecomments = data;
      })
  }




  termDetails() {
    let formValue = this.termDetailsForm.value;
    if (formValue.term === "" || formValue.term === null || formValue.term === undefined) {
      this.toastr.warning('', 'Please Enter Term', { timeOut: 1500 });
      return false;
    } if (formValue.no_of_month === "" || formValue.no_of_month === null || formValue.no_of_month === undefined) {
      this.toastr.warning('', 'Please Enter No of Month', { timeOut: 1500 });
      return false;
    } if (formValue.base_rent === "" || formValue.base_rent === null || formValue.base_rent === undefined) {
      this.toastr.warning('', 'Please Enter Base Rent Amount', { timeOut: 1500 });
      return false;
    }
    let json = {
      premise_identification: this.premiseIdentificationId,
      proposed_premise: this.proposedPremiseId
    }
    let finaleJson = Object.assign({}, formValue, json)
    console.log("finaleJson", finaleJson)

    if (this.termDetailsId === undefined) {
      this.remsService.termDetails(finaleJson, '')
        .subscribe(result => {
          if (result.id != '') {
            this.notification.showSuccess("Successfully Created ...")
            this.getTermDetails()
            this.closePop.nativeElement.click();
          }
        })
    } else {
      this.remsService.termDetails(finaleJson, this.termDetailsId)
        .subscribe(result => {
          if (result.id != '') {
            this.notification.showSuccess("Successfully Updated ...")
            this.termDetailsId = undefined;
            this.getTermDetails()
            this.closePop.nativeElement.click();
          }
        })
    }


  }

  getTermDetails() {
    this.remsService.getTermDetails(this.premiseIdentificationId)
      .subscribe(result => {
        let data = result.data;
        this.termDetailsList = data;
        console.log("getTermDetails", data)
      })
  }

  getEditTermDetails(id) {
    this.remsService.getEditTermDetails(id)
      .subscribe(result => {
        this.termDetailsId = result.id
        this.termDetailsForm.patchValue({
          base_rent: result.base_rent,
          no_of_month: result.no_of_month,
          term: result.term
        })
        this.isTermDetails = true
      })
  }
  termDetailsDelete(id) {
    this.remsService.termDetailsDelete(id)
      .subscribe(result => {
        this.notification.showSuccess("Successfully Deleted ...")
        this.getTermDetails()
      })
  }



  addTermDetails() {
    this.termDetailsForm.patchValue({
      base_rent: '',
      no_of_month: '',
      term: ''
    })
    this.isTermDetails = true
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}





export interface PrimaryContact {
  id: number;
  name: string;
}

export interface PremisesName {
  id: number;
  name: string;
}
