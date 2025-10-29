import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
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
}
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
  selector: 'app-vendor-retrieval-summary',
  templateUrl: './vendor-retrieval-summary.component.html',
  styleUrls: ['./vendor-retrieval-summary.component.scss', '../rmustyles.css'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,]
})


export class VendorRetrievalSummaryComponent implements OnInit {
  @ViewChild('modalclose') modalclose: ElementRef
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  summarylist = []
  summaryform: FormGroup
  retrievalmethod = [];
  retrievaltype = [];
  statuslist = []
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  imageSrc = null;
  delivery_person = '';
  contact_no: number = null;
  comments = '';
  file: File
  statusindex: number;
  statusupdatelist = [];
  oldstatus = null;
  retid: any;
  venstatus: any;
  payload: any;
  showdespatchmodal: boolean = false;
  venstatusid: any;
  oldindex: any;
  modaltitlelist = { 3: 'Despatched Details', 6: 'Return Pick-up Details' }
  modaltitle = '';
  confirmtitle = '';
  showconfirmmodal = false;

  //for fileselection
  inputfileslist: any = { data: [], role: 'maker' };
  showfilecomponent = false;
  fileData: any;
  //for fileselection

  constructor(private rmuservice: RmuApiServiceService, private fb: FormBuilder, public router: Router,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      product: null,
      department: '',
      retrieval_type: "1",
      retrieval_method: "1",
      status: 0,
      delivery_date: null,

    })
    this.rmuservice.getretmethod().subscribe(res => {
      this.retrievalmethod = res['data']
    })
    this.rmuservice.getrettype().subscribe(res => {
      this.retrievaltype = res['data']
    })
    this.rmuservice.getvendorretrievalstatus().subscribe(res => {
      this.statuslist = res['data']
      this.statuslist.forEach(element => {
        element.value = Number(element.value)
      });
      this.statusupdatelist = this.statuslist
    })
    this.getvrsummary()

  }

  gotoview(data) {
    var queryparams = {}
    queryparams['retrieval'] = data.id;
    queryparams['applevel'] = data.applevel;
    // if (data.applevel > 1){
    //   queryparams.actionid = data.approving_id;
    // }
    queryparams['status'] = data.retrieval_status.value;
    this.router.navigate(['rmu/retrievalform'], { queryParams: queryparams });
  }

  fileget(event) {
    const file = event.target.files[0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(file);

  }

  statuschange(status) {
    var array = [...this.statusupdatelist];
    array.forEach((element, index) => {
      if (element.value == status) {
        this.statusindex = index;
      }
    });
    array = array.splice(this.statusindex, 2);
    // console.log(array)
    return array;
  }
  applydata(data, evt) {

    this.showdespatchmodal = false;
    this.showconfirmmodal = false;
    this.payload = data;
    this.venstatus = data.vendor_status.value;
    this.statuslist.forEach(status => {
      // Object.keys(status).find((key,value) => {
      //   if (value === this.venstatus) {
      //     this.confirmtitle = status.name;
      //   }
      // })
      status.value == this.venstatus ? this.confirmtitle = status.name:'';

  
    })
    
    this.venstatusid = data.vendor_status?.id;
    this.retid = data.id;
    var payload = {
      data: {
        role: 1,
        retrieval_id: this.retid,
        vendor_status: this.venstatus,
        id: this.venstatusid
      }
    }
    if (this.venstatus > 4) {
      payload.data.role = 2
    }
    if (this.venstatus == 2 || this.venstatus == 6) {
      delete payload.data.id;
    }

    if (this.venstatus == 3 || this.venstatus == 6) {
      this.modaltitle = this.modaltitlelist[this.venstatus];
      this.showdespatchmodal = true;
    this.popupopen()
      return false;
    }

    else {
      this.showconfirmmodal = true;
      this.popupopen()
      this.payload = payload;
      // this.vendorstatusupdate(payload);
    }

  }
  submitdelivery() {
    var payload = {
      data: {
        role: 1,
        id: this.venstatusid,
        retrieval_id: this.retid,
        vendor_status: this.venstatus,
        delivery_person: this.delivery_person,
        contact_no: this.contact_no,
        comments: this.comments
      }
    };
    if (this.venstatus > 4) {
      payload.data.role = 2
    }
    if (this.venstatus == 6) {
      delete payload.data.id
    }
    // const request = new FormData()
    // request.append("data", JSON.stringify(payload));
    // request.append("file", this.file)
    this.vendorstatusupdate(payload);
  }

  vendorstatusupdate(data) {
    console.log(data);
    this.rmuservice.vendorstatusupdate(data).subscribe(
      res => {
        if (!res?.description) {
          this.modalclose.nativeElement.click();
          this.getvrsummary()
          this.close()
        }
        else {
          this.revertnewstatus();
        }
      }
    );
  }

  revertnewstatus() {
    this.summarylist[this.oldindex].vendor_status = this.oldstatus;
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getvrsummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getvrsummary()
  }
  getvrsummary() {
    this.rmuservice.getvrsummary('&role=5', this.pagination.index).subscribe(results => {
      if (!results) {
        return false
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
      // this.inputfileslist={role:'maker',data:[{name:'sss'},{name:'s'}]};
      this.showfilecomponent = true;
      this.close()
    })
  }

  getoldvalues(data, ind) {
    this.oldindex = ind;
    this.oldstatus = data.vendor_status;
    this.retid = data.id;
  }
  despatchedit(oldstatus) {
   
    if (oldstatus.value == 3 && this.oldstatus.value == 3 || oldstatus.value == 6 && this.oldstatus.value == 6) {
      this.showdespatchmodal = true;
      this.popupopen()
      this.rmuservice.getdespatchdetails(oldstatus.id).subscribe(res => {
        let response = res['data'][0]
        this.contact_no = response.contact_no;
        this.delivery_person = response.delivery_person;
        this.comments = response.comments
        this.venstatusid = oldstatus.id;
        // this.retid = oldstatus.id;
        this.venstatus = oldstatus.value
       
      })
    }
  }

  //for file-selection

  // <app-files - selection * ngIf="showfilecomponent"[getfiles] = "inputfileslist"(sendfiles) = "getfilesfromchild($event)" >
  // </app-files-selection>
  getfilesfromchild(files) {
    this.fileData = files;
    console.log(this.fileData)
  }

  getretrievalcovernote(id) {
    this.rmuservice.getretrievalpdf(id).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // this.filesrc = downloadUrl;
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${id}.pdf`;
      link.click();
    })
  }
  //for fileselction


  close(){
    this.closeretrivalpopup.nativeElement.click()
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("dispatchpopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
}

