import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { masterService } from '../master.service';
export interface empname{
  name:string;
  id:string;
}
export interface empcode{
  name:string;
  id:string;
}
@Component({
  selector: 'app-emp-bank-summary',
  templateUrl: './emp-bank-summary.component.html',
  styleUrls: ['./emp-bank-summary.component.scss']
})
export class EmpBankSummaryComponent implements OnInit {
  empform:any=FormGroup;
  pageSize:number=10;
  presentPage:number=1;
  has_next:boolean=false;
  has_pre:boolean=false;
  empnamelist:Array<any>=[];
  empcodelist:Array<any>=[];
  empdatalist:Array<any>=[];
  isLoading:boolean=false;
  constructor(private fb:FormBuilder,private masterservice:masterService) { }

  ngOnInit(): void {
    this.empform=this.fb.group({
      'name':new FormControl(''),
      'code':new FormControl('')
    });
    this.getsummarydata(this.presentPage);
  }
  getsummarydata(page:any){
    let pages=''+page;
    if(this.empform.get('name').value !=undefined && this.empform.get('name').value !='' && this.empform.get('name').value !=""){
      pages=pages+'&data='+this.empform.get('name').value;
      console.log(pages)
    }
    console.log(pages)
    this.masterservice.getempbankaddsummarys(pages).subscribe(data=>{
      this.empdatalist=data['data'];
      let pagination=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_pre=pagination.has_previous;
    });
  }
  getsummarysearch(){
    this.getsummarydata(this.presentPage);
  }
  hasnext(){
    if(this.has_next){
      this.getsummarydata(this.presentPage+1);
    }
  }
  has_previous(){
    if(this.has_pre){
      this.getsummarydata(this.presentPage-1);
    }
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }
}
