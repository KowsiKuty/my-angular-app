import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leadslandingpage',
  templateUrl: './leadslandingpage.component.html',
  styleUrls: ['./leadslandingpage.component.scss']
})
export class LeadslandingpageComponent implements OnInit {

  constructor() { }

  isleadsupload: boolean;
  isleadsdata: boolean;
  ischartsdata: boolean;
  istemplatecreate: boolean;
  isLeadHistory: boolean;

  isLeadAllocation: boolean;
  isduplicateview: boolean = false;
  isCampaign: boolean
  isLeadsUploadCampaign: boolean

  isdashboardview:boolean = false;

  isCustomLeads: boolean;


  ngOnInit(): void {
  }

  leadsUpload() {
    this.isleadsupload = true;
    this.isleadsdata = false;
    this.ischartsdata = false;
    this.isLeadHistory = false;
    this.isLeadAllocation = false;

    this.isduplicateview = false;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;

   
    this.isCustomLeads = false;

  }

  leadsData() {
    this.isleadsupload = false;
    this.isleadsdata = true;
    this.isLeadHistory = false;
    this.ischartsdata = false;
    this.isLeadAllocation = false;

    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;

    this.isCustomLeads = false;


  }


  chartsData() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.ischartsdata = true;
    this.isLeadHistory = false;
    this.isLeadAllocation = false;

    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;

    this.isCustomLeads = false;


  }
  leadsHistory() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = true;
    this.ischartsdata = false;
    this.isLeadAllocation = false;
    this.istemplatecreate = false;

    this.isduplicateview = false;

    this.isCampaign = false;

    this.isdashboardview = false;

    this.isLeadsUploadCampaign = false
   this.isCustomLeads = false;

  }

  leadsAllocation() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = true;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = true;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;

    this.isCustomLeads = false;

  }

  newTemplates() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = true;
    this.isduplicateview = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;

    this.isCustomLeads = false;

  }

  viewDuplicate() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = true;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;
  }

  viewDashboard(){
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;
    this.isLeadsUploadCampaign = false;
    this.isdashboardview = true;

  
    this.isCustomLeads = false;

  }

  campaign() {


    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isdashboardview = false;

    this.isLeadsUploadCampaign = true
    this.isCustomLeads = false;


  }

  campData: object
  campToLead(evt) {
    this.campData = evt;
    this.isleadsdata = true
  }

  leadUpload() {
    this.isleadsupload = true;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;
    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;
    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isdashboardview = false;

    this.isLeadsUploadCampaign = false
    this.isCustomLeads = false;


  }

  campaignView() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = true;

    this.isdashboardview = false;


    this.isLeadsUploadCampaign = false
    this.isCustomLeads = false;


  }

  showSummary() {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;

    this.isdashboardview = false;

    this.isLeadsUploadCampaign = true
    this.isCustomLeads = false;
  }
  
  customLeads()
  {
    this.isleadsupload = false;
    this.isleadsdata = false;
    this.isLeadHistory = false;
    this.ischartsdata = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isduplicateview = false;

    this.isLeadAllocation = false;
    this.istemplatecreate = false;
    this.isCampaign = false;
    this.isLeadsUploadCampaign = false;
    this.isdashboardview = false;
    this.isCustomLeads = true;


  }











}
