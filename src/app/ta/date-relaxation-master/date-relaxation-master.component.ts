import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaService } from '../ta.service';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-date-relaxation-master',
  templateUrl: './date-relaxation-master.component.html',
  styleUrls: ['./date-relaxation-master.component.scss']
})
export class DateRelaxationMasterComponent implements OnInit {
  tadaterelaxForm: FormGroup
  getdaterelaxationList: any
  tourno: any
  empgid: any
  empbranchgid: any
  hide: boolean = true
  tournos: any
  branchlist: any
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = false;
  has_presentids: boolean = true;
  has_presenntids: any; 1
  branchid: any = 0;
  employeelist: any
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1;
  appedit: boolean = false;
  appeditno: boolean = true;
  isLoading = false;
  statusselected: any = 2;
  tour_id: any;
  request_no: any;
  base64textString: any = [];
  list: any = [];
  file_length: any = []
  filesrc: any;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  images: any = [];
  fileextension: any;
  file_ext: any;
  attachmentlist: any;
  imageUrl = environment.apiURL;
  fileData: File = null;
  pdfimgview: any;
  statusList: any = [{'name':'InActive', 'value': 0}, {'name':'Active', 'value': 1}, {'name': 'All', 'value': 2}];

  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('empinput') empinput: any;
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closefilepopup')closefilepopup;

  has_next = true;
  has_previous = true;
  parAppList: any;
  presentpage=1;
  pageNumber: any;
  pageSize=10;

  search_has_next =true;
  search_has_previous = true;
  currentpage=1;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  limit = 10;
  paginations = {
    has_next: false,
    has_previous: false,
    index: 1
  }


  searchtable_data:any;
  searchtourid:any

  tableshow:boolean=false


  constructor(private taservice: TaService, private notification: NotificationService, private formbuilder: FormBuilder,private SpinerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.tadaterelaxForm = this.formbuilder.group(
      {
        requestno: [''],
        empbranchgid: [''],
        approval: [''],
      }
    )
    this.getdaterelax(1);
    this.tadaterelaxForm.get('empbranchgid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        // this.branchlists = datas;
        console.log("Branch List", this.branchlist)
      });


    this.tadaterelaxForm.get('approval').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluechanges(this.branchid,value ? value : '',1))
      )
      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data'];
        console.log("Employee List", this.employeelist)
      });

    this.getbranch()
  }
  totalcount:any;
  getdaterelax(page) {

    this.SpinerService.show()
    this.taservice.getdaterelaxationdata(page)
      .subscribe((results: any[]) => {
        this.SpinerService.hide()
        this.getdaterelaxationList= results['data'];
        this.totalcount=results['count'];
        let datapagination = results['pagination'];
        if (this.getdaterelaxationList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })


  }

  nextClick() {
    if (this.has_next == true) {
      this.billSearch(this.currentpage+1)
    }
  }


  previousClick() {
    if (this.has_previous == true) {
      this.billSearch(this.currentpage-1)
    }
  }

  firstClick() {
    if (this.has_previous === true) {
      this.getdaterelax(1)
    }
  }


  activedata(data) {
    console.log(data)
    this.taservice.getactivedate(data.id, data.tour_id)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess("Inactivated Successfully")
          // this.getdaterelax(this.presentpage)

        }
        else {
          this.notification.showError(result.message)

        }
      })
      if(this.tableshow){
        for(let  i=0;i < this.searchtable_data.length;i++ ){
          if(this.searchtable_data[i].id  == data.id ){
            this.searchtable_data[i].status =0
          }
        }
      }
      else{
        for (let i = 0; i < this.getdaterelaxationList.length; i++) {
          if (this.getdaterelaxationList[i].id == data.id) {
            this.getdaterelaxationList[i].status = 0
          }
        }
      }
    

  }
  attachmentdtl(data){
    this.tour_id = data.tour_id
    this.request_no = data.request_no
    this.fetchattachment()
  }
  fetchattachment() {
    this.SpinerService.show()
    this.taservice.date_all_files(this.tour_id)
      .subscribe(result => {
        this.SpinerService.hide()
        this.attachmentlist = result['Date_relaxation_type']
      })
  }

  clearfile(evt) {
    this.base64textString = [];
    // this.list.items.remove(1);    
    this.list = evt.target.files;
    this.file_length = 0;
    (<HTMLInputElement>document.getElementById("uploadFile")).value = null;
  }

  fileview(ind) {
    this.filesrc = this.base64textString[ind]
    console.log(this.filesrc)
    let msg = this.filetype_check(ind);
    if (msg == 1) {
      this.pdfshow = false;
      this.imgshow = true;
    }
    else {
      this.pdfshow = true;
      this.imgshow = false
    }
  }

  filetype_check(i: string | number) {
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg
  }

  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i);
    console.log("filedata", this.list.files);
    this.totalcount = this.list.items.length;
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile")).value = null;
    }
    else {
      (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
    }
  }

  fileeditview(ind) {
    this.filesrc = null;
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      this.filesrc = this.imageUrl + 'taserv/download_documents/' + fileid + "?type=" + this.fileextension + "&token=" + token;
      if (msg == 1) {
        this.pdfshow = false;
        this.imgshow = true;
      }
      else {
        this.pdfshow = true;
        this.imgshow = false
      }
  }

  fileDelete(id, ind) {
    this.attachmentlist.splice(ind, 1)
    this.SpinerService.show()
    this.taservice.fileDelete(id)
      .subscribe((res) => {
        this.SpinerService.hide()
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }

  getimagedownload(ind) {
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    // console.log(this.filesrc)
    // let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.SpinerService.show()
    this.taservice.getfetchimages2(fileid, this.fileextension).subscribe(results => {
      this.SpinerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      this.filesrc = downloadUrl
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = value.file_name;
      link.click();
      console.log(this.filesrc)
    })
  }

  filetype_check2(i) {
    let stringValue = this.attachmentlist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg
  }
  
  onFileSelected(evt: any) {
    const file = evt.target.files;

    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
        console.log("FIELS", file)
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {
        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop()
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
        this.file_length = this.file_length + 1;
      }

    }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    console.log("this.images", this.images)
    this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }

  handleReaderLoaded(e) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);

    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);

    }
  }

  expfileupload(evt) {
    let data = {
      "tour_id": this.tour_id
    }
    evt.target.files = this.list.files;
    this.fileData = evt.target.files;
    console.log(data)
    this.SpinerService.show()
    this.taservice.date_relaxation_file_upload(data, this.fileData)
      .subscribe((results) => {
        this.SpinerService.hide()
        if (results.status == 'success') {
          this.notification.showSuccess("File Uploaded Successfully")
          this.closefilepopup.nativeElement.click()
        }
        else {
          this.notification.showError(results.description)
        }
      })
  }


  inactivedata(data) {
    this.taservice.getinactivedate(data.id, data.tour_id)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess("Activated Successfully")
          // this.getdaterelax(this.presentpage)


        } else {
          this.notification.showError(result.message)
        }
      })
      if(this.tableshow){
        for(let i=0;i < this.searchtable_data.length;i++ ){
          if(this.searchtable_data[i].id == data.id){
            this.searchtable_data[i].status =1
          }
        }
      }
      else{
        for (let i = 0; i < this.getdaterelaxationList.length; i++) {
          if (this.getdaterelaxationList[i].id == data.id) {
            this.getdaterelaxationList[i].status = 1
          }
        }
      }


    
  }


  billSearch(page) {

    this.tourno = this.tadaterelaxForm.value.requestno || ''
    this.empbranchgid = this.tadaterelaxForm.value.empbranchgid?.id || ''
    this.empgid = this.tadaterelaxForm.value.approval?.id || ''
    let data = {'tour_no': this.tourno, 'branch_id': this.empbranchgid, 'employee_id': this.empgid, 'page': page, 'status': this.statusselected}

    // this.taservice.getconsolidatereport(this.tourno)
    // .subscribe(result =>{
    //   this.getdaterelaxationList=result
    // })
    this.hide = false
    this.getbranchValue(data)

    // if (this.tourno != null) {
    //   this.getbranchValue(this.tourno)
    // }
    // else {
    //   this.getdaterelax(1);
    //   this.hide = true
    // }
  }


  reset() {
    this.tadaterelaxForm.reset('')
    this.statusselected = 2
    this.getdaterelax(1)
    this.tableshow=false
  }
  
  resetIndex() {
  this.pagination.index = 1;
  this.paginations.index = 1; // set the starting page number here
  // trigger the re-rendering of the pagination component here
}


  getbranchValue(data) {
    this.tableshow=true
    this.searchtourid=data
    this.searchtour(data,1)
  }

  searchtour(data,pageno) {
    this.SpinerService.show()
    this.taservice.getbranchValuedata(data, pageno)
      .subscribe(result => {
        // console.log(result)
        this.searchtable_data = result['data']
        let datas = result["data"];
        this.totalcount = result['count'];
        this.SpinerService.hide()
        let datapagination = result["pagination"];
       
        if (this.getdaterelaxationList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }

  searchnextpage(){
    if(this.search_has_next==true){
      this.searchtour(this.searchtourid,this.currentpage+1)
    }
    else
    {
      this.getdaterelax(1);
    }
  }

  searchpreviouspage(){
    if(this.search_has_previous==true){
      this.searchtour(this.searchtourid,this.currentpage-1)
    }
  }

  searchfirstpage(){
    if(this.search_has_previous==true){
      this.searchtour(this.searchtourid,1)
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== 8 && event.keyCode !== 13 && (event.keyCode < 48 || event.keyCode > 57)) {
      event.preventDefault();
    }
  }
  getbranch() {
    this.taservice.getbranchname().subscribe(
      x => {
        this.branchlist = x['data']
      }
    )

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
                this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                  let dts = data['data'];
                  console.log('h--=', data);
                  console.log("SS", dts)
                  console.log("GGGgst", this.branchlist)
                  let pagination = data['pagination'];
                  this.branchlist = this.branchlist.concat(dts);
                  this.has_presentid++;
  
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
    public displayFnbr(branch): string | undefined {
        return branch ? branch.code+'-'+branch.name : undefined;
      }
    
      getbranches(id) {
        this.branchid = id
        console.log("this.branchid", this.branchid)
        this.taservice.getemployeevaluechanges(this.branchid,"",1)
    
          .subscribe((results: any[]) => {
            let datas = results;
            this.employeelist = datas['data'];
            console.log("Employee List", this.employeelist);
            let datapagination = results["pagination"];
            if (this.employeelist.length > 0) {
              this.has_empnext = datapagination.has_next;
              this.has_empprevious = datapagination.has_previous;
              this.empcurrentpage = datapagination.index;
            }
          });
        // this.taservice.getbranchemployee(this.branchid)
        // .subscribe(result => {
        //   this.listBranch = result
        //   console.log("employee", this.listBranch)
        // })
        this.appeditno = false;
        this.appedit = true;
        // this.getemployeeValue()
      }

      displayFn(subject) {
        return subject ? '(' + subject.code + ') ' + subject.name : undefined
      }

      empScroll(){
        setTimeout(() => {
          if (
            this.empauto &&
            this.autocompleteTrigger &&
            this.empauto.panel
          ) {
            fromEvent(this.empauto.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.empauto.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.empauto.panel.nativeElement.scrollTop;
                const scrollHeight = this.empauto.panel.nativeElement.scrollHeight;
                const elementHeight = this.empauto.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_empnext === true) {
                    this.taservice.getemployeevaluechanges(this.branchid,this.empinput.nativeElement.value,this.empcurrentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.employeelist = this.employeelist.concat(datas);
                        if (this.employeelist.length > 0) {
                          this.has_empnext = datapagination.has_next;
                          this.has_empprevious = datapagination.has_previous;
                          this.empcurrentpage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }


  // nextClick(){

  //   this.getdaterelax()


  // }
}
