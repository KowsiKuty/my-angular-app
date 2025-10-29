import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe, formatDate } from '@angular/common';
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
  selector: 'app-minwagesmaster',
  templateUrl: './minwagesmaster.component.html',
  styleUrls: ['./minwagesmaster.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
})
export class MinwagesmasterComponent implements OnInit {

  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild('producttype') matAutocompleteDept: MatAutocomplete;


  @ViewChild('zoneInput') zone_section;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  Minwagesform: FormGroup;
  state_id: FormControl
  count: FormControl
  statezonelist: any;
  isLoading: boolean = false;
  empstaelist: any;
  effectivefrom: FormControl
  zone: FormControl
  addButton = false;
  zoneNameList = [];
  totalArray = [];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router,
    private sgservice: SGService, private shareservice: SGShareService, private notification: NotificationService,
    private datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.Minwagesform = this.fb.group({
      // state_id: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      count: ['', Validators.required],
      effectivefrom: ['', Validators.required],
      zone: ['', Validators.required]
    })
    // this.getEditminwages()
  }
  idValue: any


  // createFormat() {
  //   let data = this.Minwagesform.controls;


  //   let obj = new ctrlofztype();


  //   obj.state_id=data['state_id'].value.id;
  //   obj.noofzones=data['noofzones'].value;
  //   obj.effectivefrom=data['effectivefrom'].value

  //   return obj
  // }
  productname() {
    let prokeyvalue: String = "";
    this.getcatven(prokeyvalue);
    this.Minwagesform.get('state_id').valueChanges
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

  MinwagesSubmitForm() {
    this.totalArray = [];
    // if (this.Minwagesform.value.state_id === "") {

    //   this.toastr.warning('', 'Please Enter the State', { timeOut: 1500 });
    //   return false
    // }
    if (this.Minwagesform.value.name === "") {

      this.toastr.warning('', 'Please Enter the Name', { timeOut: 1500 });
      return false
    }
    if (this.Minwagesform.value.code === "") {

      this.toastr.warning('', 'Please Enter the Code', { timeOut: 1500 });
      return false
    }
    if (this.Minwagesform.value.count === "") {

      this.toastr.warning('', 'Please Enter the No of Zone', { timeOut: 1500 });
      return false
    }
    if (this.Minwagesform.value.effectivefrom === "") {

      this.toastr.warning('', 'Please Enter the Effective From Date', { timeOut: 1500 });
      return false
    }
    if (this.Minwagesform.value.zone == "") {
      this.toastr.warning("Please Select the Zone")
      return false
    }

    const fromDate = this.Minwagesform.value;
    fromDate.effectivefrom = this.datePipe.transform(fromDate.effectivefrom, 'yyyy-MM-dd');
    // this.Minwagesform.value.state_id = this.Minwagesform.value.state_id.id


    let count = this.Minwagesform.value.count
    console.log("count", count)
    let arraySize = this.zoneNameList.length
    console.log("arraysize", arraySize)
    if (count != "0") {
      if (count < arraySize || count > arraySize) {
        this.notification.showError("Zone Count Not Match...")
        return false;
      }
    }

    for (let i = 0; i < this.zoneNameList.length; i++) {
      this.totalArray.push(this.zoneNameList[i].id)
    }

    console.log("array", this.totalArray)
    this.Minwagesform.value.zone = this.totalArray

    const cont = this.Minwagesform.value;
    cont.count = Number(cont.count)

    console.log("number of form", this.Minwagesform.value)

    if (this.idValue == undefined) {
      this.sgservice.stateZoneAddition(this.Minwagesform.value, '')
        .subscribe(result => {
          if (result.status === "success") {
            this.notification.showSuccess("Successfully Created!...")
            this.onSubmit.emit();
            // this.router.navigate(['SGmodule/sgmaster', 1], { skipLocationChange: true })
          }
          else {
            this.notification.showError(result.description)
          }
          this.idValue = result.id;
        })
    }
    // else {
    //   this.sgservice.minwagesFormCreation(this.createFormat(), this.idValue)
    //     .subscribe(result => {
    //       if(result.status === "success"){
    //         this.notification.showSuccess("Successfully Updated!...")
    //         this.router.navigate(['/sgmaster',1], { skipLocationChange: true })
    //       }
    //       else {
    //         this.notification.showError(result.description)
    //       } 
    //     })
    //   }

  }
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


// class ctrlofztype{
//   state:any
//   noofzones:any
//   state_id:any
//   effectivefrom:any
// }