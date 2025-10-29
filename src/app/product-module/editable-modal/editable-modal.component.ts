import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { EditableDirective } from '../editable.directive';
import { MasterApiServiceService } from '../ProductMaster/master-api-service.service';

@Component({
  selector: 'app-editable-modal',
  templateUrl: './editable-modal.component.html',
  styleUrls: ['./editable-modal.component.scss']
})
export class EditableModalComponent implements OnInit {


  text: boolean = false;
  textarea: boolean = false;
  number: boolean = false;
  date: boolean = false;
  email: boolean = false;
  searchable: boolean = false;
  inputType = 'text';
  itemsList = [];
  nameArray = ['State', 'District', 'City'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data, private apiService: MasterApiServiceService, private datePipe: DatePipe,
    private notification: NotificationService, private dialogRef: MatDialogRef<EditableModalComponent>
  ) {

  }
  value: string = '';
  editedValue: any = null;
  key = ''
  ngOnInit(): void {
    this.value = this.data?.label
    console.log(this.data);
    this.key = this.data?.key
    this.editedValue = this.data.value;
    if (this.data.field == 'searchable') {
      this.editedValue = { name: this.data.value }
    }
    this.data?.field ? this[this.data.field] = true : this.text = true;
    console.log([this.data.field])
    this.inputType = this.data.field ? this.data.field : 'text';

  }

  showValue(subject) {
    return subject?.name || subject?.no
  }

  parseEditedValue() {
    if (this.inputType == 'number') {
      this.editedValue = +this.editedValue;
    }
    else if (this.inputType == 'date') {
      this.editedValue = this.datePipe.transform(this.editedValue, "yyyy-MM-dd");
    }
    else if (this.inputType == 'searchable') {
      if (!this.editedValue?.id) {
        this.notification.showWarning('Please Change/Select Item')
        throw new Error;
      }
      if (this.nameArray.includes(this.value)) {
        if (this.value == 'City') {
          this.editedValue = this.editedValue.city_name;
        }
        else {
          this.editedValue = this.editedValue?.name;
        }
        // else if(this.value == 'District'){
        //   this.editedValue = this.editedValue.district_name;
        // }

      }
      else if (this.value == 'PinCode') {
        this.editedValue = this.editedValue?.no;
      }
      else {
        this.editedValue = this.editedValue?.id;
      }

    }
  }

  updateValue() {
    this.parseEditedValue();
    var payload;
    if (this.data.dataKey) {
      payload = { [this.data.dataKey]: { [this.data.key]: this.editedValue, ...this.data?.additions, ...this.data?.data?.addition } };
    }
    else {
      payload = { [this.data.key]: this.editedValue, ...this.data?.additions, ...this.data?.data?.addition };
    }

    let sub1 = this.apiService.updateEditDetails(this.data.source, payload).subscribe(res => {
      if (res?.status == 'success' || res?.message == 'success') {
        this.dialogRef.close()
        this.apiService.isReload.next('reload');
      }
    })

    this.apiService.subscriptions.push(sub1)
  }
  ngOnDestroy() {
    this.apiService.unsubscibe();
  }

  searchValue() {
    this.apiService.getDropdown(this.key, this.editedValue).subscribe(res => {
      this.itemsList = res['data'];
    })
  }
}

