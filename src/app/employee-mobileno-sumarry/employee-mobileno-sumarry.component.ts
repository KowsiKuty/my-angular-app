import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ShareService } from '../atma/share.service';
import { DataService } from '../service/data.service';
import { NotificationService } from '../service/notification.service';
import { SharedService } from '../service/shared.service';
import { HostListener,  TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

export interface ownerdata{
  id:string,
  full_name:string
 }
 export interface branch{
  id:string;
  name:string;
  code:string;
}

@Component({
  selector: 'app-employee-mobileno-sumarry',
  templateUrl: './employee-mobileno-sumarry.component.html',
  styleUrls: ['./employee-mobileno-sumarry.component.scss']
})

export class EmployeeMobilenoSumarryComponent implements OnInit {
 
  mobileupdationform: any;
  timeout: any;
  login_code: any;
  mobileid: any;
  mobilesummary=false;
  mobileList:any;
  presentpagebs: number = 1;
  pagesize: number = 10;
  has_previousbs = true;
  has_nextbs = true;
  filter={};
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppage:number=1;
  ownerList:Array<any>=[];
  ownerListt:Array<any>=[];
  isLoading:boolean;
  searchmob:any=FormGroup;
  crtemploymobno:any=FormGroup;
  branchList: Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  changedmobno:boolean = true;
  has_branchpresentpage:number=1;
  @ViewChild('nameref') matSupname:MatAutocomplete;
  @ViewChild('namereff') matSupnamee:MatAutocomplete;
  @ViewChild("payementsubmit") payementsubmit;

  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger:MatAutocompleteTrigger;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  constructor(private idle: Idle, public cookieService: CookieService, private dataService: DataService, private formBuilder: FormBuilder, private notification: NotificationService,
    public sharedService: SharedService, private shareService: ShareService, private SpinnerService: NgxSpinnerService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getempmobilesummary(this.filter,this.presentpagebs);
    const sessionData = localStorage.getItem("sessionData")
    let logindata = JSON.parse(sessionData);
    this.crtemploymobno = this.formBuilder.group({
      mobile_number: ['',Validators.required],
      namee: ['',Validators.required],
      type:["INSERT"],
      isadmin:[1]
    })
    this.mobileupdationform = this.formBuilder.group({
      code: [''],
      name: [''],
      mobile_number: [''],
      id: [''],
      type:["UPDATE"],
      isadmin:[1]
    })
    this.searchmob=this.formBuilder.group({
      'mobile_number':new FormControl(''),
      'name':new FormControl(''),
      'branch':new FormControl('')

    });
    // this.employmobno=this.formBuilder.group({
    //   'empcrtname':new FormControl(''),
    //   'name':new FormControl(''),

    // });
    this.dataService.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.searchmob.get('branch').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.dataService.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    });
    let namekey: String = "";
    this.namedrop(namekey)
    this.searchmob.get('name').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.dataService.get_EmployeeList(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ownerList=data['data'];
    });
    let namekeyy: String = "";
    this.namedropp(namekeyy)
    this.crtemploymobno.get('namee').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.dataService.get_EmployeeList(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ownerListt=data['data'];
    });

  }

  assetBtn2(){
    this.mobilesummary=true

 }
 getempmobilesummary(filter,page)
 {
  this.SpinnerService.show();
   this.dataService.getempmobno(filter,page).subscribe((results) => {
     console.log("Result",results)
     if(results['code'] == "INVALID_DATA")
     {
      this.notification.showError(results['description'])
      this.SpinnerService.hide()
     }
     else{ 
      let datas = results["data"];
        console.log("getbs", datas);
        let datapagination = results["pagination"];
        this.mobileList = datas;
        this.SpinnerService.hide()
        if (this.mobileList.length > 0) {
          this.has_nextbs = datapagination.has_next;
          this.has_previousbs = datapagination.has_previous;
          this.presentpagebs = datapagination.index;
        }
     }
   })
 }
 nextClickbs() {
  if (this.has_nextbs === true) {
   this.presentpagebs=this.presentpagebs + 1;
   this.getempmobilesummary(this.filter,this.presentpagebs);
  }
}

previousClickbs() {
  if (this.has_previousbs === true) {
    this.presentpagebs=this.presentpagebs - 1;
    this.getempmobilesummary(this.filter,this.presentpagebs);
  }
}
forInactivebs(data) {
  let empcode = data.code
  let id = data.id
  let status: number = 0
  let datatoapi={ 
    "menooapicallreq":true,
"emp_code":empcode,
"status":status
  }
  console.log('check id for data passing', id)
  this.dataService.activeInactivemobno(datatoapi)
    .subscribe((results: any[]) => {
      if(results['status'] == "success")
        {
        this.notification.showSuccess(results['message'])
        this.getempmobilesummary(this.filter,this.presentpagebs);
        }
      else{
        this.notification.showError(results['message'])
        this.getempmobilesummary(this.filter,this.presentpagebs);
      }
    })
  // alert('inactive')
}
foractivebs(data) {
  let empcode = data.code
  let datas = data.id
  let status: number = 1
  let datatoapi={
    "menooapicallreq":true,
    "emp_code":empcode,
    "status":status
      }
  console.log('check id for data passing', datas)
  this.dataService.activeInactivemobno(datatoapi)
    .subscribe((results: any[]) => {
      if(results['status'] == "success")
        {
        this.notification.showSuccess(results['message'])
        this.getempmobilesummary(this.filter,this.presentpagebs);
        }
      else{
        this.notification.showError(results['message'])
        this.getempmobilesummary(this.filter,this.presentpagebs);
      }
    })
  // alert('active')
}
autocompletesupname(){
  console.log('second');
  setTimeout(()=>{
    if(this.matSupname && this.autoCompleteTrigger && this.matSupname.panel){
      fromEvent(this.matSupname.panel.nativeElement,'scroll').pipe(
        map(x=>this.matSupname.panel.nativeElement.scrollTop),
        takeUntil(this.autoCompleteTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matSupname.panel.nativeElement.scrollTop;
          const scrollHeight=this.matSupname.panel.nativeElement.scrollHeight;
          const elementHeight=this.matSupname.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_supnext){
             
             this.dataService.get_EmployeeList(this.searchmob.get('name').value, this.has_suppage+1).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.ownerList=this.ownerList.concat(dear);
               if(this.ownerList.length>0){
                 this.has_supnext=pagination.has_next;
                 this.has_supprevious=pagination.has_previous;
                 this.has_suppage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}
autocompletesupnamee(){
  console.log('second');
  setTimeout(()=>{
    if(this.matSupnamee && this.autoCompleteTrigger && this.matSupnamee.panel){
      fromEvent(this.matSupnamee.panel.nativeElement,'scroll').pipe(
        map(x=>this.matSupnamee.panel.nativeElement.scrollTop),
        takeUntil(this.autoCompleteTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matSupnamee.panel.nativeElement.scrollTop;
          const scrollHeight=this.matSupnamee.panel.nativeElement.scrollHeight;
          const elementHeight=this.matSupnamee.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_supnext){
             
             this.dataService.get_EmployeeList(this.crtemploymobno.get('namee').value, this.has_suppage+1).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.ownerListt=this.ownerListt.concat(dear);
               if(this.ownerListt.length>0){
                 this.has_supnext=pagination.has_next;
                 this.has_supprevious=pagination.has_previous;
                 this.has_suppage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}
public ownerdatainterface(data?:ownerdata):string | undefined{
  return data?data.full_name:undefined;
}
public ownerdatainterfacee(data?:ownerdata):string | undefined{
  return data?data.full_name:undefined;
}
Search()
{
  if(this.searchmob.get('name').value !=null && this.searchmob.get('name').value !='' && this.searchmob.get('name').value !=undefined){
    this.filter['name']=this.searchmob.get('name').value.code;
    console.log("this.respondform.get('name').value",this.searchmob.get('name').value.code);
  }
  if(this.searchmob.get('mobile_number').value !=null && this.searchmob.get('mobile_number').value !='' && this.searchmob.get('mobile_number').value !=undefined){
    this.filter['mobno']=this.searchmob.get('mobile_number').value;
  }
  if(this.searchmob.get('branch').value !=null && this.searchmob.get('branch').value !='' && this.searchmob.get('branch').value !=undefined){
    this.filter['branch']=this.searchmob.get('branch').value.id;
  }
  this.getempmobilesummary(this.filter,1);
}

Clear()
{
  this.filter={}
  this.searchmob.reset();
  this.getempmobilesummary(this.filter,this.presentpagebs);
}
mobilenoedit(data)
{
  console.log("Edit Data",data)
  this.mobileupdationform.patchValue(
    {
      code:data?.code,
      name:data?.name,
      id:data?.id,
      mobile_number: data?.mobile_number,
      isadmin:1
    }
  )
}
employeemobileupdate()
{
  if(new String(this.mobileupdationform.value.mobile_number).length == 10)
  {
    console.log("Update Data",this.mobileupdationform.value)

    this.dataService.checkmobnoexist(this.mobileupdationform.value)
    .subscribe((results) => {
      if(results['MESSAGE'] == 'Not_Exist'){
        this.updateorcreatemobno(this.mobileupdationform.value)
      }
      else{
      
        var answer = window.confirm(results['MESSAGE']);
        if (answer) {
          this.updateorcreatemobno(this.mobileupdationform.value)
        }
        else {
          return false;
        }  
      }
    })
  }
  else
  {
    this.notification.showWarning("Mobile No should be 10 Digits")
  }
}
CreateNew()
{
  this.payementsubmit.nativeElement.click();
  console.log("Crt data",this.crtemploymobno.value)
  let fill={}
  fill['name']=this.crtemploymobno.value.namee.name
  fill['id']=this.crtemploymobno.value.namee.id 
  fill['code']=this.crtemploymobno.value.namee.code 
  fill['type']= "INSERT"
  fill['mobile_number']=this.crtemploymobno.value.mobile_number
  fill['isadmin']=1
  this.dataService.find_mobileno_exist_for_employee(fill).subscribe((result) => {
    if(result['MESSAGE'] == 'Not_Exist'){
      if(new String(fill['mobile_number']).length == 10)
      {
        this.dataService.checkmobnoexist(fill)
        .subscribe((results) => {
          if(results['MESSAGE'] == 'Not_Exist'){
            this.updateorcreatemobno(fill)
          }
          else{
            var answer = window.confirm(results['MESSAGE']);
            if (answer) {
              this.updateorcreatemobno(fill)
            }
            else {
              return false;
            }  
          }
        })
      }
      else
      {
        this.notification.showWarning("Mobile No should be 10 Digits")
      }
    }
    else
    {
      this.notification.showWarning(result['MESSAGE'])
    }
  })

  this.crtemploymobno.reset();
  
}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

updateorcreatemobno(data)
{
  this.SpinnerService.show();
  this.dataService.mobnoupdateorcreate(data)
    .subscribe((results) => {
      if(results['MESSAGE'] == 'SUCCESS'){
        this.SpinnerService.hide();
        this.getempmobilesummary({},this.presentpagebs);
        this.notification.showSuccess('Successfully Updated')
      }
      else{
        this.SpinnerService.hide();
       this.notification.showError(results['MESSAGE'])
      }
    },
    (error)=>{
      this.SpinnerService.hide();
      this.notification.showWarning(error)
    });
  }
  private namedrop(branchkeyvalue) {
    this.SpinnerService.show();
    this.dataService.get_EmployeeList(branchkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ownerList = datas;
      },
      (error)=>{
        this.SpinnerService.hide();
        this.notification.showWarning(error.status+error.statusText)
      });
  }
  private namedropp(branchkeyvaluee) {
    this.SpinnerService.show();
    this.dataService.get_EmployeeList(branchkeyvaluee,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ownerListt = datas;
      },
      (error)=>{
        this.SpinnerService.hide();
        this.notification.showWarning(error.status+error.statusText)
      });
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.dataService.getAMBranchdropdown( this.has_branchpresentpage+1,this.searchmob.get('branch').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  empmonochange()
  {
      this.changedmobno = false
  }
}
