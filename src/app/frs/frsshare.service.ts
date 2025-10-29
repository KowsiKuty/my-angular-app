import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FrsshareService {
  public Approvermaker  = new BehaviorSubject<any>('');
  public Status_hide = new BehaviorSubject<any>('');
  public Branch_value = new BehaviorSubject<any>('');
  public cbs_status = new BehaviorSubject<any>('');
  public submoduletab = new BehaviorSubject<any>('');
  public summary_code = new BehaviorSubject<any>('');
  public query_page = new BehaviorSubject<any>('');
  public reverse_data_branch = new BehaviorSubject<any>('');
  public reverse_api_data=new BehaviorSubject<any>('');
  public branch_drop_list=new BehaviorSubject<any>('');
  constructor() { }
}
