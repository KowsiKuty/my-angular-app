import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
export interface Objdatas {
  code: any
  name: any
}
@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.scss'], 
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI]
})
export class ProductSummaryComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute, 
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master,
    private notify: imp.ToastrService, private productapi: imp.ProductAPI) { }

  productSummarySearch: FormGroup;

  ngOnInit(): void {
    this.productSummarySearch = this.fb.group({
      codename: '',
      category_id: '', 
      subcategory_id: ''
    })
    this.activatedRoute.paramMap.subscribe((params: ParamMap)=>{
      let SummaryCall: any = params.get('data')
      console.log("summary call",SummaryCall)
      this.ProductSearch('');
      // if( SummaryCall == 'Summary'){ 
        
      // } 
    })

  }
 

  ProductObjects = {
    has_nextProduct: false,
    has_previousProduct: false,
    presentpageProduct: 1,
    ProductList: '',
    categoryList: '',
    subcategoryList: ''

  }


  serviceCallProductSummaryget(search, pageno) {
    this.service.ApiCall('get', this.productapi.ProductsAPI.product+this.productapi.queries.action+'summary&page='+pageno+"&", search )
      .subscribe(result => {
        this.spin.hide()
        this.log.logging("Product Summary", result)
        let page = result['pagination']
        this.ProductObjects.ProductList = result['data']
        if (this.ProductObjects.ProductList?.length > 0) {
          this.ProductObjects.has_nextProduct = page.has_next;
          this.ProductObjects.has_previousProduct = page.has_previous;
          this.ProductObjects.presentpageProduct = page.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  ProductSearch(hint: any) {
    let search = this.productSummarySearch.value; 
    let obj = {
      name: search?.codename,
      category: search?.category_id?.id,
      subcategory:search?.subcategory_id?.id
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallProductSummaryget(obj, this.ProductObjects.presentpageProduct + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallProductSummaryget(obj, this.ProductObjects.presentpageProduct - 1)
    }
    else {
      this.serviceCallProductSummaryget(obj, 1)
    }

  }

  resetProduct() {
    this.productSummarySearch.reset('')
    this.ProductSearch('')
  }

  AddProduct(){
    // this.route.navigateByUrl['productadd']
    this.route.navigate(['crm/productadd'])
  }

  




  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  catDD(typeddata) {
    // this.spin.show();
    // this.service.commoditysearch(data, 1)
    this.service.ApiCall("get", this.master.masters.category + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.ProductObjects.categoryList = datas;
        // this.spin.hide();
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFncat(cat?: Objdatas): string | undefined {
    return cat ? cat.name : undefined;
  }


  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatInput') subcatInput: any;

  subcatDD(typeddata, catdata) {
    // this.spin.show();
    // this.service.commoditysearch(data, 1)
    if(catdata == "" || catdata == null || catdata == undefined){ 
      this.notify.warning("Please Check Category")
      return false 
    }
    this.service.ApiCall("get", this.master.masters.subcategory+typeddata+"&"+this.master.subQuerys.category+"="+catdata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.ProductObjects.subcategoryList = datas;
        // this.spin.hide();
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnsubcat(subcat?: Objdatas): string | undefined {
    return subcat ? subcat.name : undefined;
  }




  productView(data){ 
    console.log(data) 
  
    this.route.navigate(['crm/productview', data?.id], { skipLocationChange: true }) 



  }












}
