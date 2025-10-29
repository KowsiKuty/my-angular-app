import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { ErrorHandlingServiceService } from '../error-handling-service.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { NotificationService } from '../notification.service';
import { PRPOshareService } from '../prposhare.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface branchlistss {
  id: any;
  name: string;
  code: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface cclistss {
  id: string;
  costcentre_id: any
  name: string;
}

export interface itemsLists {
  id: string;
  name: string;
}

export interface bslistss {
  id: string;
  name: string;
  bs: any
}



@Component({
  selector: 'app-branchrequest-approver',
  templateUrl: './branchrequest-approver.component.html',
  styleUrls: ['./branchrequest-approver.component.scss']
})
export class BranchrequestApproverComponent implements OnInit {

  brappForm: FormGroup;
  isLoading: boolean;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();

  branchList: Array<branchlistss>;

  commodityList: Array<commoditylistss>;

  bslist: Array<bslistss>;

  itemList: Array<itemsLists>;





  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('productcat') matproductAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  @ViewChild('bs') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('item') matitemAutocomplete: MatAutocomplete;
  @ViewChild('itemInput') itemInput: any;
  @ViewChild('uom') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('cc') matuomAutocompletecc: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;

  constructor(
    private fb: FormBuilder, private prposervice: PRPOSERVICEService, private router: Router,
    private notification: NotificationService, private prposhareService: PRPOshareService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.brappForm = this.fb.group({
      branch_id:'',
      commodity:'',
      product: '',
      quantity:'',
      uom:'',
      bs:'',
    })
  }

}
