import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { DatePipe, formatDate, JsonPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';

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
@Component({
  selector: 'app-retrievalform',
  templateUrl: './retrievalform.component.html',
  styleUrls: ['./retrievalform.component.scss', '../rmustyles.css'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,]
})


export class RetrievalformComponent implements OnInit {
  // @viewClassName('matTooltipClass')tooltip:any
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('modalclose') modalclose: ElementRef;
  @ViewChild('actionclose') actionclose: ElementRef;
  @ViewChild('matcard') matcard: ElementRef
  @ViewChild('check') tooltipClass: ElementRef
  @ViewChild('docinput') docinput: MatAutocompleteTrigger;
  drafttype = 'retrieval'
  url = environment.apiURL
  isLoading = true;
  breakpoint = 4;
  docpage = 0;
  docpagenext = 10;
  docdelete = false;
  retrieval_no: any;
  retrievalform: FormGroup;
  searchform: FormGroup;
  maker: boolean = false;
  checker: boolean = false;
  isExpandeds: boolean = false;
  isExpandedscard:boolean = false
  vendor = false;
  action = '';
  titlelist = { maker: 'Retrieval Request', checker: 'Retrieval Details' }
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  title;
  retrievalreqlist = []
  approverlist = []
  branchlist = []
  allchecked = false;
  //commondropdown
  retmethodlist = []
  rettypelist = []
  productlist = []
  documentlist = [];
  barcodelist = [];
  retrievalcode: string;
  oldformvalue: string;
  addfalse: boolean;
  dept: string = '';
  currentaddress: any;
  data: any;
  deptcode = ''
  empbranch: any;
  actionreason: any;
  applevel: any;
  status = 0;
  actionid: Number;
  historylist: any = [];
  selectall: boolean;
  showDurations: boolean = true;
  retrievalfield:any
  retrievalvar:any = "String"
  constructor(private activatedroute: ActivatedRoute, private fb: FormBuilder, private scrollDispatcher: ScrollDispatcher,private SpinnerService: NgxSpinnerService,
    private rmuservice: RmuApiServiceService, private datepipe: DatePipe, private router: Router, private snackbar: MatSnackBar) { 
      this.retrievalfield = {   label: "",
        method: "get",
        url: this.url + "rmuserv/common_dropdown",
        params: "&code=retrieval_type",
        searchkey: "query",
        displaykey: "name",
       wholedata: true}
    
  
    }


  valuechanges() {

    setInterval(() => {
      this.setdraft();
    }, 5000);
    // this.searchform.get('doc_no').valueChanges.subscribe((val) => {
    //   this.getdocuments(val)
    // })

    // this.searchform.get('barcode').valueChanges.subscribe((val) => {
    //   this.getbarcodes(val)
    // })

    this.retrievalform.get('branch').valueChanges.subscribe((val) => {
      this.getbranch(val,);
    })
    this.retrievalform.get('approver_id').valueChanges.subscribe((val) => {
      this.getapprover(val, 1);
    })

  }

  setdraft() {
    var body: any;
    let data = this.retrievalform.value
    data.details.forEach(element => {
      delete element.showdelete;
    });
    data = JSON.stringify(data)
    if (this.retrieval_no == 'new' && this.oldformvalue != data) {

      body = { data: data, type: this.drafttype, sub_type: 1 }
      this.rmuservice.setdraft(body).subscribe(res => {
        this.oldformvalue = data;
      });

    }

  }

  getdraft() {
    this.rmuservice.getdraft(this.drafttype).subscribe(response => {
      let data = JSON.parse(response['data'])
      console.log('HITS', this.currentaddress)
      data ? this.pastedata(data) : this.retrievalform.patchValue({ address: this.currentaddress })
      this.isExpandedscard=true
    });
  }
  ngOnInit(): void {

    this.searchform = this.fb.group({
      department: null,
      // retr_type: "1",
      product_id: 1,
      from_date: null,
      to_date: null,
      doc_no: null,
      barcode: null,
      vendor: null,
      retr_method: "1",
    })
    this.retrievalform = this.fb.group({
      id: 'new',
      address: null,
      holding_duration: 1,
      retrieval_type: "1",
      retrieval_date: null,
      remarks: null,
      details: new FormArray([]),
      request_date: new Date(),
      approver_id: 1,
      branch: null,
      addresschange: false
    })
    this.breakpoint = (window.innerWidth > 1024) ? 4 : 2;
    this.activatedroute.queryParams.subscribe(params => {
      this.title = this.titlelist.maker
      this.retrieval_no = params.retrieval;
      this.applevel = params.applevel;
      this.status = params?.status;
      this.actionid = params?.actionid;

      if(this.retrieval_no !== "new" && this.status) {
this.isExpandeds = true
this.isExpandedscard = true
      }
      else {
        this.isExpandeds = false
        this.isExpandedscard = false
      }
      if (this.applevel == 1) {
        this.maker = true;
      }
      else if (this.applevel == 5) {
        this.vendor = true;
      }
      else {


        this.checker = true;
      }


    });

    if (!this.vendor) {
      this.rmuservice.getaddress().subscribe(res => {
        this.deptcode = res['code'];
        this.dept = `(${this.deptcode})${res['name']}`
        this.empbranch = { id: res['id'], name: res['name'], code: res['code'] }
        this.currentaddress = res['address'];


      })
    }



    this.getcommondropdowns()
    this.valuechanges()

  }



  getcommondropdowns() {
    this.rmuservice.getretmethod().subscribe(res => {
      this.retmethodlist = res['data'];
    })

    this.rmuservice.getproducts().subscribe(res => {

      this.productlist = res['data'];
      this.searchform.patchValue({ product_id: this.productlist[0].id })
    })

    this.rmuservice.getrettype().subscribe(res => {
      this.rettypelist = res['data'];
      //api for get
      if (this.retrieval_no == 'new') {
        this.retrievalcode = 'NEW'
        this.getdraft();
      }
      else {
        this.oldrequest()
        this.getrethistory()
      }
    })
  }

  onResize(evt) {
    this.breakpoint = (evt.target.innerWidth > 1024) ? 4 : 2;
  }

  createlist(data) {
    let form = this.retrievalform.value.details;
    this.addfalse = false;
    for (let item of form) {

      if (item.document_no == data.document_no) {
        this.addfalse = true;
      }
    }
    if (this.addfalse) {

    }
    else {
      let group = this.fb.group({
        id: data.id,
        document_no: data.document_no,
        // box_no: data.box_no,
        barcode: data.barcode,
        product: data.product,
        showdelete: false,
      })

      let array = this.retrievalform.get('details') as FormArray;
      array.push(group);
    }

  }



  newrequest() {
    this.searchform = this.fb.group({
      department: null,
      retr_type: "1",
      product: null,
      from_date: null,
      to_date: null,
      doc_no: null,
      barcode: null,
      vendor: null,
      retr_method: "1",
    })

    this.getdraft();

  }


  selectalldocs() {
    //this.selectall  is used for checkbox current selection value;
    //if we used this.allchecked it changes the boolean value of itself while click using mat-checkbox....
    if (this.allchecked) {
      for (var i = 0; i < this.retrievalreqlist.length; i++) {
        this.retrievalreqlist[i].select = false;
        this.allchecked = false;
        this.selectall = false;
        this.isExpandeds = false;
      }
    }
    else {
      for (var i = 0; i < this.retrievalreqlist.length; i++) {
        this.retrievalreqlist[i].select = true;
        this.allchecked = true;
        this.selectall = true;
        this.isExpandeds = true;
      }
    }
    this.adddocs({ dataall: true, document_no: 'All items' })
  }


  fromdatechange() {
    let form = this.searchform.value;
    if (form.from_date.getTime() > form.to_date?.getTime()) {
      this.searchform.patchValue({
        to_date: null,
      })
    }
  }

  searchdocs(page = 1) {
    let params: any = this.searchform.value;
    this.check(params.product_id)
    if (page) {
      params.page = page;
    }
    else {
      params.page = this.pagination.index;
    }

    params.from_date ? params.from_date = this.datepipe.transform(params.from_date, 'yyyy-MM-dd 00:00:00') : null
    params.to_date ? params.to_date = this.datepipe.transform(params.to_date, 'yyyy-MM-dd 00:00:00') : null


    for (let obj in params) {
      !params[obj] ? delete params[obj] : true;
    }
    delete params.retr_method;

    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    this.check(queryString)
    this.rmuservice.getdocs(queryString).subscribe(response => {
      if (!response) {
        return false;
      }
      this.selectall = false;
      this.allchecked = false;
      var responsedata = response['data'];
      let form = this.retrievalform.value.details;
      form.forEach(element1 => {
        responsedata.forEach(element2 => {
          if (element2.document_no == element1.document_no) {
            element2.select = true;
          }
        })
      })

      this.retrievalreqlist = responsedata;
      let check = responsedata.every((element, index, array) => {
        if (index == 0) {
          return element.select;
        }
        return element.select === array[index - 1].select;
      });

      if (check) {
        this.selectall = true;
        this.allchecked = true;
      }
      console.log(check)
      //pagination
      this.pagination = response['pagination'] ? response['pagination'] : this.pagination;
      //pagination

    })
  }

  getdocuments(val) {
    val = 'val=' + val;
    this.rmuservice.getdocuments(val).subscribe(response => {
      this.documentlist = response['data']
    })
  }
  getbarcodes(val) {
    val = 'val=' + val;
    this.rmuservice.getbarcodes(val).subscribe(response => {
      this.barcodelist = response['data']
    })
  }
  searchformreset() {
    this.searchform.reset();
    this.searchform.patchValue({
      retr_method: "1",
      product_id: this.productlist[0].id
    })
    this.searchdocs();
  }

  deletedocument(doc_no) {
    this.retrievalform.value.details.forEach((element, index) => {
      if (element.document_no == doc_no) {
        (<FormArray>this.retrievalform.get('details')).removeAt(index);
      }
    })


  }

  oldrequest() {
    this.rmuservice.getretrievaldata(this.retrieval_no).subscribe(res => {
      if (!res) {
        return false;
      }
      this.retrievalcode = res.retrieval_code;
      res.branch = res.approver_id.employee_branch
      this.pastedata(res)
    })
  }

  pastedata(data) {
    data.details.forEach(element => {
      this.createlist(element)
    });
    if (this.retrieval_no == 'new') {
      data.request_date = new Date();
      data.retrieval_date = new Date();
    }
    else {
      data.retrieval_type = data.retrieval_type.value;
    }
    this.retrievalform.patchValue({
      id: data.id,
      address: data.address,
      holding_duration: data.holding_duration,
      retrieval_type: data.retrieval_type,
      retrieval_date: new Date(data.retrieval_date),
      remarks: data.remarks,
      request_date: new Date(data.request_date),
      addresschange: data.addresschange,
      branch: data.branch,
      approver_id: data.approver_id
    });
    (this.applevel > 1 || this.status > 2) ? this.retrievalform.disable() : false;
    (this.applevel > 1 || this.status > 2) ? this.dept = `(${data.maker.branch.code}) ${data.maker.branch.name}` : false
    
  }



  check(data) {
    console.log(data)
  }
  checkselect(ind) {
    if (this.retrievalreqlist[ind].select) {
      return true;
    }
    else {
      return false;
    }

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchdocs(this.pagination.index);
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1

    }
    this.searchdocs(this.pagination.index);
  }

  addtocontain(element) {
    if (element.select) {
      element.id = 'new';
      this.createlist(element)
    }
    else {
      this.deletedocument(element.document_no);
    }
  }
  adddocs(data) {
    if (data?.dataall && this.allchecked) {
      this.snackbar.open(`All items Selected`, '', {
        duration: 2000
      })
    }
    else if (data.select) {
      this.snackbar.open(`${data.document_no} Selected`, '', {
        duration: 2000
      })
    }
    else {
      this.snackbar.open(`${data.document_no} Unselected`, '', {
        duration: 2000
      })
    }
    let array = this.retrievalreqlist
    let anySelected = false;
    array.forEach(element => {
      if (element.select) {
        element.id = 'new';
        this.createlist(element)
        anySelected = true;
      }
      else {
        for (let item of this.retrievalform.value.details) {
          if (item.document_no == element.document_no) {
            this.deletedocument(element.document_no);
          }
          else {
            continue
          }
        }
      }
    })
    this.isExpandeds = anySelected;
  }
  submitform() {
    let payload = JSON.parse(JSON.stringify(this.retrievalform.value));
    if (payload.id == 'new') {
      delete payload.id;
    }
    payload.details.forEach(element => {
      element.id == 'new' ? delete element.id : true;
      element.product = element.product.value;
      delete element.showdelete;
    })
    // The above one directly interacts with form contorols and arrays
    // for (let data in payload.docs){
    //   delete payload.docs[data].id;
    //   delete payload.docs[data].showdelete;
    // }
    // payload.retrieval_type = payload.retrieval_type.value;
    if(this.showDurations == false)
      {
        payload.holding_duration = "";
      }
    payload.retrieval_date = this.datepipe.transform(payload.retrieval_date, 'yyyy-MM-dd');
    payload.request_date = this.datepipe.transform(payload.request_date, 'yyyy-MM-dd')
    payload.approver_id = payload.approver_id.id;
    var request = { data: payload }
    this.rmuservice.submitretrieval(request).subscribe(res => {
      if (res.status == 'success') {
        this.ngOnDestroy('done')
        this.modalclose.nativeElement.click();
        this.backbtn()
      }
    });
  }

  backbtn() {
    if (this.applevel == 5) {
      this.router.navigate(['rmu/vendor-retrieval-summary'], {})
    }
    else {
      this.router.navigate(['rmu/rmu_summary'])
    }

  }



  addresschange(donull = true) {
    let val = this.retrievalform.value.addresschange;
    if (val && donull) {
      this.retrievalform.patchValue({ address: '' })
    }
    else {
      this.retrievalform.patchValue({ address: this.currentaddress })
    }
  }

  getbranch(val, page = 1) {
    this.isLoading = true;
    var params = `query=${val}&page=${page}`
    this.rmuservice.getbranch(params).subscribe(res => {
      this.isLoading = false;
      this.branchlist = res['data']
    })
  }

  getapprover(val, page = 1) {
    this.isLoading = true;
    var branchid = this.retrievalform.value.branch?.id
    if (!branchid) {
      branchid = 0;
    }
    var params = `branch=${branchid}&query=${val}&page=${page}`
    this.rmuservice.getapprover(params).subscribe(res => {
      this.isLoading = false;
      this.approverlist = res['data']
    })
  }
  autoshow(subject) {
    if (subject?.designation) {
      let value = `(${subject.code}) ${subject.name}    ${subject.designation}   ${subject.grade}`
      return subject ? value : undefined
    }
    else if (subject?.code) {
      return subject ? '(' + subject.code + ') ' + subject.name : undefined
    }
    else {
      return ''
    }
  }

  branchScroll() {
    console.log('hits')
  }

  appaction() {
    var payload = {}
    payload['id'] = this.actionid;
    payload['comments'] = this.actionreason
    if (this.action == 'Approval') {
      payload['status'] = 3
    }
    else if (this.action == 'Reject') {
      payload['status'] = 4
    }
    this.retaction({ data: payload });
  }

  retaction(data) {
    this.rmuservice.retaction(data).subscribe(res => {
      if (res.status == 'success') {
        this.actionclose.nativeElement.click();
        this.backbtn()
      }
    })
  }

  ngOnDestroy(val) {
    if (val == 'done') {
      if (this.retrieval_no == 'new') {
        this.rmuservice.deldraft(this.drafttype).subscribe();
      }
    }
    else {
      // if (this.retrieval_no == 'new') {
      //   this.setdraft();
      // }
    }
  }

  getrethistory() {
    this.rmuservice.getrethistory(this.retrieval_no).subscribe(res => {
      this.historylist = res["history"]
    })
  }

  selectedVal(data) {
    if (data.value == '1') {
      this.showDurations = true;
    }
    else {
      this.showDurations = false;
    }

      //api for get
      if (this.retrieval_no == 'new') {
        this.retrievalcode = 'NEW'
        this.getdraft();
      }
      else {
        this.oldrequest()
        this.getrethistory()
      }
  
  }
  close(){
    this.closeretrivalpopup.nativeElement.click()
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("historypopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
}

