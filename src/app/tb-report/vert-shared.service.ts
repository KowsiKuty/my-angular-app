import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VertSharedService {
  isSideNav = false;
  public dropdown_data = new BehaviorSubject<any>('');
  public role_permission=new BehaviorSubject<any>('');
  public Branch_value=new BehaviorSubject<any>('');
  public Branch_value_do=new BehaviorSubject<any>('');
  public Branch_value_show=new BehaviorSubject<any>('');
  public Branchwiselogin_id=new BehaviorSubject<any>('');
  public brnach_login_code=new BehaviorSubject<any>('');
  constructor() { }
}
