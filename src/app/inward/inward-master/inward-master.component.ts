import { Component, OnInit } from '@angular/core';
import { DataService } from '../inward.service';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import { SharedService } from '../../service/shared.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inward-master',
  templateUrl: './inward-master.component.html',
  styleUrls: ['./inward-master.component.css']
})
export class InwardMasterComponent implements OnInit {

  courierList: Array<any>
  documentList: Array<any>
  channelList: Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  iMasterList: any;
  urlCourier: string;
  urlChannel: string;
  urlDocument: string;
  urls: string;
  isChannel: boolean;
  isDocument: boolean;
  isCourier: boolean;
  roleValues: string;
  addFormBtn: string;
  ismakerCheckerButton: boolean;
  isChannelForm: boolean;
  isChannelEditForm: boolean;
  isCourierForm: boolean;
  isCourierEditForm: boolean;
  isDocumentForm: boolean;
  isDocumentEditForm: boolean;
  currentpageChannel: number = 1;
  // currentpageDocument: number = 1;
  // currentpageCourier: number = 1;

  DocSearchForm: FormGroup
  has_nextdoc = true;
  has_previousdoc = true;
  currentpageDocument: number = 1;

  CourierSearchForm: FormGroup
  has_nextCourier = true;
  has_previousCourier = true;
  currentpageCourier: number = 1;

  pageSize = 10;

  constructor(private dataService: DataService, private router: Router, private shareService: ShareService,
    private sharedService: SharedService,private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "iMaster") {
        this.iMasterList = subModule;
      }
    });


    this.DocSearchForm = this.fb.group({
      code: '',
      name: ''
    });

    this.CourierSearchForm = this.fb.group({
      code: '',
      name: '',
      contactperson:''
    });




  }



  subModuleData(data) {
    this.urls = data.url;
    this.urlChannel = "/inwardchannel";
    this.urlDocument = "/inwarddocument";
    this.urlCourier = "/inwardcourier";
    this.isChannel = this.urlChannel === this.urls ? true : false;
    this.isCourier = this.urlCourier === this.urls ? true : false;
    this.isDocument = this.urlDocument === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isChannel) {
      this.isChannel = true

      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.getChannel();
    }
    if (this.isDocument) {
      this.isDocument = true

      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.getDocsummary('');
    }
    if (this.isCourier) {
      this.isCourier = true

      this.isCourierForm = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.getCouriersummary('');
    }
  }


  addForm(data) {
    if (data == "Inward Courier") {
      let editData = "";
      this.isCourierForm = true;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.courierEdit.next(editData);
      return editData;
    } else if (data == "Inward Document") {
      let editData = "";
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = true;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.documentEdit.next(editData)
      return editData;
    } else if (data === "Inward Channel") {
      let editData = "";
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = true;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.channelEdit.next(editData)
      return editData;
    }
  }

  EditForm(data, editData) {
    if (data == "Inward Courier") {
      this.isCourierForm = true;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.courierEdit.next(editData);
      return editData;
    } else if (data == "Inward Document") {
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = true;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.documentEdit.next(editData)
      return editData;
    } else if (data === "Inward Channel") {
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = true;
      this.isChannel = false
      this.ismakerCheckerButton = false;
      this.shareService.channelEdit.next(editData)
      return editData;
    }
  }

  ////////////////////////////////////////////////////////////// Document data

  resetDoc(){
    this.DocSearchForm.controls['code'].reset("")
    this.DocSearchForm.controls['name'].reset("")
    this.getDocsummary('')
  }

////// summary
serviceCallDocSummary(searchdoc,pageno,pageSize){
this.dataService.getDocsearch(searchdoc.code,searchdoc.name, pageno)
  .subscribe((result) => {
    console.log(" getDocsearch", result)
    let datass = result['data'];
    let datapagination = result["pagination"];
    this.documentList = datass;
    console.log(" getDocsearch", this.documentList)
    if (this.documentList.length >= 0) {
      this.has_nextdoc = datapagination.has_next;
      this.has_previousdoc = datapagination.has_previous;
      this.currentpageDocument = datapagination.index;
    }
  })
}

getDocsummary(hint) {
let searchDOC = this.DocSearchForm.value

if(hint == 'next'){
this.serviceCallDocSummary(searchDOC, this.currentpageDocument + 1, 10)
}
else if(hint == 'previous'){
this.serviceCallDocSummary(searchDOC, this.currentpageDocument - 1, 10)
}
else{
this.serviceCallDocSummary(searchDOC,1, 10)
}

}


  documentSubmit() {
    this.getDocsummary('');
    this.isDocument = true;
    this.isDocumentForm = false;
    this.ismakerCheckerButton = true
  }
  documentCancel() {
    this.isDocument = true;
    this.isDocumentForm = false;
    this.ismakerCheckerButton = true
  }


  ///////////////////////////////////////////////////// Channel

  getChannel(
    pageNumber = 1) {
    this.dataService.getChannel(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("GetChannel", datas);
        let datapagination = results["pagination"];
        this.channelList = datas;
        if (this.channelList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpageChannel = datapagination.index;
        }
      })
  }

  channel_nextClick() {
    if (this.has_next === true) {
      this.getChannel(this.currentpageChannel + 1)
    }
  }

  channel_previousClick() {
    if (this.has_previous === true) {
      this.getChannel(this.currentpageChannel - 1)
    }
  }


  searchChannel(code, name) {
    console.log("channel code ", code)
    console.log("channel name ", name)
    this.dataService.getChannelsearch(code, name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.channelList = datas;
      })
  }


  channelCancel() {
    this.isChannelForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true;
  }
  channelSubmit() {
    this.getChannel();
    this.isChannelForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true
  }


  resetCourier(){
    this.CourierSearchForm.controls['code'].reset("")
    this.CourierSearchForm.controls['name'].reset("")
    this.CourierSearchForm.controls['contactperson'].reset("")
    this.getCouriersummary('')
  }

  serviceCallCourierSummary(searchCourier,pageno,pageSize){
    this.dataService.getCouriersearch(searchCourier.code, searchCourier.name, searchCourier.contactperson, pageno)
      .subscribe((result) => {
        console.log(" getCouriersearch", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.courierList = datass;
        console.log(" getCouriersearch", this.courierList)
        if (this.courierList.length >= 0) {
          this.has_nextCourier = datapagination.has_next;
          this.has_previousCourier = datapagination.has_previous;
          this.currentpageCourier = datapagination.index;
        }
      })
    }
    
    getCouriersummary(hint) {
    let searchCourier = this.CourierSearchForm.value
    if(hint == 'next'){
    this.serviceCallCourierSummary(searchCourier, this.currentpageCourier + 1, 10)
    }
    else if(hint == 'previous'){
    this.serviceCallCourierSummary(searchCourier, this.currentpageCourier - 1, 10)
    }
    else{
    this.serviceCallCourierSummary(searchCourier,1, 10)
    }
    
    }



  courierSubmit() {
    this.getCouriersummary('');
    this.isCourierForm = false;
    this.ismakerCheckerButton = true
    this.isCourier = true;
  }

  courierCancel() {
    this.isCourier = true;
    this.ismakerCheckerButton = true
    this.isCourierForm = false;
  }



} 