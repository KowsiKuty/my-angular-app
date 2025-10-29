import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { debounceTime,distinctUntilChanged,switchMap,tap,finalize } from 'rxjs/operators';
interface productcat {
  id: string;
  name: string;
}

@Component({
  selector: 'app-productcategory',
  templateUrl: './productcategory.component.html',
  styleUrls: ['./productcategory.component.scss']
})
export class ProductcategoryComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  productCatForm: FormGroup;
  producttype_data={'Goods & Service':1,'Goods':2,'Service':3,'Hardware':4,'Software':5,'Component':6,'IT Related Services':7};
  isLoading = false;
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.productCatForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['',Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')],// Validators.pattern('^[a-zA-Z \-\']')],   //[Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')
      client_id: -1,
      isprodservice: '',
      stockimpact: false
    })

     this.productCatForm.get('isprodservice').valueChanges
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

  }
  productcatList:Array<any>=[];
  public productintreface(data?:productcat):string | undefined{
    return data?data.name:undefined;
  }

  getproducttypedata(){
    this.atmaService.getproduct_type_new(1,'').subscribe(data=>{
      this.productcatList=data['data'];
    });
  }  
  productCatSubmitForm() {
    console.log('productCatForm',this.productCatForm)
    if(this.productCatForm.get('name').value==undefined || this.productCatForm.get('name').value=='' || this.productCatForm.get('name').value==null){
      this.notification.showError('Please Enter The Product Category Name');
      return false;
    }
    let data= {"name": this.productCatForm.value.name.trim(),// Validators.pattern('^[a-zA-Z \-\']')],   //[Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')
    "client_id": 21,
    // "isprodservice": this.producttype_data[this.productCatForm.value.isprodservice],
    "isprodservice":this.productCatForm.get('isprodservice').value.id,
    "stockimpact": this.productCatForm.value.stockimpact=='true'?true:false}
    this.atmaService.productCatCreateForm(data)
      .subscribe(result => {
        if(result.status ==="success"){
          this.notification.showSuccess(result.message);
          this.onSubmit.emit();

        }
        else{
          this.notification.showWarning(result.description);
        }
        
        this.onSubmit.emit();
        console.log("productcat result",result)
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

