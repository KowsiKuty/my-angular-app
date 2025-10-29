import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class BreShareServiceService {

  constructor() { }

  public brexpid = new BehaviorSubject<string>('') ;
  public approveComeFrom = new BehaviorSubject<string>('') ;
  public bretoecfid = new BehaviorSubject<string>('') ;
  public bretoecfViewOrEdit = new BehaviorSubject<string>('') ;

   
}
