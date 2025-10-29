import { Component,OnInit,Output,EventEmitter,ViewChild} from '@angular/core';
import {ShareService} from '../share.service'

@Component({
  selector: 'app-documentmodification',
  templateUrl: './documentmodification.component.html',
  styleUrls: ['./documentmodification.component.scss']
})
export class DocumentmodificationComponent implements OnInit {
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
