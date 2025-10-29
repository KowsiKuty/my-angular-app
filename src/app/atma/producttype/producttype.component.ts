import { Component, OnInit , Output, EventEmitter, ViewChild,ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Observable,fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger, } from '@angular/material/autocomplete';
import { map, takeUntil } from 'rxjs/operators';

 export interface prodlist{
  id:number;
  name:string;
 }

@Component({
  selector: 'app-producttype',
  templateUrl: './producttype.component.html',
  styleUrls: ['./producttype.component.scss']
})
export class ProducttypeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('prodcat') matprodcat:MatAutocomplete;
  @ViewChild('prodInput') matprodInput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  producttypeForm: FormGroup
  productcategoryList: Array<any>;
  isLoading:boolean;
  currentpage =1;
  has_next:boolean=false;
  has_previous:boolean=false;
  constructor(private fb: FormBuilder,private router: Router,
    private atmaService: AtmaService,private notification: NotificationService,private toastr: ToastrService) { }

    ngOnInit(): void {
      this.producttypeForm = this.fb.group({
        //code: ['', Validators.required],
        name: ['', Validators.required],
        productcategory_id: ['', Validators.required],
       
        
      })
      // this.producttypeForm.get('productcategory_id').valueChanges.pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(()=>{
      //     this.isLoading=true;
      //   }),
      //   switchMap(value=>this.atmaService.getproductcategory().pipe(
      //     finalize(()=>{
      //       this.isLoading=false;
      //     })
      //   ))
      // ).subscribe(data=>{
      //   this.productcategoryList=data['data'];
      // })
      let prodkey:String="";
      this.getproductcategory(prodkey);
    this.producttypeForm.get('productcategory_id').valueChanges
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
    //       console.log("product", datas)
    
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

    producttypeCreateForm(){
      if (this.producttypeForm.value.productcategory_id.id===undefined || this.producttypeForm.value.productcategory_id==''|| this.producttypeForm.value.productcategory_id==null){
        this.toastr.error('Please Select The Product Category');
        // this.onCancel.emit()
        return false;
      }
      if (this.producttypeForm.value.name.trim()===""){
        this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      if (this.producttypeForm.value.name.trim().length > 64){
        this.toastr.error('Dont Enter more than 64 characters','Limited characters allowed' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
     
      let data:any={
        name:this.producttypeForm.get('name').value,
        productcategory_id:this.producttypeForm.get('productcategory_id').value.id
      }
      this.atmaService.producttypeCreateForm(data)
        .subscribe(res => {
  
          if(res.status ==="success"){
            this.notification.showSuccess(res.message);
            this.onSubmit.emit();
          }  
          else{
            this.notification.showWarning(res.description);
          }
          
          // console.log("Apcategory", res)
          // this.notification.showSuccess("Added Successfully!...")
          // this.onSubmit.emit();
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
  
  


