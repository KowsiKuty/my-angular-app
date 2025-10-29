import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interintegritymasters',
  templateUrl: './interintegritymasters.component.html',
  styleUrls: ['./interintegritymasters.component.scss']
})
export class InterintegritymastersComponent implements OnInit {

  constructor(private router: Router) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.showTemplate) {
      this.newTemp();
    }
  }
  isaddaccount: boolean;
  isnewtemplate: boolean;
  iscbstemplate : boolean;
  isAction: boolean;

  ngOnInit(): void {
  }

  addAccount()
  {
    this.isaddaccount = true;
    this.isnewtemplate = false;
    this.iscbstemplate = false;
    this.isAction = false;
  }
  newTemp()
  {
    this.isaddaccount = false;
    this.isnewtemplate = true;
    this.iscbstemplate = false;
    this.isAction = false;
  }
  newCbsTemp()
  {
    this.isaddaccount = false;
    this.isnewtemplate = false;
    this.iscbstemplate = true;
    this.isAction = false;
  }

  newAction()
  {
    this.isaddaccount = false;
    this.isnewtemplate = false;
    this.iscbstemplate = false;
    this.isAction = true;
  }

}
