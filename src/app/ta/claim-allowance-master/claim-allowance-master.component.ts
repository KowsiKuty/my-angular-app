import { Component, ElementRef, OnInit,HostListener } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { TaService } from '../ta.service';
import { fromEvent, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-claim-allowance-master',
  templateUrl: './claim-allowance-master.component.html',
  styleUrls: ['./claim-allowance-master.component.scss']
})
export class ClaimAllowanceMasterComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }

  claimform: FormGroup
  addclaimform: FormGroup
  tabledata: any
  searchtabledata: any
  has_next = true;
  has_previous = true;
  presentpage: any = 1
  searchpresentpage: any = 1
  employeeApproverControl = new FormControl();
  employeename: any
  filteredOptions: Observable<string[]>
  searchname: any
  has_next_search: boolean = true;
  has_previous_search: boolean = true;
  show: boolean = true
  inputdata: any;
  expenseid: any;
  updatetablerowdata: any
  updatingid: any
  pushdata: any = []
  updateexpenseid: any;
  data: any = [];
  has_nextid: boolean = true;
  has_presentid: number = 1;
  

  minimum:any;

  @ViewChild('call') public call: ElementRef;
  @ViewChild('expensecall') public expensecalls: ElementRef;
  @ViewChild('modalclose1') public closed1: ElementRef;
  @ViewChild('modalclose') public modalclose: ElementRef;
  @ViewChild('focus') public focused: ElementRef;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  viweclaimform: any = FormGroup;
  fileName = '';
  file: File = null;

  constructor(private date: DatePipe, private formbuilder: FormBuilder, private taservice: TaService, private notification: NotificationService,private SpinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.claimform = this.formbuilder.group({

      expensename: [''],
      employeegrade: [''],
      city: [''],
      file: ['']


    })

    this.addclaimform = this.formbuilder.group({
      addexpensename: [''],
      addemployeegrade: [''],
      addcity: [''],
      effectivefrom: [''],
      amount: [''],
      applicableto: ['']
    });
    this.viweclaimform = this.formbuilder.group({
      addexpensename: [''],
      addemployeegrade: [''],
      addcity: [''],
      effectivefrom: [''],
      amount: [''],
      applicableto: ['']
    })

    this.getdata(1)
    this.claimform.reset()
    this.getname()


  }

  getnameoption(value) {
    console.log(value.name)
    this.searchname = value.name
    console.log('aa', this.searchname)
  }
  search() {
    let name = this.claimform.value.expensename
    let grade = this.claimform.value.employeegrade
    let place = this.claimform.value.city

    if (this.claimform.value.expensename != null || this.claimform.value.employeegrade != null || this.claimform.value.city != null) {
      this.searchpresentpage = 1
      this.getbranchValue(name, grade, place, this.searchpresentpage)

      this.show = false

    }
    

  }

  getnameapi() {
    this.taservice.getexpenseTypeValue().subscribe(
      res => {
        this.employeename = res['data']
        this.totalcount = res['count']
      }
    )
  }

  getname() {

    this.getnameapi()
    // this.call.nativeElement.click()
    // this.expensecalls.nativeElement.click()


  }

  getbranchValue(data, grade, place, page) {
    this.SpinnerService.show()

    this.taservice.getexpensetypesearch(data, grade, place, page)
      .subscribe(result => {
        // console.log(result)
        this.searchtabledata = result['data']
        this.totalcount = result['count']
        this.SpinnerService.hide()
        let datapage = result['pagination']
        if (this.searchtabledata.length > 0) {
          this.has_next_search = datapage.has_next
          this.has_previous_search = datapage.has_previous
          this.searchpresentpage = datapage.index
          this.tabledata = []
        }

      })
      
  }
  totalcount:any;
  getdata(page = 1) {
    this.SpinnerService.show()
    this.taservice.getdataallowance(page).subscribe(
      result => {
        let datas = result['data']
        let datapagination = result['pagination']
        this.tabledata = datas
        this.totalcount=result['count'];
        console.log(this.tabledata)
        if (this.tabledata.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        this.searchtabledata = []
        this.SpinnerService.hide()

      }
    )
  }

  clear() {
    this.claimform.reset()
    
    this.claimform.reset()
    // this.getdata(1)
    this.getdata(1)
    this.show = true
    this.searchpresentpage = 1
  }

  submit() {
    console.log(this.claimform.value)
  }

  nextClick() {
    if (this.has_next === true) {
      this.getdata(this.presentpage + 1)
    }
  }


  previousClick() {
    if (this.has_previous === true) {
      this.getdata(this.presentpage - 1)
    }
  }

  firstClick() {
    if (this.has_previous === true) {
      this.getdata(1)
    }
  }
  searchnextClick() {
    let name = this.claimform.value.expensename
    let grade = this.claimform.value.employeegrade
    let place = this.claimform.value.city

    // if (this.has_next_search === true) {
    //   this.getbranchValue(name, grade, place, this.searchpresentpage + 1)
    // }
    if (this.has_next_search === true) {
      this.searchpresentpage = this.searchpresentpage + 1;
      this.getbranchValue(name, grade, place, this.searchpresentpage);
    }
  }
  searchpreviousClick() {
    let name = this.claimform.value.expensename
    let grade = this.claimform.value.employeegrade
    let place = this.claimform.value.city

    if (this.has_previous_search === true) {
      this.getbranchValue(name, grade, place, this.searchpresentpage - 1)
    }

  }
  searchfirstClick() {
    let name = this.claimform.value.expensename
    let grade = this.claimform.value.employeegrade
    let place = this.claimform.value.city

    // if (this.has_previous_search === true) {
    //   this.getbranchValue(name, grade, place, 1)
    // }
    if (this.has_previous_search === true && this.searchpresentpage > 1) {
      this.searchpresentpage = this.searchpresentpage - 1;
      this.getbranchValue(name, grade, place, this.searchpresentpage);
    }
  }

  updateallowance(val) {
    this.taservice.getallowanceupdate(val).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess("Success")



        } else {
          this.notification.showError(x.description)
        }
      }
    )
  }
  // datformate(value) {
  //   // var date = new Date("Sun May 11,2014");
  //   var dateString = new Date(value.getTime() - (value.getTimezoneOffset() * 60000))
  //     .toISOString()
  //     .split("T")[0];

  //   console.log(dateString);
  //   return dateString;
  // }

  getexpensename(c) {
    this.expenseid = c.id
    console.log('hkjhk', this.expenseid)
    this.updateexpenseid = c.id
    console.log(c)
  }

  print() {

    if (this.addclaimform.value.addexpensename  == '' || this.addclaimform.value.addexpensename == null) {
      console.log('show error in expensename')
      this.notification.showError('Please Enter Expense Name')
      throw new Error;
    }
    if (this.addclaimform.value.addemployeegrade  == '' || this.addclaimform.value.addemployeegrade == null) {
      console.log('show error in addemployeegrade')
      this.notification.showError('Please Enter Salary Grade')
      throw new Error;
    }
    if (this.addclaimform.value.addcity  == '' || this.addclaimform.value.addcity == null) {
      console.log('show error in addcity')
      this.notification.showError('Please Enter City')
      throw new Error;
    }
   
    if (this.addclaimform.value.amount  == '' || this.addclaimform.value.amount == null) {
      console.log('show error in amount')
      this.notification.showError('Please Enter Amount')
      throw new Error;
    }

    if (this.addclaimform.value.applicableto  == '' || this.addclaimform.value.applicableto == null) {
      console.log('show error in applicableto')
      this.notification.showError('Please Enter Applicable To')
      throw new Error;
    }
    if (this.addclaimform.value.effectivefrom  == '' || this.addclaimform.value.effectivefrom == null) {
      console.log('show error in effectivefrom')
      this.notification.showError('Please Enter Effective From')
      throw new Error;
    }

    console.log('valid', this.addclaimform.valid)
    let date = this.date.transform(this.addclaimform.value.effectivefrom, "yyyy-MM-dd")
    let createdata=[]
    let obj = {
      "expense_id": this.expenseid,
      "salarygrade": this.addclaimform.value.addemployeegrade,
      "city": this.addclaimform.value.addcity,
      "amount": this.addclaimform.value.amount,
      "applicableto": this.addclaimform.value.applicableto,
      "effectivefrom": date,
    }
    createdata.push(obj)
    console.log("obj", obj)
    console.log(date)
    this.modalclose.nativeElement.click()
    this.updateallowance(JSON.stringify(createdata))
    // this.dateformate(this.addclaimform.value.effectivefrom)
    createdata.splice(0,createdata.length)
  }

  getpassvalue(t, i) {
    
    // let day=new Date(Date.parse(t.effectivefrom))
    this.minimum=new Date(new Date(t.effectivefrom).setDate(new Date(t.effectivefrom).getDate()+1))
    console.log('iddd', t)
    console.log('day',this.minimum)
    this.updatetablerowdata = t.effectivefrom
    this.updatingid = t.id
    this.viweclaimform.patchValue(
      {
        'addexpensename': t.expense_name,
        "addemployeegrade": t.salarygrade,
        "addcity": t.city,
        "effectivefrom": this.minimum,
        "amount": t.elgibleamount,
        "applicableto": t.applicableto
      });
    this.updateexpenseid = t.expense_id
  }
  getexpenseidss(d) {
    this.focused.nativeElement.click()
    this.updateexpenseid = d.id
    console.log('id', this.updateexpenseid)


  }

  updatesummary() {


    // console.log(this.dates)
    this.data = []
    this.data.splice(0, this.data.length)

    console.log("data", this.data)
    let obj = {
      "salarygrade": this.viweclaimform.value.addemployeegrade,
      "city": this.viweclaimform.value.addcity,
      "amount": this.viweclaimform.value.amount,
      "applicableto": this.viweclaimform.value.applicableto,
      "status": this.updatetablerowdata.status,
      "entity": null,
      "expense_id": this.updateexpenseid,
      "effectivefrom": this.date.transform(this.viweclaimform.value.effectivefrom, "yyyy-MM-dd HH:mm:ss"),
      "id": this.updatingid

    }
    this.data.push(obj)
    console.log("obbbbbbj", this.data)
    this.closed1.nativeElement.click()

    this.updateallowancechange(JSON.stringify(this.data))
    this.search()

    if (this.tabledata != null) {
      for (let i = 0; i < this.searchtabledata.length; i++) {
        if (this.searchtabledata[i].id == this.updatingid) {
          this.searchtabledata[i].expense_name = this.viweclaimform.value.addexpensename
          this.searchtabledata[i].salarygrade = this.viweclaimform.value.addemployeegrade
          this.searchtabledata[i].city = this.viweclaimform.value.addcity
          this.searchtabledata[i].applicableto = this.viweclaimform.value.applicableto
          this.searchtabledata[i].effectivefrom = this.date.transform(this.viweclaimform.value.effectivefrom, "dd-MMM-yyyy")
          this.searchtabledata[i].elgibleamount = this.viweclaimform.value.amount
          console.log(this.searchtabledata[i])
        }

      }
      if (this.searchtabledata != null) {
        for (let i = 0; i < this.tabledata.length; i++) {
          if (this.tabledata[i].id == this.updatingid) {
            this.tabledata[i].expense_name = this.viweclaimform.value.addexpensename
            this.tabledata[i].salarygrade = this.viweclaimform.value.addemployeegrade
            this.tabledata[i].city = this.viweclaimform.value.addcity
            this.tabledata[i].applicableto = this.viweclaimform.value.applicableto
            this.tabledata[i].effectivefrom = this.date.transform(this.viweclaimform.value.effectivefrom, "dd-MMM-yyyy")
            this.tabledata[i].elgibleamount = this.viweclaimform.value.amount
          }
        }
      }
    }
    

    console.log('amang', obj)

  }
  updateallowancechange(val) {
    this.taservice.getallowancechange(val).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess("Success")



        } else {
          this.notification.showError(x.description)
        }
      }
    )
  }
  getrestall() {
    this.addclaimform.reset()
  }
getuploadfile(event: any) {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      this.notification.showError("Only Excel files are allowed.");
      this.file = null;
      this.claimform.get('file')?.setValue(null);
      return;
    }

    this.file = selectedFile;
    this.claimform.get('file')?.setValue(selectedFile);
    console.log("Valid Excel file selected:", selectedFile);
  }
}

showupdatefiled() {
  console.log(this.claimform.value.file);

  if (this.file) {
    this.fileName = this.file.name;

    const formData = new FormData();
    formData.append("file", this.file);

    this.taservice.ClaimAllowance(formData).subscribe((results) => {
      if (results.status === 'success') {
        this.notification.showSuccess("File Uploaded Successfully");
      } else {
        this.notification.showError(results.description);
      }
    });
  } else {
    this.notification.showError("Please select a valid Excel file before uploading.");
  }
}


  autocompleteid()
  {
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
              this.taservice.getUsageCodes(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
             
                let pagination = data['pagination'];
                this.employeename = this.employeename.concat(dts);
                this.employeename = this.employeename.concat(dts);
                if (this.employeename.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
                if (this.employeename.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
}

