import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';


export interface productlistss{
  
  id:number;
  empcat:string;
  emptypedesc:string;
  empdesc:string;
}

@Component({
  selector: 'app-employeetypemaster',
  templateUrl: './employeetypemaster.component.html',
  styleUrls: ['./employeetypemaster.component.scss']
})
export class EmployeetypemasterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  Employeetypeform:FormGroup
  emptype:FormControl
  emptypedesc:FormControl
  empcat_id:FormControl
  empcatlist:any;
  isLoading=false

  constructor(private fb:FormBuilder,private toast:ToastrService,private router:Router,private toastr: ToastrService,private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.Employeetypeform= this.fb.group({
      emptype:['',Validators.required],
      emptypedesc:['',Validators.required],
      empcat_id:['',Validators.required]
    })
    
    this.getEditemployeecat()
  }

  idValue:any

  getEditemployeecat(){

    let data: any = this.shareservice.employementtype.value;
    this.idValue = data.id;
    console.log("valu",data)
    if (data === '') {
      this.Employeetypeform.patchValue({
        emptype: '',
        emptypedesc: '',
        empcat_id:''
      })
    } else {
      this.Employeetypeform.patchValue({
        emptype: data.emptype,
        emptypedesc: data.emptypedesc,
        empcat_id:data.empcat
      })
    }


  }

  createFormat() {
    let data = this.Employeetypeform.controls;

    
    let obj = new ctrlofztype();
    
    obj.emptype=data['emptype'].value;
    obj.emptypedesc=data['emptypedesc'].value;
    obj.empcat_id=data['empcat_id'].value.id;
    
    return obj;
  }

  productname(){
    let prokeyvalue: String = "";
      this.getcatid(prokeyvalue);
      this.Employeetypeform.get('empcat_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getemployeementcatdropsown(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.empcatlist = datas;
          console.log("product", datas)

        })

  }
  private getcatid(prokeyvalue)
  {
    this.sgservice.getemployeementcatdropsown(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empcatlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
    
    
    return producttype ? producttype.empdesc : undefined;
    
  }

  get producttype() {
    return  this.Employeetypeform.get('empcat_id');
  }


  EmployeetypeSubmitForm()
  {
    if(this.Employeetypeform.value.emptype==="")
    {
      
      this.toastr.warning('Employment type', 'Please Enter the Type', { timeOut: 1500 });
      return false
    }
    if(this.Employeetypeform.value.emptypedesc==="")
    {
      
      this.toastr.warning('Employment type', 'Please Enter the  Descriptions', { timeOut: 1500 });
      return false
    }
    if(this.Employeetypeform.value.empcat_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Employment category', { timeOut: 1500 });
      return false
    }
    if (this.idValue == undefined) {
      this.sgservice.employeetypeCreation(this.createFormat(), '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Success")
            
          }
          this.idValue = result.id;
        })
    } else {
      this.sgservice.employeetypeCreation(this.createFormat(), this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Success...")
            
          }
        })
      }
          
    // this.router.navigate(['/sgmaster',1], { skipLocationChange: true })
    }

  onCancelClick(){
    
    this.router.navigate(['SGmodule/sgmaster',1], { skipLocationChange: true })
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
      this.toast.warning('', 'Please Enter the Number only', { timeOut: 1500 });
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
      this.toast.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
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
      this.toast.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
      return false;
      
    }
  }
}
class ctrlofztype {
  
  emptype: any;
  emptypedesc: any;

  empcat_id:any
}