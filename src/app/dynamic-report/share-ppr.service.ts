import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharePprService {
  public chartparam = new BehaviorSubject<any>('');
  public finyear_data =new BehaviorSubject<any>('');
  public schema_name =new BehaviorSubject<any>('');
  public connection_id =new BehaviorSubject<any>('');
  public multi_single_scheme =new BehaviorSubject<any>('');
  constructor() { }
}
