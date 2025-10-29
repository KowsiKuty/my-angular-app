import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RemsShareService {
  previousScheduledate:any;
  public ControllingOfficeEdit = new BehaviorSubject<string>('');
  public PremiseEdit = new BehaviorSubject<string>('');
  public PremiseView = new BehaviorSubject<string>('');
  public occupancyEditValue = new BehaviorSubject<string>(' ');
  public landlordEdit = new BehaviorSubject<any>('');
  public landlordSubmit = new BehaviorSubject<any>('');
  public landlordbankEditValue = new BehaviorSubject<string>('');
  public ebadvanceForm = new BehaviorSubject<string>('');
  public ebdetailsEditValue = new BehaviorSubject<any>('');
  public repairEditValue = new BehaviorSubject<string>('');
  public TerminalForm = new BehaviorSubject<string>('');
  public LandLordBankForm = new BehaviorSubject<string>('');
  public InsuranceTypeEdit = new BehaviorSubject<string>('');
  public InsuranceDetailEdit = new BehaviorSubject<string>('');
  public licensetypeEditValue = new BehaviorSubject<string>(' ');
  public licensedetailsEditValue = new BehaviorSubject<string>(' ');
  public landLordView = new BehaviorSubject<string>(' ');
  public amenities = new BehaviorSubject<string>(' ');
  public statutorypaymentId =new BehaviorSubject<any>('');
  public legaldataForm =new BehaviorSubject<any>('');
  public taxForm =new BehaviorSubject<any>('');
  public taxRateForm =new BehaviorSubject<any>('');
  public agreementForm =new BehaviorSubject<any>('');
  public agreementView = new BehaviorSubject<string>(' ');
  public rentForm = new BehaviorSubject<string>(' ');
  public legalClearanceForm = new BehaviorSubject<string>(' ');
  public rentTermForm = new BehaviorSubject<string>(' ');
  public rentArrearForm = new BehaviorSubject<string>(' ');
  public statutoryTypeForm = new BehaviorSubject<string>(' ');
  public ebdetailsForm =new BehaviorSubject<any>('');
  public repairForm =new BehaviorSubject<any>('');
  public legalNoticeForm =new BehaviorSubject<any>('');
  public bankAccountType =new BehaviorSubject<any>('');
  public premiseViewID =new BehaviorSubject<any>('');
  public renovationForm =new BehaviorSubject<any>('');
  public premiseDetailsForm =new BehaviorSubject<any>('');
  public premiseDetailsView =new BehaviorSubject<any>('');
  public brokerDetailsForm =new BehaviorSubject<any>('');
  public documentForm =new BehaviorSubject<any>('');
  public OccupancyView = new BehaviorSubject<string>('');

  public occupancyViewHeaderName = new BehaviorSubject<string>('');
  public PremiseData = new BehaviorSubject<string>('');
  public premiseBackNavigation = new BehaviorSubject<any>(null);
  public identificationForm = new BehaviorSubject<string>(' ');
  public statutoryIdValue = new BehaviorSubject<string>(' ');
  public premiseConnection ='';
  public premiseIdView = new BehaviorSubject<string>(' ');
  public premiseIdnameView = new BehaviorSubject<string>(' ');

  public premiseDocuInfo = new BehaviorSubject<string>(' ');
  public modificationView = new BehaviorSubject<any>(null);
  public premiseEditValue = new BehaviorSubject<string>(' ');
  public repairmaintenanceForm = new BehaviorSubject<string>(' ');
  public remstemplateForm = new BehaviorSubject<string>(' ');

  public ClosureDetailForm = new BehaviorSubject<string>(' ');
  public scheduleView = new BehaviorSubject<string>(' ');
  public scheduleId = new BehaviorSubject<string>(' ');
  public recurringForm = new BehaviorSubject<string>(' ');
  public rentForm1 = new BehaviorSubject<string>(' ');
  public premiseLeased = new BehaviorSubject<boolean>(null);
  public premisenameView = new BehaviorSubject<string>('');
  public premisenameeView = new BehaviorSubject<string>('');
  public agreementStartdate = new BehaviorSubject<string>('');
  public agreementEnddate = new BehaviorSubject<string>('');
  public ExpensesForm = new BehaviorSubject<string>(' ');
  public ebadvanceMForm = new BehaviorSubject<string>('');
  public getinvoicedetail = new BehaviorSubject<string>('');
  public firstTermEnddate = new BehaviorSubject<string>('');
  public scheduleType = new BehaviorSubject<string>('');
  public startagreementEnddate = new BehaviorSubject<string>('');
  public raiseReqView = new BehaviorSubject<string>('');
  public raiseReqFlag = new BehaviorSubject<string>('');
  public scheduleApprovaleView = new BehaviorSubject<string>('');
  public premiseReqStatus = new BehaviorSubject<string>('');
  public premisesStatus = new BehaviorSubject<string>('');
  public premiseArea = new BehaviorSubject<string>('');
  public lastrentamount = new BehaviorSubject<string>('');
  public lastrentincrement = new BehaviorSubject<string>('');
  public agreementDetails = new BehaviorSubject<string>('');
  public premisesCode = new BehaviorSubject<string>('');
  public amenitiesagreementEnddate = new BehaviorSubject<string>('');
  public maintenanceagreementEnddate = new BehaviorSubject<string>('');
  public terminateStartdate = new BehaviorSubject<string>('');
  public terminateEnddate = new BehaviorSubject<string>('');
  public landlordFlag = new BehaviorSubject<boolean>(false);
  public backtosum = new BehaviorSubject<string>('')
  
  constructor() { }
}
