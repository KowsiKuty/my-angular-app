import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HighlightSpanKind } from 'typescript';
import { RmuApiServiceService } from '../rmu-api-service.service';

@Component({
  selector: 'app-files-selection',
  templateUrl: './files-selection.component.html',
  styleUrls: ['./files-selection.component.scss', '../rmustyles.css']
})
export class FilesSelectionComponent implements OnInit {
  @Input('getfiles') getfiles;
  @Output() sendfiles: EventEmitter<any> = new EventEmitter();
  fileSrc: any;
  fileslist: DataTransfer = new DataTransfer;
  filedetailarray = []
  @ViewChild('fileinput') fileinput: ElementRef;
  fileid: any;
  filename: any;
  showpdf: boolean;
  constructor(
    private rmuservice: RmuApiServiceService
  ) { }

  ngOnInit(): void {
    this.getfiles.data.forEach(detail => {
      this.pushfiledetails(detail);
    })
  }

  fileget(evt) {

    for (let file of evt.target.files) {
      this.pushfiledetails(file)
      this.fileslist.items.add(file);
    }
    this.fileinput.nativeElement.files = this.fileslist.files;
    this.sendtoparent();
  }
  viewfile(ind) {
    if (this.filedetailarray[ind]?.id) {
      let filevalue = this.filedetailarray[ind]
      this.fileid = filevalue.id;
      this.filename = filevalue.name;
      //apicall
    }
    else {
      const file = this.fileslist.files[ind]
      this.filename = file.name;
      const reader = new FileReader();
      reader.onload = e => this.fileSrc = reader.result;
      reader.readAsDataURL(file);
    }
    this.checkfileextension();
  }

  checkfileextension() {
    let extension = this.filename;
    extension = extension.split('.').pop;
    this.showpdf = false;
    if (extension == 'pdf') {
      this.showpdf = true;
    }
  }
  removefile(ind) {

    if (this.filedetailarray[ind]?.id) {
      //apicall
    }
    else {
      this.fileslist.items.remove(ind);
      this.fileinput.nativeElement.files = this.fileslist.files;
      this.sendtoparent();
    }
    this.filedetailarray.splice(ind, 1)
  }

  pushfiledetails(detail) {
    let obj = { name: detail.name }
    this.filedetailarray.push(obj);
  }

  sendtoparent() {
    this.sendfiles.emit(this.fileslist.files);
  }
}
