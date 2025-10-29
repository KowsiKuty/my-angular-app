import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { TnebService } from '../tneb.service';

@Component({
  selector: 'app-elec-details-tran-summary',
  templateUrl: './elec-details-tran-summary.component.html',
  styleUrls: ['./elec-details-tran-summary.component.scss']
})
export class ElecDetailsTranSummaryComponent implements OnInit {
  @ViewChild('opendialogform') opendialog:TemplateRef<any>;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  electricityform:any=FormGroup;
  summarylist:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  depositdetailsform:any=FormGroup;
  constructor(private tnebservice:TnebService,private matdialog:MatDialog,private spinner:NgxSpinnerService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.electricityform=this.fb.group({
      'consumerno':new FormControl(''),
      'consumername':new FormControl(''),
      'status':new FormControl('')
    });
    this.depositdetailsform=this.fb.group({
      'btnenb':new FormControl(''),
      'depositamount':new FormControl(''),
      'Remarks':new FormControl('')
    });
    this.getsummarydata();
  }
  getsummarydata(){
    this.tnebservice.getpaymenttransactiondetailssummary('',1).subscribe(data=>{
      this.summarylist=data['data'];
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    },
    (error)=>{
      
    }
    )
  }
  opendialogbox(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top:  '0'  ,
      // right: '0'
    };
    dialogConfig.width = '60%' ;
    dialogConfig.height = '300px' ;
    console.log(dialogConfig);
  this.matdialog.open(this.opendialog,dialogConfig);
  }
  closedialogdata(){
    this.matdialog.closeAll();
  }

}
