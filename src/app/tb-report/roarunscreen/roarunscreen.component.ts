import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TbReportService } from '../tb-report.service';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

export interface finyearLists {
  finyer: string;
  name:string;
}

@Component({
  selector: 'app-roarunscreen',
  templateUrl: './roarunscreen.component.html',
  styleUrls: ['./roarunscreen.component.scss']
})
export class RoarunscreenComponent implements OnInit {
  finyearList: any;
  from_month = [
    { id: 1, month: 'Apr', month_id: 4},
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8},
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10},
    { id: 8, month: 'Nov', month_id: 11},
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]
  data_found: boolean;
  has_next: boolean;
  has_previous: boolean;
  presentpage: number;
  back_roa:boolean=false;
  runscreen:boolean=true;
  status_list=[
    {'name':'Started',"id":1},
    {"name":"Processing","id":2},
    {"name":"Success","id":4}  ]
  constructor(private fb:FormBuilder,private dataService:TbReportService,private SpinnerService:NgxSpinnerService,private toastr:ToastrService,private errorHandler:ErrorhandlingService,) { }
  roarun:FormGroup;
  ngOnInit(): void {
    this.roarun=this.fb.group({
      finyear:"",
      frommonth:"",
      tomonth:"",
      status:""
    })
    this.roa_run_summary("")
  }

  finyear_dropdown() {
    this.dataService.getfinyeardropdown("", 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.finyearList = datas;
  
        })
      }
  public displayfnfinyear(fin_year?: finyearLists): string | undefined {
    return fin_year ? fin_year.finyer : undefined;

  }

  public displayStatus(aws_name?:finyearLists ): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }
  tomonthid:any;
  to_month_data:any;
  to_month_values:any;
  run_disable:boolean=false;
  to_month_fetch(){
    let finyear=this.roarun.value.finyear?.finyer??""
    this.roarun.controls['frommonth'].reset('')
    this.roarun.controls['tomonth'].reset('')
    // this.SpinnerService.show()
    this.tomonthid=""
    this.dataService.get_to_month_fetch(finyear)
        .subscribe((results: any) => {
          let datas = results;
          if(datas.set_code){
            this.run_disable=true
          this.toastr.warning(datas.set_code)          
          }else{
            this.run_disable=false
          // this.SpinnerService.hide()
          this.to_month_data = datas?.month;
          const monthObject = this.from_month.find(m => m.month_id ===  this.to_month_data); 
          this.tomonthid=monthObject.id
          this.to_month_values=monthObject
          }
        })
  }
  summary_data:any=[];
  roa_run_summary(value,page=1){
let status =this.roarun.value.status?.id??""
let finyear=this.roarun.value.finyear?.finyer??""
this.SpinnerService.show()
    this.dataService.roa_run_summary(status,page,finyear)
    .subscribe((results: any) => {
      let datas = results['data']  
  
      if (this.summary_data.length >= 0) {
        datas.forEach(item => {
          const fromMonth = this.from_month.find(month => month.month_id === item.from_month);
          const toMonth = this.from_month.find(month => month.month_id === item.to_month);
      
          item.from_month = fromMonth ? fromMonth.month : item.from_month;
          item.to_month = toMonth ? toMonth.month : item.to_month;
      });     
        this.summary_data=datas;
        this.SpinnerService.hide()
        console.log("summary",this.summary_data)
        let datapagination = results["pagination"];  
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_found=true
      }else{
        this.SpinnerService.hide()
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.data_found=false
      }

    },error=>{
      this.SpinnerService.hide()
    })
  }
  previousClick() {
    if (this.has_previous === true) {
      this.roa_run_summary("",this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.roa_run_summary("",this.presentpage + 1)
    }
  }

  reset(){
    this.roarun.reset()
    this.summary_data=[]
  }

  to_month_patch(){
  this.roarun.patchValue({
    tomonth:this.to_month_values.month
  })
}

roa_summary(){
  this.back_roa=true;
  this.runscreen=false;
}


roa_run_trigger(){
  
  if(this.roarun.value.finyear==""|| this.roarun.value.finyear === null || this.roarun.value.finyear === undefined){
    this.toastr.warning("","Please Select The Finyear")
    return false;
  }
  if(this.roarun.value.frommonth==""|| this.roarun.value.frommonth === null || this.roarun.value.frommonth === undefined){
    this.toastr.warning("","Please Select The From Month")
    return false;
  }
  const monthObject = this.from_month.find(m => m.month ===  this.roarun.value.tomonth); 
let params={
"fy":this.roarun.value.finyear?.finyer??"",
"from_month":this.roarun.value.frommonth?.month_id??"" ,
"to_month": monthObject?.month_id??"" ,
"branch":"",
"sectorid":"",
"report_type":1
}
  this.SpinnerService.show()
    this.dataService.roa_ppr_run_trigger(params)
    .subscribe((results: any) => {
      let datas = results
      this.SpinnerService.hide()
      if(datas.message){
         this.toastr.warning(datas.message)
        
      }else{
        this.toastr.success(datas.message)
      }
})
}
}
