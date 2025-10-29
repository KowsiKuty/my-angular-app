import { Component, OnInit,Output,ElementRef, EventEmitter,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, } from '@angular/forms';
import {NotificationService} from '../../service/notification.service'
import {Router} from '@angular/router';
import {AtmaService} from '../atma.service';
import { MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { fromEvent} from 'rxjs';
import { ShareService } from '../share.service';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';
// export interface documentListss {
//   name: string;
//   id: number;
// }
@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {
  atmaUrl = environment.apiURL
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  DocumentEditForm:FormGroup
  // Documentlist:Array<documentListss>
  isLoading=false;
  has_next = true;
  has_previous = true;
  documentEditId=0;
  currentpage: number = 1;
  file:string;
  filesid:number;
  vendorId:number;
  FileId:number;
  Filename:string;
  filesnames:string;
  FileName:string;
  fileList=[];
  documentEditButton = false;
  documentedit:any = {"label": "DocGroup", "method": "get", "url": this.atmaUrl + "mstserv/documentgroup_search", params: "", "searchkey": "query", "displaykey": "name", wholedata: true, required: true,
     formcontrolname: 'docgroup_id'
   };
  documentedits:any;
  totalData:any;
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  images:string  []  =  [];
  
  // @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  // @ViewChild('docInput') docInput: any;
  // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 
  constructor(private formbuilder: FormBuilder,private notification: NotificationService,
  private router:Router,private toastr: ToastrService,private atmaService:AtmaService,
  private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
  private shareService:ShareService,public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    let data: any = this.shareService.vendorView.value;
    this.vendorId = data.id;
    
    this.DocumentEditForm = this.formbuilder.group({
     
      partner_id: [{'value':this.vendorId,disabled: true }],
      docgroup_id: [''], 
      period: new FormControl('0',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      remarks: [''],
      file_name:['',[Validators.required]],
      })
    
     this.getDocumentEditForm()

    // let parentkeyvalue: String="";
    // this.getParent(parentkeyvalue);
    // this.DocumentEditForm.get('docgroup_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //       console.log('inside tap')
          
    //   }),

    //   switchMap(value => this.atmaService.get_parentScroll(value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.Documentlist = datas;
    //   console.log("Documentlist", datas)
    // })
}
// docgroupname(){
//   let parentkeyvalue: String="";
//     this.getParent(parentkeyvalue);
//     this.DocumentEditForm.get('docgroup_id').valueChanges
//     .pipe(
//       debounceTime(100),
//       distinctUntilChanged(),
//       tap(() => {
//         this.isLoading = true;
//           console.log('inside tap')
          
//       }),

//       switchMap(value => this.atmaService.get_parentScroll(value,1)
//         .pipe(
//           finalize(() => {
//             this.isLoading = false
//           }),
//         )
//       )
//     )
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.Documentlist = datas;
//       console.log("Documentlist", datas)
//     })
// }

data(datas){
  let values=datas.id
  this.atmaService.downloadfile(values)
 }

fileDeletes(data,index:number){
  let value = data.id
  console.log("filedel", value)
  this.atmaService .deletefile(value)
  .subscribe(result =>  {
   this.notification.showSuccess("Deleted....")
   this.fileList.splice(index, 1);
  
  })

}



  getDocumentEditForm() {
    let data :any= this.shareService.documentEdit.value;
    console.log("da",data)
    for(var i=1;i<data.file_id.length;i++){
      this.FileId=data.file_id[i].id;
     }
    
    this.atmaService.getdocumentEdit(data,this.vendorId)
        .subscribe((result:any) => {
    this.documentEditId = result.id;
    let Partner_Id=result.partner_id;
    let doc=result.docgroup_id;
    let Period=result.period;
    let Remarks=result.remarks;
    this.fileList=result.file_id
    // this.documentedit = {"label": "DocGroup", "method": "get", "url": this.atmaUrl + "mstserv/documentgroup_search", params: "", "searchkey": "query", "displaykey": "name", wholedata: true, formcontrolname: 'docgroup_id',required: true }
    
    this.DocumentEditForm.patchValue({
      partner_id:Partner_Id,
      docgroup_id:doc,
      period: Period,
      remarks:Remarks,
      file_name:this.fileList
      })
  })
  }
  createFormat() {
    let data = this.DocumentEditForm.controls;
    let objdocument = new documents();
    // let documentEditId=data.id;
    objdocument.id=this.documentEditId;
    objdocument.partner_id = data['partner_id'].value;
    objdocument.docgroup_id = data.docgroup_id.value.id;
    objdocument.period = data['period'].value;
    // objdocument.remarks = data['remarks'].value;
    objdocument.file_name=data['file_name'].value;

    var str = data['remarks'].value
    var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
    objdocument.remarks = cleanStr_rmk
    
    return objdocument;
  }

  documentEditCreateForm() {
    this.SpinnerService.show();
    if (this.DocumentEditForm.value.docgroup_id.id==undefined||this.DocumentEditForm.value.docgroup_id.id<=0){
      this.toastr.error('Please Select DocumentGroup Name');
      this.SpinnerService.hide();
      return false;
    }
  
    
    if (this.DocumentEditForm.value.period ===""){
      this.toastr.error('Please Enter Period');
      this.SpinnerService.hide();
      return false;
    }
   
   
    this.atmaService.documentEditCreateForm(this.vendorId,this.createFormat(),this.images)
      .subscribe(result => {
        console.log("documentedit", result)
        if(result.id === undefined){
          this.notification.showError(result.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Updated Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        // if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        //   this.notification.showWarning("Duplicate Code & Name ...")
        //   this.documentEditButton = false;
        // } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        //   this.notification.showError("INVALID_DATA!...")
        //   this.documentEditButton = false;
        // } else {
        //   this.notification.showSuccess("Saved Successfully!...")
        //   this.onSubmit.emit();
         
         
        // }
        
        
        // return true
       
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  
  // public displayFnparent(parenttype?: documentListss): string | undefined {
  //   //  console.log('id',parenttype.id);
  //   //  console.log('name',parenttype.name);
  //   return parenttype ? parenttype.name : undefined;
  // }
  
  // get parenttype() {
  //   return this.DocumentEditForm.get('docgroup_id');
  // }
  
  // private getParent(parentkeyvalue) {
  //   this.atmaService.getParentDropDown(parentkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Documentlist = datas;
  //       console.log("prnt", datas)
        
  //     })

      
  // }
  
  // parentScroll() {
  //   setTimeout(() => {
  //   if (
  //   this.matdocAutocomplete &&
  //   this.matdocAutocomplete &&
  //   this.matdocAutocomplete.panel
  //   ) {
  //   fromEvent(this.matdocAutocomplete.panel.nativeElement, 'scroll')
  //   .pipe(
  //   map(x => this.matdocAutocomplete.panel.nativeElement.scrollTop),
  //   takeUntil(this.autocompleteTrigger.panelClosingActions)
  //   )
  //   .subscribe(x => {
  //   const scrollTop = this.matdocAutocomplete.panel.nativeElement.scrollTop;
  //   const scrollHeight = this.matdocAutocomplete.panel.nativeElement.scrollHeight;
  //   const elementHeight = this.matdocAutocomplete.panel.nativeElement.clientHeight;
  //   const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //   if (atBottom) {
  //   if (this.has_next === true) {
  //   this.atmaService.get_parentScroll(this.docInput.nativeElement.value, this.currentpage + 1)
  //   .subscribe((results: any[]) => {
  //   let datas = results["data"];
  //   let datapagination = results["pagination"];
  //   this.Documentlist = this.Documentlist.concat(datas);
  //   if (this.Documentlist.length >= 0) {
  //   this.has_next = datapagination.has_next;
  //   this.has_previous = datapagination.has_previous;
  //   this.currentpage = datapagination.index;
  //   }
  //   })
  //   }
  //   }
  //   });
  //   }
  //   });
  //   }

    
  onCancelClick() {
     this.onCancel.emit()
    }

  fileChange(event) {
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
  this.InputVar.nativeElement.value = '';
  imagesList.push(this.images);
  this.uploadList = [];
  imagesList.forEach((item) => {
    let s = item;
    s.forEach((it) => {
      let io = it.name;
      this.uploadList.push(io);
    });
  });
    }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 45 || charCode >46)  && (charCode < 48 || charCode > 57) ){ 
    return false;
    }
    return true;
  }

  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-/  ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

//   docedit(data){
// this.DocumentEditForm.patchValue({
//   docgroup_id: data
// })
//   }
}

  
  class documents {
    id:any;
    partner_id: number;
    docgroup_id: any;
    period: any;
    remarks: any;
    file_id:any;
    file_name:String;
    
  }

