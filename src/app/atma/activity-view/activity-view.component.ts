import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service';

import { NotificationService } from '../notification.service'
import { Router } from '@angular/router'
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as $ from "jquery";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import * as imp from 'src/app/AppAutoEngine/import-services/CommonimportFiles';

export interface productlistss {
  id: string;
  name: string;
}
@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.scss'],
  providers:[imp.Vendor]
})
export class ActivityViewComponent implements OnInit {
  // SummaryApimodifyactivitydetailObjNew;any
  // SummaryApicatlogmodifyObjNew:any
  // @ViewChild("closeaddpopup") closeaddpopup;
  // url:any=environment.apiURL
  // branchId: number;
  // isLoading = false;
  // activityViewId: number;
  // totalData: any;
  // testingdata: any;
  // presentpage: number = 1;
  // pageSize = 10;
  // catalogAddForm: FormGroup;
  // send_value: string;
  // catname:any;
  // name: string;
  // type: string;
  // startDate: string;
  // endDate: string;
  // contractSpend: string;
  // rm: string;
  // activityStatus: string;
  // fidelity: string;
  // bidding: string;
  // description: string;
  // contactName: string;
  // contactDesignation: string;
  // contactDOB: string;
  // contactEmail: string;
  // contactType: string;
  // contactLine1: string;
  // contactLine2: string;
  // contacMobile1: string;
  // contacMobile2: string;
  // activityDetailList: any;
  // isActivityDetail = true;
  // isActivityDetailForm: boolean;
  // isActivityDetailEditForm: boolean;
  // getCatalogList: any;
  // isCatalog=false;
  // isCatalogForm: boolean;
  // isCatalogEditForm: boolean;
  // ismakerCheckerButton: boolean;
  // has_next = true;
  // has_previous = true;
  // activity_catddl: any;
  // getData: any;
  // branchViewId: any;
  // isActivityDetailPagination: boolean;
  // isCatalogPagination: boolean;
  // modalclose:boolean 
  // rename: any
  // message = "Are you sure to delete activity?" 9259
  // message = "Activity-related data, including Activity Details and Catalogue will be Deleted"

  // cid:any
  // catalogpage = 1;
  // catalog_next = true;
  // catalog_previous = true;

  // vendorId: number;
  // modificationactivitydetaildata: any;
  // activitydetail_data = [];
  // activitydetail_modify = false;
  // requestStatusName: string;
  // vendorStatusName: string;
  // productID: number;
  // modificationcatalogdata: any;
  // catalog_data = [];
  // catalog_modify = false;
  // catalogTab=false;
  // activityUpdateCard = false;
  // updatename: string;
  // updatetype: string;
  // updatestartDate: string;
  // updateendDate: string;
  // updatecontractSpend: string;
  // updaterm: string;
  // updateactivityStatus: string;
  // updatefidelity: any;
  // updatebidding: any;
  // updatedescription: string;
  // activitydata: any;
  // vendor_flag=false;
  // mainStatusName: string;
  // fidelityBox:any;
  // biddingBox: any;
  // activeid:any;
  // catelog_RMView = false;
  // catelogName: string;
  // subCatelogName: string;
  // updatedepartment:any;
  // modidepartmentname:any;
  // activitycount: any;
  // atmaService: any;
  // productList: any;
  // matAutocomplete1: any;
  // autocompleteTrigger: any;
  // productInput: any;
  // currentpage: any;
  // pagesize = 10
  // vendorSummaryList: any;
  // isVendorSummaryPagination: boolean;
  // activeId: number;
  // activedetailId: any;
  // venservapi: any;
  // url1: string;
  constructor(private shareService: ShareService,private formBuilder: FormBuilder, private notification: NotificationService, private router: Router,
    private atamaService: AtmaService,private vendorpath: imp.Vendor) { }


  ngOnInit(): void {
    // let data: any = this.shareService.branchView.value;
    // this.vendorId = data.vendor_id;
    // let datas: any = this.shareService.catlogView.value;
    // this.activedetailId =datas.activitydetail_id.id;
    // console.log("vendorid", this.vendorId)
    // this.getActivityView()
    // this.getVendorViewDetails();  
    // this.getActivityDetail();
    // this.activitydetailsummary();
    // this.getmodificationactivitydetail_vender();
    // this.getmodificationactivitydetail_vender();
    // this.activitycount=this.shareService.activtycounts.value
    // this.catalogAddForm = this.formBuilder.group({
    //   product_name: [''],
    // })
   
  }

  // getActivityView() {
  //   let data: any = this.shareService.activityView.value;
  //   console.log("activityrow",data)
  //   this.branchId = data.branch
  //   this.activityViewId = data.id;
    // this.activeId = data.activity_id;
    // let datas: any = this.shareService.catlogView.value;
    // this.activedetailId = datas.activitydetail_id.id;

  //   this.atamaService.activityViewDetails(this.branchId, this.activityViewId)
  //     .subscribe(data1 => {
  //       console.log("seperateactivitydetail",data1)
  //       let status = data1.modify_status;
  //       let ref_id = data1.modify_ref_id

  //       if (status == 2) {
  //         this.atamaService.activityViewDetails(this.branchId, ref_id)
  //           .subscribe(res => {
  //             console.log("res", res)
  //             this.branchActivityEdit(res, status);
  //           })
  //       } else {
  //         this.branchActivityEdit(data1, status);
  //       }
  //       this.getData = data1
  //       this.name = data1.name;
  //       this.modidepartmentname=data1.service_branch.name
  //       this.type = data1.type;
  //       this.startDate = data1.start_date;
  //       this.endDate = data1.end_date;
  //       this.contractSpend = data1.contract_spend;
  //       this.rm = data1.rm;
  //       this.activityStatus = data1.activity_status;
  //       if(data1.fidelity=='True'){
  //         this.fidelityBox= "Yes";
  //       }else{
  //         this.fidelityBox= "No";
  //       }
  //       if(data1.bidding=='True'){
  //         this.biddingBox= "Yes";
  //       }else{
  //         this.biddingBox= "No";
  //       }
  //       this.description = data1.description;
  //       let contact = data1.contact_id;
  //       this.contactName = contact.name;
  //       this.contactEmail = contact.email;
  //       this.contactDOB = contact.dob;
  //       this.contactLine1 = contact.landline;
  //       this.contactLine2 = contact.landline2;
  //       this.contacMobile1 = contact.mobile;
  //       this.contacMobile2 = contact.mobile2;
  //       this.contactDesignation = contact.designation_id.name;
  //       // this.contactType = contact.type_id.name;
  //     })
  // }
  // backButton(){
  //   this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
  // }
  // activityUpdate() {
  //   this.shareService.activityEditForm.next(this.getData)
  //   this.shareService.vendorID.next(this.vendorId)
  //   this.router.navigate(['/atma/branchActivityEdit'], { skipLocationChange: true })
  // }

  // branchActivityEdit(data, status) {
  //   if (status != 2) {
  //     this.activityUpdateCard = false;
  //   } else {
  //     this.updatedepartment=data.service_branch.name;
  //     this.updatename = data.name;
  //     this.updatetype = data.type;
  //     this.updatestartDate = data.start_date;
  //     this.updateendDate = data.end_date;
  //     this.updatecontractSpend = data.contract_spend;
  //     this.updaterm = data.rm;
  //     this.updateactivityStatus = data.activity_status;
  //     if(data.fidelity=='True'){
  //       this.updatefidelity= "Yes";
  //     }else{
  //       this.updatefidelity= "No";
  //     } 
  //     if(data.bidding=='True'){
  //       this.updatebidding= "Yes";
  //     }else{
  //       this.updatebidding= "No";
  //     }
  //     this.updatedescription = data.description;
  //   }

  // }
  // activityDelete() {
  //   let data = this.getData
  //   console.log("deletedata", data)
  //   let activityID = data.id
  //   this.branchViewId = data.branch
  //   this.atamaService.activityDelete(this.branchViewId, activityID)
  //     .subscribe(result => {
  //       console.log("deleteactivity", result)
        // if (result.code === "UNEXPECTED_ACTIVITYID_ERROR" && result.description === "Cannot delete parent table ID") {
        //   // this.notification.showWarning("Should Not be Delete Activity...")
        //   this.notification.showWarning("Ensure TO Delete With No Activity and Catalogue Details")

        // } 
        //bug id:9259
  //       if (result.code === "Atleast one Activity should be maintained") {
  //         // this.notification.showWarning("Should Not be Delete Activity...")
  //         this.notification.showWarning(result.description)

  //       } 
  //       else {
  //         this.notification.showSuccess("Successfully deleted....")
  //       this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
  //       return true
  //       }
  //     })
  // }

  // getActivityDetail(pageNumber = 1, pageSize = 10) {
  //   let datas: any = this.shareService.catlogView.value;
  //   this.activedetailId = datas.id;
  //   this.atamaService.getActivityDetailList(this.activityViewId, pageNumber, pageSize)
  //     .subscribe(result => {
  //       console.log("activitydetail", result)
  //       let datas = result['data'];
  //       this.totalData = datas;
        // this.activedetailId = this.totalData.id;
        // console.log("ss", this.totalData)
        // this.activityDetailList = datas;
        // let datapagination = result["pagination"];
        // this.activityDetailList = datas;
        // if (this.activityDetailList.length >= 0) {
        //   this.has_next = datapagination.has_next;
        //   this.has_previous = datapagination.has_previous;
        //   this.presentpage = datapagination.index;
        //   this.isActivityDetailPagination = true;
        // } if (this.activityDetailList <= 0) {
        //   this.isActivityDetailPagination = false;
        // }
        // if(this.totalData.length>0){
        //   this.getcatsummary();
        //   }
       
  //     })

  //   if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
  //     this.getmodificationactivitydetail_vender();
  //     this.activitydetail_modify = true;

  //   }
    
  // }

  // getcatsummary(pageNumber = 1, pageSize = 10) {
  //   this.activeid=this.totalData[0].id
  //   this.catname=this.totalData[0].detailname
  //   this.atamaService.getcatalogsummary(pageNumber, pageSize,  this.cid)
  //   .subscribe(result => {
  //   console.log("Catalog", result)
  //   let datas = result['data'];
  //   this.getCatalogList = datas;
  //   let datapagination = result["pagination"];
  //   this.getCatalogList = datas;
  //   if (this.getCatalogList.length >= 0) {
  //   this.has_next = datapagination.has_next;
  //   this.has_previous = datapagination.has_previous;
  //   this.catalogpage = datapagination.index;
  //   this.isCatalogPagination = true;
  //   } if (this.getCatalogList <= 0) {
  //   this.isCatalogPagination = false;
  //   }
  //   })
  // }    
  // nextClickActivityDetail() {
  //   if (this.has_next === true) {
  //     this.getActivityDetail(this.presentpage + 1, 10)
  //   }
  // }

  // previousClickActivityDetail() {
  //   if (this.has_previous === true) {
  //     this.getActivityDetail(this.presentpage - 1, 10)
  //   }
  // }
  // activityDetailBtn() {
  //   this.isActivityDetail = true;
  //   this.isActivityDetailForm = false;
  //   this.isActivityDetailEditForm = false;
  //   if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
  //     this.activitydetail_modify = true;
  //   }

  // }
  // addActivityDetail() {
  //   this.isActivityDetail = false;
  //   this.isActivityDetailForm = true;
  //   this.shareService.activityView.next(this.activityViewId)
  //   this.shareService.activityViewDetail.next(this.getData)
  //   this.popupopen()
  //   this.rename = "Activity Product Category Creation Form"
  // }
  // popupopen() {
  //   var myModal = new (bootstrap as any).Modal(
  //     document.getElementById("catalogModal"),
  //     {
  //       keyboard: false,
  //     }
  //   );
  //   myModal.show();
  // }
  // activityDetailEditForm(data) {
  //   this.isActivityDetail = false;
  //   this.isActivityDetailEditForm = true;
  //   this.shareService.activityDetailEditForm.next(data);
  //   this.shareService.activityView.next(this.activityViewId)
  //   this.shareService.activityViewDetail.next(this.getData)
  //   this.popupopen()
  //   this.rename = "Activity Product Category Edit Form"

  // }
  // activityDetailCancel() {
  //   this.isActivityDetailForm = false;
  //   this.isActivityDetail = true;
  //   this.cancelpopup()
  // }
  // activityDetailSubmit() {
    // this.getActivityDetail()
  //   this.activitydetailsummary()
    
  //   this.isActivityDetailForm = false;
  //   this.isActivityDetail = true;
  //   this.cancelpopup()
  // }
  // activityDetailEditCancel() {
  //   this.isActivityDetailEditForm = false;
  //   this.isActivityDetail = true;
  //   this.cancelpopup()
  // }
  // activityDetailEditSubmit() {
    // this.getActivityDetail();
  //   this.activitydetailsummary();
  //   this.isActivityDetailEditForm = false;
  //   this.isActivityDetail = true;
  //   this.cancelpopup()
  // }
  // deleteActivityDetail(data) {
  //   let supplierId = data.id
    //9259
    // if(this.activityDetailList == 1){
    //   this.notification.showError('Atleast one ActivityDetail should be maintained')
    //   return false
    // }

    // else{
    // if (confirm("Activity  Details  containing Catalogue will also be Deleted?")) {
    // this.atamaService.activityDetailDelete(this.activityViewId, supplierId)
    //   .subscribe(result => {
    //     console.log("deleteactivityDetail", result)
        // if (result.code === "UNEXPECTED_ACTIVITYID_ERROR" && result.description === "Cannot delete parent table ID") {
        //   // this.notification.showWarning("Should Not be Delete ActivityDetail...")
        //   this.notification.showWarning("Ensure TO Delete With No Catalogue Details")
        // } 
        // BUG ID:9259
        // if (result.code === "Atleast one ActivityDetail should be maintained") {
          // this.notification.showWarning("Should Not be Delete ActivityDetail...")
        //   this.notification.showWarning(result.description)
        // } 
        // else {
        //   this.notification.showSuccess("Successfully deleted....")
          // this.getActivityDetail();
  //         this.activitydetailsummary();
  //         return true
  //       }
  //     })}
  //     else{
  //       return false
  //     }}
  // }
  // getcatalogsummary(pageNumber = 1, pageSize = 10) {
  //   let data: any = this.shareService.testingvalue.value;
    // let activityDetailId = data.id
    
//     this.atamaService.getcatalogsummary(pageNumber, pageSize, this.cid)
//       .subscribe(result => {
//         console.log("Catalog", result)
//         let datas = result['data'];
//         this.getCatalogList = datas;
//         let datapagination = result["pagination"];
//         this.getCatalogList = datas;
//         if (this.getCatalogList.length >= 0) {
//           this.has_next = datapagination.has_next;
//           this.has_previous = datapagination.has_previous;
//           this.catalogpage = datapagination.index;
//           this.isCatalogPagination = true;
//           } if (this.getCatalogList <= 0) {
//           this.isCatalogPagination = false;
//           } 
        
//       })

//     if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
//       this.getmodificationactivitydetail_vender();
//       this.catalog_modify = true;

//     } 
    
// }
//   nextClickCatalog() {
//     if (this.has_next === true ) {
//       this.catalogsearch(this.catalogpage + 1, 10)
//     }
  
//   }
//   previousClickCatalog() {
//     if (this.has_previous === true) {
//       this.catalogsearch(this.catalogpage - 1, 10)
//     }
//   }

//   catalogBtn() {
    // this.testingdata = this.testingCat;
    // console.log("get", this.testingdata)
    // this.shareService.testingvalue.next(this.testingdata)
    // this.getcatalogsummary();
    // this.isCatalog = false;
    // this.isCatalogForm = false;
    // this.isActivityDetail=true;
    // this.catalogTab=false;
  //  this. getActivityDetail();
  // this.activitydetailsummary();
    
    // // this.ismakerCheckerButton = true;
    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
    //   this.catalog_modify = true;
    // }
  // }
  // addCatalog() {
  //   this.isCatalog = true;
  //   this.isCatalogForm = true;
  //   this.modalclose = true
    // this.testingdata = this.testingCat;
    // console.log(">>S>ScatgLOGVALUE", this.testingdata)
  //   this.shareService.testingvalue.next(this.activity_catddl)
  //   this.popupopen()
  //   this.rename = "Catalogue Creation Form"
  // }
  // onCancelClick() {
  //   this.isCatalogForm = false;
  //   this.catelog_RMView = false;
  //   this.isCatalog = true
  //   this.modalclose = false
  //   this.cancelpopup()

  // }
  // RMView_catelog(data) {
  //   let new_datas = { 
  //     "new_data": data
  //   }
  //   console.log("catelog", new_datas)
  //   this.isCatalog = false;
  //   this.isCatalogForm = false;
  //   this.catelog_RMView = true;
  //   this.isCatalogEditForm = false;
  //   this.shareService.modification_data.next(new_datas);
  //   this.popupopen()
  //   this.rename = "Catelog Changes View Form"

  // }

  // catalogSubmit() {
    // this.getcatalogsummary();
  //   this.catlogsummary();
  //   this.isCatalogForm = false;

  //   this.isCatalog = true
  //   this.cancelpopup()
  // }

  // catalogEdit(data) {
  //   this.isCatalogEditForm = true;
  //   this.isCatalog = false;
  //   // this.ismakerCheckerButton = false;
  //   this.shareService.catalogEdit.next(data)
  //   this.popupopen()
  //   this.rename = "Edit Catalogue Form"
    // console.log("catalog", data);
    // this.shareService.testingvalue.next(this.testingdata)
  //   return data;
  // }
  // catalogEditCancel() {
  //   this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
  //   this.isCatalog = true;
  //   this.cancelpopup()

  // }
  // catalogEditSubmit() {
    // this.getcatalogsummary();
    // this.catlogsummary();
    // this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
  //   this.isCatalog = true;
  //   this.cancelpopup()


  // }
  // async wait(ms: number): Promise<void> {
	// 	return new Promise<void>( resolve => setTimeout( resolve, ms) );
	// }
  // deleteCatalog(data,index) {
  //  this.getCatalogList[index].catbtn=true;
  // this.isLoading = true;
  // this.wait(2000).then( () => this.isLoading = false );

    // let datas: any = this.shareService.testingvalue.value;
    // let activityDetailId = data.activitydetail_id.id
    // let value = data.id
    // console.log("deleteCatalog", value)
    // if(this.getCatalogList == 1){
    //   this.notification.showError('Atleast one Catalogue should be maintained')
    //   return false
    // }
    // else{
    // if (confirm("Delete Catalog details?")) {
    // this.atamaService.deleteCatalogForm(value, activityDetailId)
    //   .subscribe(result => {
                //bug id:9259
                // if (result.code === "Atleast one Catalogue should be maintained") {
                  // this.notification.showWarning("Should Not be Delete Activity...")
                // if (result.code) {
                //   this.notification.showWarning(result.description)
        
                // } 
                // else {
                //   this.notification.showSuccess("Successfully deleted....")
                //   // this.getcatalogsummary();
                //   this.catlogsummary();
                //   return true
                // }

        // this.notification.showSuccess("Successfully deleted....")
        // this.getcatalogsummary();
        // return true
  //     })}else{
  //       return false
  //     }}
  // }

  // catalogList(data) {
  //   this.isCatalogForm = false;
  //   this.isCatalog=true;
  //   this.catalogTab=true;
  //   this.isActivityDetail=false
  //   this.catname=data.detailname;
  //   this.cid=data.id;
    // this.getcatalogsummary();
    // this.catlogsummary();
    // this.ismakerCheckerButton = true;
    // this.testingCat = data
  //   this.activity_catddl=data;
  //   let s = this.shareService.activityDetailList.next(data);
  // }

  // catalogData(data) {
   
  //   this.isCatalogForm = false;
  //   this.isCatalog=true;
  //   this.catalogTab=true;
  //   this.isActivityDetail=false
  //   this.catname=data.detailname;
  //   this.cid=data.id;
    // this.getcatalogsummary();
    // this.catlogsummary();
    // this.ismakerCheckerButton = true;
    // this.testingCat = data
  //   this.activity_catddl=data;
  //   let s = this.shareService.activityDetailList.next(data);
    
  // }
  
  
  
  // getVendorViewDetails() {
  //   this.venservapi=this.vendorpath.vendorser.venserv
  //   this.url1=this.url+this.venservapi+'vendor/'+this.vendorId

  //   this.atamaService
  //   .CommonApiCall(this.url1,'get','body','','')
    // this.atamaService.getVendorViewDetails(this.vendorId)
      // .subscribe(result => {
      //   this.requestStatusName = result.requeststatus_name;
      //   this.vendorStatusName = result.vendor_status_name;
      //   this.mainStatusName = result.mainstatus_name;
      //   if(this.mainStatusName=="Draft"  &&   this.requestStatusName=="Onboard"  && this.vendorStatusName == "Draft" ){
      //     this.vendor_flag=true;
      //   }
      //   if(this.mainStatusName=="Draft"  &&   this.requestStatusName=="Onboard"  && this.vendorStatusName == "Rejected" ){
      //     this.vendor_flag=true;
      //   }
      //   if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Draft" ){
      //     this.vendor_flag=true;
      //     this.activitydetail_modify = true;
          // this.isCatalog=true;
  //         this.catalog_modify = true;
  //       }
  //       if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Rejected" ){
  //         this.vendor_flag=true;
  //       }
  //       if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft") {
  //         this.vendor_flag = true;
  //       }
  //     })
  // }
  // catlogname(){
  //   let prokeyvalue: String = "";
  //     this.getCatlogs(prokeyvalue);
  //     this.catalogAddForm.get('product_name').valueChanges
  //       .pipe(
  //         debounceTime(100),
  //         distinctUntilChanged(),
  //         tap(() => {
  //           this.isLoading = true;
  //         }),
  //         switchMap(value => this.atamaService.getCatlogs(value)
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false
  //             }),
  //           )
  //         )
  //       )
  //       .subscribe((results: any[]) => {
  //         let datas = results["data"];
  //         this.productList = datas;
  //         console.log("product", datas)
  
  //       })
  
  // }
  // productScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete1 &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete1.panel
  //     ) {
  //       fromEvent(this.matAutocomplete1.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete1.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete1.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete1.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete1.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atamaService.getProducts1(this.productInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.productList = this.productList.concat(datas);
  //                   if (this.productList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  // private getCatlogs(prokeyvalue) {
    // let datas: any = this.shareService.catlogView.value;
    // this.activedetailId=datas.activitydetail_id.id;
  //   this.atamaService.getCatlogs(prokeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productList = datas;

  //     })
  // }
  // public displaydis(producttype?: productlistss): string | undefined {
    // console.log('id', producttype.id);
    // console.log('name', producttype.name);
  //   return producttype ? producttype.name : undefined;
  // }
  // get producttype() {
  //   return this.catalogAddForm.get('product_name');
  // }
  // prod(data) {
  //   this.productID = data
    // this.categoryID = data.category
     // this.subcategoryID = data.subcategory
    // let catelog = data["category"];
    // this.catelogName = data?.name;


    // let catid = catelog['id'];
    // this.catelogName = catelog['name']
    // let subcatelog = data["subcategory"];
    // let subcatid = subcatelog['id'];
    // this.subCatelogName = subcatelog['name']

    
    // this.catalogAddForm.patchValue({
    //   product_name: this.productID,
    //   category: this.catelogName,
    //   subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
  //   })
  // }

  // createFormate() {
    // let date = this.setDate(this.currentDate);

    // let data = this.catalogAddForm.controls;
    // let objCatalog = new Catalog();

    // objCatalog.detail_name = data['detail_name'].value;
    // objCatalog.product_name = data['product_name'].value.id;
    // objCatalog.category = data['product_name'].value['category']['id'];
    // objCatalog.subcategory = data['product_name'].value['subcategory']['id'];
    // objCatalog.name = data['name'].value;
    // objCatalog.specification = data['specification'].value;
    // objCatalog.size = data['size'].value;
    // objCatalog.remarks = data['remarks'].value;
    // objCatalog.uom = data['uom'].value.id;
    // objCatalog.unitprice = data['unitprice'].value;
    // objCatalog.from_date = data['from_date'].value;
    // console.log('fromdate===>',objCatalog.from_date)
    // objCatalog.to_date = data['to_date'].value;
    // console.log('todate===>',objCatalog.to_date)

    // objCatalog.packing_price = data['packing_price'].value;
    // objCatalog.delivery_date = data['delivery_date'].value;
    // objCatalog.capacity = data['capacity'].value;
    // objCatalog.direct_to = data['direct_to'].value;
    // let dateValue = this.catalogAddForm.value;
    // let fromdate = dateValue.from_date;
    // objCatalog.from_date = this.datePipe.transform(date, 'yyyy-MM-dd');
    // // console.log(this.datePipe.transform(fromdate,"yyyy-MM-dd")); //output : 2018-02-13
    // console.log('objCatalog.from_date===>',objCatalog.from_date)
    // objCatalog.to_date = this.datePipe.transform(dateValue.to_date, 'yyyy-MM-dd');
    // console.log('objCatalog.to_date===>',objCatalog.to_date)


  //   var str = data['name'].value
  //   var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
  //   objCatalog.name = cleanStr_name

  //   var str = data['specification'].value
  //   var cleanStr_spe=str.trim();//trim() returns string with outer spaces removed
  //   objCatalog.specification = cleanStr_spe

  //   var str = data['remarks'].value
  //   var cleanStr_rk=str.trim();//trim() returns string with outer spaces removed
  //   objCatalog.remarks = cleanStr_rk
    
  //   var str = data['capacity'].value
  //   var cleanStr_cp=str.trim();//trim() returns string with outer spaces removed
  //   objCatalog.capacity = cleanStr_cp

  //   console.log(" objCatalog", objCatalog)
  //   return objCatalog;
  // }

  // catalogsearch(page=1,pageSize=10){
    // let datas: any = this.shareService.catlogView.value;
    // this.activedetailId =datas.id;
    // this.shareService.catlogView.next(this.activedetailId)
  //   let search = this.catalogAddForm.value
  //   console.log("Search Values", search)
  //   let obj = 
  //   {
      
  //   }
    
  //   if(search.product_name!=""&& search.product_name!=null&&search.product_name!=undefined){
  //     obj["product_name"]=search.product_name
  //   }
  //   this.send_value = ""
  //   this.atamaService.getcatlogsearch(page,this.branchId,this.activityViewId,this.cid,this.catelogName).subscribe(results => {
  //     console.log("res",results)
  //     this.getCatalogList = results['data']
  //     let dataPagination = results['pagination'];
  //     if(this.getCatalogList.length == 0){
  //       this.has_next = false;
  //       this.has_previous = false;
  //       this.catalogpage = 1
  //     }
  //     if (this.getCatalogList.length > 0) {
  //     this.has_next = dataPagination.has_next;
  //     this.has_previous = dataPagination.has_previous;
  //     this.catalogpage = dataPagination.index;
  //     this.isCatalogPagination = true;
  //     } 
  //     if (this.getCatalogList < 0) {
  //       this.isCatalogPagination = false;
  //     }

      

  //    console.log("getCatalogList", results)
  // })
  // this.getcatalogsummary();

  // }

  //Modification data for a particular vendor
  // getmodificationactivitydetail_vender() {
  //   this.activitydetail_data = [];
  //   this.catalog_data=[];
  //   this.atamaService.getmodification(this.vendorId)
  //     .subscribe(result => {
        
  //       this.modificationactivitydetaildata = result['data']
  //       this.modificationactivitydetaildata.forEach(element => {
  //         if (element.action == 2)//edit
  //         {
  //           if (element.type_name== 14 && element.new_data.activity_id.id==this.activityViewId) {
  //             this.activitydetail_data.push(element.new_data)
  //             this.acttivitymodifysummary()
  //           }
  //           if (element.type_name== 15 && element.new_data.activitydetail_id.id==this.cid) {
  //             this.catalog_data.push(element.new_data)
  //             this.modifysummary()
  //           }
  //         }
          //create and delete
  //         else {
  //           if (element.type_name== 14 && element.data.activity_id.id==this.activityViewId) {
  //             this.activitydetail_data.push(element.data)
  //             this.acttivitymodifysummary()
  //           }
  //           if (element.type_name== 15 && element.data.activitydetail_id.id==this.cid) {
  //             this.catalog_data.push(element.data)
  //             this.modifysummary()

  //           }
  //         }
  //       });
  //       if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
  //         if (this.activitydetail_data.length > 0) {
  //           this.activitydetail_data = this.getbtn_status(this.activitydetail_data)
  //           this.acttivitymodifysummary()
  //         }
  //         if (this.catalog_data.length > 0) {
  //           this.catalog_data = this.getbtn_status(this.catalog_data)
  //           this.modifysummary()
  //         }

  //       }
  //     })

  // }

  // getbtn_status(array) {
  //   for (let i = 0; i < array.length; i++) {

  //     if (array.length != i) {

  //       if (array[i].modify_status == 2) {
  //         for (let j = 1; j < array.length; j++) {
  //           if (array[i].id == array[j].modify_ref_id) {

  //             array[j]["modify_ref_id"] = true;

  //           }
  //         }
  //       }
  //     }

  //   }
  //   return array
  // }

  // Reset(){
  //   this.catalogAddForm.reset();
    // this.getcatalogsummary();
    // this.catlogsummary();
    // this.catelogName = undefined;
  // }

  // SummaryactivitydetailData: any = [{ "columnname": "Code", "key": "code"},

// { "columnname": "Detail Name", "key": "detailname", "style":{color:"blue",cursor:"pointer"},function:false,clickfunction:this.catalogData.bind(this) },

// { "columnname": "Detail Name", "key": "detailname",function:false,clickfunction:this.catalogData.bind(this) },

// { "columnname": "Raisor", "key": "raisor","type":"object","objkey":"full_name" },

// { "columnname": "Approver", "key": "approver","type":"object","objkey":"full_name" },

// { "columnname": "Remarks", "key": "remarks" },

// { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.activitydetaileditfn.bind(this),
// clickfunction:this.activityDetailEditForm.bind(this)},

// { "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.activitydetaildeletefn.bind(this),
// clickfunction:this.deleteActivityDetail.bind(this)},

// ]
//   SummarycatalogData: any = [{ "columnname": "Details Name", "key": "detailname"},

// { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },

// { "columnname": "Item Name", "key": "name" },

// { "columnname": "Category", "key": "category","type":"object","objkey":"name" },

// { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"name" },

// { "columnname": "Raisor", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},

// { "columnname": "Approver", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},

// { "columnname": "View","icon":"visibility", button:true,function:true ,clickfunction:this.RMView_catelog.bind(this) },

// { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.catlogeditfn.bind(this),
// clickfunction:this.catalogEdit.bind(this)},

// { "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.catlogdeletefn.bind(this),
// clickfunction:this.deleteCatalog.bind(this)},

// ]

//   activitydetaileditfn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(this.vendor_flag==true){
  
//       if(data.modify_ref_id>0){
//         config={
//           disabled: true,
//           style: {color:'gray'},
//           icon: 'edit',
//           class: '',
//           value: '',
//           function:false
//         }
//       }
//       else if(data.modify_ref_id=='-1'){
//         config={
//           disabled: false,
//           style: {color:'green'},
//           icon: 'edit',
//           class: '',
//           value: '',
//           function:true
//         }
//       }
//     }
  
//     else if(this.vendor_flag==false){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:false
//       }
//     }
//     return config
//   }
//   activitydetaildeletefn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(this.vendor_flag==true){
  
//       if(data.modify_ref_id>0){
//         config={
//           disabled: true,
//           style: {color:'gray'},
//           icon: 'delete',
//           class: '',
//           value: '',
//           function:false
//         }
//       }
//       else if(data.modify_ref_id=='-1'){
//         config={
//           disabled: false,
//           style: {color:'green'},
//           icon: 'delete',
//           class: '',
//           value: '',
//           function:true
//         }
//       }
//     }
  
//     else if(this.vendor_flag==false){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'delete',
//         class: '',
//         value: '',
//         function:false
//       }
//     }
//     return config
//   }
//   activitydetailmodifystatusfn(data){
//     let config: any = {
//       value: ''
//     };
//     if(data.modify_status==1){
//       config={
//         value: 'Create'
//       }
//     }
//     else if(data.modify_status==2){
//       config={
//         value: 'Update'
//       }
//     }
//     else if(data.modify_status==0){
//       config={
//         value: 'Delete'
//       }
//     }
  
//     return config
//   }

//   activitydetailmodifyeditfn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(data.modify_ref_id !=data.id && data.modify_status==1){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:false 
//       }
//     }
//     else if(data.modify_ref_id ==data.id && data.modify_status==1){
//       config={
//         disabled: false,
//         style: {color:'gray'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:true 
//       }
//     }
//     else if(data.modify_status==2  &&  data.modify_ref_id != true){
//       config={
//         disabled: false,
//         style: {color:'green'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:true 
//       }
//     }
//     else if(data.modify_status==2  &&  data.modify_ref_id ==true){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:false 
//       }
//     }
//     return config
//   }

//   activitydetailmodifydeletefn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(data.modify_status!=0){
//       config={
//         disabled: false,
//         style: {color:'green'},
//         icon: 'delete',
//         class: '',
//         value: '',
//         function:true
//       }
//     }
//     else if(data.modify_status==0){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'delete',
//         class: '',
//         value: '',
//         function:true
//       }
//     }
//     return config
//   }

//   catlogeditfn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(this.vendor_flag==true){
  
//       if(data.modify_ref_id>0){
//         config={
//           disabled: true,
//           style: {color:'gray'},
//           icon: 'edit',
//           class: '',
//           value: '',
//           function:false
//         }
//       }
//       else if(data.modify_ref_id=='-1'){
//         config={
//           disabled: false,
//           style: {color:'green'},
//           icon: 'edit',
//           class: '',
//           value: '',
//           function:true
//         }
//       }
//     }
  
//     else if(this.vendor_flag==false){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'edit',
//         class: '',
//         value: '',
//         function:false
//       }
//     }
//     return config
//   }

//   catlogdeletefn(data){
//     let config: any = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: '',
//       function:false
//     };
//     if(this.vendor_flag==true){
  
//       if(data.modify_ref_id>0){
//         config={
//           disabled: true,
//           style: {color:'gray'},
//           icon: 'delete',
//           class: '',
//           value: '',
//           function:false
//         }
//       }
//       else if(data.modify_ref_id=='-1'){
//         config={
//           disabled: false,
//           style: {color:'green'},
//           icon: 'delete',
//           class: '',
//           value: '',
//           function:true
//         }
//       }
//     }
  
//     else if(this.vendor_flag==false){
//       config={
//         disabled: true,
//         style: {color:'gray'},
//         icon: 'delete',
//         class: '',
//         value: '',
//         function:false
//       }
//     }
//     return config
//   }
//   SummaryApiactivitydetailObjNew:any
//   SummaryApicatlogObjNew:any

//   activitydetailsummary(){
//     this.SummaryApiactivitydetailObjNew={ "method": "get", "url": this.url + "venserv/activity/"+this.activityViewId +'/supplieractivitydtl' }
//     if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
//       this.getmodificationactivitydetail_vender();
//       this.activitydetail_modify = true;

//     }
//   }
//   catlogsummary(){
//     this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplieractivitydtl/"+this.cid +'/catelog' }
//     if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
//       this.getmodificationactivitydetail_vender();
//       this.catalog_modify = true;

//     } 
//   }

//   cancelpopup(){
//     this.closeaddpopup.nativeElement.click();
//   }

//   closepopup(){
//     if(this.isActivityDetailForm){
//       this.activityDetailCancel()
//     }
//    else if(this.isActivityDetailEditForm){
//       this.activityDetailEditCancel()
//     }
//    else if(this.isCatalogForm){
//       this.onCancelClick()
//     }
//    else if(this.isCatalogEditForm){
//       this.catalogEditCancel()
//     }
//    else if(this.catelog_RMView){
//       this.onCancelClick()
//     }
//   }
  


//   SummarymodifycatalogData:any = [{ "columnname": "Details Name", "key": "detailname"},

//   { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
//   { "columnname": "Item Name", "key": "name" },
  
//   { "columnname": "Category", "key": "category","type":"object","objkey":"name" },
  
//   { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"name" },

//   { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},

//   { "columnname": "To date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},

//   { "columnname": "Status", "key": "statuus" , validate: true, validatefunction: this.catlogstatusfn.bind(this)},

//   { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.catlogeditconfigfn.bind(this),
// clickfunction:this.catalogEdit.bind(this)},

// { "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.catlogdeleteconfigfn.bind(this),
// clickfunction:this.deleteCatalog.bind(this)},
// ]



// catlogstatusfn(datasum){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };

//   if (datasum.modify_status == 1){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Create',
//       function:false
//     };
//   } else if (datasum.modify_status == 2){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Update',
//       function:false
//     };
//   }  else if (datasum.modify_status == 0){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Delete',
//       function:false
//     };
//   }
//   return config;
// }

// catlogeditconfigfn(actiondata){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };

//   if (actiondata.modify_ref_id != actiondata.id && actiondata.modify_status == 1){
//     config = {
//       disabled: false,
//       style: {color: 'gray'},
//       icon: 'edit',
//       class: '',
//       value: '',
//       function: true
//     };
//   }
//   else if (actiondata.modify_ref_id == actiondata.id && actiondata.modify_status == 1){
//     config = {
//       disabled: false,
//       style: {color: 'green'},
//       icon: 'edit',
//       class: '',
//       value: '',
//       function: true
//     };
//   }
//   else if (actiondata.modify_status == 2 && actiondata.modify_ref_id != true){
//     config = {
//       disabled: false,
//       style: {color: 'green'},
//       icon: 'edit',
//       class: '',
//       value: '',
//       function: true
//     };
//   }
//   return config;
// }

// catlogdeleteconfigfn(deletesum){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };

//   if (deletesum.modify_status != 0) {
//     config = {
//       disabled: false,
//       style: {color: 'green'},
//       icon: 'delete',
//       class: '',
//       value: '',
//       function: true
//     };
//   } 
//   else if (deletesum.modify_status == 0) {
//     config = {
//       disabled: false,
//       style: {color: 'gray'},
//       icon: 'delete',
//       class: '',
//       value: '',
//       function: true
//     };
//   }
//   return config
// }
// modifysummary (){
//   this.SummaryApicatlogmodifyObjNew = {
//     FeSummary: true,
//     data: this.catalog_data,
//   }
   
  
  
// }


// SummarymodifyactivitydetailData:any =[ 
//   { "columnname": "Code", "key": "code"},

//   { "columnname": "Detail Name", "key": "detailnamessss",function:false,validate: true, validatefunction:this.activityrouteview.bind(this), clickfunction: this.catalogList.bind(this) },
  
//   { "columnname": "Raisor", "key": "raisor","type":"object","objkey":"full_name" },
  
//   { "columnname": "Approver", "key": "approver", "type":"object","objkey":"full_name" },

//   { "columnname": "Remarks", "key": "remarks" },

//   { "columnname": "Status",  "key": "edit", validate: true, validatefunction: this.activitystatusfn.bind(this)},

//   { "columnname": "Action", "key": "statuus" , button:true, validate: true, function: true,
//   validatefunction: this.activityeditconfigfn.bind(this), clickfunction:this.activityDetailEditForm.bind(this)},

//   { "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.activitymodifydeletefn.bind(this),
// clickfunction:this.deleteActivityDetail.bind(this)},



// ]


// acttivitymodifysummary(){
//   this.SummaryApimodifyactivitydetailObjNew = {
//     FeSummary: true,
//     data: this.activitydetail_data,
//   }
   
 
  
// }

// activitystatusfn(datasum){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };

//   if (datasum.modify_status == 1){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Create',
//       function:false
//     };
//   } else if (datasum.modify_status == 2){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Update',
//       function:false
//     };
//   }  else if (datasum.modify_status == 0){
//     config = {
//       disabled: false,
//       style: '',
//       icon: '',
//       class: '',
//       value: 'Delete',
//       function:false
//     };
//   }
//   return config;
// }


// activityeditconfigfn(actiondata){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };

//   if ((actiondata.modify_ref_id != actiondata.id && actiondata.modify_status == 1) ||
//       (actiondata.modify_status == 2 && actiondata.modify_ref_id == true)){
//     config = {
//       disabled: true,
//       style: {color: 'gray'},
//       icon: 'edit',
//       class: '',
//       value: '',
//       function: false
//     };
//   }
//   else if ((actiondata.modify_ref_id == actiondata.id && actiondata.modify_status == 1) ||
//            (actiondata.modify_status == 2 && actiondata.modify_ref_id != true)){
//     config = {
//       disabled: false,
//       style: {color: 'green'},
//       icon: 'edit',
//       class: '',
//       value: '',
//       function: true
//     };
//   }
//   return config;
// }

// activitymodifydeletefn(data){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };
//   if(data.modify_status!=0){
//     config={
//       disabled: false,
//       style: {color: 'green'},
//       icon: 'delete',
//       class: '',
//       value: '',
//       function:true
//     }
//   }
//   else if(data.modify_status==0){
//     config={
//       disabled: true,
//       style: {color: 'gray'},
//       icon: 'delete',
//       class: '',
//       value: '',
//       function:true
//     }
//   }
//   return config
// }

// activityrouteview(data){
//   let config: any = {
//     disabled: false,
//     style: '',
//     icon: '',
//     class: '',
//     value: '',
//     function:false
//   };
//     if(data.modify_status == 1){
//       config={
//         disabled: false,
//         style: {color:"blue",cursor:"pointer"},
//         icon: '',
//         class: '',
//         value: data.detailname,
//         function: true
//       }
//     }
//     else if(data.modify_status == 2 || data.modify_status == 0){
//       config={
//         disabled: false,
//         style: '',
//         icon: '',
//         class: '',
//         value: data.detailname,
//         function:false
//       }
//     }
//   return config
// }
// }
// class Catalog {
//   detail_name: string;
//   product_name: string;
//   category: string;
//   subcategory: string;
//   name: string;
//   specification: string;
//   size: string;
//   remarks: string;
//   uom: string;
//   unitprice: string;
//   from_date: string;
//   to_date: string;
//   packing_price: string;
//   delivery_date: string;
//   capacity: string;
//   direct_to: string;
}