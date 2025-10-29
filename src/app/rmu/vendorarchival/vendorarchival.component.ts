import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RmuApiServiceService } from "../rmu-api-service.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NotificationService } from "../../service/notification.service";
import { environment } from "src/environments/environment";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: "app-vendorarchival",
  templateUrl: "./vendorarchival.component.html",
  styleUrls: ["./vendorarchival.component.scss"],
  animations: [
    trigger('stepState', [
      state('completed', style({ backgroundColor: 'green', transform: 'scale(1.1)' })),
      state('inProgress', style({ backgroundColor: 'yellow' })),
      state('upcoming', style({ backgroundColor: 'lightgray', transform: 'scale(0.9)' })),
      transition('* => *', animate('500ms ease-in-out')),
    ])
  ]
})
export class VendorarchivalComponent implements OnInit {
  rmuurl = environment.apiURL;
  vedorarchival_search: any;
  vendor_archieval: any;
  vendor_archival_summary: any;
  vendorarchieval_summaryapi: any;
  searchvar:any="String"
  @ViewChild("closeachievalpopup") closeachievalpopup;
  constructor(
    private rmuservice: RmuApiServiceService,
    public router: Router,
    public formbuilder: FormBuilder,
    private notification: NotificationService
  ) {
    this.vendor_archieval = {
      label: "Archival Status",
      method: "get",
      url: "",
      params: "",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
    };
    this.vedorarchival_search = [
      {
        type: "date",
        label: "Archival Date",
        formvalue: "date",
        dateformat: "dd-MMM-yyyy",
      },
      {
        type: "dropdown",
        inputobj: this.vendor_archieval,
        formvalue: "vendor",
      },
    ];
    this.vendorarchieval_summaryapi = {
      method: "get",
      url: this.rmuurl + "rmuserv/vendor_archival",
    };
    this.vendor_archival_summary = [
      { columnname: "Archival Code", key: "archival_code" },
      {
        columnname: "Archival Date",
        key: "archival_date",
        type: "Date",
        datetype: "dd-MMM-yyyy",
      },
      {
        columnname: "Contact Person",
        key: "contact_person",
        type: "object",
        objkey: "code",
      },
      { columnname: "Contact Address", key: "contact_address" },
      { columnname: "Contact Number", key: "contact_no" },
      {
        columnname: "Status",
        key: "archival_status",
        type: "object",
        objkey: "value",
      },
      {
        columnname: "Action",
        key: "contact_address",
        button: true,
        function: true,
        validate: true,
        validatefunction: this.vendor_archievalbuttonfn.bind(this),
        clickfunction: this.vendor_achieval_schedules.bind(this),
      },
    ];
  }

  vendorarchivallist = [];
  schedulerequest: FormGroup;
  pickuprequest: FormGroup;
  archiverequest: FormGroup;
  vendorsearch: FormGroup;
  singlerecord: any = [];

  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  id: any;

  archstatus = {
    REQUESTED: "SCHEDULE",
    SCHEDULED: "PICK UP",
    PICKEDUP: "ARCHIVE",
    ARCHIVED: "VIEW",
  };

  @ViewChild("closebtn") closebtn: ElementRef;

  ngOnInit(): void {
    //archstatus
    this.vendorsearch = this.formbuilder.group({
      archival_date: "",
      archival_status: "",
    });

    this.schedulerequest = this.formbuilder.group({
      contact_person: "",
      contact_no: "",
      vehicle_no: "",
      scheduled_date: "",
      barcode_no: "",
      status: "",
      archival_request_id: "",
    });
    this.vendorsearch = this.formbuilder.group({
      archival_date: "",
      archival_status: "",
      barcodeType: "",
    });

    this.pickuprequest = this.formbuilder.group({
      archival_request_id: "",
      barcode:""
    });
    this.archiverequest = this.formbuilder.group({
      archival_request_id: "",
    });

    this.getvendorarchsummary();
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.getvendorarchsummary();
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1;
    }
    this.getvendorarchsummary();
  }

  getvendorarchsummary() {
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.rmuservice
      .getvendorarchsummary("", this.pagination.index)
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.vendorarchivallist = results["data"];
        // this.archstatus = this.vendorarchivallist[0].archival_status.value;
        // console.log(this.archstatus)
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
      });
  }

  sendschedule() {
    console.log(this.schedulerequest.value);
    this.rmuservice
      .schedulearchival(this.schedulerequest.value)
      .subscribe((results) => {
        this.vendorarchivallist = results["data"];

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;

        if (results.status == "success") {
          this.notification.showSuccess("Pickup Scheduled");
          this.closebtn.nativeElement.click();
          this.getvendorarchsummary();
        } else {
          this.notification.showError(results.description);
        }
      });
  }
  schedules(data) {
    this.archstatus[data.archival_status.value];
    this.schedulerequest.patchValue({
      barcode_no: data.archival_code,
      status: data.archival_status.value,
      archival_request_id: data.id,
    });
  }
  getStepState(date: any): string {
    return date ? 'completed' : 'upcoming';
  }

  pickedup(data) {
    console.log(data);
    this.pickuprequest.patchValue({
      archival_request_id: data.id,
    });

    this.rmuservice
      .pickuparchival(this.pickuprequest.value)
      .subscribe((results) => {
        this.vendorarchivallist = results["data"];

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;

        if (results.status == "success") {
          this.notification.showSuccess("Pickup Completed");
          this.getvendorarchsummary();
        } else {
          this.notification.showError(results.description);
        }
      });
  }
  archived(data) {
    this.archiverequest.patchValue({
      archival_request_id: data.id,
    });

    this.rmuservice
      .archivalcomplete(this.archiverequest.value)
      .subscribe((results) => {
        this.vendorarchivallist = results["data"];

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;

        if (results.status == "success") {
          this.notification.showSuccess("Archive Completed");
          this.getvendorarchsummary();
        } else {
          this.notification.showError(results.description);
        }
      });
  }
  viewhistory(datas) {
    this.rmuservice.getsinglerecord(datas).subscribe((results) => {
      this.singlerecord = results;
      console.group(results);
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;
      if (results.status == "success") {
        //this.notification.showSuccess("Records Uploaded Successfully")
      } else {
        // this.notification.showError(results.description)
      }
    });
  }
  vendorarchivalsummary(archieval) {
    this.vendorarchieval_summaryapi = {
      method: "get",
      url: this.rmuurl + "rmuserv/vendor_archival",
      params: archieval,
    };
  }

  vendor_archievalbuttonfn(vendor) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (vendor.archival_status?.value === "REQUESTED") {
      config = {
        disabled: false,
        style: { color: "balck" },
        icon: "usb",
        class: "",
        value: "",
        function: true,
      };
    } else if (vendor.archival_status?.value === "ARCHIVED") {
      config = {
        disabled: false,
        style: { color: "balck" },
        icon: "archive",
        class: "",
        value: "",
        function: true,
      };
    } else if (vendor.archival_status.value === "SCHEDULED") {
      config = {
        disabled: false,
        style: { color: "black" },
        icon: "local_shipping",
        class: "",
        value: "",
        function: true,
      };
    }
    else if (vendor.archival_status.value === "PICKEDUP") {
      config = {
        disabled: false,
        style: { color: "black" },
        icon: "check_circle_outline",
        class: "",
        value: "",
        function: true,
      };
    }
    return config;
  }
  vendor_achieval_schedules(achieval) {
    if (achieval.archival_status?.value === "ARCHIVED") {
      this.viewhistory(achieval.id);
      this.popupopen();
    } else if (achieval.archival_status?.value === "REQUESTED") {
      this.schedules(achieval);
      this.popupopenscheluded();
    } else if (achieval.archival_status?.value === "SCHEDULED") {
      this.popupopenpickup();
      this.pickedup(achieval);
    } else if (achieval.archival_status?.value === "PICKEDUP") {
      this.archived(achieval)
      this.popupopenarchived()
    }
  }
  closedpopup() {
    this.closeachievalpopup.nativeElement.click();
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("viewform"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenscheluded() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("scheduleform"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  popupopenpickup() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("pickedupform"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  popupopenarchived() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("archivedform"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
}
