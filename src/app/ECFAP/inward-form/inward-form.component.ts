import { Component, EventEmitter, OnInit, Output, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DataService } from 'src/app/inward/inward.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service'
import { ShareService } from '../share.service'
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { EcfapService } from '../ecfap.service';
export interface depttypelistss {
  id: any
  code: any
  name: any
}

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

export interface courierlistss {
  code: string
  name: string
  id: string
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}


@Component({
  selector: 'app-inward-form',
  templateUrl: './inward-form.component.html',
  styleUrls: ['./inward-form.component.css', './inward-form-style.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InwardFormComponent implements OnInit {
  inwardForm: FormGroup;
  courierList: Array<any>;
  channelList: Array<any>;
  currentDate: any = new Date();
  ddList: any
  defaultDate = new FormControl(new Date())
  courier: boolean;
  today = new Date();
  employeeBranchData: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading: boolean
  ChannelList: any
  CourierList: Array<courierlistss>;
  maxData = this.currentDate
  editFormsActive: boolean
  HeaderID: any
  editFormsActiveAfterDetailsFinished: boolean = false
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('Channel') matChannelAutocomplete: MatAutocomplete;
  @ViewChild('channelInput') channelInput: any;

  @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
  @ViewChild('CourierInput') CourierInput: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  inwardDetailList: any;
  documenttypeList: any;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  imageUrl = environment.apiURL
  showinwarddetail: boolean = false
  showsearch: boolean = false
  InvoiceHeaderForm: FormGroup
  @Output() linesChange = new EventEmitter<any>();
  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  tomorrow = new Date();
  showtaxforgst = false
  todayDate: Date;
  invoiceyesno = [{ 'value': 1, 'display': 'Yes' }, { 'value': 0, 'display': 'No' }];
  @ViewChild('closebuttons') closebuttons;
  disabledate = true;
  Branchlist: Array<branchListss>;
  @ViewChild('matraiserAutocomplete') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
  ecfmodelurl = environment.apiURL
  inwardUrl = environment.apiURL
  CourierDD: boolean = false;
  CourierInputvalue: boolean = false; 
  inward_forms: any
  Connection = [
    { id: "1", name: "Courier" },
    { id: "2", name: "HandDelivery" },
    { id: "3", name: "Post" }
  ];
  channe_lists: any;
  courierdropdown: any
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private datePipe: DatePipe,
    private router: Router, private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService, private shareService: ShareService,
    private toastr: ToastrService, private ecfapservice: EcfapService) { }
  ngOnChanges() {
    this.getCourier();

  }
  ngOnInit(): void {

    this.todayDate = new Date();
    this.todayDate.setHours(0, 0, 0, 0);

    this.inwardForm = this.fb.group({
      no: ['', Validators.required],
      channel: ['', Validators.required],
      courier: ['', Validators.required],
      // couriers: ['', Validators.required],
      awbno: ['', Validators.required],
      noofpockets: ['1', Validators.required,],
      inwardfrom: ['', Validators.required],
      remarks: [''],
      date: new Date()
    });

    this.inward_forms = {
      label: "Inward From",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "name",
      formcontrolname: 'inwardfrom',
      wholedata: true,
      required: true,
      id: "inward-form-0010",
      prefix: 'code',
      // suffix: 'limit',
      separator: "hyphen"
    }
    this.courierdropdown = {
      label: "Courier",
      method: "get",
      url: this.inwardUrl + "mstserv/courier_search",
      params: "",
      searchkey: "query",
      displaykey: "name",
      formcontrolname: 'courier',
      wholedata: true,
      required: true,
      id: "inward-form-0013",
    }
    this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],
      invoiceheader: new FormArray([
        // this.INVheader(),
      ]),
    })
    this.channe_lists = {
      label: "Channel",
      // fronentdata: true,
      // data: this.Connection,
      searchkey: "query",
      url: this.inwardUrl + "inwdserv/get_inward_channeldata",
      params: "",
      formcontrolname: 'channel',
      displaykey: "name",
      // wholedata: true,
      Outputkey: "id",
      valuekey: "id",
      id: "inward-form-0012"
    }
    // this.inwardForm.get('channel').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.dataService.getChannelFKdd(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.ChannelList = datas;

    //   }, (error) => {
    //     this.errorHandler.handleError(error);
    //     // this.SpinnerService.hide();
    //   })

    this.inwardForm.get('courier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



    this.employeeBranch();
    this.getEditInward();
    this.DocumenttypeDD();

  }

  
  // ddChannelChange(event) {
  //   console.log("channel-value----->", this.inwardForm.value.channel)
  //   let value = event
  //   if (value == undefined) { value = event.value}
  //   else { value = event }
  //   if (value == 1) {
  //     this.CourierInputvalue = false;
  //     this.CourierDD = true;
      // this.inwardForm.get('couriers').reset("");
    //   // this.inwardForm.get('courier').reset("");
    // } else {
    //   this.CourierDD = false
    //   this.CourierInputvalue = false
      // this.inwardForm.get('couriers').reset("");
      // this.inwardForm.get('courier').reset("");
  //     this.inwardForm.get('awbno').reset("");
  //     this.inwardForm.get('courier').reset("");
  //   }
  // }
  ddChannelChange(event: any) {
    console.log("channel-value----->", this.inwardForm.value.channel);
    let value = event;
    if (event && event.value !== undefined) {
      value = event.value;
    }

    if (value == 1) {
      this.CourierInputvalue = false;
      this.CourierDD = true;
      // Reset any specific form controls if needed
      // this.inwardForm.get('couriers').reset("");
      // this.inwardForm.get('courier').reset("");
    } else {
      this.CourierDD = false;
      this.CourierInputvalue = false;
      // Reset any specific form controls if needed
      this.inwardForm.get('awbno').reset("");
      this.inwardForm.get('courier').reset("");
    }
  }
  

  resetCourier() {
    this.inwardForm.get('courier').reset("");
  }
  resetAWB() {
    this.inwardForm.get('awbno').reset("");
  }

  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  getCourier() {
    this.dataService.getCourier()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.courierList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  channel_selected_data: any
  getChannel() {
    this.SpinnerService.show()
    this.dataService.getChannelFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.channelList = datas;
        this.SpinnerService.hide()
        if (this.editFormsActive == false) {
          let selectedData = this.channelList.find(x => x.id == 1)
          this.inwardForm.patchValue({
            channel: selectedData.id
          })
          this.SpinnerService.hide()
          this.channel_selected_data = selectedData.id
          this.ddChannelChange(this.channel_selected_data)
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  Inwarddata: any
  detailCompleted: boolean = false
  getEditInward() {
    let data: any = this.shareService.inwardData.value
    console.log("Inward Data -", data)
    this.detailCompleted = data.detail_complete
    this.getChannel();
    this.Inwarddata = data
    console.log("datacheck", data)
    let id = data.id
    let detailFinished = data.detail_complete
    console.log("detailFinished", detailFinished)
    if (detailFinished == undefined) {
      this.editFormsActiveAfterDetailsFinished = false
    } else {
      this.editFormsActiveAfterDetailsFinished = detailFinished
    }
    if (id == null || id == undefined || id == "") {
      this.editFormsActive = false
      return false
    }
    this.HeaderID = id
    this.editFormsActive = true
    let inwardfrom = data.inwardfrom
    console.log("brnchlst", this.Branchlist)

    console.log("inwfrm", inwardfrom)
    let channel = data.channel_id.id

    let awbno = data.awbno

    let noofpackets = data.noofpockets

    let courier = data.courier_id
    let date = data.date

    this.inwardForm.patchValue({
      no: '',
      channel: channel,
      courier: courier,
      // couriers: couriers,
      awbno: awbno,
      noofpockets: noofpackets,
      inwardfrom: inwardfrom,
      ref_date: date,
      remarks: data.remarks
    })
    let dataforCourier = {
      value: channel
    }
    this.inwardcreateList = data
    console.log("testinga", data)
    console.log("testing", this.inwardcreateList)
    this.getInwardDetailsView();
    this.ddChannelChange(dataforCourier)
  }






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  inwardcreateList: any
  courierInwardForm() {
    let data = this.inwardForm.value

    let dateValue = this.datePipe.transform(data.date, 'yyyy-MM-dd');
    this.inwardForm.value.date = dateValue
    this.inwardForm.value.inwardfrom = this.inwardForm?.value?.inwardfrom?.codename
    if (data.inwardfrom == "" || data.inwardfrom == null || data.inwardfrom == undefined) {
      this.notification.showWarning("Please fill Where the Inward from?")
      return false
    }
    if (data.noofpockets == "" || data.noofpockets == null || data.noofpockets == undefined) {
      this.notification.showWarning("Please fill No of Packets")
      return false
    }

    if (data.channel == 1) {
      if (data.courier == "" || data.courier == null || data.courier == undefined) {
        this.notification.showWarning("Please fill Courier")
        return false
      }
      if (data.awbno == "" || data.awbno == null || data.awbno == undefined) {
        this.notification.showWarning("Please fill AWB NO")
        return false
      }
    }
    else {
      data.courier == ""
      data.awbno == ""
    }

this.SpinnerService.show()
    this.ecfapservice.createInwardForm(data, this.HeaderID)
      .subscribe((results: any) => {
        this.SpinnerService.hide()
        if (results.code == "UNEXPECTED_ERROR", results.description == "Duplicate Courier Name") {
          this.notification.showWarning("Duplicate Courier Name")
          this.SpinnerService.hide()
          return false
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
          this.SpinnerService.hide()
          console.log("EmploBrancj", this.employeeBranchData)
          this.editFormsActiveAfterDetailsFinished = true
          this.inwardcreateList = results
          this.SpinnerService.show()
          this.ecfapservice.getInwardSummarySearch({ "inward_no": results.no }, 1)
            .subscribe((result) => {
              let datass = result['data'];
              this.shareService.inwardData.next(datass[0])
              this.SpinnerService.hide()
            })
          this.getInwardDetailsView();
          this.showinwarddetail = true
          // this.router.navigate(['inward/inwardSummary']);
          // this.onSubmit.emit();
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  employeeBranch() {
    this.dataService.employeeBranch()
      .subscribe((results: any) => {
        this.employeeBranchData = results.name;
        console.log("EmploBrancj", results)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  cancel() {
    // this.router.navigate(['inward/inwardSummary']);
    this.onCancel.emit()
    this.shareService.submodule_name.next('AP Inward')

  }

  getChannelFK() {
    // this.dataService.getChannelFKdd("", 1)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.ChannelList = datas;
    //     console.log("channel list", datas)
    //   }, (error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })
  }



  autocompleteCourierScroll() {
    setTimeout(() => {
      if (
        this.matChannelAutocomplete &&
        this.autocompleteTrigger &&
        this.matChannelAutocomplete.panel
      ) {
        fromEvent(this.matChannelAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matChannelAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matChannelAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matChannelAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matChannelAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  displayFnCourier(courier?: courierlistss): string | undefined {
    return courier ? courier.name : undefined;
  }

  getCourierFK() {
    this.dataService.getCourierFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;
        console.log("CourierList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }












  numberOnly(event): boolean {
    const input = event.target.value;
    if (input.length === 0 && event.which === 48) {
      event.preventDefault();
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  awbnoforheader: any
  noofpacket: any
  channelnameforheader: any

  dateforheader: any

  couriernameforheader: any


  doctypeidd: any;
  getInwardDetailsView(pageNumber = 1, pageSize = 10) {
    // let data: any = this.shareService.inwardDetailViews.value
    // console.log("data from inward detail view", data)
    // let id_data = data.id
    // this.employeeBranchData = data?.branch_id?.fullname
    // this.awbnoforheader = data?.awbno
    // this.noofpacket = data?.noofpockets
    // this.channelnameforheader = data?.channel_id?.name
    // this.dateforheader = data?.date
    // this.couriernameforheader = data?.courier_id?.name
    let data = this.inwardcreateList
    console.log("testdata", data)
    let id_data = data.id
    // this.employeeBranchData = data?.branch_id?.fullname
    this.awbnoforheader = data?.awbno
    this.noofpacket = data?.noofpockets
    this.channelnameforheader = data?.channel_id?.name
    this.dateforheader = data?.date
    this.couriernameforheader = data?.courier_id?.name
    // this.doctypeidd = this.documenttypeList.filter(x=>x.name == "Invoice")
    // console.log("doctypeidd", this.doctypeidd)
    this.dataService.getInwardDetailsView(id_data, pageNumber, pageSize)
      .subscribe((results: any) => {
        if (results) {
          let dataset = results["inwarddetails_detail"]
          this.inwardDetailList = dataset
          console.log("this. inwarddetail List data", this.inwardDetailList)


          // let datapagination = results["pagination"];


          // if (this.inwardDetailList.length > 0) {
          //   this.has_next = datapagination.has_next;
          //   this.has_previous = datapagination.has_previous;
          //   this.currentpage = datapagination.index;
          // }
          this.updateInternalDocCountData(dataset)
        }

      })
  }
  nextClick() {
    if (this.has_next === true) {
      this.getInwardDetailsView(this.currentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getInwardDetailsView(this.currentpage - 1, 10)
    }
  }

  updateInternalDocCountData(dataset) {
    this.showinwarddetail = true
    this.editFormsActiveAfterDetailsFinished = true
    let ListData = dataset
    console.log("List data for API Call", ListData)
    for (let i in ListData) {
      let headerID = ListData[i].inwardheader_id
      let packno = ListData[i].packetno
      console.log("data headerID", headerID)
      console.log("packno", packno)

      this.ecfapservice.detailsBasedOnPacket(headerID, packno)
        .subscribe((results) => {
          let dataInnerObjects = results["inwarddetails_detail"]
          console.log("dataInnerObjects loop", dataInnerObjects)
          for (let j in dataInnerObjects) {

            let pushingData = this.inwardDetailList[i].details.push(dataInnerObjects[j])
            // this.inwardDetailList[i].details[0].doctype_id = this.documenttypeList.filter(x=>x.name == "Invoice")
            console.log("details index data", this.inwardDetailList[i].details)

            console.log("i index data", i)
            console.log("data of push based on index", pushingData)
          }



        })




    }

  }




  AddBasedOnCount(index, data) {

    console.log("index of header", index)
    console.log("data of header", data)
    console.log("data.count of header", data.doccount)
    console.log("data.details", data.details)
    console.log("data.details.length", data.details.length)

    let doccountdata = data.doccount
    let detailsLengthdata = data.details.length
    let DifferenceInCountAndLength = doccountdata - detailsLengthdata
    let headerIDData = data.inwardheader_id
    let packnoData = data.packetno

    console.log(" DifferenceInCountAndLength ", DifferenceInCountAndLength)


    if (doccountdata <= detailsLengthdata) {
      this.notification.showWarning("If you want to reduce or change, Please use Delete ")
      return false
    }

    if (DifferenceInCountAndLength > 10) {
      let CountdataConform = confirm('Are you sure you want to add more than 10 counts')
      if (CountdataConform == false) {
        this.notification.showWarning("Interrupted by the User")
        data.doccount = ""
        return false
      }
    }


    this.dataService.AddBasedOnCount(headerIDData, packnoData, DifferenceInCountAndLength)
      .subscribe((results) => {
        console.log("result data based on count", results)
        let dataResult = results["inwarddetails_detail"]
        if (results) {
          let dataInnerObjects = dataResult
          for (let j in dataInnerObjects) {
            let pushingData = this.inwardDetailList[index].details.push(dataInnerObjects[j])
            console.log("i index data", index)
            console.log("data of push based on index", pushingData)
          }

        }
      })



  }

  currentpagedoctype: any = 1
  has_nextdoctype: boolean
  has_previousdoctype: boolean

  Documenttype(e) {
    console.log("event dataaa", e)
    let dataToSearchCheck = e.target.value
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }
        // ,(error) => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }


  DocumenttypeDD() {
    let dataToSearchCheck = ''
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }
      )
  }


  public displayFnDocType(doc?: depttypelistss): string | undefined {
    return doc ? doc.name : undefined;
  }

  getdoctype(datas, index, fulldata) {
    console.log(datas, index, fulldata)
    if (datas.name == "Invoice") {
      fulldata.docsubject = datas.name
      fulldata.ref_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      fulldata.pagecount = 1
      this.showsearch = true
    }
  }
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }
  ecfid: any
  ecftypeid: any
  ppxid: any
  paytoid: any
  ecftype: any
  raisername: any
  fulldataslist: any
  getheaderdetails(outerindex, innerindexx, dataToSubmit, fulldatas) {
    console.log("fulldatas", fulldatas)
    this.fulldataslist = fulldatas
    this.shareService.inwardDatalist.next(fulldatas)
    let trimmedText = fulldatas?.ref_no.trim();
    let headerkey = {
      "crno": trimmedText, "aptype": "", "apstatus": "", "minamt": "", "maxamt": ""
    }

    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()

    this.ecfapservice.ecfsummarySearch(headerkey, 1).subscribe(result => {
      console.log("searchresult", result)

      if (result['data'] != undefined) {
        let text = fulldatas?.ref_no
        console.log("refnooo", fulldatas?.ref_no)
        let potext = text.substring(0, 2);
        console.log("potext", potext)
        if (potext != "PO") {
          this.onSearch.emit()
          // this.router.navigate(['inward/ecfview'])
          this.shareService.ECFData.next(result)
          this.ecfid = result['data'][0].id
          this.ecftypeid = result['data'][0].aptype_id
          this.ppxid = result['data'][0].ppx_id?.id
          this.paytoid = result['data'][0]?.payto_id
          this.ecftype = result['data'][0].aptype


          if (result?.aptype_id == 2 || result?.aptype_id == 7 || result?.aptype_id == 14) {

            this.showsuppgst = true
            this.showsuppname = true
            this.showsuppstate = true
          }
          if (result?.aptype_id == 3) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 13) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'E') {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'S') {

            this.showsuppname = true
            this.showsuppgst = true
            this.showsuppstate = true


          }
          console.log("ecfid", this.ecfid)
          this.getheader()
        }
        else {
          this.shareService.ponumber.next(fulldatas?.ref_no)
          this.onView.emit()
          // this.router.navigate(['inward/poview'])
        }
      }
    })


  }
  isgst: any
  getheader() {
    this.ecfapservice.getecfheader(this.ecfid).subscribe(result => {
      console.log("invhdrres", result)
      this.raisername = result?.raisername
      let invoiceheaderres = result['invoice_header']
      this.isgst = invoiceheaderres[0]?.invoicegst
      // let gst = result?.invoice_header[0]?.invoicegst ? result?.invoice_header[0]?.invoicegst : "N"
      //  this.InvoiceHeaderForm.patchValue({
      //    invoicegst:gst
      //  })
      for (let a of result?.invoice_header) {


        if (a?.invoicegst == 'Y') {
          this.showtaxforgst = true
        } else {
          this.showtaxforgst = false
        }
      }

      this.getinvoicehdrrecords(result)


    })
  }

  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
  getinvoicehdrrecords(datas) {



    for (let invhdr of datas?.invoice_header) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let credit_refno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let apheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let place_of_supply: FormControl = new FormControl('');
      let bankdetails_id: FormControl = new FormControl('');
      let entry_flag: FormControl = new FormControl('');
      let barcode: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let manualsupp_name: FormControl = new FormControl('');
      let manual_gstno: FormControl = new FormControl('')
      let is_originalinvoice: FormControl = new FormControl('');
      let branch_name: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('')
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);

      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || this.ppxid == "S" || this.ecftypeid == 7 || this.ecftypeid == 14) {
        suppname.setValue(invhdr?.supplier_id?.name)
        supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
        suppstate.setValue(invhdr?.supplierstate_id?.name)
        supplier_id.setValue(invhdr?.supplier_id?.id)
        suppliergst.setValue(invhdr?.supplier_id?.gstno)
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
      }
      invoiceno.setValue(invhdr?.invoiceno)
      credit_refno.setValue(invhdr?.credit_refno)
      invoicedate.setValue(invhdr?.invoicedate)
      invoiceamount.setValue(invhdr?.invoiceamount)
      taxamount.setValue(invhdr?.taxamount)
      totalamount.setValue(invhdr?.totalamount)
      otheramount.setValue(invhdr?.otheramount)
      roundoffamt.setValue(invhdr?.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr?.dedupinvoiceno)
      apheader_id.setValue(invhdr?.ecfheader_id)
      raisorbranchgst.setValue(invhdr?.raisorbranchgst)
      invoicegst.setValue(invhdr?.invoicegst)
      place_of_supply.setValue(invhdr?.place_of_supply?.name)
      bankdetails_id.setValue(invhdr?.bankdetails_id)
      entry_flag.setValue(invhdr?.entry_flag)
      barcode.setValue("")
      creditbank_id.setValue(invhdr?.creditbank_id)
      manualsupp_name.setValue(invhdr?.manualsupp_name)
      manual_gstno.setValue(invhdr?.manual_gstno)
      is_originalinvoice.setValue(invhdr?.is_originalinvoice)
      remarks.setValue(invhdr?.remarks)
      branch_name.setValue(invhdr?.branch_name)
      console.log("manualgst", invhdr?.manual_gstno)
      filevalue.setValue([])
      file_key.setValue([])
      // this.inputGstValue = invhdr?.manual_gstno

      this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        credit_refno: credit_refno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        apheader_id: apheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        place_of_supply: place_of_supply,
        bankdetails_id: bankdetails_id,
        entry_flag: entry_flag,
        barcode: barcode,
        creditbank_id: creditbank_id,
        manualsupp_name: manualsupp_name,
        manual_gstno: manual_gstno,
        filevalue: filevalue,
        file_key: file_key,
        is_originalinvoice: is_originalinvoice,
        remarks: remarks,
        branch_name: branch_name,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)
      }))



      this.calchdrTotal(invoiceamount, taxamount, totalamount)

      // place_of_supply.valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //   }),
      //   switchMap(value => this.ecfservices.getbranchscroll(value, 1)
      //     .pipe(
      //       finalize(() => {
      //         this.isLoading = false
      //       }),
      //     )
      //   )
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results["data"];
      //   this.poslist = datas;
      //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      // })

      invoiceamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
    }


  }

  filefun(data) {
    let arr = new FormArray([])
    let dataForfILE = data.file_data
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name)
        arr.push(new FormGroup({
          file_id: file_id,
          file_name: file_name
        }))

      }
    }
    return arr;
  }
  toto: any
  calchdrTotal(invoiceamount, taxamount, totalamount: FormControl) {
    let ivAnount = Number(invoiceamount.value)
    let ivAtax = Number(taxamount.value)
    const Taxableamount = ivAnount
    const Taxamount = ivAtax
    let toto = Taxableamount + Taxamount
    this.toto = toto
    totalamount.setValue((this.toto), { emitEvent: false });
    this.datasums();
  }

  amt: any;
  sum: any;
  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => Number(x.totalamount));
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }

  onFileSelected(e, outerindex, inner, data, innerdata) {
    console.log("e in file", e)
    console.log("outerindex in file", outerindex)
    console.log("inner in file", inner)
    console.log("data in file", data)
    console.log("innerdata in file", innerdata)


    let datavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      innerdata.filearray.push(e.target.files[i])
    }


  }

  deleteInlineFile(outerdata, innerdata, indexouter, outerindex, fileindex) {
    console.log("outerdata", outerdata)
    console.log("innerdata", innerdata)
    console.log("indexouter", indexouter)
    console.log("outerindex", outerindex)
    console.log("fileindex", fileindex)
    let filedata = innerdata.filearray
    console.log("filedata for delete before", filedata)
    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)

  }




  deleteFileOnParticular(outerindex, innerindex, fulldata, innerdata) {

    console.log("outerindex in file", outerindex)
    console.log("inner in file", innerindex)
    console.log("fulldata in file", fulldata)
    console.log("innerdata in file", innerdata)
    innerdata.filearray = []

    console.log(" this. fileinput", this.fileInput.toArray())
    let filesValue = this.fileInput.toArray()
    let filesValueLength = filesValue.length

    for (let i = 0; i < filesValueLength; i++) {
      filesValue[i].nativeElement.value = ""
      console.log("filesValue[i].nativeElement.value", filesValue[i].nativeElement.value)


    }





  }

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false


  filepreview(files) {
    console.log("file data to view ", files)



    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }







  }

  showInnerimagepopup: boolean = false
  fileListHeader: any

  HeaderFiles(data) {
    console.log("For Header Files", data)
    let filesdataValue = data.file_data
    let detailId = data.id
    // this.SpinnerService.show()
    this.showInnerimagepopup = true
    this.dataService.fileListViewnward(detailId, 0)
      .subscribe(results => {
        // this.SpinnerService.hide()
        console.log("file results data get from API", results)
        this.fileListHeader = results["file_data"]
        // if (results) {
        //   this.showInnerimagepopup = true
        // }
      }
        // , (error) => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }
  dtlArray = []
  saveParticularIndexData(outerindex, innerindexx, dataToSubmit, dataOnParticularOuterIndex) {
    console.log("dataToSubmit ")
    let data = dataOnParticularOuterIndex
    console.log("submit dataaaaaaaa", data)

    if (data.doctype_id == null || data.doctype_id == "" || data.doctype_id == undefined) {
      this.notification.showWarning("Please Select Document Type")
      return false
    }
    if (typeof data.doctype_id == 'string') {
      this.notification.showWarning("Please Select Document Type from Dropdown")
      return false
    }
    // if (data.docsubject == null || data.docsubject == "" || data.docsubject == undefined) {
    //   this.notification.showWarning("Please fill Doc Subject")
    //   return false
    // }
    // if (data.pagecount == null || data.pagecount == "" || data.pagecount == undefined) {
    //   this.notification.showWarning("Please fill PageCount")
    //   return false
    // }
    // if (data.receivedfrom == null || data.receivedfrom == "" || data.receivedfrom == undefined) {
    //   this.notification.showWarning("Please fill Received From")
    //   return false
    // }
    if (data.ref_date == "None") {
      data.ref_date = ""
    }
    if (data.ref_date !== null || data.ref_date !== "" || data.ref_date !== undefined) {
      data.ref_date = this.datePipe.transform(data.ref_date, 'yyyy-MM-dd');
    }
    let dataset = {
      "id": data.id,
      "pagecount": data.pagecount,
      "packetno": data.packetno,
      "doccount": data.doccount,
      "receivedfrom": data.receivedfrom,
      "docsubject": data.docsubject,
      "doctype_id": data.doctype_id.id,
      "remarks": data.remarks,
      // "filekey": [data.file_name],
      "ref_no": this.awbnoforheader,
      "ref_date": data.ref_date,
      "assigndept": 1,
      "assignemployee": 1,
      "actiontype": 1,
      "tenor": 0,
      "docaction": 1,
      "assignremarks": data.remarks,
      "inwardheader_id": data.inwardheader_id,
    }
    this.dtlArray.push(dataset)
    let filedataCheck = data.filearray
    // if (filedataCheck.length <= 0) {
    //   this.notification.showWarning("Please Check Files is selected or not")
    //   return false
    // }
    // const formData: FormData = new FormData();
    // let datavalue = JSON.stringify(dataset)
    // formData.append('data', datavalue);
    // let filekeydata = data.file_name

    // let fileArray = data.filearray
    // for (let individual in fileArray) {
    //   formData.append(filekeydata, fileArray[individual])

    // }







    this.ecfapservice.inwardDetailsViewUploadmicro(this.dtlArray)
      .subscribe(res => {
        this.notification.showSuccess("Updated Successfully!..")
        console.log("return response ", res)
        data.docnumber = res.docnumber
        data.ref_date = res.ref_date
      })
  }
  inwardDetailsClone(outerindex, innerindex, dataTOClone, innerdata) {

    console.log("outerindex", outerindex)
    console.log("innerindex", innerindex)
    console.log("dataTOClone", dataTOClone)
    let headerIDData = dataTOClone.inwardheader_id
    let detailsId = innerdata.id

    this.dataService.inwardDetailsClone(headerIDData, detailsId)
      .subscribe(results => {
        this.notification.showSuccess("Clone Successfully!..")
        console.log("CLOneDatavlaue", results)
        // this.inwarddetails.get("inwarddetailsArray")["controls"][OuterIndex].get("count").setValue(res.doccount)
        // let dataList = res['inwarddetails_detail']

        if (results) {
          dataTOClone.doccount = results.doccount
          let dataInnerObjects = results['inwarddetails_detail']
          for (let j in dataInnerObjects) {
            let pushingData = this.inwardDetailList[outerindex].details.push(dataInnerObjects[j])
            console.log("i index data", outerindex)
            console.log("data of push based on index", pushingData)
          }

        }

      })

  }
  inw_det_saved = false
  // inw_det_saved = false
  // savewholedata() {
  //   this.inw_det_saved = true
  //   let savedata = []
  //   const data = this.inwardDetailList
  //   console.log("datas------------>", data)
  //   for (let i in data) {
  //     let dataset = {
  //       "id": data[i].id,
  //       "pagecount": data[i].details[0].pagecount,
  //       "packetno": data[i].packetno,
  //       "doccount": data[i].doccount,
  //       "receivedfrom": data[i].details[0].receivedfrom,
  //       "docsubject": data[i].details[0].docsubject,
  //       "doctype_id": data[i].details[0].doctype_id.id,
  //       "remarks": data[i].details[0].remarks,
  //       // "filekey": [data.file_name],
  //       "ref_no": this.awbnoforheader,
  //       "ref_date": this.datePipe.transform(data[i].details[0].ref_date, 'yyyy-MM-dd'),
  //       "assigndept": 1,
  //       "assignemployee": 1,
  //       "actiontype": 1,
  //       "tenor": 0,
  //       "docaction": 1,
  //       "assignremarks": data[i].details[0].remarks,
  //       "inwardheader_id": data[i].inwardheader_id,
  //     }
  //     savedata.push(dataset)
  //   }
  //   console.log("savedata", data)
  //   console.log("savedata1", savedata)
  //   this.ecfapservice.inwardDetailsViewUploadmicro(savedata)
  //     .subscribe(res => {
  //       this.notification.showSuccess("Updated Successfully!..")
  //       console.log("return response ", res)
  //       for (let i in this.inwardDetailList) {
  //         if (this.inwardDetailList[i].id == res['data'][i].id)
  //           this.inwardDetailList[i].details[0].docnumber = res['data'][i].docnumber
  //         this.inwardDetailList[i].details[0].doccount = res['data'][i].doccount
  //         // this.inwardDetailList[i].details[0].inwardheader.date = res['data'][i].inwardheader.date
  //       }
  //       console.log("id", this.inwardDetailList)
  //     })
  //   // this.gotoecf('', '', '', '')

  // }
  DeletewhileDocnumberNotgenerate(dataouter, outerindex, innerIndex, innerdet) {
    console.log("data to outer det", dataouter)
    console.log("data outer index", outerindex)
    console.log("data inner index", innerIndex)
    console.log("data inner det", innerdet)
    let ArrayLengthOuter = dataouter.details
    // if (ArrayLengthOuter.length == 1) {
    //   this.notification.showWarning("Single Detail Not Allowed")
    //   return false

    // }
    let headerID = innerdet.inwardheader_id
    let detailID = innerdet.id
    let packno = dataouter.packetno

    this.dataService.DeleteInwardDetails(headerID, detailID, packno)
      .subscribe((results) => {
        if (results.code === "INVALID_INWARDHEADER_ID") {
          this.notification.showWarning("Single line Delete Not Allowed")
          return false
        }
        if (results) {
          innerdet.statuskey = true     //#delete purpose
          dataouter.doccount = results.doccount
          dataouter.details.splice(innerIndex, 1)
          this.notification.showSuccess("Successfully Deleted")
        }
      })


  }

  showimageHeaderAPI: boolean
  showimagepdf: boolean
  jpgUrls: any
  tokenValues: any
  imageViews: boolean
  pdfViews: boolean
  pdfurl: any
  jpgUrlsAPI: any
  commentPopupHeaderFiles(dataforFile) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = dataforFile.file_id
    let file_name = dataforFile.filedata.file_name;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderAPI = true
      this.showimagepdf = false
      this.jpgUrlsAPI = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;
      console.log("urlHeader", this.jpgUrlsAPI)
    }
    if (stringValue[1] === "pdf") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.dataService.pdfPopup(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimagepdf = false
      this.showimageHeaderAPI = false
    }
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Taxvalue = 0
  headertaxableamount: any
  Taxamount(e, index) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      this.headertaxableamount = Number(data[i]?.invoiceamount)
    }
    if (e > this.headertaxableamount) {
      this.Taxvalue = 0
      this.toastr.warning("Tax Amount should not exceed taxable amount");
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('taxamount').setValue(0)
      return false
    }
  }

  getFileDetails(index, e) {
    let data = this.InvoiceHeaderForm.value.invoiceheader
    for (var i = 0; i < e.target.files.length; i++) {
      data[index]?.filevalue?.push(e?.target?.files[i])
      data[index]?.filedataas?.push(e?.target?.files[i])
    }

    if (e.target.files.length > 0) {
      if (data[index]?.file_key.length < 1) {
        data[index]?.file_key?.push("file" + index);
      }
    }


  }

  invhdrsave() {

    let data = this.fulldataslist
    console.log("submit dataaaaaaaa", data)

    if (data.doctype_id == null || data.doctype_id == "" || data.doctype_id == undefined) {
      this.notification.showWarning("Please Select Document Type")
      return false
    }
    if (typeof data.doctype_id == 'string') {
      this.notification.showWarning("Please Select Document Type from Dropdown")
      return false
    }
    if (data.docsubject == null || data.docsubject == "" || data.docsubject == undefined) {
      this.notification.showWarning("Please fill Doc Subject")
      return false
    }
    // if (data.pagecount == null || data.pagecount == "" || data.pagecount == undefined) {
    //   this.notification.showWarning("Please fill PageCount")
    //   return false
    // }
    // if (data.receivedfrom == null || data.receivedfrom == "" || data.receivedfrom == undefined) {
    //   this.notification.showWarning("Please fill Received From")
    //   return false
    // }
    if (data.ref_date == "None") {
      data.ref_date = ""
    }
    if (data.ref_date !== null || data.ref_date !== "" || data.ref_date !== undefined) {
      data.ref_date = this.datePipe.transform(data.ref_date, 'yyyy-MM-dd');
    }
    // data.ref_no
    let dataset = {
      "id": data.id,
      "pagecount": data.pagecount,
      "receivedfrom": data.receivedfrom,
      "docsubject": data.docsubject,
      "doctype_id": data.doctype_id.id,
      "remarks": data.remarks,
      // "filekey": [data.file_name],
      "ref_no": this.awbnoforheader,
      "ref_date": data.ref_date
    }
    let filedataCheck = data.filearray
    // if (filedataCheck.length <= 0) {
    //   this.notification.showWarning("Please Check Files is selected or not")
    //   return false
    // }
    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataset)
    formData.append('data', datavalue);
    let filekeydata = data.file_name

    let fileArray = data.filearray
    for (let individual in fileArray) {
      formData.append(filekeydata, fileArray[individual])

    }







    this.ecfapservice.inwardDetailsViewUploadmicro(formData)
      .subscribe(res => {
        this.notification.showSuccess("Updated Successfully!..")
        this.closebuttons.nativeElement.click()
        console.log("return response ", res)
        data.docnumber = res.docnumber
        data.ref_date = res.ref_date
      })
  }
  back() {
    this.closebuttons.nativeElement.click()
  }

  getSearchbranch(e) {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.inwardForm.get('inwardfrom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfapservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  branchdropdown(branchkeyvalue) {
    this.ecfapservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Branchlist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
  raiseBranchScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfapservice.getbranchscroll(this.raiserbrInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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

  gotoecf(outerindex, innerindexx, dataToSubmit, fulldatas) {
    if (this.detailCompleted === undefined || this.detailCompleted === null) {
        console.log("Entering if block");
        this.inw_det_saved = true;
        let savedata = [];
        const data = this.inwardDetailList;
        console.log("datas------------>", data);
        
        for (let i in data) {
            let dataset = {
                "id": data[i].id,
                "pagecount": data[i].details[0].pagecount,
                "packetno": data[i].packetno,
                "doccount": data[i].doccount,
                "receivedfrom": data[i].details[0].receivedfrom,
                "docsubject": data[i].details[0].docsubject,
                "doctype_id": data[i].details[0].doctype_id.id,
                "remarks": data[i].details[0].remarks,
                "ref_no": this.awbnoforheader,
                // "ref_date": this.datePipe.transform(data[i].details[0].ref_date, 'yyyy-MM-dd'),
                "ref_date": null,
                "assigndept": 1,
                "assignemployee": 1,
                "actiontype": 1,
                "tenor": 0,
                "docaction": 1,
                "assignremarks": data[i].details[0].remarks,
                "inwardheader_id": data[i].inwardheader_id,
            };
            savedata.push(dataset);
        }
        
        console.log("savedata", data);
        console.log("savedata1", savedata);
        this.SpinnerService.show()
        this.ecfapservice.inwardDetailsViewUploadmicro(savedata)
            .subscribe(res => {
                this.notification.showSuccess("Updated Successfully!..");
                console.log("return response ", res);
                this.SpinnerService.hide();
                for (let i in this.inwardDetailList) {
                    if (this.inwardDetailList[i].id === res['data'][i].id) {
                        this.inwardDetailList[i].details[0].docnumber = res['data'][i].docnumber;
                    }
                    this.inwardDetailList[i].details[0].doccount = res['data'][i].doccount;
                }
                
                this.fulldataslist = fulldatas;
                console.log("fulldata", this.fulldataslist);
                
                this.shareService.inwardDatalist.next(fulldatas);
                console.log("fulldatas--------------->", fulldatas);
                
                this.onSearch.emit();
                console.log("id", this.inwardDetailList);
            });
    } else {
        console.log("Entering else block");
        this.fulldataslist = fulldatas;
        console.log("fulldata", this.fulldataslist);
        
        this.shareService.inwardDatalist.next(fulldatas);
        console.log("fulldatas--------------->", fulldatas);
        
        this.onSearch.emit();
    }
}



  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
}










