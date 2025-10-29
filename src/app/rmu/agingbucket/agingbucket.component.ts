import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agingbucket',
  templateUrl: './agingbucket.component.html',
  styleUrls: ['./agingbucket.component.scss']
})
export class AgingbucketComponent implements OnInit {
  day1: any;

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  searchagingvar:any = "String";
  agingbucketbutton:any
  constructor(private fb: FormBuilder) { 
    this.agingbucketbutton = [
      {"name": "View Report" ,"tooltip":"View Report",function: this.viewreports.bind(this)},{icon: "add","tooltip":"Create Bucket",function: this.addrequest.bind(this), "name": "ADD"}
    ];
  }
  agesearch : FormGroup;
  bucketform : FormGroup;
  ShowSummaryform: boolean = true;
  ShowAddform: boolean = false;
  limitday2: number = null;
  limitday1: number = null;
  ngOnInit(): void {

    this.agesearch = this.fb.group({
      bucketName : ''
    })

    this.bucketform = this.fb.group({
      name : '',
      description :'',
      timeline: new FormArray([])
    })

    this.addtimeline();
  }

  addrequest()
  {
      this.ShowAddform = true;
      this.ShowSummaryform = false;
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

  createtimeline(day1 = null, day2 = null) {
    let group = this.fb.group({
      day1: day1,
      day2: day2
    });

    return group;
  }

  onCancelClick() {
    // this.onCancel.emit()
      this.ShowAddform = false;
      this.ShowSummaryform = true;

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
  submit() {
  }

  get timelineArray() {
    return this.bucketform.get('timeline') as FormArray;
  }

  viewreports(data)
  {
    
  }

  agingsearch:any = [{"type":"input","label":"Bucket Name","formvalue":"name"}]
  searchagingsupload(aging){
  }
}
