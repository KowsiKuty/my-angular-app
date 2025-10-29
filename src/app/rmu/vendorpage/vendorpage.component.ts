import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vendorpage',
  templateUrl: './vendorpage.component.html',
  styleUrls: ['./vendorpage.component.scss']
})
export class VendorpageComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  go_to_vr(){
    this.router.navigate(['rmu/vendor-retrieval-summary'],{})
  }
  vendorarchival()
  {
    this.router.navigate(['rmu/vendorarchival'],{}); 
  }
  destroyVendor(){
    this.router.navigate(['rmu/destroy-vendor'],{});
  }
}
