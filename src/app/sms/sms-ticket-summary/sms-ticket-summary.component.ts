import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SmsShareService } from '../sms-share.service';
import { SmsService } from '../sms.service';
import { ToastrService } from 'ngx-toastr';
export interface emp_drp{
  id:string,
  full_name:string
}
export interface branch{
  id:string;
  name:string;
  code:string
}
@Component({
  selector: 'app-sms-ticket-summary',
  templateUrl: './sms-ticket-summary.component.html',
  styleUrls: ['./sms-ticket-summary.component.scss']
})
export class SmsTicketSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){  
    if(event.code =="Escape"){
      this.spinner.hide();
    }   
  }
  searchForm:any=FormGroup;
  @ViewChild('prcreate') templates:TemplateRef<any>;
  @ViewChild('nameref') matSupname:MatAutocomplete;
  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger:MatAutocompleteTrigger;
  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private smservice:SmsService,private router:Router,private shareservice:SmsShareService, private toastr:ToastrService) { }
  summatyList:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  enbdata:number=0;
  initialCount:number=0;
  has_supnext:boolean=true;
 has_supprevious:boolean=false;
  has_suppage=1;
  bwcount:number=0;
  isLoading:boolean;
  allcount:number=0;
  totalcount:number=0;
  threeurls:number=0;
  ownerList:Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  branchList: Array<any>=[];
  sortOrdertic:any;
  ticclr:boolean=false;
  ticclr1:boolean=false;
 
  ngOnInit(): void {
    this.searchForm=this.fb.group({
      'code':new FormControl(''),
      'issuetype':new FormControl(''),
      'employee_id':new FormControl(''),
      'branch':new FormControl(''),
      'status':new FormControl('')
    });
    this.smservice.getTicketticketsummarydata('',1).subscribe(data=>{
      this.ownerList=data['data'];
    });
    this.searchForm.get('employee_id').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.smservice.getTicketticketsummarydata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ownerList=data['data'];
    });
    this.smservice.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.searchForm.get('branch').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smservice.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    }); 
    this.getsummarydata();  
  }
  getsummarydata(){
    if (this.ticclr == true){
      this.ticclr=true;
    }
    else if(this.ticclr1 == true){
      this.ticclr1=true;
    }
    else{
      this.ticclr=true;
      this.ticclr1=false;
    }
    if (this.sortOrdertic != undefined && this.sortOrdertic != null &&this.sortOrdertic != ''){
      this.sortOrdertic=this.sortOrdertic
    }
    else  {
      this.sortOrdertic='asce'
    }
    this.threeurls=1;
    let Status={'Open':1,"Reopen":2,"Close Ticket":3,'Duplicated Ticket':4,'Updated':5};
    // this.threeurls=1;
    this.enbdata=0;
    let code:any=this.searchForm.get('code').value?this.searchForm.get('code').value:'';
    let issues:any=this.searchForm.get('issuetype').value?this.searchForm.get('issuetype').value:'';
    let emp_id:any=this.searchForm.get('employee_id').value?this.searchForm.get('employee_id').value.id:'';
    let branch_id:any=this.searchForm.get('branch').value?this.searchForm.get('branch').value.id:'';
    let status:any=Status[this.searchForm.get('status').value]?Status[this.searchForm.get('status').value]:'';
    this.spinner.show();
    this.smservice.getTicketSummary_initial(this.presentpage,code,issues,emp_id,branch_id,this.sortOrdertic,status).subscribe(res=>{
      this.spinner.hide();
      // this.summatyList=res['data'];
      this.initialCount=res['data'][0].thirtydays;
      this.bwcount=res['data'][0]['thirtysixtydays'];
      this.allcount=res['data'][0]['count'];
    },
    (error)=>{
      
    }
    )
  }
  searchdata(){
    if(this.enbdata==0){
        
        this.getsummarydata_initial();
    }
    if(this.enbdata==1){
        
        this.getsummarydata_bw();
    }
    if(this.enbdata==2){
        this.getsummarydata_all();
     }
  }
  reset(){
    this.searchForm.reset();
    if(this.enbdata==0){
      
      this.getsummarydata_initial();
    }
    if(this.enbdata==1){
       
        this.getsummarydata_bw();
    }
    if(this.enbdata==2){
        this.getsummarydata_all();
    }
  }
  public ownerdatainterface(data?:emp_drp):string | undefined{
    return data?data.full_name:undefined;
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  // alert_message(){
  //   this.toastr.warning('Create a New Ticketing');
  // }
  getsummarydata_all(){
    if (this.ticclr == true){
      this.ticclr=true;
    }
    else if(this.ticclr1 == true){
      this.ticclr1=true;
    }
    else{
      this.ticclr=true;
      this.ticclr1=false;
    }
    if (this.sortOrdertic != undefined && this.sortOrdertic != null &&this.sortOrdertic != ''){
      this.sortOrdertic=this.sortOrdertic
    }
    else  {
      this.sortOrdertic='asce'
    }
    this.threeurls=2;
    this.enbdata=2;
    let Status={'Open':1,"Reopen":2,"Close Ticket":3,'Duplicated Ticket':4,'Updated':5};
    let code:any=this.searchForm.get('code').value?this.searchForm.get('code').value:'';
    let issues:any=this.searchForm.get('issuetype').value?this.searchForm.get('issuetype').value:'';
    let emp_id:any=this.searchForm.get('employee_id').value?this.searchForm.get('employee_id').value.id:'';
    let branch_id:any=this.searchForm.get('branch').value?this.searchForm.get('branch').value.id:'';
    let status:any=Status[this.searchForm.get('status').value]?Status[this.searchForm.get('status').value]:'';
    this.spinner.show();
    this.smservice.getTicketSummary_all(this.presentpage,code,issues,emp_id,branch_id,this.sortOrdertic,status).subscribe(res=>{
      this.spinner.hide();
      if (res.code !=undefined && res.code !=''){
        this.toastr.warning(res.code);
        this.toastr.warning(res.description);
      }
      else{
      this.summatyList=res['data'];
      if(this.summatyList.length>0){
        this.totalcount=this.summatyList[0]['count'];
      }
      let pagination=res['pagination'];
      if(this.summatyList.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.presentpage=pagination.index;
      }
      else{
        this.has_next=false;
        this.has_previous=false;
        this.presentpage=1;
      }
    }
    },
    (error)=>{
      this.spinner.hide();
    }
    )
  }
  getsummarydata_initial(){
    if (this.ticclr == true){
      this.ticclr=true;
    }
    else if(this.ticclr1 == true){
      this.ticclr1=true;
    }
    else{
      this.ticclr=true;
      this.ticclr1=false;
    }
    if (this.sortOrdertic != undefined && this.sortOrdertic != null &&this.sortOrdertic != ''){
      this.sortOrdertic=this.sortOrdertic
    }
    else  {
      this.sortOrdertic='asce'
    }
    this.threeurls=1;
    this.enbdata=0;
    let code:any=this.searchForm.get('code').value?this.searchForm.get('code').value:'';
    let issues:any=this.searchForm.get('issuetype').value?this.searchForm.get('issuetype').value:'';
    let emp_id:any=this.searchForm.get('employee_id').value?this.searchForm.get('employee_id').value.id:'';
    let branch_id:any=this.searchForm.get('branch').value?this.searchForm.get('branch').value.id:'';
    this.spinner.show();
    let Status={'Open':1,"Reopen":2,"Close Ticket":3,'Duplicated Ticket':4,'Updated':5};
    let status:any=Status[this.searchForm.get('status').value]?Status[this.searchForm.get('status').value]:'';
    this.smservice.getTicketSummary_initial(this.presentpage,code,issues,emp_id,branch_id,this.sortOrdertic,status).subscribe(res=>{
      this.spinner.hide();
      if (res.code !=undefined && res.code !=''){
        this.toastr.warning(res.code);
        this.toastr.warning(res.description);
      }
      else{
      this.summatyList=res['data'];
      if(this.summatyList.length>0){
        this.totalcount=this.summatyList[0]['count'];
      }
      let pagination=res['pagination'];
      if(this.summatyList.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.presentpage=pagination.index;
      }
      else{
        this.has_next=false;
        this.has_previous=false;
        this.presentpage=1;
      }
    }
    },
    (error)=>{
      this.spinner.hide();
    }
    )
  }
  getsummarydata_bw(){
    if (this.ticclr == true){
      this.ticclr=true;
    }
    else if(this.ticclr1 == true){
      this.ticclr1=true;
    }
    else{
      this.ticclr=true;
      this.ticclr1=false;
    }
    if (this.sortOrdertic != undefined && this.sortOrdertic != null &&this.sortOrdertic != ''){
      this.sortOrdertic=this.sortOrdertic
    }
    else  {
      this.sortOrdertic='asce'
    }
    this.threeurls=3;
    this.enbdata=1;
    let Status={'Open':1,"Reopen":2,"Close Ticket":3,'Duplicated Ticket':4,'Updated':5};
    let code:any=this.searchForm.get('code').value?this.searchForm.get('code').value:'';
    let issues:any=this.searchForm.get('issuetype').value?this.searchForm.get('issuetype').value:'';
    let emp_id:any=this.searchForm.get('employee_id').value?this.searchForm.get('employee_id').value.id:'';
    let branch_id:any=this.searchForm.get('branch').value?this.searchForm.get('branch').value.id:'';
    let status:any=Status[this.searchForm.get('status').value]?Status[this.searchForm.get('status').value]:'';
    this.spinner.show();
    this.smservice.getTicketSummary_between(this.presentpage,code,issues,emp_id,branch_id,this.sortOrdertic,status).subscribe(res=>{
      this.spinner.hide();
      if (res.code !=undefined && res.code !=''){
        this.toastr.warning(res.code);
        this.toastr.warning(res.description);
      }
      else{
      this.summatyList=res['data'];
      if(this.summatyList.length>0){
        this.totalcount=this.summatyList[0]['count'];
      }
      let pagination=res['pagination'];
      if(this.summatyList.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.presentpage=pagination.index;
      }
      else{
        this.has_next=false;
        this.has_previous=false;
        this.presentpage=1;
      }
    }
    },
    (error)=>{
      this.spinner.hide();
    }
    )
  }
  has_nextdataall(){
    if(this.enbdata==0){
      if(this.has_next){
        this.presentpage +=1;
        this.getsummarydata_initial();
      }
    }
    if(this.enbdata==1){
      if(this.has_next){
        this.presentpage +=1;
        this.getsummarydata_bw();
      }
    }
    if(this.enbdata==2){
      if(this.has_next){
        this.presentpage +=1;
        this.getsummarydata_all();
      }
    }
    
  }
  has_previousdataall(){
    if(this.enbdata==0){
      if(this.has_previous){
        this.presentpage -=1;
        this.getsummarydata_initial();
      }
    }
    if(this.enbdata==1){
      if(this.has_previous){
        this.presentpage -=1;
        this.getsummarydata_bw();
      }
    }
    if(this.enbdata==2){
      if(this.has_previous){
        this.presentpage -=1;
        this.getsummarydata_all();
      }
    }
  }
  movetofollowup(d:any){
    this.shareservice.ticket_view.next(d);
    this.router.navigate(['/sms/tfollowup']);
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  getticsumascdec(data,num){
    this.sortOrdertic=data;
    if (num==1){
      this.ticclr=true;
      this.ticclr1=false;
    }
    if (num==2){
      this.ticclr=false;
    this.ticclr1=true;
    }
    if (this.threeurls==1){
      this.getsummarydata_initial();
    }
    else if (this.threeurls==2){
      this.getsummarydata_all();
    }
    else if (this.threeurls==3){
      this.getsummarydata_bw();
    }
  }
  
  autocompletesupname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matSupname && this.autoCompleteTrigger && this.matSupname.panel){
        fromEvent(this.matSupname.panel.nativeElement,'scroll').pipe(
          map(x=>this.matSupname.panel.nativeElement.scrollTop),
          takeUntil(this.autoCompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matSupname.panel.nativeElement.scrollTop;
            const scrollHeight=this.matSupname.panel.nativeElement.scrollHeight;
            const elementHeight=this.matSupname.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_supnext){
               
               this.smservice.getTicketticketsummarydata(this.searchForm.get('employee_id').value, this.has_suppage+1).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.ownerList=this.ownerList.concat(dear);
                 if(this.ownerList.length>0){
                   this.has_supnext=pagination.has_next;
                   this.has_supprevious=pagination.has_previous;
                   this.has_suppage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.smservice.getAMBranchdropdown( this.has_branchpresentpage+1,this.searchForm.get('branch').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
}
