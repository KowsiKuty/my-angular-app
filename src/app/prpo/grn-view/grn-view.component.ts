import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'

@Component({
  selector: 'app-grn-view',
  templateUrl: './grn-view.component.html',
  styleUrls: ['./grn-view.component.scss']
})
export class GrnViewComponent implements OnInit {
 
  GRNNo : number;
  DCNumber : number;
  ReceivedDate : Date;
  has_nextAssetdetails           = true;
  has_previousAssetdetails       = true;
  AssetdetailsList               : any;
  SupplierName : String;
  InvoiceNumber : number;
  currentepageassetList            : number = 1;
  presentpageassetList             : number = 1;
  pageSize              = 10;
  Remarks : String;
  remarksDataslist:any
  grnno:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  presentpagegrndetailsview        : number = 1;
  currentepagegrndetailsview       : number = 1;
  has_nextgrndetailsview           = true;
  has_previousgrndetailsview      = true;
  grndetailsviewList               : any;
  grndetailsviewpage               : boolean = true;
  grnid:any;


  grndetailsviewid                 : any;
  presentpageAssetdetails       : number = 1;
  currentepageAssetdetails       : number = 1;
  pageSizeAssetdetails           = 10;
  Assetdetailspage               : boolean = true;
  GRNData  : any;
  grnview : any;
  isDisabled = true;
  // supp:any;
  makerRemarks:any;
  approverRemarks:any;
  has_nextassetList               = true;
  has_previousassetList           = true;  
  assetListpage                   : boolean = true;
  detailsID: any;
  constructor( private router: Router,
     private dataService: PRPOSERVICEService, 
    private prposhareService:PRPOshareService , private toastr:ToastrService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService  ) { }

  ngOnInit(): void {
    
    let grnsummary: any= this.prposhareService.grnsummaryid.value
    this.grnid = grnsummary.inwardheader.id;
    console.log('ID for header', grnsummary)
    // this.getgrnView();
    this.getgrndetailsviewsummary();
    this.makerRemarks = grnsummary.maker_remarks
    this.approverRemarks = grnsummary.approver_remarks
    
  }

  getgrnView() {
    this.SpinnerService.show();
    this.dataService.getgrnView(this.grnid)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("grn", result)
        let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          let rdate=this.grnview;
          rdate.inwardheader.date=this.datePipe.transform(rdate.inwardheader.date, 'yyyy-MM-dd');
          console.log("ccc",  rdate?.inwardheader?.date)
        
        this.GRNNo = this.grnview?.inwardheader?.code
        this.DCNumber = this.grnview?.inwardheader?.dcnote
        this.ReceivedDate = this.grnview?.inwardheader?.date
        this.SupplierName =this.grnview?.poheader_id?.supplierbranch_id?.name
        this.InvoiceNumber =this.grnview?.inwardheader?.invoiceno
        this.Remarks =this.grnview?.inwardheader?.remarks
        
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    total_count: any;
  getgrndetailsviewsummary(pageNumber = 1, pageSize = 10){
    this.SpinnerService.show();
    
    this.dataService.getgrndetailsviewsummary(pageNumber, pageSize ,this.grnid)
    .subscribe((results) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      console.log("getgrn", datas);
      let datapagination = results["pagination"];
      this.grndetailsviewList = datas;
      this.total_count = results?.total_count;
      // let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          let rdate=this.grnview;
          rdate.inwardheader.date=this.datePipe.transform(rdate.inwardheader.date, 'yyyy-MM-dd');
          console.log("ccc",  rdate?.inwardheader?.date)
        
        this.GRNNo = this.grnview?.inwardheader?.code
        this.DCNumber = this.grnview?.inwardheader?.dcnote
        this.ReceivedDate = this.grnview?.inwardheader?.date
        this.SupplierName =this.grnview?.poheader_id?.supplierbranch_id?.name
        this.InvoiceNumber =this.grnview?.inwardheader?.invoiceno
        this.Remarks =this.grnview?.inwardheader?.remarks
        }

      if (this.grndetailsviewList.length >= 0) {
        this.SpinnerService.hide();
        this.has_nextgrndetailsview = datapagination.has_next;
        this.has_previousgrndetailsview = datapagination.has_previous;
        this.presentpagegrndetailsview = datapagination.index;
        this.grndetailsviewpage = true
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  nextClickgrndetails() {
    if (this.has_nextgrndetailsview === true) {   
      this.currentepagegrndetailsview = this.presentpagegrndetailsview + 1                                                      
      this.getgrndetailsviewsummary(this.presentpagegrndetailsview + 1, 10)
    }                                                                                        
  }

  previousClickgrndetails() {
    if (this.has_previousgrndetailsview === true) {
      this.currentepagegrndetailsview = this.presentpagegrndetailsview - 1
      this.getgrndetailsviewsummary(this.presentpagegrndetailsview - 1, 10)
    }
  }
 
// Asset details popup code.

assetdetailssummary(pageNumber = 1, pageSize = 10) {
  this.SpinnerService.show();
  this.dataService.assetdetailssummary(pageNumber, pageSize, this.grndetailsviewid)
    .subscribe((result) => {
      this.SpinnerService.hide();
      let datas = result['data'];
      let datapagination = result["pagination"];
      this.AssetdetailsList = datas;
      if (this.AssetdetailsList.length === 0) {
        this.SpinnerService.hide();
        this.Assetdetailspage = false
      }
      if (this.AssetdetailsList.length >= 0) {
        this.SpinnerService.hide();
        this.has_nextAssetdetails = datapagination.has_next;
        this.has_previousAssetdetails = datapagination.has_previous;
        this.presentpageAssetdetails = datapagination.index;
        this.Assetdetailspage = true
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  nextClickassets() {
    if (this.has_nextAssetdetails === true) {
      this.currentepageAssetdetails = this.presentpageAssetdetails + 1
      this.assetdetailssummary(this.presentpageAssetdetails + 1)
    }
  }

  previousClickassets() {
    if (this.has_previousAssetdetails === true) {
      this.currentepageAssetdetails = this.presentpageAssetdetails - 1
      this.assetdetailssummary(this.presentpageAssetdetails - 1)
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
 
  onCancelClick() {
    this.onCancel.emit()
   }
   assetList: any
   getGrnAssetdata1(data) {
    this.detailsID = data.id
    this.SpinnerService.show();
    this.dataService.getGrnAssetdata1(this.detailsID)
      .subscribe(results => {
       this.SpinnerService.hide();
        let datas = results['data']
        this.assetList = datas
        let datapagination = results["pagination"];
        if (this.assetList.length === 0) {
          this.SpinnerService.hide();
          this.assetListpage = false
        }
        if (this.assetList.length >= 0) {
          this.SpinnerService.hide();
          this.has_nextassetList = datapagination.has_next;
          this.has_previousassetList = datapagination.has_previous;
          this.presentpageassetList = datapagination.index;
          this.assetListpage = true
        }
        console.log("asset dataaa ", this.assetList)
      },(error) => {
       this.errorHandler.handleError(error);
       this.SpinnerService.hide();
     })
  }
  getGrnAssetdata(pageNumber = 1, pageSize = 10, data) {
   this.SpinnerService.show();
   this.dataService.getGrnAssetdata(pageNumber, pageSize,this.detailsID)
     .subscribe((result) => {
       this.SpinnerService.hide();
       let datas = result['data']
       let datapagination = result["pagination"];
       this.assetList = datas;
       if (this.assetList.length === 0) {
         this.SpinnerService.hide();
         this.assetListpage = false
       }
       if (this.assetList.length >= 0) {
         this.SpinnerService.hide();
         this.has_nextassetList = datapagination.has_next;
         this.has_previousassetList = datapagination.has_previous;
         this.presentpageassetList = datapagination.index;
         this.assetListpage = true
       }
     },(error) => {
       this.errorHandler.handleError(error);
       this.SpinnerService.hide();
     })
   }
   nextClickassetList() {
    if (this.has_nextassetList === true) {   
      this.currentepageassetList = this.presentpageassetList + 1                                                      
      this.getGrnAssetdata(this.presentpageassetList + 1, 10,this.detailsID)
    }                                                                                        
  }
  previousClickassetList() {
    if (this.has_previousassetList === true) {
      this.currentepageassetList = this.presentpageassetList - 1
      this.getGrnAssetdata(this.presentpageassetList - 1, 10,this.detailsID)
    }
  }

  objectKeys = Object.keys;

parseAttributes(attrStr: string): any[] {
  try {
    // Replace single quotes with double quotes to make it JSON valid
    const fixed = attrStr.replace(/'/g, '"');
    return JSON.parse(fixed);
  } catch (e) {
    console.error("Error parsing other_attribute:", attrStr, e);
    return [];
  }
}
}
