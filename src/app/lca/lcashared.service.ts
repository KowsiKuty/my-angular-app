import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Results {
  branch: string; 
  employee: string;
}
@Injectable({
  providedIn: 'root'
})

export class LcasharedService {

  constructor() { }
  public header_deatils = new BehaviorSubject<string>('');
  public viewvalue=new BehaviorSubject<string>('');
  public appReject = new BehaviorSubject<boolean>(false);
}
