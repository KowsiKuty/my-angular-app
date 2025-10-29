import { Component,ViewChild, OnInit ,Output,EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { } from '@angular/forms';
import { Observable,fromEvent, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'
import { NotificationService } from 'src/app/service/notification.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


export interface bslist {
  id: string;
  name: string;
  code:string;
}

@Component({
  selector: 'app-costcentre-edit',
  templateUrl: './costcentre-edit.component.html',
  styleUrls: ['./costcentre-edit.component.scss']
})

export class CostcentreEditComponent implements OnInit {
  CCEditForm: FormGroup;
  isLoading = false;
  BusinesssegmentList:any=[]
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  bsCode: any;
  bsName: any;
  bsID: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('Businesssegment') matBusinesssegmentAutocomplete: MatAutocomplete;
  @ViewChild('BusinesssegmentInput') BusinesssegmentInput: any;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private shareService: ShareService, private router:Router,private spinner:NgxSpinnerService,
    private fb: FormBuilder,private dataService: masterService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.CCEditForm = this.fb.group({
      bsname:['', Validators.required],
      bscode:[''],
      name:['', Validators.required],
      no:['', Validators.required],
      code:[''],
      remarks:[''],
      description:['', Validators.required],
    })
    this.dataService.getBusinesssegmentname('',1).subscribe(data=>{
      this.BusinesssegmentList=data['data'];
    })
    this.CCEditForm.get('bsname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.dataService.getBusinesssegmentname(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.BusinesssegmentList = results["data"];
      console.log('branch_id=',results)
      console.log('branch_data=',this.BusinesssegmentList)

    })
  
    this.getCostCentreEdit();
  }
  public displaybslist(bsl?: bslist): string | undefined {
    return bsl ? bsl.name : undefined;
    }
    editid:any
    businesssegment_id:any;
  getCostCentreEdit() {
    this.editid = this.shareService.costCentreEditValue.value;
    this.dataService.costCentreEditForm(this.editid).subscribe(res=>{
    let Code = res.code
    let No = res.no
    let CCname=res.name
    let Description = res.description
    let Remarks = res.remarks
    this.businesssegment_id=res?.businesssegment_id?.id
 
    this.CCEditForm.patchValue({
      bsname:{'id':res?.businesssegment_id?.id,'name':res?.businesssegment_id?.name},
      bscode:res?.businesssegment_id?.code,
      no:No,
      code:Code,
      name:CCname,
      description:Description,
      remarks:Remarks,
    })
    })
  }
  autocompleteScroll_Businesssegment(){
    setTimeout(() => {
      if (this.matBusinesssegmentAutocomplete && this.autocompleteTrigger && this.matBusinesssegmentAutocomplete.panel) {
        fromEvent(this.matBusinesssegmentAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.dataService.getBusinesssegmentname( this.BusinesssegmentInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.BusinesssegmentList = this.BusinesssegmentList.concat(datas);
                    if (this.BusinesssegmentList.length >= 0) {
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

 

  submitForm(){
    // let data:any=this.shareService.costCentreEditValue.value;
    // console.log(data);
    let createdata:any={
      'id':this.editid,
      'businesssegment_id':this.businesssegment_id,
      "remarks":this.CCEditForm.get('remarks').value,
      "description":this.CCEditForm.get('description').value,
      "name":this.CCEditForm.get('name').value,
      "no":this.CCEditForm.get('no').value,
      "code":this.CCEditForm.get('code').value,
      "bsname":this.CCEditForm.get('bsname').value,
      "bscode":this.CCEditForm.get('bscode').value,
      
  
    }
    this.spinner.show();
    this.dataService.createCostCentreForm(createdata).subscribe(res => {
    this.spinner.hide();  
      if (res.code === "UNEXPECTED_ERROR") {
        this.notification.showWarning(res.description)
      } else if (res.code === "INVALID_DATA") {
        this.notification.showWarning(res.description)
      }
      else if(res.code==="INVALID COSTCENTER ID"){
        this.notification.showWarning(res.description)
      }
      else {
        this.notification.showSuccess("Updated Successfully");
        this.onSubmit.emit();
      }
      return true

    }
    )
    
  }
  omit_special_char(event){
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  
  }
  cancelCCedit(){
    this.onCancel.emit()

  }
}
