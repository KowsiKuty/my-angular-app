import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
export interface subcatListss {
  name: string;
  id: number;
}
@Component({
  selector: 'app-assetcat',
  templateUrl: './assetcat.component.html',
  styleUrls: ['./assetcat.component.scss']
})
export class AssetcatComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
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
  isassetcategorys: boolean
  isDepsetting: boolean
  ismakerCheckerButton: boolean;
  has_nextasset = true;
  has_previousasset = true;
  // currentpage: number = 1;
  presentpageasset: number = 1;
  pageSize = 10;
  depform: FormGroup
  assetlocationform: FormGroup
  deptypelist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  deptypeslist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  branchdata: any;
  myControl = new FormControl();
  data2: any;

  constructor(private spinner:NgxSpinnerService,private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private FaShareService: faShareService,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.depform = this.fb.group({
        doctype: ['', Validators.required],
        depgl: ['', Validators.required],
  
        depreservegl: ['', Validators.required],
  
      })
      this.SubcatSearchForm = this.fb.group({
  
        subcategorys: "",
        deptype: ""
      })
  
  
      this.updateForm=this.fb.group({
        depgl_mgmt: ['', Validators.required],
     
        depresgl_mgmt: ['', Validators.required],
  
      })
  
     
      
      this.getassetcategorysummary();
      // this.getassetlocationsummary();
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
  
        })
  
    }
  
    public displayFn(subcattype?: subcatListss): string | undefined {
          return subcattype ? subcattype.name : undefined;
    }
  
    get subcattype() {
      return this.SubcatSearchForm.get('subcategorys');
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
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
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

      })

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



    let data = this.depform.value
    this.Faservice.depCreateForm(data)
      .subscribe(res => {
        if(res)
{
        this.notification.showSuccess("Saved Successfully!...")
        this.onSubmit.emit();
        this.router.navigate(['/fa/famaster'], { skipLocationChange: true })

}else{
  this.toastr.error('failed','', { timeOut: 1500 });
  return false
}

       
      })


  }


  mobile_popu(asst){
    this.updateForm.get('depgl_mgmt').setValue('asst.depgl_mgmt');
    this.updateForm.get('depresgl_mgmt').setValue('asst.depresgl_mgmt');      
  }
}
class subclassSearchtype {
  subcategorys: string;
  deptype: any;
  id: number;
}