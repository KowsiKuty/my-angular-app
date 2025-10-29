import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SGShareService } from '../share.service';
// import html2canvas from 'html2canvas';
// import jspdf from 'jspdf';

@Component({
  selector: 'app-attendancedetails',
  templateUrl: './attendancedetails.component.html',
  styleUrls: ['./attendancedetails.component.scss']
})
export class AttendancedetailsComponent implements OnInit {

  
  constructor(private _fb: FormBuilder,private datepipe:DatePipe,private shareservice:SGShareService) {}
  ngOnInit() {
    
    
  }
  // title = 'html-to-pdf-angular-application';
  // public convetToPDF()
  // {
  // var data = document.getElementById('contentToConvert');
  // html2canvas(data).then(canvas => {
  // // Few necessary setting options
  // var imgWidth = 208;
  // var pageHeight = 295;
  // var imgHeight = canvas.height * imgWidth / canvas.width;
  // var heightLeft = imgHeight;
   
  // const contentDataURL = canvas.toDataURL('image/png')
  // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  // var position = 0;
  // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  // pdf.save('new-file.pdf'); // Generated PDF
  // });
  // }

}