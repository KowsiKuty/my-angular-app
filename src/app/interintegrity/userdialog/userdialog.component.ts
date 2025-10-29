import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-userdialog',
  templateUrl: './userdialog.component.html',
  styleUrls: ['./userdialog.component.scss']
})
export class UserdialogComponent implements OnInit {

  @Input() mynewValue : string;
  @Output() confirmEvent = new EventEmitter<number>();
  counter : any;

  constructor(
    public dialogRef: MatDialogRef<UserdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(0)
 
  }
  public onContinue(): void{
    this.dialogRef.close(1)
    this.counter = 1;
    this.confirmEvent.emit(this.counter)
 
  }


}
