import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { SharedService } from "../../service/shared.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { DtpcService } from "../dtpc.service";
import { NgxSpinnerService } from "ngx-spinner";
import { fromEvent, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";

export interface ApplicationClass {
  id: number;
  ApplNo: string;
}
export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}
@Component({
  selector: "app-los-log-summary",
  templateUrl: "./los-log-summary.component.html",
  styleUrls: ["./los-log-summary.component.scss"],
})


export class LosLogSummaryComponent implements OnInit {
  losSummaryForm: FormGroup;
  los_summary_data: any;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isLosSummaryPagination: boolean;
  pageNumber: any = 1;
  lospagesize = 10;
  payload: any = {};
  isLoading = false;
  applno: any;
  Raiserlist: any;
  errorHandler: any;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('raiserInput') raiserInput: any;

  constructor(
    private fb: FormBuilder,
    private DtpcService: DtpcService,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.losSummaryForm = this.fb.group({
      raiser_id: [""],
      application_no: [""],
      from_date: [""],
      to_date: [""],
    });
    this.getSummary();
     let search_applno: String = "";
     this.Summaryapplication(search_applno);
     this.losSummaryForm.get('application_no').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false;
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.applno = datas;
          })
  }

  search(val) {}

  reset() {
    this.losSummaryForm.reset();
    this.losSummaryForm.patchValue({
      raiser_id: "",
      application_no: "",
      from_date: "",
      to_date: "",
    });
    this.pageNumber = 1;
    this.payload = {};
    this.getSummary();
  }

  getSummary() {
    this.los_summary_data = [];
    this.SpinnerService.show();

    // let payload = {}
    this.DtpcService.getLogSummary(this.pageNumber, this.payload).subscribe(
      (results) => {
        this.SpinnerService.hide();
        //let single_data={"data":results}
        // console.log(results)
        this.los_summary_data = results["data"];
        let dataPagination = results["pagination"];
        if (this.los_summary_data.length > 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isLosSummaryPagination = true;
        }
        if (this.los_summary_data.length === 0) {
          this.isLosSummaryPagination = false;
        }
      },
      (error) => {
        this.SpinnerService.hide();
        let errorMessage = error.statusText;
        // console.log("Erorr" + errorMessage);
        return Observable.throw(error);
      }
    );
  }
  nextClicklos() {
    if (this.has_next == true) {
      // this.search(this.presentpage + 1)
      this.pageNumber = this.pageNumber + 1;
      this.getSummary();
    }
  }
  previousClicklos() {
    if (this.has_previous == true) {
      // this.search(this.lossort,this.lospresentpage - 1)
      this.pageNumber = this.pageNumber - 1;
      this.getSummary();
    }
  }

  searchLogSummary() {
    this.pageNumber = 1;
    this.payload = {
      raiser_id: this.losSummaryForm.value.raiser_id?.id,
      application_no: this.losSummaryForm.value.application_no?.ApplNo,
      from_date: this.dateformatter(this.losSummaryForm.value.from_date),
      to_date: this.dateformatter(this.losSummaryForm.value.to_date),
    };
    this.getSummary();
  }

  dateformatter(date: any): string {
    if (date) {
      const d = new Date(date);
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2); // Months are zero-based
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return "";
  }
  exceldownload() {
    this.payload = {
      raiser_id: this.losSummaryForm.value.raiser_id?.id,
      application_no: this.losSummaryForm.value.application_no?.ApplNo ,
      from_date: this.dateformatter(this.losSummaryForm.value.from_date),
      to_date: this.dateformatter(this.losSummaryForm.value.to_date),
    };
    this.DtpcService.downloadLogSummary(this.payload).subscribe((data) => {
      let binaryData = [];
      binaryData.push(data);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "LOS LOG Summary Report" + ".xlsx";
      link.click();
    });
  }
   public displayFn(ApplicationClass?: ApplicationClass): string | undefined {
      // this.validate_application_fun(ApplicationClass)
      return ApplicationClass ? ApplicationClass.ApplNo : undefined;
    }
      Summaryapplication(search_applno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_dropdownLOS(search_applno, 1)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let applnovar = result['data'];
        this.applno = applnovar;
        console.log(this.applno)
      })
  }
   getrm(rmkeyvalue) {
    this.DtpcService.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide()
      })
  }
   getraiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.losSummaryForm.get('raiser_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.DtpcService.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })



  }

    public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
      return raisertyperole ? raisertyperole.full_name : undefined;
    }
    raiserScroll() {
        setTimeout(() => {
          if (
            this.matraiserAutocomplete &&
            this.matraiserAutocomplete &&
            this.matraiserAutocomplete.panel
          ) {
            fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.DtpcService.getrmscroll(this.raiserInput.nativeElement.value, this.presentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.Raiserlist.length >= 0) {
                          this.Raiserlist = this.Raiserlist.concat(datas);
                          this.has_next = datapagination.has_next;
                          this.has_previous = datapagination.has_previous;
                          this.presentpage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
  
}
