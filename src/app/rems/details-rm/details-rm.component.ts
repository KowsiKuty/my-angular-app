import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { SharedService } from '../../service/shared.service';


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
    selector: 'app-details-rm',
    templateUrl: './details-rm.component.html',
    styleUrls: ['./details-rm.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
        DatePipe
    ]
})
export class DetailsRMComponent implements OnInit {

    @Output() onCancel = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    DonebyidList: any;
    repairmaintenanceList: Array<any>
    presentrepairmaintenancepage: number = 1;
    currentrepairmaintenancepage: number = 1;
    pageSizerepairmaintenance = 10;
    is_repairmaintenancepage: boolean;
    has_previousrepairmaintenance = false;
    has_nextrepairmaintenance = false;
    repairmaintenanceForm: FormGroup;
    idValue: any;
    repairId: any;
    isECFno= false;
    repdetmodify = false;
    repdetailsModiData = []
    requeststatus: string
    main_status: string
    isAllocation=false;
    premiseviewid: string;
    RMDetailsBtn = false;
    isEditBtn: boolean;
    isCancelBtn=false;
    ECNo: any;
    allocation: any;
    @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective

    constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router,
        private remsshareService: RemsShareService, private route: ActivatedRoute,
        private remsService: RemsService, private toastr: ToastrService, private shareService: SharedService,

        private notification: NotificationService, private remsService2: Rems2Service) { }

    ngOnInit(): void {
        this.repairmaintenanceForm = this.fb.group({
            description: ['', Validators.required],
            sanction_number: [''],
            done_by: ['', Validators.required],
            amount: ['', Validators.required],
            amount_allocation: ['', Validators.required],
            date: ['', Validators.required],
            next_date: [''],
            remarks: ['', Validators.required],
            ecf_no: ['', Validators.required]
        })

        let data: any = this.remsshareService.repairEditValue.value;
        this.repairId = data
        this.repairmaintenancesummary();
        this.getDoneBydetails();
        let premisesData = this.remsshareService.premiseViewID.value;
        let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == 'REMS');
        datas.forEach((data) => {
            let roleValues = data.role[0].name;
            if (roleValues === "Maker" && premisesData.premise_status == "DRAFT") {
                this.isEditBtn = true;
                this.isCancelBtn = false;
            } if (roleValues === "Maker" && premisesData.premise_status == "PENDING_CHECKER") {
                this.isEditBtn = false;
            }  if ( premisesData.premise_status != "DRAFT") {
                this.isCancelBtn = true;
            }
        });
    }


    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    private getDoneBydetails() {
        this.remsService2.getDoneBydetails()
            .subscribe((results: any[]) => {
                let databb = results["data"];
                this.DonebyidList = databb;
                console.log("donebydetails", databb)
            })
    }

    getrepairmaintenance() {

        let data: any = this.remsshareService.repairmaintenanceForm.value;
        console.log(">>hai", data)
        this.idValue = data.id;
        if (data === '') {
            this.repairmaintenanceForm.patchValue({
                description: '',
                sanction_number: '',
                done_by: '',
                amount: '',
                amount_allocation: '',
                date: '',
                next_date: '',
                remarks: '',
                ecf_no: '',
            })
        } else {

            // if (data.done_by.id == 1) {
            //     this.isECFno = true;
            //     this.isECFno = data.ecf_no;
            // }
            // else if (data.done_by.id == 3) {
            //     this.isECFno = true;
            //     this.isAllocation = true;
            //     this.isECFno = data.ecf_no;
            //     this.isAllocation = data.amount_allocation;
            // }
            // else {
            //     this.isECFno = false;
            //     this.isAllocation = false;
            // }
            this.remsService.getRMDetailsEdit(this.repairId,data.id)
        .subscribe((result) => {
            console.log("rm details",result)
            if (result.done_by.id == 1) {
                this.isECFno = true;
                this.isAllocation = false;
                this.ECNo = result.ecf_no;
              }
              if (result.done_by.id == 3) {
                this.isECFno = true;
                this.isAllocation = true;
                this.ECNo = result.ecf_no;
                this.allocation = result.allocation;
              }

            this.repairmaintenanceForm.patchValue({
                description: result.description,
                sanction_number: result.sanction_number,
                done_by: result.done_by.id,
                amount: result.amount,
                amount_allocation: this.allocation,
                date: result.date,
                next_date: result.next_date,
                remarks: result.remarks,
                ecf_no: this.ECNo 
            })
        })
        }
    }
    //   RMempty(data:any){
    //     if (data === '') {
    //         this.repairmaintenanceForm.patchValue({
    //             description:  '',
    //             sanction_number:  '',
    //             done_by:  '',
    //             amount:'',
    //             amount_allocation:'',
    //             date: '',
    //             next_date: '',
    //             remarks: '',
    //             ecf_no: '',
    //         })
    //     }
    // }
    repairmaintenanceCreateEditForm() {
        this.RMDetailsBtn = true;
        if (this.repairmaintenanceForm.value.description === "" || this.repairmaintenanceForm.value.description === null) {
            this.toastr.warning('', 'Please Enter  description', { timeOut: 1500 });
            this.RMDetailsBtn = false;
            return false;
        }
        // if (this.repairmaintenanceForm.value.sanction_number === "" || this.repairmaintenanceForm.value.sanction_number === null) {
        //     this.toastr.warning('', 'Please Enter  Sanction Number', { timeOut: 1500 });
        //     this.RMDetailsBtn = false;
        //     return false;
        // }
        if (this.repairmaintenanceForm.value.done_by === "" || this.repairmaintenanceForm.value.done_by === null) {
            this.toastr.warning('', 'Please Enter   Done By ', { timeOut: 1500 });
            this.RMDetailsBtn = false;
            return false;
        }
        if (this.repairmaintenanceForm.value.amount === "" || this.repairmaintenanceForm.value.amount === null) {
            this.toastr.warning('', 'Please Enter  Amount', { timeOut: 1500 });
            this.RMDetailsBtn = false;
            return false;
        }
        if (this.repairmaintenanceForm.value.date === "" || this.repairmaintenanceForm.value.date === null) {
            this.toastr.warning('', 'Please Enter  Date', { timeOut: 1500 });
            this.RMDetailsBtn = false;
            return false;
        }
        // if (this.repairmaintenanceForm.value.next_date === "" || this.repairmaintenanceForm.value.next_date === null) {
        //     this.toastr.warning('', 'Please Enter  Next Date ', { timeOut: 1500 });
        //     this.RMDetailsBtn = false;
        //     return false;
        // }
        if (this.repairmaintenanceForm.value.remarks === "" || this.repairmaintenanceForm.value.remarks === null) {
            this.toastr.warning('', 'Please Enter  Remarks', { timeOut: 1500 });
            this.RMDetailsBtn = false;
            return false;
        }
        // if (this.repairmaintenanceForm.value.done_by == 2) {
        //     this.repairmaintenanceForm.value.ecf_no = null;
        //     this.repairmaintenanceForm.value.amount_allocation = null;
           
        // }
        // if (this.repairmaintenanceForm.value.done_by == 1) {
        
        //     this.repairmaintenanceForm.value.amount_allocation = null;
           
        // }
        if (this.repairmaintenanceForm.value.done_by == 2) {
            this.repairmaintenanceForm.value.ecf_no = null;
        }if (this.repairmaintenanceForm.value.done_by == 1 || this.repairmaintenanceForm.value.done_by == 2) {
            this.repairmaintenanceForm.value.amount_allocation = null;
          }
        // if (this.repairmaintenanceForm.value.ecf_no === "") {
        //     this.toastr.error('Add ECF ref Field', 'Empty value inserted', { timeOut: 1500 });
        //     this.RMDetailsBtn = false;
        //     return false;
        // }
        // if (this.repairmaintenanceForm.value.amount_allocation === "") {
        //     this.toastr.error('Add Amount Allocation Field', 'Empty value inserted', { timeOut: 1500 });
        //     this.RMDetailsBtn = false;
        //     return false;
        // }

        const currentDate = this.repairmaintenanceForm.value
        currentDate.date = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');

        if(this.repairmaintenanceForm.value.next_date != "None"){
            currentDate.next_date = this.datePipe.transform(currentDate.next_date, 'yyyy-MM-dd');
        }
        else {
            this.repairmaintenanceForm.value.next_date = null
        }

        // currentDate.next_date = this.datePipe.transform(currentDate.next_date, 'yyyy-MM-dd');

        if (this.idValue == undefined) {
            this.remsService2.repairmaintenanceForm(this.repairmaintenanceForm.value, '', this.repairId)
                .subscribe(result => {
                    console.log("llb", result)
                    let code = result.code
                    if (code === "INVALID_MODIFICATION_REQUEST") {
                      this.notification.showError("You can not Modify before getting the Approval")
                      this.RMDetailsBtn = false;
                    }
                    else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
                        this.notification.showError("Duplicate! [INVALID_DATA! ...]")
                        this.RMDetailsBtn = false;
                    }
                    else {
                        this.notification.showSuccess("Successfully created!...")
                        this.RMDetailsBtn = false;
                        this.repairmaintenancesummary();
                        // this.repairmaintenanceForm.reset();
                        this.isECFno = false;
                        this.isAllocation = false;
                        this.fromGroupDirective.resetForm()
                    }
                })
        } else {
            this.remsService2.repairmaintenanceForm(this.repairmaintenanceForm.value, this.idValue, this.repairId)
                .subscribe(result => {
                    console.log("llb", result)
                    let code = result.code
                    if (code === "INVALID_MODIFICATION_REQUEST") {
                      this.notification.showError("You can not Modify before getting the Approval")
                      this.RMDetailsBtn = false;
                    }
                    else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
                        this.notification.showError("Duplicate! [INVALID_DATA! ...]")
                        this.RMDetailsBtn = false;
                    }
                    else {
                        this.notification.showSuccess("Successfully Updated!...")
                        this.RMDetailsBtn = false;
                        this.idValue = undefined;
                        this.repairmaintenancesummary();
                        this.fromGroupDirective.resetForm()
                        this.isECFno = false;
                        this.isAllocation = false;
                    }
                })
        }

    }
    RepairMaintenanceEdit(data) {
        this.remsshareService.repairmaintenanceForm.next(data)
        this.getrepairmaintenance();

    }
    RepairmaintenanceDelete(data) {
        let value = data.id
        this.remsService2.repairmaintenanceDeleteForm(value, this.repairId)
            .subscribe(result => {
                let code = result.code
                if (code === "INVALID_MODIFICATION_REQUEST") {
                this.notification.showError("You can not Modify before getting the Approval")
                }
                else {
                    this.notification.showSuccess("Successfully deleted....")
                    this.repairmaintenancesummary();
                    return true
                }
               
            })
    }
    repairmaintenancesummary(pageNumber = 1, pageSize = 10) {
        this.remsService2.repairmaintenancesummary(pageNumber, pageSize, this.repairId)
            .subscribe((result) => {
                console.log("eb", result)
                let datas = result['data'];
                let datapagination = result["pagination"];
                this.repairmaintenanceList = datas;
                console.log("re", this.repairmaintenanceList)
                if (this.repairmaintenanceList.length === 0) {
                    this.is_repairmaintenancepage = false
                }
                if (this.repairmaintenanceList.length >= 0) {
                    this.has_nextrepairmaintenance = datapagination.has_next;
                    this.has_previousrepairmaintenance = datapagination.has_previous;
                    this.presentrepairmaintenancepage = datapagination.index;
                    this.is_repairmaintenancepage = true
                }
            })
        let data: any = this.remsshareService.premiseViewID.value;
        this.premiseviewid = data.id
        if (data.requeststatus === "MODIFICATION" && data.premise_status === "DRAFT") {
            this.repdetmodify = true;
            this.getModificationView();
        }
    }


    previousClickRepairmaintenance() {
        if (this.has_previousrepairmaintenance === true) {
            this.currentrepairmaintenancepage = this.presentrepairmaintenancepage - 1
            this.repairmaintenancesummary(this.presentrepairmaintenancepage - 1)
        }

    }
    nextClickRepairmaintenance() {
        if (this.has_nextrepairmaintenance === true) {
            this.currentrepairmaintenancepage = this.presentrepairmaintenancepage + 1
            this.repairmaintenancesummary(this.presentrepairmaintenancepage + 1)
        }

    }
    onRMCancelClick() {
        this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Repairs & Maintenance" }, skipLocationChange: true });
    }
    getModificationView() {
        this.repdetailsModiData = []
        this.remsService2.getModificationView(this.premiseviewid)
            .subscribe((results) => {
                let datas = results.data
                console.log("Modificatoin ", datas)
                datas.forEach(element => {
                    if (element.action == 1 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
                        let data = {
                            modify_data: "New"
                        }
                        let json = Object.assign({}, data, element.data)
                        this.repdetailsModiData.push(json);
                    } else if (element.action == 2 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
                        let data = {
                            modify_data: "Modify"
                        }
                        let json = Object.assign({}, data, element.new_data)
                        this.repdetailsModiData.push(json);
                    } else if (element.action == 0 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
                        let data = {
                            modify_data: "Delete"
                        }
                        let json = Object.assign({}, data, element.data)
                        this.repdetailsModiData.push(json);
                    }

                    //   if (element.action == 1 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
                    //     this.repdetailsModiData.push(element.data);
                    //   } else if (element.action == 2 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
                    //     this.repdetailsModiData.push(element.new_data);
                    //   }
                })
            })
    }

    DropDown(data) {
        if (data.id == 1) {
            this.isAllocation = false;
            this.isECFno = true;
        }
        if (data.id == 3) {
            this.isECFno = true;
            this.isAllocation = true;
        }
        if (data.id == 2) {
            this.isECFno = false;
            this.isAllocation = false;
          }
        console.log("DropDown", data)
    }

    omit_special_char(event) {
        var k;
        k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
      }
}