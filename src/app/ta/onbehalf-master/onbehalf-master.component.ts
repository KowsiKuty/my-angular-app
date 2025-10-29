import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from 'src/app/service/notification.service';
import { TaService } from '../ta.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {Onbehalftable} from '../models/onbehalftable';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from "src/environments/environment";
export interface branch {
  id: string;
  code: string;
  name: string;
}
export class MyTableComponent {
  isonbehalfupload: boolean = true; 
}


interface Row {
  id: number;
  full_name: string;
  uploadedFile?: File | null;  // 'uploadedFile' is optional
}

@Component({
  selector: 'app-onbehalf-master',
  templateUrl: './onbehalf-master.component.html',
  styleUrls: ['./onbehalf-master.component.scss']
})
export class OnbehalfMasterComponent implements OnInit {

  datatable: any
  branchlist: any
  onbehalfform: FormGroup
  branchtable: any

  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('modalclose') public modalclose: ElementRef;
  @ViewChild('autocompleteemp') matemp: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') emp: any;
  @ViewChild('fileInput2') fileInput2:ElementRef;

  isonbehalfdownload:Boolean=false;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = false;
  branchid: any = 0;
  branchemployee: any;
  frmData :any= new FormData();
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: number = 1;
  employeedata: any
  empselectedname: any
  statusarray: any = [];
  statusupdatebranchid: any
  color: boolean;
  pagenumb: any = 1
  has_presentids: boolean = true;
  fileformData:any=new FormData();
  has_presenntids: any; 1
  maker: any;
  textValues: any;
  appedit: boolean = false;
  appeditno: boolean = true;
  logindata: any;
  employeeSearchForm: FormGroup;
  SearchValues: any;
  searchtable_data: any;
  employeelist: any
  onbehalfid: any
  searchpresentpage: number=1;
  dataEmp: any;
  employeeId: null
  choose_id: any
  currentpage=1;
  pagesize = 10;
  has_next=true;
  has_previous=true;
  has_despresentpage:number=1;

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  isLoading = false;

  selectedBranch: string;
  selectedEmployee: string;
  has_offnext = true;
  has_offprevious = true;
  onBehalfArr: number[];
  constructor(private taservice: TaService, private formbuilder: FormBuilder, private SpinerService: NgxSpinnerService,
    private notification: NotificationService,private toastr:ToastrService) { }

    displayedColumn: string[] = ['sno','employee','select','fileUpload'];
    // displayedColumn1: string[] = ['fileUpload'];
    public dataSource: MatTableDataSource<Onbehalftable>;

    selection = new SelectionModel<Onbehalftable>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('sortCol1') sortCol1: MatSort;
    @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild('empinput') empinput: any;
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1
    public dataArray: any;
    @ViewChild('empid1') emp1auto: MatAutocomplete;
  @ViewChild('empinput1') emp1input: any; 
    
  ngOnInit(): void {

    this.onbehalfform = this.formbuilder.group(
      {
        branch: [''],
        employee: ['']
      }
    )
    this.employeeSearchForm = this.formbuilder.group({

      empbranchgid: [''],
      approval: [''],


    })

    this.logindata = JSON.parse(localStorage.getItem("sessionData"))
    this.maker = this.logindata['employee_id']
    console.log(this.maker, 'this.maker')
    this.getonbehalf(this.currentpage)


    this.onbehalfform.get('branch').valueChanges
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

    this.onbehalfform.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluechanges(this.branchid,value,1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeelist = datas;
        console.log("Branch List", this.employeelist)
      });

    this.employeeSearchForm.get('empbranchgid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        // this.branchlists = datas;
        console.log("Branch List", this.branchlist)
      });


    this.employeeSearchForm.get('approval').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluechanges(this.branchid,value ? value : '',1))
      )
      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data'];
        console.log("Employee List", this.employeelist)
      });


    this.getbranch()

  }
  search() {
    console.log(this.onbehalfform.value)
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
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);
                this.has_presentid++;

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





  getbranch() {
    this.taservice.getbranchname().subscribe(
      x => {
        this.branchlist = x['data']
      }
    )

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
  totalcount:any;
  getonbehalf(page=1) {
    let empgid = this.employeeSearchForm.value.empbranchgid.id || '';
    let approv = this.employeeSearchForm.value.approval.id?this.employeeSearchForm.value.approval.id:'';
    this.SpinerService.show()
    this.taservice.getonbehalf(empgid,approv,page).subscribe(
      results => {
        let datas = results["data"];

        let datapagination = results["pagination"];
        this.datatable = datas;
        this.totalcount=results['count'];
        this.pagination = results.pagination ? results.pagination : this.pagination;
        if (this.datatable.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        this.SpinerService.hide()
      }
    )


  }

  previousClick() {
    let empgid = this.employeeSearchForm.value.empbranchgid.id || '';
    let approv = this.employeeSearchForm.value.approval.id?this.employeeSearchForm.value.approval.id:'';
    if (this.has_previous === true) {
      this.currentpage=this.currentpage-1;
      // this.getonbehalf(this.currentpage)
      this.getsearches(empgid, approv,  this.currentpage)
    }
  }

  nextClick() {
    let empgid = this.employeeSearchForm.value.empbranchgid.id || '';
    let approv = this.employeeSearchForm.value.approval.id?this.employeeSearchForm.value.approval.id:'';
    if (this.has_next === true) {
      this.currentpage=this.currentpage+1;
      // this.getonbehalf(this.currentpage)
      this.getsearches(empgid, approv,  this.currentpage)
    }

  }

  firstClick() {
    if (this.has_previousid === true) {
      this.getonbehalf(this.currentpage)
    }
  }

  // selectBranch(e){
  //   console.log("e",e.value)
  //   let branchvalue = e
  //   this.branchid = branchvalue
  //   var value = ''
  //   this.taservice.setemployeeValue(value,branchvalue)
  //   .subscribe(results => {
  //     this.employeelist = results
  //     console.log("employee", this.employeelist)
  //   })
  // }

  employeenameselect(value) {
    this.empselectedname = value.id
    let name = value.id
    // this.getemployeedetails(name, this.has_presentemp)

    this.getemployeeonbehalf(this.statusupdatebranchid, name, this.pagenumb, this.empselectedname)

  }


  getemployeeonbehalf(branch, empid, pagenumb, maker) {
    this.taservice.getemployeeonbehalf(branch, empid, pagenumb, maker).subscribe(
      results => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.employeedata = datas;
        console.log('empdataaa', this.employeedata)
        if (this.employeedata.length > 0) {
          this.has_nextemp = datapagination.has_next;
          this.has_previousemp = datapagination.has_previous;
          this.has_presentemp = datapagination.index;
        }

      })
  }


  // getemployeedetails(val, page) {
  //   this.taservice.getemployeedetail(val, page).subscribe(
  //     results => {
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.employeedata = datas;
  //       if (this.employeedata.length > 0) {
  //         this.has_nextemp = datapagination.has_next;
  //         this.has_previousemp = datapagination.has_previous;
  //         this.has_presentemp = datapagination.index;
  //       }
  //     }

  //   )
  // }
  empnextclick() {

    if (this.has_nextemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid, this.empselectedname, this.has_presentemp + 1, this.empselectedname)
    }
  }
  emppreviousclick() {

    if (this.has_previousemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid, this.empselectedname, this.has_presentemp - 1, this.empselectedname)
    }
  }
  empfirstclick() {
    this.has_presentemp = 1
    if (this.has_nextemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid, this.empselectedname, this.has_presentemp, this.empselectedname)
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


  updatestatus(status) {
    this.taservice.getonbehalfstatusupdate(status).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess("Success")
        }
        else {
          this.notification.showError(x.message)
        }
      }
    )
  }

  submit() {
    const branchValue = this.onbehalfform.controls['branch'].value; 
    // console.log("Selected branch vlaue", branchValue)
    // const brCode = branchValue.substring(1, branchValue.indexOf(')'));
    // console.log(brCode); 

    const empValue = this.onbehalfform.controls['employee'].value; 
    console.log("Selected Employee vlaue", empValue)
    const empCode = empValue.id;
    const brCode  = branchValue.id;
    
    let onbehalfGid:any=[]


    if (this.onbehalfform.controls['branch'].value == '' || this.onbehalfform.controls['branch'].value == null) {
      console.log('show error in branch')
      this.notification.showError('Please Select Branch')
      throw new Error;
    }

    if (this.onbehalfform.controls['employee'].value == '' || this.onbehalfform.controls['employee'].value == null) {
      console.log('show error in employee')
      this.notification.showError('Please Select Employee')
      throw new Error;
    }

    if(this.selection.selected.length < 1)
    {
      this.notification.showError('Please Select onBehalf Employee')
      throw new Error; 
    }
    let data =  []
    let data1 = this.selection.selected
    // for(let i =0; i<this.filedata.length; i++){
    //   for(let j =0; j<data1.length; j++){
    //   if (this.filedata.length!==data1.length){
    //     this.notification.showError(`File upload is missing for row ${j + 1} has not uploaded a file.`)  
    //   throw new Error; 

    //   }
    //   }}

    for(let i =0; i<data1.length; i++) {
      let a = {"employeegid":data1[i].id,"branchgid":brCode,"onbehalf_employeegid":empCode}
      console.log('a:', a);
      data.push(a)

    };
   
    for (let i = 0; i < this.filedata.length; i++) {
      const ele = this.filedata[i];
      
      if (ele) {
        this.frmData.append('file', ele);
      } else {
        console.error(`File is missing for employee:`)
        // ${ele.employee.full_name}`);
      }
    }
    
    


    console.log("Final Array", this.onBehalfArr)
    this.frmData.append('data',JSON.stringify(data));
    console.log("Form data",  this.frmData)
    this.taservice.createonbehalf(this.frmData).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess(x.message);
          this.modalclose.nativeElement.click();
          this.fileInput2.nativeElement.value='';
        }
        else {
          this.notification.showError(x.code)
        }
      }
    )
    // if (this.statusarray.length == 0) {
    //   this.notification.showError('Please Select Employee')
    // }
    // else {
    //   this.updatestatus(JSON.stringify(this.statusarray))
    //   console.log(JSON.stringify(this.statusarray))
    // }
    // this.modalclose.nativeElement.click();
    // this.onbehalfform.reset()
    // this.employeedata.splice(0, this.employeedata.length)
    // this.statusarray.splice(0, this.statusarray.length)

  }

  gettablestatusupdate(data) {
    this.taservice.getonbehalftablestatusupdate(data).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess("Success")
        }
        else {
          this.notification.showError(x.message)
        }
      }
    )
  }

  activate(value) {


    for (let i = 0; i < this.datatable.length; i++) {
      if (value.id == this.datatable[i].id) {
        if (this.datatable[i].status == 1) {
          this.datatable[i].status = 0;
          let passvalue = {
            "id": value.id,
            "status": 0
          }
          this.gettablestatusupdate(JSON.stringify(passvalue))
          console.log(JSON.stringify(passvalue))

        }
        else {
          let passvalue = {
            "id": value.id,
            "status": 1
          }
          this.datatable[i].status = 1;
          this.gettablestatusupdate(JSON.stringify(passvalue))
          console.log(JSON.stringify(passvalue))
        }
      }
    }

  }

  resetall() {
    this.onbehalfform.reset()
    this.dataSource.data = [];
    this.employeeSearchForm.get('empbranchgid').setValue('')
    this.employeeSearchForm.get('approval').setValue('')
    // this.employeedata.splice(0, this.employeedata?.length)
    // this.modalclose.nativeElement.click();
    // this.statusarray.splice(0, this.statusarray.length);
    this.getonbehalf(1)
  }
  employeeSearch() {
    console.log("EMPLOYEE SEARCH", this.employeeSearchForm.value)
    let empgid = this.employeeSearchForm.value.empbranchgid.id
    let approv = this.employeeSearchForm.value.approval.id?this.employeeSearchForm.value.approval.id:'';

    // let extractedNumber: string = empgid.replace(/[^\d]/g, '');
    // console.log("EXTRACTED NUMBER", extractedNumber)

    // let branchIdExtract = 

    if (this.employeeSearchForm.value.empbranchgid.id != null || this.employeeSearchForm.value.approval.id) {
      this.searchpresentpage = 1;
      this.getsearches(empgid, approv,this.currentpage);

    }
  }

  getsearches(empgid, approv, pageNo) {
    console.log("Search Data", empgid, approv, pageNo)
    approv = '' + '&onbehalfof_employee_id=' + approv
    this.SpinerService.show()
    this.taservice.getemployeesearch_onbehalfof(empgid, approv, pageNo).subscribe(res => {
      // this.searchtable_data = res['data']
      this.SpinerService.hide();
      let datatable = res["data"];
      this.totalcount = res['count'];
      this.datatable = datatable;
      let datapagination = res['pagination']
      this.datatable = datatable;
      if (this.datatable.length > 0) {
         this.has_next = datapagination.has_next;
         this.has_previous = datapagination.has_previous;
         this.currentpage = datapagination.index;
      }
      // this.SpinerService.hide();
    })



  }
  displayFn(subject) {
    return subject ? '(' + subject.code + ') ' + subject.name : undefined
  }
  // displayFnbr(branch) {
  //   return branch ? branch.code +'-'+branch.name : undefined
  // }
  public displayFnbr(branch?: branch): string | undefined {
    return branch ? branch.code+'-'+branch.name : undefined;
  }
  branchids: any = 0;
  getbranchs(id) {
    this.branchids = id
    console.log("this.branchid", this.branchids)
    console.log(" this.onbehalfid", this.onbehalfid)
    this.taservice.getemployeevaluechanges(this.branchids,"",1)

      .subscribe((results: any[]) => {

        let datas = results;
        this.employeelist = datas['data'];

        console.log("Employee List", this.employeelist)
      });
    // this.taservice.getbranchemployee(this.branchid)
    // .subscribe(result => {
    //   this.listBranch = result
    //   console.log("employee", this.listBranch)
    // })
    this.appeditno = false;
    this.appedit = true;
    // this.getemployeeValue()
  }

  getemployee(id,page) {
    console.log("EMP ID", id)
    if (id !== ''){
      this.choose_id = id
    }
    const branchValue = this.onbehalfform.controls['branch'].value
    let branch_id  = branchValue.id
    if(branch_id==undefined){
      branch_id=0
    }
    this.SpinerService.show();
    this.taservice.getemployeevaluechanges(branch_id,"",page)

    .subscribe((results: any[]) => {
      this.SpinerService.hide();

      let datas = results;
      this.employeelist = datas['data'];
      this.employeelist = this.employeelist.filter(emp => emp.id !== this.choose_id.id);
      this.dataEmp = this.employeelist.map(emp => ({ ...emp }));

      this.dataArray = this.dataEmp;
      this.dataSource = new MatTableDataSource<Onbehalftable>(this.dataArray);
     
      this.dataSource.sort = this.sortCol1;

      // this.regiondata = result['data'];
      // this.dataSource.paginator = this.paginator;
      let datapagination = results['pagination']
      if (this.dataSource.data.length >= 0) {
        this.onbehalf_hasnext = datapagination.has_next;
        this.onbehalf_hasprevious = datapagination.has_previous;
        this.onbehalf_currentpage = datapagination.index;
      }
    });


    // this.employeelist = 
    // this.onbehalfid = id
    // console.log("this.branchid", this.branchids)
    // console.log(" this.onbehalfid",  this.onbehalfid)
    // this.taservice.getbranchemployee("", this.branchids, this.onbehalfid)

    //   .subscribe((results: any[]) => {

    //     let datas = results;
    //     this.employeelist = datas;

    //     console.log("Employee List", this.employeelist)
    //   });
    // this.taservice.getbranchemployees(id.employee_branch_id) --
    //   .subscribe(result => {--
        // const index = this.employeelist.indexOf(id.id);
        // if (index >= 0) {
        //   result.splice(index, 1);
        // }
        // // result.push(id);
        // this.dataEmp = result--
        // console.log("employee lists", this.dataEmp)--
      // })--
    this.appeditno = false;
    this.appedit = true;
    // this.getemployeeValue()

  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getonbehalf(this.currentpage);


  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getonbehalf(this.currentpage);
  }

  getbranches(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    this.taservice.getemployeevaluechanges(this.branchid,"",1)

      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data'];
        console.log("Employee List", this.employeelist);
        let datapagination = results["pagination"];
        if (this.employeelist.length > 0) {
          this.has_empnext = datapagination.has_next;
          this.has_empprevious = datapagination.has_previous;
          this.empcurrentpage = datapagination.index;
        }
      });
    // this.taservice.getbranchemployee(this.branchid)
    // .subscribe(result => {
    //   this.listBranch = result
    //   console.log("employee", this.listBranch)
    // })
    this.appeditno = false;
    this.appedit = true;
    // this.getemployeeValue()
  }

  getBehalfEmp(data, id)
  {
      console.log("DATA EMPS", data)
      console.log("ID EMPS", id)
      this.onBehalfArr.push(id)
      let passArr = this.onBehalfArr.push(id);
      console.log("complete data")
     
  }
isonbehalfupload:boolean=false;
// Add a flag to prevent multiple alert messages
isAlertShown = false;

isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    // Ensure uploadedFile exists on every row before performing any checks
    // const missingFiles = this.selection.selected.some(row => !('uploadedFile' in row) || !row.uploadedFile);


    // if (missingFiles && !this.isAlertShown) {
    //     // Show alert only if not already shown
    //     this.notification.showError('Please choose a file for all selected rows.');
    //     this.isonbehalfupload = true;
    //     this.isAlertShown = true;  // Set flag to prevent multiple alerts
    //     return false;
    // }

    // If no missing files, reset the flag
    // if (!missingFiles && this.isAlertShown) {
    //     this.isAlertShown = false;  // Reset the alert flag when files are uploaded
    // }

    // Check if all rows are selected
    return numSelected === numRows;
}



  isFileUploadEnabled:boolean=false
  

  toggleAllRows(event: any): void  {
    if (event.checked) {
      this.isFileUploadEnabled = true; // Show file upload column
    } else {
      this.isFileUploadEnabled = false; // Hide file upload column
    }
    if (event.checked) {
      this.displayedColumn = ['fileUpload'];
    } else {
      this.displayedColumn = ['sno','employee','select'];;
    }
    
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  selectedRow(row) {
   
    if (!this.isAlertShown) {
        // this.notification.showError('Please choose a file for all selected rows.');
        this.isonbehalfupload = true;
        this.isAlertShown = true;  
    }

    else {
        this.isAlertShown = false;  
        this.isonbehalfupload = false;
    }

   
    this.selection.selected.forEach(s => console.log("Onbehalf emp selection", s));
}



  empScroll(){
    setTimeout(() => {
      if (
        this.empauto &&
        this.autocompleteTrigger &&
        this.empauto.panel
      ) {
        fromEvent(this.empauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.empauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.empauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.empauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.empauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnext === true) {
                this.taservice.getemployeevaluechanges(this.branchid,this.empinput.nativeElement.value,this.empcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeelist = this.employeelist.concat(datas);
                    if (this.employeelist.length > 0) {
                      this.has_empnext = datapagination.has_next;
                      this.has_empprevious = datapagination.has_previous;
                      this.empcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  emp1Scroll(){
    setTimeout(() => {
      if (
        this.emp1auto &&
        this.autocompleteTrigger &&
        this.emp1auto.panel
      ) {
        fromEvent(this.emp1auto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.emp1auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.emp1auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.emp1auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.emp1auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnext === true) {
                this.taservice.getemployeevaluechanges(this.branchid,this.emp1input.nativeElement.value,this.empcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeelist = this.employeelist.concat(datas);
                    if (this.employeelist.length > 0) {
                      this.has_empnext = datapagination.has_next;
                      this.has_empprevious = datapagination.has_previous;
                      this.empcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }





  onbehalf_hasnext=true;
  onbehalf_hasprevious=true;
  onbehalf_currentpage=1;


  previousregion(){
    if(this.onbehalf_hasprevious){
      this.onbehalf_currentpage = this.onbehalf_currentpage -1
      this.getemployee('', this.onbehalf_currentpage)
    }
  }
nextregion(){
  if(this.onbehalf_hasnext){
    this.onbehalf_currentpage = this.onbehalf_currentpage +1
    this.getemployee('',this.onbehalf_currentpage)
  }
}
filedata:Array<any>=[];

onFileUpload(event: Event, element: any) {
        // let data=[]
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          for (let i = 0; i < input.files.length ; i++){
            // const file = input.files[i];
            
            const fileupload=input.files[i]
            this.filedata.push(fileupload,element)
           
            
         }
        }
    }
     tokenValues: any
      showimageHeaderAPI: boolean
      showimagepdf: boolean
      pdfurl: any;
      jpgUrlsAPI: any
      imageUrl = environment.apiURL

    ta_view_file(datas,filename) {
      
      let file_id=datas.file_name?.data?.[0]?.id ?? '';
      if (file_id!==''){
      console.log('onbehalf_view_file:')
      
    
      this.taservice.ta_onbehalf_file_view(file_id).subscribe(
      (response: any) =>{
        let fileName = filename.file_name.data[0].file_name
        // let filename = response.type;
        let stringValue = fileName.split('.')
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
        stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          this.showimageHeaderAPI = true
          this.showimagepdf = false
          this.jpgUrlsAPI = this.imageUrl+"taserv/ta_onbehalf_doc_file/"+file_id+"?token="+token
          console.log('view',this.jpgUrlsAPI) 
          // this.toastr.error(response?.code ?? 'Unknown Error');
          // this.toastr.error(response?.description ?? 'No description available');
        }    
        if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
          this.showimagepdf = true
          this.showimageHeaderAPI = false
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          let downloadUrl=this.imageUrl+"taserv/onbehalf_download/"+file_id+"?token="+token
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl;    
          // this.toastr.error(response?.code ?? 'Unknown Error');
          // this.toastr.error(response?.description ?? 'No description available'); 
        }       
        if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
        stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT"|| stringValue[1] === "octet-stream"|| stringValue[1] === "OCTET-STREAM") {
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.toastr.warning('View File (csv,ods,xlsx,txt - Format) is not supported');
        }
        // if(response['code']==='Download File is not Exists') {
        //   this.toastr.error('No View Files Found');
        // }
        if(response['type']=="application/json"){
          this.SpinerService.hide();
          this.toastr.error('No View Files Found');

        }
        (error)=>{
          this.toastr.error(response['code']);
          this.toastr.error(response['description']);
        }
    })
  }
  else{
    this.SpinerService.hide();
    this.showimageHeaderAPI = false
    this.showimagepdf = false
    this.toastr.error('No View Files Found');

  }
  }
  ta_download(data:any,files:any){
    let file_id= data.file_name?.data?.[0]?.id ?? '';

    if (file_id!==''){
    this.SpinerService.show();
    let fileName = files.file_name.data[0].file_name
    this.taservice.ta_onbehalf_file_download(file_id).subscribe((response: any) =>{
          this.SpinerService.hide();
          if(response['type']!="application/json"){
            let filevalue = fileName.split('.')
            let binaryData = [];
            binaryData.push(response)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.click();}
          if(response['type']=="application/json"){
            this.SpinerService.hide();
            this.toastr.error('No Download Files Found');
          }
      })
    }
    else{
      this.SpinerService.hide();
            this.toastr.error('No Download Files Found');

    }
  }


}
