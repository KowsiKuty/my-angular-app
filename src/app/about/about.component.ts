import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import { DataService } from '../service/data.service'
import { SharedService } from '../service/shared.service'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private dataService: DataService, public sharedService: SharedService, private router: Router) { }
  ngOnInit() {
    let currentUrl = window.location.href;
    let tmpVar = currentUrl.includes('/kvb');
    if (currentUrl.includes('/kvb')) {
      window.onpopstate = function (event) {
        history.go(1);
      }
    }

    this.getMenuUrl()
  }


  private getMenuUrl() {
    // console.log('getMenuUrl1')
    this.sharedService.menuUrlData = [];
    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        let data = results['data'];
        if (data) {
          this.sharedService.titleUrl = data[0].url;
          this.sharedService.menuUrlData = data;
          // console.log("this.sharedService.isSideNav2",this.sharedService.isSideNav);
          // this.menurlList = this.sharedService.menuUrlData;
          // this.titleUrls = this.sharedService.titleUrl;
          //this.router.navigateByUrl(this.titleUrls, { skipLocationChange: false });
          this.sharedService.transactionList= [];
          this.sharedService.masterList= [];
          this.sharedService.menuUrlData.forEach(element => {
            if (element.type === "transaction") {
              this.sharedService.transactionList.push(element);
            } else if (element.type === "master") {
              this.sharedService.masterList.push(element);
            }
          })
          this.openNav();
          // console.log("this.sharedService.masterList", this.sharedService.masterList);
          // console.log("this.sharedService.transactionList", this.sharedService.transactionList);
     
        }
      });
  }

  openNav() {
    if (this.sharedService.isSideNav) {
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "12rem";
      this.sharedService.isSideNav = false;
    }
  }
}