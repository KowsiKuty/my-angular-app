import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { map } from 'jquery';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-cpdatechange-maker-summary',
  templateUrl: './cpdatechange-maker-summary.component.html',
  styleUrls: ['./cpdatechange-maker-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CpdatechangeMakerSummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('category') matcategory:MatAutocomplete;
  @ViewChild('inputcategory') inputcategory;any;

  @ViewChild('branch') matbranchAutocomplete:MatAutocomplete;
  @ViewChild('inputbranch') inputbranch:any; 

  @ViewChild('assetid') matasstisAutocomplete:MatAutocomplete;
  @ViewChild('inputid') inputid:any;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  dts:any=moment(new Date()).format('YYYY-MM-DD');
  cpdatechange:any=FormGroup;
  date=new Date();
  assetcategorylist:Array<any>=[];
  branchlist:Array<any>=[];
  cpdatechangelist:Array<any>=[];
  cpdateidlist:Array<any>=[];
  has_next:boolean=true;
  has_previous:boolean=true;
  has_presentpage:number=1;

  has_nextsum:boolean=false;
  has_previoussum:boolean=false;
  has_presesendsum:number=1;

  has_nextbrach:boolean=true;
  has_previousbranch:boolean=true;
  has_presentpagebranch:number=1;

  has_nextid:boolean=true;
  has_previousid:boolean=true;
  has_presentid:number=1;
  assetid:any=0;
  assetvalue:any=0;
  capdate:any;
  category:any=0;
  branch:any=0;
  popupdata:any={};
  reason:string='';
  card:boolean=false;
  checker_reason:string='';
  isLoading:boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  page:number=1;
  select:Date;
  previousDate: Date;
  first:boolean=false;

  constructor(private datepipe:DatePipe,private toast:ToastrService,private fb:FormBuilder,private router:Router,private Faservice:faservice,private spinner :NgxSpinnerService) { }

  ngOnInit(): void {


    this.cpdatechange=this.fb.group({
      'assetid':new FormControl(''),
      'assetvalue':new FormControl(),
      'capdate':new FormControl(),
      'category':new FormControl(''),
      'branch':new FormControl(),
      "crno":new FormControl(''),
      "from_date":new FormControl(''),
      'to_date':new FormControl('')
    });
    this.Faservice.getcpdatecheckerassetid('',1).subscribe(data=>{
      this.cpdateidlist=data['data'];
      this.spinner.hide();
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    this.cpdatechange.get('assetid').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getcpdatecheckerassetid(this.cpdatechange.get('assetid').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.cpdateidlist=data['data'];
    })
    this.Faservice.getassetcategorynew('',1).subscribe(data=>{
      this.assetcategorylist=data['data'];
      console.log(this.assetcategorylist)
    });
    this.cpdatechange.get('category').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true
      }),
      switchMap((value:any)=>this.Faservice.getassetcategorynew(this.cpdatechange.get('category').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data)
      this.assetcategorylist=data['data'];
    });
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      this.branchlist=data['data'];
    });
    this.cpdatechange.get('branch').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetbranchdata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchlist=data['data'];
    });
    console.log('dear=',this.cpdatechange.value)
    this.getcpdatechangesummary();
  };
  getcpdatechangesummary(){
    let data:any={};
    let searh:string="page="+this.page.toString();
    
    if(this.cpdatechange.get('assetvalue').value !=null && this.cpdatechange.get('assetvalue').value !=''){
      console.log('ent')
     searh=searh+"&asset_value="+this.cpdatechange.get('assetvalue').value;
    }
    if(this.cpdatechange.get('assetid').value !=null && this.cpdatechange.get('assetid').value !=''){
      searh=searh+"&assetid="+this.cpdatechange.get('assetid').value
     }
     if(this.cpdatechange.get('capdate').value !=null && this.cpdatechange.get('capdate').value !=''){
      let dateValue = this.datepipe.transform(this.cpdatechange.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.cpdatechange.get('category').value !=null && this.cpdatechange.get('category').value !=''){
      searh=searh+"&category="+this.category
     }
     if(this.cpdatechange.get('branch').value !=null && this.cpdatechange.get('branch').value !=''){
      searh=searh+"&branch="+this.branch
     }
     if(this.cpdatechange.get('crno').value !=null && this.cpdatechange.get('crno').value !=''){
      searh=searh+"&crno="+this.cpdatechange.get('crno').value;
     }
     data['page']=searh;
     console.log('search=',searh);
     this.spinner.show();
   this.Faservice.getcpdatesummary(data).subscribe((data:any)=>{
    this.spinner.hide();
    if(data.code!=undefined && data.code!="" && data.code!=null){
      this.toast.warning(data.description);
    }
    else{
      this.cpdatechangelist=data['data'];
     console.log('hii',data)
     let pagination=data['pagination'];
     this.spinner.hide();
     if(this.cpdatechangelist.length>0){
       this.has_nextsum=pagination.has_next;
       this.has_previoussum=pagination.has_previous;
       this.has_presesendsum=pagination.index;
       this.presentpage=pagination.index;
     }
    }
     
   },
   (error)=>{
    this.spinner.hide();
   }
   ) 
 
  };
  buttonprevious(){
   if(this.has_previoussum== true){
     this.page=this.page-1;
     this.getcpdatechangesummary();
   }
  }
  buttonnext(){
   if(this.has_nextsum==true){
     this.page=this.page+1;
    this.getcpdatechangesummary();
   }
  }
  
  changecpdate(){
    this.router.navigate(['fa/cpdatechangeadd']);
  };
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
            if(this.has_next == true){
              this.Faservice.getassetcategorynew(this.inputcategory.nativeElement.value, this.has_presentpage+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.assetcategorylist=this.assetcategorylist.concat(data['data']);
                if(this.assetcategorylist.length>0){
                  this.has_next=datapagination.has_next;
                  this.has_previous=datapagination.has_previous;
                  this.has_presentpage=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
  };
  autocompletecategorybranch(){
    setTimeout(()=>{
    if(this.matbranchAutocomplete && this.autocompletetrigger && this.matbranchAutocomplete.panel){
      fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_nextbrach == true){
              this.Faservice.getassetbranchdata(this.inputbranch.nativeElement.value,this.has_presentpagebranch+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.branchlist=this.branchlist.concat(data['data']);
                if(this.branchlist.length>0){
                  this.has_nextbrach=datapagination.has_next;
                  this.has_previousbranch=datapagination.has_previous;
                  this.has_presentpagebranch=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
  };
  autocompleteassetid(){
    setTimeout(()=>{
      if(this.matasstisAutocomplete && this.autocompletetrigger && this.matasstisAutocomplete.panel){
        fromEvent(this.matasstisAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=> this.matasstisAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(x=>{
          const scrollTop=this.matasstisAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matasstisAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matasstisAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight - 1<=scrollTop+elementHeight;
          if(atBottom){
            if(this.has_nextid){
              this.Faservice.getcpdatecheckerassetid(this.inputid.nativeElement.value,this.has_presentid+1).subscribe(data=>{
                console.log('hii=',data);
                let f=data['data'];
                let dts=data['pagination'];
                this.cpdateidlist=this.cpdateidlist.concat(f);
                if(this.cpdateidlist.length>0){
                  this.has_nextid=dts.has_next;
                  this.has_previousid=dts.has_previous;
                  this.has_presentid=dts.index;
                }
              })
            }
          }
        })
      }
    })

  }
  assetids(data:any){
    console.log('assetid=',data);
    this.assetid=data.assetdetails_id;
  }
  categorys(data:any){
    console.log('category=',data);
    this.category=data.id;
  }
  branchs(data:any){
    console.log('branch=',data)
    this.branch=data.id;
  }
  resets(){
    this.cpdatechange.get('assetvalue').patchValue('');
    this.cpdatechange.get('assetid').patchValue('');
    this.cpdatechange.get('capdate').patchValue('');
    this.cpdatechange.get('category').patchValue('');
    this.cpdatechange.get('branch').patchValue('');
    this.cpdatechange.get('crno').patchValue('');
    this.cpdatechange.get('from_date').patchValue('');
    this.cpdatechange.get('to_date').patchValue('');
    this.getcpdatechangesummary();
  }
  searchdata(){
    this.has_presesendsum=1;
    let data:any={};
    let searh:string="page="+this.has_presesendsum;
    if(this.cpdatechange.get('assetvalue').value !=null && this.cpdatechange.get('assetvalue').value !=''){
      console.log('ent')
     searh=searh+"&asset_value="+this.cpdatechange.get('assetvalue').value;
    }
    if(this.cpdatechange.get('assetid').value !=null && this.cpdatechange.get('assetid').value !=''){
      searh=searh+"&assetid="+this.cpdatechange.get('assetid').value
     }
     if(this.cpdatechange.get('capdate').value !=null && this.cpdatechange.get('capdate').value !=''){
      let dateValue = this.datepipe.transform(this.cpdatechange.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.cpdatechange.get('category').value !=null && this.cpdatechange.get('category').value !=''){
      searh=searh+"&category="+this.category
     }
     if(this.cpdatechange.get('branch').value !=null && this.cpdatechange.get('branch').value !=''){
      searh=searh+"&branch="+this.branch
     }
     if(this.cpdatechange.get('crno').value !=null && this.cpdatechange.get('crno').value !=''){
      searh=searh+"&crno="+this.cpdatechange.get('crno').value;
     }
     data['page']=searh;
     console.log(searh);
     this.spinner.show();
      this.Faservice.getcpdatesummary(data).subscribe((data:any)=>{
        this.spinner.hide();
        if(data.code!=undefined && data.code!="" && data.code!=null){
          this.toast.warning(data.description);
        }
        else{
          console.log(data);
        let pagination=data['pagination'];
        if(data['data'].length==0){
          this.cpdatechangelist=[];
          this.toast.warning('Matching Data Not Found');
        }
        else{
          this.cpdatechangelist=data['data'];
          if(this.cpdatechangelist.length>0){
            this.has_nextsum=pagination.has_next;
            this.has_previoussum=pagination.has_previous;
            this.has_presesendsum=pagination.index;
            this.presentpage=pagination.index;
          }
        }
        }
        
        // this.cpdatechangelist=data['data'];
       
      },
      (error)=>{
        this.spinner.hide();
        console.log(error);
      }
      )
  }
  popupdatamodal(data:any){
    console.log('enter');
    this.popupdata={'assetdetails_id':data['assetdetails_id'],'product_id':data['product_id'].name,'category_id':data['product_id']['category_id'].name,
    'capdate':data.capdate,'new_cap_date':data.new_cap_date,'assetdetails_value':data.assetdetails_value,'branch_id':data['branch_id'].name,'assetlocation':data['assetlocation'].name,
    'reason':data.reason,'assetdetails_status':data.assetdetails_status,'approver_name':data.approver_name,'approver_code':data.approver_name,'maker_name':data.maker_name,'maker_code':data.maker_name
  };
  }
  checkedrreason(data:any){
    this.card=true;
    this.reason=data.reason;
    this.checker_reason=data.checker_reason
  }
  fromdateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
  }
  // Download_prepare(){
  //   let searchSplit = this.cpdatechange.value;
  //   if (searchSplit.capdate != "") {
  //     let capdatedata = searchSplit.capdate
  //     let dates = this.datepipe.transform(capdatedata, 'yyyy-MM-dd');
  //     searchSplit.capdate = dates
  //   }
  //   if(searchSplit.from_date=='' || searchSplit.from_date== null || searchSplit.from_date==undefined){
  //     this.toast.warning("Please select from date");
  //     return false;
  //   }
  //   else{
  //     searchSplit.from_date=this.datepipe.transform(this.cpdatechange.get('from_date').value,'yyyy-MM-dd');
      
  //   }
  //   if(searchSplit.to_date=='' || searchSplit.to_date== null || searchSplit.to_date==undefined){
  //     this.toast.warning("Please select to date");
  //     return false;
  //   }
  //   else{
  //     searchSplit.to_date=this.datepipe.transform(this.cpdatechange.get('to_date').value,'yyyy-MM-dd');
      
  //   }

  //   for (let i in searchSplit) {
  //     if (searchSplit[i] === null || searchSplit[i] === "" || searchSplit[i] === undefined) {
  //       delete searchSplit[i];
  //     }
  //   }
  //   this.first=true;
  //   this.spinner.show();
  //   // searchSplit['from_date']=this.datepipe.transform(this.cpdatechange.get('fromdate').value,'yyyy-MM-dd');
  //   // searchSplit['to_date']=this.datepipe.transform(this.cpdatechange.get('todate').value,'yyyy-MM-dd');
  //   this.Faservice.assetmaker_prepare(searchSplit).subscribe(result=>{
  //     this.spinner.hide();
  //     this.first=false;
  //     if(result.code!=undefined && result.code!="" && result.code!=null){
  //       this.toast.warning(result?.code);
  //        this.toast.warning(result?.description);
  //     }
  //     else{
  //       this.toast.success(result.status);
  //       this.toast.success(result.message);
  //     }

  // },(error:HttpErrorResponse)=>{
  //     this.spinner.hide();
  //     this.first=false;
  //    this.toast.warning(error?.status+ error?.message);
  // })
  // }
  
  Download_prepare(){
      let payload={}
      if(this.cpdatechange.get('from_date').value==null || this.cpdatechange.get('from_date').value =="" || this.cpdatechange.get('from_date').value==undefined){
        this.toast.warning("Please Select the from date");
        return false;
       }
       if(this.cpdatechange.get('to_date').value==null || this.cpdatechange.get('to_date').value =="" || this.cpdatechange.get('to_date').value==undefined){
        this.toast.warning("Please Select the to date");
        return false;
       }
      if (this.cpdatechange.get('assetid').value){
        payload['assetid']=this.cpdatechange.get('assetid').value;
      }
      if(this.cpdatechange.get('category').value){
        payload['cat']=this.category
      }
      if(this.cpdatechange.get('branch').value){
        payload['branch']=this.branch;
      }
      if(this.cpdatechange.get('crno').value){
        payload['crno']=this.cpdatechange.get('crno').value;
      }
      if(this.cpdatechange.get('capdate').value){
        payload['capdate']=this.datepipe.transform(this.cpdatechange.get('capdate').value,'yyyy-MM-dd')
      }
      if(this.cpdatechange.get('assetvalue').value){
        payload['asset_value']=this.cpdatechange.get('assetvalue').value;
      }
      this.first=true;
      this.spinner.show();
      payload['from_date']=this.datepipe.transform(this.cpdatechange.get('from_date').value,'yyyy-MM-dd');
      payload['to_date']=this.datepipe.transform(this.cpdatechange.get('to_date').value,'yyyy-MM-dd');
      this.Faservice.cap_maker_prepare(payload).subscribe(result=>{
        this.spinner.hide();
        this.first=false;
        if(result.code!=undefined && result.code!="" && result.code!=null){
          this.toast.warning(result?.code);
          this.toast.warning(result?.description);
        }
        else{
          this.toast.success(result.status);
          this.toast.success(result.message);
        }
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.first=false;
        this.toast.warning(error.status+error.message);
      })
  
    }
  download_file(){
    if(this.first==true){
       this.toast.warning('Please Wait');
      return false;
    } 
    
    this.spinner.show();
    this.Faservice.cap_maker_downloadfile().subscribe(
      (response: any) =>{
        this.spinner.hide();
          // this.first=false;
          // this.first=false;
          if (response['type']=='application/json'){
             this.toast.warning('INVALID_DATA');
           }
           else{
            // let filename:any='CAPDATE-Summary-reort';
            // let dataType = response.type;
            // let binaryData = [];
            // binaryData.push(response);
            // let downloadLink:any = document.createElement('a');
            // console.log()
            // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            
            // downloadLink.setAttribute('download',filename);
            // document.body.appendChild(downloadLink);
            // this.toast.success('Sucessfully downloaded');
            // downloadLink.click();

            let binaryData = [];
            binaryData.push(response)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'CapDate Summary Report'+ date +".xlsx";
            link.click();
            this.first = false;
            this.toast.success('Downloaded Successfully')

           }
            
      },
      (error:HttpErrorResponse)=>{
        // this.first=false;
        this.spinner.hide();
         this.toast.warning(error.status+error.statusText);
        //  this.toast.warning(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
        //  this.toast.warning(error.message,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
  
      })
  }
}