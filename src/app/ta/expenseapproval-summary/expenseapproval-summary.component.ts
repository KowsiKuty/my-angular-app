import { Component, OnInit,HostListener ,ViewChild} from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import{ShareService} from 'src/app/ta/share.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


export interface emplist {
  full_name: string;
  code: string;
  id: number;
}
export interface branchdata{
  code: string;
  id: number;
  name: string;
}
@Component({
  selector: 'app-expenseapproval-summary',
  templateUrl: './expenseapproval-summary.component.html',
  styleUrls: ['./expenseapproval-summary.component.scss']
})

export class ExpenseapprovalSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  @ViewChild('autocompleteemp') matemp: any;
  @ViewChild('branchInput') brinput: any;
  @ViewChild('emp') emp: any;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeinput') empInput:any;
  @ViewChild('empc') employeeauto:MatAutocomplete
  @ViewChild('branchinput') branchInput:any;
  @ViewChild('branch_auto') autocomplete_branch:MatAutocomplete
  
  branchdata:Array<branchdata>;
  empList:Array<emplist>;
  branchlist: any;
  branchemployee:any;
  statusupdatebranchid: any;
  has_next=true;
  has_previous=true;
  getapprovexpenceList:any
  approvexpencesummarypage:number=1;
  pagesize=10;

  gettourapproveList:any
  memoSearchForm : FormGroup;
  tourapprovesummarypage:number=1;
  send_value:String=""
  currentpage: number = 1;
  presentpage: number = 1;
  tourApprovalSearchForm:FormGroup;
  expenseapprovesearch:any
  status: any;
  statusList: any;
  isTourChecker: boolean;
 
  statusId: number = 2;
  statusselected: any='PENDING';
  emp_page:number=1;
  emp_prev:boolean=false;
  emp_next:boolean=true;
  branch_id:any;
  branch_page:number=1;
  branch_prev:boolean=false;
  branch_next:boolean=true;
  totalpages: number = 10; 
  

  constructor(private  taService:TaService,public spinnerservice: NgxSpinnerService,
    private sharedService:SharedService,private route: ActivatedRoute,private router: Router,
    private shareservice:ShareService,private sharedservice:SharedService,private datePipe: DatePipe,private fb:FormBuilder, private notification: NotificationService) { }

  

  ngOnInit(): void {
   
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
       branch: '',
       employee: '',
       Grade:[''],
       claimAmount: ['', [Validators.pattern(/^[0-9]*$/)]]

    })
    this.tourApprovalSearchForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taService.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("Branch List", this.branchlist)
      });

    this.tourApprovalSearchForm.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taService.getemployeevaluechanges(this.statusupdatebranchid ? this.statusupdatebranchid : 0, value ? value : '',1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchemployee = datas;
        console.log("Branch List", this.branchlist)
      });
    this.tourApprovalSearchForm.get('branch').valueChanges.pipe(switchMap(val => this.taService.getUsageCode(val, 1)))
      .subscribe((results) => {
        this.branchdata = results['data']
      })
    this.tourApprovalSearchForm.get('employee').valueChanges.pipe(switchMap(value =>
      this.taService.getemployeevaluechanges(this.tourApprovalSearchForm.value.branch ?
        this.tourApprovalSearchForm.value.branch.id : 0, value ? value : '',1)))
      .subscribe((results) => {
        this.empList = results['data']
      })
    this.getapprovesumm(this.send_value,this.currentpage,this.pageSize);
    this.getstatusvalue();
    this.getbranch()
  }
  choose_id: any

  getemployee() {
    let value = this.tourApprovalSearchForm.value.branch.id
    this.branch_id=value;
    this.taService.getemployeevaluechanges(value?value:0,'',1)
    .subscribe((results) => {
      this.empList = results['data']
    })

  }
  getbranch(){
    let branchid = this.statusupdatebranchid
    this.taService.getUsageCode('',1).subscribe((results: any) => {
      this.branchdata = results["data"]
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
     
    });
  }
  
    getstatusvalue(){
      this.taService.getstatus()
      .subscribe(res=>{
        this.statusList=res
        const exp_list = this.statusList.filter(function(record){ return record.name != "FORWARD"});
        this.statusList=exp_list
        console.log("statusList",this.statusList)
      })
    }

    
  tourApproverSearch(){
    this.send_value=""
    let form_value = this.tourApprovalSearchForm.value;

    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }

    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }
    
    if (form_value.branch.id) {
      this.send_value =this.send_value+`&branch_id=${form_value.branch.id}`;
  } 
   
    if(form_value.employee.id){
      this.send_value = this.send_value+`&employee_id=${form_value.employee.id}`
    }
    if(form_value.Grade){
       this.send_value = this.send_value+`&grade=${form_value.Grade}`
    }
    if(form_value.claimAmount){
      this.send_value = this.send_value+`&claim_amount=${form_value.claimAmount}`
   }
    this.getapprovesumm(this.send_value,1,this.pageSize)

  }
  total_count:any;
  totcount:number=1
  showFirstLastButtons:boolean=true;
  pageSizeOptions = [10, 20, 30,40,50,60,70,80,90,100];
  pageIndex=0
  getapprovesumm(val,
    pageNumber,pageSize:number) {
    this.spinnerservice.show();
    if (this.shareservice.is_admin_approve.value) {
      val = val + '&is_admin=1'
    }
    this.taService.getapprovexpenceSummary(this.statusId,pageNumber,val,pageSize)
      .subscribe((results: any[]) => {
        this.spinnerservice.hide()
        let datas = results["data"];
        this.getapprovexpenceList = datas;
        let datapagination = results["pagination"];
        this.total_count=results['count'];
        this.getapprovexpenceList = datas;
        if (this.getapprovexpenceList.length === 0) {
          this.isTourChecker = false
        }
        if (this.getapprovexpenceList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
          this.isTourChecker = true
        }
      })
  
  }
  reset(){
    this.send_value=""
    this.tourApprovalSearchForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
        branch:'',
      employee:'',
      Grade:[''],
      claimAmount:['']
    })
    this.getapprovesumm(this.send_value,this.currentpage,this.pageSize)
  }
  displayfnbranch(conoffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }
  displayFn(subject): string | undefined  {
    return subject.full_name;
  }

  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="APPROVED"){
      this.statusId= 3
    }
    if(status_name=="PENDING"){
      this.statusId= 2
    }
    if(status_name=="REJECTED"){
      this.statusId= 4
    }
    if(status_name=="RETURNED"){
      this.statusId= 5
    }
    if(status_name=="FORWARDED"){
      this.statusId= 6
    }

    this.getapprovesumm(this.send_value,this.currentpage,this.pageSize)
  }
  TourapprovefirstClick() {
    if (this.currentpage !== 1){
      this.currentpage = 1;
      this.getapprovesumm(this.send_value,this.currentpage,this.pageSize);
}
  }

  TourapprovenextClick() {
    if (this.has_next === true) {
      this.getapprovesumm(this.send_value,this.currentpage + 1,this.pageSize)
    }
  }
  
  TourapprovepreviousClick() {
    if (this.has_previous === true) {
      this.getapprovesumm(this.send_value,this.currentpage - 1,this.pageSize)
    }
  
  
  }
  TourapprovelastClick() {
    const totalPages= Math.ceil(this.total_count/this.pageSize)
    if (this.currentpage !== totalPages){
      this.currentpage = totalPages;
      this.getapprovesumm(this.send_value,this.currentpage,this.pageSize)
    }
}

  getapprovexpencesumm(val,
    pageNumber) {
      this.spinnerservice.show()
    this.taService.getapprovexpenceSummary(this.statusId,pageNumber,val,this.pageSize)
    .subscribe(result => {
      this.spinnerservice.hide()
    console.log("Tourmaker", result)
    let datas = result['data'];
    this.getapprovexpenceList = datas;
    let datapagination = result["pagination"];
    this.getapprovexpenceList = datas;
    if (this.getapprovexpenceList.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.approvexpencesummarypage = datapagination.index;
    }
    })
    }
    approvexpencenextClick() {
      if (this.has_next === true) {
        this.getapprovexpencesumm(this.approvexpencesummarypage + 1, 10)
      }
    }
  
    approvexpencepreviousClick() {
      if (this.has_previous === true) {
        this.getapprovexpencesumm(this.approvexpencesummarypage - 1, 10)
      }
    }
    approveexpenceEdit(data){
      delete data.onbehalfof
      this.shareservice.expensesummaryData.next(data)
      this.shareservice.expenseforwardkeyaccesss.next(data)
      var datas = JSON.stringify(Object.assign({}, data));
      localStorage.setItem("expense_details",datas) 
      this.router.navigateByUrl('ta/exapprove-edit');
    }
    searchClick(){

    }
    clearclick(){
      this.expenseapprovesearch.requestno='',
      this.expenseapprovesearch.requestdate=''
    }

    // onKeyDown(event: KeyboardEvent) {
    //   if (event.keyCode !== 8 && event.keyCode !== 13 && (event.keyCode < 48 || event.keyCode > 57)) {
    //     event.preventDefault();
    //   }
    // }
    onKeyDown(event:any){
      let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
      console.log(d.test(event.key))
      if(d.test(event.key)==true){
        return false;
      }
      return true;
    }
    autocomplete_empScroll() {
      setTimeout(() => {
        if (
          this.employeeauto &&
          this.autocompleteTrigger &&
          this.employeeauto.panel
        ) {
          fromEvent(this.employeeauto.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.employeeauto.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.employeeauto.panel.nativeElement.scrollTop;
              const scrollHeight = this.employeeauto.panel.nativeElement.scrollHeight;
              const elementHeight = this.employeeauto.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.emp_next === true) {
                  this.taService.getemployeevaluechanges(this.branch_id?this.branch_id:0,this.empInput.nativeElement.value, this.emp_page + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.empList.length >= 0) {
                        this.empList = this.empList.concat(datas);
                        this.emp_next = datapagination.has_next;
                        this.emp_prev = datapagination.has_previous;
                        this.emp_page = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    
    
    
      autocomplete_branchScroll(){
      setTimeout(() => {
        if (
          this.autocomplete_branch &&
          this.autocompleteTrigger &&
          this.autocomplete_branch.panel
        ) {
          fromEvent(this.autocomplete_branch.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.autocomplete_branch.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.autocomplete_branch.panel.nativeElement.scrollTop;
              const scrollHeight = this.autocomplete_branch.panel.nativeElement.scrollHeight;
              const elementHeight = this.autocomplete_branch.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;

              if (atBottom) {
                if (this.branch_next === true) {
                  this.taService.getUsageCode(this.branchInput.nativeElement.value, this.branch_page + 1)
                    .subscribe((results: any[]) => {
                      console.log(this.autocomplete_branch?.panel?.nativeElement);
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.branchdata.length >= 0) {
                        this.branchdata = this.branchdata.concat(datas);
                        this.branch_next = datapagination.has_next;
                        this.branch_prev = datapagination.has_previous;
                        this.branch_page = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    handlePageEventSchedule(event: PageEvent) {
      this.total_count = event.length;
      this.totcount = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.pageIndex=event.pageIndex+1;
      // this.paymentSchedule()
      
    }
    pageSize = 10;
    onPageSizeChange(newPageSize: number) {
      
      this.pageSize = newPageSize;
    
  
      this.pageIndex = 0;
      this.currentpage = 0;
    
      this.getapprovesumm(this.send_value, this.currentpage + 1,this.pageSize); 
    }
    validateInput(event: any): void {
      const input = event.target.value;
      event.target.value = input.replace(/[^0-9]/g, '');
    }
}
