import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
export interface subcatListss {
  name: string;
  id: number;
}

export interface BRANCH {
  name: string;
  id: string;
  
}
export interface product{
  code:string,
  id:string,
  name:string
}
export interface labeltype{
  type:string,
  id:string
 
}
@Component({
  selector: 'app-fa-master',
  templateUrl: './fa-master.component.html',
  styleUrls: ['./fa-master.component.scss']
})
export class FaMasterComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('childdataciew') myTemplate: TemplateRef<any>;
  assetcatlist: Array<any>
  list: string[] = [];

  assetloclist: Array<any>
  subcatList: Array<subcatListss>;
  a: Array<any>

  subcategorys = new FormControl();
  SubcatSearchForm: FormGroup;
  updateForm:FormGroup;
  // depype="";
  locationdata=false
  // aa:boolean=false;
  has_next = true;
  has_previous = true;
  isassetcategory: boolean
  isassetcategoryEditForm: boolean
  isassetcategorys: boolean;
  ismakemodelsumary:boolean=false;
  ismakemodel:boolean=false;
  isspecification:boolean=false;
  isspecificationsummary:boolean=false;
  isspecificationdata:Array<any>=[];
  hasspec_sum_next:boolean=false;
  hasspec_sum_pre:boolean=false;
  hasspec_sum_page:number=1;
  isDepsetting: boolean;
  matDialogDate:Array<any>=[];
  matDialogparentData:any={};
  matDialogindex:number=0;
  makermodelform:any=FormGroup;
  specificationform:any=FormGroup;

  ismakerCheckerButton: boolean;

  productlist :Array<any>=[];
  productlistsummary:Array<any>=[];
  has_nextpro :boolean=false;
  has_previouspro :boolean=false;
  presentpagepro:number = 1;
  parent_enb:boolean=false;
  child_enb:boolean=false;
  maker_enb_list:Array<any>=[];
  has_nextasset = true;
  labelnamelist:Array<any>=[];
  specificationsummary:Array<any>=[];
  has_previousasset = true;
  // currentpage: number = 1;
  presentpageasset: number = 1;
  isassetlocation: boolean;
  
  // isDepsetting:boolean
  // ismakerCheckerButton:boolean;
  has_nextloc = true;
  makermodelformsummary:any=FormGroup;
  modelsummary:Array<any>=[];
  hasmodel_sum_next:boolean=false;
  hasmodel_sum_pre:boolean=false;
  hasmodel_sum_page:number=1;

  makermodelformsummary_array:any=FormGroup;
  specificationformsummary:any=FormGroup;
  specificationform_fa_new:any=FormGroup;
  makermodelformchild:any=FormGroup;
  child_dataproduct_code:any;
  child_dataproduct_name:any;
  child_daatparent_id:any;
  has_previousloc = true;
  presentpageloc: number = 1;
  pageSize = 10;
  depform: FormGroup
  assetlocationform: FormGroup
  deptypelist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  deptypeslist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  branchdata: any;
  myControl = new FormControl();
  childhierarchy_flag:any;
  data2: any;
  makeModelList_new:Array<any>=[];
  fa_makemodel_new_form:any=FormGroup;
  constructor(private dialog: MatDialog,private spinner:NgxSpinnerService,private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private FaShareService: faShareService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.depform = this.fb.group({
      doctype: ['', Validators.required],
      depgl: ['', Validators.required],

      depreservegl: ['', Validators.required],

    });
    this.makermodelform=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false
        })
      ])

    });
    this.specificationform_fa_new=this.fb.group({
      "productname":new FormControl(""),
      "key_list":this.fb.array([
        this.fb.group({
          "data":new FormControl(""),
          "main_enb":new FormControl(false),
          "data_value_n":new FormControl(""),
          "values_list":this.fb.array([
            this.fb.group({
              "data_value":new FormControl(""),
              "main_enb":new FormControl(false)
            })
          ])
        })
      ])
    });
    (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
    (this.specificationform_fa_new.get("key_list") as FormArray).clear();
    this.fa_makemodel_new_form=this.fb.group({
      productname:new FormControl(""),
      make_id:new FormControl(0),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "main_enb":new FormControl(false),
      
      "mainArray":this.fb.array([
        this.fb.group({
          
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "model_array":this.fb.array([
            this.fb.group({
              "id":new FormControl(0),
              "main_enb":false,
              "name":new FormControl("")
            })
          ])
        })
      ])

    });
    (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(0) as FormGroup).get('model_array') as FormArray).clear();
    (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
    this.makermodelformchild=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "configuration":new FormControl(""),
      "label_group":new FormControl(""),
      "label_type":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "specification_type":this.fb.array([
            this.fb.group({
              "spec_name":new FormControl("")
            })
          ]),
          "Configuration_type":this.fb.array([
            this.fb.group({
              "config_name":new FormControl("")
            })
          ])
        })
      ]),
      "specification_type":this.fb.array([
        this.fb.group({
          "spec_name":new FormControl("")
        })
      ])

    });
    this.makermodelformsummary=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl("")

    });
    this.makermodelformsummary_array=this.fb.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          
          "subarr":this.fb.array([
            this.fb.group({
              "subproname":new FormControl(""),
              "sublbname":new FormControl(""),
              "sublbtype":new FormControl(""),
              "sub_enb":false
            })
          ]),
          
        })
      ])

    });
    this.makermodelformsummary_array=this.fb.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "lid":new FormControl(""),
          "main_enb":false,
          "subarr":this.fb.array([
            this.fb.group({
              "subproname":new FormControl(""),
              "sublbname":new FormControl(""),
              "sublbtype":new FormControl(""),
              "sub_enb":false
            })
          ])
        })
      ])

    });
    this.makermodelformchild.get("labeltype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.Faservice.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    this.specificationform=this.fb.group({
      'type':new FormControl("")
    });
    this.specificationformsummary=this.fb.group({
      'type':new FormControl(""),
      "productname":new FormControl("")
    });
    this.SubcatSearchForm = this.fb.group({

      subcategorys: "",
      deptype: ""
    })
    this.assetlocationform = this.fb.group({

      reftablegid: ['', Validators.required],
      name: ['', Validators.required],

      floor: ['', Validators.required],
      refgid: ['', Validators.required],
      remarks: ['', Validators.required],
      branch_id:['']



    })


    this.updateForm=this.fb.group({
      depgl_mgmt: ['', Validators.required],
   
      depresgl_mgmt: ['', Validators.required],

    })

   
    
    this.getassetcategorysummary();
    this.getassetlocationsummary();
    let ssubcatkeyvalue: String = "";
    this.getapsubcatsearch(ssubcatkeyvalue);
    this.SubcatSearchForm.get('subcategorys').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.Faservice.getapsubcatsearch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcatList = datas;
        console.log("subcatList", datas)

      });
      this.makermodelform.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });
      this.specificationform_fa_new.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });
      this.fa_makemodel_new_form.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });



      this.specificationformsummary.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });

      this.makermodelformsummary.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.model_fa_list(1, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlistsummary = datas;
      });
      this.makermodelform.get('labelname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.Faservice.asset_specification_get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log(datas);
        this.labelnamelist = datas;
      });
     
  }

  public displayFn(subcattype?: subcatListss): string | undefined {
        return subcattype ? subcattype.name : undefined;
  }

  get subcattype() {
    return this.SubcatSearchForm.get('subcategorys');
  }

  modelsummaryfunction(){
    let dta:any='page='+this.hasmodel_sum_page;
    if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
     dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
    }
    this.Faservice.make_model_fa_summary(dta).subscribe((result:any)=>{
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
      }
      else{
        this.modelsummary=result['data'];
        if(this.modelsummary.length>0){
          this.hasmodel_sum_next=result['pagination'].has_next;
          this.hasmodel_sum_pre=result['pagination'].has_previous;
          this.hasmodel_sum_page=result['pagination'].index;
        }

      }
    });
  }
  modelsummaryfunction_pagination(num:number){
    let dta:any='page='+num;
    if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
     dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
    }
    this.spinner.show();
    this.Faservice.make_model_fa_summary(dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
      }
      else{
        this.modelsummary=result['data'];
        console.log(this.modelsummary);
        if(this.modelsummary.length>0){
          this.hasmodel_sum_next=result['pagination'].has_next;
          this.hasmodel_sum_pre=result['pagination'].has_previous;
          this.hasmodel_sum_page=result['pagination'].index;
        }

      }
    },
   (error:HttpErrorResponse)=>{
    this.spinner.hide();
   } 
    );
  }
  expandenbdata(data:any,ind:number){
    
    console.log(data);
    for(let i=0;i<this.modelsummary.length;i++){
      if(i==ind){
        this.modelsummary[i]['enb_pro']=!this.modelsummary[i]['enb_pro'];
        this.makeModelList_new=[];
      }
      // else{

      // }
      // else{
      //   this.modelsummary[i]['enb_pro']=false;
      //   this.makeModelList_new=[];
      //   // return false;
      // }
    }
    (this.makermodelformchild.get('mainArray') as FormArray).clear();
    (this.makermodelformchild.get('specification_type') as FormArray).clear();
    let data_list:any=data.child_data;
    for(let i=0;i<data_list.length;i++){
      this.makeModelList_new.push({"type":data_list[i].label_name+"("+data_list[i].product_name+")-"+data_list[i].hierarchy_flag,"specification_type":data_list[i].specification_type,
      "configuration":data_list[i].configuration,'id':data_list[i].id,"product_code":data_list[i].product_code,"l_type":data_list[i].label_name});
    }
    
  }
  expandenbdata_new(data:any,ind:number){
    
    console.log(data);
    for(let i=0;i<this.isspecificationdata.length;i++){
      if(i==ind){
        this.isspecificationdata[i]['enb_pro']=!this.isspecificationdata[i]['enb_pro'];
        this.makeModelList_new=[];
      }
      
    }
  }
  specificationadd(i:number,original_data:any){
    this.makeModelList_new[i].specification_type.push({"name":this.makermodelformchild.get('labeltype').value.type,'lbtype':this.makermodelformchild.get('labeltype').value.id,
    "check_enb":false,"new_dta":true,"parent_product_code":original_data.product_code,"parent_id":original_data.id,"hierarchy":"C2"});
    console.log(this.makeModelList_new);
    this.makermodelformchild.get('labeltype').patchValue("");//label_group
    this.makermodelformchild.get('label_group').patchValue(false);
    for(let j=0;j<this.makeModelList_new[i].specification_type.length;j++){
      this.makeModelList_new[i].specification_type[j]['check_enb']=false;
    }
    console.log(this.makermodelformchild.value);
  }
  configurationadd(i:number,original_data:any){
    let type_check_enb:boolean=false;
    let type_check_data:any="";
    let p_id:number=0;
    for(let jkl=0;jkl<this.makeModelList_new[i].specification_type.length;jkl++){
      if(this.makeModelList_new[i].specification_type[jkl]['check_enb']==true){
        type_check_enb=true;
        type_check_data=this.makeModelList_new[i].specification_type[jkl]['name'];
        p_id=this.makeModelList_new[i].specification_type[jkl]['id']
        console.log('Err=',this.makeModelList_new[i].specification_type[jkl]);
      }
    }
    if(type_check_enb==false){
      this.toastr.warning("Please Select The Valid Specification Type..");
      return false;
    }
    this.makeModelList_new[i].configuration.push({"name":this.makermodelformchild.get('configuration').value,
    "check_enb":false,"new_dta":true,"child":type_check_data,"parent_product_code":original_data.product_code,"parent_id":p_id,"hierarchy":"C3"});
    console.log(this.makeModelList_new);
    this.makermodelformchild.get('configuration').patchValue("");
  }
  specificationadd_validate(i:number,data_ind){
    
    for(let kl=0;kl<this.makeModelList_new[i].specification_type.length;kl++){
      if(data_ind==kl){
        this.makeModelList_new[i].specification_type[data_ind]['check_enb']=true;
      }
      else{
        this.makeModelList_new[i].specification_type[kl]['check_enb']=false;
      }
    }
    console.log(this.makeModelList_new[i].specification_type[data_ind]);
  }
  configurationadd_validate(i:number,data_ind){
    
    for(let kl=0;kl<this.makeModelList_new[i].configuration.length;kl++){
      if(data_ind==kl){
        this.makeModelList_new[i].configuration[data_ind]['check_enb']=true;
      }
      else{
        this.makeModelList_new[i].configuration[kl]['check_enb']=false;
      }
    }
    console.log(this.makeModelList_new[i].configuration[data_ind]);
  }
  hierarchy_flag_set(data:any,d:any){
    this.childhierarchy_flag=data;
    this.child_dataproduct_code=d.product_code;
    this.child_dataproduct_name=d.product_name;
    this.child_daatparent_id=d.id;
  }
  modelsummaryfunction_reset(){
    this.makermodelformsummary.reset("");
    this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page);
  }
  nextmodelsum(){
    if(this.hasmodel_sum_next){
      this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page+1);
    }
  }
  premodelsum(){
    if(this.hasmodel_sum_pre){
      this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page-1);
    }
  }
  specificationsummaryfunction(){
    let dta:any='page='+this.hasspec_sum_page;
    if(this.specificationformsummary.get('productname').value!=undefined && this.specificationformsummary.get('productname').value!="" && this.specificationformsummary.get('productname').value!=null && this.specificationformsummary.get('productname').value!=undefined){
     dta=dta+"&code="+this.specificationformsummary.get('productname').value.code;
    }
    this.spinner.show();
    this.Faservice.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
        this.isspecificationdata=[];
      }
      else{
        this.isspecificationdata=result['data'];
        this.isspecificationdata=result['data'];
        if(this.isspecificationdata.length>0){
          this.hasspec_sum_next=result['pagination'].has_next;
          this.hasspec_sum_pre=result['pagination'].has_previous;
          this.hasspec_sum_page=result['pagination'].index;
        }

      }
    });
  }
  matdialogopen(ind:number,data:any){
    (this.makermodelformsummary_array.get('mainArray') as FormArray).clear();
    this.matDialogindex=ind;
    this.matDialogDate=data.child_data;
    this.matDialogparentData=data;
    for(let i=0;i<this.matDialogDate.length;i++){
      (this.makermodelformsummary_array.get('mainArray') as FormArray).push(this.fb.group({
        "lbname":new FormControl(""),"lbtype":new FormControl(""),lid:new FormControl(""),"main_enb":new FormControl(false)
      }));
      (this.makermodelformsummary_array.get('mainArray') as FormArray).at(i).patchValue({"lbname":this.matDialogDate[i].product_name,
      "lbtype":{"id":this.matDialogDate[i].lable_id,"type":this.matDialogDate[i].label_name,
      "main_enb":false
    }
    });
    console.log(this.makermodelformsummary_array.value);
    ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(i) as FormGroup).get("lbtype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.Faservice.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    }
  }
  matclosedialog(){
    this.dialog.closeAll();
  }
  addDataNewModel(){
    let data_length_n:any=(this.makermodelformsummary_array.get('mainArray') as FormArray).length;
    if(data_length_n>=10){
      this.toastr.warning("Max Limit Data Exceed..");
      return false;
    }
    else{
      console.log(122);
    }
    (this.makermodelformsummary_array.get('mainArray') as FormArray).push(this.fb.group({
      "lbname":new FormControl(""),"lbtype":new FormControl(""),lid:new FormControl(""),"main_enb":true
    }));
    let data_len:any= (this.makermodelformsummary_array.get('mainArray') as FormArray).length;
    ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(data_len-1) as FormGroup).get("lbtype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.Faservice.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    console.log(this.makermodelformsummary_array.value);
  }
  addDataNewModelchild(){
    let data_length_n:any=(this.makermodelform.get('mainArray') as FormArray).length;
    if(data_length_n>=20){
      this.toastr.warning("Max Limit Data Exceed..");
      return false;
    }
    else{
      console.log(122);
    }
    (this.makermodelform.get('mainArray') as FormArray).push(this.fb.group({
      "lbname":new FormControl(""),"lbtype":new FormControl(""),lid:new FormControl(""),"main_enb":true
    }));
    let data_len:any= (this.makermodelform.get('mainArray') as FormArray).length;
    ((this.makermodelform.get('mainArray') as FormArray).at(data_len-1) as FormGroup).get("lbtype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.Faservice.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    console.log(this.makermodelform.value);
    this.patchMakeData();
  }
  addchildnew(){
    (this.makermodelformchild.get('mainArray') as FormArray).clear();
  }
  addDataNewModelchild_new(){
    let data_length_n:any=(this.makermodelformchild.get('mainArray') as FormArray).length;
    if(data_length_n>=10){
      this.toastr.warning("Max Limit Data Exceed..");
      return false;
    }
    else{
      console.log(122);
    }
    (this.makermodelformchild.get('mainArray') as FormArray).push(this.fb.group({
      "lbname":new FormControl(""),"lbtype":new FormControl(""),lid:new FormControl(""),"main_enb":true
    }));
    let data_len:any= (this.makermodelformchild.get('mainArray') as FormArray).length;
    ((this.makermodelformchild.get('mainArray') as FormArray).at(data_len-1) as FormGroup).get("lbtype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.Faservice.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    console.log(this.makermodelformchild.value);
    // this.patchMakeData();
  }
  deleteDataNewModel(i:number,d:any){
    
    (this.makermodelformsummary_array.get('mainArray') as FormArray).removeAt(i);
    
  }
  deleteDataNewModelchild(i:number){
    
    (this.makermodelform.get('mainArray') as FormArray).removeAt(i);
    
  }
  addnew_make_fa_data(i:any){
    // this.fa_makemodel_new_form=this.fb.group({
    //   productname:new FormControl(""),
    //   make_id:new FormControl(0),
    //   labelname:new FormControl(""),
    //   "labeltype":new FormControl(""),
      
    //   "mainArray":this.fb.array([
    //     this.fb.group({
          
    //       "lbname":new FormControl(""),
    //       "lbtype":new FormControl(""),
    //       "main_enb":false,
    //       "model_array":this.fb.array([
    //         this.fb.group({
    //           "id":new FormControl(0),
    //           "main_enb":false,
    //           "name":new FormControl("")
    //         })
    //       ])
    //     })
    //   ])

    // });
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value ==undefined || this.fa_makemodel_new_form.get('productname').value==null || this.fa_makemodel_new_form.get('productname').value=='' || this.fa_makemodel_new_form.get('productname').value.code==undefined){
      this.notification.showWarning("Please Select The Product Name..");
      return false;
    }
    (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
      this.fb.group({
                "lbname":new FormControl(""),
                "lbtype":new FormControl(""),
                "main_enb":false,
                "id":new FormControl(0),
                "model_array":this.fb.array([
                  this.fb.group({
                    "id":new FormControl(0),
                    "main_enb":false,
                    "name":new FormControl("")
                  })
                ])     
      })
    );
    let data_len:any=(((this.fa_makemodel_new_form.get("mainArray") as FormArray))).length-1;
    if((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).length==1){
      if (((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value=="" || ((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value==undefined){
        (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).clear();
      }
    }
    console.log((this.fa_makemodel_new_form.get("mainArray") as FormArray).value);
  }
  addnew_model_fa_data(i:any){
   console.log(this.fa_makemodel_new_form.get('productname').value);
    let data_any:any=((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbname").value;
    if(data_any==undefined || data_any=="" || data_any==null){
      this.toastr.warning("Please Enter Valid Make Name..");
      return false;
    }
    let data:any=((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbtype").value;
    if(data==undefined || data=="" || data==null){
      this.toastr.warning("Please Enter Valid Model Name..");
      return false;
    }
    console.log(data);
    let enb:boolean=false;
    let data_list_check:any=(((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).value;
    data_list_check.forEach(element => {
      if(String(element.name).toLowerCase()==String(data).toLowerCase()){
        enb=true;
      }
    });
    if(enb){
      this.toastr.warning("Duplicate Data");
      return false;
    }
    (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).push(this.fb.group({  "id":0,  "main_enb":false, "name":data
  }));
  ((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbtype").patchValue("");
    
  }
    
  fa_newmakemodel_data(){
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value==undefined || this.fa_makemodel_new_form.get('productname').value==null || this.fa_makemodel_new_form.get('productname').value==""){
      this.toastr.warning("Please Select The Product Name..")
      return false;
    }
    if((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).length==0){
      this.toastr.warning("Please Select The Make and Model Data..");
      return false;
    }
    let check_dup:boolean=false;
    let check_data_dup:any=[];
    let data_list:any=(((this.fa_makemodel_new_form.get("mainArray") as FormArray)).value);
    data_list.forEach((ele)=>{
      check_data_dup.push(ele.lbname);
    });
    data_list.forEach((ele,i)=>{
      check_data_dup.forEach((elem,j)=>{
        if((String(elem).toLowerCase().trim()==String(ele.lbname).toLowerCase().trim()) && (i!=j)){
          check_dup=true;
        }
      });
    });
    if(check_dup){
      this.toastr.warning("Please Check Asset Make Duplicate Data Not Allowed");
      return false;
    }

    let data_value=this.fa_makemodel_new_form.value;
    this.spinner.show();
    this.Faservice.get_fa_makemodel_create(data_value).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
        this.assetmakemodel();
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.toastr.error("Failed Load To Data..");

    }
    );
  }


  addnew_make_fa_spec_data(i:any){
    // this.specificationform_fa_new=this.fb.group({
    //   "productname":new FormControl(""),
    //   "key_list":this.fb.array([
    //     this.fb.group({
    //       "data":new FormControl(""),
    //       "main_enb":new FormControl(false),
    //       "values_list":this.fb.array([
    //         this.fb.group({
    //           "data_value":new FormControl(""),
    //           "main_enb":new FormControl(false)
    //         })
    //       ])
    //     })
    //   ])
    // });
    if(this.specificationform_fa_new.get('productname').value ==undefined || this.specificationform_fa_new.get('productname').value==null || this.specificationform_fa_new.get('productname').value=='' || this.specificationform_fa_new.get('productname').value.code==undefined){
      this.notification.showWarning("Please Select The Product Name..");
      return false;
    }
    (this.specificationform_fa_new.get("key_list") as FormArray).push(
      this.fb.group({
                "data":new FormControl(""),
                "id":new FormControl(0),
                "data_value_n":new FormControl(""),
                "main_enb":new FormControl(false),
                "values_list":this.fb.array([
                  this.fb.group({
                    "id":new FormControl(0),
                    "main_enb":new FormControl(false),
                    "data_value":new FormControl("")
                  })
                ])     
      })
    );
    let data_len:any=(((this.specificationform_fa_new.get("key_list") as FormArray))).length-1;
   
    if((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).length==1){
      if (((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).at(0) as FormGroup).get('data_value').value=="" || ((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).at(0) as FormGroup).get('data_value').value==undefined){
        (((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).clear();
      }
    }


    console.log((this.fa_makemodel_new_form.get("mainArray") as FormArray).value);
  }



  addnew_model_fa_data_spec(i:any){
    let data_any:any=((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data").value;
    if(data_any==null || data_any==undefined || data_any==""){
      this.toastr.warning("Please Enter The Valid Specifications Name..")
    }
    let data:any=((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").value;
    if(data==undefined || data=="" || data==null){
      this.toastr.warning("Please Enter Valid Configurations Name..");
      return false;
    }
    console.log(data);
    let data_check_valiate:any=(((((this.specificationform_fa_new.get("key_list") as FormArray))).at(i) as FormGroup).get('values_list') as FormArray).value;
    let enb_boo:boolean=false;
    data_check_valiate.forEach((ele)=>{
      if( String(ele.data_value).toLowerCase()==String(data).toLowerCase()){
        enb_boo=true;
      }
    });
    if(enb_boo){
      this.notification.showWarning("Duplicate Value Not Allowed");
      return false;
    }
    (((((this.specificationform_fa_new.get("key_list") as FormArray))).at(i) as FormGroup).get('values_list') as FormArray).push(this.fb.group({  "id":0,  "main_enb":false, "data_value":data
  }));
  ((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").patchValue("");
    
  }
    







new_product_spe_submit(){
  console.log(this.specificationform_fa_new.value);
  if(this.specificationform_fa_new.get('productname').value==undefined || this.specificationform_fa_new.get('productname').value=="" || this.specificationform_fa_new.get('productname').value==null){
    this.toastr.warning("Please Select The Valid Product Name..");
    return false;
  }
  let data_new:any=this.specificationform_fa_new.value;
  let data_new_exist:any=[];
  this.specificationform_fa_new.value['key_list'].forEach((ele)=>{
    data_new_exist.push(ele.data);
  });
  console.log(data_new_exist);
  let enb_boolean:boolean=false;
  this.specificationform_fa_new.value['key_list'].forEach((ele,i)=>{
    data_new_exist.forEach((ele_name,j)=>{
      if((String(ele.data).toLowerCase().trim()==String(ele_name).toLowerCase().trim()) && (i!=j)){
        enb_boolean=true;
      }
    })
  });
if(enb_boolean){
  this.notification.showWarning("Duplicate Product Specification Not Allowed..");
  return false;
}
  this.spinner.show();
  this.Faservice.fa_product_specificaitons_create(data_new).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);
    }
    else{
      this.toastr.success(result.status);
      this.toastr.success(result.message);
      this.assetspecification();
    }
  },
  (error:HttpErrorResponse)=>{
    this.toastr.warning("Failed To Load The Data..");
    this.spinner.hide();
  }
  )
}

  deleteDataNewModelchild_new(i:number){
    
    (this.makermodelformchild.get('mainArray') as FormArray).removeAt(i);
    
  }
  submitModel(){
    let checkData:number=0;
    for(let j=0;j<this.makermodelformsummary_array.get('mainArray').value.length;j++){
      if(((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==undefined ||((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=="" || ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==null || ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=='' ){
        this.toastr.warning("Please Enter The Label Name..");
        return false;
      }
      if(((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==undefined ||((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=="" || ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==null || ((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=='' ){
        this.toastr.warning("Please Select The Label Type..");
        return false;
      }
      if(((this.makermodelformsummary_array.get('mainArray') as FormArray).at(j) as FormGroup).get('main_enb').value){
        checkData+=1;
      }
    }
    if(checkData==0){
      this.toastr.warning("Please Select Valid Line Item..");
      return false;
    }
    let sub_dta:any={};
    sub_dta['product_code']=this.matDialogparentData.product_code;
    sub_dta['product_name']=this.matDialogparentData.product_name;
    sub_dta['child_data']=this.makermodelformsummary_array.get('mainArray').value;
    console.log(sub_dta);
    this.spinner.show();
    this.Faservice.model_fa_childcreate(sub_dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
       
      }
      else{
        this.toastr.success(result.message);
        this.modelsummaryfunction();

      }
    },
   (error:HttpErrorResponse)=>{
    this.spinner.hide();
   } 
    );
  }
  submitModelChild(){
    let checkData:number=0;
    if(this.makermodelform.get('productname').value==undefined || this,this.makermodelform.get('productname').value=="" || this,this.makermodelform.get('productname').value==null || this,this.makermodelform.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    if(this.makermodelform.get('labelname').value==undefined || this,this.makermodelform.get('labelname').value=="" || this,this.makermodelform.get('labelname').value==null){
      this.toastr.warning("Please Select Asset Specification Type..");
      return false;
    }
    for(let j=0;j<this.makermodelform.get('mainArray').value.length;j++){
      if(((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==undefined ||((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=="" || ((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==null || ((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=='' ){
        this.toastr.warning("Please Enter The Label Name..");
        return false;
      }
      if(((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==undefined ||((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=="" || ((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==null || ((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=='' ){
        this.toastr.warning("Please Select The Label Type..");
        return false;
      }
      if(((this.makermodelform.get('mainArray') as FormArray).at(j) as FormGroup).get('main_enb').value){
        checkData+=1;
      }
    }
    if(checkData==0){
      this.toastr.warning("Please Select Valid Line Item..");
      return false;
    }
    let sub_dta:any={};
    sub_dta['product_code']=this.makermodelform.get('productname').value.code;//this.matDialogparentData.product_code;
    sub_dta['product_name']=this.makermodelform.get('productname').value.name;
    sub_dta['label_id']=this.makermodelform.get('labelname').value.id;
    sub_dta['label_name']=this.makermodelform.get('labelname').value.type;
    sub_dta['child_data']=this.makermodelform.get('mainArray').value;
    console.log(sub_dta);
    this.spinner.show();
    this.Faservice.model_fa_childcreate(sub_dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
       
      }
      else{
        this.toastr.success(result.message);
        this.makermodelform.reset("");

        this.assetmakemodel();
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    );
  }
  submit_childdata(){
    let checkData:number=0;
    if(this.child_dataproduct_code==undefined || this.child_dataproduct_code==null || this.child_dataproduct_code==""){
      this.toastr.warning("Please Select The Child Data..");
      return false;
    }
    if(this.child_dataproduct_name==undefined || this.child_dataproduct_name==null || this.child_dataproduct_name==""){
      this.toastr.warning("Please Select The Child Data..");
      return false;
    }
    if(this.child_daatparent_id==undefined || this.child_daatparent_id==null || this.child_daatparent_id==""){
      this.toastr.warning("Please Select The Child Data..");
      return false;
    }
    if(this.childhierarchy_flag==undefined || this.childhierarchy_flag==null || this.childhierarchy_flag==""){
      this.toastr.warning("Please Select The Child Data..");
      return false;
    }
    for(let j=0;j<this.makermodelformchild.get('mainArray').value.length;j++){
      if(((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==undefined ||((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=="" || ((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value==null || ((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbname').value=='' ){
        this.toastr.warning("Please Enter The Label Name..");
        return false;
      }
      if(((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==undefined ||((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=="" || ((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value==null || ((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('lbtype').value=='' ){
        this.toastr.warning("Please Select The Label Type..");
        return false;
      }
      if(((this.makermodelformchild.get('mainArray') as FormArray).at(j) as FormGroup).get('main_enb').value){
        checkData+=1;
      }
    }
    if(checkData==0){
      this.toastr.warning("Please Select Valid Line Item..");
      return false;
    }
    let sub_dta:any={};
    sub_dta['product_code']=this.child_dataproduct_code;//this.matDialogparentData.product_code;
    sub_dta['product_name']=this.child_dataproduct_name;
    sub_dta['parent_id']=this.child_daatparent_id;
    sub_dta['hierarchy_flag']=this.childhierarchy_flag;
    sub_dta['child_data']=this.makermodelformchild.get('mainArray').value;
    console.log(sub_dta);
    this.spinner.show();
    this.Faservice.model_fa_childcreate_new(sub_dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
       
      }
      else{
        this.toastr.success(result.message);
        this.makermodelformchild.reset("");
        this.child_dataproduct_code="";
        this.child_dataproduct_name="";
        this.child_daatparent_id="";
        this.childhierarchy_flag="";
        this.assetmakemodel();
      }
    },
   (error:HttpErrorResponse)=>{
    this.spinner.hide();
   } 
    );
  }
  submit_childdata_newprocess(){
   if (this.makeModelList_new.length==0){
    this.toastr.warning("Please Add The Child Data..");
    return false;
   }
   this.spinner.show();
    this.Faservice.model_fa_child_new(this.makeModelList_new).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
       
      }
      else{
        this.toastr.success(result.message);
        this.makeModelList_new=[];
        this.assetmakemodel();
      }
    },
    (error:HttpErrorResponse)=>{
      this.makeModelList_new=[];
      this.spinner.hide();
    }
    );
  }
  patchMakeData(){
    if(this.makermodelform.get('labelname').value!="" && this.makermodelform.get('labelname').value!=undefined && this.makermodelform.get('labelname').value!=null && this.makermodelform.get('labelname').value.id!=undefined && this.makermodelform.get('labelname').value.type!=undefined){
      let data_make_len:number=(this.makermodelform.get('mainArray') as FormArray).length;
    if (data_make_len>0){
      for(let i=0;i<data_make_len;i++){
      //   ((this.makermodelform.get('mainArray') as FormArray).at(i) as FormGroup).get('lbtype').patchValue({"id":
      //   this.makermodelform.get('labelname').value.id,"type":this.makermodelform.get('labelname').value.type
      // });
      }
    }
    }
    
  }
  specificationsummaryfunction_pagination(num:number){
    let dta:any='page='+num;
    if(this.specificationformsummary.get('type').value!=undefined && this.specificationformsummary.get('type').value!="" && this.specificationformsummary.get('type').value!=null && this.specificationformsummary.get('type').value!=undefined){
     dta=dta+"&name="+this.specificationformsummary.get('type').value;
    }
    this.spinner.show();
    this.Faservice.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.description);
        this.isspecificationdata=[];
      }
      else{
        console.log(this.isspecification);
        this.isspecificationdata=result['data'];
        if(this.isspecificationdata.length>0){
          this.hasspec_sum_next=result['pagination'].has_next;
          this.hasspec_sum_pre=result['pagination'].has_previous;
          this.hasspec_sum_page=result['pagination'].index;
        }

      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.isspecificationdata=[];
    }
    );
  }
  specificationnext(){
    console.log(this.hasspec_sum_next);
    if(this.hasspec_sum_next){
      this.specificationsummaryfunction_pagination(this.hasspec_sum_page+1)
    }
  }
  specificationpre(){
    console.log(this.hasspec_sum_pre);
    if(this.hasspec_sum_pre){
      this.specificationsummaryfunction_pagination(this.hasspec_sum_page-1)
    }
  }
  specificationprevious(){
    
  }
  private getapsubcatsearch(ssubcatkeyvalue) {
    this.Faservice.getapsubcatsearch(ssubcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcatList = datas;
        console.log("subcatList subcatList subcatList", datas)
        return true
      })
  }
  prsearch() {
    let data_any:any="";
    this.Faservice.getproductpage(1, 10, data_any)
      .subscribe((results: any) => {
        let datapagination = results["pagination"];
        this.productlist = results["data"];;
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })
  }
  public displayFnproduct(prd?: product): string | undefined {
   
    return prd ? prd.name : undefined;
  }
  public displayFnlabelt(prd?: labeltype): string | undefined {
   
    return prd ? prd.type : undefined;
  }
  assetBtn() {
    this.isassetcategory = true;
    this.getassetcategorysummary();
    this.isassetlocation = false;
    this.isassetcategorys = true;
    this.ismakemodelsumary=false;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isspecificationsummary=false;

  }

  assetlocBtn() {
    this.isassetlocation = true;
    this.getassetlocationsummary();
    this.isassetcategory = false;
    this.isassetcategorys = false;
    this.ismakemodelsumary=false;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isspecificationsummary=false;

  }
  assetmakemodel(){
    this.isassetcategory = false;
    this.isassetlocation = false;
    this.isassetcategorys = false;
    this.isspecification=false;
    this.ismakemodelsumary=true;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isspecificationsummary=false;
    this.fa_new_modelsummaryfunction();
  }
  assetmakemodelcaret(){
    this.isassetcategory = false;
    this.isassetlocation = false;
    this.isassetcategorys = false;
    this.isspecification=false;
    this.ismakemodelsumary=false;
    this.ismakemodel=true;
    this.isspecification=false;
    this.isspecificationsummary=false;
    (this.fa_makemodel_new_form.get('mainArray') as FormArray).clear();
  }
  assetspecificationcreate(){
    this.isassetcategory = false;
    this.isassetlocation = false;
    this.isassetcategorys = false;
    this.isspecification=true;
    this.ismakemodel=false;
    this.ismakemodelsumary=false;
    this.isspecificationsummary=false;
    (this.specificationform_fa_new.get('key_list') as FormArray).clear();
  }
  assetspecification(){
    this.isassetcategory = false;
    this.isassetlocation = false;
    this.isassetcategorys = false;
    this.isspecification=false;
    this.ismakemodel=false;
    this.ismakemodelsumary=false;
    this.isspecificationsummary=true;
    this.specificationsummaryfunction();
  }
  prouctcheck(){
    if(this.makermodelform.get('productname').value.id==undefined || this.makermodelform.get('productname').value=="" || this.makermodelform.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    let datamake:any=this.makermodelform.get('productname').value;
    this.spinner.show();
    this.Faservice.asset_maker_model_check(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{
        this.specificationsummary=result['data'];
        this.parent_enb=result['parent'];
        this.child_enb=result['Child']
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }
  prouctcheck_new(){
    if(this.fa_makemodel_new_form.get('productname').value.id==undefined || this.fa_makemodel_new_form.get('productname').value=="" || this.fa_makemodel_new_form.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    let datamake:any=this.fa_makemodel_new_form.get('productname').value;
    this.spinner.show();
    this.Faservice.asset_maker_model_check(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{
        this.specificationsummary=result['data'];
        this.parent_enb=result['parent'];
        this.child_enb=result['Child']
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }

  prouctcheck_new_fa_make(){
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value.id==undefined || this.fa_makemodel_new_form.get('productname').value=="" || this.fa_makemodel_new_form.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    let datamake:any="code="+this.fa_makemodel_new_form.get('productname').value.code;
    this.spinner.show();
    this.Faservice.all_get_fa_makemodel_create(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{

        // "mainArray":this.fb.array([
        //   this.fb.group({
            
        //     "lbname":new FormControl(""),
        //     "lbtype":new FormControl(""),
        //     "main_enb":false,
        //     "model_array":this.fb.array([
        //       this.fb.group({
        //         "id":new FormControl(0),
        //         "main_enb":false,
        //         "name":new FormControl("")
        //       })
        //     ])


       console.log(result.data);
       (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
       if(result.data.length>0){
        let data_make=result.data[0];
        for(let i=0;i<data_make['mainArray'].length;i++){
         let data_model:any=[];
         for(let j=0;j<data_make['mainArray'][i]['model_array'].length;j++){
           data_model.push(this.fb.group({
             "id":new FormControl(data_make['mainArray'][i]['model_array'][j]['id']),
             "main_enb":false,
             
             "name":new FormControl(data_make['mainArray'][i]['model_array'][j]['name'])
           }));
 
         }
         (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
           this.fb.group({
             "lbname":new FormControl(data_make['mainArray'][i]['lbname']),
             "id":new FormControl(data_make['mainArray'][i]['id']),
             "main_enb":new FormControl(true),
             "lbtype":new FormControl(""),
             "model_array":this.fb.array(data_model)
           })
         )
 
 
        }
       }
      
       console.log(this.fa_makemodel_new_form.value);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }


  prouctcheck_new_fa_make_navigate(data:any){
    this.isassetcategory = false;
    this.isassetlocation = false;
    this.isassetcategorys = false;
    this.isspecification=false;
    this.ismakemodelsumary=false;
    this.ismakemodel=true;
    this.isspecification=false;
    this.isspecificationsummary=false;
    (this.makermodelform.get('mainArray') as FormArray).clear();
    let datamake:any="code="+data.code;
    this.fa_makemodel_new_form.get("productname").patchValue(data.productname);
    this.spinner.show();
    this.Faservice.all_get_fa_makemodel_create(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{

       console.log(result.data);
       (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
       if(result.data.length>0){
        let data_make=result.data[0];
        for(let i=0;i<data_make['mainArray'].length;i++){
         let data_model:any=[];
         for(let j=0;j<data_make['mainArray'][i]['model_array'].length;j++){
           data_model.push(this.fb.group({
             "id":new FormControl(data_make['mainArray'][i]['model_array'][j]['id']),
             "main_enb":true,
             
             "name":new FormControl(data_make['mainArray'][i]['model_array'][j]['name'])
           }));
 
         }
         (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
           this.fb.group({
             "lbname":new FormControl(data_make['mainArray'][i]['lbname']),
             "id":new FormControl(data_make['mainArray'][i]['id']),
             "main_enb":new FormControl(true),
             "lbtype":new FormControl(""),
             "model_array":this.fb.array(data_model)
           })
         )
 
 
        }
       }
      
       console.log(this.fa_makemodel_new_form.value);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }





  prouctcheck_new_spec(){
    if(this.specificationform_fa_new.get('productname').value.id==undefined || this.specificationform_fa_new.get('productname').value=="" || this.specificationform_fa_new.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    let datamake:any=this.specificationform_fa_new.get('productname').value;
    this.spinner.show();
    this.Faservice.asset_maker_model_check(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{
        this.specificationsummary=result['data'];
        this.parent_enb=result['parent'];
        this.child_enb=result['Child']
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }



  
  specificationsubmit(){
    console.log(this.specificationform.value);
    if(this.specificationform.get('type').value==undefined || this,this.specificationform.get('type').value=="" || this,this.specificationform.get('type').value==null){
      this.toastr.warning("Please Enter The Valid Specification Type..");
      return false;
    }
    this.spinner.show();
    this.Faservice.asset_specification_create(this.specificationform.value).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
        this.specificationform.reset();
        this.assetspecification();
      }
    },
    (error:HttpErrorResponse)=>{
      console.log(error);
      this.spinner.hide();
    }
    );
  }
  makermodelsubmit(){
    console.log(this.makermodelform.value);
    if(this.specificationform.get('type').value==undefined || this,this.specificationform.get('type').value=="" || this,this.specificationform.get('type').value==null){
      this.toastr.warning("Please Enter The Valid Specification Type..");
      return false;
    }
    this.spinner.show();
    this.Faservice.asset_specification_create(this.specificationform.value).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
      }
    },
    (error:HttpErrorResponse)=>{
      console.log(error);
      this.spinner.hide();
    }
    );
  }
  submitdata(){
    console.log(this.makermodelform.value);
    if(this.makermodelform.get('productname').value==undefined || this,this.makermodelform.get('productname').value=="" || this,this.makermodelform.get('productname').value==null || this,this.makermodelform.get('productname').value.id==undefined){
      this.toastr.warning("Please Select The Valid Product Name..");
      return false;
    }
    if(this.makermodelform.get('labelname').value==undefined || this,this.makermodelform.get('labelname').value=="" || this,this.makermodelform.get('labelname').value==null){
      this.toastr.warning("Please Select Asset Specification Type..");
      return false;
    }
    let data:any=this.makermodelform.value;
    if(this.parent_enb){
      if(this.makermodelform.get('labeltype').value==undefined || this,this.makermodelform.get('labeltype').value=="" || this,this.makermodelform.get('labeltype').value==null){
        this.toastr.warning("Please Enter The Valid Label Type..");
        return false;
      }
      data['parent_enb']=this.parent_enb;
      data['parent_data']=this.specificationsummary[0];
      data['productname']['name']=this.makermodelform.get('labeltype').value;
    }
    else{
      data['parent_enb']=this.parent_enb;
    }
    if(this.child_enb){
      data['child_enb']=this.child_enb;
      data['child_data']=this.specificationsummary[this.specificationsummary.length-1];
    }
    else{
      data['child_enb']=this.child_enb;
    }

    this.spinner.show();
    this.Faservice.make_model_fa(data).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
        this.parent_enb=false;
        this.child_enb=false;
        this.assetmakemodel();
        // this.prouctcheck();
      }
    },
    (error:HttpErrorResponse)=>{
      console.log(error);
      this.spinner.hide();
    }
    );
  }
  assetcatEdit(data: any) {
    this.isassetcategoryEditForm = true;
    this.ismakerCheckerButton = false;
    this.isassetcategory = false;
    this.FaShareService.assetcategoryedit.next(data)
    return data;
  }



  nextClick() {

    if (this.has_nextasset === true) {

      this.getassetcategorysummary(this.presentpageasset + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previousasset === true) {

      this.getassetcategorysummary(this.presentpageasset - 1, 10)

    }
  }

  getassetlocationsummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice.getassetlocationdata(pageNumber)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetloclist = datass;
        console.log("landlord", this.assetloclist)
        if (this.assetloclist.length >= 0) {
          this.has_nextloc = datapagination.has_next;
          this.has_previousloc = datapagination.has_previous;
          this.presentpageloc = datapagination.index;
        }

      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
      }
      )

  }


  locnextClick() {

    if (this.has_nextloc === true) {
      // this.currentpage= this.presentpage + 1
      this.getassetlocationsummary(this.presentpageloc + 1, 10)

    }
  }

  locpreviousClick() {

    if (this.has_previousloc === true) {
      // this.currentpage= this.presentpage - 1
      this.getassetlocationsummary(this.presentpageloc - 1, 10)

    }
  }

  createFormate() {
    let data = this.SubcatSearchForm.controls;
    let subSearchclass = new subclassSearchtype();
    subSearchclass.subcategorys = data['subcategorys'].value.id;
    subSearchclass.deptype = data['deptype'].value
    return subSearchclass;
  }

  j: any
  k: any
  summarycreateForm() {
    let search = this.createFormate();
    console.log('search=',search);
    for (let i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }


    let b = this.SubcatSearchForm.get('deptype').value
    this.j = this.SubcatSearchForm.get('subcategorys').value.name




    this.Faservice.getsummarySearch(this.j, b)
      .subscribe(result => {
        console.log(" search result", result)
        this.assetcatlist = result['data']
        if (search.deptype === '') {
          this.getassetcategorysummary();
        }
      })
  }
  reset() {
    this.getassetcategorysummary();
  }
  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord-1", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        console.log("landlord", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
          this.has_nextasset = datapagination.has_next;
          this.has_previousasset = datapagination.has_previous;
          this.presentpageasset = datapagination.index;
        }

      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();
     } 
      )

  }

  depCreateForm() {
    if (this.depform.value.doctype === "") {
      this.toastr.error('Add Depreciation type Field', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    // if (this.depform.value.depgl === "") {
    //   this.toastr.error('Add GL Number  Field', 'Empty value inserted', { timeOut: 1500 });
    //   return false;
    // }
    // if (this.depform.value.depreservegl === "") {
    //   this.toastr.error('Add Gl Ref No Field', 'Empty value inserted', { timeOut: 1500 });
    //   return false;
    // }



    let data = this.depform.value;
    this.spinner.show();
    this.Faservice.depCreateForm(data)
      .subscribe(res => {
        this.spinner.hide();
        if(res)
{
        this.notification.showSuccess("Saved Successfully!...")
        this.onSubmit.emit();
        this.router.navigate(['/fa/famaster'], { skipLocationChange: true })

}else{
  this.toastr.error('failed','', { timeOut: 1500 });
  return false
}

       
      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();
     } 
      )


  }

  assetlocationCreateForm() {
    if (this.assetlocationform.value.reftablegid === "") {
      this.toastr.error('Add Branch ', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    if (this.assetlocationform.value.name === "") {
      this.toastr.error('Add Location name ', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    if (this.assetlocationform.value.floor === "") {
      this.toastr.error('Add Floor name', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    if (this.assetlocationform.value.refgid === "") {
      this.toastr.error('Add Refgid Field', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }




    
    this.assetlocationform.value.branch_id=this.assetlocationform.value.reftablegid.id
    let data = this.assetlocationform.value;
    this.spinner.show();
    this.Faservice.assetlocCreateForm(data)
      .subscribe(res => {
        this.spinner.hide();

        if(res){
        this.notification.showSuccess("Saved Successfully!...")
       
        this.router.navigate(['/fa/famaster'], { skipLocationChange: true })

          this.assetlocationform.reset()
          this.getassetlocationsummary();

        return true}else{
          this.notification.showSuccess("Failed")
          this.assetlocationform.reset()
          this.getassetlocationsummary();

        }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
      }
      )


  }


  onCancelClick() {
    this.router.navigate(['/fa/famaster'], { skipLocationChange: true })


  }


  branchget() {
    let bs: String = "";
    this.getbranch(bs);
  
    this.assetlocationform.get('branch_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')
  
      }),
      switchMap(value => this.Faservice.search_employeebranch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
       
      })
  }
  
  getbranch(val){
    this.Faservice.search_employeebranch(val).subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
  
  }
  public displayFnbranch(_branchval?: BRANCH): string | undefined {
    return _branchval ? _branchval.name : undefined;
  }
  
  
  
  // branchend
  
  assetlocation(){
    this.locationdata=true;}

    findDetails(data) {
      console.log('n',data)
      return data
    }

    mobile_popu(asst){
      this.updateForm.get('depgl_mgmt').setValue('asst.depgl_mgmt');
      this.updateForm.get('depresgl_mgmt').setValue('asst.depresgl_mgmt');      
    }




    fa_makemodelsummaryfunction_pagination(num:number){
      let dta:any='page='+num;
      if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
       dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
      }
      this.spinner.show();
      this.Faservice.all_get_fa_makemodel_create(dta).subscribe((result:any)=>{
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.toastr.warning(result.description);
        }
        else{
          this.modelsummary=result['data'];
          console.log(this.modelsummary);
          if(this.modelsummary.length>0){
            this.hasmodel_sum_next=result['pagination'].has_next;
            this.hasmodel_sum_pre=result['pagination'].has_previous;
            this.hasmodel_sum_page=result['pagination'].index;
          }
  
        }
      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();
     } 
      );
    }

    fa_new_modelsummaryfunction(){
      let dta:any='page='+this.hasmodel_sum_page;
      if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
       dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
      }
      this.spinner.show();
      this.Faservice.all_get_fa_makemodel_create(dta).subscribe((result:any)=>{
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.toastr.warning(result.description);
        }
        else{
          this.modelsummary=result['data'];
          if(this.modelsummary.length>0){
            this.hasmodel_sum_next=result['pagination'].has_next;
            this.hasmodel_sum_pre=result['pagination'].has_previous;
            this.hasmodel_sum_page=result['pagination'].index;
          }
  
        }
      },
     (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.modelsummary=[];
     } 
      );
    }



    search_specificationsdatafunction(){

      // this.specificationform_fa_new=this.fb.group({
      //   "productname":new FormControl(""),
      //   "key_list":this.fb.array([
      //     this.fb.group({
      //       "data":new FormControl(""),
      //       "main_enb":new FormControl(false),
      //       "data_value_n":new FormControl(""),
      //       "values_list":this.fb.array([
      //         this.fb.group({
      //           "data_value":new FormControl(""),
      //           "main_enb":new FormControl(false)
      //         })
      //       ])
      //     })
      //   ])
      // });

      let dta:any='page='+this.hasspec_sum_page;
      if(this.specificationform_fa_new.get('productname').value!=undefined && this.specificationform_fa_new.get('productname').value!="" && this.specificationform_fa_new.get('productname').value!=null && this.specificationform_fa_new.get('productname').value!=undefined){
       dta=dta+"&code="+this.specificationform_fa_new.get('productname').value.code;
      }
      this.spinner.show();
      this.Faservice.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.toastr.warning(result.description);
          this.isspecificationdata=[];
        }
        else{
          // (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
          (this.specificationform_fa_new.get("key_list") as FormArray).clear();

          console.log(result['data'][0]);
          for(let i=0;i<result['data'][0]['key_list'].length;i++){
            let data_value:any=[];
            for(let j=0;j<result['data'][0]['key_list'][i]['values_list'].length;j++){
              data_value.push(this.fb.group({
                "data_value":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['data_value']),
                "main_enb":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['main_enb']),
               
              }));
            }
            let data_fa:any=this.fb.group({
              "data":new FormControl(result['data'][0]['key_list'][i]['data']),
              "main_enb":new FormControl(true),
              "data_value_n":new FormControl(""),
              "values_list":this.fb.array(data_value)
            });
            (this.specificationform_fa_new.get("key_list") as FormArray).push(data_fa);
          }
          console.log(this.specificationform_fa_new.value);
        }
      });
    }


    search_specificationsdatafunction_navigate(data:any){

      this.isassetcategory = false;
      this.isassetlocation = false;
      this.isassetcategorys = false;
      this.isspecification=true;
      this.ismakemodel=false;
      this.ismakemodelsumary=false;
      this.isspecificationsummary=false;
      (this.specificationform_fa_new.get('key_list') as FormArray).clear();

      let dta:any='page='+this.hasspec_sum_page;
      // if(this.specificationform_fa_new.get('productname').value!=undefined && this.specificationform_fa_new.get('productname').value!="" && this.specificationform_fa_new.get('productname').value!=null && this.specificationform_fa_new.get('productname').value!=undefined){
       dta=dta+"&code="+data.code;
      // }
      this.specificationform_fa_new.get("productname").patchValue(data.productname);
      this.spinner.show();
      this.Faservice.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
        this.spinner.hide();
        if(result.code!=undefined && result.code!=""){
          this.toastr.warning(result.description);
          this.isspecificationdata=[];
        }
        else{
          // (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
          (this.specificationform_fa_new.get("key_list") as FormArray).clear();

          console.log(result['data'][0]);
          for(let i=0;i<result['data'][0]['key_list'].length;i++){
            let data_value:any=[];
            for(let j=0;j<result['data'][0]['key_list'][i]['values_list'].length;j++){
              data_value.push(this.fb.group({
                "data_value":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['data_value']),
                "main_enb":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['main_enb']),
               
              }));
            }
            let data_fa:any=this.fb.group({
              "data":new FormControl(result['data'][0]['key_list'][i]['data']),
              "main_enb":new FormControl(true),
              "data_value_n":new FormControl(""),
              "values_list":this.fb.array(data_value)
            });
            (this.specificationform_fa_new.get("key_list") as FormArray).push(data_fa);
          }
          console.log(this.specificationform_fa_new.value);
        }
      });
    }
}
class subclassSearchtype {
  subcategorys: string;
  deptype: any;
  id: number;

} 

function assetlocation() {
  throw new Error('Function not implemented.');
}
