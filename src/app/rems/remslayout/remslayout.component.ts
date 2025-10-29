import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service'
import { RemsShareService } from '../rems-share.service';

@Component({
  selector: 'app-remslayout',
  templateUrl: './remslayout.component.html',
  styleUrls: ['./remslayout.component.scss']
})
export class RemslayoutComponent implements OnInit {
  iMasterList: any;
  isScheduleApproval = false;
  isRaiseRequest = false;
  isPremisesIdentification = false;
  isPremises = false;
  isTemplate = false;
  isApprovedPremises = false;

  premIdentificationForm = false;
  premSummaryForm = false;
  remsTemplateForm = false;
  approvedIdentForm = false;
  raiseRequestForm = false;
  scheduleApproveForm = false;
 
  constructor(private sharedService: SharedService,private service:RemsShareService) { }

  ngOnInit(): void {
    let value = this.service.backtosum.value
    if(value == 'backtosum'){
      this.premIdentificationForm = true;
      this.premSummaryForm = false;
      this.remsTemplateForm = false;
      this.approvedIdentForm = false;
      this.raiseRequestForm = false;
      this.scheduleApproveForm = false;    }
    else if(value == 'premises'){
      this.premIdentificationForm = false;
      this.premSummaryForm = true;
      this.remsTemplateForm = false;
      this.approvedIdentForm = false;
      this.raiseRequestForm = false;
      this.scheduleApproveForm = false;    }
    // else if(value == 'backtosum'){
    //   this.premIdentificationForm = false;
    //   this.premSummaryForm = false;
    //   this.remsTemplateForm = true;
    //   this.approvedIdentForm = false;
    //   this.raiseRequestForm = false;
    //   this.scheduleApproveForm = false;    }
    else if(value == 'approved_premise'){
      this.premIdentificationForm = false;
      this.premSummaryForm = false;
      this.remsTemplateForm = false;
      this.approvedIdentForm = true;
      this.raiseRequestForm = false;
      this.scheduleApproveForm = false;    }
    else if(value == 'raise_request'){
      this.premIdentificationForm = false;
      this.premSummaryForm = false;
      this.remsTemplateForm = false;
      this.approvedIdentForm = false;
      this.raiseRequestForm = true;
      this.scheduleApproveForm = false;    }
    else if(value == 'schedule_approval'){
      this.premIdentificationForm = false;
      this.premSummaryForm = false;
      this.remsTemplateForm = false;
      this.approvedIdentForm = false;
      this.raiseRequestForm = false;
      this.scheduleApproveForm = true;    }
    let datas = this.sharedService.menuUrlData.filter(rolename => rolename.name == 'REMS');
    console.log('totaldata', datas)
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "REMS") {4
        this.iMasterList = subModule;
      }
      for (let i = 0; i < element.role.length; i++) {
        console.log("element.role[i].name",element.role[i].name);
        if (element.role[i].name === "Maker") {
          this.isPremises = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
          this.isRaiseRequest = true;
          this.isScheduleApproval = true;
        }
        if (element.role[i].name === "Checker") {
          this.isPremises = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
          this.isRaiseRequest = true;
          this.isScheduleApproval = true;
        }
        if (element.role[i].name === "Header") {
          this.isPremises = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
          this.isRaiseRequest = true;
          this.isScheduleApproval = true;
        }
        if (element.role[i].name === "Proposed_Premise_Maker") {
          this.isPremisesIdentification = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
        }
        if (element.role[i].name === "Proposed_Premise_Approver") {
          this.isPremisesIdentification = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
        }
        if (element.role[i].name === "Premise_Identification_Approver") {
          this.isPremisesIdentification = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
        }
        if (element.role[i].name === "Premise_Identification_Maker") {
          this.isPremisesIdentification = true;
          this.isTemplate = true;
          this.isApprovedPremises = true;
        }
      }
    });
  }

  premIndentView()
  {
    this.premIdentificationForm = true;
    this.premSummaryForm = false;
    this.remsTemplateForm = false;
    this.approvedIdentForm = false;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = false;
  }

  premView()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = true;
    this.remsTemplateForm = false;
    this.approvedIdentForm = false;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = false;
  }

  remsTempView()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = false;
    this.remsTemplateForm = true;
    this.approvedIdentForm = false;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = false;
  }

  approvedIdentView()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = false;
    this.remsTemplateForm = false;
    this.approvedIdentForm = true;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = false;
  }

  raiseReqView()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = false;
    this.remsTemplateForm = false;
    this.approvedIdentForm = false;
    this.raiseRequestForm = true;
    this.scheduleApproveForm = false;
  }

  scheduleAppView()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = false;
    this.remsTemplateForm = false;
    this.approvedIdentForm = false;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = true;
  }

  remslayout()
  {
    this.premIdentificationForm = false;
    this.premSummaryForm = false;
    this.remsTemplateForm = false;
    this.approvedIdentForm = false;
    this.raiseRequestForm = false;
    this.scheduleApproveForm = false;
  }
}
