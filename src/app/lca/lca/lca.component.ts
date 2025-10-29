import { Component, EventEmitter, OnInit,Output,ViewChild } from '@angular/core';
import { FormGroup,FormArray,FormBuilder,FormControlName } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LcaService } from '../lca.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { LcasharedService } from '../lcashared.service';
import { fromEvent } from 'rxjs';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ErrorhandlerService } from '../errorhandler.service';


export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}
export interface commoditylistss {
  id: string;
  name: string;
}

export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}
@Component({
  selector: 'app-lca',
  templateUrl: './lca.component.html',
  styleUrls: ['./lca.component.scss']
})
export class LcaComponent implements OnInit {
  lca_sub_Menu_list:any
  sub_module_url:any
  lcaformpath:boolean
  lcaapproverpath:boolean
  lcaexpcreate:boolean
  lcaexpcreatesummary:boolean
  lcaapproversummary:boolean
  lcamaker:any
  lcaapprover:any
  lcaexpensecrete:any
  lcaform:boolean=false
  lcacreationform:boolean
  lcaviewback:boolean
  LcaSummaryForm:FormGroup
  presentpage:any=1;
  pagesize = 10;
  header_deatils:any
  currentpage=1;
  commodityid:any

  StatusList:any

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  commodityList: Array<commoditylistss>
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closetranbutton') closetranbutton;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserapptyperole') matappraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild('raiserappInput') raiserappInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  Branchlist: Array<branchListss>;
  Raiserlist:any
  isLoading:boolean
  amt:any
  lcacrno:any
  issummarypage: boolean = true;
  lcajebranch:any
  data:any
  lcacreated_by:any
  lcajestatus:any
  has_next=true
  has_previous=true
  listlcadetails:any
  tableviewdata:any
  beneficiarydata:any
  filedtailsdata:any
  lcacommodity:any

  has_pagenext = true;
  has_pageprevious = true;
  jvpresentpage: number = 1;
  jvpagesize = 10;
  presentjvsum: number = 1;
  length_jvsum = 0;
  pageIndexjvsum = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_jvsum=10;
  // startingRowNumber=1
  showFirstLastButtons:boolean=true;

  constructor(private sharedService: SharedService,private fb:FormBuilder,private spinner:NgxSpinnerService,
    private lcaserv:LcaService,private toastr:ToastrService,private notification: NotificationService,
    private lcashared:LcasharedService,private router:Router,private errorHandler:ErrorhandlerService) { }

  ngOnInit(): void {
    let datas = this.sharedService?.menuUrlData;

    datas?.forEach((element) => {
      let subModule = element?.submodule;
      if (element?.name === "Local Conveyance") {
        this.lca_sub_Menu_list = subModule;
      
      }
    });
    this.LcaSummaryForm=this.fb.group({
      crno:[''],
      jebranch:[''],
      created_by:[''],
      jestatus:[''],
      commadity:['']
     
    })
    this.getjournalstatus();
    this.search();
  }
  lca(data){

    this.sub_module_url = data.url;
    
    this.lcamaker = "/lcasummary"
    this.lcaapprover = "/lcapprover"
    this.lcaexpensecrete= "/lcaexpense"

    this.lcaformpath = this.lcamaker === this.sub_module_url ? true : false;
    this.lcaapproverpath = this.lcaapprover === this.sub_module_url ? true : false;
    this.lcaexpcreate = this.lcaexpensecrete === this.sub_module_url ? true : false;

    if(this.lcaformpath){
      this.lcaform = true
      this.lcacreationform =false
      this.lcaapproversummary =false;
      this.lcaexpcreatesummary=false;
  
      this.search();
      
    }

    if(this.lcaapproverpath){
      this.lcaform = false
      this.lcacreationform =false
      this.lcaapproversummary =true
      this.lcaexpcreatesummary=false
  
    }
    if(this.lcaexpcreate){
      this.lcaform = false
      this.lcacreationform =false
      this.lcaapproversummary =false
      this.lcaexpcreatesummary=true
  
    }
  }
  create()
  {
    this.lcaform = true
    this.lcacreationform =false
    this.lcaapproversummary =false
    this.lcaexpcreatesummary=false

    this.search()
  }
 
  lcasummaryview()
  {
    // this.lcaform = true
    // this.lcacreationform = false
    // this.lcaapproversummary =false
    // this.lcaexpcreatesummary=false
    // this.lcaviewback=false
    // this.search()
  }
  lcaappsumm()
  {
    // this.lcaform=false
    // this.lcacreationform =false
    // this.lcaapproversummary =true
    // this.lcaexpcreatesummary=false
    // this.lcaviewback =false

  }
  delete(d){
    this.spinner.show()
    let id=d.id
    this.lcaserv.jvheaderdelete(id)
    .subscribe(result =>{
     
      if(result.status == "success"){
      this.notification.showSuccess("Deleted Successfully")
      this.search()
      this.spinner.hide()
      }else{
        this.notification.showError(result.description)
        this.spinner.hide()
        return false;
      }
    })
  }
  coverNotedownload(d) {
    
    this.lcaserv.coverNotedownload(d.id)
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


  
  createlca()
  {
    this.lcaform = false
    this.lcacreationform =true
    this.lcaapproversummary =false

  }
  // getdeatils() {
  //   this.spinner.show();
  //   this.lcaserv.creationdetails().subscribe(results => {
  //     this.spinner.hide();
  //     let r = results;
  //     this.lcashared.header_deatils.next(r); 
  //   });
  // }
  
  handlePageEvent(event: PageEvent) {
    this.length_jvsum = event.length;
    this.pageSize_jvsum = event.pageSize;
    this.pageIndexjvsum = event.pageIndex;
    this.presentjvsum=event.pageIndex+1;
    // this.startingRowNumber = (event.pageIndex * event.pageSize) + 1;
    this.search()
  }

  search()
  {
    // this.spinner.show()
    let fill:any={};
   if(this.LcaSummaryForm.get('crno').value !=null && this.LcaSummaryForm.get('crno').value !='' ){
    fill['lcacrno']=this.LcaSummaryForm.get('crno').value;
   }
   if(this.LcaSummaryForm.get('jebranch').value !=null && this.LcaSummaryForm.get('jebranch').value !='' ){
    fill['lcabranch']=this.LcaSummaryForm.get('jebranch').value.id;
   }
   if(this.LcaSummaryForm.get('created_by').value !=null && this.LcaSummaryForm.get('created_by').value !='' ){
    fill['created_by']=this.LcaSummaryForm.get('created_by').value.id;
   }
   if(this.LcaSummaryForm.get('jestatus').value !=null && this.LcaSummaryForm.get('jestatus').value !='' ){
    fill['lcastatus']=this.LcaSummaryForm.get('jestatus').value.id;
   }
   if(this.LcaSummaryForm.get('commadity').value !=null && this.LcaSummaryForm.get('commadity').value !='' ){
    fill['lcacommodity']=this.LcaSummaryForm.get('commadity').value.id;
   }
   console.log("Searched Values",fill)
    this.lcaserv.lcasearch(fill,this.presentjvsum).subscribe(data=>{
      console.log('rr=',data);
      this.data=data['data'];
      let datapagination=data['pagination'];
      // this.spinner.hide()
      if (this.data?.length === 0) {
        this.issummarypage = false
        this.length_jvsum = 0
      }
      if (this.data?.length > 0) {
        this.presentjvsum = datapagination?.index;
        this.issummarypage = true
        this.length_jvsum = datapagination?.count
        
      }
      if(data?.code)
      {
        this.spinner.hide()
        this.notification.showError(data?.description)
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
   
  }
  nextClickjv() {
    if (this.has_next === true) {
      this.search()
    }
  }

  previousClickjv() {
    if (this.has_previous === true) {
      this.search()
    }
  }
  resetlca()
  {
    this.LcaSummaryForm.controls['crno'].reset(""),
    this.LcaSummaryForm.controls['jebranch'].reset(""),
    this.LcaSummaryForm.controls['created_by'].reset(""),
    this.LcaSummaryForm.controls['jestatus'].reset("")
    this.search()
  }
  filepopback()
  {
    this.closedbuttons.nativeElement.click();
  }
  maker:boolean =false
  id:any


  showjvsummaryviews(data)
  {
    this.id=data?.id
    this.lcashared.viewvalue.next(this.id)
    this.router.navigate(['lca/viewdeatils'])
  }
  transdata:any
  transview(data)
  {
    // this.spinner.show()
    let id=data?.id
    this.lcaserv.viewtrans(id).subscribe(results=>{
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
  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.LcaSummaryForm.get('jebranch');
  }
  

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.code + "-" + branchtype.name : undefined;

  }

  get branchtype() {
    return this.LcaSummaryForm.get('created_by');
  }

  branchdropdown(branchkeyvalue) {
    this.lcaserv.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.Branchlist = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
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
                this.lcaserv.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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

  getcommoditydata(datas) {
    this.commodityid = datas.id
  }
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }
  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.LcaSummaryForm.get('commadity').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.lcaserv.getcommodityscroll(value, 1)
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
  }
  getcommodity(commoditykeyvalue) {
    this.lcaserv.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
        if(results?.code)
        {
          this.spinner.hide()
          this.notification.showError(results?.description)
        }
      }, error => {
        // this.errorHandler.handleError(error);
        this.spinner.hide();
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
              if (this.has_next === true) {
                this.lcaserv.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
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
  getraiserdropdown() {

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.LcaSummaryForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.lcaserv.getrmscroll(value, 1)
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
    this.LcaSummaryForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.lcaserv.getrmscroll(value, 1)
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
    return this.LcaSummaryForm.get('created_by');
  }
  public displayFnappraiserrole(raiserapptyperole?: raiserlists): string | undefined {
    return raiserapptyperole ? raiserapptyperole.full_name : undefined;
  }

  get raiserapptyperole() {
    return this.LcaSummaryForm.get('created_by');
  }

  getrm(rmkeyvalue) {
    this.lcaserv.getrmcode(rmkeyvalue)
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
                this.lcaserv.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
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

  raiserappScroll() {
    setTimeout(() => {
      if (
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete.panel
      ) {
        fromEvent(this.matappraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.lcaserv.getrmscroll(this.raiserappInput.nativeElement.value, this.currentpage + 1)
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
 
  getjournalstatus(){
    this.lcaserv.getstatus()
    .subscribe(result =>{
      if(result){
      let StatusList = result['data']
      this.StatusList = StatusList
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinner.hide()
    })
  }
  Editlca(data){
    console.log(data);
  }
}
