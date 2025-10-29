import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {TaService} from "../ta.service";
import {ShareService} from "../share.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';


@Component({
  selector: 'app-employee-tour-report',
  templateUrl: './employee-tour-report.component.html',
  styleUrls: ['./employee-tour-report.component.scss']
})
export class EmployeeTourReportComponent implements OnInit {
  taempreportForm:FormGroup;
  empreportmodal:any;
  getempreportList:any;
  id:any;
  empname:any;
  has_previous:boolean=false;
  has_next:boolean=false;
  presentpage:number=1;
  pageSize:number=10;
  data:any;
  
  constructor(private taservice:TaService,private router:Router,
    private shareservice:ShareService,private fb:FormBuilder,public spinner: NgxSpinnerService,private toastr:ToastrService,public sharedService: SharedService) { }

  ngOnInit(): void {
    this.taempreportForm=this.fb.group({
      'requestno':new FormControl()

    })
   this.empreportSearch(1);
  }
  total_count:any
  empreportSearch(page){
    let tour_no:any;
    if(this.taempreportForm.get('requestno').value ==''||this.taempreportForm.get('requestno').value==null|| this.taempreportForm.get('requestno').value==undefined){
      tour_no='';
    }else{
      tour_no=this.taempreportForm.get('requestno').value;
    }
    this.spinner.show()
    this.taservice.getemptourreport(page,tour_no)
    .subscribe(result=> {
      this.spinner.hide()
      this.getempreportList=result['data']
        if(this.getempreportList.length>0){
         let pagination=result['pagination'];
         this.total_count=result['count'];
         this.has_next=pagination.has_next;
         this.has_previous=pagination.has_previous;
         this.presentpage=pagination.index;
       }
    },error=>{
    this.spinner.hide()
  })
  
  this.shareservice.empData.next( this.id)
}
  reset(){
    this.taempreportForm.reset();
    this.empreportSearch(1);
  }
  download(){
    let tourno:any;
    tourno=this.taempreportForm.get('requestno').value?this.taempreportForm.get('requestno').value:'';
    this.spinner.show();
     this.taservice.getempreportdownload(tourno).subscribe((results) => {
      this.spinner.hide();
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Employee Tour Report'+".xlsx";
          link.click();
          
          })
  }
  gettourdetail(report){
    this.data = { index: 3 }
    this.sharedService.summaryData.next(this.data)
    this.shareservice.tourreasonid.next(report)
    this.router.navigateByUrl("ta/reporttourdetail")
  }
  gettourexpense(report){
    this.data = { index: 3 }
    this.sharedService.summaryData.next(this.data)
    this.shareservice.expensetourid.next(report)
    this.router.navigateByUrl("ta/reporttourexpense")
  }
  previousClick(){
    if(this.has_previous===true){
      this.presentpage -=1
      this.empreportSearch(this.presentpage)
    }

  }
nextClick(){
  if(this.has_next===true){
    this.presentpage +=1
    this.empreportSearch(this.presentpage)
  }

}
}
