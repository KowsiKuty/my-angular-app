import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmsShareService {

  constructor() { }
  public approval_data=new BehaviorSubject<any>('');
  public ticket_view=new BehaviorSubject<any>('');
  public approval_view=new BehaviorSubject<any>('');
  public amcedit=new BehaviorSubject<any>('');
  public smsamceditvalue=new BehaviorSubject<any>('');
}
