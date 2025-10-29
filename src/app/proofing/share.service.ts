import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public documentUpload = new BehaviorSubject<string>('');
  public accountEditValue = new BehaviorSubject<string>('');
  public templateEditValue = new BehaviorSubject<string>('');
  public ruleEditValue = new BehaviorSubject<string>('');
  public ruleEditValues = new BehaviorSubject<any>('');

  public agingEditValue = new BehaviorSubject<string>('');
  public accountobject = new BehaviorSubject<object>(null);
  public subcriptions: Subscription[] = [];
  public editvalue = new BehaviorSubject<number>(0);
  public createvalue = new BehaviorSubject<number>(0)
  public backtogltab = new BehaviorSubject<number>(0)
  public uploadsum = new BehaviorSubject<boolean>(false)
  public cardreport = new BehaviorSubject<any>(' ');
  public downloadid = new BehaviorSubject<any>('')
  public backsum = new BehaviorSubject<any>('')


  unsubscibe(){
    console.log(this.subcriptions)
    this.subcriptions?.forEach(element => {
      element.unsubscribe()
    })
    this.subcriptions = [];
  }
  constructor() { }
}