import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators,FormArray } from '@angular/forms';
import { BreApiServiceService } from '../bre-api-service.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {PageEvent} from '@angular/material/paginator'
import { Renderer2 } from '@angular/core';

export interface commoditylistss {
  id: string;
  name: string;
}
export interface Status {
  id: number;
  text: string;
}
export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface branch{
  id:string;
  name:string;
  code:string;
}

@Component({
  selector: 'app-expense-create',
  templateUrl: './expense-create.component.html',
  styleUrls: ['./expense-create.component.scss']
})

export class ExpenseCreateComponent implements OnInit {

  expenseccreateform:FormGroup;
  expenseccolumnform:FormGroup;
  searcexptype:FormGroup;
  currentpagecom=1
  has_previouscom=true
  has_nextcom= true
  currentpagecat=1
  has_previouscat=true
  has_nextcat=true
  currentpagesubcat=1
  has_previoussubcat=true
  has_nextsubcat=true
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  expencetypelist:any;
  columntypelist:any;
  presentpagebs: number = 1;
  has_previousbs = false;
  has_nextbs = false;
  expencetypecolumnlist=[];
  maxlen:any;
  expencetypeid:any;
  commodityList: Array<commoditylistss>
  commodityListt: Array<commoditylistss>
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  catid:any;
  @ViewChild('manualpaidModal') manualpaidModal:ElementRef;
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('closebuttons') closebuttons;
  
  @ViewChild('closedbuttons') closedbuttons;

  isLoading = false;
  dropdownlist:any;
  columntype:FormGroup;
  arr: FormArray;
  statustype: Array<Status>
  active = true

  constructor(private formBuilder: FormBuilder, private toastr:ToastrService,private breapiservice:BreApiServiceService,private SpinnerService: NgxSpinnerService,
    private renderer:Renderer2,
  ) { }

  ngOnInit(): void {
    this.expenseccreateform=this.formBuilder.group({
      'exp_type':[''],
      'exp_code':[''],
      'commodity_id':[''],
      'category_code':[''],
      'subcategory_code':[''],
    });
    this.expenseccolumnform=this.formBuilder.group({
      'column_type':new FormControl(''),
      'column_name':new FormControl(''),
    });
    this.searcexptype=this.formBuilder.group({
      'expence_type':new FormControl(''),
      'commodity_id':new FormControl(''),
      'type':new FormControl(true),
    })
    this.columntype =this.formBuilder.group({
      'productname':this.formBuilder.array([
      //  this.formBuilder.group({
      //   'column_name':new FormControl(),
      //   'column_type':new FormControl(),
      //   'expense_type_id': new FormControl(),
      //   'status':1

      //  })
      ])})
    this.getcommodity('');
    let fill={}
    this.SpinnerService.show()
    this.getenpencetypedata(1,fill);
    this.breapiservice.dropdownget().subscribe((results) => {
      this.SpinnerService.hide()
      this.dropdownlist=results['data']
      console.log("dropdownlist",this.dropdownlist)
    })
    this.searcexptype.get('commodity_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.breapiservice.getcommodityscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.commodityList = datas;
         
        })
         this.expenseccreateform.get('commodity_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.breapiservice.getcommodityscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.commodityList = datas;
         
        })

        this.expenseccreateform.get('category_code').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.breapiservice.getcategoryscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryNameData = datas;
          // this.catid = datas.id;
         
        })
        this.expenseccreateform.get('subcategory_code').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.breapiservice.getsubcategoryscroll(this.catid,1,value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcategoryNameData = datas;        
        })
  }

  expFormValid = false
  chkFormValid()
  {
    this.expFormValid = true
    const expForm = this.expenseccreateform.value
    if(expForm.exp_type == undefined || expForm.exp_type == null || expForm.exp_type == "")
    {
      this.expFormValid = false
    }
    else if(expForm.exp_code == undefined || expForm.exp_code == null || expForm.exp_code == "")
    {
      this.expFormValid = false
    }
    else if(expForm.commodity_id == undefined || expForm.commodity_id == null || expForm.commodity_id == "")
    {
      this.expFormValid = false
    }
    else if(expForm.category_code == undefined || expForm.category_code == null || expForm.category_code == "")
    {
      this.expFormValid = false
    }
    else if(expForm.subcategory_code == undefined || expForm.subcategory_code == null || expForm.subcategory_code == "")
    {
      this.expFormValid = false
    }
  }
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.expenseccreateform.get('commodity_id');
  }

  getcommodity(commoditykeyvalue) {
    this.breapiservice.getcommodityy(commoditykeyvalue)
      .subscribe(results => {
        let datas = results["data"];
        this.commodityList = datas;

      })
  }

  commodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.breapiservice.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpagecom+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.expenseccreateform.get('category_code');
  }
  getcat(catkeyvalue) {
    this.breapiservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;
      })
  }

  cid(data) {
    this.SpinnerService.show()
    this.catid = data['id'];
    this.getsubcat(this.catid, "");
  }


  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcat === true) {
                this.breapiservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpagecat+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
                      this.has_nextcat = datapagination.has_next;
                      this.has_previouscat = datapagination.has_previous;
                      this.currentpagecat = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.expenseccreateform.get('subcategory_code');
  }

  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsubcat === true) {
                this.breapiservice.getsubcategoryscroll(this.catid, this.currentpagesubcat+1, this.subcategoryInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
                      this.has_nextsubcat = datapagination.has_next;
                      this.has_previoussubcat = datapagination.has_previous;
                      this.currentpagesubcat = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  subcatid: any;
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.SpinnerService.show()
    this.breapiservice.getsubcat(id,subcatkeyvalue )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;
        this.SpinnerService.hide();

      })
  }
  CreateNew()
  {
    console.log(this.expenseccreateform.value)
  }
  has_nextexp = true;
  has_previousexp = true;
  isexppage: boolean = true;
  presentpageexp: number = 1;
  getenpencetypedata(page,data)
  {
    this.SpinnerService.show()
    this.breapiservice.getexpence(page,data).subscribe((results: any[]) => {
      let datas = results["data"];
      console.log("getenpencetypedata",datas)
      this.SpinnerService.hide()
      this.expencetypelist=datas
      if (this.expencetypelist?.length > 0) {
        this.length_exp=results?.['count'];
        // this.has_nextexp = results['pagination']?.has_next;
        // this.has_previousexp = results['pagination']?.has_previous;
        this.presentpageexp = results['pagination']?.index;
        this.isexppage = true
      }
      else
      {
        this.length_exp=0;
        this.isexppage = false
      }
    })
  }



length_exp = 0;
pageIndex = 0;
pageSizeOptions = [5, 10, 25];
pageSize_exp=10;
showFirstLastButtons:boolean=true;
  handlePageEvent(event: PageEvent) {
    this.length_exp = event.length;
    this.pageSize_exp = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.presentpageexp=event.pageIndex+1;
    this.search(this.active ==false? 0 : 1);
    
  }
  nextClickexp() {
    if (this.has_nextexp === true) {
     this.presentpageexp=this.presentpageexp + 1;
     let fill={}
     this.getenpencetypedata(this.presentpageexp,fill);
    }
  }
  
  previousClickexp() {
    if (this.has_previousexp === true) {
      this.presentpageexp=this.presentpageexp - 1;
      let fill={}
      this.getenpencetypedata(this.presentpageexp,fill);
    }
  }
  foractInactiveexpty(data) { 
  if(data.status ==1)
    var answer = window.confirm("Do you want to Inactivate the Expense Type?");
  else
    var answer = window.confirm("Do you want to Activate the Expense Type?");

  if (!answer) {
    return false;
  }
   console.log("act",data)
   this.SpinnerService.show();
  
   this.breapiservice.actinactexp(data?.id).subscribe((results: any[]) => {
    console.log("actinactexp",results)
    if(results['status'] == "success")
    {
      this.SpinnerService.hide();
      let fill={}
      if(data.status != 1)
        fill['status'] =0
      this.getenpencetypedata(1,fill)
      this.toastr.success('Successfully Updated')
    }
    else
    {
      this.SpinnerService.hide();
      this.toastr.error(results["message"], results['status'])
    }
  })
  }
  foractInactiveclumn(data)
  {
    var answer = window.confirm("Do you Inactivate the Column?");
    if (!answer) {
      return false;
    }
    console.log("act",data)
    this.SpinnerService.show();
    this.breapiservice.actinactexpclmn(data.id).subscribe((results: any[]) => {
     console.log("actinactexp",results)
     if(results['status'] == "success")
     {
       this.SpinnerService.hide();
       let fill={}
       this.getexpencecolumn(this.exptype)
         this.toastr.success('Successfully Updated')
     }
     else
     {
       this.SpinnerService.hide();
       let fill={}
       this.toastr.error(results['message'], results['status'])
     }
   })
  }

  exptype : any
  getexpencecolumn(data)
  {
    this.columntype =this.formBuilder.group({
      'productname':this.formBuilder.array([
      ])})
    console.log("data",data)
    this.exptype =data
    this.expencetypeid=data.id
    this.SpinnerService.show()
    this.breapiservice.expencecolumnget(this.expencetypeid).subscribe((results) => {
      this.SpinnerService.hide()
      let datas = results;
      console.log("getenpencetypedata",datas)
      if(results.code != undefined)
      {
        this.toastr.error(results.description, results.code)
        this.closebuttons.nativeElement.click();
        return false
      }
      this.expencetypecolumnlist=datas['data']
      this.maxlen=this.expencetypecolumnlist.length
      for(let i=0;i<this.expencetypecolumnlist.length;i++){
        (this.columntype.get('productname') as FormArray).push(this.formBuilder.group({
          'id':new FormControl(),
          'column_name':new FormControl(),
          'column_type':new FormControl(),
          'expense_type_id':new FormControl()
        }));
        ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'id':this.expencetypecolumnlist[i].id});
        ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'column_name':this.expencetypecolumnlist[i].column_name});
      ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'column_type':+this.expencetypecolumnlist[i].column_type_id});
      // if(this.expencetypecolumnlist[i].column_type_id == 1)
      // {
      //   ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'column_type':{
      //     "id": 1,
      //     "text": "Textbox"
      // }});
      // }
      // else if(this.expencetypecolumnlist[i].column_type_id == 2)
      // {
      //   ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'column_type':{
      //     "id": 2,
      //     "text": "Date"
      // }});
      // }
      ((this.columntype.get('productname') as FormArray).at(i) as FormGroup).patchValue({'expense_type_id':this.expencetypeid});
      console.log("expencetypecolumnlist",this.expencetypecolumnlist)
      }
      console.log(this.columntype.value)
    })
  }
  nextClickbs() {
    if (this.has_nextbs === true) {
     this.presentpagebs=this.presentpagebs + 1;
     let fill={}
     this.getenpencetypedata(this.presentpagebs,fill);
    }
  }
  
  previousClickbs() {
    if (this.has_previousbs === true) {
      this.presentpagebs=this.presentpagebs - 1;
      let fill={}
      this.getenpencetypedata(this.presentpagebs,fill);
    }
  }
  Search()
  {
    console.log(this.searcexptype.value)
  }
  Clear()
  {
    this.searcexptype.controls['expence_type'].reset()
    this.searcexptype.controls['commodity_id'].reset()
    let fill={}
    this.pageIndex =0
    this.getenpencetypedata(1,fill);
  }
  CreateNeww()
  {
    console.log(this.expenseccreateform.value)
    let expdata = this.expenseccreateform.value
    let fill={}
    if(this.expenseccreateform.get('category_code').value !=null && this.expenseccreateform.get('category_code').value !='' ){
      fill['category_code']=this.expenseccreateform.get('category_code').value.code
     }
     if(this.expenseccreateform.get('commodity_id').value !=null && this.expenseccreateform.get('commodity_id').value !='' ){
      fill['commodity_id']=this.expenseccreateform.get('commodity_id').value.id
     }
     if(this.expenseccreateform.get('subcategory_code').value !=null && this.expenseccreateform.get('subcategory_code').value !='' ){
      fill['subcategory_code']=this.expenseccreateform.get('subcategory_code').value.code
     }
     if(this.expenseccreateform.get('exp_code').value !=null && this.expenseccreateform.get('exp_code').value !='' ){
      fill['expense_code']=this.expenseccreateform.get('exp_code').value
     }
     if(this.expenseccreateform.get('exp_type').value !=null && this.expenseccreateform.get('exp_type').value !='' ){
      fill['expense_name']=this.expenseccreateform.get('exp_type').value
     }
     console.log("fill",fill)
     this.SpinnerService.show();
     this.breapiservice.expencecreate(fill).subscribe((results) => {
      console.log("results",results)
      if(results?.id){
        let clmarray=[]
        let data={"data": [{'column_name':"Remarks",
        'column_type':'1',
        'expense_type_id': results?.id}]}
        clmarray.push(data)
        this.breapiservice.expenceclmcreate(data).subscribe((clmarray) => {
          console.log("results",results)
          if(results.id){
            this.SpinnerService.hide();
            clmarray =[];
            let fill={}
            this.getenpencetypedata(this.presentpageexp,fill)
            this.expenseccreateform.reset();
            this.toastr.success('Successfully Updated')
            this.closedbuttons.nativeElement.click();
          }
          else{
            this.SpinnerService.hide();
            clmarray =[];
           this.toastr.error(JSON.stringify(results))
          }
        },
        (error)=>{
          this.SpinnerService.hide();
          this.toastr.warning(error)
        });
      }
      else{
        this.SpinnerService.hide();
        this.expenseccreateform.reset();
       this.toastr.error(JSON.stringify(results))
      }
    },
    (error)=>{
      this.SpinnerService.hide();
      this.toastr.warning(error)
    });
  }
  createItem() {
    return this.formBuilder.group({
      clmname: [''],
      clmtype: ['']
    })
  }


  selectionChangeType(event)
  {
    
  }
  only_alpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
  }
  toUpperName(e)
  {
    let txt = this.expenseccreateform.value.exp_type
    this.expenseccreateform.patchValue({'exp_type' : txt.toUpperCase()})
  }
  toUpperCode(e)
  {
    let txt = this.expenseccreateform.value.exp_code
    this.expenseccreateform.patchValue({'exp_code' : txt.toUpperCase()})
  }
  finalsubmit()
  {
    console.log(this.columntype.value);
  }
  is_column:boolean = true;
  is_inputtype:boolean = true;
  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log("Input changed:", value);
    if(value == '' || value == null || value == undefined){
      this.is_column = false
    }
  }
  onSelectChange(event: any) {
    let data = event.value
    console.log("Selected value:", event.value);
    if(data == '' || data == undefined || data == null){
      this.is_inputtype = false
    }
  }
  addColEnab = false
  addcolumnDetail()
  {
    this.addColEnab = true
    this.expencetypecolumnlist.push({
      'column_name':"",
      'column_type':"",
      'expense_type_id': this.expencetypecolumnlist[0].expense_type_id.id,
      'status':1
    });
    (this.columntype.get('productname') as FormArray).push(this.formBuilder.group({
      'id':new FormControl(),
      'column_name':new FormControl(),
        'column_type':new FormControl(),
        'expense_type_id': new FormControl(),
        'status':1
      }));
    this.maxlen=this.expencetypecolumnlist.length;
    ((this.columntype.get('productname') as FormArray).at(this.maxlen-1) as FormGroup).patchValue({'column_name':""});
      ((this.columntype.get('productname') as FormArray).at(this.maxlen-1) as FormGroup).patchValue({'column_type':""});
      ((this.columntype.get('productname') as FormArray).at(this.maxlen-1) as FormGroup).patchValue({'expense_type_id':this.expencetypecolumnlist[0].expense_type_id.id})
    // (this.columntype.get('productname') as FormArray).push(this.formBuilder.group({
    //   'column_name':new FormControl(),
    //   'column_type':new FormControl(),
    //   'expense_type_id': new FormControl()
    // }));
    // ((this.columntype.get('productname') as FormArray).at(this.maxlen) as FormGroup).patchValue({'column_name':""});
    // ((this.columntype.get('productname') as FormArray).at(this.maxlen) as FormGroup).patchValue({'column_type':""});
    // ((this.columntype.get('productname') as FormArray).at(this.maxlen) as FormGroup).patchValue({'expense_type_id':this.expencetypecolumnlist[this.maxlen-1].expense_type_id.id});
  }
  submitclmtype()
  {
    console.log(this.columntype.value);
    console.log(this.expencetypecolumnlist);
    let data = (this.columntype.value.productname).filter(x => x.id == undefined)

    if(data.length <=0)
    {
      this.addColEnab = false;
      this.toastr.error('No Data')
        return false
    }
    for(let i=0;i<data.length; i++)
    {
      if (data[i].column_name == '' || data[i].column_name  == null || data[i].column_name  == undefined) {
        this.toastr.error('Please Enter Column Name')
        return false
      }
      if (data[i].column_type == '' || data[i].column_type  == null || data[i].column_type  == undefined) {
        this.toastr.error('Please Select Input Type')
        return false
      }
    }
    data={"data": data}
    this.SpinnerService.show();
    
    this.breapiservice.expenceclmcreate(data).subscribe((results) => {
      console.log("results",results)
      if(results.status =="Success"){
        this.SpinnerService.hide();
        this.addColEnab = false;
        this.expenseccreateform.reset();
        this.toastr.success(results.message)
        const modal = this.manualpaidModal.nativeElement;
        this.renderer.setStyle(modal, 'display', 'none')
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => this.renderer.removeChild(document.body, backdrop));
      }
      else{
        this.SpinnerService.hide();
        this.expenseccreateform.reset();
        
       this.toastr.error(results.message,results.status)
      }
    },
    (error)=>{
      this.SpinnerService.hide();
      this.toastr.warning(error)
    });
  }

  search(type)
  {
    let fill={}
    if(type == 0)
    {
      this.searcexptype.controls['expence_type'].reset()
      this.searcexptype.controls['commodity_id'].reset()
      fill['status']=0
    }
    else
    {
    console.log("searcexptype",this.searcexptype.value)
    if(this.searcexptype.get('commodity_id').value !=null && this.searcexptype.get('commodity_id').value !='' ){
      fill['commodity_id']=this.searcexptype.get('commodity_id').value.id
     }
     if(this.searcexptype.get('expence_type').value !=null && this.searcexptype.get('expence_type').value !='' ){
      fill['expense_name']=this.searcexptype.get('expence_type').value
     }
    }
     this.getenpencetypedata(this.presentpageexp,fill)
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }

  showAddExp = false
  showAddExpType()
  {
    this.expenseccreateform.reset();
    this.closedbuttons.nativeElement.click();
  }
  addexpBack()
  {
    this.showAddExp = false
    this.expenseccreateform.reset();
  }
 
}
