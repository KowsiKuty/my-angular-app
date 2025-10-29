import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProisionshareserviceService {
  
  public provisiondata = new BehaviorSubject<string>('');
  public delmatdta = new BehaviorSubject<string>('');


  constructor() { }


}