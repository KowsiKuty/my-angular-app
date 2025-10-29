import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-assetclub-add',
  templateUrl: './assetclub-add.component.html',
  styleUrls: ['./assetclub-add.component.scss']
})
export class AssetclubAddComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  assetcatlist: Array<any>


  has_next = true;
  has_previous = true;
  isvalmakeradd: boolean;
  ismakerCheckerButton: boolean;
  ischeckse: boolean;
  // ischecks:boolean;

  isparent: boolean
  ischild: boolean
  // has_nexti = true;
  // has_previousimp = true;
  presentpage: number = 1;

  checkedValues: boolean[]



  pageSize = 10;

  constructor(private spinner:NgxSpinnerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, ) { }

  ngOnInit(): void {
    this.getassetcategorysummary();

  }


  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        this.checkedValues = this.assetcatlist.map(() => false);
        console.log("landlord", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }

      })

  }



  //  checkBtn() {
  //   this.ischeck = !this.ischeck;
  // }

  parent() {
    this.isparent = true
    this.ischild = false
    // this.ischeckse=false

  }


  child() {
    this.ischild = true
    this.isparent = false
    // this.ischecks=false

  }

  get ischecks() {
    return this.checkedValues.some(b => b);
  }


  // get ischeckse() {
  //   return this.checkedValues.some(c => c);
  // }






  nextClick() {

    if (this.has_next === true) {

      this.getassetcategorysummary(this.presentpage + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previous === true) {

      this.getassetcategorysummary(this.presentpage - 1, 10)

    }
  }


  trade = [
    { label: ' Check', selected: false },

  ];

  allTrades(event) {
    const checked = event.target.checked;
    this.trade.forEach(item => item.selected = checked);
  }





}
