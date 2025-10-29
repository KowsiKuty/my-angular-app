import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationServiceService {
  private menuTabClickCall = new Subject<any>();
  menuTabClick$ = this.menuTabClickCall.asObservable();

  triggerMenuTabClick(payload: any) {
    this.menuTabClickCall.next(payload);
  }
}
