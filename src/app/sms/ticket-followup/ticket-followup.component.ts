import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SmsShareService } from '../sms-share.service';
import { SmsService } from '../sms.service';
import { Router } from '@angular/router';
export interface ownerdata{
 id:string,
 full_name:string
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-ticket-followup',
  templateUrl: './ticket-followup.component.html',
  styleUrls: ['./ticket-followup.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class TicketFollowupComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){  
    if(event.code =="Escape"){
      this.spinner.hide();
    }   
  }
  @ViewChild('prcreate') templates:TemplateRef<any>;
  @ViewChild('nameref') matSupname:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger:MatAutocompleteTrigger;
  followupform:any=FormGroup;
  assetList:Array<any>=[];
  formData: any = new FormData();
  prcreateList:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  pagesize:number=10;
  presentpage:number=1;
  has_prnext:boolean=false;
  has_prprevious:boolean=false;
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  status_default:boolean=true;
  reopen_enable:boolean=false;
  has_suppage:number=1;
  trackDataList:Array<any>=[];
  prpresentpage:number=1;
  respondform:any=FormGroup;
  prcreatform:any=FormGroup;
  viewData:Array<any>=[];
  id:any;
  isLoading:boolean;
  trackid:any;
  date:any=new Date();
  ownerList:Array<any>=[];
  editenb:boolean=true;
  assignnedFrom:any;
  statusList:any={'open':1,'reopen':2,'close ticket':3,'duplicated ticket':4,'update':5};
  statusList_n:any={1:'open',2:'reopen',3:'close ticket',4:'duplicated ticket',5:'update'};
  constructor(private datepipe:DatePipe,private router:Router,private spinner:NgxSpinnerService,private toastr:ToastrService,private shareservice:SmsShareService,private fb:FormBuilder,private dialog:MatDialog,private smsservice:SmsService) { }

  ngOnInit(): void {
    this.followupform=this.fb.group({
      'code':new FormControl(''),
      'branch':new FormControl(''),
      'desc':new FormControl(''),
      'problem':new FormControl(''),
      'nop':new FormControl(''),
      'engineername':new FormControl(''),
      'vdate':new FormControl(''),
      'vtime':new FormControl('')
    });
    this.followupform.get('vdate').patchValue(this.datepipe.transform(this.date,'dd-MMM-yyyy'));
    this.followupform.get('vdate').patchValue(this.datepipe.transform(this.date,'h:mm'));
    this.respondform=this.fb.group({
      'commends':new FormControl(''),
      'check':new FormControl(''),
      'name':new FormControl(''),

    });
    // this.smsservice.getTicketticketsummarydata('',1).subscribe(data=>{
    //   this.ownerList=data['data'];
    // })
    // this.respondform.get('name').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=>this.smsservice.getTicketticketsummarydata(value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.ownerList=data['data'];
    // });
    this.prcreatform=this.fb.group({
      'bs':new FormControl(''),
      'cc':new FormControl(''),
      'productcategory':new FormControl(''),
      'check':new FormControl(''),
      'producttype':new FormControl(''),
      'productname':new FormControl(''),
      'commodityname':new FormControl(''),
      'suppliername':new FormControl(''),
      'branchcode':new FormControl(''),
      'branchname':new FormControl(''),
      'desc':new FormControl('')
      });
      let data:any=this.shareservice.ticket_view.value;
      this.id=data.id;
      this.getdataofview(data.id);
      this.getdataofview_new(data.id);
      this.getdataofAssetview_new(data.id);
      this.gettrackdata(data.id);
      this.getdataofAssetview(data.id);
      // this.getdataofAssetview_new(this.id);
  }
  public ownerdatainterface(data?:ownerdata):string | undefined{
    return data?data.full_name:undefined;
  }
  getdataofview(d:any){
    this.smsservice.getTicketSummaryview(d).subscribe(datas=>{
      this.viewData=datas;
      let data:any=datas['data'][0];
      this.followupform.patchValue({
        'code':data['ticketheader_code'],
        'branch':data['branch_code']+ ' - '+data['branch_name'],
        'desc':data['description'],
        'nop':data['errorcategory_name'],
        'problem':data['summary'],
        

        
       

        // 'engineername':data['engineername'],
        // 'vdate':data['visit_date'],
        // 'vtime':data['visit_time']
      });
      

      this.trackid=data['id'];
      if(data.status==1 || data.status==2){
        this.status_default=true;
        this.reopen_enable=false;
      }
      if (data.status==3){
        this.reopen_enable=true;
        this.status_default=false;
      }
      
      // this.assignnedFrom=data['engineername'];
    },
    (error)=>{
      
    }
    )
  }
  getdataofview_new(d:any){
    this.smsservice.getTicketSummaryview_new(d).subscribe(datas=>{
      this.viewData=datas;
      let data:any=datas;
      this.followupform.patchValue({
        'engineername':data['engineername'],
        'vdate':data['visit_date'],
        'vtime':data['visit_time']
      });
      // this.trackid=data['id'];
      // this.assignnedFrom=data['engineername'];
    },
    (error)=>{
      
    }
    );
    return true;
  }
  // getdataofFollowtrack_new(d:any){
  //   this.smsservice.getTicketSummaryFollow_new(d).subscribe(datas=>{
  //     this.viewData=datas;
  //     let data:any=datas['data'][0];
  //     this.followupform.patchValue({
  //       'engineername':data['engineername'],
  //       'vdate':data['visit_date'],
  //       'vtime':data['visit_time']
  //     });
  //     this.respondform.patchValue({'commends':data['new_value'],'check':data['']})
  //     // this.trackid=data['id'];
  //     // this.assignnedFrom=data['engineername'];
  //   },
  //   (error)=>{
      
  //   }
  //   );
  //   return false;
  // }
  getdataofAssetview(d:any){
    // let dta:any='?page='+this.presentpage;
    let data:any=this.id+'&page='+this.presentpage;
    this.spinner.show();
    this.smsservice.getAssetviewdataTicket_new(data).subscribe(data=>{
      this.assetList=data['data'];
      this.spinner.hide();
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    },
    (error)=>{
      this.spinner.hide();
    })  
    return false;
  }
  getemplst(){
    this.smsservice.getTicketticketsummarydata('',1).subscribe(data=>{
      this.ownerList=data['data'];
    })
    this.respondform.get('name').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.smsservice.getTicketticketsummarydata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ownerList=data['data'];
    });
  }
  nextdata(){
    if(this.has_next){
      this.presentpage +=1;
      this.getdataofAssetview(this.presentpage);
    }
  }
  previousdata(){
    if(this.has_previous){
      this.presentpage -=1;
      this.getdataofAssetview(this.presentpage);
    }
  }
  getdataofAssetview_new(d:any){
    this.spinner.show();
    this.smsservice.getAssetviewdataTicket_com(d,1).subscribe(data=>{
      this.spinner.hide();
      let d:any=data;
      this.respondform.patchValue({'commends':d['new_value'],'check':this.statusList_n[d['status']],'name':{'id':d['assign_to'],'full_name':d['assign_to_name']}});
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    return true;
  }
  gettrackdata(d:any){
    this.spinner.show();
    this.smsservice.getfollowtracknewhistory_new(d).subscribe(data=>{
      this.spinner.hide();
      this.trackDataList=data['data'];
    //   this.trackDataList=[{'engineername':'Ravi','visit_date':'2022-1-22','visit_time':'12:00'},
    //   {'engineername':'Ananth','visit_date':'2022-01-24','visit_time':'13:00'},
    //   {'engineername':'Santhosh','visit_date':'2022-03-25','visit_time':'12:34'},
    //   {'engineername':'Prabha','visit_date':'2022-13-27','visit_time':'14:00'}
    // ]
      console.log('erer',this.trackDataList)
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    return true;
  
  }
  opendialog(){
    this.dialog.open(this.templates,{width:"100%",disableClose: true});
   
  }
  closedialog(){
    this.dialog.closeAll();
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  createfollowupdetails_edit(){
    this.editenb=false;
  }
  createfollowupdetails(){
    if(this.followupform.get('engineername').value==undefined || this.followupform.get('engineername').value== null || this.followupform.get('engineername').value==''){
      this.toastr.warning('Please Enter The Engineering Name');
      return false;
    }
    if(this.followupform.get('vdate').value==undefined || this.followupform.get('vdate').value== null || this.followupform.get('vdate').value==''){
      this.toastr.warning('Please Select The Visiting Date');
      return false;
    }
    if(this.followupform.get('vtime').value==undefined || this.followupform.get('vtime').value== null || this.followupform.get('vtime').value==''){
      this.toastr.warning('Please Select The Visiting Time');
      return false;
    }
    let d:any={"ticket_track_meta_id":1,
    "ticketheader_id":this.id,
    "engineername":this.followupform.get('engineername').value,
    "visit_date":this.datepipe.transform(this.followupform.get('vdate').value,'yyyy-MM-dd'),
    "visit_time":this.followupform.get('vtime').value,
    "status":1
    };
    if(this.trackid !=undefined || this.trackid !=null || this.trackid !=''){
      d['id']=this.trackid;
    }
    this.spinner.show();
    this.smsservice.getTicketfollowupEdit(d).subscribe(datas=>{
      this.spinner.hide();
      if(datas['status']=='success'){
        this.toastr.success('Successfully Updated');
        this.editenb=true;
        this.getdataofview(this.id);
        this.getdataofview_new(this.id);
        this.gettrackdata(this.id);
      }
      else{
        this.toastr.error(datas['code']);
        this.toastr.error(datas['description']);
      }
    },
    (error)=>{
      this.spinner.hide();

    }
    )
  }
  download_file(data:any){
    this.spinner.show();
   this.smsservice.filedownload(data['file_id']).subscribe(
      (response: any) =>{
        this.spinner.hide();
          let filename:any='document';
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink:any = document.createElement('a');
          console.log()
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          
          downloadLink.setAttribute('download',filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
      },
      (error)=>{
        this.spinner.hide();
      }
  )
  }
  followupdetailscreate(){
    if(this.respondform.get('commends').value ==undefined || this.respondform.get('commends').value== null || this.respondform.get('commends').value==""){
      this.toastr.error('Please Enter The Comments');
      return false;
    }
    if(this.respondform.get('check').value ==undefined || this.respondform.get('check').value== null || this.respondform.get('check').value==""){
      this.toastr.error('Please Select The Radio Button');
      return false;
    }
    if(this.respondform.get('name').value ==undefined || this.respondform.get('name').value== null || this.respondform.get('name').value==""|| this.respondform.get('name').value.id== null || this.respondform.get('name').value.id==""||this.respondform.get('name').value.id ==undefined ){
      this.toastr.error('Please Select The Ticket Updated By');
      return false;
    }
    let d:any={
      "ticket_header_id":this.id,
      "followup_title":"",
      "followup_description":"",
      "followup_status":1,
      // "status":this.statusList[this.respondform.get('check').value],
      "status":this.statusList[this.respondform.get('check').value?this.respondform.get('check').value:'open'],
      "old_value":"",
      "new_value":this.respondform.get('commends').value,
      "assign_from":0,
      "assign_to":this.respondform.get('name').value.id
    };
    this.formData.append("data", JSON.stringify(d));
    this.spinner.show();
    this.smsservice.getfollowfileupload(this.formData).subscribe(datas=>{
      this.spinner.hide();
      // if(datas['status']=='success'){ 
      //   this.getdataofAssetview_new(this.id);
      //   this.gettrackdata(this.id);
      //   this.toastr.success('Successfully Updated');
      // }
      if(datas.description !=undefined && datas.description !=""){
        // this.toastr.warning(datas.code);
        this.toastr.warning(datas.description);
      }
      
      else if (datas.code=="DUPLICATE STATUS"){
        this.toastr.error(datas.description);
      }
      else if (datas.code=="INVALID_DATA"){
        this.toastr.error(datas.description);
      }
      else if (datas.code === "UNEXPECTED_ERROR"){
        this.toastr.error(datas.description);
      }
      else{
        if(datas['status']=='success'){ 
          this.getdataofAssetview_new(this.id);
          this.gettrackdata(this.id);
          this.router.navigate(['/sms/smsticketsummary']);
          this.toastr.success('Successfully Updated');
        }
      }
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();

    }
    );
  }
  onFileSelect(e:any) {
    this.formData=new FormData();
    //, fileToUpload.name
    for(let i=0;i<e.target.files.length;i++){
      this.formData.append('file', e.target.files[i]);
    }
      // this.formData.append("data", JSON.stringify({"ticket_header_id":this.id,"followup_status":1,"status":this.statusList[this.respondform.get('check').value?this.respondform.get('check').value:'open']}));
      // console.log(this.formData);
      
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
                 
                 this.smsservice.getTicketticketsummarydata(this.respondform.get('name').value, this.has_suppage+1).subscribe((data:any)=>{
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
   
}
