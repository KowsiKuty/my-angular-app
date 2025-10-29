import { Component,OnInit,Output,EventEmitter,ViewChild} from '@angular/core';
import {ShareService} from '../share.service'

@Component({
  selector: 'app-servicemodification',
  templateUrl: './servicemodification.component.html',
  styleUrls: ['./servicemodification.component.scss']
})
export class ServicemodificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();

  modificationdata: any;
 
  constructor(private shareservice:ShareService) { }

  ngOnInit(): void {
    this.modificationdata = this.shareservice.modification_data.value;
  }
  Cancel(){
    this.onCancel.emit()
  }
}
