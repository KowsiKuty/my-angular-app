import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild, EventEmitter, Output, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,FormArray} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil ,tap} from 'rxjs/operators';
import { TouchSequence } from 'selenium-webdriver';
import { SmsService } from '../sms.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
interface NOP {
  value: Number;
  viewValue: string;
}
export interface assetsubcat{
  id:string,
  name:string
}
export interface parentname{
  id:string,
  errorcategory_name:string
 
}
export interface parentname1{
  id:string,
  errorcategory_name:string
  code:string
 
}
export interface product{
  id:string;
  name:string;
}
export interface productedit{
  id:string;
  name:string;
  code:string;
}

export interface productupdate{
  id:string;
  name:string;
  code:string;
}
interface status {
  value: Number;
  viewValue: string;
}
@Component({
  selector: 'app-sms-nature-of-asset-problem',
  templateUrl: './sms-nature-of-asset-problem.component.html',
  styleUrls: ['./sms-nature-of-asset-problem.component.scss']
})
export class SmsNatureOfAssetProblemComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
      
    }
    
  }
  @ViewChild('categorys') matcategory:MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('inputcategorys') inputcategory:any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('parent_name') parent_nameinput:any;
  @ViewChild('child_name') child_nameinput:any;
  @ViewChild('modalcloses') modalclosesub:ElementRef;
  @ViewChild('specificationtye') matspecication:MatAutocomplete;
  @ViewChild('child') child:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @Output() onCancel = new EventEmitter<any>();
  parent_name:any=FormGroup;
  table_visible:boolean=false;
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  presentpage1:number=1;
  smsassetcat:any=FormGroup;
  nopchildedit:any=FormGroup;

  table_data:Array<any>=[];
  productspecificationArray:Array<any>=[];
  productspecificationArray1:Array<any>=[];
  productchildArray:Array<any>=[];
  has_specificationpre:boolean=false;
  has_specificationnext:boolean=true;
  has_specificationpage:any=1
  has_childpre:boolean=false;
  has_childnext:boolean=true;
  has_childpage:any=1;
  specificationsummary:Array<any>=[];
  categorylist: Array<any>=[];
  isLoading:boolean=false;
  addNew:boolean = false;
 has_nextcategory:boolean=true;
  has_previouscategory:boolean=true;
  has_presentcategory:number=1;
  addChild = true;
  parent_id:number;
  pageNumber:number = 1;
  pageSize = 10;
  has_nextpro :boolean=false;
  has_previouspro :boolean=false;
  presentpagepro:number = 1;
  makermodelformchild:any=FormGroup;
  nopformsummary_array:any=FormGroup;
  makermodelform:any=FormGroup;
  new_par_childList_new:Array<any>=[];
  nopsummary: Array<any> = [];
  nopsummary_parent: Array<any> = [];
  nop_edit_parrent: Array<any> = [];
  listcomments: Array<any> = [];
  productlist:Array<any>=[];
  productlist1:Array<any>=[];
  productlist2:Array<any>=[];
  listcomments1: any = [];
  nopform:any = FormGroup;
  nopeditform:any=FormGroup;
  nopsearch:any = FormGroup;
  tickEnable = true;
  textEnable = true;
  framedata:any;
  product:number;
  has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;  
  nop_screen=false;
  ismakemodel=false;
  sms_makemodel_new_form:any=FormGroup;
  status: status[] = [
    {value: 1, viewValue: 'ACTIVE'},
    {value: 0, viewValue: 'INACTIVE'},
    {value: 2, viewValue: 'DELETED'}
   
  ];
  
  constructor(private router: Router, private share: SmsService, private http: HttpClient,
     private toastr:ToastrService, private spinner: NgxSpinnerService,
     private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef,private notification: NotificationService,) { }

  ngOnInit(): void {
    this.nopform = this.fb.group({
      'childNOP': new FormControl(''),
      'parentNOP':new FormControl(''),
      'parent_name':new FormControl('')
    });
    this.nopeditform = this.fb.group({
      'childNOP': new FormControl(''),
      'parentNOP':new FormControl(''),
      'parent_name':new FormControl('')
    });
    this.smsassetcat=this.fb.group({
      'subcat':new FormControl(''),
      'cat':new FormControl(''),
      'parent_name_list':new FormControl(''),
      'childNOP': new FormControl(''),
      'asset_name':new FormControl('')
    });
    this.nopchildedit=this.fb.group({
      'id': new FormControl(''),
      'subcat':new FormControl(''),
      'cat':new FormControl(''),
      'parent_name_list':new FormControl(''),
      'childNOP': new FormControl(''),
      'asset_name':new FormControl('')
    });
    this.nopsearch = this.fb.group({
      'asset_name': new FormControl(''),
      'parent':new FormControl(''),
      'child':new FormControl('')
    });
    
    this.makermodelformchild=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "configuration":new FormControl(""),
      "label_group":new FormControl(""),
      "label_type":new FormControl(""),
      "productArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "subarr":this.fb.array([
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
      "subarr":this.fb.array([
        this.fb.group({
          "spec_name":new FormControl("")
        })
      ])

    });
    // (((((this.makermodelformchild.get("productArray") as FormArray))).at(0) as FormGroup).get('child') as FormArray).clear();
    (this.makermodelformchild.get("productArray") as FormArray).clear();
    this.nopformsummary_array=this.fb.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "productArray":this.fb.array([
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

    this.sms_makemodel_new_form=this.fb.group({
      "productname":new FormControl(""),
      "make_id":new FormControl(0),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "main_enb":new FormControl(false),
      
      "mainArray":this.fb.array([
        this.fb.group({
          "parent_id":new FormControl(""),
          "parent_name":new FormControl(""),
          "Child_name":new FormControl(""),
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
    (((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(0) as FormGroup).get('model_array') as FormArray).clear();
    (this.sms_makemodel_new_form.get("mainArray") as FormArray).clear();
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
          "parent_name":new FormControl(""),
          "parent_id":new FormControl(""),
          "Child_name":new FormControl(""),
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
    // this.makermodelformsummary=this.fb.group({
    //   productname:new FormControl(""),
    //   labelname:new FormControl(""),
    //   "labeltype":new FormControl("")

    // });
    this.share.getassetcategorynew('',1).subscribe(data=>{
      this.categorylist=data['data']
    });
    this.share.getAMProductdropdown(1,'','').subscribe(data=>{
      this.productlist=data['data']
    });
    this.smsassetcat.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
      this.nopsearch.get('asset_name').valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
      
        switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
          finalize(()=>{
            console.log("value=>",value)
            this.isLoading=false;
          })
        ))
        ).subscribe(productdata=>{
          this.productlist=productdata['data'];
        });
        this.share.getAMProductdropdown(1,'','').subscribe(data=>{
          this.productlist1=data['data']
        });
        this.sms_makemodel_new_form.get('productname').valueChanges.pipe(
          tap(()=>{
            this.isLoading=true;
          }),
        
          switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
            finalize(()=>{
              console.log("value=>",value)
              this.isLoading=false;
            })
          ))
          ).subscribe(productdata=>{
            this.productlist1=productdata['data'];
          });
          
          this.share.getAMProductdropdown(1,'','').subscribe(data=>{
            this.productlist2=data['data']
          });
          this.nopchildedit.get('asset_name').valueChanges.pipe(
            tap(()=>{
              this.isLoading=true;
            }),
          
            switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
              finalize(()=>{
                console.log("value=>",value)
                this.isLoading=false;
              })
            ))
            ).subscribe(productdata=>{
              this.productlist2=productdata['data'];
            });
            
    this.smsassetcat.get('subcat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.share.getassetcategorynew( this.smsassetcat.get('subcat').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.categorylist=data['data'];
    });
    this.nopchildedit.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
      this.nopsearch.get('asset_name').valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
      
        switchMap((value:any)=>this.share.getAMProductdropdown(1,value,'').pipe(
          finalize(()=>{
            console.log("value=>",value)
            this.isLoading=false;
          })
        ))
        ).subscribe(productdata=>{
          this.productlist=productdata['data'];
        });
    this.nopchildedit.get('subcat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.share.getassetcategorynew( this.nopchildedit.get('subcat').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.categorylist=data['data'];
    });
    this.smsassetcat.get('parent_name_list').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
        }),
        switchMap(value => this.share.getNOPParent(this.smsassetcat.get('asset_name').value.id,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productspecificationArray = datas;
      });
      this.smsassetcat.get('parent_name_list').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
        }),
        switchMap(value => this.share.getNOPChilddropdown(this.smsassetcat.get('asset_name').value.id, this.smsassetcat.get('parent_name_list').value.id,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productchildArray = datas;
      });
    this.getApi(); 
  }
  public assetcategory(data ?:assetsubcat):string | undefined{
    return data?data.name:undefined;
  }
  public parent(parenttype ?:parentname):string | undefined{
    return parenttype?parenttype.errorcategory_name:undefined;
  }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  public assetnameinterface1(data?:productedit):string | undefined{
    return data?data.name:undefined;
  }
  public assetnameinterface3(data?:productupdate):string | undefined{
    return data?data.name:undefined;
  }
  public parentname1(data ?:parentname1):string | undefined{
    return data?data.errorcategory_name:undefined;
  }
  
 
  abcclr:boolean=false;
  abcclr1:boolean=false;
  sortOrderabc:any;
  getApi(){
    
    this.spinner.show();
    if (this.abcclr == true){
      this.abcclr=true;
    }
    else if(this.abcclr1 == true){
      this.abcclr1=true;
    }
    else{
      this.abcclr=true;
      this.abcclr1=false;
    }
    if (this.sortOrderabc != undefined && this.sortOrderabc != null &&this.sortOrderabc != ''){
      this.sortOrderabc=this.sortOrderabc
    }
    else  {
      this.sortOrderabc='asce'
    }
    let asset_name:any=this.nopsearch.value.asset_name?this.nopsearch.value.asset_name.id:'';
    let parent:any=this.nopsearch.value.parent?this.nopsearch.value.parent:'';
    let child:any=this.nopsearch.value.child?this.nopsearch.value.child:'';

    this.share.NOPSummary(this.presentpage,asset_name,parent,child,this.sortOrderabc).subscribe((data) => {
      this.spinner.hide();
      this.nop_screen=true;
      this.ismakemodel=false;
      this.edit_parent_screen=false;
      this.nopsummary= data['data'];   
      let pagination=data['pagination'];
      this.has_previous=pagination.has_previous;
      this.has_next=pagination.has_next;
      this.presentpage=pagination.index;
      // this.spinner.hide();
      console.log(data);
      
    
      
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
    };
    getabcascdec(data,num){
      this.spinner.show();
      this.sortOrderabc=data;
      if (num==1){
        this.abcclr=true;
        this.abcclr1=false;
      }
      if (num==2){
        this.abcclr=false;
      this.abcclr1=true;
      }
      let asset_name:any=this.nopsearch.value.asset_name?this.nopsearch.value.asset_name.id:'';
      let parent:any=this.nopsearch.value.parent?this.nopsearch.value.parent:'';
      let child:any=this.nopsearch.value.child?this.nopsearch.value.child:'';
  
      this.share.NOPSummary(this.presentpage,asset_name,parent,child,this.sortOrderabc).subscribe((data) => {
        this.spinner.hide();
        this.nopsummary= data['data'];
        this.nopsummary.forEach((data)=>{
          data['enb_pro']=false;
        })
        let pagination=data['pagination'];
        this.has_previous=pagination.has_previous;
        this.has_next=pagination.has_next;
        this.presentpage=pagination.index;
        this.spinner.hide();
        console.log(data);
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      };
  previousdata(){
    if(this.has_previous){
      this.presentpage -=1;
      this.getApi();
    }
  }
  nextdata(){
    if(this.has_next){
      this.presentpage +=1;
      this.getApi();
  }
  }
  getnopsearchApi(){
    this.spinner.show();
    if (this.abcclr == true){
      this.abcclr=true;
    }
    else if(this.abcclr1 == true){
      this.abcclr1=true;
    }
    else{
      this.abcclr=true;
      this.abcclr1=false;
    }
    if (this.sortOrderabc != undefined && this.sortOrderabc != null &&this.sortOrderabc != ''){
      this.sortOrderabc=this.sortOrderabc
    }
    else  {
      this.sortOrderabc='asce'
    }
    let asset_name:any=this.nopsearch.value.asset_name?this.nopsearch.value.asset_name.id:'';
    let parent:any=this.nopsearch.value.parent?this.nopsearch.value.parent:'';
    let child:any=this.nopsearch.value.child?this.nopsearch.value.child:'';

    this.share.getNOPSummary(this.presentpage,asset_name,parent,child,this.sortOrderabc).subscribe((data) => {
      this.spinner.hide();

      this.nopsummary= data['data'];

      let pagination=data['pagination'];
      this.has_previous=pagination.has_previous;
      this.has_next=pagination.has_next;
      this.presentpage=pagination.index;
      this.spinner.hide();
      console.log(data);
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
    };
    resetdata(){
      this.nopsearch.reset('');
      this.getnopsearchApi();
    }
  

  NOPEdit(d){
    if(d==0){
      this.addNew = false;
      this.addChild = false;
    }
    else if(d!=0){
      this.addNew = true;
      this.addChild = false;
    }
  }
  addChildClickStart(d){
    let subcat:any=0;
    let asset_name:any=this.smsassetcat.get('asset_name').value.id;
    console.log('subcat',subcat);
    console.log('childStart',d);
  
    this.spinner.show();
    this.share.getNOPChild(this.pageNumber = 1, this.pageSize = 10, d.errorcategory_parentid,asset_name).subscribe((data) => {
      console.log(data);
      let datas:Array<any> = data["data"];
     
      this.framedata={
        "errorcategory_name": "ADD",
        "errorcategory_parent": "0",
        "errorcategory_parentid": 1,
        "errorcategory_status": 1,
        "id": 0
    };
    datas.push(this.framedata)
      this.listcomments.push(datas);
      
      console.log('mainDir',this.listcomments)
      this.addChild=true;
      this.spinner.hide();
      this.textEnable=false;
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
  }
  addChildClick(d,i){
    this.listcomments=this.listcomments.splice(0,i+1);
    
    if(d.errorcategory_name=='ADD'){
      this.textEnable=false;
      this.addChild=false;
      if(i==0){
           this.framedata={
        "errorcategory_name": "ADD",
        "errorcategory_parent": "0",
        "errorcategory_parentid": 1,
        "errorcategory_status": 1,
        "id": 0
    };
      }
  
      return true;
    }
    else{
      this.parent_id=d.id;
      this.textEnable=true;
      this.addChild=true;
    }
    this.addNew=true;
    console.log('child',d);
    let subcat:any=0;
   
    let asset_name:any=this.smsassetcat.get('asset_name').value.id;
    console.log('subcat',subcat);
    this.spinner.show();
    this.share.getNOPChild(this.pageNumber = 1, this.pageSize = 10, d.id,asset_name).subscribe((data) => {
      console.log(data);
      let datas:Array<any> = data["data"];
      this.spinner.hide();
      this.framedata={
        "errorcategory_name": "ADD",
        "errorcategory_parent": "0",
        "errorcategory_parentid": 1,
        "errorcategory_status": 1,
        "id": d.id
    }
      if(datas.length>0){
       this.framedata={
          "errorcategory_name": "ADD",
          "errorcategory_parent": "0",
          "errorcategory_parentid": 1,
          "errorcategory_status": 1,
          "id": d.id
      }

        datas.push(this.framedata);
        this.listcomments.push(datas);
        this.addChild=true;
        this.textEnable=false;
      }
      else{
        this.addChild=true;
        this.textEnable=false;
      }
     console.log('eeeeee=',this.listcomments)
      this.spinner.hide();
      
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
    }
    
  addNop(){
    this.addChild=true;
    this.textEnable=false;
  }

  saveTxt(){
    if(this.nopform.valid){
      this.textEnable=false;
    }
    else if(this.nopform.invalid){
      this.textEnable=true;
    }
  }
  saveTxt1(){
    if(this.nopeditform.valid){
      this.textEnable=false;
    }
    else if(this.nopeditform.invalid){
      this.textEnable=true;
    }
  }
  kyenbdata1(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  childname:any
  saveNOP(){
    
    if(this.smsassetcat.get('asset_name').value.id ==undefined || this.smsassetcat.get('asset_name').value==undefined || this.smsassetcat.get('asset_name').value.id==''){
      this.toastr.warning('Please Select The Product Name');
      return false;
    }
    let subcat:any=0;
   
    let asset_name:any=this.smsassetcat.get('asset_name').value.id;
    console.log('asset_name',asset_name);
    let sdata:any='';
    let parentid:any;
    let errorcategory_parent:any='N';
    let childname=''
    let errorcategory_name=this.smsassetcat.get('childNOP').value.id
    if (errorcategory_name){
      childname=this.smsassetcat.get('childNOP').value.errorcategory_name
    }
    else{
      childname=this.smsassetcat.get('childNOP').value
    }
    
   
    
     let d:any={
    "errorcategory_name":childname,
    "errorcategory_parent":errorcategory_parent,
    "errorcategory_parentid":this.smsassetcat.get('parent_name_list').value.id,
    "errorcategory_status":1,
    "subcat_id":subcat,
    "asset_name":asset_name
 
  }
  console.log('data',d)
    this.share.getNOPparentadd(d).subscribe(data=>{
      if(data['status']=='success'){
        this.toastr.success(data['message']);
        this.textEnable=true;
        this.addChild=true;
        this.listcomments=[];
        this.nopform.reset();
        this.getApi();
        this.smsassetcat.get('childNOP').patchValue('');
      }
      else{
        // this.toastr.success(data['code']);
        this.toastr.error(data['description']);
      }
    });

  }

  finalSubmitted(){

  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  autocompletecategory(){
    setTimeout(()=>{
    if(this.matcategory && this.autocompletetrigger && this.matcategory.panel){
      fromEvent(this.matcategory.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matcategory.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matcategory.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcategory.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcategory.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_nextcategory == true){
              this.share.getassetcategorynew(this.inputcategory.nativeElement.value, this.has_presentcategory+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.categorylist=this.categorylist.concat(data['data']);
                if(this.categorylist.length>0){
                  this.has_nextcategory=datapagination.has_next;
                  this.has_previouscategory=datapagination.has_previous;
                  this.has_presentcategory=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
  };
  autocompleteproductname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
        fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.share.getAMProductdropdown( this.has_prodpresentpage+1,this.smsassetcat.get('asset_name').name,this.smsassetcat.get('asset_name').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.productlist=this.productlist.concat(dear);
                 if(this.productlist.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }
  autocompleteproductname2(){
    console.log('second');
    setTimeout(()=>{
      if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
        fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.share.getAMProductdropdown( this.has_prodpresentpage+1,this.nopchildedit.get('asset_name').name,this.nopchildedit.get('asset_name').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.productlist2=this.productlist2.concat(dear);
                 if(this.productlist2.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }

  autocompleteproductname1(){
    console.log('second');
    setTimeout(()=>{
      if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
        fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.share.getAMProductdropdown( this.has_prodpresentpage+1,this.sms_makemodel_new_form.get('productname').name,this.sms_makemodel_new_form.get('productname').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.productlist1=this.productlist1.concat(dear);
                 if(this.productlist1.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }
  createspecificationsdata(){
    console.log(this.smsassetcat.value);
      if(this.smsassetcat.get('asset_name').value.id==undefined || this.smsassetcat.get('asset_name').value.id==null || this.smsassetcat.get('asset_name').value.id == ''){
        this.notification.showWarning('Please Select Any Product Name');
        return false;
      }
      if(this.nopform.get('parent_name').value == undefined || this.nopform.get('parent_name').value == '' || this.nopform.get('parent_name').value == ""){
        this.notification.showWarning('Please Fill The Parent Name');
        console.log(this.parent_name.value )
        return false;
      }
      
   
    let errorcategory_parent='Y';
  
    let parentid=0;
    let data:any={
    "errorcategory_name":this.nopform.get('parent_name').value,
    "errorcategory_parent":errorcategory_parent,
    "errorcategory_parentid":parentid,
    "errorcategory_status":1,
    "subcat_id":0,
    "asset_name":this.smsassetcat.get('asset_name').value.id
    
  }
  console.log('data',data)
     
      console.log(data);
      this.share.getNOPparentadd(data).subscribe(dta=>{
        if (dta['status']=='success'){
        this.notification.showSuccess('Parent Added Successfully');
        this.modalclosesub.nativeElement.click();
      this.parent_name.patchValue({'parent_name':''});
      this.parent_name.patchValue({'parent_name':''});
        }
      if (dta['code']=='DUPLICATE NAME'){
        this.spinner.hide()
        this.notification.showError(dta['description']);
      }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
        
      }
      );
      
    }
     clicktablevisible(){
      if(this.smsassetcat.get('parent_name_list').value ==null || this.smsassetcat.get('parent_name_list').value =='' || this.smsassetcat.get('parent_name_list').value==undefined){
        this.notification.showWarning('Please select The Parent Name');
        return false;
      }
      if(this.smsassetcat.get('childNOP').value==null || this.smsassetcat.get('childNOP').value==undefined || this.smsassetcat.get('childNOP').value==''){
        this.notification.showWarning('Please Enter the Child Name');
        return false;
      }
      this.table_visible=true;
      let dear:any=this.table_data.length+1;
      let dta:any={'No':dear,"parent_name_list":this.smsassetcat.get('parent_name_list').value.errorcategory_name,"childNOP":this.smsassetcat.get('childNOP').value};
      this.table_data.push(dta);
      console.log(this.smsassetcat.get('parent_name_list').value)
      this.smsassetcat.get('parent_name_list').patchValue('');
      this.smsassetcat.get('childNOP').patchValue('');
    }
    deletedata(data){
      let idex=this.table_data.indexOf(data);
      this.table_data.splice(idex);
      if(this.table_data.length>0){
        this.table_visible=true;
      }
      else{
        this.table_visible=false;
      }
    }
    getproductspecificationclick(){
      let data:any='';
      if(this.smsassetcat.get('asset_name').value.id==undefined || this.smsassetcat.get('asset_name').value=='' || this.smsassetcat.get('asset_name').value.id==null){
        this.notification.showError('Please Select Any Product Name');
        return false;
        
      }
      if(this.smsassetcat.get('parent_name_list').value==undefined || this.smsassetcat.get('parent_name_list').value=='' || this.smsassetcat.get('parent_name_list').value==""){
        data='';
      }
      else{
        data=this.smsassetcat.get('parent_name_list').value;
      }
      this.share.getNOPParent(this.smsassetcat.get('asset_name').value.id,data,1).subscribe(data=>{        console.log(data['data']);
        this.productspecificationArray=data['data'];

      });
      this.smsassetcat.get('parent_name_list').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
        }),
        switchMap(value => this.share.getNOPParent(this.smsassetcat.get('asset_name').value.id,this.smsassetcat.get('parent_name_list').value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productspecificationArray = datas;
      });
    }
    getproductchildnclick(){
      let data:any='';
      if(this.smsassetcat.get('asset_name').value.id==undefined || this.smsassetcat.get('asset_name').value=='' || this.smsassetcat.get('asset_name').value.id==null){
        this.notification.showError('Please Select Any Product Name');
        return false;
        
      }
      if(this.smsassetcat.get('parent_name_list').value.id==undefined || this.smsassetcat.get('parent_name_list').value.id=='' || this.smsassetcat.get('parent_name_list').value.id==""){
        this.notification.showError('Please Select Any Product Name');
        return false;
      }
     
      this.share.getNOPChilddropdown(this.smsassetcat.get('asset_name').value.id,this.smsassetcat.get('parent_name_list').value.id,data,1).subscribe(data=>{        
        console.log(data['data']);
        this.productchildArray=data['data'];

      });
      this.smsassetcat.get('childNOP').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
        }),
        switchMap(value => this.share.getNOPChilddropdown(this.smsassetcat.get('asset_name').value.id,this.smsassetcat.get('parent_name_list').value.id,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productchildArray = datas;
      });
    }
      getproductspecificationclick1(){
        let data:any='';
        if(this.nopchildedit.get('asset_name').value.id==undefined || this.nopchildedit.get('asset_name').value=='' || this.nopchildedit.get('asset_name').value.id==null){
          this.notification.showError('Please Select Any Product Name');
          return false;
          
        }
        if(this.nopchildedit.get('parent_name_list').value==undefined || this.nopchildedit.get('parent_name_list').value=='' || this.nopchildedit.get('parent_name_list').value==""){
          data='';
        }
        else{
          data=this.nopchildedit.get('parent_name_list').value;
        }
        this.share.getNOPParent(this.nopchildedit.get('asset_name').value.id,data,1).subscribe(data=>{        console.log(data['data']);
          this.productspecificationArray1=data['data'];
  
        });
        this.nopchildedit.get('parent_name_list').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
          }),
          switchMap(value => this.share.getNOPParent(this.nopchildedit.get('asset_name').value.id,this.smsassetcat.get('parent_name_list').value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.productspecificationArray1 = datas;
        });
    }
     getproductspecificationscrool(){
      setTimeout(() => {
        if (
          this.matspecication &&
          this.autocompleteTrigger &&
          this.matspecication.panel
        ) {
          fromEvent(this.matspecication.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matspecication.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matspecication.panel.nativeElement.scrollTop;
              const scrollHeight = this.matspecication.panel.nativeElement.scrollHeight;
              const elementHeight = this.matspecication.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_specificationnext === true) {
                  this.share.getNOPParent(this.smsassetcat.get('asset_name').value.id,this.parent_nameinput.nativeElement.value,this.has_specificationpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      console.log('pagination=',results)
                      let datapagination = results["pagination"];
                      this.productspecificationArray= this.productspecificationArray.concat(results);
                      if (this.productspecificationArray.length >= 0) {
                        this.has_specificationnext = datapagination.has_next;
                        this.has_specificationpre = datapagination.has_previous;
                        this.has_specificationpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    getproductspecificationscrool1(){
      setTimeout(() => {
        if (
          this.matspecication &&
          this.autocompleteTrigger &&
          this.matspecication.panel
        ) {
          fromEvent(this.matspecication.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matspecication.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matspecication.panel.nativeElement.scrollTop;
              const scrollHeight = this.matspecication.panel.nativeElement.scrollHeight;
              const elementHeight = this.matspecication.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_specificationnext === true) {
                  this.share.getNOPParent(this.nopchildedit.get('asset_name').value.id,this.parent_nameinput.nativeElement.value,this.has_specificationpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      console.log('pagination=',results)
                      let datapagination = results["pagination"];
                      this.productspecificationArray1= this.productspecificationArray1.concat(results);
                      if (this.productspecificationArray1.length >= 0) {
                        this.has_specificationnext = datapagination.has_next;
                        this.has_specificationpre = datapagination.has_previous;
                        this.has_specificationpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
   
    onCancelClick() {
      this.smsassetcat.get('parent_name_list').patchValue('');
      this.smsassetcat.get('childNOP').patchValue('');
      this.smsassetcat.get('subcat').patchValue('');
      this.smsassetcat.get('asset_name').patchValue('');
      

    
    }
    nopeditonCancelClick() {
      this.nopchildedit.get('parent_name_list').patchValue('');
      this.nopchildedit.get('childNOP').patchValue('');
      this.nopchildedit.get('subcat').patchValue('');
      this.nopchildedit.get('asset_name').patchValue('');
      

    }
    validateNumber(e: any) {
      let input = String.fromCharCode(e.charCode);
      const reg = /^\d*(?:[.,]\d{1,2})?$/;
  
      if (!reg.test(input)) {
        e.preventDefault();
      }
    }
    getactiveinactive(data:any){
      let senddata:any={'errorcategory_status':data.errorcategory_status,'errorcategory_parent':data.id};
      this.share.nopparentActInactive(senddata).subscribe(result=>{
        if(result['status']=='success'){
          this.notification.showSuccess(result['message']);
          this.getApi();
        }
        else{
          this.notification.showError(result['code']);
          this.notification.showError(result['description']);
        }
      })
    }
  edit_parent_screen=false;
  nop_parent_name:any;
  clicktoview(d:any){
    this.spinner.show();
      let parentname=d.errorcategory_name
      let parentid=d.id
      this.edit_parent_screen=true;
      this.ismakemodel=false;
      this.nop_screen=false;
      this.nop_parent_name=parentname
      let asset_name:any=this.nopsearch.value.asset_name?this.nopsearch.value.asset_name.id:'';
      let parent:any=this.nopsearch.value.parent?this.nopsearch.value.parent:'';
      let child:any=this.nopsearch.value.child?this.nopsearch.value.child:'';
  
      this.share.getNOPparent_summary(parentid).subscribe((data) => {
        this.spinner.hide(); 
        this.nopsummary_parent= data['data'];
     
        
     
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      };
  nop_edit_list:Array<any>=[];
  child_name:any;
  child_single_id:''
  nopchildEdit(child:any){
    let child_id=child.child_id
    this.spinner.show();
    this.share.getNOPchild_edit(child_id).subscribe((data) => {
      this.spinner.hide();
      this.nop_edit_list=data['data']
      console.log(data['data'])
      this.nopchildedit.get('id').patchValue(this.nop_edit_list[0]['child_id']);
      this.child_name=this.nop_edit_list[0]['child_name']
      this.nopchildedit.get('asset_name').patchValue({'id':this.nop_edit_list[0]['asset_name']['id'],'code':this.nop_edit_list[0]['asset_name']['code'],'name':this.nop_edit_list[0]['asset_name']['name']});
      this.nopchildedit.get('parent_name_list').patchValue({'id':this.nop_edit_list[0]['parent_id'],'code':this.nop_edit_list[0]['parent_code'],'errorcategory_name':this.nop_edit_list[0]['parent_name']});
      this.nopchildedit.get('childNOP').patchValue(this.nop_edit_list[0]['child_name']);
      

    })





  }
  nopchildEditDelete(d:any){
    let child= d.child_id
    this.spinner.show();
    this.share.getNOPchild_delete(child).subscribe((data) => {
      this.spinner.hide();
      if(data['status']=='success'){
        this.toastr.success(data['message']); 
        this.edit_parent_screen=false;
        this.spinner.show();
        this.nop_screen=true;
        this.ismakemodel=false;
        this.spinner.hide();
        this.getApi()    
      }
      else{
        this.notification.showError(data['code']);
        this.notification.showError(data['description']);
      }

    })

  }
 
//   disables(d){
//     if(d.child_status=="DELETED"){
//       return true;
//     }else{
//       return false;
//     }
    


//  }

 nopback(){
  this.edit_parent_screen=false;
  this.nop_screen=true;
  this.ismakemodel=false;
  this.getApi()


 }
 id :any
 d:any
 updateNOP(){
 
  if(this.nopchildedit.get('asset_name').value.id ==undefined || this.nopchildedit.get('asset_name').value==undefined || this.nopchildedit.get('asset_name').value.id==''){
    this.toastr.warning('Please Select The Product Name');
    return false;
  }
  let subcat:any=0;
  let asset_name:any=this.nopchildedit.get('asset_name').value.id;
  console.log('asset_name',asset_name);
  let sdata:any='';
  let parentid:any;
  let errorcategory_parent:any='N';
  let single_child_id=this.nopchildedit.get('id').value?this.nopchildedit.get('id').value:''
 
  if (single_child_id !='' && this.child_name!=this.nopchildedit.get('childNOP').value){
      this.d={
        "id":single_child_id,
      "errorcategory_name":this.nopchildedit.get('childNOP').value,
      "errorcategory_parent":errorcategory_parent,
      "errorcategory_parentid":this.nopchildedit.get('parent_name_list').value.id,
      "errorcategory_status":1,
      "subcat_id":subcat,
      "asset_name":asset_name
      
    }
  }
  else{
    this. d={
    "errorcategory_name":this.nopchildedit.get('childNOP').value,
    "errorcategory_parent":errorcategory_parent,
    "errorcategory_parentid":this.nopchildedit.get('parent_name_list').value.id,
    "errorcategory_status":1,
    "subcat_id":subcat,
    "asset_name":asset_name
  }
}
console.log('data',this.d)
  this.spinner.show()
  this.share.getNOPparentadd(this.d).subscribe(data=>{
    this.spinner.hide()
    if(data['status']=='success'){
      this.toastr.success(data['message']);
      this.textEnable=true;
      this.addChild=false;
      this.edit_parent_screen=false;
      this.spinner.show();
      this.nop_screen=true;
      this.ismakemodel=false;
      this.spinner.hide();
      // this.getApi()    
      this.listcomments=[];
      this.nopchildedit.reset();
      this.getApi();
      this.nopchildedit.get('childNOP').patchValue('');
    }
    else{
     
      this.toastr.error(data['description']);
    }
  });

}
createspecificationsdata1(){
  console.log(this.nopeditform.value);
    if(this.nopchildedit.get('asset_name').value.id==undefined || this.nopchildedit.get('asset_name').value.id==null || this.nopchildedit.get('asset_name').value.id == ''){
      this.notification.showWarning('Please Select Any Product Name');
      return false;
    }
    if(this.nopeditform.get('parent_name').value == undefined || this.nopeditform.get('parent_name').value == '' || this.nopeditform.get('parent_name').value == ""){
      this.notification.showWarning('Please Fill The Parent Name');
      console.log(this.parent_name.value )
      return false;
    }

  let errorcategory_parent='Y';
  let parentid=0;
  let data:any={
  "errorcategory_name":this.nopeditform.get('parent_name').value,
  "errorcategory_parent":errorcategory_parent,
  "errorcategory_parentid":parentid,
  "errorcategory_status":1,
  "subcat_id":0,
  "asset_name":this.nopchildedit.get('asset_name').value.id
 
}
console.log('data',data)
   this.spinner.show()
    console.log(data);
    this.share.getNOPparentadd(data).subscribe(dta=>{
      if (dta['status']=='success'){
      this.spinner.hide()
      this.notification.showSuccess('Parent Added Successfully');
      this.modalclosesub.nativeElement.click();
    this.parent_name.patchValue({'parent_name':''});
  
    }
    if (dta['code']=='DUPLICATE NAME'){
      this.spinner.hide()
      this.notification.showError(dta['description']);
    }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      
    }
    );
    
  }
      
  update_parentname(p:any,Index:any){
    let errorcategory_parent='Y';
    let parentid=0;
    let data:any={
    "id":p.parent_id,
    "errorcategory_name":this.parentvalue,
    "errorcategory_parent":errorcategory_parent,
    "errorcategory_parentid":parentid,
    "errorcategory_status":1,
    "subcat_id":0,
    "asset_name":p.asset_name.id
   
  }
  console.log('data',data)
     this.spinner.show()
      console.log(data);
      this.share.getNOPparentadd(data).subscribe(dta=>{
        if (dta['status']=='success'){
        this.spinner.hide()
        this.nopback()
        this.notification.showSuccess('Parent Added Successfully');
      // this.parent_name.patchValue({'parent_name':''});
     
      }
      if (dta['code']=='DUPLICATE NAME'){
        this.spinner.hide()
        this.notification.showError(dta['description']);
      }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
        
      }
      );
      
   


  }
  parentvalue:any
  smsnopchange(e) {   
      this.parentvalue = e.target.value;
  }
  expandenbdata(data:any,ind:number){
    
    console.log(data);
    for(let i=0;i<this.nopsummary.length;i++){
      if(i==ind){
        this.nopsummary[i]['enb_pro']=!this.nopsummary[i]['enb_pro'];
        this.new_par_childList_new=[];
      }
    else{
      this.nopsummary[i]['enb_pro']=false;

    }
     
    }
    // (this.makermodelformchild.get('productArray') as FormArray).clear();
    // (this.makermodelformchild.get('subarr') as FormArray).clear();
    // let product_name=data?.asset_name?.name
    let data_list:any=data['alldata'];
    for(let i=0;i<data_list.length;i++){
      // if (product_name===data.asset_name.name){
      this.new_par_childList_new.push({"id":data_list[i].parent.parent_id,"name":data_list[i].parent.parent_name,
    "child":data_list[i].child});
    // }
  }
  }
  getchildcrool(){
    setTimeout(() => {
      if (
        this.child &&
        this.autocompleteTrigger &&
        this.child.panel
      ) {
        fromEvent(this.child.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.child.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.child.panel.nativeElement.scrollTop;
            const scrollHeight = this.child.panel.nativeElement.scrollHeight;
            const elementHeight = this.child.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_childnext === true) {
  
                  this.share.getNOPChilddropdown(this.smsassetcat.get('asset_name').value.id,this.parent_nameinput.nativeElement.value.id,this.child_nameinput.nativeElement.value,this.has_specificationpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.productchildArray= this.productchildArray.concat(results);
                    if (this.productchildArray.length >= 0) {
                      this.has_childnext = datapagination.has_next;
                      this.has_childpre = datapagination.has_previous;
                      this.has_childpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
    
  }

  
  prouctcheck_new_fa_make_navigate(data:any){
    // this.isassetcategory = false;
    // this.isassetlocation = false;
    // this.isassetcategorys = false;
    // this.isspecification=false;
    // this.ismakemodelsumary=false;
    this.ismakemodel=true;
    this.nop_screen=false;
    // this.isspecification=false;
    // this.isspecificationsummary=false;
    // (this.makermodelform.get('mainArray') as FormArray).clear();
    let datamake:any=data.id;
    let dataprod:any=data
    // this.productlist1=dataprod
    if (this.abcclr == true){
      this.abcclr=true;
    }
    else if(this.abcclr1 == true){
      this.abcclr1=true;
    }
    else{
      this.abcclr=true;
      this.abcclr1=false;
    }
    if (this.sortOrderabc != undefined && this.sortOrderabc != null &&this.sortOrderabc != ''){
      this.sortOrderabc=this.sortOrderabc
    }
    else  {
      this.sortOrderabc='asce'
    }
    let asset_name1:any=data.id;
    this.sms_makemodel_new_form.get("productname").patchValue({'name':dataprod.name,'id':dataprod.id,'code':dataprod.code})
    let parent:any=this.sms_makemodel_new_form.value.parent?this.nopsearch.value.parent:'';
    let child:any=this.sms_makemodel_new_form.value.child?this.nopsearch.value.child:'';
    this.spinner.show();
    this.share.NOPSummary(this.presentpage1,asset_name1,parent,child,this.sortOrderabc).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
        this.specificationsummary=[];
      }
      else{

       console.log(result.data);
       (this.sms_makemodel_new_form.get("mainArray") as FormArray).clear();
       if(result.data.length>0){
        let data_make=result.data[0];
        for(let i=0;i<data_make['alldata'].length;i++){
         let data_model:any=[];
         for(let j=0;j<data_make['alldata'][i]['child'].length;j++){
           data_model.push(this.fb.group({
            //  "id":new FormControl(data_make['alldata'][i]['child'][j]['child_id']),
             "main_enb":true,
            
             "name":new FormControl(data_make['alldata'][i]['child'][j]['child_name'])
           }));
 
         }
         (this.sms_makemodel_new_form.get("mainArray") as FormArray).push(
           this.fb.group({
            "parent_name":new FormControl(data_make['alldata'][i]['parent']['parent_name']),
             "parent_id":new FormControl(data_make['alldata'][i]['parent']['parent_id']),
             "main_enb":new FormControl(true),
             "Child_name":new FormControl(""),
             "model_array":this.fb.array(data_model)
           })
         )
 
 
        }
       }
      
       console.log(this.sms_makemodel_new_form.value);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }
  
  addnew_child_data(i:any){
    // updateNOP(){
 
      if(this.sms_makemodel_new_form.get('productname').value.id ==undefined || this.sms_makemodel_new_form.get('productname').value==undefined || this.sms_makemodel_new_form.get('productname').value.id==''){
        this.toastr.warning('Please Select The Product Name');
        return false;
      }
      let subcat:any=0;
      let asset_name:any=this.sms_makemodel_new_form.get('productname').value.id;
      console.log('asset_name',asset_name);
      let sdata:any='';
      let parentid:any;
      let errorcategory_parent:any='N';
      // let single_child_id=this.sms_makemodel_new_form.get('id').value?this.nopchildedit.get('id').value:''
     
      
      {
        this. d={
        "errorcategory_name":this.sms_makemodel_new_form.controls.mainArray.value[i].Child_name,
        "errorcategory_parent":errorcategory_parent,
        "errorcategory_parentid":this.sms_makemodel_new_form.controls.mainArray.value[i].parent_id,
        "errorcategory_status":1,
        "subcat_id":subcat,
        "asset_name":asset_name
      }
    }
    console.log('data',this.d)
      this.spinner.show()
      this.share.getNOPparentadd(this.d).subscribe(data=>{
        this.spinner.hide()
        if(data['status']=='success'){
          this.toastr.success(data['message']);
          this.textEnable=true;
          this.addChild=false;
          this.edit_parent_screen=false;
          this.spinner.show();
          this.nop_screen=true;
          this.ismakemodel=false;
          this.spinner.hide();
          // this.getApi()    
          this.listcomments=[];
          this.nopchildedit.reset();
          this.getApi();
          this.nopchildedit.get('childNOP').patchValue('');
        }
        else{
         
          this.toastr.error(data['description']);
        }
      });
    
    // }
    console.log(this.sms_makemodel_new_form.get('productname').value);
     let data_any:any=((this.sms_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("parent_name").value;
     if(data_any==undefined || data_any=="" || data_any==null){
       this.toastr.warning("Please Enter Valid Make Name..");
       return false;
     }
     let data:any=((this.sms_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("Child_name").value;
     if(data==undefined || data=="" || data==null){
       this.toastr.warning("Please Enter Valid Model Name..");
       return false;
     }
     console.log(data);
     let enb:boolean=false;
     let data_list_check:any=(((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).value;
     data_list_check.forEach(element => {
       if(String(element.name).toLowerCase()==String(data).toLowerCase()){
         enb=true;
       }
     });
     if(enb){
       this.toastr.warning("Duplicate Data");
       return false;
     }
     (((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).push(this.fb.group({  "id":0,  "main_enb":false, "name":data
   }));
   ((this.sms_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("Child_name").patchValue("");
     
   }
   addnew_sms_data(i:any){
    
    console.log(this.sms_makemodel_new_form.value);
    if(this.sms_makemodel_new_form.get('productname').value ==undefined || this.sms_makemodel_new_form.get('productname').value==null || this.sms_makemodel_new_form.get('productname').value==''){
      this.notification.showWarning("Please Select The Product Name..");
      return false;
    }
    (this.sms_makemodel_new_form.get("mainArray") as FormArray).push(
      this.fb.group({
               "parent_id":new FormControl(""),
                "parent_name":new FormControl(""),
                "Child_name":new FormControl(""),
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
    let data_len:any=(((this.sms_makemodel_new_form.get("mainArray") as FormArray))).length-1;
    if((((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).length==1){
      if (((((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value=="" || ((((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value==undefined){
        (((((this.sms_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).clear();
      }
    }
    console.log((this.sms_makemodel_new_form.get("mainArray") as FormArray).value);
  }
  sms_newparentchild_data(){
    console.log(this.sms_makemodel_new_form.value);
    if(this.sms_makemodel_new_form.value.productname.id==undefined || this.sms_makemodel_new_form.value.productname.id==null || this.sms_makemodel_new_form.value.productname.id==""){
      this.toastr.warning("Please Select The Product Name..")
      return false;
    }
    // if((((this.sms_makemodel_new_form.value.mainArray as FormArray))).length==0){
    //   this.toastr.warning("Please Select The Make and Model Data..");
    //   return false;
    // }
    let check_dup:boolean=false;
    let check_data_dup:any=[];
    let data_list:any=(((this.sms_makemodel_new_form.get("mainArray") as FormArray)).value);
    data_list.forEach((ele)=>{
      check_data_dup.push(ele.parent_name);
    });
    // data_list.forEach((ele,i)=>{
    //   check_data_dup.forEach((elem,j)=>{
    //     if((String(elem).toLowerCase().trim()==String(ele.parent_name).toLowerCase().trim()) && (i!=j)){
    //       check_dup=true;
    //     }
    //   });
    // });
    // if(check_dup){
    //   this.toastr.warning("Please Check Asset Make Duplicate Data Not Allowed");
    //   return false;
    // }

    let data_value=this.sms_makemodel_new_form.value;
    this.spinner.show();
    this.share.get_smsnop_create(data_value).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        // this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        // this.toastr.success(result.status);
        this.toastr.success(result.message);
        this.getApi();
      }
    // },
    // (error:HttpErrorResponse)=>{
    //   this.spinner.hide();
    //   this.toastr.error("Failed Load To Data..");

    }
    );
  }
  assetmakemodel(){
    // this.isassetcategory = false;
    // this.isassetlocation = false;
    // this.isassetcategorys = false;
    // this.isspecification=false;
    // this.ismakemodelsumary=true;
    this.ismakemodel=false;
    this.nop_screen=true;
    // this.isspecification=false;
    // this.isspecificationsummary=false;
    this.getApi();
  }
  // fa_new_modelsummaryfunction(){
  //   let dta:any='page='+this.hasmodel_sum_page;
  //   if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
  //    dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
  //   }
  //   this.spinner.show();
  //   this.Faservice.all_get_fa_makemodel_create(dta).subscribe((result:any)=>{
  //     this.spinner.hide();
  //     if(result.code!=undefined && result.code!=""){
  //       this.toastr.warning(result.description);
  //     }
  //     else{
  //       this.modelsummary=result['data'];
  //       if(this.modelsummary.length>0){
  //         this.hasmodel_sum_next=result['pagination'].has_next;
  //         this.hasmodel_sum_pre=result['pagination'].has_previous;
  //         this.hasmodel_sum_page=result['pagination'].index;
  //       }

  //     }
  //   },
  //  (error:HttpErrorResponse)=>{
  //   this.spinner.hide();
  //   this.modelsummary=[];
  //  } 
  //   );
  // }
}
