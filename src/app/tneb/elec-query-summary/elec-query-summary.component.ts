import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/service/shared.service';
import { TnebService } from '../tneb.service';

export interface branchList {
  id: number
  name: string
  code:string
}

export interface boardtype {
  name: string;
  id: number;
}

export interface statelist {
  id: number;
  name: string;
}

export interface occupancy{
  id:number
  occupancy_name:string
  occupancy_code:string
}
export interface region {
  id: number
  region_name: string
  // code:string
}
@Component({
  selector: 'app-elec-query-summary',
  templateUrl: './elec-query-summary.component.html',
  styleUrls: ['./elec-query-summary.component.scss']
})
export class ElecQuerySummaryComponent implements OnInit {
  branchdata: any;
  branch_hasnext=true;
  branch_hasprevious=true;
  branch_currentpage=1;
  count=0;
  isLoading=true;
  branchlist: any;
  occupancydata: any;
  billstatusdata: any;
  select: Date;
  premisesTypeData: any;
  searched_ownership: any;
  usageList: any;
  searched_invoicetype: any;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  codosearchform:any=FormGroup;
  summarydata:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pagesize:number=10;

  statusdata=[
    {'name':'SUBMITTED','value':'1'},
    {'name':'APPROVED','value':'2'},
    {'name':'REJECTED','value':'3'},


  ]

  statedata: any;
  state_has_next = true;
  state_has_previous = true;
  state_presentpage = 1;

  boarddata: any;
  board_hasnext = true;
  board_hasprevious = true;
  board_currentpage = 1;

  regiondata=[];
  has_nextregion=true;
  has_previousregion=true;
  currentpageregion=1;

  querysummaryform:FormGroup


  searched_consumerno='';
  searched_consumerstate='';
  searched_board='';
  searched_region='';
  searched_status='';
  searched_makerisactive='';
  searched_branch='';
  searched_occupancy='';
  searched_billtransactionfromdate='';
  searched_billtransactiontodate='';
  searched_billpaymentstatus='';

  // consumerno,state,board,region,status,makerisactive,branch,occupancy,billtransactionfromdate,billtransactiontodate,billpaymentstatus,page

  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private router:Router,
    private ebservice:TnebService,  private shareService: SharedService,private datepipe:DatePipe) { }

  ngOnInit(): void {
    this.codosearchform=this.fb.group({
      'consumerno':new FormControl(''),
      'consumername':new FormControl(''),
      'branch':new FormControl(''),
      'status':new FormControl(''),
      'state': new FormControl(''),
      'board': new FormControl(''),
      'region': new FormControl(''),
      'active': new FormControl('')
    });

    this.querysummaryform=this.fb.group({
      'consumerno':new FormControl(''),
      'branch':new  FormControl(''),
      'bill_txnfromdate':new FormControl(''),
      'bill_txntodate':new FormControl(''),
      'occupancy':new FormControl(''),
      'ownership':new FormControl(''),
      'paystatus':new FormControl(''),
      'invstatus':new FormControl(''),
      'billtransactiondate':new FormControl(''),
      'billpaymentstatus':new FormControl(''),

      'state':new FormControl(''),
      'board':new FormControl(''),
      'region':new FormControl(''),
      'status':new FormControl(''),
      'makerisactive':new FormControl(''),
      'active':new FormControl(''),
      'ownership_type':new FormControl(''),
      'invoice_type':new FormControl(''),
    })

    this.getbillstatusdata()

    // this.getsummarydata('','','','','','','','',1);
    this.searchsummary(this.presentpage=1)
    this.premisesType()

    this.getUsage()

  }
  navigaredata(){
    this.router.navigate(['tneb/electricitycodomaker']);
  }

  getquerysummarydata(consumerno,state,board,region,status,makerisactive,branch,occupancy,fromdate,todate,billpaymentstatus,ownership_type,invoice,page){
    this.spinner.show()
    this.ebservice.getquerysummary(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,status,board,state,makerisactive,region,ownership_type,invoice,page).subscribe(data=>{
    this.spinner.hide()

      this.summarydata=data['data'];
      this.count=data['count']
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    },
    (error)=>{
      this.spinner.hide()

    }
    )
  }


  getsummarydata(consumer_no,consumer_name,consumer_status,branch,state,board,region,active,page){
    this.spinner.show()
    this.ebservice.getcodoquerydata(consumer_no,consumer_name,consumer_status,branch,state,board,region,active,page).subscribe(data=>{
    this.spinner.hide()

      this.summarydata=data['data'];
      this.count=data['count']
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    },
    (error)=>{
      this.spinner.hide()

    }
    )
  }
  
  nextdata(){
    if(this.has_next){
      

      let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
      let consumer_name=this.codosearchform.value.consumername? this.codosearchform.value.consumername :''
      let branch=this.codosearchform.value.branch.id? this.codosearchform.value.branch.id :''
      let status=this.codosearchform.value.status? this.codosearchform.value.status :''

      let state:any= this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
      let board:any= this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
      let region:any= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
      let active:any= this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';
  
      this.getsummarydata(consumer_no,consumer_name,branch,status,state,board,region,active,this.presentpage+1)
    }
  }
  previousdata(){
    if(this.has_previous){
    
      console.log(this.codosearchform.value)
      let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
    let consumer_name=this.codosearchform.value.consumername? this.codosearchform.value.consumername :''
    let branch=this.codosearchform.value.branch.id? this.codosearchform.value.branch.id :''
    let status=this.codosearchform.value.status? this.codosearchform.value.status :''

    let state:any= this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
    let board:any= this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
    let region:any= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
    let active:any= this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';


    this.getsummarydata(consumer_no,consumer_name,branch,status,state,board,region,active,this.presentpage-1)

    }
  }

  searchdata(){
    let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
    let consumer_name=this.codosearchform.value.consumername? this.codosearchform.value.consumername :''
    let branch=this.codosearchform.value.branch.id? this.codosearchform.value.branch.id :''
    let status=this.codosearchform.value.status? this.codosearchform.value.status :''

    
    let state:any= this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
    let board:any= this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
    let region:any= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
    let active:any= this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';


    console.log('consumer_no',consumer_no,'consumer_name',consumer_name,'branch',branch,'status',status,this.presentpage=1)

    this.getsummarydata(consumer_no,consumer_name,branch,status,state,board,region,active,this.presentpage=1)

  }

  resetdata(){
    // this.codosearchform.reset()
    
    console.log('pristine',this.codosearchform.pristine)

    for(let i in this.codosearchform.value){
      console.log()
    }

    this.codosearchform.patchValue({
      consumerno:'',
      consumername:'',
      branch:'',
      status:'',
      state:'',
      board:'',
      region:'',
      active:'',
    })
    this.select=null
    console.log('this.select',this.select)
    this.searchdata()
  }


  resetqueryfilter(){
    this.querysummaryform.patchValue({
      consumerno:'',
      branch:'',
      bill_txnfromdate:'',
      bill_txntodate:'',
      occupancy:'',
      ownership:'',
      paystatus:'',
      invstatus:'',
      billtransactiondate:'',
      billpaymentstatus:'',
      state:'',
      board:'',
      region:'',
      status:'',
      makerisactive:'',
      active:'',
      ownership_type:'',
      invoice_type:'',
    })
    this.select=null
    console.log('this.selct',this.select)
    this.searchsummary(this.presentpage=1)

  }

  getbranchdata(value,page){
    
    this.ebservice.getbranch(value,page).subscribe(
      result =>{
        this.branchdata = result['data'];
        let datapagination = result['pagination']
        console.log(result)

        if (this.branchdata.length >= 0) {
          this.branch_hasnext = datapagination.has_next;
          this.branch_hasprevious = datapagination.has_previous;
          this.branch_currentpage = datapagination.index;
        }
      }
    )
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    // return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    return branchtype? "("+branchtype.code + ")"+branchtype.name : undefined;

  }

  autocompletebranchnameScroll(){

  }

  public displayregion(region?: region): string | undefined {
    // return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    return region ? region.region_name : undefined;

  }

  getstatelist(value, page) {

    this.ebservice.getstate(value, page).subscribe(
      result => {

        this.statedata = result['data']
        let dataPagination = result['pagination']
        if (this.statedata.length >= 0) {
          this.state_has_next = dataPagination.has_next;
          this.state_has_previous = dataPagination.has_previous;
          this.state_presentpage = dataPagination.index;
        }


      }
    )

  }

  getboard(value, state, page) {


    state = (state) ? state : ''

    this.ebservice.getstatebasedboard(value, state, page).subscribe(
      result => {


        this.boarddata = result['data'];
        let datapagination = result['pagination']
        console.log(result)

        if (this.boarddata.length >= 0) {
          this.board_hasnext = datapagination.has_next;
          this.board_hasprevious = datapagination.has_previous;
          this.board_currentpage = datapagination.index;
        }

      })
  }

  public displaywithboard(boardtype?: boardtype): string | undefined {
    return boardtype ? boardtype.name : undefined;

  }

  public displaystate(data?: statelist): string | undefined {
    return data ? data.name : undefined;
  }

  getregion(value) {
    this.ebservice.getregiondata(value, '', 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.regiondata=datas
        if (this.regiondata.length >= 0) {
          this.has_nextregion = datapagination.has_next;
          this.has_previousregion = datapagination.has_previous;
          this.currentpageregion = datapagination.index;
        }
      })
  }

  clickConsumerNo(list){
    list.summarycheck=3
    this.shareService.submodulestneb.next(list);
    // this.router.navigate(['/tneb/viewEleDetail'], {skipLocationChange: true})
    this.router.navigate(['/tneb/electricityexpense/addElectricity'], { skipLocationChange: true })

  }


  branchname(){
    let prokeyvalue: String = "";
      // this.getbranchid(prokeyvalue);
      this.querysummaryform.get('branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ebservice.getbranch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("branch", datas)
  
        })
  
  
  }


  branchfirstget(){
    this.ebservice.getbranch('',1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        this.isLoading = false

        console.log("branch", datas)
  
      })
  }

  getoccupancydropdowndata(value){
    this.ebservice.getoccupancydata(value).subscribe(
      result=>{
        this.occupancydata=result['data'];
        
      }
    )
  }

  public displayocc(occupancy?: occupancy): string | undefined {
    return occupancy ? "("+occupancy?.occupancy_code+") - " + occupancy.occupancy_name : undefined;
    
  }

  getbillstatusdata(){
    this.ebservice.ebbillstatusdata().subscribe(
      result=>{
        this.billstatusdata=result['data']
      }
    )
  }

  searchsummary(page){
    // let consumerno=this.querysummaryform.value.consumerno? this.querysummaryform.value.consumerno:''
    // let branch=this.querysummaryform.value.branch?.id ? this.querysummaryform.value.branch.id:''
    // let occupancy=this.querysummaryform.value.occupancy?.id ? this.querysummaryform.value.occupancy.id:''
    // // let billtransactiondate= this.querysummaryform.value.billtransactiondate?  this.datepipe.transform(this.querysummaryform.value.billtransactiondate, 'yyyy-MM-dd') :''
    // let billpaymentstatus= this.querysummaryform.value.billpaymentstatus? this.querysummaryform.value.billpaymentstatus:''
  
    // let billtransactionfromdate=this.querysummaryform.value.bill_txnfromdate?  this.datepipe.transform(this.querysummaryform.value.bill_txnfromdate, 'yyyy-MM-dd') :''
    // let billtransactiontodate=this.querysummaryform.value.bill_txntodate?  this.datepipe.transform(this.querysummaryform.value.bill_txntodate, 'yyyy-MM-dd') :''
  

    // let state=this.querysummaryform.value.state?.id ? this.querysummaryform.value.state?.id:'';
    // let board=this.querysummaryform.value.board?.id ? this.querysummaryform.value.board?.id:'' ;
    // let region=this.querysummaryform.value.region?.id ? this.querysummaryform.value.region?.id:'';

    // let status=this.querysummaryform.value.status

    // let makerisactive=this.querysummaryform.value.active

    this.searched_consumerno=this.querysummaryform.value.consumerno? this.querysummaryform.value.consumerno:'';
    this.searched_consumerstate=this.querysummaryform.value.state?.id ? this.querysummaryform.value.state?.id:'';
    this.searched_board=this.querysummaryform.value.board?.id ? this.querysummaryform.value.board?.id:'' ;
    this.searched_region=this.querysummaryform.value.region?.id ? this.querysummaryform.value.region?.id:'';
    this.searched_status=this.querysummaryform.value.status;
    this.searched_makerisactive=this.querysummaryform.value.active
    this.searched_branch=this.querysummaryform.value.branch?.id ? this.querysummaryform.value.branch.id:'';
    this.searched_occupancy=this.querysummaryform.value.occupancy?.id ? this.querysummaryform.value.occupancy.id:'';
    this.searched_billtransactionfromdate=this.querysummaryform.value.bill_txnfromdate?  this.datepipe.transform(this.querysummaryform.value.bill_txnfromdate, 'yyyy-MM-dd') :'';
    this.searched_billtransactiontodate=this.querysummaryform.value.bill_txntodate?  this.datepipe.transform(this.querysummaryform.value.bill_txntodate, 'yyyy-MM-dd') :'';
    this.searched_billpaymentstatus=this.querysummaryform.value.billpaymentstatus? this.querysummaryform.value.billpaymentstatus:'';

    this.searched_ownership=this.querysummaryform.value.ownership_type? this.querysummaryform.value.ownership_type:'';

    this.searched_invoicetype=this.querysummaryform.value.invoice_type? this.querysummaryform.value.invoice_type:''

    // this.paymentsummary(consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,billpaymentstatus,this.paymentpresentpage=1)
    this.getquerysummarydata(this.searched_consumerno,this.searched_consumerstate,this.searched_board,this.searched_region,this.searched_status,this.searched_makerisactive,this.searched_branch,this.searched_occupancy,this.searched_billtransactionfromdate,this.searched_billtransactiontodate,this.searched_billpaymentstatus,this.searched_ownership,this.searched_invoicetype,page)
   } 

   pagination(value){
    ( value == 'next' )? this.searchsummary(this.presentpage+1): this.searchsummary(this.presentpage-1)
   }

   getexceldownloadforeb(){

    // let consumerno=this.querysummaryform.value.consumerno? this.querysummaryform.value.consumerno:''
    // let branch=this.querysummaryform.value.branch?.id ? this.querysummaryform.value.branch.id:''
    // let occupancy=this.querysummaryform.value.occupancy?.id ? this.querysummaryform.value.occupancy.id:''
    // // let billtransactiondate= this.querysummaryform.value.billtransactiondate?  this.datepipe.transform(this.querysummaryform.value.billtransactiondate, 'yyyy-MM-dd') :''
    // let billpaymentstatus= this.querysummaryform.value.billpaymentstatus? this.querysummaryform.value.billpaymentstatus:''
  
    // let billtransactionfromdate=this.querysummaryform.value.bill_txnfromdate?  this.datepipe.transform(this.querysummaryform.value.bill_txnfromdate, 'yyyy-MM-dd') :''
    // let billtransactiontodate=this.querysummaryform.value.bill_txntodate?  this.datepipe.transform(this.querysummaryform.value.bill_txntodate, 'yyyy-MM-dd') :''
  

    // let state=this.querysummaryform.value.state?.id ? this.querysummaryform.value.state?.id:'';
    // let board=this.querysummaryform.value.board?.id ? this.querysummaryform.value.board?.id:'' ;
    // let region=this.querysummaryform.value.region?.id ? this.querysummaryform.value.region?.id:'';

    // let status=this.querysummaryform.value.status

    // let makerisactive=this.querysummaryform.value.active
    // (consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,status,board,state,makerisactive,region)

    this.ebservice.getqueryebexcel(this.searched_consumerno,this.searched_branch,this.searched_occupancy,this.searched_billtransactionfromdate,this.searched_billtransactiontodate,this.searched_billpaymentstatus,this.searched_status,this.searched_board,this.searched_consumerstate,this.searched_makerisactive,this.searched_region,this.searched_ownership,this.searched_invoicetype)
    .subscribe((data) => {
      let binaryData = [];
      binaryData.push(data)
      let today=new Date()
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'EB Query Report '+today+".xlsx";
      link.click();
      })

  }

  fromdateSelection(event){
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    console.log('date check',this.querysummaryform.value.bill_txntodate > this.select)
    if(this.querysummaryform.value.bill_txntodate < this.select){
      this.querysummaryform.patchValue({
        bill_txntodate:''
      })
    }

  }

  premisesType() {
    this.ebservice.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }

  getUsage() {
    this.ebservice.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageList = datas;
      })
  }

}
