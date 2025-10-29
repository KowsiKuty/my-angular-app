import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { TnebService } from '../tneb.service';

export interface occupancy{
  id:number
  occupancy_name:any
  occupancy_code:any
}
export interface branchList {
  id: number
  name: string
  code:string
}
@Component({
  selector: 'app-electricity-details-status',
  templateUrl: './electricity-details-status.component.html',
  styleUrls: ['./electricity-details-status.component.scss']
})
export class ElectricityDetailsStatusComponent implements OnInit {
  branchdata: any;
  branch_hasnext=true;
  branch_hasprevious=true;
  branch_currentpage=1;
  count=0;
  occupancydata: any;
disabled: any;
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
  disablemanualrun : boolean= false
  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private router:Router,private tnebservice:TnebService,private notification:NotificationService
    ) { }
    

  ngOnInit(): void {
    this.codosearchform=this.fb.group({
      'consumerno':new FormControl(''),
      'branch':new FormControl(''),
      'status':new FormControl(''),
      'occupancy':new FormControl('')
    });

    this.searchdata()

  }

  manualrundata(){
    // this.spinner.show()

    this.notification.showInfo("Manual Run initiated")
   
    this.tnebservice.electricitymanualrun().subscribe(data=>{
      if(data.message == "Manual Run Started"){
          this.disablemanualrun=true;
        setTimeout(
          ()=>{
           this.disablemanualrun=false;
         }, 300000
       );
      }
    // this.spinner.hide()

      // if(data['code']=="ERROR_OCCURED"){
      //   this.notification.showError(data['code']);
      // }
      // if(data['status']=="success"){
      //   this.notification.showSuccess('Successfully updated')
      // }
      // else{
      //   this.notification.showError(data['code']);
      //   this.notification.showError(data['description']);
      // }
        this.searchdata()
    },
    (error)=>{
    this.spinner.hide()

      this.notification.showError(error.status+error.statusText);
    });
  }

  getmanualrun(value){
   
  }

  searchdata(){

    let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
    
    let branch=this.codosearchform.value.branch?.id ? this.codosearchform.value.branch.id :''

    let occupancy = this.codosearchform.value.occupancy?.id? this.codosearchform.value.occupancy?.id:''
  
    this.summaryget(consumer_no,branch,occupancy,this.presentpage=1)
  }

  summaryget(consumer_no,branch,occupancy,page){

    this.spinner.show()
    this.tnebservice.getdetailstatussummary(consumer_no,branch,occupancy,page).subscribe(
      result =>{
    this.spinner.hide()
   
        console.log(result)
        this.summarydata=result['data']
        // this.disablemanualrun = false
        this.count=result['count']
        let pagination =result['pagination']
       
          this.has_next=pagination.has_next
          this.has_previous=pagination.has_previous
          this.presentpage=pagination.index
        
      }
    )
  }

  nextpage(){
    if(this.has_next){
      let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
    
    let branch=this.codosearchform.value.branch.id? this.codosearchform.value.branch.id :''
    let occupancy = this.codosearchform.value.occupancy?.id? this.codosearchform.value.occupancy.id:''

    this.summaryget(consumer_no,branch,occupancy,this.presentpage+1)
    }
  }

  previouspage(){
    if(this.has_previous){
      let consumer_no=this.codosearchform.value.consumerno? this.codosearchform.value.consumerno :''
    
    let branch=this.codosearchform.value.branch.id? this.codosearchform.value.branch.id :''
    let occupancy = this.codosearchform.value.occupancy?.id? this.codosearchform.value.occupancy.id:''

    this.summaryget(consumer_no,branch,occupancy,this.presentpage-1)
    }
  }

  getbranchdata(value,page){
    
    this.tnebservice.getbranch(value,page).subscribe(
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

  resetdata(){
    this.codosearchform.reset()
    this.searchdata()
  }

  
  getoccupancydropdowndata(value){
    this.tnebservice.getoccupancydata(value).subscribe(
      result=>{
        this.occupancydata=result['data'];
        
      }
    )
  }

  public displayocc(occupancy?: occupancy): string | undefined {
    return occupancy ? "("+occupancy?.occupancy_code+") - " + occupancy.occupancy_name : undefined;
    
  }

}
