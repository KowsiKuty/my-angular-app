import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ValuechangecheckersummaryComponent } from 'src/app/fa/valuechangecheckersummary/valuechangecheckersummary.component';
import { SmsService } from '../sms.service';

export interface branch{
  id:string;
  name:string;
}
export interface product{
  id:string;
  name:string;
}
@Component({
  selector: 'app-sms-list-of-asset',
  templateUrl: './sms-list-of-asset.component.html',
  styleUrls: ['./sms-list-of-asset.component.scss']
})
export class SmsListOfAssetComponent implements OnInit {
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('checkerbranch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  // @ViewChild('branchidInput') branchidInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ctrl_branch_id: any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }

  searchdata = {
    "barcode": "",
    "branch": "",
    "product":"",
  }
  branchList:Array<any>=[];
  productlist:Array<any>=[];
  listcomments:any = [];
  datapagination:any=[];
  presentpagebuk: number = 1;
  pageSize = 10;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  Asset_id:number;
  branch:number;
  product:number;
  pageLength_popup:any=0;
  isLoading = false;
  has_nextbuk = true;
  has_previousbuk = true;
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  constructor(private router: Router, private share: SmsService, private http: HttpClient,
    private toastr:ToastrService, private spinner: NgxSpinnerService,
    private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef) { }

  ngOnInit(): void {
    this.assetgroupform =this.fb.group({
        'id':new FormControl(),
        'assettype':new FormControl(),
        'branch_name':new FormControl(),
        'asset_name':new FormControl()
      });    
    this.share.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.assetgroupform.get('branch_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.share.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )),
      ).subscribe(data=>{
        this.branchList=data['data'];
      });
    this.share.getAMProductdropdown(1,'','').subscribe(productdata=>{
        this.productlist=productdata['data'];
      }),
    this.assetgroupform.get('asset_name').valueChanges.pipe(
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
    this.getApi();
  }
  
  createAMC(){
    this.router.navigate(['/sms/smsamccreate'], { skipLocationChange: true })
  }

  createWarranty(){
    this.router.navigate(['/sms/smswarrantycreate'], { skipLocationChange: true })
  }
  public branchinterface(data?:branch):string | undefined{
    return data?data.name:undefined;
  }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  sortOrderlist:any
  loaclr:boolean=false;
  loaclr1:boolean=false;
  getApi(){
    if (this.loaclr == true){
      this.loaclr=true;
    }
    else if(this.loaclr1 == true){
      this.loaclr1=true;
    }
    else{
      this.loaclr=true;
      this.loaclr1=false;
    }
    if (this.sortOrderlist != undefined && this.sortOrderlist != null &&this.sortOrderlist != ''){
      this.sortOrderlist=this.sortOrderlist
    }
    else  {
      this.sortOrderlist='asce'
    }
    let assetid:any='';
    let type:any='';
    let branch:any='';
    let product:any='';
    this.spinner.show();
    this.share.getlistofassetdata_new(this.presentpagebuk, this.pageSize = 10,assetid,type,branch,product,this.sortOrderlist).subscribe((data) => {
      this.listcomments = data['data'];
      if(this.listcomments.length>0){
        this.pageLength_popup=this.listcomments[0]['count'];
      }
      this.spinner.hide();
      console.log(data);
      let pagination:any=data['pagination'];
      this.has_nextbuk=pagination.has_next;
      this.has_previousbuk=pagination.has_previous;
      this.presentpagebuk=pagination.index;
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
    }
    getlistascdec(data,num){
      this.sortOrderlist=data;
      if (num==1){
        this.loaclr=true;
        this.loaclr1=false;
      }
      if (num==2){
        this.loaclr=false;
      this.loaclr1=true;
      }
      let assetid:any='';
      let type:any='';
      let branch:any='';
      let product:any='';
      this.spinner.show();
      this.share.getlistofassetdata_new(this.presentpagebuk, this.pageSize = 10,assetid,type,branch,product,this.sortOrderlist).subscribe((data) => {
        this.listcomments = data['data'];
        if(this.listcomments.length>0){
          this.pageLength_popup=this.listcomments[0]['count'];
        }
        this.spinner.hide();
        console.log(data);
        let pagination:any=data['pagination'];
        this.has_nextbuk=pagination.has_next;
        this.has_previousbuk=pagination.has_previous;
        this.presentpagebuk=pagination.index;
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      }
    getAip_search(){
      let assetid:any=this.assetgroupform.get('id').value?this.assetgroupform.get('id').value:'';
      let type:any=this.assetgroupform.get('assettype').value?this.assetgroupform.get('assettype').value:'';
      let branch:any=this.assetgroupform.get('branch_name').value?this.assetgroupform.get('branch_name').value.id:'';
      let product:any=this.assetgroupform.get('asset_name').value?this.assetgroupform.get('asset_name').value.id:'';
      this.spinner.show();
      this.presentpagebuk=1;
      this.share.getlistofassetdata_new_search(this.presentpagebuk , this.pageSize = 10,assetid,type,branch,product).subscribe((data) => {
        this.listcomments = data['data'];
        if(this.listcomments.length>0){
          this.pageLength_popup=this.listcomments[0]['count'];
        }else{
          this.pageLength_popup=0;
        }
        this.spinner.hide();
        console.log(data);
        let pagination:any=data['pagination'];
        this.has_nextbuk=pagination.has_next;
        this.has_previousbuk=pagination.has_previous;
        this.presentpagebuk=pagination.index;
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      }
    resetdata(){
      this.assetgroupform.reset();
      this.getApi();
    }
  autocompleteScroll_branch(){

  }
  
  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk -=1;
      this.getApi();
    }
  }

  buknextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk +=1;
      this.getApi();
    }
  }

  active(){

  }

  edit(){

  }

  finalSubmitted(){

  }

  savesub(){

  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.share.getAMBranchdropdown( this.has_branchpresentpage+1,this.assetgroupform.get('branch_name').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }            
               })
             }
            }
          }
        )
      }
    })
  }
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
               
              this.share.getAMProductdropdown( this.has_prodpresentpage+1,this.assetgroupform.get('asset_name').name,this.assetgroupform.get('asset_name').id).subscribe((data:any)=>{
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
}