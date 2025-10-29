import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Integrityleft } from "../models/integrityleft";
import { Integrityright } from "../models/integrityright";
import { Integritydiff } from "../models/integritydiff";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InterintegrityApiServiceService } from "../interintegrity-api-service.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/service/notification.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectionModel } from "@angular/cdk/collections";
import { Location } from "@angular/common";
import { DatePipe } from "@angular/common";
import { IntegrityComponent } from "src/app/brs/integrity/integrity.component";
import { Autoknockoffdata } from "../models/autoknockoffdata";
import { SharedService } from "../../service/shared.service";
declare var $: any;
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";
import { error } from "console";
// import { AdmindialogComponent } from "./admindialog/admindialog.component";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { UserdialogComponent } from "../userdialog/userdialog.component";
import { ActivatedRoute } from "@angular/router";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatCalendarCellCssClasses } from "@angular/material/datepicker";
import * as moment from "moment";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { TaService } from "../../ta/ta.service";
import { fromEvent, of } from "rxjs";
import { event } from "jquery";

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

interface ValueInputs {
  value: string;
  viewValue: string;
}
interface Item {
  name: string;
  id: string;
  value: string;
}

interface iface_typeValues{
  value: string;
  viewoption: string;
  id:number;
}

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  isfileUpload: boolean=true
  isviewData: boolean;
  isHistory: boolean;
  testrun: boolean;

  constructor() { }
  Submoduledatas  = [
    // {name: 'Screen1'},
    {name: 'Run Integrity'},
    // {name: 'View Data'},
    // {name: 'History'},

  ]

  ngOnInit(): void {
    this.subModuleData(this.Submoduledatas[0])
  }

  subModuleData(data)
{
    if(data.name == 'Run Integrity')
    {
      this.isfileUpload = true;
      this.isviewData = false;
      this.isHistory = false; 
      this.testrun=false
    }
    if(data.name == 'View Data')
    {
      this.isfileUpload = false;
      this.isviewData = true;
      this.isHistory = false; 
      this.testrun=false
    }
    if(data.name == 'History')
    {
      this.isfileUpload = false;
      this.isviewData = false;
      this.isHistory = true; 
      this.testrun=false
    }
    if(data.name == 'Screen1')
      {
        this.isfileUpload = false;
        this.isviewData = false;
        this.isHistory = false; 
        this.testrun=true
      }
}  

onFileSelected(evt)
{

}

}
