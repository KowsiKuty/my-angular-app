import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtpcShareService {
  public LosCurrentPage = new BehaviorSubject<string>('');
  public Los_Data = new BehaviorSubject<string>('');
  public Invoice_Data = new BehaviorSubject<string>('');
  public Invoice_isEdit = new BehaviorSubject<string>('');
  public LOSpatchmaindatas = new BehaviorSubject<string>('');
  public LOS_INV_APP_id = new BehaviorSubject<string>('');
  public GSTtype = new BehaviorSubject<string>('');
  public LOS_INV_APP_data = new BehaviorSubject<string>('');
  public viewdata = new BehaviorSubject<string>('');
  public LOS_id = new BehaviorSubject<string>('');
  
  

  constructor() { }
}
