import { Component, OnInit,EventEmitter,Output,ViewChild,HostListener } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup, FormBuilder} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-gradeeligibility-master',
  templateUrl: './gradeeligibility-master.component.html',
  styleUrls: ['./gradeeligibility-master.component.scss']
})
export class GradeeligibilityMasterComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinerService.hide();
    }
  }
  getgradeeligibleList:any;
  gradeeligiblemodel:any;
  gradeeligibleform:FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  @ViewChild('closebuttons') closebuttons; 
  has_next=true;
  has_previous=true;
  currentpage=1;
  pagesize = 10;

  gradeeditform: FormGroup;
  SearchValues: any;
  holidaySearchForm: FormGroup;
  searchtable_data: any;
  gradeSearchForm : FormGroup;

  constructor(private taService:TaService,private router:Router,private SpinerService: NgxSpinnerService,
    private notification:NotificationService, private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.gradeeligiblemodel={
      grade:'',
      gradelevel:'',
      travelclass:'',
      travelmode:'',
      freight1000:'',
      freight1001:'',
      twowheller:'',
      hillyregion:'',
      tonnagefamily:'',
      maxtonnage:''

    }
    this.gradeeditform = this.formBuilder.group({
      grade:'',
      gradelevel:'',
      travelclass:'',
      travelmode:'',
      freight1000:'',
      freight1001:'',
      twowheller:'',
      hillyregion:'',
      tonnagefamily:'',
      maxtonnage:'',
      id:''

    })
    this.gradeSearchForm = this.formBuilder.group({
      
      SearchValues: null,
      

    })
    this.getgradeeligiblesummary(this.currentpage);
  }

  editgrade(data)
  {
    this.gradeeditform.patchValue({
      grade: data.grade,
      gradelevel: data.gradelevel,
      travelclass: data.travelclass,
      travelmode: data.travelmode,
      freight1000: data.freight1000,
      freight1001: data.freight1001,
      twowheller: data.twowheller,
      hillyregion: data.hillyregion,
      tonnagefamily: data.tonnagefamily,
      maxtonnage: data.maxtonnage,
      id: data.id

     })
  }

  updateform()
  {
    if(this.gradeeditform.value.grade == '' || this.gradeeditform.value.grade == null){
      console.log(this.gradeeditform.value.grade)
      console.log('show error in grade')
      this.notification.showError('Please Enter Grade')
      throw new Error;
    }
    if(this.gradeeditform.value.gradelevel == '' || this.gradeeditform.value.gradelevel == null){
      console.log(this.gradeeditform.value.gradelevel)
      console.log('show error in gradelevel')
      this.notification.showError('Please Enter Grade Level')
      throw new Error;
    }

    if(this.gradeeditform.value.travelclass === '' || this.gradeeditform.value.travelclass == null){
      console.log(this.gradeeditform.value.travelclass)
      console.log('show error in travelclass')
      this.notification.showError('Please Enter Travel Class')
      throw new Error;
    }

    if(this.gradeeditform.value.travelmode === '' || this.gradeeditform.value.travelmode == null){
      console.log(this.gradeeditform.value.travelmode)
      console.log('show error in travelmode')
      this.notification.showError('Please Enter Travel Mode')
      throw new Error;
    }

    if(this.gradeeditform.value.freight1000 === '' || this.gradeeditform.value.freight1000 == null){
      console.log(this.gradeeditform.value.freight1000)
      console.log('show error in freight1000')
      this.notification.showError('Please Enter Freight 1000')
      throw new Error;
    }
    if(this.gradeeditform.value.freight1001 === '' || this.gradeeditform.value.freight1001 == null){
      console.log(this.gradeeditform.value.freight1001)
      console.log('show error in freight1001')
      this.notification.showError('Please Enter Freight 1001')
      throw new Error;
    }
    if(this.gradeeditform.value.twowheller === '' || this.gradeeditform.value.twowheller == null){
      console.log(this.gradeeditform.value.twowheller)
      console.log('show error in twowheller')
      this.notification.showError('Please Enter Two Wheeler')
      throw new Error;
    }
    if(this.gradeeditform.value.hillyregion === '' || this.gradeeditform.value.hillyregion == null){
      console.log(this.gradeeditform.value.hillyregion)
      console.log('show error in hillyregion')
      this.notification.showError('Please Enter Hilly Region')
      throw new Error;
    }
    if(this.gradeeditform.value.hillyregion === '' || this.gradeeditform.value.hillyregion == null){
      console.log(this.gradeeditform.value.hillyregion)
      console.log('show error in hillyregion')
      this.notification.showError('Please Enter Hilly Region')
      throw new Error;
    }
    if(this.gradeeditform.value.maxtonnage === '' || this.gradeeditform.value.maxtonnage == null){
      console.log(this.gradeeditform.value.maxtonnage)
      console.log('show error in maxtonnage')
      this.notification.showError('Please Enter Max Tonnage')
      throw new Error;
    }
    if(this.gradeeditform.value.tonnagefamily === '' || this.gradeeditform.value.tonnagefamily == null){
      console.log(this.gradeeditform.value.tonnagefamily)
      console.log('show error in tonnagefamily')
      this.notification.showError('Please Enter Tonnage Family')
      throw new Error;
    }
    this.taService.gradeeit([this.gradeeditform.value]).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Updated Successfully')
        this.getgradeeligiblesummary(this.currentpage)
        this.closebuttons.nativeElement.click();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  
  
    }
  
  totalcount:any;
  getgradeeligiblesummary(page){
    this.SpinerService.show()
    this.taService.getGradeEligibleSummary(page)
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getgradeeligibleList = datas;
    this.totalcount=results['count'];
    let datapagination = results['pagination']
    if (this.getgradeeligibleList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
    this.SpinerService.hide()
     })
  }
  resetform(){
    this.gradeSearchForm.reset()
    this.getgradeeligiblesummary(this.currentpage)
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.getgradeeligiblesummary(this.currentpage-1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getgradeeligiblesummary(this.currentpage+1)
    }
  }
  


  deletegrade(id){
    this.taService.deletegradeeligible(id)
    .subscribe(result =>  {
     this.notification.showSuccess("Deleted Successfully")
     this.getgradeeligiblesummary(this.currentpage);
     return true

    })
  
  }
  submitForm(){
    if (this.gradeeligiblemodel.grade  == '' || this.gradeeligiblemodel.grade == null) {
      console.log('show error in grade')
      this.notification.showError('Please Enter Grade')
      throw new Error;
    }
    if (this.gradeeligiblemodel.gradelevel  == '' || this.gradeeligiblemodel.gradelevel == null) {
      console.log('show error in gradelevel')
      this.notification.showError('Please Enter Gradelevel')
      throw new Error;
    }

    if (this.gradeeligiblemodel.hillyregion  == '' || this.gradeeligiblemodel.hillyregion == null) {
      console.log('show error in hillyregion')
      this.notification.showError('Please Enter Hillyregion')
      throw new Error;
    }

    if (this.gradeeligiblemodel.maxtonnage  == '' || this.gradeeligiblemodel.maxtonnage == null) {
      console.log('show error in maxtonnage')
      this.notification.showError('Please Enter Maxtonnage')
      throw new Error;
    }

    if (this.gradeeligiblemodel.tonnagefamily  == '' || this.gradeeligiblemodel.tonnagefamily == null) {
      console.log('show error in tonnagefamily')
      this.notification.showError('Please Enter Tonnagefamily')
      throw new Error;
    }

    if (this.gradeeligiblemodel.travelclass  == '' || this.gradeeligiblemodel.travelclass == null) {
      console.log('show error in travelclass')
      this.notification.showError('Please Enter Travelclass')
      throw new Error;
    }

    if (this.gradeeligiblemodel.travelmode  == '' || this.gradeeligiblemodel.travelmode == null) {
      console.log('show error in travelmode')
      this.notification.showError('Please Enter Travelmode')
      throw new Error;
    }
    
    if (this.gradeeligiblemodel.twowheller  == '' || this.gradeeligiblemodel.twowheller == null) {
      console.log('show error in twowheller')
      this.notification.showError('Please Enter Two Wheeler')
      throw new Error;
    }
    
    if (this.gradeeligiblemodel.freight1000  == '' || this.gradeeligiblemodel.freight1000 == null) {
      console.log('show error in freight1000')
      this.notification.showError('Please Enter Freight1000')
      throw new Error;
    }
    
    if (this.gradeeligiblemodel.freight1001  == '' || this.gradeeligiblemodel.freight1001 == null) {
      console.log('show error in freight1001')
      this.notification.showError('Please Enter Freight1001')
      throw new Error;
    }





    this.taService.creategradeeligible([this.gradeeligiblemodel])
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR") {
        this.notification.showWarning(res.description)
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Successfully  Created")
      this.closebutton.nativeElement.click();
      this.getgradeeligiblesummary(this.currentpage);
      this.onSubmit.emit();
      return true
      }
    })
  }
  OnCancelclick(){
    this.onCancel.emit()
    this.router.navigateByUrl('ta/ta_master');
  }

  gradeSearch()
  {
    this.SearchValues = this.gradeSearchForm.value.SearchValues;
    if (this.SearchValues != null) {
      this.getSearchs(this.SearchValues)
    }
    else
    {
      this.getgradeeligiblesummary(this.currentpage)
    }
  }
  getSearchs(val)
  {
    this.searchNames(val, 1)
  }
  searchNames(data, pageNo) {
    console.log("Search Data")
    this.SpinerService.show()
        this.taService.getSearchgrade(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.totalcount = res['count'];
        this.getgradeeligibleList = datas;
        let datapagination = res['pagination']
    if (this.getgradeeligibleList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
        this.SpinerService.hide();
        })



  }

}
 


