import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { faservice } from '../fa.service';
import {faShareService} from '../share.service';

export interface bucketdata{
  id:string;
  name:string;
}
export interface bucketdatato{
  id:string;
  name:string;
}
@Component({
  selector: 'app-bucket-summary-view',
  templateUrl: './bucket-summary-view.component.html',
  styleUrls: ['./bucket-summary-view.component.scss']
})
export class BucketSummaryViewComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  @ViewChild('frombtInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('todata') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('todataInput') Inputbranch: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  additionData:Array<any>=[];
  removalData:Array<any>=[];
  fromBucketList:any=[];
  toBucketList:Array<any>=[];
  isLoading:boolean;
  sum_add_invoice_value:number=0;
  sum_add_asset_value:number=0;
  sum_rem_invoice_value:number=0;
  sum_rem_asset_value:number=0;
  sum_rev_cap_value:number=0;
  sum_total_net_value:number=0;
  getBucketId:number=0;
  presentPage:number=1;
  presentremovepage:number=1;
  searchForm:any=FormGroup;
  currentpage=1;
  adddata:string[]=[];
  pageSize=10;
  btndisable:boolean=false;
btndisablepopup:boolean=false;
has_nextcom_branch:boolean = true;
has_previouscom:boolean = true;
currentpagecom_branch:number =1;
  constructor(private router:Router,private notifications:NotificationService,private fb:FormBuilder,private spinner:NgxSpinnerService,private service:faShareService,private faservice:faservice) { }

  ngOnInit(): void {
    this.searchForm=this.fb.group({
      'frombucket':new FormControl(''),
      'tobucket':new FormControl('')
    });
    this.searchForm.get('frombucket').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.faservice.getbucketsummarydropdown(1,value,'N').pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.fromBucketList=data['data'];
      // this.additionData=data['data'];
      // for(let i=0;i<this.additionData.length;i++){
      //   this.additionData[i]['con']=false;
      // }
      
    });
    this.searchForm.get('tobucket').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.faservice.getbucketsummarydropdownexclude(1,value,this.searchForm.get('frombucket').value.id).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.toBucketList=data['data'];
    });
   this.getBucketId= this.service.bucket_id.value;
    // setTimeout(()=>{
    //   this.spinner.show();
    // },
    // 2000
    // );
    // this.spinner.hide();
    
  }
  focusoutdata(data){
    this.additionData=[data];
      for(let i=0;i<this.additionData.length;i++){
        this.additionData[i]['con']=false;
      }
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.adddata.push(value);
    }
   
  }

  remove(fruit: string): void {
    const index = this.adddata.indexOf(fruit);

    if (index >= 0) {
      this.adddata.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.adddata.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    // this.fruitCtrl.setValue(null);
  }
  datachange(event,j,i){
    console.log(event.target.checked)
    if(event.target.checked){
      this.additionData[i]['clearing_header'][0]['clearing_details'][j]['approved']=true;
    }
    else{
      this.additionData[i]['clearing_header'][0]['clearing_details'][j]['approved']=false;
    }
    console.log(this.additionData);

  }
  submitteddata(){
    if(this.searchForm.get('tobucket').value =='' || this.searchForm.get('tobucket').value.id ==undefined || this.searchForm.get('tobucket').value.id ==null || this.searchForm.get('tobucket').value==undefined){
      this.notifications.showError('Please Select The Bucket Name');
      return false;
    }
    let listdata:Array<any>=[];
    for(let i=0;i<this.additionData.length;i++){
      for(let j=0;j<this.additionData[i]['clearing_header'][0]['clearing_details'].length;j++){
        if(this.additionData[i]['clearing_header'][0]['clearing_details'][j]['approved']==true){
          listdata.push(this.additionData[i]['clearing_header'][0]['clearing_details'][j].id)
        }
       }
    }
    if(listdata.length==0){
      this.notifications.showError('Please Select The Any Data');
      return false;
    }
    let d:any={'clearing_details':listdata,
        'to_bucket':this.searchForm.get('tobucket').value.id
    };
    console.log(listdata);
    this.spinner.show();
    this.btndisable=true;
    this.faservice.getbucketsummarysubmit(d).subscribe(data=>{
      this.spinner.hide();
      this.btndisable=false;
      if(data['status']=='success'){
        this.notifications.showSuccess('Suucessfully Moved');
        this.router.navigate(['/fa/bucketsummary']);
      }
      else{
        this.notifications.showWarning(data['code']);
        this.notifications.showWarning(data['description']);
        this.notifications.showError('Failed To  Move');
      }
    },
    (error)=>{
      this.btndisable=false;
      this.spinner.hide();
    }
    );
  }
  getcitydata(data,i){
    this.additionData[i]['con']=!this.additionData[i]['con'];
  }
  public frombucketinterface(data?:bucketdata):string | undefined{
    return data?data.name:undefined;
  }
  public tobucketinterface(data?:bucketdata):string | undefined{
    return data?data.name:undefined;
  }
  autocompletecommodityScroll_tobucket() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.faservice.getbucketsummarydropdownexclude( this.currentpagecom_branch+1,this.Inputbranch.nativeElement.value ,this.searchForm.get('frombucket').value.id)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.toBucketList = this.toBucketList.concat(datas);
                    if (this.toBucketList.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}
