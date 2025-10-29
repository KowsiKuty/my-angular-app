import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../service/notification.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-destroy',
  templateUrl: './destroy.component.html',
  styleUrls: ['./destroy.component.scss','../rmustyles.css']
})
export class DestroyComponent implements OnInit {

  destroydoclist: any;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  destroyform: FormGroup;
  destroySearch: FormGroup;
  selectall: boolean;
  allchecked = false;
  showbutton = false;
  destroy_search:any;
  searchvar :any = "String";
  constructor(private rmuservice:RmuApiServiceService, private router:Router, private fb: FormBuilder,private SpinnerService:NgxSpinnerService, 
    private snackbar: MatSnackBar, private notification: NotificationService) { 
      this.destroy_search=[
        {"type":"input","label":"Product","formvalue":"producttype"},
        { "type": "date", "label": "Retention Date", "formvalue": "retent_date" },        
        {"type":"input","label":"Document Number","formvalue":"documentnum"},
        {"type":"input","label":"Status","formvalue":"status"},
      ]
    }
    @ViewChild('closedestroypopup')closedestroypopup
    @ViewChild('actionclose') actionclose: ElementRef;
  ngOnInit(): void {




    this.destroyform = this.fb.group({
          id:'',
          archival_id:'',

          comment:''
    })

    this.destroySearch = this.fb.group({
      producttype:'',
      retent_date:'',
      documentnum:'',
      status:'',
    })
    
    this.getdestroysummary('');
  }

  getdestroysummary(data){
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.SpinnerService.show()
    this.rmuservice.getdestroysummary(data,this.pagination.index).subscribe(results =>{
      if(!results){
        this.SpinnerService.hide()
        return false;
      }
      this.SpinnerService.hide()
      this.destroydoclist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
    })
  }

  selectalldocs() {

    if (this.allchecked) {
      for (var i = 0; i < this.destroydoclist.length; i++) {
        this.destroydoclist[i].select = false;
        this.allchecked = false;
        this.selectall = false;
      }
    }
    else {
      for (var i = 0; i < this.destroydoclist.length; i++) {
        this.destroydoclist[i].select = true;
        this.allchecked = true;
        this.selectall = true;
      }
    }
    this.adddocs({ dataall: true, product_barcode: 'All items' })
  }

  adddocs(data)
  {

    if (data?.dataall && this.allchecked) {
      this.snackbar.open(`All items Selected`, '', {
        duration: 2000
      })
      this.showbutton= true;
    }
    else if (data.select) {
      this.snackbar.open(`${data.product_barcode} Selected`, '', {
        duration: 2000
      })
      this.showbutton= true;
    }
    else {
      this.snackbar.open(`${data.product_barcode} Unselected`, '', {
        duration: 2000
      })
      this.showbutton= false;
    }
    let array = this.destroydoclist
    console.log(array)
    array.forEach(element => {
      if (element.select) {
        // element.id = 'new';
        this.createlist(element)
      }
      else {
        // for (let item of this.destroyform.value.details) {
        //   if (item.product_barcode == element.product_barcode) {
        //     // this.deletedocument(element.document_no);
        //   }
        //   else {
        //     continue
        //   }
        // }
      }
    })





  }
 
  createlist(data) {

  }
  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getdestroysummary('')
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getdestroysummary('')
  }

  destroyed(datas)
  {
    this.destroyform.patchValue({
      id: datas.id,
      archival_id:datas.archival_id,
   
      comment : datas.comment,
    })
  }
  destroyDoc()
  {
    console.log("Destroy Form Value",this.destroyform.value);
    this.rmuservice.destroyrequest(this.destroyform.value).subscribe(results => {

      this.destroydoclist = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;


      if (results.status == 'success') {
        this.notification.showSuccess("Requested Successfully ")
        this.closedestroypopup.nativeElement.click();
        // this.closebtn.nativeElement.click();
        this.showbutton= false;
        this.getdestroysummary('');
      }
      else {
        this.notification.showError(results.description)

      }

    })

  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("actionpopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


  close(){
    this.closedestroypopup.nativeElement.click()
  }
}
