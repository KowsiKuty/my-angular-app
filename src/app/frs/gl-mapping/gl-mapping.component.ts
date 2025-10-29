import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FrsServiceService } from '../frs-service.service';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

export interface gl_map {
  payment: string;
  name: string;
  code: string;
  glno: number;
  transactions: string;
  microcccode: string;
  gl_name:string;
  no:number;
  description:string;
}

@Component({
  selector: 'app-gl-mapping',
  templateUrl: './gl-mapping.component.html',
  styleUrls: ['./gl-mapping.component.scss']
})
export class GlMappingComponent implements OnInit {
  frs_URL=environment.apiURL
  isLoading: boolean;
  creditgl_list: any;
  hascred_next: boolean;
  hascred_previous: boolean;
  currentpagecred: number;
  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;  
  @ViewChild("creditgls") creditgls: MatAutocomplete;
  @ViewChild("credit_gls") credit_gls: MatAutocomplete;
  @ViewChild("gl_creditgls") gl_creditgls: MatAutocomplete;
  @ViewChild("gl_credit_gls") gl_credit_gls: MatAutocomplete;
  @ViewChild('credit_data') credit_data: any;
  @ViewChild('credits_data') credits_data: any;
  @ViewChild('gl_credits_data') gl_credits_data:any;
  @ViewChild('gl_credit_data') gl_credit_data: any;
  @ViewChild('closebutton') closebutton:any;

  payments_list: any;
  payment_list: any;
  explevel_id: string;
  has_next_sum: any;
  has_previous_sum: any;
  presentpage_sum: any;
  isSummaryPagination: boolean;
  gl_grpmapping: any;
  array_hide: boolean;
  currentpage: number;
  gl_mapping_hide:boolean=true;
  revers_master:boolean=false;
  explevels_id: string;
  creditgls_list: any;
  gl_creditgls_list: any;
  gl_creditgl_list: any;
  subcat_id: any;
  mapping_list: { id: number; name: string; }[];
  constructor(private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private frsService: FrsServiceService) { }
    gl_mapping:FormGroup;
    create_gl_mapping:FormGroup;
  ngOnInit(): void {
    this.gl_mapping = this.fb.group({
      creditGL: [""],
      payment: [""],
      sub_creditGL:[""],
      Status:[""]
    });
    this.create_gl_mapping=this.fb.group({
      creditGL: [""],
      payment: [""],
      sub_creditGL:[""]
    })
    this.mapping_summary("")
  }
 
  mapp_row(){
    let exp=new FormGroup({
      exp_id:new FormControl(''),
      exp_code:new FormControl(''),
      pay_name:new FormControl(''),
      gl_name:new FormControl(''),
      isEditable: new FormControl(false),
    }) 
    return exp;
  }

  public payment_display(payment_name?: gl_map): string | undefined {
    return payment_name ? payment_name.name : undefined;
  }
  public payments_display(payment_name?: gl_map): string | undefined {
    return payment_name ? payment_name.name : undefined;
  }
  public creditgl_display(creditgl?: gl_map): string | undefined {
    return creditgl ? creditgl.glno + "-" + creditgl.name : undefined;
  }
  public creditgls_display(creditgl?: gl_map): string | undefined {
    return creditgl ? creditgl.no + "-" + creditgl.description : undefined;
  }
  public gl_creditgl_display(creditgl?: gl_map): string | undefined {
    return creditgl ? creditgl.glno + "-" + creditgl.name : undefined;
  }
  public gl_creditgls_display(creditgl?: gl_map): string | undefined {
    return creditgl ? creditgl.no + "-" + creditgl.description : undefined;
  }



  payment_type() {
    this.spinnerService.show();
    this.frsService.get_payment_type().subscribe((results) => {
      let data = results["data"];
      this.spinnerService.hide();
      this.payment_list = data;
    });
  }

  payments_type() {
    this.spinnerService.show();
    this.frsService.get_payment_type().subscribe((results) => {
      let data = results["data"];
      this.spinnerService.hide();
      this.payments_list = data;
    });
  }


  Creditgl() {
    this.spinnerService.show();
    this.frsService
      .Subcat_api(this.credit_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.creditgl_list = datas;        
      });

  }

  creditgl_datasscroll() {
    this.hascred_next = true;
    this.hascred_previous = true;
    this.currentpagecred = 1;
    setTimeout(() => {
      if (
        this.creditgls &&
        this.autocompleteTrigger &&
        this.creditgls.panel
      ) {
        fromEvent(this.creditgls.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.creditgls.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =this.creditgls.panel.nativeElement.scrollTop;
            const scrollHeight =this.creditgls.panel.nativeElement.scrollHeight;
            const elementHeight =this.creditgls.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hascred_next === true) {
                this.frsService
                  .Subcat_api(
                    this.credit_data.nativeElement.value,
                    this.currentpagecred + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.creditgl_list = this.creditgl_list.concat(datas);
                    if (this.creditgl_list.length >= 0) {
                      this.hascred_next = datapagination.has_next;
                      this.hascred_previous = datapagination.has_previous;
                      this.currentpagecred = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  Credits_gl() {
    this.spinnerService.show();
    this.frsService
      .Credit_gl_mapping(this.credits_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.creditgls_list = datas;        
      });

  }

  creditgls_datasscroll() {
    this.hascred_next = true;
    this.hascred_previous = true;
    this.currentpagecred = 1;
    setTimeout(() => {
      if (
        this.credit_gls &&
        this.autocompleteTrigger &&
        this.credit_gls.panel
      ) {
        fromEvent(this.credit_gls.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.credit_gls.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =this.credit_gls.panel.nativeElement.scrollTop;
            const scrollHeight =this.credit_gls.panel.nativeElement.scrollHeight;
            const elementHeight =this.credit_gls.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hascred_next === true) {
                this.frsService
                  .Credit_gl_mapping(
                    this.credits_data.nativeElement.value,
                    this.currentpagecred + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.creditgls_list = this.creditgls_list.concat(datas);
                    if (this.creditgls_list.length >= 0) {
                      this.hascred_next = datapagination.has_next;
                      this.hascred_previous = datapagination.has_previous;
                      this.currentpagecred = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  ////GL DD////

  GL_Creditgl() {
    this.spinnerService.show();
    this.frsService
      .Subcat_api(this.gl_credit_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.gl_creditgl_list = datas;        
      });

  }

  GL_creditgl_datasscroll() {
    this.hascred_next = true;
    this.hascred_previous = true;
    this.currentpagecred = 1;
    setTimeout(() => {
      if (
        this.gl_creditgls &&
        this.autocompleteTrigger &&
        this.gl_creditgls.panel
      ) {
        fromEvent(this.gl_creditgls.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.gl_creditgls.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =this.gl_creditgls.panel.nativeElement.scrollTop;
            const scrollHeight =this.gl_creditgls.panel.nativeElement.scrollHeight;
            const elementHeight =this.gl_creditgls.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hascred_next === true) {
                this.frsService
                  .Subcat_api(
                    this.gl_credit_data.nativeElement.value,
                    this.currentpagecred + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.gl_creditgl_list = this.gl_creditgl_list.concat(datas);
                    if (this.gl_creditgl_list.length >= 0) {
                      this.hascred_next = datapagination.has_next;
                      this.hascred_previous = datapagination.has_previous;
                      this.currentpagecred = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  GL_Credits_gl() {
    this.spinnerService.show();
    this.frsService
      .Credit_gl_mapping(this.gl_credits_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.gl_creditgls_list = datas;        
      });

  }

  GL_creditgls_datasscroll() {
    this.hascred_next = true;
    this.hascred_previous = true;
    this.currentpagecred = 1;
    setTimeout(() => {
      if (
        this.gl_credit_gls &&
        this.autocompleteTrigger &&
        this.gl_credit_gls.panel
      ) {
        fromEvent(this.gl_credit_gls.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.gl_credit_gls.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =this.gl_credit_gls.panel.nativeElement.scrollTop;
            const scrollHeight =this.gl_credit_gls.panel.nativeElement.scrollHeight;
            const elementHeight =this.gl_credit_gls.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hascred_next === true) {
                this.frsService
                  .Credit_gl_mapping(
                    this.gl_credits_data.nativeElement.value,
                    this.currentpagecred + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.gl_creditgls_list = this.gl_creditgls_list.concat(datas);
                    if (this.gl_creditgls_list.length >= 0) {
                      this.hascred_next = datapagination.has_next;
                      this.hascred_previous = datapagination.has_previous;
                      this.currentpagecred = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  mapping_summary(explevelid,page=1){
  let subcat=this.gl_mapping.value.sub_creditGL?.id??""  
  let gl_id=this.gl_mapping.value.creditGL?.id??""  
  let payment_type=this.gl_mapping.value.payment?.id??""  
  // let mapp_type =this.gl_mapping.value.Status?.id??1  
    
    console.log("subcat,gl_id,payment_type,mapp_type",subcat,gl_id,payment_type)
    this.spinnerService.show()
    this.frsService.gl_mapping_summary(subcat,gl_id,payment_type,page).subscribe(expsummary=>{
    this.spinnerService.hide()
        let data=expsummary['data']
      // let data=[]
      console.log("data=>",data) 
     
      
      if(data.length!=0){
        this.array_hide=false;
        this.gl_grpmapping=data
        let dataPagination = expsummary['pagination'];
        console.log("dataPagination=>",dataPagination)
        this.has_next_sum = dataPagination.has_next;
        this.has_previous_sum = dataPagination.has_previous;
        this.presentpage_sum = dataPagination.index;
        this.isSummaryPagination = true;
       
      }
      else{
        this.toastr.warning("","No Data Found" ,{timeOut:1200})
        this.array_hide=true
        this.has_next_sum = false;
        this.has_previous_sum = false;
        this.presentpage_sum = 1;
        this.gl_grpmapping=[]
      }
    })
  
  console.log("this.dghdbfg",this.gl_grpmapping)
   }
   previousClick(){
    if (this.has_previous_sum === true) {         
      this.currentpage = this.presentpage_sum - 1
      this.mapping_summary(this.explevel_id,this.presentpage_sum - 1)
    }
  }
  nextClick(){
    if (this.has_next_sum === true) {         
      this.currentpage = this.presentpage_sum + 1
      this.mapping_summary(this.explevel_id,this.presentpage_sum + 1)
    }
  }

  

  gl_mapping_clear(){
    let val=''
    this.gl_mapping.controls['creditGL'].reset('')
    this.gl_mapping.controls['payment'].reset('')
    this.gl_mapping.controls['sub_creditGL'].reset('')
    this.gl_mapping.controls['Status'].reset('')
    this.mapping_summary(val) 
  }
 

  back_master(){
    this.revers_master=true;
    this.gl_mapping_hide=false;
  }

    editDatas(data,ind){
      this.popupopen()
      console.log("databjjdgeditndfg",data,ind)
      this.subcat_id=data?.subcat?.id
      this.create_gl_mapping.patchValue({
        creditGL:data.gl?data.gl:"",
      payment: data.doc_type,
      sub_creditGL:data.subcat
      })

      console.log("creahsvfh",this.create_gl_mapping)
    }

    submit(data){
      console.log("databjjdgndfg",data)
      if(typeof this.create_gl_mapping.value.sub_creditGL!='object'){
        this.toastr.warning('', 'Please Select SubCat', { timeOut: 1500 });
        return false;
      } 
      if(typeof this.create_gl_mapping.value.creditGL!='object'){
        this.toastr.warning('', 'Please Select GL', { timeOut: 1500 });
        return false;
      } 
      if(typeof this.create_gl_mapping.value.payment!='object'){
        this.toastr.warning('', 'Please Select Payment Type', { timeOut: 1500 });
        return false;
      }  
      if(this.create_gl_mapping.value.sub_creditGL?.id==null || this.create_gl_mapping.value.sub_creditGL?.id==undefined){
        this.toastr.warning('', 'Please Select SubCat', { timeOut: 1500 });
        return false;
      } 
      if(this.create_gl_mapping.value.creditGL?.id==null || this.create_gl_mapping.value.creditGL?.id==undefined){
        this.toastr.warning('', 'Please Select GL', { timeOut: 1500 });
        return false;
      } 
      if(this.create_gl_mapping.value.payment?.id==="NOT FOUND"){
        this.toastr.warning('', 'Please Select Payment Type', { timeOut: 1500 });
        return false;
      } 
      let expmapping_parm=this.create_gl_mapping.value.payment?.id??""
      let id=this.create_gl_mapping.value.sub_creditGL?.id??this.subcat_id
      let gl_id=this.create_gl_mapping.value.creditGL?.id??""
     
       
       this.spinnerService.show();
          let val=''
      this.frsService.gl_mapping_update(expmapping_parm,id,gl_id)
        .subscribe((results: any) => {
    
       this.spinnerService.hide();
        if (results.status=="SUCCESS") {
            this.toastr.success("",results.message,{timeOut:1500}); 
          this.gl_mapping_clear()
          this.mapping_summary(val) 
          this.closebutton.nativeElement.click()
        }else{
          this.toastr.success("",results.message,{timeOut:1500});
        }
      }, error => {
        this.spinnerService.hide();
      })
          
    
  }

  add_fun(){
    this.create_gl_mapping.controls['payment'].reset('')
    this.create_gl_mapping.controls['sub_creditGL'].reset('')
    this.create_gl_mapping.controls['creditGL'].reset('')
    this.popupopen()
  }


   mapp_function(){
    this.mapping_list=[{id:1,name:"Mapped"},
      {id:0,name:"Un-Mapped"}]
   }

   popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("gl_mapping"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


}
