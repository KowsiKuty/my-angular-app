import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';
import { ProofingService } from '../proofing.service';
import { ShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

export interface SupplierName {
  id: number;
  name: string;
}
@Component({
  selector: 'app-define-rule-engine',
  templateUrl: './define-rule-engine.component.html',
  styleUrls: ['./define-rule-engine.component.scss']
})
export class DefineRuleEngineComponent implements OnInit {
  proofUrl = environment.apiURL
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  rule_types = [
    { name: 'Self', id: 1, isSelected: true },
    { name: 'One to One', id: 2, isSelected: false },
    { name: 'One to Many', id: 3, isSelected: false }]

  // isForward=true;
  isLoading = false;
  isForward = true;
  isdelenabled: boolean = false;
  isnoofchars: boolean = false;
  includesandwith:boolean = false
  isOccurrenceRequired = false;
  iswithandincludeRequired = false
  ruleform: rules = {
    id: 0,
    rulename: null,
    description: null,
    delimiter: [],
    occurencess: 0,
    noofchars: 0,
    includesandwith: "",
    Field_type: 'reference_no'
  };

  syscolumns = [{ name: 'Reference Number', value: 'reference_no' }, { name: 'Description', value: 'description' }]
  Expand_container: boolean = false;
  KeyboardEvent: any;
  check: any;
  edit_value: any;
  newdelim: any;
  rulecreateForm:FormGroup
  ruleid:any
  constructor(private proofingservice: ProofingService, private shareService: ShareService,
    private notification: NotificationService, private spinner: NgxSpinnerService, private toastr: ToastrService,private fb: FormBuilder) { }

  ngOnInit(): void {
    let id = this.shareService.ruleEditValue.value;
    this.edit_value = this.shareService.ruleEditValues.value;
    console.log("Edit Value Is:", this.edit_value)
    id ? this.editrule(id) : '';
    this.rule_typeupdate("");
    // this.createtemplate()
    this.rulecreateForm = this.fb.group({
      template_dropdown: ['']
    })
  }
  
  template_drop:any= {
    label: "Template",
    searchkey: "query",
    displaykey: "template",
    url: this.proofUrl + "prfserv/template",
    formcontrolname: "template_dropdown",
    wholedata: true
  }
  rulesArray: string[] = [];
  submitrule() {
    this.specialkey = [];
  
    // if (this.specialkey === null) {
    //   this.notification.showWarning("Please Insert Single Special Character");
    //   return;
    // }
  
    let value: any = this.ruleform.delimiter;
    if (!value) {
      this.ruleform.delimiter = [];
    } 
    else if (value && value.length > 0) {
      this.rulesArray = Array.isArray(value) ? [...value] : [value];
      console.log("Array Values:", this.rulesArray);
      
    } 

    // if (!value) {
    //   this.ruleform.delimiter = [];
    // } else {
    //   this.rulesArray = value.split("");
    //   this.ruleform.delimiter = this.rulesArray;
    // }
    // else {
    //   this.notification.showWarning("Please Insert Single Special Character");
    //   return;
    // }
      
    this.ruleform.delimiter = this.rulesArray;
  

    if (this.ruleform.delimiter.length === 0 && this.edit_value === true) {
      this.ruleform.delimiter = this.newdelim;
    }
  
    let payload: any = { ...this.ruleform };
    let tempdropdown = this.rulecreateForm.get("template_dropdown")?.value?.template;
    payload["temp_name"] = tempdropdown;
    delete payload["template"];
    if (payload.id === 0) delete payload.id;
  

    this.isOccurrenceRequired = !!this.ruleform.delimiter;
    this.iswithandincludeRequired = !!this.ruleform.noofchars;
  
    if (this.ruleform.delimiter.length !== 0 && this.ruleform.occurencess == 0) {
      this.notification.showInfo("Please Enter Occurrence of Delimiter");
      return;
    }
  
    if (
      this.ruleform.occurencess !== null &&
      this.ruleform.occurencess < 0 &&
      this.ruleform.occurencess !== undefined
    ) {
      this.notification.showInfo("Please Enter a Delimiter");
      return;
    }
  
    if (this.ruleform.occurencess === 0 && this.ruleform.delimiter.length !== 0) {
      this.notification.showInfo("Please Enter Occurrence of Delimiter");
      return;
    }
  
    if (this.ruleform.delimiter && this.ruleform.occurencess && !this.ruleform.noofchars) {
      this.notification.showInfo("Please Enter No of Characters");
      return;
    }
  
    if (!this.ruleform.rulename || this.ruleform.rulename.trim() === "") {
      this.notification.showInfo("Please Enter Rule Name");
      return;
    }
  
    if (!this.ruleform.description || this.ruleform.description.trim() === "") {
      this.notification.showInfo("Please Enter Description");
      return;
    }
  
    this.spinner.show();
    this.proofingservice.submitrule(payload).subscribe(
      (res) => {
        if (res.status === "success") {
          this.notification.showSuccess(res.message);
          this.rulesArray = [];
          this.onSubmit.emit();
          this.spinner.hide();
        } else {
          this.notification.showError(res.description);
          this.rulesArray = [];
          this.spinner.hide();
        }
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
      }
    );
  }
  


  editrule(id) {
    this.ruleid=id
    this.proofingservice.getrule(id).subscribe(res => {
      console.log('RES', res);
      this.ruleform = res.data[0];
      this.rulecreateForm.patchValue({
        template_dropdown: res.data[0].template 
      });
      this.newdelim = this.ruleform.delimiter;
      let form = this.ruleform;
      this.Expand_container = !this.Expand_container;
      // Check if delimiter array is empty
      // if (this.newdelim && this.newdelim.length > 0) {
      //   if (form.rule_type == 1) {
      //     this.isdelenabled = false;
      //     this.isnoofchars = false;
      //   }
        // else if (form.rule_type == 4) {
        //   this.isdelenabled = false;
        //   this.isnoofchars = true;
        // }
      //   else if (form.rule_type == 3) {
      //     this.isdelenabled = true;
      //     this.isnoofchars = true;
      //   }
      //   else if (form.rule_type == 2) {
      //     this.isdelenabled = true;
      //     this.isnoofchars = false;
      //   }
      // } else {
        // Handle when delimiter is empty
        // if (form.rule_type == 1) {
        //   this.isdelenabled = false;
        //   this.isnoofchars = false;
        // }
        // else if (form.rule_type == 4) {
        //   this.isdelenabled = false;
        //   this.isnoofchars = true;
        // }
      //   else if (form.rule_type == 3) {
      //     this.isdelenabled = false;
      //     this.isnoofchars = true;
      //   }
      //   else if (form.rule_type == 2) {
      //     this.isdelenabled = false;
      //     this.isnoofchars = false;
      //   }
      // })
    });
  }
  
  rule_typeupdate(checked) {
    console.log("Checkbox is : ==>", checked)
    // if (!this.isdelenabled && !this.isnoofchars) {
    //   this.ruleform.rule_type = 1
    //   this.ruleform.delimiter = null
    //   this.ruleform.occurencess = null
    //   this.ruleform.noofchars = null
    // }
    // else if (!this.isdelenabled && this.isnoofchars) {
    //   this.ruleform.rule_type = 4
    //   this.ruleform.delimiter = null
    //   this.ruleform.occurencess = null
    // }
    // else if (this.isdelenabled && this.isnoofchars ) {
    //   this.ruleform.rule_type = 3
    // }
    // else {
    //   this.ruleform.noofchars = null
    //   this.ruleform.rule_type = 2
    // }
    // if (this.ruleform.includesandwith) {
    //   this.ruleform.rule_type = 3;
    // }
  }
  onCancelClick() {
    this.onCancel.emit()
  }

  Rules_add() {
    this.specialkey= [];

    if (this.specialkey === null) {
      this.notification.showWarning("Please Insert Single Special Character")
  }

    let value:any = this.ruleform.delimiter
    if (value.length > 0) {
      // for (let Values of value) {
        this.rulesArray.push(value);
        console.log("Array Values :", this.rulesArray)
      // }
      this.ruleform.delimiter = [];


    } else {
      this.notification.showWarning("Please Insert Single Special Character")

    }

  }
  // specialkey : []
  specialkey: string[] = [];
  specialCharactersPattern = /[!@#$%^&*(),.?":{}|<>\\/\[\]~_=+;'-\s]/;
  
  allowOnlySpecialCharacters(event: KeyboardEvent): boolean {
    const char = event.key;
    this.specialkey.push(char);
    // this.specialkey= [];

    if(!this.specialCharactersPattern.test(char) ) {
      event.preventDefault();
      this.notification.showWarning("Please Insert Special Character Only")
      // this.specialkey= [];

      return false;
    }

    // let value = this.ruleform.delimiter
    // if (this.specialkey.length != 0) {
    //   for (let Values of this.specialkey) {
    //     this.rulesArray.push(Values);
    //     console.log("Array Values :", this.rulesArray)
    //   }
      


    // } else {
    //   this.ruleform.delimiter = [];
    //   this.notification.showWarning("Please Insert Single Special Character")

    // }
    return true;
  }
  
  clearSpecialKey() {
    this.specialkey = [];
  }
  


  Expand() {
    this.Expand_container = !this.Expand_container;
    // this.Expand_container = true
    // let acc = document.getElementsByClassName("accordion");
    // let i=0;
    // for (i = 0; i < acc.length; i++) {
    //   acc[i].addEventListener("click", function () {
    //     this.classList.toggle("active");
    //     var panel = this.nextElementSibling;
    //     if (panel.style.maxHeight) {
    //       panel.style.maxHeight = null;
    //     } else {
    //       panel.style.maxHeight = panel.scrollHeight + "px";
    //     }
    //   });
    // }
  }
  

  // createtemplate(){
  //   this.proofingservice.getTemplateDD().subscribe(res => {
  //     this.spinner.hide();
    
  // this.template_data=res.data
  //   });
  // }
}








export class rules {
  id: number
  rulename = ""
  description = ""
  delimiter = []
  occurencess: number
  noofchars: number = 0
  Field_type = ''
  includesandwith = ""
}
