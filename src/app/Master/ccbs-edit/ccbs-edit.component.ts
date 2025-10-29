import { Component, OnInit,Output,EventEmitter,ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


export interface bslistss {
  id: string;
  name: string;
  description:string;
  code:string;
  no:string;
}
export interface cclistss {
  id: string;
  name: string;
  description:string;
  code:string;
  no:string;
}
@Component({
  selector: 'app-ccbs-edit',
  templateUrl: './ccbs-edit.component.html',
  styleUrls: ['./ccbs-edit.component.scss']
})
export class CcbsEditComponent implements OnInit {
  ccbsMappingEditForm: FormGroup;
@Output() onCancel = new EventEmitter<any>();
@Output() onSubmit = new EventEmitter<any>();

bsList: Array<bslistss>;
costcentre         = new FormControl();

ccList: Array<cclistss>;
businesssegment    = new FormControl();



isLoading = false;
has_next = true;
has_previous = true;
currentpage: number = 1;
  costCentreList: Array<any>;
  businessSegmentList: Array<any>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

@ViewChild('bs') matbsAutocomplete: MatAutocomplete;
@ViewChild('bsInput') bsInput: any;

@ViewChild('cc') matccAutocomplete: MatAutocomplete;
@ViewChild('ccInput') ccInput: any;
  
  constructor(private shareService: ShareService, private router:Router,private spinner:NgxSpinnerService,
    private fb: FormBuilder,private dataService: masterService,private notification: NotificationService) { }

  ngOnInit(): void {
    this.ccbsMappingEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],
      glno: ['', Validators.required],
      costcentre: ['', Validators.required],
      businesssegment: ['', Validators.required],
      description: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    // this.getCostCentre();
    this.getBusinessSegment();
    this.getCCBSMappingEdit();
    this.getbsforadd();
    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    this.ccbsMappingEditForm.get('businesssegment').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getbsFKdd(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;

    })


    let cckeyvalue: String = "";
    this.getcc(cckeyvalue);
    this.ccbsMappingEditForm.get('costcentre').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getccFKdd(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;

    })
   
    
  }
  autocompletebsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.autocompleteTrigger &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbsFKdd(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsList = this.bsList.concat(datas);
                    // console.log("emp", datas)
                    if (this.bsList.length >= 0) {
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
 
    autocompleteccScroll() {
      setTimeout(() => {
        if (
          this.matccAutocomplete &&
          this.autocompleteTrigger &&
          this.matccAutocomplete.panel
        ) {
          fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_next === true) {
                  this.dataService.getccvalue(this.ccInput.nativeElement.value)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.ccList = this.ccList.concat(datas);
                      if (this.ccList.length >= 0) {
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
    
editid:any
businesssegment_id:any
costcentre_id:any
getCCBSMappingEdit() {
  this.editid= this.shareService.ccbsMappingEditValue.value;
  this.dataService.ccbsMappingEditForm(this.editid).subscribe(res=>{
 let Name=res.name;
 let No=res.no;
 let Glno=res.glno;
 let Description=res.description;
 let Remarks=res.remarks;
//  let Businesssegment=res.bs_name
//  let CostCenter=res.cc_name
 this.businesssegment_id={'id':res.businesssegment_id?.id}
 this.costcentre_id={'id':res.costcentre_id?.id}

  this.ccbsMappingEditForm.patchValue({
    businesssegment:{'id':res?.businesssegment_id?.id,'name':res?.businesssegment_id?.name,'no':res?.businesssegment_id?.no},
    costcentre:{'id':res?.costcentre_id?.id,'name':res?.costcentre_id?.name,'no':res?.costcentre_id?.no},
    'name':Name,
    'no':No,
    'glno':Glno,
    'description':Description,
    'remarks':Remarks,
    // 'businesssegment':Businesssegment,
    // 'costcentre':CostCenter
  })
})
  // console.log("ccbs", this.shareService.ccbsMappingEditValue.value)

}
public displayFncc(cc?: cclistss): string | undefined {
  return cc ? cc.name : undefined;
  }
public displayFnbs(bs?: bslistss): string | undefined {
  return bs ? bs.name : undefined;
  }
  
  get bs() {
  return this.ccbsMappingEditForm.get('businesssegment');
  }
  
  private getbs(bskeyvalue) {
  this.dataService.getbsvalue(bskeyvalue)
  .subscribe((results: any[]) => {
  let datas = results["data"];
  this.bsList = datas;
  })
  }
  get cc() {
    return this.ccbsMappingEditForm.get('costcentre');
    }
    
    private getcc(cckeyvalue) {
    this.dataService.getccvalue(cckeyvalue)
    .subscribe((results: any[]) => {
    let datas = results["data"];
    this.ccList = datas;
    })
    }

private getCostCentre() {
  this.dataService.getCostCentre()
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.costCentreList = datas;
      // console.log("ccEdit",datas)

    })
}
private getBusinessSegment() {
  this.dataService.getBusinessSegment()
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.businessSegmentList = datas;
      // console.log("bsEdit",datas)

    })
}
getbsforadd(){
  this.ccbsMappingEditForm.controls['costcentre'].reset("")
  let data:any = this.shareService.BSShare.value
  let businesssegment         = data;
  this.ccbsMappingEditForm.patchValue({
    businesssegment: businesssegment
  })
  }
patch(){
  setTimeout(()=>{ 
  // let bs = this.ccbsMappingEditForm.value.businesssegment.name  
  // let cc = this.ccbsMappingEditForm.value.costcentre.name
  // let bsno = this.ccbsMappingEditForm.value.businesssegment.no
  // let ccno = this.ccbsMappingEditForm.value.costcentre.no
  let bs=this.ccbsMappingEditForm.get('businesssegment').value.name
  let cc=this.ccbsMappingEditForm.get('costcentre').value.name
  let bsno=this.ccbsMappingEditForm.get('businesssegment').value.no
  let ccno=this.ccbsMappingEditForm.get('costcentre').value.no
  
  
  //let str3 = str1.concat( '&', str2);
  this.ccbsMappingEditForm.patchValue({
    // a: alert('name'),
    name: cc + ' & '+ bs,
    no : bsno.toString() + ccno.toString()
    //no : String(bsno) + String(ccno)
  
  })
  
  }, 500);
  }

submitForm(){
  let data:any={
    'id':this.editid,
    // 'businesssegment':this.businesssegment_id,
    // 'costcentre':this.costcentre_id,
    "businesssegment":this.ccbsMappingEditForm.get('businesssegment').value.id,
    "costcentre":this.ccbsMappingEditForm.get('costcentre').value.id,
    "name":this.ccbsMappingEditForm.get('name').value,
    "no":this.ccbsMappingEditForm.get('no').value,
    "glno":this.ccbsMappingEditForm.get('glno').value,
    "description":this.ccbsMappingEditForm.get('description').value,
    "remarks":this.ccbsMappingEditForm.get('remarks').value

  }
  this.spinner.show();
  this.dataService.ccbsCreateForm(data).subscribe(res => {
  this.spinner.hide();  
    if (res.code === "UNEXPECTED_ERROR") {
      this.notification.showWarning(res.description)
    } else if (res.code === "INVALID_DATA") {
      this.notification.showWarning(res.description)
    }
    else if(res.code==="INVALID CCMAPPING ID"){
      this.notification.showWarning(res.description)
    }  
    else{
      this.notification.showSuccess("Updated Successfully");
      this.onSubmit.emit();
    }  
    return true

  })
  
}
cancelCCBSedit(){
  this.onCancel.emit()

}

}
