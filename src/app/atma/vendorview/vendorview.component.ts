import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  TemplateRef,
} from "@angular/core";
import { ShareService } from "../share.service";
import { AtmaService } from "../atma.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../notification.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { isBoolean } from "util";
import { confirmationservice } from "../confirmnotification/confirmationservice";
import { DocumentSummaryComponent } from "../document-summary/document-summary.component";
import { DataService } from "../../service/data.service";
import { SharedService } from "../../service/shared.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

import { ToastrService } from "ngx-toastr";
// import { Console } from "console";
import { environment } from "src/environments/environment";
import * as $ from "jquery";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: "app-vendorview",
  templateUrl: "./vendorview.component.html",
  styleUrls: ["./vendorview.component.scss"],
})
export class VendorviewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  popupform: FormGroup;
  url: any = environment.apiURL;
  @ViewChild("closebutton") closebutton;
  @ViewChild("closebtn") closebtn;
  @ViewChild("closebttn") closebttn;
  @ViewChild("closespopup") closespopup;
  @ViewChild("myOffcanvas") myOffcanvas!: any;

  statusTab: any;
  Summaryvendorobj: any;
  panelOpenState = false;
  rename: any
  // "popup": true, 'wholedata': true, "route": true, validate: true, button:true

  myControl = new FormControl("BRANCH DETAILS");

  tabdata = [
    {
      tab_name: "BRANCH DETAILS",
      tab_id: "6",
    },
    {
      tab_name: "CLIENT",
      tab_id: "7",
    },
    {
      tab_name: "CONTRACTOR",
      tab_id: "8",
    },
    {
      tab_name: "PRODUCT",
      tab_id: "9",
    },
    {
      tab_name: "DOCUMENT",
      tab_id: "10",
    },
    {
      tab_name: "ACTIVITY",
      tab_id: "13",
    },
    {
      tab_name: "ACTIVITYDETAIL",
      tab_id: "14",
    },
    {
      tab_name: "CATELOG",
      tab_id: "15",
    },
    {
      tab_name: "PAYMENT",
      tab_id: "12",
    },
    {
      tab_name: "SUPPLIERTAX",
      tab_id: "11",
    },
  ];
  options: string[] = [
    "BRANCH DETAILS",
    "CLIENT",
    "CONTRACTOR",
    "TAX DETAILS",
    "PRODUCT",
    "DOCUMENT",
    "TRANSACTION",
  ];
  filteredOptions: Observable<string[]>;
  client_RMView = false;
  contractor_RMView = false;
  document_RMView = false;
  product_RMView = false;
  client_flag = false;
  tax_modify = false;
  contractor_flag = false;
  branch_flag = false;
  payment_flag = false;
  branchSummary = true;
  status: number;
  Fileidd: number;
  vendorId: number;
  modify_changestatus: any;
  rmId: number;
  dialogConfig: any;
  createby: number;
  userId: number;
  qId: number;
  activeContract: any;
  actualSpend: number;
  aproxSpend: number;
  emailDays: any;
  msmeRegno: any;
  code: string;
  companyRegNo: string;
  contractFrom: string;
  contractTo: string;
  gstNo: string;
  mainStatusName: string;
  name: string;
  contractReason: string;
  panNo: string;
  remarks: string;
  renewalDate: string;
  requestStatusName: string;
  vendorStatusName: string;
  website: string;
  SupplierTax: string;
  composite: string;
  classification: string;
  group: string;
  customerCategory: string;
  organizationType: string;
  type: string;
  cityName: string;
  districtName: string;
  lineName1: string;
  lineName2: string;
  lineName3: string;
  pinCode: number;
  stateName: string;
  contactName: string;
  contactTypeName: string;
  contactDesignation: string;
  contactLandline1: string;
  contactLandline2: string;
  contactMobile1: string;
  contactMobile2: string;
  contactEmail: string;
  vendorViewDetailList: any;
  profile_Temp_Employee: string;
  profile_Per_Employee: string;
  profile_Tot_Employee: string;
  profileAward: string;
  profileBranch: number;
  profileRemarks: string;
  profileFactory: number;
  profileYear: number;
  isBranch: boolean;
  isClient: boolean;
  isContractor: boolean;
  isProduct: boolean;
  isDocument: boolean;
  branchList: any;
  branchPagination: any;
  clientList: any;
  productList: any;
  contactorList: any;
  documentList: any;
  isBranchForm: boolean;
  isClientForm: boolean;
  isContractorForm: boolean;
  isProductForm: boolean;
  isDocumentForm: boolean;
  isBranchEditForm: boolean;
  isClientEditForm: boolean;
  isContactorEditForm: boolean;
  isProductEditForm: boolean;
  isDocumentEditForm: boolean;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;

  contractorpage = 1;
  contractor_next = true;
  renewal_flag = false;
  contractor_previous = true;

  clientpage = 1;
  client_next = true;
  client_previous = true;
  branchpage = 1;
  branch_next = true;
  branch_previous = true;
  productpage = 1;
  product_next = true;
  product_previous = true;
  documentpage: number = 1;
  branchtax_id: any;
  vendorData: any;
  rmName: string;
  getbranchLength: number;
  isBranchButton = true;
  rejectFrom: FormGroup;
  isRejectBtn = false;
  isDraft = false;
  isPendingRM = false;
  isPendingChecker = false;
  isPendingHeader = false;
  isApproved = false;
  ispending = false;
  ismodification = false;
  rm_viewscreen = false;
  isdeactivation = false;
  isactivation = false;
  istermination = false;
  rejectedList: any;
  isContractorPagination: boolean;
  isDocumentPagination: boolean;
  isBranchPagination: boolean;
  isClientPagination: boolean;
  isProductPagination: boolean;
  vendorStatusId: number;
  vendorStatusEmpty = "";
  // ----changeview start----
  changeviewlist: Array<any>;
  newName: string;
  newPanno: string;
  newRemark: string;
  newAddressCity: string;
  oldName: string;
  oldPanno: string;
  oldRemark: string;
  oldAddressCity: string;
  action1Name: string;
  action1pan: string;
  action1Remarks: string;
  action1Line: string;
  isBranchcv: boolean;
  isClientcv: boolean;
  isContractorcv: boolean;
  isProductcv: boolean;
  gstNobr: string;
  gstNost: string;
  limitdaysbr: number;
  limitdaysst: number;
  Creditbr: number;
  Creditst: number;
  contactname: string;
  contactemail: string;
  contactdob: Date;
  contactweding: Date;
  designname: string;
  typename: string;
  contactline1: number;
  contactline2: number;
  contactmob1: number;
  contactmob2: number;
  oldline2: number;
  oldline3: number;
  oldcityname: string;
  oldDistrictname: string;
  oldpincodeno: number;
  staten: string;
  newcontactname: string;
  newcontactemail: string;
  newcontactdob: Date;
  newcontactweding: Date;
  newdesignname: string;
  newtypename: string;
  newcontactline1: number;
  newcontactline2: number;
  newcontactmob1: number;
  newcontactmob2: number;
  newline2: number;
  newline3: number;
  newcityname: string;
  newDistrictname: string;
  newpincodeno: number;
  newstaten: string;
  newgstNo: number;
  newlimitdays: number;
  newCredit: number;
  oldservice: string;
  newservice: string;
  // productcreate
  age: number;
  designation: string;
  dob: Date;
  email: string;
  lanline: number;
  landline2: number;
  mob: number;
  mob2: number;
  c1name: string;
  c1type: string;
  wd: Date;
  c2age: number;
  c2designation: string;
  c2dob: Date;
  c2email: string;
  c2lanline: number;
  c2landline2: number;
  c2mob: number;
  c2mob2: number;
  c2name: string;
  c2type: string;
  c2wd: Date;
  c3age: number;
  c3designation: string;
  c3dob: Date;
  c3email: string;
  c3lanline: number;
  c3landline2: number;
  c3mob: number;
  c3mob2: number;
  c3name: string;
  c3type: string;
  c3wd: Date;
  c4age: number;
  c4designation: string;
  c4dob: Date;
  c4email: string;
  c4lanline: number;
  c4landline2: number;
  c4mob: number;
  c4mob2: number;
  c4name: string;
  c4type: string;
  c4wd: Date;
  Productname: String;
  producttype: string;
  productlist: any;
  // productupdate
  oldage: number;
  olddesignation: string;
  olddob: Date;
  oldemail: string;
  oldlanline: number;
  oldlandline2: number;
  oldmob: number;
  oldmob2: number;
  oldc1name: string;
  oldc1type: string;
  oldwd: Date;
  oldc2age: number;
  oldc2designation: string;
  oldc2dob: Date;
  oldc2email: string;
  oldc2lanline: number;
  oldc2landline2: number;
  oldc2mob: number;
  oldc2mob2: number;
  oldc2name: string;
  oldc2type: string;
  oldc2wd: Date;
  oldc3age: number;
  oldc3designation: string;
  oldc3dob: Date;
  oldc3email: string;
  oldc3lanline: number;
  oldc3landline2: number;
  oldc3mob: number;
  oldc3mob2: number;
  oldc3name: string;
  oldc3type: string;
  oldc3wd: Date;
  oldc4age: number;
  oldc4designation: string;
  oldc4dob: Date;
  oldc4email: string;
  oldc4lanline: number;
  oldc4landline2: number;
  viewarray = [];
  clientcreateview = false;
  oldc4mob: number;
  oldc4mob2: number;
  oldc4name: string;
  oldc4type: string;
  oldc4wd: Date;
  oldProductname: String;
  oldproducttype: string;
  newage: number;
  newdesignation: string;
  newdob: Date;
  newemail: string;
  newlanline: number;
  newlandline2: number;
  newmob: number;
  newmob2: number;
  newc1name: string;
  newc1type: string;
  newwd: Date;
  newc2age: number;
  newc2designation: string;
  newc2dob: Date;
  newc2email: string;
  newc2lanline: number;
  newc2landline2: number;
  newc2mob: number;
  newc2mob2: number;
  newc2name: string;
  newc2type: string;
  newc2wd: Date;
  newc3age: number;
  newc3designation: string;
  newc3dob: Date;
  newc3email: string;
  newc3lanline: number;
  newc3landline2: number;
  newc3mob: number;
  newc3mob2: number;
  newc3name: string;
  newc3type: string;
  newc3wd: Date;
  newc4age: number;
  newc4designation: string;
  newc4dob: Date;
  newc4email: string;
  newc4lanline: number;
  newc4landline2: number;
  newc4mob: number;
  newc4mob2: number;
  newc4name: string;
  newc4type: string;
  newc4wd: Date;
  newProductname: String;
  newproducttype: string;

  // clientupdate
  oldclientname: string;
  oldclientline1: string;
  oldclientline2: string;
  oldclientline3: string;
  oldclientcity: string;
  oldclientdistrict: string;
  oldclientstate: string;
  oldclientpincode: number;
  newclientname: string;
  newclientline1: string;
  newclientline2: string;
  newclientline3: string;
  newclientcity: string;
  newclientdistrict: string;
  newclientstate: string;
  newclientpincode: number;

  // contractupdate
  oldcontractname: string;
  oldcontractservice: string;
  oldcontractremark: string;
  newcontractname: string;
  newcontractservice: string;
  newcontractremark: string;
  // contractcreate
  createcontractname: string;
  createcontractservice: string;
  createcontractremark: string;

  // suppliertax
  oldsupplierattachment: string;
  oldsupplerbranchname: string;
  oldsupplierbranchcredit: string;
  oldsupplierbranchgst: string;
  oldsupplierlimit: number;
  oldsupplierpan: string;
  oldsupplierexfrom: Date;
  oldsupplierexrate: BigInteger;
  oldsupplierexto: Date;
  oldsupplierpanno: string;
  oldsuppliertax: number;
  oldsuppliertaxrate: number;
  oldsuppliersubtax: number;
  oldsupplierexcemis: string;
  oldsupppliermsme: string;
  newsupplierattachment: string;
  newsupplerbranchname: string;
  newsupplierbranchcredit: string;
  newsupplierbranchgst: string;
  newsupplierlimit: number;
  newsupplierpan: string;
  newsupplierexfrom: Date;
  newsupplierexrate: BigInteger;
  newsupplierexto: Date;
  newsupplierpanno: string;
  newsuppliertax: number;
  newsuppliertaxrate: number;
  newsuppliersubtax: number;
  newsupplierexcemis: string;
  newsupppliermsme: string;
  isActivity: boolean;
  isActivityDetail: boolean;
  isCatalog: boolean;
  isTaxDetail: boolean;
  isPaymentDetail: boolean;
  //  payment
  oldsupplieracc: string;
  oldpaymentbranchname: string;
  oldsupplierpaymode: string;
  oldsupplierbank: string;
  oldsupplierbankbranch: string;
  oldsupplierifsc: string;
  oldsupplieracctype: string;
  oldsupplierbenifier: string;
  newsupplieracc: string;
  newpaymentbranchname: string;
  newsupplierpaymode: string;
  newsupplierbank: string;
  newsupplierbankbranch: string;
  newsupplierifsc: string;
  newsupplieracctype: string;
  newsupplierbenifier: string;

  // catalogupdate
  oldcatactivitydtlname: string;
  oldcatalodproductname: string;
  oldcatalogcategory: string;
  oldcatalodsubcat: string;
  oldcatalogname: string;
  oldcatalogremark: string;
  oldcataloguom: string;
  oldcatfromdate: Date;
  oldcattodate: Date;
  oldcatspecification: string;
  oldcatsize: number;
  oldcatunitprice: number;
  oldcatpackingprice: number;
  oldcatdeliverdate: Date;
  oldcatcapacity: number;
  oldcatdirect: string;
  newcatactivitydtlname: string;
  newcatalodproductname: string;
  newcatalogcategory: string;
  newcatalodsubcat: string;
  newcatalogname: string;
  newcatalogremark: string;
  newcataloguom: string;
  newcatfromdate: Date;
  newcattodate: Date;
  newcatspecification: string;
  newcatsize: number;
  newcatunitprice: number;
  newcatpackingprice: number;
  newcatdeliverdate: Date;
  newcatcapacity: number;
  newcatdirect: string;
  getmodList: any;
  // branchcreate--
  branchname: string;
  brpanno: string;
  brgstno: string;
  brlimitday: Date;
  brcredit: string;
  brcontactname: string;
  brcontactmail: string;
  brcontactdob: Date;
  brcontactweding: Date;
  brdesignation: string;
  brtypename: string;
  brcontactline1: string;
  brcontactline2: string;
  brcontactmob: number;
  brcontactmob2: number;
  brcity: string;
  brdistrict: string;
  brstate: string;
  brpincode: number;
  brline1: string;
  brline2: string;
  brline3: string;
  // branchdelete--
  brdltanchname: string;
  brdltpanno: string;
  brdltgstno: string;
  brdltlimitday: Date;
  brdltcredit: string;
  brdltcontactname: string;
  brdltcontactmail: string;
  brdltcontactdob: Date;
  brdltcontactweding: Date;
  brdltdesignation: string;
  brdlttypename: string;
  brdltcontactline1: string;
  brdltcontactline2: string;
  brdltcontactmob: number;
  brdltcontactmob2: number;
  brdltcity: string;
  brdltdistrict: string;
  brdltstate: string;
  brdltpincode: number;
  brdltline1: string;
  brdltline2: string;
  brdltline3: string;
  // suptax--
  remove_actions = false;
  contractid: any;
  supbranchname: string;
  supbrcredit: string;
  supbrgst: string;
  supbrpanno: string;
  supbrlimit: string;
  supexcemfrom: Date;
  supexcemto: Date;
  supexcemrate: number;
  suppanno: string;
  suptax: string;
  suptaxrate: number;
  supsubtax: string;
  supexcempis: string;
  supmsme: string;
  // --suptaxdelete--
  supdltbranchname: string;
  supdltbrcredit: string;
  supdltbrgst: string;
  supdltbrpanno: string;
  supdltbrlimit: string;
  supdltexcemfrom: Date;
  supdltexcemto: Date;
  supdltexcemrate: number;
  supdltpanno: string;
  supdlttax: string;
  supdlttaxrate: number;
  supdltsubtax: string;
  supdltexcempis: string;
  supdltmsme: string;
  // catalogcreate--
  catactivitydtl: string;
  catproduct: string;
  catcategory: string;
  catsubcat: string;
  catname: string;
  catremark: string;
  catuom: string;
  catfromdata: Date;
  cattodate: Date;
  catspecification: string;
  catsize: number;
  catunitprice: number;
  catpackingprice: number;
  catdeliverydate: Date;
  catcapacity: number;
  catdirect: string;
  // catalogdelete--
  catdtlactivitydtl: string;
  catdtlproduct: string;
  catdtlcatdtlegory: string;
  catdtlsubcatdtl: string;
  catdtlname: string;
  catdtlremark: string;
  catdtluom: string;
  catdtlfromdata: Date;
  catdtltodate: Date;
  catdtlspecificatdtlion: string;
  catdtlsize: number;
  catdtlunitprice: number;
  catdtlpackingprice: number;
  catdtldeliverydate: Date;
  catdtlcapacity: number;
  catdtldirect: string;
  // productdelete--
  dtlage: number;
  dtldesignation: string;
  dtldob: Date;
  dtlemail: string;
  dtllanline: number;
  dtllandline2: number;
  dtlmob: number;
  dtlmob2: number;
  c1dtlname: string;
  c1dtltype: string;
  dtlwd: Date;
  c2dtlage: number;
  c2dtldesignation: string;
  c2dtldob: Date;
  c2dtlemail: string;
  c2dtllanline: number;
  c2dtllandline2: number;
  c2dtlmob: number;
  c2dtlmob2: number;
  c2dtlname: string;
  c2dtltype: string;
  c2dtlwd: Date;
  c3dtlage: number;
  c3dtldesignation: string;
  c3dtldob: Date;
  c3dtlemail: string;
  c3dtllanline: number;
  c3dtllandline2: number;
  c3dtlmob: number;
  c3dtlmob2: number;
  c3dtlname: string;
  c3dtltype: string;
  c3dtlwd: Date;
  c4dtlage: number;
  c4dtldesignation: string;
  c4dtldob: Date;
  c4dtlemail: string;
  c4dtllanline: number;
  c4dtllandline2: number;
  c4dtlmob: number;
  c4dtlmob2: number;
  c4dtlname: string;
  c4dtltype: string;
  c4dtlwd: Date;
  dtlProductname: String;
  dtlproducttype: string;
  // activity--
  acttype: string;
  actname: string;
  actstartdate: Date;
  actenddate: Date;
  actRM: string;
  actconperson: string;
  actstatus: string;
  actbidding: string;
  actspend: number;
  actfidelity: string;
  actconemail: string;
  actconline1: number;
  actconline2: number;
  actconmob: number;
  actconmob2: number;
  // paymentcreate
  crtsupplieracc: number;
  crtpaymentbranchname: string;
  crtsupplierpaymode: string;
  crtsupplierbank: string;
  crtsupplierbankbranch: string;
  crtsupplierifsc: string;
  crtsupplieracctype: string;
  crtsupplierbenifier: string;
  // paymentdelete--
  delsupplieracc: number;
  delpaymentbranchname: string;
  delsupplierpaymode: string;
  delsupplierbank: string;
  delsupplierbankbranch: string;
  delsupplierifsc: string;
  delsupplieracctype: string;
  delsupplierbenifier: string;
  // client--
  crtclientname: string;
  crtclientline1: string;
  crtclientline2: string;
  crtclientline3: string;
  crtclientcity: string;
  crtclientdistrict: string;
  crtclientstate: string;
  crtclientpincode: string;
  // clientdelete--
  delclientname: string;
  delclientline1: string;
  delclientline2: string;
  delclientline3: string;
  delclientcity: string;
  delclientdistrict: string;
  delclientstate: string;
  delclientpincode: string;
  // actvityupdate--
  oldacttype: string;
  oldactname: string;
  oldactstartdate: Date;
  oldactenddate: Date;
  oldactRM: string;
  oldactconperson: string;
  oldactstatus: string;
  oldactbidding: string;
  oldactspend: number;
  oldactfidelity: string;
  oldactconemail: string;
  oldactconline1: number;
  oldactconline2: number;
  oldactconmob: number;
  oldactconmob2: number;
  newacttype: string;
  newactname: string;
  newactstartdate: Date;
  newactenddate: Date;
  newactRM: string;
  newactconperson: string;
  newactstatus: string;
  newactbidding: string;
  newactspend: number;
  newactfidelity: string;
  newactconemail: string;
  newactconline1: number;
  newactconline2: number;
  newactconmob: number;
  newactconmob2: number;
  // activitydelete
  delacttype: string;
  delactname: string;
  delactstartdate: Date;
  delactenddate: Date;
  delactRM: string;
  delactconperson: string;
  delactstatus: string;
  delactbidding: string;
  delactspend: number;
  delactfidelity: string;
  delactconemail: string;
  delactconline1: number;
  delactconline2: number;
  delactconmob: number;
  delactconmob2: number;

  // activitydtl
  oldactdtlactivityname: string;
  oldactdtlname: string;
  oldactdtlraisor: string;
  oldactdtlapprover: string;
  oldactdtlremarks: string;
  newactdtlactivityname: string;
  newactdtlname: string;
  newactdtlraisor: string;
  newactdtlapprover: string;
  newactdtlremarks: string;

  actdtlactivityname: string;
  actdtlname: string;
  actdtlraisor: string;
  actdtlapprover: string;
  actdtlremarks: string;
  delactdtlactivityname: string;
  delactdtlname: string;
  delactdtlraisor: string;
  delactdtlapprover: string;
  delactdtlremarks: string;

  delcontractname: string;
  delcontractservice: string;
  delcontractremark: string;
  statusid: string;
  modificationdata = [];
  vendor_flag: boolean = false;
  contract_data = [];
  document_data = [];
  payment_data = [];
  tax_data = [];
  catalouge_data = [];
  activity_detail = [];
  activity_data = [];
  document_modify = false;
  client_data = [];
  product_data = [];
  branch_data = [];
  contract_modify = false;
  client_modify = false;
  product_modify = false;
  branch_modify = false;
  getcontractlist: Array<any>;
  branchnames = [];
  branchstatus: any;
  Branchpopup = false;
  isTransaction: boolean;
  transactionpage: number = 1;
  transactionList: any;
  ismodificationView = false;
  modifyrefid: any;
  updateactiveContract: any;
  updateactualSpend: string;
  updateaproxSpend: string;
  updateEmailDays: any;
  updateMsmeRegno: any;
  updatecode: string;
  updatecompanyRegNo: string;
  updatecontractFrom: string;
  updatecontractTo: string;
  updategstNo: string;
  updatemainStatusName: string;
  updatename: string;
  updatecontractReason: string;
  updatepanNo: string;
  updateremarks: string;
  updaterenewalDate: string;
  updaterequestStatusName: string;
  updatevendorStatusName: string;
  updatecreateby: string;
  updateuserId: string;
  updateqId: string;
  updatestatusid: string;
  updatewebsite: string;
  updatecomposite: string;
  updateclassification: string;
  updategroup: string;
  updatecustomerCategory: string;
  updateorganizationType: string;
  updatetype: string;
  updatelineName1: string;
  updatelineName2: string;
  updatelineName3: string;
  updatecityName: string;
  updatedistrictName: string;
  updatestateName: string;
  updatepinCode: string;
  updatecontactName: string;
  updatecontactTypeName: string;
  updatecontactDesignation: string;
  updatecontactLandline1: string;
  updatecontactLandline2: string;
  updatecontactMobile1: string;
  updatecontactMobile2: string;
  updatecontactEmail: string;
  updateprofile_Per_Employee: string;
  updateprofile_Temp_Employee: string;
  updateprofile_Tot_Employee: string;
  updateprofileAward: string;
  updateprofileBranch: number;
  updateprofileFactory: string;
  updateprofileRemarks: string;
  updateprofileYear: string;
  updatermName: string;
  updatevendorStatusId: string;
  reqstatus: string;
  button_true = false;
  modifystatus: any;
  vendorid: any;
  vendorIdForEdit: any;
  branch_button = false;
  aadharno: string;
  updateaadharno: string;
  dateofbirth: string;
  updatedateofbirth: string;
  breadcrumbarray = [];
  vid: any;
  vendoremail: any;
  docbtn: boolean;
  login_id: any;
  products: [];
  has_next_tax = false;
  has_previous_tax = false;
  Branchtaxadd = false;
  istax: boolean;
  taxedit: boolean;
  branchtax_RMView: boolean;
  branchtax: boolean;
  deactivatebutton: boolean = true; //7026
  activatebutton: boolean = true; //7026

  activeordeactivetype: number;
  isECForAP: any;
  submittorm: boolean;
  is_blocked: any;
  id: any;
  payload: any;
  checked: boolean = false;
  actionid: any;
  remarksfield: boolean;
  showAcceptButton: boolean;
  @ViewChild("closebuttonportaledit") closebuttonportaledit;
  @ViewChild("closebuttonportalform") closebuttonportalform;
  @ViewChild("closebuttonportalview") closebuttonportalview;
  @ViewChild("groupformclose") groupformclose;
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closesthpopup") closesthpopup;
  errormsg: any;
  patchdetails: {};
  errormsgList: any;
  missingdetailsyesno: boolean = false;
  isquit: boolean = false;
  riskform: FormGroup;
  riskcategory: any;
  selectedriskopt: any[] = [];
  riskoptionList: any;
  ishighrisk: boolean = false;
  requestStatus: any;
  vendor_status: any;
  oldvendorid: any;
  oldvendoriddata: any;
  vendoridd: any;
  isVendorSummaryPagination: boolean;
  risktransactionList: any;
  numb: number;
  headerName: string;
  msmeType: any;
  updateMsmeType: any;
  constructor(
    private shareService: ShareService,
    private atmaService: AtmaService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private confirmationDialogService: confirmationservice,
    private dataService: DataService,
    private http: HttpClient,
    public sharedService: SharedService,
    private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.riskform = this.fb.group({
      risk_remarks: [""],
    });
    const sessionData = localStorage.getItem("sessionData");
    let logindata = JSON.parse(sessionData);
    this.login_id = logindata.employee_id;
    this.isBranch = true;
    let data: any = this.shareService.vendorView.value;
    this.requestStatus = data.requeststatus;
    this.vendor_status = data.vendor_status;
    this.vendoridd = data.id;
    // console.log('ash',data.requeststatus_name)
    this.oldvendoriddata = this.shareService.vendorsingleget.value;
    this.oldvendorid = this.oldvendoriddata.id;

    this.vendorId = data.id;
    this.rmId = data.rm_id.id;

    this.route.queryParams.subscribe((params) => {
      // console.log(params);
      this.vid = params.vid;
      this.vendoremail = params.from;
    });
    this.getmodification_vender();
    // this.clientmodifysummary()

    if (this.vendoremail === "email") {
      // this.getMenuUrl()
      this.vendorId = this.vid;
    }

    this.popupform = this.fb.group({
      actividet: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      catalog: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      suppactivity: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      suppbrnch: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      supppayment: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      suppprod: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      supptax: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      client: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      suppdoc: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],
      suppcont: [
        {
          value: false,
          disabled: isBoolean,
        },
      ],

      remarks: ["", Validators.required], //Bug id:8720
    });
    this.getVendorViewDetails();
    this.rejectFrom = this.fb.group({
      comments: ["", Validators.required],
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    // this.getBranch();
    this.branchsummary();

    this.rejectPopup();

    this.breadcrumbarray.push(data.code);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // private getMenuUrl() {

  //   this.shareService.menuUrlData = [];
  //   this.dataService.getMenuUrl()
  //     .subscribe((results: any[]) => {
  //       let data = results['data'];
  //       if (data) {
  //         this.shareService.titleUrl = data[0].url;
  //         this.shareService.menuUrlData = data;
  //       }
  //     })
  // }
  Taxedit(e) {
    this.shareService.branchTaxtEdit.next(e);
    this.taxedit = true;
    this.istax = false;
    this.popupopen();
    this.rename = "Tax Edit Form"

    // this.router.navigate(['/branchTaxEdit'], { skipLocationChange: true })
  }
  downattach(datas) {
    for (var i = 0; i < datas.attachment.length; i++) {
      this.Fileidd = datas.attachment[i].id;

      this.atmaService.downloadfile(this.Fileidd);
    }
  }

  taxadd() {
    this.Branchtaxadd = true;
    this.isActivity = false;

    this.istax = false;
    this.shareService.branchTaxtEdit.next(" ");
    this.popupopen()
    this.rename = "Tax Creation form"
  }
  branchtaxaddsbt() {
    this.taxedit = false;
    this.Branchtaxadd = false;

    this.branchtax = false;

    this.istax = true;

    // this.getpagenation();
    this.taxsummary();
    this.closedpopup();
  }
  branchtaxaddcancl() {
    this.taxedit = false;
    this.Branchtaxadd = false;

    this.branchtax = false;

    this.istax = true;
    this.branchtax_RMView = false;
    // this.getpagenation();
    this.taxsummary();
    this.closedpopup();
  }
  onCancelClick() {
    this.onCancel.emit();
  }

  taxeditsubt() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;

    this.istax = true;
    // this.getpagenation();
    this.taxsummary();
    this.closedpopup()
  }
  taxeditcancel() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;

    this.istax = true;
    // this.getpagenation();
    this.taxsummary();
    this.closedpopup()
  }

  RMView_branchtax(data) {
    let new_datas = {
      new_data: data,
    };
    console.log("tax", new_datas);
    this.istax = true;
    this.Branchtaxadd = false;
    this.taxedit = false;
    this.branchtax_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Tax Changes View Form"
  }

  // delete_tax
  delete_tax(id) {
    if (confirm("Delete Tax details?")) {
      this.atmaService
        .Brachtaxdelete(id.id, this.vendorData.id)
        .subscribe((result) => {
          if (result.message == "Successfully Deleted") {
            this.notification.showSuccess("Deleted");
            // this.ngOnInit();
            // this.getpagenation();
            this.taxsummary();
          } else {
            this.notification.showInfo("Try  Again....");
            this.ngOnInit();
          }
          // this.ngOnInit();
          return true;
        });
    } else {
      return false;
    }
  }
  // ---------------------------------------------------
  getdocumentsummary(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getdocumentsummaryy(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        console.log("document", result);
        let datass = result["data"];
        let datapagination = result["pagination"];
        this.documentList = datass;
        console.log("document", this.documentList);
        if (this.documentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.documentpage = datapagination.index;
          this.isDocumentPagination = true;
        }
        if (this.documentList <= 0) {
          this.isDocumentPagination = false;
        }
      });

    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      // this.branch_data = [];
      this.getmodification_vender();
      this.document_modify = true;
    }
  }

  nextClick() {
    if (this.has_next === true) {
      this.getdocumentsummary(this.documentpage + 1, 10);
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getdocumentsummary(this.documentpage - 1, 10);
    }
  }

  deletedocument(data) {
    let value = data.id;
    // this.docbtn = true;
    console.log("deletedocument", value);
    if (confirm("Delete Document details?")) {
      this.atmaService
        .deletedocumentform(value, this.vendorId)
        .subscribe((result) => {
          if (result["status"] != undefined || result["status"] == "success") {
            this.notification.showSuccess("Successfully deleted");
            // this.getdocumentsummary();
            this.documentsummary();
            return true;
          } else {
            this.notification.showError(result["code"]);
            // this.docbtn = false;
          }
        });
    } else {
      return false;
    }
  }

  deletedocumentmodify(data) {
    let value = data.new_data.id;
    // this.docbtn = true;
    console.log("deletedocument", value);
    if (confirm("Delete Document details?")) {
      this.atmaService
        .deletedocumentform(value, this.vendorId)
        .subscribe((result) => {
          if (result["status"] != undefined || result["status"] == "success") {
            this.notification.showSuccess("Successfully deleted");
            // this.getdocumentsummary();
            this.documentsummary();
            return true;
          } else {
            this.notification.showError(result["code"]);
            // this.docbtn = false;
          }
        });
    } else {
      return false;
    }
  }

  getVendorViewDetails() {
    // let data: any = this.shareService.vendorView.value;
    // let vendorId
    // let modify_ref_id = data?.modify_ref_id
    // if(modify_ref_id == -1){
    //   vendorId = data?.id;
    // } else {
    //   vendorId = modify_ref_id;
    // }
    // if(data.modify_ref_id == -1){
    //   this.vendorIdForEdit = data.id;
    //   }
    //   else{
    //     this.vendorIdForEdit=data.modify_ref_id
    //   }
    this.atmaService.getVendorViewDetails(this.vendorId).subscribe((result) => {
      console.log("paticularvendor", result);
      this.vendorData = result;
      this.shareService.vendorsingleget.next(this.vendorData);
      if(result.modify_ref_id == -1){
      this.vendorIdForEdit = result.id;
      }
      else{
        this.vendorIdForEdit=result.modify_ref_id
      }
      this.vendorid = result.id;
      this.shareService.vendorDATA.next(this.vendorData);
      this.vendorViewDetailList = result;
      // this.activeContract = result.activecontract;
      if (result.activecontract == "True") {
        this.activeContract = "Yes";
      } else {
        this.activeContract = "No";
      }
      this.actualSpend = result.actualspend;
      this.aproxSpend = result.aproxspend;
      this.emailDays = result.emaildays;
      this.msmeType = result?.msme_type?.text
      this.msmeRegno = result.msme_reg_no;
      this.code = result.code;
      this.companyRegNo = result.comregno;
      this.contractFrom = result.contractdate_from;
      this.contractTo = result.contractdate_to;
      this.gstNo = result.gstno;
      this.mainStatusName = result.mainstatus_name;
      this.name = result.name;
      this.contractReason = result.nocontract_reason;
      this.panNo = result.panno;
      this.aadharno = result.adhaarno;
      this.remarks = result.remarks;
      this.renewalDate = result.renewal_date;
      this.requestStatusName = result.requeststatus_name;
      this.vendorStatusName = result.vendor_status_name;
      this.createby = result.created_by;
      this.userId = result.user_id;
      this.qId = result.action.q_id;
      this.statusid = result.action.q_status;
      this.website = result.website;
      this.composite = result.composite.text;
      this.classification = result.classification.text;
      this.group = result.group.text;
      this.customerCategory = result.custcategory_id.name;
      this.organizationType = result.orgtype.text;
      this.type = result.type.text;
      this.riskcategory = result?.risk_type?.text;
      this.selectedriskopt = result?.riskcategory_id;
      // this.risk_remarks :result.risk_remarks
      this.riskform.patchValue({
        risk_remarks: result.risk_remarks,
      });
      this.lineName1 = result.address.line1;
      this.lineName2 = result.address.line2;
      this.lineName3 = result.address.line3;
      this.cityName = result.address.city_id.name;
      this.districtName = result.address.district_id.name;
      this.stateName = result.address.state_id.name;
      this.pinCode = result.address.pincode_id.no;
      this.contactName = result.contact.name;
      // this.contactTypeName = result.contact.type_id.name;
      this.contactDesignation = result.contact.designation_id.name;
      this.contactLandline1 = result.contact.landline;
      this.contactLandline2 = result.contact.landline2;
      this.contactMobile1 = result.contact.mobile;
      this.contactMobile2 = result.contact.mobile2;
      this.contactEmail = result.contact.email;
      this.dateofbirth = result.contact.dob;
      this.profile_Per_Employee = result.profile.permanent_employee;
      this.profile_Temp_Employee = result.profile.temporary_employee;
      this.profile_Tot_Employee = result.profile.total_employee;
      this.profileAward = result.profile.award_details;
      this.profileBranch = result.profile.branch;
      this.profileFactory = result.profile.factory;
      this.profileRemarks = result.profile.remarks;
      this.profileYear = result.profile.year;
      this.rmName = result.rm_id.full_name;
      this.vendorStatusId = result.vendor_status;
      this.modifystatus = result.modify_status;
      this.modifyrefid = result.modify_ref_id;

      console.log("VendorStausid", this.vendorStatusId);
      this.shareService.vendorViewHeaderName.next(result);

      //BUG ID:9146
      this.patchdetails = {
        line1: this.lineName1,
        line2: this.lineName2,
        line3: this.lineName3,
        pincode: result.address.pincode_id,
        city: result.address.city_id,
        district: result.address.district_id,
        state: result.address.state_id,
        // pincode:{no:this.pinCode},
        // city:{name:this.cityName},
        // district:{name:this.districtName},
        // state:{name:this.stateName},
      };

      this.shareService.supplierdetails.next(this.patchdetails);
      //////
      if (
        this.requestStatusName == "Modification" &&
        this.vendorStatusName != "Draft" &&
        this.vendorStatusName != "Approved"
      ) {
        this.rm_viewscreen = true;
      }
      if (this.vendorStatusName == "Approved") {
        this.ismodification = true;
        this.isRejectBtn = false;
        this.isDraft = false;
        this.isPendingRM = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;
        this.renewal_flag = true;
        this.isdeactivation = true;
        this.isactivation = false;
        this.istermination = true;
      }
      if (this.vendorStatusName === "Rejected") {
        this.isRejectBtn = false;
        this.isDraft = false;
        this.isPendingRM = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;
        this.vendor_flag = false;
        this.ismodification = true;
        this.renewal_flag = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.mainStatusName === "Draft" &&
        this.requestStatusName === "Onboard" &&
        this.vendorStatusName === "Draft"
      ) {
        this.vendor_flag = true;
        // this.vendor_flag = false;   //bug id:
      }

      if (
        this.mainStatusName == "Draft" &&
        this.requestStatusName == "Onboard" &&
        this.vendorStatusName == "Rejected"
      ) {
        this.vendor_flag = true;
        this.isDraft = true;
        this.ismodification = false;
        this.isPendingRM = false;
        this.renewal_flag = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = true;
      }
      if (
        this.mainStatusName === "Approved" &&
        this.requestStatusName == "Modification" &&
        this.vendorStatusName === "Draft"
      ) {
        this.vendor_flag = true;
        this.branch_modify = true;
      }
      if (
        this.mainStatusName == "Approved" &&
        this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Rejected"
      ) {
        this.vendor_flag = false;
        this.branch_modify = true;
        this.ismodification = true;
        this.renewal_flag = true;
      }
      if (
        this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft"
      ) {
        this.vendor_flag = true;
        this.isquit = true;
      }
      if (this.requestStatusName == "Renewal Process") {
        this.vendor_flag = true;
        // this.ismodification = true;
      }

      if (this.vendorStatusName === "Draft") {
        this.isRejectBtn = false;
        this.isDraft = true;
        this.isPendingRM = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (this.vendorStatusName === "Approved") {
        this.ismodification = true;
        this.renewal_flag = true;
        this.isRejectBtn = false;
        this.isDraft = false;
        this.isPendingRM = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;

        this.isdeactivation = true;
        this.isactivation = false;
        this.istermination = true;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Onboard"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;

        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Renewal Process"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;
        this.rm_viewscreen = true;
        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Renewal Process"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Onboard"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Onboard"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Renewal Process"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Modification"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = true;

        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Activation"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = true;

        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby !== this.login_id &&
        this.requestStatusName === "Activation"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Activation"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Modification"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Modification"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Deactivation"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;

        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Deactivation"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Deactivation"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Approved" &&
        this.requestStatusName === "Termination"
      ) {
        this.ismodification = false;
        this.isRejectBtn = false;
        this.isDraft = false;
        this.isPendingRM = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;
        this.renewal_flag = false;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }

      if (
        this.vendorStatusName === "Pending_Header" &&
        this.requestStatusName === "Termination"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = false;
        this.ispending = false;

        this.isPendingRM = true;
        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.requestStatusName == "Deactivation" &&
        this.vendorStatusName == "Approved"
      ) {
        this.isRejectBtn = false;
        this.isDraft = false;

        this.ismodification = false;
        this.renewal_flag = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = true;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Termination"
      ) {
        this.isRejectBtn = true;
        this.isDraft = false;
        this.isPendingHeader = false;
        this.isPendingChecker = true;
        this.isApproved = false;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      if (
        this.vendorStatusName === "Pending_Header" &&
        this.createby != this.login_id &&
        this.requestStatusName === "Termination"
      ) {
        this.isRejectBtn = true;
        this.isApproved = false;
        this.isDraft = false;
        this.isPendingChecker = false;
        this.isPendingHeader = true;
        this.isPendingRM = false;
        this.ispending = false;

        this.isdeactivation = false;
        this.isactivation = false;
        this.istermination = false;
      }
      this.Summaryvendorobj = {
        method: "get",
        url: this.url + "venserv/vendor/" + this.vendorId + "/branch",
        params: "",
      };

      // if (this.mainStatusName == "Approved" && this.requestStatusName == "Onboard" && this.vendorStatusName == "Approved") {
      //   this.ishighrisk = true;
      // }

      if (this.mainStatusName == "Approved") {
        this.ishighrisk = true;
      }
      this.shareService.ishighrisk.next(this.ishighrisk);
    });
  }
  modifyVendorView(modifyData) {
    this.status = modifyData.modify_status;
//     if (this.status == 1) {
      if (modifyData.activecontract == "True") {
        this.updateactiveContract = "Yes";
      } else {
        this.updateactiveContract = "No";
      }
      this.updateactualSpend = modifyData.actualspend;
      this.updateaproxSpend = modifyData.aproxspend;
      this.updateEmailDays = modifyData.emaildays;
      this.updateMsmeType = modifyData?.msme_type?.text
      this.updateMsmeRegno = modifyData.msme_reg_no;
      this.updatecode = modifyData.code;
      this.updatecompanyRegNo = modifyData.comregno;
      this.updatecontractFrom = modifyData.contractdate_from;
      this.updatecontractTo = modifyData.contractdate_to;
      this.updategstNo = modifyData.gstno;
      this.updateaadharno = modifyData.adhaarno;
      this.updatemainStatusName = modifyData.mainstatus_name;
      this.vendorIdForEdit = modifyData.id;
      this.updatename = modifyData.name;
      this.updatecontractReason = modifyData.nocontract_reason;
      this.updatepanNo = modifyData.panno;
      this.updateremarks = modifyData.remarks;
      this.updaterenewalDate = modifyData.renewal_date;
      this.updaterequestStatusName = modifyData.requeststatus_name;
      this.updatevendorStatusName = modifyData.vendor_status_name;
      this.updatecreateby = modifyData.created_by;
      this.updateuserId = modifyData.user_id;
      this.updateqId = modifyData.action.q_id;
      this.updatestatusid = modifyData.action.q_status;
      this.updatewebsite = modifyData.website;
      this.updatecomposite = modifyData.composite.text;
      this.updateclassification = modifyData.classification.text;
      this.updategroup = modifyData.group.text;
      this.updatecustomerCategory = modifyData.custcategory_id.name;
      this.updateorganizationType = modifyData.orgtype.text;
      this.updatetype = modifyData.type.text;
      this.updatelineName1 = modifyData.address.line1;
      this.updatelineName2 = modifyData.address.line2;
      this.updatelineName3 = modifyData.address.line3;
      this.updatecityName = modifyData.address.city_id.name;
      this.updatedistrictName = modifyData.address.district_id.name;
      this.updatestateName = modifyData.address.state_id.name;
      this.updatepinCode = modifyData.address.pincode_id.no;
      this.updatecontactName = modifyData.contact.name;
      // this.updatecontactTypeName = modifyData.contact.type_id.name;
      this.updatecontactDesignation = modifyData.contact.designation_id.name;
      this.updatecontactLandline1 = modifyData.contact.landline;
      this.updatecontactLandline2 = modifyData.contact.landline2;
      this.updatecontactMobile1 = modifyData.contact.mobile;
      this.updatecontactMobile2 = modifyData.contact.mobile2;
      this.updatecontactEmail = modifyData.contact.email;
      this.updatedateofbirth = modifyData.contact.dob;
      this.updateprofile_Per_Employee = modifyData.profile.permanent_employee;
      this.updateprofile_Temp_Employee = modifyData.profile.temporary_employee;
      this.updateprofile_Tot_Employee = modifyData.profile.total_employee;
      this.updateprofileAward = modifyData.profile.award_details;
      this.updateprofileBranch = modifyData.profile.branch;
      this.updateprofileFactory = modifyData.profile.factory;
      this.updateprofileRemarks = modifyData.profile.remarks;
      this.updateprofileYear = modifyData.profile.year;
      this.updatermName = modifyData.rm_id.full_name;
      this.updatevendorStatusId = modifyData.vendor_status;
      this.ismodificationView = true;
    }
//   }

  tabchange(event) {
    console.log("select", event);

    if (event.isUserInput == true) {
      this.statusTab = event.source.value;
      if (this.statusTab === "BRANCH DETAILS") {
        this.branchSummary = true;
        this.isBranch = true;
        this.isBranchForm = false;
        this.isBranchEditForm = false;
        this.isClient = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.document_RMView = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.contractor_RMView = false;
        this.isTransaction = false;
        this.isProduct = false;
        this.isActivity = false;

        this.istax = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.product_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.getBranch();
        this.branchsummary();
        return false;
      } else if (this.statusTab === "CLIENT") {
        this.branchSummary = false;
        this.isActivity = false;

        this.istax = false;
        this.isBranch = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isClient = true;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.getClient();
        this.clientsummary();
        return false;
      } else if (this.statusTab === "CONTRACTOR") {
        this.isActivity = false;

        this.istax = false;
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isProduct = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isContractor = true;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.getContractor();
        this.contractorsummary();
        return false;
      } else if (this.statusTab === "PRODUCT") {
        this.branchSummary = false;
        this.isActivity = false;

        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProduct = true;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.getProduct();
        this.productsummary();
        return false;
      } else if (this.statusTab === "TRANSACTION") {
        this.branchSummary = false;
        this.isActivity = false;

        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = true;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.gettransactionsummary();
        this.transactionsummary();
        return false;
      } else if (this.statusTab === "DOCUMENT") {
        this.branchSummary = false;
        this.isActivity = false;

        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = true;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        // this.getdocumentsummary();
        this.documentsummary();
        return false;
      } else if (this.statusTab == "TAX DETAILS") {
        this.istax = true;
        this.Branchtaxadd = false;
        this.taxedit = false;
        // this.getpagenation();
        this.taxsummary();
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isPortal = false;
        this.isPortalForm = false;
        this.isPortalEditForm = false;
        this.groupform = false;
        this.groupsummary = false;
        return false;
      }
    }
  }
  productBtn() {
    // this.getProduct();
    this.productsummary();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProduct = true;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  documentBtn() {
    // this.getdocumentsummary();
    this.documentsummary();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProduct = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    // this.isDocumenttt = true;
    this.isDocument = true;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  contractorBtn() {
    // this.getContractor();
    this.contractorsummary();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = true;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  clientBtn() {
    // this.getClient();
    this.clientsummary();
    this.isBranch = false;
    this.isClient = true;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  branchBtn() {
    // this.getBranch();
    this.branchsummary();
    this.isBranch = true;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  gettransactionsummary(pageNumber = 1, pageSize = 10) {
    //vendor id dynamic lines
    let data: any = this.shareService.vendorView.value;
    let transactionDetail = data.id;
    //vendor id dynamic lines ends
    console.log("res", transactionDetail);
    this.atmaService
      .gettransactionsummary(transactionDetail, pageNumber, pageSize)
      .subscribe((result) => {
        console.log("tran", result);
        let datas = result["data"];
        this.transactionList = datas;
        console.log("tran", this.transactionList);
        //transaction pagination
        let datapagination = result["pagination"];
        if (this.transactionList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.transactionpage = datapagination.index;
        }
      });
  }
  //transaction
  nextClickLandlordbank() {
    if (this.has_next === true) {
      this.gettransactionsummary(this.transactionpage + 1, 10);
    }
  }
  previousClicklandlordBank() {
    if (this.has_previous === true) {
      this.gettransactionsummary(this.transactionpage - 1, 10);
    }
  }

  getBranch(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getBranch(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        console.log("branchres", result);
        this.getbranchLength = result["data"].length;
        // if ((this.getbranchLength == this.profileBranch) || (this.getbranchLength == this.updateprofileBranch)) {
        //   this.isBranchButton = false
        // }
        let datas = result["data"];
        this.branchList = datas;
        this.branchPagination = result["pagination"];
        this.branchList = datas;

        this.shareService.supplen.next(this.branchList.length);

        if (this.branchList.length >= 0) {
          this.breadcrumbarray.push(this.branchList[0]?.name);
          this.branch_next = this.branchPagination.has_next;
          this.branch_previous = this.branchPagination.has_previous;
          this.branchpage = this.branchPagination.index;
          this.isBranchPagination = true;
        }
        if (this.branchList <= 0) {
          this.isBranchPagination = false;
        }
      });
  }

  nextClickBranch() {
    if (this.branch_next === true) {
      this.getBranch(this.branchpage + 1, 10);
    }
  }

  previousClickBranch() {
    if (this.branch_previous === true) {
      // this.currentpage= this.presentpage - 1
      this.getBranch(this.branchpage - 1, 10);
    }
  }

  getClient(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getClient(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        let datas = result["data"];
        this.clientList = datas;
        let datapagination = result["pagination"];
        this.clientList = datas;
        if (this.clientList.length >= 0) {
          this.client_next = datapagination.has_next;
          this.client_previous = datapagination.has_previous;
          this.clientpage = datapagination.index;
          this.isClientPagination = true;
        }
        if (this.clientList <= 0) {
          this.isClientPagination = false;
        }
      });

    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.client_modify = true;
      this.getmodification_vender();
    }
  }

  nextClickClient() {
    if (this.client_next === true) {
      this.getClient(this.clientpage + 1, 10);
    }
  }

  previousClickClient() {
    if (this.client_previous === true) {
      this.getClient(this.clientpage - 1, 10);
    }
  }
  getProduct(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getProduct(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        let datas = result["data"];
        this.productList = datas;
        let datapagination = result["pagination"];
        this.productList = datas;
        if (this.productList.length >= 0) {
          this.product_next = datapagination.has_next;
          this.product_previous = datapagination.has_previous;
          this.productpage = datapagination.index;
          this.isProductPagination = true;
        }
        if (this.productList <= 0) {
          this.isProductPagination = false;
        }
      });

    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.product_modify = true;
    }
  }

  nextClickProduct() {
    if (this.product_next === true) {
      this.getProduct(this.productpage + 1, 10);
    }
  }

  previousClickProduct() {
    if (this.product_previous === true) {
      this.getProduct(this.productpage - 1, 10);
    }
  }
  getContractor(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getContractor(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        let datas = result["data"];
        this.contactorList = datas;
        let datapagination = result["pagination"];
        this.contactorList = datas;
        if (this.contactorList.length >= 0) {
          this.contractor_next = datapagination.has_next;
          this.contractor_previous = datapagination.has_previous;
          this.contractorpage = datapagination.index;
          this.isContractorPagination = true;
        }
        if (this.contactorList <= 0) {
          this.isContractorPagination = false;
        }
      });

    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.contract_modify = true;
    }
  }
  nextClickContractor() {
    if (this.contractor_next === true) {
      this.getContractor(this.contractorpage + 1, 10);
    }
  }

  previousClickContractor() {
    if (this.contractor_previous === true) {
      this.getContractor(this.contractorpage - 1, 10);
    }
  }

  addProduct() {
    this.isProductForm = true;
    this.isProduct = false;
    this.shareService.vendorID.next(this.vendorId);
    this.popupopen()
    this.rename = 'Product Creation Form '
  }

  addBranch() {
    this.isBranchForm = true;
    this.isBranch = false;
    this.shareService.vendorID.next(this.vendorId);
    this.popupopen();
     this.rename = 'Branch Creation Form'
  }

  addClient() {
    this.isClientForm = true;
    this.isClient = false;
    this.shareService.vendorID.next(this.vendorId);
    this.popupopen();
    this.rename = 'Client Creation Form'
  }

  addContractor() {
    this.isContractor = false;
    this.isContractorForm = true;
    this.shareService.vendorID.next(this.vendorId);
    this.popupopen();
    this.rename = 'Contractor Creation Form'
  }

  adddocument() {
    this.isDocumentForm = true;
    this.isDocument = false;
    this.shareService.vendorID.next(this.vendorId);
    this.popupopen();
    this.rename = 'Document Creation Form'
  }

  branchCancel() {
    this.isBranchForm = false;
    this.isBranch = true;
    this.closedpopup();
  }
  branchSubmit() {
    // this.getBranch();
    this.branchsummary();
    this.getmodification_vender();
    this.isBranchForm = false;
    this.isBranch = true;
    this.closedpopup();
  }

  clientCancel() {
    this.isClient = true;
    this.client_RMView = false;
    this.isClientEditForm = false;
    this.isClientForm = false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.onCancel.emit();
    this.closedpopup();
  }

  clientSubmit() {
    // this.getClient();
    this.clientsummary();
    // this.getmodification_vender();
    this.isClient = true;
    this.isClientForm = false;
    this.closedpopup();
  }
  contractorCancel() {
    this.isContractor = true;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.contractor_RMView = false;
    this.closedpopup();
  }

  contractorSubmit() {
    // this.getContractor();
    this.contractorsummary();
    // this.getmodification_vender();
    this.isContractor = true;
    this.isContractorForm = false;
    this.closedpopup();
  }

  productCancel() {
    this.isProduct = true;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.product_RMView = false;
    this.closedpopup();
  }

  productSubmit() {
    // this.getProduct();
    this.productsummary();
    // this.getmodification_vender();
    this.isProduct = true;
    this.isProductForm = false;
    this.closedpopup();
  }

  documentCancel() {
    this.isDocument = true;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.document_RMView = false;
    this.closedpopup();
  }

  documentSubmit() {
    // this.getdocumentsummary();
    this.documentsummary();
    // this.getmodification_vender();
    this.isDocument = true;
    this.isDocumentForm = false;
    this.closedpopup();
  }

  productEditForm(data) {
    this.isProductEditForm = true;
    this.isProduct = false;
    this.shareService.productEditForm.next(data);
    this.popupopen();
    this.rename = "Product Edit Form"
  }
  modifyproductEditForm(data) {
    this.isProductEditForm = true;
    this.isProduct = false;
    this.shareService.productEditForm.next(data.new_data);
    this.popupopen()
    this.rename = "Product Edit Form"

  }

  branchEditForm(data) {
    this.isBranch = false;
    this.isBranchEditForm = true;

    this.shareService.branchEditFrom.next(data);
    this.popupopen();
    this.rename = "Branch Edit Form"
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("vendorViewMainModal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopens() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("exampleModalCenter"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen3() {
    // num = 4
    // this.numb = num
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("rejectModal"),
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    myModal.show();
  }
  branchmodifyEditForm(data) {
    this.isBranch = false;
    this.isBranchEditForm = true;
    this.shareService.branchEditFrom.next(data.new_data);
    this.popupopen()
    this.rename = "Branch Edit Form"
  }
  RMView_client(data) {
    let new_datas = {
      new_data: data,
    };
    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.client_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Client Changes View Form"
  }
  RMView_contractor(data) {
    let new_datas = {
      new_data: data,
    };
    this.isContractor = true;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.contractor_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Contractor Changes View Form "
  }
  RMView_document(data) {
    let new_datas = {
      new_data: data,
    };
    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.document_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Document Changes View Form"
  }
  RMView_product(data) {
    let new_datas = {
      new_data: data,
    };
    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.product_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Product Changes View Form"
  }

  clientEditForm(data) {
    this.isClient = false;
    this.isClientEditForm = true;
    this.shareService.clientEditForm.next(data);
    this.popupopen();
    this.rename = "Client Edit Form"
  }
  modifyclientEditForm(data, msg) {
    this.isClient = false;
    this.isClientEditForm = true;
    this.shareService.clientEditForm.next(data.new_data);
    this.popupopen()
    this.rename = "Client Edit Form"

  }
  modify_client(j) {
    this.isClient = false;
    this.isClientEditForm = false;
    this.client_flag = false;
    this.client_RMView = true
    this.shareService.modification_data.next(j);
    this.popupopen();
  }
  modify_contract(j) {
    this.contractor_flag = true;
    this.shareService.modification_data.next(j);
    this.popupopen();
  }

  modify_branch(data) {
    this.branch_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen();
  }

  modify_payment(data) {
    this.payment_flag = true;
    this.shareService.modification_data.next(data);
    this.popupopen();
  }
  // contractEditForm(data, msg) {
  //   if (msg == "modify") {
  //     data = data.new_data;
  //   }
  //   this.contractid = data.id;
  //   this.isContractor = false;
  //   this.isContactorEditForm = true;
  //   this.shareService.contractorEditForm.next(data);
  // }
  contractEditForm(data, msg) {
    this.contractid = data.id;
    this.isContractor = true;
    this.isContactorEditForm = true;
    this.shareService.contractorEditForm.next(data);
    this.popupopen();
    this.rename = 'Contractor Edit Form'
  }
  modifycontractEditForm(data, msg) {
    this.contractid = data.id;
    this.isContractor = true;
    this.isContactorEditForm = true;
    this.shareService.contractorEditForm.next(data.new_data);
    this.popupopen()
    this.rename = 'Contractor Edit Form'
  }

  documentEdit(data: any) {
    this.isDocumentEditForm = true;
    this.isDocument = false;
    this.shareService.documentEdit.next(data);
    this.popupopen();
    this.rename = "Document Edit Form"
  }

  documentmodifyEdit(data: any) {
    this.isDocumentEditForm = true;
    this.isDocument = false;
    this.shareService.documentEdit.next(data.new_data);
    this.popupopen()
    this.rename = "Document Edit Form"

  }
  productEditCancel() {
    this.isProductEditForm = false;
    this.isProduct = true;
    this.closedpopup()
  }

  productEditSubmit() {
    // this.getProduct();
    this.productsummary();
    // this.getmodification_vender();
    this.isProductEditForm = false;
    this.isProduct = true;
    this.closedpopup()
  }

  contractorEditCancel() {
    this.isContractor = true;
    this.isContactorEditForm = false;
    this.closedpopup()
  }

  contractorEditSubmit() {
    this.isContractor = true;
    // this.getContractor();
    this.contractorsummary();
    // this.getmodification_vender();

    this.isContactorEditForm = false;
    this.closedpopup()
  }

  documentEditSubmit() {
    // this.getdocumentsummary();
    this.documentsummary();
    // this.getmodification_vender();
    this.isDocumentEditForm = false;
    this.isDocument = true;
    this.closedpopup()
  }

  documentEditCancel() {
    console.log("cancel");
    this.isDocumentEditForm = false;
    this.isDocument = true;
    this.closedpopup()
  }

  clientEditCancel() {
    this.isClientEditForm = false;
    this.isClient = true;
    this.closedpopup()
  }
  clientEditSubmit() {
    // this.getClient();
    this.clientsummary();
    // this.getmodification_vender();
    this.isClientEditForm = false;
    this.isClient = true;
    this.closedpopup()
  }

  branchEditCancel() {
    this.isBranchEditForm = false;
    this.isBranch = true;
    this.closedpopup()
  }

  branchEditSubmit() {
    // this.getBranch();
    this.branchsummary();
    this.getmodification_vender();
    this.isBranchEditForm = false;
    this.isBranch = true;
    this.closedpopup()
  }
  nameClick(data) {
    this.shareService.branchID.next(data);
    this.shareService.vendorDATA.next(this.vendorData);
    this.router.navigate(["/atma/branchactivity"], {
      skipLocationChange: true,
    });
  }

  branchView(data) {
    this.shareService.branchView.next(data);

    this.router.navigate(["/atma/branchView"], {
      skipLocationChange: true,
    });
  }
  rejectRemarks() {
    this.popupopen3()
    console.log("abc", this.vendorStatusName);
    //approverreject API Commented becoz NO action of REJECT here only RETURN flow follows during modification request Click According to user
    //--selection API call will occur
    // if (this.vendorStatusName == "Pending_Header") {
    //   this.atmaService.approverreject(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,'Header Reject')
    //     .subscribe(result => {
    //       if(result.status == "success"){
    //         this.notification.showSuccess("Rejected...")
    //       this.rejectFrom.reset()
    //       this.closebutton.nativeElement.click();
    //       this.router.navigate(["/atma/vendor"], {
    //         skipLocationChange: true
    //       })
    //       } else {
    //         this.notification.showError(result['description'])

    //       }

    //     })
    // } else {
      this.SpinnerService.show()
    this.atmaService
      .rejectStatus(
        this.vendorId,
        this.rejectFrom.value.comments,
        (this.vendorStatusId = 0),
        " Reject"
      )
      .subscribe((result) => {
        this.SpinnerService.hide()
        if (result.status == "success") {
          // this.notification.showSuccess("Rejected...")
          this.notification.showSuccess("Returned Successfully...");
          this.rejectFrom.reset();
          // this.closebutton.nativeElement.click();
          this.closepopup3()
          this.shareService.vendorViewHeaderName.next("")
          this.sharedService.MyModuleName = "Vendor"
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true,
          });
        } else {
          this.notification.showError(result["description"]);
          this.rejectFrom.reset();
          // this.closebutton.nativeElement.click();
          this.closepopup3()
        }
      });
    // }
  }

  rejectPopup() {
    this.atmaService.getRejected(this.vendorId).subscribe((result) => {
      let data = result["data"];
      let rejectList = data;
      let io = rejectList.length - 1;
      this.rejectedList = rejectList[io]?.comments;
    });
  }
  active_inactive(data) {
    if (data.is_active) {
      data["is_active"] = 0;
    } else {
      data["is_active"] = 1;
    }
    if (data.contact_id.dob == "None") {
      data.contact_id.dob = null;
    }
    if (data.contact_id.wedding_date == "None") {
      data.contact_id.wedding_date = null;
    }
    this.atmaService.branchactive(data).subscribe((result) => {
      if (result.id > 0 || result.id != undefined) {
        if (result.is_active) {
          this.notification.showSuccess("Activation Success");
        } else {
          this.notification.showSuccess("Inactive Success");
        }

        // this.getBranch();
        this.branchsummary();
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      } else {
        this.notification.showError("failes");
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      }
    });
    // this.SpinnerService.hide();
  }
  active_inactive_modify(data) {
    if (data.new_data.is_active) {
      data.new_data["is_active"] = 0;
    } else {
      data.new_data["is_active"] = 1;
    }
    if (data.new_data.contact_id.dob == "None") {
      data.new_data.contact_id.dob = null;
    }
    if (data.new_data.contact_id.wedding_date == "None") {
      data.new_data.contact_id.wedding_date = null;
    }
    this.atmaService.branchactive(data).subscribe((result) => {
      if (result.id > 0 || result.id != undefined) {
        if (result.is_active) {
          this.notification.showSuccess("Activation Success");
        } else {
          this.notification.showSuccess("Inactive Success");
        }

        // this.getBranch();
        this.branchsummary();
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      } else {
        this.notification.showError("failes");
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      }
    });
    // this.SpinnerService.hide();
  }

  vendorEdit() {
    this.shareService.vendorEditValue.next(this.vendorIdForEdit);
    console.log("vendorEdit-this.vendorIdForEdit", this.vendorIdForEdit);
    this.router.navigate(["/atma/vendoredit"], {
      skipLocationChange: true,
    });
  }

  brantaxdetails(e) {
    this.shareService.branchView.next(e);
    this.router.navigate(["/atma/BranchTaxComponent"], {
      skipLocationChange: true,
    });
  }
  brantaxpayment(e) {
    this.shareService.branchView.next(e);
    this.router.navigate(["/atma/BranchPaymentComponent"], {
      skipLocationChange: true,
    });
  }
  branchpayment(e) {
    this.shareService.branchView.next(e);
    this.router.navigate(["/atma/branchpayment"], {
      skipLocationChange: true,
    });
  }

  //Modification data for a particular vendor
  getmodification_vender() {
    this.contract_data = [];
    this.client_data = [];
    this.product_data = [];
    this.branch_data = [];
    this.document_data = [];
    this.payment_data = [];
    this.tax_data = [];
    this.catalouge_data = [];
    this.activity_detail = [];
    this.activity_data = [];

    this.atmaService.getmodification(this.vendorId).subscribe((result) => {
      this.modificationdata = result["data"];
      this.modificationdata.forEach((element) => {
        if (element.action == 2) {
          //edit
          if (element.type_name == 1) {
            this.ismodificationView = true;
            let modifyData = element.new_data;
            this.modifyVendorView(modifyData);
          }
          if (element.type_name == 8) {
            this.contract_data.push(element);
            this.contractormodifysummary();
          }
          if (element.type_name == 7) {
            this.client_data.push(element);
            this.clientmodifysummary();
          }
          if (element.type_name == 9) {
            this.product_data.push(element);
            this.productmodifysummary();
          }

          if (element.type_name == 6) {
            this.branch_data.push(element);
            this.vendormodifysummary();
          }

          if (element.type_name == 10) {
            this.document_data.push(element);
            this.documentmodifysummary();
          }

          if (element.type_name == 12) {
            this.payment_data.push(element);
          }
          if (element.type_name == 11) {
            this.tax_data.push(element.new_data);
            this.taxmodifysummary();
            // console.log('tax_data',this.tax_data)
          }
        }
        // if(element.action==0)//delete
        // {
        //     if(element.type_name==11){
        //       this.tax_data.push(element.data)}
        //       console.log('tax_data2==>',this.tax_data);

        // }

        if (element.action == 1) {
          //create
          if (element.type_name == 8) {
            this.contract_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
            this.contractormodifysummary();
          }
          if (element.type_name == 7) {
            this.client_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
            this.clientmodifysummary();
          }
          if (element.type_name == 9) {
            this.product_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
            this.productmodifysummary();
          }
          if (element.type_name == 6) {
            this.branch_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
            this.vendormodifysummary();
          }
          if (element.type_name == 10) {
            this.document_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
            this.documentmodifysummary();
          }

          if (element.type_name == 12) {
            this.payment_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
          }

          if (element.type_name == 11) {
            this.tax_data.push(element.data);
          }
          this.taxmodifysummary();
        }
        if (element.action == 0) {
          if (element.type_name == 10) {
            this.document_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
          }

          if (element.type_name == 12) {
            this.payment_data.push({
              new_data: element.data,
              action: element.action,
              type_name: element.type_name,
            });
          }
          if (element.type_name == 11) {
            this.tax_data.push(element.data);
          }
        }

        // if (element.action == 3) {
        //   if (element.type_name == 6) {
        //     this.branch_data.push(element);
        //     // this.vendormodifysummary();
        //   }
        // }
        // if (element.action == 4) {
        //   if (element.type_name == 6) {
        //     this.branch_data.push(element);
        //     // this.vendormodifysummary();
        //   }
        // }

        
        if (element.action == 3 || element.action == 4) { // Combine conditions
          if (element.type_name == 6 && this.branch_data.length > 0) { // Check if branch_data is empty
              this.branch_data.push(element);
              this.vendormodifysummary(); // Commented out as per your request
          }
          if (element.type_name == 6 && this.branch_data.length === 0) { // Check if branch_data is empty
              this.branch_data.push(element);
              this.vendormodifysummary(); // Commented out as per your request
          }
      }
      });

      if (
        this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft"
      ) {
        if (this.client_data.length > 0) {
          this.client_data = this.getbtn_status(this.client_data);
          this.clientmodifysummary();
        }

        if (this.contract_data.length > 0) {
          this.contract_data = this.getbtn_status(this.contract_data);
          this.contractormodifysummary();
        }
      }
      if (this.product_data.length > 0) {
        this.product_data = this.getbtn_status(this.product_data);
        this.productmodifysummary();
      }
      // if (this.branch_data.length > 0) {
      //   this.branch_data = this.getbtn_status(this.branch_data);
      //   this.vendormodifysummary();
      // }
      if (this.document_data.length > 0) {
        this.document_data = this.getbtn_status(this.document_data);
        this.documentmodifysummary();
      }
      if (this.tax_data.length > 0) {
        this.tax_data = this.getbtn_status(this.tax_data);
        this.taxmodifysummary();
      }
    });
  }

  Change_view(c) {
    this.viewarray = [c];
    this.clientcreateview = true;
  }
  getbtn_status(array) {
    for (let i = 0; i < array.length; i++) {
      // this.contract_data[i]["remove_actions"]=false;
      if (array.length != i) {
        if (array[i].modify_status == 2) {
          for (let j = 1; j < array.length; j++) {
            if (array[i].id == array[j].modify_ref_id) {
              array[j]["modify_ref_id"] = true;
            }
          }
        }
      }
    }
    return array;
  }

  productBtncv() {
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = true;

    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  contractorBtncv() {
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = true;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  clientBtncv() {
    this.isBranchcv = false;
    this.isClientcv = true;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  vendordtl() {
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  branchBtncv() {
    this.isBranchcv = true;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  activityBtn() {
    this.isActivity = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  activitydtlBtn() {
    this.isActivityDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  catalogBtn() {
    this.isCatalog = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  taxBtn() {
    this.isTaxDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isPaymentDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }
  paymentBtn() {
    this.isPaymentDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  modification_sub() {
    this.atmaService
      .modificationrequest(
        this.vendorId,
        (this.status = 2),
        this.requestStatus,
        this.vendor_status
      )
      .subscribe((result) => {
        this.notification.showSuccess("Success");
        this.ngOnInit();
        this.vendor_flag = true;
        this.ismodification = false;
        this.renewal_flag = false;
        this.onCancel.emit();
        // this.router.navigate(["/vendorView"], { skipLocationChange: true })
      });
  }
  modificationrequest() {
    if (this.modificationdata.length > 0) {
      if (
        this.requestStatusName == "Renewal Process" ||
        (this.requestStatusName == "Modification" &&
          this.vendorStatusName == "Rejected")
      ) {
        // this.confirmationDialogService.confirm('Please confirm..', 'Are you sure you want to discard the changes.?')
        this.confirmationDialogService
          .confirm(
            "Please confirm..",
            "Are you sure you want to discard the changes.?",
            "Yes",
            "No"
          )
          .then((confirmed) => {
            if (confirmed == true) {
              this.atmaService
                .approverreject(
                  this.vendorId,
                  this.rejectFrom.value,
                  (this.vendorStatusId = 0),
                  "reject"
                )
                .subscribe((result) => {
                  if (result.status == "success") {
                    this.notification.showSuccess("Done");
                    this.atmaService
                      .modificationrequest(
                        this.vendorId,
                        (this.status = 2),
                        this.requestStatus,
                        this.vendor_status
                      )
                      .subscribe((result) => {
                        this.notification.showSuccess("Success");
                        this.showAcceptButton = false;
                        this.ngOnInit();
                        this.vendor_flag = true;
                        this.ismodification = false;
                        this.renewal_flag = false;
                        this.onCancel.emit();
                        // this.router.navigate(["/vendorView"], { skipLocationChange: true })
                      });
                  } else {
                    this.notification.showError(
                      "something went wrong try again"
                    );
                  }
                });
            } else {
              this.atmaService
                .modificationrequest(
                  this.vendorId,
                  (this.status = 2),
                  this.requestStatus,
                  this.vendor_status
                )
                .subscribe((result) => {
                  // this.notification.showSuccess("Success")
                  this.showAcceptButton = false;
                  this.ngOnInit();
                  this.vendor_flag = true;
                  this.ismodification = false;
                  this.renewal_flag = false;
                  this.onCancel.emit();
                  this.router.navigate(["/vendorView"], {
                    skipLocationChange: true,
                  });
                });
            }
          })
          .catch(() => console.log("User dismissed the dialog "));
      }
      // else{} here need to write
    } else {
      this.modification_sub();
    }
  }
  deactivaterequest() {
    // this.activeordeactivetype=4   //7026
    // this.shareService.activeordeact.next(this.activeordeactivetype) //7026

    this.atmaService
      .modificationrequest(
        this.vendorId,
        (this.status = 1),
        this.requestStatus,
        this.vendor_status
      )
      .subscribe((result) => {
        this.notification.showSuccess("Submitted to Approver...");
        // bug id:7026
        this.closebtn.nativeElement.click();
        // bug id:7026
        this.shareService.vendorViewHeaderName.next("")
        this.sharedService.MyModuleName = "Vendor"
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true,
        });
      });
  }
  activaterequest() {
    // this.activeordeactivetype=3   //7026
    // this.shareService.activeordeact.next(this.activeordeactivetype)//7026

    this.atmaService
      .modificationrequest(
        this.vendorId,
        (this.status = 3),
        this.requestStatus,
        this.vendor_status
      )
      .subscribe((result) => {
        this.notification.showSuccess("Submitted To Approver...");
        // bug id:7026
        this.closebttn.nativeElement.click();
        // bug id:7026
        this.shareService.vendorViewHeaderName.next("")
        this.sharedService.MyModuleName = "Vendor"
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true,
        });
      });
  }

  changes_renewal_sub() {
    this.atmaService
      .modificationrequest(
        this.vendorId,
        (this.status = 4),
        this.requestStatus,
        this.vendor_status
      )
      .subscribe((result) => {
        this.notification.showSuccess("Submitted To Approver...");
        this.router.navigate(["/atma/vendorView"], {
          skipLocationChange: true,
        });
      });
  }

  changes_renewal() {
    if (this.modificationdata.length > 0) {
      if (
        this.requestStatusName == "Renewal Process" ||
        (this.requestStatusName == "Modification" &&
          this.vendorStatusName == "Rejected")
      ) {
        this.confirmationDialogService
          .confirm(
            "Please confirm..",
            "Are you sure you want to discard the changes.?"
          )
          .then((confirmed) => {
            if (confirmed == true) {
              this.atmaService
                .approverreject(
                  this.vendorId,
                  this.rejectFrom.value,
                  (this.vendorStatusId = 0),
                  "reject"
                )
                .subscribe((result) => {
                  if (result.status == "success") {
                    this.notification.showSuccess("Done");
                    this.atmaService
                      .modificationrequest(
                        this.vendorId,
                        (this.status = 2),
                        this.requestStatus,
                        this.vendor_status
                      )
                      .subscribe((result) => {
                        this.notification.showSuccess("Success");
                        this.ngOnInit();
                        this.vendor_flag = true;
                        this.ismodification = false;
                        this.renewal_flag = false;
                        this.onCancel.emit();
                      });
                  } else {
                    this.notification.showError(
                      "something went wrong try again"
                    );
                  }
                });
            }
          })
          .catch(() => console.log("User dismissed the dialog "));
      }
    } else {
      this.changes_renewal_sub();
    }
  }
  terminationrequest() {
    this.atmaService
      .modificationrequest(
        this.vendorId,
        (this.status = 5),
        this.requestStatus,
        this.vendor_status
      )
      .subscribe((result) => {
        if (result.status == "success") {
          this.notification.showSuccess("Submitted To Approver...");
          this.shareService.vendorViewHeaderName.next("")
          this.sharedService.MyModuleName = "Vendor"
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true,
          });
        } else {
          this.notification.showError(result["code"]);
        }
      });
  }
  changes_view() {
    // modify
    this.shareService.vendorID.next(this.vendorId);
    this.router.navigate(["/atma/modify"], {
      skipLocationChange: true,
    });
  }
  // ----ChangesviewEnd---
  // Move to RM start
  movetorm(status = 2) {
    this.popupopens();
    this.atmaService.Rm(this.vendorId).subscribe((result) => {
      let supbrnch = result.SupplierBranch;
      let supprod = result.SupplierProduct;
      let vencli = result.VendorClient;
      let vendoc = result.VendorDocument;
      let vencont = result.VendorSubContractor;
      let remarks = result.remarks; //8720
      this.errormsgList = result.error;
      if (
        result.error != " " &&
        result.error != null &&
        result.error != undefined
      ) {
        this.missingdetailsyesno = true;
      }
      // this.errormsg = result.error

      this.popupform.patchValue({
        suppbrnch: supbrnch,
        suppprod: supprod,
        client: vencli,
        suppdoc: vendoc,
        suppcont: vencont,
        remarks: remarks, //8720
      });

      // if(supbrnch== true && supprod == true && vencli == true && vendoc == true &&  vencont == true){
      if (supbrnch == true && vendoc == true) {
        this.remarksfield = true;
      }
      //BUG ID:8324
      // this.isECForAP=result.isECForAP
      this.isECForAP = true;
      this.submittorm = false;
      // if(this.isECForAP == true){
      //   // this.confirmationDialogService.confirm('Please confirm..', 'Are you sure you want to discard the changes.?',)
      //   window.confirm("Active ECF/AP is available for this supplier")
      // }
    });
  }

  submitrm(staus = 2) {
    if (this.popupform.value.suppprod == false) {
      this.notification.showError("Please Fill The Supplier Product Form");
      return false;
    }

    if (this.popupform.value.client == false) {
      this.notification.showError("Please Fill The Vendor Client Form");
      return false;
    }
    if (this.popupform.value.suppdoc == false) {
      this.notification.showError("Please Fill The Vendor Document Form");
      return false;
    }
    if (this.popupform.value.suppcont == false) {
      this.notification.showError("Please Fill The Vendor Contractor Form");
      return false;
    }
    //8720
    if (this.popupform.value.remarks == false) {
      this.notification.showError("Please Fill The Remarks");
      return false;
    }

    this.branchstatus = this.popupform.value.suppbrnch;
    if (this.branchstatus == false) {
      this.atmaService.branchvalidation(this.vendorId).subscribe((result) => {
        this.Branchpopup = true;

        this.branchnames = result.data;
      });
    }

    this.atmaService
      .movetorm(
        this.vendorId,
        this.popupform.value.remarks,
        this.rmId,
        4,
        "To Header"
      )

      .subscribe((result) => {
        if (this.popupform.value.suppbrnch == false) {
          this.notification.showError("Please Fill The Supplier Branch Form");
          this.closedpopups()
          return false;
        }

        if (result.status == "success") {
          this.notification.showSuccess("Submitted To Approver");
          // this.headapprover(4)
          this.closedpopups()
          this.shareService.vendorViewHeaderName.next("")
          this.sharedService.MyModuleName = "Vendor"
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true,
          });
        } else if (result.code == "INVALID_BRANCH_ID") {
          this.notification.showError(
            "Branch Count Not Match...Please Fill The Supplier Branch"
          );
          this.closedpopups()
        } else {
          this.notification.showError(result["code"]);
          this.closedpopups()
        }
      });
  }

  closingpopup(){
    this.closedpopups()
  }
  // checker(status = 3) {
  //   this.atmaService.movetorm(this.vendorId,this.rejectFrom.value.comments, this.rmId = 0, status,"Header Approved")
  //     .subscribe(result => {
  //       // console.log(result['code'])
  //       if (result['status'] != undefined || result['status'] == 'success') {
  //         this.notification.showSuccess("Submitted To Approver")
  //         this.rejectFrom.reset();
  //         this.closebutton.nativeElement.click();   //8720
  //         this.router.navigate(["/atma/vendor"], {
  //           skipLocationChange: true
  //         })
  //         this.onCancel.emit()
  //         this.ngOnInit();
  //         //BUG ID:8234
  //         // if(result['description'] == 'ECFAP has avtive claim'){
  //         //     window.confirm("This Supplier has active Claim pending in AP/ECF")
  //         // }
  //         //
  //       } else {
  //         this.notification.showError(result['code'])
  //       }
  //     })
  // }

  headapprover(status = 4) {
    this.atmaService
      .movetorm(
        this.vendorId,
        this.rejectFrom.value.comments,
        (this.rmId = 0),
        status,
        "To Header"
      )
      .subscribe((result) => {
        if (result["status"] != undefined || result["status"] == "success") {
          this.notification.showSuccess("Submitted To Approver");
          this.rejectFrom.reset(); //8720
          // this.closebutton.nativeElement.click(); //8720
          this.closepopup3()
          this.shareService.vendorViewHeaderName.next("")
          this.sharedService.MyModuleName = "Vendor"
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true,
          });
        }
        //BUG ID:8234
        //   if(result['description'] == 'ECFAP has avtive claim'){
        //     window.confirm("This Supplier has active Claim pending in AP/ECF")
        // }
        else {
          this.notification.showError(result["code"]);
        }
      });
  }
  approver(status = 5) {
    this.popupopen3()
    if (this.requestStatusName == "Modification") {
      this.SpinnerService.show()
      this.atmaService
        .modification_approve(this.vendorId, this.rejectFrom.value.comments)
        .subscribe((result) => {
          this.SpinnerService.hide()
          // console.log("modification_approve", result)
          if (result["status"] != undefined || result["status"] == "success") {
            this.notification.showSuccess("Approved Successfully");
            this.rejectFrom.reset(); //8720
            // this.closebutton.nativeElement.click(); //8720
            this.closepopup3()
            this.shareService.vendorViewHeaderName.next("")
            this.sharedService.MyModuleName = "Vendor"
            this.router.navigate(["/atma/vendor"], {
              skipLocationChange: true,
            });
            // window.location.reload()
          } else if (result["description"]) {
            // this.notification.showError(result['code'])
            //bug id:8324
            this.notification.showError(result["description"]?.MESSAGE[0]);
            this.rejectFrom.reset();
            this.closepopup3()
          } else {
            this.notification.showError("Unexpected Error!");
            this.rejectFrom.reset(); 
            this.closepopup3()
          }
        });
    } else {
       this.SpinnerService.show()
      this.atmaService
        .movetorm(
          this.vendorId,
          this.rejectFrom.value.comments,
          (this.rmId = 0),
          status,
          "Header Approved"
        )
        .subscribe((result) => {
          this.SpinnerService.hide()
          if (result["status"] != undefined || result["status"] == "success") {
            this.notification.showSuccess("Approved Successfully");
            // this.closebutton.nativeElement.click(); //8720
            this.rejectFrom.reset(); 
            this.closepopup3()
            this.shareService.vendorViewHeaderName.next("")
            this.sharedService.MyModuleName = "Vendor"
            this.router.navigate(["/atma/vendor"], {
              skipLocationChange: true,
            });
            // window.location.reload()
          } else if (result["description"]) {
            // this.notification.showError(result['code'])
            this.notification.showError(result["description"]);
            this.rejectFrom.reset(); 
            this.closepopup3()
            // this.notification.showError(result['description'])

            // this.notification.showError(result['description'].MESSAGE[0])
          } else {
            this.notification.showError("Unexpected Error!");
            this.rejectFrom.reset(); 
            this.closepopup3()
          }
        });
    }
  }

  // tax
  getpagenation(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .Taxsummary(pageNumber, pageSize, this.vendorData.id)
      .subscribe((results: any[]) => {
        console.log("filterdata", results);
        let datapagination = results["pagination"];
        this.products = results["data"];
        if (this.products.length >= 0) {
          this.has_next_tax = datapagination.has_next;
          this.has_previous_tax = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        if (this.has_next_tax == true) {
          this.has_next_tax = true;
        }
        if (this.has_previous_tax == true) {
          this.has_previous_tax = true;
        }
      });
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.tax_modify = true;
    }
  }

  evaluationroute() {
    console.log("vendorEdit-this.vendorIdForEdit", this.vendorIdForEdit);
    // if(value ==0){
    // this.router.navigate(['/atma/evaluation'],{ queryParams: {"vendorid": btoa(this.vendorIdForEdit) }} )
    this.router.navigate(["/atma/activityquestionnaire"], {
      queryParams: { vendorid: this.vendorId },
    });
  }
  // else{
  // this.router.navigate(['/atma/activity_questionnaire'],{ queryParams: {"vendorid": btoa(this.vendorIdForEdit),"vendor_or_activity":btoa(value) }} )

  // }
  // }
  // BUG ID:7026
  cancelclk() {
    this.closebtn.nativeElement.click();
  }
  cancelclick() {
    this.closebttn.nativeElement.click();
  }
  deactivatebuttonclk() {
    this.popupopen4();
    this.deactivatebutton = false;
    console.log("deactivatebuttonclkparent==>", this.deactivatebutton);
    console.log("activatebuttonclkparent==>", this.activatebutton);
  }
  activatebuttonclk() {
    this.popupopen5()
    this.activatebutton = false;
    console.log("activatebuttonclkparent==>", this.activatebutton);
    console.log("deactivatebuttonclkparent==>", this.deactivatebutton);
  }
  blockunblock(data) {
    this.id = data.id;
    this.is_blocked = data.is_blocked;
    if (this.is_blocked == true) {
      this.payload = {
        id: this.id,
        is_blocked: false,
      };
    } else {
      this.payload = {
        id: this.id,
        is_blocked: true,
      };
    }

    this.atmaService.blockunblock(this.payload).subscribe((result) => {
      if (result.id > 0 || result.id != undefined) {
        if (result.is_blocked == true) {
          this.notification.showSuccess("Blocked Success");
        } else {
          this.notification.showSuccess("UnBlocked Success");
        }

        // this.getBranch();
        this.branchsummary();
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      } else {
        this.notification.showError("failes");
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      }
    });
  }
  modifyblockunblock(data) {
    this.id = data.new_data.id;
    this.is_blocked = data.new_data.is_blocked;
    if (this.is_blocked == true) {
      this.payload = {
        id: this.id,
        is_blocked: false,
      };
    } else {
      this.payload = {
        id: this.id,
        is_blocked: true,
      };
    }

    this.atmaService.blockunblock(this.payload).subscribe((result) => {
      if (result.id > 0 || result.id != undefined) {
        if (result.is_blocked == true) {
          this.notification.showSuccess("Blocked Success");
          this.branch_data = [];
        } else {
          this.notification.showSuccess("UnBlocked Success");
          this.branch_data = [];
        }

        // this.getBranch();
        // this.Summaryvendorobj = {
        //   method: "get",
        //   url: this.url + "venserv/vendor/" + this.vendorId + "/branch",
        //   params: "",
        // };
        // this.vendormodifysummary();
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      } else {
        this.notification.showError("failes");
        this.getmodification_vender();
        // this.SpinnerService.hide();
        return false;
      }
    });
  }
  actionlevel(id) {
    this.actionid = id;
    this.popupopen3()
    // this.handleclick(this.actionid)
  }
  handleclick(actionid: number) {
    if (actionid === 2) {
      // this.checker();
    } else if (actionid === 3) {
      // this.headapprover();
    } else if (actionid === 4) {
      this.approver();
    } else if (actionid === 5) {
      this.rejectRemarks();
    }
    // this.closepopup3()
  }
  //BUG ID:8908
  quitchanges() {
    // this.atmaService.modificationrequest(this.vendorId, this.status = 2)
    // let data=this.shareService.vendorView.value

    // let datatosubmit= {
    //   "mainstatus_name":data.mainstatus_name,
    //   "requeststatus_name" : data.requeststatus_name,
    //   "vendor_status_name" : data.vendor_status_name

    // }

    // this.atmaService.quitchanges(this.vendorId,datatosubmit)
    this.atmaService.quitchanges(this.vendorId).subscribe((result) => {
      if (result.code) {
        this.notification.showError(result.description);
        return false;
      }
      if (result.status == "success") {
        // this.notification.showSuccess("Done")
        this.notification.showSuccess("Success");
        this.ngOnInit();
        this.vendor_flag = true;
        this.ismodification = false;
        this.renewal_flag = false;
        this.onCancel.emit();
        this.shareService.vendorViewHeaderName.next("")
        this.sharedService.MyModuleName = "Vendor"
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true,
        });
      } else {
        this.notification.showError("something went wrong try again");
      }
    });
  }

  // quitchanges(){
  //   this.atmaService.approverreject(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,'reject')
  //   .subscribe(result => {
  //     if (result.status == 'success') {
  //       this.notification.showSuccess("Done")
  //       // this.atmaService.modificationrequest(this.vendorId, this.status = 2)
  //       this.atmaService.rejectStatus(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,' Reject')
  //         .subscribe(result => {
  //           this.notification.showSuccess("Success")
  //           this.ngOnInit();
  //           this.vendor_flag = true;
  //           this.ismodification = false;
  //           this.renewal_flag = false;
  //           this.onCancel.emit()
  //           this.router.navigate(["/atma/vendor"], {
  //             skipLocationChange: true
  //           })        })
  //     } else {
  //       this.notification.showError("something went wrong try again")
  //     }
  //   })
  // }

  vendorDelete() {
    this.atmaService.vendorDelete(this.vendorId).subscribe((result) => {
      if (result.status == "success") {
        this.notification.showSuccess("Done");
        // this.atmaService.modificationrequest(this.vendorId, this.status = 2)
        this.notification.showSuccess("Success");
        this.ngOnInit();
        this.vendor_flag = true;
        this.ismodification = false;
        this.renewal_flag = false;
        this.onCancel.emit();
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true,
        });
      } else {
        this.notification.showError("something went wrong try again");
      }
    });
  }
  isPortal: boolean;
  isPortalForm: boolean;
  isPortalEditForm: boolean;
  groupform: boolean;
  groupsummary: boolean;
  portal_view() {
    this.isPortal = true;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;
  }

  //Portal User
  portalCancel() {
    this.isPortal = true;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;
    this.closebuttonportalform.nativeElement.click();
  }

  portalSubmit() {
    this.isPortal = true;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;
    this.closebuttonportalform.nativeElement.click();
  }

  portalEditSubmit() {
    this.isPortalEditForm = false;
    this.isPortal = true;
    this.isPortalForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;
    this.closebuttonportaledit.nativeElement.click();
  }

  portalEditCancel() {
    this.isPortalEditForm = false;
    this.isPortal = true;
    this.isPortalForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;

    this.closebuttonportaledit.nativeElement.click();
  }

  portalviewCancel() {
    this.isPortal = true;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.groupform = false;
    this.groupsummary = false;

    this.closebuttonportalview.nativeElement.click();
  }

  addportal() {
    this.vendorData.code
      ? (this.isPortalForm = true)
      : (this.isPortalForm = true);
    this.isPortal = true;
    this.shareService.vendorID.next(this.vendorId);
  }

  groupview() {
    this.branchSummary = false;
    this.isActivity = false;
    this.istax = false;
    this.isBranch = false;
    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.isContractor = false;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.isTransaction = false;
    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.client_RMView = false;
    this.contractor_RMView = false;
    this.product_RMView = false;
    this.document_RMView = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = true;
    this.groupsummary = true;
  }

  addgroup() {
    this.branchSummary = false;
    this.isActivity = false;
    this.istax = false;
    this.isBranch = false;
    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.isContractor = false;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.isTransaction = false;
    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.client_RMView = false;
    this.contractor_RMView = false;
    this.product_RMView = false;
    this.document_RMView = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = true;
    this.groupsummary = true;
  }

  closegroup() {
    this.branchSummary = false;
    this.isActivity = false;
    this.istax = false;
    this.isBranch = false;
    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.isContractor = false;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.isTransaction = false;
    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.client_RMView = false;
    this.contractor_RMView = false;
    this.product_RMView = false;
    this.document_RMView = false;
    this.isPortal = false;
    this.isPortalForm = false;
    this.isPortalEditForm = false;
    this.groupform = false;
    this.groupsummary = true;
    this.groupformclose.nativeElement.click();
  }
  riskoption(pageNumber = 1, pageSize = 10) {
    this.popupopen2()
    this.atmaService.riskoption().subscribe((result) => {
      this.riskoptionList = result["data"];
      // let dataPagination = result['pagination'];
      // if (this.riskoptionList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isVendorSummaryPagination = true;
      // } if (this.riskoptionList <= 0) {
      //   this.isVendorSummaryPagination = false;
      // }

      console.log("VendorSummary", result);
    });
  }
  // Sample Function
  SummaryvendorData: any = [
    { columnname: "Code", key: "code" },
    {
      columnname: "Name",
      key: "name",
      style: { color: "blue" },
      function: true,
      clickfunction: this.branchView.bind(this),
    },

    { columnname: "PAN No", key: "panno" },

    { columnname: "GST No", key: "gstno" },

    { columnname: "Credits Terms", key: "creditterms" },

    { columnname: "Limit Days", key: "limitdays" },

    {
      columnname: "Edit",
      key: "remarks",
      button: true,
      validate: true,
      function: true,
      validatefunction: this.editfunction.bind(this),
      clickfunction: this.branchEditForm.bind(this),
    },

    {
      columnname: "Status",
      key: "is_blocked",
      validate: true,
      validatefunction: this.blockfunction.bind(this),
    },

    {
      columnname: "Block/Unblock",
      key: "toggle",
      toggle: true,
      function: true,
      clickfunction: this.blockunblock.bind(this),
      validate: true,
      validatefunction: this.togglefunction.bind(this),
    },
    {
      columnname: "Action",
      key: "Action",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.statusfunction.bind(this),
      clickfunction: this.active_inactive.bind(this),
    },
  ];

  SummaryclientData: any = [
    { columnname: "Name", key: "name" },

    {
      columnname: "Address",
      key: "address_id",
      type: "object",
      objkey: "line1",
    },

    {
      columnname: "City",
      key: "city",
      validate: true,
      validatefunction: this.citysum.bind(this),
    },

    {
      columnname: "District",
      key: "district",
      validate: true,
      validatefunction: this.distsum.bind(this),
    },

    {
      columnname: "State",
      key: "state",
      validate: true,
      validatefunction: this.statesum.bind(this),
    },

    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.RMView_client.bind(this),
    
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.clienteditfunction.bind(this),
      clickfunction: this.clientEditForm.bind(this),
    },
  ];

  SummarycontractorData: any = [
    { columnname: "Name", key: "name" },

    { columnname: "Service", key: "service" },

    { columnname: "Remarks", key: "remarks" },

    // {
    //   columnname: "View",
    //   icon: "visibility",
    //   button: true,
    //   function: true,
    //   clickfunction: this.RMView_contractor.bind(this),
    // },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.contractoreditfn.bind(this),
      clickfunction: this.contractEditForm.bind(this),
    },
  ];

  SummarytaxData: any = [
    { columnname: "PAN No", key: "panno" },

    { columnname: "Tax", key: "tax", type: "object", objkey: "name" },

    { columnname: "Sub Tax", key: "subtax", type: "object", objkey: "name" },

    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.RMView_branchtax.bind(this),
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxeditfn.bind(this),
      clickfunction: this.Taxedit.bind(this),
    },

    {
      columnname: "Download",
      key: "remarkss",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxphotoalbumfn.bind(this),
      clickfunction: this.downattach.bind(this),
    },

    {
      columnname: "Delete",
      key: "remark",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxdeletefn.bind(this),
      clickfunction: this.delete_tax.bind(this),
    },
  ];

  SummaryproductData: any = [
    { columnname: "Name", key: "name" },

    { columnname: "Type", key: "type" },

    { columnname: "Age", key: "age" },

    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.RMView_product.bind(this),
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.producteditfn.bind(this),
      clickfunction: this.productEditForm.bind(this),
    },
  ];

  summarydocdata = [
    {
      columnname: "Partner Id",
      key: "partner_id",
    },
    {
      columnname: "Doc Group Name",
      key: "docgroup_id",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Date",
      key: "date",
      type: "date",
    },
    {
      columnname: "Remarks",
      key: "remarks",
    },
    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.RMView_document.bind(this),
    },

    {
      columnname: "Edit",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.doceditfunction.bind(this),
      clickfunction: this.documentEdit.bind(this),
    },
    {
      columnname: "Delete",
      key: "remarkss",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.docdeletfunction.bind(this),
      clickfunction: this.deletedocument.bind(this),
    },
  ];

  SummarytranData = [
    {
      columnname: "Comments",
      key: "comments",
    },
    {
      columnname: "From Name",
      key: "from_id",
      type: "object",
      objkey: "full_name",
    },
    {
      columnname: "Create Date",
      key: "set_created_date",
      type: "date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "To Name",
      key: "to_id",
      type: "object",
      objkey: "full_name",
    },
    {
      columnname: "Remarks",
      key: "remarks",
    },
  ];

  SummarymodifyvendorData: any = [
    { columnname: "Code", key: "new_data", type: "object", objkey: "code" },
    {
      columnname: "Name",
      key: "branchname",
      function: true,
      clickfunction: this.modifybranchView.bind(this),
      validate: true,
      validatefunction: this.branchnamemodifyfn.bind(this),
    },

    { columnname: "PAN No", key: "new_data", type: "object", objkey: "panno" },

    { columnname: "GST No", key: "new_data", type: "object", objkey: "gstno" },

    {
      columnname: "Credits Terms",
      key: "new_data",
      type: "object",
      objkey: "creditterms",
    },

    {
      columnname: "Limit Days",
      key: "new_data",
      type: "object",
      objkey: "limitdays",
    },

    {
      columnname: "Status",
      key: "is_blocked",
      validate: true,
      validatefunction: this.blockmodifyfunction.bind(this),
    },

    {
      columnname: "Edit",
      key: "remarks",
      button: true,
      validate: true,
      function: true,
      validatefunction: this.editmodifyfunction.bind(this),
      clickfunction: this.branchmodifyEditForm.bind(this),
    },

    {
      columnname: "Block/Unblock",
      key: "toggle",
      toggle: true,
      function: true,
      clickfunction: this.modifyblockunblock.bind(this),
      validate: true,
      validatefunction: this.togglemodifyfunction.bind(this),
    },
    {
      columnname: "Action",
      key: "Action",
      button: true,
      validate: true,
      validatefunction: this.statusmodifyfunction.bind(this),
      clickfunction: this.active_inactive_modify.bind(this),
    },
  ];
  SummaryclientmodifyData: any = [
    { columnname: "Name", key: "new_data", type: "object", objkey: "name" },

    {
      columnname: "Address",
      key: "add",
      validate: true,
      validatefunction: this.modifyaddvalue.bind(this),
    },

    {
      columnname: "City",
      key: "city",
      validate: true,
      validatefunction: this.modifycityvalue.bind(this),
    },

    {
      columnname: "District",
      key: "dist",
      validate: true,
      validatefunction: this.modifydistvalue.bind(this),
    },

    {
      columnname: "State",
      key: "state",
      validate: true,
      validatefunction: this.modifystatevalue.bind(this),
    },

    {
      columnname: "Status",
      validate: true,
      validatefunction: this.clientmodifystatusfn.bind(this),
    },

    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.modify_client.bind(this),
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.clientmodifyeditfn.bind(this),
      clickfunction: this.modifyclientEditForm.bind(this),
    },
  ];

  SummarycontractormodfiyData: any = [
    { columnname: "Name", key: "new_data", type: "object", objkey: "name" },

    {
      columnname: "Service",
      key: "new_data",
      type: "object",
      objkey: "service",
    },

    {
      columnname: "Remarks",
      key: "new_data",
      type: "object",
      objkey: "remarks",
    },

    {
      columnname: "Status",
      validate: true,
      validatefunction: this.contractormodifystatusfn.bind(this),
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.contractormodifyeditfn.bind(this),
      clickfunction: this.modifycontractEditForm.bind(this),
    },
  ];
  SummarytaxmodfiyData: any = [
    { columnname: "PAN No", key: "panno" },

    { columnname: "Tax", key: "tax", type: "object", objkey: "name" },

    { columnname: "Sub Tax", key: "subtax", type: "object", objkey: "name" },
    {
      columnname: "Status",
      validate: true,
      validatefunction: this.taxmodifystatusfn.bind(this),
    },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxmodifyeditfn.bind(this),
      clickfunction: this.Taxedit.bind(this),
    },

    {
      columnname: "Download",
      key: "remarkss",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxphotoalbumfn.bind(this),
      clickfunction: this.downattach.bind(this),
    },

    {
      columnname: "Delete",
      key: "remark",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.taxmodifydeletefn.bind(this),
      clickfunction: this.delete_tax.bind(this),
    },
  ];

  SummaryproductmodifyData: any = [
    { columnname: "Name", key: "new_data", type: "object", objkey: "name" },

    { columnname: "Type", key: "new_data", type: "object", objkey: "type" },

    { columnname: "Age", key: "new_data", type: "object", objkey: "age" },

    {
      columnname: "Status",
      validate: true,
      validatefunction: this.productmodifystatusfn.bind(this),
    },
    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.productmodifyeditfn.bind(this),
      clickfunction: this.modifyproductEditForm.bind(this),
    },
  ];

  SummarydocumentmodifyData: any = [
    {
      columnname: "Partner Id",
      key: "new_data",
      type: "object",
      objkey: "partner_id",
    },
    {
      columnname: "Doc Group Name",
      key: "new_data",
      validate: true,
      validatefunction: this.modifygroupnamevalue.bind(this),
    },
    {
      columnname: "Date",
      key: "new_data",
      type: "object",
      objkey: "date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Remarks",
      key: "new_data",
      type: "object",
      objkey: "remarks",
    },
    {
      columnname: "Status",
      key: "status",
      validate: true,
      validatefunction: this.modifystatusfun.bind(this),
    },
    {
      columnname: "Action",
      key: "action",
      validate: true,
      function: true,
      validatefunction: this.modifyaction.bind(this),
      clickfunction: this.documentmodifyEdit.bind(this),
      button: true,
    },
    {
      columnname: "Delete",
      key: "delete",
      validate: true,
      function: true,
      validatefunction: this.modifydelete.bind(this),
      clickfunction: this.deletedocumentmodify.bind(this),
      button: true,
    },
  ];

  blockfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "Inactive/Unblocked",
    };
    if (!data.is_active && data.is_blocked) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Inactive/Blocked",
      };
    } else if (!data.is_active && !data.is_blocked) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Inactive/Unblocked",
      };
    } else if (data.is_active && data.is_blocked) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Active/Blocked",
      };
    } else if (data.is_active && !data.is_blocked) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Active/UnBlocked",
      };
    }
    return config;
  }
  editfunction(branch) {
    // var myModal = new (bootstrap as any).Modal(document.getElementById("editgroup"), {
    //   keyboard: false,
    // });
    // myModal.show();
    let config: any = {
      disabled: false,
      style: "",
      icon: "edit",
      class: "",
      value: "",
      function: false,
    };
    // if (this.vendor_flag == true) {
    //   if (branch.modify_ref_id > 0) {
    //     config = {
    //       disabled: true,
    //       style: { color: "gray" },
    //       icon: "edit",
    //       class: "",
    //       value: "",
    //       function: false,
    //     };
    //   }
    //   if (branch.modify_ref_id == "-1" && branch.is_blocked == false) {
    //     config = {
    //       disabled: false,
    //       style: { color: "green" },
    //       icon: "edit",
    //       class: "",
    //       value: "",
    //       function: true,
    //     };
    //   }
    //   if (branch.modify_ref_id == "-1" && branch.is_blocked == true) {
    //     config = {
    //       disabled: true,
    //       style: { color: "gray" },
    //       icon: "edit",
    //       class: "",
    //       value: "",
    //       function: false,
    //     };
    //   }
    // }
    if(this.vendor_flag == true){
      if (branch.modify_ref_id == "-1" && branch.is_blocked == false) {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
      else{
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      }
    } 
    else {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  statusfunction(branch) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "edit",
      class: "",
      value: "",
      function: false,
    };
    // if (this.vendor_flag == true) {
    //   if (branch.modify_ref_id > 0) {
    //     config = {
    //       disabled: true,
    //       style: { color: "gray" },
    //       icon: "wb_sunny",
    //       class: "",
    //       value: "",
    //       function: false,
    //     };
    //   }
    //   if (
    //     branch.modify_ref_id == "-1" &&
    //     branch.is_blocked == false &&
    //     this.requestStatusName != "Onboard"
    //   ) {
    //     config = {
    //       disabled: false,
    //       style: { color: "green" },
    //       icon: "wb_sunny",
    //       class: "",
    //       value: "",
    //       function: true,
    //     };
    //   }
    //   if (
    //     branch.modify_ref_id == "-1" &&
    //     branch.is_blocked == true &&
    //     this.requestStatusName != "Onboard"
    //   ) {
    //     config = {
    //       disabled: true,
    //       style: { color: "gray" },
    //       icon: "wb_sunny",
    //       class: "",
    //       value: "",
    //       function: false,
    //     };
    //   }
    //   if (branch.modify_ref_id == "-1" && this.requestStatusName == "Onboard") {
    //     config = {
    //       disabled: true,
    //       style: { color: "gray" },
    //       icon: "wb_sunny",
    //       class: "",
    //       value: "",
    //       function: false,
    //     };
    //   }
    // }
    if(this.vendor_flag == true){
      if((branch.modify_ref_id > 0) ||
        (branch.modify_ref_id == "-1" &&
        branch.is_blocked == true &&
        this.requestStatusName != "Onboard") || 
      (branch.modify_ref_id == "-1" && this.requestStatusName == "Onboard")){
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "wb_sunny",
          class: "",
          value: "",
          function: false,
        };
      }
      else if (branch.modify_ref_id == "-1" &&
      branch.is_blocked == false &&
      this.requestStatusName != "Onboard"){
        config = {
          disabled: false,
          style: {color:  branch.is_active ?"#007338": "red"}, // color: red
          icon: "wb_sunny",
          class: "",
          value: "",
          function: true,
        };
      }
    } 
    else {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "wb_sunny",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  togglefunction(branch) {
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };
    if (
      this.vendor_flag == true &&
      branch.is_blocked == false &&
      branch.modify_ref_id == "-1" &&
      this.requestStatusName != "Onboard"
    ) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: !this.checked,
        function: true,
      };
    } else if (
      this.vendor_flag == true &&
      branch.is_blocked == true &&
      this.requestStatusName != "Onboard" &&
      branch.modify_ref_id == "-1"
    ) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: this.checked,
        function: true,
      };
    } else if (
      this.vendor_flag == true &&
      this.requestStatusName == "Onboard" &&
      branch.modify_ref_id == "-1"
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    } else if (
      this.vendor_flag == true &&
      branch.is_blocked == true &&
      branch.modify_ref_id > 0
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    } else if (
      this.vendor_flag == true &&
      branch.modify_ref_id > 0 &&
      branch.is_blocked == false &&
      branch.is_active == false
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    } else if (
      this.vendor_flag == true &&
      branch.modify_ref_id > 0 &&
      branch.is_blocked == false &&
      branch.is_active == true
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    }

    return config;
  }
  // togglefunction(branch) {
  //   let config: any = {
  //     disabled: false,
  //     style: "",
  //     class: "",
  //     value: "",
  //     checked: "",
  //     function: false,
  //   };
  //   if (
  //     this.vendor_flag == true &&
  //     branch.is_blocked == false &&
  //     branch.modify_ref_id == "-1" &&
  //     this.requestStatusName != "Onboard"
  //   ) {
  //     config = {
  //       disabled: false,
  //       style: "",
  //       class: "",
  //       value: "",
  //       checked: !this.checked,
  //       function: true,
  //     };
  //   } else if (
  //     this.vendor_flag == true &&
  //     branch.is_blocked == true &&
  //     this.requestStatusName != "Onboard" &&
  //     branch.modify_ref_id == "-1"
  //   ) {
  //     config = {
  //       disabled: false,
  //       style: "",
  //       class: "",
  //       value: "",
  //       checked: this.checked,
  //       function: true,
  //     };
  //   } else if (
  //       (this.vendor_flag == true &&
  //       this.requestStatusName == "Onboard" &&
  //       branch.modify_ref_id == "-1") || 
  //       (this.vendor_flag == true &&
  //         branch.is_blocked == true &&
  //         branch.modify_ref_id > 0) || 
  //         (this.vendor_flag == true &&
  //           branch.modify_ref_id > 0 &&
  //           branch.is_blocked == false &&
  //           branch.is_active == false) || 
  //           ( this.vendor_flag == true &&
  //             branch.modify_ref_id > 0 &&
  //             branch.is_blocked == false &&
  //             branch.is_active == true) || 
  //             (this.vendor_flag == false)
  //   ) {
  //     config = {
  //       disabled: true,
  //       style: { color: "gray" },
  //       class: "",
  //       value: "",
  //       checked: this.checked,
  //       function: false,
  //     };
  //   }

  //   return config;
  // }
  branchnamemodifyfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (data.new_data.modify_status == 1) {
      config = {
        disabled: false,
        style: { color: "blue", cursor: "pointer" },
        icon: "",
        class: "",
        value: data.new_data.name,
        function: true,
      };
    } else if (
      data.new_data.modify_status == 2 ||
      data.new_data.modify_status == 0 ||
      data.new_data.modify_status == 3 ||
      data.new_data.modify_status == 4
    ) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: data.new_data.name,
        function: false,
      };
    }
    return config;
  }
  blockmodifyfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
    };
    // if (data.new_data.modify_status == 1) {
    //   config = {
    //     disabled: false,
    //     style: "",
    //     icon: "",
    //     class: "",
    //     value: "Create",
    //   };
    // } else if (data.new_data.modify_status == 2) {
    //   config = {
    //     disabled: false,
    //     style: "",
    //     icon: "",
    //     class: "",
    //     value: "Edit",
    //   };
    // } else if (data.new_data.modify_status == 0) {
    //   config = {
    //     disabled: false,
    //     style: "",
    //     icon: "",
    //     class: "",
    //     value: "Delete",
    //   };
    // } else if (data.new_data.modify_status == 3) {
    //   if (!data.new_data.is_active) {
    //     config = {
    //       disabled: false,
    //       style: "",
    //       icon: "",
    //       class: "",
    //       value: "Inactive",
    //     };
    //   } else if (data.new_data.is_active) {
    //     config = {
    //       disabled: false,
    //       style: "",
    //       icon: "",
    //       class: "",
    //       value: "Active",
    //     };
    //   }
    // } else if (data.new_data.modify_status == 4) {
    //   if (!data.new_data.is_blocked) {
    //     config = {
    //       disabled: false,
    //       style: "",
    //       icon: "",
    //       class: "",
    //       value: "UnBlocked",
    //     };
    //   } else if (data.new_data.is_blocked) {
    //     config = {
    //       disabled: false,
    //       style: "",
    //       icon: "",
    //       class: "",
    //       value: "Blocked",
    //     };
    //   }
    // }

    if (data.new_data.modify_status == 1) {
      config.value = "Create";
    } else if (data.new_data.modify_status == 2) {
      config.value = "Edit";
    } else if (data.new_data.modify_status == 0) {
      config.value = "Delete";
    } else if (data.new_data.modify_status == 3) {
      config.value = data.new_data.is_active ? "Active" : "Inactive";
    } else if (data.new_data.modify_status == 4) {
      config.value = data.new_data.is_blocked ? "Blocked" : "Unblocked";
    }
    return config;
  }
  editmodifyfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "edit",
      class: "",
      value: "",
      function: false,
    };
    if (
    (  data.new_data.modify_ref_id != data.new_data.id &&
      data.new_data.modify_status == 1) ||
      (data.new_data.modify_status == 3 ||
        data.new_data.modify_status == 4)
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      (data.new_data.modify_ref_id == data.new_data.id &&
      data.new_data.modify_status == 1) ||
      (data.new_data.modify_status == 2 &&
      data.new_data.modify_ref_id != true)
    ) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  statusmodifyfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "edit",
      class: "",
      value: "",
      function: false,
    };
    console.log("color==============>",data.new_data.is_active)
    console.log("icon color==============>","icon-"+data.new_data.is_active)
    if (
      ((data.new_data.modify_ref_id != data.new_data.id &&
        data.new_data.modify_status == 3) ||
        data.new_data.modify_status == 4 ||
        data.new_data.modify_status == 2) ||
      (data.new_data.modify_status == 1)
    ) {
      config = {
        disabled: true,
        style: {color:  data.new_data.is_active ?"#007338": "red"}, // color: red
        icon: "wb_sunny",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      data.new_data.modify_ref_id == data.new_data.id &&
      data.new_data.modify_status == 3
    ) {
      config = {
        disabled: false,
        style: {color:  data.new_data.is_active ?"#007338": "red"},
        icon: "wb_sunny",
        class: "icon-" + data.new_data.is_active,
        value: "",
        function: true,
      };
    } 
    return config;
  }
  togglemodifyfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };
    if (data.new_data.is_blocked == false && data.new_data.modify_status == 4) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: !this.checked,
        function: true,
      };
    } else if (
      data.new_data.is_blocked == true &&
      data.new_data.modify_status == 4
    ) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: this.checked,
        function: true,
      };
    } else if (
      data.new_data.modify_status == 2 ||
      data.new_data.modify_status == 3 ||
      data.new_data.modify_status == 1
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        class: "",
        value: "",
        checked: this.checked,
        function: false,
      };
    }
    return config;
  }
  clienteditfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == -1) {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }

    return config;
  }
  modifyaddvalue(data) {
    let config: any = {
      value: data.new_data.address_id.line1,
    };
    return config;
  }
  modifycityvalue(data) {
    let config: any = {
      value: data.new_data.address_id.city_id.name,
    };
    return config;
  }
  modifydistvalue(data) {
    let config: any = {
      value: data.new_data.address_id.district_id.name,
    };
    return config;
  }
  modifystatevalue(data) {
    let config: any = {
      value: data.new_data.address_id.state_id.name,
    };
    return config;
  }
  clientmodifystatusfn(data) {
    let config: any = {
      value: "",
    };
    if (data.new_data.modify_status == 1) {
      config = {
        value: "Create",
      };
    } else if (data.new_data.modify_status == 2) {
      config = {
        value: "Edit",
      };
    } else if (data.new_data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }

    return config;
  }
  clientmodifyeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (
      (data.new_data.modify_ref_id != data.new_data.id &&
      data.new_data.modify_status == 1) ||
      ( data.new_data.modify_status == 2 &&
        data.new_data.modify_ref_id == true)
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      (data.new_data.modify_ref_id == data.new_data.id &&
      data.new_data.modify_status == 1) ||
      (data.new_data.modify_status == 2 &&
      data.new_data.modify_ref_id != true)
    ) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  contractoreditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  contractormodifystatusfn(data) {
    let config: any = {
      value: "",
    };
    if (data.new_data.modify_status == 1) {
      config = {
        value: "Create",
      };
    }
    if (data.new_data.modify_status == 2) {
      config = {
        value: "Edit",
      };
    }
    if (data.new_data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }
    return config;
  }
  contractormodifyeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (
      (data.new_data.modify_ref_id != data.new_data.id &&
      data.new_data.modify_status == 1) ||
      (data.new_data.modify_status == 2 &&
      data.new_data.modify_ref_id == true)
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      (data.new_data.modify_ref_id == data.new_data.id &&
      data.new_data.modify_status == 1) ||
      (data.new_data.modify_status == 2 &&
        data.new_data.modify_ref_id != true)
    ) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    }
    return config;
  }
  taxeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  taxphotoalbumfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (data.isexcempted == "Y") {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "photo_album",
        class: "",
        value: "",
        function: true,
      };
    } else if (data.isexcempted == "N") {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "photo_album",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  taxdeletefn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "delete",
          class: "",
          value: "",
          function: false,
        };
      }
      if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: {
            color: "green",
          },
          icon: "delete",
          class: "",
          value: "",
          function: true,
        };
      }
    }
    else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: {
          color: "gray",
        },
        icon: "delete",
        class: "disabled_icon",
        value: "",
        function: false,
      };
    }
    return config;
  }
  taxmodifystatusfn(data) {
    let config: any = {
      value: "",
    };
    if (data.modify_status == 1) {
      config = {
        value: "Create",
      };
    }
    if (data.modify_status == 2) {
      config = {
        value: "Update",
      };
    }
    if (data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }
    return config;
  }
  taxmodifyeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if ((data.modify_ref_id != data.id && data.modify_status == 1) ||
        (data.modify_status == 2 && data.modify_ref_id == true)) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if ((data.modify_ref_id == data.id && data.modify_status == 1) ||
               (data.modify_status == 2 && data.modify_ref_id != true)) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  taxmodifydeletefn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (data.modify_status != 0) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "delete",
        class: "",
        value: "",
        function: true,
      };
    }
    if (data.modify_status == 0) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "delete",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  producteditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  productmodifystatusfn(data) {
    let config: any = {
      value: "",
    };
    if (data.new_data.modify_status == 1) {
      config = {
        value: "Create",
      };
    }
    else if (data.new_data.modify_status == 2) {
      config = {
        value: "Edit",
      };
    }
    else if (data.new_data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }
    return config;
  }
  productmodifyeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (
      (data.new_data.modify_ref_id != data.new_data.id &&
      data.new_data.modify_status == 1) || 
      (data.new_data.modify_status == 2 &&
      data.new_data.modify_ref_id == true)
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      (data.new_data.modify_ref_id == data.new_data.id &&
      data.new_data.modify_status == 1) ||
      ( data.new_data.modify_status == 2 &&
        data.new_data.modify_ref_id != true)
    ) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  doceditfunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if ((data.modify_ref_id == "-1") || 
      (data.docgroup_id.id != 13 && data.docgroup_id.id != 14 && data.document.modify_ref_id == "-1")) {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      } 
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  docdeletfunction(datas) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if ((datas.modify_ref_id == "-1") ||
          (datas.docgroup_id.id != 13 && datas.docgroup_id.id != 14)) {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "delete",
          class: "",
          value: "",
          function: true,
        };
      }  else if (datas.modify_ref_id == 0 || datas.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "delete",
          class: "",
          value: "",
          function: false,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "delete",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  docmodificationtd(tddata) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (tddata.modify_status == 1) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Create",
      };
    } else if (tddata.modify_status == 2) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Edit",
      };
    } else if (tddata.modify_status == 0) {
      config = {
        disabled: false,
        style: "",
        icon: "",
        class: "",
        value: "Delete",
      };
    }

    return config;
  }
  docmodificationedit(datam) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if ((datam.modify_ref_id != datam.id && datam.modify_status == 1) ||
        (datam.modify_status == 2 && datam.modify_ref_id == true)) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if ((datam.modify_ref_id == datam.id && datam.modify_status == 1) ||
               (datam.modify_status == 2 && datam.modify_ref_id != true)) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  docmodificationdelete(deldata) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (deldata.modify_status != 0) {
      config = {
        disabled: true,
        style: "",
        icon: "delete",
        class: "disabled_icon",
        value: "",
        function: false,
      };
    }
    return config;
  }

  modifygroupnamevalue(data) {
    let config: any = {
      value: data.new_data.docgroup_id.name,
    };
    return config;
  }
  modifystatusfun(statusdata) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (statusdata.new_data.modify_status == 1) {
      config = {
        value: "Create",
      };
    } else if (statusdata.new_data.modify_status == 2) {
      config = {
        value: "Edit",
      };
    } else if (statusdata.new_data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }
    return config;
  }
  modifyaction(actiondata) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (
      (actiondata.new_data.modify_ref_id != actiondata.new_data.id &&
      actiondata.new_data.modify_status == 1) ||
      (actiondata.new_data.modify_status == 2 &&
       actiondata.new_data.modify_ref_id == true)
    ) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if (
      (actiondata.new_data.modify_ref_id == actiondata.new_data.id &&
      actiondata.new_data.modify_status == 1) ||
      (actiondata.new_data.modify_status == 2 &&
       actiondata.new_data.modify_ref_id != true)
    ) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    } 
    return config;
  }
  modifydelete(deletefun) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (deletefun.new_data.modify_status != 0) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "delete",
        class: "",
        value: "",
        function: true,
      };
    } else if (deletefun.new_data.modify_status == 0) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "delete",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }

  citysum(data) {
    let config: any = {
      value: data.address_id.city_id.name,
    };
    return config;
  }
  distsum(data) {
    let config: any = {
      value: data.address_id.district_id.name,
    };
    return config;
  }
  statesum(data) {
    let config: any = {
      value: data.address_id.state_id.name,
    };
    return config;
  }
  SummaryApiclientObjNew: any;
  SummaryApicontractorObjNew: any;
  SummaryApitaxObjNew: any;
  SummaryApiproductObjNew: any;
  SummaryApiObjtransaction: any;
  SummaryApiObjdocument: any;
  Summaryvendormodifyobj: any;
  SummaryApiclientmodifyObjNew: any;
  SummaryApicontractormodifyObjNew: any;
  SummaryApitaxmodifyObjNew: any;
  SummaryApiproductmodifyObjNew: any;
  SummaryApidocumentmodifyObjNew: any;

  branchsummary() {
    this.Summaryvendorobj = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/branch",
      params: "",
    };
  }
  clientsummary() {
    this.SummaryApiclientObjNew = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/client",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.client_modify = true;
      this.getmodification_vender();
    }
  }
  contractorsummary() {
    this.SummaryApicontractorObjNew = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/contractor",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.contract_modify = true;
    }
  }
  taxsummary() {
    this.SummaryApitaxObjNew = {
      method: "get",
      url: this.url + "venserv/branch/" + this.vendorId + "/suppliertax",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.tax_modify = true;
    }
  }
  productsummary() {
    this.SummaryApiproductObjNew = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/product",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.product_modify = true;
    }
  }

  transactionsummary() {
    this.SummaryApiObjtransaction = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/history",
    };
  }
  documentsummary() {
    this.SummaryApiObjdocument = {
      method: "get",
      url: this.url + "venserv/vendor/" + this.vendorId + "/vendordocument",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      // this.branch_data = [];
      this.getmodification_vender();
      this.document_modify = true;
    }
  }

  vendormodifysummary() {
    this.Summaryvendormodifyobj = {
      FeSummary: true,
      data: this.branch_data,
    };
  }
  clientmodifysummary() {
    this.SummaryApiclientmodifyObjNew = {
      FeSummary: true,
      data: this.client_data,
    };
    console.log("client_data ======>", this.client_data);
  }
  contractormodifysummary() {
    this.SummaryApicontractormodifyObjNew = {
      FeSummary: true,
      data: this.contract_data,
    };
    console.log("contract_data ======>", this.contract_data);
  }
  taxmodifysummary() {
    this.SummaryApitaxmodifyObjNew = {
      FeSummary: true,
      data: this.tax_data,
    };
    console.log("tax_data ======>", this.tax_data);
  }
  productmodifysummary() {
    this.SummaryApiproductmodifyObjNew = {
      FeSummary: true,
      data: this.product_data,
    };
    console.log("product_data ======>", this.product_data);
  }

  documentmodifysummary() {
    this.SummaryApidocumentmodifyObjNew = {
      FeSummary: true,
      data: this.document_data,
    };
    console.log("document_data", this.document_data);
  }

  risktransaction(pageNumber = 1, pageSize = 10) {
    this.popupopen1()
    this.atmaService
      .risktransaction(pageNumber, pageSize, this.vendoridd)
      .subscribe((result) => {
        this.risktransactionList = result["data"];
        let dataPagination = result["pagination"];
        if (this.risktransactionList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        }
        if (this.risktransactionList <= 0) {
          this.isVendorSummaryPagination = false;
        }

        console.log("VendorSummary", result);
      });
  }

  closepopup() {
    if (this.isClientForm) {
      this.clientCancel();
    } else if (this.isBranchForm) {
      this.branchCancel();
    } else if (this.isContractorForm) {
      this.contractorCancel();
    } else if (this.Branchtaxadd) {
      this.branchtaxaddcancl();
    } else if (this.isProductForm) {
      this.productCancel();
    } else if (this.isDocumentForm) {
      this.documentCancel();
    } else if (this.isDocumentForm){
      this.documentCancel();
    } else if (this.isBranchEditForm){
      this.branchEditCancel();
    } else if (this.client_RMView) {
      this.clientCancel();
    } else if (this.product_RMView) {
      this.productCancel()
    } else if (this.document_RMView) {
      this.documentCancel()
    } else if (this.isClientEditForm) {
      this.clientEditCancel()
    } else if (this.isContactorEditForm) {
      this.contractorEditCancel()
    } else if (this.taxedit) {
      this.taxeditcancel()
    } else if (this.isProductEditForm){
      this.productEditCancel()
    } else if (this.isDocumentEditForm){
      this.documentEditCancel()
    } else if (this.contractor_RMView) {
      this.contractorCancel()
    } else if (this.branchtax_RMView) {
      this.branchtaxaddcancl()
    }
  }

  closedpopup() {
    this.closeaddpopup.nativeElement.click();
  }
  closedpopups() {
    this.closesthpopup.nativeElement.click();
  }

  modifybranchView(data) {
    this.shareService.branchView.next(data.new_data);
    this.router.navigate(["/atma/branchView"], {
      skipLocationChange: true,
    });
  }

  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("risktransaction"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("riskList"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen4() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("DeactivateModal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("activateModal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  closepopup1(){
    this.closespopup.nativeElement.click();
  }
  closepopup3(){
    this.closebutton.nativeElement.click();
  }
}
