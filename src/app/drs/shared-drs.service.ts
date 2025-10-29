import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDrsService {
  
  isSideNav = false;
  public View_values = new BehaviorSubject<any>('');
  public View_name = new BehaviorSubject<any>('');
  public schedule_flag = new BehaviorSubject<any>('');
  public found_permission = new BehaviorSubject<any>('');
  public ViewFullData = new BehaviorSubject<any>('');
  constructor() { }
}


