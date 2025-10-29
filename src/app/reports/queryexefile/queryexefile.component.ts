import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportserviceService } from '../reportservice.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { Notification, fromEvent } from 'rxjs';
import {PageEvent} from '@angular/material/paginator'
import { NotificationService } from 'src/app/service/notification.service';


export interface emplists {
  id: string;
  full_name: string;
  name: string
}
@Component({
  selector: 'app-queryexefile',
  templateUrl: './queryexefile.component.html',
  styleUrls: ['./queryexefile.component.scss']
})

export class QueryexefileComponent implements OnInit {

  qryExecFileFrm : FormGroup
  createqryExecFrm : FormGroup
  statuslist : any
  RaisedByList: any
  schemalist : any
  typelist : any
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('raisertyperole') matempAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any; 
  @ViewChild('raisedByInput') raisedByInput: any; 
  @ViewChild('aproveByInput') aproveByInput: any; 
  @ViewChild('closedbuttons') closedbuttons;
  isLoading=false;
  has_nextrsr= true;
  has_previousrsr = true;
  currentpagersr: number = 1;
  rqstraisedlist: any
  has_nextrqstrsr= true;
  has_previousrqstrsr = true;
  currentpagerqstrsr: number = 1;

  rqstapprovedlist: any
  has_nextrqstapp= true;
  has_previousrqstapp = true;
  currentpagerqstapp: number = 1;
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  constructor(private fb : FormBuilder, private toastr : ToastrService, private spinner : NgxSpinnerService, private service : ReportserviceService,
    private notification : NotificationService) { }

  ngOnInit(): void {
    this.qryExecFileFrm = this.fb.group({
      request_code:[''],
      request_raised_by: [''],
      status:[''],
    })

    this.createqryExecFrm = this.fb.group({
      schema:[''],
      type: [''],
      request_by:[''],
      approve_by:[''],
      purpose:[''],
    })
    this.service.getfilestatus().subscribe((results: any[]) => {
      this.statuslist = results["data"];
    })
    this.service.gettype().subscribe((results: any[]) => {
      this.typelist = results["data"];
    })

    this.getrm('')
    this.getqueryexec(1)

    this.qryExecFileFrm.get('request_raised_by').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getrm(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.RaisedByList = datas;

    })

    this.createqryExecFrm.get('schema').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getschemalist(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.schemalist = results["data"];
    });
  }

  qryExeclist: any
  isQryExecpage: boolean = true;
  presentpageQryExec: number = 1;
  formData: FormData = new FormData();
  queryexecMaker : boolean
  queryexecApprover : boolean
    
  getqueryexec(page)
  {
    this.pageIndex = 0
    let data: any ={}
    
    if(this.qryExecFileFrm?.value.request_code != undefined && this.qryExecFileFrm?.value.request_code != null && this.qryExecFileFrm?.value.request_code != "")
      data.code =this.qryExecFileFrm?.value.request_code
    if(this.qryExecFileFrm?.value.request_raised_by.id != undefined && this.qryExecFileFrm?.value.request_raised_by.id != null && this.qryExecFileFrm?.value.request_raised_by.id != "")
      data.approve_by =this.qryExecFileFrm?.value.request_raised_by.id
    if(this.qryExecFileFrm?.value.status != undefined && this.qryExecFileFrm?.value.status != null && this.qryExecFileFrm?.value.status != "")
      data.status =this.qryExecFileFrm?.value.status
    
    this.formData = new FormData();

    let dt ={"action":"GET","filter":data}
    this.formData.append("data",JSON.stringify(dt));

    this.service.getqryexecfilesearch(this.formData,page).subscribe((results: any[]) => {
      let datas = results["data"];
      this.queryexecMaker = results['pagination']?.qem_maker
      this.queryexecApprover = results['pagination']?.qem_approver
      this.qryExeclist=datas
      if (this.qryExeclist?.length > 0) {
        this.length_qryexec = results['pagination'].count;
        this.presentpageQryExec = results['pagination']?.index;
        this.isQryExecpage = true
        this.queryexecMaker = results['pagination']?.qem_maker
        this.queryexecApprover = results['pagination']?.qem_approver
      }
      else
      {
      this.length_qryexec = 0;
      this.isQryExecpage = false
      }
    })
  }

  length_qryexec = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_qryexec=10;
  showFirstLastButtons:boolean=true;
  handleqryexecPageEvent(event: PageEvent) {
      this.length_qryexec = event.length;
      this.pageSize_qryexec = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.presentpageQryExec=event.pageIndex+1;
      this.getqueryexec(this.presentpageQryExec)
      
    }

  resetqueryexec()
    {
      this.qryExecFileFrm.controls['request_code'].reset(""),
      this.qryExecFileFrm.controls['request_raised_by'].reset(""),
      this.qryExecFileFrm.controls['status'].reset("")
      this.pageIndex = 0
      this.getqueryexec(1);
    }
  

    public displayFnraisedby(raisertyperole?: emplists): string | undefined {
      return raisertyperole ? raisertyperole.full_name : undefined;
    }
  
    get raisedbytype() {
      return this.qryExecFileFrm.get('request_raised_by');
    }
    getrm(rmkeyvalue) {
      this.service.getrm(rmkeyvalue,1)
        .subscribe(results => {
          if(results){
          let datas = results["data"];
          this.RaisedByList = datas;
          this.rqstraisedlist = datas;
          this.rqstapprovedlist = datas;
          }
        })
    }
  
    raisedByScroll() {
      setTimeout(() => {
        if (
          this.matempAutocomplete &&
          this.matempAutocomplete &&
          this.matempAutocomplete.panel
        ) {
          fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextrsr === true) {
                  this.service.getrm(this.raiserInput.nativeElement.value, this.currentpagersr + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.RaisedByList.length >= 0) {
                        this.RaisedByList = this.RaisedByList.concat(datas);
                        this.has_nextrsr = datapagination.has_next;
                        this.has_previousrsr = datapagination.has_previous;
                        this.currentpagersr = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }

    addQryExecFile()
    {
     this.getschemalist('')
  
     this.createqryExecFrm.get('schema').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
 
       }),
       switchMap(value => this.service.getschema(value)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.schemalist = datas;
 
     })

     this.createqryExecFrm.get('request_by').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
 
       }),
       switchMap(value => this.service.getrm(value,1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.rqstraisedlist = datas;
 
     })

     this.createqryExecFrm.get('approve_by').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
 
       }),
       switchMap(value => this.service.getrm(value,1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.rqstapprovedlist = datas;
 
     })
    }

    getschemalist(val)
    {
      this.service.getschema(val).subscribe((results: any[]) => {
        this.schemalist = results["data"];
      })
    }

    rqstraisedScroll(){
      setTimeout(() => {
        if (
          this.matempAutocomplete &&
          this.matempAutocomplete &&
          this.matempAutocomplete.panel
        ) {
          fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextrqstrsr === true) {
                  this.service.getrm(this.raisedByInput.nativeElement.value, this.currentpagerqstrsr + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.rqstraisedlist.length >= 0) {
                        this.rqstraisedlist = this.rqstraisedlist.concat(datas);
                        this.has_nextrqstrsr = datapagination.has_next;
                        this.has_previousrqstrsr = datapagination.has_previous;
                        this.currentpagerqstrsr = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    rqstapprovedScroll(){
      setTimeout(() => {
        if (
          this.matempAutocomplete &&
          this.matempAutocomplete &&
          this.matempAutocomplete.panel
        ) {
          fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextrqstapp === true) {
                  this.service.getrm(this.aproveByInput.nativeElement.value, this.currentpagerqstapp + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      if (this.rqstapprovedlist.length >= 0) {
                        this.rqstapprovedlist = this.rqstapprovedlist.concat(datas);
                        this.has_nextrqstapp = datapagination.has_next;
                        this.has_previousrqstapp = datapagination.has_previous;
                        this.currentpagerqstapp = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    public displayFnrqstraised(raisedbyrole?: emplists): string | undefined {
      return raisedbyrole ? raisedbyrole.full_name : undefined;
    }
    public displayFnrqstapproved(approvedbyrole?: emplists): string | undefined {
      return approvedbyrole ? approvedbyrole.full_name : undefined;
    }
  
    addqryBack()
    {
      this.closedbuttons.nativeElement.click();
    }
    filearr =[]
    uploaddata(event:any){
      this.formData = new FormData();
      this.filearr =[]
    
      console.log(event.target.files.length);
      for(let i=0;i<event.target.files.length;i++)
      {
        this.formData.append('file',event.target.files[i])
        this.filearr.push(event.target.files[i]);
      } 
    } 
    
    
    resetcreateform()
    {
      this.createqryExecFrm.controls['schema'].reset(""),
      this.createqryExecFrm.controls['type'].reset(""),
      this.createqryExecFrm.controls['request_by'].reset("")
      this.createqryExecFrm.controls['approve_by'].reset(""),
      this.createqryExecFrm.controls['purpose'].reset(""),
      this.formData = new FormData();
      this.filearr =[]
    
    }
    
    createqryexec()
    {
      let data: any ={}
    
      if(this.createqryExecFrm?.value.schema == undefined || this.createqryExecFrm?.value.schema == null || this.createqryExecFrm?.value.schema == "")
      {
        this.notification.showError("Please Select Schema")
        return false
      }
      if(this.createqryExecFrm?.value.type == undefined || this.createqryExecFrm?.value.type == null || this.createqryExecFrm?.value.type == "")
      {
        this.notification.showError("Please Enter Type")
        return false
      }
      if(this.createqryExecFrm?.value.request_by == undefined || this.createqryExecFrm?.value.request_by == null || this.createqryExecFrm?.value.request_by == "")
      {
        this.notification.showError("Please Select Request raised by")
        return false
      }
      if(this.createqryExecFrm?.value.approve_by == undefined || this.createqryExecFrm?.value.approve_by == null || this.createqryExecFrm?.value.approve_by == "")
      {
        this.notification.showError("Please Select Request approve by")
        return false
      }
      if(this.createqryExecFrm?.value.purpose == undefined || this.createqryExecFrm?.value.purpose == null || this.createqryExecFrm?.value.purpose == "")
      {
        this.notification.showError("Please Enter Purpose")
        return false
      }
      if(this.filearr.length <=0)
      {
        this.notification.showError("Please Choose File")
        return false
      }
      let filename = this.filearr[0].name.split('.')
      if ( filename[1] != "txt" && filename[1] != "TXT") {
        this.notification.showError("Please Upload Text File only.")
        return false
      }
      let dt ={"action":"create",
               "filter":{"purpose":this.createqryExecFrm?.value.purpose,"request_by":this.createqryExecFrm?.value.request_by.id,"approve_by":this.createqryExecFrm?.value.approve_by.id,
                          "schema" : this.createqryExecFrm?.value.schema[0], "query_type" : this.createqryExecFrm?.value.type.text}}
      this.formData.append("data",JSON.stringify(dt));
  
      this.service.createqryexecfile(this.formData).subscribe((results) => {
        if(results.status == "success"){
          this.toastr.success(results.status,results.message) 
          this.closedbuttons.nativeElement.click();
          this.getqueryexec(1);    
          this.resetcreateform()          
        }
      else
      {
       this.toastr.error(results.description,results.code)      
      }       
    })
  }

  backcreateform()
  {
    this.resetcreateform()
  }
  approve(id)
  {
    var answer = window.confirm("Are you sure to Approve?");
    if (!answer) {
      return false
    }
   let data ={"filter":{
      "id":id,
      "status":3}
     }
    
     this.service.qryexecapprovereject(data).subscribe((results) => {
      if(results.status == "success"){
            this.toastr.success(results.message,results.status)  
            this.getqueryexec(1);       
        }
        else
        {
         this.toastr.error(results.description,results.code)      
      }
  })
  }

  reject(id)
  {
    var answer = window.confirm("Are you sure to Reject?");
    if (!answer) {
      return false
    }
    let data ={"filter":{
      "id":id,
      "status":4}
     }
    
     this.service.qryexecapprovereject(data).subscribe((results) => {
      if(results.status == "success"){
        this.getqueryexec(1);  
                  this.toastr.success(results.message,results.status)  
                  
        }
        else
        {
         this.toastr.error(results.description,results.code)      
      }
  })
  }
  view_data:any
  showview(data){
    console.log(data)
    this.view_data = data
  }

  filedownload(file)
  {
    this.spinner.show();
    this.service.downloadExecFile(file).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file;
      link.click();
      this.spinner.hide();
})
  }
  }
