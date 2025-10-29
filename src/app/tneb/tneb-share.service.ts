import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TnebShareService {

  summaryscreen=true;

  constructor() { }
  public viewelecdetails=new BehaviorSubject<any>('');

  
  public ebboardid=new BehaviorSubject<any>('');
  
  public ebregionid=new BehaviorSubject<any>('');


}
