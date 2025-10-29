import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
  public jvlist = new BehaviorSubject<string>('');
  public jvstatus = new BehaviorSubject<string>('');
  public jvfulllist = new BehaviorSubject<any>('');

}
