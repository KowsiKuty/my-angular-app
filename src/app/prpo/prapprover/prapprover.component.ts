import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'


export interface Emplistss {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-prapprover',
  templateUrl: './prapprover.component.html',
  styleUrls: ['./prapprover.component.scss']
})
export class PrapproverComponent implements OnInit {
  PRApprovalForm: FormGroup;
  prapproveId: number;
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  prno: string;
  raisedby: string;
  commodity: string;
  capatilization: number;
  date: Date;
  prapproverlist: any
  approvalForm: FormGroup;
  rejectForm: FormGroup;
  returnForm: FormGroup;
  prdts: number;
  employeeList: Array<Emplistss>;
  tokenValues: any
  jpgUrls: string;
  imageUrl = environment.apiURL
  prappdelid:any;
  isDisabled: boolean;

  isLoading = false
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() prapproverlistEmit = new EventEmitter<any>();
  

  //bug id:7420,7421
   prbulkupload:any
  // isccbsbulk: any;
  // ccbsfile: any;
  @Input('fileid') prdetailsfileid:any  //7421
  ccbsbfileid: any;
  ccbsbulk: any;
  // p: number = 1;
  itemsPerPage = 10;
  deliverydetailsList: any;
  id: any;
  prid: any;
  ccbs_bfile_id: any;
  // ccbsfilekey: any;
 //bug id:7420,7421
 has_next = true;
 has_previous = true;
 currentpage: number = 1;
 presentpage: number = 1;
 pageSize = 10;
  mepdata: any;
  remainamt: any;
  ismeppno: boolean;
  commodityvalue: any;
  totalcount: any;
  prappt: boolean=true;
  prappd: boolean=true;
  totalcountt: any;
  isApproved: boolean = true;
  Service: boolean = false;

 mepno: any;
  showEditor: boolean = false;

//   remainamt: any;
pr_flag: any;
  constructor(private prsharedservice: PRPOshareService,
    private prservice: PRPOSERVICEService, private formbuilder: FormBuilder,
    private notification: NotificationService, private toastr: ToastrService, private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    console.log('this.prdetailsfileid==>',this.prdetailsfileid)

    this.PRApprovalForm = this.formbuilder.group({
      full_name: [''],
      name: [''],
      mepno:[''],
      no: [''],
      date: [''],
      raisedby: [''],
      notepad: [''],
      justification: [''],
      dts: [null],
      totalamount:"",
      commodity_id:"",
      commodity:""
    })
    this.approvalForm = this.formbuilder.group({
      id: '',
      remarks: [''],
      dts: '',
      employee_id: 0,
      totalamount:"",
      commodity_id:""
    })
    this.rejectForm = this.formbuilder.group({
      id: '',
      remarks: ['', Validators.required],
      dts: '',
      totalamount:"",
      commodity_id:"",
      status:"REJECTED"
    })
    this.returnForm = this.formbuilder.group({
      id: '',
      remarks: ['', Validators.required],
      dts: '',
      totalamount:"",
      commodity_id:"",
      status:"RETURNED"
     })
//BUG ID:7420,7421
// let data2 = this.prsharedservice.pr.value
// this.isccbsbulk= data2.isccbsbulkupload
// this.ccbsfile= data2.fileid
// console.log('this.ccbsbulk==>',this.isccbsbulk)
// this.prbulkupload = this.prsharedservice.prapproverblk.value
// console.log('this.ccbsbulk==>',this.prbulkupload)
// this.prbulkupload = this.prsharedservice.prapproverblk.value
//7420,7421




    let data: any = this.prsharedservice.Prapprover.value;
    console.log('data for 7420==>',data)
    this.prbulkupload=data.prdetails_bfile_id
    // this.prdetailsid= data["prdetails"].id


    this.prapproveId = data.id
    this.prdts = data
    this.commodity = data.commodity_id.name   
    this.mepno = data.mepno
    this.capatilization = data.capitialized
    this.raisedby = data.created_by.full_name
    this.prno = data.no
    this.date = data.date
    console.log("Priddd..............", this.prapproveId)
    console.log("Prdtsss..............", this.prdts)
    this.approveform(1);
    this.getapproveredit();

    let data1: any = this.prsharedservice.Prapprover.value
    console.log("data1", data1)
    let id = data1.id
    this.pr_flag = data1.flag;
    this.Service = this.pr_flag == "Service"
    
    let prheader_status = data1.prheader_status;
    if(prheader_status == 'REJECTED' || prheader_status == 'APPROVED' || prheader_status == 'RETURNED' || prheader_status == 'DRAFT' || prheader_status == "PO NOT RAISED" || prheader_status == "RETIRED"){
      this.approvalForm.disable();
      this.returnForm.disable();
      this.rejectForm.disable();
      this.isApproved = false;
    }

    this.approvalForm.patchValue({
      id: id,
      dts: this.PRApprovalForm.value.dts,
      totalamount:this.PRApprovalForm.value.totalamount,
      commodity_id:this.PRApprovalForm.value.commodity_id,
      // dts:data.dts
    })
    this.returnForm.patchValue({
      id: id,
      dts: this.PRApprovalForm.value.dts,
      totalamount:this.PRApprovalForm.value.totalamount,
      commodity_id:this.PRApprovalForm.value.commodity_id,
      // dts:data.dts
    })
    this.rejectForm.patchValue({
      id: id,
      dts: this.PRApprovalForm.value.dts,
      totalamount:this.PRApprovalForm.value.totalamount,
      commodity_id:this.PRApprovalForm.value.commodity_id
      // dts:data.dts
    })
    console.log("pr header check", this.PRApprovalForm.value)

    this.approvalForm.get('employee_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.prservice.getemployeeApproverforPRDD(this.PRApprovalForm.value.commodity_id, value, 1)
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
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

    let pca = this.prsharedservice.pcadata.value;
    this.mepdata = pca.mepno
    this.commodityvalue = pca.commodity_id.id
 

    // if (Array.isArray(this.mepdata) && this.mepdata.length > 0) {
    //   this.ismeppno = true;
    // }
    // else{
    //   this.ismeppno = false; 
    // }


    if (this. mepdata === "") {
      this.ismeppno = false; // If mepdata is not an empty string, set ismeppno to true
    } else {
      this.ismeppno = true; // If mepdata is an empty string, set ismeppno to false
    }

    // this.prapproverlist.forEach((e,i) => {
    //   if(e.pr_request == 2){
    //     this.showWarn = true;
    //   }
    // });
    // for(let a of this.prapproverlist){
    //   if(this.prapproverlist[a].pr_request == 2){
    //     this.showWarn = true;
    //   }
    // }
    
  }
  getEmitter(){
  this.prapproverlistEmit.emit(this.prapproverlist);
  }
  showWarn: boolean = false;
  checkboxvalue: any
  kboxvalue: any
  IsChecked: boolean = true;
  CommodityID: any;
  getapproveredit() {
    let data: any = this.prsharedservice.Prapprover.value;
    console.log("Prapprover..............", data)
    // this.checkboxvalue===data.dts
    // if(this.checkboxvalue===1){
    //   this.IsChecked===true
    // }
    // if(this.checkboxvalue===0){
    //   this.IsChecked===false


    // }


    this.CommodityID = data.commodity_id.id
    let Name = data.commodity_id.name;
    // let MepNo = data.mepno + ' - ' + data.mepname;
    let MepNo;
    if (data.mepno && data.mepname) {
    MepNo = data.mepno + ' - ' + data.mepname;
    } else if (data.mepno || data.mepname) {
    MepNo = data.mepno || data.mepname;
    }
    let RAISED = data.created_by.full_name;
    let APPROVER = data.employee?.full_name;
    let CAPI = data.capitialized;
    let NO = data.no;
    let Notepad = data.notepad
    let justification = data.justification;
    let HSN = data.hsn_id;
    let Date = data.date;
    let dts = data.dts;
    let totalamount = data.totalamount;
    let commodity_id = data.commodity_id.id;
    console.log("dataaaa", data)
    this.PRApprovalForm.patchValue({
      name: Name,
      mepno: MepNo,
      full_name: APPROVER,
      no: NO,
      date: Date,
      raisedby: RAISED,
      notepad: Notepad,
      justification: justification,
      capitialized: CAPI,
      dts: dts,
      totalamount:totalamount,
      commodity_id:commodity_id
    })

  }
  totalamount: any
  dtsvalueget: any
  approveform(pagenumber=1) {
    let id = this.prapproveId
    this.SpinnerService.show();
    // this.prservice.getpredit(id,pagenumber)//7421
    this.prservice.getprdetails(id,pagenumber)

      // .subscribe(result => {
      //   console.log("RESULSSS", result)
        // this.prapproverlist = result["data"];
      .subscribe((results) => {
        let datas = results['data'];
        console.log("RESULSSS", datas)
        this.SpinnerService.hide();
        this.prapproverlist = datas;
        this.PRApprovalForm.patchValue({
          justification: datas[0]?.prheader?.justification || "No Justification Provided!"
        })
        // this.yesorno = datas.prdetails.capitialized; 
        this.yesorno = datas.capitialized;  //7421

      //   datas.forEach(element => {
      //     if(element?.prheader_id?.prheader_status == "APPROVED" || "REJECTED" || "DRAFT" || "RETIRED" || "PO NOT RAISED" || "RETURNED"){
      //       this.isApproved = false;
      //   } else {
      //     this.isApproved = true; 
      //   }
      // });
                // console.log("cap", this.yesorno)
        this.dtsvalueget = datas.dts
        this.totalamount = datas.totalamount
        this.prid=datas.id;
        // console.log("dts", this.dtsvalueget)
        // console.log("appro", datas.totalamount)
        // console.log("appro", datas.prdetails)
        // console.log('datas 7420 ccbsfile===>',datas)
        let datapagination = results["pagination"];
        this.totalcountt = results.total_count
                    if (this.prapproverlist.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                      this.prappt = true

                    }
                    if(this.prapproverlist.length == 0){
                      this.prappt = false
                    }
                    this.getEmitter()

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClick() {
    if (this.has_next === true) {
      this.approveform(this.presentpage + 1)
    }
  }
  previousClick() {
    if (this.has_previous === true) {
      this.approveform(this.presentpage - 1)
    }
  }
  


  approveClick(id) {
    if(id == 1){
      if(this.approvalForm.value.employee_id == ""){ 
        this.toastr.error('Please Select Approver!');
        return false;
      }

      // if(this.approvalForm.value.remarks == ""){
      //   this.toastr.error("Remarks is required");
      //   return false;
      // }
    }

    
    // if(id==2){
    //   if(this.approvalForm.value.remarks == ""){
    //     this.toastr.error('Remarks is required!');
    //     return false;
    //   }
    // }
    
    if (this.approvalForm.value.employee_id == 0) { this.approvalForm.value.employee_id = 0 } else {
      this.approvalForm.value.employee_id = this.approvalForm.value?.employee_id?.id
    }
    let data = this.approvalForm.value
    console.log('approval data check', data)

    if (this.approvalForm.value.employee_id != 0) {
      let dataConfirm = confirm("Are you sure, Do you want to Forward?")
      if (dataConfirm == false) {
        return false
      }
    }
    if (this.approvalForm.value.employee_id == 0) {
      let dataConfirm = confirm("Are you sure, Do you want to continue to Approve?")
      if (dataConfirm == false) {
        return false
      }
    }

    // if(dataConfirm == true){
      this.SpinnerService.show();
    this.prservice.getprapproval(data)
      .subscribe(result => {
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "INVALID_APPROVER_ID" && result.description === "No_Rights_To_Approve") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "INVALID_REQUEST_ID" && result.description === "Invalid Request ID") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "NOLIMIT_APPROVER_ID" && result.description === "NO_LIMIT") {
          this.SpinnerService.hide();
          this.notification.showError("This User has no limit to Approve, Please choose next level Approver")
          return false
        }
        if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description);
          return false;
        }
        if (this.approvalForm.value.employee_id != 0) {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Forwarded to next level!...")
          console.log("Approved", result)
          this.approvalForm.controls['remarks'].reset()
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Approved!...")
          console.log("Approved", result)
          this.approvalForm.controls['remarks'].reset()
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }

  }


//  MEPUtilizationAmountList: any
//   isdetails: any
//   getmepdtl() {
//     let dataMep = this.PRApprovalForm.value.mepno
//     let dataCom = this.PRApprovalForm.value.commodity.id
//     if (dataMep == "") {
//       this.isdetails = false
//       return false
//     }
//     this.isdetails = true
//     let IDMep: any
//     if (typeof (dataMep) == 'string') {
//       IDMep = dataMep
//     } else {
//       IDMep = dataMep.no
//     }

//     this.SpinnerService.show();
//     this.prservice.getmepdtl(IDMep, dataCom)
//       .subscribe(result => {
//         this.SpinnerService.hide();
//         let datas = result["data"]
//         this.MEPUtilizationAmountList = datas
//         this.remainamt = datas[0]?.unutilized_amount
//       },(error) => {
//         this.errorHandler.handleError(error);
//         this.SpinnerService.hide();
//       })
//   }


  returnClick(){
    if(this.returnForm.value.remarks== ""){
      this.toastr.error('Remarks is required!');
      return false;
    }
    let data = this.returnForm.value;
    this.SpinnerService.show();
    this.prservice.getprreturn(data)
      .subscribe(res => {
        this.SpinnerService.hide();
        if(res.code){
          this.SpinnerService.hide();
          this.notification.showError(res['description']);
          return false;
        } else {
          this.notification.showInfo("Successfully Returned!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        console.table("Returned", res)
        this.returnForm.controls['remarks'].reset()
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  rejectClick() {

    if (this.rejectForm.value.remarks== "") {
      this.toastr.error('Remarks is required!');
      return false;
    }
    let data = this.rejectForm.value;
    // let dataConfirm = confirm("Are you sure, Do you want to continue?")

    // if(dataConfirm == true){
      this.SpinnerService.show();
    this.prservice.getprreject(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code !== "INVALID_APPROVER_ID" && result.description !== "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError(result?.description)
          return false
        }
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("Maker Not Allowed To Reject")
          return false
        } else {
          this.notification.showError("Successfully Rejected!...")
          this.SpinnerService.hide();
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        console.table("REJECTED", result)
        this.rejectForm.controls['remarks'].reset()
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }
    // if(dataConfirm == false){
    //   return false
    // }


  }
  fileDownload(id, fileName) {
    if (id == null) {
      this.notification.showWarning("No Files Found")
      return false
    }
    this.SpinnerService.show();
    this.prservice.fileDownloadpo(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
        ["delete", ["deleteRow", "deleteCol", "deleteTable"]],
        ["style", ["tableHeader", "tableBorderStyle", "tableBorderColor"]],
      ],
      link: [["link", ["linkDialogShow", "unlink"]]],
      air: [
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
      ],
    },
    height: "200px",
    toolbar: [
      ["misc", ["codeview", "undo", "redo", "codeBlock"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style0", "ul", "ol", "paragraph", "height"]],
      ["insert", ["picture", "link", "video", "hr", "customTable"]],
      [
        "table",
        ["addRow", "addColumn", "deleteRow", "deleteColumn", "deleteTable"],
      ],
    ],
    buttons: {
      customTable: function (context) {
        const ui = ($ as any).summernote.ui;
        return ui
          .button({
            contents: '<i class="note-icon-table"/>Table',
            tooltip: "Insert a 3x3 Table",
            click: function () {
              context.invoke("editor.focus"); // Ensure the editor is focused

              const editor = context.layoutInfo.editable[0];
              if (!editor) {
                console.error("Editor context is undefined");
                return;
              }

              const table = document.createElement("table");
              table.style.borderCollapse = "collapse";
              table.style.width = "100%";

              for (let i = 0; i < 3; i++) {
                const row = table.insertRow();
                for (let j = 0; j < 3; j++) {
                  const cell = row.insertCell();
                  cell.style.border = "1px solid black";
                  cell.style.padding = "5px 3px";
                  cell.style.height = "30px";
                  cell.style.width = "270px";
                  cell.style.boxSizing = "border-box";
                  cell.innerText = " ";
                }
              }

              const range = window.getSelection()?.getRangeAt(0);
              if (!range) {
                console.error(
                  "Range is undefined. Ensure the editor is focused."
                );
                return;
              }

              range.deleteContents();
              range.insertNode(table);
              range.collapse(false);
            },
          })
          .render();
      },
    },
    callbacks: {
      onInit: function() {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector('.note-editable');
        if (editor) {
          editor.addEventListener('input', function() {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName('table'));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = 'collapse';
              htmlTable.style.width = '100%';
              htmlTable.style.textAlign = 'left';
  
              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll('th, td');
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = '1px solid black';
                htmlCell.style.padding = '5px 3px';
                htmlCell.style.boxSizing = 'border-box';
              });
            });
          });
        }
      },
    },
  };

  editorDisabled = true;




  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }



  onBlur() {

  }

  onDelete(file) {

  }

  summernoteInit(event) {

  }
  getemployeeForApprover() {
    let commodityID = this.CommodityID
    console.log("commodityID", commodityID)
    this.SpinnerService.show();
    this.prservice.getemployeeApproverforPR(commodityID)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.employeeList = datas;
        console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }
  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    if (pdf_id == null) {
      this.notification.showWarning("No Files Found")
      return false
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    this.showimagepopup = true
    this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
    // console.log("img", this.jpgUrls)
  };



  prccbsDetailsList: any
  delivaryDetailsPatch(data,index) {
    console.log("Delivary details patching data", data)
    // this.prccbsDetailsList = data
    // this.prappdelid=this.prccbsDetailsList[index].prdetails   //7420
    this.ccbs_bfile_id =data.ccbs_bfile_id
    this.prappdelid=data.id
  }
  ////////////////////7421
  hasnext = true;
  hasprevious = true;
  currentpg: number = 1;
  presentpg: number = 1;
  pgSize = 10;
  delivaryDetailsPatchbulk(pageNumber){
    let id = this.prapproveId
    this.SpinnerService.show();
    this.prservice.getdeliverydetailspatch(this.prappdelid,pageNumber)
           .subscribe((results) => {
        let datas = results;
        this.SpinnerService.hide();
        this.deliverydetailsList = results['data']
        let datapagination = results["pagination"];
        this.totalcount = results.total_count;
                    if (this.deliverydetailsList.length > 0) {
                      this.hasnext = datapagination.has_next;
                      this.hasprevious = datapagination.has_previous;
                      this.presentpg = datapagination.index;
                      this.prappd = true
                    }
          },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
      
  }
  salesweightnextClick() {
    if (this.hasnext === true) {
      this.delivaryDetailsPatchbulk(this.presentpg + 1)
    }
  }
  salesweightpreviousClick() {
    if (this.hasprevious === true) {
      this.delivaryDetailsPatchbulk(this.presentpg - 1)
    }
  }
    /////////////////////////
  // has_next = true;
  // has_previous = true;
  // currentpage: number = 1;
  // presentpage: number = 1;
  // pageSize = 10;
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.prservice.getemployeeLimitSearchPODD(this.PRApprovalForm.value.commodity_id, this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
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



  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit()
   }
   
//BUG ID:7421 BULK UPLOAD EXCEL DOWNLOAD
   prbulkuploadapprover(){
    this.SpinnerService.show();
    let fileprapp=this.prbulkupload
    this.prservice.prapproverblkexcel(this.prapproveId)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Non Catalogue PR Excel.xlsx"
        link.click();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
   }
//7421

//7420 BULK UPLOAD CCBS Delivery Details download approver screen
deliverydetailsexcel(){
  this.SpinnerService.show();
  this.prservice.prapproverdeliveryccbsexcel(this.prappdelid)
    .subscribe((results) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Delivery Details Excel.xlsx"
      link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

MEPUtilizationAmountList: any
getmepdtl(){
  this.SpinnerService.show();
  this.prservice.getmepdtl(  this.mepdata ,this.commodityvalue)
   .subscribe(result => {
    this.SpinnerService.hide();
    let datas = result["data"]
    this.MEPUtilizationAmountList = datas
    this.remainamt = datas[0]?.unutilized_amount
   },(error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
assetArray: any = []
assetDetails(id){
  this.SpinnerService.show();
  this.prservice.getAssetDetails(id).subscribe((res) => {
    this.assetArray = res['asset'];
    this.SpinnerService.hide();
    // if(res['asset'].length == 0){
    //   this.notification.showInfo("No Data Found!");
    // }

  })
}
assetArrayDetails:any
assetDetailss(arr){
   this.SpinnerService.show();
    this.prservice.getAssetDetailsreplace(arr).subscribe((res) => {
      this.SpinnerService.hide();
      this.assetArrayDetails = res["asset"];
      if (res['asset'].length == 0) {
        this.notification.showInfo("No Data Found!");
      }
    });
}
getSpecificationKeys(specification: any): string[] {
  return specification ? Object.keys(specification) : [];
}
}



