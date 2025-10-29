import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads-details',
  templateUrl: './leads-details.component.html',
  styleUrls: ['./leads-details.component.scss']
})
export class LeadsDetailsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  gotoDatapage()
  {
    this.router.navigate(['crm/leadstable'])
  }

}
