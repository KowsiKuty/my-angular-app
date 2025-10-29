import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faservice } from '../fa.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-fa-acc-repost',
  templateUrl: './fa-acc-repost.component.html',
  styleUrls: ['./fa-acc-repost.component.scss']
})
export class FaAccRepostComponent implements OnInit {
  accountDetailslist:Array<any>=[];
  sumofdebit:number=0;
  sumofcredit:number=0;
  accountingBarcodeList:Array<any>=[];
  isLoading:boolean=false;
  assetform:any=FormGroup;
  constructor(private fb:FormBuilder,private faservice:faservice,private toastr:NgxSpinnerService,private noti:ToastrService) { }

  ngOnInit(): void {
    this.assetform=this.fb.group({
      'barcode':new FormControl()
    });
    this.assetform.get('barcode').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.faservice.gatAccountingBarcodeList(value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.accountingBarcodeList=data['data'];
     
    });
  }
  Accountdetails(data:any){
    this.sumofcredit=0;
    this.sumofdebit=0;
   
      this.toastr.show();
      this.faservice.AccountingDetailsData(data.refno).subscribe((result) => {
      if(result){
        this.toastr.hide();
        this.accountDetailslist = result['data'];
        
        if(this.accountDetailslist.length>0){
          for(let i=0;i<this.accountDetailslist.length;i++){
            if(this.accountDetailslist[i]['type']== "CREDIT"){
              this.sumofcredit=this.sumofcredit+Number(this.accountDetailslist[i]['amount']);
            }
            if(this.accountDetailslist[i]['type']== "DEBIT"){
              this.sumofdebit=this.sumofdebit+Number(this.accountDetailslist[i]['amount']);
            }
          }
          let pagination:any=result['pagination'];
          
  
        }
        else{
          this.noti.warning('No Data ');
         
          
        }
      }
        },
        (error)=>{
          this.toastr.hide();
          this.sumofcredit=0;
          this.sumofdebit=0;
          this.accountDetailslist=[];
        }
        )
  }
  Accountdetails_Repost(){
    if(this.accountDetailslist.length==0){
      this.noti.warning("Please Select The Valid Barcode");
      return false;
    }
   
      this.toastr.show();
      this.faservice.AccountingDetailsDataRepost(this.assetform.get('barcode').value).subscribe((result) => {
        this.toastr.hide();
        if(result.code!=undefined && result.code!=''){
          this.noti.warning(result.code);
          this.noti.warning(result.description);
        }
        else{
          this.noti.warning(result.status);
          this.noti.warning(result.message);
        }
        },
        (error)=>{
          this.toastr.hide();
          
        }
        )
  }
}
