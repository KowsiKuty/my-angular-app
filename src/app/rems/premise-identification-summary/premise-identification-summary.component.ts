import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'
// import { Rems2Service } from '../rems2.service'
import { RemsService } from '../rems.service';

import { Router } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { SharedService } from '../../service/shared.service'
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange
@Component({
  selector: 'app-premise-identification-summary',
  templateUrl: './premise-identification-summary.component.html',
  styleUrls: ['./premise-identification-summary.component.scss']
})
export class PremiseIdentificationSummaryComponent implements OnInit {
  previousIdentification = true;
  isIdentification = true;
  currentIdentification: number = 1;
  presentIdentification: number = 1;
  identificationSize = 10;
  nextIdentification = true;
  identificationData: any;
  PremiseIdentificationdrop: any;
  iMasterList: any;
  // ismakercheckerButton:boolean=true
  textbox: boolean = false
  premisedropList: any
  isLoading = false;
  expression = false
  // PremiseIdentificationdrop=[{'id': 1, 'name': 'Draft'},{'id': 3, 'name': 'Pending checker'},{'id': 5, 'name': 'Approved'},{'id': 0, 'name': 'Rejected'}]

  premisesIdentificationSearch: FormGroup;
  constructor(private remsService: Rems2Service, private router: Router,
    private notification: NotificationService, private fb: FormBuilder,
    private shareService: RemsShareService, private sharedService: SharedService, private remsservice: RemsService,) { }

  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData;
    this.expression = true
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "REMS") {
        this.iMasterList = subModule;
      }
      if (element.role[0].name === "Checker") {
        // this.ismakercheckerButton=false
        // console.log('Checker', element.role.name)
      }
    });
    this.premisesIdentificationSearch = this.fb.group({
      name: [''],
      code: [''],
      status:[''],
    })
    this.getPremiseIdentificationdrop();
    this.premisedrop();
    if(this.expression == true){
      this.identificationSearch()
    }
  }
  listdrop: any
  private getPremiseIdentificationdrop() {
    this.remsService.getpremiseidentificationdrop()
      .subscribe((results: any) => {
        let datas = results['data']
        this.PremiseIdentificationdrop = datas;
      })
  }

  statusId: number = 1
  onpremiseChange(e: number = 1) {
    this.statusId = e
    this.getPremiseIdentification()


  }
  comment() {
    this.textbox = true;
  }
  // statusId: number;
  private premisedrop() {
    this.remsservice.getpremiseidentificationdrop()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premisedropList = datas;
        // console.log("this.premisedropList",this.premisedropList);
        if (this.premisedropList.length !== 0){
        this.statusId = this.premisedropList[0].id;}
        this.getPremiseIdentification();
      })
  }

  getPremiseIdentification(pageNumber = 1) {
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.role;
      if (element.name === "REMS") {
        this.iMasterList = subModule;
      }
    });
    this.remsService.getPremiseIdentification(this.statusId, pageNumber)
      .subscribe(result => {
        let data = result.data;
        // console.log("getPremiseIdentification-result",result);
        // console.log("getPremiseIdentification-data",data);
        this.identificationData = data;
        let datapagination = result.pagination;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isIdentification = false;
        } else if (this.identificationData.length == 0) {
          this.isIdentification = false;
        } else if (this.identificationData.length > 0) {
          this.nextIdentification = datapagination.has_next;
          this.previousIdentification = datapagination.has_previous;
          this.presentIdentification = datapagination.index;
          this.isIdentification = true;
        }
      })
  }



  identificationNext() {
    if (this.nextIdentification === true) {
      this.getPremiseIdentification(this.presentIdentification + 1)
    }
  }

  identificatinPrevious() {
    if (this.previousIdentification === true) {
      this.getPremiseIdentification(this.presentIdentification - 1)
    }
  }

  addIdentificationForm() {
    this.shareService.identificationForm.next('');
    this.router.navigate(['/rems/identificationForm'], { skipLocationChange: isSkipLocationChange });
  }

  identificationEdit(data) {
    this.shareService.identificationForm.next(data);
    this.router.navigate(['/rems/identificationForm'], { skipLocationChange: isSkipLocationChange });

  }

  identificationDelete(id) {
    this.remsService.identificationDelete(id)
      .subscribe(result => {
        this.notification.showSuccess("Deleted....")
        this.getPremiseIdentification();
      })
  }
  premiseIDView(id) {
    // let datas = this.sharedService.menuUrlData;
    // datas.forEach((element) => {
    //   let subModule = element.submodule;
    //   if (element.name === "REMS") {
    //     this.iMasterList = subModule;


    //   }
    //   if (element.role[0].name === "Maker"){

    //     this.shareService.premiseIdView.next(id);
    //     this.router.navigate(['/premiseIDview'], { skipLocationChange: true });

    //   }
    //   if (element.role[0].name === "Checker"){
    //     this.shareService.premiseIdView.next(id);
    //     this.router.navigate(['/premisedocinfo'], { skipLocationChange: true });

    //   }

    // });
    this.shareService.premiseIdView.next(id);
    this.router.navigate(['/rems/premiseIDview'], { skipLocationChange: isSkipLocationChange });



  }

  identificationSearch() {
    let search = this.premisesIdentificationSearch.value;

    this.remsService.getIdentificationSearch(search)
      .subscribe(result => {
        this.identificationData = result['data']
      })
  }

  reset() {
    this.getPremiseIdentification();
    this.premisesIdentificationSearch.controls['code'].reset()
    this.premisesIdentificationSearch.controls['status'].reset()
    this.premisesIdentificationSearch.controls['name'].reset()
  }


  dropdownsubmit() {

  }



}
