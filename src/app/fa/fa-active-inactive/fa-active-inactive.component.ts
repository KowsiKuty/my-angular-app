import { Component, HostListener, OnInit } from '@angular/core';
import { Fa2Service } from '../fa2.service';
import { FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faShareService } from '../share.service';


@Component({
  selector: 'app-fa-active-inactive',
  templateUrl: './fa-active-inactive.component.html',
  styleUrls: ['./fa-active-inactive.component.scss']
})
export class FaActiveInactiveComponent implements OnInit {

  constructor(private faservice:Fa2Service , private notification:NotificationService, private Spinner:NgxSpinnerService, private fb:FormBuilder,
    private router: Router, private share: faShareService ) { }
  act_present_page:number=1;
  active_has_next:boolean=false;
  active_has_prevoius:boolean=false;
  inactive_has_previous:boolean=false;
  inactive_has_next:boolean=false;
  active_form:FormGroup;
  pagesize:number=10;
  active_summary=[]
  reason_active:string;
   @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
      console.log('welcome',event.code);
      if(event.code =="Escape"){
        this.Spinner.hide();
      }
      
    }
  ngOnInit(): void {
    this.active_form = this.fb.group({
      'barcode':new FormControl('')
    });
    this.get_active_summary();
    
  }
  tabClick(event) {
    console.log(event);
    if (event.tab.textLabel == 'FA-ACTIVE ASSETS') {
      console.log('Hii_active_tab');

    }
    else {
      console.log('Hii_inactive_tab');
    }
  }
  get_active_summary(page = 1) {
    let data = '?page=' + page;
    if (this.active_form.get('barcode').value) {
      data += '&barcode=' + this.active_form.get('barcode').value;
    }
    // if (this.group_id_form.get('cr_number').value){
    //   data +='&cr_number='+this.group_id_form.get('cr_number').value;
    // }
    this.Spinner.show();
    this.faservice.acctivesummary(data).subscribe(result => {
      this.Spinner.hide();
      if (result['code'] != null && result['code'] != undefined && result['code'] != '') {
        this.notification.showWarning(result['code']);
        this.notification.showWarning(result['description']);
        this.active_summary = [];
      }
      else {
        this.active_summary = result['data'];
        if (this.active_summary.length > 0) {
          let pagination = result['pagination'];
          this.active_has_next = pagination?.has_next;
          this.active_has_prevoius = pagination?.has_previous;
          this.act_present_page = pagination.index;
        }
      }
    }, (error: HttpErrorResponse) => {
      this.Spinner.hide();
      this.notification.showWarning(error.status + error.message);

    })


  }
  get_active_haspre() {
    if (this.active_has_prevoius == true) {
      this.get_active_summary(this.act_present_page - 1)
    }
  }
  get_active_hasnext() {
    if (this.active_has_next == true) {
      this.get_active_summary(this.act_present_page + 1)
    }

  }
  reset(data) {
    if (data == 'active') {
      this.active_form.reset('');
      this.reason_active = '';
      this.activeselactiveselecteddatsecteddats = [];
      this.selectAll = false;
      this.get_active_summary(1)
    }
  }
  activeselactiveselecteddatsecteddats: any[] = [];
  selectAll: boolean = false;
  toggleAllSelection_active(event: any): void {
    const isChecked = event.target.checked;
    this.active_summary.forEach(entry => {
      entry.selected = isChecked;
      if (isChecked) {
        this.activeselactiveselecteddatsecteddats.push(entry);
      } else {
        const index = this.activeselactiveselecteddatsecteddats.indexOf(entry);
        if (index > -1) {
          this.activeselactiveselecteddatsecteddats.splice(index, 1);
        }
      }

    });
    this.selectAll = isChecked;
  }
  toggleSelection_active(asset_ids: any): void {
    const index = this.activeselactiveselecteddatsecteddats.indexOf(asset_ids);
    if (index > -1) {
      this.activeselactiveselecteddatsecteddats.splice(index, 1);
    } else {
      this.activeselactiveselecteddatsecteddats.push(asset_ids);
    }
    this.selectAll = this.active_summary.length === this.activeselactiveselecteddatsecteddats.length;
  }

  raise_inactive(data) {
    if (data == 'active') {

      let activeselected_datas = this.activeselactiveselecteddatsecteddats.map(data => data?.id_list);

      if (this.reason_active == '' || this.reason_active == null || this.reason_active == undefined) {
        this.notification.showWarning("Please select a reason");
        return false;
      }
      let body = {
        'assetid_list': activeselected_datas,
        'remark': this.reason_active
      }
      this.Spinner.show();
      this.faservice.create_raise_active_inactive_request(body).subscribe(res => {
        this.Spinner.hide();
        if (res['code'] != '' && res['code'] != null && res['code'] != undefined) {
          this.notification.showWarning(res['code']);
          this.notification.showWarning(res['description']);
        }
        else {
          this.notification.showSuccess(res['status']);
          this.notification.showSuccess(res['message']);
          this.activeselactiveselecteddatsecteddats = [];
          this.selectAll = false;
          this.get_active_summary(1);
          this.share.fa_db.next({index:1,id:2})
          this.router.navigate(['/fa/fadb']);
          // this.router.navigate(['/fa/fadb'],{queryParams:{index:1,id:2}});

        }

      }, (error: HttpErrorResponse) => {
        this.Spinner.hide();
        this.notification.showWarning(error.status + error.message);
      })
    }
  }
  back_btn(){
    this.share.fa_db.next({index:1,id:2})
    this.router.navigate(['/fa/fadb']);
    // this.router.navigate(['/fa/fadb'],{queryParams:{index:1,id:2}});
   
  }
}
