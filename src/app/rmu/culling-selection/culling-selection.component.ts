import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
@Component({
  selector: 'app-culling-selection',
  templateUrl: './culling-selection.component.html',
  styleUrls: ['./culling-selection.component.scss', '../rmustyles.css']
})
export class CullingSelectionComponent implements OnInit {
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  cullingform: FormGroup;
  id: null;
  archivalrequest_id: null;

  availablelist = [];
  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  vendorbarcode: string;
  toboxstatus: any;
  tobarcodetype: any;
  total_count: number;
  occupied_count: number;
  free_count: number;
  archiveddate: any;
  archivallist = []
  fromboxlist = []
  availablecount: number = 0;
  fromboxid: number = null;
  currentvalue: any;
  filelevellists = [];
  filesidarray = [];
  selectedfiles = [];
  limitexceed: boolean;
  fileidarraylength:number = 0;
  constructor(public router: Router, private rmuservice: RmuApiServiceService, private fb: FormBuilder,
    private notification: NotificationService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedroute.queryParams.subscribe(val => {
      this.archivallist = JSON.parse(val.selectedarray);
      this.archivallist.sort((object1, object2) => {
        return object1.free_count > object2.free_count ? -1 : 1
      });

      // this.id = val.id;
      // this.archivalrequest_id = val.archivalrequest_id;
      // this.vendorbarcode = val.barcode_no;
      // this.archiveddate = val.archival_date;
      // this.toboxstatus = JSON.parse(val.box_filled_status);
      // this.tobarcodetype = JSON.parse(val.barcode_type);
      // this.total_count = val.total_count;
      // this.occupied_count = val.occupied_count;
      // this.free_count = val.free_count;
    })
    this.cullingform = this.fb.group({
      to_box: this.archivallist[0],
    })
    this.changefromlist();

    // this.getcommondropdowns()
    
    console.log(this.fileidarraylength);
  }

  changefromlist() {
    this.currentvalue = this.cullingform.value.to_box;
    this.fromboxlist = this.archivallist.filter(element => {
      return element.id != this.currentvalue.id;
    });
    this.checkavailablecount();
  }

  checkavailablecount() {
    let totalcount: number = 0;
    this.availablecount = this.currentvalue.free_count;
    this.fromboxlist.forEach(element => {
      element.isselected ? totalcount += element.occupied_count : 0;
    });
    this.availablecount -= totalcount;
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getfilesummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getfilesummary()
  }
  getfilesummary() {
    this.rmuservice.getcullingfilelevel(this.fromboxid, this.pagination.index).subscribe(results => {
      if(!results){
        return false;
      }
      this.filelevellists = results.data;
      let array = [... new Set(this.filesidarray)];
      this.selectedfiles = array;
      this.filelevellists.forEach(element => {
        if (this.filesidarray.includes(element.id)) {
          element.isselected = true;
        }
      });
      this.checklimit()
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }
  check(val) {

    console.log(val);

  }

  isfileselected(data) {
    if (data.isselected) {
      this.selectedfiles.push(data.id)
    }
    else {
      this.selectedfiles.filter((element, index) => {
        if (element == data.id) {
          this.selectedfiles.splice(index, 1)
        }
      });
      // this.filesidarray.filter((element, index) => {
      //   element == data.id ? this.filesidarray.splice(index, 1) : false;
      // });
    }
    this.checklimit();
  }

  checklimit() {
    this.availablecount == this.selectedfiles.length ? this.limitexceed = true : this.limitexceed = false;
    this.limitexceed ? this.notification.showWarning('The Available limit in the box is exceed..') : false;
  }

  pushfileids() {
    this.filelevellists.forEach(element => {
      if (element.isselected) {
      }
      else {
        this.filesidarray.forEach((data, index) => {
          if (data == element.id) {
            this.filesidarray.splice(index, 1)
          }
        })
      }
    });
    this.filesidarray = this.filesidarray.concat(this.selectedfiles);
    
    //this.filesidarray may conatin duplicate values because of frequesnt push
    this.filesidarray = [... new Set(this.filesidarray)];
    this.fileidarraylength = this.filesidarray.length;
    
  }

  emptyselectarray() {
    this.selectedfiles = []
  }

  startculling(){
    let id = this.currentvalue.id;
    var payload = [{
      to_box:id,
      archived_details_id:this.filesidarray,
    }]
    this.rmuservice.startculling(payload).subscribe();
    this.closeretrivalpopup.nativeElement.click()
    console.log(payload)
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("finalpreview"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


  close(){
    this.closeretrivalpopup.nativeElement.click()
  }
}
