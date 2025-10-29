import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CreateAccountComponent } from 'src/app/create-account/create-account.component';

@Component({
  selector: 'app-brsmaster',
  templateUrl: './brsmaster.component.html',
  styleUrls: ['./brsmaster.component.scss']
})
export class BrsmasterComponent implements OnInit {
  brsforms : FormGroup;
  isRuleSummary: boolean;
  account_mapping: boolean=false
  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, private activatedRoute: ActivatedRoute,) { 
      this.activatedRoute.queryParams.subscribe((params) => {
        console.log(params)
      if(params.key==='back'){
this.newWiseFinTemp()
      }
      if(params.key==='rulesummary'){
       this.newRuleSummary()
      }
      params={}
      });
    }

    summarylist = [];
    summarylists = [];
    limit = 10;
    pagination = {
      has_next: false,
      has_previous: false,
      index: 1
    }
    isaddaccount: boolean;
    iswisefintemplate: boolean;
    iscbstemplate: boolean;
    isshowrules: boolean;
    isrulemapping: boolean;
    isaccountmapping: boolean;
    isActionMaster: boolean;

    subModuleList = [{ name: 'Add Account', url: '/newaccount' }, { name: 'Template', url: '/template' }, { name: 'Account', url: '/account' }, { name: 'Aging Bucket', url: '/aging' }];

  ngOnInit(): void {
    this.brsforms = this.fb.group({
      glNumber:'',
      

    })

    this.gettemplatedata();
    this.getruleenginedata();
  }

  subModuleData(data)
  {

  }

  openBrsform()
  {
    this.router.navigate(['brs/createbrs'],{}); 
  }

  openbrsruleset()
  {
    this.router.navigate(['brs/newrulesets'],{});
  }

  gettemplatedata() {

    this.brsService.gettemplates(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  getruleenginedata() {

    this.brsService.getruledefinition(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  // deleterules(value, data)
  // {
  //   this.brsService.deleterules(value, data).subscribe(results => {
  //     if (results.status == 'Successfully Updated') {
  //       this.notification.showSuccess("Rule Successfully Updated...")
      
  //     }
  //     else {
  //       this.notification.showError(results.description)

  //     }
  //   })
  // }

  deletetemplate(value)
  {
    this.brsService.deletetemplates(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Template  Successfully Updated...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  openrulemapping()
  {
    this.router.navigate(['brs/rulemap'],{});  
  }

  createnewacc()
  {
    this.router.navigate(['brs/newaccount'],{});   
  }

  opennewtemplates()
  {
    this.router.navigate(['brs/newtemp'],{});  
  }
  openrulesummary()
  {
    this.router.navigate(['brs/rulesumm'],{});  
  }
  opennwisesummary()
  {
    this.router.navigate(['brs/nwisesumm'],{});  
  }
  openbanksummary()
  {
    this.router.navigate(['brs/banksumm'],{});  
  }
  accountTemp()
  {
    this.router.navigate(['brs/accountmap'],{});
  }

  addAccount()
  {
      this.isaddaccount = true;
      this.iswisefintemplate = false;
      this.iscbstemplate = false;
      this.isshowrules = false;
      this.isrulemapping = false;
      this.isaccountmapping = false;
      this.isActionMaster = false;
      this.isRuleSummary = false;
      this.account_mapping=false
  }

  newWiseFinTemp()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = true;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = false;
     this.isaccountmapping = false;
     this.isActionMaster = false;
     this.isRuleSummary = false;
     this.account_mapping=false
  }

  newCbsTemp()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = true;
    this.isshowrules = false;
    this.isrulemapping = false;
    this.isaccountmapping = false;
    this.isActionMaster = false;
    this.isRuleSummary = false;
    this.account_mapping=false
  }

  newRules()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = true;
    this.isrulemapping = false;
    this.isaccountmapping = false;
    this.isActionMaster = false;
    this.isRuleSummary = false;
    this.account_mapping=false
  }
  newRuleSummary()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = false;
    this.isaccountmapping = false;
    this.isActionMaster = false;
    this.isRuleSummary = true;
    this.account_mapping=false
  }

  newrulemapping()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = true;
    this.isaccountmapping = false;
    this.isActionMaster = false;
    this.isRuleSummary = false;
    this.account_mapping=false
  }

  newaccountMapping()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = false;
    this.isaccountmapping = true;
    this.isActionMaster = false;
    this.isRuleSummary = false;
    this.account_mapping=false
  }
  actionMapping()
  {
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = false;
    this.isaccountmapping = false;
    this.isActionMaster = true;
    this.isRuleSummary = false;
    this.account_mapping=false
  }
  acountmapping(){
    this.isaddaccount = false;
    this.iswisefintemplate = false;
    this.iscbstemplate = false;
    this.isshowrules = false;
    this.isrulemapping = false;
    this.isaccountmapping = false;
    this.isActionMaster = false;
    this.isRuleSummary = false;
    this.account_mapping=true
  }

}
