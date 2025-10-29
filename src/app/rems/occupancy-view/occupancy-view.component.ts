import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl ,FormGroupDirective} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { Rems2Service } from '../rems2.service'
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

export interface occupancyMapping {
  id: number;
  name: string
}

export interface agreementMapping {
  id: number;
  name: string
}
@Component({
  selector: 'app-occupancy-view',
  templateUrl: './occupancy-view.component.html',
  styleUrls: ['./occupancy-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class OccupancyViewComponent implements OnInit {
  @ViewChild('mappingInput') mappingInput: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  chipSelectedOccupancy: occupancyMapping[] = [];
  chipSelectedMappingId = [];
  occupancyMappingValue: occupancyMapping[];
  chipRemovedOccupancyID = [];

  chipSelectedagreement: agreementMapping[] = [];
  chipSelectedMappingIdA = [];
  agreementMappingValue: agreementMapping[];
  chipRemovedagreementID = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public codeControl = new FormControl();
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  PremiseId: number;
  OccupancyID: number;
  occupancyViewId: number;
  premiseViewId: number;
  ID: number;
  abc:number;
  Code: string;
  Usage: string;
  Status:any;
  Ownership: string;
  TerminalCount: number;
  DateOfOpening: Date;
  FloorLocated: string;
  AreaOccupied: string;
  BranchClassification: string;
  BranchWindow: string;
  BranchLocation: string;
  StrongRoom: string;
  SafeRoomPartition: string;
  RiskCategory: string;

  Line1: string;
  Line2: string;
  Line3: string;
  City: string;
  District: string;
  State: string;
  Pincode: string;

 


  TerminalForm: FormGroup;
  terminalList: Array<any>
  idValue: any;
  currentterminalpage: number = 1;
  presentterminalpage: number = 1;
  pageSizeterminal = 10;
  terminalpage: number = 1;
  has_nextterminal = true;
  has_previousterminal = true;
  terminal: any;
  is_terminal = true;
  has_next = true;
  has_previous = true;
  pageSize = 10;
  isTerminalCountButton = true;
  // isTerminalSumbmitButton = true;
  isTerminalSummaryButton = false;
  getTerminalSummaryLength: number;
  OccupancyData: any;
  AgreementData: any;
  TerButton=false;

  premiseID: number;
  isTerminalForm = true;
  IsmodelShow = false;
  method = "";
  // method = "";

  occupancyData: any;
  tableId: number;
  nextOccupancy = true;
  previousOccupancy = true;
  isOccupancy = true;
  isAgreement = true;

  currentOccupancyPage: number = 1;
  presentOccupancyPage: number = 1;
  pagesizeOccupancy = 10;
  pagesizeAgreement = 10;

  occupancyMapForm: FormGroup;

  agreementData: any;
  tableId1: number;
  nextagreement = true;
  previousagreement = true;
  isagreement = true;
  currentagreementPage: number = 1;
  presentagreementPage: number = 1;
  pagesizeagreement = 10;
  agreementMapForm: FormGroup;
  dropDownTag = "terminal_count";
  backNavigationTable: any;
  
  ClosureDetailForm: FormGroup;
  closureData: Array<any>
  currentClosurepage: number = 1;
  presentClosurePage: number = 1;
  pagesizeClosure = 10;
  Closurepage: number = 1;
  nextClosure = true;
  previousClosure = true;
  // terminal: any;
  isClosure = true;
  isClosureSummary = true;
  idValues:any;
  length=0;
  isclo:boolean=true
  abcd:boolean=true
  // TerButton=false;
  TerminalButton=false;
  ClosureButton=false;

  selected:any
  @ViewChild(FormGroupDirective) fromGroupDirective : FormGroupDirective 
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService,private remsService2: Rems2Service, private toastr: ToastrService, private notification: NotificationService, private location: Location) { }

  ngOnInit(): void {
    this.TerminalForm = this.fb.group({
      terminal_id: ['', Validators.required]
    })
    this.ClosureDetailForm = this.fb.group({
      shifting_date: ['', Validators.required],
        shifting_to:['', Validators.required],
        vacated_date:['', Validators.required],
        remarks:['', Validators.required]
    })
    let data: any = this.remsshareService.PremiseView.value;
    console.log("premisedata", data)
    this.PremiseId = data.id
    let odata: any = this.remsshareService.OccupancyView.value;
    console.log("OccupancyId", odata)
    this.OccupancyID = odata.OccupancyView
    this.premiseID = odata.premise_id

    // this.getPremiseView();
    this.getOccupancyView();
    this.terminalsummary();
    this.selected='terminal_count'
    this.dropDownTag='agreement'

    // if (this.TerminalCount>0){
    //  this.isTerminalCountButton=false;


    // }
    this.occupancyMapForm = this.fb.group({
      landlord_id: ['', Validators.required],
    })

    this.agreementMapForm = this.fb.group({
      leaseagreement_id: ['', Validators.required],
    })
  }


usagecode:any
controlofz:any 
usagecode1:any 
controlofz1:any
priofz:any
priofz1:any
occ_Status: any;
  getOccupancyView() {
    this.remsService.getOccupancyView(this.OccupancyID, this.PremiseId)
      .subscribe(result => {
        console.log("occupany", result)
        this.OccupancyData = result
        this.remsshareService.occupancyEditValue.next(this.OccupancyData)

        this.ID = result.id;
        this.Code = result.code;
        this.Usage = result.usage;
        this.usagecode=result.usage_code_id.code
        this.usagecode1=result.usage_code_id.name
        this.controlofz=result.controlling_ofz_id.code;
        this.controlofz1=result.controlling_ofz_id.name;
        this.priofz=result.primary_ofz_id.code;
        this.priofz1=result.primary_ofz_id.name;
        this.Status= result.occupancy_status;
        if( this.Status == "Open"){
          this.occ_Status = 1
        }if( this.Status == "Closed"){
          this.occ_Status = 2
        }
        this.Ownership = result.ownership;
        this.DateOfOpening = result.date_of_opening;
        this.TerminalCount = result.terminal_count;
        this.FloorLocated = result.floor_located;
        this.AreaOccupied = result.area_occupied;
        this.BranchClassification = result.branch_classification;
        this.BranchWindow = result.branch_window;
        this.BranchLocation = result.branch_location;
        this.StrongRoom = result.strong_room;
        this.SafeRoomPartition = result.saferoom_partition;
        this.RiskCategory = result.risk_category;
        this.Line1 = result.address.line1;
        this.Line2 = result.address.line2;
        this.Line3 = result.address.line3;
        this.City = result.address.city_id.name;
        this.District = result.address.district_id.name;
        this.State = result.address.state_id.name;
        this.Pincode = result.address.pincode_id.no;
        let json: any = {
          data: [{
            title: "OccupancyView",
            name: '',
            code: result.code,
            routerUrl: "/premiseView"
          }]
        }
        this.remsshareService.premiseBackNavigation.next(json);
        this.occupancyViewId = result.id;
        this.premiseViewId = result.id;
        this.getTableValue();
        this.getlanlordsummary();
        this.getOccupancyMap();
        this.getagreementMap();
        // if (this.TerminalCount == 0){
        //   this.dropDownTag='occupancy_map'
        //   this.getOccupancyMap()
        //   console.log("teer",this.TerminalCount)
        //   console.log("teer1",this.selected)
 
    
        // }
      })
  }


  
  
  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "occupancy_map") {
        this.dropDownTag = "occupancy_map";
        this.getOccupancyMap();
      }
      if (this.backNavigationTable == "Closure_detail") {
        this.dropDownTag = "Closure_detail";
        this.getClosureDetail();
    }
  //   if (this.backNavigationTable == "agreement") {
  //     this.dropDownTag = "agreement";
  //     this.getOccupancyMap();
  // }
    })
  }
  terminalsummary(pageNumber = 1, pageSize = 10) {
    this.remsService.terminalsummary(pageNumber, pageSize, this.OccupancyID)
      .subscribe((result) => {
        this.getTerminalSummaryLength = result['data']?.length;
        if (this.getTerminalSummaryLength == this.TerminalCount) {
          this.isTerminalCountButton = false
          // this.isTerminalSumbmitButton = false
          this.isTerminalSummaryButton = true
          this.isTerminalForm = false
        }
        console.log("eb", result)
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.terminalList = datas;
        console.log("eb", this.terminalList)
        if (this.terminalList.length === 0) {
          this.is_terminal = false
        }
        if (this.terminalList.length > 0) {
          this.has_nextterminal = datapagination.has_next;
          this.has_previousterminal = datapagination.has_previous;
          this.presentterminalpage = datapagination.index;
          this.is_terminal = true
          // this.isTerminalCountButton=false;
        }
      })
  }

  nextClickTerminal() {
    if (this.has_next === true) {
      this.currentterminalpage = this.presentterminalpage + 1
      this.terminalsummary(this.presentterminalpage + 1)
    }
  }

  previousClickTerminal() {
    if (this.has_previous === true) {
      this.currentterminalpage = this.presentterminalpage - 1
      this.terminalsummary(this.presentterminalpage - 1)
    }
  }
  TerminalEdit(data: any) {

    // this.isTerminalSumbmitButton = true
    this.isTerminalForm = true
    this.remsshareService.TerminalForm.next(data)
    console.log(">>hai", data)
    this.idValue = data.id;
    if (data === '') {
      this.TerminalForm.patchValue({
        terminal_id: ''
      })
    } else {
      this.TerminalForm.patchValue({
        terminal_id: data.terminal_id
      })
    }
  }

  TerminalDelete(data) {
    let value = data.id
    this.remsService.terminalDeleteForm(value, this.OccupancyID)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.terminalsummary();
        // this.isTerminalSumbmitButton = true
        this.isTerminalCountButton = true
        this.isTerminalForm = true
        return true
      })
  }
  terminalCreateEditForm() {
    this.TerminalButton=true;
    if (this.TerminalForm.value.terminal_id === "") {
      this.toastr.error('Add Advance amount Field', 'Empty value inserted', { timeOut: 1500 });
      this.TerminalButton=false;
      return false;
    }

    if (this.idValue == undefined) {
      this.remsService.terminalCreateEditForm(this.TerminalForm.value, '', this.OccupancyID)
        .subscribe(result => {
          console.log("ebad", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.TerminalButton=false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.TerminalButton=false;
            this.terminalsummary();
            this.fromGroupDirective.resetForm();
          }
          // this.idValue = result.id;
        })
    } else {
      this.remsService.terminalCreateEditForm(this.TerminalForm.value, this.idValue, this.OccupancyID)
        .subscribe(result => {
          console.log("ebadv", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.TerButton=false;
          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.idValue = undefined
            this.TerminalButton=false;
            this.terminalsummary();
            this.fromGroupDirective.resetForm();
          }
        })
    }
  }
  only_num(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }
  addterminal(data) {
    if (data == '') {
      this.TerminalForm.patchValue({
        terminal_id: ''
      })
    }

    this.terminalsummary();
  }
  occupancyEdit() {
    this.remsshareService.occupancyEditValue.next(this.OccupancyData);
    this.router.navigate(['/rems/occupancyedit'], { skipLocationChange: isSkipLocationChange });
  }
  TerminalView() {
    this.terminalsummary();
  }

  getlanlordsummary() {
    this.remsService.getlanlordsummary('', '', 1, 10, this.premiseID)
      .subscribe(result => {
        let datas = result["data"];
        this.occupancyMappingValue = datas;

      })
  }

  getagreeementsummary() {
    this.remsService.getAgreement( 1,  this.premiseID)
      .subscribe(result => {
        let datas = result["data"];
        this.agreementMappingValue = datas;

      })
  }
  onCancelClick() {
    this.closebutton.nativeElement.click();
  }
  public removeCode(name: occupancyMapping): void {
    const index = this.chipSelectedOccupancy.indexOf(name);
    this.chipRemovedOccupancyID.push(name.id)
    this.chipSelectedOccupancy.splice(index, 1);
    this.chipSelectedMappingId.splice(index, 1);
    return;
  }

  public nameSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectName(event.option.value.name);
    this.mappingInput.nativeElement.value = '';
  }

  // for agreement

  public removesCode(name: occupancyMapping): void {
    const index = this.chipSelectedagreement.indexOf(name);
    this.chipRemovedagreementID.push(name.id)
    this.chipSelectedagreement.splice(index, 1);
    this.chipSelectedMappingIdA.splice(index, 1);
    return;
  }

  public namesSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectsName(event.option.value.name);
    this.mappingInput.nativeElement.value = '';
  }
  private selectName(name) {
    let foundCode = this.occupancyMappingValue.filter(item => item.name == name);
    if (foundCode.length) {
      this.chipSelectedOccupancy.push(foundCode[0]);
      this.chipSelectedMappingId.push(foundCode[0].id)
    }
  }

  private selectsName(name) {
    let foundCode = this.agreementMappingValue.filter(item => item.name == name);
    if (foundCode.length) {
      this.chipSelectedagreement.push(foundCode[0]);
      this.chipSelectedMappingIdA.push(foundCode[0].id)
    }
  }

  occupancyMapCreate() {
    let json = {
      method: "add"
    }
    this.method = json.method
  }

  agreementMapCreate(){

    let json = {
      method: "add"
    }
    this.method = json.method

  }

  occupancyMapppingCreate() {
    if (this.method == "add") {
      this.remsService.occupancyMapCreate(this.chipSelectedMappingId, this.occupancyViewId, this.method)
        .subscribe(result => {
          this.notification.showSuccess(result.message)
          this.closebutton.nativeElement.click();
          this.getOccupancyMap();
          this.chipSelectedMappingId = [];
          this.chipSelectedOccupancy = [];
        })
    }
  }
  occupancyMappingEdit(id) {
    let json = {
      method: "remove"
    }
    this.method = json.method
    this.tableId = id;
  }
// ag
agreementMapppingCreate()
  {
    if (this.method == "add") {
      this.remsService.agreementMapCreate(this.chipSelectedMappingIdA, this.occupancyViewId, this.method)
        .subscribe(result => {
          this.notification.showSuccess(result.message)
          this.closebutton.nativeElement.click();
          this.getagreementMap();
          this.chipSelectedMappingIdA = [];
          this.chipSelectedagreement = [];
        })
    }
  }
  agreementMappingEdit(id) {
    let json = {
      method: "remove"
    }
    this.method = json.method
    this.tableId1 = id;
  }

  occupancyMapDelete() {
    if (this.method == "remove") {
      this.remsService.occupancyMapCreate(this.tableId, this.occupancyViewId, this.method)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess(result.message)
            this.closebutton.nativeElement.click();
          }
          this.getOccupancyMap();
        })
    }
  }


  agreementMapDelete() {

    if (this.method == "remove") {
      this.remsService.agreementMapCreate(this.tableId1, this.occupancyViewId, this.method)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess(result.message)
            this.closebutton.nativeElement.click();
          }
          this.getagreementMap();
        })
    }

  }


  getOccupancyMap(pageNumber = 1) {
    this.remsService.getOccupancyMap(pageNumber, this.occupancyViewId)
      .subscribe(result => {
        let data = result.data;
        this.occupancyData = data;
        this.occupancyData = data;
        let datapagination = result.pagination;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isOccupancy = false;
        } else if (this.occupancyData.length == 0) {
          this.isOccupancy = false;
        } else if (this.occupancyData.length > 0) {
          this.nextOccupancy = datapagination.has_next;
          this.previousOccupancy = datapagination.has_previous;
          this.presentOccupancyPage = datapagination.index;
          this.isOccupancy = true;
        }
      })
  }

  occupancyNext() {
    if (this.nextOccupancy === true) {
      this.getOccupancyMap(this.presentOccupancyPage + 1)
    }
  }

  occupancyPrevious() {
    if (this.previousOccupancy === true) {
      this.getOccupancyMap(this.presentOccupancyPage - 1)
    }
  }

  addclosuredetail(data){
    if (data == '') {
      this.ClosureDetailForm.patchValue({
        shifting_date: '',
        shifting_to:'',
        vacated_date:'',
        remarks:''
      })
    }

    this.getClosureDetail();
  }
  
  getClosureDetail(pageNumber = 1, pageSize = 10){
    this.remsService2.ClosureDetailsummary(pageNumber, pageSize, this.OccupancyID)
    .subscribe((result) => {
      console.log("eb", result)
      let datas = result['data'];
      let datapagination = result["pagination"];
      this.closureData = datas;
      console.log("re", this.closureData)
      if (this.closureData.length === 0) {
        this.isClosure = false
      }
      if (this.closureData.length >= 0) {
        this.nextClosure = datapagination.has_next;
        this.previousClosure = datapagination.has_previous;
        this.presentClosurePage = datapagination.index;
        this.isClosure = true
      }
      if (this.closureData.length == 1) {
        this.Status == 2
        this.isclo=false
      this.abcd=false}
       
    })
  }
  ClosureEdit(data){
    this.isClosureSummary = true
    this.remsshareService.ClosureDetailForm.next(data)
    console.log(">>hai", data)
    this.idValues = data.id;
    if (data === '') {
      this.ClosureDetailForm.patchValue({
        shifting_date: '',
        shifting_to:'',
        vacated_date:'',
        remarks:''
      })
    } else {
      this.ClosureDetailForm.patchValue({
        shifting_date: data.shifting_date,
        shifting_to:data.shifting_to,
        vacated_date:data.vacated_date,
        remarks:data.remarks
      })
    }
  }
  ClosureDetailCreateEditForm(){
    this.ClosureButton=true;
    if (this.ClosureDetailForm.value.shifting_date === "") {
      this.toastr.error('Add Shift date Field', 'Empty value inserted', { timeOut: 1500 });
      this.ClosureButton=false;
      return false;
    }
    if (this.ClosureDetailForm.value.shifting_to === "") {
      this.toastr.error('Add Shift to Field', 'Empty value inserted', { timeOut: 1500 });
      this.ClosureButton=false;
      return false;
    }
    if (this.ClosureDetailForm.value.vacated_date === "") {
      this.toastr.error('Add Vacated date Field', 'Empty value inserted', { timeOut: 1500 });
      this.ClosureButton=false;
      return false;
    }
    if (this.ClosureDetailForm.value.remarks === "") {
      this.toastr.error('Add Remarks Field', 'Empty value inserted', { timeOut: 1500 });
      this.ClosureButton=false;
      return false;
    }

    const currentDate = this.ClosureDetailForm.value
    currentDate.shifting_date = this.datePipe.transform(currentDate.shifting_date, 'yyyy-MM-dd');
    // currentDate.shifting_to = this.datePipe.transform(currentDate.shifting_to, 'yyyy-MM-dd');
    currentDate.vacated_date = this.datePipe.transform(currentDate.vacated_date, 'yyyy-MM-dd');

    if (this.idValues == undefined) {
      this.remsService2.ClosureDetailCreateEdiForm(this.ClosureDetailForm.value, this.OccupancyID)
        .subscribe(result => {
          console.log("ebad", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.ClosureButton=false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.getClosureDetail();
            this.getOccupancyView();
            // this.ClosureDetailForm.reset();
            this.fromGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
            this.isclo=false;
          }
          // this.idValue = result.id;
        })
    } else {
      this.remsService2.ClosureDetailCreateEditForm(this.ClosureDetailForm.value, this.idValues, this.OccupancyID)
        .subscribe(result => {
          console.log("ebadv", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.ClosureButton=false;
          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.idValues = undefined
            this.getClosureDetail();
            this.fromGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
        })
    }
  }
  
  ClosureDelete(data){
    let value = data.id
    this.remsService2.ClosureDeleteForm(value, this.OccupancyID)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getClosureDetail();
        this.isClosureSummary = true
        return true

      })
  }
  ClosurePrevious(){
    if (this.has_previous === true) {
      this.currentClosurepage = this.presentClosurePage - 1
      this.getClosureDetail(this.presentClosurePage - 1)
    }
  }
  ClosureNext(){
    if (this.has_next === true) {
      this.currentClosurepage = this.presentClosurePage + 1
      this.getClosureDetail(this.presentClosurePage + 1)
    }
  }


  getagreementMap(pageNumber = 1) {
    this.remsService.getagreementMap(pageNumber, this.occupancyViewId)
      .subscribe(result => {
        let data = result.data;
        this.agreementData = data;
        this.agreementData = data;
        let datapagination = result.pagination;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isAgreement = false;
        } else if (this.agreementData.length == 0) {
          this.isAgreement = false;
        } else if (this.agreementData.length > 0) {
          this.nextagreement = datapagination.has_next;
          this.previousagreement = datapagination.has_previous;
          this.presentagreementPage = datapagination.index;
          this.isAgreement = true;
        }
      })
  }

  agreementNext() {
    if (this.nextagreement === true) {
      this.getagreementMap(this.presentagreementPage + 1)
    }
  }

  agreementPrevious() {
    if (this.previousagreement === true) {
      this.getagreementMap(this.presentagreementPage - 1)
    }
  }

  backToRemsSummary() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details" }, skipLocationChange: isSkipLocationChange });
  }

}