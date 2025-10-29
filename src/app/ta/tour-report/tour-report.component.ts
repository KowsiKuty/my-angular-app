import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {TaService} from "../ta.service";
import {ShareService} from '../share.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatAutocomplete ,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { map,takeUntil} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { error } from 'console';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/service/shared.service';



const isSkipLocationChange = environment.isSkipLocationChange
export interface branch{
  name:string;
  code:string;
  id:number;
}
export interface employee{
  name:string;
  code:string;
  id:number;
}

@Component({
  selector: 'app-tour-report',
  templateUrl: './tour-report.component.html',
  styleUrls: ['./tour-report.component.scss']
})
export class TourReportComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchname') branchname:MatAutocomplete;
  @ViewChild('branchinput') branchinput:ElementRef;
  @ViewChild('empname') empname:MatAutocomplete;
  @ViewChild('empinput') empinput:ElementRef;

  tourreportmodal:any;
  tareportForm:FormGroup;
  branchlist:any;
  employeelist:any;
  gettourreportList:any;
  branchid:any;
  presentpage: number = 1;
  pageSize = 10;
  has_next = true;
  has_previous = true;
  image:any
  tourno:any;
  empgid:any;
  isLoading:boolean=false;
  has_branchnxt:boolean=false;
  has_branchpre:boolean=false;
  branchpresentpage:number=1;
  taUrl = environment.apiURL
  has_emppre:boolean=false;
  has_empnxt:boolean=false;
  emppresnentpage:number=1
  data:any;
  getAdvanceapproveList:any;
  page_no = 1;
  totalpages:number=10;
  requestno:any;
  Grade:any;
  employee:any;
  branch:any;
  from_date:any;
  to_date:any;
  monthList:any = [{"id": "1", "text": "january"},{"id": "2", "text": "february"},{"id": "3", "text": "march"},{"id": "4", "text": "april"},{"id": "5", "text": "may"},{"id": "6", "text": "june"},{"id": "7", "text": "july"},{"id": "8", "text": "august"},{"id": "9", "text": "september"},{"id": "10", "text": "october"},{"id": "11", "text": "november"},{"id": "12", "text": "december"}];
  constructor(private taservice:TaService,private shareservice:ShareService,
    private router:Router,private fb:FormBuilder,public spinner:NgxSpinnerService,private toastr:ToastrService,private datepipe:DatePipe,public sharedService: SharedService) { }

  ngOnInit(): void {
    
    this.tareportForm=this.fb.group({
      'requestno':new FormControl(''),
      'branch':new FormControl(''),
      'employee':new FormControl(''),
      'fromdate':new FormControl(''),
      'todate':new FormControl(''),
      'grade':new FormControl(''),
      'month': new FormControl('')
    })
    
    this.tareportForm.get('branch').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(()=>{this.isLoading=true;
      }),
      switchMap(value=>this.taservice.getbranchValue(value!=null?value:'',1).pipe(
        finalize(()=>{
          this.isLoading=false;

        }),
      ))
    ).subscribe((results: any[]) => {
      this.branchlist=results['data'];
    });

    this.tareportForm.get('employee').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(()=>{this.isLoading=true;
      }),
      switchMap(value=>this.taservice.getemployeeval(this.branchid?this.branchid:0,value!=null?value:'',1).pipe(
        finalize(()=>{
          this.isLoading=false;

        }),
      ))
    ).subscribe((results: any[]) => {
      this.employeelist=results['data'];
    });

    this.getbranchlist();
    this.requestno = this.shareservice.tourno.value;
    this.employee=this.shareservice.emp_id.value;
    this.Grade =this.shareservice.grade.value;
    this.branch=this.shareservice.branch_id.value ||'';
    this.from_date=this.shareservice.from_date.value;
    this.to_date=this.shareservice.to_Date.value;
    let formValues: any = {};
    if (this.requestno) {
      formValues.requestno = this.requestno;
    }
    
    if (this.employee) {
      formValues.employee = this.employee;
    }
    if (this.Grade) {
      formValues.Grade = this.Grade;
    }
    
    // if (this.branch) {
    //   formValues.branch = this.branch?.id ? this.branch.id : '';
    // }
    if (this.branch !== undefined && this.branch.id !== undefined ) {
      formValues.branch = this.branch;
    } 
    else {
      formValues.branch = '';
    }
    
    if (this.from_date) {
      formValues.from_date = this.from_date;
    }
    
    if (this.to_date) {
      formValues.to_date = this.to_date;
    }
    
    if (Object.keys(formValues).length > 0) {
      this.tareportForm.patchValue(formValues);
    }
    this.tourSearch(1);

}
  
  getbranchlist(){
    this.taservice.getbranchValue('',1)
    .subscribe(result => {
      let datas=result['data']
      this.branchlist= datas
      if (this.branchlist.length >0){
        let pagination = result['pagination'];
        this.has_branchnxt = pagination.has_next;
        this.has_branchpre = pagination.has_previous;
        this.branchpresentpage = pagination.index;
      }
      
    })
  }
  autocompleteScroll_branch(){
    setTimeout(() => {
      if (this.branchname && this.autocompleteTrigger && this.branchname.panel) {
        fromEvent(this.branchname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.branchname.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchname.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnxt === true) {
                this.taservice.getUsageCode(this.branchinput.nativeElement.value, this.branchpresentpage + 1)
                  .subscribe((results: any[]) => {
                    this.branchpresentpage ++;
                    let datas = results['data'];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length >0){
                      let pagination = results['pagination'];
                      this.has_branchnxt = pagination.has_next;
                      this.has_branchpre = pagination.has_previous;
                      this.branchpresentpage = pagination.index;
                    
                    }
                  })
              }
            }
          });
      }
    });
  }
  public display_branch(branch?: branch): string | undefined {
    return branch ? "(" + branch.code + ") " + branch.name : undefined;
  }
  // getbrnch(id){
  //   this.branchid=id
  //   this.getemployeelist()
    
  // }
  branchchoosen(){
    let branchid=this.tareportForm.get('branch').value.id;
    if(!branchid){
      this.toastr.warning("Please Select The Branch");
      this.tareportForm.get('branch').reset();
      this.employeelist=[];
      return false;
    }

  }
  getemployeelist(page){
    this.branchid=this.tareportForm.get('branch').value.id;
    this.taservice.getemployeeval(this.branchid,'',page)
    .subscribe(result => {
      let datas=result['data']
      this.employeelist= datas
      if (this.employeelist.length >0){
        let pagination = result['pagination'];
        this.has_empnxt = pagination.has_next;
        this.has_emppre = pagination.has_previous;
        this.emppresnentpage = pagination.index;
      
      }
    }) 
  }
  autocompleteScroll_employee(){
    setTimeout(() => {
      if (this.empname && this.autocompleteTrigger && this.empname.panel) {
        fromEvent(this.empname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.empname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.empname.panel.nativeElement.scrollTop;
            const scrollHeight = this.empname.panel.nativeElement.scrollHeight;
            const elementHeight = this.empname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnxt === true) {
                this.taservice.getemployeeval(this.branchid,this.empinput.nativeElement.value, this.emppresnentpage + 1)
                  .subscribe((results: any[]) => {
                    this.emppresnentpage ++;
                    let datas = results['data'];
                    this.employeelist = this.employeelist.concat(datas);
                    if (this.employeelist.length >0){
                      let pagination = results['pagination'];
                      this.has_empnxt = pagination.has_next;
                      this.has_emppre = pagination.has_previous;
                      this.emppresnentpage = pagination.index;
                    
                    }
                  })
              }
            }
          });
      }
    });
  }
  public display_employee(emp?: employee): string | undefined {
    return emp ? emp.name : undefined;
  }
  
  total_count:any;
  // tourSearch(page){
  //   let emp_id:any;
  //   let grade:any;
  //   let branch_id:any;
  //   let from_date:any;
  //   let to_Date:any;

  //   debugger;
  //   this.spinner.show();
  //   this.tourno=this.tareportForm.get('requestno').value ||'';
  //   emp_id=this.tareportForm.get('employee').value?this.tareportForm.get('employee').value.id:'';
  //   grade =this.tareportForm.get('grade').value ||'';
  //   branch_id=this.tareportForm.get('branch').value?this.tareportForm.get('branch').value.id:'';
  //   // if(this.tareportForm.get('branch').value!='' && this.tareportForm.get('branch').value!=null){
  //   //   console.log('hi')
  //   //   branch_id=this.tareportForm.get('branch').value
      
  //   // }  
  //   from_date=this.tareportForm.get('fromdate').value ?this.datepipe.transform(this.tareportForm.get('fromdate').value,'yyyy-MM-dd'):'';
  //   to_Date=this.tareportForm.get('todate').value ?this.datepipe.transform(this.tareportForm.get('todate').value,'yyyy-MM-dd'):'' 
  
  //   this.taservice.gettoursearch( page,this.tourno,emp_id,grade,branch_id,from_date,to_Date)
  //   .subscribe(result=> {
  //     this.spinner.hide();
  //    this.gettourreportList=result['data']
  //    let datapagination = result["pagination"];
  //    this.total_count=result['count'];
  //    this.shareservice.tourData.next(this.tourno)
  //     if (this.gettourreportList.length >= 0) {
  //       this.has_next = datapagination.has_next;
  //       this.has_previous = datapagination.has_previous;
  //       this.presentpage = datapagination.index;
  //     }
  //   },error=>{
  //     this.spinner.hide();
  //   })
  

  // }
    tourSearch(page){
    let emp_id:any;
    let grade:any;
    let branch_id:any;
    let from_date:any;
    let to_Date:any;
    let month:any;
    debugger;
    this.spinner.show();
    this.tourno=this.tareportForm.get('requestno').value ||'';
    emp_id=this.tareportForm.get('employee').value?this.tareportForm.get('employee').value.id:'';
    grade =this.tareportForm.get('grade').value ||'';
    branch_id=this.tareportForm.get('branch').value?this.tareportForm.get('branch').value.id:'';
    // if(this.tareportForm.get('branch').value!='' && this.tareportForm.get('branch').value!=null){
    //   console.log('hi')
    //   branch_id=this.tareportForm.get('branch').value
      
    // }  
    from_date=this.tareportForm.get('fromdate').value ?this.datepipe.transform(this.tareportForm.get('fromdate').value,'yyyy-MM-dd'):'';
    to_Date=this.tareportForm.get('todate').value ?this.datepipe.transform(this.tareportForm.get('todate').value,'yyyy-MM-dd'):'' 
    month = this.tareportForm.get('month').value || '';
    this.taservice.gettoursearchnew( page,this.tourno,emp_id,grade,branch_id,from_date,to_Date,month)
    .subscribe(result=> {
      this.spinner.hide();
     this.gettourreportList=result['data']
     let datapagination = result["pagination"];
     this.total_count=result['count'];
     this.shareservice.tourData.next(this.tourno)
      if (this.gettourreportList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
      }
    },error=>{
      this.spinner.hide();
    })
  

  }
  First_Click(){
    if (this.presentpage !== 1){
      this.presentpage=1;
      this.tourSearch(this.presentpage)
    }
  }
  nextClick() {
    if (this.has_next === true) {
      this.presentpage +=1
      this.tourSearch(this.presentpage)
    }
  }
  
  previousClick() {
    if (this.has_previous === true) {
      this.presentpage -=1
      this.tourSearch(this.presentpage)
    }
  }
  last_Click(){
    const totalPages= Math.ceil(this.total_count/this.pageSize)
    if (this.presentpage !== totalPages) {
      this.presentpage = totalPages;
      this.tourSearch(this.presentpage);
    }
  }
  reset(){
    this.tareportForm.reset();
    this.tourSearch(1)

  }
  
tourdownload(){
  let tourno=this.tareportForm.get('requestno').value ||'';
  let empid=this.tareportForm.get('employee').value?this.tareportForm.get('employee').value.id:'';
  let branch = this.tareportForm.get('branch').value?this.tareportForm.get('branch').value.id:'';
  let grade =this.tareportForm.get('grade').value ||'';
  let fromdate=this.tareportForm.get('fromdate').value ?this.datepipe.transform(this.tareportForm.get('fromdate').value,'yyyy-MM-dd'):'';
  let todate=this.tareportForm.get('todate').value ?this.datepipe.transform(this.tareportForm.get('todate').value,'yyyy-MM-dd'):''
  this.spinner.show()
  this.taservice.gettouriddownload( tourno,branch,empid,grade,fromdate,todate)
          .subscribe((results) => {
            this.spinner.hide();
            if (results.type == "application/json") {
              this.toastr.error("No Data Found!");
              return false;
            } else {
              let binaryData = [];
              binaryData.push(results)
              let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
              let link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'Tour Report'+".xlsx";
              link.click();
              }

            },error=>{
              this.spinner.hide()

            })
           
          
}
// provisiondownload(){
//   let tourno=this.tareportForm.get('requestno').value ||'';
//   let empid=this.tareportForm.get('employee').value?this.tareportForm.get('employee').value.id:'';
//   let grade =this.tareportForm.get('grade').value ||'';
//   let fromdate=this.tareportForm.get('fromdate').value ?this.datepipe.transform(this.tareportForm.get('fromdate').value,'yyyy-MM-dd'):'';
//   let todate=this.tareportForm.get('todate').value ?this.datepipe.transform(this.tareportForm.get('todate').value,'yyyy-MM-dd'):''

//   this.spinner.show()
//   this.taservice.getprovisiondownload( tourno, empid,fromdate,todate)
//           .subscribe((results) => {
//             this.spinner.hide();
//             if(results['code']){
//               this.toastr.error(results['description'])
//               return false;
//             }else{
//               let binaryData = [];
//               binaryData.push(results)
//               let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
//               let link = document.createElement('a');
//               link.href = downloadUrl;
//               link.download = 'Prepare Excel'+".xlsx";
//                this.toastr.success('Prepare Excel Downloaded Successfully')
//               link.click();
//               }

//             },error=>{
//               this.spinner.hide()
//             })
           
          
// }

provisiondownload(){
  let tourno=this.tareportForm.get('requestno').value ||'';
  let empid=this.tareportForm.get('employee').value?this.tareportForm.get('employee').value.id:'';
  let grade =this.tareportForm.get('grade').value ||'';
  let fromdate=this.tareportForm.get('fromdate').value ?this.datepipe.transform(this.tareportForm.get('fromdate').value,'yyyy-MM-dd'):'';
  let todate=this.tareportForm.get('todate').value ?this.datepipe.transform(this.tareportForm.get('todate').value,'yyyy-MM-dd'):''
 let month: string = this.tareportForm.get('month')?.value || '';
  this.spinner.show()
  this.taservice.getprovisiondownloadnew( tourno, empid,fromdate,todate,month)
          .subscribe((results) => {
            this.spinner.hide();
            if(results['code']){
              this.toastr.error(results['description'])
              return false;
            }else{
              let binaryData = [];
              binaryData.push(results)
              // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
              // let link = document.createElement('a');
              // link.href = downloadUrl;
              // link.download = 'Prepare Excel'+".xlsx";
               this.toastr.success('Prepare Excel Downloaded Successfully')
              // link.click();
              }

            },error=>{
              this.spinner.hide()
            })
           
          
}
provisionreportdownload(){
  this.taservice.getprovisionreportdownload()
          .subscribe((results) => {
            this.spinner.hide();
            if(results['code']){
              this.toastr.error(results['description'])
              return false;
            }else{
              let binaryData = [];
              binaryData.push(results)
              let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
              let link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'Provision Report'+".xlsx";
              link.click();
              }

            },error=>{
              this.spinner.hide()
            })
           
}
gettourdetail(report){
  this.data = { index: 1 }
  this.sharedService.summaryData.next(this.data)
  this.shareservice.expensetourid.next(report)
  this.shareservice.tourno.next(this.tareportForm.get('requestno').value)
  this.shareservice.emp_id.next(this.tareportForm.get('employee').value)
  this.shareservice.branch_id.next(this.tareportForm.get('branch').value)
  this.shareservice.from_date.next(this.tareportForm.get('fromdate').value)
  this.shareservice.to_Date.next(this.tareportForm.get('todate').value)
  this.router.navigateByUrl("ta/reporttourdetail")
}
gettouradvance(report){
  this.data = { index: 1 }
  this.sharedService.summaryData.next(this.data)
  this.shareservice.expensetourid.next(report)
  this.shareservice.tourno.next(this.tareportForm.get('requestno').value)
  this.shareservice.emp_id.next(this.tareportForm.get('employee').value)
  this.shareservice.branch_id.next(this.tareportForm.get('branch').value)
  this.shareservice.from_date.next(this.tareportForm.get('fromdate').value)
  this.shareservice.to_Date.next(this.tareportForm.get('todate').value)
  this.router.navigateByUrl("ta/reporttouradvance")
}

gettourexpense(report){
  this.data = { index: 1 }
  this.sharedService.summaryData.next(this.data)
  this.shareservice.expensetourid.next(report)
  this.shareservice.tourno.next(this.tareportForm.get('requestno').value)
  this.shareservice.emp_id.next(this.tareportForm.get('employee').value)
  this.shareservice.branch_id.next(this.tareportForm.get('branch').value)
  this.shareservice.from_date.next(this.tareportForm.get('fromdate').value)
  this.shareservice.to_Date.next(this.tareportForm.get('todate').value)
  this.router.navigateByUrl("ta/reporttourexpense")
}
getadvanceapprovesumm(tour_id) {
  this.spinner.show()
  this.taservice.getapproveflowapalllist(tour_id, 'ap_verify')
    .subscribe(result => {
      this.spinner.hide()
      let datas = result['approve'];
      this.getAdvanceapproveList = datas;
    })
  }
  onInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement);
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    this.tareportForm.get('grade')?.setValue(input.value);
  }
  
}
