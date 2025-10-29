import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  ispremiseown:boolean

  constructor() { }

  ngOnInit(): void {
  }
  premiseown(){
    this.ispremiseown=true;






  }

}
