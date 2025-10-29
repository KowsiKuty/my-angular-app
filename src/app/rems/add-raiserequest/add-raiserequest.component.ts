import { Component, OnInit, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service'
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Rems2Service } from '../rems2.service'
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { on } from 'process';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface PrimaryContact {
  id: number;
  name: string;
}
export interface SubTypeList {
  name: string;
  id: number;
}
@Component({
  selector: 'app-add-raiserequest',
  templateUrl: './add-raiserequest.component.html',
  styleUrls: ['./add-raiserequest.component.scss']
})
export class AddRaiserequestComponent implements OnInit {
  @ViewChild('name') inputName;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  raiseReqList: any;
  typeList: any;
  addRaiseReqForm: FormGroup;
  isLoading = false;
  primaryContactList: any;
  imagesForRaiseReq: any;
  premiseId: number;
  subtypeList: any;
  detailsNameList = [];
  totalArray = [];
  AddReqBtn = false;
  addButton = true;
  renewal_Req: any;
  termination_Req: any;
  list: any;

  public subTypeList: SubTypeList[];
  public sub_type = new FormControl(null);
  public chipSelectedsubType: SubTypeList[] = [];
  public chipSelectedsubTypeid = [];
  public chipRemovedLandlordid = [];
  @ViewChild('ccbsInput') ccbsInput: any;
  @ViewChild('autoccbs') matAutocomplete: MatAutocomplete;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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

  constructor(private remsService: RemsService, private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private remsService2: Rems2Service, private toastr: ToastrService,
    private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    this.addRaiseReqForm = this.fb.group({
      type: [''],
      premise_id: [''],
      description: [''],
      ref_type: [''],

    })

    let primaykey: String = "";
    this.premise(primaykey);
    this.addRaiseReqForm.get('premise_id').valueChanges
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
        // let datas = results["data"];
        // this.primaryContactList = datas;
        const filterData = results.data.filter(app => app.main_status == 'APPROVED')
        this.primaryContactList = filterData;
      })
    this.getRaiseReqList();
  }

  private getRaiseReqList() {
    this.remsService.getRaiseReqList()
      .subscribe((results: any[]) => {
        let data = results["data"];
        this.raiseReqList = data;
      })
  }

  raiseReqDropDown(data) {
    this.list = data.text
    this.typeList = [];
    if (data.text == "RENEWAL") {
      this.renewal_Req = data.id
    } if (data.text == "TERMINATION") {
      this.termination_Req = data.id
    }
  }

  public displayFn(autoPrimary?: PrimaryContact): string | undefined {
    return autoPrimary ? autoPrimary.name : undefined;
  }

  get autoPrimary() {
    return this.addRaiseReqForm.get('premise_id');
  }

  private premise(primaykey) {
    this.remsService.premiseNameSearch(primaykey)
      .subscribe((results) => {
        // let datas = results["data"];
        // this.primaryContactList = datas;
        const filterData = results.data.filter(app => app.main_status == 'APPROVED')
        this.primaryContactList = filterData;
      })
  }

  onCancelClick() {
    this.router.navigate(['rems/rems/raiseRequest'], { skipLocationChange: isSkipLocationChange });
    this.remsshareService.backtosum.next('raise_request')
  }

  onFileSelectForRaiseReq(e) {
    this.imagesForRaiseReq = e.target.files;
  }

  premiseOption() {
    this.premiseId = this.addRaiseReqForm.value.premise_id.id
    if (this.premiseId) {

      if (this.list == "RENEWAL") {
        this.remsService.get_premiseOptionForRenewal(this.premiseId, this.renewal_Req)
          .subscribe((results) => {
            let datas = results["data"];
            this.typeList = datas;
          })
      }
      else if (this.list == "TERMINATION") {
        this.remsService.get_premiseOptionForTermination(this.premiseId, this.termination_Req)
          .subscribe((results) => {
            let datas = results["data"];
            this.typeList = datas;
          })
      }
      else {
        this.remsService.get_premiseOptionForModification(this.premiseId)
          .subscribe((results) => {
            let datas = results["data"];
            this.typeList = datas;
          })
      }
    }
  }
  valuechange(e) {
    this.addButton = false;
  }

  addRefId() {
    let reftype = this.addRaiseReqForm.value.ref_type.text
    let reftype_Id = this.addRaiseReqForm.value.ref_type.id
    let data = {
      type: reftype,
      id: reftype_Id,
      name: this.chipSelectedsubType
    }
    this.detailsNameList.push(data)
    this.chipSelectedsubType = []; // making the chipList empty
    this.addButton = true;
  }

  DeleteDetails(index: number) {
    this.detailsNameList.splice(index, 1);
  }

  subTypeOption() {
    let reftype = this.addRaiseReqForm.value.ref_type.text
    if (this.premiseId) {
      this.remsService.get_subTypeOption(this.premiseId, reftype)
        .subscribe((results) => {
          let datas = results["data"];
          if (reftype == "Occupancy Details") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.code
            }
          }
          else if (reftype == "Agreement and Rent") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.type.text + "(" + object.start_date + "-" + object.end_date + ")"
            }
          }
          else if (reftype == "Premise Details") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.building_name
            }
          }
          else if (reftype == "Documents") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.type.name
            }
          }
          else if (reftype == "Amenities & Infrastructure") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.amenties.name
            }
          }
          else if (reftype == "Legal Clearance") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.document_type.name
            }
          }
          else if (reftype == "EB Details") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.service_provider.name
            }
          }
          else if (reftype == "Legal & Statutory Notice") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.legal_notice_type.name
            }
          }
          else if (reftype == "Repairs & Maintenance") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.rm_type
            }
          }
          else if (reftype == "Renovations & Additions") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.amount
            }
          }
          else if (reftype == "Licenses & Certificate") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.licensetype.name
            }
          }
          else if (reftype == "Insurance Details") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.insurancetype.name
            }
          }
          else if (reftype == "Statutory Payments") {
            for (let i = 0; i < datas.length; i++) {
              let object = datas[i]
              object['name'] = object.tax_name.name
            }
          }
          this.subTypeList = datas;
        })
    }
  }

  public removeSubType(list: SubTypeList): void {
    const index = this.chipSelectedsubType.indexOf(list);
    this.chipRemovedLandlordid.push(list.id)
    this.chipSelectedsubType.splice(index, 1);
    this.chipSelectedsubTypeid.splice(index, 1);
    return;
  }

  public subTypeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectsubTypeByName(event.option.value.name);
    this.ccbsInput.nativeElement.value = '';
  }

  private selectsubTypeByName(employeeName) {
    let foundEmployee1 = this.chipSelectedsubType.filter(list => list.name == employeeName);
    if (foundEmployee1.length) {
      return;
    }
    let foundEmployee = this.subTypeList.filter(list => list.name == employeeName);
    if (foundEmployee.length) {
      this.chipSelectedsubType.push(foundEmployee[0]);
      this.chipSelectedsubTypeid.push(foundEmployee[0].id)
    }
  }

  submitForm() {
    this.AddReqBtn = true;
    if (this.addRaiseReqForm.value.type === "") {
      this.toastr.error('Please Select Any One Raise Request');
      this.AddReqBtn = false;
      return false;
    }
    if (this.addRaiseReqForm.value.premise_id === "") {
      this.toastr.error('Please Select Any One Premises Name');
      this.AddReqBtn = false;
      return false;
    }
    if(this.detailsNameList.length == 0)
    {
      this.toastr.error('Please add Raise Request and then click Submit');
      this.AddReqBtn = false;
      return false
    }

    for (let i = 0; i < this.detailsNameList.length; i++) {
      let obj_value = this.detailsNameList[i].name
      if (obj_value.length == 0) {
        let json = {
          ref_type: this.detailsNameList[i].id,
        }
        this.totalArray.push(json)
      } else {
        for (let j = 0; j < obj_value.length; j++) {
          let json = {
            ref_type: this.detailsNameList[i].id,
            ref_id: obj_value[j].id
          }
          this.totalArray.push(json)

        }

      }
    }
    this.addRaiseReqForm.value.premise_id = this.addRaiseReqForm.value.premise_id.id
    this.addRaiseReqForm.value.ref_type = this.totalArray
    this.remsService.raiseRequestForm(this.addRaiseReqForm.value, this.imagesForRaiseReq)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA ...")
          this.AddReqBtn = false;
        }
        else if(result.code === "INVALID_FILETYPE") {
          this.notification.showError("Invalid FileType...")
          this.AddReqBtn = false;
        }
        else {
          this.notification.showSuccess("Submitted Successfully!...")
          this.imagesForRaiseReq = null
          this.router.navigate(['/rems/raiseRequest'], { skipLocationChange: isSkipLocationChange });
        }
      })
  }
}