import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComponentLoaderDirective } from 'src/app/directives/component-loader.directive';
import { SharedService } from 'src/app/service/shared.service';
import { MemodeptComponent } from '../memodept/memodept.component';
import { MemoindividualComponent } from '../memoindividual/memoindividual.component';
import { MemoboardComponent } from '../memoboard/memoboard.component';
import { DataService } from 'src/app/service/data.service';
import { MemoreportComponent } from '../memoreport/memoreport.component';
import { AttendancesummaryComponent } from '../attendancesummary/attendancesummary.component';
import { ViewrightscreateComponent } from '../viewrightscreate/viewrightscreate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoService } from '../memo.service';
import { SummaryTabComponent } from '../summary-tab/summary-tab.component';
import { CommunicationServiceService } from '../communication-service.service';

@Component({
  selector: 'app-memosummary',
  templateUrl: './memosummary.component.html',
  styleUrls: ['./memosummary.component.scss']
})
export class MemosummaryComponent implements OnInit {

  masterMenuItems = [
    { itemName: "Note for Approval", displayName: "Note for Approval", component: MemoindividualComponent },
    { itemName: "Inter-Office Memo", displayName: "Inter-Office Memo", component: MemodeptComponent }
  ];

  activeItem: string;
  activeComponent: any;
  tabs = [];
  tab_index: any;
  @ViewChildren(ComponentLoaderDirective) componentLoaders: QueryList<ComponentLoaderDirective>;

  summaryData : any ={}
  bnaData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  nfaData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  iomData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  constructor(private componentFactoryResolver: ComponentFactoryResolver, public sharedService: SharedService, private dataService: DataService, private router: Router,
    private memoService: MemoService,private comm: CommunicationServiceService
  ) {
  }

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    this.sharedService.MyModuleName = "eMemo(Note for Approval & Inter-Office Memo)"
  }

  ngOnInit(): void {



    this.tabs = [
      { tabIndex: 0, itemName: "Summary", displayName: "Summary", component: SummaryTabComponent },
      { tabIndex: 1, itemName: "Note for Approval", displayName: "Note for Approval", component: MemoindividualComponent },
      { tabIndex: 2, itemName: "Inter-Office Memo", displayName: "Inter-Office Memo", component: MemodeptComponent },
      // { tabIndex: 2, itemName: "Leave History", displayName: "Leave History", component: AttendancesummaryComponent },

    ];
    // console.log(this.tabs);

    this.comm.menuTabClick$.subscribe(payload => {
      this.menuTabClickCall(payload);
    });

    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        let data = results['data'];
        if (data) {
          this.sharedService.titleUrl = data[0].url;
          this.sharedService.menuUrlData = data;
        };
        this.sharedService.transactionList = [];
        this.sharedService.masterList = [];
        this.sharedService.menuUrlData.forEach(element => {
          if (element.type === "transaction") {
            this.sharedService.transactionList.push(element);
          } else if (element.type === "master") {
            this.sharedService.masterList.push(element);
          }
        });
        this.sharedService.transactionList.forEach(element => {
          if (element.name === "e-Memo") {
            let role = element.submodule;
            this.tab_index = 3
            role.forEach(submoduleelement => {
              // console.log("roleelement.name",submoduleelement.name);
              if (submoduleelement.name === "Board Notes") {
                this.tabs.push({ tabIndex: this.tab_index, itemName: "Board Notes", displayName: "Board Notes", component: MemoboardComponent }
                )
                this.tab_index = this.tab_index + 1
              }
              if (submoduleelement.name === "Memo TAT") {
                this.tabs.push({ tabIndex: this.tab_index, itemName: "Memo TAT", displayName: "Memo TAT", component: MemoreportComponent }
                )
                this.tab_index = this.tab_index + 1
              }
              if (submoduleelement.name === "Delegation-LL/MDL") {
                this.tabs.push({ tabIndex: this.tab_index, itemName: "Delegation-LL/MDL", displayName: "Delegation-LL/MDL", component: AttendancesummaryComponent }
                )
                this.tab_index = this.tab_index + 1
              }
              if (submoduleelement.name === "Viewrights") {
                this.tabs.push({ tabIndex: this.tab_index,
                   itemName: "Viewrights", 
                   displayName: "Viewrights", 
                   component: ViewrightscreateComponent }
                )
                this.tab_index = this.tab_index + 1
              }
            })
          }
        });

        this.tabs.forEach((eachtab) => {
          setTimeout(() => {
            var componentLoadersArray = this.componentLoaders.toArray();
            // console.log('each.activeComponent',eachtab.component);
            // console.log('tabindex',eachtab.tabIndex);
            var componentFactory = this.componentFactoryResolver.resolveComponentFactory(eachtab.component);
            var viewContainterRef = componentLoadersArray[eachtab.tabIndex].viewContainerRef;
            var componentRef = viewContainterRef.createComponent(componentFactory);
          }, 100);
        });
        if (this.sharedService.Memofrom === "IOMEMO") {
          // console.log("calling iom",this.sharedService.Memofrom)
          this.menuTabClick(this.tabs[2]);
        } else if (this.sharedService.Memofrom === "NFA-MEMO") {
          // console.log("calling nfa",this.sharedService.Memofrom)
          this.menuTabClick(this.tabs[1]);
        } else if (this.sharedService.Memofrom === "BNA-MEMO") {
          // console.log("calling bna",this.sharedService.Memofrom)
          this.menuTabClick(this.tabs[3]);
        } else {
          // console.log("calling empty",this.sharedService.Memofrom)
          this.menuTabClick(this.tabs[0]);
        }
      })
    this.getSummaryData()

  } ///endof ngOnInit

  emp_br =""
  emp_name =""
  getSummaryData(){
    this.memoService
      .getMemoSummary()
      .subscribe((results) => {
        this.summaryData = results['data'][0] ?? {};
        if(this.summaryData?.bna != undefined)
          this.bnaData = this.summaryData?.bna 
        if(this.summaryData?.iom != undefined)
          this.iomData = this.summaryData?.iom 
        if(this.summaryData?.nfa != undefined)
          this.nfaData = this.summaryData?.nfa     
        this.emp_br = this.summaryData?.employee_branch ?? ''
        this.emp_name = this.summaryData?.employee_name ?? ''
      });
  }

  menuTabClickCall(data){
    if(data == 'nfa'){
      this.menuTabClick({ tabIndex: 2, itemName: 'Note for Approval', 
                      displayName: 'Note for Approval', component: MemoindividualComponent })
    }
    else if(data == 'bn'){
      this.menuTabClick({ tabIndex: 2, itemName: 'Board Notes', 
                    displayName: 'Board Notes', component: MemoboardComponent })
    }
    else if(data == 'iom'){
      this.menuTabClick({ tabIndex: 2, itemName: 'Inter-Office Memo', 
                    displayName: 'Inter-Office Memo', component: MemodeptComponent })
    }
  }
  menuTabClick(TabItem: any) {
    // console.log('menuTabClick',this.activeItem)
    this.activeItem = TabItem.itemName;
    // if(this.activeItem =="Viewrights"){
    //   this.router.navigate(['/ememo/ViewrightscreateComponent'], {
    //     skipLocationChange: true
    //   })
    // }
    // localStorage.removeItem('employee_view');
    // localStorage.removeItem('employee_viewiom');
    this.activeComponent = TabItem.component
  }
}
