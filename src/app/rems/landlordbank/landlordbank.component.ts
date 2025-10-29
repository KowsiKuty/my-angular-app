import { Component, OnInit } from '@angular/core';
import { RemsService } from '../rems.service';
import { Router } from '@angular/router';
import { RemsShareService } from '../rems-share.service'
import { NotificationService } from '../notification.service'
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-landlordbank',
  templateUrl: './landlordbank.component.html',
  styleUrls: ['./landlordbank.component.scss']
})
export class LandlordbankComponent implements OnInit {
  landlordbankList: Array<any>
  isLandlordbank: boolean;
  isLandlordbankForm: boolean;

  isLandlordbankEditForm: boolean;
  currentpage: number = 1; val
  presentpage: number = 1;
  pageSize = 10;
  // presentpage=;
  // pageNumber =1;
  landlordbankpage: number = 1;
  has_next = false;
  has_previous = false;
  premiseId :any;
  landlordViewId:any;

  constructor(private remsservice: RemsService, private shareService: RemsShareService, private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {
    this.landlordbanksummary();
  }

  landlordbanksummary(pageNumber = 1, pageSize = 10) {
    let data: any = this.shareService.landLordView.value;
    this.premiseId = data.premise_id;
    this.landlordViewId = data.landlordView
    this.remsservice.landlordbanksummary(pageNumber, pageSize,this.landlordViewId)
      .subscribe((result) => {
        console.log("land", result)
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.landlordbankList = datas;
        console.log("land", this.landlordbankList)
        if (this.landlordbankList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.landlordbankpage = datapagination.index;
        }
        // if(this.has_next==true){
        //   this.has_next=true;
        // }
        // if(this.has_previous==true){
        //   this.has_previous=true;
        // }
      })
  }


  landlordBankEdit(data: any) {
    console.log("land", data)
    this.shareService.landlordbankEditValue.next(data)
    this.router.navigateByUrl('/rems/landlordBankEdit', data)
    return data;
  }

  landlordBankDelete(data) {
    let value = data.id
    console.log("landlorddelete", value)
    this.remsservice.landlordBankDeleteForm(value,this.landlordViewId)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.landlordbanksummary();
        return true

      })
  }

  landlordbankBtn() {
    this.isLandlordbank = true;
    // console.log("land lord bank clicked")
    // this.landlordbanksummary();
  }
  onCancelClick() {
    this.isLandlordbankEditForm = false;
    this.isLandlordbank = true;
  }
  nextClickLandlordbank() {
    if (this.has_next === true) {
      // this.currentpage= this.presentpage +1
      // *(this.pageSize);
      this.landlordbanksummary(this.landlordbankpage + 1, 10)
    }
  }


  previousClicklandlordBank() {
    if (this.has_previous === true) {
      // this.currentpage= this.presentpage -1
      // *(this.pageSize);
      this.landlordbanksummary(this.landlordbankpage - 1, 10)
    }
  }


  // for cancel button ---------------------------


  landlordbankCancel() {
    this.isLandlordbankForm = false;
    // this.ismakerCheckerButton = true;
    this.isLandlordbank = true

  }
  landlordbankSubmit() {
    this.landlordbanksummary();
    this.isLandlordbank = true;
    // this.ismakerCheckerButton = true;
    this.isLandlordbankForm = false
  }
  landlordbankEditCancel() {
    this.isLandlordbankEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isLandlordbank = true;

  }
  landlordbankEditSubmit() {
    this.landlordbanksummary();
    this.isLandlordbankEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isLandlordbank = true;

  }
  // nextClickLandlordbank() {
  //   if (this.has_previous === true) {
  //     this.currentpage=this.presentpage-1
  //     this.landlordbanksummary(this.currentpage + 1, 10)
  //   }
  // }
  // previousClicklandlordBank() {
  //   if (this.has_previous === true) {
  //     this.currentpage=this.presentpage-1
  //     this.landlordbanksummary(this.currentpage + 1, 10)
  //   }
  // }


  // landlordBankDelete(data:any){
  //   console.log("landd",data)
  //   this.shareService.landlordbankEditValue.next(data)
  //   return data;
  // }
}
