import { Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
// import { Router } from '@angular/router';
import { LeadsmainService } from '../leadsmain.service';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
export interface Objdatas {
  code: any
  name: any
  no: any
  id: any
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-campaign-creation',
  templateUrl: './campaign-creation.component.html',
  styleUrls: ['./campaign-creation.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI,
  { provide: imp.DateAdapter, useClass: PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,]
})
export class CampaignCreationComponent implements OnInit {
  textField: any;
  numberField: any;
  isField: any;
  isAPI: any;
  apiData : any;

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute,
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master, private prodservice: LeadsmainService,
    private notify: imp.ToastrService, private productapi: imp.ProductAPI, private datepipe: DatePipe) { }

  CampaignFormAllocation: FormGroup;
  CampaignFormAllocations: FormGroup;
  Campaign_id = new FormControl('')
  product_id = new FormControl('')
  Source_id = new FormControl('')
  @Output() submit = new EventEmitter<any>();
  isOldPage: boolean = true;
  isNewPage: boolean = false;
  dataArrays: any;
  filterValues = [{ id: 1, name: "contains" }, { id: 2, name: "exact" }]
  textValues: any;
  filteredActionIds: number[] = [];
  selectedOption4 = false;
  filtercol1 = true;
  isShowfilterCol = false;
  isCityDisplay = false;
  isStateDisplay = false;
  isShowDistrict = false;
  isShowpincode = false;
  isSourceCol = false;
  dropdownItems = [
    { id: '1', iconName: '=' },
    { id: '2', iconName: '>' },
    { id: '3', iconName: '<' },
    { id: '4', iconName: 'between' },
    { id: '5', iconName: 'contains' },
    { id: '6', iconName: 'list' }
  ];
  formValues: any[] = [];
  filteredDropdownItems: any[];




  ngOnInit(): void {
    this.CampaignFormAllocation = this.fb.group({
      campaign: '',
      city_id: '',
      district_id: '',
      state_id: '',
      pincode_id: '',
      source_id: '',
      from_date: '',
      name: '',
      to_date: ''
    })
    this.CampaignFormAllocations = this.fb.group({
      // Zname:'',
      Zfileds: '',
      Zfilter: '',
      Zvalue: '',
      Zvalue1: '',
      Zvalue2: ''
      // Znames:'',
      // Zfiledss:'',
      // Zfilters:'',
      // Zvalues:'',
    })
    // this.CampaignFormAllocations.get('Zname').setValue('System Defined Fields');
    // this.CampaignFormAllocations.get('Znames').setValue('User Defined Fields');
    this.tableheaders();

    this.CampaignFormAllocations.get('Zfileds').valueChanges.subscribe((selectedOption) => {
      this.filterActionIds(selectedOption);
    });
  }


  public showProduct: boolean = false
  CampaignObjects: any = {
    CampaignDD_List: [],
    CityList: [],
    DistrictList: [],
    StateList: [],
    PincodeList: [],
    SourceList: [],
    SelectFilterCampaign: [],
    SelectFilterCampaignHeader: [],
    ActualSelectedData: [],
    Count: 0,

  }

  //Campaign
  CampaignDD(typeddata) {
    this.service.ApiCall("get", this.productapi.ProductsAPI.campaign + '?name=' + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.CampaignDD_List = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnCampaign(Campaign?: Objdatas): string | undefined {
    return Campaign ? Campaign.code : undefined;
  }

  ///City
  CityDD(typeddata) {
    this.service.ApiCall("get", this.master.masters.City + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.CityList = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFncity_id(city_id?: Objdatas): string | undefined {
    return city_id ? city_id.name : undefined;
  }


  ///District
  DistrictDD(typeddata) {
    this.service.ApiCall("get", this.master.masters.District + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.DistrictList = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFndistrict_id(district_id?: Objdatas): string | undefined {
    return district_id ? district_id.name : undefined;
  }



  ///State
  StateDD(typeddata) {
    this.service.ApiCall("get", this.master.masters.State + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.StateList = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnstate_id(state_id?: Objdatas): string | undefined {
    return state_id ? state_id.name : undefined;
  }


  ///Pincode
  PincodeDD(typeddata) {
    this.service.ApiCall("get", this.master.masters.Pincode + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.PincodeList = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnpincode_id(pincode_id?: Objdatas): string | undefined {
    return pincode_id ? pincode_id.no : undefined;
  }


  ///Source
  SourceDD(typeddata) {
    this.service.ApiCall("get", this.master.masters.category + typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.CampaignObjects.SourceList = datas;
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnsource_id(source_id?: Objdatas): string | undefined {
    return source_id ? source_id.name : undefined;
  }


  // campaign: '',
  // city_id: '',
  // district_id: '',
  // state_id: '',
  // pincode_id: '',
  // source_id: ''

  // CampaignDD_List: [],
  // CityList: [],
  // DistrictList: [],
  // StateList: [],
  // PincodeList: [],
  // SourceList: []


  // CampaignObjects     CampaignFormAllocation
  // FromDate: this.datepipe.transform(this.CampaignFormAllocation.value.from_date,'yyyy-MM-dd'),
  // ToDate: this.datepipe.transform(this.CampaignFormAllocation.value.to_date,'yyyy-MM-dd')








  LeadCountFilter() {
    // if (this.CampaignFormAllocation.value?.from_date != '' || this.CampaignFormAllocation.value?.from_date != null || this.CampaignFormAllocation.value?.from_date != undefined) {
    //   this.CampaignFormAllocation.value.from_date = this.datepipe.transform(this.CampaignFormAllocation.value.from_date, 'yyyy-MM-dd'),
    //     this.CampaignFormAllocation.value.to_date = this.datepipe.transform(this.CampaignFormAllocation.value.to_date, 'yyyy-MM-dd')
    // }
    this.CampaignObjects.SelectFilterCampaign = []
    this.CampaignObjects.SelectFilterCampaignHeader = []
    this.CampaignObjects.ActualSelectedData = [];
    this.showProduct = false
    let obj: any = {
      camp_id: this.CampaignFormAllocation.value.campaign?.id,
      city_id: this.CampaignFormAllocation.value.city_id?.id,
      district_id: this.CampaignFormAllocation.value.district_id?.id,
      state_id: this.CampaignFormAllocation.value.state_id?.id,
      pincode_id: this.CampaignFormAllocation.value.pincode_id?.id,
      from_date: this.CampaignFormAllocation.value.from_date,
      to_date: this.CampaignFormAllocation.value.to_date,
      source_id: this.chipSelectedDistid
    }
    if ((obj.from_date != '' && obj.from_date == '') || (obj.from_date == '' && obj.from_date != '')) {
      this.notify.warning("Please select both the From Date and To Date")
      return false
    }

    if (obj.to_date != '' || obj.to_date != null || obj.to_date != undefined) {
      obj.from_date = this.datepipe.transform(obj.from_date, 'dd-MM-yyyy'),
        obj.to_date = this.datepipe.transform(obj.to_date, 'dd-MM-yyyy')
    }
    this.log.logging("Object data form", this.CampaignFormAllocation.value, obj)


    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null || obj[i] == '') {
        delete obj[i];
      }
    }
    if (JSON.stringify(obj) != '{}') {
      this.CampaignObjects.SelectFilterCampaign.push(obj)
    }

    this.service.ApiCall("post", this.productapi.ProductsAPI.campaign + '?action=count', obj)
      .subscribe(results => {

        this.log.logging("Object data results", results)
        this.CampaignObjects.Count = results.count

      })


    // this.log.logging("Object data", obj) 
  }



  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('prod') matprodAutocomplete: MatAutocomplete;
  @ViewChild('Dist') matDistAutocomplete: MatAutocomplete;
  @ViewChild('DistInput') DistInput: any;
  @ViewChild('prodInput') prodInput: any;
  prodList: Objdatas[];
  public chipSelectedprod: Objdatas[] = [];
  public chipSelectedprodid = [];
  public chipSelectedDist: Objdatas[] = [];
  public chipSelectedDistid = [];
  DistList: Objdatas[];





  getprod(keyvalue) {
    // this.service.employeesearch(keyvalue, 1, type)
    //   .subscribe((results: any[]) => { 
    //     let datas = results["data"];
    //     this.prodList = datas;
    //     console.log("emp data get ", this.prodList)
    //   }, (error) => {  
    //   })
    this.service.ApiCall('get', this.productapi.ProductsAPI.product + '?name=' + keyvalue)
      .subscribe(results => {
        this.prodList = results['data']

      })
  }





  public removedprod(prod: Objdatas) {
    const index = this.chipSelectedprod.indexOf(prod);


    if (index >= 0) {

      this.chipSelectedprod.splice(index, 1);
      console.log(this.chipSelectedprod);
      this.chipSelectedprodid.splice(index, 1);
      console.log(this.chipSelectedprodid);
      this.prodInput.nativeElement.value = '';
    }

  }



  public prodSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectprodByName(event.option.value.name);
    this.prodInput.nativeElement.value = '';
    console.log('chipSelectedprodid', this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(e => e.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.prodList.filter(e => e.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      this.chipSelectedprodid.push(foundprod[0].id)
    }
  }




  // ChooseForCount() {
  //   this.CampaignObjects.SelectFilterCampaign = []
  //   this.CampaignObjects.SelectFilterCampaignHeader = []
  //   this.CampaignObjects.ActualSelectedData = [];
  //   var name = this.chipSelectedDist.map(element => element.name).join(', ');

  //   let obj: any = {
  //     Campaign: this.CampaignFormAllocation.value.campaign?.code,
  //     City: this.CampaignFormAllocation.value.city_id?.name,
  //     District: this.CampaignFormAllocation.value.district_id?.name,
  //     State: this.CampaignFormAllocation.value.state_id?.name,
  //     Pincode: this.CampaignFormAllocation.value.pincode_id?.no,
  //     // Source: this.CampaignFormAllocation.value.source_id,
  //     FromDate: this.CampaignFormAllocation.value.from_date,
  //     ToDate: this.CampaignFormAllocation.value.to_date,
  //     Sources: name
  //   }

  //   if ((obj.FromDate != '' && obj.ToDate == '') || (obj.FromDate == '' && obj.ToDate != '')) {
  //     this.notify.warning("Please select both the From Date and To Date")
  //     return false
  //   }

  //   if (obj.ToDate != '' || obj.ToDate != null || obj.ToDate != undefined) {
  //     obj.FromDate = this.datepipe.transform(obj.FromDate, 'dd-MM-yyyy'),
  //       obj.ToDate = this.datepipe.transform(obj.ToDate, 'dd-MM-yyyy')
  //   }
  //   // let arr = []
  //   for (let i in obj) {
  //     // arr = []
  //     if (obj[i] == undefined || obj[i] == null || obj[i] == '') {
  //       delete obj[i];
  //     } else {
  //       this.CampaignObjects.SelectFilterCampaignHeader.push(i)
  //       // arr.push(obj)
  //     }
  //   }
  //   this.CampaignObjects.SelectFilterCampaign.push(obj)
  //   this.log.logging(obj)

  //   // this.service.ApiCall("post", this.productapi.ProductsAPI.campaign + '?action=count', obj)
  //   // .subscribe(results => {

  //   //   this.log.logging("Object data results", results)

  //   // })
  // }




  CampaignSubmit() {
    let obj: any = {
      campaign_name: this.CampaignFormAllocation.value.name,
      camp_id: this.CampaignFormAllocation.value.campaign?.id,
      city_id: this.CampaignFormAllocation.value.city_id?.id,
      district_id: this.CampaignFormAllocation.value.district_id?.id,
      state_id: this.CampaignFormAllocation.value.state_id?.id,
      pincode_id: this.CampaignFormAllocation.value.pincode_id?.id,
      Source: this.CampaignFormAllocation.value.source_id,
      from_date: this.CampaignFormAllocation.value.from_date,
      to_date: this.CampaignFormAllocation.value.to_date,
      product_id: this.chipSelectedprodid,
      source_id: this.chipSelectedDistid
    }

    if ((obj.FromDate != '' && obj.ToDate == '') || (obj.FromDate == '' && obj.ToDate != '')) {
      this.notify.warning("Please select both the From Date and To Date")
      return false
    }

    if (obj.ToDate != '' || obj.ToDate != null || obj.ToDate != undefined) {
      obj.FromDate = this.datepipe.transform(obj.FromDate, 'dd-MM-yyyy'),
        obj.ToDate = this.datepipe.transform(obj.ToDate, 'dd-MM-yyyy')
    }

    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null || obj[i] == '') {
        delete obj[i];
      }
    }
    this.log.logging("Final Submit Campaign Creation", obj)

    this.spin.show()
    this.service.ApiCall('post', this.productapi.ProductsAPI.campaign + '?action=campaign', obj)
      .subscribe(results => {
        this.spin.hide()
        this.notify.success('Success')
        this.submit.emit();
      })

  }


  ShowOrHideProduct() {
    if (this.showProduct == true) {
      this.showProduct = false
    } else {
      this.showProduct = true
    }

  }

  public removedDist(Dist: Objdatas) {
    const index = this.chipSelectedDist.indexOf(Dist);


    if (index >= 0) {

      this.chipSelectedDist.splice(index, 1);
      console.log(this.chipSelectedDist);
      this.chipSelectedDistid.splice(index, 1);
      console.log(this.chipSelectedDistid);
      this.DistInput.nativeElement.value = '';
    }

  }

  public DistSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectDistByName(event.option.value.name);
    this.DistInput.nativeElement.value = '';
    console.log('chipSelectedDistid', this.chipSelectedDistid)
  }
  private selectDistByName(prod) {
    let foundprod1 = this.chipSelectedDist.filter(e => e.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.DistList.filter(e => e.name == prod);
    if (foundprod.length) {
      this.chipSelectedDist.push(foundprod[0]);
      this.chipSelectedDistid.push(foundprod[0].id)
    }
  }

  getDist(keyvalues) {
    this.log.logging("controls of form field", this.Source_id)
    this.service.ApiCall('get', this.productapi.ProductsAPI.source + '?action=summary&name=' + keyvalues)
      .subscribe(results => {
        this.DistList = results['data']
      })
  }


  clearFields() {
    this.CampaignFormAllocation.reset('');
    this.CampaignFormAllocation.value.to_date = '';
    this.CampaignFormAllocation.value.from_date = '';
    this.CampaignObjects.SelectFilterCampaign = []
    this.CampaignObjects.SelectFilterCampaignHeader = []
    this.CampaignObjects.ActualSelectedData = [];
    this.chipSelectedDist = []
    this.chipSelectedDistid = []
  }

  gotoNew() {
    // this.route.navigate(['crm/newCamp']);
    this.isNewPage = true;
    this.isOldPage = false;
  }

  tableheaders() {

    // this.SpinnerService.show();
    this.prodservice.columndata().subscribe(results => {
      this.dataArrays = results['data'];
      if (results && results.data && Array.isArray(results.data)) {
        this.textValues = results.data.map(item =>
        ({
          id: item.field_id.id,
          ids: item.id,
          text: item.field_id.text
        })
        )
      }
      console.log("Data Arrays", this.textValues)
      // this.dataSource1 = new MatTableDataSource(this.dataArrays);
    })
  }

  filterActionIds(selectedOption: string) {

    switch (selectedOption) {
      case '1': // '='
        this.filteredActionIds = [1]; // Include action ID 1
        break;
      case '2': // '>'
        this.filteredActionIds = [5]; // Include action ID 5
        break;
      // Add more cases as needed
      default:
        this.filteredActionIds = []; // No action IDs
        break;
    }
  }

  onOptionChange() {
    const selectedValue = this.CampaignFormAllocations.get('Zfilter').value;
    if (selectedValue == 4) {
      this.selectedOption4 = true;
      this.filtercol1 = false;
    }
    else {
      this.selectedOption4 = false;
      this.filtercol1 = true;
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add our fruit
  //   if (value) {
  //     this.Cvalues.push({name: value});
  //   }

  //   // Clear the input value
  //   event.chipInput!.clear();
  // }

  addToChips(valu) {
    const formGroup = this.CampaignFormAllocations.get('Zfilter'); // Adjust this based on your form structure
    if (formGroup.valid) {
      this.formValues.push(valu);
      formGroup.reset(); // Clear the form control after adding to chips
    }
  }

  // Modify the onAddChip method to include all form values
  // onAddChip() {
  //   const formValue = this.CampaignFormAllocations.value;
  //   const selectedText = this.textValues.find(item => item.id === formValue.Zfileds)?.text;
  //   const selectedTexts = this.dropdownItems.find(items => items.id === formValue.Zfilter)?.iconName;

  //   // Create the form value with the matched text
  //   const mappedFormValue = {
  //     ...formValue,
  //     Zfilter : selectedTexts,
  //     Zfileds: selectedText,
  //   };

  //   this.formValues.push(mappedFormValue);
  //   this.CampaignFormAllocations.reset();
  // }

  onAddChip() {
    const formValueAllocations = this.CampaignFormAllocations.value;
    const selectedTextAllocations = this.textValues.find(item => item.id === formValueAllocations.Zfileds)?.text;
    const selectedTextsAllocations = this.dropdownItems.find(item => item.id === formValueAllocations.Zfilter)?.iconName;

    const formValueAllocation = this.CampaignFormAllocation.value; // Get values from CampaignFormAllocation
    const stateName = formValueAllocation.state_id?.name || '';
    const cityName = formValueAllocation.city_id?.name || '';
    const districtName = formValueAllocation.district_id?.name || '';
    const pincodeName = formValueAllocation.pincode_id?.name || '';
    const sourceName = formValueAllocation.source_id?.name || '';

    console.log("CUSTIM FORMS", formValueAllocation)

    // Create the form value with the matched text for both forms
    const mappedFormValue = {
      ...formValueAllocations,
      Zfilter: selectedTextsAllocations,
      Zfileds: selectedTextAllocations,
      // Include values from CampaignFormAllocation
      city_id: cityName,
      state_id: stateName,
      district_id: districtName,
      pincode_id: pincodeName,
      source:  this.chipSelectedDistid
    };

    this.formValues.push(mappedFormValue);
    this.filterApply();
    this.CampaignFormAllocations.reset();
    this.CampaignFormAllocation.reset(); // Reset CampaignFormAllocation as well
  }


  removeFromChips(value: any) {
    const index = this.formValues.indexOf(value);
    if (index !== -1) {
      this.formValues.splice(index, 1);
    }
  }

  onSelectChange() {
    // const selectedValues = this.CampaignFormAllocations.get('Zfileds').value;
    // console.log("daras", selectedValues )

    // this.prodservice.columndata().subscribe(results => {
    //   this.dataArrays = results['data'];
    //   let txt = this.textValues[selectedValues]
    //   console.log("TEXT  Particular", txt)
    //   let dataPart = this.dataArrays[txt.ids];
    //   console.log("Data Particular", dataPart)
    // })

    const selectedOption = this.textValues.find(item => item.id === this.CampaignFormAllocations.get('Zfileds').value);
    console.log("Selected Option", selectedOption)
    if (selectedOption) {
      if (selectedOption.ids) {
        this.textField = this.dataArrays.find(item => item.id === selectedOption.ids && item.field_type.text === "Text");
        this.numberField = this.dataArrays.find(item => item.id === selectedOption.ids && item.field_type.text === "Number");
        if (this.textField) {
          // this.shouldHide();
          this.filteredDropdownItems = this.dropdownItems.filter(item => ['1', '5', '6'].includes(item.id));

        }
        if (this.numberField) {
          this.filteredDropdownItems = this.dropdownItems.filter(item => ['1', '2', '3', '4'].includes(item.id));
        }
      }
    }

    if (selectedOption) {
      if (selectedOption.ids) {
        // Check if the calling_type.text field is "Field"
        this.isField = this.dataArrays.find(item => item.id === selectedOption.ids && item.calling_type.text === "Field");

        // Check if the calling_type.text field is "API"
        this.isAPI = this.dataArrays.find(item => item.id === selectedOption.ids && item.calling_type.text === "API");

        // Now you can use isField and isAPI to determine the calling type
        if (this.isField) {
          console.log("Selected option has calling_type.text field equal to 'Field'");
          this.isShowfilterCol = true;
          this.isCityDisplay = false;
          this.isStateDisplay = false;
          this.isShowDistrict = false;
          this.isShowpincode = false;
          this.isSourceCol = false;

        } else if (this.isAPI) {
          console.log("Selected option has calling_type.text field equal to 'API'");
          this.isShowfilterCol = false;
          if (selectedOption.text == 'City') {
            this.isCityDisplay = true;
            this.isStateDisplay = false;
            this.isShowDistrict = false;
            this.isShowpincode = false;
            this.isSourceCol = false;
          }
          else if (selectedOption.text == 'State') {
            this.isCityDisplay = false;
            this.isStateDisplay = true;
            this.isShowDistrict = false;
            this.isShowpincode = false;
            this.isSourceCol = false;
          }
          else if (selectedOption.text == 'District') {
            this.isCityDisplay = false;
            this.isStateDisplay = false;
            this.isShowDistrict = true;
            this.isShowpincode = false;
            this.isSourceCol = false;
          }
          // else if(selectedOption.text == 'District')
          // {
          //   this.isCityDisplay = false;
          //   this.isStateDisplay = false;
          //   this.isShowDistrict = true;
          //   this.isShowpincode = false;
          //   this.isSourceCol = false;
          // } 
          else if (selectedOption.text == 'Pincode') {
            this.isCityDisplay = false;
            this.isStateDisplay = false;
            this.isShowDistrict = false;
            this.isShowpincode = true;
            this.isSourceCol = false;
          }
          else if (selectedOption.text == 'Source') {
            this.isCityDisplay = false;
            this.isStateDisplay = false;
            this.isShowDistrict = false;
            this.isShowpincode = false;
            this.isSourceCol = true;
          }
        }
      }
    }
  }

  filterApply() {
    const formValueAllocations = this.CampaignFormAllocations.value;

    if(this.isAPI)
  {
    let formValueAllocat = this.CampaignFormAllocation.value
    const districtSelect = formValueAllocat.district_id?.id
    const stateSelect = formValueAllocat.state_id?.id || '';
    const citySelect = formValueAllocat.city_id?.id || '';
    // const districtName = formValueAllocat.district_id?.name || '';
    const pincodeSelect = formValueAllocat.pincode_id?.id || '';
    const sourceName = formValueAllocat.source_id?.name || '';
    if(districtSelect)
    {
    this.apiData = [{
      "action": 6, "field_id": formValueAllocations.Zfileds, "label_type":2, "values": [districtSelect]
    }]
    }
    else if(stateSelect)
    {
      this.apiData = [{
        "action": 6, "field_id": formValueAllocations.Zfileds, "label_type":2, "values": [stateSelect]
      }]
    }
    else if(citySelect)
    {
      this.apiData = [{
        "action": 6, "field_id": formValueAllocations.Zfileds, "label_type":2, "values": [citySelect]
      }]
    }
    else if(pincodeSelect)
    {
      this.apiData = [{
        "action": 6, "field_id": formValueAllocations.Zfileds, "label_type":2, "values": [pincodeSelect]
      }]
    }
    else
    {
      this.apiData = [{
        "action": 6, "field_id": formValueAllocations.Zfileds, "label_type":2, "values": this.chipSelectedDistid
      }]
    }
    
    let payloads = { filter : this.apiData}

    this.prodservice.getFilterCount(payloads).subscribe(results => {
      this.CampaignObjects.SelectFilterCampaign.push(this.apiData)
      this.CampaignObjects.Count = results.count
    })
  }
    else if (this.textField) {
     this.apiData = [{
        "action": Number(formValueAllocations.Zfilter), "field_id": formValueAllocations.Zfileds, "label_type":2, "values": formValueAllocations.Zvalue
      }]
      let payloads = { filter : this.apiData}
    
    this.prodservice.getFilterCount(payloads).subscribe(results => {
      this.CampaignObjects.SelectFilterCampaign.push(this.apiData)
      this.CampaignObjects.Count = results.count
    })
  }
  else{
    this.apiData = [{
      "action": Number(formValueAllocations.Zfilter), "field_id": formValueAllocations.Zfileds, "label_type":1, "values": formValueAllocations.Zvalue
    }]
    let payloads = { filter : this.apiData}
  
  this.prodservice.getFilterCount(payloads).subscribe(results => {
    this.CampaignObjects.SelectFilterCampaign.push(this.apiData)
    this.CampaignObjects.Count = results.count
  })

  }
  

  }

  shouldHide(item: any): boolean {

    return item.id === '1' || item.id === '5' || item.id === '6';
  }

  CampaignSubmitNew()
  {
    // let newData = this.apiData
    let payload = {
      campaign_name  : this.CampaignFormAllocation.value.name,
      product_id : this.chipSelectedprodid,
      filter: this.apiData
    }
 
    // newData.push({
    //   "name": this.CampaignFormAllocation.value.name,
    //   "product_id": this.chipSelectedprodid
    // });
    // Get the index of the object you want to modify
// const indexToUpdate = 0; // Change this to the desired index if needed

// Update the object at the specified index
    // newData[indexToUpdate].name = this.CampaignFormAllocation.value.name;
    // newData[indexToUpdate].product_id = this.chipSelectedprodid;

    // let payload = [
    //   {
    //     this.apiD
    //   }
    // ]
    
    this.prodservice.startCampaign(payload).subscribe(results => {
      if(results)
      {
        this.notify.show('Campaign Created Successfully')
      }
    
      // this.CampaignObjects.SelectFilterCampaign.push(this.apiData)
      // this.CampaignObjects.Count = results.count
    })
  }











}
