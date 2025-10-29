import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SmsShareService } from '../sms-share.service';
import { SmsService } from '../sms.service';
import { environment } from "src/environments/environment";
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
export interface vendorname{
  id:string;
  name:string;
  code:string;
}
export interface branch{
  id:string;
  name:string;
  code:string;
}
export interface product{
  id:string;
  name:string;
}
export const PICK_MY_FORMATS={
  parse:{dateInput:{month:'short',year:'numeric',day:'numeric'}},
  display:{
    dateInput:'input',
    monthYearLabel:{'year':'numeric',month:'short'},
    dateAllyLabel:{year:'numeric',month:'long',day:'numeric'},
    monthYearAllyLabel:{year:'numeric',month:'long'}
  }
}
class pDateAdapter extends NativeDateAdapter{
  format(date: Date, displayFormat: Object): string {
    if(displayFormat==='input'){
      return formatDate(date,'dd-MMM-yyyy',this.locale)
    }
    else{
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-sms-maker-summary',
  templateUrl: './sms-maker-summary.component.html',
  styleUrls: ['./sms-maker-summary.component.scss'],
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_MY_FORMATS}
    
  ]
})
export class SmsMakerSummaryComponent implements OnInit {
  @ViewChild('checkersupplier') matsupAutocomplete: MatAutocomplete;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('closebutton') closebutton;

  @ViewChild('autoasset') matassetidAutocomplete: MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('fileInput2') fileInput2:ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('viewdata') tempdata:TemplateRef<any>;
  ctrl_branch_id: any;
  productlist:Array<any>=[];
  summarydata:Array<any>=[];
  filedatalist:Array<any>=[];
  approverfiledatalist:Array<any>=[];
  headersummarydata:Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  branchList: Array<any>=[];
  summary_amount:any;
  amcheader_id:any;
  summary_supplier:any;
  viewpage:number=1;
  viewsize:number=10;
  viewpage1:number=1;
  viewsize1:number=10;
  file_viewpage:number=1;
  file_viewsize:number=10;
  fileformData:any=new FormData();
  view_has_next:boolean=false;
  view_has_pre:boolean=false;
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppresentpage:number=1;
  vendorList:Array<any>=[];
  binaryData:Array<any>=[];
  has_subnext:boolean=true;
  has_subprevious:boolean=false;
  has_subpresentpage:number=1;
  downloadUrl:any;
  imgurl:any;
  pdfSrc:any;
  smsbulkuploadform:any=FormGroup;
  sms_bulk_upload:Array<any>=[];
  zoom_to:any=1;
  imgview:boolean=false;
  pdfview:boolean=false;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }

  searchdata = {
    "barcode": "",
    "branch": "",
  }
  
  first=false;
  second=false;
  files:any;
  listcomments:any = [];
  datapagination:any=[];
  presentpagebuk: number = 1;
  presentpagenew: number = 1;
  pageSize = 10;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  Asset_id:number;
  id:any;
  branch:number;
  has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  assetidList: Array<any>=[];
  pageLength_popup:any;
  isLoading = false;
  has_nextbuk = true;
  has_previousbuk = true;
  has_nextnew= false;
  has_previousnew = false;
  view_id:any=0;
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  variable:any=[]
  Gllist: Array<any>=[];
  sortOrder:any;
  glclr:boolean=false;
  glclr1:boolean=false;
  toco:number=0
  file_upload_frmData:any=new FormData();
  filepageSize = 10;

  constructor(private shareservice:SmsShareService,private matdialog:MatDialog,private router: Router, private smsService: SmsService, private http: HttpClient,
    private toastr:ToastrService, private spinner: NgxSpinnerService,
    private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef) { }

  ngOnInit(): void {
  
  this.assetsave =this.fb.group({
    });
    this.assetgroupform =this.fb.group({
      'amc_code':new FormControl(''),
      'header_name':new FormControl(''),
      'vendor':new FormControl(''),
      'status':new FormControl(''),
      'branch':new FormControl(''),
      'asset_id': new FormControl(''),
      'asset_name':new FormControl('')
    });
    this.smsbulkuploadform=this.fb.group({
      'images': new FormControl(),
    });

    this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.assetgroupform.get('asset_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMCassetiddropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.smsService.getAMProductdropdown(1,'','').subscribe(productdata=>{
      this.productlist=productdata['data'];
    });
    this.assetgroupform.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.smsService.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
  this.smsService.getCustomerStateFilter(1,'').subscribe(data=>{
    this.vendorList=data['data'];
  });
  this.assetgroupform.get('vendor').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.smsService.getCustomerStateFilter(1,value).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.vendorList=data['data'];
  });
  this.smsService.getAMBranchdropdown(1,'').subscribe(data=>{
    this.branchList=data['data'];
  });
  this.assetgroupform.get('branch').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.smsService.getAMBranchdropdown(1,value).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.branchList=data['data'];
  });

    
  this.getApi();
  this.smsadminrights()

  }
  
  getApi(){
    this.spinner.show()
    if (this.glclr == true){
      this.glclr=true;
    }
    else if(this.glclr1 == true){
      this.glclr1=true;
    }
    else{
      this.glclr=true;
      this.glclr1=false;
    }
    if(this.sortOrder!=null && this.sortOrder!=undefined && this.sortOrder!=''){
      this.sortOrder=this.sortOrder;
    }
    else{
    this.sortOrder='asce'
  }
    let code:any=this.assetgroupform.value.amc_code?this.assetgroupform.value.amc_code:'';
    let name:any=this.assetgroupform.value.header_name?this.assetgroupform.value.header_name:'';
    let supplier:any=this.assetgroupform.value.vendor?this.assetgroupform.value.vendor.id:'';
    let branch:any=this.assetgroupform.value.branch?this.assetgroupform.value.branch.id:'';
    let asset_id:any=this.assetgroupform.value.asset_id?this.assetgroupform.value.asset_id:'';
    let asset_name:any=this.assetgroupform.value.asset_name?this.assetgroupform.value.asset_name.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,  'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.assetgroupform.get('status').value]?Status[this.assetgroupform.get('status').value]:'';
    // let supplier:any=this.assetgroupform.get('vendor').value?this.assetgroupform.get('vendor').vendor.id:'';
     
    this.smsService.getAMCSummary(this.presentpagebuk , this.pageSize = 10,code,name,this.sortOrder,supplier,status,branch,asset_id,asset_name).subscribe(data => {
      // console.log(data['code'])
      if (data['code'] !=undefined && data['code'] !=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.listcomments = data['data'];
      if(this.listcomments.length>0){
        this.pageLength_popup=this.listcomments[0]['count']
      }
      this.spinner.hide();
      let pagination=data['pagination'];
      this.has_previousbuk=pagination.has_previous;
      this.has_nextbuk=pagination.has_next;
      this.presentpagebuk=pagination.index;
      // this.spinner.hide();
      console.log(data);
    }
    },
    (error)=>{
      // console.log(error.error);
      // console.log(error.error.message);
      // console.log(error);
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText);
      let d:string=error.error;
      this.toastr.warning(d.substring(0,100));
    //   if(error.error instanceof Blob) {
    //     error.error.text().then(text => {
    //       let error_msg = (JSON.parse(text).message);
    //       this.toastr.error(error_msg);
    //       console.log(error_msg)
    //     });
    // } else {
    //     //handle regular json error - useful if you are offline
    // }  
    // console.log(error.error instanceof Blob);
      
    })
    }
    public vendorinterface(data?:vendorname):string | undefined{
      return data?data.code +' - '+data.name:undefined;
    }
    public branchintreface(data?:branch):string | undefined{
      return data?data.code +' - '+data.name:undefined;
    }
    getamcascedesc(datas,num) {
      this.spinner.show();
      this.sortOrder=datas;
      this.toco=0;
      if (num==1){
        this.glclr=true;
        this.glclr1=false;
      }
      if (num==2){
        this.glclr=false;
      this.glclr1=true;
      }
      let code:any=this.assetgroupform.value.amc_code?this.assetgroupform.value.amc_code:'';
      let name:any=this.assetgroupform.value.header_name?this.assetgroupform.value.header_name:'';
      let supplier:any=this.assetgroupform.value.vendor?this.assetgroupform.value.vendor.id:'';
      let branch:any=this.assetgroupform.value.branch?this.assetgroupform.value.branch.id:'';
      let asset_id:any=this.assetgroupform.value.asset_id?this.assetgroupform.value.asset_id:'';
      let asset_name:any=this.assetgroupform.value.asset_name?this.assetgroupform.value.asset_name.id:'';
      let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
      let status:any=Status[this.assetgroupform.get('status').value]?Status[this.assetgroupform.get('status').value]:'';
     
      this.smsService.getAMCSummary(this.presentpagebuk , this.pageSize = 10,code,name,this.sortOrder,supplier,status,branch,asset_id,asset_name)
        .subscribe((data: any[]) => {
          if (data['code'] !=undefined && data['code'] !=''){
            this.toastr.warning(data['description']);
            this.toastr.warning(data['code']);
          }
          else{
          this.listcomments = data['data'];
          if(this.listcomments.length>0){
            this.pageLength_popup=this.listcomments[0]['count']
          }
          this.spinner.hide();
          let pagination=data['pagination'];
          this.has_previousbuk=pagination.has_previous;
          this.has_nextbuk=pagination.has_next;
          this.presentpagebuk=pagination.index;
          // this.spinner.hide();
          console.log(data);
        }
        },
        (error)=>{
          this.spinner.hide();
        });
    }
  
  searchdataapi(){
    this.spinner.show()
    this.sortOrder='asce';
    let code:any=this.assetgroupform.value.amc_code?this.assetgroupform.value.amc_code:'';
    let name:any=this.assetgroupform.value.header_name?this.assetgroupform.value.header_name:'';
    let supplier:any=this.assetgroupform.value.vendor?this.assetgroupform.value.vendor.id:'';
    let branch:any=this.assetgroupform.value.branch?this.assetgroupform.value.branch.id:'';
    let asset_id:any=this.assetgroupform.value.asset_id?this.assetgroupform.value.asset_id:'';
    let asset_name:any=this.assetgroupform.value.asset_name?this.assetgroupform.value.asset_name.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.assetgroupform.get('status').value]?Status[this.assetgroupform.get('status').value]:'';
    this.smsService.getAMCSummary(this.presentpagebuk=1 , this.pageSize = 10,code,name,this.sortOrder,supplier,status,branch,asset_id,asset_name).subscribe((data) => {
      if(data['code']!=undefined && data['code']!=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.listcomments = data['data'];
      if(this.listcomments.length>0){
        this.pageLength_popup=this.listcomments[0]['count']
      }
      this.spinner.hide()
      let pagination=data['pagination'];
      this.has_previousbuk=pagination.has_previous;
      this.has_nextbuk=pagination.has_next;
      this.presentpagebuk=pagination.index;
      this.spinner.hide();
      console.log(data);
    }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
  }
  createAMC(){
    this.router.navigate(['/sms/smsamccreate'], { skipLocationChange: true })
  }
  clicktoedit(assetcat){
    if (assetcat.amcheader_type=='AMC'){
      // this.shareservice.smsamceditvalue.next(assetcat.id);
    this.router.navigate(['/sms/smsamcedit'], { skipLocationChange: true })}
    if (assetcat.amcheader_type=='WAR'){
      // this.shareservice.smsamceditvalue.next(assetcat.id);
      this.router.navigate(['/sms/smsamcedit'], { skipLocationChange: true })}
    }

  Renewalamc(){
    this.router.navigate(['/sms/smsamcrenewal'], { skipLocationChange: true })
  }

  createWarranty(){
    this.router.navigate(['/sms/smswarrantycreate'], { skipLocationChange: true })
  }

  autocompleteScroll_branch(){

  }

  amc_war_summary_Download(){
    let code:any=this.assetgroupform.value.amc_code?this.assetgroupform.value.amc_code:'';
    let name:any=this.assetgroupform.value.header_name?this.assetgroupform.value.header_name:'';
    let barcode:any=this.assetgroupform.value.asset_id?this.assetgroupform.value.asset_id:'';
    let vendor:any=this.assetgroupform.value.vendor?this.assetgroupform.value.vendor.id:'';
    let branch:any=this.assetgroupform.value.branch?this.assetgroupform.value.branch.id:'';
    let product:any=this.assetgroupform.value.asset_name?this.assetgroupform.value.asset_name.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.assetgroupform.get('status').value]?Status[this.assetgroupform.get('status').value]:'';
    if(this.first == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.first=true
    this.smsService.getamcwarsummary_DownloadReport_xl(code,name,vendor,status,branch,barcode,product)
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'AMC_WAR_Summary_Download'+ date +".xlsx";
      link.click();
      this.first=false;
    },
    (error)=>{
      this.first=false;
      this.toastr.warning(error.description)
    });
  }

  
  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk -=1;
      this.getApi();
    }
  }

  buknextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk +=1;
      this.getApi();
    }
  }

  active(){

  }

  edit(){

  }

  resetdata(){
    this.assetgroupform.reset('');
    this.getApi();
  }

  savesub(){

  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  filedeatils(data:any){
    this.smsService.getamcaselectfile(data.id).subscribe((res) => {
      if(res['data'].length>0){
        this.filedatalist=res['data'];
      }
      else{
        this.filedatalist=[];
      }
    })


  }
  approvalfiledetails(data:any){
    this.smsService.getamcapprovalaselectfile(data.id).subscribe((res) => {
      if(res['data'].length>0){
        this.approverfiledatalist=res['data'];
      }
      else{
        this.approverfiledatalist=[];
      }
    })


  }
  clicktoview(data:any){
    if(data.id ==undefined || data.id==""){
      this.toastr.warning('Please Select Valid Data');
      return false;
    }
    this.variable=data;
    this.view_id=data.id;
    this.spinner.show();
    this.filedeatils(data)
    this.approvalfiledetails(data)
  
    this.smsService.getamcapprovalsummaryselect(data.id,this.presentpagenew).subscribe((res) => {
      // this.listcomments = res['data'];
      // if(this.listcomments.length>0){
      //   this.pageLength_popup=this.listcomments[0]['count']
      // }
      
      this.spinner.hide();
      console.log(data);
      console.log(res['data']['data']);
      // this.headersummarydata=[1];
      this.amcheader_id=res.id
      this.files=res.file

      this.summary_amount=res.amcheader_amctotalamt;

      this.summary_supplier=res.supplier_code+' - '+res.supplier_name;
      if(res['data']['data'].length>0){
        this.summarydata=res['data']['data'];
        let pagination:any=res['data']['pagination'];
        console.log(pagination)
      this.has_previousnew=pagination.has_previous;
      this.has_nextnew=pagination.has_next;
      this.presentpagenew=pagination.index;
      }
      else{
        this.summarydata=[];
      }
      });
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.position = {
        top:  '0'  ,
        // right: '0'
      };
      dialogConfig.width = '60%' ;
      dialogConfig.height = '500px' ;
      console.log(dialogConfig);
    this.matdialog.open(this.tempdata,dialogConfig);
  }
  closedata(){
    this.matdialog.closeAll();
  }
  getapprovaldata(data:any,pageNumber){
    this.smsService.getamcapprovalsummaryselect(data,pageNumber).subscribe(res=>{
     
    this.summarydata=res['data']['data'];
    console.log(res[0])
    });
  }
  editdata(data:any){
    this.shareservice.amcedit.next(data);
    this.router.navigate(['/sms/smsedit']);
  }
  newpreviousClick() {
    if (this.has_previousnew === true) {
      this.presentpagenew-=1;
      this.clicktoview(this.variable);
    }
  }

  newnextClick() {
    if (this.has_nextnew === true) {
      this.presentpagenew +=1;
      this.clicktoview(this.variable);
      }
    }
  autocompletesupname(){
      console.log('second');
      setTimeout(()=>{
        if(this.matsupAutocomplete && this.autocompleteTrigger && this.matsupAutocomplete.panel){
          fromEvent(this.matsupAutocomplete.panel.nativeElement,'scroll').pipe(
            map(x=>this.matsupAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          ).subscribe(
            x=>{
              const scrollTop=this.matsupAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight=this.matsupAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight=this.matsupAutocomplete.panel.nativeElement.clientHeight;
              const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
              if(atBottom){
               if(this.has_supnext){
                 
                this.smsService.getCustomerStateFilter(this.has_suppresentpage+1,this.assetgroupform.get('vendor').value).subscribe((data:any)=>{
                   let dear:any=data['data'];
                   console.log('second');
                   let pagination=data['pagination']
                   this.vendorList=this.vendorList.concat(dear);
                   if(this.vendorList.length>0){
                     this.has_supnext=pagination.has_next;
                     this.has_supprevious=pagination.has_previous;
                     this.has_suppresentpage=pagination.index;
                   }
                 })
               }
              }
            }
          )
        }
      })
    }
    closedialogdata(){
      this.matdialog.closeAll();
    }
    zoom_in() {
      this.zoom_to = this.zoom_to + 0.25;
    }
  
    zoom_out() {
      if (this.zoom_to > 1) {
         this.zoom_to = this.zoom_to - 0.25;
      }
    }
  // file:any;
  approval_download_file(data:any,files:any){
    this.spinner.show();
    let fileName = this.files
    this.smsService.sms_maker_approval_file_download(data).subscribe((response: any) =>{
          this.spinner.hide();
          if(response['type']!="application/json"){
            let filevalue = fileName.split('.')
            let binaryData = [];
            binaryData.push(response)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.click();}
          if(response['type']=="application/json"){
            this.toastr.error('No Download Files Found');
          }
      }),(error) => {
        this.toastr.error('No Download Files Found');
        this.spinner.hide();
      }
    }

  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any;
  jpgUrlsAPI: any
  imageUrl = environment.apiURL
  
  approval_view_file(datas:any,files:any) {
      console.log('approval_view_file:')
      let id = datas
    
      this.smsService.sms_maker_approval_file_view(datas).subscribe(
      (response: any) =>{
        if(response['type']!="application/json"){
        let fileName = this.files
        // let filename = response.type;
        let stringValue = fileName.split('.')
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
        stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          this.showimageHeaderAPI = true
          this.showimagepdf = false
          this.jpgUrlsAPI = this.imageUrl+"smsservice/upload_approval_doc_file/"+datas+"?token="+token
          console.log('view',this.jpgUrlsAPI) 
        }    
        if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
          this.showimagepdf = true
          this.showimageHeaderAPI = false
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          let downloadUrl=this.imageUrl+"smsservice/amc_doc_download/"+this.id+"?token="+token
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl;     
        }       
        if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
        stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT"|| stringValue[1] === "octet-stream"|| stringValue[1] === "OCTET-STREAM") {
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.toastr.warning('View File (csv,ods,xlsx,txt - Format) is not supported');
        }
        // if(response['code']==='Download File is not Exists') {
        //   this.toastr.error('No View Files Found');
        // }
      }
        if(response['type']=="application/json"){
          this.toastr.error('No View Files Found');

        }
        (error)=>{
          this.spinner.hide();
          this.toastr.error('No View Files Found');
          this.spinner.hide();
        }
    })
  }
  // file:any;
  maker_download_file(data:any,files:any){
    this.spinner.show();
    let fileName = files
    this.smsService.sms_approval_file_download(data).subscribe((response: any) =>{
          this.spinner.hide();
          if(response['type']!="application/json"){
            let filevalue = fileName.split('.')
            let binaryData = [];
            binaryData.push(response)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.click();}
          if(response['type']=="application/json"){
            this.spinner.hide();
            this.toastr.error('No Download Files Found');
          }
      })
    }

  
  
    maker_view_file(datas,filename) {
      console.log('approval_view_file:')
      let id = datas
      this.spinner.show();
      this.smsService.sms_approval_file_view(id).subscribe((response: any) =>{
      if(response['type']!="application/json"){
        this.spinner.hide();
        let fileName = filename
        // let filename = response.type;
        let stringValue = fileName.split('.')
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
        stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          this.showimageHeaderAPI = true
          this.showimagepdf = false
          this.jpgUrlsAPI = this.imageUrl+"smsservice/download_doc_file/"+id+"?token="+token
          console.log('view',this.jpgUrlsAPI) 
        }    
        if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
          this.showimagepdf = true
          this.showimageHeaderAPI = false
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          let downloadUrl=this.imageUrl+"smsservice/amc_doc_download/"+id+"?token="+token
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl;     
        }       
      
      }
       
        if(response['type']=="application/json"){
          this.spinner.hide();
          this.toastr.error('No View Files Found');

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
               
              this.smsService.getAMBranchdropdown( this.has_branchpresentpage+1,this.assetgroupform.get('branch').value).subscribe((data:any)=>{
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
  getFileDetails_upload(e:any,data:any) {
    this.sms_bulk_upload.pop()
    console.log('q=',data);
    let stringValue = data.split('.')
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" ||
    stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "CSV" ) {
    const d:any=new FormData();
    this.sms_bulk_upload[0] = [{'files':[],'images':[],'image':[]}]
    console.log(this.sms_bulk_upload)
    for (var i = 0; i < e.target.files.length; i++) {
      this.sms_bulk_upload[0].files = []
      this.sms_bulk_upload[0].images = [];
      this.sms_bulk_upload[0].image = []
      this.sms_bulk_upload[0].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.sms_bulk_upload[0].files.push(reader.result);
      
      }
      this.file_upload_frmData.append('file',e.target.files[i])
    }
    console.log('form=',this.frmData)
    this.sms_bulk_upload[0].image.push(d);
    console.log(this.sms_bulk_upload[0])
    }
    else{
      this.spinner.show("Please Select Valid Excel Format")
      this.spinner.show("Please Select Valid Format (csv,ods,xlsx)")
    }
  }
  submitfileupload(){
    // console.log()
    this.spinner.show();
    if ((this.sms_bulk_upload.length == 0) || (this.sms_bulk_upload == null) || (this.sms_bulk_upload == undefined)){
         
          this.toastr.error('Please Choose File');
          this.spinner.hide();
          return false;
        }
    // if(this.sec_icon == true){
    //   this.toastr.warning('Already Progress')
    //   return true
    // }
    // this.sec_icon=true
    this.smsService.smsbulkupload(this.file_upload_frmData).subscribe((result)=>{
      console.log('smsres',result);
      if(result['type']=='application/json'){
        this.spinner.hide();
        // console.log(result['content'])

        // this.toastr.error('Please Select Valid Excel Format');
        const reader = new FileReader();
        reader.onload = () => {
          const data:any = reader.result;
          console.log('eerr=',data);//description
          console.log('type=',typeof(data));
          let valid_data:any=JSON.parse(data);
          this.toastr.error(valid_data[0]['description']);

        };
        reader.readAsText(result);
        this.fileInput.nativeElement.value='';
      }
      else{

      this.spinner.hide();
  
      console.log('empres',result);
      let binaryData = [];
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'SMS Maker Bulk Upload Response'+ date +".xlsx";
      link.click();
      this.second = false;
      this.toastr.success("File Uploaded Successfully..");
      // setTimeout(()=>{
      //   this.toastr.success("File Downloaded Successfully..");
      // },2000);
      this.smsbulkuploadform.get('images').patchValue('');
      this.sms_bulk_upload=[];
      this.fileInput.nativeElement.value='';
    };
      
      this.smsbulkuploadform.get('images').patchValue('');
      this.sms_bulk_upload=[];
    },(error)=>{
      this.spinner.hide();
    })
    
     
     

 
 
    
  }
  tranback(){
    this.closebutton.nativeElement.click();

  }
  smsmasterUpload(event:any,data:any){
    console.log(event.target.files.length);
    this.fileformData.append('file',event.target.files[0])
    if (data=='sms_maker_upload'){
  
      if (data==""||data ==undefined || data =="" || data =='' || data ==undefined|| data ==""|| data ==''){
        this.toastr.warning("Please Select The Master Employee Name");
        return false;
      }
    let d:any={
      'type': data
     
    }  
    this.fileformData.append('data',JSON.stringify(d));
    this.spinner.show();
    this.smsService.sms_upload_data(this.fileformData).subscribe(data=>{
      this.spinner.hide()
      if (data.status=='success'){
      // this.spinner.hide()
      this.toastr.success("File Uploaded Successfully..");
      this.fileInput2.nativeElement.value='';
     
      // this.mastermigrationform.get('master_name').patchValue('');
      this.fileformData={}
      }
      if (data.status!='success'){
      
        this.toastr.warning("File is Not Uploaded...");
        this.fileInput2.nativeElement.value='';
      }
    })
   }
 
  }
 

  SMSMakerTemplateDownload(data:any){
    if (data=='sms_maker_template_download'){
      let d:any={
        'type': data
       
      }  
      this.spinner.show()
      this.smsService.getsmsmakertemplateDownload(d).subscribe(fullXLS=>{
        if (fullXLS['type']!='application/json'){
        this.spinner.hide()
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'SMS MAKER Template'+ date +".xlsx";
        link.click();
        
        this.toastr.success('Download Successfully...')
        // this.mastermigrationform.get('master_name').patchValue('');
      }
        if (fullXLS['type']=='application/json'){
          this.spinner.hide()
          this.toastr.warning('Download File is not Exists')
    
        }
    })
    }
  

  }
  issmsmakerdownload:Boolean=false;
  smsadminrights(){
    this.spinner.show()
      this.smsService.sms_right('SMS_MAKER_SUMMARY').subscribe(result=>{
        this.spinner.hide()
        let data=result['data']
         for (let k = 0; k < data?.length; k++){
        if (data[k].role_name=='admin' || data[k].role_name == 'Admin'){
        this.issmsmakerdownload=true;
    }
        
  } 


  })
}
autocompletesubname(){
  console.log('second');
  setTimeout(()=>{
    if(this.matassetidAutocomplete && this.autocompleteTrigger && this.matassetidAutocomplete.panel){
      fromEvent(this.matassetidAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matassetidAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matassetidAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetidAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetidAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_subnext){
             
            this.smsService.getAMCassetiddropdown(this.has_subpresentpage+1,this.assetgroupform.get('category').value).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.assetidList=this.assetidList.concat(dear);
               if(this.assetidList.length>0){
                 this.has_subnext=pagination.has_next;
                 this.has_subprevious=pagination.has_previous;
                 this.has_subpresentpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}
public assetnameinterface(productdata?:product):string | undefined{
  return productdata?productdata.name:undefined;
}
autocompleteproductname(){
  console.log('second');
  setTimeout(()=>{
    if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
      fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_prodnext){
             
            this.smsService.getAMProductdropdown( this.has_prodpresentpage+1,this.assetgroupform.get('asset_name').name,this.assetgroupform.get('asset_name').id).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.productlist=this.productlist.concat(dear);
               if(this.productlist.length>0){
                 this.has_prodnext=pagination.has_next;
                 this.has_prodprevious=pagination.has_previous;
                 this.has_prodpresentpage=pagination.index;
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
