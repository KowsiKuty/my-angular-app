import { Component, OnInit } from '@angular/core';
import { Ap1Service } from '../ap1.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
const d:any=new FormData();
@Component({
  selector: 'app-paymentfile',
  templateUrl: './paymentfile.component.html',
  styleUrls: ['./paymentfile.component.scss']
})
export class PaymentfileComponent implements OnInit {
  paymentfile:any= FormGroup;
  has_next = true;
  check:boolean=false;
  UPloadCSVFileData:any;
  isLoading = false;
  fil:any=[];
  has_previous = true;
  pageSizeApp = 10;
  bankselect:boolean=false;
  searchboolean=false;
  parAppList: any;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  dow:any;
  rowselect:boolean=false;
  data:any=[];
  bankbranch_id:any;
  branch:any=[];
  id:any;
  select_flag:any;
  select:boolean=false;
  pvlist:any=[];
  dear:any=[];
  constructor(private service:Ap1Service,private notification: NotificationService,private router:Router,private spinner:NgxSpinnerService,private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.paymentfile = this.formbuilder.group(
      {
         bank: [],
         pdte:[],
        pvno: [],
        });
        this.paymentget();
        this.acnoget();
  }
  paymentget()
  {
    this.spinner.show();
    this.service.paymentfile({},this.presentpage).subscribe(data=>{
      console.log('File=',data);
      this.data=data['data'];
      let datapagination = data["pagination"];
      this.spinner.hide();
      
     if (this.data.length > 0) {
       this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
     }
    }
    )
  }
  acnoget()
  {
    // this.select=true; not use
     this.service.acnodet('').subscribe(data => {
       this.branch = data['data']
       console.log(this.branch)
     })
  } 
   nextClick() {
    if (this.has_next === true) {
    this.presentpage=this.presentpage+1;
  this.paymentget();
    }
  }
previousClick() {
    if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.paymentget()
    }
  }
 
  search( )
  
  {
    if(this.bankselect==false)
    {
      this.notification.showWarning("Please Select branch");
    }
    else{
    this.select=true;
    // this.searchboolean=true;
    
    let fill:any={};
    if(this.paymentfile.get('bank').value !=null && this.paymentfile.get('bank').value !='' ){
      fill['bankdetails_id']=this.bankbranch_id;
    }
    if(this.paymentfile.get('pdte').value !=null && this.paymentfile.get('pdte').value !='' ){
      fill['paymentheader_date']=this.paymentfile.get('pdte').value;
    }
    if(this.paymentfile.get('pvno').value !=null && this.paymentfile.get('pvno').value !='' ){
      fill['pvno']=this.paymentfile.get('pvno').value;
    }
    console.log("filter",fill)

     this.spinner.show();
     this.service.paymentfile(fill,this.presentpage).subscribe(data=>{
       console.log('File=',data);
       this.data=data['data'];
       this.fil=data['data']
       let datapagination = data["pagination"];
       this.spinner.hide();
       
      if (this.data.length > 0) {
        this.has_next = datapagination.has_next;
         this.has_previous = datapagination.has_previous;
         this.presentpage = datapagination.index;
      }
     }
     )
  }
}
  cancel()
  {
    this.select=false;
    this.bankselect=false;
    this.rowselect=false
   this.paymentfile.reset();
   this.paymentget();
  }
  download()
  {
    if(this.select==false)
      {
        this.notification.showWarning("Please Select branch");
      }
      else if(this.check==false &&  this.rowselect==false)
      {
        this.notification.showWarning("Please Select Atleast one Row");
      }
    else{

      this.spinner.show();
   this.service.downaled(this.bankbranch_id,this.dear).subscribe(data => {
    let binaryData = [];
    this.spinner.hide();
    binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Bankdetail.xlsx"
        link.click();  
      console.log("this.data",this.data)
    })
    }
  }
  bank(opt)
  {
    console.log(opt.bankbranch_id);
    this.bankbranch_id=opt.bankbranch_id;
     this.bankselect=true;

  }
  checkbox(d,i,e)

  {
    //particular row
    this.check=!this.data[i].select_flag
    this.pvlist.push(d.pvno)
    this.dear={
      "pvno_list":this.pvlist
      };
      console.log("pvno",this.dear)
    this.data[i].select_flag=!this.data[i].select_flag
    if(e.target.checked==true){
      for(let i=0;i<this.data.length;i++){
        this.data[i].select_flag=true
      }
    }
    else{
      for(let i=0;i<this.data.length;i++){
        this.data[i].select_flag=false
      }
    }
    // this.select=!this.select;
    // d.select_flag=!d.select_flag
    // console.log("d",d.select_flag)
    // console.log(this.select)
  }
  checkselect(e,data){
    //entirecolumn
    this.rowselect=!this.rowselect
    console.log("fill",this.fil)
    if(this.rowselect==true)
    {
      for(let i=0;i<this.fil.length;i++){
      this.fil[i].select_flag=true
      this.pvlist.push(this.fil[i].pvno)
      }
      this.dear={
        "pvno_list":this.pvlist
        };
        console.log("pvno",this.dear);
    }
      else 
      {
        for(let i=0;i<this.fil.length;i++){
          this.fil[i].select_flag=false
        }
      }
   

    // if(e.target.checked==true){
    //   for(let i=0;i<this.data.length;i++){
    //     this.data[i].select_flag=true
    //   }
    // }
    // else{
    //   for(let i=0;i<this.data.length;i++){
    //     this.data[i].select_flag=false
    //   }
      
    // }  
  }
  fileToUpload: File = null;

  onFileSelectedBulkUpload(e) {
    let dataFilevalue = e.target.files[0]
    this.UPloadCSVFileData = dataFilevalue
    this.service.upload(this.UPloadCSVFileData).subscribe(
    
    )
  }
}