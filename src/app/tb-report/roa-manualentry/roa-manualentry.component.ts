import { Component, OnInit, ViewChild } from "@angular/core";
import { TbReportService } from "../tb-report.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { fromEvent } from "rxjs";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

export interface finyearLists {
  finyer: string;
}

export interface business_list{
  name:string;
  id:number;
  code:string;
}

@Component({
  selector: "app-roa-manualentry",
  templateUrl: "./roa-manualentry.component.html",
  styleUrls: ["./roa-manualentry.component.scss"],
})
export class RoaManualentryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('labelContactInput') labelContactInput: any;
  @ViewChild('label') matAutocompletelabel: MatAutocomplete;
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  @ViewChild('branchContactInputss') branchContactInputs: any;
  @ViewChild('branchname') matAutocompletebrachname: MatAutocomplete;  
  @ViewChild('businessInputs') businessInputs: any;
  @ViewChild('business_names') business_nameautocompletes: MatAutocomplete;
  @ViewChild('closepop') close_file :any;
  @ViewChild('closepopedit')closepopedit:any
  
  Roa_manual_search: any;
  Roa_manual_array: any;
  array_hide: boolean;
  explevel_id: any;
  isSummaryPagination: boolean;
  has_next: any;
  has_previous: any;
  presentpage: any;
  roa_manual: FormGroup;
  currentpage: any;
  tb_env = environment.apiURL;
  finyearList: any;
  from_month = [
    { id: 1, month: "Apr", month_id: 4 },
    { id: 2, month: "May", month_id: 5 },
    { id: 3, month: "Jun", month_id: 6 },
    { id: 4, month: "Jul", month_id: 7 },
    { id: 5, month: "Aug", month_id: 8 },
    { id: 6, month: "Sep", month_id: 9 },
    { id: 7, month: "Oct", month_id: 10 },
    { id: 8, month: "Nov", month_id: 11 },
    { id: 9, month: "Dec", month_id: 12 },
    { id: 10, month: "Jan", month_id: 1 },
    { id: 11, month: "Feb", month_id: 2 },
    { id: 12, month: "Mar", month_id: 3 },
  ];
  branchList: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  isLoading: boolean;
  businessList: any;
  has_nextbss: boolean;
  has_previousbss: boolean;
  currentpagebss: number;
  branchLists: any;
  finyearLists: any;
  businessLists: any;
  roaSearchForm:FormGroup;
  file_info: any;
  edit_screen:boolean=false;
  summary_screen:boolean=true;
  constructor(
    private frombuilder: FormBuilder,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private tb_serv: TbReportService
  ) {
    // this.Roa_manual_search = [
    //   { type: "dropdown", inputobj: this.finyear, formvalue: "finyear" },
    //   { type: "dropdown", inputobj: this.month_dd, formvalue: "month" },
    //   { type: "dropdown", inputobj: this.business, formvalue: "business_code" },
    //   { type: "dropdown", inputobj: this.branch, formvalue: "branch_code" },
    // ];
  }
  // {"type":"dropdown",inputobj:this.label,formvalue:"label_id"},
  // finyear: any = {
  //   label: "Finyear",
  //   method: "get",
  //   url: this.tb_env + "usrserv/emp_bus_map_finyear",
  //   params: "",
  //   searchkey: "query",
  //   displaykey: "finyear",
  //   wholedata: true,
  //   required: true,
  //   Outputkey: "finyear",
  // };
  // business: any = {
  //   label: "Business",
  //   method: "get",
  //   url: this.tb_env + "pprservice/ppr_mstbusiness_segment",
  //   params: "",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  //   required: true,
  //   Outputkey: "id",
  // };

  // branch: any = {
  //   label: "Branch",
  //   method: "get",
  //   url: this.tb_env + "reportserv/do_branch_search",
  //   params: "",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  //   required: true,
  //   Outputkey: "code",
  // };

  month_dd: any = {
    label: "Month",
    data: [
      { id: 1, month: "Apr", month_id: 4 },
      { id: 2, month: "May", month_id: 5 },
      { id: 3, month: "Jun", month_id: 6 },
      { id: 4, month: "Jul", month_id: 7 },
      { id: 5, month: "Aug", month_id: 8 },
      { id: 6, month: "Sep", month_id: 9 },
      { id: 7, month: "Oct", month_id: 10 },
      { id: 8, month: "Nov", month_id: 11 },
      { id: 9, month: "Dec", month_id: 12 },
      { id: 10, month: "Jan", month_id: 1 },
      { id: 11, month: "Feb", month_id: 2 },
      { id: 12, month: "Mar", month_id: 3 },
    ],
    params: "",
    searchkey: "",
    displaykey: "month",
    Outputkey: "month_id",
    fronentdata: true,
  };
  roa_fileuploade:FormGroup;
  edit_form_manual:FormGroup;
  data_edit_id:any;
  ngOnInit(): void {
    // this.roa_manual = this.frombuilder.group({
    //   Roa_manual_arr: new FormArray([this.Roa_manual_row_add()]),
    // });
    this.roaSearchForm= this.frombuilder.group({
      finyear:[''],
      frommonth:[''],
      // branch_id:[''],
      business:[''],
    })
    this.edit_form_manual=this.frombuilder.group({
      finyear: [""],
      month: "",
      vertical_label: "",
      business:"",
      branch:"",
      // status: new FormControl(""),
      avg_asset:"",
    avg_liability:"",
    avg_assets:"",
    yield_perc:"",
    cof_perc:"",
    })
   
   

    this.roa_fileuploade=this.frombuilder.group({
      roa_file:['']
    })
    this.Roa_manual_summary("");
    this.finyear_dropdown()
  }

  Roa_manual_row_add() {
    let exp = new FormGroup({
      finyear: new FormControl(""),
      month: new FormControl(""),
      vertical_label: new FormControl(""),
      business: new FormControl(""),
      branch: new FormControl(""),
      // status: new FormControl(""),
      avg_asset:new FormControl(""),
    avg_liability:new FormControl(""),
    avg_assets:new FormControl(""),
    yield_perc:new FormControl(""),
    cof_perc:new FormControl(""),
      isEditable: new FormControl(false),
    });
    return exp;
  }

  public displayfnfinyear(fin_year?: finyearLists): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }
  create_edit_value:any;
  saveroa_manual(value, ind) {
    console.log(this.edit_form_manual.value,value);
    if (
      this.edit_form_manual.value.finyear == "" ||
      this.edit_form_manual.value.finyear == null ||
      this.edit_form_manual.value.finyear == undefined
    ) {
      this.toastr.warning("Please Select the Finyear");
      return false;
    }

    if (
      this.edit_form_manual.value.month == "" ||
      this.edit_form_manual.value.month == null ||
      this.edit_form_manual.value.month == undefined
    ) {
      this.toastr.warning("Please Select the Month");
      return false;
    }
    if (
      this.edit_form_manual.value.business == "" ||
      this.edit_form_manual.value.business == null ||
      this.edit_form_manual.value.business == undefined
    ) {
      this.toastr.warning("Please Select the Label");
      return false;
    }

    // if (
    //   this.edit_form_manual.value.branch == "" ||
    //   this.edit_form_manual.value.branch == null ||
    //   this.edit_form_manual.value.branch == undefined
    // ) {
    //   this.toastr.warning("Please Enter the Branch");
    //   return false;
    // }
    
    // if (
    //   this.edit_form_manual.value.vertical_label == "" ||
    //   this.edit_form_manual.value.vertical_label == null ||
    //   this.edit_form_manual.value.vertical_label == undefined
    // ) {
    //   this.toastr.warning("Please Enter the Vertical Label");
    //   return false;
    // }
    if (
      this.edit_form_manual.value.avg_asset == "" ||
      this.edit_form_manual.value.avg_asset == null ||
      this.edit_form_manual.value.avg_asset == undefined
    ) {
      this.toastr.warning("Please Enter the Avg Assets");
      return false;
    }
    if (
      this.edit_form_manual.value.avg_liability == "" ||
      this.edit_form_manual.value.avg_liability == null ||
      this.edit_form_manual.value.avg_liability == undefined
    ) {
      this.toastr.warning("Please Enter the Avg Liability");
      return false;
    }
    if (
      this.edit_form_manual.value.avg_assets == "" ||
      this.edit_form_manual.value.avg_assets == null ||
      this.edit_form_manual.value.avg_assets == undefined
    ) {
      this.toastr.warning("Please Enter the Average Asset");
      return false;
    }
    if (
      this.edit_form_manual.value.yield_perc == "" ||
      this.edit_form_manual.value.yield_perc == null ||
      this.edit_form_manual.value.yield_perc == undefined
    ) {
      this.toastr.warning("Please Enter the Yield on Advances/Funds");
      return false;
    }
    if (
      this.edit_form_manual.value.cof_perc == "" ||
      this.edit_form_manual.value.cof_perc == null ||
      this.edit_form_manual.value.cof_perc == undefined
    ) {
      this.toastr.warning("Please Enter the Cost of Deposits/Funds ");
      return false;
    }
    let Params;
    if (
      this.create_edit_value == "edit"
    ) {   
      Params = {      

      "finyear":this.edit_form_manual.value.finyear?.finyer,
      "month":this.edit_form_manual.value.month?.month_id,
      "business_code":this.edit_form_manual.value.business?.code??"",
      "branch_code":this.edit_form_manual.value.branch?.code??"",
      "amount":0.00,
      "avg_asset":this.edit_form_manual.value.avg_asset,
      "avg_liability":this.edit_form_manual.value.avg_liability,
      "avg_assets":this.edit_form_manual.value.avg_assets,
      "yield_perc":this.edit_form_manual.value.yield_perc,
      "cof_perc":this.edit_form_manual.value.cof_perc,
      "label_id":1,
        "id":this.data_edit_id
    }
    
    } else {
      Params = {
      "finyear":this.edit_form_manual.value.finyear?.finyer,
      "month":this.edit_form_manual.value.month?.month_id,
      "business_code":this.edit_form_manual.value.business?.code??"",
      "branch_code":this.edit_form_manual.value.branch?.code??"",
      "amount":0.00,
      "avg_asset":this.edit_form_manual.value.avg_asset,
      "avg_liability":this.edit_form_manual.value.avg_liability,
      "avg_assets":this.edit_form_manual.value.avg_assets,
      "yield_perc":this.edit_form_manual.value.yield_perc,
      "cof_perc":this.edit_form_manual.value.cof_perc,
      "label_id":1,
    }
    }
    var glsubgrpconfirm = window.confirm("Do You Want To Save And Continue?");
    console.log(glsubgrpconfirm);
    if (!glsubgrpconfirm) {
      console.log("True");
      return false;
    } else {
      this.SpinnerService.show();

      this.tb_serv.roa_manual_create_edit(Params).subscribe(
        (results: any) => {
          let data = results["data"][0];
          this.SpinnerService.hide();
          if (data.status == "SUCCESS") {
            this.toastr.success("", data.message, {
                  timeOut: 1500,
                });
                this.create_edit_value=""
            // if (typeof this.edit_form_manual.value.ppr_label_id == "number") {
            //   this.toastr.success("", "Successfully Updated", {
            //     timeOut: 1500,
            //   });
            //   // this.ppr_label.reset()
            //   this.SpinnerService.show();
            this.closepopedit.nativeElement.click();
              this.Roa_manual_summary("");
            //   this.SpinnerService.hide();
            // } else {
            //   this.toastr.success("", "Successfully Created", {
            //     timeOut: 1500,
            //   });
            //   // this.ppr_label.reset()
            //   this.SpinnerService.show();
            //   this.Roa_manual_summary("");
            //   this.SpinnerService.hide();
            // }
            // this.SpinnerService.hide();
            // this.expence_level.reset()
          }
          else{
            this.toastr.warning("", data.message, {
              timeOut: 1500,
            });
          }
          
        },
        (error) => {
          // this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }
  // ppr_label_clear(){
  //   this.ppr_label.reset()
  //   this.Roa_manual_summary('')
  // }

  Roa_manual_create() {
   this.edit_form_manual.reset()
   this.openedit()
  }
  labelList:any
  cancel_roa_master(expcancel, ind) {
    if (expcancel.value.ppr_label_id != "") {
      console.log("true");
      var arrayControl = this.roa_manual.get("Roa_manual_arr") as FormArray;
      let item = arrayControl.at(ind);
      item.get("isEditable").patchValue(true);
    }
    if (
      expcancel.value.ppr_label_id == "" ||
      expcancel.value.ppr_label_id == undefined ||
      expcancel.value.ppr_label_id == null
    ) {
      const control = <FormArray>this.roa_manual.controls["Roa_manual_arr"];
      control.removeAt(ind);
      console.log("false");
    }
  }
  
  Edit_roa_master(expedit, ind,create_edit) {    
    console.log("expedit",expedit,create_edit)
    this.openedit()
    this.data_edit_id=expedit?.id
    this.create_edit_value=create_edit
    this.summary_screen=false;
    this.edit_screen=true;    
    this.edit_form_manual.patchValue({
      finyear: expedit.finyear,
      month: expedit.transactionmonth,
      business:expedit.business,
      avg_asset:expedit.avg_asset,
    avg_liability:expedit.avg_liability,
    avg_assets:expedit.avg_assets,
    yield_perc:expedit.yield_perc,
    cof_perc:expedit.cof_perc,
    })
    console.log("thudbfnng",this.edit_form_manual)
// this.openedit()
    // for (let expeditval of this.roa_manual.controls["Roa_manual_arr"].value) {
    //   console.log("edit", expeditval.isEditable);
    //   if (expeditval.isEditable == false) {
    //     console.log(expeditval.isEditable);
    //     this.toastr.warning(
    //       "",
    //       "New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",
    //       { timeOut: 1500 }
    //     );
    //     return false;
    //   }
    // }
    // var arrayControl = this.roa_manual.get("Roa_manual_arr") as FormArray;
    // let item = arrayControl.at(ind);
    // item.get("isEditable").patchValue(false);
    // expedit.get('Roa_manual_arr').at(ind).get('isEditable').patchValue(false);
  }
  deletelabel(expcancel, i) {
    var sourceconfirm = window.confirm("Are You Sure Change The Status?");
    console.log(sourceconfirm);
    if (!sourceconfirm) {
      return false;
    } else {
      // let delsource=expcancel.value.newsource[i]
      let id = expcancel.id;

      let val = "";
      this.SpinnerService.show();
      this.tb_serv.roa_manual_delete(id).subscribe(
        (results) => {
          this.SpinnerService.hide();
          if (results.status=== "SUCCESS") {            
              this.toastr.success("", results.message, {
                timeOut: 1500,
              });
              this.Roa_manual_summary("");
            
          }
        },
        (error) => {
          // this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }

  Roa_manual_summary(event, page = 1) {
    console.log("event",event)
     
    this.explevel_id= {
      finyear: event?.finyear?.finyer??"",
      month: event?.frommonth?.month_id??"",
      business_code: event.business?.code??"",
      branch_code: "",
      label_id: "",
    };   
    this.SpinnerService.show();
    this.tb_serv.Roa_manual_summary_api(this.explevel_id, page).subscribe((result) => {
      this.SpinnerService.hide();
      let data = result["data"];
      console.log("data=>", data);
      let dataPagination = result["pagination"];
      console.log("dataPagination=>", dataPagination);
      this.Roa_manual_array = data;
      if (this.Roa_manual_array.length != 0) {
        this.Roa_manual_array = data.map(item => {
          const finyearObject = { finyer: item.finyear };
          const monthObject = this.from_month.find(m => m.month_id === item.transactionmonth);
        
          return {
            ...item,
            finyear: finyearObject,
            transactionmonth: monthObject ? monthObject : null
          };
        });
        console.log("manualOutput",this.Roa_manual_array)
        this.array_hide = false;
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
        // this.roa_manual = this.frombuilder.group({
        //   Roa_manual_arr: this.frombuilder.array(
        //     this.Roa_manual_array.map((val) =>
        //       this.frombuilder.group({
        //         ppr_label_id: new FormControl(val.id),
        //         finyear: new FormControl(val.finyear),
        //         month: new FormControl(val.transactionmonth),
        //         vertical_label: new FormControl(val.vertical_label),
        //         business: new FormControl(val.business),
        //         branch: new FormControl(val.branch),
        //         amount:new FormControl(val.amount),
        //         // status: new FormControl(val.status),
        //         avg_asset:new FormControl(val.avg_asset),
        //         avg_liability:new FormControl(val.avg_liability),
        //         avg_assets:new FormControl(val.avg_assets),
        //         yield_perc:new FormControl(val.yield_perc),
        //         cof_perc:new FormControl(val.cof_perc),
        //         isEditable: new FormControl(true),
        //       })
        //     )
        //   ),
        // });
        console.log("expence_level=>", this.roa_manual);
      } else {
        // this.roa_manual = this.frombuilder.group({
        //   Roa_manual_arr: this.frombuilder.array([]) 
        // });
        this.has_next = false;
        this.has_previous = false;
        this.toastr.warning("", "No Data Found", { timeOut: 1200 });
        // this.array_hide = true;
        //  this.Roa_manual_array=[]/
        //  this.expencegrpmapping=[]
        //  this.expence_level.reset()
        //  this.expence_level.get('explevel').reset();
      }
    });
  }

  previousClick() {
    if (this.has_previous === true) {
      this.currentpage = this.presentpage + 1;
      this.Roa_manual_summary(this.roaSearchForm.value, this.presentpage - 1);
    }
  }

  nextClick() {
    if (this.has_next === true) {
      this.currentpage = this.presentpage + 1;
      this.Roa_manual_summary(this.roaSearchForm.value, this.presentpage + 1);
    }
  }

  finyear_dropdown() {
    this.tb_serv.getfinyeardropdown("", 1).subscribe((results: any[]) => {
      let datas = results["data"];
      this.finyearList = datas;
      console.log(this.finyearList)
    });
  }

  Business_dropdown() {
    let report_type = 2;
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.edit_form_manual
      .get("business")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.tb_serv.getbusiness_dropdown(value, 1, report_type).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
      });
  }

  autocompletebusinessnameScroll() {
    let report_type = 2;
    this.has_nextbss = true;
    this.has_previousbss = true;
    this.currentpagebss = 1;
    setTimeout(() => {
      if (
        this.business_nameautocomplete &&
        this.autocompleteTrigger &&
        this.business_nameautocomplete.panel) {
        fromEvent(this.business_nameautocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              () => this.business_nameautocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.business_nameautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.business_nameautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.business_nameautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbss === true) {
                this.tb_serv
                  .getbusiness_dropdown(
                    this.businessInput.nativeElement.value,
                    this.currentpagebss + 1,
                    report_type
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
                      this.has_nextbss = datapagination.has_next;
                      this.has_previousbss = datapagination.has_previous;
                      this.currentpagebss = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  business_id = 0;
  private getbusiness(prokeyvalue) {
    let report_type = 2;
    this.tb_serv
      .getbusiness_dropdown(prokeyvalue, 1, report_type)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
      });
  }

  public displayfnbusiness(businessd_name?: business_list): string | undefined {
    return businessd_name ? businessd_name.name : undefined;
  }

  branchname() {  
    let branch_flag=2 
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.roaSearchForm
      .get("branch")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.tb_serv.getbranchdropdown(value, 1 ,branch_flag,"" ).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  private getbranchid(prokeyvalue) {
    let branch_flag=2
    this.tb_serv.getbranchdropdown(prokeyvalue, 1 ,branch_flag,"" )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  autocompletebranchnameScroll() { 
  let branch_flag=2
    this.has_nextbra = true;
    this.has_previousbra = true;
    this.currentpagebra = 1;
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.tb_serv
                  .getbranchdropdown(
                    this.branchContactInput.nativeElement.value,
                    this.currentpagebra + 1   ,branch_flag,""              
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfnbranch(branch?: business_list): string | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }
  label_dd() {
    let prokeyvalue: String = "";
    this.getlabelid(prokeyvalue);
    this.roaSearchForm
      .get("vertical_label")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.tb_serv.getlabeldropdown(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  private getlabelid(prokeyvalue) {
    this.tb_serv.getlabeldropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  autocompletelabelScroll() {
    this.has_nextbra = true;
    this.has_previousbra = true;
    this.currentpagebra = 1;
    setTimeout(() => {
      if (
        this.matAutocompletelabel &&
        this.autocompleteTrigger &&
        this.matAutocompletelabel.panel
      ) {
        fromEvent(this.matAutocompletelabel.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletelabel.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletelabel.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletelabel.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletelabel.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.tb_serv
                  .getlabeldropdown(
                    this.labelContactInput.nativeElement.value,
                    this.currentpagebra + 1,
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displaylabel(label?: business_list): string | undefined {
    return label ? label.name : undefined;
  }
  public displayfn_serchfinyear(fin_year?: finyearLists): string | undefined {
    return fin_year ? fin_year.finyer : undefined;

  }

  ///Search inputs

  finyear_search_dropdown() {
    this.tb_serv.getfinyeardropdown("", 1).subscribe((results: any[]) => {
      let datas = results["data"];
      this.finyearLists = datas;
    });
  }

  Business_search_dropdown() {
    let report_type = 2;
    let prokeyvalue: String = "";
    this.getbusiness_search(prokeyvalue);
    this.roaSearchForm
      .get("business")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.tb_serv.getbusiness_dropdown(value, 1, report_type).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessLists = datas;
      });
  }

  autocompletebusinessnameScroll_search() {
    let report_type = 2;
    this.has_nextbss = true;
    this.has_previousbss = true;
    this.currentpagebss = 1;
    setTimeout(() => {
      if (
        this.business_nameautocompletes &&
        this.autocompleteTrigger &&
        this.business_nameautocompletes.panel) {
        fromEvent(this.business_nameautocompletes.panel.nativeElement, "scroll")
          .pipe(
            map(
              () => this.business_nameautocompletes.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.business_nameautocompletes.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.business_nameautocompletes.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.business_nameautocompletes.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbss === true) {
                this.tb_serv
                  .getbusiness_dropdown(
                    this.businessInputs.nativeElement.value,
                    this.currentpagebss + 1,
                    report_type
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessLists = this.businessLists.concat(datas);
                    if (this.businessLists.length >= 0) {
                      this.has_nextbss = datapagination.has_next;
                      this.has_previousbss = datapagination.has_previous;
                      this.currentpagebss = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  private getbusiness_search(prokeyvalue) {
    let report_type = 2;
    this.tb_serv
      .getbusiness_dropdown(prokeyvalue, 1, report_type)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessLists = datas;
      });
  }

  public displayfnbusiness_search(busineses_name?: business_list): string | undefined {
    return busineses_name ? busineses_name.name : undefined;
  }

  branchname_search() {  
    let branch_flag=2 
    let prokeyvalue: String = "";
    this.getbranchid_search(prokeyvalue);
    this.roaSearchForm
      .get("branch")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.tb_serv.getbranchdropdown(value, 1 ,branch_flag,"" ).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchLists = datas;
      });
  }

  private getbranchid_search(prokeyvalue) {
    let branch_flag=2
    this.tb_serv.getbranchdropdown(prokeyvalue, 1 ,branch_flag,"" )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchLists = datas;
      });
  }

  autocompletebranchnameScroll_search() { 
  let branch_flag=2
    this.has_nextbra = true;
    this.has_previousbra = true;
    this.currentpagebra = 1;
    setTimeout(() => {
      if (
        this.matAutocompletebrachname &&
        this.autocompleteTrigger &&
        this.matAutocompletebrachname.panel
      ) {
        fromEvent(this.matAutocompletebrachname.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletebrachname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletebrachname.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletebrachname.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletebrachname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.tb_serv
                  .getbranchdropdown(
                    this.branchContactInputs.nativeElement.value,
                    this.currentpagebra + 1   ,branch_flag,""              
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchLists = this.branchLists.concat(datas);
                    if (this.branchLists.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfnbranch_search(branch?: business_list): string | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  avg_asset_value(data){
console.log("dataevent",data)
  }

  roa_summary_clear(){
    this.roaSearchForm.reset('')
    this.Roa_manual_summary("")
  }

  roa_file_data(file_info){
    console.log("element=>",file_info.target.files[0])
    this.file_info=file_info.target.files[0]
  }

  roa_file_data_upload(roa){  
    if(roa.roa_file=='' || roa.roa_file== undefined || roa.roa_file == null){
      this.toastr.warning('','Please Choose The File',{timeOut:1500});
      return false;
    }

    const formData = new FormData();
    formData.append('file', this.file_info);
    this.SpinnerService.show()
    this.tb_serv.tb_file_roa(formData).subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data'][0]
      if(data.status=== "SUCCESS"){
      this.close_file.nativeElement.click();
      this.toastr.success('',data.Message,{timeOut:1500})
      }else{
        this.toastr.warning('',data.Message,{timeOut:1500})
      }
      
    },error=>{
      
      // this.close_file.nativeElement.click();
      this.SpinnerService.hide()
    })
  }

  clear_data(){
    this.close_file.nativeElement.click();
    this.file_info=[]
    this.roa_fileuploade.reset('')
  }

  openfile_upload(){    
    const myModalEl = document.getElementById('file_upload');
  const myModal = new (bootstrap as any).Modal(myModalEl, {
    keyboard: false,
    backdrop: 'static'
  });
  myModal.show();
  }
  openedit(){    
    var myModal = new (bootstrap as any).Modal(document.getElementById("manual_edit"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  clear_data_edit(){
    this.closepopedit.nativeElement.click();
    this.edit_form_manual.reset()
  }
}
