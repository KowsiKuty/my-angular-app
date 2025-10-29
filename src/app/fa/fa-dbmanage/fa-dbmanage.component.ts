import { Component, OnInit,ViewChild,HostListener } from '@angular/core';
import { Fa2Service } from '../fa2.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faShareService } from '../share.service'


@Component({
  selector: 'app-fa-dbmanage',
  templateUrl: './fa-dbmanage.component.html',
  styleUrls: ['./fa-dbmanage.component.scss']
})
export class FaDbmanageComponent implements OnInit {
  submodules=[];
  group_id_form:FormGroup;
  asset_inactiveform:FormGroup;
  non_groupid_summary:Array<any>=[];
  has_next:boolean=false;
  has_prevoius:boolean=false;
  ngid_present_page:number=1;
  active_tab:number=0;
  pagesize:number=10;
  isAssetgroupid:boolean=false;
  isactvive_inactive:boolean=false;
  @ViewChild('closebutton') closebutton;
  @HostListener('document:keydown', ['$event']) onkeyboard(event: KeyboardEvent) {
    console.log('welcome', event.code);
    if (event.code == "Escape") {
      this.Spinner.hide();
    }

  }

  constructor(private Fa_Service:Fa2Service,private notification:NotificationService,private fb:FormBuilder,private Spinner:NgxSpinnerService,
    private datepipe:DatePipe,private route: ActivatedRoute, private share: faShareService 
  ) { }

  ngOnInit(): void {
    
    
    // this.submodules = [{'id':1,'name':'Group ID Generation'},{'id':2,'name':'Assets Active/Inactive Page'}];
    this.submodules = [{'id':1,'name':'Group ID Generation'}];
    let sub_name =this.share.fa_db.value;
    let index = sub_name['index']
    let id = sub_name['id']
    if (id == '' || id == undefined || id == null) {
      this.subModuleData(this.submodules[0],0)
    }
    else {
      this.subModuleData(this.submodules[Number(index)], Number(index))
    }
    // this.route.queryParams.subscribe(params => {
    //   console.log(params); 
    //   let id = params['id'];
    //   let ind = params['i']
    //   if (id==null || id == undefined || id == ''){
    //     this.subModuleData(this.submodules[0],0)
    //   }
    //   else{
    //     this.subModuleData(this.submodules[Number(ind)],Number(ind))
    //   }
      
     
    // });

    
  }
  subModuleData(name,index){
    this.active_tab=index;
    // if(name === 'Group ID Generation'){
    
    if (name?.name === 'Group ID Generation'){
      this.isAssetgroupid =true;  
      this.isactvive_inactive =false;
      console.log(name);
      this.group_id_form = this.fb.group({
        "barcode":new FormControl(''),
        "cr_number":new FormControl('')
      });
      this.get_non_groupid_summary(1);
    }
    else if (name?.name === 'Assets Active/Inactive Page'){
      this.isactvive_inactive=false;
      this.isAssetgroupid =false;
      this.asset_inactiveform = this.fb.group({
        "reason":new FormControl(''),
      });
      this.get_active_inactive_summary(1);
    }
  // }
  }
  get_non_groupid_summary(page=1){
    let data = '?page='+page;
    if (this.group_id_form.get('barcode').value){
      data +='&barcode='+this.group_id_form.get('barcode').value;
    }
    if (this.group_id_form.get('cr_number').value){
      data +='&cr_number='+this.group_id_form.get('cr_number').value;
    }
    this.Spinner.show();
    this.Fa_Service.non_groupid_summary(data).subscribe(result=>{
      this.Spinner.hide();
      if (result['code']!=null && result['code']!=undefined && result['code']!=''){
        this.notification.showWarning(result['code']);
        this.notification.showWarning(result['description']);
        this.non_groupid_summary=[];
      }
      else{
        this.non_groupid_summary=result['data'];
        if(this.non_groupid_summary.length>0){
          let pagination = result['pagination'];
            this.has_next=pagination?.has_next;
            this.has_prevoius=pagination?.has_previous;
            this.ngid_present_page=pagination.index;
        }
      }
    },(error=>{
      this.Spinner.hide();
      this.notification.showError(error.status + error.message);
    }));
  }
  g_id_hasnext(){
    if(this.has_next == true){
      this.get_non_groupid_summary(this.ngid_present_page +1);
    } 
  }
  g_id_haspre(){
    if(this.has_prevoius == true){
      this.get_non_groupid_summary(this.ngid_present_page -1);
    } 
  }
  to_crateassetid(data){
    let payload={
      "cat":data.apcat?.id,
      "subcat":data?.subcat?.id,
      "cap_date":this.datepipe.transform(data?.capdate,'yyyy-MM-dd'),
      "end_date":this.datepipe.transform(data?.enddate,'yyyy-MM-dd'),
      "asset_value":data?.assetdetails_value,
      "branch_id":data?.branch_id.id,
      "id":data?.id
    }
    if (payload.id=='' || payload.id == null || payload.id == undefined || payload.cat=='' || payload.cat == null || payload.cat == undefined
      || payload.subcat =='' || payload.subcat == undefined || payload.subcat == null || payload.branch_id=='' ||
      payload.branch_id == undefined || payload.branch_id==null || payload.asset_value=='' || payload.asset_value==null
      || payload.asset_value == undefined || payload.cap_date == '' || payload.cap_date == null || payload.cap_date == undefined ||
      payload.end_date == null || payload.end_date == undefined || payload.end_date == ''
    ){
      this.notification.showError("Please check all corrected data given");
      return false;
    }
    this.Spinner.show();
    this.Fa_Service.create_groupid(payload).subscribe((res:any)=>{
      this.Spinner.hide();
      if (res?.status=='success'){
        this.notification.showSuccess(res?.message);
        this.group_id_form.reset('');
        this.get_non_groupid_summary(1);
      }
      else{
        this.notification.showWarning(res?.code);
        this.notification.showWarning(res?.description);
      }
    },(error)=>{
      this.Spinner.hide();
      this.notification.showError(error.status+error.message);
    })
  }
  reset_non_gid(){
    this.group_id_form.reset('');
    this.get_non_groupid_summary(1);
    
  }
  active_summary = []
  active_summary_has_next: boolean = false;
  active_summary_has_previous: boolean = false;
  active_in_presentpage: number = 1;
  get_active_inactive_summary(page = 1) {
    let data = '?page=' + page;
    if (this.asset_inactiveform.get('reason').value) {
      data += '&reason=' + this.asset_inactiveform.get('reason').value;
    }
    this.Spinner.show();
    this.Fa_Service.inactive_active_raised_summary(data).subscribe((res: any) => {
      this.Spinner.hide();
      if (res?.code != null && res?.code != undefined && res?.code != null) {
        this.notification.showWarning(res?.code);
        this.notification.showWarning(res?.description);
        this.active_summary = [];
      }
      else {
        this.active_summary = res['data'];
        if (this.active_summary.length > 0) {

          let pagination = res['pagination']
          this.active_summary_has_next = pagination.has_next;
          this.active_summary_has_previous = pagination.has_previous;
          this.active_in_presentpage = pagination.index;
        }
      }

    }, (error) => {
      this.Spinner.hide();
      this.notification.showWarning(error.status + error.message);
    })
  }
  active_in_hasnext() {
    if (this.active_summary_has_next == true) {
      this.get_active_inactive_summary(this.active_in_presentpage + 1);
    }
  }
  active_in_haspre() {
    if (this.active_summary_has_previous == true) {
      this.get_active_inactive_summary(this.active_in_presentpage - 1);
    }
  }
  list_barcode = [];
  view_raised_assets(list_barcode) {
    this.list_barcode= list_barcode;
  }
  reset_active_inactive() {
    this.asset_inactiveform.reset('');
    this.get_active_inactive_summary(1);
  }
  approve_reject(check, type,asset) {
    if (check == 'toiactive' && type == 1) {
      let body = {
        'type': type,
        'id':asset?.id

      }
      this.Spinner.show();
      this.Fa_Service.active_inactive_approve_reject(body).subscribe(res => {
        this.Spinner.hide();
        if (res['code'] != '' && res['code'] != null && res['code'] != undefined) {
          this.notification.showWarning(res['code']);
          this.notification.showWarning(res['description']);
        }
        else {
          this.notification.showSuccess(res['status']);
          this.notification.showSuccess(res['message']);
          this.closebutton.nativeElement.click();
          this.get_active_inactive_summary(1);

        }

      }, (error: HttpErrorResponse) => {
        this.Spinner.hide();
        this.notification.showWarning(error.status + error.message);
      })
    }


  }
}
