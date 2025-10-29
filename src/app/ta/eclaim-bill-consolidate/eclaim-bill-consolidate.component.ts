import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {TaService} from '../ta.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eclaim-bill-consolidate',
  templateUrl: './eclaim-bill-consolidate.component.html',
  styleUrls: ['./eclaim-bill-consolidate.component.scss']
})
export class EclaimBillConsolidateComponent implements OnInit {
  eclaimbillmodal:any;
  taeclaimbillForm:FormGroup;
  getconsolidateList:any=[];
  has_previous:boolean=false;
  has_next:boolean=false;
  presentpage:number=1;
  pageSize:number=10;
  constructor(private taservice:TaService,private fb:FormBuilder,public spinner:NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.taeclaimbillForm=this.fb.group({
      'requestno':new FormControl()
    })
    this.billSearch(1);
  }
  totalcount:any;
  billSearch(page){
    let tour_no:any;
   if(this.taeclaimbillForm.get('requestno').value==''||this.taeclaimbillForm.get('requestno').value==null||this.taeclaimbillForm.get('requestno').value==undefined){
    tour_no='';
   }else{
    tour_no=this.taeclaimbillForm.get('requestno').value;
   }
    this.spinner.show()
    this.taservice.getconsolidatereport(page,tour_no)
    .subscribe(result =>{
      this.spinner.hide()
      this.getconsolidateList=result['data'];
      if(this.getconsolidateList.length>0){
        let pagination=result['pagination'];
        this.totalcount=result['count'];
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.presentpage=pagination.index;
      }
      
    },error=>{
      this.spinner.hide()
    })
  }
reset(){
  this.taeclaimbillForm.reset()
  this.billSearch(1);
}
previousClick(){
  if(this.has_previous===true){
    this.presentpage-=1;
    this.billSearch(this.presentpage)

    
  }
}
nextClick(){
  if(this.has_next===true){
    this.presentpage+=1;
   this.billSearch(this.presentpage)

    
  }
}

}
