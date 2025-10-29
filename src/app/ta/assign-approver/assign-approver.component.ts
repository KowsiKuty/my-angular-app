import { Component, ElementRef, OnInit, ViewChild,HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MY_FORMATS } from 'src/app/Master/fin-year-create/fin-year-create.component';

@Component({
  selector: 'app-assign-approver',
  templateUrl: './assign-approver.component.html',
  styleUrls: ['./assign-approver.component.scss']
})
export class AssignApproverComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  assignList: any
  onBehalf: any
  approverform: FormGroup;
  approversearchform: FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('autocompleteemp') matemp: any;
  @ViewChild('branchInput') brinput: any;
  @ViewChild('emp') emp: any;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  branchid: any;
  branchemployee: any;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: number = 1;
  branchlist: any;
  has_presentids: boolean = true;
  has_presenntids: any; 1
  statusupdatebranchid: any;
  empselectedname: any;
  pagenumb: any;
  maker: any;
  employeedata: any;
  statusarray: any;
  has_next = true;
  has_previous = true;
  presentpage: number;
  branchdata: [];
  empList: [];
  send_value='';


  constructor(private taservice: TaService, private formbuilder: FormBuilder, sharedService: SharedService, private datePipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private notification: NotificationService, private spinnerservice: NgxSpinnerService ) { }

  ngOnInit(): void {


    this.approverform = this.formbuilder.group(
      {
        branch: [null],
        employee: [null],
        tourapprove: false,
        advanceapprove: false,
        expenseapprove: false,
      }

    )

    this.approversearchform = this.formbuilder.group({
      branch: '',
      employee: '',
    })


    this.approverform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("Branch List", this.branchlist)
      });

    this.approverform.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluechanges(this.statusupdatebranchid ? this.statusupdatebranchid : 0, value ? value : '',1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchemployee = datas;
        console.log("Branch List", this.branchlist)
      });
    this.approversearchform.get('branch').valueChanges.pipe(switchMap(val => this.taservice.getUsageCode(val, 1)))
      .subscribe((results) => {
        this.branchdata = results['data']
      })
    this.approversearchform.get('employee').valueChanges.pipe(switchMap(value =>
      this.taservice.getemployeevaluechanges(this.approversearchform.value.branch ?
        this.approversearchform.value.branch.id : 0, value ? value : '',1)))
      .subscribe((results) => {
        this.empList = results['data']
      })
    this.getbranch()
    this.getassignsumm();
    // this.brsearch(this.brinput.nativeElement.value)
  }

  brsearch() {
    let form = this.approversearchform.value;
    if (!form.branch.id) {
      this.notification.showError('Select Branch first and then select Employee..');
      return false
    }
    this.send_value=`&branch_id=${form.branch.id}`;
    if(!form.employee.id){
    }
    else{
      this.send_value = this.send_value+`&employee_id=${form.employee.id}`
    }
    this.getassignsumm();
  }
  appclear(){
    let myform = this.approversearchform;
    myform.patchValue({
      branch:'',
      employee:''
    })
    this.getassignsumm();
  }


  displayfnbranch(conoffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }
  displayFn(subject) {
    return subject.full_name;
  }

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
             
              this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                this.has_presentid ++;
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                 


                }
              })
            }
          }
        })
      }
    })
  }

  autocompleteemps() {
    setTimeout(() => {
      if (this.matemp && this.autocompletetrigger && this.matemp.panel) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll').pipe(
          map(x => this.matemp.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matemp.panel.nativeElement.scrollTop;
          const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
          const elementHeight = this.matemp.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          // console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
             
              this.taservice.getonbehalfemployeepage(this.statusupdatebranchid, this.has_presentid + 1).subscribe(data => {
                this.has_presentid ++;
                let dts = data['data'];
                let pagination = data['pagination'];
                this.branchemployee = this.branchemployee.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                

                }
              })
            }
          }
        })
      }
    })
  }

  employeenameselect(value) {
    this.empselectedname = value.id
    let name = value.id
    // this.getemployeedetails(name, this.has_presentemp)
  }
  submit() {
    const myform = this.approverform.value

    console.log("FORM VLAUES", myform)

    if (myform.branch == null) {
      this.notification.showError('Please Select Branch')
      return false;
    }
    else {
      var branchhid = this.statusupdatebranchid
    }

    if (this.empselectedname == null) {
      this.notification.showError('Please Select Employee')
      return false;
    }
    else {
      var emppid = this.empselectedname;
    }

    if(myform.advanceapprove == null && myform.expenseapprove == null && myform.tourapprove == null)
    {
      this.notification.showError('Please select any of the Approver Permission');
      return false;
    }

    // if(myform.advanceapprove == false && myform.expenseapprove == false && myform.tourapprove == false)
    // {
    //   this.notification.showError('Please select any of the Approver Permission');
    //   return false;
    // }


    


    // if(myform.tourapprove == false && myform.advanceapprove ==false && myform.expenseapprove == false){
    //   this.notification.showError('Please Select Checker Permission')
    //   return false
    // }

    let tourapprove = myform.tourapprove == false ? 0 : 1
    let advanceapprove = myform.advanceapprove == false ? 0 : 1
    let expenseapprove = myform.expenseapprove == false ? 0 : 1

    let payload = [
      {
        "branchid": branchhid,
        "employeeid": emppid,
        "tourapprove": tourapprove,
        "advanceapprove": advanceapprove,
        "expenseapprove": expenseapprove
      }
    ]
    console.log(payload)
    this.spinnerservice.show()
    this.taservice.assignapprover(payload).subscribe(result => {
      if (result.status == 'success') {
        this.notification.showSuccess('Permission Added Successfully')
        this.approverform.reset();
        this.spinnerservice.hide()
        return true;
      }
      else {
        this.notification.showError(result.description)
        this.spinnerservice.hide()
        return false;
      }
    })
  }
  resetall() {
    this.approverform.reset();
    this.empselectedname = null;
    this.statusupdatebranchid = null;
  }
  nextClick() {
    if (this.has_next === true) {
      this.getassignsumm(this.presentpage + 1)
    }
  }


  previousClick() {
    if (this.has_previous === true) {
      this.getassignsumm(this.presentpage - 1)
    }
  }

  firstClick() {
    if (this.has_previous === true) {
      this.getassignsumm(1)
    }
  }


  getbool(v, e) {

    let obj = {
      "employeegid": v.employee.id,
      "branchgid": this.statusupdatebranchid,
      "onbehalf_employeegid": this.empselectedname,
    }
    console.log(v.employee.id)
    console.log(v, e.target.checked)
    if (e.target.checked) {
      this.statusarray.push(obj)
    }
    if (!e.target.checked) {
      for (let i = 0; i < this.statusarray.length; i++) {
        if (this.statusarray[i].onbehalf_employeegid == v.employee.id) {
          this.statusarray.splice(i, 1)
        }
      }
    }
    console.log('statusarrays', this.statusarray)
  }

  branchname(branch) {
    this.statusupdatebranchid = branch.id
    console.log(this.statusupdatebranchid)


    this.taservice.getonbehalfemployeeget(this.statusupdatebranchid)
      .subscribe(result => {
        this.branchemployee = result['data']
        console.log('eee', this.branchemployee.name)
        console.log('emp', result)


      })

  }
  getbranch() {
    this.taservice.getbranchname().subscribe(
      x => {
        this.branchlist = x['data']
        this.branchdata = x['data']
      }
    )

  }
  getassignsumm(pageNumber = 1) {
    this.spinnerservice.show()
    this.taservice.getAssignSummary(pageNumber,this.send_value)
      .subscribe(result => {
        this.spinnerservice.hide()
        this.send_value = '';
        console.log("assignapprover", result)
        let datas = result['data'];
        this.assignList = datas;
        let datapagination = result["pagination"];
        this.assignList = datas;
        if (this.assignList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      })


  }
  onKeyDown(event: KeyboardEvent) {
    const myforms = this.approverform.value

    // console.log("FORM VLAUES", myforms)

    if (myforms.branch == null) {
      this.notification.showError('Please Select Branch first')
      return false;
    }
    // if(this.approverform.get('branch').dirty )
    // {
    //   this.notification.showError('Please Select Branch first')
    //   return false;
    // }
  }

  onClick(event: MouseEvent) {
    const myforms1 = this.approverform.value

    // console.log("FORM VLAUES", myforms)

    if (myforms1.branch == null) {
      this.notification.showError('Please Select Branch first')
      return false;
    }
  }
  editdata(data){
    let valueedit = {
      branch: data.branch_name,
      employee: data.employee_name_code,
      tourapprove: data.tourapprove,
      advanceapprove: data.advanceapprove,
      expenseapprove: data.expenseapprove
    }
    this.approverform.patchValue(valueedit)
    this.empselectedname = data.employeeid
    this.statusupdatebranchid = data.branchid
    this.submit()
  }

}
