import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
    public ecfheader = new BehaviorSubject<string>('');
    public ecfapproveheader = new BehaviorSubject<string>('');
    public crno = new BehaviorSubject<string>('');
    public invheaderid = new BehaviorSubject<string>('');
    public ecfheaderedit = new BehaviorSubject<string>('');
    public captalised = new BehaviorSubject<boolean>(false);
    public coview = new BehaviorSubject<string>('');
    public salesheaderedit =  new BehaviorSubject<string>('');
    public batchviewid =  new BehaviorSubject<string>('');
    public batchamt =  new BehaviorSubject<string>('');
    public batchdate =  new BehaviorSubject<string>('');
    public ecfheaderdata = new BehaviorSubject<any>('');
    public comefrom = new BehaviorSubject<string>('');
    public batchdatas = new BehaviorSubject<any>('');
    public batchviewdatas = new BehaviorSubject<any>('');
    public ecfwiseApprove = new BehaviorSubject<any>('');
    public invhdrstatus_id = new BehaviorSubject<string>('');
    public bounceapid = new BehaviorSubject<string>('');
    public editkey = new BehaviorSubject<string>('');
    public bounceapdata = new BehaviorSubject<any>('');
    public modificationFlag = new BehaviorSubject<string>('');
    public approveBatchData = new BehaviorSubject<any>('');
    public approveViewIndex = new BehaviorSubject<any>('');
    public invhdrstatus = new BehaviorSubject<string>('');
    public commodity_id = new BehaviorSubject<string>('');
    public ecfviewdata = new BehaviorSubject<any>('');
    public batchview = new BehaviorSubject<string>('');
    public invhdrdata = new BehaviorSubject<any>('');
    public detailsview = new BehaviorSubject<string>('');
    public addheader = new BehaviorSubject<string>('');
    public inwardDatalist = new BehaviorSubject<any>(''); 
    public ECFData =  new BehaviorSubject<any>('');
    public ponumber =  new BehaviorSubject<any>('');
    public inwardData =  new BehaviorSubject<string>('');
    public approvaltype =  new BehaviorSubject<number>(0);
    public batchECFHdrIndex =  new BehaviorSubject<number>(0);
    public batchOrEcfView =  new BehaviorSubject<string>('');
    public ecfsummarytype = new BehaviorSubject<number>(1);
    public po_no = new BehaviorSubject<string>('');
    public apmodification = new BehaviorSubject<string>('')
    public submodule_name = new BehaviorSubject<string>('');
    // public selectedTempData = new BehaviorSubject<any>(undefined);

}
