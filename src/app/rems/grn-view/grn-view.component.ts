
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'

@Component({
  selector: 'app-grn-view',
  templateUrl: './grn-view.component.html',
  styleUrls: ['./grn-view.component.scss']
})
export class GrnViewComponent implements OnInit {

  grnsummarylist:Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;


  
  constructor(private shareService: RemsShareService, private remsService: Rems2Service,private remsshareService: RemsShareService,
    private fb: FormBuilder,
   private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {
        // this.getgrnsummarylist();

  }


  getgrnsummarylist( pageNumber = 1, pageSize = 10) {
    this.remsService.getgrnsummarylist( pageNumber, pageSize, )
      .subscribe((result) => {
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.grnsummarylist = datass;
       
        if (this.grnsummarylist.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        

        }
      })

  }

  nextClick() {
    if (this.has_next === true) {
      this.currentpage = this.presentpage + 1
      this.getgrnsummarylist( this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.currentpage = this.presentpage - 1
      this.getgrnsummarylist( this.presentpage - 1, 10)
    }

  }
}
