import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-activitydesignationmaster',
  templateUrl: './activitydesignationmaster.component.html',
  styleUrls: ['./activitydesignationmaster.component.scss']
})
export class ActivitydesignationmasterComponent implements OnInit {

  activitydesignform:FormGroup
  Activityid:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb:FormBuilder,private atmaservice:AtmaService,private notification:NotificationService,
   private router:Router,private shareservice:ShareService ) { }
  
  ngOnInit(): void {
    let data = this.shareservice.activitydesignationedit.value
    this.Activityid = data 

    // this.ActivityForm = this.fb.group({
    //   activities:new FormArray([
    //   //  this.getactivitydetails() 
    //   ])
    // })

    this.activitydesignform = this.fb.group({
      name : [''],
      id:['']
    })

    if(this.Activityid){
      this.atmaservice.getparticularactivitydesignation(this.Activityid)
      .subscribe(result=>{
        // this.getactdetails(result)
        this.activitydesignform.patchValue({
          name:result?.name,
        
          id:result?.id
        })
      })
    }
    // else{
    //   (<FormArray>this.ActivityForm.get('activities')).push( this.getactivitydetails())
    // }
  }

  getactdetails(datas){
    let id:FormControl = new FormControl('');
    let name:FormControl = new FormControl('');
    let description:FormControl = new FormControl('');
    const actFormArray = this.activitydesignform.get('activities') as FormArray
    id.setValue(datas?.id),
    name.setValue(datas?.name),
    description.setValue(datas?.description),

    actFormArray.push(new FormGroup({
      id:id,
      name:name,
      description:description
    }))
  }

  addSection(){
    const control = <FormArray>this.activitydesignform.get('activities');
    control.push(this.getactivitydetails())
  }

  removeSection(i){
    const control = <FormArray>this.activitydesignform.get('activities');
    control.removeAt(i);
  }

  getactivitydetails(){
   let group = new FormGroup({
    name:new FormControl(''),
    description:new FormControl('')
   })
   return group
  }

  activitysubmit(){
    let value = this.activitydesignform.value

    if(value.id == '' || value.id == undefined ){
      delete value.id
    }
    
      this.atmaservice.getactivitydesignationcreate(value)
      .subscribe(result => {
        if (result.id != undefined) {
          this.notification.showSuccess('Sucess');
          this.shareservice.activitydesignationedit.next('')

          this.onSubmit.emit()

        } else {
          this.notification.showError(result.description);
          return false
        }
      })
    
  }
  onactivityCancel(){
     this.onCancel.emit()
  }

}
