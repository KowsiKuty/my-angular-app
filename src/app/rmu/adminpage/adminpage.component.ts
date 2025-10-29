import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BarcoderAssignComponent } from '../barcoder-assign/barcoder-assign.component';
import { ArchivalformComponent } from '../archivalform/archivalform.component';
import { AddbarcodesComponent } from '../addbarcodes/addbarcodes.component';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit {
  
  assignsummarylist=[];
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  constructor(private fb: FormBuilder,public dialog: MatDialog, public formbuilder : FormBuilder, private notification: NotificationService,private router:Router, private rmuservice:RmuApiServiceService) {  }
  archforms: FormGroup;
  breakpoint = 4;

  ngOnInit(): void {

    this.archforms = this.fb.group({
      department:['',Validators.required],
      product :null,
      barcode_type:null,
      barcode_category:null,
      address:null,
      count:null,
    })
  }
  queryparams={
    barcodes:'add'
  };
  onResize(evt){
    this.breakpoint = (evt.target.innerWidth > 700) ? 3:2;
  }

  openbarcode()
  {
    this.queryparams,
    this.router.navigate(['rmu/addbarcodes'],{queryParams: this.queryparams});
      // this.dialog.open(AddbarcodesComponent, {
      //   disableClose:true,
      //   width:'60%',
      //   panelClass:'mat-container'
      // });
    
  }
  assignbarcode()
  {
    //this.queryparams,
    this.router.navigate(['rmu/barcodeassign'],{}); 
  }
  barcodesummary()
  {
   // this.queryparams,
    this.router.navigate(['rmu/barcodesummary'],{}); 
  }
  archivaladmin()
  {
   // this.queryparams,
    this.router.navigate(['rmu/archivaladmin'],{});  
  }

  retrievaladmin(){
    this.router.navigate(['rmu/retrieval-admin-summary'],{})
  }
  destroydocuments()
  {
    this.router.navigate(['rmu/destroyapprove'],{})
  }

  // getassignbarcodesummary(){
  //   var val ='';
  //   this.rmuservice.getbarcodeapproverarchivals(val,this.pagination.index).subscribe(results =>{
  //     this.assignsummarylist = results['data'];
  //     this.pagination = results.pagination?results.pagination:this.pagination;
  //   })
  // }
  // nextpage(){
  //   if(this.pagination.has_next){
  //     this.pagination.index = this.pagination.index+1
  //   }
  //   this.getassignbarcodesummary()
  // }

  // prevpage(){
  //   if(this.pagination.has_previous){
  //     this.pagination.index = this.pagination.index-1

  //   }
  //   this.getassignbarcodesummary()
  // }
  
    

}
