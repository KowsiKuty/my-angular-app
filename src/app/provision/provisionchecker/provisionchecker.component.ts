import {
  Component,
  OnInit,
  Inject,
  Injectable
} from '@angular/core';
import {
  ProisionshareserviceService
} from '../proisionshareservice.service';
import {
  ProvisionService
} from '../provision.service'
import {
  NotificationService
} from '../notification.service';
import {
  ErrorHandlingprovisionService
} from '../error-handlingprovision.service'
import {
  Router,
  ActivatedRoute
} from '@angular/router'
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  DatePipe,
  formatDate
} from '@angular/common';
import {
  Observable,
  Observer
} from 'rxjs';

import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
// import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

// import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface Module {
  text: string;
  id: string;
  
}
export interface BS {
  name: string;
  id: string;
  
}
export interface BRANCH {
  name: string;
  id: string;
  
}
export interface CC {
  name: string;
  id: string;
  
}
export interface ExampleTab {
  tab_name: string;
  tab_id: string;
}
@Component({
  selector: 'app-provisionchecker',
  templateUrl: './provisionchecker.component.html',
  styleUrls: ['./provisionchecker.component.scss']
})
export class ProvisioncheckerComponent implements OnInit {

  showEmail: boolean = false;
  options: string[] = ['Approve', 'Reject'];
  provisiondata = [];
  // tabs=['USER','SYSTEM','PREVIOUS']
  has_previous = false;
  has_next = false;
  presentpages = 1
  provisiondata_previousmonth = [];
  has_previous_month = false;
  has_next_month = false;
  presentpages_month = 1
  has_previouss = false;
  has_nexts = false;
  presentpage = 1

  isChecked: any;
  moveto_checker = [];
  isShown = false
  display: string;
  approval: any;
  approvaldata = []
  search='';
  provisionsearch: FormGroup;
  p_mainStatus: any;
  systemdata=[];
  tab: string;
  date =new Date().toLocaleString('en-us',{month:'long'});
  pre_date=new  Date()
  previousm=this.pre_date.setMonth(this.pre_date.getMonth()-1);
  previousMonth = this.pre_date.toLocaleString('default', { month: 'long' });
  tabs = [{
    "tab_name": "Provisions Submission-"+this.date.toString(),
    "tab_id": "1"
  },
  // {
  //   "tab_name": "Provisions Taken-"+this.previousMonth,
  //   "tab_id": "2"
  // },
  {
    "tab_name": 'Provision WiseFin Pipeline-'+this.date,
    "tab_id": "3"
  }
]
  branchdata: any;
  isLoading: boolean;
  moduledata: any;
  bsdata: any;
  bsid: any;
  ccdata: any;
  constructor(public datepipe: DatePipe, private fb: FormBuilder, private Service: ProvisionService, private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingprovisionService, public share: ProisionshareserviceService, public router: Router) {}



  ngOnInit(): void {
    // this.get_tabe({ "tab_name": "USER", "tab_id": "1" })
    this.provisiongetsummaryp(1, 10, 1)
    this.internalapi(1, 10, 1)
    this.previos(1)
    this.provisionsearch= this.fb.group({
      module_id: [''],cc_id:[''],bs_id:[''],branch_id:['']

    })
  }

  subModuleData(p){
    if(p.index==0){
      
      this.provisiongetsummaryp(1, 10, 1)
  
  }
    else if(p.index==1) {
      this.internalapi(1, 10, 1)
    }else{
      this.previos(1)
    }
  }


  public provisiongetsummaryp(p, s, id) {
    this.search=''
    this.Service.provisionsummaryfilter(p, s, id)
      .subscribe((results: any[]) => {
        this.provisiondata = results["data"];
        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
        } else {
          this.provisiondata = [];
        }
      })

  }

  public previos(p) {
    this.Service.previousdata(p,'','')
      .subscribe((results: any[]) => {
        this.provisiondata_previousmonth  = results["data"];
        if (this.provisiondata_previousmonth.length > 0) {
          this.has_next_month = results['pagination'].has_next;
          this.has_previous_month = results['pagination'].has_previous;
          this.presentpages_month = results['pagination'].index;
        } else {
          this.provisiondata_previousmonth = [];
        }
      })

  }
  tab2previous(){
    if (this.has_previous_month === true) {
      this.previos(this.presentpages_month - 1)
    }
  }
  tab2nextClick(){
    if (this.has_next_month === true) {
      
      this.previos(this.presentpages_month +1)
    }
  }



  public internalapi(p, s, id) {
    this.search=''

    this.Service.systemcall(p, s, id)
      .subscribe((results: any[]) => {
        this.systemdata = results["data"];
        if (this.systemdata.length > 0) {
          this.has_nexts = results['pagination'].has_next;
          this.has_previouss = results['pagination'].has_previous;
          this.presentpages = results['pagination'].index;
        } else {
          this.systemdata = [];
        }
      })

  }
  systemdatasearch(p,m){
    this.search='search'
    // m=this.provisionsearch.value.module_id.id
    if(this.provisionsearch.value.module_id==null ||this.provisionsearch.value.module_id==''){
      this.provisionsearch.value.module_id=''
    }
    else{
      this.provisionsearch.value.module_id=this.provisionsearch.value.module_id.id
    }
    if(this.provisionsearch.value.cc_id==null ||this.provisionsearch.value.cc_id==''){
      this.provisionsearch.value.cc_id=''
    }
    else{
      this.provisionsearch.value.cc_id=this.provisionsearch.value.cc_id.id   }

    if(this.provisionsearch.value.bs_id==null ||this.provisionsearch.value.bs_id==''){
      this.provisionsearch.value.bs_id=''
    }
    else{
      this.provisionsearch.value.bs_id=this.provisionsearch.value.bs_id.id
    }
    if(this.provisionsearch.value.branch_id==null ||this.provisionsearch.value.branch_id==''){
      this.provisionsearch.value.branch_id=''
    }else{
      this.provisionsearch.value.branch_id=this.provisionsearch.value.branch_id.id
    }
    
    this.Service.systemdatasearch(p,this.provisionsearch.value,1)
      .subscribe((results: any[]) => {
        this.systemdata = results["data"];
        if (this.systemdata.length > 0) {
          this.has_nexts = results['pagination'].has_next;
          this.has_previouss = results['pagination'].has_previous;
          this.presentpages = results['pagination'].index;
          this.provisionsearch.reset();
        } else {
          this.systemdata = [];
          this.search=''
        }
      })
  }
  checkersearch(p,m){
    this.search='search'
    if(this.provisionsearch.value.module_id==null ||this.provisionsearch.value.module_id==''){
      this.provisionsearch.value.module_id=''
    }
    else{
      this.provisionsearch.value.module_id=this.provisionsearch.value.module_id.id
    }
    if(this.provisionsearch.value.cc_id==null ||this.provisionsearch.value.cc_id==''){
      this.provisionsearch.value.cc_id=''
    }
    else{
      this.provisionsearch.value.cc_id=this.provisionsearch.value.cc_id.id   }

    if(this.provisionsearch.value.bs_id==null ||this.provisionsearch.value.bs_id==''){
      this.provisionsearch.value.bs_id=''
    }
    else{
      this.provisionsearch.value.bs_id=this.provisionsearch.value.bs_id.id
    }
    if(this.provisionsearch.value.branch_id==null ||this.provisionsearch.value.branch_id==''){
      this.provisionsearch.value.branch_id=''
    }else{
      this.provisionsearch.value.branch_id=this.provisionsearch.value.branch_id.id
    }
    
    this.Service.chekersearch(p,this.provisionsearch.value,3)
      .subscribe((results: any[]) => {
        this.provisiondata = results["data"];
        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
          this.provisionsearch.reset();
        } else {
          this.provisiondata = [];
          this.search=''
        }
      })
  }

  tab3nextClick() {
    if (this.has_nexts === true) {
      

      this.presentpages = this.presentpages + 1
      if(this.search=='search'){
        this.systemdatasearch(this.presentpages,1)
      }else{
      this.internalapi(this.presentpages, 10, 1)}

    }
  }

  tab3previousClick() {
    if (this.has_previouss === true) {
      this.presentpages = this.presentpages -1
      if(this.search=='search'){

        this.systemdatasearch(this.presentpages,1)
      }else{

      this.internalapi(this.presentpages, 10, 1)}
    }
  }

  nextClick() {
    if (this.has_next === true) {

      this.presentpage = this.presentpage + 1
      this.provisiongetsummaryp(this.presentpage, 10, 1)

    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.provisiongetsummaryp(this.presentpage - 1, 10, 1)
    }
  }
  provisionstatus(status) {
    this.p_mainStatus = status;
  }
  getvalue(check, index, d) {

    if (check) {
      d['is_ignore'] = 1;
      d['narration'] = d.description;
      if (d.provision_status.status == 'Draft') {
        this.moveto_checker.push(d);
      }
      if (d.provision_status.status == 'Moved_To_Checker') {
        this.moveto_checker.push(d);
      }
      if (d.provision_status.status == 'Moved_To_Approver') {
        this.moveto_checker.push(d);
      }
    } else {
      this.moveto_checker.splice(this.moveto_checker.indexOf(d), 1);
    }
    console.log(this.moveto_checker)
  }
  checker() {
    let role = ''
    if (this.p_mainStatus == '' || undefined) {
      this.notification.showWarning('Please Choose one')
      return false
    }


    if (this.p_mainStatus == 'Approve') {

      if (this.moveto_checker[0].provision_status.status == 'Moved_To_Checker') {
        role = 'Moved_To_Approver'
      }
    } else {
      role = 'Reject_Checker'

    }
    this.Service.movetoapprover_provision(this.moveto_checker, role)
      .subscribe(result => {
        if (result.status == 'success') {
          console.log("RESULSSS", result)
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.provisiongetsummaryp(1, 10, 1)
          this.internalapi(1, 10, 1)
          this.moveto_checker = []
          this.systemdata = [];
          this.router.navigate(['/provisionchecker'], {
            skipLocationChange: true
          })
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }

        }





      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });

  }


  get_tabe(value) {
    if (value.tab_name == 'USER') {
      this.tab = 'USER'
    } else if(value.tab_name == 'SYSTEM') {
      this.tab = 'SYSTEM'
    }else{
      this.tab='Previous Provision'
    }
    // this.modify_changestatus = value.tab.textLabel
    console.log(value)

  }



// branch

branchget() {
  let bs: String = "";
  this.getbranch(bs);

  this.provisionsearch.get('branch_id').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      // console.log('inside tap')

    }),
    switchMap(value => this.Service.search_employeebranch(value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

    .subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
}

getbranch(val){
  this.Service.search_employeebranch(val).subscribe((results: any[]) => {
    this.branchdata = results["data"];
   
  })

}
public displayFnbranch(_branchval?: BRANCH): string | undefined {
  return _branchval ? _branchval.name : undefined;
}

get _branchval() {
  return this.provisionsearch.value.get('branch_id');
}

// branchend
// module

module() {
  let bs: String = "";
  this.modulefn(bs);

  this.provisionsearch.get('module_id').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      // console.log('inside tap')

    }),
    switchMap(value => this.Service.moduleget(value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

    .subscribe((results: any[]) => {
      this.moduledata = results["data"];
     
    })
}

modulefn(val){
  this.Service.moduleget(val).subscribe((results: any[]) => {
    this.moduledata = results["data"];
   
  })

}
public displayFnmodule(_module?: Module): string | undefined {
  return _module ? _module.text : undefined;
}

get _module() {
  return this.provisionsearch.value.get('module_id');
}

// branchend

  // bs

  bsget() {
    let bs: String = "";
    this.bsdatafun(bs);

    this.provisionsearch.get('bs_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Service.getbsvalue(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
       
      })
  }

  bsdatafun(val){
    this.Service.getbsvalue(val).subscribe((results: any[]) => {
      this.bsdata = results["data"];
     
    })

  }
  public displayFnbs(_bsval?: BS): string | undefined {
    return _bsval ? _bsval.name : undefined;
  }

  get _bsval() {
    return this.provisionsearch.value.get('bs_id');
  }

  bsid_cc(id){
    this.bsid=id;
    this.provisionsearch.get('cc_id').setValue('');
  }
  // bsend
  // cc
  ccget(){
    let cc: String = "";
    this.ccdatafun( this.bsid,cc);

    this.provisionsearch.get('cc_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        

      }),
      switchMap(value => this.Service.getcclistDependentBs( this.bsid,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.ccdata = results["data"];
       
      })
  }
  ccdatafun(id,val){
    this.Service.getcclistDependentBs(id,val).subscribe((results: any[]) => {
      this.ccdata = results["data"];
     
    })

  }
  public displayFncc(_ccval?: CC): string | undefined {
    return _ccval ? _ccval.name : undefined;
  }

  get _ccval() {
    return this.provisionsearch.value.get('cc_id');
  }
  // ccend


}