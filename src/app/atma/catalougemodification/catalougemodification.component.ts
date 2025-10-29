import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
@Component({
  selector: 'app-catalougemodification',
  templateUrl: './catalougemodification.component.html',
  styleUrls: ['./catalougemodification.component.scss']
})
export class CatalougemodificationComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  modify_new_data: any;
  modify_old_data: any;
  new_array1: any[];
  constructor(private shareService: ShareService,
  private fb: FormBuilder) { }
  modificationdata: any;
  data = {}
  new_array:any=[]

  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;

    this.modify_new_data =this.modificationdata.new_data

    this.modify_old_data =this.modificationdata.old_data

    this.new_array  = []
    for (let a of this.modify_new_data?.configuration){
      let das={
        id:a?.id,
        "Specification":a?.specification,
        configuration:a?.configuration
      }
      this.new_array.push(das)
    }

    this.new_array1  = []
    for (let a of this.modify_old_data?.configuration){
      let das={
        id:a?.id,
        "Specification":a?.specification,
        configuration:a?.configuration
      }
      this.new_array1.push(das)
    }

    console.log("new array============>",this.new_array)
  }
  Cancel() {
    this.onCancel.emit()
  }}