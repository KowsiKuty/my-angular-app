import { Component, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NotificationService } from '../notification.service';
import { ProofingService } from '../proofing.service';
import { ShareService } from '../share.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aging-bucket',
  templateUrl: './aging-bucket.component.html',
  styleUrls: ['./aging-bucket.component.scss']
})

export class AgingBucketComponent implements OnInit {
  proofUrl = environment.apiURL
  @ViewChild('account') accountscroll: MatAutocomplete;
  @ViewChild("closeaddpopup") closeaddpopup;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  agingid = null;
  day1: number = 0;
  limitday2: number = null;
  limitday1: number = null;
  bucketform: FormGroup;
  showform = true;
  account_type:any =1
  showmap = false;
  page:any =1
  bgcolor = "powderblue";
  typelist:any =[{"name":"Excel Upload","id":1},{"name":"Data Fetch","id":2}]
  accountlist = [];
  bucketlist = [];
  selectedType = 1;
  historyLists =[];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  bucketid:any

  //timeline validation keys
  value_before: string = ''
  map: any;
  constructor(private shareservice: ShareService,private renderer: Renderer2,
    private notification: NotificationService, private proofingservice: ProofingService,
    private spinner: NgxSpinnerService
    , private fb: FormBuilder) {
    this.bucketform = this.fb.group({
      id: 0,
      name: null,
      description: null,
      timeline: new FormArray([])
    });
  }

  ngOnInit(): void {

    // this.data = this.data.map(element =>{
    //   return element['day1']+'-'+element.day2
    // }).toString()

    this.agingid = this.shareservice.agingEditValue.value;
    console.log(this.agingid)
    if (!this.agingid) {
      this.addtimeline()
    }
    else if (this.agingid == 'acc_matching') {
      this.showmap = true;
      // this.getaccountlist(this.page,this.account_type);
      this.getaccounmap(this.page,this.account_type);
      this.getbucketlist(this.page,this.account_type);
      this.showform = false;
    }
    else {
      this.editbucket(this.agingid);
    }
  }

  has_next
  has_previous;
  currentpage;

  checkvalue_before(value) {
    this.value_before = value;
    console.log('Value before', this.value_before)
  }

  validatevalue_before(evt, ind) {
    let value = evt.target.value;
    if (ind == 0) {
      console.log('Change needed');
    }
    else if (ind != 0) {
      let daylimit = this.bucketform.value.timeline[ind - 1].day2;
      console.log(daylimit)
    }
    else if (value < this.value_before && ind == 0) {
      console.log('Changes needed')
    }
  }
  bucketname = null;
  getbucketlist(page = 1,account_type) {
    let params = 'page=' + page
    this.account_type ? params +='&account_type=' + account_type:'';
    this.bucketname ? params += '&name=' + this.bucketname : '';
    this.spinner.show()
    this.proofingservice.getbucketslist(params).subscribe(results => {
      this.spinner.hide()
      if (page == 1) {
        this.bucketlist = []
      }
      this.bucketlist = this.bucketlist.concat(results['data'])
      let datapagination = results["pagination"];

      if (this.bucketlist.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }
  getbucketlistcancel(){
    this.bucketname='';
    this.getbucketlist(1,this.account_type);
  }
  acchas_next:boolean=false;
  acchas_previous:boolean=false;
  acccurrentpage:number=1;
  getaccountlist(page = 1,account_type) {
    account_type= this.account_type
    let params: any = page;
    this.spinner.show();
    this.account_type ? params +='&account_type=' + account_type:'';
    this.proofingservice.getAccountList("", "", page,account_type ).subscribe(results => {
      this.spinner.hide()
      this.accountlist = this.accountlist.concat(results['data'])
      let datapagination = results["pagination"];

      if (this.accountlist.length >= 0) {
        this.acchas_next = datapagination.has_next;
        this.acchas_previous = datapagination.has_previous;
        this.acccurrentpage = datapagination.index;
      }
    })
  }
  account_no=null
  getaccounmap(page = 1,account_type) {
    account_type= this.account_type
    
    let params: any = page;
    this.spinner.show();
    this.account_type ? params +='&account_type=' + account_type:'';
    this.account_no? params +='&account_number='+ this.account_no:'';
    this.proofingservice.getAccountMap("", "", params).subscribe(results => {
      this.spinner.hide()
      if(results.code!=undefined&&results.code!=null&&results){
        this.accountlist=[];
        this.notification.showError(results.code);
        this.notification.showError(results.description);
      }
      else{
      if(page==1){
         this.accountlist=[];
      }
      this.accountlist = this.accountlist.concat(results['data'])
      // this.accountlist = results['data'];
      let datapagination = results?.["pagination"];

      if (this.accountlist?.length >= 0) {
        this.acchas_next = datapagination?.has_next;
        this.acchas_previous = datapagination?.has_previous;
        this.acccurrentpage = datapagination?.index;
      }
    }
    },(error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showError(error.status + error.statusText);
      this.accountlist=[];
    })
  }
  getaccounmapcancel(){
    this.account_no='';
    this.getaccounmap(1,this.account_type);
  }
  createtimeline(day1 = null, day2 = null) {
    let group = this.fb.group({
      day1: day1,
      day2: day2
    });

    return group;
  }
  timelinelength: number
  addtimeline() {

    this.day1 = this.bucketform.value.timeline[-1]?.day2
    let formvalue = this.bucketform.get('timeline') as FormArray;
    formvalue.push(this.createtimeline())
    this.timelinelength = this.bucketform.value.timeline.length;
    console.log(this.timelinelength)
  };
  removetimeline(index) {

    var form = this.bucketform.get('timeline') as FormArray;
    form.removeAt(index);
    this.timelinelength = this.bucketform.value.timeline.length;
  }
  onCancelClick() {
    this.onCancel.emit()
  }
  open(data) {
    let value=data
    // this.accountscroll._getScrollTop.subscribe(() => {
    //   const panel = this.accountscroll.panel.nativeElement;
    //   panel.addEventListener('scroll', event => this.scrolled(event));
    // })
    this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
      // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
      let evet = this.accountscroll.panel.nativeElement
      this.tablescrolled(evet,value)
    });

  }
  tablescrolled(scrollelement, name) {
    // let value = scrollelement.target;
    // const offsetHeight = value.offsetHeight;
    // const scrollHeight = value.scrollHeight;
    // const scrollTop = value.scrollTop;//current scrolled distance
    // const upgradelimit = scrollHeight - offsetHeight - 10;
    if (scrollelement.target.offsetHeight + scrollelement.target.scrollTop >= scrollelement.target.scrollHeight) {
      // Load more records
     
    // }

    // if (scrollTop > upgradelimit) {
      console.log('bottom');
      if (name == 'account' && this.acchas_next) {
        // this.acccurrentpage+=1;
        // this.getaccountlist(this.acccurrentpage,this.account_type);
        this.getaccounmap(this.acccurrentpage + 1,this.account_type);
      }
      else if (name == 'bucket' && this.has_next) {
        this.getbucketlist(this.currentpage + 1,this.account_type);
      }

    }


  }

  selectaccount(index) {
    let validate = this.accountlist[index]?.selected;
    let apply: any = false;
    validate ? '' : apply = true;
    this.accountlist[index].selected = apply;
  }
  selectedbucket: any = {}
  selectbucket(index) {

    let validate = this.bucketlist[index]?.selected;
    let apply: any = false;
    validate ? '' : apply = true;
    this.bucketlist[index].selected = apply;

    this.bucketlist.forEach((element, ind) => {
      if (ind != index) {
        element.selected = false;
      }
    });
    this.selectedbucket = this.bucketlist[index];
  }

  submit() {

    let form: any = JSON.parse(JSON.stringify(this.bucketform.value))
    let timeline =
      form.timeline.map(element => {
        return element['day1'] + '-' + element.day2
      }).toString();
    form.timeline = timeline;
    form.id == 0 ? delete form.id : '';
    let payload = { data: [form] };
    this.spinner.show()
    this.proofingservice.createbucket(payload).subscribe(res => {
      this.spinner.hide()
      if (res.status == 'success') {
        this.notification.showSuccess('Aging Bucket Created Successfully');
        this.onSubmit.emit();
      }
      else {
        this.notification.showError(res.description);
      }
    }, error => {
      this.spinner.hide()
    })

  }

  editbucket(id) {
    this.bucketid = id
    this.spinner.show();
    this.proofingservice.getbucket(id).subscribe(res => {
      this.spinner.hide()
      let data = res.data[0];
      this.bucketform.patchValue({
        id: id,
        name: data.name,
        description: data.description
      })
      // this.bucketform.value.id = id;
      // this.bucketform.value.name = data.name;
      // this.bucketform.value.description = data.description;
      let timeline;
      // timeline = JSON.parse(data.timeline).key1
      timeline = data.timeline

      timeline = timeline.split(",").map(function (e) {
        return e.split("-").map(Number);
      })
      for (let value of timeline) {
        let formvalue = this.bucketform.get('timeline') as FormArray;
        formvalue.push(this.createtimeline(value[0], value[1]));
      }
      this.timelinelength = this.bucketform.value.timeline.length
    },
      (error) => {
        this.spinner.hide();
      })

  }



  day1changed(ind, evt) {
    let form = (this.bucketform.get('timeline') as FormArray);
    let formvalues = form.value[ind]
    let formvalues2 = form.value[ind - 1]

    if (ind > 0) {
      if (+formvalues2.day2 >= +formvalues.day1) {
        form.at(ind).patchValue({
          day1: null
        })
        this.notification.showError('Invalid Timelines...')
      }
    }
    if (+formvalues.day1 >= +formvalues.day2 && formvalues.day2 != null) {
      form.at(ind).patchValue({
        day2: null
      })
      this.notification.showError('Invalid Timelines...')
    }


  }

  day2changed(ind, evt) {
    let form = (this.bucketform.get('timeline') as FormArray);
    let formvalues = form.value[ind]
    if (+formvalues.day1 >= +formvalues.day2) {
      form.at(ind).patchValue({
        day2: null
      })
      this.notification.showError('Invalid Timelines...')
      // this.proofingservice.testsubscribe()
    }

    if (form.length - 1 > ind) {
      console.log('Remove elements ')
    }
  }
  currentindex: number;
  addtooltiptext: string = ''
  setdaylimit(ind) {
    this.currentindex = ind
    ind != 0 ? this.limitday2 = this.bucketform.value?.timeline[ind - 1].day2 : this.limitday2 = null;

    ind != 0 ? this.limitday1 = this.bucketform.value?.timeline[ind].day1 : this.limitday2 = null;
    !this.limitday2 ? this.addtooltiptext = 'Please Enter To Day' : this.addtooltiptext = 'Add another Timeline'
    console.log('limitday2', this.limitday2)
  }

  removeaccount(account,i) {
    var payload = {
      data: [{
        account_id: account?.account_id,
        mapping_id: 1,
        delete: 0,
        account_type:1
      }]
    };
    this.historyLists.splice(i,1);
    this.spinner.show();
    this.proofingservice.createbucket(payload).subscribe(response => {
      this.spinner.hide();
      if (response.status == 'success') {
        this.notification.showSuccess('Account Removed Successfully');
        this.accountlist = [];
        this.bucketlist = [];
        this.account_no='';
        this.bucketname='';
        this.getaccounmap(this.page,this.account_type);
        this.getbucketlist(this.page,this.account_type);
        // this.selectedList = [];
        // this.getautoknockoff();
      }
      else {
        this.notification.showError(response.description);
      }
      console.log(response)
    }, error => {
      this.spinner.hide()
    })
  }


  accounttobucketmapping() {
    let bucketid = this.selectedbucket.id;
    var payload: any = {}
    let filter = this.accountlist.filter(element => {
      return element.selected
    });
    filter = filter.map(element => {
      let data = {
        bucket_id: bucketid,
        account_id: element.id
      };
      return data;
    })
    payload = {
      data: [{
        mapping_data: filter,
        mapping_id: 1,
        account_type:this.account_type
      }]
    }
    this.spinner.show()
    this.proofingservice.createbucket(payload).subscribe(response => {
      this.spinner.hide();
      if (response.status == 'success') {
        this.notification.showSuccess('Account and Bucket Mapped Successfully');

  // if(this.accountlist.length>0){
  //   this.accountlist.forEach((n,i)=> {
  //     console.log(n);  
  //     if(this.acclist.length>0){
  //       this.acclist.forEach(m=> {
  //         if(n.id==m.id){
  //           console.log("id",n)
  //          this.accountlist=this.accountlist.splice(i,1)
  //          console.log("delete")
  //       }
       
  //       })
  //     }
  // })                                           
  // }
        this.accountlist = []
        this.bucketlist = []
        this.account_no='';
        this.bucketname='';
        this.getaccounmap(this.page,this.account_type);
        this.getbucketlist(this.page,this.account_type);
        // this.selectedList = [];
        // this.getautoknockoff();
      }
      else {
        this.notification.showError(response.description);
      }
      console.log(response)
    }, error => {
      this.spinner.hide()
    })
  }
  maptype(e){
    this.account_type=e.id
    // this.getaccountlist(this.page,this.account_type);
    this.getaccounmap(this.page,this.account_type);
    this.getbucketlist(this.page,this.account_type);
}
openAccounts(data)
{
  this.popupopen()
  console.log("Selected Data", data)
  this.historyLists = data;
  this.popupopen()
}

prevpages(){
  if(this.pagination.has_previous){
    this.pagination.index = this.pagination.index-1

  }


}

nextpages(){

  if(this.pagination.has_next){
    this.pagination.index = this.pagination.index+1

  }

 

}

SummaryagingbucketData:any = [{"columnname": "Name", "key": "name"},{"columnname": "Timelines", "key": "timeline"},{"columnname": "Mapped Accounts", "icon":"visibility",button: true,
style:{cursor:"pointer"},
function: true,
clickfunction: this.popupopen.bind(this)}]


SummaryApiagingbucketObjNew:any = {"method": "get", "url": this.proofUrl + "prfserv/bucket_summary",ScrollPagination:true,}
popupopen(){
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("myModal"),
    {
      backdrop: 'static',
      keyboard: false
    }
  );
  myModal.show();
}
closepopup(){
  this.closeaddpopup.nativeElement.click();
}
// '&account_type=' + account_type:'';
SummaryagingaccounttmapData:any = [{"columnname": "Number", "key": "account_number"}, {"columnname": "Name", "key": "name"},{"columnname": "Mapped buckets", "key": ""}]
SummaryApiagingaccountmapObjNew:any = {"method": "get", "url": this.proofUrl + "prfserv/accounts", params:'&account_type='+ this.account_type ,"data": this.account_type,"ScrollPagination":true}
}
interface aging {
  day1: number
  day2: number
}


