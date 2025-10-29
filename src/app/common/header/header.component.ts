import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  TeamMembersSummary : any[];
  TeamMembers = [];

  ngOnInit() {
  this.TeamMembersSummary = [
    { Region: "Master", TeamMembersCount: 20, TemporarilyUnavailableMembers: 4 },
    { Region: "Transaction", TeamMembersCount: 15, TemporarilyUnavailableMembers: 8 },
    { Region: "Report", TeamMembersCount: 17, TemporarilyUnavailableMembers: 1 },
    
  ];


  this.TeamMembers = [
    {
      Region: "Master", Members: [
        { ID: 1, Name: "Master1", Status: "/contact" },
        { ID: 2, Name: "Master2", Status: "/about" },
        { ID: 3, Name: "Master3", Status: "/contact" },
        { ID: 4, Name: "Master4", Status: "/about" }
      ]
    },
    {
      Region: "Transaction", Members: [
        { ID: 5, Name: "Memo Summary", Status: "/memosummary" },
        { ID: 6, Name: "Create Memo", Status: "/memocreate" }
      ]
    },
    {
      Region: "Report", Members: [
        { ID: 1, Name: "Report1", Status: "/contact" },
        { ID: 2, Name: "Report2", Status: "/about" },
        { ID: 3, Name: "Report3", Status: "/contact" },
        { ID: 4, Name: "Report4", Status: "/about" }
      ]
    }
  ];
}
}
