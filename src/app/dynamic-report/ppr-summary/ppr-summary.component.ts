import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PprService } from '../ppr.service';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
// import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SharePprService } from '../share-ppr.service';




interface branchList {
  id: number
  name: string
}
interface bsList {
  id: number
  name: string
}
interface ccList {
  id: number
  name: string
}
interface finyearList {
  finyer: string
}
interface sectorList {
  id: number
  name: string
}
interface businessList {
  id: number
  name: string
}
interface expensegrpList {
  id: number
  name: string
}
interface iDeptList {
  name: string;
  id: number;
}
@Component({
  selector: 'app-ppr-summary',
  templateUrl: './ppr-summary.component.html',
  styleUrls: ['./ppr-summary.component.scss']
})
export class PprSummaryComponent implements OnInit {
  select_database : boolean = false;
  Submodule_data: any;
  show_schema:boolean = true;
  query_screen:boolean = false;
  temp_summary:boolean = false;
  docu_summary:boolean = false;
  schema_names: any;
  searchText: string = '';



  constructor( private formBuilder: FormBuilder, private dataService: PprService, private shareService: SharedService, private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog, private toastr: ToastrService,private pprsharedservice :SharePprService) { }
  PPRMenuList

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == 'Dynamic Report');

    // let submoduleDataString = localStorage.getItem("menuUrlData")
    // this.Submodule_data = JSON.parse(submoduleDataString);
    // console.log("Submodule_data", this.Submodule_data)
    // let datas = this.Submodule_data.filter(rolename => rolename.name == 'Dynamic Report');
    console.log('totaldata', datas)
    datas.forEach((element) => {
      if (element.name === 'Dynamic Report') {
        let subModule = element.submodule;
        this.PPRMenuList = subModule;
      }
    })
    this.get_schemas(1)
  }


get_schemas(id){
  this.openhide()
  this.SpinnerService.show();
  this.pprsharedservice.connection_id.next(id)
  let type = id
  this.dataService.get_schema_names(id,type)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      this.schema_names = results['data'][0]['scheme_names']
      this.select_database = false;
      this.show_schema = true;
    })
}

openhide(){
  if (this.shareService.isSideNav) {
  
  } else {
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";
    this.shareService.isSideNav = true;
  }
}

back_to_sqlscreen(){
  this.select_database = true;
  this.show_schema = false;
}

getFilteredSchemes(): string[] {
  const search = this.searchText?.trim() || ''; 

  if (!search) {
    return this.schema_names;
  }

  return this.schema_names.filter(scheme =>
    scheme.toLowerCase().includes(search.toLowerCase())
  );
}

  route_mainscreen(scheme){
    this.pprsharedservice.schema_name.next(scheme)
    this.pprsharedservice.multi_single_scheme.next('Single')
    this.query_screen = true
    this.select_database = false;
    this.show_schema = false;
    this.temp_summary = false;
    this.docu_summary = false;
  }

  route_mainscreen_with_multi(scheme){
    this.pprsharedservice.multi_single_scheme.next(scheme)
    this.query_screen = true
    this.select_database = false;
    this.show_schema = false;
    this.temp_summary = false;
    this.docu_summary = false;
  }

  view_temp_summary(){
    this.query_screen = false
    this.select_database = false;
    this.show_schema = false;
    this.temp_summary = true;
    this.docu_summary = false;
  }

  view_document_summary(){
    this.query_screen = false
    this.select_database = false;
    this.show_schema = false;
    this.temp_summary = false;
    this.docu_summary = true;
  }
}