import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TaService } from '../ta.service';
import { ToastrService } from 'ngx-toastr';
// import { error } from 'console';
import { MatAutocomplete ,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { map,takeUntil} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { DatePipe } from '@angular/common';

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
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss'],
  

})
export class GstReportComponent implements OnInit {
 @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 @ViewChild('branchname') branchname:MatAutocomplete;
 @ViewChild('branchinput') branchinput:ElementRef;
 @ViewChild('empname') empname:MatAutocomplete;
 @ViewChild('empinput') empinput:ElementRef;

  tagstReportForm:FormGroup|any;
  gstreportlist:any=[];
  has_previous:boolean=false;
  presentpage:number=1;
  has_next:boolean=false;
  pageSize:number=10;
  isLoading:boolean=false;
  has_branchnxt:boolean=false;
  has_branchpre:boolean=false;
  branchpresentpage:number=1;
  branchlist:any;
  employeelist:any;
  has_emppre:boolean=false;
  has_empnxt:boolean=false;
  emppresnentpage:number=1;
  branchid:any;
  today:any;
  sixMonthsAgo:any;

  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private taservice:TaService,private toastr:ToastrService,private datepipe:DatePipe) { }

  ngOnInit(): void {

    this.tagstReportForm=this.fb.group({
      'requestno':new FormControl(''),
      'branch':new FormControl(''),
      'employee':new FormControl(''),
      'fromdate':new FormControl(''),
      'todate':new FormControl('')

    })
    this.tagstReportForm.get('branch').valueChanges.pipe(
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
  
    
    this.tagstReportForm.get('employee').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(()=>{this.isLoading=true;
      }),
      switchMap(value=>this.taservice.getemployeeval(this.branchid,value!=null?value:'',1).pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      ))
    ).subscribe((results: any[]) => {
      this.employeelist=results['data'];
    });


    this.getbranchlist();
    this.gstSearch(1,'summary')
    this.today = new Date();
    this.sixMonthsAgo = new Date();
    this.sixMonthsAgo.setMonth(this.today.getMonth() - 6);
  }

  totalcount:any;
  gstSearch(page,hint){
    if(hint=='search' && (!((this.tagstReportForm.get('requestno').value)||(this.tagstReportForm.get('employee').value)||(this.tagstReportForm.get('branch').value)||(this.tagstReportForm.get('fromdate').value)||(this.tagstReportForm.get('todate').value)))){
      this.toastr.warning('Please Select Any One Field')
      return false;
    }
    let tourno = this.tagstReportForm.get('requestno').value || '';
    let branch_id =this.tagstReportForm.get('branch').value.id?this.tagstReportForm.get('branch').value.id: '';
    let empid = this.tagstReportForm.get('employee').value.id?this.tagstReportForm.get('employee').value.id: '';
    let fromdate=this.tagstReportForm.get('fromdate').value ?this.datepipe.transform(this.tagstReportForm.get('fromdate').value,'yyyy-MM-dd'):'';
    let todate=this.tagstReportForm.get('todate').value ?this.datepipe.transform(this.tagstReportForm.get('todate').value,'yyyy-MM-dd'):''
    this.spinner.show();
    this.taservice.getgstreport(page,tourno,branch_id,empid,fromdate,todate)
    .subscribe(result=> {
      this.spinner.hide()
      if (result.code === "INVALID_DATA") {
        this.toastr.error(result.description)
          return false
      } 
      else if (result.code === "UNEXPECTED_ERROR") {
        this.toastr.error(result.description)
        return false

      }
     this.gstreportlist=result['data']
     this.totalcount=result['count'];
     if(this.gstreportlist.length>0){
      let pagination=result['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    }
  },
  error=>{
    this.spinner.hide()
  })


  }

  download(){
    let tourno = this.tagstReportForm.get('requestno').value ||'';
    let empid = this.tagstReportForm.get('employee').value ?this.tagstReportForm.get('employee').value.id:'';
    let branch = this.tagstReportForm.get('branch').value ?this.tagstReportForm.get('branch').value.id:'';
    let fromdate=this.tagstReportForm.get('fromdate').value ?this.datepipe.transform(this.tagstReportForm.get('fromdate').value,'yyyy-MM-dd'):'';
    let todate=this.tagstReportForm.get('todate').value ?this.datepipe.transform(this.tagstReportForm.get('todate').value,'yyyy-MM-dd'):''     
      
    this.spinner.show();
    this.taservice.getgstdownload(tourno,branch,empid,fromdate,todate).subscribe(data=>{
      this.spinner.hide();
      if (data.type == "application/json") {
        this.toastr.error("No Data Found!");
        return false;
      } else {
      let blob=new Blob([data])
      let link=document.createElement('a')
      link.href=window.URL.createObjectURL(blob)
      link.download='Employee GST Report'+".xlsx";
      link.click();
    }
  },
    error=>{
      this.spinner.hide();
    })
  }
  reset(){
    let myform = this.tagstReportForm;
    myform.patchValue({
      requestno: '',
      branch : '',
      employee : '',
      fromdate : '',
      todate : ''
    })
    this.gstSearch(1,'summary');

  }
  previousClick(){
    if(this.has_previous===true){
      this.presentpage -=1
      this.gstSearch(this.presentpage,'summary');

    }

  }
  nextClick(){
    if(this.has_next===true){
      this.presentpage +=1
      this.gstSearch(this.presentpage,'summary');

    }

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
    this.branchpresentpage = 1
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
                this.taservice.getbranchValue(this.branchinput.nativeElement.value, this.branchpresentpage + 1)
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
    return  branch ? "(" + branch.code + ") " + branch.name : undefined;
  }
  branchchoosen(){
    let branchid=this.tagstReportForm.get('branch').value.id;
    if(!branchid){
      this.toastr.warning("Please Select The Branch");
      this.tagstReportForm.get('branch').reset();
      this.employeelist=[];
      return false;
    }
  }


  getemployeelist(page){
    this.branchid=this.tagstReportForm.get('branch')?.value.id|| '';
    this.taservice.getemployeeval(this.branchid,'',page)
    .subscribe(result => {
      const datas=result['data']
      this.employeelist= datas
      console.log("Emp",this.employeelist)
      if (this.employeelist.length >0){
        const pagination = result['pagination'];
        this.has_empnxt = pagination.has_next;
        this.has_emppre = pagination.has_previous;
        this.emppresnentpage = pagination.index;
      
      }
    }) 
  }
  // autocompleteScroll_employee(){

  //   setTimeout(() => {
  //     if (this.empname && this.autocompleteTrigger && this.empname.panel) {
  //       fromEvent(this.empname.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.empname.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.empname.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.empname.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.empname.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_branchnxt === true) {
  //               this.taservice.getemployeeval(this.branchid,this.empinput.nativeElement.value, this.emppresnentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   this.emppresnentpage ++;
  //                   let datas = results['data'];
  //                   this.employeelist = this.branchlist.concat(datas);
  //                   if (this.employeelist.length >0){
  //                     let pagination = results['pagination'];
  //                     this.has_empnxt = pagination.has_next;
  //                     this.has_emppre = pagination.has_previous;
  //                     this.emppresnentpage = pagination.index;
                    
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  autocompleteScroll_employee() {
    setTimeout(() => {
      if (this.empname && this.autocompleteTrigger && this.empname.panel) {
        fromEvent(this.empname.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.empname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.empname.panel.nativeElement.scrollTop;
            const scrollHeight = this.empname.panel.nativeElement.scrollHeight;
            const elementHeight = this.empname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnxt === true) { 
              this.taservice.getemployeeval(this.branchid, this.empinput.nativeElement.value, this.emppresnentpage + 1)
                .subscribe((results: any[]) => {
                  this.emppresnentpage++;
                  const datas = results['data'];
                  this.employeelist = this.employeelist.concat(datas);
                  console.log("Emp1",this.employeelist) 
                  if (this.employeelist.length > 0) {
                    const pagination = results['pagination'];
                    this.has_empnxt = pagination.has_next;
                    this.has_emppre = pagination.has_previous;
                    this.emppresnentpage = pagination.index;
                  }
                });
            }
          }
        });
      }
    });
  }
  
  public display_employee(emp?: employee): string | undefined {
    return emp ? emp.name : undefined;
  }
  
  

}
