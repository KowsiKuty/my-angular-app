import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReturnformComponent } from '../returnform/returnform.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss', '../rmustyles.css']
})
export class ReturnComponent implements OnInit {

    constructor(private fb: FormBuilder,  public dialog: MatDialog) { }

    returnsummary: FormGroup;

    ngOnInit(): void {

      this.returnsummary = this.fb.group({
        return_id: '',
        returnDate: '',
        branchname: null,
        action: '',
        status : ''
    }) 
  }

  addNewReturn()
  {
    this.dialog.open(ReturnformComponent,
      {
      disableClose:true,
      width:'60%',
      panelClass:'mat-container'
      })
  }

}
