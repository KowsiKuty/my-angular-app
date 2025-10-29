import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'

@Component({
  selector: 'app-vendormodification',
  templateUrl: './vendormodification.component.html',
  styleUrls: ['./vendormodification.component.scss']
})
export class VendormodificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
    private fb: FormBuilder) { }
    modificationdata: any;
    // newdirectorname = [];
    // olddirectorname = [];

  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;
    // this.newdirectorname=this.modificationdata.new_data.director;
    // this.olddirectorname=this.modificationdata.old_data.director;
  }

  Cancel() {
    this.onCancel.emit()
  }

}
