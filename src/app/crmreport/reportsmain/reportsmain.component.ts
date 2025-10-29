import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ReportService } from 'src/app/report/report.service';
import { ReportsService } from '../reports.service';

@Component({
    selector: 'app-reportsmain',
    templateUrl: './reportsmain.component.html',
    styleUrls: ['./reportsmain.component.scss']
})
export class ReportsmainComponent implements OnInit {

    dropDownTag: any
    ModuleList: any;
    reportdata: any;
    reportmapdata: any;
    moduledata: any;
    submodulelist: any;

    productbool: boolean = false;
    leadbool: boolean = false;
    productandleadbool=false;
    sourceboolean=false;

    reportleadsummary=[];
    reportsummarydata=[];
    leadandproductsummary=[];

    productlead_has_next=true;
    productlead_has_previous=true;
    productlead_current_page=1;

    reportlead_has_next=true;
    reportlead_has_previous=true;
    reportlead_current_page=1;
    SelectedDataJson=[];

    searchform:FormGroup
    leadform:FormGroup;
    productandleadform:FormGroup
    productform:FormGroup
    sourceform:FormGroup

    productsummary=[];
    product_has_next=true;
    product_has_previous=true;
    product_current_page=1;

    sourcesummary=[];
    source_has_next=true;
    source_has_previous=true;
    source_current_page=1;

    constructor(private reportsservice: ReportsService,private datepipe:DatePipe,private fb:FormBuilder,private spinner:NgxSpinnerService) { }

    ngOnInit(): void {

        this.getreportdata()
        this.getreportmapdata()

     
        this.moduledropdwon()
        
        this.searchform=this.fb.group({

        })

        this.leadform=this.fb.group({
            name:[''],
            code:['']
        })

        this.productform=this.fb.group({
            name:[''],
            code:['']
        })

        this.sourceform=this.fb.group({
            name:['']
        })


        this.productandleadform=this.fb.group({
            product:[''],
            lead:[''],
            date:[''],
            leadstatus:[''],
            converteddate:['']
        })

    }


    getreportdata() {
        this.reportsservice.getreportsummary(1).subscribe(
            result => {
                this.reportdata = result['data']
            }
        )
    }

    getreportmapdata() {
        this.reportsservice.getreportmapsummary(1).subscribe(
            result => {
                this.reportmapdata = result['data']
            }
        )
    }

    getreports(page) {
        // product,lead,date,leadstatus,converteddate,

        const form = this.productandleadform.value;

        let product = (form.product != null && form.product != undefined )? form.product:''
        let lead = (form.lead != null && form.lead != undefined )? form.lead:''

        let date = (form.date != null && form.date != undefined )? (this.datepipe.transform(form.date, 'yyyy-MM-dd') != null )? this.datepipe.transform(form.date, 'yyyy-MM-dd'):'' :''

        let leadstatus = (form.leadstatus != null && form.leadstatus != undefined )? form.leadstatus:''

        let converteddate = (form.converteddate != null && form.converteddate != undefined )? (this.datepipe.transform(form.converteddate, 'yyyy-MM-dd') != null)  ? this.datepipe.transform(form.converteddate, 'yyyy-MM-dd') :'' :''

        this.spinner.show()
        
        this.reportsservice.getreport(product,lead,date,leadstatus,converteddate,page).subscribe(
            result => {
                this.spinner.hide()

                console.log(result)
                this.reportsummarydata = result['data']
                let pagination=result['pagination']
                if(this.reportsummarydata.length != 0){
                    this.productlead_has_next=pagination['has_next']
                    this.productlead_has_previous=pagination['has_previous']
                    this.productlead_current_page=pagination['index']


                }
            },(error)=>{
                this.spinner.hide()
            }

        )
    }

    moduledropdwon() {
        this.reportsservice.getmoduledropdown().subscribe(
            result => {
                this.ModuleList = result['data']
            }
        )
    }

    getsubmoduledropdown(id) {
        this.reportsservice.getsubmoduledropdown(id).subscribe(
            result => {
                this.submodulelist = result['data']
            }
        )
    }

    getsearchfilters(value) {
        this.reportsservice.getreportsearchfilters(value).subscribe(
            result => {
                this.searchfilter(result)
            }
        )
    }

    submodulesummary(value) {
        this.productbool = false
        this.leadbool = false
        this.productandleadbool=false
        this.sourceboolean=false

        if (value == 'PRODUCT') {
            this.getproductsummary('','',this.product_current_page=1)
            this.productbool = true
        }
        if (value == 'LEAD') {
            this.getlead('','',this.reportlead_current_page=1)
            this.leadbool = true
        }
        if(value == 'PRODUCT & LEAD'){
            this.getreports(this.productlead_current_page=1)
            this.productandleadbool=true
        }

        if(value == 'SOURCE' ){
            this.getsourcesummary('',this.source_current_page=1)
            this.sourceboolean=true
        }

    }


    getlead(name,code,page) {
        
        name=(name != null && name != undefined)? name:''
        code=(code != null && code != undefined)? code:''

        this.spinner.show()
        this.reportsservice.getlead(name,code,page).subscribe(
            result => {
            this.spinner.hide()

                console.log(result)
                this.reportleadsummary = result['data']
                let pagination=result['pagination']
                if(this.reportleadsummary.length != 0){
                    this.reportlead_has_next=pagination['has_next']
                    this.reportlead_has_previous=pagination['has_previous']
                    this.reportlead_current_page=pagination['index']


                }
            },(error)=>{
                this.spinner.hide()
            }

        )
    }

    getleadreport() {

        this.reportsservice.getleadreportexceldownload().subscribe(
            data => {
                let binaryData = [];
                binaryData.push(data)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                let link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.datepipe.transform(new Date(),'dd-MMM-yyyy')+' Lead Report' + ".xlsx";
                link.click();
            }, (error) => {
                this.spinner.hide()
            }
        )

    }

    getproductleadexcel() {

        this.reportsservice.getleadandreport().subscribe(
            data => {
                let binaryData = [];
                binaryData.push(data)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                let link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.datepipe.transform(new Date(),'dd-MMM-yyyy')+' Product & Lead Report' + ".xlsx";
                link.click();
            }, (error) => {
                this.spinner.hide()
            }
        )

    }

    productlead_previous(){

        if(this.productlead_has_previous){
            this.getreports(this.productlead_current_page-1)

        }

    }

    productlead_nextpage(){
        if(this.productlead_has_next){
            this.getreports(this.productlead_current_page+1)

        }
    }

    reportlead_nextpage(){
        if(this.reportlead_has_next){
            this.getlead(this.leadform.value.name,this.leadform.value.code,this.reportlead_current_page+1)
        }
    }

    reportlead_previouspage(){
        if(this.reportlead_has_previous){
            this.getlead(this.leadform.value.name,this.leadform.value.code,this.reportlead_current_page-1)
        }
    }
    
    searchfilter(result){
        this.SelectedDataJson=[]
        for(let i in this.searchform.value){
            console.log(this.searchform.value)
            this.searchform.removeControl(i); 

        }

        let arr=result['data']
        console.log('arr',arr)
        for(let i=0;i<arr.length;i++){
          console.log(arr[i])
          let controls = {
            "name": arr[i].name,
            "label":arr[i].name,
            "value": "",
            "type": arr[i].type?.name.toLowerCase()
          } 
          this.SelectedDataJson.push(controls)
    
        }
        let arrset:any = this.SelectedDataJson  
        console.log("controls data", this.SelectedDataJson)
    
        for (const control of arrset) { 
          console.log("loop control", control)
          this.searchform.addControl(control.name,this.fb.control(control.value));
        }
        console.log(this.searchform.value)
      }

      getproductsummary(name,code,page){
        name=(name != null && name != undefined)? name:''
        code=(code != null && code != undefined)? code:''


        this.spinner.show()
        this.reportsservice.getproductsummary(name,code,page).subscribe(
            result => {
                  this.spinner.hide()

                console.log(result)
                this.productsummary = result['data']
                let pagination=result['pagination']
                if(this.productsummary.length != 0){
                    this.product_has_next=pagination['has_next']
                    this.product_has_previous=pagination['has_previous']
                    this.product_current_page=pagination['index']


                }
            },(error)=>{
                this.spinner.hide()
            }

        )
      }

      product_previous(){
        if(this.product_has_previous){
            this.getproductsummary(this.productform.value.name,this.productform.value.code,this.product_current_page-1)
        }
      }

      product_next(){
        if(this.product_has_next){
           this.getproductsummary(this.productform.value.name,this.productform.value.code,this.product_current_page+1)
        }
      }

      getproductexceldownload() {

        this.reportsservice.getproductexcel().subscribe(
            data => {
                let binaryData = [];
                binaryData.push(data)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                let link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.datepipe.transform(new Date(),'dd-MMM-yyyy')+' Product Report' + ".xlsx";
                link.click();
            }, (error) => {

            }
        )
    
    }

    getsourcesummary(name,page){

        name=(name != null && name != undefined)? name:''
     
        this.spinner.show()
        this.reportsservice.getsourcesummary(name,page).subscribe(
            result =>{
                this.spinner.hide()
                this.sourcesummary = result['data']
                let pagination=result['pagination']
                if(this.sourcesummary.length != 0){
                    this.source_has_next=pagination['has_next']
                    this.source_has_previous=pagination['has_previous']
                    this.source_current_page=pagination['index']
                }
            },(error) =>{

            }
        )
    }

    sourceprevious(){
        if(this.source_has_previous){
            this.getsourcesummary(this.sourceform.value,this.source_current_page-1)
        }
    }

    sourcenext(){
        if(this.source_has_next){
            this.getsourcesummary(this.sourceform.value,this.source_current_page+1)
        }
    }

    getsourceexceldownload() {

        this.reportsservice.getsourceexceldownload().subscribe(
            data => {
                let binaryData = [];
                binaryData.push(data)
                let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                let link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.datepipe.transform(new Date(),'dd-MMM-yyyy')+' Source Report' + ".xlsx";
                link.click();
            }, (error) => {

            }
        )
        
    }
}
