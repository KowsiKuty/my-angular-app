import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { TnebShareService } from '../tneb-share.service';
import { TnebService } from '../tneb.service';
export interface state{
  id:string;
  name:string;
}
export interface branchList{
  id:number
  region_name:string
  // code:string
}
@Component({
  selector: 'app-elec-codo-approval',
  templateUrl: './elec-codo-approval.component.html',
  styleUrls: ['./elec-codo-approval.component.scss']
})
export class ElecCodoApprovalComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  @ViewChild('viewdata') viewdetailsdata:TemplateRef<any>;
  createelecform:any=FormGroup;
  branch_Id:any;
  array:Array<any>=[];
  stateList:Array<any>=[];
  findPremisesList:Array<any>=[];
  branchlist:Array<any>=[];
  paymentpresentpage:number=1;
  pagesizepayment:number=10;
  isLoading:boolean=false;
  id:any;
  electricityBoard = [{ id: 1, name: "TNEB" }]
  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private ebservice:TnebService,private matdialog:MatDialog,private notification:NotificationService,private router:Router,
    private tnebshareservide:TnebShareService
    ) { }

  ngOnInit(): void {
    this.createelecform=this.fb.group({
      'statename':new FormControl(''),
      'elecboard':new FormControl(''),
      'region':new FormControl(''),
      'premicename':new FormControl(''),
      'occupancytype':new FormControl(''),
      'premicetype':new FormControl(''),
      'contactperson':new FormControl(''),
      'contactno':new FormControl(''),
      'consumerno':new FormControl(''),
      'consumername':new FormControl(''),
      'billingcycle':new FormControl(''),
      'siteid':new FormControl(''),
      'remarks':new FormControl(''),
      'activate':new FormControl(''),
      'premises_id':new FormControl(''),
      'occupancy_id':new FormControl(''),
      'premise_type':new FormControl(''),
      'branch_id':new FormControl(''),
      'premise_name':new FormControl(),
      
    });
    let data:any=this.tnebshareservide.viewelecdetails.value;
    this.id=data.id;

    this.createelecform.patchValue({
      'statename':data.consumer_state,
      'elecboard':data.consumer_board,
      'region':{'region_name':data.regioncode.region_name,'id':data.regioncode.id},
      'premicename':data.premise.name,
      'occupancytype':data.premise.occupancy_name,
      'occupancy_id':data.premise.id,
      'premicetype':data.premise.premise_type,
      'contactperson':data.personname,
      'contactno':data.contactno,
      'consumerno':data.consumer_no,
      'consumername':data.consumer_name,
      'billingcycle':data.billingcycle,
      'siteid':data.id,
      'remarks':'',
      'activate':data.status==1?"activate":"deactivate",
      'premises_id':data.premises_id,
      'branch_id':data.branch_id.id,
      'premise_name':data.premise.name,
      "premise_type":data.premise.premise_type
    });
    this.createelecform.get('statename').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.ebservice.getstatedata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.stateList=data['data'];
    });
    this.createelecform.get('region').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.ebservice.getbranchdropdown(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchlist = datas;
      console.log("region", datas)

    });
    this.getbranchId();
    // this.getFindPremises();
  }
  public stateinterface(data?:state):string | undefined{
    return data?data.name:undefined;
  }
  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? branchtype.region_name : undefined;
    
  }
  getFindPremises(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
  this.ebservice.findPremises(filter, sortOrder, pageNumber, pageSize,this.branch_Id)
    .subscribe((results: any[]) => {
      console.log("branchlist", results);
      this.findPremisesList = results;

    })
}
checkedtrue(data,list) {
  console.log(data)
  console.log(list)
  this.array.push(list)
  console.log("abcd", this.array)
}
getbranchId() {
  this.ebservice.getbranchId()
    .subscribe((results) => {
      this.branch_Id = results.id;
      console.log("branchId", this.branch_Id)
      this.getFindPremises();
    })
    
}
  clicktoview(data:any){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.position = {
        top:  '0'  ,
        // right: '0'
      };
      dialogConfig.width = '60%' ;
      dialogConfig.height = '500px' ;
      console.log(dialogConfig);
    this.matdialog.open(this.viewdetailsdata,dialogConfig);
  }
  canceldata(){
    this.matdialog.closeAll();
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  getconsumercode(){
    if(this.createelecform.get('contactno').value =='' || this.createelecform.get('contactno').value ==undefined || this.createelecform.get('contactno').value ==null){
     this.notification.showError('Please Enter The Contact Number');
     return false;
    }
    if(this.createelecform.get('consumerno').value =='' || this.createelecform.get('consumerno').value ==undefined || this.createelecform.get('consumerno').value ==null){
      this.notification.showError('Please Enter The Consumer No');
      return false;
     }
    if(this.createelecform.get('contactno').value.toString().length ==10){
      console.log('0');
    }
    else{
      this.notification.showError('Please Enter The Mobile Number 10 Digits');
      return false;
    }
    let data:any={'data': {'MobileNo': this.createelecform.get('contactno').value.toString(), 'BankCode': 'PGMKVB', 'ConsumerNo': this.createelecform.get('consumerno').value.toString() }}
    this.ebservice.getconsumercodedata(data).subscribe(datas=>{
      if(datas["MININFO"]=="Invalid Consumer"){
        this.notification.showError('Invalid Consumer');
      }
      else{
        this.createelecform.get('consumername').patchValue(datas['CNAME']);
      }
      
    },
    (error)=>{
      
    }
    )
  }
  submitdata(){
       this.createelecform.patchValue({
        "premicename": this.array[0].premise_name,
        "occupancytype":this.array[0].usage.occupancy_name,
        "premicetype":this.array[0].premise_ownership.ownership_type,
        "premises_id":this.array[0].premise_id,
        "occupancy_id":this.array[0].usage.id,
        "premise_type":this.array[0].premise_ownership.id,
      });
      this.array=[];
      this.getFindPremises();
    
    }
    addElectricitySubmit(){
  
      //     billingcycle: 4
// branch_id: 4
// consumer_board: "TNEB"
// consumer_name: ""
// consumer_no: "43645654"
// consumer_state: "Tamil Nadu"
// contactno: "696789768978"
// occupancy_id: 3
// occupancy_name: "Branch"
// personname: "BMW"
// premise_name: "Trichy1"
// premise_type: 3
// premises_id: 2216
// regioncode: 4
// remarks: "56345"
// siteid: "43543"
      let d:any={
        // "consumer_state":this.createelecform.get('statename').value.name ,
        'id':this.id,
        "consumer_state":'Tamil Nadu' ,
        "consumer_board": this.createelecform.get('elecboard').value,
        "regioncode":this.createelecform.get('region').value.id,
        "premises_id":this.createelecform.get('premises_id').value,
        "premise_name":this.createelecform.get('premicename').value,
        "occupancy_id":this.createelecform.get('occupancy_id').value,
        "occupancy_name":this.createelecform.get('occupancytype').value,
        "premise_type":this.createelecform.get('premise_type').value,
        "personname":this.createelecform.get('contactperson').value,
        "contactno":this.createelecform.get('contactno').value,
        "consumer_no": this.createelecform.get('consumerno').value,
        "consumer_name": this.createelecform.get('consumername').value,
        "billingcycle":this.createelecform.get('billingcycle').value,
        "siteid":this.createelecform.get('siteid').value,
        "remarks":this.createelecform.get('remarks').value,
        "branch_id":this.createelecform.get('branch_id').value
      }
        this.ebservice.addElectricity(d)
          .subscribe(result => {
            if(result.id == undefined){
              this.notification.showError(result.description)
            }
            else {
              this.notification.showSuccess("Successfully created!...")
              this.router.navigate(['/electricitySummary'], { skipLocationChange: true })
            } 
          },
          error => {
            
          })  
  
    }
}
