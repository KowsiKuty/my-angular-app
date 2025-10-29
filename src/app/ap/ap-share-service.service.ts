import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class ApShareServiceService {

  public inward_id=new BehaviorSubject<any>('');
  public invoice_count=new BehaviorSubject<any>('');
  public apheader_id=new BehaviorSubject<any>('');
  public apinvHeader_id=new BehaviorSubject<any>('');
  public crNo=new BehaviorSubject<any>('');
  public commonsummary = new BehaviorSubject<any>('');
  public apAmount=new BehaviorSubject<any>('');
  public ECFFlagChange = new BehaviorSubject<any>('');
  public inwardHdrNo=new BehaviorSubject<any>('');
 
  //ECF
  public ecfheader = new BehaviorSubject<string>('');
  public ecfapproveheader = new BehaviorSubject<string>('');
  public invheaderid = new BehaviorSubject<string>('');
  public ecfheaderedit = new BehaviorSubject<string>('');
  public coview = new BehaviorSubject<string>('');
  constructor() { }
}

