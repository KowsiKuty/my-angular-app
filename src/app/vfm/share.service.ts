import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
   public vehiclesummaryData = new BehaviorSubject<string>('');
   public vehicledetailData = new BehaviorSubject<string>('');
   public vehicleId = new BehaviorSubject<string>('');
   public modification_data = new BehaviorSubject<string>('');
   public makerstatus = new BehaviorSubject<any>('');   //4860

  constructor() { }
}
