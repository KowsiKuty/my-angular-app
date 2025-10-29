import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import { FormGroup,FormArray,FormBuilder,FormControlName } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LcaService } from '../lca.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { LcasharedService } from '../lcashared.service';
import { Router } from '@angular/router';
import {PageEvent} from '@angular/material/paginator';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorhandlerService } from '../errorhandler.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';




export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}

export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}
@Component({
  selector: 'app-lca-approval-summary',
  templateUrl: './lca-approval-summary.component.html',
  styleUrls: ['./lca-approval-summary.component.scss']
})
export class LcaApprovalSummaryComponent implements OnInit {

  LcaAppSummaryForm:FormGroup
  apprejform:FormGroup


  lcacrno:any
  data:any
  has_next=true
  has_previous=true
  presentpage:any=1;
  pagesize = 10;
  listlcadetails:any
  tableviewdata:any
  bretoEcfID:any
  beneficiarydata:any
  filedtailsdata:any
  amt:any
  id:any
  appflag:boolean=true
  status:any
  lcajebranch:any
  lcacreated_by:any
  issummarypage: boolean = true;
  Branchlist: Array<branchListss>;

  currentpage=1;
  Raiserlist:any
  isLoading:boolean
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closetranbutton') closetranbutton;
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;

  constructor(private sharedService: SharedService,private fb:FormBuilder,private spinner:NgxSpinnerService,
    private lacserv:LcaService,private toastr:ToastrService ,private notification:NotificationService,
    private lcashared:LcasharedService,private router:Router,private errorhandler:ErrorhandlerService) { }

  ngOnInit(): void {
    this.LcaAppSummaryForm=this.fb.group({
      crno:[''],
      jebranch:[''],
      created_by:['']
    })
    this.apprejform=this.fb.group({
      remark:['']
    })
    this.search()
   
  }

  search()
  {
    this.spinner.show()
    let fill:any={};
   if(this.LcaAppSummaryForm.get('crno').value !=null && this.LcaAppSummaryForm.get('crno').value !='' ){
    fill['lcacrno']=this.LcaAppSummaryForm.get('crno').value;
   }
   if(this.LcaAppSummaryForm.get('jebranch').value !=null && this.LcaAppSummaryForm.get('jebranch').value !='' ){
    fill['lcabranch']=this.LcaAppSummaryForm.get('jebranch').value.id;
   }
   if(this.LcaAppSummaryForm.get('created_by').value !=null && this.LcaAppSummaryForm.get('created_by').value !='' ){
    fill['lcacreated_by']=this.LcaAppSummaryForm.get('created_by').value.id;
   }

    this.lacserv.lcaapprovalsearch(fill,this.presentpage).subscribe(data=>{
      console.log('rr=',data);
      this.data=data['data'];
      let datapagination=data['pagination'];
      this.spinner.hide()
      if (this.data?.length === 0) {
        this.issummarypage = false
        this.length_jvsum = 0
      }
      if (this.data?.length > 0) {
        this.presentjvsum = datapagination?.index;
        this.issummarypage = true
        this.length_jvsum = datapagination?.count
        
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
   
  }

  coverNotedownload(d) {
    
    this.lacserv.coverNotedownload(d.id)
      .subscribe((results) => {
        
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "CoverNote.pdf";
        link.click();
      })
    }
  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.LcaAppSummaryForm.get('jebranch');
  }
  

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.code + "-" + branchtype.name : undefined;

  }

  get branchtype() {
    return this.LcaAppSummaryForm.get('created_by');
  }

  branchdropdown(branchkeyvalue) {
    this.lacserv.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.Branchlist = datas;
        }

      },(error) => {
        this.errorhandler.handleError(error);
        this.spinner.hide()
      })
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
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
              if (this.has_next === true) {
                this.lacserv.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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
  transdata:any
  transview(data)
  {
    // this.spinner.show()
    let id=data?.id
    this.lacserv.viewtrans(id).subscribe(results=>{
      this.spinner.hide()
      console.log('trans=',data);
      this.transdata=results["data"]
      if(results?.code)
      {
        this.spinner.hide()
        this.notification.showError(results?.description)
      }
    })
  }
  name:any;
  designation : any;
  branch:any;
  view(dt){
    this.name=dt.from_user_id.name + ' - ' + dt.from_user_id.code
    this.designation=dt.from_user_id.designation
    // this.branch=dt.from_user_branch.name + ' - ' + dt.from_user_branch.code
    this.branch=dt.from_user_branch
   }
   viewto(dt)
  {
    this.name=dt.to_user_id.name + ' - ' + dt.to_user_id.code
    this.designation=dt.to_user_id.designation
    // this.branch=dt.to_user_branch.name + ' - ' + dt.to_user_branch.code
    this.branch=dt.to_user_branch
  } 

  tranback(){
    this.closetranbutton.nativeElement.click()
    this.transdata=[];
  }
  presentjvsum: number = 1;
  length_jvsum = 0;
  pageIndexjvsum = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_jvsum=10;
  showFirstLastButtons:boolean=true;
  handlePageEvent(event: PageEvent) {
    this.length_jvsum = event.length;
    this.pageSize_jvsum = event.pageSize;
    this.pageIndexjvsum = event.pageIndex;
    this.presentjvsum=event.pageIndex+1;
    
  }
  filepopback()
  {
    this.closedbuttons.nativeElement.click();
  }
 
  getraiserdropdown() {

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.LcaAppSummaryForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.lacserv.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })



  }

  getraiserappdropdown(){

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.LcaAppSummaryForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.lacserv.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })




  }


  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  get raisertyperole() {
    return this.LcaAppSummaryForm.get('created_by');
  }
  public displayFnappraiserrole(raiserapptyperole?: raiserlists): string | undefined {
    return raiserapptyperole ? raiserapptyperole.full_name : undefined;
  }

  get raiserapptyperole() {
    return this.LcaAppSummaryForm.get('created_by');
  }

  getrm(rmkeyvalue) {
    this.lacserv.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        // this.errorHandler.handleError(error);
        this.spinner.hide()
      })
  }

  raiserScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.lacserv.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
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
  showjvsummaryviews(data)
  {
    this.lcashared.appReject.next(this.appflag)
    console.log("54152122",)
    this.id=data?.id
    this.lcashared.viewvalue.next(this.id)
    this.router.navigate(['lca/viewdeatils'])
  //   this.spinner.show()
  // let id=data.id
  // this.appflag=true
  // this.lacserv.getview(id).subscribe(data=>
  //   {
  //     this.spinner.hide();
  //     this.listlcadetails=data
  //     this.tableviewdata=this.listlcadetails["lcadetails"]
  //     this.amt=this.listlcadetails["lcadetails"]?.lcadamount
  //     this.beneficiarydata=this.listlcadetails["beneficiary"]
  //     this.filedtailsdata=this.listlcadetails["file_data"]
  //     if(data?.code)
  //     {
  //       this.spinner.hide();
  //       this.notification.showError(data?.description)
  //     }
  //   })
  }

  resetlcaapp()
  {
    this.LcaAppSummaryForm.controls['crno'].reset(""),
    this.LcaAppSummaryForm.controls['jebranch'].reset(""),
    this.LcaAppSummaryForm.controls['created_by'].reset("")
    // this.LcaAppSummaryForm.controls['jestatus'].reset("")
  }
  
}
