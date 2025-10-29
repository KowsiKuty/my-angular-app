import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { DatePipe,formatDate } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { NativeDateAdapter,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export interface productlistss{
  id:number,
  name:string,
  code:string
}
export interface statezonelist{
  id:number,
  name:string
  // state__name:string
}
export interface zonelist{
  id:number,
  name:string
  zone:string
}



@Component({
  selector: 'app-vendermarkupmaster',
  templateUrl: './vendermarkupmaster.component.html',
  styleUrls: ['./vendermarkupmaster.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
})
export class VendermarkupmasterComponent implements OnInit {

  // Vendor dropdown
  @ViewChild('VendorContactInput') VendorContactInput:any;
  @ViewChild('producttype') matAutocompletevendor: MatAutocomplete;

  // State dropdown
  @ViewChild('StateContactInput') StateContactInput:any;
  @ViewChild('producttype1') matAutocompletestate: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();


  // auto select the element of the input 

  @ViewChild('Vendormarkup') Vendormarkup: MatInput;

  VendorMarkupform:FormGroup
  isDisabled:boolean
  vendor_id:FormControl
  state_id:FormControl
  zone:FormControl
  armedpercent:FormControl
  armentamt:FormControl
  unarmedpercent:FormControl
  unarmentamt:FormControl
  effectivefrom:FormControl
  effectiveto:FormControl
  empvendorlist:any
  isLoading=false
  dropdownstate: any;
  dropdownzone:any;
  stateList:any;


  Armedper:boolean=false;
  Armedamt:boolean=false;
  unarmedper:boolean=false;
  unarmedamt:boolean=false;
  statefield = false;
  zonefield = false;


  constructor(private fb: FormBuilder,private datepipe:DatePipe,private router:Router,private toastr: ToastrService,private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService) { }

  ngOnInit(): void {
  
    this.VendorMarkupform=this.fb.group({
      vendor_id:['',Validators.required],
      state_id:['',Validators.required],
      zone:['',Validators.required],
      armedpercent:['',Validators.required],
      armentamt:['',Validators.required],
      unarmedpercent:['',Validators.required],
      unarmentamt:['',Validators.required],
      effectivefrom:['',Validators.required],
      // effectiveto:['',Validators.required]
    })

    this.getEditemployeecat()
    
  }

  idValue:any

  statename(){
    this.dropdownzone=[];
    let prokeyvalue: String = "";
      this.getstate(prokeyvalue);
      this.VendorMarkupform.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getStatezonesearch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          for (let i = 0; i < datas.length; i++) {
            const Date = datas[i].effectivefrom
            let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
            console.log("date",fromdate)
            datas[i].name = datas[i].name + " (" + fromdate + ")"
            console.log("name",datas[i].name)
          }
          this.dropdownstate = datas;

        })

  }
  private getstate(prokeyvalue)
  {
    this.sgservice.getStatezonesearch(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          console.log("date",fromdate)
          datas[i].name = datas[i].name + " (" + fromdate + ")"
          console.log("name",datas[i].name)
        }
        this.dropdownstate = datas;

      })
  }

  public displaydis1(producttype?: statezonelist): string | undefined {

    return producttype.name ? producttype.name : undefined;
  
  }


  stateFocusOut(data){
    this.stateList = data.zone;
    console.log("statezone --- focusout",this.stateList)
  }



  // Zone selected depence on state

  ZoneClick(){
    this.dropdownzone = this.stateList
    console.log("zoneclick",this.dropdownzone)
      // this.getzone(prokeyvalue);
      // this.VendorMarkupform.get('zone').valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //     }),
      //     switchMap(value => this.sgservice.getdepenceofZonedropdowm(value)
      //       .pipe(
      //         finalize(() => {
      //           this.isLoading = false
      //         }),
      //       )
      //     )
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results["data"].zone;
      //     this.dropdownzone = datas;
      //     console.log("product", datas)

      //   })

  }
  // private getzone(prokeyvalue)
  // {
  //   this.sgservice.getdepenceofZonedropdowm(prokeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
        
  //       console.log("value",datas[0].zone)
  //       this.dropdownzone = datas[0].zone;
  //       console.log("datas",this.dropdownzone)

  //     })
  // }

  public displaydis2(producttype?: zonelist): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype.name ? producttype.name : producttype.zone;
    
  }

  getEditemployeecat(){

    let data: any = this.shareservice.vendor.value;
    this.idValue = data.id;
    console.log("valu",data)
    if (data === '') {
      this.VendorMarkupform.patchValue({
        vendor_id: '',
        state_id: '',
        zone:'',
        armedpercent:'',
        armentamt:'',
        unarmedpercent:'',
        unarmentamt:'',
        effectivefrom:'',
      
      })
    } else {
      data.effectivefrom =new Date(data.effectivefrom)
      let state_Details ={
        "id":data.state.id,
        "name":data.state.name
      }
      let zone_Details ={
        "id":data.zone.id,
        "name":data.zone.name
      }
      this.VendorMarkupform.patchValue({
        vendor_id:data.vendor,
        state_id:state_Details,
        zone:zone_Details,
        armedpercent:data.armedpercent,
        armentamt:data.armentamt,
        unarmedpercent:data.unarmedpercent,
        unarmentamt:data.unarmentamt,
        effectivefrom:data.effectivefrom,
      })
      this.statefield = true;
      this.zonefield = true;
    }


  }

  createFormat() {
    let data = this.VendorMarkupform.controls;

    
    let obj = new ctrlofztype();
    
    obj.vendor_id=data['vendor_id'].value.id;
    obj.state_id=data['state_id'].value.id;
    obj.zone=data['zone'].value.id;
    obj.armedpercent=data['armedpercent'].value,
    obj.armentamt=data['armentamt'].value,
    obj.unarmedpercent=data['unarmedpercent'].value,
    obj.unarmentamt=data['unarmentamt'].value,
    obj.effectivefrom=data['effectivefrom'].value
    // obj.effectiveto=data['effectiveto'].value
    
    return obj;
  }

  focusvalue()
  {
    console.log("properties of input element ",this.Vendormarkup)
  }


  productname(){
    console.log("properties of input element ",this.Vendormarkup)
    if(this.VendorMarkupform.value.armedpercent=''){
      this.isDisabled=false
    }
    else{
      this.isDisabled=false
    }
    let prokeyvalue: String = "";
      this.getcatven(prokeyvalue);
      this.VendorMarkupform.get('vendor_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getvendordropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.empvendorlist = datas;
          console.log("product", datas)

        })

  }
  private getcatven(prokeyvalue)
  {
    this.sgservice.getvendordropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
        
    return producttype ? "("+producttype.code +") "+producttype.name : undefined;
    // return producttype ? producttype.name : undefined;
    
  }

  
  onCancelClick(){
    this.onCancel.emit(); 
    // this.router.navigate(['SGmodule/sgmaster',4], { skipLocationChange: true })

  }

  condition()
  {
    if (this.idValue == undefined){
    this.VendorMarkupform.patchValue({
      zone:'',
    })
  }
  }

  
  VendorMarkupSubmitForm(){

    if(this.VendorMarkupform.value.vendor_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Vendor', { timeOut: 1000 });
      return false
    }
    if(this.VendorMarkupform.value.state_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the State', { timeOut: 1000 });
      return false
    }
    if(this.VendorMarkupform.value.zone==="")
    {
      
      this.toastr.warning('', 'Please Enter the Zone', { timeOut: 1000 });
      return false
    }
    if(this.VendorMarkupform.value.armedpercent==='' && this.VendorMarkupform.value.armentamt===''){
      this.toastr.warning('', 'Pls Select Any One Armed Percentage or Armed Amount');
      return false;
    }
    if(this.VendorMarkupform.value.unarmedpercent==='' && this.VendorMarkupform.value.unarmentamt===''){
      this.toastr.warning('', 'Pls Select Any One Unarmed Percentage or Unarmed Amount');
      return false;
    }
    if(this.VendorMarkupform.value.effectivefrom==="")
    {
      
      this.toastr.warning('', 'Please Enter the Effictive from date', { timeOut: 1000 });
      return false
    }
    
    const submitlogic=this.VendorMarkupform.value;
    if(submitlogic.armentamt===''){
      this.VendorMarkupform.value.armentamt=null
    }
    if(submitlogic.armedpercent===''){
      this.VendorMarkupform.value.armedpercent=null
    }
    if(submitlogic.unarmedpercent===""){
      this.VendorMarkupform.value.unarmedpercent=null
    }
    if(submitlogic.unarmentamt===""){
      this.VendorMarkupform.value.unarmentamt=null
    }

    submitlogic.effectivefrom=this.datepipe.transform(submitlogic.effectivefrom,'yyyy-MM-dd')

    this.VendorMarkupform.patchValue(
      {
        effectivefrom:submitlogic.effectivefrom,
        unarmedpercent: this.VendorMarkupform.value.unarmedpercent,
        unarmentamt:this.VendorMarkupform.value.unarmentamt,
        armentamt:this.VendorMarkupform.value.armentamt,
        armedpercent:this.VendorMarkupform.value.armedpercent


    })

    if (this.idValue == undefined) {
      this.sgservice.createvendoretails(this.createFormat(), '')
        .subscribe(result => {
          if(result.status === "success"){
            this.notification.showSuccess("Successfully Created!...")
            this.onSubmit.emit();
            // this.router.navigate(['SGmodule/sgmaster',4], { skipLocationChange: true })
          }
          else {
            this.notification.showError(result.description)
          } 
          
        })
    } else {
      this.sgservice.createvendoretails(this.createFormat(), this.idValue)
        .subscribe(result => {
          if(result.status === "success"){
            this.notification.showSuccess("Successfully Updated!...")
            this.onSubmit.emit();
            // this.router.navigate(['SGmodule/sgmaster',4], { skipLocationChange: true })
          }
          else {
            this.notification.showError(result.description)
          } 
        })
      }
           
  }
  keyPressNumbers(event) {
    console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
    console.log(event.keycode)
    // Only Numbers 0-9
    if (event.keyCode==32)
    {
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

    if (/[a-zA-Z]/.test(inp) ||event.keyCode==32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
      return false;
      
    }
  }
  keyPressAlphanumeric(event)
  {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
      return false;
      
    }
  }


  // Armed and anArmed present 

  Armedamt1: boolean = false;
  Armedper1: boolean = false;
  armpersent(event) {
    let count=0;
    if(event.target.value=="")
    { 
      count++;
      this.Armedamt1 = false;
    }
    if(count==0)
    {
      this.Armedamt1 = true;
    }
   
  }
  armamount(event) {
    let count=0
    if(event.target.value=="")
    {
      count++
      this.Armedper1 = false;
    }
    if(count==0)
    {
      this.Armedper1 = true;
    }
  }

  unArmedamt1: boolean = false;
  unArmedper1: boolean = false;
  unarmpersent(event) {
    let count=0;
    if(event.target.value=="")
    { 
      count++;
      this.unArmedamt1 = false;
    }
    if(count==0)
    {
      this.unArmedamt1 = true;
    }
   
  }
  unarmamount(event) {
    let count=0
    if(event.target.value=="")
    {
      count++
      this.unArmedper1 = false;
    }
    if(count==0)
    {
      this.unArmedper1 = true;
    }
  }

  // vendor dropdown

  currentpageven:any=1
  has_nextven:boolean=true
  has_previousven:boolean=true
  autocompleteVendornameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletevendor &&
        this.autocompleteTrigger &&
        this.matAutocompletevendor.panel
      ) {
        fromEvent(this.matAutocompletevendor.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletevendor.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletevendor.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletevendor.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletevendor.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextven === true) {
                this.sgservice.getvendordropdown(this.VendorContactInput.nativeElement.value, this.currentpageven + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empvendorlist = this.empvendorlist.concat(datas);
                    if (this.empvendorlist.length >= 0) {
                      this.has_nextven = datapagination.has_next;
                      this.has_previousven = datapagination.has_previous;
                      this.currentpageven = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // State dropdown
  currentpageste:any=1
  has_nextsta:boolean=true
  has_previoussta:boolean=true
  autocompleteStatenameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletestate &&
        this.autocompleteTrigger &&
        this.matAutocompletestate.panel
      ) {
        fromEvent(this.matAutocompletestate.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletestate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletestate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletestate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletestate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsta === true) {
                this.sgservice.getStatezonesearch(this.StateContactInput.nativeElement.value, this.currentpageste + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    for (let i = 0; i < datas.length; i++) {
                      const Date = datas[i].effectivefrom
                      let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                      datas[i].name = datas[i].name + " (" + fromdate + ")"
                    }
                    let datapagination = results["pagination"];
                    this.dropdownstate = this.dropdownstate.concat(datas);
                    if (this.dropdownstate.length >= 0) {
                      this.has_nextsta = datapagination.has_next;
                      this.has_previoussta = datapagination.has_previous;
                      this.currentpageste = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  keyPress(event){
    this.toastr.warning(event, 'Don\'t type ', { timeOut: 1000 });     
    return false
  }

  
}

class ctrlofztype{
  vendor_id:any
  state_id:any
  zone:any
  armedpercent:any
  armentamt:any
  unarmedpercent:any
  unarmentamt:any
  effectivefrom:any
  // effectiveto:any
}