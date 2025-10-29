import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router'; 
import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'], 
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI, imp.Files]
})
export class ProductViewComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService,private templateApi:MasterApiServiceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute, 
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master,
    private notify: imp.ToastrService, private productapi: imp.ProductAPI, private filesAPI: imp.Files) { } 

    ProductViewObject: any = {
      "ProductId" : 0,
      "productView": '',
      "fileDataSRC": '', 
      "AdditionalInfoDatakey": ''
    }

  ngOnInit(): void {



    this.activatedRoute.paramMap.subscribe((params: ParamMap)=>{
      let Call: any = params.get('data')
      this.templateApi.productID = Call;
      this.log.logging("Product View Call Data", Call)

      this.getProductView(Call)
      

      
       
    })
  }



  async getProductView(Call){ 
    // this.service.ApiCall("get", this.productapi.ProductsAPI.product+this.productapi.queries.action+"fetch"+this.productapi.queries.id+Call )
    //   .subscribe(results =>{
    //     this.ProductViewObject.productView = results 
    //   })
    let data: any  =  await this.service.ApiCall("get", this.productapi.ProductsAPI.product+this.productapi.queries.action+"fetch"+this.productapi.queries.id+Call ).toPromise()
    this.ProductViewObject.productView = data 
    
    this.ProductViewObject.AdditionalInfoDatakey = Object.keys(data?.additional_info) 

    // let filedata = await this.service.ApiCall("getFile", this.master.files.files + data?.logo)
    // this.ProductViewObject.fileDataSRC = filedata 

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 

    this.ProductViewObject.fileDataSRC =await (imp.env.apiURL + "docserv/file_view/" + data?.logo +"?entity_id=1&token=" + token)


    this.log.logging("Product view Data", this.ProductViewObject.productView, this.ProductViewObject.fileDataSRC, this.ProductViewObject.AdditionalInfoDatakey )

  }

  ProductSummaryBack(){
    this.route.navigate(['crm/crm', 'summary']);
  }












































}
