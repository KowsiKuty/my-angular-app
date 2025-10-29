import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { faservice } from '../fa.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import {ToastrService} from "ngx-toastr"
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
  selector: 'app-asset-maker-summary',
  templateUrl: './asset-maker-summary.component.html',
  styleUrls: ['./asset-maker-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
  
})
export class AssetMakerSummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('assetids') matassetid:MatAutocomplete;
  @ViewChild('inputassetids') inputid:any;

  @ViewChild('btanchs') matbranch:MatAutocomplete;
  @ViewChild('inputbranchs') inputbranch:any;
  @ViewChild('categorys') matcategory:MatAutocomplete;
  @ViewChild('inputcategorys') inputcategory:any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  assetcatslist:Array<any>=[];
  constructor(private toast:ToastrService,private datepipe:DatePipe,private Faservice:faservice,private spinner:NgxSpinnerService,private fb:FormBuilder) { }
  asset_id:any;
  branch_id:any;
  has_nextloc = true;
  has_previousloc = true;
  presentpageloc: number = 1;
  pageSize = 10;
  page:number=1;
  has_nextasset:boolean;
  has_previousasset:boolean;
  assetmakersum:any=FormGroup;
  assetidlist:Array<any>=[];
  categorylist:Array<any>=[];
  branchlist:Array<any>=[];
  assetid:any;
  category:any;
  branch:any;
  date:any=new Date();
  isLoading:boolean=false;
  first:boolean=false;
  select:Date
  previousDate: Date;
  // presentpageasset:boolean
  has_nextcategory:boolean=true;
  has_previouscategory:boolean=false;
  has_presentcategory:number=1;
  has_nextbranch:boolean=true;
  has_previousbranch:boolean=false;
  has_presentbranch:number=1;
  has_nextid:boolean=true;
  has_previousid:boolean=false;
  has_presentid:number=1;
  presentpageasset: number = 1;
  reason:any='';
  ngOnInit(): void {
    this.assetmakersum=this.fb.group({
      'assetid':new FormControl(),
      'assetvalue':new FormControl(),
      'capdate':new FormControl(),
      'category':new FormControl(),
      'branch':new FormControl(),
      'crno':new FormControl(),
      'fromdate':new FormControl(),
      'todate':new FormControl()
    });
    this.Faservice.getcpdatecheckerassetid('',1).subscribe(data=>{
      console.log(data);
      this.assetidlist=data['data'];
    })
    this.assetmakersum.get('assetid').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.Faservice.getcpdatecheckerassetid( this.assetmakersum.get('assetid').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.assetidlist=data['data'];
    });
    this.Faservice.getassetcategory('').subscribe(data=>{
      console.log(data);
      this.categorylist=data['data'];
    })
    this.assetmakersum.get('category').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetcategorynew( this.assetmakersum.get('category').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.categorylist=data['data'];
    });
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      console.log(data);
      this.branchlist=data['data'];
    })
    this.assetmakersum.get('branch').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetbranchdata( this.assetmakersum.get('branch').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.branchlist=data['data'];
    });
    this.getassetcategorysummary();
  }

  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
     const d:any={};
     let searh:string="page="+this.presentpageloc;
     if(this.assetmakersum.get('assetvalue').value !=null && this.assetmakersum.get('assetvalue').value !=""){
      console.log('ent')
     searh=searh+"&asset_value="+this.assetmakersum.get('assetvalue').value;
    }
    if(this.assetmakersum.get('assetid').value !=null && this.assetmakersum.get('assetid').value !=""){
      searh=searh+"&assetid="+this.assetmakersum.get('assetid').value
     }
     if(this.assetmakersum.get('capdate').value !=null && this.assetmakersum.get('capdate').value !=""){
      let dateValue = this.datepipe.transform(this.assetmakersum.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.assetmakersum.get('category').value !=null && this.assetmakersum.get('category').value !=""){
      searh=searh+"&cat="+this.category
     }
     if(this.assetmakersum.get('branch').value !=null && this.assetmakersum.get('branch').value !=""){
      searh=searh+"&branch="+this.branch
     }
     if(this.assetmakersum.get('crno').value !=null && this.assetmakersum.get('crno').value !=""){
      searh=searh+"&crno="+this.assetmakersum.get('crno').value;
     }
     if(this.assetmakersum.get('fromdate').value!=null && this.assetmakersum.get('fromdate').value !="" && this.assetmakersum.get('fromdate').value!=undefined){
      // let from_date=this.datepipe.transform(this.assetmakersum.get('fromdate').value,'yyyy-MM-dd');
      searh=searh+"&from_date="+this.datepipe.transform(this.assetmakersum.get('fromdate').value,'yyyy-MM-dd');
     }
     if(this.assetmakersum.get('todate').value!=null && this.assetmakersum.get('todate').value !="" && this.assetmakersum.get('todate').value!=undefined){
       searh=searh+"&to_date="+this.datepipe.transform(this.assetmakersum.get('todate').value,'yyyy-MM-dd');
     }
    d['page']=searh;
     this.spinner.show();
     this.Faservice.getassetsummarydata(d)
       .subscribe((result) => {
         console.log("summary", result);
         let datass = result['data'];
         let datapagination = result["pagination"];
         this.assetcatslist = result['data'];
         this.spinner.hide();
         console.log("landlord", this.assetcatslist)
         if (this.assetcatslist.length >= 0) {
           this.has_nextasset = datapagination.has_next;
           this.has_previousasset = datapagination.has_previous;
          //  this.presentpageasset = datapagination.index;
           this.presentpageloc=datapagination.index;
         }
  
       })
       
   }
   nextClick() {

    if (this.has_nextasset === true) {
      this.presentpageloc=this.presentpageloc+1;
      this.getassetcategorysummary(this.presentpageloc + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previousasset === true) {
      this.presentpageloc=this.presentpageloc -1;
      this.getassetcategorysummary(this.presentpageloc - 1, 10)

    }
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
            if(this.has_nextcategory == true){
              this.Faservice.getassetcategorynew(this.inputcategory.nativeElement.value, this.has_presentcategory+1).subscribe(data=>{
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
  autocompletecategorybranch(){
    setTimeout(()=>{
    if(this.matbranch && this.autocompletetrigger && this.matbranch.panel){
      fromEvent(this.matbranch.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matbranch.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matbranch.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranch.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbranch.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_nextbranch == true){
              this.Faservice.getassetbranchdata(this.inputbranch.nativeElement.value,this.has_presentbranch+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.branchlist=this.branchlist.concat(data['data']);
                if(this.branchlist.length>0){
                  this.has_nextbranch=datapagination.has_next;
                  this.has_previousbranch=datapagination.has_previous;
                  this.has_presentbranch=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
}
  
  autocompleteid(){
    setTimeout(()=>{
      if(this.matassetid && this.autocompletetrigger && this.matassetid.panel){
        fromEvent(this.matassetid.panel.nativeElement,'scroll').pipe(
          map(x=> this.matassetid.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.matassetid.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetid.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetid.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop +elementHeight;
          if(atBottom){
            if(this.has_nextid){
              this.Faservice.getcpdatecheckerassetid(this.inputid.nativeElement.value,this.has_presentid+1).subscribe(data=>{
                let dts=data['data'];
                console.log('h--=',data);
                let pagination=data['pagination'];
                this.assetidlist=this.assetidlist.concat(dts);
                if(this.assetidlist.length>0){
                  this.has_nextid=pagination.has_next;
                  this.has_previousid=pagination.has_previous;
                  this.has_presentid=pagination.index;
                }
              })
            }
          }
        })
      }
    })
  };
  assetidselect(data:any){
    this.assetid=data.assetdetails_id
  }
  categoryselect(data:any){
    console.log(data);
    this.category=data.id;
  }
  branchselect(data:any){
    console.log(data);
    this.branch=data.id;
    console.log(this.assetmakersum.value);
  }
  // searchdata(){
  //   console.log('data')
  //   this.getassetcategorysummary(1,10);
  // }
  resets(){
    this.assetmakersum.get('assetvalue').patchValue('');
    this.assetmakersum.get('assetid').patchValue('');
    this.assetmakersum.get('capdate').patchValue('');
    this.assetmakersum.get('category').patchValue('');
    this.assetmakersum.get('branch').patchValue('');
    this.assetmakersum.get('crno').patchValue('');
    this.getassetcategorysummary();
    this.first=false;
  }
  searchdata(){
    let data:any={};
    this.presentpageloc=1;
    let searh:string="page="+this.presentpageloc;
    if(this.assetmakersum.get('assetvalue').value !=null && this.assetmakersum.get('assetvalue').value !=""){
      console.log('ent')
     searh=searh+"&asset_value="+this.assetmakersum.get('assetvalue').value;
    }
    if(this.assetmakersum.get('assetid').value !=null && this.assetmakersum.get('assetid').value !=""){
      searh=searh+"&assetid="+this.assetmakersum.get('assetid').value
     }
     if(this.assetmakersum.get('capdate').value !=null && this.assetmakersum.get('capdate').value !=""){
      let dateValue = this.datepipe.transform(this.assetmakersum.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.assetmakersum.get('category').value !=null && this.assetmakersum.get('category').value !=""){
      searh=searh+"&cat="+this.category
     }
     if(this.assetmakersum.get('branch').value !=null && this.assetmakersum.get('branch').value !=""){
      searh=searh+"&branch="+this.branch
     }
     if(this.assetmakersum.get('crno').value !=null && this.assetmakersum.get('crno').value !=""){
      searh=searh+"&crno="+this.assetmakersum.get('crno').value;
     }
     data['page']=searh;
     console.log(searh);
     this.spinner.show();
      this.Faservice.getassetsummarydata(data).subscribe(data=>{
        this.spinner.hide();
        console.log(data);
        let datapagination=data['pagination'];
        if(data['data'].length==0){
          this.toast.warning('Matching Data Not Found..'); 
          this.spinner.hide();
          this.assetcatslist=[];
        }
        else{
          this.spinner.hide();
          this.assetcatslist=data['data'];
        }
        if (this.assetcatslist.length >= 0) {
          this.has_nextasset = datapagination.has_next;
          this.has_previousasset = datapagination.has_previous;
         //  this.presentpageasset = datapagination.index;
          this.presentpageloc=datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
        console.log(error);
      }
      )
  }
  clickreason(data){
    this.reason=data.reason;
  }
  fromdateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
  }
 Download_maker_prepare (){
    let payload={}
    if(this.assetmakersum.get('fromdate').value==null || this.assetmakersum.get('fromdate').value =="" || this.assetmakersum.get('fromdate').value==undefined){
      this.toast.warning("Please Select the from date");
      return false;
     }
     if(this.assetmakersum.get('todate').value==null || this.assetmakersum.get('todate').value =="" || this.assetmakersum.get('todate').value==undefined){
      this.toast.warning("Please Select the to date");
      return false;
     }
    if (this.assetmakersum.get('assetid').value){
      payload['assetid']=this.assetmakersum.get('assetid').value;
    }
    if(this.assetmakersum.get('category').value){
      payload['cat']=this.category
    }
    if(this.assetmakersum.get('branch').value){
      payload['branch']=this.branch;
    }
    if(this.assetmakersum.get('crno').value){
      payload['crno']=this.assetmakersum.get('crno').value;
    }
    if(this.assetmakersum.get('capdate').value){
      payload['capdate']=this.datepipe.transform(this.assetmakersum.get('capdate').value,'yyyy-MM-dd')
    }
    if(this.assetmakersum.get('assetvalue').value){
      payload['asset_value']=this.assetmakersum.get('assetvalue').value;
    }
    this.first=true;
    this.spinner.show();
    payload['from_date']=this.datepipe.transform(this.assetmakersum.get('fromdate').value,'yyyy-MM-dd');
    payload['to_date']=this.datepipe.transform(this.assetmakersum.get('todate').value,'yyyy-MM-dd');
    this.Faservice.assetmaker_prepare(payload).subscribe(result=>{
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
  download_maker_file(){
    if(this.first==true){
      this.toast.warning('Please Wait');
      return false;
    } 
    
    this.spinner.show();
    this.Faservice.assetmaker_downloadfile().subscribe(
      (response: any) =>{
        this.spinner.hide();
          // this.first=false;
          // this.first=false;
          if (response['type']=='application/json'){
            this.toast.warning('INVALID_DATA')
           }
           else{
            // let filename:any='Maker-Summary-reort';
            // let dataType = response.type;
            // let binaryData = [];
            // binaryData.push(response);
            // let downloadLink:any = document.createElement('a');
            // console.log()
            // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            
            // downloadLink.setAttribute('download',filename);
            // document.body.appendChild(downli.uk,uf.jh;kloadLink);
            // downloadLink.click();
            let binaryData = [];
      binaryData.push(response)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Maker Summary reort'+ date +".xlsx";
      link.click();
      this.first = false;
      this.toast.success('Downloaded Successfully')
           }
           
            
      },
      (error:HttpErrorResponse)=>{
        // this.first=false;
        this.spinner.hide();
        this.toast.warning(error.status+error.statusText);
        // this.notification.showWarning(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
        // this.notification.showWarning(error.message,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
  
      }
  )

  }
}
// getassetcategorysummary(pageNumber = 1, pageSize = 10) {
//   this.spinner.show();
   
//    const date:any='';
//    const assetcat_id=this.asset_id;
//    const branchid=this.branch_id;
//    const crno=this.checkersum.get('crno').value;
//    const d:any={}
//    d['capdate']='&capdate='+date;
//    d['branch']='&branch='+branchid;
//    d['cat']='&cat='+crno;
//    console.log(date,assetcat_id,branchid,crno);
//    this.Faservice.getassetcategorysummary(this.page,d)
//      .subscribe((result) => {
//        console.log("landlord-1", result);
//        let datass = result['data'];
//        let datapagination = result["pagination"];
//        this.assetcatslist = result['data'];
//        this.checkedValues = this.assetcatslist.map(() => false);
//        console.log("lsit1", this.list1)
       
//        if (this.abcd === true) {
         
//          this.assetcatslist = [...this.assetcatslist, ...this.list2]
//        }
       



//        console.log("landlord", this.assetcatslist)
//        if (this.assetcatslist.length >= 0) {
//          this.has_nextasset = datapagination.has_next;
//          this.has_previousasset = datapagination.has_previous;
//          this.presentpageasset = datapagination.index;
//          this.presentpageloc=datapagination.index;
//        }

//      })
//      this.spinner.hide();
//  }
