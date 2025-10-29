import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/service/shared.service';
import { TnebService } from '../tneb.service';

@Component({
  selector: 'app-electricity-detail-summary',
  templateUrl: './electricity-detail-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./electricity-detail-summary.component.scss']
})
export class ElectricityDetailSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  detailSearch: FormGroup;
  EleMakerSummaryList: any;
  ispaymentpage: boolean = true;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  count=0;
  statusdetails:any={'Submitted':0,'Approve':1,'Rejected':3};
  constructor(private spinner:NgxSpinnerService,private router:Router,private tnebService: TnebService,private shareService: SharedService,
    private fb:FormBuilder, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.detailSearch=this.fb.group({
      'consumer_status':[''],
      'consumer_no':[''],
      'consumer_name':['']
    })
   this.getSummaryList(1,10);
  }

  addElectricity(){
    this.router.navigate(['/tneb/electricityexpense/addElectricity'], { skipLocationChange: true  })
  }

  clickConsumerNo(list){
    list.summarycheck=1

    this.shareService.submodulestneb.next(list);
    // this.router.navigate(['/tneb/viewEleDetail'], {skipLocationChange: true})
    this.router.navigate(['/tneb/electricityexpense/addElectricity'], { skipLocationChange: true })

  }


  // summary List
  getSummaryList(pageNumber,pageSize=10) {
    this.spinner.show()
    this.tnebService.getEleMakerSummaryLis( pageNumber, pageSize,'','','')
      .subscribe((results) => {
        this.spinner.hide()
        console.log("elemakerSumy", results,results['count'])
        this.count=results?.count? results.count:0
        let datas = results["data"];
        this.EleMakerSummaryList = datas;
        let datapagination = results["pagination"];
        this.EleMakerSummaryList = datas;
        if (this.EleMakerSummaryList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.EleMakerSummaryList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }
  
  searchsummarydata(pageNumber=1,pageSize=10){
    // let consumer_status:any=this.detailSearch.get('consumer_status').value !=undefined?this.statusdetails[this.detailSearch.get('consumer_status').value]:'';
    // let consumer_no:any=this.detailSearch.get('consumer_no').value !=undefined?this.detailSearch.get('consumer_no').value:'';
    // let consumer_name:any=this.detailSearch.get('consumer_name').value !=undefined?this.detailSearch.get('consumer_name').value:'';

    let consumer_status=(this.detailSearch.value.consumer_status)? this.detailSearch.value.consumer_status:''
    let consumer_no=(this.detailSearch.value.consumer_no)? this.detailSearch.value.consumer_no:''
    let consumer_name=(this.detailSearch.value.consumer_name)? this.detailSearch.value.consumer_name:''

    console.log(consumer_status,consumer_no,consumer_name)

    // this.getSummaryList(1,10)

    this.spinner.show()
    this.tnebService.getEleMakerSummaryLis( pageNumber=1,pageSize=10,consumer_status,consumer_no,consumer_name)
    .subscribe((results) => {
      this.spinner.hide()

      console.log("elemakerSumy", results)
      let datas = results["data"];
      this.EleMakerSummaryList = datas;
      let datapagination = results["pagination"];
      this.count=results?.count? results.count:0

      // this.EleMakerSummaryList = datas;

     
        this.has_paymentnext = datapagination.has_next;
        this.has_paymentprevious = datapagination.has_previous;
        this.paymentpresentpage = datapagination.index;
        this.ispaymentpage = true
      

    })
  }
  resetdata(){
    this.detailSearch.reset('');
    this.getSummaryList(this.paymentpresentpage,10);
  }
  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.getSummaryList( this.paymentpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.getSummaryList( this.paymentpresentpage - 1, 10)
    }


  }

  
}
