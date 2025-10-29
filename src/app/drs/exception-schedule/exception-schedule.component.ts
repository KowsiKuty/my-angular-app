import { Component, OnInit,ViewChild , ElementRef} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'; 
import { DrsService } from '../drs.service'; 
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
// import {
//   disableBodyScroll,
//   enableBodyScroll,
//   clearAllBodyScrollLocks
// } from "body-scroll-lock";



export interface drs {
  // finyer: number;
  finyer: string;
  name: string;
  code: number;
  id: number;
}


@Component({
  selector: 'app-exception-schedule',
  templateUrl: './exception-schedule.component.html',
  styleUrls: ['./exception-schedule.component.scss']
})
export class ExceptionScheduleComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Finyear') matAutocompletebrach: MatAutocomplete;
  @ViewChild('FinyearContactInput') FinyearContactInput: any;
  @ViewChild("Sche_data") Sche_data: any;
  @ViewChild("schedule_excep") schedule_excep: MatAutocomplete;
  @ViewChild("Sche_modal_data") Sche_modal_data: any;
  @ViewChild("schedule_modal_excep") schedule_modal_excep: MatAutocomplete;
  @ViewChild('Exception_sum_close') Exception_sum_close: ElementRef;


  Fin_data: any;
  finyear: any;
  Exceptionsummary: FormGroup;
  Finyear_data: any;
  isLoading: boolean;
  Schdularmaster_Exception: any;
  // Sche_data: any;
  exc_has_next: boolean;
  exc_has_previous: boolean;
  exc_currentpage: number;
  Exception_summary_data: any;
  hasnext: any;
  hasprevious: any;
  presentpage: any;
  data_scdhele_found: boolean;
  currentpage: number;
  Exception_data: any;
  Finyear_modal_data: any;
  ExceptionModal: FormGroup;
  Avalue: any;
  Exception_schedule_submit_btn: boolean;
  // Sche_modal_data: any;
  Schdularmaster_modal_Exception: any;
  exc_modal_has_next: boolean;
  exc_modal_has_previous: boolean;
  exc_modal_currentpage: number;
  Excp_Modal_name: any;
  Excp_Modal_schedule: any;
  Excp_Modal_amount: any;
  Excp_Modal_year: any;
  PARAMS: any;
  // PARAMS: { name: any; value: any; id: any; finyear: any; parent_id: any;};
  Exc_cre_data: any;
  // Exception_sum_close: any;
  Evalue: any;
  EditId: any;
  Exce_mas_view: boolean;
  DData: any;
  // schedule_modal_excep: any;

  // public display_Exc_finyear(fin_year?: displayfromat): string | undefined {
  //   return fin_year ? fin_year.finyer : undefined;
  // }

  constructor(private FB: FormBuilder, private drsservice: DrsService, private Toastr: ToastrService, private spinnerservice: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.Exceptionsummary = this.FB.group({
      Exception_name: '',
      Exception_Fyear: '',
      Exception_schedule: '',
      Exception_amount: '',
    })
    this.ExceptionModal = this.FB.group({
      Exception_modal_Fyear: '',
      Exception_modal_name: '',
      Exception_modal_amount: '',
      Exception_modal_schedule:'',
    })
    this.Exception_search("");
    // this.Exception_search('')
  }
  public display_Exc_finyear(Exception_Fyear?: drs): string | undefined {
    return Exception_Fyear ? Exception_Fyear.finyer : undefined;
  }
  public display_Exc_modal_finyear(Exception_modal_Fyear?: drs): string | undefined {
    return Exception_modal_Fyear ? Exception_modal_Fyear.finyer : undefined;
  }
  public display_Exc_schedule(Exception_schedule?: drs): string | undefined {
    return Exception_schedule ? Exception_schedule.name+"-"+Exception_schedule.code : undefined;
  }
  public display_modal_Exc_schedule(Exception_modal_schedule?: drs): string | undefined {
    return Exception_modal_schedule ? Exception_modal_schedule.name+"-"+Exception_modal_schedule.code : undefined;
  }


  Exception_Finyear_dd(){
    // this.spinnerservice.show()
    this.drsservice.Exception_finyear().subscribe((results: any) => {
      // this.spinnerservice.hide()
      let Datas= results["data"]
      this.Finyear_data= Datas

    })
  }
  Exception_Finyear_modal_dd(){
    // this.spinnerservice.show()
    this.drsservice.Exception_finyear().subscribe((results: any) => {
      // this.spinnerservice.hide()
      let FDatas= results["data"]
      this.Finyear_modal_data= FDatas

    })

  }
  Exception_schedule_dd(){
    // this.spinnerservice.show()
    this.drsservice
      .Schdularmaster_dropdown(this.Sche_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerservice.hide()
        // this.spinnerService.hide();
        let datas = results["data"];
        this.Schdularmaster_Exception = datas;
        // this.cat_id = this.Catagory_list.id;
        console.log("Schdularmaster_Excep=>", this.Schdularmaster_Exception);
      });

  }
  autocompleteschedule_excep_Scroll() {
    this.exc_has_next = true;
    this.exc_has_previous = true;
    this.exc_currentpage = 1;
    setTimeout(() => {
      if (this.schedule_excep && this.autocompleteTrigger && this.schedule_excep.panel) {
        fromEvent(this.schedule_excep.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.schedule_excep.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schedule_excep.panel.nativeElement.scrollTop;
            const scrollHeight = this.schedule_excep.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.schedule_excep.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.exc_has_next === true) {
                this.drsservice.Schdularmaster_dropdown(this.Sche_data.nativeElement.value, this.exc_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.Schdularmaster_Exception = this.Schdularmaster_Exception.concat(datas);
                  if (this.Schdularmaster_Exception.length >= 0) {
                    this.exc_has_next = datapagination.has_next;
                    this.exc_has_previous = datapagination.has_previous;
                    this.exc_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  Exception_schedule_modal_dd(){
    // this.spinnerservice.show()
    this.drsservice
      .Schdularmaster_dropdown(this.Sche_modal_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerservice.hide()
        let datas = results["data"];
        this.Schdularmaster_modal_Exception = datas;
        // this.cat_id = this.Catagory_list.id;
        console.log("Schdularmaster_Excep=>", this.Schdularmaster_modal_Exception);
      });

  }
  autocompleteschedule_modal_excep_Scroll(){
    this.exc_modal_has_next = true;
    this.exc_modal_has_previous = true;
    this.exc_modal_currentpage = 1;
    setTimeout(() => {
      if (this.schedule_modal_excep && this.autocompleteTrigger && this.schedule_modal_excep.panel) {
        fromEvent(this.schedule_modal_excep.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.schedule_modal_excep.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schedule_modal_excep.panel.nativeElement.scrollTop;
            const scrollHeight = this.schedule_modal_excep.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.schedule_modal_excep.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.exc_modal_has_next === true) {
                this.drsservice.Schdularmaster_dropdown(this.Sche_modal_data.nativeElement.value, this.exc_modal_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.Schdularmaster_modal_Exception = this.Schdularmaster_modal_Exception.concat(datas);
                  if (this.Schdularmaster_modal_Exception.length >= 0) {
                    this.exc_modal_has_next = datapagination.has_next;
                    this.exc_modal_has_previous = datapagination.has_previous;
                    this.exc_modal_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });

  }

  Exception_search(excdata,pageNumber=1){
    this.Exception_data= excdata
    // let page= 1
    // let Fyear= {"finyer":excdata.Exception_Fyear.finyer}
    let finyer= "";
    let finyear= this.Exception_data.Exception_Fyear?.finyer?? '';
    let schedule= this.Exceptionsummary.value.Exception_schedule?.id??'';
    let name= this.Exceptionsummary.value.Exception_name ? this.Exceptionsummary.value.Exception_name : "";
    this.spinnerservice.show()
    this.drsservice.Exception_summary(pageNumber,name,schedule,finyear).subscribe((results: any) => {
      this.spinnerservice.hide()
      let data= results["data"];
      this.Exception_summary_data= data;
      let datapagination = results["pagination"];
      if(this.Exception_summary_data?.length > 0){
        this.hasnext = datapagination.has_next;
        this.hasprevious = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_scdhele_found = true;
      }
      if (this.Exception_summary_data?.length == 0) {
        this.hasnext = false;
        this.hasprevious = false;
        this.presentpage = 1;
        this.data_scdhele_found = false;
      }

    })

  }
  Expence_createdata(ExceptionModal){
    if(this.ExceptionModal.controls["Exception_modal_Fyear"].value== null || this.ExceptionModal.controls["Exception_modal_Fyear"].value== '' || this.ExceptionModal.controls["Exception_modal_Fyear"].value== undefined ){
      this.Toastr.warning("Please Select The Finyear")
      return false
    }
    if(this.ExceptionModal.controls["Exception_modal_schedule"].value?.id== null || this.ExceptionModal.controls["Exception_modal_schedule"].value?.id== '' || this.ExceptionModal.controls["Exception_modal_schedule"].value?.id== undefined ){
      this.Toastr.warning("Please Select The Schedule Master")
      return false
    }
    // if(this.ExceptionModal.controls["Exception_modal_name"].value== null || this.ExceptionModal.controls["Exception_modal_name"].value== '' ){
    //   this.Toastr.warning("Please Enter The Name")
    //   return false
    // }
    if(this.ExceptionModal.controls["Exception_modal_amount"].value== null || this.ExceptionModal.controls["Exception_modal_amount"].value== '' || this.ExceptionModal.controls["Exception_modal_amount"].value== undefined){
      this.Toastr.warning("Please Enter The Amount")
      return false
    }
    

    this.Excp_Modal_year= this.ExceptionModal.controls["Exception_modal_Fyear"].value
    this.Excp_Modal_name= this.ExceptionModal.controls["Exception_modal_name"].value
    this.Excp_Modal_amount= this.ExceptionModal.controls["Exception_modal_amount"].value
    this.Excp_Modal_schedule= this.ExceptionModal.controls["Exception_modal_schedule"].value

    if(this.Avalue== 'Add'){
      this.PARAMS={
        "name": this.Excp_Modal_name,
        "value": this.Excp_Modal_amount,
        "finyear": this.Excp_Modal_year.finyer,
        "parent_id":this.Excp_Modal_schedule.id,
      }
    }
    if(this.Evalue== 'edit'){
      this.PARAMS={
        "name":this.Excp_Modal_name,
        "value":this.Excp_Modal_amount,
        "finyear": this.Excp_Modal_year.finyer,
        "parent_id":this.Excp_Modal_schedule.id,
        "id": this.EditId,
      }
    }

    // this.PARAMS
    this.spinnerservice.show()
    this.drsservice.Exception_submit(this.PARAMS).subscribe((results: any) => {
      this.spinnerservice.hide()
      let datas= results["data"]
      this.Exc_cre_data= datas
      if(results.message== "Successfully Created" || results.message== "Successfully Updated"){
        this.Toastr.success(results.message)
        this.Exception_sum_close.nativeElement.click();
        this.Exception_search(""),
        this.Avalue=''
        this.Evalue=''
        this.Exception_close()
        
       
      } else{
        this.Toastr.error('Error')
        this.Exception_close()
      }


    })

  }
  Exception_add( Add){
    this.Exceptionsummary.reset()
    this.Exce_mas_view= false
    this.Avalue= Add
    this.ExceptionModal.reset()
    this.Exception_schedule_submit_btn= true
    document.getElementById('exampleModalexception').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  Exception_close(){
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    // window.scrollTo(0, parseInt(body.style.top || '0') * -1);
  }
  Exception_edit(Exception,edit){
    // this.Exceptionsummary.reset()
    this.Exce_mas_view= false
    this.Exception_schedule_submit_btn= true
    this.Evalue= edit
    this.EditId= Exception.id
    let name= {"finyer":Exception.finyear}
    this.spinnerservice.show()
    
    this.ExceptionModal.patchValue({
      "Exception_modal_Fyear": name,
      "Exception_modal_name": Exception.name,
      "Exception_modal_amount": Exception.value,
      "Exception_modal_schedule": Exception.parent_id,

    })
    this.spinnerservice.hide()


  }
  Exception_view(Exception,view){
    // this.Exceptionsummary.reset()
    this.Exce_mas_view=true
    this.Exception_schedule_submit_btn= false
    let name= {"finyer":Exception.finyear}

    this.ExceptionModal.patchValue({
      "Exception_modal_Fyear": name,
      "Exception_modal_name": Exception.name,
      "Exception_modal_amount": Exception.value,
      "Exception_modal_schedule": Exception.parent_id,

    })

  }
  Exception_clear(){
    this.Exceptionsummary.reset()
    this.Exception_search('')

  }
  previousClick(){
    if (this.hasprevious === true) {         
      this.currentpage = this.presentpage - 1
      this.Exception_search(this.Exception_data, this.presentpage - 1)
    }

  }
  nextClick(){
    if (this.hasnext === true){
      this.currentpage = this.presentpage + 1
      this.Exception_search(this.Exception_data, this.presentpage + 1)
    }

  }

  Exception_deletes(currency) {
    // let status
    // if (currency.status == 0) {
    //   status = 1
    // } else {
    //   status = 0
    // }
    let status= 0
    let Currency_id = currency.id
    this.spinnerservice.show()
    this.drsservice.Exception_delete(Currency_id, status).subscribe((results: any) => {
      this.spinnerservice.hide()
      this.DData = results.message
      if (results.status == "success") {
        this.Toastr.success("Successfully Updated")
        this.Exception_search('')
        this.Avalue = ''
        this.Evalue = ''
      } else {
        this.Toastr.error('ERROR')
      }
    })
  }
 

}
