import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  TokenRefreshintervalId: any;
  isLoggedin = false;
  isSideNav = false;
  Loginname = '';
  Memofrom = '';
  loginUserId = '';
  loginEmpId = '';
  MyModuleName = '';
  transactionList = [];

  masterList = [];
  // get_userlocation:any;

  menuUrlData: Array<any>;
  titleUrl: any;
  
  public is_admin = new BehaviorSubject<any>('')

  public forwardMessage = new BehaviorSubject<string>('');
  public summaryData = new BehaviorSubject<string>('');
  public fetchData = new BehaviorSubject<string>('')
  public imageValue = new BehaviorSubject<any>('')
  public get_userlocation = new BehaviorSubject<any>(' ');
  public fetchDataa = new BehaviorSubject<string>('')
  public deptEditValue = new BehaviorSubject<string>('');
  public categoryEditValue = new BehaviorSubject<string>('');
  public BranchbankEditValue = new BehaviorSubject<string>('');
  public subCategoryEditValue = new BehaviorSubject<string>('');
  public employeeView = new BehaviorSubject<string>('');
  public departmentView = new BehaviorSubject<string>('');
  public empView = new BehaviorSubject<string>(' ');
  public priorityEditValue = new BehaviorSubject<string>(' ');
  public ionName = new BehaviorSubject<string>('');
  public branchreadonly = new BehaviorSubject<number>(0);
  // public menuUrlData = new BehaviorSubject<any>('');
  // public titleUrls = new BehaviorSubject<any>('');
  public subCategoryID = new BehaviorSubject<any>('');
  public memoView = new BehaviorSubject<any>('');
  public memoViews = new BehaviorSubject<any>('');
  public submodulesfa = new BehaviorSubject<any>('')
  public proofingsub = new BehaviorSubject<any>('')
  public submodulestneb = new BehaviorSubject<any>('')
  public submodulessms = new BehaviorSubject<any>('');
  public submodulessmsmaster = new BehaviorSubject<any>('');
  public commonsummary = new BehaviorSubject<any>('');

  public co_do_consumerno = new BehaviorSubject<any>('');
  public vendorViewHeaderName = new BehaviorSubject<string>(' ');

  public vendorView = new BehaviorSubject<string>(' ');
  public prpoeditvalue = new BehaviorSubject<any>(' ');
  public prpoeditvaluekey = new BehaviorSubject<any>(' ');
  public Emc_contactEditValue = new BehaviorSubject<string>('');
  public newentityid=new BehaviorSubject<any>('');
  public clickedvalue=new BehaviorSubject<any>('');
  public ReportsPO=new BehaviorSubject<number>(0);
  public ap_shcedular_sub_module_name=new BehaviorSubject<any>('');

  


  userlocation: boolean;
  prapproverblk: any;




  constructor() { }
}




