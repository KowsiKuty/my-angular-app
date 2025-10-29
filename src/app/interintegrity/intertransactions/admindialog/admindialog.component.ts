import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-admindialog',
  templateUrl: './admindialog.component.html',
  styleUrls: ['./admindialog.component.scss']
})
export class AdmindialogComponent implements OnInit {

  @Input() mynewValue : string;
  @Output() confirmEvent = new EventEmitter<number>();
  counter : any;

  constructor(
    public dialogRef: MatDialogRef<AdmindialogComponent>,
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
