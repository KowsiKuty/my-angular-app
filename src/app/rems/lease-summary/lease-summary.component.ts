import { Component, OnInit } from '@angular/core';
import {RemsService} from '../rems.service';
import {NotificationService} from '../../service/notification.service'

@Component({
  selector: 'app-lease-summary',
  templateUrl: './lease-summary.component.html',
  styleUrls: ['./lease-summary.component.scss']
})
export class LeaseSummaryComponent implements OnInit {
  getLeaseList:Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage:number = 1;
  pageSize = 10;
  constructor(private remsservice :RemsService,
    private notification:NotificationService) { }

  ngOnInit(): void {
    this.getleasesummary(); 
  }
  getleasesummary(pageNumber = 1,pageSize = 10){
    this.remsservice.getleasesummary (pageNumber,pageSize)
    .subscribe((result)=> {
      console.log("lease",result)
      let datass =result['data'];
      let datapagination = result["pagination"];
      this.getLeaseList =datass;
      console.log("lease",this.getLeaseList)
      if (this.getLeaseList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
   
    }
   
    deleteleasesum(data){
        let value = data.id
        console.log("deleteleasesum", value)
        this.remsservice.deleteleaseform(value)
        .subscribe(result =>  {
         this.notification.showSuccess("Successfully deleted....")
         this.getleasesummary();
         return true
        
    
        })
      
      }

      nextClick () {
      
        if (this.has_next === true) {
          this.currentpage= this.presentpage + 1
          this.getleasesummary(this.presentpage + 1,10)
        
        }
        }
        
    previousClick() {
    
        if (this.has_previous === true) {
          this.currentpage= this.presentpage - 1
          this.getleasesummary(this.presentpage - 1,10)
          
        }
        }
    

// nextClicklease () {
//     if (this.has_next === true) {
//       this.currentpage= this.presentpage + 1
//       this.getleasesummary(this.presentpage + 1,10)
      
    
//     }
//     }
    
// previousClicklease() {
//     if (this.has_previous === true) {
//       this.currentpage= this.presentpage - 1
//       this.getleasesummary(this.presentpage - 1,10)
   
//     }
//     }
    

  
}
