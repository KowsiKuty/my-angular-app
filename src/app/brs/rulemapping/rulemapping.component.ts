import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';

@Component({
  selector: 'app-rulemapping',
  templateUrl: './rulemapping.component.html',
  styleUrls: ['./rulemapping.component.scss']
})
export class RulemappingComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router) { }

  rulemaps: FormGroup;
  rulemapss: FormGroup;
  rulemapeditform: FormGroup;
  templates: any;
  templatess: any;
  rules: any;
  rulesL: [];
  rulesB: [];
  summarylists: any=[];
  summarylistsL: any= [];
  summarylistsB: any= [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  shownwisefin = false;
  showbnkstmt = false;

  ngOnInit(): void {

    this.rulemaps = this.fb.group({
      description: '',
      gltemplate_id: null,
      rule_id: '',
      order: '',
      gl_ledger_column: null,
      bank_statement_column: '',
      template_id: ''



    })

    this.rulemapss = this.fb.group({
      description: '',
      template_id: null,
      rule_id: '',
      order: '',
      gl_ledger_column: '',
      bank_statement_column: null,
      gltemplate_id: '',



    })

    this.rulemapeditform = this.fb.group({
      description: '',
      template_id: null,
      rule_id: '',
      order: '',
      gl_ledger_column: '',
      bank_statement_column: null,
      gltemplate_id: '',
      id: '',
      template_name: '',
      rule_name: '',
      gl_template_name:'',
     
    })

    let id = 1;
    this.brsService.gettemplates(id)
      .subscribe(result => {
        this.templates = result['data']


      })

    let ids = 1;
    this.brsService.gettemplatesgl(ids)
      .subscribe(result => {
        this.templatess = result['data']
      })

    this.brsService.getruledefinitionL(id)
      .subscribe(result => {
        this.rulesL = result['data']


      })

    this.brsService.getruledefinitionB(id)
      .subscribe(result => {
        this.rulesB = result['data']


      })

    this.getrulemappingdata();

  }

  mappingsubmit() {
    this.brsService.defineRuleMappings(this.rulemaps.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Rule Mapping Successfully Completed...")

      }
      else {
        this.notification.showError(results.description)

      }
    })
  }
  Nmappingsubmit() {
    this.brsService.defineRuleMappings(this.rulemapss.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Rule Mapping Successfully Completed...")

      }
      else {
        this.notification.showError(results.description)

      }
    })
  }
  getrulemappingdata() {

    this.brsService.getrulemaps(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];
     
       this.summarylistsL =  this.summarylists.filter(element => element.template_id == null)
      
      
        this.summarylistsB = this.summarylists.filter(element => element.gltemplate_id == null)
      
    
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  deletemapping(value) {
    this.brsService.deleterulemap(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("RuleMapping Updated Successfully...")

      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  goback() {
    this.router.navigate(['brs/brsmaster'], {});
  }
  showwisefin() {
    this.shownwisefin = true;
    this.showbnkstmt = false;
  }

  showbnkstmtss() {
    this.shownwisefin = false;
    this.showbnkstmt = true;

  }
  rulemapedit(data) {

    this.rulemapeditform.patchValue({
      description: data.description,
      gl_template_name: data.gl_template_name,
      rule_id: data.rule_id,
      order: data.order,
      gl_ledger_column: data.gl_ledger_column,
      bank_statement_column: data.bank_statement_column,
      gltemplate_id: data.gltemplate_id,
      id: data.id,
      rule_name: data.rule_name,
      template_name: data.template_name,
    
    })

  }

  editForm() {

  

    this.brsService.rulemapedit(this.rulemapeditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Rule Mapping Updated Successfully ...")
        // this.closebuttons.nativeElement.click();
        this.getrulemappingdata();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }
  backtosummary(){
    console.log('clicked')
    this.router.navigate(['brs/brsmaster'],{queryParams: {key:'rulesummary'},skipLocationChange: true});  
  }
}
