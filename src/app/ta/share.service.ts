import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public TourMakerEditId = new BehaviorSubject<string>('');
  public TourMakerEditpatch= new BehaviorSubject<string>('');
  public TourapproveviewId= new BehaviorSubject<string>('');
  public advancesummaryData=new BehaviorSubject<string>('');
  public advanceapprove=new BehaviorSubject<string>('');
  public approveview=new BehaviorSubject<string>('');
  public expensesummaryData=new BehaviorSubject<string>('');
  public expenseforwardkeyaccesss=new BehaviorSubject<string>('');
  public dropdownvalue=new BehaviorSubject<string>('');
  public expenseedit=new BehaviorSubject<string>('');
  public fetchValue=new BehaviorSubject<string>('');
  public fetchData=new BehaviorSubject<string>('');
  public tourData=new BehaviorSubject<string>('');
  public empData=new BehaviorSubject<string>('');
  public report=new BehaviorSubject<string>('');
  public tourreasonid=new BehaviorSubject<string>('');
  public emptourreasonid=new BehaviorSubject<string>('');
  public tourno=new BehaviorSubject<string>('');
  public emp_id=new BehaviorSubject<string>('');
  public grade=new BehaviorSubject<string>('');
  public branch_id=new BehaviorSubject<string>('');
  public from_date=new BehaviorSubject<string>('');
  public to_Date=new BehaviorSubject<string>('');
  public radiovalue=new BehaviorSubject<string>('');
  public expensetourid=new BehaviorSubject<string>('');
  public forwardData=new BehaviorSubject<string>('');
  public TA_Ap_Exp_Enb_type = new BehaviorSubject<any>(false);
  public id=new BehaviorSubject<string>('');
  public Recovery_maker=new BehaviorSubject<any>(false);
  public Recovery_checker=new BehaviorSubject<any>(false);
  public expence_list=new BehaviorSubject<any>('');
  public is_admin_approve=new BehaviorSubject<any>(false);
 


  constructor() { }
}
