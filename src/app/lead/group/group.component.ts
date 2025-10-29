import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NotificationService } from 'src/app/service/notification.service';
import { VowService } from 'src/app/service/vow.service';
import { UserDetailsService } from '../../user-details/user-details.service';
import { LeadserviceService } from '../leadservice.service';

export interface group {
  id: any;
  name: any;
}

export interface supplier {
  name: any;
  id: any;
}

export interface employee {
  full_name: any;
  id: any;
  name: any;
}

export interface rulevalue {
  name: any;
  id: any;
}

export interface product {
  id: any;
  name: any;
}

export interface vendorbasedgroup {
  id: any;
  vendorgroup_id: {
    name: any;
  }
}



@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('employeeinput') employeeinput
  groupform: FormGroup;
  groupmappingform: FormGroup
  ruleform: FormGroup
  vendorid: any;
  vendorname: any;

  currenttab = '';
  supplierdata = [];

  groupcreate = false;
  groupsummary = false;
  groupmapcreate = false;
  groupsummaryform = false;

  groupsummarydata = []
  groupmapsummarydata = []

  group_hasnext = true;
  group_hasprevious = true;
  group_currentpage = 1;

  groupmap_hasnext = true;
  groupmap_hasprevious = true;
  groupmap_currentpage = 1;
  employeedata: any;

  groupdata = []

  selectedemployees = []
  selectedemployeesid = []
  rulecreate: boolean;
  rulesummary: boolean;

  rulesummarydata = [];
  rule_hasnext = true;
  rule_hasprevious = true;
  rule_currentpage = 1;
  ruledata: any;
  productdata: any;
  groupid: any;
  rulevaluedata: any;

  groupdatapagination = {
    has_next: true,
    has_previous: true,
    currentpage: 1
  }
  vendorgroupdata = []
  vendorbasedgroup: any;

  limit: any;
  totallimit = 0;

  editbuttonbool = true;

  constructor(private userdetailsservice: UserDetailsService, private fb: FormBuilder, private notification: NotificationService, private vowservice:VowService,
    private leadservice:LeadserviceService) { }

  ngOnInit(): void {

    // let data: any = JSON.parse(localStorage.getItem('UserData'))
    // console.log("vendorid", data);
    // this.vendorid = data.id;
    // this.vendorid = data?.vendor_id;

    // this.vendorname = data?.company_name


    // this.groupform = this.fb.group({
    //   name: [''],
    //   is_parent: [1],
    //   vendor_id: [this.vendorid],
    //   supplier_id: [''],
    //   id: [''],
    // })

    this.groupform = this.fb.group({
      "vendorgroup_id": [''],
      "vendor_id": this.vendorid,
      "supplier_id": [''],
      "is_active": ["True"],
      "groupmapping": new FormArray([]),
      "id": [''],
      "grouplimit":[''],
      "currentlimit":['']
    })

    this.groupmappingform = this.fb.group({
      group_id: [''],
      employee_ids: new FormArray([]),
      is_active: true,
      id: [''],

    })

    this.ruleform = this.fb.group(
      {
        id: [''],
        group_id: [''],
        product_id: [''],
        rule_type: [''],
        rule_value: ['']
      }
    )

    this.getvendorId();
    

  }

  getvendorId(){
    this.leadservice.getVendor()
     .subscribe(result =>{
      console.log("vendor id",result)
      if(result.status == "success"){
      this.vendorid = result?.vendor_id
      this.changetab('GROUP')
      }
     })
  }


  groupsubmit() {

    // this.groupform.value.supplier_id = this.groupform.value.supplier_id.id
    // this.groupform.patchValue({
    //   supplier_id: this.groupform.value.supplier_id?.id
    // });
    // (this.groupform.value.id != '' && this.groupform.value.id != null) ? '' : delete this.groupform.value.id

    // console.log('groupsubmit', this.groupform.value.supplier_id)

    this.groupform.patchValue({
      vendorgroup_id: this.groupform.value.vendorgroup_id.id,
      supplier_id: (this.groupform.value.supplier_id != '' && this.groupform.value.supplier_id != null) ? this.groupform.value.supplier_id.id : ''
    })

    for (let i = 0; i < this.groupform.value.groupmapping.length; i++) {

      this.groupform.value.groupmapping[i].employee_id = this.groupform.value.groupmapping[i].employee_id.id

    }

    if (!(this.groupform.value.id != null && this.groupform.value.id != '')) {
      delete this.groupform.value.id
    }

    this.vowservice.loader=true

    this.userdetailsservice.creategroup(this.groupform.value).subscribe(
      result => {

    this.vowservice.loader=false


        if (result.message == 'Successfully Created') {
          this.notification.showSuccess('Successfully Created')
          this.onCancelClick()
          this.resetform()

        }
        else if (result.message == "Successfully Updated") {
          this.notification.showSuccess("Successfully Updated")
          this.onCancelClick()
          this.resetform()

        }
        else {
          this.notification.showError(result)
        }
      },(error)=>{
    this.vowservice.loader=false

      }
    )

  }

  onCancelClick() {
    // this.onCancel.emit()

    this.editbuttonbool = true

    this.groupcreate = false
    this.groupsummary = false
    this.groupmapcreate = false;
    this.groupsummaryform = false;
    this.rulecreate = false;
    this.rulesummary = false;

    if (this.currenttab == 'GROUP') {
      this.groupcreate = false
      this.groupsummary = true
      this.getgroupsummary(1)
      this.groupsummaryform = false
    }
    // if (this.currenttab == 'GROUP MAPPING') {
    //   this.groupmapcreate = false;
    //   this.groupsummaryform = true;
    //   this.getmapgroupsummary(1)
    // }
    if (this.currenttab == 'RULE') {
      this.rulecreate = false;
      this.rulesummary = true;
      this.getrulesummary(1)
    }

    this.resetform()

    this.getvendorlimit()
  }

  resetform() {
    this.groupform.patchValue({
      vendorgroup_id: '',
      supplier_id: '',
      is_active: 'True',
      id: '',
      currentlimit:''
    })

    this.groupmappingform.reset()

    this.groupmappingform.patchValue({
      group_id: '',
      id: '',
    })

    this.ruleform.patchValue({
      id: '',
      group_id: '',
      product_id: '',
      rule_type: '',
      rule_value: ''
    })


    this.selectedemployees = []
    this.selectedemployeesid = []

    this.groupmapsummarydata = []

    const control = <FormArray>this.groupmappingform.controls['employee_ids'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }

    const controlgroup = <FormArray>this.groupform.controls['groupmapping'];
    for (let i = controlgroup.length - 1; i >= 0; i--) {
      controlgroup.removeAt(i)
    }




    this.addSection();

  }

  changetab(value) {

    this.editbuttonbool = true

    this.currenttab = value

    this.groupcreate = false;
    this.groupsummary = false;
    this.groupmapcreate = false;
    this.groupsummaryform = false;
    this.rulecreate = false;
    this.rulesummary = false;

    if (value == 'GROUP') {
      this.groupcreate = false;
      this.groupsummary = true;
      this.getgroupsummary(1)

    }
    // if (value == 'GROUP MAPPING') {
    //   this.groupmapcreate = false;
    //   this.groupsummaryform = true;
    //   this.getmapgroupsummary(1)
    // }
    if (this.currenttab == 'RULE') {
      this.rulecreate = false;
      this.rulesummary = true;
      this.getrulesummary(1)
      this.grouprule()
    }

    this.resetform()
    this.getvendorlimit()


  }

  groupmappingsubmit() {

    for (let i = 0; i < this.groupmappingform.value.employee_ids.length; i++) {
      if (this.groupmappingform.value.employee_ids[i].employee_id == '') {
        this.notification.showError("Please select Employee")
        return false

      }

      if (this.groupmappingform.value.employee_ids[i].limit == '') {
        this.notification.showError("Please enter limit")
        return false
      }
    }

    this.groupmappingform.patchValue({
      group_id: this.groupid
    });

    for (let i = 0; i < this.groupmappingform.value.employee_ids.length; i++) {
      this.groupmappingform.value.employee_ids[i].employee_id = this.groupmappingform.value.employee_ids[i].employee_id.id
    }

    (this.groupmappingform.value.id != '' && this.groupmappingform.value.id != null) ? '' : delete this.groupmappingform.value.id

    this.userdetailsservice.creategroupmapping(this.groupmappingform.value).subscribe(
      result => {
        if (result.message == 'Successfully Created') {
          this.notification.showSuccess('Successfully Created')
          // this.onCancelClick()
          this.getmapgroupsummary(this.groupid, this.groupmap_currentpage = 1)
          this.selectedemployees = [];
          this.selectedemployeesid = [];
          (<FormArray>this.groupmappingform.get('employee_ids')).clear();

          this.resetform()

        }
        else if (result.message == 'Successfully Updated') {
          this.notification.showSuccess('Successfully Updated')
          // this.onCancelClick()
          this.getmapgroupsummary(this.groupid, this.groupmap_currentpage = 1)
          this.selectedemployees = [];
          this.selectedemployeesid = [];
          this.resetform()




        }
        else {
          this.notification.showError(result)
        }
      }
    )
  }

  getsupplierdata(value) {

    this.userdetailsservice.getsupplierdata(this.vendorid, value).subscribe(
      result => {
        this.supplierdata = result['data']
      }
    )
  }

  public displayfnsupplier(supplier?: supplier): string | undefined {

    return supplier ? supplier.name : undefined;
  }

  public displayfnproduct(product?: product): string | undefined {

    return product ? product.name : undefined;
  }

  getgroupsummary(page) {

    this.vowservice.loader=true

    this.userdetailsservice.groupsummary(this.vendorid, page).subscribe(
      result => {
    this.vowservice.loader=false

        this.groupsummarydata = result['data']
        let pagination = result['pagination']
        if (this.groupsummarydata.length != 0) {
          this.group_hasnext = pagination['has_next'];
          this.group_hasprevious = pagination['has_previous'];
          this.group_currentpage = pagination['index'];
        }
      },(error)=>{
    this.vowservice.loader=false

      }
    )
  }

  getmapgroupsummary(id, page) {
    this.userdetailsservice.groupmapsummary(id, page).subscribe(
      result => {
        this.groupmapsummarydata = result['data']
        let pagination = result['pagination']
        if (this.groupmapsummarydata.length != 0) {
          this.groupmap_hasnext = pagination['has_next'];
          this.groupmap_hasprevious = pagination['has_previous'];
          this.groupmap_currentpage = pagination['index'];
        }
      }
    )
  }

  getpreviousgroupsummary() {
    if (this.group_hasprevious) {
      this.getgroupsummary(this.group_currentpage - 1)
    }
  }

  getnextgroupsummary() {
    if (this.group_hasnext) {
      this.getgroupsummary(this.group_currentpage + 1)
    }
  }

  getgroupmapprevious() {
    if (this.groupmap_hasprevious) {
      this.getmapgroupsummary(this.groupid, this.groupmap_currentpage - 1)
    }
  }

  getgroupmapnext() {
    if (this.groupmap_hasnext) {
      this.getmapgroupsummary(this.groupid, this.groupmap_currentpage + 1)
    }
  }

  addgroup() {
    this.editbuttonbool = false

    this.groupcreate = false
    this.groupsummary = false
    this.groupmapcreate = false;
    this.groupsummaryform = false;

    this.resetform()

    if (this.currenttab == 'GROUP') {
      this.groupcreate = true
      this.groupsummary = false
      this.groupsummaryform = false
      this.addgroupmap()
      // this.getgroupsummary(1)
    }
    // if (this.currenttab == 'GROUP MAPPING') {
    //   this.groupmapcreate = true;
    //   this.groupsummaryform = false;
    //   // this.getmapgroupsummary(1)
    // }
    if (this.currenttab == 'RULE') {
      this.rulecreate = true;
      this.rulesummary = false;
    }

  }

  getemployee(value) {

    // this.userdetailsservice.foo.unsubscribe()

    this.userdetailsservice.getportaluseremployee(this.vendorid, value).subscribe(
      result => {
        this.employeedata = result['data']
      }
    )
  }

  public displayfnemployee(employee?: employee): string | undefined {

    return employee ? employee.full_name : undefined;
  }

  getgroupdropdown(value, page) {
    this.userdetailsservice.groupsummary(this.vendorid, page).subscribe(
      result => {
        this.groupdata = result['data']
        // let pagination=result['pagination']
        // if(this.groupsummarydata.length != 0){
        //   this.group_hasnext=pagination['has_next'];
        //   this.group_hasprevious=pagination['has_previous'];
        //   this.group_currentpage=pagination['index'];
        // }
      }
    )
  }

  getparticulargroupmapping(id) {
    this.userdetailsservice.getparticulargroupmapping(id).subscribe(
      result => {
        this.groupmappingform.patchValue({
          group_id: result?.group_id,
          employee_ids: '',
          id: result?.id
        })
        this.selectedemployees = [result?.employee_ids]
        this.selectedemployeesid = [result?.employee_ids?.id]
        // result.employee.forEach(element => {
        //   this.selectedemployeesid.push(element.id)
        // });

        console.log(this.groupmappingform.value)

      }
    )
  }

  groupmappingedit(value) {
    this.editbuttonbool = false
    this.addgroup()
    this.getparticulargroupmapping(value)
  }

  getparticulargroupedit(id) {

    this.userdetailsservice.getparticulargroup(id).subscribe(
      result => {
        this.groupform.patchValue({
          name: result?.name,
          vendor_id: result?.vendor_id,
          supplier_id: result?.supplier_id,
          id: result?.id
        })
        console.log(this.groupform.value)

      }
    )
  }
  getgroupedit(value) {
    this.addgroup()
    this.editgroup(value)
    // this.getparticulargroupedit(value)
  }

  getremovechip(value) {
    const index = this.selectedemployees.indexOf(value);
    const indexid = this.selectedemployeesid.indexOf(value.id)
    this.selectedemployees.splice(index, 1);
    this.selectedemployeesid.splice(indexid, 1);
  }

  selectedemployee(event: MatAutocompleteSelectedEvent) {

    let foundEmployee1 = this.selectedemployees.filter(employee => employee.full_name == event.option.viewValue);
    console.log(foundEmployee1, this.selectedemployees)
    if (foundEmployee1.length) {
      return false;
    }

    // if((this.groupform.value.id != '' && this.groupform.value.id != null) && this.selectedemployees.length == 1 ){
    //   return false;
    // }



    this.selectedemployees.push(event.option.value);
    this.selectedemployeesid.push(event.option.value.id)
    this.employeeinput.nativeElement.value = '';

    this.groupmappingform.patchValue({
      employee_ids: ''
    })
  }

  grouprulesubmit() {

    this.ruleform.patchValue({
      group_id: this.ruleform.value.group_id.id,
      product_id: this.ruleform.value.product_id.id,
      rule_value: this.ruleform.value.rule_value.id
    });

    (this.ruleform.value.id != '' && this.ruleform.value.id != null) ? '' : delete this.ruleform.value.id

    this.userdetailsservice.createrule(this.ruleform.value).subscribe(
      result => {
        if (result.message == 'Successfully Created') {
          this.notification.showSuccess('Successfully Created')
          this.onCancelClick()
          this.addSection()
        }
        else if (result.message == 'Successfully Updated') {
          this.notification.showSuccess('Successfully Updated')
          this.onCancelClick()
          this.addSection()

        }
        else {
          this.notification.showError(result)
        }
      }
    )
  }

  getrulesummary(page) {
    this.vowservice.loader=true

    this.userdetailsservice.rulesummary(this.vendorid, page).subscribe(
      result => {
    this.vowservice.loader=false

        this.rulesummarydata = result['data']
        let pagination = result['pagination']
        if (this.rulesummarydata.length != 0) {
          this.rule_hasnext = pagination['has_next'];
          this.rule_hasprevious = pagination['has_previous'];
          this.rule_currentpage = pagination['index'];
        }
      },(error)=>{
    this.vowservice.loader=false

      }
    )
  }

  getruleedit(id) {
    this.editbuttonbool = false
    this.addgroup()
    this.getparticularruleedit(id)
  }

  getparticularruleedit(id) {

    this.vowservice.loader=true


    this.userdetailsservice.getparticularrule(id).subscribe(
      result => {
    this.vowservice.loader=false

        this.ruleform.patchValue({
          group_id: result?.group_id,
          product_id: result?.product_id,
          rule_type: result?.rule_type?.id,
          rule_value: result?.rule_value,
          id: result?.id
        })
        console.log(this.groupform.value)

      },(error)=>{
    this.vowservice.loader=false
        
      }
    )
  }

  grouprule() {
    this.userdetailsservice.getrule().subscribe(
      result => {
        this.ruledata = result
      }
    )
  }

  getproduct(groupid, value) {
    this.userdetailsservice.getproduct(groupid, value).subscribe(
      result => {
        this.productdata = result
      }
    )
  }

  groupmap(id, page) {
    this.groupid = id
    this.groupsummaryform = true
    this.groupcreate = false;
    this.groupsummary = false;
    this.getmapgroupsummary(id, page);
    this.resetform();
  }

  backtogroupsummary() {
    this.groupsummaryform = false
    this.groupcreate = false;
    this.groupsummary = true;
    this.selectedemployees = [];
    this.selectedemployeesid = [];
    this.groupid = ''
    this.resetform()
  }

  deletegroupmap(i, id) {
    this.userdetailsservice.getparticulargroupdelete(id).subscribe(
      result => {
        if (result.message == "Successfully Deleted") {
          this.notification.showSuccess("Successfully Deleted")
          this.getmapgroupsummary(this.groupid, this.groupmap_currentpage = 1)
          this.groupsummarydata.splice(i, 1)
        }
      }
    )
  }

  createItem() {

    let group = this.fb.group({
      employee_id: [''],
      limit: [''],

    });

    return group;
  }

  addSection() {
    const data = this.groupmappingform.get('employee_ids') as FormArray;
    data.push(this.createItem());
  }

  findindex(i) {
    return i
  }

  removeSection(index: number) {

    (<FormArray>this.groupmappingform.get('employee_ids')).removeAt(index);

  }

  getdynamicrulevalues(id, value) {
    this.userdetailsservice.getdynamicrulevalues(id, value).subscribe(
      result => {
        this.rulevaluedata = result['data'];
        let pagination = result['pagination'];

      }
    )
  }

  public displayrulevalue(rule?: rulevalue): string | undefined {

    return rule ? rule.name : undefined;
  }
  getrulenext() {
    if (this.rule_hasnext) {
      this.getrulesummary(this.rule_currentpage + 1)
    }
  }

  getruleprevious() {
    if (this.rule_hasprevious) {
      this.getrulesummary(this.rule_currentpage - 1)

    }
  }


  getvendorgroupdropdown(value, page) {
    this.userdetailsservice.getvendorgroupdropdownsearch(value, page).subscribe(
      result => {

        this.vendorgroupdata = result['data']
        let pagination = result['pagination']
        this.groupdatapagination.has_next = pagination['has_next']
        this.groupdatapagination.has_previous = pagination['has_next']
        this.groupdatapagination.currentpage = pagination['index']

      }
    )
  }

  public displaygroup(rule?: group): string | undefined {

    return rule ? rule.name : undefined;
  }

  addgroupmap() {

    let item = this.fb.group({
      employee_id: '',
      limit: '',
      is_active: true,
    });

    (this.groupform.get('groupmapping') as FormArray).push(item)

  }

  editgroup(value) {

    this.vowservice.loader=true


    this.userdetailsservice.getparticulargroupmapdata(value.id).subscribe(
      result => {
    this.vowservice.loader=false


        const controlgroup = <FormArray>this.groupform.controls['groupmapping'];
        for (let i = controlgroup.length - 1; i >= 0; i--) {
          controlgroup.removeAt(i)
        }

        this.groupform.patchValue({
          vendorgroup_id: result.vendorgroup_id,
          vendor_id: result.vendor_id,
          supplier_id: result.supplier_id,
          is_active: result.is_active,
          id: result.id,
          currentlimit: result.groupmapping.map(_ => _.limit).reduce((x,y) => x+y, 0)
        })
        this.patchgroupmapping(result.groupmapping)
        this.getvendorlimit()
        this.calculatelimitofgroup()
      },(error)=>{
    this.vowservice.loader=false

      }
    )
  }

  patchgroupmapping(data) {

    let array = new FormArray([])

    for (let i = 0; i < data.length; i++) {

      let obj = this.fb.group({
        employee_id: data[i].employee_ids,
        is_active: data[i].is_active,
        limit: data[i].limit,
        id: data[i].id
      });

      (this.groupform.get('groupmapping') as FormArray).push(obj)

    }

  }

  removegroupmapingarray(i) {

    (this.groupform.get('groupmapping') as FormArray).removeAt(i)
  }

  resetproduct() {
    this.ruleform.patchValue({
      product_id: ''
    })
  }

  getvendorbasedgroup(id, value) {
    this.userdetailsservice.getvendorbasedgroup(id, value).subscribe(
      result => {
        this.vendorbasedgroup = result['data']
      }
    )
  }

  public displayvendorbasedgroup(vendorbasedgroup?: vendorbasedgroup): string | undefined {

    return vendorbasedgroup ? vendorbasedgroup.vendorgroup_id.name : undefined;
  }

  getvendorlimit() {
    this.userdetailsservice.getvendorlimit(this.vendorid).subscribe(
      result => {
        console.log('limit result', result);
        this.limit = result

        this.limit.remaininglimits = this.limit?.limit - this.limit.grouplimit?.limit__sum
        console.log('limits', this.limit)
      }
    )
  }

  calculatelimitofgroup() {
    // const data = this.groupform.value.groupmapping
    // let totallimit=0
    // for(let i=0;i<data.length;i++){
    //   totallimit = data[i].limit == '' ? 0:data[i].limit + totallimit
    // }

    // return this.limit.remaininglimits < totallimit

     const data = this.groupform.value.groupmapping
     let totallimit=0

      for(let i=0;i<data.length;i++){
      totallimit = data[i].limit == '' ? 0:data[i].limit + totallimit
    }

    console.log('totallimit',totallimit, this.limit.remaininglimits)
    if(this.limit.limit == this.limit.grouplimit?.limit__sum ){
      console.log(' totallimit > this.groupform.value.currentlimit' , totallimit > this.groupform.value.currentlimit,this.groupform.value.currentlimit)
      return totallimit > this.groupform.value.currentlimit

    }
    else if(this.limit.limit > this.limit.grouplimit?.limit__sum) {
      console.log('totallimit > this.limit.totallimit ',totallimit > this.groupform.value.currentlimit+this.limit.remaininglimits,totallimit,this.groupform.value.currentlimit+this.limit.remaininglimits )
      return totallimit > this.groupform.value.currentlimit+this.limit.remaininglimits 
    }
  

    // let limits = data.map( )
    // console.log("limits data ", limits)

    let adds = data.map(_ => _.limit).reduce((x,y) => x+y, 0)

    console.log("adds data", adds)

  }

  deleteparticularemployeeingroupmap(data, i) {


    if (data.value.id) {

      this.userdetailsservice.getparticularemployeedeleteingroupmapping(data.value.id).subscribe(
        result => {
          if(result.message == "Successfully Deleted"){
            this.notification.showSuccess(result.message);
            (this.groupform.get('groupmapping') as FormArray).removeAt(i)
          }
        

        }
      )
    }
    else {
      (this.groupform.get('groupmapping') as FormArray).removeAt(i)

    }
  }

}
