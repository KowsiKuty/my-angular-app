import { Component, OnInit, ViewChild } from '@angular/core';
import { Rems2Service } from '../rems2.service';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { RemsService } from '../rems.service';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange
export interface PrimaryContact {
  id: number;
  name: string;
  code: string;
}
export interface PremiseList {
  id: number;
  name: string;
}
export interface occCodeList {
  id: number;
  name: string;
}

@Component({
  selector: 'app-premise-identification-form',
  templateUrl: './premise-identification-form.component.html',
  styleUrls: ['./premise-identification-form.component.scss']
})
export class PremiseIdentificationFormComponent implements OnInit {
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;

  @ViewChild('premiseInput') premiseInput: any;
  @ViewChild('autoPremise') matAutocomplete1: MatAutocomplete;

  @ViewChild('codeInput') codeInput: any;
  @ViewChild('autocode') matAutocomplete2: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  primaryContactList: any;
  premiseList: any;
  codeList: any;
  
  premiseIdentificationForm: FormGroup;
  ownerShipData: any;
  identificationTypeList: any;
  idValue: any;
  PreIdenBtn=false
  code:any;
  name:any;
  usageList: any
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  existing_premise = false;
  existing_occ_code = false;
  sitetypeList = [{ id: 1, text: "READILY_BUILTUP" }, { id: 2, text: "EMPTY_SITE" }]
  has_nextpremise = true;
  has_previouspremise = true;
  currentpagepremise: number = 1;

  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1;


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
      ['insert', ['table', 'picture', 'link', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService,
    private remsService: Rems2Service, private toastr:
      ToastrService, private notification: NotificationService,private dataService: RemsService ) { }

  ngOnInit(): void {
    this.premiseIdentificationForm = this.fb.group({
      identification_type_id: [''],
      site_type:[''],
      exsiting_premise_id: [''],
      exsiting_occupancy_code: [''],
      name: [''],
      ownership_type: ['', Validators.required],
      area: [''],
      offered_rent: [''],
      usage_code: [''],
      group_id:[''],
      description: [''],
    })


    let primaykey: String = "";
    this.branch(primaykey);
    this.premiseIdentificationForm.get('group_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getDepartmentFilter(value)
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
    this.occ_code(primaykey1);
    this.premiseIdentificationForm.get('exsiting_occupancy_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.branchNameScroll1(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.codeList = datas;
      })



    let primaykey2: String = "";
    this.premise(primaykey2);
    this.premiseIdentificationForm.get('exsiting_premise_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.premiseNameSearch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results) => {
        const filterData = results.data.filter(app=>app.main_status == 'APPROVED')
        this.premiseList = filterData;
      })

    this.getIdentificationForm();
    this.getOwnerShipType();
    this.getUsage();
    this.getIdentificationType();
  }

  readonlyRent = false
  ownership_typeSel(ower)
  {
    if(ower.id == 1 || ower.id == 4)
      this.readonlyRent = true
    else
      this.readonlyRent = false
  }

  premisename: any;
  occucode: any;

  getIdentificationForm() {
    let data: any = this.remsshareService.identificationForm.value
    console.log("data",data);
    this.idValue = data.id;
    if (data === '') {
      this.premiseIdentificationForm.patchValue({
        name: '',
        group_id:'',
        description: '',
        offered_rent: '',
        area: '',
        usage_code: '',
        ownership_type: '',
        identification_type_id: '',
        site_type:'',
        exsiting_premise_id: '',
        exsiting_occupancy_code: '',
      })
    } else {
      if (data.identificationtype.id == 1) {
        this.existing_premise = false;
        this.existing_occ_code = false;
      } else {
        this.existing_premise = true;
        this.existing_occ_code = true;
        this.premisename = data.exsiting_premise_id;
        this.occucode = data.exsiting_occupancy_code;
      }
      this.premiseIdentificationForm.patchValue({
        name: data.name,
        description: data.description,
        offered_rent: data.offered_rent,
        area: data.area,
        usage_code: data.usage_code.id,
        ownership_type: data.ownership_type.id,
        group_id: data.group_id,
        identification_type_id: data.identificationtype.id,
        site_type:data.site_type.sitetype_id,
        exsiting_premise_id: this.premisename,
        exsiting_occupancy_code: this.occucode
      })
    }
  }

  autocompleteBranchNameScroll() {
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
                this.remsService.getDepartmentScroll(this.primaryContactInput.nativeElement.value, this.currentpage + 1)
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

  public displayFn(autoPrimary?: PrimaryContact): string | undefined {
    return autoPrimary ? autoPrimary.name : undefined;
  }

  get autoPrimary() {
    return this.premiseIdentificationForm.get('group_id');
  }

  private branch(primaykey) {
    this.remsService.getDepartmentFilter(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }

  //existing occ code
  public displayFnCode(autocode?: occCodeList): string | undefined {
    return autocode ? autocode.name : undefined;
  }

  get autocode() {
    return this.premiseIdentificationForm.get('exsiting_occupancy_code');
  }

  private occ_code(primaykey) {
    this.remsService.branchName(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.codeList = datas;
      })
  }

  priOffScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete2 &&
        this.autocompleteTrigger &&
        this.matAutocomplete2.panel
      ) {
        fromEvent(this.matAutocomplete2.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete2.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete2.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete2.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete2.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_prinext === true) {
                this.dataService.getUsageCode(this.codeInput.nativeElement.value, this.pricurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.codeList = this.codeList.concat(datas);
                    if (this.codeList.length >= 0) {
                      this.has_prinext = datapagination.has_next;
                      this.has_priprevious = datapagination.has_previous;
                      this.pricurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  //existing premise
  public displayFnPremise(autoPremise?: PremiseList): string | undefined {
    return autoPremise ? autoPremise.name : undefined;
  }

  get autoPremise() {
    return this.premiseIdentificationForm.get('exsiting_premise_id');
  }

  private premise(primaykey) {
    this.remsService.premiseNameSearch(primaykey)
      .subscribe((results) => {
        const filterData = results.data.filter(app=>app.main_status == 'APPROVED')
        this.premiseList = filterData;
      })
  }
  // autocompletePremisesNameScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete1 &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete1.panel
  //     ) {
  //       fromEvent(this.matAutocomplete1.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete1.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete1.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete1.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete1.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextpremise === true) {
  //               this.remsService.premiseNameScroll(this.premiseInput.nativeElement.value, this.currentpagepremise + 1)
  //                 .subscribe((results) => {
  //                   // let datas = results["data"];
  //                   const filterData = results.data.filter(app=>app.main_status == 'APPROVED')
  //                   console.log("23",filterData)
  //                   let datapagination = results["pagination"];
  //                   this.premiseList = this.premiseList.concat(filterData);
  //                   if (this.premiseList.length >= 0) {
  //                     this.has_nextpremise = datapagination.has_next;
  //                     this.has_previouspremise = datapagination.has_previous;
  //                     this.currentpagepremise = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  
  premiseIdentification() {
    this.PreIdenBtn=true;
   
    if (this.premiseIdentificationForm.value.name === "") {
      this.toastr.error('Please Enter Proposed Location');
      this.PreIdenBtn=false;
      return false;
    }
    console.log("this.premiseIdentificationForm.value.site_type",this.premiseIdentificationForm.value.site_type)
    if (this.premiseIdentificationForm.value.site_type === "") {
      this.toastr.error('Please select valid Sitetype');
      this.PreIdenBtn=false;
      return false;
    }
    if (this.premiseIdentificationForm.value.ownership_type === "" || this.premiseIdentificationForm.value.ownership_type === null
      || this.premiseIdentificationForm.value.ownership_type === undefined) {
      this.toastr.error('', 'Please Enter Ownership Type', { timeOut: 1500 });
      this.PreIdenBtn=false;
      return false;
    }
    if (this.premiseIdentificationForm.value.usage_code === "") {
      this.toastr.error('Please Select Any One Occupancy Usage');
      this.PreIdenBtn=false;
      return false;
    }
    if (this.premiseIdentificationForm.value.group_id === "") {
      this.toastr.error('Please Select Any One DO');
      this.PreIdenBtn=false;
      return false;
    }

    if (this.premiseIdentificationForm.value.area === "") {
      this.toastr.error('Please Enter Area(sq ft)');
      this.PreIdenBtn=false;
      return false;
    }
    if (this.premiseIdentificationForm.value.offered_rent === "" && ! this.readonlyRent) {
      this.toastr.error('Please Enter Proposed Rent/Month');
      this.PreIdenBtn=false;
      return false;
    }
    else if(this.readonlyRent )
      {
        this.premiseIdentificationForm.value.offered_rent =0
      }

    this.premiseIdentificationForm.value.group_id = this.premiseIdentificationForm.value.group_id.id
    if(this.premiseIdentificationForm.value.exsiting_occupancy_code != undefined){
    this.premiseIdentificationForm.value.exsiting_occupancy_code = this.premiseIdentificationForm.value.exsiting_occupancy_code.id
    this.premiseIdentificationForm.value.exsiting_premise_id = this.premiseIdentificationForm.value.exsiting_premise_id.id
    }
    
    if (this.idValue == undefined) {
      this.remsService.premiseIdentificationFormCreate(this.premiseIdentificationForm.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.PreIdenBtn=false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/rems'], { skipLocationChange: isSkipLocationChange });

          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.premiseIdentificationFormCreate(this.premiseIdentificationForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.PreIdenBtn=false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/rems'], { skipLocationChange: isSkipLocationChange });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/rems'], { skipLocationChange: isSkipLocationChange });

  }

  getOwnerShipType() {
    this.remsService.getOwnerShipType()
      .subscribe(result => {
        let data = result.data;
        this.ownerShipData = data;
      })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }

  getUsage() {
    this.remsService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageList = datas;
      })

  }

  getIdentificationType() {
    this.remsService.getIdentificationType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.identificationTypeList = datas;
      })

  }

  identificationDropDown(data) {
    if (data.id == 1) {
      this.existing_premise = false;
      this.existing_occ_code = false;
    } else {
      this.existing_premise = true;
      this.existing_occ_code = true;
    }
  }



}
