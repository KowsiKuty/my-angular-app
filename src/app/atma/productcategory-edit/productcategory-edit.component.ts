import { Component, OnInit, Output, EventEmitter,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime,distinctUntilChanged,switchMap,tap,finalize } from 'rxjs/operators';

interface productcat {
  id: string;
  name: string;
}

@Component({
  selector: 'app-productcategory-edit',
  templateUrl: './productcategory-edit.component.html',
  styleUrls: ['./productcategory-edit.component.scss']
})
export class ProductcategoryEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  productCatEditForm: FormGroup;
  productcatList: Array<any>=[];
  isLoading = false;
  producttype_data={'Goods & Service':1,'Goods':2,'Service':3,'Hardware':4,'Software':5,'Component':6,'IT Related Services':7};

 
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService, private spinner: NgxSpinnerService,) { }
  @ViewChild('productcatInput') productcatInput: any;
  ngOnInit(): void {
    this.productCatEditForm = this.fb.group({
      code: [''],
      name: ['', Validators.required],
      client_id: 1,
      isprodservice: ['', Validators.required],
      stockimpact: false
    });
     this.productCatEditForm.get('isprodservice').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
    
          }),
          switchMap(value => this.atmaService.getproduct_type_new(1,value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.productcatList = datas;
        });

    this.getproducttypedata();
    
    // this.atmaService.getproducttypedata().subscribe(data=>{
    //   this.productcatList=data;
    // });
    this.getproductCatEdit();
      
  }
  getproducttypedata(){
    this.atmaService.getproduct_type_new(1,'').subscribe(data=>{
      this.productcatList=data['data'];
    });
    console.log(this.productcatList);
    console.log('call');
  }

  productcatdivision(d:any){

  }
  public productintreface(data?:productcat):string | undefined{
      return data?data.name:undefined;
    }
  
  getproductCatEdit(){
    let id = this.sharedService.productCategoryEdit.value
    this.spinner.show()
    console.log("getproductCatEdit Edit", this.sharedService.productCategoryEdit.value)
    this.atmaService.getproductCatEdit(id)
      .subscribe((result: any)  => {
        this.spinner.hide()
        let Name = result.name;
        let Code = result.code;
        this.productCatEditForm.patchValue({
          isprodservice: result.isprodservice ? { id: result.isprodservice.id, name: result.isprodservice.name } : null
        });
        
        // let Isprodservice = result.isprodservice
        let Stockimpact = result.stockimpact;
        this.productCatEditForm.patchValue({
          name: Name,
          code: Code,
          // isprodservice: result.Isprodservice,
          stockimpact: Stockimpact
        })
       
        
        
        
      })
  }


  productCatEditSubmitForm(){
    if(this.productCatEditForm.get('name').value=='' || this.productCatEditForm.get('name').value==undefined || this.productCatEditForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    let idValue: any = this.sharedService.productCategoryEdit.value
    let data = {"name": this.productCatEditForm.value.name.trim(),// Validators.pattern('^[a-zA-Z \-\']')],   //[Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')
      "client_id": 21,
      "isprodservice": this.productCatEditForm.value.isprodservice.id,
      "stockimpact": this.productCatEditForm.value.stockimpact=='true'?true:false}
    this.atmaService.editProductCatEdit(data, idValue.id)
      .subscribe(result => {
        if(result.status ==="success"){
          this.notification.showSuccess("Updated Successfully");
          this.onSubmit.emit();
        }
        else{
          this.notification.showWarning(result.description);
          
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
