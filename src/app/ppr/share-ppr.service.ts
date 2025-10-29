import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharePprService {
  isSideNav = false;
  public chartparam = new BehaviorSubject<any>('');
  public chartshown = new BehaviorSubject<any>('');
  public finyear_data =new BehaviorSubject<any>('')
  constructor() { }
}
