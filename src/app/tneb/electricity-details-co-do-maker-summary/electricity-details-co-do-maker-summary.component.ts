import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/service/shared.service';
import { TnebService } from '../tneb.service';

export interface occupancy{
  id:number
  occupancy_name:any
  occupancy_code:any
}
export interface branchList {
  id: number
  name: string
  code: string
}

export interface boardtype {
  name: string;
  id: number;
}

export interface statelist {
  id: number;
  name: string;
}


export interface region {
  id: number
  region_name: string
  // code:string
}
@Component({
  selector: 'app-electricity-details-co-do-maker-summary',
  templateUrl: './electricity-details-co-do-maker-summary.component.html',
  styleUrls: ['./electricity-details-co-do-maker-summary.component.scss']
})
export class ElectricityDetailsCoDoMakerSummaryComponent implements OnInit {
  branchdata: any;
  branch_hasnext = true;
  branch_hasprevious = true;
  branch_currentpage = 1;

  regiondata=[];
  has_nextregion=true;
  has_previousregion=true;
  currentpageregion=1;
  count=0;
  occupancydata: any;

  @HostListener('document:keydown', ['$event']) onkeyboard(event: KeyboardEvent) {
    if (event.code == "Escape") {
      this.spinner.hide();
    }
  }
  codosearchform: any = FormGroup;
  summarydata: Array<any> = [];
  has_next: boolean = false;
  has_previous: boolean = false;
  presentpage: number = 1;
  pagesize: number = 10;
  statusdetails: any = { 'Submitted': 1, 'Approved': 2, 'Rejected': 3 };

  statedata: any;
  state_has_next = true;
  state_has_previous = true;
  state_presentpage = 1;

  boarddata: any;
  board_hasnext = true;
  board_hasprevious = true;
  board_currentpage = 1;


  searched_consumername ='';
  searched_consumerno='';
  searched_consumer_branch='';
  searched_consumer_status='';
  searched_state='';
  searched_board='';
  searched_region='';
  searched_active='';
  searched_occupancy='';


  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private router: Router,
    private ebservice: TnebService, private shareService: SharedService) { }

  ngOnInit(): void {
    this.codosearchform = this.fb.group({
      'consumerno': new FormControl(''),
      'consumername': new FormControl(''),
      'branch': new FormControl(''),
      'status': new FormControl(''),
      'state': new FormControl(''),
      'board': new FormControl(''),
      'region': new FormControl(''),
      'active': new FormControl(''),
      'occupancy':new FormControl('')
    });
    this.searchdata(this.presentpage=1);
  }
  navigaredata() {
    this.router.navigate(['tneb/electricityexpense/electricitycodomaker']);
  }
  getsummarydata() {

    // this.spinner.show()
    // this.ebservice.getcodosummary(this.presentpage, '', '', '').subscribe(data => {
    //   this.spinner.hide()

    //   this.summarydata = data['data'];
    //   let pagination: any = data['pagination'];
    //   this.has_next = pagination.has_next;
    //   this.has_previous = pagination.has_previous;
    //   this.presentpage = pagination.index;
    // },
    //   (error) => {
    //     this.spinner.hide()

    //   }
    // )
  }
  searchdata(page) {
    // let consumer_no: any = this.codosearchform.get('consumerno').value ? this.codosearchform.get('consumerno').value : '';
    // let consumer_branch: any = this.codosearchform.get('branch').value.id ? this.codosearchform.get('branch').value.id : '';
    // let consumer_status: any = this.codosearchform.get('status').value ? this.codosearchform.get('status').value : '';
    // let state:any= this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
    // let board:any= this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
    // let region:any= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
    // let active:any= this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';
    // let consumername:any= this.codosearchform.get('consumername').value ? this.codosearchform.get('consumername').value:''

  
    this.searched_consumerno =this.codosearchform.get('consumerno').value ? this.codosearchform.get('consumerno').value : '';
    this.searched_consumername=this.codosearchform.get('consumername').value ? this.codosearchform.get('consumername').value:'';
    this.searched_consumer_branch=this.codosearchform.get('branch').value.id ? this.codosearchform.get('branch').value.id : '';
    this.searched_consumer_status=this.codosearchform.get('status').value ? this.codosearchform.get('status').value : '';
    this.searched_state=this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
    this.searched_board=this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
    this.searched_region= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
    this.searched_active=this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';

    this.searched_occupancy=this.codosearchform.get('occupancy').value?.id? this.codosearchform.get('occupancy').value?.id : '';


    this.spinner.show()

    this.ebservice.getcodosummary( page,this.searched_consumername, this.searched_consumerno, this.searched_consumer_branch, this.searched_consumer_status,this.searched_state, this.searched_board, this.searched_region,this.searched_active,this.searched_occupancy).subscribe(data => {
      this.spinner.hide()

      this.summarydata = data['data'];
      this.count=data?.count? data.count:0
      let pagination: any = data['pagination'];
      
        this.has_next = pagination.has_next;
        this.has_previous = pagination.has_previous;
        this.presentpage = pagination.index;
      

    },
      (error) => {
        this.spinner.hide()
      }
    )
  }
  resetdata() {
    // this.codosearchform.reset('');

    this.codosearchform.patchValue({
      consumerno: '',
      branch: '',
      status: '',
      state:'',
      board:'',
      region:'',
      active:'',
      consumername:'',
      occupancy:''
    })

    this.searchdata(this.presentpage=1);
  }
  nextdata() {
    if (this.has_next) {
   
      this.searchdata(this.presentpage + 1);
    }
  }
  previousdata() {
    if (this.has_previous) {
      // this.presentpage = this.presentpage - 1;
      this.searchdata(this.presentpage - 1);
    }
  }

  clickConsumerNo(value) {
    this.shareService.co_do_consumerno.next(value);
    // this.router.navigate(['/tneb/viewEleDetail'], {skipLocationChange: true})
    this.router.navigate(['/tneb/electricityexpense/electricitycodomaker'], { skipLocationChange: true })
  }

  getbranchdata(value, page) {

    this.ebservice.getbranch(value, page).subscribe(
      result => {
        this.branchdata = result['data'];
        // let datapagination = result['pagination']
        // console.log(result)

        // if (this.branchdata.length >= 0) {
        //   this.branch_hasnext = datapagination.has_next;
        //   this.branch_hasprevious = datapagination.has_previous;
        //   this.branch_currentpage = datapagination.index;
        // }
        console.log('branc dataa',this.branchdata)
      }
    )
  }

  autocompletebranchnameScroll() {

  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    // return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    return branchtype ? "(" + branchtype.code + ")" + branchtype.name : undefined;

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
       
        console.log(this.count)
        let datapagination = results["pagination"];
        this.regiondata=datas
        if (this.regiondata.length >= 0) {
          this.has_nextregion = datapagination.has_next;
          this.has_previousregion = datapagination.has_previous;
          this.currentpageregion = datapagination.index;
        }
      })
  }

  getexceldownloadforeb(){

    // let consumer_no: any = this.codosearchform.get('consumerno').value ? this.codosearchform.get('consumerno').value : '';
    // let consumer_branch: any = this.codosearchform.get('branch').value.id ? this.codosearchform.get('branch').value.id : '';
    // let consumer_status: any = this.codosearchform.get('status').value ? this.codosearchform.get('status').value : '';
    // let state:any= this.codosearchform.get('state').value?.id ? this.codosearchform.get('state').value?.id : '';
    // let board:any= this.codosearchform.get('board').value?.id ? this.codosearchform.get('board').value?.id : '';
    // let region:any= this.codosearchform.get('region').value?.id ? this.codosearchform.get('region').value?.id : '';
    // let active:any= this.codosearchform.get('active').value ? this.codosearchform.get('active').value : '';
    // let consumername:any= this.codosearchform.get('consumername').value ? this.codosearchform.get('consumername').value:''

    // (page: any, consumername,consumer_no, branch, consumer_status,state,board,region,active)

    this.ebservice.getebexcel( this.searched_consumername, this.searched_consumerno, this.searched_consumer_branch, this.searched_consumer_status,this.searched_state, this.searched_board, this.searched_region,this.searched_active,this.searched_occupancy)
    .subscribe((data) => {  
      let binaryData = [];
      binaryData.push(data)
      let today=new Date()
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'EB Report '+today+".xlsx";
      link.click();
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

}
