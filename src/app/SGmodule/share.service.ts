import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class SGShareService {

  public employementcat=new BehaviorSubject<any>(''); 
  public employementtype=new BehaviorSubject<any>('');
  public minwages=new BehaviorSubject<any>('');
  public statezone=new BehaviorSubject<any>('');
  public vendor=new BehaviorSubject<any>('');
  public branchData=new BehaviorSubject<any>('');
  public noofzones=new BehaviorSubject<any>('');
  public statezoneedit=new BehaviorSubject<any>('');
  public vendormarkup=new BehaviorSubject<any>('');
  // Attendance
  public Attedanceemp=new BehaviorSubject<any>('');
  public Attendancedate=new BehaviorSubject<any>('');
  // verndormapping for vendor
  public vendormappingdetails=new BehaviorSubject<any>('');
  public employeepatch=new BehaviorSubject<any>('');
  //editbranchcertifyform
  public brachEditValue=new BehaviorSubject<any>('');
  public premisesName=new BehaviorSubject<any>('');
  public brachName=new BehaviorSubject<any>('');
  public branchCertifateId=new BehaviorSubject<any>(''); 
  public invoiceEditValue=new BehaviorSubject<any>('');  
  public invoiceSummaryDetails=new BehaviorSubject<any>('');
  public key=new BehaviorSubject<any>('');
  public key1=new BehaviorSubject<any>('');   
  public searchdata=new BehaviorSubject<any>('');
  public agencyname=new BehaviorSubject<any>('');

  // holiday master 

  public hoildaykeyview=false;
  public hoildaykeyadd=false;
  public holidaysummarydata=new BehaviorSubject<any>('');
  public holidayupdate = new BehaviorSubject<any>('');

  constructor() { }
}




