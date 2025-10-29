import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProofingService } from '../proofing.service';
import { ShareService } from '../share.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-selection-dropdown',
  templateUrl: './account-selection-dropdown.component.html',
  styleUrls: ['./account-selection-dropdown.component.scss']
})
export class AccountSelectionDropdownComponent implements OnInit {

  AccountList = [];
  accounts = null;
  Accountselectiondropdown:FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('account') accountscroll: MatAutocomplete
  @ViewChild('clearbtn') clear: ElementRef;
  // @ViewChild('cc') matccAutocomplete: MatAutocomplete;
  @ViewChild('accountinput') AccountInput: any;
  constructor(private proofingService: ProofingService,private spinner:NgxSpinnerService,private notification:ToastrService,
    private shareservice: ShareService, private renderer: Renderer2,private fb:FormBuilder) { }

  ngAfterViewInit(){
   let sub =  this.shareservice.accountobject.subscribe(res => {
      let value: any = res;
      value?.id == null ? this.clear.nativeElement?.click():''
    })
    this.shareservice.subcriptions.push(sub)
  }
  ngOnInit(): void {
    this.acc_show("")
    this.Accountselectiondropdown=this.fb.group({
      "accountno":['']
    })
    this.getAccountList();
  //   this.Accountselectiondropdown.get('accountno').valueChanges
  //   .pipe(
  //    debounceTime(100),
  //    distinctUntilChanged(),
  //    tap(() => {
  //      this.isLoading = true;
  //    }),
  //   //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
  //    switchMap(value => this.proofingService.getAccountList("", "", '1&account_name='+value)
  //    .pipe(
  //      finalize(() => {
  //        this.isLoading = false
  //      }),)
  //    )
  //  )
  //  .subscribe((results: any[]) => {
  //    let datas = results['data'];
  //    this.AccountList = datas
  //    console.log("location List", this.AccountList)
  //  });
    
  }
  open() {
    // this.accountscroll._getScrollTop.subscribe(() => {
    //   const panel = this.accountscroll.panel.nativeElement;
    //   panel.addEventListener('scroll', event => this.scrolled(event));
    // })
    this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
      // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
      let evet = this.accountscroll.panel.nativeElement
      this.scrolled(evet)
    });

  }
  isLoading;
  has_next;
  has_previous;
  currentpage = 1;
  getAccountList(search = false) {
    this.isLoading = true;
    if (search) {
      this.currentpage = 1;
      this.AccountList = []
    }
    // this.spinner.show()
    this.proofingService.getAccountList("", "", this.currentpage,'')
      .subscribe((results: any) => {
        if(results.code!='' && results.code!=undefined && results.code!=null){
             this.notification.warning(results.code);
             this.notification.warning(results.description);
        }
        else{
        this.isLoading = false;
        this.spinner.hide();
        let data = results['data'];
        this.AccountList = data;
        if (data.length >= 0) {
          this.has_next = results.pagination.has_next;
          // this.has_previous = datapagination.has_previous;
          this.currentpage = results.pagination.index;
        }
      }
      },(error:HttpErrorResponse) =>{
        this.spinner.hide();
        this.notification.warning(error.status+error.message);
      })
  }
  autocompleteScroll() {
    setTimeout(() => {
      if (
        this.accountscroll &&
        this.autocompleteTrigger &&
        this.accountscroll.panel
      ) {
        fromEvent(this.accountscroll.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.accountscroll.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.accountscroll.panel.nativeElement.scrollTop;
            const scrollHeight = this.accountscroll.panel.nativeElement.scrollHeight;
            const elementHeight = this.accountscroll.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.proofingService.getAccountList("","", this.currentpage + 1,this.AccountInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.AccountList = this.AccountList.concat(datas);
                    if (this.AccountList.length >= 0) {
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
  scrolled(scrollelement) {
    let value = scrollelement;
    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 10;
    if (scrollTop > upgradelimit && this.has_next && !this.isLoading) {
      this.currentpage += 1;
      this.getAccountList();
    }

  }
// autocompletescroll(){
//       this.Accountselectiondropdown.get('accountno').valueChanges
//     .pipe(
//      debounceTime(100),
//      distinctUntilChanged(),
//      tap(() => {
//        this.isLoading = true;
//      }),
//     //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
//      switchMap(value => this.proofingService.getAccountList("", "", '1&account_name='+value)
//      .pipe(
//        finalize(() => {
//          this.isLoading = false
//        }),)
//      )
//    )
//    .subscribe((results: any[]) => {
//      let datas = results['data'];
//      this.AccountList = datas
//      console.log("location List", this.AccountList)
//    });
// }
  acc_selected(account) {
    console.log(this.accounts)
    this.shareservice.accountobject.next(account.option.value);
  }

  acc_show(element) {
    let value = `${element?.name} :  ${element?.account_number}`
    return element ? value : ''
  }
  ngOnDestroy() {
    this.shareservice.accountobject.next(null);
    this.shareservice.unsubscibe()
  }
  accountClear(){
    this.shareservice.accountobject.next(null);
    this.accounts = ''
  }
}
