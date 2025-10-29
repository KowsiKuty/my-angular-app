import { Component, OnInit, EventEmitter, Output,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SGService } from '../SG.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGShareService } from '../share.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { count, finalize, switchMap, distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { data } from 'jquery';

// export class noofzones{
//   id:any;
//   noofzone:any;
// }

// export interface zonelist{
//   id:any,
//   text:any,
//   name:any
// }


// export interface productlistss{
//   id:number,
//   name:string
// }
export interface productlistss {
  id: number,
  name: string
}
export interface zonelist {
  id: any,
  text: any,
  name: any
}

@Component({
  selector: 'app-statezonemaster',
  templateUrl: './statezonemaster.component.html',
  styleUrls: ['./statezonemaster.component.scss'],
  providers: [ DatePipe ]
})
export class StatezonemasterComponent implements OnInit {

  // @Output() onCancel = new EventEmitter<any>();
  // @Output() onSubmit = new EventEmitter<any>();

  // StateZoneform:FormGroup
  // statemap_id:FormControl
  // Statename:FormControl
  // zone:FormControl
  // City:FormControl
  // effectivefrom:FormControl
  // effectiveto:FormControl
  // Zonecount:number=0
  // statezonedetails:any
  // statezonelist=[];
  // spratelist=[];
  // nooflist:noofzones;
  // addvalue=0;
  // databasevalue=0;
  // spratelistcount=0
  // getseparatetablelist:any
  // statelist=[];
  // isLoading: boolean;

  // addname:any;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('producttype') matAutocompleteDept: MatAutocomplete;


  @ViewChild('zoneInput') zone_section;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  Minwagesform: FormGroup;
  state: FormControl
  count: FormControl
  statezonelist: any;
  isLoading: boolean = false;
  empstaelist: any;
  effectivefrom: FormControl
  zone: FormControl
  addButton = false;
  zoneNameList = [];
  totalArray = [];
  idValue: any;
  
  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router,
    private sgservice: SGService, private shareservice: SGShareService, private notification: NotificationService,
    private datePipe: DatePipe,) { }

  ngOnInit(): void {
    // this.StateZoneform=this.fb.group({
    //   statemap_id:[''],
      
    //   zone:[''],
      
    //   effectivefrom:[''],
    //   effectiveto:['']  
    // })
    // let data:any=this.shareservice.statezone.value;
    // console.log("data",data)
    // this.addvalue=data.id;
    // this.addname=data.state_id.name
    
    // this.productname(this.addvalue,this.addname)

    // this.getemployeestatezone(1,10)
    
    // this.getseparatetable(this.addvalue)
    // this.getzone(data.noofzones)
    this.Minwagesform = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      count: ['', Validators.required],
      // effectivefrom: ['', Validators.required],
      zone: ['', Validators.required]
    })

    this.getStateZoneView();


  }
  // idValue:any
  // editvalue(data){
  //   this.shareservice.statezoneedit.next(data);
  //   this.getEditminwages()
    
  // }


  // productname(id:any,name:any){
  //   console.log("id is ",id)
  //   let prokeyvalue: String =name;
  //     this.getcatven(prokeyvalue,id,name);
     

  // }
  // private getcatven(prokeyvalue,id,name)
  // {
  //   this.sgservice.getState(prokeyvalue,1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
        
  //           this.statelist.push(datas)
  //           console.log("droplist",this.statelist)
  //           if(this.statelist.length==1)
  //           {
  //             this.StateZoneform.patchValue({
  //               statemap_id:this.statelist[0][0]
  //             })

  //           }
           
  //     })
  // }

  // public displaydis(producttype?: productlistss): string | undefined {

    
  //   return producttype ? producttype.name : undefined;
    
  // }


  // // zone dropdown
  // Zonelist:any[]
  // private getzone(zonenum)
  // {
  
      
    
  //   this.sgservice.getZoneDropdown()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
        
  //       this.Zonelist=datas

  //       if(zonenum==0)
  //         {
  //           for(let i in this.Zonelist )
  //           {
  //             console.log(i)
  //             if(this.Zonelist[i].id==0)
  //             {
  //               let obj=this.Zonelist[i];
  //               this.Zonelist=[];
  //               this.Zonelist.push(obj);
  //               break;
  //             }
  //           }
  //         }
  //         else{
  //           for(let i=0;i<this.Zonelist.length;i++ )
  //           {
  //             if(this.Zonelist[i].id==0)
  //             {
  //               this.Zonelist.splice( i,1)
                
  //               break;
  //             }
  //           }
  //         }

  //     })
  // }

  // public displaydis1(producttype?: zonelist): string | undefined {
 
  //   return producttype.text ? producttype.text : producttype.name;
    
  // }

  // getseparatetable(stateid)
  // {
  //   this.sgservice.getSeparateState(stateid)
  //   .subscribe((result)=>
  //   {
  //     let data=result['data']
  //     this.getseparatetablelist=data
  //   })

     
  //   this.getEditminwages();

  // }
 
  // crateFormate()
  // {
  //   let data=this.StateZoneform.controls
  //   let obj=new StateZonedrop()
    
  //   obj.statemap_id=data['statemap_id'].value;
  //   obj.zone=data['zone'].value.id
  //   obj.effectivefrom=data['effectivefrom'].value
  //   obj.effectiveto=data['effectiveto'].value

  //   return obj
  // }

  // dropdonvalue:any
  // getEditminwages(){
    

  //   let data: any = this.shareservice.statezoneedit.value;
  //   console.log("Edit With Values ",data)
  //   this.idValue = data.id;
  //   if (data === '') {
      
      
  //     this.StateZoneform.patchValue({
        
        
  //       zone: '',
  //       effectivefrom:'',
  //       effectiveto:''

  //     })
  //   } else {
      
  //     data.effectivefrom=new Date(data.effectivefrom)
  //     data.effectiveto=new Date(data.effectiveto)
  //     this.StateZoneform.patchValue({
        
  //       zone: data.zone,
        
  //       effectivefrom:data.effectivefrom,
  //       effectiveto:data.effectiveto
  //     })
  //   }

  // }

  
  // ontableview(){
        
    
  //  console.log("name",this.getseparatetablelist[0].state.statemap_id )
    
  // }

  // StateZoneSubmitForm()
  // {

    
  
  
  //   if(this.StateZoneform.value.zone==="")
  //   {
      
  //     this.toastr.warning('', 'Please Enter the Zone', { timeOut: 1500 });
  //     return false
  //   }
  
  //   if(this.StateZoneform.value.effectivefrom==="")
  //   {
      
  //     this.toastr.warning('', 'Please Select the Effective From date ', { timeOut: 1500 });
  //     return false
  //   }
    
    
  //   // console.log(this.StateZoneform.value)   
  //   const submitlogic=this.StateZoneform.value;
  //   // submitlogic.effectivefrom=new Date();
  //   submitlogic.effectivefrom=this.datepipe.transform(submitlogic.effectivefrom,'yyyy-MM-dd')
  //   submitlogic.effectiveto=this.datepipe.transform(submitlogic.effectiveto,'yyyy-MM-dd')

  //   this.StateZoneform.patchValue(
  //     {effectivefrom:submitlogic.effectivefrom,
  //       effectiveto:submitlogic.effectiveto



  //   })

  //   this.StateZoneform.patchValue({
  //     statemap_id:this.addvalue
  //   })



  //   console.log(this.StateZoneform.value)       

  //   if (this.idValue == undefined) {
  //     this.sgservice.statezoneFormCreation(this.crateFormate(), '')
  //       .subscribe(result => {
  //         if(result.status === "success"){
  //           this.notification.showSuccess("Successfully Created!...")
  //           this.getseparatetable(this.addvalue)
  //         }
  //         else {
  //           this.notification.showError(result.description)
  //         } 

          
          
  //         this.idValue = result.id;
  //       })
  //   } else {   
  //     this.sgservice.statezoneFormCreation(this.crateFormate(), this.idValue)
  //       .subscribe(result => {
  //         if(result.status === "success"){
  //           this.notification.showSuccess("Successfully Updated!...")
  //           this.getseparatetable(this.addvalue)
  //         }
  //         else {
  //           this.notification.showError(result.description)
  //         } 
         
  //       })
  //     }
  //     // this.StateZoneform.reset('');
  //     this.ngOnInit();
  //     this.shareservice.statezoneedit.next("")

  //     this.StateZoneform.patchValue({
  //       statemap_id:this.statelist[0][0]
  //     })
      
  // }
  // onCancelClick(){

  //   this.shareservice.statezoneedit.next("");
  //   this.router.navigate(['/sgmaster',1], { skipLocationChange: true })
    
  // }
  // onAddClick(){
    
    

  // }
  
  
 
  // getemployeestatezone(pagenumber=1,pagesize=10){

  //   this.sgservice.getStatezone(pagenumber,pagesize)
  //   .subscribe((result)=>
  //   {
      
  //     let datas = result['data'];
  //     let datapagination = result["pagination"];
  //     let datalist= datas;
  //     this.statezonelist=this.statezonelist.concat(datalist)
  //     console.log("StateZone master", this.statezonelist)

  //     if (datapagination.has_next == true ) {
  //       this.getemployeestatezone(pagenumber+1,pagesize=10)
  //     }
      
  //   })
    
  //   console.log("StateZone master", this.statezonelist)
    
  // }


  // getemployeeminwage(pagenumber=1,pagesize=10){

  //   this.sgservice.getminwages(pagenumber,pagesize)
  //   .subscribe((result)=>
  //   {
      
  //     let datas = result['data'];
  //     let datapagination = result["pagination"];
  //     this.nooflist= datas;
  //     console.log("ClientMaster")
      
  //   })

  // }

  // sset()
  // {
  //   console.log("StateZone", this.statezonelist)
  //   this.onlyoneState()
  // }
 
  // onlyoneState()
  // {

  //   let data:any=this.shareservice.statezone.value;

  //   for(let i=0;i<this.statezonelist.length;i++)
  //   {
  //     if(data.id==this.statezonelist[i].state_id)
  //     {
  //       this.databasevalue++;
  //       this.spratelist.push(this.statezonelist[i])
  //     }
  //   }
  //   console.log("Sparatelist", this.statezonelist)
    
  // }

  // keyPressNumbers(event) {
  //   console.log(event.which)
  //   var charCode = (event.which) ? event.which : event.keyCode;
  //   console.log(event.keycode)
  //   // Only Numbers 0-9
  //   if (event.keyCode==32)
  //   {
  //     return true;
  //   }
  //   if ((charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  // keyPressAlpha(event) {

  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z]/.test(inp) ||event.keyCode==32) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
  //     return false;
      
  //   }
  // }
  // keyPressAlphanumeric(event)
  // {
  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
  //     return false;
      
  //   }
  // }
  getStateZoneView(){
    let data = this.shareservice.statezone.value
    console.log("getStateZoneView",data)
    this.zoneNameList = data.zone
    this.Minwagesform.patchValue({
      name: data.name,
      code: data.code,
      count: data.count,
     
  })
  }


  productname() {
    let prokeyvalue: String = "";
    this.getcatven(prokeyvalue);
    this.Minwagesform.get('state').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getState(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empstaelist = datas;
        console.log("product", datas)

      })

  }
  private getcatven(prokeyvalue) {
    this.sgservice.getState(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empstaelist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
    return producttype ? producttype.name : undefined;

  }

  zoneCount(e) {
    let zonenum = e.target.value;
    console.log("count", zonenum)
    this.addButton = false;
    this.getzone(zonenum)
  }

  array: number;
  list: string;
  addZoneName() {
    if (this.Minwagesform.value.count === "") {
      this.notification.showWarning("Please Fill the No of Zone")
      return false
    }
    if (this.Minwagesform.value.zone == "") {
      this.notification.showWarning("Please Select the Zone")
      return false
    }
    let list = this.Minwagesform.value.zone
    this.zoneNameList.push(list);
    this.array = this.zoneNameList.length
    this.list = this.array.toString();
    if (this.Minwagesform.value.count === this.list) {
      this.addButton = true;
    }
    if (this.Minwagesform.value.count === "0") {
      this.addButton = true;
    }
    console.log("aa", this.zoneNameList)
    this.zone_section.nativeElement.value = ' ';

  }


  zoneNameDelete(index: number) {
    this.zoneNameList.splice(index, 1);
    let count = this.Minwagesform.value.count
    this.array = this.zoneNameList.length
    this.list = this.array.toString();
    if (count === this.list) {
      this.addButton = true;
      if (count == "0") {
        this.addButton = false;
      }
    }
    else {
      this.addButton = false;
    }

  }


  clear() {
    this.zone_section.nativeElement.value = ' ';

  }


  // zone dropdown
  Zonelist: any[]
  private getzone(zonenum) {
    this.sgservice.getZoneDropdown()
      .subscribe((results: any[]) => {
        let datas = results["data"];

        this.Zonelist = datas

        if (zonenum == 0) {
          for (let i in this.Zonelist) {
            console.log(i)
            if (this.Zonelist[i].id == 0) {
              let obj = this.Zonelist[i];
              this.Zonelist = [];
              this.Zonelist.push(obj);
              break;
            }
          }
        }
        else {
          for (let i = 0; i < this.Zonelist.length; i++) {
            if (this.Zonelist[i].id == 0) {
              this.Zonelist.splice(i, 1)

              break;
            }
          }
        }

      })
  }



  public displaydis1(producttype1?: zonelist): string | undefined {
    return producttype1.text ? producttype1.text : producttype1.name;

  }




  // getEditminwages() {

    // let data: any = this.shareservice.minwages.value;
    // this.idValue = data.id;
    // if (data === '') {
    //   this.Minwagesform.patchValue({
    //     state_id: '',
    //     noofzones: ''
    //   })
    // }
    //  else {
    //   this.Minwagesform.patchValue({
    //     state_id: data.state_id,
    //     noofzones: data.noofzones
    //   })
    // }

  // }

  onCancelClick() {
    this.onCancel.emit();
    // this.router.navigate(['SGmodule/sgmaster', 1], { skipLocationChange: true })
  }

  // MinwagesSubmitForm() {
  //   this.totalArray = [];
  //   if (this.Minwagesform.value.state_id === "") {

  //     this.toastr.warning('', 'Please Enter the State', { timeOut: 1500 });
  //     return false
  //   }
  //   if (this.Minwagesform.value.count === "") {

  //     this.toastr.warning('', 'Please Enter the No of Zone', { timeOut: 1500 });
  //     return false
  //   }
  //   if (this.Minwagesform.value.effectivefrom === "") {

  //     this.toastr.warning('', 'Please Enter the Effective From Date', { timeOut: 1500 });
  //     return false
  //   }
  //   if (this.Minwagesform.value.zone == "") {
  //     this.toastr.warning("Please Select the Zone")
  //     return false
  //   }

  //   const fromDate = this.Minwagesform.value;
  //   fromDate.effectivefrom = this.datePipe.transform(fromDate.effectivefrom, 'yyyy-MM-dd');
  //   this.Minwagesform.value.state_id = this.Minwagesform.value.state_id.id


  //   let count = this.Minwagesform.value.count
  //   console.log("count", count)
  //   let arraySize = this.zoneNameList.length
  //   console.log("arraysize", arraySize)
  //   if (count != "0") {
  //     if (count < arraySize || count > arraySize) {
  //       this.notification.showError("Zone Count Not Match...")
  //       return false;
  //     }
  //   }

  //   for (let i = 0; i < this.zoneNameList.length; i++) {
  //     this.totalArray.push(this.zoneNameList[i].id)
  //   }

  //   console.log("array", this.totalArray)
  //   this.Minwagesform.value.zone = this.totalArray

  //   const cont = this.Minwagesform.value;
  //   cont.count = Number(cont.count)

  //   console.log("number of form", this.Minwagesform.value)

  //   if (this.idValue == undefined) {
  //     this.sgservice.stateZoneAddition(this.Minwagesform.value, '')
  //       .subscribe(result => {
  //         if (result.status === "success") {
  //           this.notification.showSuccess("Successfully Created!...")
  //           this.router.navigate(['/sgmaster', 1], { skipLocationChange: true })
  //         }
  //         else {
  //           this.notification.showError(result.description)
  //         }
  //         this.idValue = result.id;
  //       })
  //   }
  //   // else {
  //   //   this.sgservice.minwagesFormCreation(this.createFormat(), this.idValue)
  //   //     .subscribe(result => {
  //   //       if(result.status === "success"){
  //   //         this.notification.showSuccess("Successfully Updated!...")
  //   //         this.router.navigate(['/sgmaster',1], { skipLocationChange: true })
  //   //       }
  //   //       else {
  //   //         this.notification.showError(result.description)
  //   //       } 
  //   //     })
  //   //   }

  // }
  keyPress(event) {
    this.toastr.warning(event, 'Don\'t type ', { timeOut: 1000 });
    return false
  }

  keyPressNumbers(event) {
    console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
    console.log(event.keycode)
    // Only Numbers 0-9
    if (event.keyCode == 32) {
      return true;
    }
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
      return false;
    } else {
      return true;
    }
  }
  keyPressAlpha(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });
      return false;

    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });
      return false;

    }
  }

  // state dropdowns

  has_next: boolean = true
  has_previous: boolean = true
  currentpage: number = 1
  autocompleteStatenameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteDept &&
        this.autocompleteTrigger &&
        this.matAutocompleteDept.panel
      ) {
        fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteDept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.sgservice.getState(this.primaryContactInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empstaelist = this.empstaelist.concat(datas);
                    if (this.empstaelist.length >= 0) {
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

}


// class StateZonedrop{
//   statemap_id:any
//   zone:any
//   effectivefrom:any
//   effectiveto:any
// }