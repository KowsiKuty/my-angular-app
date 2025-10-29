import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorhandlingService } from '../errorhandling.service';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { DssService } from '../dss.service';

const { read, write, utils } = XLSX;
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MMM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-dss-report',
  templateUrl: './dss-report.component.html',
  styleUrls: ['./dss-report.component.scss'],
  providers: [
    {
   provide: DateAdapter,
   useClass: MomentDateAdapter,
   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
 },

 {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
 DatePipe
],
})
export class DssReportComponent implements OnInit {
  dssreport_date=new FormControl('')
  dssreport=new FormControl('')
  dssreportfrom_date=new FormControl('')
  dssreportto_date=new FormControl('')
  dss_report_data: any;
  dss_date: any;
  end_date: any;
  index_expense: any;
  header_name: any[];
  exlcount: number=1;
  file_details: any;
  dss_report_param: { date: any; type: any; };
  filedata: any;
  dssuploaddetails: boolean=false;
  exldown: number=1;
  growth_uses: number;
  month_balance: number;
  uses_mtd: number;
  dss_average: any;
  average: any=false;
  report: any=true;
  average_view: boolean=false;
  fromdate: string;
  todate: string;
  average_download: number=1;
  dss_diff: boolean=false;
  constructor(private errorHandler: ErrorhandlingService,public datepipe: DatePipe,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  dss_report_view=false
  dss_report:boolean=false
  dss_averageshow=false
  upload_dss=true
  dssaverage:FormGroup
  current_date=new Date();
  ngOnInit(): void {
    this.dssaverage=this.formBuilder.group({
      averagefrom_date:[''],
      averageto_date:['']
    })
  }
  dss_summary_clear(){
    this.dssreport_date.reset('')
    this.dssaverage.controls['averagefrom_date'].reset('')
    this.dssaverage.controls['averageto_date'].reset('')

  }
  changeview:boolean
  dss_report_change(view){
    this.changeview=view
    if(view==true){
      this.SpinnerService.show()
      this.dataService.dss_report(this.dss_report_param).subscribe((data:any)=>{
        this.SpinnerService.hide()
        this.dss_report_view=true
        this.dssuploaddetails=false
        this.dss_report=true
        this.average_view=false
        this.upload_dss=true
      console.log("data=>",data['data'])
      let dssdata=data['data']
      this.dss_report_data=dssdata
      for (let level of this.dss_report_data) {
        level['Padding_left'] = "10px"
        level['tree_flag']='Y'
        level['color']="#000"

      
      }
      console.log(this.dss_report_data)
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    }
    if(view==false){
      let overall={
        date:this.dss_report_param.date
      }
      this.SpinnerService.show()
      this.dataService.dss_overall(overall).subscribe((results)=>{
        this.SpinnerService.hide()
        let dss_overall=results['data']
        let head_groups=[]
        dss_overall.findIndex((e, i) => {
          if (e.name == 'Sources') {
            e['Padding_left'] = '10px';
            e['Padding'] = '5px';
            const { head_group, ...sourse } = this.dss_report_data[i];
            head_groups.push(sourse);
            e.head_group.findIndex((head, ind) => {
              e.head_group[ind]['Padding_left'] = '50px';
              e.head_group[ind]['Padding'] = '5px';
              const { sub_group, ...head_grp } = e.head_group[ind];
              head_groups.push(head_grp);
              head.sub_group.findIndex((sub, sub_ind) => {
                head.sub_group[sub_ind]['Padding_left'] = '100px';
                head.sub_group[sub_ind]['Padding'] = '5px';
                const { gl_subgroup, ...sub_grp } = head.sub_group[sub_ind];
                head_groups.push(sub_grp);
                sub?.gl_subgroup?.findIndex((gl, gl_ind) => {
                  sub.gl_subgroup[gl_ind]['Padding_left'] = '120px';
                  sub.gl_subgroup[gl_ind]['Padding'] = '5px';
                
                    let glcode=gl['name'].slice(0,6)
                    console.log("glcode=>",glcode)
                    if(glcode==112101){
                      gl['Padding_left'] = "120px"
                      gl['color']="#000"
                      gl['gl']='true'
                    }else{
                      gl['Padding_left'] = "120px"
                      gl['color']="#000"
                      gl['gl']='false'
                     
                    }
                  head_groups.push(sub.gl_subgroup[gl_ind]);
                });
              });
            });
          }
          if (e.name == 'Uses') {
            const { head_group, ...uses } = this.dss_report_data[i];
            head_groups.push(uses);
            e.head_group.findIndex((head, ind) => {
              e.head_group[ind]['Padding_left'] = '50px';
              e.head_group[ind]['Padding'] = '5px';
              const { sub_group, ...head_grp } = e.head_group[ind];
              head_groups.push(head_grp);
              head.sub_group.findIndex((sub, sub_ind) => {
                head.sub_group[sub_ind]['Padding_left'] = '100px';
                head.sub_group[sub_ind]['Padding'] = '5px';
                const { gl_subgroup, ...sub_grp } = head.sub_group[sub_ind];
                head_groups.push(sub_grp);
                sub?.gl_subgroup?.findIndex((gl, gl_ind) => {
                  sub.gl_subgroup[gl_ind]['Padding_left'] = '120px';
                  sub.gl_subgroup[gl_ind]['Padding'] = '5px';
                  sub.gl_subgroup[gl_ind]['gl']='false'
                  head_groups.push(sub.gl_subgroup[gl_ind]);
                });
              });
            });
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        });
        let prl:any
        console.log(head_groups);
        for(let ind in head_groups){
          if(head_groups[ind]?.gl=='true'){
            this.SpinnerService.show()
            this.dataService.dss_report_profitorloss(overall).subscribe((results:any)=>{
              this.SpinnerService.hide()
              
          
            console.log("data=>",results['data'])
            let dssdata=results['data']
            
            this.growth_uses=((dssdata[0]?.value[0]?.closing_balance - dssdata[0]?.value[1]?.closing_balance) / dssdata[0]?.value[1]?.closing_balance) * 100
            this.uses_mtd= ((dssdata[0]?.value[0]?.closing_balance - dssdata[0]?.value[0]?.opening_balance) /dssdata[0]?.value[0]?.opening_balance) * 100
            for (var val of dssdata) {     
                val['Padding_left'] = "130px"
                val['tree_flag']='Y'
                val['color']="#66bb6a"                       
            }
            prl=val
            console.log(prl)
            let indexval=Number(ind)
            console.log(prl,indexval)
            head_groups.splice(indexval+1, 0, prl);
            }, error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            });
          
            break;
          }
        }
        this.dss_report_data = head_groups;
      })
    }
  }
  dss_summary_search(date,source){
  if(this.report==true){
     if(date==''){
      this.toastr.warning("","Please Select The Date", { timeOut: 1500 });
      return false;
    }
    
    console.log(date)
    let year =date._i.year
    let month = date._i.month
    let day = date._i.date
    const today = new Date()
    const yesterday = new Date(date)
    yesterday.setDate(yesterday.getDate() - 1)
    this.end_date =this.datepipe.transform(yesterday, 'yyyy-MM-dd');
    
    

    console.log("date=>",yesterday,this.end_date,day,month,year)
    this.dss_date = moment({year: year , month: month, day: day}).format('YYYY-MM-DD');
        this.header_name=[this.dss_date,this.end_date]

    console.log("date",this.header_name,this.dss_date,this.end_date,source)
    this.dss_report_param={
      "date":this.dss_date,
      "type":source
    }
    this.changeview=true
    this.dss_report_change(this.changeview)
  }
  if(this.average==true){
    let average=this.dssaverage.value
    if(average.averagefrom_date=='' || average.averagefrom_date==undefined || average.averagefrom_date==null){
      this.toastr.warning("","Please Select The From Date", { timeOut: 1500 });
      return false;
    } if(average.averageto_date=='' || average.averageto_date==undefined || average.averageto_date==null){
      this.toastr.warning("","Please Select The To Date", { timeOut: 1500 });
      return false;
    }
    let from_date=average.averagefrom_date
    let year =from_date._i.year
    let month = from_date._i.month
    let day = from_date._i.date
    this.fromdate = moment({year: year , month: month, day: day}).format('YYYY-MM-DD');
    let to_date=average.averageto_date
    let to_date_year =to_date._i.year
    let to_date_month = to_date._i.month
    let to_date_day = to_date._i.date
    this.todate = moment({year: to_date_year , month: to_date_month, day: to_date_day}).format('YYYY-MM-DD');
    let dss_average_param={
      "from_date":this.fromdate,
      "to_date":this.todate,
      'type':1
    }
    console.log("datehidden=>",this.datehidden)
    this.SpinnerService.show()
    this.dataService.dss_average(dss_average_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
         if(results['data'].length==0){
        this.toastr.warning('','No Data Found',{timeOut:1500})
        
        
        return false;
      }else{
        this.dss_diff=results.set_flag
        let data=results['data']
        for(let val of data){
          val['Padding_left']='10px',
          val['tree']='s'
        }
        this.dss_average=data
        this.upload_dss=false
        this.dss_report_view=false
        this.dssuploaddetails=false
        this.dss_report=true
        this.average_view=true
      }
      
      
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

  }
  }

  treelevel_click(index,dssreport,dss_report_data){
    let a=[]
    let a2 = index + 1
    console.log("tree")
    if (dssreport.tree_flag == 'N') {
      if (dssreport.Padding_left == '10px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (dssreport.Padding_left == '50px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){
         
          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (dssreport.Padding_left == '100px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }

        }
      }
      if (dssreport.Padding_left == '120px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '130px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px') || (a1.Padding_left=='120px')) { break; }

        }
      }
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = dss_report_data.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[index].tree_flag = 'Y'
      this.dss_report_data = arrayWithValuesRemoved;

     
    }else{
      if (dssreport.Padding_left == '10px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":2,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '50px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":3,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '100px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":4,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '120px' && dssreport.gl=='true') {
      let dss_report_param={
        "date":this.dss_date,
      }
      console.log(dssreport)
      let different=0
      this.calretain(different,index,dss_report_data,dss_report_param)
    }
    
  }
  
  }
  calretain(diff,ind,data,dss_report_param){
    this.index_expense = ind + 1
    this.SpinnerService.show()
    this.dataService.dss_report_profitorloss(dss_report_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      
   
    console.log("data=>",results['data'])
    let dssdata=results['data']
    this.dss_report_data=dssdata
    this.growth_uses=((this.dss_report_data[0]?.value[0]?.closing_balance - this.dss_report_data[0]?.value[1]?.closing_balance) / this.dss_report_data[0]?.value[1]?.closing_balance) * 100
    this.uses_mtd= ((this.dss_report_data[0]?.value[0]?.closing_balance - this.dss_report_data[0]?.value[0]?.opening_balance) /this.dss_report_data[0]?.value[0]?.opening_balance) * 100
    for (var val of dssdata) {     
        val['Padding_left'] = "130px"
        val['tree_flag']='Y'
        val['color']="#66bb6a"
        data[ind]['tree_flag']='N'
      
    }
      data.splice(this.index_expense, 0, val);
      this.index_expense = this.index_expense + 1
    
      this.dss_report_data=data
    
    console.log(this.dss_report_data)

  },error =>{
    this.SpinnerService.hide()
  })
  }
  dss_expand_data(ind,singledata,data,dss_param){
    this.index_expense = ind + 1
    console.log("singledata=>",singledata)
    this.SpinnerService.show()
    this.dataService.dss_report(dss_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("level1=>",results['data'])
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
          if(dss_param['type']==2){
            val['Padding_left'] = "50px"
            val['tree_flag']='Y'
            val['color']="#000"
            data[ind]['tree_flag']='N'
          }
          if(dss_param['type']==3){
            val['Padding_left'] = "100px"
            val['tree_flag']='Y'
            val['color']="#000"
            data[ind]['tree_flag']='N'

          }
          if(dss_param['type']==4){
            let glcode=val['name'].slice(0,6)
            console.log("glcode=>",glcode)
            if(glcode==112101){
              val['Padding_left'] = "120px"
              val['tree_flag']='Y'
              val['color']="#000"
              val['gl']='true'
              data[ind]['tree_flag']='N'
            }else{
              val['Padding_left'] = "120px"
              val['tree_flag']='Y'
              val['color']="#000"
              val['gl']='false'
              data[ind]['tree_flag']='N'
            }
            

          }
          let a = data

          data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
        }
        console.log("data=>",data)
        this.dss_report_data=data
        console.log("dss_report_data=>",this.dss_report_data)

        
        }
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  @ViewChild('tabledata')exceldownload_table : ElementRef;

  export(){
    let fileName="DSS-Report.xlsx"
    let element 
    if(this.dss_report_view==true){
      element = document.getElementById('commonstyle') as HTMLTableElement;
      if(this.exlcount==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.exlcount=2
    }if(this.dssuploaddetails==true){
      element = document.getElementById('commonstyle1') as HTMLTableElement;
      if(this.exldown==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.exldown=2

    }if(this.average_view==true){
      element = document.getElementById('average_file') as HTMLTableElement;
      if(this.average_download==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.average_download=2
    }
  
    

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    for (let key in ws) {
        
      if (ws[key].v === '') {
        ws[key].v=0.00
        ws[key].t='f'
    }
  }


  let myNewData:string[][]
    if(this.average_view==true){
     myNewData = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],[`From  Date:${this.fromdate}`,`To Date:${this.todate}`,'','','','','','','Amount In Crores']];
    }else{
     myNewData = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],['','','','','','','','','Amount In Crores']];
    }
console.log("myNewData=>",myNewData)

XLSX.utils.sheet_add_aoa(ws, myNewData);
console.log("ws=>",ws)

console.log("myNewData=>",ws)
    const newworkbook = XLSX.utils.book_new();
    console.log("newworkbook=>",newworkbook)

    
    XLSX.utils.book_append_sheet(newworkbook, ws,  'DSS-Report');
    XLSX.writeFile(newworkbook, fileName);
    element=''
  }
  upload_file(e){
    console.log("event=>",e.target.files[0])
    let file_uplode=e.target.files[0]
   this.file_details=file_uplode
  }
  clear_filedetails(){
    this.dssreport.reset('')
    this.file_details=''
  }
  @ViewChild('closepop')closepop
  upload(){
    if(this.file_details==null || this.file_details==undefined || this.file_details==''){
      this.toastr.warning('', 'Please Select The Any .xlsx File', { timeOut: 1500 });
      return false;

    }
    
    this.SpinnerService.show()
    this.dataService.dssupload(this.file_details).subscribe((e:any)=>{
    this.SpinnerService.hide()
    console.log("element=>",e.message)
    if(e.status=='success'){

      this.toastr.success("","successfully Created",{timeOut:1500})
      let dssfile:any=e['message']['data']
      if(dssfile.length>0){
        this.filedata=dssfile
        this.dss_report_view=false
        this.dssuploaddetails=true
        this.average_view=false
        this.dss_report=true
        this.upload_dss=true
        this.closepop.nativeElement.click();
        this.dssreport.reset('')
        this.dssreport_date.reset('')
        
      }else{
        this.closepop.nativeElement.click();
        this.dssuploaddetails=false
        this.dss_report=false
        this.upload_dss=true
        this.average_view=false
        
        this.dssreport.reset('')
        if(this.dssreport_date.value!=''){
          this.changeview=true
          this.dss_summary_search(this.dssreport_date.value,1)
        }
      }
    }

        
      console.log("filedata=>",this.filedata)
      
      this.dssreport.reset('')
      
  },error=>{
    console.log('error',error)
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
  datehidden=false
  averagechanges(e){
    this.dssreport_date.reset('')
    this.dssreportfrom_date.reset('')
    this.dssreportto_date.reset('')
    if(e==true){
      this.datehidden=true 
    }else{
      this.datehidden=false
    }
    console.log("chenge=>",e)
  }
  budget_upload(){

  }
  report_to_average(e){
    console.log("event=>",e)
    let report_or_average=e.checked
    if(report_or_average==true){
      this.dssreport_date.reset('')
      this.dssaverage.controls['averagefrom_date'].reset('')
      this.dssaverage.controls['averageto_date'].reset('')
      this.dss_report_view=false
      this.dssuploaddetails=false
      this.dss_report=false
      this.upload_dss=false
      this.average_view=false
      this.average=true
      this.report=false
      console.log('average=>',this.average,this.report)
    }else{
      this.dssreport_date.reset('')
      this.dssaverage.controls['averagefrom_date'].reset('')
      this.dssaverage.controls['averageto_date'].reset('')
      this.dss_report_view=false
      this.dssuploaddetails=false
      this.dss_report=false
      this.upload_dss=true
      this.average_view=false
      this.report=true
      this.average=false
      console.log('report=>',this.average,this.report)
    }
  }
  tree_level_average(ind,average_single,total_average_data){
    let a=[]
    let a2 = ind + 1
    console.log("tree")
    if (average_single.tree == 'N') {
      if (average_single.Padding_left == '10px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px') ){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (average_single.Padding_left == '50px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px') ){
         
          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (average_single.Padding_left == '100px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '120px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }

        }
      }
     
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = total_average_data.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[ind].tree = 's'
      this.dss_average = arrayWithValuesRemoved;

     
    }else{
      if (average_single.Padding_left == '10px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":2,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
    if (average_single.Padding_left == '50px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":3,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
    if (average_single.Padding_left == '100px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":4,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
  
    
  }

  }
  average_expand_data(ind,average_single,total_average_data,average_param){
    this.index_expense = ind + 1
    console.log("singledata=>",average_single)
    this.SpinnerService.show()
    this.dataService.dss_average(average_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("level1=>",results['data'])
      
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {
 
        for (var val of datas) {
          
          if(average_param['type']==2){
            val['Padding_left'] = "50px"
            val['tree']='s'
            total_average_data[ind]['tree']='N'
          }
          if(average_param['type']==3){
            val['Padding_left'] = "100px"
            val['tree']='s'           
            total_average_data[ind]['tree']='N'

          }
          if(average_param['type']==4){         
              val['Padding_left'] = "120px"
              val['tree']='s'
              total_average_data[ind]['tree']='N'          
          }
          let a = total_average_data

          total_average_data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
        }
        console.log("data=>",total_average_data)
        // data[ind].tree_flag = 'N'  
        this.dss_average=total_average_data
        console.log("dss_report_data=>",this.dss_report_data)
        }
      
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

  }
  fromdatechanges(){
    this.dssaverage.controls['averageto_date'].reset('')
    

  }
}
