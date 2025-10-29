import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grn-create',
  templateUrl: './grn-create.component.html',
  styleUrls: ['./grn-create.component.scss']
})
export class GrnCreateComponent implements OnInit {

  fileData:any
  constructor() { }

  ngOnInit(): void {
  }


  selectFile(event) {
    this.fileData = event.target.files[0];

    if (this.fileData.type == 'image/jpeg' || this.fileData.type == 'application/pdf') {

    } else {
      alert("file type should be image of pdf")
      return;
    }

  }

}
