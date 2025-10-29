import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Rems2Service } from '../rems2.service'
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { SharedService } from '../../service/shared.service'
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss']
})
export class RaiseRequestComponent implements OnInit {
  raiseRequestList: any;
  raiseReqDropDownList: any;
  has_nextraise = true;
  has_previousraise = true;
  presentpageraise: number = 1;
  isRaiseList: boolean;
  pagesize = 10;
  // iMasterList: any;
  isAddRaiseButton= true;

  constructor(private remsService: RemsService, private fb: FormBuilder,
    private router: Router, private remsService2: Rems2Service, private sharedService: SharedService,
    private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    // let datas = this.sharedService.menuUrlData;
    // datas.forEach((element) => {
    //   let subModule = element.submodule;
    //   console.log("subModule",subModule)
    //   if (element.name === "REMS") {
    //     this.iMasterList = subModule;
    //     console.log("iMasterList",this.iMasterList);
    //   }
    //   for(let i = 0; i < element.role.length; i++){
    //     if (element.role[i].name === "Premise_Identification_Approver"){
    //       this.isAddRaiseButton= false;
    //       console.log('add button', element.role[i].name)
    //       break;
    //     }
    //   }
    // });

    this.statusDropDown();
    
  }

  statusDropDown() {
    this.remsService.statusDropDown()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.raiseReqDropDownList = datas;
        console.log("raisereqdropdown", this.raiseReqDropDownList)
        this.statusId = this.raiseReqDropDownList[0].id
        this.raiseRequest();
      })

  }
  statusId: any;
  onChangeDropDown(e: number = 1) {
    this.statusId = e
    console.log("statusId", this.statusId)
    this.raiseRequest();


  }


  raiseRequest(pageNumber = 1, pageSize = 10) {
    this.remsService.getRaiseRequest(pageNumber, pageSize,this.statusId)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getraiseReq", datas);
        let datapagination = results["pagination"];
        this.raiseRequestList = datas;
        if (this.raiseRequestList.length >= 0) {
          this.has_nextraise = datapagination.has_next;
          this.has_previousraise = datapagination.has_previous;
          this.presentpageraise = datapagination.index;
          this.isRaiseList = true;
        } else if (this.raiseRequestList.length == 0) {
          this.isRaiseList = false;
        }
      })

  }
  raise_nextClick() {
    if (this.has_nextraise === true) {
      this.raiseRequest(this.presentpageraise + 1, 10)
    }
  }

  raise_previousClick() {
    if (this.has_previousraise === true) {
      this.raiseRequest(this.presentpageraise - 1, 10)
    }
  }


  addRaiseRequest() {
    this.router.navigate(['/rems/addRaiseRequest'], { skipLocationChange: isSkipLocationChange });
  }

  raiseReqView(id,approvel_flag){
    this.remsshareService.raiseReqView.next(id)
    this.remsshareService.raiseReqFlag.next(approvel_flag)
    this.router.navigate(['/rems/raiseReqView'], { skipLocationChange: isSkipLocationChange });
  }

}
