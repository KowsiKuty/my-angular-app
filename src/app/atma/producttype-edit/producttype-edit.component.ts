import { Component, OnInit, Output, EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
// import {ShareService} from '../../Master/share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete,MatAutocompleteTrigger, } from '@angular/material/autocomplete';
import { map, takeUntil } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';


 export interface prodlist{
  id:number;
  name:string;
 }


@Component({
  selector: 'app-producttype-edit',
  templateUrl: './producttype-edit.component.html',
  styleUrls: ['./producttype-edit.component.scss']
})
export class ProducttypeEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('prodcat') matprodcat:MatAutocomplete;
  @ViewChild('prodInput') matprodInput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  producttypeeditForm: FormGroup
  productcategoryList: Array<any>;
  currentpage =1;
  has_next:boolean=false;
  has_previous:boolean=false;
  isLoading:boolean;

  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,
    private atmaService: AtmaService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.producttypeeditForm = this.fb.group({
      productcategory_id: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
  })
  this.getProductTypeEdit();
  // this.getproductcategory();
  let prodkey:String="";
  this.getproductcategory(prodkey);
this.producttypeeditForm.get('productcategory_id').valueChanges
.pipe(
  debounceTime(100),
  distinctUntilChanged(),
  tap(()=>{
    this.isLoading=true;
  }),
  switchMap(value => this.atmaService.getproductcategory(value,1)
  .pipe(
    finalize(()=>{
      this.isLoading=false;
    }),
  ))
).subscribe((results:any[])=>{
  this.productcategoryList=results['data'];
})
}
  // private getproductcategory() {
  //   this.atmaService.getproductcategory()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productcategoryList = datas;
  //       console.log("productcat", datas)
  
  //     }, error => {
  //       return Observable.throw(error);
  //     })
  // }
  getproductcategory(prodkey){
    this.atmaService.getproductcategory().subscribe(data=>{
      this.productcategoryList=data['data'];
      if(this.productcategoryList.length>0){
        let datapagination =data['pagination'];
        this.has_next =datapagination.has_next;
        this.has_previous=datapagination.has_previous;
        this.currentpage=datapagination.index;
      }
    })
  }
  public prodcatinterface(data?: prodlist):string | undefined{
    return data? data.name:undefined
  }
  autocompleteprodcatscroll(){
    
    setTimeout(() => {
      if (
        this.matprodcat &&
        this.autocompleteTrigger &&
        this.matprodcat.panel
      ) {
        fromEvent(this.matprodcat.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matprodcat.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matprodcat.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodcat.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodcat.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.getproductcategory(this.matprodInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productcategoryList = this.productcategoryList.concat(datas);
                    if (this.productcategoryList.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

    getProductTypeEdit() {
      let id = this.shareService.productTypeEdit.value
      this.atmaService.getProductTypeEdit(id).subscribe((results: any) => {
        let ProductCategory = results.productcategory;
        let Code =results.code;
        let Name=results.name;
    
        
       
        this.producttypeeditForm.patchValue({
          productcategory_id:{'id':results?.productcategory?.id,'name':results?.productcategory?.name},
          name:Name,
          code:Code
       
         
        })
      })
   }
   producttype_editForm() {
    if (this.producttypeeditForm.value.productcategory_id.id===undefined || this.producttypeeditForm.value.productcategory_id==''|| this.producttypeeditForm.value.productcategory_id==null){
      this.toastr.error('Please Select The Product Category');
      // this.onCancel.emit()
      return false;
    }
    if (this.producttypeeditForm.value.name===""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      // this.onCancel.emit()
      return false;
    }
   
    let idValue: any = this.shareService.productTypeEdit.value
    let data :any={
      code:this.producttypeeditForm.get('code').value,
      name:this.producttypeeditForm.get('name').value,
      productcategory_id:this.producttypeeditForm.get('productcategory_id').value.id
    }
    this.atmaService.ProductTypeEdit(data, idValue.id)
      .subscribe(res => {
        if(res.status ==="success"){
          this.notification.showSuccess("Updated Successfully");
          this.onSubmit.emit();
        }
        else{
          this.notification.showWarning(res.description);
          
        }
        return true
      })
  }


  onCancelClick() {
    this.onCancel.emit()
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }


}
