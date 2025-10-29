import { Component, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, FormControl, Validators,FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { RemsService } from '../rems.service';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'


const isSkipLocationChange = environment.isSkipLocationChange
export interface cityListss {
  name: string;
  id: number;
}
export interface pinCodeListss {
  no: string;
  id: number;
}
export interface districtListss {
  name: string;
  id: number;
}
export interface stateListss {
  name: string;
  id: number;
}


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
  selector: 'app-premise-identification-view',
  templateUrl: './premise-identification-view.component.html',
  styleUrls: ['./premise-identification-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PremiseIdentificationViewComponent implements OnInit {
  premiseDocInfoForm: FormGroup
  premisenameForm:FormGroup
  approverForm: FormGroup
  premiseIdentificationapproverForm: FormGroup
  moveToEstateCellForm: FormGroup
  premiseIdViewData: any;
  premi
  // dropDownTag = "premisesname";
  premiseDocumentInfoData: any;
  premiseNameData: any;
  premisedropList: any
  proposedPremiseId: number;

  next_docInfo = true;
  previous_docInfo = true;
  isDocInfo = true;
  presentPageDocInfo: number = 1;
  pageSizeDocInfo = 10;
  loginname: any
  abc: boolean = true;
  a: boolean
  premIdentificationForm:boolean = false
  @ViewChild('closebutton') closebutton;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective


  @ViewChild('primaryyContactInput') primaryyContactInput: any;
  @ViewChild('autoPrimary1') matAutocomplete: MatAutocomplete;


  cityList: Array<cityListss>;
  city_id = new FormControl();

  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();


  districtList: Array<districtListss>;
  district_id = new FormControl();

  stateList: Array<stateListss>;
  state_id = new FormControl();

  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  
  primaryContactList: any;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  documentTypeData: any;
  images: any;
  premiseIdentification: number;
  idValue: number;
  isDocInfoForm=true
  isDocumentCountButton=true
  ispremisename=true
  id:any;
  iList: any;
  imagesforpremiseIdentificationApprover: any;
  status: string;
  coverageNote: any;
  isShowContent = false;
  estateApproveData: any;
  historyData: any;



  @ViewChild(FormGroupDirective) fromGroupDirective : FormGroupDirective 

  fileData: any;
  isFileData = false;

  iMasterList: any;

  // ismakercheckerButton:boolean=true


  filesid:any;



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


  moveToEmc: any = {
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



  moveToEstateCell: any = {
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
  

  constructor(private shareService: RemsShareService, private router: Router, private fb: FormBuilder,
    private notification: NotificationService, private toastr: ToastrService,
    private sharedService: SharedService, private remsservice: RemsService, private datePipe: DatePipe,
    private remsService: Rems2Service) { }

  ngOnInit(): void {
    
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "REMS") {
        this.iMasterList = subModule;
  

      }
      if (element.role[0].name === "Checker"){
        // this.ismakercheckerButton=false
        console.log('cakerr', element.role.name)

      }

    });


    // const item = localStorage.getItem("sessionData");
    // if (item !== null){
    //   let itemValue = JSON.parse(item);
    //   this.sharedService.Loginname=itemValue.name;
    //   this.loginname=this.sharedService.Loginname
    //   console.log("logname", this.loginname)
    // }
    this.premiseDocInfoForm = this.fb.group({
      doctype: ['', Validators.required,],
      initiation_date: ['', Validators.required],
      approved_by: ['', Validators.required],
      remarks: [''],
      premiseidentificationname: ['', Validators.required],
      images: []

    })

    this.approverForm = this.fb.group({
      approved_rent: [''],
   
    })

    this.premiseIdentificationapproverForm = this.fb.group({
      content: [''],
      doctype: [''],
      
    })

    this.moveToEstateCellForm = this.fb.group({
      content: [''],
      
    })

    this.premisenameForm = this.fb.group({
      name: ['', Validators.required,],
      remarks: [''],
      area: ['', Validators.required],
      offered_rent: [''],
      owner_type:[],
      building_type:[],
      description: [''], 
      address: this.fb.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        pincode_id: ['', Validators.required],
      }),
   
    })

    // let data: any = this.shareService.premiseDocuInfo.value
    // let data: any = this.shareService.identificationForm.value
    // this.premiseIdentification = data.premisesIdentification;
    this.id = this.shareService.premiseIdView.value;

    let primaykey: String = "";
    this.primaryContact(primaykey);
    this.premiseDocInfoForm.get('approved_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsservice.primaryContact(value)
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



      let pinkeyvalue: String = "";
    this.getPinCode(pinkeyvalue);
    //this.getPinCode();
    this.premisenameForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.remsservice.getPinCodeDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("pincode_id", datas)

      })








    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.premisenameForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.remsservice.getCityDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("cityList", datas)
      })



    //this.getDistrict();
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);
    this.premisenameForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.remsservice.getDistrictDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("districtList", datas)

      })








    // this.getState();
    let statekeyvalue: String = "";
    this.getState(statekeyvalue);
    this.premisenameForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.remsservice.getStateDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("stateList", datas)

      })
    this.getDocumentType();
    this.getPremiseIDView();
    this.premisedrop();
    // this.getCoverageNote();
  


  }

  onFileSelectedForPremiseIdentificationApprover(e) {
    this.imagesforpremiseIdentificationApprover = e.target.files;
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
                this.remsservice.primaryContacts(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
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
    return primary ? primary.full_name : undefined;
  }

  get primary() {
    return this.premiseDocInfoForm.get('approved_by');
  }

  private primaryContact(primaykey) {
    this.remsservice.primaryContact(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }


  docInfoEdit(data: any) {
    this.isDocInfoForm = true;
    let datas: any = this.shareService.premiseDocuInfo.value
    this.fileData=data.attachments;
    console.log("filedata",this.fileData)
    this.premiseIdentification = datas.premisesIdentification;
    this.idValue = data.id;
    if (data === '') {
      this.isFileData=false;
      this.premiseDocInfoForm.patchValue({
        doctype: '',
        initiation_date: '',
        approved_by: '',
        premiseidentificationname: '',
        remarks: '',

      })
    } else {
      this.premiseDocInfoForm.patchValue({
        remarks: data.remarks,
        initiation_date: data.initiation_date,
        approved_by: data.approved_by,
        premiseidentificationname: data.premiseidentificationname,
        doctype: data.doctype?.id,

      })
      if (data.attachments) {
        this.isFileData = true
        this.fileData = data.attachments;
      }

    }
  }


  doccInfoEdit(data:any) {
    this.isDocInfoForm=true;
    console.log("premisenameFormdata",data)
    let datas: any = this.shareService.premiseDocuInfo.value
    this.premiseIdentification = datas.premisesIdentification;
    this.idValue = data.id;
    if (data === '') {
      this.premisenameForm.patchValue({
        name:'',
        remarks: '',
        offered_rent: '',
        owner_type:'',
        building_type:'',
        area: '',
        description: '',

      })
    } else {
      this.premisenameForm.patchValue({
        name:data.name,
        remarks: data.remarks,
        offered_rent: data.offered_rent,
        owner_type:data.owner_type.ownertype_id,
        building_type:data.building_type.buildingtype_id,
        area: data.area,
        description: data.description,
        address: {
          line1: data.address.line1,
          line2: data.address.line2,
          line3: data.address.line3,
          city_id: data.address.city_id,
          district_id: data.address.district_id,
          state_id: data.address.state_id,
          pincode_id: data.address.pincode_id,
         
        }
      })
    }
  }

  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    // console.log('id', pintype.id);
    // console.log('no', pintype.no);
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.premisenameForm.controls.address.get('pincode_id');
  }

  private getPinCode(pinkeyvalue) {
    this.remsservice.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("PinCode DD", datas)
        // return true
      })
  }




  public displayFncity(citytype?: cityListss): string | undefined {
    // console.log('id', citytype.id);
    // console.log('name', citytype.name);
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.premisenameForm.controls.address.get('city_id');
  }
  private getCity(citykeyvalue) {
    this.remsservice.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("City DD", datas)
        // return true
      })
  }



  public displayFndistrict(districttype?: districtListss): string | undefined {
    // console.log('id', districttype.id);
    // console.log('name', districttype.name);
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.premisenameForm.controls.address.get('district_id');
  }
  private getDistrict(districtkeyvalue) {
    this.remsservice.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("District DD", datas)
        
      })
  }



  public displayFnstate(statetype?: stateListss): string | undefined {
    // console.log('id', statetype.id);
    // console.log('name', statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.premisenameForm.controls.address.get('state_id');
  }
  private getState(statekeyvalue) {
    this.remsservice.getStateDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        
      })
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.premisenameForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  }

  citys(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.premisenameForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  private premisedrop() {
    this.remsservice.premisedrop()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premisedropList = datas;
      })

  }
  premisenameCreate(){
    if (this.premisenameForm.value.name === "") {
      this.toastr.error('', 'Please Enter Premises Name', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.value.area === "") {
      this.toastr.error('', 'Please Enter Area(sq ft)', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.value.owner_type === "") {
      this.toastr.error('', 'Please select Owner type', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.value.building_type === "") {
      this.toastr.error('', 'Please select building type', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.value.offered_rent === "" && !this.offeredRentReadonly ) {
      this.toastr.error('', 'Please Enter Offered Rent', { timeOut: 1500 });
      return false;
    }
    else if(this.offeredRentReadonly)
    {
      this.premisenameForm.value.offered_rent = 0
    }
    if (this.premisenameForm.controls.address.value.line1 === "") {
      this.toastr.error('Address No: Field', 'Address No can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.line1.trim() === "") {
      this.toastr.error('Add No: Field', 'Address No can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.line2 === "") {
      this.toastr.error('Add Street Field', 'Address street can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.line2.trim() === "") {
      this.toastr.error('Add Street Field', 'Address street can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.line3 === "") {
      this.toastr.error('Add Area Field', 'Address area can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.line3.trim() === "") {
      this.toastr.error('Add Area Field', 'Address area can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.pincode_id === "") {
      this.toastr.error('Add Pincode Field', 'Address pincode can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.city_id === "") {
      this.toastr.error('Add City Field', 'Address city can not be empty', { timeOut: 1500 });
      return false;
    }
    
    if (this.premisenameForm.controls.address.value.district_id === "") {
      this.toastr.error('Add District Field', 'Address district can not be empty', { timeOut: 1500 });
      return false;
    }
    if (this.premisenameForm.controls.address.value.state_id === "") {
      this.toastr.error('Add State Field', 'Address state can not be empty', { timeOut: 1500 });
      return false;
    }

    

    this.premisenameForm.controls.address.value.city_id = this.premisenameForm.controls.address.value.city_id.id
    this.premisenameForm.controls.address.value.state_id = this.premisenameForm.controls.address.value.state_id.id
    this.premisenameForm.controls.address.value.district_id = this.premisenameForm.controls.address.value.district_id.id
    this.premisenameForm.controls.address.value.pincode_id = this.premisenameForm.controls.address.value.pincode_id.id

if (this.idValue == undefined) {
  this.remsService.premisenameForm(this.premisenameForm.value, '',this.id)
    .subscribe(result => {
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.notification.showError("Duplicate! [INVALID_DATA! ...]")
      }
      else {
        this.notification.showSuccess("Successfully created!...")
        this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
        this.getPremisename();
        this.getPremiseIDView();
        // this.premisenameForm.reset();
        this.formGroupDirective.resetForm();

        this.closebutton.nativeElement.click();
      }
      // this.idValue = result.id;
    })
} else {
  this.remsService.premisenameForm(this.premisenameForm.value, this.idValue,this.id)
    .subscribe(result => {
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.notification.showError("Duplicate! [INVALID_DATA! ...]")
      }
      else {

        this.notification.showSuccess("Successfully Updated!...")
        this.idValue=undefined
        this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
        this.getPremisename();
        this.getPremiseIDView();
        // this.premisenameForm.reset();
        this.formGroupDirective.resetForm();

        this.closebutton.nativeElement.click();
      }
    })
}

}

premiseIDView(id) {
  this.shareService.premiseIdnameView.next(id);
  this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
}
  premiseDocInfoCreate() {
    // let data: any = this.shareService.premiseDocuInfo.value
    // this.premiseIdentification = data.premisesIdentification;
    if (this.premiseDocInfoForm.value.doctype === "") {
      this.toastr.warning('', 'Please Enter Document Type', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.initiation_date === "") {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.approved_by === "") {
      this.toastr.warning('', 'Please Enter Approved', { timeOut: 1500 });
      return false;
    } if (this.premiseDocInfoForm.value.images === "" || this.premiseDocInfoForm.value.images === null || this.premiseDocInfoForm.value.images === undefined) {
      this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
      return false;
    }

    const Date = this.premiseDocInfoForm.value;
    Date.initiation_date = this.datePipe.transform(Date.initiation_date, 'yyyy-MM-dd');
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
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
            this.getPremiseDocInfoForm();
            this.fromGroupDirective.resetForm()
            this.closebutton.nativeElement.click();
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.premiseDocInfoForm(this.premiseDocInfoForm.value, this.idValue, this.images, this.id)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });
            this.getPremiseDocInfoForm();
            this.fromGroupDirective.resetForm()
            this.closebutton.nativeElement.click();
          }
        })
    }
  }
  onFileSelected(e) {
    this.images = e.target.files;
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



  b:number
  de:any
  c:any
  ppid:number;
  note: any;
  ownershipType :any
  offeredRentReadonly = false
  getPremiseIDView() {
    let id: any = this.shareService.premiseIdView.value;
    this.ppid = id

    this.remsService.getPremiseIdView(id)
      .subscribe(result => {
        this.premiseIdViewData = result
        this.ownershipType = result?.ownership_type?.id
        if(this.ownershipType == 1 || this.ownershipType == 4)
          this.offeredRentReadonly = true
        else
          this.offeredRentReadonly = false

        console.log("logn", this.premiseIdViewData)
        this.a = this.premiseIdViewData.approver_flag.flag
        console.log("appr", this.a)

        this.b=this.premiseIdViewData.status.id
        this.c=this.premiseIdViewData.id
        this.de=this.c
        this.note=this.premiseIdViewData.description
        if(this.premiseIdViewData.status.status === "Pending Checker"){
             this.status = "Pending"
        }else {
             this.status = this.premiseIdViewData.status.status
        }
        // this.getPremiseDocInfoForm();
        this.getPremisename();
        this.identificationHistory();
        let json: any = {
          data: [{
            title: "PremisesIdentificationView",
            name: result.name,
            code: result.code,
            routerUrl: "/rems",
            headerName: "REMS"
          }]
        }
        this.shareService.premiseBackNavigation.next(json)
      })
      console.log("pid",this.de)
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
        this.notification.showSuccess("Deleted....")
        this.getPremiseDocInfoForm()
        this.isDocInfoForm = true;
        this.isDocumentCountButton = true;
      })
  }

  doccInfoDelete(id) {
    this.remsService.doccInfoDelete(this.premiseIdViewData.id,id)
      .subscribe(result => {
        this.notification.showSuccess("Deleted....")
        this.getPremisename();
        this.ispremisename=true;
        // this.isDocumentCountButton=true;
      })
  }
  adddocinfo(data) {
    if (data == '') {
      this.isFileData=false;
      this.premiseDocInfoForm.patchValue({
        doctype: '',
        initiation_date: '',
        approved_by: '',
        remarks: '',
        premiseidentificationname: '',

      })
    }

    this.getPremiseDocInfoForm();
  }

  addpremisename(data) {
    if (data == '') {
      this.premisenameForm.patchValue({
        name:'',
        remarks: '',
        offered_rent: '',
        owner_type:'',
        building_type:'',
        area: '',
        // approved_rent: '',
        description: '',
        address: {
          line1: '',
          line2: '',
          line3: '',
          city_id: '',
          district_id: '',
          state_id: '',
          pincode_id: '',
        }

        
      })
    }

    this.getPremisename();
  }

  getPremiseDocInfoForm(pageNumber = 1) {
    this.remsService.getPremiseDocInfoForm(this.premiseIdViewData.id)
      .subscribe(results => {
        this.premiseDocumentInfoData = results.data;
        let datapagination = results.pagination;
        if (this.premiseDocumentInfoData.length == 0) {
          this.isDocInfo = true;
        } else if (this.premiseDocumentInfoData.length > 0) {
          this.next_docInfo = datapagination.has_next;
          this.previous_docInfo = datapagination.has_previous;
          this.presentPageDocInfo = datapagination.index;
          this.isDocumentCountButton = false;
          this.isDocInfo = true;
          this.isDocInfoForm = false;
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

  statusForPremiseName: number;
  getPremisename(pageNumber = 1) {
    let datac=this.de
    this.remsService.getPremisename(this.de )
      .subscribe(results => {
        this.premiseNameData = results.data;
        console.log("nam",this.premiseNameData)

        let datapagination = results.pagination;
        if (this.premiseNameData.length == 0) {
          this.isDocInfo = true;
        } else if (this.premiseNameData.length > 0) {
          this.next_docInfo = datapagination.has_next;
          this.previous_docInfo = datapagination.has_previous;
          this.presentPageDocInfo = datapagination.index;
          this.isDocumentCountButton=false;
          this.isDocInfo = true;
          this.isDocInfoForm=false;
          
        }

        for(let i = 0; i < this.premiseNameData.length; i++){
          let approvedId = this.premiseNameData[i]
          if(approvedId.status.id ===  2 ){
            this.proposedPremiseId = this.premiseNameData[i].id
            console.log("proposedPremiseId",this.proposedPremiseId )
           break;
           }
    
        }

        for(let i = 0; i < this.premiseNameData.length; i++){
          let object = this.premiseNameData[i]
          this.coverageNote = []
          if(object.status.id ===  1 || object.status.id ===  2 || object.status.id ===  0 ){
            this.remsService.getCoverageNote(this.ppid)
            .subscribe(result => {
              this.isShowContent = true;
              console.log("getCoverageNote",result )
              let data = result[0];
              this.coverageNote = data.content
          })
           break;
           }
    
        }
      })
      this.getEstateApproveFile();
    }

  nextpremisename() {
    if (this.next_docInfo === true) {
      this.getPremiseDocInfoForm(this.presentPageDocInfo + 1)
    }
  }

  previouspremisename() {
    if (this.previous_docInfo === true) {
      this.getPremiseDocInfoForm(this.presentPageDocInfo - 1)
    }
  }


  
  premisenameView(id,name){
    this.shareService.premisenameView.next(id)
    this.shareService.premisenameeView.next(name)

    this.router.navigate(['/rems/premisedocinfo'], { skipLocationChange: isSkipLocationChange });
  }





  statusval: any

  movetoapp() {

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 3 }
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Forwarded To Do!...")
          this.getPremiseIDView();
        }
        return true
      })
  }

  SubmitForMoveToEstateCell() {

    let identificationid = this.premiseIdViewData?.id
    this.remsService.moveToEstateCell(this.moveToEstateCellForm.value, identificationid)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Forwarded To Estate Cell!...")
          this.getPremiseIDView();
        
        }
        return true
      })
  }

  getEstateApproveFile(){
    let identificationid = this.premiseIdViewData?.id
    this.remsService.getEstateApproveFile(identificationid)
    .subscribe(result => {
      let data = result["data"];
      this.estateApproveData = data;
      console.log("Get",this.estateApproveData)
    })
  }

  movetoemcSummary(id, fileName) {
    this.remsService.fileDownloadForTableFile(id)
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

  public approvedPremiseid = [];
  button:boolean;
  value:number;
  checkedtrue(data,id) {
      this.button = true;
      this.value = id
      for(let i = 0; i < this.estateApproveData.length; i++){
        let ss = this.estateApproveData[i].id
        let a1 = this.estateApproveData[i]
        let a2 = a1['is_val']
        if((a2 == undefined || a2 != data) && (ss == id)){
          a1['is_val']= data
          console.log("a1",a1)
        }
        
      }

    console.log("id",id)
  }
  close(){
    this.getEstateApproveFile();
  }



  approverSubmitForPremiseIdentification() {
    let obj_data = this.estateApproveData
    console.log("obj_data",obj_data)
    let array: any = [];
    for(let i = 0; i < this.estateApproveData.length; i++){
      if(this.estateApproveData[i].is_val == true){
        array.push(this.estateApproveData[i].id)
        
      }
    }

    this.remsService.approverForPremiseIdentification(this.premiseIdentificationapproverForm.value,
      this.proposedPremiseId, this.imagesforpremiseIdentificationApprover,array)
      .subscribe(result => {
        console.log("approverForPremiseIdentification",result )
        if(result.code === "INVALID_FILETYPE") {
          this.notification.showError("Invalid FileType...")
          return false
        } 
   

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 5 }
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else if(res.code === "INVALID_FILETYPE") {
          this.notification.showError("Invalid FileType...")
        } else {
          this.notification.showSuccess("Forwarded To EMC!...")
          this.getPremiseIDView();
        }
        return true
      })
      })

  }
  

  reject() {

    let identificationid = this.premiseIdViewData?.id
    let json = { "status": 0 }
    this.remsService.premiseIdentificationstatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showError("Rejected!...")
          this.getPremiseIDView();
        }
        return true
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

  identificationHistory() {
    let identificationid = this.premiseIdViewData?.id
    this.remsService.getIdentificationHistory(identificationid)
      .subscribe(result => {
        console.log("history", result)
        this.historyData = result.data;
      })
  }
@Output() onview = new EventEmitter<any>()
  bacttoprev(){
    debugger
    this.router.navigate(['rems/rems/identificationSummary'],{ skipLocationChange: isSkipLocationChange })
    this.shareService.backtosum.next('backtosum')
    this.onview.emit()
    // this.premIdentificationForm = true;
  }
}





export interface PrimaryContact {
  id: number;
  full_name: string;
}

export interface PremisesName {
  id: number;
  name: string;
}
