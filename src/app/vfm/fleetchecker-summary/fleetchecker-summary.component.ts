import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment'
import {VfmService} from "../vfm.service";
import {ShareService} from '../share.service'
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Component, OnInit,Output,EventEmitter,ViewChild,HostListener,ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-fleetchecker-summary',
  templateUrl: './fleetchecker-summary.component.html',
  styleUrls: ['./fleetchecker-summary.component.scss']
})
export class FleetcheckerSummaryComponent implements OnInit {
  fleetIdentificationSearch : FormGroup;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
   

  is_maker =this.shareservice.makerstatus.value;   //4860
  

  statusList:any[]= [
    {id:1 ,text:"Draft"},
    // {id:2 ,text:"Pending checker"},
    {id:3 ,text:"Approved"},
    {id:0 ,text:"Rejected"},
  ]

  //4860
  statusLists:any[]= [
    {id:1 ,text:"Draft"},
    {id:2 ,text:"Pending checker"},
    {id:3 ,text:"Approved"},
    {id:0 ,text:"Rejected"},
  ]
  

  pagesize = 10;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  has_next = true;
  has_presenntids:any;
  has_previous = true;
  branch:boolean;
 pageNumber:number = 1;
  presentpage: number = 1;
  branchlist: any
  vehicle: any;
  ownership: any;
  fleetList: any;
  isfleetList:boolean=true
  isedit=false
  isadd=false
  data: any
  statusId: number = 1
  statusselected: any='Draft';
  statusupdatebranchid: any;
  // maker: any;
  maker: boolean=false;

 
  constructor(private fb:FormBuilder, private router: Router,private vfmService:VfmService,private shareservice:ShareService) { }
  

  ngOnInit(): void {
    console.log("is_maker====>", this.maker)

    this.fleetIdentificationSearch = this.fb.group({
      vehicle_no: [''],
      code: [''],
      branch_id:['']
    })
    this.getbranch()
    this.fleetIdentificationSearch.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.vfmService.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("Branch List", this.branchlist)
      });
    this.getvehicle(this.send_value,this.presentpage,this.pagesize)
  }
  vehicleno(e){
    this.vehicle = e.target.value
    console.log("this.tour",this.vehicle)
  }
  getbranch() {
    this.vfmService.getbranchname() .subscribe(res=>{
        this.branchlist = res['data']
      }
    )

  }
  branchname(e) {
    this.branch=true
    this.statusupdatebranchid = e
  }
  permitupdate(e){
    this.ownership = e
  }
  addIdentificationForm(){
    this.data = {id:0}
    this.shareservice.vehiclesummaryData.next(this.data['id'])
    this.router.navigateByUrl('vfm/fleet_maker');
  }
  // getvehicle(val,pageNumber,pageSize) {  5069
    getvehicle(val,pageNumber,pageSize) {
    this.vfmService.getvehicleSummary(this.statusId,val,pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.fleetList = datas;
        this.maker=results['is_maker']
        if(this.maker==true){
          this.isadd=true
        }
        if(this.maker==true){
        for(let i=0;i<=datas.length;i++){
         
        if(datas[i]?.approval_status?.status=="Draft"){
            this.isedit=true
        }
        else{
          this.isedit=false
        }
      }
      }
      
     
        if (this.fleetList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isfleetList = true;
        } else if (this.fleetList.length == 0) {
          this.isfleetList = false;
        }
      })

  }
  searchClick(){
  }
  send_value:String=""
  fleetMakerSearch(){
    let form_value = this.fleetIdentificationSearch.value;
    if(form_value.vehicle_no != "")
    {
      this.send_value=this.send_value+"&no="+form_value.vehicle_no
    }
    if(form_value.code != "")
    {
      this.send_value=this.send_value+"&code="+form_value.code
    }
    if(form_value.branch_id != "")
    {
      this.send_value=this.send_value+"&branch_id="+this.statusupdatebranchid
    }
    this.getvehicle(this.send_value,this.presentpage,this.pagesize)
  }
  reset(){
    this.send_value=""
    this.fleetIdentificationSearch = this.fb.group({
      vehicle_no:[''],
      code:[''],
      branch_id:['']
    })
    this.getvehicle(this.send_value,this.presentpage,this.pagesize)
  }
  pre_nextClick() {
    if (this.has_next === true) {
      this.getvehicle(this.send_value,this.presentpage + 1,this.pagesize)
    }
  }

  pre_previousClick() {
    if (this.has_previous === true) {
      this.getvehicle(this.send_value,this.presentpage - 1,this.pagesize)
    }
  }

  premiseView(data) {
    this.shareservice.vehiclesummaryData.next(data)
    this.router.navigate(['vfm/fleet_view'], { skipLocationChange: isSkipLocationChange })
  }
  fleetEdit(data){
    this.shareservice.vehiclesummaryData.next(data.id)
    this.router.navigateByUrl('vfm/fleet_maker');
  }
  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="Rejected"){
      this.statusId= 0
    }
    if(status_name=="Draft"){
      this.statusId= 1
    }
    if(status_name=="Pending checker"){
      this.statusId= 2
    }
    if(status_name=="Approved"){
      this.statusId= 3
    }

    // this.getvehicle(this.send_value,this.presentpage,this.pagesize)
    //Bug id:5069
    this.getvehicle(this.send_value,this.pageNumber,this.pagesize)

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
              this.vfmService.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
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
}
